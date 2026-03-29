---
id: task-router-quickstart
title: Build a Contact Center Queue
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Build a Contact Center Queue

This guide wires up a production-ready inbound routing flow: a phone call arrives → queued → assigned to an available agent → agent accepts → handles the call → completes wrap-up. Along the way you'll learn how to handle supervisor monitoring, skills-based routing, multi-queue management, and error recovery.

---

## Prerequisites

- An Unbound phone number configured with a webhook URL
- At least one queue configured in your namespace
- Workers (user accounts) registered in that queue
- A running web server to receive webhook events

---

## Architecture Overview

```
Phone Number
    │
    ▼
Webhook fires (POST /webhooks/voice)
    │
    ▼
Your server creates a Task
    │
    ▼
Task Router finds an available worker
    │
    ▼
Worker receives task:assigned event (WebSocket)
    │
    ▼
Agent clicks Accept → call bridges to their phone
    │
    ▼
Call ends → Wrap-up → Complete
```

The Task Router handles the queue, priority, and matching logic. Your server creates tasks and reacts to events. Agents interact via your UI.

---

## Part 1 — Basic Queue Flow

### Step 1: Handle the Inbound Call Webhook

When a call arrives on your phone number, Unbound sends a `call.started` event to your webhook. Create a Task Router task to begin routing:

```javascript
import express from 'express';
import SDK from '@unboundcx/sdk';

const app = express();
app.use(express.json());

const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE,
    token: process.env.UNBOUND_TOKEN,
});

app.post('/webhooks/voice', async (req, res) => {
    const { type, callId, cdrId, from, to } = req.body;

    // Acknowledge immediately — never keep webhooks waiting
    res.json({ received: true });

    if (type !== 'call.started') return;

    try {
        // Look up the caller in your CRM
        const contacts = await api.objects.query({
            object: 'contacts',
            where: { phone: from },
            limit: 1,
        });
        const contact = contacts.data[0] ?? null;

        // Create the task — Task Router takes it from here
        const task = await api.taskRouter.task.create({
            type: 'phoneCall',
            queueId: process.env.QUEUE_ID,
            cdrId,
            peopleId: contact?.id,
            subject: contact
                ? `Call from ${contact.name} (${from})`
                : `Call from ${from}`,
            createEngagement: true,
            priority: contact?.tier === 'premium' ? 10 : 5,
        });

        console.log(`Task ${task.id} created for call ${callId}`);
    } catch (err) {
        console.error('Failed to create task:', err.message);
        // The call is still alive — implement fallback routing here
        // e.g., play a message and transfer to a backup number
    }
});

app.listen(3000);
```

**`task.create` key parameters:**

| Parameter | Type | Description |
|---|---|---|
| `type` | string | Task type — `phoneCall`, `chat`, `email`, `sms` |
| `queueId` | string | ID of the queue to route this task into |
| `cdrId` | string | CDR ID of the associated call leg |
| `peopleId` | string | CRM contact ID — links to engagement |
| `subject` | string | Human-readable description shown to agents |
| `createEngagement` | boolean | Auto-create an engagement session for this task |
| `priority` | number | Higher number = routed first (default: 0) |
| `skills` | string[] | Required skills for skills-based routing |

---

### Step 2: Agent Going Available

On your agent UI, let agents toggle their readiness to take calls. A worker must exist in the Task Router system before it can receive tasks:

```javascript
async function startAgentSession(userId) {
    // 1. Ensure the worker exists (idempotent — safe to call each session)
    try {
        await api.taskRouter.worker.create({ userId });
    } catch (err) {
        // Worker may already exist — that's fine
        if (!err.message?.includes('already exists')) throw err;
    }

    // 2. Mark the worker as available
    await api.taskRouter.worker.setAvailable({ userId });

    // 3. Log into all queues where the agent has autoLogin = true
    const result = await api.taskRouter.worker.queueAutoLogin({ userId });

    console.log(`Agent ${userId} is now available`);
    return result;
}

// Or log into a specific queue manually
async function loginToQueue(userId, queueId) {
    await api.taskRouter.worker.setAvailable({ userId });
    await api.taskRouter.worker.queueLogin({ queueId, userId });
    console.log(`Agent ${userId} logged into queue ${queueId}`);
}
```

---

### Step 3: Subscribe to Task Assignments

Agents must subscribe via WebSocket to receive incoming task notifications in real time. Do this when the agent opens your app:

