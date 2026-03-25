---
id: subscriptions
title: Subscriptions
---

# Subscriptions

`api.subscriptions` — Real-time event subscriptions via WebSocket. Subscribe to platform events and react as they happen.

---

## Overview

The subscriptions service uses Socket.io under the hood. In browser environments it uses WebSocket transport automatically. Pass `socketStore` to your SDK constructor for optimized performance in Svelte/browser apps.

---

## `subscriptions.socket.getConnection(sessionId?)`

Get or create a WebSocket connection for subscriptions.

```javascript
const connection = await api.subscriptions.socket.getConnection();
// connection.sessionId → your socket session ID
// connection.endpoint → WebSocket endpoint
```

---

## `subscriptions.socket.create(sessionId, subscriptionParams)`

Subscribe to a specific event or data stream.

```javascript
const sub = await api.subscriptions.socket.create(sessionId, {
  channel: 'engagements',
  filters: {
    queueId: 'queue-id',
    status: ['new', 'working'],
  },
});
```

### Common Subscription Channels

| Channel | Description |
|---|---|
| `engagements` | Real-time engagement session updates |
| `voice` | Call state changes (ringing, answered, ended) |
| `messages` | Inbound SMS/email notifications |
| `video` | Video room participant events |
| `taskRouter` | Task assignment and worker state changes |
| `ai.transcripts` | Live STT transcript updates |
| `engagementMetrics` | Dashboard metrics refresh events |

### Example: Real-Time Engagement Feed

```javascript
import SDK from '@unboundcx/sdk';
import { io } from 'socket.io-client';

const api = new SDK({
  namespace: 'your-namespace',
  token: 'your-jwt',
});

// 1. Get connection details
const { sessionId, endpoint } = await api.subscriptions.socket.getConnection();

// 2. Connect Socket.io
const socket = io(endpoint, { withCredentials: true });

socket.on('connect', async () => {
  // 3. Subscribe to engagement updates
  await api.subscriptions.socket.create(sessionId, {
    channel: 'engagements',
  });
});

// 4. Listen for events
socket.on('engagement:updated', (data) => {
  console.log('Engagement updated:', data.id, data.status);
});

socket.on('voice:call:started', (data) => {
  console.log('Inbound call from:', data.from);
});

socket.on('message:received', (data) => {
  console.log('New SMS from:', data.from, '—', data.body);
});
```

---

## `subscriptions.socket.delete(id, sessionId)`

Unsubscribe from a specific subscription.

```javascript
await api.subscriptions.socket.delete(subscriptionId, sessionId);
```

---

## Browser / Svelte Usage

Pass `socketStore` to the SDK constructor to enable the built-in WebSocket transport — no manual Socket.io setup required:

```javascript
import SDK from '@unboundcx/sdk';
import { socketAppStore } from '$lib/stores/socket.js';

const api = new SDK({
  namespace: 'your-namespace',
  socketStore: socketAppStore,
});

// Subscribe directly — SDK handles the connection
await api.subscriptions.socket.create(sessionId, { channel: 'engagements' });
```
