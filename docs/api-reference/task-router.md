---
id: task-router
title: Task Router
---

# Task Router

`api.taskRouter` — Unbound's contact center routing engine. Route inbound contacts (calls, chats, emails) to the right agents and queues, manage worker state, control tasks through their full lifecycle, and monitor real-time metrics.

---

## Overview

The Task Router has three sub-namespaces:

| Namespace | Description |
|---|---|
| `api.taskRouter.worker` | Create and manage workers (agents) |
| `api.taskRouter.task` | Create and control tasks through their lifecycle |
| `api.taskRouter.metrics` | Query real-time queue and worker metrics |

### Task Lifecycle

```
pending → assigned → connected → wrapUp → completed
                 ↘ rejected → (back to queue)
                 ↗      ↕ hold ↕
```

| Status | Description |
|---|---|
| `pending` | Task created, waiting in queue |
| `assigned` | Routed to a specific worker, awaiting acceptance |
| `rejected` | Worker rejected; task returns to queue |
| `connected` | Worker accepted the task — active interaction |
| `hold` | Task paused, worker temporarily unavailable |
| `wrapUp` | Interaction ended, worker completing post-task work |
| `completed` | Task finished, removed from routing |

---

## Workers

Workers represent agents that can receive routed tasks. A worker record must exist before an agent can accept tasks from the queue.

### `taskRouter.worker.create(options?)`

Creates a worker in the task router system for a user.

```javascript
// Create a worker for the authenticated user
const result = await api.taskRouter.worker.create();
console.log(result.workerId); // "0860002026012400000006665842155429980"

// Create for a specific user (admin use)
const result = await api.taskRouter.worker.create({ userId: 'user-id-123' });
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `userId` | string | — | User to create the worker for. Defaults to the authenticated user |

**Response**

```javascript
{
    workerId: "0860002026012400000006665842155429980"
}
```

---

### `taskRouter.worker.get(options?)`

Retrieves worker details for a user.

```javascript
// Get worker for the authenticated user
const worker = await api.taskRouter.worker.get();

// Get worker for a specific user
const worker = await api.taskRouter.worker.get({ userId: 'user-id-123' });
console.log(worker.workerId);
console.log(worker.status);   // 'available' | 'offline' | 'busy'
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `userId` | string | — | User whose worker to retrieve. Defaults to the authenticated user |

---

### Worker Status

Set a worker's availability so they can start or stop receiving tasks.

#### `taskRouter.worker.setAvailable(options?)`

Marks the worker as available — they will begin receiving task assignments.

```javascript
// Go available as the authenticated user
const result = await api.taskRouter.worker.setAvailable();

// Go available by workerId
await api.taskRouter.worker.setAvailable({ workerId: '0860002026012400000006665842155429980' });

// Go available by userId
await api.taskRouter.worker.setAvailable({ userId: 'user-id-123' });
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `workerId` | string | — | Worker to mark available |
| `userId` | string | — | User whose worker to mark available. Defaults to the authenticated user |

**Response**

```javascript
{
    workerId: "0860002026012400000006665842155429980"
}
```

#### `taskRouter.worker.setOffline(options?)`

Marks the worker as offline — they will stop receiving new task assignments.

```javascript
// Go offline as the authenticated user
await api.taskRouter.worker.setOffline();

// Go offline by workerId
await api.taskRouter.worker.setOffline({ workerId: '0860002026012400000006665842155429980' });

// Go offline by userId
await api.taskRouter.worker.setOffline({ userId: 'user-id-123' });
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `workerId` | string | — | Worker to take offline |
| `userId` | string | — | User whose worker to take offline. Defaults to the authenticated user |

**Response**

```javascript
{
    workerId: "0860002026012400000006665842155429980"
}
```

---

### Queue Management

Workers must be logged into queues to receive tasks from them. Use `queueAutoLogin` on startup and `queueLogoutAll` on shutdown.

#### `taskRouter.worker.queueLogin(options)`

Logs a worker into a specific queue.

