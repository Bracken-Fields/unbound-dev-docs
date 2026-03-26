---
id: video
title: Video
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Video

`api.video` — Create and manage video meeting rooms, participants, chat, recording bots, analytics, and user settings.

---

## Room Management

### `video.createRoom(options)`

Create a new video meeting room.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const room = await api.video.createRoom({
    name: 'Team Standup',
    password: 'secret123',
    startTime: '2024-06-01T14:00:00Z',
    endTime: '2024-06-01T15:00:00Z',
    duration: 60,
    durationUnit: 'minutes',
    timezone: 'America/New_York',
    waitingRoom: true,
    hosts: ['host@yourcompany.com'],
    participants: ['alice@example.com', 'bob@example.com'],
    startCameraMuted: false,
    startCameraMutedAfter: 10,
    startMicrophoneMuted: true,
    startMicrophoneMutedAfter: 5,
    enableChat: true,
    engagementSessionId: 'eng-abc123',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Team Standup",
    password: "secret123",
    startTime: "2024-06-01T14:00:00Z",
    endTime: "2024-06-01T15:00:00Z",
    duration: 60,
    durationUnit: "minutes",
    timezone: "America/New_York",
    waitingRoom: true,
    hosts: ["host@yourcompany.com"],
    participants: ["alice@example.com", "bob@example.com"],
    startCameraMuted: false,
    startCameraMutedAfter: 10,
    startMicrophoneMuted: true,
    startMicrophoneMutedAfter: 5,
    enableChat: true,
    engagementSessionId: "eng-abc123"
  })
});
const room = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "Team Standup",
    "password" => "secret123",
    "startTime" => "2024-06-01T14:00:00Z",
    "endTime" => "2024-06-01T15:00:00Z",
    "duration" => 60,
    "durationUnit" => "minutes",
    "timezone" => "America/New_York",
    "waitingRoom" => true,
    "hosts" => ["host@yourcompany.com"],
    "participants" => ["alice@example.com", "bob@example.com"],
    "startCameraMuted" => false,
    "startCameraMutedAfter" => 10,
    "startMicrophoneMuted" => true,
    "startMicrophoneMutedAfter" => 5,
    "enableChat" => true,
    "engagementSessionId" => "eng-abc123"
]));
$room = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "Team Standup",
        "password": "secret123",
        "startTime": "2024-06-01T14:00:00Z",
        "endTime": "2024-06-01T15:00:00Z",
        "duration": 60,
        "durationUnit": "minutes",
        "timezone": "America/New_York",
        "waitingRoom": True,
        "hosts": ["host@yourcompany.com"],
        "participants": ["alice@example.com", "bob@example.com"],
        "startCameraMuted": False,
        "startCameraMutedAfter": 10,
        "startMicrophoneMuted": True,
        "startMicrophoneMutedAfter": 5,
        "enableChat": True,
        "engagementSessionId": "eng-abc123"
    }
)
room = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/video/room" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Standup",
    "password": "secret123",
    "startTime": "2024-06-01T14:00:00Z",
    "endTime": "2024-06-01T15:00:00Z",
    "duration": 60,
    "durationUnit": "minutes",
    "timezone": "America/New_York",
    "waitingRoom": true,
    "hosts": ["host@yourcompany.com"],
    "participants": ["alice@example.com", "bob@example.com"],
    "startCameraMuted": false,
    "startCameraMutedAfter": 10,
    "startMicrophoneMuted": true,
    "startMicrophoneMutedAfter": 5,
    "enableChat": true,
    "engagementSessionId": "eng-abc123"
  }'
```

</TabItem>
</Tabs>

```javascript
// Response
// {
//   id: 'room-xyz789',
//   name: 'Team Standup',
//   joinUrl: 'https://meet.yourdomain.com/room-xyz789',
//   password: 'secret123',
//   startTime: '2024-06-01T14:00:00.000Z',
//   endTime: '2024-06-01T15:00:00.000Z',
//   timezone: 'America/New_York',
//   waitingRoom: true,
//   enableChat: true,
//   status: 'scheduled',
//   hosts: [...],
//   participants: [...],
// }
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | No | Room display name |
| `password` | string | No | Optional password protection |
| `startTime` | ISO string | No | Scheduled start time |
| `endTime` | ISO string | No | Scheduled end time |
| `isAllDay` | boolean | No | All-day meeting flag |
| `duration` | number | No | Duration value |
| `durationUnit` | string | No | `'minutes'` or `'hours'` |
| `timezone` | string | No | IANA timezone (e.g. `America/Chicago`) |
| `waitingRoom` | boolean | No | Hold participants in lobby until host admits |
| `hosts` | string[] | No | Host email addresses |
| `participants` | string[] | No | Pre-invited participant emails |
| `startCameraMuted` | boolean | No | Start with all cameras off |
| `startCameraMutedAfter` | number | No | Auto-mute cameras when count exceeds N |
| `startMicrophoneMuted` | boolean | No | Start with all mics muted |
| `startMicrophoneMutedAfter` | number | No | Auto-mute mics when count exceeds N |
| `enableChat` | boolean | No | Enable in-meeting chat |
| `engagementSessionId` | string | No | Link to an engagement session |

---

### `video.updateRoom(roomId, update)`

