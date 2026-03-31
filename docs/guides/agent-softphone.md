---
id: agent-softphone
title: Build an Agent Softphone
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Build an Agent Softphone

This guide walks you through building a fully functional browser-based softphone for contact-center agents. By the end you'll have a complete integration that:

1. Authenticates an agent and bootstraps their Task Router worker
2. Subscribes to real-time task events (ring, accept, reject, complete)
3. Handles the full task lifecycle — inbound ring → accept → hold → wrap-up → complete
4. Displays live queue metrics on the agent dashboard
5. Streams real-time transcription and AI agent-assist suggestions
6. Records disposition, summary, and sentiment on wrap-up
7. Handles graceful shutdown (offline, logout-all-queues)

The code targets a React front-end with a Node.js BFF (back-end for front-end), but the patterns apply to any framework.

---

## Prerequisites

- `npm install @unboundcx/sdk`
- A provisioned Unbound namespace with at least one queue configured
- A SIP endpoint assigned to the agent's user account (for the voice leg)
- Agent user credentials or a service token with `agent` scope

---

## Architecture Overview

```
Browser (React)
  ├── AgentProvider  ← SDK singleton, worker bootstrap
  ├── SubscriptionManager ← real-time events via WebSocket
  ├── TaskCard       ← ring / connected / hold / wrapUp UI
  ├── TranscriptPanel ← live STT + AI suggestions
  └── QueueDashboard  ← poll engagement metrics

Node.js BFF (Express)
  ├── POST /api/session  ← proxy login, return token
  └── WebSocket bridge  (optional — can connect SDK directly in browser)
```

You can run the SDK directly in the browser (the SDK ships as ESM). The patterns below show the browser path with a BFF for the initial login only.

---

## Step 1 — Authenticate and Bootstrap the Worker

Every agent session starts with two operations: get a token, then create (or verify) the worker record.

```javascript
// src/agent/bootstrap.js
import SDK from '@unboundcx/sdk';

let _sdk = null;

/**
 * Initialize the SDK for an agent.
 *
 * @param {string} namespace
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ sdk: SDK, workerId: string }>}
 */
export async function bootstrapAgent(namespace, username, password) {
    const sdk = new SDK({ namespace });

    // Authenticate — stores token internally
    const session = await sdk.login.login(username, password);
    console.log('[bootstrap] logged in as', session.user.fullName);

    // Create the worker record (idempotent — safe to call every startup)
    const { workerId } = await sdk.taskRouter.worker.create();
    console.log('[bootstrap] workerId:', workerId);

    _sdk = sdk;
    return { sdk, workerId };
}

export function getSDK() {
    if (!_sdk) throw new Error('SDK not initialised — call bootstrapAgent first');
    return _sdk;
}
```

