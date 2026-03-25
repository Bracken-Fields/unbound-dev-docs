---
id: video
title: Video
---

# Video

`api.video` — Create video meeting rooms, manage participants, and pull analytics.

## Create a Room

```javascript
const room = await api.video.createRoom({
  name: 'Team Meeting',
  password: 'secret123',          // Optional
  startTime: '2024-01-15T10:00:00Z',
  duration: 60,                   // Minutes
  waitingRoom: true,
  hosts: ['host@yourcompany.com'],
});

console.log('Room ID:', room.id);
console.log('Join URL:', room.joinUrl);
```

| Parameter | Type | Description |
|---|---|---|
| `name` | string | Room display name |
| `password` | string | Optional password protection |
| `startTime` | ISO string | Scheduled start time |
| `duration` | number | Duration in minutes |
| `waitingRoom` | boolean | Enable waiting room |
| `hosts` | string[] | Host email addresses |

## Join a Room

```javascript
const join = await api.video.joinRoom(room.id, 'secret123', 'user@example.com');
console.log('Join token:', join.token);
```

## Participant Controls

```javascript
// Mute a participant's microphone
await api.video.mute(room.id, participantId, 'microphone', true);

// Mute video
await api.video.mute(room.id, participantId, 'video', true);

// Remove a participant
await api.video.removeParticipant(room.id, participantId);

// List participants
const participants = await api.video.getParticipants(room.id);
```

## Analytics

```javascript
const analytics = await api.video.getMeetingAnalytics(room.id, {
  startTime: '2024-01-15T10:00:00Z',
  endTime: '2024-01-15T11:00:00Z',
});

// analytics.duration — total meeting duration
// analytics.participants — array of participant records
// analytics.recordingUrl — if recording was enabled
```

## List Rooms

```javascript
const rooms = await api.video.listRooms({
  status: 'upcoming',  // upcoming | active | ended
  limit: 25,
});
```