Update room settings. Only fields you pass are changed.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.updateRoom('room-xyz789', {
    name: 'New Name',
    waitingRoom: false,
    startRecordingOn: true,
    startTranscribingOn: true,
    hosts: ['newhost@yourcompany.com'],
    endTime: '2024-06-01T16:00:00Z',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "New Name",
    waitingRoom: false,
    startRecordingOn: true,
    startTranscribingOn: true,
    hosts: ["newhost@yourcompany.com"],
    endTime: "2024-06-01T16:00:00Z"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "New Name",
    "waitingRoom" => false,
    "startRecordingOn" => true,
    "startTranscribingOn" => true,
    "hosts" => ["newhost@yourcompany.com"],
    "endTime" => "2024-06-01T16:00:00Z"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.put(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "New Name",
        "waitingRoom": False,
        "startRecordingOn": True,
        "startTranscribingOn": True,
        "hosts": ["newhost@yourcompany.com"],
        "endTime": "2024-06-01T16:00:00Z"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "https://{namespace}.api.unbound.cx/video/room/room-xyz789" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "waitingRoom": false,
    "startRecordingOn": true,
    "startTranscribingOn": true,
    "hosts": ["newhost@yourcompany.com"],
    "endTime": "2024-06-01T16:00:00Z"
  }'
```

</TabItem>
</Tabs>

Updatable fields match `createRoom` parameters plus:

| Field | Type | Description |
|---|---|---|
| `startRecordingOn` | boolean | Auto-start recording when room opens |
| `startTranscribingOn` | boolean | Auto-start transcription when room opens |

---

### `video.describe(roomId, options?)`

Get room details, optionally including current participants.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const room = await api.video.describe('room-xyz789', {
    includeParticipants: true,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789?includeParticipants=true", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const room = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789?includeParticipants=true");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$room = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789",
    headers={"Authorization": "Bearer {token}"},
    params={"includeParticipants": "true"}
)
room = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/video/room/room-xyz789?includeParticipants=true" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

```javascript
// Response
// {
//   id: 'room-xyz789',
//   name: 'Team Standup',
//   status: 'active',    // 'scheduled' | 'active' | 'ended'
//   joinUrl: '...',
//   waitingRoom: true,
//   enableChat: true,
//   hosts: [...],
//   participants: [
//     {
//       id: 'p-abc123',
//       name: 'Alice',
//       email: 'alice@example.com',
//       role: 'participant',  // 'host' | 'participant'
//       isConnected: true,
//       isCameraMuted: false,
//       isMicrophoneMuted: true,
//       joinedAt: '2024-06-01T14:02:30.000Z',
//     }
//   ]
// }
```

---

### `video.listMeetings(options?)`

List past and upcoming meetings.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.video.listMeetings({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    limit: 50,
    offset: 0,
});

// result.data = array of room objects
// result.total = total count
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room?startDate=2024-01-01&endDate=2024-01-31&limit=50&offset=0", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const result = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room?startDate=2024-01-01&endDate=2024-01-31&limit=50&offset=0");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/video/room",
    headers={"Authorization": "Bearer {token}"},
    params={"startDate": "2024-01-01", "endDate": "2024-01-31", "limit": 50, "offset": 0}
)
result = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/video/room?startDate=2024-01-01&endDate=2024-01-31&limit=50&offset=0" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

| Parameter | Type | Description |
|---|---|---|
| `startDate` | string | Filter: meetings on or after this date (`YYYY-MM-DD`) |
| `endDate` | string | Filter: meetings on or before this date (`YYYY-MM-DD`) |
| `limit` | number | Max results per page (default: 20) |
| `offset` | number | Pagination offset |

---

### `video.deleteRoom(roomId)`

Permanently delete a room and all associated data.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.deleteRoom('room-xyz789');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.delete(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/video/room/room-xyz789" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

:::caution
This is irreversible. Chat history, recordings, and analytics will be lost.
:::

---

### `video.closeRoom(roomId)`

End an active meeting and disconnect all participants without deleting the room.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.closeRoom('room-xyz789');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/close", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/close");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, "");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/close",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/close" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

Use `closeRoom` to end a live session gracefully. The room still exists and can be described or deleted later.

---

## Joining Rooms

### `video.joinRoom(room, password?, email?, name?, firstName?, lastName?, tokenType?, token?)`

Join a video room and receive a session credential.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Authenticated user join
const session = await api.video.joinRoom(
    'room-xyz789',
    'secret123',
    'alice@example.com',
    null,           // display name (use firstName/lastName instead when available)
    'Alice',        // firstName
    'Smith',        // lastName
);

// Guest join with JWT token
const guestSession = await api.video.joinRoom(
    'room-xyz789',
    null,
    'guest@example.com',
    'Guest User',
    null,
    null,
    'jwt',          // tokenType: 'cookie' | 'jwt'
    'existing-jwt-token',
);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Authenticated user join
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/join", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    password: "secret123",
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Smith"
  })
});
const session = await res.json();

// Guest join with JWT token
const guestRes = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/join", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "guest@example.com",
    name: "Guest User",
    tokenType: "jwt",
    token: "existing-jwt-token"
  })
});
const guestSession = await guestRes.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Authenticated user join
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/join");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "password" => "secret123",
    "email" => "alice@example.com",
    "firstName" => "Alice",
    "lastName" => "Smith"
]));
$session = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Authenticated user join
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/join",
    headers={"Authorization": "Bearer {token}"},
    json={
        "password": "secret123",
        "email": "alice@example.com",
        "firstName": "Alice",
        "lastName": "Smith"
    }
)
session = response.json()

# Guest join with JWT token
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/join",
    headers={"Authorization": "Bearer {token}"},
    json={
        "email": "guest@example.com",
        "name": "Guest User",
        "tokenType": "jwt",
        "token": "existing-jwt-token"
    }
)
guest_session = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Authenticated user join
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/join" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "secret123",
    "email": "alice@example.com",
    "firstName": "Alice",
    "lastName": "Smith"
  }'

# Guest join with JWT token
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/join" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "guest@example.com",
    "name": "Guest User",
    "tokenType": "jwt",
    "token": "existing-jwt-token"
  }'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `room` | string | **Yes** | Room ID |
| `password` | string | No | Room password |
| `email` | string | No | Participant email |
| `name` | string | No | Display name (single string) |
| `firstName` | string | No | First name |
| `lastName` | string | No | Last name |
| `tokenType` | string | No | `'cookie'` (default) or `'jwt'` |
| `token` | string | No | Pre-existing token to exchange |

---

### `video.joinRoomSip(options)`

Dial a PSTN phone number into a video room over SIP.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.joinRoomSip({
    room: 'room-xyz789',
    password: 'secret123',
    phoneNumber: '+13175551234',
    voiceChannelId: 'vc-abc123',
    serverId: 'sip-server-1',
    engagementSessionId: 'eng-abc123',  // optional: link to engagement
    meetingJoinType: 'outboundApi',     // 'outboundApi' | 'inbound'
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/join/sip", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    password: "secret123",
    phoneNumber: "+13175551234",
    voiceChannelId: "vc-abc123",
    serverId: "sip-server-1",
    engagementSessionId: "eng-abc123",
    meetingJoinType: "outboundApi"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/join/sip");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "password" => "secret123",
    "phoneNumber" => "+13175551234",
    "voiceChannelId" => "vc-abc123",
    "serverId" => "sip-server-1",
    "engagementSessionId" => "eng-abc123",
    "meetingJoinType" => "outboundApi"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/join/sip",
    headers={"Authorization": "Bearer {token}"},
    json={
        "password": "secret123",
        "phoneNumber": "+13175551234",
        "voiceChannelId": "vc-abc123",
        "serverId": "sip-server-1",
        "engagementSessionId": "eng-abc123",
        "meetingJoinType": "outboundApi"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/join/sip" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "secret123",
    "phoneNumber": "+13175551234",
    "voiceChannelId": "vc-abc123",
    "serverId": "sip-server-1",
    "engagementSessionId": "eng-abc123",
    "meetingJoinType": "outboundApi"
  }'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `room` | string | **Yes** | Room ID |
| `phoneNumber` | string | **Yes** | E.164 phone number to dial |
| `voiceChannelId` | string | **Yes** | Voice channel to route through |
| `serverId` | string | **Yes** | SIP server identifier |
| `password` | string | No | Room password |
| `engagementSessionId` | string | No | Link to an engagement session |
| `meetingJoinType` | string | No | `'outboundApi'` (default) or `'inbound'` |

---

### `video.validateGuestToken(id, token?)`

Validate a guest token before attempting to join a password-protected room.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.video.validateGuestToken('room-xyz789', 'guest-token-abc');

// Returns validation result:
// { valid: true, roomId: 'room-xyz789', ... }
// or throws if token is invalid/expired
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/validate-token", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    token: "guest-token-abc"
  })
});
const result = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/validate-token");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "token" => "guest-token-abc"
]));
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/validate-token",
    headers={"Authorization": "Bearer {token}"},
    json={"token": "guest-token-abc"}
)
result = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/validate-token" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"token": "guest-token-abc"}'
```

</TabItem>
</Tabs>

Useful for pre-flight checks in custom embed flows before calling `joinRoom`.

---

### `video.clearToken()`

Clear the current video session token (cookie-based auth).

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.clearToken();
// Revokes the current video session credential
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/token/clear", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/token/clear");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, "");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/token/clear",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/video/token/clear" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

