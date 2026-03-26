---
id: task-router
title: Task Router
---

# Task Router

`api.taskRouter` — Unbound's contact center routing engine. Route inbound contacts to the right agents and queues, manage worker state, control tasks through their full lifecycle, and monitor real-time metrics.

---

## Workers

Workers represent agents that receive routed tasks. A worker must exist before an agent can accept tasks.

### `taskRouter.worker.create(options?)`

```javascript
// Create worker for the authenticated user
const result = await api.taskRouter.worker.create();
console.log(result.workerId);

// Create for a specific user
await api.taskRouter.worker.create({ userId: 'user-id-123' });
```

### `taskRouter.worker.get(options?)`

```javascript
const worker = await api.taskRouter.worker.get();
// or for a specific user:
const worker = await api.taskRouter.worker.get({ userId: 'user-id-123' });
```

### Worker Status

```javascript
// Go available — worker can now receive tasks
await api.taskRouter.worker.setAvailable();
await api.taskRouter.worker.setAvailable({ workerId: 'worker-id' });
await api.taskRouter.worker.setAvailable({ userId: 'user-id' });

// Go offline
await api.taskRouter.worker.setOffline();
```

### Queue Management

```javascript
// Login to a specific queue
await api.taskRouter.worker.queueLogin({ queueId: 'queue-id' });

// Logout from a specific queue
await api.taskRouter.worker.queueLogout({ queueId: 'queue-id' });

// Auto-login to all queues marked autoLogin=true
await api.taskRouter.worker.queueAutoLogin();

// Logout from all queues
await api.taskRouter.worker.queueLogoutAll();
```

---

## Tasks

Tasks represent inbound contacts (calls, chats, emails) moving through the routing system.

### Task Lifecycle

```
pending → assigned → connected → wrapUp → completed
                 ↘ rejected → (back to queue)
                              ↘ hold ↗
```

### `taskRouter.task.create(options)`

```javascript
const task = await api.taskRouter.task.create({
    type: 'phoneCall',          // 'phoneCall' | 'chat' | 'email' | 'other'
    queueId: 'queue-id',
    priority: 5,                // higher = higher priority
    subject: 'Inbound sales call',
    requiredSkills: ['spanish', 'enterprise-tier'],
    optionalSkills: ['billing'],
    cdrId: 'cdr-id',            // voice: link to call detail record
    peopleId: 'person-id',
    companyId: 'company-id',
    createEngagement: true,     // auto-create engagement session
});
console.log(task.id);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `type` | string | ✅ | `phoneCall`, `chat`, `email`, or `other` |
| `queueId` | string | ✅ | Queue to route this task to |
| `priority` | number | — | Routing priority (higher = first) |
| `subject` | string | — | Task title/description |
| `requiredSkills` | string/string[] | — | Skills workers must have |
| `optionalSkills` | string/string[] | — | Skills that are preferred |
| `cdrId` | string | — | Call Detail Record ID (voice tasks) |
| `peopleId` | string | — | Associated contact |
| `companyId` | string | — | Associated company |
| `createEngagement` | boolean | — | Auto-create an engagement session |

### Accept / Reject

```javascript
// Accept an assigned task
const result = await api.taskRouter.task.accept({ taskId: 'task-id' });
// result.status → 'connected'

// Reject — task returns to queue
await api.taskRouter.task.reject({ taskId: 'task-id' });
```

### Hold / Resume

```javascript
// Toggle hold — connected → hold, hold → connected
await api.taskRouter.task.hold({ taskId: 'task-id' });
```

### Wrap-Up

```javascript
// Move to wrap-up (post-task notes/dispositions)
await api.taskRouter.task.wrapUp({ taskId: 'task-id' });

// Need more time? Extend the wrap-up timer
await api.taskRouter.task.wrapUpExtend({ taskId: 'task-id' });
await api.taskRouter.task.wrapUpExtend({ taskId: 'task-id', extend: 60 }); // +60 seconds
```

### Complete

```javascript
await api.taskRouter.task.complete({ taskId: 'task-id' });
```

### Update Task

```javascript
await api.taskRouter.task.update({
    taskId: 'task-id',
    subject: 'Billing inquiry — upgraded to Pro',
    disposition: 'resolved',
    summary: 'Customer upgraded from Core to Pro after discussion.',
    sentiment: { score: 45, trend: 'improving' },
});
```

### Dial Worker into Task

Connects a worker's phone to an active task via outbound call.

```javascript
const result = await api.taskRouter.task.createCall({ taskId: 'task-id' });
// result.bridgeId → bridge connecting the call
```

### Change Priority

```javascript
// Set to specific priority
await api.taskRouter.task.changePriority({ taskId: 'task-id', action: 'set', value: 10 });

// Increase by N
await api.taskRouter.task.changePriority({ taskId: 'task-id', action: 'increase', value: 5 });

// Decrease by N
await api.taskRouter.task.changePriority({ taskId: 'task-id', action: 'decrease', value: 2 });
```

### Update Skills Dynamically

```javascript
// Add required skills while task is in-flight
await api.taskRouter.task.updateSkills({
    taskId: 'task-id',
    skills: ['spanish', 'billing'],
    action: 'add',
    required: true,
});

// Remove optional skills
await api.taskRouter.task.updateSkills({
    taskId: 'task-id',
    skills: 'enterprise-tier',
    action: 'remove',
    required: false,
});
```

---

## Metrics

Real-time task router performance metrics.

```javascript
const metrics = await api.taskRouter.metrics.getCurrent(null, {
    period: '15min',    // '5min' | '15min' | '30min' | '1hour' | '24hour'
    queueId: 'queue-id',
    metricType: 'all',  // 'queue' | 'task' | 'worker' | 'all'
    limit: 100,
});

// Queue metrics
metrics.metrics.queue.tasksWaiting    // tasks in queue right now
metrics.metrics.queue.tasksAssigned   // assigned to workers, not yet connected
metrics.metrics.queue.avgWaitTime     // seconds
metrics.metrics.queue.longestWaitTime // seconds

// Worker metrics
metrics.metrics.worker.available  // agents ready
metrics.metrics.worker.busy       // handling tasks
metrics.metrics.worker.offline    // logged out

// Task metrics (period totals)
metrics.metrics.task.created    // tasks created in period
metrics.metrics.task.completed  // tasks completed in period
metrics.metrics.task.abandoned  // tasks abandoned in period
```

:::tip
For historical and aggregated metrics by queue and agent, see [Engagement Metrics](/api-reference/engagement-metrics).
:::
