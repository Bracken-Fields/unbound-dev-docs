---
id: make-call
title: Make an Outbound Call
---

# Make an Outbound Call

This guide shows how to initiate a call and control it programmatically.

## 1. Create the Call

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: 'your-jwt' });

const call = await api.voice.createCall({
  to: '+1234567890',
  from: '+0987654321',
  record: true,
  transcribe: true,
});

const { callControlId } = call;
console.log('Call started:', callControlId);
```

## 2. Control the Call

Once the call is answered, use `callControlId` to interact:

```javascript
// Put caller on hold
await api.voice.hold(callControlId);

// Resume
await api.voice.unhold(callControlId);

// Send DTMF
await api.voice.sendDtmf(callControlId, '1');

// Transfer to a different number
await api.voice.transfer(callControlId, '+15556667777');

// Hang up
await api.voice.hangup(callControlId);
```

## 3. Conference Bridge

To add a third party:

```javascript
// Create a conference
const conference = await api.voice.createConference({ name: 'Support Bridge' });

// Add the original caller
await api.voice.joinConference(callControlId, conference.id);

// Dial a second caller and add them too
const call2 = await api.voice.createCall({
  to: '+15556667777',
  from: '+0987654321',
});
await api.voice.joinConference(call2.callControlId, conference.id);
```

## 4. Access Recordings

After the call ends:

```javascript
const recordings = await api.voice.getRecordings(callControlId);
console.log('Recording URL:', recordings[0].url);
```

## What's Next

- [Voice API Reference](/api-reference/voice)
- [Real-Time STT Streaming](/guides/stt-streaming)
