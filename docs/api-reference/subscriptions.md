---
id: subscriptions
title: Subscriptions
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Subscriptions

`api.subscriptions` — Real-time event subscriptions via WebSocket. Subscribe to platform events and react as they happen — task assignments, call state changes, inbound messages, live transcripts, and more.

---

## Overview

The subscriptions service uses Socket.io under the hood. In browser environments it uses WebSocket transport automatically. Pass `socketStore` to your SDK constructor for optimized performance in Svelte/browser apps.

**Base URL:** `https://{namespace}.api.unbound.cx`

**Authentication:** `Authorization: Bearer {token}`

### How It Works

1. Call `getConnection()` to get a `sessionId` and `endpoint`
2. Connect to the endpoint with Socket.io
3. Call `socket.create()` to register one or more channel subscriptions
4. Listen for events on the socket

The `sessionId` ties your socket connection to your subscriptions. Keep it alive for the duration of the session.

---

## `subscriptions.socket.getConnection(sessionId?)`

Get or create a WebSocket connection for subscriptions. If `sessionId` is provided, rejoins an existing session (useful after a disconnect).

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// New connection
const connection = await api.subscriptions.socket.getConnection();
console.log(connection.sessionId);   // "sess_abc123"
console.log(connection.endpoint);    // "https://{namespace}.api.unbound.cx"