Call this on logout or when switching users in an embedded video context.

---

## Participant Controls

### `video.mute(roomId, participantId, mediaType, isMute, noDevice?, streamCreation?)`

Mute or unmute a participant's camera or microphone.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Mute a participant's microphone
await api.video.mute('room-xyz789', 'p-abc123', 'microphone', true);

// Unmute participant's camera
await api.video.mute('room-xyz789', 'p-abc123', 'camera', false);

// Mute with no device flag (participant has no camera)
await api.video.mute('room-xyz789', 'p-abc123', 'camera', true, true);

// Mute during stream creation
await api.video.mute('room-xyz789', 'p-abc123', 'microphone', true, false, true);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Mute a participant's microphone
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123/mute", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    mediaType: "microphone",
    isMute: true
  })
});
const data = await res.json();

// Unmute participant's camera
await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123/mute", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    mediaType: "camera",
    isMute: false
  })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Mute a participant's microphone
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123/mute");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "mediaType" => "microphone",
    "isMute" => true
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Mute a participant's microphone
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123/mute",
    headers={"Authorization": "Bearer {token}"},
    json={"mediaType": "microphone", "isMute": True}
)
data = response.json()

# Unmute participant's camera
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123/mute",
    headers={"Authorization": "Bearer {token}"},
    json={"mediaType": "camera", "isMute": False}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Mute a participant's microphone
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123/mute" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"mediaType": "microphone", "isMute": true}'

