---
id: real-time-subscriptions
title: Real-Time Event Subscriptions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Real-Time Event Subscriptions

Unbound pushes live events over WebSocket — call state changes, incoming messages, task assignments, live transcripts, and engagement metrics — to connected clients. This guide takes you from zero to a production-ready subscription setup with reconnection, multi-channel subscriptions, and real-world patterns for agent UIs and supervisor dashboards.

---

## How It Works

1. Call `subscriptions.socket.getConnection()` to get a session ID and Socket.io endpoint
2. Open a Socket.io connection to that endpoint
3. Call `subscriptions.socket.create(sessionId, { channel })` for each channel you want
4. Handle events in your Socket.io listeners
5. On disconnect: reconnect and call `getConnection(savedSessionId)` to resume

The session ID is your reconnect token. Save it. If the WebSocket drops, re-establish the same session and event delivery resumes from where it left off.

---

## Prerequisites

```bash
npm install socket.io-client @unboundcx/sdk
```

---

## Minimal Setup

The simplest possible subscription — one channel, no reconnection:

```javascript
import { io } from 'socket.io-client';
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });

// 1. Get a WebSocket session
const connection = await api.subscriptions.socket.getConnection();
// → { sessionId: "sess_abc123", endpoint: "https://acme.api.unbound.cx" }

// 2. Open the Socket.io connection
const socket = io(connection.endpoint, {
    auth: { token: process.env.UNBOUND_TOKEN },
    transports: ['websocket'],
});

// 3. Subscribe to a channel
socket.on('connect', async () => {
    await api.subscriptions.socket.create(connection.sessionId, {
        channel: 'voice',
    });
    console.log('Subscribed to voice events');
});

// 4. Handle events
socket.on('voice:call:ringing', (event) => {
    console.log(`Inbound call from ${event.from}`);
});

socket.on('voice:call:answered', (event) => {
    console.log(`Call answered by ${event.userId}`);
});

socket.on('voice:call:ended', (event) => {
    console.log(`Call ended after ${event.duration}s`);
});
```

---

## Production Setup with Reconnection

Real applications need to handle network drops, server restarts, and token expiry. Here is a full production-grade wrapper:

```javascript
import { io } from 'socket.io-client';
import SDK from '@unboundcx/sdk';

class UnboundSubscriptionManager {
    constructor(api) {
        this.api = api;
        this.socket = null;
        this.sessionId = null;
        this.subscriptions = [];    // { channel, filters, handler }[]
        this.reconnectDelay = 1000;
        this.maxReconnectDelay = 30000;
    }

    async connect() {
        // Reuse sessionId on reconnect so events resume seamlessly
        const connection = await this.api.subscriptions.socket.getConnection(
            this.sessionId ?? undefined,
        );
        this.sessionId = connection.sessionId;

        this.socket = io(connection.endpoint, {
            auth: { token: process.env.UNBOUND_TOKEN },
            transports: ['websocket'],
            reconnection: false,    // We manage reconnection ourselves
        });

        this.socket.on('connect', async () => {
            console.log('WebSocket connected, session:', this.sessionId);
            this.reconnectDelay = 1000;   // Reset on successful connect

            // Re-subscribe all channels after reconnect
            for (const sub of this.subscriptions) {
                await this.api.subscriptions.socket.create(this.sessionId, {
                    channel: sub.channel,
                    ...sub.filters,
                });
            }
        });

        this.socket.on('disconnect', (reason) => {
            console.warn('WebSocket disconnected:', reason);
            if (reason !== 'io client disconnect') {
                this._scheduleReconnect();
            }
        });

        this.socket.on('connect_error', (err) => {
            console.error('Connection error:', err.message);
            this._scheduleReconnect();
        });
    }

    _scheduleReconnect() {
        setTimeout(async () => {
            console.log('Reconnecting...');
            try {
                await this.connect();
            } catch (err) {
                console.error('Reconnect failed:', err.message);
                this.reconnectDelay = Math.min(
                    this.reconnectDelay * 2,
                    this.maxReconnectDelay,
                );
                this._scheduleReconnect();
            }
        }, this.reconnectDelay);
    }

    async subscribe(channel, filters = {}, handler) {
        // Register so we can re-subscribe after reconnect
        this.subscriptions.push({ channel, filters, handler });

        if (this.socket?.connected) {
            await this.api.subscriptions.socket.create(this.sessionId, {
                channel,
                ...filters,
            });
        }

        // Wire up all event listeners for this channel
        handler(this.socket);
    }

    disconnect() {
        this.socket?.disconnect();
        this.subscriptions = [];
        this.sessionId = null;
    }
}

// Usage
const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });
const manager = new UnboundSubscriptionManager(api);

await manager.connect();

manager.subscribe('voice', {}, (socket) => {
    socket.on('voice:call:ringing', (e) => console.log('Ringing:', e.from));
    socket.on('voice:call:ended', (e) => console.log('Ended:', e.duration, 's'));
});

manager.subscribe('taskRouter', { queueId: 'queue-abc' }, (socket) => {
    socket.on('taskRouter:task:assigned', (e) => console.log('Task:', e.taskId));
});
```