// Re-attach to existing session after reconnect
const connection = await api.subscriptions.socket.getConnection('sess_abc123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// New connection
const res = await fetch("https://{namespace}.api.unbound.cx/subscription/socket/connection", {
    method: "GET",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" }
});
const data = await res.json();
// data.sessionId, data.endpoint

// Re-attach to existing session
const res = await fetch("https://{namespace}.api.unbound.cx/subscription/socket/connection?sessionId=sess_abc123", {
    method: "GET",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// New connection
$ch = curl_init("https://{namespace}.api.unbound.cx/subscription/socket/connection");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
$response = json_decode(curl_exec($ch), true);
// $response['sessionId'], $response['endpoint']
curl_close($ch);

// Re-attach to existing session
$ch = curl_init("https://{namespace}.api.unbound.cx/subscription/socket/connection?sessionId=sess_abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# New connection
response = requests.get(
    "https://{namespace}.api.unbound.cx/subscription/socket/connection",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
# data['sessionId'], data['endpoint']

# Re-attach to existing session
response = requests.get(
    "https://{namespace}.api.unbound.cx/subscription/socket/connection",
    headers={"Authorization": "Bearer {token}"},
    params={"sessionId": "sess_abc123"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# New connection
curl -X GET "https://{namespace}.api.unbound.cx/subscription/socket/connection" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"

# Re-attach to existing session
curl -X GET "https://{namespace}.api.unbound.cx/subscription/socket/connection?sessionId=sess_abc123" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

</TabItem>
</Tabs>

**Response shape**

```javascript
{
    sessionId: "sess_abc123",      // use for all subsequent socket calls
    endpoint: "https://{namespace}.api.unbound.cx",
}
```

---

## `subscriptions.socket.create(sessionId, subscriptionParams)`

Register a subscription on an active socket session. A subscription ties a `channel` to your `sessionId` — the server will route matching events to your socket connection. You can hold multiple subscriptions per session by calling `create()` multiple times with different channels.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Subscribe to all engagement updates
const sub = await api.subscriptions.socket.create(sessionId, {
    channel: 'engagements',
});

// Subscribe to engagement updates filtered by queue
const sub = await api.subscriptions.socket.create(sessionId, {
    channel: 'engagements',
    filters: {
        queueId: 'queue-id',
        status: ['new', 'working'],
    },
});

// Subscribe to task router events for this user
const sub = await api.subscriptions.socket.create(sessionId, {
    channel: 'taskRouter',
});

// Subscribe to live AI transcripts for a specific call
const sub = await api.subscriptions.socket.create(sessionId, {
    channel: 'ai.transcripts',
    filters: { cdrId: 'cdr-id' },
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/subscription/socket", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
    body: JSON.stringify({
        sessionId: "{sessionId}",
        channel: "engagements",
        filters: {
            queueId: "queue-id",
            status: ["new", "working"]
        }
    })
});
const data = await res.json();
// data.id — subscription ID for later deletion
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/subscription/socket");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "sessionId" => "{sessionId}",
    "channel" => "engagements",
    "filters" => [
        "queueId" => "queue-id",
        "status" => ["new", "working"]
    ]
]));
$response = json_decode(curl_exec($ch), true);
// $response['id'] — subscription ID
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/subscription/socket",
    headers={"Authorization": "Bearer {token}"},
    json={
        "sessionId": "{sessionId}",
        "channel": "engagements",
        "filters": {
            "queueId": "queue-id",
            "status": ["new", "working"]
        }
    }
)
data = response.json()
# data['id'] — subscription ID
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "sessionId": "{sessionId}",
  "channel": "engagements",
  "filters": {
    "queueId": "queue-id",
    "status": ["new", "working"]
  }
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/subscription/socket" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | ✅ | Session ID from `getConnection()` |
| `channel` | string | ✅ | Event channel to subscribe to (see table below) |
| `filters` | object | — | Channel-specific filter criteria |

**Response shape**

```javascript
{
    id: "sub_xyz789",        // subscription ID — pass to delete() to unsubscribe
    sessionId: "sess_abc123",
    channel: "engagements",
    filters: { queueId: "queue-id" }
}
```

---

## Subscription Channels

### Channel Reference

| Channel | Description | Requires Filter? |
|---|---|---|
| `engagements` | Engagement session create/update/close events | Recommended: `queueId` or `status` |
| `voice` | Call state changes: ringing, answered, on hold, ended | Optional: `cdrId` |
| `messages` | Inbound/outbound SMS and email events | Optional: `channel` (`sms`/`email`) |
| `video` | Video room participant join/leave events | Optional: `roomId` |
| `taskRouter` | Task assignment, status changes, worker state | Optional: `queueId` |
| `ai.transcripts` | Live speech-to-text transcript fragments | Recommended: `cdrId` |
| `engagementMetrics` | Dashboard metrics refresh events | Optional: `queueId` |

---

### `engagements` Channel

Subscribe to engagement lifecycle events. An engagement represents an active customer interaction session.

**Available filters**

| Filter | Type | Description |
|---|---|---|
| `queueId` | string | Only events for engagements in this queue |
| `status` | string or string[] | Filter by status: `new`, `working`, `closed` |
| `userId` | string | Only engagements assigned to this user |

**Event payloads**

```javascript
// engagement:created — new engagement opened
socket.on('engagement:created', (event) => {
    // event shape:
    // {
    //     id: "eng_001",
    //     status: "new",
    //     channel: "voice" | "sms" | "email" | "chat",
    //     queueId: "queue-id",
    //     assignedUserId: "user-id" | null,
    //     createdAt: "2026-03-27T04:00:00Z",
    //     contact: { id: "contact-id", name: "Jane Smith", phone: "+13175551234" }
    // }
    console.log('New engagement:', event.id, event.channel);
});

// engagement:updated — status or assignment changed
socket.on('engagement:updated', (event) => {
    // {
    //     id: "eng_001",
    //     status: "working",
    //     assignedUserId: "user-id",
    //     updatedAt: "2026-03-27T04:01:00Z"
    // }
    console.log('Engagement updated:', event.id, '→', event.status);
});

// engagement:closed — interaction completed
socket.on('engagement:closed', (event) => {
    // { id: "eng_001", closedAt: "2026-03-27T04:05:00Z", disposition: "resolved" }
    console.log('Engagement closed:', event.id);
});
```

---

### `voice` Channel

Subscribe to call state changes across the platform.

**Available filters**

| Filter | Type | Description |
|---|---|---|
| `cdrId` | string | Narrow to a single call by its CDR ID |
| `userId` | string | Only calls involving this user |

**Event payloads**

```javascript
// voice:call:ringing — inbound call arriving
socket.on('voice:call:ringing', (event) => {
    // {
    //     cdrId: "cdr-id",
    //     from: "+13175551234",
    //     to: "+13175559876",
    //     direction: "inbound",
    //     timestamp: "2026-03-27T04:00:00Z"
    // }
    console.log('Ringing:', event.from, '→', event.to);
});

// voice:call:answered
socket.on('voice:call:answered', (event) => {
    // { cdrId: "cdr-id", answeredAt: "2026-03-27T04:00:05Z", userId: "agent-user-id" }
    console.log('Answered by:', event.userId);
});

// voice:call:hold — call placed on hold
socket.on('voice:call:hold', (event) => {
    // { cdrId: "cdr-id", onHold: true, timestamp: "2026-03-27T04:02:00Z" }
});

// voice:call:ended
socket.on('voice:call:ended', (event) => {
    // {
    //     cdrId: "cdr-id",
    //     duration: 185,          // seconds
    //     endedAt: "2026-03-27T04:03:05Z",
    //     disposition: "completed"
    // }
    console.log('Call ended, duration:', event.duration, 's');
});

// voice:call:transferred
socket.on('voice:call:transferred', (event) => {
    // { cdrId: "cdr-id", fromUserId: "agent-id", toUserId: "supervisor-id" | toQueue: "queue-id" }
});
```

---

### `messages` Channel

Subscribe to inbound and outbound messaging events (SMS and email).

**Available filters**

| Filter | Type | Description |
|---|---|---|
| `channel` | string | `sms` or `email` |
| `direction` | string | `inbound` or `outbound` |
| `phoneNumber` | string | Filter to a specific DID |

**Event payloads**

```javascript
// message:received — inbound message
socket.on('message:received', (event) => {
    // {
    //     id: "msg-id",
    //     channel: "sms",
    //     direction: "inbound",
    //     from: "+13175551234",
    //     to: "+13175559876",
    //     body: "Hi, I need help with my order",
    //     mediaUrl: null,        // present for MMS
    //     receivedAt: "2026-03-27T04:00:00Z"
    // }
    console.log('SMS from:', event.from, '—', event.body);
});

// message:sent — outbound message delivered
socket.on('message:sent', (event) => {
    // { id: "msg-id", channel: "sms", to: "+13175551234", status: "delivered", sentAt: "..." }
});

// message:failed — delivery failure
socket.on('message:failed', (event) => {
    // { id: "msg-id", channel: "sms", to: "+13175551234", error: "invalid_number", failedAt: "..." }
    console.error('Message failed:', event.error);
});
```

---

### `taskRouter` Channel

Subscribe to task routing events — assignments, status changes, and worker state updates.

**Available filters**

| Filter | Type | Description |
|---|---|---|
| `queueId` | string | Only events for tasks in this queue |
| `userId` | string | Only events for tasks assigned to this user |
| `workerId` | string | Only events for this specific worker |

**Event payloads**

```javascript
// taskRouter:task:assigned — task offered to a worker
socket.on('taskRouter:task:assigned', (event) => {
    // {
    //     taskId: "task-id",
    //     workerId: "worker-id",
    //     userId: "user-id",
    //     queueId: "queue-id",
    //     taskType: "phoneCall",
    //     priority: 3,
    //     subject: "Inbound sales call",
    //     assignedAt: "2026-03-27T04:00:00Z"
    // }
    console.log('Task offered:', event.taskId, 'type:', event.taskType);
});

// taskRouter:task:statusChanged — task lifecycle change
socket.on('taskRouter:task:statusChanged', (event) => {
    // {
    //     taskId: "task-id",
    //     status: "connected",           // new status
    //     previousStatus: "assigned",    // previous status
    //     workerId: "worker-id",
    //     timestamp: "2026-03-27T04:00:10Z"
    // }
    console.log(`Task ${event.taskId}: ${event.previousStatus} → ${event.status}`);
});

// taskRouter:worker:statusChanged — worker availability changed
socket.on('taskRouter:worker:statusChanged', (event) => {
    // {
    //     workerId: "worker-id",
    //     userId: "user-id",
    //     status: "available" | "busy" | "offline",
    //     timestamp: "2026-03-27T04:00:00Z"
    // }
    console.log('Worker', event.userId, 'is now', event.status);
});
```

---

### `ai.transcripts` Channel

Subscribe to live speech-to-text transcript fragments as they're generated during an active call.

**Available filters**

| Filter | Type | Description |
|---|---|---|
| `cdrId` | string | Recommended — narrow to a specific call |

**Event payloads**

```javascript
// ai:transcript:partial — interim (non-final) transcript
socket.on('ai:transcript:partial', (event) => {
    // {
    //     cdrId: "cdr-id",
    //     speaker: "agent" | "caller",
    //     text: "I can help you with",    // partial — may change
    //     timestamp: "2026-03-27T04:01:15Z"
    // }
    updatePartialTranscript(event.speaker, event.text);
});

// ai:transcript:final — committed transcript segment
socket.on('ai:transcript:final', (event) => {
    // {
    //     cdrId: "cdr-id",
    //     speaker: "agent" | "caller",
    //     text: "I can help you with your billing question.",
    //     confidence: 0.96,
    //     startTime: 12.4,     // seconds from call start
    //     endTime: 15.1,
    //     timestamp: "2026-03-27T04:01:15Z"
    // }
    appendToTranscript(event.speaker, event.text);
});
```

---

### `engagementMetrics` Channel

Subscribe to metrics refresh events — useful for keeping dashboard widgets up to date without polling.

**Event payloads**

```javascript
// engagementMetrics:updated
socket.on('engagementMetrics:updated', (event) => {
    // {
    //     queueId: "queue-id",
    //     period: "5min",
    //     metrics: {
    //         tasksWaiting: 3,
    //         tasksConnected: 7,
    //         avgWaitTime: 42.5,
    //         agentsAvailable: 5
    //     },
    //     updatedAt: "2026-03-27T04:05:00Z"
    // }
    updateDashboard(event.queueId, event.metrics);
});
```

---

### `video` Channel

Subscribe to real-time events in video meeting rooms: participant join/leave, media state changes, recording updates, and chat activity.

**Available filters**

| Filter | Type | Description |
|---|---|---|
| `roomId` | string | Narrow to a single room's events |
| `participantId` | string | Only events for a specific participant |

**Event payloads**

```javascript
// video:participant:joined — participant entered the room
socket.on('video:participant:joined', (event) => {
    // {
    //     roomId: "room-xyz789",
    //     participantId: "p-abc123",
    //     name: "Alice Smith",
    //     email: "alice@example.com",
    //     role: "host" | "participant",
    //     joinedAt: "2026-03-27T14:02:30Z"
    // }
    addParticipantToGrid(event);
});

// video:participant:left — participant disconnected
socket.on('video:participant:left', (event) => {
    // {
    //     roomId: "room-xyz789",
    //     participantId: "p-abc123",
    //     leftAt: "2026-03-27T14:45:00Z",
    //     duration: 2550      // seconds in room
    // }
    removeParticipantFromGrid(event.participantId);
});

// video:participant:updated — role, mute state, etc.
socket.on('video:participant:updated', (event) => {
    // {
    //     roomId: "room-xyz789",
    //     participantId: "p-abc123",
    //     changes: {
    //         role: "host",                // if role changed
    //         isCameraMuted: true,         // if camera state changed
    //         isMicrophoneMuted: false,    // if mic state changed
    //     },
    //     updatedAt: "2026-03-27T14:10:00Z"
    // }
    updateParticipantUI(event.participantId, event.changes);
});

// video:room:recording:started
socket.on('video:room:recording:started', (event) => {
    // {
    //     roomId: "room-xyz789",
    //     startedAt: "2026-03-27T14:03:00Z",
    //     startedBy: "p-abc123"
    // }
    showRecordingIndicator();
});

// video:room:recording:stopped
socket.on('video:room:recording:stopped', (event) => {
    // {
    //     roomId: "room-xyz789",
    //     stoppedAt: "2026-03-27T14:45:00Z",
    //     duration: 2520      // seconds of recording
    // }
    hideRecordingIndicator();
});

// video:room:closed — host ended the meeting for all
socket.on('video:room:closed', (event) => {
    // {
    //     roomId: "room-xyz789",
    //     closedAt: "2026-03-27T14:45:00Z",
    //     closedBy: "p-abc123"
    // }
    redirectToMeetingEndPage();
});

// video:chat:message:created — new in-meeting chat message
socket.on('video:chat:message:created', (event) => {
    // {
    //     roomId: "room-xyz789",
    //     messageId: "msg-abc123",
    //     participantId: "p-abc123",
    //     participantName: "Alice Smith",
    //     content: [...],    // TipTap JSON
    //     createdAt: "2026-03-27T14:20:00Z"
    // }
    appendChatMessage(event);
});

// video:chat:message:deleted
socket.on('video:chat:message:deleted', (event) => {
    // {
    //     roomId: "room-xyz789",
    //     messageId: "msg-abc123",
    //     deletedAt: "2026-03-27T14:21:00Z"
    // }
    removeChatMessage(event.messageId);
});
```

---

## TypeScript Interfaces

Use these interfaces when building typed applications with the subscriptions API.

```typescript
// Connection result from getConnection()
interface SocketConnection {
    sessionId: string;
    endpoint: string;
}

// Subscription result from socket.create()
interface SocketSubscription {
    id: string;
    sessionId: string;
    channel: SubscriptionChannel;
    filters?: Record<string, string | string[]>;
    createdAt: string;
}

type SubscriptionChannel =
    | 'engagements'
    | 'voice'
    | 'messages'
    | 'video'
    | 'taskRouter'
    | 'ai.transcripts'
    | 'engagementMetrics';

// ─── Engagement events ────────────────────────────────────────────────────────
interface EngagementContact {
    id: string;
    name: string;
    phone?: string;
    email?: string;
}

interface EngagementCreatedEvent {
    id: string;
    status: 'new';
    channel: 'voice' | 'sms' | 'email' | 'chat';
    queueId: string;
    assignedUserId: string | null;
    createdAt: string;
    contact: EngagementContact;
}

interface EngagementUpdatedEvent {
    id: string;
    status: 'new' | 'working' | 'closed';
    assignedUserId: string | null;
    updatedAt: string;
}

interface EngagementClosedEvent {
    id: string;
    closedAt: string;
    disposition?: string;
}

// ─── Voice events ─────────────────────────────────────────────────────────────
interface CallRingingEvent {
    cdrId: string;
    from: string;
    to: string;
    direction: 'inbound' | 'outbound';
    timestamp: string;
}

interface CallAnsweredEvent {
    cdrId: string;
    answeredAt: string;
    userId: string;
}

interface CallHoldEvent {
    cdrId: string;
    onHold: boolean;
    timestamp: string;
}

interface CallEndedEvent {
    cdrId: string;
    duration: number;            // seconds
    endedAt: string;
    disposition: string;
}

interface CallTransferredEvent {
    cdrId: string;
    fromUserId: string;
    toUserId?: string;
    toQueue?: string;
}

// ─── Message events ───────────────────────────────────────────────────────────
interface MessageReceivedEvent {
    id: string;
    channel: 'sms' | 'email';
    direction: 'inbound';
    from: string;
    to: string;
    body: string;
    mediaUrl?: string;
    receivedAt: string;
}

interface MessageSentEvent {
    id: string;
    channel: 'sms' | 'email';
    to: string;
    status: 'delivered' | 'sent';
    sentAt: string;
}

interface MessageFailedEvent {
    id: string;
    channel: 'sms' | 'email';
    to: string;
    error: string;
    failedAt: string;
}

// ─── Task Router events ───────────────────────────────────────────────────────
type TaskStatus = 'pending' | 'assigned' | 'connected' | 'hold' | 'wrapUp' | 'completed' | 'rejected';
type WorkerStatus = 'available' | 'busy' | 'offline';

interface TaskAssignedEvent {
    taskId: string;
    workerId: string;
    userId: string;
    queueId: string;
    taskType: string;
    priority: number;
    subject: string;
    assignedAt: string;
}

interface TaskStatusChangedEvent {
    taskId: string;
    status: TaskStatus;
    previousStatus: TaskStatus;
    workerId: string;
    queueId?: string;
    timestamp: string;
}

interface WorkerStatusChangedEvent {
    workerId: string;
    userId: string;
    status: WorkerStatus;
    timestamp: string;
}

// ─── AI Transcript events ─────────────────────────────────────────────────────
interface TranscriptPartialEvent {
    cdrId: string;
    speaker: 'agent' | 'caller';
    text: string;
    timestamp: string;
}

interface TranscriptFinalEvent {
    cdrId: string;
    speaker: 'agent' | 'caller';
    text: string;
    confidence: number;
    startTime: number;    // seconds from call start
    endTime: number;
    timestamp: string;
}

// ─── Engagement Metrics events ────────────────────────────────────────────────
interface MetricsSnapshot {
    tasksWaiting: number;
    tasksConnected: number;
    avgWaitTime: number;
    agentsAvailable: number;
}

interface EngagementMetricsUpdatedEvent {
    queueId: string;
    period: '1min' | '5min' | '15min';
    metrics: MetricsSnapshot;
    updatedAt: string;
}

// ─── Video events ─────────────────────────────────────────────────────────────
type VideoParticipantRole = 'host' | 'participant';

interface VideoParticipantJoinedEvent {
    roomId: string;
    participantId: string;
    name: string;
    email?: string;
    role: VideoParticipantRole;
    joinedAt: string;
}

interface VideoParticipantLeftEvent {
    roomId: string;
    participantId: string;
    leftAt: string;
    duration: number;    // seconds
}

interface VideoParticipantUpdatedEvent {
    roomId: string;
    participantId: string;
    changes: {
        role?: VideoParticipantRole;
        isCameraMuted?: boolean;
        isMicrophoneMuted?: boolean;
    };
    updatedAt: string;
}

interface VideoRoomClosedEvent {
    roomId: string;
    closedAt: string;
    closedBy: string;    // participantId of host who closed
}

interface VideoChatMessageCreatedEvent {
    roomId: string;
    messageId: string;
    participantId: string;
    participantName: string;
    content: Array<Record<string, unknown>>;    // TipTap JSON
    createdAt: string;
}
```

---

## Error Handling

### Connection Errors

Socket.io surfaces connection failures as `connect_error` events. Common causes:

| Error | Cause | Resolution |
|---|---|---|
| `401 Unauthorized` | Expired or missing auth token | Refresh token and reconnect |
| `403 Forbidden` | Token lacks subscription scope | Check API key permissions |
| `429 Too Many Requests` | Too many concurrent connections | Reduce concurrent connections; reuse sessions |
| `transport error` | Network timeout or unstable connection | Socket.io auto-reconnects; also check for firewall blocking WebSocket |

```javascript
socket.on('connect_error', (err) => {
    const message = err.message.toLowerCase();

    if (message.includes('401') || message.includes('unauthorized')) {
        // Token likely expired — refresh and reconnect
        refreshTokenAndReconnect();
    } else if (message.includes('429')) {
        // Rate limited — back off before reconnecting
        setTimeout(() => socket.connect(), 5000);
    } else {
        console.error('Socket connection error:', err.message);
    }
});
```

### Subscription Errors

`socket.create()` can fail if a channel name is invalid or filters reference a non-existent resource. Always wrap subscription calls:

```javascript
async function safeSubscribe(sessionId, channelConfig) {
    try {
        const sub = await api.subscriptions.socket.create(sessionId, channelConfig);
        return sub;
    } catch (err) {
        if (err.status === 400) {
            console.error('Invalid subscription params:', channelConfig);
        } else if (err.status === 404) {
            console.error('Queue/resource not found:', channelConfig.filters);
        } else {
            throw err;
        }
        return null;
    }
}
```

### Token Expiry and Reconnection

Auth tokens expire while the socket is live. The connection drops with a `401`. The safe pattern is to refresh the token before expiry and reconnect proactively:

```javascript
function scheduleTokenRefresh(expiresAt) {
    const refreshBuffer = 60 * 1000;   // refresh 60s before expiry
    const delay = new Date(expiresAt).getTime() - Date.now() - refreshBuffer;

    setTimeout(async () => {
        const { token } = await refreshAuthToken();
        // SDK picks up the new token automatically when you reconnect
        socket.disconnect();
        await connect();
    }, Math.max(delay, 0));
}
```

---

## `subscriptions.socket.delete(id, sessionId)`

Unsubscribe from a specific subscription. The socket connection remains alive; only this channel subscription is removed.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.subscriptions.socket.delete(subscriptionId, sessionId);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/subscription/socket/{subscriptionId}", {
    method: "DELETE",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: "{sessionId}" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/subscription/socket/{subscriptionId}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["sessionId" => "{sessionId}"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    "https://{namespace}.api.unbound.cx/subscription/socket/{subscriptionId}",
    headers={"Authorization": "Bearer {token}"},
    json={"sessionId": "{sessionId}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/subscription/socket/{subscriptionId}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "{sessionId}"}'
```

</TabItem>
</Tabs>

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

---

## Common Patterns

### Pattern 1 — Full Setup with Reconnection

Production-ready Socket.io setup with automatic reconnect, re-subscription, and error handling:

```javascript
import SDK from '@unboundcx/sdk';
import { io } from 'socket.io-client';

const api = new SDK({ namespace: 'your-namespace', token: 'your-jwt' });

let socket = null;
let sessionId = null;
const subscriptionIds = [];

async function connect() {
    // 1. Get connection details
    const conn = await api.subscriptions.socket.getConnection();
    sessionId = conn.sessionId;

    // 2. Open socket
    socket = io(conn.endpoint, {
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
    });

    socket.on('connect', async () => {
        console.log('Socket connected');
        await resubscribe();
    });

    socket.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason);
        // Socket.io will auto-reconnect; we re-subscribe on 'connect'
    });

    socket.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
    });
}