```javascript
const result = await api.taskRouter.worker.queueLogin({ queueId: 'queue-id' });
console.log(result.userId);
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `queueId` | string | ✅ | Queue to log into |
| `userId` | string | — | User to log in. Defaults to the authenticated user |

#### `taskRouter.worker.queueLogout(options)`

Logs a worker out of a specific queue.

```javascript
await api.taskRouter.worker.queueLogout({ queueId: 'queue-id' });
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `queueId` | string | ✅ | Queue to log out of |
| `userId` | string | — | User to log out. Defaults to the authenticated user |

#### `taskRouter.worker.queueAutoLogin(options?)`

Logs the worker into all queues configured with `autoLogin = true`. Typically called after `setAvailable()`.

```javascript
await api.taskRouter.worker.queueAutoLogin();

// For a specific user
await api.taskRouter.worker.queueAutoLogin({ userId: 'user-id-123' });
```

**Response**

```javascript
{
    userId: "user-id-123"
}
```

#### `taskRouter.worker.queueLogoutAll(options?)`

Logs the worker out of all queues. Typically called during shift end or before `setOffline()`.

```javascript
await api.taskRouter.worker.queueLogoutAll();

// For a specific user
await api.taskRouter.worker.queueLogoutAll({ userId: 'user-id-123' });
```

**Response**

```javascript
{
    userId: "user-id-123"
}
```

---

## Tasks

Tasks represent inbound or created contacts moving through the routing system. Each task tracks its assigned worker, queue, skills, and lifecycle status.

### `taskRouter.task.create(options)`

Creates a new task and routes it to a queue.

```javascript
// Minimal — route a phone call to a queue
const task = await api.taskRouter.task.create({
    type: 'phoneCall',
    queueId: 'queue-id',
});
console.log(task.id); // "task789"

// Full example — inbound call with skills and engagement
const task = await api.taskRouter.task.create({
    type: 'phoneCall',
    queueId: 'queue-id',
    priority: 5,
    subject: 'Inbound sales call',
    requiredSkills: ['spanish', 'enterprise-tier'],
    optionalSkills: ['billing'],
    cdrId: 'cdr-id',
    sipCallId: 'sip-call-id',
    peopleId: 'person-id',
    companyId: 'company-id',
    createEngagement: true,
});

// Email task with metadata tracking
const task = await api.taskRouter.task.create({
    type: 'email',
    queueId: 'queue-id',
    subject: 'Support ticket #4821',
    optionalSkills: 'billing',
    relatedObject: 'supportTicket',
    relatedId: 'ticket-id',
});
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `type` | string | ✅ | `'phoneCall'`, `'chat'`, `'email'`, or `'other'` |
| `queueId` | string | ✅ | Queue to route this task to |
| `priority` | number | — | Routing priority; higher = higher priority. Default: `0` |
| `subject` | string | — | Task title. Defaults to `"New {type}"` |
| `requiredSkills` | string \| string[] | — | Skill IDs workers **must** have |
| `optionalSkills` | string \| string[] | — | Skill IDs that are preferred but not required |
| `skills` | string \| string[] | — | Alias for `requiredSkills` |
| `cdrId` | string | — | Call Detail Record ID — links a voice task to its CDR |
| `sipCallId` | string | — | SIP call leg ID to associate with this task |
| `peopleId` | string | — | Associated contact (People record) |
| `companyId` | string | — | Associated company |
| `createEngagement` | boolean | — | Auto-create an engagement session when task is created |
| `relatedObject` | string | — | Object type for metadata tracking (e.g., `'supportTicket'`) |
| `relatedId` | string | — | Object ID for metadata tracking |

**Response**

```javascript
{
    id: "task-id-789",
    type: "phoneCall",
    status: "pending",
    queueId: "queue-id",
    priority: 5,
    subject: "Inbound sales call"
}
```

---

### `taskRouter.task.accept(options)`

Accepts a task that has been assigned to a worker. Changes status from `assigned` → `connected`.

```javascript
// Accept as the authenticated user
const result = await api.taskRouter.task.accept({ taskId: 'task-id' });
console.log(result.status); // "connected"

