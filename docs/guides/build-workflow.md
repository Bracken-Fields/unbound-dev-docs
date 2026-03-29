---
id: build-workflow
title: Build an Automation Workflow
---

# Build an Automation Workflow

Workflows are directed graphs — items connected by ports. This guide walks through
building production-grade automation flows from scratch: creating versions, wiring
items together, running sessions, and safely promoting changes to production.

---

## Concepts

Before building, understand the three moving parts:

| Concept | Description |
|---|---|
| **Workflow** | A named automation (e.g., "SMS Triage"). Has one or more versions. |
| **Workflow Version** | A specific immutable snapshot. Versions are drafted, tested, then activated. |
| **Workflow Item** | A single step — trigger, action, condition, AI call, integration, etc. |
| **Connection** | A wire from one item's output port to another item's input port. |
| **Session** | A single live execution of a workflow version. |

### Item Categories

| Category | Examples |
|---|---|
| `flow` | `trigger`, `condition`, `delay`, `loop` |
| `communication` | `sendSms`, `sendEmail`, `makeCall` |
| `ai` | `aiChat`, `aiExtract`, `aiClassify` |
| `routing` | `routeToQueue`, `routeToAgent`, `setSkills` |
| `integration` | `webhook`, `crm`, `zapier` |
| `data` | `queryObjects`, `createObject`, `updateObject` |

---

## Step 0: Set Up

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: 'your-namespace',
    token: process.env.UNBOUND_TOKEN,
});
```

---

## Example 1 — Inbound SMS Triage

Route incoming SMS to an agent queue or send an auto-reply, depending on AI
classification.

```
[Trigger: SMS Received]
         ↓
[AI: Classify Intent]
         ↓
    ┌────┴────────┐
[Route to Queue]  [Auto-Reply]
```

### Step 1: Create a Workflow Version

Workflow versions are the unit of deployment. Create a draft, build it out, then
activate it when ready.

```javascript
// Create a new workflow version for an existing workflow
// (workflowVersionId comes from your Unbound admin console or a prior API call)
const workflowVersionId = 'wfv-abc123';   // replace with your version ID
```

If you need to create the version object itself, use the objects API:

```javascript
const version = await api.objects.create({
    object: 'workflowVersions',
    data: {
        workflowId: 'wf-xyz789',
        name: 'v1.0 — SMS Triage',
        status: 'draft',
    },
});

const workflowVersionId = version.id;
```

### Step 2: Add the Trigger

Every workflow starts with a trigger item:

```javascript
const trigger = await api.workflows.items.create({
    workflowVersionId,
    category: 'flow',
    type: 'trigger',
    settings: {
        event: 'message.received',
        channel: 'sms',
    },
    description: 'New inbound SMS',
    position: { x: 400, y: 50 },
});
```

### Step 3: Add an AI Classification Step

```javascript
const classify = await api.workflows.items.create({
    workflowVersionId,
    category: 'ai',
    type: 'aiChat',
    settings: {
        instructions: [
            'Classify this SMS into exactly ONE of these categories:',
            '  - support: billing, account, or technical issue',
            '  - sales: pricing, demo, or new product inquiry',
            '  - spam: unsolicited or irrelevant message',
            'Reply with one word only.',
        ].join('\n'),
        model: 'gpt-4o',
        inputVariable: '{{trigger.body}}',
        outputVariable: 'intent',
    },
    description: 'Classify SMS intent',
    position: { x: 400, y: 200 },
});
```

### Step 4: Add Action Items

```javascript
// Route to support queue
const routeToSupport = await api.workflows.items.create({
    workflowVersionId,
    category: 'routing',
    type: 'routeToQueue',
    settings: {
        queueId: 'queue-support-id',
        priority: 5,
    },
    description: 'Route to support queue',
    position: { x: 200, y: 380 },
});

// Route to sales queue
const routeToSales = await api.workflows.items.create({
    workflowVersionId,
    category: 'routing',
    type: 'routeToQueue',
    settings: {
        queueId: 'queue-sales-id',
        priority: 3,
    },
    description: 'Route to sales queue',
    position: { x: 400, y: 380 },
});

