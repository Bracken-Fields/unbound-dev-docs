---
id: video
title: Video
---

# Video

`api.video` — Create and manage video meeting rooms, participants, chat, recording bots, analytics, and user settings.

---

## Room Management

### `video.createRoom(options)`

Create a new video meeting room.

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

Updatable fields match `createRoom` parameters plus:

| Field | Type | Description |
|---|---|---|
| `startRecordingOn` | boolean | Auto-start recording when room opens |
| `startTranscribingOn` | boolean | Auto-start transcription when room opens |

---

### `video.describe(roomId, options?)`

Get room details, optionally including current participants.

```javascript
const room = await api.video.describe('room-xyz789', {
    includeParticipants: true,
});

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

| Parameter | Type | Description |
|---|---|---|
| `startDate` | string | Filter: meetings on or after this date (`YYYY-MM-DD`) |
| `endDate` | string | Filter: meetings on or before this date (`YYYY-MM-DD`) |
| `limit` | number | Max results per page (default: 20) |
| `offset` | number | Pagination offset |

---

### `video.deleteRoom(roomId)`

Permanently delete a room and all associated data.

```javascript
await api.video.deleteRoom('room-xyz789');
```

:::caution
This is irreversible. Chat history, recordings, and analytics will be lost.
:::

---

### `video.closeRoom(roomId)`

End an active meeting and disconnect all participants without deleting the room.

```javascript
await api.video.closeRoom('room-xyz789');
```

Use `closeRoom` to end a live session gracefully. The room still exists and can be described or deleted later.

---

## Joining Rooms

### `video.joinRoom(room, password?, email?, name?, firstName?, lastName?, tokenType?, token?)`

Join a video room and receive a session credential.

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

```javascript
const result = await api.video.validateGuestToken('room-xyz789', 'guest-token-abc');

// Returns validation result:
// { valid: true, roomId: 'room-xyz789', ... }
// or throws if token is invalid/expired
```

Useful for pre-flight checks in custom embed flows before calling `joinRoom`.

---

### `video.clearToken()`

Clear the current video session token (cookie-based auth).

```javascript
await api.video.clearToken();
// Revokes the current video session credential
```

Call this on logout or when switching users in an embedded video context.

---

## Participant Controls

### `video.mute(roomId, participantId, mediaType, isMute, noDevice?, streamCreation?)`

Mute or unmute a participant's camera or microphone.

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

---

### `video.addParticipant(roomId, participant)`

Add a participant to an existing room (invite to join).

```javascript
await api.video.addParticipant('room-xyz789', {
    email: 'newperson@example.com',
    role: 'participant',   // 'host' | 'participant'
    name: 'Bob Jones',
});
```

---

### `video.removeParticipant(roomId, participantId)`

Forcibly remove (kick) a participant from an active room.

```javascript
await api.video.removeParticipant('room-xyz789', 'p-abc123');
```

---

### `video.leaveRoom(roomId)`

Leave the current room as the authenticated user.

```javascript
await api.video.leaveRoom('room-xyz789');
```

---

## Recording & Transcription

### `video.updateRoomBot(roomId, options)`

Control the recording/transcription bot in an active room.

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

```javascript
const analytics = await api.video.getMeetingAnalytics('room-xyz789', {
    startTime: '2024-06-01T14:00:00Z',
    endTime: '2024-06-01T15:00:00Z',
    participantId: 'p-abc123',    // drill into one participant
    granularity: '1m',            // time bucket size
    timezone: 'America/New_York',
});

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

:::info
This is typically called by the Unbound video client SDK automatically. Use it in custom integrations to feed quality telemetry for analytics.
:::

---

## Dial-Out from Room

### `video.placeCall(roomId, phoneNumber, callerIdNumber?)`

Dial a PSTN number from inside an active meeting (bring external caller in).

```javascript
await api.video.placeCall(
    'room-xyz789',
    '+13175551234',
    '+18005550001',   // optional caller ID to display
);
```

---

## In-Meeting Chat

### `video.postChatMessage(roomId, content, storageId?)`

Post a message to the room chat. Content uses TipTap JSON format.

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

---

### `video.getChatMessages(roomId, options?)`

Retrieve chat messages with cursor-based pagination.

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

```javascript
await api.video.editChatMessage('room-xyz789', 'msg-abc123', [
    {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Corrected message text.' }],
    },
]);
```

---

### `video.deleteChatMessage(roomId, messageId)`

Delete a chat message. Hosts can delete any message; participants can only delete their own.

```javascript
await api.video.deleteChatMessage('room-xyz789', 'msg-abc123');
```

---

## Post-Meeting Survey

### `video.submitSurvey(options)`

Submit a quality survey after a meeting ends.

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

```javascript
// Current user's settings
const settings = await api.video.getUserSettings();

// Another user's settings (admin)
const adminSettings = await api.video.getUserSettings('user-abc123');
```

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