// Accept by userId
const result = await api.taskRouter.task.accept({
    taskId: 'task-id',
    userId: 'user-id',
});

// Accept by workerId (alternative to userId)
const result = await api.taskRouter.task.accept({
    taskId: 'task-id',
    workerId: 'worker-id',
});

// Accept and link to a SIP call leg
const result = await api.taskRouter.task.accept({
    taskId: 'task-id',
    userId: 'user-id',
    workerSipCallId: 'sip-call-leg-id',
});
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to accept |
| `userId` | string | — | User accepting the task. Defaults to the authenticated user |
| `workerId` | string | — | Worker accepting the task (alternative to `userId`) |
| `workerSipCallId` | string | — | SIP call leg ID for the worker's phone connection |

**Response**

```javascript
{
    taskId: "task-id-789",
    workerId: "worker-id-456",
    userId: "user-id-123",
    workerSipCallId: "sip-call-leg-id",
    status: "connected"
}
```

---

### `taskRouter.task.reject(options)`

Rejects an assigned task. The task returns to the queue for reassignment.

```javascript
// Reject as the authenticated user
await api.taskRouter.task.reject({ taskId: 'task-id' });

// Reject on behalf of a specific user
await api.taskRouter.task.reject({
    taskId: 'task-id',
    userId: 'user-id',
});
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to reject |
| `userId` | string | — | User rejecting the task. Defaults to the authenticated user |

**Response**

```javascript
{
    taskId: "task-id-789",
    workerId: "worker-id-456",
    userId: "user-id-123",
    status: "pending"   // returned to queue
}
```

---

### `taskRouter.task.hold(options)`

Toggles hold state on a connected task. `connected` → `hold`, or `hold` → `connected`.

```javascript
// Put on hold
const result = await api.taskRouter.task.hold({ taskId: 'task-id' });
console.log(result.status); // "hold"

// Resume from hold (same call toggles it back)
const result = await api.taskRouter.task.hold({ taskId: 'task-id' });
console.log(result.status); // "connected"
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to toggle hold on |

**Response**

```javascript
{
    taskId: "task-id-789",
    status: "hold"   // or "connected"
}
```

---

### `taskRouter.task.wrapUp(options)`

Transitions a connected or held task to `wrapUp` status. The worker can now take notes, set a disposition, or handle follow-up work before completing the task.

```javascript
const result = await api.taskRouter.task.wrapUp({ taskId: 'task-id' });
console.log(result.status); // "wrapUp"
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to move to wrap-up |

**Response**

```javascript
{
    taskId: "task-id-789",
    status: "wrapUp"
}
```

---

### `taskRouter.task.wrapUpExtend(options)`

Extends the wrap-up timer for a task currently in `wrapUp` status. Useful when an agent needs more time to complete notes before the task auto-completes.

```javascript
// Extend by queue default (typically 30 seconds)
const result = await api.taskRouter.task.wrapUpExtend({ taskId: 'task-id' });
console.log(result.extend); // 30

// Extend by a specific number of seconds
const result = await api.taskRouter.task.wrapUpExtend({
    taskId: 'task-id',
    extend: 120,   // 2 more minutes
});
console.log(result.extend); // 120
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to extend |
| `extend` | number | — | Seconds to add. Omit to use the queue's default `wrapUpExtend` value |

**Response**

```javascript
{
    taskId: "task-id-789",
    extend: 60
}
```

---

### `taskRouter.task.complete(options)`

Marks a task as completed. Can be called from any non-completed status. Typically called after `wrapUp`.

```javascript
const result = await api.taskRouter.task.complete({ taskId: 'task-id' });
console.log(result.status); // "completed"
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to complete |

**Response**

```javascript
{
    taskId: "task-id-789",
    status: "completed"
}
```

---

### `taskRouter.task.update(options)`

Updates metadata on an existing task. At least one updatable field must be provided.

```javascript
// Update subject and disposition after wrap-up
await api.taskRouter.task.update({
    taskId: 'task-id',
    subject: 'Billing inquiry — upgraded to Pro',
    disposition: 'resolved',
    summary: 'Customer upgraded from Core to Pro plan after a discount was offered.',
});