```javascript
import { io } from 'socket.io-client';

async function connectAgentSocket(userId) {
    // Get a WebSocket session ID
    const { sessionId } = await api.subscriptions.socket.getConnection();

    // Connect to the Unbound WebSocket
    const socket = io(process.env.UNBOUND_WS_URL, {
        auth: { token: process.env.UNBOUND_TOKEN },
    });

    socket.on('connect', async () => {
        // Subscribe to Task Router events for this session
        await api.subscriptions.socket.create(sessionId, {
            channel: 'taskRouter',
        });
        console.log(`Agent ${userId} subscribed to task events`);
    });

    // Task assigned to this agent
    socket.on('task:assigned', (data) => {
        const { taskId, subject, type, priority } = data;
        showIncomingTaskNotification({ taskId, subject, type, priority });
    });

    // Task was cancelled before agent accepted
    socket.on('task:cancelled', (data) => {
        dismissTaskNotification(data.taskId);
    });

    // Agent was removed from the queue (supervisor action or shift end)
    socket.on('worker:offline', () => {
        showStatus('You have been set offline');
    });

    socket.on('disconnect', () => {
        console.warn('WebSocket disconnected — attempting reconnect');
    });

    return socket;
}
```

---

### Step 4: Accept or Reject a Task

When an incoming task notification arrives, the agent can accept or reject it:

```javascript
// Agent clicks "Accept"
async function acceptTask(taskId) {
    const result = await api.taskRouter.task.accept({ taskId });
    // status is now 'connected' — the call bridges to the agent's phone
    console.log(`Task ${taskId} accepted, status: ${result.status}`);

    // Optionally dial the agent's phone directly
    await api.taskRouter.task.createCall({ taskId });
}

// Agent declines — task goes back to the queue
async function rejectTask(taskId, reason = 'busy') {
    await api.taskRouter.task.reject({
        taskId,
        reason,
        // Task will be re-queued and offered to the next available agent
    });
}
```

**Rejection reasons:**

| Value | When to use |
|---|---|
| `busy` | Agent is briefly unavailable |
| `missed` | Notification expired before agent responded |
| `declined` | Agent explicitly declined |

---

### Step 5: In-Call Controls

While the call is active, agents can put it on hold, transfer it, or update the task:

```javascript
// Toggle hold on/off
async function toggleHold(taskId) {
    await api.taskRouter.task.hold({ taskId });
    // Calling hold again resumes the call (it's a toggle)
}

// Update the task subject as more context emerges
async function updateTaskContext(taskId, customerInfo) {
    await api.taskRouter.task.update({
        taskId,
        subject: `Billing dispute — Account #${customerInfo.accountId}`,
    });
}

// Emit a custom status event for supervisor visibility
async function notifySupervisor(taskId, message) {
    await api.taskRouter.task.statusEvent({
        taskId,
        event: 'note',
        message,
    });
}
```

---

### Step 6: Wrap-Up and Complete

After the call ends, move the task to wrap-up, fill in notes and disposition, then complete:

```javascript
async function completeTask(taskId, engagementSessionId, notes) {
    // 1. Move to wrap-up mode — agent gets time to document
    await api.taskRouter.task.wrapUp({ taskId });

    // 2. Write a call summary note
    if (notes?.summary) {
        await api.notes.create({
            relatedId: engagementSessionId,
            content_html: `<p>${notes.summary}</p>`,
        });
    }

    // 3. Update disposition and summary
    await api.taskRouter.task.update({
        taskId,
        disposition: notes?.disposition || 'resolved',
        summary: notes?.summary || '',
    });

    // 4. Complete the task — agent is ready for the next one
    await api.taskRouter.task.complete({ taskId });
}

// Agent ends their shift
async function endAgentSession(userId) {
    await api.taskRouter.worker.queueLogoutAll({ userId });
    await api.taskRouter.worker.setOffline({ userId });
    console.log(`Agent ${userId} is offline`);
}
```

---

### Full Task Lifecycle Diagram

```
Inbound Call
    │
    ▼
webhook → task.create({ type: 'phoneCall', queueId, priority })
    │
    ▼
Task Router matches available worker → task.assigned event fires
    │
    ├─ Agent accepts → task.accept({ taskId })
    │       │
    │       ▼
    │   Connected (call bridged) ← task.createCall({ taskId })
    │       │
    │       ├─ task.hold()     ← put on hold
    │       ├─ task.update()   ← update subject/disposition
    │       ├─ task.statusEvent() ← supervisor events
    │       └─ call ends
    │              │
    │              ▼
    │          task.wrapUp() → agent documents
    │              │
    │              ▼
    │          task.complete() → agent ready for next task
    │
    └─ Agent rejects → task.reject({ taskId }) → re-queued