---

## Pattern 1 — Agent Softphone with Live Status

A full agent interface subscribes to task router events for incoming tasks and voice events for call state. This pattern shows both together:

```javascript
import { io } from 'socket.io-client';
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });

// Agent state
const state = {
    available: false,
    currentTaskId: null,
    currentCallId: null,
};

async function startAgentSession() {
    // Go available and join queues
    await api.taskRouter.worker.setAvailable();
    await api.taskRouter.worker.queueAutoLogin();
    state.available = true;

    // Open WebSocket
    const connection = await api.subscriptions.socket.getConnection();
    const socket = io(connection.endpoint, {
        auth: { token: process.env.UNBOUND_TOKEN },
        transports: ['websocket'],
    });

    socket.on('connect', async () => {
        // Subscribe to task assignments for this agent
        await api.subscriptions.socket.create(connection.sessionId, {
            channel: 'taskRouter',
        });

        // Subscribe to voice events
        await api.subscriptions.socket.create(connection.sessionId, {
            channel: 'voice',
        });

        console.log('Agent ready and subscribed');
    });

    // ── Task Router Events ────────────────────────────────────────────────

    socket.on('taskRouter:task:assigned', async (event) => {
        console.log('Incoming task:', event.taskType, '—', event.subject);
        state.currentTaskId = event.taskId;

        // Auto-accept (or show a "ring" UI and let the agent click)
        showIncomingCallUI({
            taskId: event.taskId,
            type: event.taskType,
            subject: event.subject,
            priority: event.priority,
        });
    });

    socket.on('taskRouter:task:statusChanged', (event) => {
        if (event.taskId !== state.currentTaskId) return;

        console.log(`Task status: ${event.previousStatus} → ${event.status}`);

        switch (event.status) {
            case 'connected':
                updateCallUI({ status: 'active' });
                break;
            case 'onHold':
                updateCallUI({ status: 'on-hold' });
                break;
            case 'wrapUp':
                updateCallUI({ status: 'wrap-up' });
                showWrapUpTimer(60);    // 60-second wrap-up countdown
                break;
            case 'completed':
                state.currentTaskId = null;
                state.currentCallId = null;
                clearCallUI();
                break;
        }
    });

    // ── Voice Events ──────────────────────────────────────────────────────

    socket.on('voice:call:ringing', (event) => {
        state.currentCallId = event.cdrId;
        updateCallUI({ callId: event.cdrId, from: event.from });
    });

    socket.on('voice:call:hold', (event) => {
        updateCallUI({ onHold: event.onHold });
    });

    socket.on('voice:call:ended', (event) => {
        console.log(`Call ended: ${event.duration}s, disposition: ${event.disposition}`);
        updateCallUI({ status: 'ended', duration: event.duration });
    });

    return socket;
}

async function acceptTask(taskId) {
    await api.taskRouter.task.accept({ taskId });
    // Voice call will bridge automatically — voice events will follow
}

async function endShift() {
    await api.taskRouter.worker.setOffline();
    await api.taskRouter.worker.queueLogoutAll();
    state.available = false;
}

// Stub UI helpers
function showIncomingCallUI(task) { console.log('[UI] Incoming:', task); }
function updateCallUI(updates) { console.log('[UI] Update:', updates); }
function clearCallUI() { console.log('[UI] Cleared'); }
function showWrapUpTimer(seconds) { console.log('[UI] Wrap-up timer:', seconds, 's'); }
```

---

## Pattern 2 — Supervisor Real-Time Dashboard

Supervisors need a live view of all queues: how many agents are available, how many tasks are queued, and live call durations:

```javascript
import { io } from 'socket.io-client';
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });

const QUEUE_IDS = ['queue-sales', 'queue-support', 'queue-billing'];

// Dashboard state
const dashboard = {
    queues: {},       // queueId → { agents: Map, tasks: Map }
    activeCalls: {},  // cdrId → { from, startTime, agentId }
};

for (const queueId of QUEUE_IDS) {
    dashboard.queues[queueId] = {
        agents: new Map(),  // workerId → { userId, status }
        tasks: new Map(),   // taskId → { status, subject, priority }
    };
}

async function startDashboard() {
    // Seed with current state
    const metrics = await api.engagementMetrics.getDashboardMetrics({
        queueIds: QUEUE_IDS,
    });
    console.log('Initial metrics:', metrics);

    const connection = await api.subscriptions.socket.getConnection();
    const socket = io(connection.endpoint, {
        auth: { token: process.env.UNBOUND_TOKEN },
        transports: ['websocket'],
    });

    socket.on('connect', async () => {
        // Subscribe to all target queues
        for (const queueId of QUEUE_IDS) {
            await api.subscriptions.socket.create(connection.sessionId, {
                channel: 'taskRouter',
                queueId,
            });
            await api.subscriptions.socket.create(connection.sessionId, {
                channel: 'engagementMetrics',
                queueId,
            });
        }

        // Voice events for call durations
        await api.subscriptions.socket.create(connection.sessionId, {
            channel: 'voice',
        });

        console.log('Dashboard subscribed to', QUEUE_IDS.length, 'queues');
    });

    // ── Task Router Events ────────────────────────────────────────────────

    socket.on('taskRouter:task:assigned', (event) => {
        const q = dashboard.queues[event.queueId];
        if (!q) return;
        q.tasks.set(event.taskId, {
            status: 'assigned',
            subject: event.subject,
            priority: event.priority,
            assignedAt: new Date(event.assignedAt),
        });
        renderQueue(event.queueId);
    });

    socket.on('taskRouter:task:statusChanged', (event) => {
        // Find which queue owns this task
        for (const [queueId, q] of Object.entries(dashboard.queues)) {
            if (q.tasks.has(event.taskId)) {
                if (event.status === 'completed') {
                    q.tasks.delete(event.taskId);
                } else {
                    q.tasks.get(event.taskId).status = event.status;
                }
                renderQueue(queueId);
                break;
            }
        }
    });

    socket.on('taskRouter:worker:statusChanged', (event) => {
        for (const q of Object.values(dashboard.queues)) {
            if (q.agents.has(event.workerId)) {
                q.agents.get(event.workerId).status = event.status;
            }
        }
        renderAllQueues();
    });

    // ── Voice Events ──────────────────────────────────────────────────────

    socket.on('voice:call:ringing', (event) => {
        dashboard.activeCalls[event.cdrId] = {
            from: event.from,
            startTime: Date.now(),
        };
    });

    socket.on('voice:call:answered', (event) => {
        if (dashboard.activeCalls[event.cdrId]) {
            dashboard.activeCalls[event.cdrId].agentId = event.userId;
        }
    });

    socket.on('voice:call:ended', (event) => {
        delete dashboard.activeCalls[event.cdrId];
    });

    // ── Metrics Refresh Events ────────────────────────────────────────────

    socket.on('engagementMetrics:updated', async (event) => {
        // Re-fetch metrics for the affected queue
        const updated = await api.engagementMetrics.getByQueue({
            queueIds: [event.queueId],
        });
        console.log(`Queue ${event.queueId} metrics updated:`, updated);
        renderQueue(event.queueId);
    });
}

function renderQueue(queueId) {
    const q = dashboard.queues[queueId];
    const available = [...q.agents.values()].filter(a => a.status === 'available').length;
    const pending = [...q.tasks.values()].filter(t => t.status === 'assigned').length;
    const active = [...q.tasks.values()].filter(t => t.status === 'connected').length;
    console.log(`[${queueId}] available: ${available}, pending: ${pending}, active: ${active}`);
}

function renderAllQueues() {
    for (const queueId of QUEUE_IDS) {
        renderQueue(queueId);
    }
}

await startDashboard();
```

---

## Pattern 3 — Live Transcript Display

Show real-time speech-to-text during an active call. Useful for agent assist — surface knowledge base suggestions as the customer speaks:

```javascript
import { io } from 'socket.io-client';
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });

async function startLiveTranscript(cdrId) {
    const connection = await api.subscriptions.socket.getConnection();
    const socket = io(connection.endpoint, {
        auth: { token: process.env.UNBOUND_TOKEN },
        transports: ['websocket'],
    });

    // Transcript buffer: partials overwrite, finals append
    const transcriptLines = [];
    let currentPartials = { agent: '', caller: '' };

    socket.on('connect', async () => {
        // Narrow to this specific call
        await api.subscriptions.socket.create(connection.sessionId, {
            channel: 'ai.transcripts',
            cdrId,
        });
        console.log('Transcript started for call', cdrId);
    });

    // Partial: keep replacing the working line
    socket.on('ai:transcript:partial', (event) => {
        currentPartials[event.speaker] = event.text;
        renderTranscript(transcriptLines, currentPartials);
    });

    // Final: commit to the transcript, clear partial
    socket.on('ai:transcript:final', (event) => {
        transcriptLines.push({
            speaker: event.speaker,
            text: event.text,
            confidence: event.confidence,
            startTime: event.startTime,
            endTime: event.endTime,
        });
        currentPartials[event.speaker] = '';
        renderTranscript(transcriptLines, currentPartials);

        // Trigger knowledge base suggestion if caller is speaking
        if (event.speaker === 'caller' && event.confidence > 0.85) {
            suggestKnowledgeBase(event.text);
        }
    });

    socket.on('voice:call:ended', async () => {
        console.log('Call ended — final transcript:', transcriptLines);
        socket.disconnect();

        // Optionally save the transcript
        await api.ai.stt.complete(cdrId);
    });

    return socket;
}

async function suggestKnowledgeBase(callerText) {
    // Search KB in background — don't await in the event handler
    api.knowledgeBase.search({
        kbId: 'kb-product-docs',
        query: callerText,
        limit: 3,
    }).then((results) => {
        if (results.data.length > 0) {
            console.log('[Agent Assist] Suggested articles:');
            results.data.forEach(a => console.log(' -', a.title));
        }
    }).catch(() => {});
}

function renderTranscript(lines, partials) {
    // In a real UI, update a DOM element or React state
    const output = [
        ...lines.map(l => `[${l.speaker}] ${l.text}`),
        partials.caller ? `[caller]~ ${partials.caller}` : null,
        partials.agent ? `[agent]~ ${partials.agent}` : null,
    ].filter(Boolean);
    console.clear();
    console.log(output.join('\n'));
}

// Start transcript for an active call
await startLiveTranscript('cdr-id-xyz');
```

---

## Pattern 4 — Inbound SMS Auto-Router

Receive incoming SMS messages and automatically route them to the right queue by keyword:

```javascript
import { io } from 'socket.io-client';
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });

// Keyword → queue mapping
const ROUTING_RULES = [
    { keywords: ['billing', 'invoice', 'payment', 'charge'], queueId: 'queue-billing' },
    { keywords: ['cancel', 'refund', 'return'],              queueId: 'queue-retention' },
    { keywords: ['support', 'broken', 'error', 'issue'],     queueId: 'queue-support' },
];

const DEFAULT_QUEUE = 'queue-general';

function classifyMessage(body) {
    const lower = body.toLowerCase();
    for (const rule of ROUTING_RULES) {
        if (rule.keywords.some(kw => lower.includes(kw))) {
            return rule.queueId;
        }
    }
    return DEFAULT_QUEUE;
}

async function startSmsRouter() {
    const connection = await api.subscriptions.socket.getConnection();
    const socket = io(connection.endpoint, {
        auth: { token: process.env.UNBOUND_TOKEN },
        transports: ['websocket'],
    });

    socket.on('connect', async () => {
        await api.subscriptions.socket.create(connection.sessionId, {
            channel: 'messages',
            channel: 'sms',       // filter to SMS only
            direction: 'inbound',
        });
        console.log('SMS router active');
    });

    socket.on('message:received', async (event) => {
        if (event.channel !== 'sms' || event.direction !== 'inbound') return;

        console.log(`SMS from ${event.from}: "${event.body}"`);

        const queueId = classifyMessage(event.body);
        console.log(`→ Routing to ${queueId}`);

        try {
            // Find or create contact
            const contacts = await api.objects.query({
                object: 'contacts',
                where: { phone: event.from },
                limit: 1,
            });

            let contactId = contacts.data[0]?.id;

            if (!contactId) {
                const newContact = await api.objects.create({
                    object: 'contacts',
                    body: {
                        phone: event.from,
                        name: event.from,   // Placeholder until enriched
                        source: 'sms-inbound',
                    },
                });
                contactId = newContact.id;
                console.log('Created new contact:', contactId);
            }

            // Create a task for this SMS
            await api.taskRouter.task.create({
                type: 'sms',
                queueId,
                peopleId: contactId,
                subject: `Inbound SMS: "${event.body.substring(0, 60)}${event.body.length > 60 ? '…' : ''}"`,
                createEngagement: true,
            });

            // Send an auto-reply acknowledgement
            await api.messaging.sms.send({
                from: event.to,
                to: event.from,
                message: 'Thanks for reaching out! An agent will be with you shortly.',
            });

        } catch (err) {
            console.error('Failed to route SMS:', err.message);
        }
    });
}

await startSmsRouter();
```