// Update with sentiment data (e.g., from AI analysis)
await api.taskRouter.task.update({
    taskId: 'task-id',
    sentiment: {
        score: 72,           // 0–100
        trend: 'improving',  // 'improving' | 'declining' | 'stable'
    },
});

// Link a SIP call leg after task creation
await api.taskRouter.task.update({
    taskId: 'task-id',
    sipCallId: 'sip-call-id',
    cdrId: 'cdr-id',
});
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to update |
| `subject` | string | — | New subject/title for the task |
| `disposition` | string | — | Outcome code (e.g., `'resolved'`, `'escalated'`, `'callback-scheduled'`) |
| `summary` | string | — | Free-text summary of the interaction |
| `sentiment` | object | — | Sentiment data object (see below) |
| `cdrId` | string | — | Call Detail Record ID to link |
| `sipCallId` | string | — | SIP call leg ID to associate |

**Sentiment object**

```javascript
{
    score: 72,          // number 0–100 (0 = very negative, 100 = very positive)
    trend: 'improving'  // 'improving' | 'declining' | 'stable'
}
```

**Response**

```javascript
{
    taskId: "task-id-789"
}
```

---

### `taskRouter.task.statusEvent(options)`

Fires a status-change event for a task. This is used internally by webhooks and automated processes that need to notify downstream systems when a task status transitions.

```javascript
const result = await api.taskRouter.task.statusEvent({
    taskId: 'task-id',
    status: 'completed',
    previousStatus: 'wrapUp',
});
console.log(result.taskId);
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task that changed status |
| `status` | string | ✅ | New status value |
| `previousStatus` | string | ✅ | Previous status value |

**Response**

```javascript
{
    taskId: "task-id-789"
}
```

:::note
`statusEvent` is typically called by the Unbound platform automatically. Use it only if you're building a custom integration that manages task state externally.
:::

---

### `taskRouter.task.createCall(options)`

Initiates an outbound call to a worker's extension to bridge them into an active task. The task must have an associated CDR with a bridge ID and cannot be in `completed` or `wrapUp` status.

```javascript
// Dial the authenticated user into a task
const result = await api.taskRouter.task.createCall({ taskId: 'task-id' });
console.log(result.bridgeId); // "bridge-456"

// Dial a specific user into a task
const result = await api.taskRouter.task.createCall({
    taskId: 'task-id',
    userId: 'user-id',
});
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Active task to dial the worker into |
| `userId` | string | — | User to call. Defaults to the authenticated user |

**Response**

```javascript
{
    taskId: "task-id-789",
    userId: "user-id-123",
    bridgeId: "bridge-456"
}
```

---

### `taskRouter.task.changePriority(options)`

Adjusts the routing priority of a pending task. Higher priority tasks are assigned to available workers first.

```javascript
// Set priority to an absolute value
await api.taskRouter.task.changePriority({
    taskId: 'task-id',
    action: 'set',
    value: 10,
});

// Increase priority by a delta
await api.taskRouter.task.changePriority({
    taskId: 'task-id',
    action: 'increase',
    value: 5,
});

// Decrease priority by a delta (floor is 0)
await api.taskRouter.task.changePriority({
    taskId: 'task-id',
    action: 'decrease',
    value: 3,
});
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to reprioritize |
| `action` | string | — | `'set'`, `'increase'`, or `'decrease'`. Default: `'set'` |
| `value` | number | — | Priority value or delta. Default: `0` |

**Response**

```javascript
{
    taskId: "task-id-789",
    priority: 10    // new priority value (min 0)
}
```

---

### `taskRouter.task.updateSkills(options)`

Dynamically adds or removes required/optional skills from an in-flight task. Useful for escalation flows where a task needs different skills mid-queue.

```javascript
// Add required skills to an escalated task
await api.taskRouter.task.updateSkills({
    taskId: 'task-id',
    skills: ['spanish', 'enterprise-tier'],
    action: 'add',
    required: true,
});

// Remove a single optional skill
await api.taskRouter.task.updateSkills({
    taskId: 'task-id',
    skills: 'billing',
    action: 'remove',
    required: false,
});