async function resubscribe() {
    // Re-subscribe all channels after reconnect
    for (const channel of ['taskRouter', 'voice', 'engagements']) {
        const sub = await api.subscriptions.socket.create(sessionId, { channel });
        subscriptionIds.push(sub.id);
    }
}

async function disconnect() {
    // Clean up subscriptions
    for (const id of subscriptionIds) {
        await api.subscriptions.socket.delete(id, sessionId).catch(() => {});
    }
    socket?.disconnect();
}

// Event handlers
function setupHandlers() {
    socket.on('taskRouter:task:assigned', onTaskAssigned);
    socket.on('voice:call:ringing', onCallRinging);
    socket.on('engagement:created', onEngagementCreated);
}

// Boot
await connect();
setupHandlers();
```

---

### Pattern 2 — Agent Softphone (Task Router + Voice)

Subscribe to both task routing and call events for a full softphone experience:

```javascript
import SDK from '@unboundcx/sdk';
import { io } from 'socket.io-client';

async function startSoftphone(api) {
    const { sessionId, endpoint } = await api.subscriptions.socket.getConnection();
    const socket = io(endpoint, { withCredentials: true });

    socket.on('connect', async () => {
        // Subscribe to task assignments for this agent
        await api.subscriptions.socket.create(sessionId, {
            channel: 'taskRouter',
        });

        // Subscribe to call events
        await api.subscriptions.socket.create(sessionId, {
            channel: 'voice',
        });
    });

    // Task offered to agent — ring the softphone
    socket.on('taskRouter:task:assigned', async (event) => {
        console.log(`Task offered: ${event.taskId} (${event.taskType})`);
        showIncomingCallUI(event);

        // Auto-accept after 3 seconds if agent doesn't respond
        setTimeout(async () => {
            await api.taskRouter.task.accept({ taskId: event.taskId });
        }, 3000);
    });

    // Task status changed
    socket.on('taskRouter:task:statusChanged', (event) => {
        console.log(`Task ${event.taskId}: ${event.previousStatus} → ${event.status}`);

        if (event.status === 'completed') {
            clearCallUI();
        }
    });

    // Call state changes
    socket.on('voice:call:answered', (event) => {
        startCallTimer(event.cdrId);
    });

    socket.on('voice:call:ended', (event) => {
        stopCallTimer();
        console.log(`Call ended after ${event.duration}s`);
    });

    return socket;
}
```

---

### Pattern 3 — Live Transcript Display

Stream real-time transcription to a UI during an active call:

```javascript
async function subscribeToTranscript(api, cdrId) {
    const { sessionId, endpoint } = await api.subscriptions.socket.getConnection();
    const socket = io(endpoint, { withCredentials: true });

    const transcriptLines = [];
    let partialLine = { speaker: null, text: '' };

    socket.on('connect', async () => {
        await api.subscriptions.socket.create(sessionId, {
            channel: 'ai.transcripts',
            filters: { cdrId },
        });
        console.log('Transcript stream active for call:', cdrId);
    });

    // Update partial (in-progress) text in UI
    socket.on('ai:transcript:partial', (event) => {
        partialLine = { speaker: event.speaker, text: event.text };
        renderTranscript(transcriptLines, partialLine);
    });

    // Commit final segment
    socket.on('ai:transcript:final', (event) => {
        transcriptLines.push({
            speaker: event.speaker,
            text: event.text,
            confidence: event.confidence,
            startTime: event.startTime,
        });
        partialLine = { speaker: null, text: '' };
        renderTranscript(transcriptLines, null);
    });

    return socket;
}
```

---

### Pattern 4 — Multi-Queue Supervisor Dashboard

Monitor multiple queues simultaneously and display live metrics:

```javascript
async function startSupervisorDashboard(api, queueIds) {
    const { sessionId, endpoint } = await api.subscriptions.socket.getConnection();
    const socket = io(endpoint, { withCredentials: true });

    const dashboardState = {};

    socket.on('connect', async () => {
        // Subscribe to metrics for each queue
        for (const queueId of queueIds) {
            await api.subscriptions.socket.create(sessionId, {
                channel: 'engagementMetrics',
                filters: { queueId },
            });

            await api.subscriptions.socket.create(sessionId, {
                channel: 'taskRouter',
                filters: { queueId },
            });
        }
    });

    // Update metric tiles when server pushes fresh data
    socket.on('engagementMetrics:updated', (event) => {
        dashboardState[event.queueId] = event.metrics;
        renderQueueTile(event.queueId, event.metrics);
    });

    // Real-time agent status changes
    socket.on('taskRouter:worker:statusChanged', (event) => {
        updateAgentStatus(event.userId, event.status);
    });

    // New task enters queue
    socket.on('taskRouter:task:statusChanged', (event) => {
        if (event.status === 'pending') {
            incrementWaitingCount(event.queueId);
        } else if (event.status === 'completed') {
            incrementCompletedCount(event.queueId);
        }
    });

    return socket;
}
```

---

### Pattern 5 — Inbound SMS Auto-Router

Listen for inbound messages and route them to the task router:

```javascript
async function startSmsRouter(api, queueId) {
    const { sessionId, endpoint } = await api.subscriptions.socket.getConnection();
    const socket = io(endpoint, { withCredentials: true });

    socket.on('connect', async () => {
        await api.subscriptions.socket.create(sessionId, {
            channel: 'messages',
            filters: { channel: 'sms', direction: 'inbound' },
        });
    });

    socket.on('message:received', async (event) => {
        if (event.channel !== 'sms') return;

        console.log(`SMS from ${event.from}: ${event.body}`);

        // Create a task for the inbound message
        try {
            const task = await api.taskRouter.task.create({
                type: 'other',
                queueId,
                subject: `SMS from ${event.from}`,
                priority: 1,
                createEngagement: true,
            });

            console.log('Task created:', task.id);
        } catch (err) {
            console.error('Failed to create task:', err.message);
        }
    });

    return socket;
}
```

---

---

### Pattern 6 — Embedded Video Room with Live Participant Roster

Build a real-time participant list for an embedded video UI:

```javascript
import { io } from 'socket.io-client';