# Unmute participant's camera
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123/mute" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"mediaType": "camera", "isMute": false}'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `roomId` | string | **Yes** | Room ID |
| `participantId` | string | **Yes** | Participant ID |
| `mediaType` | string | **Yes** | `'microphone'` or `'camera'` |
| `isMute` | boolean | **Yes** | `true` to mute, `false` to unmute |
| `noDevice` | boolean | No | Participant has no device for this media type |
| `streamCreation` | boolean | No | Called during initial stream setup |

---

### `video.updateParticipant(roomId, participantId, update)`

Update a participant's role or properties.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Promote to host
await api.video.updateParticipant('room-xyz789', 'p-abc123', {
    role: 'host',
});

// Update display name
await api.video.updateParticipant('room-xyz789', 'p-abc123', {
    name: 'Alice Smith (Host)',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Promote to host
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ role: "host" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Promote to host
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["role" => "host"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Promote to host
response = requests.put(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123",
    headers={"Authorization": "Bearer {token}"},
    json={"role": "host"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Promote to host
curl -X PUT "https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"role": "host"}'
```

</TabItem>
</Tabs>

---

### `video.addParticipant(roomId, participant)`

Add a participant to an existing room (invite to join).

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.addParticipant('room-xyz789', {
    email: 'newperson@example.com',
    role: 'participant',   // 'host' | 'participant'
    name: 'Bob Jones',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "newperson@example.com",
    role: "participant",
    name: "Bob Jones"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "email" => "newperson@example.com",
    "role" => "participant",
    "name" => "Bob Jones"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant",
    headers={"Authorization": "Bearer {token}"},
    json={
        "email": "newperson@example.com",
        "role": "participant",
        "name": "Bob Jones"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newperson@example.com",
    "role": "participant",
    "name": "Bob Jones"
  }'
```

</TabItem>
</Tabs>

---

### `video.removeParticipant(roomId, participantId)`

Forcibly remove (kick) a participant from an active room.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.removeParticipant('room-xyz789', 'p-abc123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.delete(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/video/room/room-xyz789/participant/p-abc123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### `video.leaveRoom(roomId)`

Leave the current room as the authenticated user.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.leaveRoom('room-xyz789');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/leave", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/leave");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, "");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/leave",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/leave" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Recording & Transcription

### `video.updateRoomBot(roomId, options)`

Control the recording/transcription bot in an active room.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Start recording and transcription
await api.video.updateRoomBot('room-xyz789', {
    isRecording: true,
    isTranscribing: true,
});

// Stop recording but keep transcribing
await api.video.updateRoomBot('room-xyz789', {
    isRecording: false,
    isTranscribing: true,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Start recording and transcription
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/bot", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    isRecording: true,
    isTranscribing: true
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Start recording and transcription
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/bot");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "isRecording" => true,
    "isTranscribing" => true
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Start recording and transcription
response = requests.put(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/bot",
    headers={"Authorization": "Bearer {token}"},
    json={"isRecording": True, "isTranscribing": True}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Start recording and transcription
curl -X PUT "https://{namespace}.api.unbound.cx/video/room/room-xyz789/bot" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"isRecording": true, "isTranscribing": true}'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `roomId` | string | **Yes** | Active room ID |
| `isRecording` | boolean | No | Start (`true`) or stop (`false`) recording |
| `isTranscribing` | boolean | No | Start (`true`) or stop (`false`) transcription |

:::tip
You can also set `startRecordingOn` and `startTranscribingOn` on the room itself so the bot starts automatically when the meeting opens. Use `updateRoomBot` for manual mid-meeting control.
:::

---

## Analytics

### `video.getMeetingAnalytics(roomId, options?)`

Retrieve quality and engagement analytics for a completed or active meeting.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const analytics = await api.video.getMeetingAnalytics('room-xyz789', {
    startTime: '2024-06-01T14:00:00Z',
    endTime: '2024-06-01T15:00:00Z',
    participantId: 'p-abc123',    // drill into one participant
    granularity: '1m',            // time bucket size
    timezone: 'America/New_York',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
  startTime: "2024-06-01T14:00:00Z",
  endTime: "2024-06-01T15:00:00Z",
  participantId: "p-abc123",
  granularity: "1m",
  timezone: "America/New_York"
});
const res = await fetch(`https://{namespace}.api.unbound.cx/video/room/room-xyz789/analytics?${params}`, {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const analytics = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$query = http_build_query([
    "startTime" => "2024-06-01T14:00:00Z",
    "endTime" => "2024-06-01T15:00:00Z",
    "participantId" => "p-abc123",
    "granularity" => "1m",
    "timezone" => "America/New_York"
]);
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/analytics?{$query}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$analytics = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/analytics",
    headers={"Authorization": "Bearer {token}"},
    params={
        "startTime": "2024-06-01T14:00:00Z",
        "endTime": "2024-06-01T15:00:00Z",
        "participantId": "p-abc123",
        "granularity": "1m",
        "timezone": "America/New_York"
    }
)
analytics = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/video/room/room-xyz789/analytics?startTime=2024-06-01T14:00:00Z&endTime=2024-06-01T15:00:00Z&participantId=p-abc123&granularity=1m&timezone=America/New_York" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

```javascript
// Response shape
// {
//   roomId: 'room-xyz789',
//   duration: 3600,              // total seconds
//   participantCount: 12,
//   peakConcurrent: 10,
//   timeSeries: [
//     {
//       timestamp: '2024-06-01T14:00:00Z',
//       participantsActive: 8,
//       avgBitrate: 450000,
//       avgPacketLoss: 0.002,
//     }
//   ],
//   participants: [
//     {
//       id: 'p-abc123',
//       name: 'Alice',
//       joinedAt: '...',
//       leftAt: '...',
//       totalDuration: 3480,
//       avgVideoQuality: 4.2,
//       avgAudioQuality: 4.8,
//     }
//   ]
// }
```

| Parameter | Type | Description |
|---|---|---|
| `startTime` | ISO string | Analytics window start |
| `endTime` | ISO string | Analytics window end |
| `participantId` | string | Filter to a single participant |
| `granularity` | string | Time bucket: `'1m'`, `'5m'`, `'15m'`, `'1h'` |
| `timezone` | string | IANA timezone for bucketing |

---

### `video.logStats(roomId, stats)`

Report client-side quality stats from a participant's browser or native client.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.logStats('room-xyz789', {
    participantId: 'p-abc123',
    timestamp: new Date().toISOString(),
    videoResolution: { width: 1280, height: 720 },
    frameRate: 30,
    bitrate: 450000,
    packetLoss: 0.002,
    jitter: 5,
    rtt: 42,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/stats", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    participantId: "p-abc123",
    timestamp: new Date().toISOString(),
    videoResolution: { width: 1280, height: 720 },
    frameRate: 30,
    bitrate: 450000,
    packetLoss: 0.002,
    jitter: 5,
    rtt: 42
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/stats");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "participantId" => "p-abc123",
    "timestamp" => date("c"),
    "videoResolution" => ["width" => 1280, "height" => 720],
    "frameRate" => 30,
    "bitrate" => 450000,
    "packetLoss" => 0.002,
    "jitter" => 5,
    "rtt" => 42
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from datetime import datetime, timezone
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/stats",
    headers={"Authorization": "Bearer {token}"},
    json={
        "participantId": "p-abc123",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "videoResolution": {"width": 1280, "height": 720},
        "frameRate": 30,
        "bitrate": 450000,
        "packetLoss": 0.002,
        "jitter": 5,
        "rtt": 42
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/stats" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "participantId": "p-abc123",
    "timestamp": "2024-06-01T14:30:00Z",
    "videoResolution": {"width": 1280, "height": 720},
    "frameRate": 30,
    "bitrate": 450000,
    "packetLoss": 0.002,
    "jitter": 5,
    "rtt": 42
  }'
```

</TabItem>
</Tabs>

:::info
This is typically called by the Unbound video client SDK automatically. Use it in custom integrations to feed quality telemetry for analytics.
:::

---

## Dial-Out from Room

### `video.placeCall(roomId, phoneNumber, callerIdNumber?)`

Dial a PSTN number from inside an active meeting (bring external caller in).

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.placeCall(
    'room-xyz789',
    '+13175551234',
    '+18005550001',   // optional caller ID to display
);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/call", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    phoneNumber: "+13175551234",
    callerIdNumber: "+18005550001"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/call");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "phoneNumber" => "+13175551234",
    "callerIdNumber" => "+18005550001"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/call",
    headers={"Authorization": "Bearer {token}"},
    json={
        "phoneNumber": "+13175551234",
        "callerIdNumber": "+18005550001"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/call" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+13175551234",
    "callerIdNumber": "+18005550001"
  }'
```

</TabItem>
</Tabs>

---

## In-Meeting Chat

### `video.postChatMessage(roomId, content, storageId?)`

Post a message to the room chat. Content uses TipTap JSON format.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Simple text message
await api.video.postChatMessage('room-xyz789', [
    {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello everyone!' }],
    },
]);

// Rich text with bold
await api.video.postChatMessage('room-xyz789', [
    {
        type: 'paragraph',
        content: [
            { type: 'text', text: 'Important: ', marks: [{ type: 'bold' }] },
            { type: 'text', text: 'Meeting starts in 5 minutes.' },
        ],
    },
]);

// With file attachment
await api.video.postChatMessage('room-xyz789', [
    {
        type: 'paragraph',
        content: [{ type: 'text', text: 'See attached agenda.' }],
    },
], 'storage-id-abc123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Simple text message
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Hello everyone!" }]
      }
    ]
  })
});
const data = await res.json();

// With file attachment
await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "See attached agenda." }]
      }
    ],
    storageId: "storage-id-abc123"
  })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Simple text message
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "content" => [
        [
            "type" => "paragraph",
            "content" => [["type" => "text", "text" => "Hello everyone!"]]
        ]
    ]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Simple text message
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat",
    headers={"Authorization": "Bearer {token}"},
    json={
        "content": [
            {
                "type": "paragraph",
                "content": [{"type": "text", "text": "Hello everyone!"}]
            }
        ]
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Simple text message
curl -X POST "https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "content": [
      {
        "type": "paragraph",
        "content": [{"type": "text", "text": "Hello everyone!"}]
      }
    ]
  }'