---

## Pattern 5 — Multi-Channel Engagement Monitor

Track all active engagements across voice, SMS, and email in a unified view. Useful for CRM integrations or unified inbox applications:

```javascript
import { io } from 'socket.io-client';
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });

// Unified engagement registry
const engagements = new Map();   // engagementId → { channel, contact, status, ... }

async function startEngagementMonitor() {
    const connection = await api.subscriptions.socket.getConnection();
    const socket = io(connection.endpoint, {
        auth: { token: process.env.UNBOUND_TOKEN },
        transports: ['websocket'],
    });

    socket.on('connect', async () => {
        // Subscribe to engagement lifecycle
        await api.subscriptions.socket.create(connection.sessionId, {
            channel: 'engagements',
        });

        // Subscribe to inbound messages
        await api.subscriptions.socket.create(connection.sessionId, {
            channel: 'messages',
        });

        // Subscribe to voice for call duration tracking
        await api.subscriptions.socket.create(connection.sessionId, {
            channel: 'voice',
        });

        console.log('Multi-channel engagement monitor running');
    });

    // ── Engagement Events ─────────────────────────────────────────────────

    socket.on('engagement:created', (event) => {
        engagements.set(event.id, {
            id: event.id,
            channel: event.channel,
            status: event.status,
            queueId: event.queueId,
            contact: event.contact,
            assignedUserId: event.assignedUserId,
            openedAt: new Date(event.createdAt),
            messages: [],
            calls: [],
        });
        onEngagementOpened(engagements.get(event.id));
    });

    socket.on('engagement:updated', (event) => {
        const eng = engagements.get(event.id);
        if (!eng) return;
        Object.assign(eng, {
            status: event.status,
            assignedUserId: event.assignedUserId ?? eng.assignedUserId,
        });
        onEngagementUpdated(eng);
    });

    socket.on('engagement:closed', (event) => {
        const eng = engagements.get(event.id);
        if (!eng) return;
        eng.status = 'closed';
        eng.closedAt = new Date(event.closedAt);
        eng.disposition = event.disposition;
        onEngagementClosed(eng);
        // Optionally keep in map for post-interaction analytics
        setTimeout(() => engagements.delete(event.id), 60 * 60 * 1000);
    });

    // ── Message Events ────────────────────────────────────────────────────

    socket.on('message:received', (event) => {
        // Associate message with open engagement if one matches
        for (const eng of engagements.values()) {
            if (
                eng.contact?.phone === event.from ||
                eng.contact?.email === event.from
            ) {
                eng.messages.push({
                    direction: 'inbound',
                    channel: event.channel,
                    body: event.body,
                    receivedAt: new Date(event.receivedAt),
                });
                onNewMessage(eng, event);
                break;
            }
        }
    });

    // ── Voice Events ──────────────────────────────────────────────────────

    socket.on('voice:call:ringing', (event) => {
        // Associate call with open engagement
        for (const eng of engagements.values()) {
            if (eng.contact?.phone === event.from) {
                eng.calls.push({
                    cdrId: event.cdrId,
                    direction: event.direction,
                    startTime: Date.now(),
                    status: 'ringing',
                });
                break;
            }
        }
    });

    socket.on('voice:call:ended', (event) => {
        for (const eng of engagements.values()) {
            const call = eng.calls.find(c => c.cdrId === event.cdrId);
            if (call) {
                call.status = 'ended';
                call.duration = event.duration;
                onCallEnded(eng, call);
                break;
            }
        }
    });
}

// ── Event Handlers (wire to your UI/CRM) ─────────────────────────────────────

function onEngagementOpened(eng) {
    console.log(`[+] ${eng.channel.toUpperCase()} engagement opened:`, eng.contact?.name);
    // Push to CRM, update unified inbox, fire webhook, etc.
}

function onEngagementUpdated(eng) {
    console.log(`[~] Engagement ${eng.id}: status=${eng.status}, agent=${eng.assignedUserId}`);
}

function onEngagementClosed(eng) {
    const durationSec = Math.round((eng.closedAt - eng.openedAt) / 1000);
    console.log(`[-] Engagement ${eng.id} closed after ${durationSec}s, disposition: ${eng.disposition}`);
}

function onNewMessage(eng, msg) {
    console.log(`[MSG] ${eng.id} ← ${msg.channel}: "${msg.body?.substring(0, 50)}"`);
}

function onCallEnded(eng, call) {
    console.log(`[CALL] ${eng.id}: ${call.duration}s`);
}

await startEngagementMonitor();
```