// Add optional skills (default required: false)
await api.taskRouter.task.updateSkills({
    taskId: 'task-id',
    skills: ['upsell'],
    action: 'add',
});
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to modify |
| `skills` | string \| string[] | ✅ | Skill ID or array of IDs to add or remove |
| `action` | string | ✅ | `'add'` or `'remove'` |
| `required` | boolean | — | `true` = required skills, `false` = optional skills. Default: `false` |

**Response**

```javascript
{
    taskId: "task-id-789",
    params: {
        skills: ["spanish", "enterprise-tier"],
        action: "add",
        required: true
    }
}
```

---

## Metrics

Real-time task router performance metrics across queues, tasks, and workers.

### `taskRouter.metrics.getCurrent(accountId, params?)`

Retrieves current metrics snapshots for the routing system.

```javascript
// All metrics across all queues, 15-minute window
const metrics = await api.taskRouter.metrics.getCurrent(null, {
    period: '15min',
    metricType: 'all',
});

// Queue-specific metrics
const queueMetrics = await api.taskRouter.metrics.getCurrent(null, {
    period: '5min',
    queueId: 'queue-id',
    metricType: 'queue',
    limit: 50,
});

// Worker availability snapshot
const workerMetrics = await api.taskRouter.metrics.getCurrent(null, {
    period: '1hour',
    metricType: 'worker',
});

// Task volume for the day
const taskMetrics = await api.taskRouter.metrics.getCurrent(null, {
    period: '24hour',
    metricType: 'task',
    limit: 200,
});
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `period` | string | — | Time window: `'5min'`, `'15min'`, `'30min'`, `'1hour'`, `'24hour'` |
| `queueId` | string | — | Filter to a specific queue |
| `metricType` | string | — | `'queue'`, `'task'`, `'worker'`, or `'all'`. Default: `'all'` |
| `limit` | number | — | Max records returned. Default: `100` |

**Response shape**

```javascript
{
    period: "15min",
    queueId: "queue-id",   // present if filtered
    metrics: {
        queue: {
            tasksWaiting: 5,       // tasks in queue right now
            tasksAssigned: 2,      // assigned to workers, pending acceptance
            tasksConnected: 8,     // active interactions
            avgWaitTime: 42.5,     // seconds (period average)
            longestWaitTime: 180,  // seconds (current longest waiter)
        },
        worker: {
            available: 12,   // ready to receive tasks
            busy: 8,         // currently handling a task
            offline: 4,      // not logged in
        },
        task: {
            created: 47,     // tasks created in this period
            completed: 43,   // tasks completed in this period
            abandoned: 2,    // tasks abandoned before assignment
        }
    }
}
```

:::tip
For historical aggregated metrics broken down by queue and agent, use [Engagement Metrics](/api-reference/engagement-metrics) instead.
:::

---

## Common Patterns

### Agent Startup Flow

Call this sequence when an agent opens their softphone and is ready for calls:

```javascript
async function agentGoOnline(api) {
    // 1. Create worker record (idempotent — safe to call every startup)
    const { workerId } = await api.taskRouter.worker.create();
    console.log('Worker ready:', workerId);

    // 2. Log into all auto-login queues
    await api.taskRouter.worker.queueAutoLogin();

    // 3. Go available — start receiving tasks
    await api.taskRouter.worker.setAvailable();

    return workerId;
}
```

### Agent Shutdown Flow

```javascript
async function agentGoOffline(api) {
    // 1. Stop receiving new tasks
    await api.taskRouter.worker.setOffline();

    // 2. Flush all queue memberships
    await api.taskRouter.worker.queueLogoutAll();

    console.log('Agent is offline');
}
```

### Full Task Lifecycle (Voice Call)

```javascript
// When an inbound call arrives, create and route the task
async function handleInboundCall(api, cdrId, callerId) {
    const task = await api.taskRouter.task.create({
        type: 'phoneCall',
        queueId: 'sales-queue-id',
        cdrId,
        subject: `Inbound call from ${callerId}`,
        requiredSkills: ['sales'],
        priority: 3,
        createEngagement: true,
    });
    console.log('Task created:', task.id);
    return task.id;
}