```

---

## Part 2 — Skills-Based Routing

Route tasks only to agents who have the required skills. This ensures a Spanish-speaking caller reaches a bilingual agent, or a complex billing issue reaches a senior specialist.

### Setting Up Skills on a Task

Add required skills when creating the task:

```javascript
// Detect required skills from caller data or IVR input
function determineRequiredSkills(callerInput) {
    const skills = [];

    if (callerInput.language === 'es') skills.push('spanish');
    if (callerInput.department === 'billing') skills.push('billing');
    if (callerInput.tier === 'enterprise') skills.push('enterprise-support');

    return skills;
}

app.post('/webhooks/voice', async (req, res) => {
    res.json({ received: true });

    const { cdrId, from } = req.body;
    if (req.body.type !== 'call.started') return;

    // IVR selection or caller profile determines routing
    const callerInput = await lookupCallerProfile(from);
    const skills = determineRequiredSkills(callerInput);

    await api.taskRouter.task.create({
        type: 'phoneCall',
        queueId: process.env.QUEUE_ID,
        cdrId,
        subject: `Support call from ${from}`,
        skills,
        priority: callerInput.tier === 'enterprise' ? 20 : 5,
        createEngagement: true,
    });
});
```

### Updating Skills Mid-Queue

If you learn more about what the caller needs while they wait (e.g., after IVR input), update the skills requirement on the active task:

```javascript
async function updateTaskSkills(taskId, newSkills) {
    await api.taskRouter.task.updateSkills({
        taskId,
        skills: newSkills,
    });
    console.log(`Task ${taskId} now requires skills: ${newSkills.join(', ')}`);
}
```

### Escalating Priority

Move a task to the front of the queue if a caller has been waiting too long:

```javascript
async function checkAndEscalate(taskId, waitStartTime) {
    const waitSeconds = (Date.now() - waitStartTime) / 1000;

    if (waitSeconds > 120) {
        // Waited over 2 minutes — boost priority
        await api.taskRouter.task.changePriority({
            taskId,
            priority: 50,
        });
        console.log(`Task ${taskId} escalated after ${Math.round(waitSeconds)}s wait`);
    }
}
```

---

## Part 3 — Multi-Queue Management

Agents often need to handle multiple queues (e.g., general support + billing + VIP). Here's how to manage that cleanly.

### Selective Queue Login

```javascript
// Log into specific queues on shift start
async function startShift(userId, queueIds) {
    // First go available
    await api.taskRouter.worker.setAvailable({ userId });

    // Then log into each queue
    for (const queueId of queueIds) {
        await api.taskRouter.worker.queueLogin({ queueId, userId });
        console.log(`Agent ${userId} logged into queue ${queueId}`);
    }
}

// Leave one queue without going offline
async function leaveQueue(userId, queueId) {
    await api.taskRouter.worker.queueLogout({ queueId, userId });
    console.log(`Agent ${userId} left queue ${queueId}`);
}

// End shift — leave all queues and go offline
async function endShift(userId) {
    await api.taskRouter.worker.queueLogoutAll({ userId });
    await api.taskRouter.worker.setOffline({ userId });
}
```

### Checking Worker Status

Retrieve the current worker state to build agent status dashboards:

```javascript
async function getAgentStatus(userId) {
    const worker = await api.taskRouter.worker.get({ userId });
    return {
        status: worker.status,           // 'available', 'busy', 'offline'
        queues: worker.queues,           // queues they're logged into
        currentTask: worker.currentTask, // active task ID, if any
        lastActivity: worker.updatedAt,
    };
}
```

---

## Part 4 — Supervisor Monitoring

### Real-Time Queue Dashboard

Supervisors need visibility into queue depth, wait times, and agent availability. Use `taskRouter.metrics.getCurrent()` on a polling interval:

```javascript
async function getQueueDashboard(queueId) {
    const metrics = await api.taskRouter.metrics.getCurrent({
        period: '5min',
        queueId,
        metricType: 'all',
    });

    return {
        queue: {
            waiting: metrics.metrics.queue.tasksWaiting,
            assigned: metrics.metrics.queue.tasksAssigned,
            connected: metrics.metrics.queue.tasksConnected,
            avgWaitSeconds: metrics.metrics.queue.avgWaitTime,
            longestWaitSeconds: metrics.metrics.queue.longestWaitTime,
        },
        workers: {
            available: metrics.metrics.worker.available,
            busy: metrics.metrics.worker.busy,
            offline: metrics.metrics.worker.offline,
        },
        tasks: {
            created: metrics.metrics.task.created,
            completed: metrics.metrics.task.completed,
            abandoned: metrics.metrics.task.abandoned,
        },
        period: metrics.period,
    };
}

