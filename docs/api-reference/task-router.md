---
id: task-router
title: Task Router
---

# Task Router

`api.taskRouter` — Route inbound contacts to the right agents and queues. Manage workers, tasks, and routing policies.

The Task Router is Unbound's contact center engine — it handles queuing, agent state, capacity management, and task assignment.

---

## Workers

Workers are agents that receive routed tasks.

### `taskRouter.worker` methods

```javascript
// Get current worker state
const worker = await api.taskRouter.worker.get();
// worker.status → 'available' | 'busy' | 'offline'
// worker.capacity → available slots
// worker.currentTasks → active task count

// Update worker status
await api.taskRouter.worker.update({
  status: 'available',
  capacity: 3,
});

// Set worker offline
await api.taskRouter.worker.setOffline();
```

---

## Tasks

Tasks represent inbound contacts (calls, chats, emails) waiting to be handled.

```javascript
// Get a specific task
const task = await api.taskRouter.tasks.get('task-id');

// List tasks in a queue
const tasks = await api.taskRouter.tasks.list({
  queueId: 'queue-id',
  status: 'pending',    // 'pending' | 'assigned' | 'wrapping' | 'completed'
});

// Accept a task assignment
await api.taskRouter.tasks.accept('task-id');

// Complete a task
await api.taskRouter.tasks.complete('task-id');

// Transfer a task to a different queue
await api.taskRouter.tasks.transfer('task-id', {
  queueId: 'escalation-queue-id',
});
```

---

## Metrics

See [Engagement Metrics](/api-reference/engagement-metrics) for queue and agent performance data, which is built on top of the Task Router.

---

## Queue Configuration

Queues are configured through the Unbound admin portal. The SDK exposes read access to queue state for routing logic.

```javascript
// Get queue details
const queue = await api.taskRouter.getQueue('queue-id');
// queue.name, queue.agentCount, queue.taskCount, queue.averageWaitTime

// List all queues
const queues = await api.taskRouter.listQueues();
```
