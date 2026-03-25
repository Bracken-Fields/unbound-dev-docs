---
id: voice
title: Voice
---

# Voice

`api.voice` — Make calls, manage conferences, control in-flight calls, and access recordings.

## Make a Call

```javascript
const call = await api.voice.createCall({
  to: '+1234567890',
  from: '+0987654321',
  record: true,
  transcribe: true,
});

console.log('Call Control ID:', call.callControlId);
```

| Parameter | Type | Description |
|---|---|---|
| `to` | string | Destination number (E.164) |
| `from` | string | Originating number (E.164) |
| `record` | boolean | Enable call recording |
| `transcribe` | boolean | Enable live transcription |

## Call Controls

Once a call is in progress, use `callControlId` to control it:

```javascript
// Mute/unmute
await api.voice.mute(callControlId);
await api.voice.unmute(callControlId);

// Hold/unhold
await api.voice.hold(callControlId);
await api.voice.unhold(callControlId);

// Send DTMF tones
await api.voice.sendDtmf(callControlId, '1234#');

// Transfer to another number
await api.voice.transfer(callControlId, '+15555555555');

// Hang up
await api.voice.hangup(callControlId);
```

## Conference Calls

```javascript
// Create a conference
const conference = await api.voice.createConference({
  name: 'Team Standup',
});

// Add a call to the conference
await api.voice.joinConference(callControlId, conference.id);

// Mute a participant in conference
await api.voice.muteConferenceParticipant(conference.id, participantId);

// Remove a participant
await api.voice.removeConferenceParticipant(conference.id, participantId);
```

## Recordings

```javascript
// List recordings for a call
const recordings = await api.voice.getRecordings(callControlId);

// Get a specific recording
const recording = await api.voice.getRecording(recordingId);
// recording.url — download URL
```
