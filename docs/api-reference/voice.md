---
id: voice
title: Voice
---

# Voice

`api.voice` — Make calls, control in-flight calls, conferencing, recording, and transcription.

---

## `voice.call(options)`

Initiate an outbound call.

```javascript
const call = await api.voice.call({
    to: '+1234567890',
    from: '+0987654321',
    timeout: 30,              // seconds to ring
    app: { ... },            // optional voice app object
    customHeaders: { ... },  // optional SIP headers
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `to` | string | ✅ | Destination number (E.164) |
| `from` | string | ✅ | Originating number (E.164) |
| `destination` | string | — | Alternate destination |
| `app` | object | — | Voice app object to run on answer |
| `timeout` | number | — | Ring timeout in seconds |
| `customHeaders` | object | — | SIP header overrides |

---

## `voice.hangup(callId)`

End an active call.

```javascript
await api.voice.hangup('call-id-123');
```

---

## `voice.replaceCallApp({ callId, app })`

Dynamically replace the voice app on an active call — change the call flow in real-time.

```javascript
await api.voice.replaceCallApp({
    callId: 'call-id-123',
    app: {
        version: '2.0',
        name: 'transfer-flow',
        commands: [
            { command: 'play', file: 'hold-music.wav' },
            { command: 'hangup' },
        ],
    },
});
```

---

## `voice.mute(voiceChannelId, action?, direction?)`

Mute or unmute a call leg.

```javascript
await api.voice.mute('channel-id-123');                   // mute inbound
await api.voice.mute('channel-id-123', 'mute', 'out');   // mute outbound
await api.voice.unmute('channel-id-123');                 // unmute
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `voiceChannelId` | string | — | Channel to mute |
| `action` | string | `'mute'` | `'mute'` or `'unmute'` |
| `direction` | string | `'in'` | `'in'`, `'out'`, or `'both'` |

---

## `voice.hold(channels)`

Put one or more channels on hold.

```javascript
await api.voice.hold(['channel-id-123', 'channel-id-456']);
```

---

## `voice.sendDtmf(voiceChannelId, dtmf)`

Send DTMF tones on a call.

```javascript
await api.voice.sendDtmf('channel-id-123', '1#');
```

---

## `voice.transfer(options)`

Transfer a call.

```javascript
await api.voice.transfer({
    channels: ['channel-id-123'],
    to: '+15556667777',
    callerIdName: 'Support',
    callerIdNumber: '+18005551234',
    timeout: 30,
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `channels` | string[] | ✅ | Channel IDs to transfer |
| `to` | string | — | Transfer destination (E.164) |
| `callerIdName` | string | — | Caller ID name to present |
| `callerIdNumber` | string | — | Caller ID number to present |
| `timeout` | number | — | Ring timeout in seconds |
| `voiceApp` | object | — | Voice app to run if no answer |

---

## `voice.conference(channels)`

Bridge channels into a conference call.

```javascript
await api.voice.conference(['channel-id-123', 'channel-id-456']);
```

---

## `voice.record(options)`

Start, stop, pause, or resume recording.

```javascript
// Start recording
await api.voice.record({
    callId: 'call-id-123',
    action: 'start',
    direction: 'sendrecv',  // 'send', 'recv', or 'sendrecv'
});

// Stop recording
await api.voice.record({ callId: 'call-id-123', action: 'stop' });
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `callId` | string | — | Call ID to record |
| `cdrId` | string | — | CDR ID (alternative to callId) |
| `action` | string | `'start'` | `'start'`, `'stop'`, `'pause'`, `'resume'` |
| `direction` | string | `'sendrecv'` | `'send'`, `'recv'`, or `'sendrecv'` |

**Shorthand methods:**
```javascript
await api.voice.stopRecording(voiceChannelId);
await api.voice.pauseRecording(voiceChannelId);
await api.voice.resumeRecording(voiceChannelId);
```

---

## `voice.transcribe(voiceChannelId, action?, direction?)`

Start or stop live transcription on a call.

```javascript
// Start transcribing inbound audio
await api.voice.transcribe('channel-id-123', 'start', 'in');

// Stop transcribing
await api.voice.stopTranscribing('channel-id-123');
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `voiceChannelId` | string | — | Channel ID |
| `action` | string | `'start'` | `'start'` or `'stop'` |
| `direction` | string | `'in'` | `'in'`, `'out'`, or `'both'` |
| `forwardText` | object | — | Config to forward transcript text |
| `forwardRtp` | object | — | Config to forward raw RTP |