async function buildVideoRoomUI(api, roomId) {
    const { sessionId, endpoint } = await api.subscriptions.socket.getConnection();
    const socket = io(endpoint, { withCredentials: true });

    // Keep local state of who's in the room
    const participants = new Map();

    socket.on('connect', async () => {
        // Subscribe to this specific room's events
        await api.subscriptions.socket.create(sessionId, {
            channel: 'video',
            filters: { roomId },
        });

        // Seed with current participants
        const room = await api.video.describe(roomId, { includeParticipants: true });
        for (const p of room.participants) {
            participants.set(p.id, p);
        }
        renderParticipantRoster(participants);
    });

    socket.on('video:participant:joined', (event) => {
        participants.set(event.participantId, {
            id: event.participantId,
            name: event.name,
            email: event.email,
            role: event.role,
            isCameraMuted: false,
            isMicrophoneMuted: false,
        });
        renderParticipantRoster(participants);
        showToast(`${event.name} joined`);
    });

    socket.on('video:participant:left', (event) => {
        const p = participants.get(event.participantId);
        if (p) showToast(`${p.name} left`);
        participants.delete(event.participantId);
        renderParticipantRoster(participants);
    });

    socket.on('video:participant:updated', (event) => {
        const p = participants.get(event.participantId);
        if (p) {
            Object.assign(p, event.changes);
            participants.set(event.participantId, p);
            renderParticipantRoster(participants);
        }
    });

    socket.on('video:room:recording:started', () => {
        document.getElementById('recording-dot').style.display = 'block';
    });

    socket.on('video:room:closed', () => {
        socket.disconnect();
        window.location.href = '/meeting-ended';
    });

    // Real-time chat
    socket.on('video:chat:message:created', (event) => {
        const textContent = event.content
            .flatMap(n => n.content || [])
            .filter(n => n.type === 'text')
            .map(n => n.text)
            .join('');
        appendChatBubble(event.participantName, textContent, event.createdAt);
    });

    return { socket, participants };
}
```

---

### Pattern 7 — Typed Event Bus (TypeScript)

Wrap the socket in a typed emitter for IDE autocompletion and compile-time safety:

```typescript
import { io, Socket } from 'socket.io-client';
import type {
    TaskAssignedEvent,
    TaskStatusChangedEvent,
    WorkerStatusChangedEvent,
    CallRingingEvent,
    CallEndedEvent,
    EngagementCreatedEvent,
    TranscriptFinalEvent,
    EngagementMetricsUpdatedEvent,
    VideoParticipantJoinedEvent,
} from './unbound-types';

