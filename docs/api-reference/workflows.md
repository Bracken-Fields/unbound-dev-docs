---
id: workflows
title: Workflows
---

# Workflows

`api.workflows` — Build, modify, and execute automation workflows programmatically. Workflows are directed graphs of items connected by ports.

---

## Overview

A workflow is composed of:
- **Items** — individual steps (actions, conditions, integrations)
- **Connections** — wires between item output ports and input ports
- **Sessions** — runtime executions of a workflow version

---

## Workflow Items

### `workflows.items.create(options)`

```javascript
const item = await api.workflows.items.create({
  workflowVersionId: 'wf-version-id',
  category: 'communication',
  type: 'sendSms',
  settings: {
    from: '+18005551234',
    messageTemplate: 'appointment-reminder',
  },
  description: 'Send appointment reminder SMS',
  position: { x: 200, y: 150 },
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `workflowVersionId` | string | ✅ | Workflow version this item belongs to |
| `category` | string | ✅ | Item category (see table below) |
| `type` | string | ✅ | Item type within the category |
| `settings` | object | — | Item-specific configuration |
| `description` | string | — | Human-readable step description |
| `position` | object | — | `{ x, y }` canvas position |

### Item Categories & Types

| Category | Example Types |
|---|---|
| `flow` | `trigger`, `branch`, `loop`, `wait`, `end` |
| `communication` | `sendSms`, `sendEmail`, `makeCall`, `sendVoicemail` |
| `routing` | `routeToAgent`, `routeToQueue`, `routeByCondition` |
| `ai` | `aiChat`, `aiTts`, `aiStt`, `aiPlaybook`, `aiExtract` |
| `data` | `createObject`, `updateObject`, `queryObjects`, `deleteObject` |
| `integration` | `webhook`, `httpRequest`, `customCode` |
| `taskRouter` | `createTask`, `completeTask` |

### `workflows.items.update(options)`

```javascript
await api.workflows.items.update({
  id: 'item-id',
  settings: { messageTemplate: 'new-template' },
  position: { x: 300, y: 200 },
  label: 'Send Reminder',
  labelBgColor: '#1D949A',
  labelTextColor: '#ffffff',
});
```

### `workflows.items.get(id)` / `workflows.items.list(workflowVersionId)`

```javascript
const item = await api.workflows.items.get('item-id');
const items = await api.workflows.items.list('wf-version-id');
```

### `workflows.items.delete(id)`

```javascript
await api.workflows.items.delete('item-id');
```

---

## Connections

Connections wire item output ports to other items' input ports.

### `workflows.connections.create(options)`

```javascript
await api.workflows.connections.create({
  workflowItemId: 'item-1-id',
  workflowItemPortId: 'output',          // source port name
  inWorkflowItemId: 'item-2-id',
  inWorkflowItemPortId: 'input',         // destination port name
});
```

For conditional branches, port names vary by item type (e.g., `output-yes`, `output-no`, `output-default`).

### `workflows.connections.delete(...)`

```javascript
await api.workflows.connections.delete(
  workflowItemId,
  workflowItemPortId,
  inWorkflowItemId,
  inWorkflowItemPortId,
);
```

---

## Workflow Settings & Modules

```javascript
// Get workflow-level settings
const settings = await api.workflows.getSettings('voice');  // or 'sms', 'email', etc.

// List all available workflow modules
const modules = await api.workflows.listModules();
```

---

## Workflow Sessions

Sessions are runtime executions of a workflow. Use them to run a workflow on demand, track its progress, and update execution state.

### `workflows.sessions.create(workflowVersionId, sessionData?)`

```javascript
const session = await api.workflows.sessions.create('wf-version-id', {
  contactId: 'contact-id',
  channel: 'sms',
  input: { phoneNumber: '+12135550100' },
});
console.log(session.id);
```

### `workflows.sessions.get(sessionId)`

```javascript
const session = await api.workflows.sessions.get('session-id');
// session.status → 'running' | 'paused' | 'completed' | 'failed'
```

### `workflows.sessions.update(sessionId, updateData)`

Update session state mid-execution (e.g., pass input collected from a caller):

```javascript
await api.workflows.sessions.update('session-id', {
  variables: {
    accountNumber: '123456',
    verifiedIdentity: true,
  },
});
```

### `workflows.sessions.complete(sessionId)`

Force-complete a running session.

```javascript
await api.workflows.sessions.complete('session-id');
```

### `workflows.sessions.delete(sessionId)`

Delete a session record.

```javascript
await api.workflows.sessions.delete('session-id');
```

---

## Complete Example

Build an SMS triage workflow: receive → AI classify → route or auto-reply.

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: 'your-jwt' });

const versionId = 'your-workflow-version-id';

// 1. Trigger: SMS received
const trigger = await api.workflows.items.create({
  workflowVersionId: versionId,
  category: 'flow',
  type: 'trigger',
  settings: { event: 'message.received', channel: 'sms' },
  position: { x: 100, y: 50 },
});

// 2. AI classification
const classify = await api.workflows.items.create({
  workflowVersionId: versionId,
  category: 'ai',
  type: 'aiChat',
  settings: {
    instructions: 'Reply with exactly one word: support, sales, or spam',
    model: 'gpt-4',
  },
  position: { x: 100, y: 200 },
});

// 3a. Route to queue (support/sales)
const route = await api.workflows.items.create({
  workflowVersionId: versionId,
  category: 'routing',
  type: 'routeToQueue',
  settings: { queueId: 'support-queue-id' },
  position: { x: 0, y: 350 },
});

// 3b. Auto-reply (spam)
const reject = await api.workflows.items.create({
  workflowVersionId: versionId,
  category: 'communication',
  type: 'sendSms',
  settings: { message: 'Thanks for reaching out!' },
  position: { x: 250, y: 350 },
});

// Wire it together
await api.workflows.connections.create({
  workflowItemId: trigger.id,
  workflowItemPortId: 'output',
  inWorkflowItemId: classify.id,
  inWorkflowItemPortId: 'input',
});

await api.workflows.connections.create({
  workflowItemId: classify.id,
  workflowItemPortId: 'output-support',
  inWorkflowItemId: route.id,
  inWorkflowItemPortId: 'input',
});

await api.workflows.connections.create({
  workflowItemId: classify.id,
  workflowItemPortId: 'output-spam',
  inWorkflowItemId: reject.id,
  inWorkflowItemPortId: 'input',
});

console.log('Workflow wired ✓');
```
