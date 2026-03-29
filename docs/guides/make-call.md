---
id: make-call
title: Make an Outbound Call
---

# Make an Outbound Call

This guide covers everything you need to initiate, control, and close a programmatic voice call — from a simple "click-to-call" button to a fully automated outbound IVR with recording and transcription.

## Prerequisites

- An Unbound phone number provisioned in your namespace
- A valid JWT token with voice permissions
- The recipient phone number in E.164 format (e.g., `+12135550100`)

---

## 1. Create the Call

The minimal call requires a `to`, `from`, and a voice app.

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: process.env.UNBOUND_TOKEN });

const call = await api.voice.call({
    to: '+12135550100',
    from: '+18005551234',  // Your Unbound DID
    app: {
        type: 'dial',
    },
});

const { callControlId } = call;
console.log('Call initiated:', callControlId);
```

The `callControlId` is your handle for every subsequent action on this call.

### Call with Recording and Transcription

```javascript
const call = await api.voice.call({
    to: '+12135550100',
    from: '+18005551234',
    app: {
        type: 'dial',
    },
    record: true,
    transcribe: true,
    transcribeMethod: 'google',
    transcribeLanguage: 'en-US',
});
```

### Specify Ring Timeout

```javascript
const call = await api.voice.call({
    to: '+12135550100',
    from: '+18005551234',
    app: { type: 'dial' },
    answeredBy: 'human',     // 'human' | 'machine' | 'any'
    timeout: 30,              // seconds before giving up (default: 60)
});
```

---

## 2. Control the Live Call

Once the call is answered, use `callControlId` to take actions.

### Hold and Resume

```javascript
// Put caller on hold (plays hold music)
await api.voice.hold([callControlId]);

// Resume the call
// hold() is a toggle — call it again to take off hold
await api.voice.hold([callControlId]);
```

### Mute and Unmute

```javascript
// Mute the agent's microphone (caller can't hear agent)
await api.voice.mute(callControlId, 'mute', 'send');

// Unmute
await api.voice.mute(callControlId, 'unmute', 'send');

// Mute both directions (total silence — useful for HD noise suppression)
await api.voice.mute(callControlId, 'mute', 'both');
```

### Send DTMF Digits

```javascript
// Navigate an IVR or enter digits
await api.voice.sendDtmf(callControlId, '1');
await api.voice.sendDtmf(callControlId, '5551234');
```

### Transfer to Another Number

```javascript
// Blind transfer
await api.voice.transfer({
    callControlId,
    type: 'blind',
    to: '+15556667777',
    from: '+18005551234',
});

// Attended transfer (you bridge in, announce, then hand off)
await api.voice.transfer({
    callControlId,
    type: 'attended',
    to: '+15556667777',
    from: '+18005551234',
    app: { type: 'dial' },
});
```

### Hang Up

```javascript
await api.voice.hangup(callControlId);
```

---

## 3. Recording

### Start / Stop Recording Mid-Call

By default, recording begins when the call is answered if you pass `record: true` at creation. You can also control it dynamically.

```javascript
// Start recording (e.g., after legal disclosure plays)
await api.voice.record({
    callControlId,
    action: 'start',
    stereo: true,
    channels: 'dual',        // 'dual' separates caller/agent on left/right channels
    format: 'mp3',
});

// Pause recording (e.g., during credit card entry)
await api.voice.record({
    callControlId,
    action: 'pause',
});

// Resume recording
await api.voice.record({
    callControlId,
    action: 'resume',
});

// Stop recording explicitly
await api.voice.record({
    callControlId,
    action: 'stop',
});
```

### Retrieve Recordings After the Call

```javascript
// Query objects for recordings linked to this call
const recordings = await api.objects.query({
    object: 'engagementMediaStorage',
    where: { engagementSessionId: engagementSessionId },
});

for (const rec of recordings.data) {
    const url = await api.storage.getFileUrl(rec.storageId);
    console.log('Recording URL (expires in 1 hour):', url);
}
```

---

## 4. Conference Bridge

Add a third party to a live call:

```javascript
// Conference the current call with a new outbound leg
await api.voice.conference([callControlId, secondCallControlId]);
```

To create a multi-party conference from scratch:

```javascript
// Dial participant 1
const call1 = await api.voice.call({
    to: '+12135550100',
    from: '+18005551234',
    app: { type: 'dial' },
});

// Dial participant 2
const call2 = await api.voice.call({
    to: '+13105550200',
    from: '+18005551234',
    app: { type: 'dial' },
});

// Bridge both legs into a conference
await api.voice.conference([call1.callControlId, call2.callControlId]);
```

---

## 5. Replace the Call App (IVR Handoff)

Use `replaceCallApp` to change what a call is doing mid-flight — useful for IVRs that hand off to a queue or play a dynamic prompt.

```javascript
await api.voice.replaceCallApp({
    callId: callControlId,
    app: {
        type: 'playback',
        loop: 1,
        audio: {
            type: 'tts',
            engine: 'google',
            voice: 'en-US-Neural2-F',
            text: 'Please hold while we connect you to an agent.',
        },
    },
});
```

### Voice App Command Reference

| `type` | Description |
|---|---|
| `dial` | Connect the call directly |
| `playback` | Play audio (file URL or TTS) |
| `gather` | Collect DTMF digits |
| `enqueue` | Route call to a Task Router queue |
| `record` | Record the call leg |
| `hangup` | Terminate the call |
| `bridge` | Bridge two call legs |

---

## 6. Real-Time Transcription

Enable server-side transcription at call creation or start streaming mid-call:

```javascript
// Enable at call creation
const call = await api.voice.call({
    to: '+12135550100',
    from: '+18005551234',
    app: { type: 'dial' },
    transcribe: true,
    transcribeMethod: 'google',
    transcribeLanguage: 'en-US',
    engagementSessionId: 'eng-session-123',  // link transcript to session
});