type UnboundEvents = {
    // Task Router
    'taskRouter:task:assigned': (e: TaskAssignedEvent) => void;
    'taskRouter:task:statusChanged': (e: TaskStatusChangedEvent) => void;
    'taskRouter:worker:statusChanged': (e: WorkerStatusChangedEvent) => void;
    // Voice
    'voice:call:ringing': (e: CallRingingEvent) => void;
    'voice:call:ended': (e: CallEndedEvent) => void;
    // Engagements
    'engagement:created': (e: EngagementCreatedEvent) => void;
    // AI
    'ai:transcript:final': (e: TranscriptFinalEvent) => void;
    // Metrics
    'engagementMetrics:updated': (e: EngagementMetricsUpdatedEvent) => void;
    // Video
    'video:participant:joined': (e: VideoParticipantJoinedEvent) => void;
};

class UnboundSocket {
    private socket: Socket;
    private sessionId: string;
    private api: ReturnType<typeof createSDK>;

    constructor(api: ReturnType<typeof createSDK>, socket: Socket, sessionId: string) {
        this.api = api;
        this.socket = socket;
        this.sessionId = sessionId;
    }

    on<K extends keyof UnboundEvents>(event: K, handler: UnboundEvents[K]): this {
        this.socket.on(event as string, handler as (...args: any[]) => void);
        return this;
    }