---

## Cleaning Up Subscriptions

When your component or process shuts down, delete the subscription and close the socket:

```javascript
async function teardown(sessionId, subscriptionId, socket) {
    try {
        // Tell the server to stop delivering to this subscription
        await api.subscriptions.socket.delete(subscriptionId, sessionId);
    } catch (err) {
        // If server is gone, the subscription expires automatically
        console.warn('Subscription delete failed:', err.message);
    }

    socket.disconnect();
    console.log('WebSocket closed');
}
```

The `id` returned by `subscriptions.socket.create()` is the `subscriptionId` to pass to `delete()`.

---

## Browser / React Usage

In a React application, manage the socket lifecycle in a context provider:

```javascript
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import SDK from '@unboundcx/sdk';

const SocketContext = createContext(null);

export function SocketProvider({ token, namespace, children }) {
    const socketRef = useRef(null);
    const sessionIdRef = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const api = new SDK({ namespace, token });
        let active = true;

        (async () => {
            try {
                const connection = await api.subscriptions.socket.getConnection(
                    sessionIdRef.current ?? undefined,
                );
                sessionIdRef.current = connection.sessionId;

                if (!active) return;

                const socket = io(connection.endpoint, {
                    auth: { token },
                    transports: ['websocket'],
                });

                socketRef.current = socket;

                socket.on('connect', () => setConnected(true));
                socket.on('disconnect', () => setConnected(false));

                // Subscribe to task events by default
                socket.on('connect', async () => {
                    await api.subscriptions.socket.create(connection.sessionId, {
                        channel: 'taskRouter',
                    });
                });

            } catch (err) {
                console.error('Socket setup failed:', err.message);
            }
        })();

        return () => {
            active = false;
            socketRef.current?.disconnect();
        };
    }, [token, namespace]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}

// In a component:
function AgentPanel() {
    const { socket, connected } = useSocket();
    const [incomingTask, setIncomingTask] = useState(null);

    useEffect(() => {
        if (!socket) return;

        const handler = (event) => setIncomingTask(event);
        socket.on('taskRouter:task:assigned', handler);

        return () => socket.off('taskRouter:task:assigned', handler);
    }, [socket]);

    return (
        <div>
            <p>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</p>
            {incomingTask && <p>Incoming: {incomingTask.subject}</p>}
        </div>
    );
}
```

---

## Troubleshooting

### Events not arriving

- Verify the subscription was created **after** the socket connected (in the `connect` handler)
- Check `sessionId` — subscriptions are bound to a session, not a socket connection
- Confirm the channel name is exact: `taskRouter`, `ai.transcripts`, `engagementMetrics`

### Events arrive then stop after disconnect

- On reconnect, call `getConnection(savedSessionId)` to resume the existing session
- After reconnect, re-subscribe all channels — subscriptions must be re-registered

### 401 on connection

- The Socket.io `auth.token` must be a valid Unbound JWT
- Token expiry during a long session requires reconnecting with a fresh token

### Events arrive but are for the wrong queue/call

- Add filters when calling `subscriptions.socket.create()`: `{ channel: 'taskRouter', queueId: 'queue-abc' }`
- Unfiltered subscriptions receive all events across the namespace

---

## Related

- [Subscriptions API Reference](/api-reference/subscriptions) — full method documentation and all event payloads
- [Task Router Quickstart](/guides/task-router-quickstart) — build a full inbound routing flow
- [Webhooks](/guides/webhooks) — HTTP-based event delivery (server-side alternative)
- [STT Streaming](/guides/stt-streaming) — live speech-to-text setup