// Auto-reply for spam
const replySpam = await api.workflows.items.create({
    workflowVersionId,
    category: 'communication',
    type: 'sendSms',
    settings: {
        from: '{{trigger.to}}',
        to: '{{trigger.from}}',
        message: 'Thanks — we\'ve received your message.',
    },
    description: 'Acknowledge spam / unroutable',
    position: { x: 600, y: 380 },
});
```

### Step 5: Wire the Items Together

```javascript
// Trigger → AI classify
await api.workflows.connections.create({
    workflowItemId: trigger.id,
    workflowItemPortId: 'output',
    inWorkflowItemId: classify.id,
    inWorkflowItemPortId: 'input',
});

// AI classify → Route to support (when intent == 'support')
await api.workflows.connections.create({
    workflowItemId: classify.id,
    workflowItemPortId: 'output-support',
    inWorkflowItemId: routeToSupport.id,
    inWorkflowItemPortId: 'input',
});

// AI classify → Route to sales (when intent == 'sales')
await api.workflows.connections.create({
    workflowItemId: classify.id,
    workflowItemPortId: 'output-sales',
    inWorkflowItemId: routeToSales.id,
    inWorkflowItemPortId: 'input',
});

// AI classify → Auto-reply (when intent == 'spam' or unmatched)
await api.workflows.connections.create({
    workflowItemId: classify.id,
    workflowItemPortId: 'output-spam',
    inWorkflowItemId: replySpam.id,
    inWorkflowItemPortId: 'input',
});
```

### Step 6: Activate the Version

Once the graph is built and tested, promote it to active:

```javascript
// Publish the draft
await api.objects.updateById({
    object: 'workflowVersions',
    id: workflowVersionId,
    update: { status: 'published' },
});

// Activate it as the current version for this workflow
await api.objects.updateById({
    object: 'workflowVersions',
    id: workflowVersionId,
    update: { status: 'active' },
});
```

---

## Example 2 — Outbound Appointment Reminder Campaign

Send a personalized SMS reminder 24 hours before an appointment. If the customer
replies "CANCEL", update the appointment and notify the agent.

```
[Session Trigger]
       ↓
[Query: Get Appointment]
       ↓
[Send SMS Reminder]
       ↓
[Wait: 24h]
       ↓
[Check Reply]
    ↓      ↓