```

</TabItem>
</Tabs>

---

### `video.getChatMessages(roomId, options?)`

Retrieve chat messages with cursor-based pagination.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// First page
const page1 = await api.video.getChatMessages('room-xyz789', {
    limit: 50,
    orderByDirection: 'DESC',
    expandDetails: true,
});

// Next page
const page2 = await api.video.getChatMessages('room-xyz789', {
    limit: 50,
    orderByDirection: 'DESC',
    nextId: page1.nextId,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// First page
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat?limit=50&orderByDirection=DESC&expandDetails=true", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const page1 = await res.json();

// Next page
const res2 = await fetch(`https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat?limit=50&orderByDirection=DESC&nextId=${page1.nextId}`, {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const page2 = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// First page
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat?limit=50&orderByDirection=DESC&expandDetails=true");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$page1 = json_decode(curl_exec($ch), true);
curl_close($ch);

// Next page
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat?limit=50&orderByDirection=DESC&nextId=" . $page1["nextId"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$page2 = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# First page
response = requests.get(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat",
    headers={"Authorization": "Bearer {token}"},
    params={"limit": 50, "orderByDirection": "DESC", "expandDetails": "true"}
)
page1 = response.json()

# Next page
response = requests.get(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat",
    headers={"Authorization": "Bearer {token}"},
    params={"limit": 50, "orderByDirection": "DESC", "nextId": page1["nextId"]}
)
page2 = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# First page
curl -X GET "https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat?limit=50&orderByDirection=DESC&expandDetails=true" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

```javascript
// Response shape
// {
//   data: [
//     {
//       id: 'msg-abc123',
//       content: [...],           // TipTap JSON
//       participant: {
//         id: 'p-abc123',
//         name: 'Alice',
//         email: 'alice@example.com',
//       },
//       createdAt: '...',
//       updatedAt: '...',
//       storageId: null,
//     }
//   ],
//   nextId: 'cursor-abc',        // null if no more pages
//   previousId: null,
// }
```

| Parameter | Type | Description |
|---|---|---|
| `select` | string | Comma-separated fields to return |
| `limit` | number | Results per page (default: 20) |
| `nextId` | string | Cursor for next page |
| `previousId` | string | Cursor for previous page |
| `orderByDirection` | string | `'ASC'` (oldest first) or `'DESC'` (newest first) |
| `expandDetails` | boolean | Include full participant details |

---

### `video.editChatMessage(roomId, messageId, content, storageId?)`

Edit a previously sent message. Only the original sender can edit.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.editChatMessage('room-xyz789', 'msg-abc123', [
    {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Corrected message text.' }],
    },
]);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat/msg-abc123", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Corrected message text." }]
      }
    ]
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat/msg-abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "content" => [
        [
            "type" => "paragraph",
            "content" => [["type" => "text", "text" => "Corrected message text."]]
        ]
    ]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.put(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat/msg-abc123",
    headers={"Authorization": "Bearer {token}"},
    json={
        "content": [
            {
                "type": "paragraph",
                "content": [{"type": "text", "text": "Corrected message text."}]
            }
        ]
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat/msg-abc123" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "content": [
      {
        "type": "paragraph",
        "content": [{"type": "text", "text": "Corrected message text."}]
      }
    ]
  }'
```

