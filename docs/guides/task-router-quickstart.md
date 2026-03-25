---
id: task-router-quickstart
title: Build a Contact Center Queue
---

# Build a Contact Center Queue

This guide wires up a complete inbound routing flow: a phone call arrives → gets queued → assigned to an agent → agent accepts → handles the call → completes wrap-up.

## Prerequisites

- An Unbound phone number configured with a webhook URL
- At least one queue configured in your namespace
- Workers (user accounts) registered in that queue

---

## 1. Handle Inbound Call Webhook

When a call arrives, your webhook creates a Task Router task.

```javascript
import express from 'express';
import SDK from '@unboundcx/sdk';

const app = express();
app.use(express.json());

const api = new SDK({ namespace: 'your-namespace', token: process.env.UNBOUND_TOKEN });

app.post('/webhooks/voice', async (req, res) => {
  const { type, callId, cdrId, from } = req.body;
  res.json({ received: true }); // acknowledge immediately

  if (type === 'call.started') {
    // Find or create the contact
    const [contact] = await api.objects.query({
      object: 'contacts',
      where: { phone: from },
      limit: 1,
    }).then(r => r.data);

    // Create a task to route this call
    const task = await api.taskRouter.task.create({
      type: 'phoneCall',
      queueId: 'your-queue-id',
      cdrId,
      peopleId: contact?.id,
      subject: `Inbound call from ${from}`,
      createEngagement: true,
    });

    console.log('Task created:', task.id);
  }
});
```

---

## 2. Agent Goes Available

On your agent UI, let agents toggle their status:

```javascript
// Agent clicks "Go Available"
await api.taskRouter.worker.setAvailable();

// Login to specific queues
await api.taskRouter.worker.queueLogin({ queueId: 'your-queue-id' });
// Or auto-login to all assigned queues
await api.taskRouter.worker.queueAutoLogin();
```

---

## 3. Subscribe to Task Assignments

The agent's browser subscribes to task assignment events via WebSocket:

```javascript
const { sessionId } = await api.subscriptions.socket.getConnection();

// Subscribe to task events for this worker
await api.subscriptions.socket.create(sessionId, {
  channel: 'taskRouter',
});

// In your Socket.io handler:
socket.on('task:assigned', async (data) => {
  const { taskId } = data;
  showIncomingTaskNotification(taskId);
});
```

---

## 4. Accept the Task

```javascript
// Agent clicks "Accept"
const result = await api.taskRouter.task.accept({ taskId });
// Now status = 'connected', call bridges to agent's phone

// Optionally dial the agent's phone directly
await api.taskRouter.task.createCall({ taskId });
```

---

## 5. During the Call

```javascript
// Put on hold
await api.taskRouter.task.hold({ taskId });

// Resume
await api.taskRouter.task.hold({ taskId }); // toggles back to connected

// Update subject based on what you learn
await api.taskRouter.task.update({
  taskId,
  subject: 'Billing dispute — account #12345',
});
```

---

## 6. Wrap-Up and Complete

```javascript
// Call ends — move to wrap-up
await api.taskRouter.task.wrapUp({ taskId });

// Agent fills in notes and disposition...
await api.notes.create({
  relatedId: engagementSessionId,
  content_html: '<p>Customer disputed charge. Issued $25 credit.</p>',
});

await api.taskRouter.task.update({
  taskId,
  disposition: 'resolved',
  summary: 'Customer disputed charge on invoice #456. Credit issued.',
});

// Complete the task
await api.taskRouter.task.complete({ taskId });

// Agent goes offline (end of shift)
await api.taskRouter.worker.setOffline();
```

---

## Full Task Lifecycle Diagram

```
Inbound Call
    ↓
Webhook fires → task.create({ type: 'phoneCall', queueId })
    ↓
Task Router finds available worker → task.assigned event
    ↓
Agent notified → task.accept({ taskId })
    ↓
Connected (call bridged)
    ↓
Call ends → task.wrapUp({ taskId })
    ↓
Agent completes notes → task.complete({ taskId })
```

## What's Next

- [Task Router API Reference](/api-reference/task-router) — all methods
- [Engagement Metrics](/api-reference/engagement-metrics) — monitor queue performance
- [Webhooks](/guides/webhooks) — handle all incoming events