[Mark      [Notify
Confirmed] Agent]
```

```javascript
async function buildReminderWorkflow(workflowVersionId) {
    // 1. Trigger (on-demand session, no inbound event)
    const trigger = await api.workflows.items.create({
        workflowVersionId,
        category: 'flow',
        type: 'trigger',
        settings: { event: 'session.started' },
        description: 'On-demand reminder trigger',
        position: { x: 400, y: 50 },
    });

    // 2. Query appointment details
    const queryAppointment = await api.workflows.items.create({
        workflowVersionId,
        category: 'data',
        type: 'queryObjects',
        settings: {
            object: 'appointments',
            where: { id: '{{session.appointmentId}}' },
            limit: 1,
            outputVariable: 'appointment',
        },
        description: 'Load appointment record',
        position: { x: 400, y: 200 },
    });

    // 3. Send SMS reminder
    const sendReminder = await api.workflows.items.create({
        workflowVersionId,
        category: 'communication',
        type: 'sendSms',
        settings: {
            from: '+18005550001',
            to: '{{appointment.phone}}',
            message: [
                'Hi {{appointment.firstName}}, just a reminder that you have an appointment',
                'on {{appointment.date}} at {{appointment.time}}.',
                'Reply CONFIRM to confirm or CANCEL to cancel.',
            ].join(' '),
        },
        description: 'Send appointment reminder',
        position: { x: 400, y: 350 },
    });

    // 4. Wire: trigger → query → send
    await api.workflows.connections.create({
        workflowItemId: trigger.id,
        workflowItemPortId: 'output',
        inWorkflowItemId: queryAppointment.id,
        inWorkflowItemPortId: 'input',
    });

    await api.workflows.connections.create({
        workflowItemId: queryAppointment.id,
        workflowItemPortId: 'output',
        inWorkflowItemId: sendReminder.id,
        inWorkflowItemPortId: 'input',
    });

    return { trigger, queryAppointment, sendReminder };
}
```

### Triggering the Workflow for Each Appointment

```javascript
// Called from your scheduling system, cron job, or appointment creation webhook
async function sendAppointmentReminder(appointmentId) {
    const session = await api.workflows.sessions.create(workflowVersionId, {
        appointmentId,   // passed as {{session.appointmentId}} in the workflow
    });

    console.log('Reminder session started:', session.id);
    return session.id;
}
```

---

## Example 3 — Inbound Call IVR

A caller dials in → hears a menu → presses a digit → routes to the right queue.

```javascript
async function buildCallIvr(workflowVersionId) {
    const positions = {
        trigger:   { x: 400, y: 50 },
        greet:     { x: 400, y: 200 },
        menuInput: { x: 400, y: 350 },
        support:   { x: 200, y: 500 },
        sales:     { x: 400, y: 500 },
        billing:   { x: 600, y: 500 },
    };

    // Inbound call trigger
    const trigger = await api.workflows.items.create({
        workflowVersionId,
        category: 'flow',
        type: 'trigger',
        settings: { event: 'call.inbound' },
        description: 'Inbound call arrives',
        position: positions.trigger,
    });

    // Play greeting and collect digit input
    const menuInput = await api.workflows.items.create({
        workflowVersionId,
        category: 'communication',
        type: 'gather',
        settings: {
            tts: 'Thank you for calling Acme Corp. Press 1 for support, 2 for sales, or 3 for billing.',
            timeout: 5,
            numDigits: 1,
            outputVariable: 'digit',
        },
        description: 'IVR main menu',
        position: positions.menuInput,
    });

    // Route to support
    const support = await api.workflows.items.create({
        workflowVersionId,
        category: 'routing',
        type: 'routeToQueue',
        settings: { queueId: 'queue-support-id' },
        description: 'Support queue',
        position: positions.support,
    });

    // Route to sales
    const sales = await api.workflows.items.create({
        workflowVersionId,
        category: 'routing',
        type: 'routeToQueue',
        settings: { queueId: 'queue-sales-id' },
        description: 'Sales queue',
        position: positions.sales,
    });

    // Route to billing
    const billing = await api.workflows.items.create({
        workflowVersionId,
        category: 'routing',
        type: 'routeToQueue',
        settings: { queueId: 'queue-billing-id' },
        description: 'Billing queue',
        position: positions.billing,
    });

    // Wire: trigger → menu
    await api.workflows.connections.create({
        workflowItemId: trigger.id,
        workflowItemPortId: 'output',
        inWorkflowItemId: menuInput.id,
        inWorkflowItemPortId: 'input',
    });

    // Wire: menu → support (digit 1)
    await api.workflows.connections.create({
        workflowItemId: menuInput.id,
        workflowItemPortId: 'output-1',
        inWorkflowItemId: support.id,
        inWorkflowItemPortId: 'input',
    });

    // Wire: menu → sales (digit 2)
    await api.workflows.connections.create({
        workflowItemId: menuInput.id,
        workflowItemPortId: 'output-2',
        inWorkflowItemId: sales.id,
        inWorkflowItemPortId: 'input',
    });

    // Wire: menu → billing (digit 3)
    await api.workflows.connections.create({
        workflowItemId: menuInput.id,
        workflowItemPortId: 'output-3',
        inWorkflowItemId: billing.id,
        inWorkflowItemPortId: 'input',
    });

    return { trigger, menuInput, support, sales, billing };
}
```

---

## Working with Workflow Sessions

Sessions are live executions. Use them to inject data, monitor progress, and clean
up when done.

### Start a Session

```javascript
// Trigger a workflow on demand, passing context variables
const session = await api.workflows.sessions.create(workflowVersionId, {
    contactId: 'contact-abc123',
    appointmentId: 'appt-xyz789',
    locale: 'en-US',
});