    off<K extends keyof UnboundEvents>(event: K, handler: UnboundEvents[K]): this {
        this.socket.off(event as string, handler as (...args: any[]) => void);
        return this;
    }

    async subscribe(channel: string, filters?: Record<string, string>): Promise<string> {
        const sub = await this.api.subscriptions.socket.create(
            this.sessionId,
            { channel, ...filters && { filters } },
        );
        return sub.id;
    }

    disconnect(): void {
        this.socket.disconnect();
    }
}

// Usage:
const { sessionId, endpoint } = await api.subscriptions.socket.getConnection();
const rawSocket = io(endpoint, { withCredentials: true });
const ws = new UnboundSocket(api, rawSocket, sessionId);

rawSocket.on('connect', async () => {
    await ws.subscribe('taskRouter');
    await ws.subscribe('voice');
});

ws.on('taskRouter:task:assigned', (event) => {
    // Fully typed — event.taskId, event.queueId, etc.
    console.log(`New task: ${event.taskId} in queue ${event.queueId}`);
});

ws.on('voice:call:ended', (event) => {
    console.log(`Call ${event.cdrId} lasted ${event.duration}s`);
});
```

---

### Pattern 8 — Graceful Shutdown (Clean Up Subscriptions)

Always clean up subscriptions on process exit or component unmount to avoid orphaned sessions:

```javascript
// React hook: subscribe on mount, clean up on unmount
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