</TabItem>
</Tabs>

---

### `video.deleteChatMessage(roomId, messageId)`

Delete a chat message. Hosts can delete any message; participants can only delete their own.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.deleteChatMessage('room-xyz789', 'msg-abc123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat/msg-abc123", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat/msg-abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.delete(
    "https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat/msg-abc123",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/video/room/room-xyz789/chat/msg-abc123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Post-Meeting Survey

### `video.submitSurvey(options)`

Submit a quality survey after a meeting ends.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.video.submitSurvey({
    videoRoomId: 'room-xyz789',
    participantId: 'p-abc123',
    email: 'alice@example.com',
    videoQuality: 4,    // 1–5 scale
    audioQuality: 5,
    feedback: 'Great call, very clear audio.',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/video/survey", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    videoRoomId: "room-xyz789",
    participantId: "p-abc123",
    email: "alice@example.com",
    videoQuality: 4,
    audioQuality: 5,
    feedback: "Great call, very clear audio."
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/video/survey");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "videoRoomId" => "room-xyz789",
    "participantId" => "p-abc123",
    "email" => "alice@example.com",
    "videoQuality" => 4,
    "audioQuality" => 5,
    "feedback" => "Great call, very clear audio."
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/survey",
    headers={"Authorization": "Bearer {token}"},
    json={
        "videoRoomId": "room-xyz789",
        "participantId": "p-abc123",
        "email": "alice@example.com",
        "videoQuality": 4,
        "audioQuality": 5,
        "feedback": "Great call, very clear audio."
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/video/survey" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "videoRoomId": "room-xyz789",
    "participantId": "p-abc123",
    "email": "alice@example.com",
    "videoQuality": 4,
    "audioQuality": 5,
    "feedback": "Great call, very clear audio."
  }'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `videoRoomId` | string | **Yes** | The completed room ID |
| `participantId` | string | No | Participant's ID |
| `email` | string | No | Participant email |
| `videoQuality` | number | No | 1–5 video quality rating |
| `audioQuality` | number | No | 1–5 audio quality rating |
| `feedback` | string | No | Free-form text feedback |

---

## User Default Settings

Apply per-user defaults so every new room they create inherits these settings.

### `video.createUserSettings(settings)` / `video.updateUserSettings(settings)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Set defaults for the current user
await api.video.createUserSettings({
    waitingRoom: true,
    enableChat: true,
    startMicrophoneMuted: true,
    startMicrophoneMutedAfter: 5,
    startCameraMuted: false,
    startCameraMutedAfter: 10,
    maxVideoResolution: 1080,        // 720 or 1080
    startRecordingOn: false,
    startTranscribingOn: true,
    endMeetingWithoutHostTimeLimit: 300,   // seconds before auto-end
    hosts: ['always-a-host@company.com'],
});

// Update specific fields
await api.video.updateUserSettings({
    maxVideoResolution: 720,
    startTranscribingOn: false,
});

// Set defaults for another user (admin)
await api.video.createUserSettings({
    userId: 'user-abc123',
    waitingRoom: true,
    maxVideoResolution: 720,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Set defaults for the current user
const res = await fetch("https://{namespace}.api.unbound.cx/video/user-settings", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    waitingRoom: true,
    enableChat: true,
    startMicrophoneMuted: true,
    startMicrophoneMutedAfter: 5,
    startCameraMuted: false,
    startCameraMutedAfter: 10,
    maxVideoResolution: 1080,
    startRecordingOn: false,
    startTranscribingOn: true,
    endMeetingWithoutHostTimeLimit: 300,
    hosts: ["always-a-host@company.com"]
  })
});
const data = await res.json();

// Update specific fields
await fetch("https://{namespace}.api.unbound.cx/video/user-settings", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    maxVideoResolution: 720,
    startTranscribingOn: false
  })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Set defaults for the current user
$ch = curl_init("https://{namespace}.api.unbound.cx/video/user-settings");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "waitingRoom" => true,
    "enableChat" => true,
    "startMicrophoneMuted" => true,
    "startMicrophoneMutedAfter" => 5,
    "startCameraMuted" => false,
    "startCameraMutedAfter" => 10,
    "maxVideoResolution" => 1080,
    "startRecordingOn" => false,
    "startTranscribingOn" => true,
    "endMeetingWithoutHostTimeLimit" => 300,
    "hosts" => ["always-a-host@company.com"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Update specific fields
$ch = curl_init("https://{namespace}.api.unbound.cx/video/user-settings");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "maxVideoResolution" => 720,
    "startTranscribingOn" => false
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Set defaults for the current user
response = requests.post(
    "https://{namespace}.api.unbound.cx/video/user-settings",
    headers={"Authorization": "Bearer {token}"},
    json={
        "waitingRoom": True,
        "enableChat": True,
        "startMicrophoneMuted": True,
        "startMicrophoneMutedAfter": 5,
        "startCameraMuted": False,
        "startCameraMutedAfter": 10,
        "maxVideoResolution": 1080,
        "startRecordingOn": False,
        "startTranscribingOn": True,
        "endMeetingWithoutHostTimeLimit": 300,
        "hosts": ["always-a-host@company.com"]
    }
)
data = response.json()

# Update specific fields
response = requests.put(
    "https://{namespace}.api.unbound.cx/video/user-settings",
    headers={"Authorization": "Bearer {token}"},
    json={
        "maxVideoResolution": 720,
        "startTranscribingOn": False
    }
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Set defaults for the current user
curl -X POST "https://{namespace}.api.unbound.cx/video/user-settings" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "waitingRoom": true,
    "enableChat": true,
    "startMicrophoneMuted": true,
    "startMicrophoneMutedAfter": 5,
    "startCameraMuted": false,
    "startCameraMutedAfter": 10,
    "maxVideoResolution": 1080,
    "startRecordingOn": false,
    "startTranscribingOn": true,
    "endMeetingWithoutHostTimeLimit": 300,
    "hosts": ["always-a-host@company.com"]
  }'

# Update specific fields
curl -X PUT "https://{namespace}.api.unbound.cx/video/user-settings" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"maxVideoResolution": 720, "startTranscribingOn": false}'
```

</TabItem>
</Tabs>

| Parameter | Type | Description |
|---|---|---|
| `userId` | string | Target user (omit for current user) |
| `waitingRoom` | boolean | Default waiting room |
| `enableChat` | boolean | Default chat |
| `maxVideoResolution` | number | `720` or `1080` |
| `startCameraMuted` | boolean | Default camera-muted start |
| `startCameraMutedAfter` | number | Auto-mute threshold |
| `startMicrophoneMuted` | boolean | Default mic-muted start |
| `startMicrophoneMutedAfter` | number | Auto-mute threshold |
| `endMeetingWithoutHostTimeLimit` | number | Seconds before auto-end when no host present |
| `startRecordingOn` | boolean | Auto-record every meeting |
| `startTranscribingOn` | boolean | Auto-transcribe every meeting |
| `hosts` | string[] | Default co-hosts for every meeting |
| `participants` | string[] | Default invite list |

### `video.getUserSettings(userId?)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Current user's settings
const settings = await api.video.getUserSettings();

// Another user's settings (admin)
const adminSettings = await api.video.getUserSettings('user-abc123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Current user's settings
const res = await fetch("https://{namespace}.api.unbound.cx/video/user-settings", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const settings = await res.json();

// Another user's settings (admin)
const res2 = await fetch("https://{namespace}.api.unbound.cx/video/user-settings?userId=user-abc123", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const adminSettings = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Current user's settings
$ch = curl_init("https://{namespace}.api.unbound.cx/video/user-settings");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$settings = json_decode(curl_exec($ch), true);
curl_close($ch);

// Another user's settings (admin)
$ch = curl_init("https://{namespace}.api.unbound.cx/video/user-settings?userId=user-abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$adminSettings = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Current user's settings
response = requests.get(
    "https://{namespace}.api.unbound.cx/video/user-settings",
    headers={"Authorization": "Bearer {token}"}
)
settings = response.json()

# Another user's settings (admin)
response = requests.get(
    "https://{namespace}.api.unbound.cx/video/user-settings",
    headers={"Authorization": "Bearer {token}"},
    params={"userId": "user-abc123"}
)
admin_settings = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Current user's settings
curl -X GET "https://{namespace}.api.unbound.cx/video/user-settings" \
  -H "Authorization: Bearer {token}"

# Another user's settings (admin)
curl -X GET "https://{namespace}.api.unbound.cx/video/user-settings?userId=user-abc123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Common Patterns

### Scheduled Meeting with Auto-Record

```javascript
async function scheduleRecordedMeeting(hostEmail, attendees, startISO) {
    const room = await api.video.createRoom({
        name: 'Weekly Review',
        startTime: startISO,
        duration: 60,
        timezone: 'America/Chicago',
        waitingRoom: true,
        hosts: [hostEmail],
        participants: attendees,
        startMicrophoneMuted: true,
        startMicrophoneMutedAfter: 3,
        enableChat: true,
        startRecordingOn: true,
        startTranscribingOn: true,
    });

    return {
        roomId: room.id,
        joinUrl: room.joinUrl,
    };
}
```

---

### Embedded Video with Guest Token Validation

```javascript
async function prepareGuestJoin(roomId, password, guestToken) {
    // Validate token before presenting the join UI
    try {
        await api.video.validateGuestToken(roomId, guestToken);
    } catch (err) {
        throw new Error('Invalid or expired meeting link');
    }

    // Token is valid — proceed with join
    const session = await api.video.joinRoom(
        roomId,
        password,
        null,
        'Guest Attendee',
        null,
        null,
        'jwt',
        guestToken,
    );

    return session;
}
```

---

### Host: Manage a Live Meeting

```javascript
async function manageLiveMeeting(roomId) {
    // Get current state
    const room = await api.video.describe(roomId, { includeParticipants: true });

    // Mute all non-hosts
    const nonHosts = room.participants.filter(p => p.role !== 'host');
    for (const p of nonHosts) {
        await api.video.mute(roomId, p.id, 'microphone', true);
    }

    // Promote a participant to host
    const [first] = nonHosts;
    if (first) {
        await api.video.updateParticipant(roomId, first.id, { role: 'host' });
    }

    // Start recording mid-meeting
    await api.video.updateRoomBot(roomId, {
        isRecording: true,
        isTranscribing: true,
    });

    // Dial in a remote PSTN caller
    await api.video.placeCall(roomId, '+13175551234', '+18005550001');
}
```

---

### SIP Bridge for Contact Center Escalation

```javascript
// Escalate an active voice call into a video meeting
async function escalateToVideo(engagementSessionId, voiceChannelId, serverId, agentPhone) {
    // Create room linked to the engagement
    const room = await api.video.createRoom({
        name: 'Support Escalation',
        waitingRoom: false,
        enableChat: true,
        engagementSessionId,
    });

    // Bridge the agent's current call into the room via SIP
    await api.video.joinRoomSip({
        room: room.id,
        phoneNumber: agentPhone,
        voiceChannelId,
        serverId,
        engagementSessionId,
        meetingJoinType: 'outboundApi',
    });

    return room.joinUrl;   // send to customer for browser join
}
```

---

### Post-Meeting Analytics Pipeline

```javascript
async function collectMeetingData(roomId) {
    // Get full room details
    const room = await api.video.describe(roomId, { includeParticipants: true });

    // Pull quality analytics
    const analytics = await api.video.getMeetingAnalytics(roomId, {
        startTime: room.startTime,
        endTime: room.endTime,
        granularity: '5m',
    });

    // Get chat transcript
    const allMessages = [];
    let nextId = null;
    do {
        const page = await api.video.getChatMessages(roomId, {
            limit: 100,
            orderByDirection: 'ASC',
            nextId,
            expandDetails: true,
        });
        allMessages.push(...page.data);
        nextId = page.nextId;
    } while (nextId);

    return {
        duration: analytics.duration,
        participantCount: analytics.participantCount,
        peakConcurrent: analytics.peakConcurrent,
        chatMessages: allMessages.length,
        participants: analytics.participants,
    };
}
```

---

### Enforce Default Quality Settings for All Agents

```javascript
// Run once per new agent provisioning
async function setAgentVideoDefaults(agentUserId) {
    await api.video.createUserSettings({
        userId: agentUserId,
        maxVideoResolution: 720,      // conserve bandwidth
        startMicrophoneMuted: true,   // agents join muted
        startMicrophoneMutedAfter: 2,
        startCameraMuted: false,
        waitingRoom: false,           // no lobby for quick support calls
        enableChat: true,
        startTranscribingOn: true,    // always transcribe for QA
        endMeetingWithoutHostTimeLimit: 120,   // auto-end 2 min after host leaves
    });
}
```