console.log('Session ID:', session.id);
console.log('Status:', session.status);   // 'running', 'completed', 'failed'
```

### Poll Until Completed

```javascript
async function waitForSession(sessionId, { pollMs = 2000, timeoutMs = 60000 } = {}) {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        const session = await api.workflows.sessions.get(sessionId);

        if (session.status === 'completed') {
            return session;
        }

        if (session.status === 'failed') {
            throw new Error(`Workflow session ${sessionId} failed: ${session.error}`);
        }

        await new Promise(resolve => setTimeout(resolve, pollMs));
    }

    throw new Error(`Workflow session ${sessionId} timed out after ${timeoutMs}ms`);
}

// Usage
const sessionId = (await api.workflows.sessions.create(workflowVersionId, {
    appointmentId: 'appt-xyz789',
})).id;

const completed = await waitForSession(sessionId);
console.log('Output variables:', completed.variables);
```

### Inject Variables Mid-Execution

Long-running workflows (e.g., awaiting a customer reply) can receive data updates:

```javascript
// Customer replied to the SMS — inject their response into the running session
await api.workflows.sessions.update(sessionId, {
    customerReply: 'CONFIRM',
    replyTimestamp: new Date().toISOString(),
});
```

### Complete a Session Explicitly

For workflows that pause and wait for external input, complete them when done:

```javascript
await api.workflows.sessions.complete(sessionId);
```

### Delete a Session

Remove a session and its associated data (useful in tests or cleanup jobs):

```javascript
await api.workflows.sessions.delete(sessionId);
```

---

## Safe Version Promotion

Always test new workflow logic in a draft version before cutting over production
traffic.

### Full Promotion Flow

```javascript
async function promoteWorkflowVersion({ workflowId, oldVersionId, newVersionId }) {
    // 1. Verify the new version builds without errors by running a test session
    let testSession;
    try {
        testSession = await api.workflows.sessions.create(newVersionId, {
            _test: true,
        });
        await waitForSession(testSession.id, { timeoutMs: 30000 });
        console.log('Test session passed');
    } catch (err) {
        console.error('Test session failed — aborting promotion:', err.message);
        throw err;
    } finally {
        if (testSession) {
            await api.workflows.sessions.delete(testSession.id).catch(() => {});
        }
    }

    // 2. Mark the old version as archived
    if (oldVersionId) {
        await api.objects.updateById({
            object: 'workflowVersions',
            id: oldVersionId,
            update: { status: 'archived' },
        });
        console.log('Archived old version:', oldVersionId);
    }

    // 3. Activate the new version
    await api.objects.updateById({
        object: 'workflowVersions',
        id: newVersionId,
        update: { status: 'active' },
    });

    console.log('Activated new version:', newVersionId);
    return newVersionId;
}
```

### Fork an Existing Version for Edits

To edit a live workflow without touching production, fork the active version:

```javascript
async function forkVersion(existingVersionId, newVersionName) {
    // Get the existing version's items and connections
    const items = await api.workflows.items.list(existingVersionId);

    // Create the new version
    const newVersion = await api.objects.create({
        object: 'workflowVersions',
        data: {
            name: newVersionName,
            status: 'draft',
            forkedFrom: existingVersionId,
        },
    });

    // Clone items
    const itemIdMap = {};
    for (const item of items.data) {
        const cloned = await api.workflows.items.create({
            workflowVersionId: newVersion.id,
            category: item.category,
            type: item.type,
            settings: item.settings,
            description: item.description,
            position: item.position,
        });
        itemIdMap[item.id] = cloned.id;
    }

    // Clone connections (re-mapping item IDs)
    for (const item of items.data) {
        for (const conn of (item.connections || [])) {
            await api.workflows.connections.create({
                workflowItemId: itemIdMap[conn.workflowItemId],
                workflowItemPortId: conn.workflowItemPortId,
                inWorkflowItemId: itemIdMap[conn.inWorkflowItemId],
                inWorkflowItemPortId: conn.inWorkflowItemPortId,
            });
        }
    }

    return newVersion.id;
}
```

---

## Updating an Existing Item

Modify a step's settings without rebuilding the entire graph:

```javascript
// Update the AI model used in a classification step
await api.workflows.items.update({
    id: classify.id,
    settings: {
        ...classify.settings,
        model: 'gpt-4o-mini',   // swap to a faster/cheaper model
    },
    description: 'Classify SMS intent (optimized)',
});
```

Fields you can update on any item:

| Field | Description |
|---|---|
| `settings` | Step configuration object |
| `description` | Human-readable label |
| `label` | Display label in the visual editor |
| `position` | `{ x, y }` position in the graph |
| `ports` | Custom port definitions |
| `icon` | Icon identifier |
| `labelBgColor` / `labelTextColor` | Visual styling |
| `iconBgColor` / `iconTextColor` | Icon styling |

---

## Getting Workflow Module Types

Query the list of available item types and their configuration schemas:

```javascript
// All available workflow modules
const modules = await api.workflows.listModules();
console.log(modules);
// [
//   { category: 'communication', type: 'sendSms', ... },
//   { category: 'ai',            type: 'aiChat',   ... },
//   ...
// ]