:::tip Single SDK instance
Keep a single SDK instance per browser session. Multiple instances create duplicate WebSocket connections. Use a React context (see [Step 5](#step-5--react-provider)) to share it across components.
:::

---

## Step 2 — Subscribe to Real-Time Task Events

All agent state changes (task assigned, connected, held, completed) arrive over a WebSocket subscription. Set this up before going available so you never miss an event.

### Available Task Subscription Channels

| Channel | Fires when |
|---|---|
| `taskRouter.task.assigned` | A task is routed to this worker |
| `taskRouter.task.statusChange` | Task status changes (connected, hold, wrapUp, completed) |
| `taskRouter.worker.statusChange` | Worker availability changes |
| `taskRouter.queue.metrics` | Queue stats updated (depth, wait time) |

```javascript
// src/agent/subscriptions.js
import { getSDK } from './bootstrap.js';

/**
 * Subscribe to all task events for the current agent.
 *
 * @param {string} workerId
 * @param {object} handlers
 * @param {Function} handlers.onTaskAssigned     - called when a new task rings
 * @param {Function} handlers.onTaskStatusChange - called on every status change
 * @param {Function} handlers.onWorkerStatusChange
 * @param {Function} handlers.onQueueMetrics
 * @returns {Promise<() => void>} unsubscribe function
 */
export async function subscribeAgentEvents(workerId, handlers) {
    const sdk = getSDK();

    // Get or reuse an existing socket connection
    const { sessionId } = await sdk.subscriptions.socket.getConnection();

    const sub = await sdk.subscriptions.socket.create(sessionId, {
        channels: [
            {
                channel: 'taskRouter.task.assigned',
                filter: { workerId },
            },
            {
                channel: 'taskRouter.task.statusChange',
                filter: { workerId },
            },
            {
                channel: 'taskRouter.worker.statusChange',
                filter: { workerId },
            },
            {
                channel: 'taskRouter.queue.metrics',
            },
        ],
        onMessage: (event) => {
            const { channel, data } = event;

            switch (channel) {
                case 'taskRouter.task.assigned':
                    handlers.onTaskAssigned?.(data);
                    break;
                case 'taskRouter.task.statusChange':
                    handlers.onTaskStatusChange?.(data);
                    break;
                case 'taskRouter.worker.statusChange':
                    handlers.onWorkerStatusChange?.(data);
                    break;
                case 'taskRouter.queue.metrics':
                    handlers.onQueueMetrics?.(data);
                    break;
                default:
                    console.debug('[sub] unknown channel:', channel, data);
            }
        },
    });

    console.log('[sub] subscribed, id:', sub.id);

    // Return a cleanup function
    return async () => {
        await sdk.subscriptions.socket.delete(sub.id, sessionId);
        console.log('[sub] unsubscribed');
    };
}
```

### Handling the Task Assigned Event

When a task is routed to your worker, `taskRouter.task.assigned` fires with the full task object. Your UI should immediately show the ring notification:

```javascript
function onTaskAssigned(task) {
    console.log('[ring] task assigned:', task.id, 'type:', task.type);

    // Show ring UI to the agent with a configurable ring timeout
    showRingNotification({
        taskId: task.id,
        type: task.type,                   // 'phoneCall' | 'chat' | 'email'
        subject: task.subject,
        callerNumber: task.cdrData?.from,  // for phoneCall tasks
        queueName: task.queueName,
        priority: task.priority,
    });

    // Auto-reject after 30 seconds if agent doesn't respond
    const rejectTimer = setTimeout(async () => {
        await autoReject(task.id);
    }, 30_000);

    // Store the timer so accept() can clear it
    pendingRings.set(task.id, rejectTimer);
}
```

---

## Step 3 — Task Lifecycle Operations

### Going Available / Offline

Control when the agent can receive tasks:

```javascript
// src/agent/lifecycle.js
import { getSDK } from './bootstrap.js';

/**
 * Put the agent online: auto-login all queues, then set available.
 */
export async function goOnline() {
    const sdk = getSDK();

    // Log into all queues where autoLogin = true
    await sdk.taskRouter.worker.queueAutoLogin();

    // Set worker to available — tasks will now be routed here
    const { workerId } = await sdk.taskRouter.worker.setAvailable();
    console.log('[lifecycle] agent online, workerId:', workerId);
    return workerId;
}

/**
 * Take the agent offline: stop new tasks, flush all queue memberships.
 */
export async function goOffline() {
    const sdk = getSDK();

    // Stop receiving new tasks
    await sdk.taskRouter.worker.setOffline();

    // Logout from every queue
    await sdk.taskRouter.worker.queueLogoutAll();

    console.log('[lifecycle] agent offline');
}

/**
 * Join a specific queue (e.g., overflow or specialized queue).
 */
export async function joinQueue(queueId) {
    const sdk = getSDK();
    const { userId } = await sdk.taskRouter.worker.queueLogin({ queueId });
    console.log('[lifecycle] joined queue', queueId, 'userId:', userId);
}

/**
 * Leave a specific queue.
 */
export async function leaveQueue(queueId) {
    const sdk = getSDK();
    await sdk.taskRouter.worker.queueLogout({ queueId });
    console.log('[lifecycle] left queue', queueId);
}
```

### Accepting a Task

When the agent clicks "Answer":

```javascript
/**
 * Accept an incoming task.
 *
 * @param {string} taskId
 * @param {string} [workerSipCallId] - agent's SIP call leg ID (for voice tasks)
 */
export async function acceptTask(taskId, workerSipCallId) {
    const sdk = getSDK();

    // Clear the auto-reject timer
    const timer = pendingRings.get(taskId);
    if (timer) {
        clearTimeout(timer);
        pendingRings.delete(taskId);
    }

    const result = await sdk.taskRouter.task.accept({
        taskId,
        ...(workerSipCallId && { workerSipCallId }),
    });

    console.log('[task] accepted, workerId:', result.workerId);
    return result;
}
```

### Rejecting a Task

When the agent clicks "Reject" or the ring timer fires:

```javascript
export async function rejectTask(taskId) {
    const sdk = getSDK();

    const timer = pendingRings.get(taskId);
    if (timer) {
        clearTimeout(timer);
        pendingRings.delete(taskId);
    }

    await sdk.taskRouter.task.reject({ taskId });
    console.log('[task] rejected:', taskId);
}

async function autoReject(taskId) {
    console.warn('[task] auto-rejecting unanswered task:', taskId);
    await rejectTask(taskId);
}
```

### Hold / Resume

```javascript
/**
 * Toggle hold state. Returns new status ('hold' or 'connected').
 */
export async function toggleHold(taskId) {
    const sdk = getSDK();
    const { status } = await sdk.taskRouter.task.hold({ taskId });
    console.log('[task] hold toggled → status:', status);
    return status;
}
```

### Wrap-Up and Complete

After the call ends, the agent enters wrap-up to save notes and disposition:

```javascript
/**
 * Move task to wrap-up.
 */
export async function beginWrapUp(taskId) {
    const sdk = getSDK();
    const { status } = await sdk.taskRouter.task.wrapUp({ taskId });
    console.log('[task] wrap-up started, status:', status);
    return status;
}

/**
 * Extend wrap-up time (e.g., agent requests more time).
 *
 * @param {string} taskId
 * @param {number} [seconds=60]
 */
export async function extendWrapUp(taskId, seconds = 60) {
    const sdk = getSDK();
    const { extend } = await sdk.taskRouter.task.wrapUpExtend({
        taskId,
        extend: seconds,
    });
    console.log('[task] wrap-up extended by', extend, 's');
    return extend;
}

/**
 * Save disposition and complete the task.
 *
 * @param {string} taskId
 * @param {object} wrapUpData
 * @param {string} [wrapUpData.disposition]
 * @param {string} [wrapUpData.summary]
 * @param {object} [wrapUpData.sentiment]   - { score: number, label: 'positive'|'negative'|'neutral' }
 */
export async function completeTask(taskId, wrapUpData = {}) {
    const sdk = getSDK();

    // Save disposition / notes
    if (Object.keys(wrapUpData).length > 0) {
        await sdk.taskRouter.task.update({
            taskId,
            disposition: wrapUpData.disposition,
            summary:     wrapUpData.summary,
            sentiment:   wrapUpData.sentiment,
        });
    }

    // Mark complete — removes task from routing
    await sdk.taskRouter.task.complete({ taskId });
    console.log('[task] completed:', taskId);
}
```

---

## Step 4 — Live Transcription and AI Agent Assist

For voice tasks, stream real-time transcription and surface AI suggestions. This is the same pattern used in the [AI Agent Assist guide](/guides/agent-assist), condensed here for the softphone context.

```javascript
// src/agent/transcription.js
import { getSDK } from './bootstrap.js';

/**
 * Start streaming transcription for a voice channel.
 * Returns a cleanup function.
 *
 * @param {string} voiceChannelId
 * @param {Function} onTranscript   - called with each transcript segment
 * @param {Function} onSuggestion   - called with AI-generated suggestions
 */
export async function startTranscription(voiceChannelId, onTranscript, onSuggestion) {
    const sdk = getSDK();

    // Start STT on the inbound leg (customer speech)
    await sdk.voice.transcribe(voiceChannelId, 'start', 'in', {
        // Forward final transcripts to a webhook or handle inline
        type: 'text',
        url: `${process.env.STT_WEBHOOK_URL}?channelId=${voiceChannelId}`,
    });

    // Subscribe to transcript events
    const { sessionId } = await sdk.subscriptions.socket.getConnection();
    const sub = await sdk.subscriptions.socket.create(sessionId, {
        channels: [
            {
                channel: 'voice.transcript',
                filter: { voiceChannelId },
            },
        ],
        onMessage: async (event) => {
            if (event.channel !== 'voice.transcript') return;

            const { text, isFinal } = event.data;
            onTranscript({ text, isFinal });

            // Only generate suggestions on final segments to reduce API calls
            if (isFinal && text.trim().length > 10) {
                try {
                    const { result } = await sdk.ai.run({
                        prompt: [
                            'You are an expert customer support agent assist.',
                            'The customer just said:',
                            `"${text}"`,
                            'Suggest a brief, empathetic response in 1-2 sentences.',
                        ].join(' '),
                        model: 'gpt-4o-mini',
                    });
                    onSuggestion(result);
                } catch (err) {
                    console.warn('[ai] suggestion failed:', err.message);
                }
            }
        },
    });

    // Return cleanup
    return async () => {
        await sdk.voice.transcribe(voiceChannelId, 'stop', 'in');
        await sdk.subscriptions.socket.delete(sub.id, sessionId);
    };
}
```

---

## Step 5 — React Provider

Wire everything together in a single React context that components can consume.

```javascript
// src/agent/AgentProvider.jsx
import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import SDK from '@unboundcx/sdk';

const AgentContext = createContext(null);

const INITIAL_STATE = {
    status: 'offline',       // 'offline' | 'available' | 'busy' | 'wrapUp'
    workerId: null,
    currentTask: null,       // full task object
    queueMetrics: {},        // keyed by queueId
    transcripts: [],         // { text, isFinal, timestamp }
    suggestions: [],         // AI suggestions
    error: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_WORKER':
            return { ...state, workerId: action.workerId };
        case 'SET_STATUS':
            return { ...state, status: action.status, error: null };
        case 'SET_TASK':
            return { ...state, currentTask: action.task };
        case 'CLEAR_TASK':
            return { ...state, currentTask: null, transcripts: [], suggestions: [], status: 'available' };
        case 'SET_QUEUE_METRICS':
            return {
                ...state,
                queueMetrics: { ...state.queueMetrics, [action.queueId]: action.metrics },
            };
        case 'ADD_TRANSCRIPT':
            return { ...state, transcripts: [...state.transcripts, action.entry] };
        case 'ADD_SUGGESTION':
            return { ...state, suggestions: [...state.suggestions.slice(-4), action.text] };
        case 'SET_ERROR':
            return { ...state, error: action.error };
        default:
            return state;
    }
}

export function AgentProvider({ namespace, children }) {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const sdkRef = useRef(null);
    const unsubRef = useRef(null);
    const stopTranscriptionRef = useRef(null);
    const pendingRings = useRef(new Map());

    // ── Login ──────────────────────────────────────────────────────────────
    const login = useCallback(async (username, password) => {
        const sdk = new SDK({ namespace });
        await sdk.login.login(username, password);

        const { workerId } = await sdk.taskRouter.worker.create();
        sdkRef.current = sdk;

        dispatch({ type: 'SET_WORKER', workerId });

        // Subscribe to events
        const unsub = await sdk.subscriptions.socket.getConnection()
            .then(({ sessionId }) =>
                sdk.subscriptions.socket.create(sessionId, {
                    channels: [
                        { channel: 'taskRouter.task.assigned',      filter: { workerId } },
                        { channel: 'taskRouter.task.statusChange',  filter: { workerId } },
                        { channel: 'taskRouter.queue.metrics' },
                    ],
                    onMessage: (event) => handleSubscriptionEvent(event),
                })
            )
            .then((sub) => {
                unsubRef.current = sub;
                return sub;
            });

        return { workerId };
    }, [namespace]);

    // ── Subscription handler ────────────────────────────────────────────────
    function handleSubscriptionEvent({ channel, data }) {
        if (channel === 'taskRouter.task.assigned') {
            // Task is ringing — show the ring UI
            dispatch({ type: 'SET_TASK', task: { ...data, status: 'assigned' } });
            dispatch({ type: 'SET_STATUS', status: 'ringing' });

            // Auto-reject after 30 s
            const timer = setTimeout(() => {
                reject(data.id).catch(console.error);
            }, 30_000);
            pendingRings.current.set(data.id, timer);
        }

        if (channel === 'taskRouter.task.statusChange') {
            const { taskId, status } = data;
            dispatch({ type: 'SET_TASK', task: (prev) => ({ ...prev, status }) });

            if (status === 'completed') {
                dispatch({ type: 'CLEAR_TASK' });
            } else {
                dispatch({ type: 'SET_STATUS', status });
            }
        }

        if (channel === 'taskRouter.queue.metrics') {
            dispatch({ type: 'SET_QUEUE_METRICS', queueId: data.queueId, metrics: data });
        }
    }

    // ── Worker actions ──────────────────────────────────────────────────────
    const goOnline = useCallback(async () => {
        const sdk = sdkRef.current;
        await sdk.taskRouter.worker.queueAutoLogin();
        await sdk.taskRouter.worker.setAvailable();
        dispatch({ type: 'SET_STATUS', status: 'available' });
    }, []);

    const goOffline = useCallback(async () => {
        const sdk = sdkRef.current;
        await sdk.taskRouter.worker.setOffline();
        await sdk.taskRouter.worker.queueLogoutAll();
        dispatch({ type: 'SET_STATUS', status: 'offline' });
    }, []);

    // ── Task actions ────────────────────────────────────────────────────────
    const accept = useCallback(async (taskId, workerSipCallId) => {
        const sdk = sdkRef.current;

        const timer = pendingRings.current.get(taskId);
        if (timer) {
            clearTimeout(timer);
            pendingRings.current.delete(taskId);
        }

        const result = await sdk.taskRouter.task.accept({
            taskId,
            ...(workerSipCallId && { workerSipCallId }),
        });

        dispatch({ type: 'SET_STATUS', status: 'connected' });

        // Start transcription for voice tasks
        if (state.currentTask?.type === 'phoneCall' && state.currentTask?.voiceChannelId) {
            const stopFn = await startTranscription(
                state.currentTask.voiceChannelId,
                (entry) => dispatch({ type: 'ADD_TRANSCRIPT', entry }),
                (text) => dispatch({ type: 'ADD_SUGGESTION', text }),
            );
            stopTranscriptionRef.current = stopFn;
        }

        return result;
    }, [state.currentTask]);

    const reject = useCallback(async (taskId) => {
        const sdk = sdkRef.current;

        const timer = pendingRings.current.get(taskId);
        if (timer) { clearTimeout(timer); pendingRings.current.delete(taskId); }

        await sdk.taskRouter.task.reject({ taskId });
        dispatch({ type: 'CLEAR_TASK' });
    }, []);

    const hold = useCallback(async (taskId) => {
        const sdk = sdkRef.current;
        const { status } = await sdk.taskRouter.task.hold({ taskId });
        dispatch({ type: 'SET_STATUS', status });
        return status;
    }, []);

    const wrapUp = useCallback(async (taskId) => {
        const sdk = sdkRef.current;

        // Stop transcription
        if (stopTranscriptionRef.current) {
            await stopTranscriptionRef.current();
            stopTranscriptionRef.current = null;
        }

        await sdk.taskRouter.task.wrapUp({ taskId });
        dispatch({ type: 'SET_STATUS', status: 'wrapUp' });
    }, []);

    const complete = useCallback(async (taskId, wrapUpData = {}) => {
        const sdk = sdkRef.current;

        if (Object.keys(wrapUpData).length > 0) {
            await sdk.taskRouter.task.update({ taskId, ...wrapUpData });
        }

        await sdk.taskRouter.task.complete({ taskId });
        dispatch({ type: 'CLEAR_TASK' });
    }, []);

    // ── Cleanup on unmount ──────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            goOffline().catch(console.error);
        };
    }, []);

    const value = {
        ...state,
        sdk: sdkRef.current,
        login,
        goOnline,
        goOffline,
        accept,
        reject,
        hold,
        wrapUp,
        complete,
    };

    return (
        <AgentContext.Provider value={value}>
            {children}
        </AgentContext.Provider>
    );
}

export function useAgent() {
    const ctx = useContext(AgentContext);
    if (!ctx) throw new Error('useAgent must be used within <AgentProvider>');
    return ctx;
}
```

---

## Step 6 — Queue Metrics Dashboard

Poll real-time queue metrics every 30 seconds and display them on the agent dashboard:

```javascript
// src/agent/QueueDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAgent } from './AgentProvider';

const QUEUES = [
    { id: 'queue-sales-id',   label: 'Sales'   },
    { id: 'queue-support-id', label: 'Support' },
    { id: 'queue-billing-id', label: 'Billing' },
];

const POLL_INTERVAL_MS = 30_000;

export function QueueDashboard() {
    const { sdk } = useAgent();
    const [metrics, setMetrics] = useState({});

    useEffect(() => {
        if (!sdk) return;

        async function fetchMetrics() {
            const results = await Promise.allSettled(
                QUEUES.map((q) =>
                    sdk.taskRouter.metrics.getCurrent(null, {
                        period:     '5min',
                        queueId:    q.id,
                        metricType: 'all',
                    })
                )
            );

            const next = {};
            results.forEach((r, i) => {
                if (r.status === 'fulfilled') {
                    next[QUEUES[i].id] = r.value.metrics;
                }
            });
            setMetrics(next);
        }

        fetchMetrics();
        const timer = setInterval(fetchMetrics, POLL_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [sdk]);

    return (
        <div className="queue-dashboard">
            <h3>Live Queue Status</h3>
            <table>
                <thead>
                    <tr>
                        <th>Queue</th>
                        <th>Waiting</th>
                        <th>Avg Wait</th>
                        <th>Available</th>
                        <th>Busy</th>
                    </tr>
                </thead>
                <tbody>
                    {QUEUES.map((q) => {
                        const m = metrics[q.id];
                        return (
                            <tr key={q.id}>
                                <td>{q.label}</td>
                                <td>{m?.queue?.tasksWaiting ?? '–'}</td>
                                <td>
                                    {m?.queue?.avgWaitTime
                                        ? `${m.queue.avgWaitTime.toFixed(0)}s`
                                        : '–'}
                                </td>
                                <td>{m?.worker?.available ?? '–'}</td>
                                <td>{m?.worker?.busy ?? '–'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
```

---

## Step 7 — Ring / Task Card Component

The ring notification and active task card:

```javascript
// src/agent/TaskCard.jsx
import React, { useState } from 'react';
import { useAgent } from './AgentProvider';

export function TaskCard() {
    const {
        currentTask,
        status,
        transcripts,
        suggestions,
        accept,
        reject,
        hold,
        wrapUp,
        complete,
    } = useAgent();

    const [disposition, setDisposition] = useState('');
    const [summary, setSummary] = useState('');

    if (!currentTask) return null;

    // ── Ring state ──────────────────────────────────────────────────────────
    if (status === 'ringing') {
        return (
            <div className="ring-card">
                <div className="ring-icon">📞</div>
                <div className="ring-info">
                    <strong>{currentTask.subject || 'Inbound call'}</strong>
                    <span>Queue: {currentTask.queueName}</span>
                    {currentTask.cdrData?.from && (
                        <span>From: {currentTask.cdrData.from}</span>
                    )}
                    <span>Priority: {currentTask.priority ?? 0}</span>
                </div>
                <div className="ring-actions">
                    <button
                        className="btn-accept"
                        onClick={() => accept(currentTask.id, currentTask.workerSipCallId)}
                    >
                        Answer
                    </button>
                    <button
                        className="btn-reject"
                        onClick={() => reject(currentTask.id)}
                    >
                        Reject
                    </button>
                </div>
            </div>
        );
    }

    // ── Connected state ─────────────────────────────────────────────────────
    if (status === 'connected' || status === 'hold') {
        return (
            <div className="active-task-card">
                <div className="task-header">
                    <span className={`status-badge status-${status}`}>{status}</span>
                    <strong>{currentTask.subject}</strong>
                    <span className="task-duration">
                        <TaskTimer startTime={currentTask.connectedAt} />
                    </span>
                </div>

                <div className="task-actions">
                    <button onClick={() => hold(currentTask.id)}>
                        {status === 'hold' ? 'Resume' : 'Hold'}
                    </button>
                    <button
                        className="btn-end"
                        onClick={() => wrapUp(currentTask.id)}
                    >
                        End Call
                    </button>
                </div>

                {transcripts.length > 0 && (
                    <div className="transcript-panel">
                        <h4>Live Transcript</h4>
                        <ul className="transcript-list">
                            {transcripts.slice(-5).map((t, i) => (
                                <li key={i} className={t.isFinal ? 'final' : 'interim'}>
                                    {t.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {suggestions.length > 0 && (
                    <div className="suggestions-panel">
                        <h4>💡 AI Suggestions</h4>
                        <ul>
                            {suggestions.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    // ── Wrap-up state ───────────────────────────────────────────────────────
    if (status === 'wrapUp') {
        const dispositions = [
            'resolved',
            'escalated',
            'callback-scheduled',
            'voicemail-left',
            'no-answer',
            'transferred',
            'spam',
        ];

        return (
            <div className="wrapup-card">
                <h3>Wrap-Up</h3>
                <p>Summarize the call before completing.</p>

                <label>
                    Disposition
                    <select
                        value={disposition}
                        onChange={(e) => setDisposition(e.target.value)}
                    >
                        <option value="">Select...</option>
                        {dispositions.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Summary
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Brief summary of the interaction..."
                        rows={3}
                    />
                </label>

                {/* Prefill with AI suggestion if available */}
                {suggestions.length > 0 && !summary && (
                    <button
                        className="btn-ai-fill"
                        onClick={() => setSummary(suggestions[suggestions.length - 1])}
                    >
                        Use AI Summary
                    </button>
                )}

                <div className="wrapup-actions">
                    <button
                        className="btn-extend"
                        onClick={() => extendWrapUp(currentTask.id, 60)}
                    >
                        +60s
                    </button>
                    <button
                        className="btn-complete"
                        disabled={!disposition}
                        onClick={() =>
                            complete(currentTask.id, {
                                disposition,
                                summary: summary || undefined,
                            })
                        }
                    >
                        Complete
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

function TaskTimer({ startTime }) {
    const [elapsed, setElapsed] = React.useState(0);

    React.useEffect(() => {
        if (!startTime) return;
        const start = new Date(startTime).getTime();
        const timer = setInterval(() => {
            setElapsed(Math.floor((Date.now() - start) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return <span>{m}:{String(s).padStart(2, '0')}</span>;
}
```

---

## Step 8 — Escalation: Boost Priority and Update Skills

Allow supervisors to escalate a task from their dashboard:

```javascript
// src/supervisor/escalate.js
import { getSDK } from '../agent/bootstrap.js';

/**
 * Escalate a task — boost priority and add supervisor skill requirement.
 *
 * @param {string} taskId
 * @param {string} reason  - escalation reason (stored in subject)
 */
export async function escalateTask(taskId, reason) {
    const sdk = getSDK();

    await Promise.all([
        // Jump to front of queue
        sdk.taskRouter.task.changePriority({
            taskId,
            action: 'set',
            value:  100,
        }),

        // Require a supervisor
        sdk.taskRouter.task.updateSkills({
            taskId,
            skills:   'supervisor',
            action:   'add',
            required: true,
        }),

        // Update subject for visibility
        sdk.taskRouter.task.update({
            taskId,
            subject:     `[ESCALATED] ${reason}`,
            disposition: 'escalated',
        }),
    ]);

    console.log('[escalate] task', taskId, 'escalated:', reason);
}
```

---

## Step 9 — Post-Call Note Saved to CRM

After wrap-up completes, save the summary as a note on the contact record:

```javascript
// src/agent/postCall.js
import { getSDK } from './bootstrap.js';

/**
 * Save a structured post-call note to the contact's record.
 *
 * @param {string} contactId
 * @param {object} callData
 * @param {string} callData.taskId
 * @param {string} callData.disposition
 * @param {string} callData.summary
 * @param {string} callData.agentName
 * @param {string} callData.duration     - human-readable, e.g. "4:23"
 * @param {string[]} callData.transcriptSnippets
 */
export async function savePostCallNote(contactId, callData) {
    const sdk = getSDK();

    const htmlContent = `
        <div class="call-note">
            <p><strong>Disposition:</strong> ${callData.disposition}</p>
            <p><strong>Duration:</strong> ${callData.duration}</p>
            <p><strong>Agent:</strong> ${callData.agentName}</p>
            <hr />
            <p>${callData.summary || 'No summary provided.'}</p>
            ${callData.transcriptSnippets?.length
                ? `<details>
                       <summary>Transcript snippets</summary>
                       <ul>${callData.transcriptSnippets.map((t) => `<li>${t}</li>`).join('')}</ul>
                   </details>`
                : ''}
        </div>
    `;

    const note = await sdk.notes.create({
        relatedId:  contactId,
        title:      `Call — ${new Date().toLocaleDateString()} — ${callData.disposition}`,
        content_html: htmlContent,
    });

    console.log('[note] saved note:', note.id);
    return note.id;
}
```

---

## Complete Application Wiring

Put it all together in `App.jsx`:

```javascript
// src/App.jsx
import React from 'react';
import { AgentProvider } from './agent/AgentProvider';
import { LoginForm }      from './agent/LoginForm';
import { AgentToolbar }   from './agent/AgentToolbar';
import { TaskCard }       from './agent/TaskCard';
import { QueueDashboard } from './agent/QueueDashboard';

export default function App() {
    return (
        <AgentProvider namespace={import.meta.env.VITE_UNBOUND_NAMESPACE}>
            <AppShell />
        </AgentProvider>
    );
}

function AppShell() {
    const { workerId, login } = useAgent();

    if (!workerId) {
        return <LoginForm onLogin={login} />;
    }

    return (
        <div className="softphone-shell">
            <AgentToolbar />      {/* online/offline toggle, queue selector */}
            <TaskCard />          {/* ring → connected → wrapUp → complete */}
            <QueueDashboard />    {/* live queue depth, wait time, agent counts */}
        </div>
    );
}
```

---

## Error Handling

Agent softphone errors come in three categories:

| Category | Examples | Recovery |
|---|---|---|
| **Network / 503** | WebSocket dropped, API unreachable | Exponential backoff + reconnect |
| **Auth / 401** | Token expired mid-session | Re-login flow, preserve pending task state |
| **Task conflict / 409** | Accept race (task already taken) | Show "Task no longer available" and dismiss ring |

```javascript
// Wrap every task action with graceful handling
async function safeAccept(taskId, sipCallId) {
    try {
        await accept(taskId, sipCallId);
    } catch (err) {
        if (err.status === 409) {
            // Another worker accepted first
            dispatch({ type: 'CLEAR_TASK' });
            showToast('Task was already accepted by another agent.');
        } else if (err.status === 404) {
            // Task expired or was cancelled
            dispatch({ type: 'CLEAR_TASK' });
            showToast('Task is no longer available.');
        } else if (err.status === 401) {
            // Re-login and retry once
            await reAuthenticate();
            await accept(taskId, sipCallId);
        } else {
            console.error('[task] accept failed:', err);
            showToast('Failed to accept task. Please try again.');
        }
    }
}
```

---

## Production Checklist

Before deploying your softphone to agents:

- [ ] **Idle timeout** — Call `setOffline()` automatically after N minutes of inactivity
- [ ] **Page unload** — Attach a `beforeunload` listener that calls `goOffline()` synchronously (best-effort)
- [ ] **Reconnect logic** — Detect WebSocket disconnect and resubscribe with backoff
- [ ] **Duplicate prevention** — Ensure only one `accept()` call per task ID (debounce the Answer button)
- [ ] **Ring audio** — Play an audible ring tone while `status === 'ringing'` using the Web Audio API
- [ ] **Presence sync** — Mirror Task Router status to your HR/CRM system via `taskRouter.worker.statusChange` events
- [ ] **Wrap-up timer** — Display a countdown to agents in wrap-up so they don't miss the auto-complete deadline
- [ ] **Queue membership persistence** — Store queue preferences in `localStorage` and re-apply on reconnect
- [ ] **Supervisor visibility** — Expose a read-only dashboard showing all worker statuses via `engagementMetrics.getDashboardMetrics()`

---

## Related Resources

- [Task Router API Reference](/api-reference/task-router) — full method reference for workers, tasks, and metrics
- [Subscriptions API Reference](/api-reference/subscriptions) — WebSocket channel reference and reconnect patterns
- [AI Agent Assist Guide](/guides/agent-assist) — deeper coverage of real-time STT + KB search
- [Outbound Campaign Guide](/guides/outbound-campaign) — full outbound dialer built on the same primitives
- [Engagement Metrics API Reference](/api-reference/engagement-metrics) — supervisor dashboard metrics