// Poll every 10 seconds for a live dashboard
function startDashboardPolling(queueId, onUpdate) {
    async function poll() {
        try {
            const data = await getQueueDashboard(queueId);
            onUpdate(data);
        } catch (err) {
            console.error('Dashboard poll failed:', err.message);
        }
    }

    poll(); // immediate first load
    return setInterval(poll, 10_000);
}

// Usage:
const stopPolling = startDashboardPolling('queue123', (data) => {
    console.log(`Queue: ${data.queue.waiting} waiting | ${data.workers.available} agents available`);
    if (data.queue.longestWaitSeconds > 180) {
        alertSupervisor('Long wait time: ' + data.queue.longestWaitSeconds + 's');
    }
});

// Stop when the supervisor closes the dashboard
// clearInterval(stopPolling);
```

### Comparing Periods

Use different `period` values to compare performance across time windows:

```javascript
async function getMetricsSummary(queueId) {
    const [m5, m60, m24h] = await Promise.all([
        api.taskRouter.metrics.getCurrent({ period: '5min', queueId, metricType: 'queue' }),
        api.taskRouter.metrics.getCurrent({ period: '1hour', queueId, metricType: 'task' }),
        api.taskRouter.metrics.getCurrent({ period: '24hour', queueId, metricType: 'task' }),
    ]);

    return {
        currentWait: m5.metrics.queue.avgWaitTime,
        tasksLastHour: m60.metrics.task.completed,
        tasksToday: m24h.metrics.task.completed,
        abandonedToday: m24h.metrics.task.abandoned,
    };
}
```

**Available period values:**

| Value | Window |
|---|---|
| `5min` | Last 5 minutes |
| `15min` | Last 15 minutes |
| `30min` | Last 30 minutes |
| `1hour` | Last hour |
| `24hour` | Last 24 hours |

---

## Part 5 — Wrap-Up Extensions

If agents need more time to complete documentation, extend wrap-up instead of immediately making them available:

```javascript
async function requestWrapUpExtension(taskId, additionalSeconds = 60) {
    try {
        await api.taskRouter.task.wrapUpExtend({
            taskId,
            seconds: additionalSeconds,
        });
        console.log(`Wrap-up extended by ${additionalSeconds}s for task ${taskId}`);
    } catch (err) {
        if (err.status === 409) {
            // Maximum extensions reached — complete the task anyway
            console.warn('Max wrap-up extensions reached, completing task');
            await api.taskRouter.task.complete({ taskId });
        } else {
            throw err;
        }
    }
}
```

---

## Part 6 — Error Handling & Recovery

Production contact centers need robust error handling. Tasks can fail to create, workers can drop, and calls can end unexpectedly.

### Retry Task Creation on Failure

```javascript
async function createTaskWithRetry(params, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await api.taskRouter.task.create(params);
        } catch (err) {
            lastError = err;

            if (err.status === 400) {
                // Bad request — don't retry, log and use fallback
                console.error('Invalid task parameters:', err.message);
                break;
            }

            if (err.status === 503 || err.status >= 500) {
                // Server error — wait and retry
                const delay = attempt * 1000; // 1s, 2s, 3s
                console.warn(`Task creation failed (attempt ${attempt}), retrying in ${delay}ms`);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }

            throw err; // Unknown error — surface immediately
        }
    }

    // All retries failed — play hold music and alert on-call
    console.error('Task creation failed after retries:', lastError?.message);
    await sendPagerAlert('Task Router unavailable', { params, error: lastError?.message });
    throw lastError;
}
```

### Handle Agent Disconnect During a Call

If an agent's browser disconnects mid-call, you need to detect and recover:

```javascript
socket.on('disconnect', async () => {
    console.warn(`Agent WebSocket disconnected`);

    // Mark agent offline immediately to stop new task delivery
    await api.taskRouter.worker.setOffline({ userId: currentAgentId });

    // Attempt reconnect
    setTimeout(async () => {
        try {
            socket.connect();
            await api.taskRouter.worker.setAvailable({ userId: currentAgentId });
            await api.taskRouter.worker.queueAutoLogin({ userId: currentAgentId });
            console.log('Agent reconnected and available');
        } catch (err) {
            console.error('Reconnect failed:', err.message);
            showReconnectError();
        }
    }, 3000);
});
```

### Graceful Shutdown (Handle `SIGTERM`)

Ensure no tasks are orphaned when your server restarts:

```javascript
async function gracefulShutdown() {
    console.log('Shutting down — marking all agents offline');

    // Get all active workers and set them offline
    const agentIds = getActiveAgentIds(); // from your session store

    await Promise.allSettled(
        agentIds.map(userId =>
            api.taskRouter.worker.setOffline({ userId })
                .catch(err => console.error(`Failed to offline agent ${userId}:`, err.message))
        )
    );

    console.log('All agents set offline');
    process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
```

---

## Part 7 — Complete Agent UI Example

Here's a minimal but production-ready agent panel combining all the above concepts:

```javascript
class AgentPanel {
    constructor(api, userId) {
        this.api = api;
        this.userId = userId;
        this.socket = null;
        this.currentTaskId = null;
        this.sessionStartTime = null;
    }

    async start() {
        // Go available and subscribe to events
        await this.api.taskRouter.worker.setAvailable({ userId: this.userId });
        await this.api.taskRouter.worker.queueAutoLogin({ userId: this.userId });

        const { sessionId } = await this.api.subscriptions.socket.getConnection();
        this.socket = await connectAgentSocket(this.userId);
        this.sessionStartTime = Date.now();

        this.socket.on('task:assigned', (task) => this.onTaskAssigned(task));
        this.socket.on('task:cancelled', (data) => this.onTaskCancelled(data));

        console.log(`Agent ${this.userId} ready`);
    }

    async onTaskAssigned(task) {
        this.currentTaskId = task.taskId;
        console.log(`Incoming: ${task.subject} [priority ${task.priority}]`);

        // Auto-accept within 10 seconds, or show a UI prompt
        setTimeout(async () => {
            if (this.currentTaskId === task.taskId) {
                await this.accept();
            }
        }, 10_000);
    }

    onTaskCancelled(data) {
        if (this.currentTaskId === data.taskId) {
            this.currentTaskId = null;
            console.log('Task cancelled before acceptance');
        }
    }

    async accept() {
        if (!this.currentTaskId) return;
        await this.api.taskRouter.task.accept({ taskId: this.currentTaskId });
        await this.api.taskRouter.task.createCall({ taskId: this.currentTaskId });
        console.log(`Task ${this.currentTaskId} accepted`);
    }

    async reject(reason = 'busy') {
        if (!this.currentTaskId) return;
        await this.api.taskRouter.task.reject({ taskId: this.currentTaskId, reason });
        this.currentTaskId = null;
    }

    async wrapUp(summary, disposition = 'resolved') {
        if (!this.currentTaskId) return;
        await this.api.taskRouter.task.wrapUp({ taskId: this.currentTaskId });
        await this.api.taskRouter.task.update({
            taskId: this.currentTaskId,
            summary,
            disposition,
        });
    }

    async complete() {
        if (!this.currentTaskId) return;
        await this.api.taskRouter.task.complete({ taskId: this.currentTaskId });
        this.currentTaskId = null;
    }

    async end() {
        await this.api.taskRouter.worker.queueLogoutAll({ userId: this.userId });
        await this.api.taskRouter.worker.setOffline({ userId: this.userId });
        this.socket?.disconnect();
        console.log(`Agent ${this.userId} shift ended`);
    }
}
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Tasks created but no agents notified | Worker not subscribed to WebSocket | Ensure `subscriptions.socket.create` is called with `channel: 'taskRouter'` |
| Agent not receiving tasks | Worker offline or not logged into the right queue | Check `worker.get()` status and call `worker.queueLogin()` |
| Tasks stuck in `assigned` state | Agent went offline without calling `task.reject()` or `task.complete()` | Implement `SIGTERM` handler to clean up; use `worker.setOffline()` |
| Skills mismatch — tasks never route | No available workers match required skills | Verify worker skill assignments match `skills` array in task |
| Priority escalation not working | Task still in initial `created` state | Ensure task is in `queued` state before calling `changePriority` |
| Wrap-up extends but then times out | `wrapUpExtend` max reached | Catch `409` and call `task.complete()` to close gracefully |

---

## What's Next

- [Task Router API Reference](/api-reference/task-router) — every method, parameter, and response shape
- [Engagement Metrics](/api-reference/engagement-metrics) — deep analytics on queue performance
- [Real-Time Subscriptions](/guides/real-time-subscriptions) — WebSocket patterns for live event handling
- [Webhooks](/guides/webhooks) — handle inbound call and SMS events
- [Voice API Reference](/api-reference/voice) — in-call controls (mute, transfer, record)