// Settings schema for a specific item type
const smsSettings = await api.workflows.getSettings('sendSms');
console.log(smsSettings);
// { fields: [...], ports: { input: [...], output: [...] } }
```

Use `getSettings` to discover required fields and available output ports before
creating items programmatically.

---

## Error Handling

Wrap workflow builds in try/catch and clean up partial graphs on failure:

```javascript
async function buildWorkflowSafely(workflowVersionId) {
    const createdItems = [];

    async function createItem(opts) {
        const item = await api.workflows.items.create(opts);
        createdItems.push(item.id);
        return item;
    }

    try {
        const trigger = await createItem({
            workflowVersionId,
            category: 'flow',
            type: 'trigger',
            settings: { event: 'message.received', channel: 'sms' },
            position: { x: 400, y: 50 },
        });

        const classify = await createItem({
            workflowVersionId,
            category: 'ai',
            type: 'aiChat',
            settings: {
                instructions: 'Classify intent as: support, sales, or spam.',
                model: 'gpt-4o',
            },
            position: { x: 400, y: 200 },
        });

        await api.workflows.connections.create({
            workflowItemId: trigger.id,
            workflowItemPortId: 'output',
            inWorkflowItemId: classify.id,
            inWorkflowItemPortId: 'input',
        });

        return { trigger, classify };

    } catch (err) {
        // Clean up any partially-created items
        console.error('Workflow build failed, rolling back:', err.message);
        for (const id of createdItems) {
            await api.workflows.items.delete(id).catch(() => {});
        }
        throw err;
    }
}
```

---

## Common Mistakes

**1. Connecting non-existent ports**

Every `workflowItemPortId` must match a port defined by the item's type. Check
available ports with `api.workflows.getSettings(type)` before connecting.

**2. Activating without testing**

Always run at least one test session against a new version before promoting it.
Even simple graph errors (a dangling item with no input) can silently fail.

**3. Mutating an active version**

Items on an `active` version cannot safely be edited while live traffic is flowing
through them. Fork the version, edit the fork, then promote.

**4. Skipping session cleanup**

Test sessions consume resources. Call `sessions.delete()` after automated tests,
or your namespace may accumulate stale sessions.

---

## What's Next

- [Workflows API Reference](/api-reference/workflows) — all methods, connection rules, session lifecycle
- [AI Services](/api-reference/ai) — generative chat, classification, extraction
- [Task Router Quickstart](/guides/task-router-quickstart) — route inbound contacts to agents
- [Subscriptions](/api-reference/subscriptions) — listen for workflow events in real time
- [UOQL Reference](/api-reference/uoql) — query contact and CDR data inside workflow conditions