// Or start/stop mid-call
await api.voice.transcribe(call.callControlId, 'start', 'both');

// Stop transcription
await api.voice.transcribe(call.callControlId, 'stop');
```

---

## 7. Outbound IVR — Full Example

A complete outbound call that plays a message, collects a response, and branches based on the digit pressed:

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: process.env.UNBOUND_TOKEN });

async function makeOutboundIVR(phoneNumber) {
    // Step 1: Initiate call with a TTS greeting
    const call = await api.voice.call({
        to: phoneNumber,
        from: '+18005551234',
        app: {
            type: 'playback',
            loop: 1,
            audio: {
                type: 'tts',
                engine: 'google',
                voice: 'en-US-Neural2-F',
                text: 'Hello! This is a reminder about your appointment tomorrow at 2pm. '
                    + 'Press 1 to confirm, press 2 to cancel, or press 3 to reschedule.',
            },
        },
    });

    const { callControlId } = call;
    console.log('IVR call started:', callControlId);

    // Step 2: After greeting plays, start digit collection
    // In practice, this is triggered by a 'playback.finished' webhook event
    await api.voice.replaceCallApp({
        callId: callControlId,
        app: {
            type: 'gather',
            numDigits: 1,
            timeout: 10,
            finishOnKey: '#',
        },
    });

    // Step 3: Your webhook receives the gathered digit and branches
    // See your webhook handler for digit processing
    return callControlId;
}

// Webhook handler for digit collection
async function handleGatherResult(req, res) {
    const { callControlId, digits } = req.body;
    res.json({ received: true });

    switch (digits) {
        case '1':
            // Confirm appointment
            await api.voice.replaceCallApp({
                callId: callControlId,
                app: {
                    type: 'playback',
                    loop: 1,
                    audio: {
                        type: 'tts',
                        engine: 'google',
                        voice: 'en-US-Neural2-F',
                        text: 'Great! Your appointment is confirmed. See you tomorrow!',
                    },
                },
            });
            // Update the appointment record
            await api.objects.update({
                object: 'appointments',
                where: { phoneNumber: req.body.to },
                update: { status: 'confirmed' },
            });
            break;

        case '2':
            // Cancel appointment
            await api.voice.replaceCallApp({
                callId: callControlId,
                app: {
                    type: 'playback',
                    audio: {
                        type: 'tts',
                        engine: 'google',
                        voice: 'en-US-Neural2-F',
                        text: 'Your appointment has been cancelled. We will follow up by text.',
                    },
                },
            });
            await api.objects.update({
                object: 'appointments',
                where: { phoneNumber: req.body.to },
                update: { status: 'cancelled' },
            });
            break;

        case '3':
            // Transfer to scheduling agent
            await api.voice.transfer({
                callControlId,
                type: 'blind',
                to: '+18005559999',  // Scheduling queue DID
                from: '+18005551234',
            });
            break;

        default:
            // No valid digit — hang up
            await api.voice.hangup(callControlId);
    }
}
```

---

## 8. Click-to-Call (Browser)

In a browser-based softphone, initiate calls from your UI:

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: userJwtToken });

async function clickToCall(phoneNumber) {
    const button = document.getElementById('call-btn');
    button.disabled = true;
    button.textContent = 'Calling...';

    try {
        const call = await api.voice.call({
            to: phoneNumber,
            from: agentDID,
            app: { type: 'dial' },
            record: true,
        });

        window._activeCallId = call.callControlId;
        button.textContent = 'Hang Up';
        button.onclick = () => hangUp();
        button.disabled = false;
    } catch (err) {
        console.error('Call failed:', err);
        button.textContent = 'Call Failed';
        setTimeout(() => {
            button.textContent = 'Call';
            button.disabled = false;
        }, 3000);
    }
}

async function hangUp() {
    if (window._activeCallId) {
        await api.voice.hangup(window._activeCallId);
        window._activeCallId = null;
        document.getElementById('call-btn').textContent = 'Call';
    }
}
```

---

## Error Handling

```javascript
import { UnboundError } from '@unboundcx/sdk';

try {
    const call = await api.voice.call({
        to: '+12135550100',
        from: '+18005551234',
        app: { type: 'dial' },
    });
} catch (err) {
    if (err instanceof UnboundError) {
        switch (err.statusCode) {
            case 400:
                console.error('Invalid phone number format:', err.message);
                break;
            case 402:
                console.error('Insufficient credits or billing issue');
                break;
            case 403:
                console.error('Number not authorized for outbound calls');
                break;
            case 429:
                const retryAfter = err.headers?.['retry-after'] || 60;
                console.error(`Rate limited. Retry after ${retryAfter}s`);
                break;
            default:
                console.error('Voice API error:', err.message);
        }
    } else {
        throw err;
    }
}
```

---

## What's Next

- [Voice API Reference](/api-reference/voice) — every method and parameter
- [Real-Time STT Streaming](/guides/stt-streaming) — transcribe calls as they happen
- [Build a Contact Center Queue](/guides/task-router-quickstart) — route calls to agents
- [Webhooks](/guides/webhooks) — receive call events (answered, ended, digits gathered)