// When the task is offered to this worker
async function acceptTask(api, taskId, sipCallId) {
    const result = await api.taskRouter.task.accept({
        taskId,
        workerSipCallId: sipCallId,   // link worker's call leg
    });
    console.log('Task accepted, status:', result.status); // "connected"
    return result;
}

// When the call ends — move to wrap-up
async function endCall(api, taskId) {
    await api.taskRouter.task.wrapUp({ taskId });
    console.log('Task in wrap-up');
}

// After notes and disposition are saved
async function completeTask(api, taskId, notes) {
    await api.taskRouter.task.update({
        taskId,
        disposition: notes.disposition,
        summary: notes.summary,
        sentiment: notes.sentiment,
    });
    await api.taskRouter.task.complete({ taskId });
    console.log('Task completed');
}
```

### Dynamic Escalation

Escalate a task to require a supervisor by boosting priority and changing required skills:

```javascript
async function escalateTask(api, taskId) {
    // Boost priority so it jumps to the front
    await api.taskRouter.task.changePriority({
        taskId,
        action: 'set',
        value: 100,
    });

    // Require supervisor skill
    await api.taskRouter.task.updateSkills({
        taskId,
        skills: 'supervisor',
        action: 'add',
        required: true,
    });

    // Update subject for visibility
    await api.taskRouter.task.update({
        taskId,
        subject: '[ESCALATED] Customer requiring supervisor',
        disposition: 'escalated',
    });

    console.log('Task escalated and re-queued for supervisor');
}
```

### Queue Monitoring Dashboard

Poll metrics every 30 seconds to display a live queue board:

```javascript
async function pollQueueMetrics(api, queueIds) {
    const results = await Promise.all(
        queueIds.map(queueId =>
            api.taskRouter.metrics.getCurrent(null, {
                period: '5min',
                queueId,
                metricType: 'all',
            })
        )
    );

    for (const data of results) {
        const { queue, worker, task } = data.metrics;
        console.log(`Queue: ${data.queueId}`);
        console.log(`  Waiting: ${queue.tasksWaiting}`);
        console.log(`  Avg wait: ${queue.avgWaitTime.toFixed(1)}s`);
        console.log(`  Available agents: ${worker.available}`);
        console.log(`  Completed (5min): ${task.completed}`);
    }
}

// Run every 30 seconds
setInterval(() => pollQueueMetrics(api, ['sales-q', 'support-q']), 30_000);
```

### Wrap-Up Extension with Retry

Give agents multiple extensions but cap the total extra time:

```javascript
const MAX_EXTENSIONS = 3;
const extensionCounts = new Map();

async function requestWrapUpExtension(api, taskId) {
    const count = extensionCounts.get(taskId) || 0;

    if (count >= MAX_EXTENSIONS) {
        console.warn('Max extensions reached — completing task');
        await api.taskRouter.task.complete({ taskId });
        extensionCounts.delete(taskId);
        return false;
    }

    await api.taskRouter.task.wrapUpExtend({ taskId, extend: 60 });
    extensionCounts.set(taskId, count + 1);
    console.log(`Extended wrap-up (${count + 1}/${MAX_EXTENSIONS})`);
    return true;
}
```

### Skill-Based Routing for Chat

Create a chat task that requires language-specific agents:

```javascript
async function routeChatByLanguage(api, language, visitorId) {
    const skillMap = {
        es: 'spanish-fluent',
        fr: 'french-fluent',
        de: 'german-fluent',
        en: null,   // no skill required for English
    };

    const requiredSkills = skillMap[language]
        ? [skillMap[language], 'chat-certified']
        : ['chat-certified'];

    const task = await api.taskRouter.task.create({
        type: 'chat',
        queueId: 'chat-support-queue-id',
        requiredSkills,
        subject: `Live chat — ${language.toUpperCase()} visitor`,
        peopleId: visitorId,
        priority: 2,
        createEngagement: true,
    });

    return task.id;
}
```