function useUnboundSocket(api, channels) {
    const socketRef = useRef(null);
    const sessionRef = useRef(null);
    const subsRef = useRef([]);

    useEffect(() => {
        let mounted = true;

        async function connect() {
            const { sessionId, endpoint } = await api.subscriptions.socket.getConnection();
            sessionRef.current = sessionId;

            const socket = io(endpoint, { withCredentials: true });
            socketRef.current = socket;

            socket.on('connect', async () => {
                if (!mounted) return;

                for (const channel of channels) {
                    const sub = await api.subscriptions.socket.create(sessionId, { channel });
                    subsRef.current.push(sub.id);
                }
            });
        }

        connect().catch(console.error);

        // Cleanup on unmount
        return () => {
            mounted = false;

            const cleanup = async () => {
                const sessionId = sessionRef.current;
                if (sessionId) {
                    // Delete all active subscriptions
                    await Promise.allSettled(
                        subsRef.current.map(id =>
                            api.subscriptions.socket.delete(id, sessionId)
                        )
                    );
                }
                socketRef.current?.disconnect();
            };

            cleanup().catch(console.error);
        };
    }, []);

    return socketRef;
}

// Usage in a component:
function AgentDashboard({ api }) {
    const socketRef = useUnboundSocket(api, ['taskRouter', 'voice', 'engagements']);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.on('taskRouter:task:assigned', (event) => {
            console.log('Task:', event.taskId);
        });
    }, [socketRef]);
}
```

---

### Pattern 9 — Correlation: Link Voice Call to Transcript and Task

Combine multiple channels to build a full picture of a single customer interaction:

```javascript
async function correlatedInteractionStream(api, taskId) {
    const { sessionId, endpoint } = await api.subscriptions.socket.getConnection();
    const socket = io(endpoint, { withCredentials: true });

    let cdrId = null;
    const interactionLog = [];

    socket.on('connect', async () => {
        // Subscribe broadly — filter in-memory by taskId/cdrId
        await api.subscriptions.socket.create(sessionId, {
            channel: 'taskRouter',
        });

        await api.subscriptions.socket.create(sessionId, {
            channel: 'voice',
        });

        await api.subscriptions.socket.create(sessionId, {
            channel: 'ai.transcripts',
        });
    });

    // Capture the CDR ID when the task connects to a call
    socket.on('taskRouter:task:statusChanged', (event) => {
        if (event.taskId !== taskId) return;

        interactionLog.push({
            type: 'task_status',
            status: event.status,
            timestamp: event.timestamp,
        });

        if (event.status === 'completed') {
            finalizeInteraction(interactionLog);
        }
    });

    // Link voice events to this task
    socket.on('voice:call:answered', (event) => {
        // Store CDR for transcript correlation
        cdrId = event.cdrId;
        interactionLog.push({
            type: 'call_answered',
            cdrId: event.cdrId,
            timestamp: event.answeredAt,
        });
    });

    socket.on('voice:call:ended', (event) => {
        if (event.cdrId !== cdrId) return;
        interactionLog.push({
            type: 'call_ended',
            duration: event.duration,
            timestamp: event.endedAt,
        });
    });

    // Attach transcript segments
    socket.on('ai:transcript:final', (event) => {
        if (event.cdrId !== cdrId) return;
        interactionLog.push({
            type: 'transcript',
            speaker: event.speaker,
            text: event.text,
            confidence: event.confidence,
            startTime: event.startTime,
        });
    });

    return socket;
}
```

---

:::tip
For historical event data and analytics (instead of real-time), use [Engagement Metrics](/api-reference/engagement-metrics).
:::

:::caution Token expiry
When your auth token expires, your socket connection will be dropped. Implement token refresh before expiry and reconnect with a fresh token. See [Authentication](/sdk/authentication#token-refresh-patterns) for refresh patterns.
:::
