---
id: subscriptions
title: Subscriptions
---

# Subscriptions

`api.subscriptions` — Subscribe to realtime events from the Unbound platform via WebSocket.

## Subscribe to Events

```javascript
const sub = await api.subscriptions.subscribe({
  events: ['call.started', 'call.ended', 'message.received'],
  namespace: 'your-namespace',
});

sub.on('call.started', (event) => {
  console.log('New call:', event.callId, 'from', event.from);
});

sub.on('call.ended', (event) => {
  console.log('Call ended:', event.callId, 'duration:', event.duration);
});

sub.on('message.received', (event) => {
  console.log('Inbound SMS from', event.from, ':', event.body);
});
```

## Available Events

| Event | Description |
|---|---|
| `call.started` | Inbound or outbound call initiated |
| `call.ended` | Call completed |
| `call.transferred` | Call transferred to another destination |
| `message.received` | Inbound SMS/MMS received |
| `message.status` | Outbound message status update |
| `video.participant.joined` | Participant joined a video room |
| `video.participant.left` | Participant left a video room |
| `workflow.triggered` | Workflow execution started |
| `workflow.completed` | Workflow execution completed |
| `object.created` | CRM object created |
| `object.updated` | CRM object updated |

## Unsubscribe

```javascript
sub.unsubscribe();
```

## Browser / Svelte Usage

In browser environments, subscriptions use WebSocket transport automatically. Pass `socketStore` to your SDK constructor for optimal performance:

```javascript
import SDK from '@unboundcx/sdk';
import { socketAppStore } from '$lib/stores/socket.js';

const api = new SDK({
  namespace: 'your-namespace',
  socketStore: socketAppStore,
});

const sub = await api.subscriptions.subscribe({
  events: ['message.received'],
});
```
