---
id: video
title: Video
---

# Video

`api.video` — Create and manage video meeting rooms, participants, chat, recordings, and analytics.

---

## `video.createRoom(options)`

Create a video meeting room.

```javascript
const room = await api.video.createRoom({
  name: 'Team Standup',
  password: 'secret123',
  startTime: '2024-06-01T14:00:00Z',
  duration: 60,
  waitingRoom: true,
  hosts: ['host@yourcompany.com'],
  participants: ['alice@example.com', 'bob@example.com'],
  startCameraMuted: false,
  startMicrophoneMuted: true,
  startMicrophoneMutedAfter: 5,
  enableChat: true,
});

console.log('Room ID:', room.id);
console.log('Join URL:', room.joinUrl);
```

| Parameter | Type | Description |
|---|---|---|
| `name` | string | Room display name |
| `password` | string | Optional password protection |
| `startTime` | ISO string | Scheduled start time |
| `endTime` | ISO string | Scheduled end time |
| `duration` | number | Duration in minutes |
| `durationUnit` | string | Unit for duration (`minutes`, `hours`) |
| `timezone` | string | Timezone (e.g., `America/New_York`) |
| `waitingRoom` | boolean | Enable waiting room |
| `hosts` | string[] | Host email addresses |
| `participants` | string[] | Pre-invited participant emails |
| `startCameraMuted` | boolean | Start all cameras muted |
| `startCameraMutedAfter` | number | Auto-mute cameras when participant count exceeds N |
| `startMicrophoneMuted` | boolean | Start all mics muted |
| `startMicrophoneMutedAfter` | number | Auto-mute mics when participant count exceeds N |
| `enableChat` | boolean | Enable in-meeting chat |
| `engagementSessionId` | string | Link to an engagement session |

---

## `video.joinRoom(room, password, email, name?, ...)`

Join a video room and get a session token.

```javascript
const session = await api.video.joinRoom(
  'room-id',
  'secret123',
  'user@example.com',
  'Jane Smith',     // display name
);
```

---

## `video.joinRoomSip(options)`

Dial a phone number into a video room via SIP.

```javascript
await api.video.joinRoomSip({
  room: 'room-id',
  phoneNumber: '+1234567890',
  voiceChannelId: 'vc-123',
  serverId: 'sip-server-1',
  engagementSessionId: 'eng-456',
});
```

---

## `video.updateRoom(roomId, update)`

Update an existing room.

```javascript
await api.video.updateRoom('room-id', {
  name: 'Updated Meeting Name',
  waitingRoom: false,
  startRecordingOn: true,
  startTranscribingOn: true,
});
```

---

## `video.deleteRoom(roomId)`

Delete a room permanently.

```javascript
await api.video.deleteRoom('room-id');
```

---

## `video.closeRoom(roomId)`

End an active meeting and disconnect all participants.

```javascript
await api.video.closeRoom('room-id');
```

---

## `video.describe(roomId, options?)`

Get room details and optionally its participants.

```javascript
const room = await api.video.describe('room-id', {
  includeParticipants: true,
});
```

---

## `video.listMeetings(options?)`

List meetings with optional date filtering.

```javascript
const meetings = await api.video.listMeetings({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  limit: 50,
  offset: 0,
});
```

---

## Participant Controls

### `video.mute(roomId, participantId, mediaType, isMute)`

```javascript
// Mute a participant's microphone
await api.video.mute('room-id', 'participant-id', 'microphone', true);

// Unmute a participant's camera
await api.video.mute('room-id', 'participant-id', 'camera', false);
```

`mediaType`: `'microphone'` or `'camera'`

### `video.removeParticipant(roomId, participantId)`

```javascript
await api.video.removeParticipant('room-id', 'participant-id');
```

### `video.addParticipant(roomId, participant)`

```javascript
await api.video.addParticipant('room-id', {
  email: 'newperson@example.com',
  role: 'participant',
});
```

### `video.updateParticipant(roomId, participantId, update)`

```javascript
await api.video.updateParticipant('room-id', 'participant-id', {
  role: 'host',
});
```

### `video.leaveRoom(roomId)`

```javascript
await api.video.leaveRoom('room-id');
```

---

## Recording & Transcription Bot

```javascript
await api.video.updateRoomBot('room-id', {
  isRecording: true,
  isTranscribing: true,
});
```

---

## Analytics

```javascript
const analytics = await api.video.getMeetingAnalytics('room-id', {
  startTime: '2024-06-01T14:00:00Z',
  endTime: '2024-06-01T15:00:00Z',
  participantId: 'participant-id',  // optional: drill into one participant
  granularity: '1m',                // optional: time bucket size
  timezone: 'America/New_York',
});
```

---

## In-Meeting Chat

### `video.postChatMessage(roomId, content, storageId?)`

```javascript
await api.video.postChatMessage('room-id', [
  { type: 'paragraph', content: [{ type: 'text', text: 'Hello everyone!' }] },
]);
```

`content` is a TipTap-format JSON array. Pass `storageId` to attach a file.

### `video.getChatMessages(roomId, options?)`

```javascript
const messages = await api.video.getChatMessages('room-id', {
  limit: 50,
  orderByDirection: 'DESC',
  expandDetails: true,
});
```

### `video.editChatMessage(roomId, messageId, content)`

### `video.deleteChatMessage(roomId, messageId)`

---

## User Settings

Default settings applied to every meeting a user creates.

```javascript
await api.video.createUserSettings({
  waitingRoom: true,
  enableChat: true,
  startMicrophoneMuted: true,
  startMicrophoneMutedAfter: 5,
  startRecordingOn: false,
  startTranscribingOn: true,
  maxVideoResolution: 1080,
});

const settings = await api.video.getUserSettings();
await api.video.updateUserSettings({ waitingRoom: false });
```

---

## Dial-Out from Room

```javascript
await api.video.placeCall('room-id', '+1234567890', '+18005551234');
// callerIdNumber is optional
```

---

## Post-Meeting Survey

```javascript
await api.video.submitSurvey({
  videoRoomId: 'room-id',
  participantId: 'participant-id',
  email: 'user@example.com',
  videoQuality: 4,   // 1-5
  audioQuality: 5,
  feedback: 'Great call quality!',
});
```
