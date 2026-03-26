---
id: voice
title: Voice
---

# Voice

`api.voice` — Make calls, control in-flight calls, conferencing, recording, and transcription.

---

## Overview

The Voice service provides full programmatic control over the call lifecycle: initiate outbound calls, dynamically modify in-flight call flows, bridge channels into conferences, record conversations, and transcribe audio in real-time.

### Call Lifecycle

```
dial → ringing → answered → [in-call controls] → hangup
                                ↓
                    mute / hold / dtmf / transfer
                    record / transcribe / replace-app
```

---

## Methods

| Method | Description |
|---|---|
| `voice.call(options)` | Initiate an outbound call |
| `voice.hangup(callId)` | End an active call |
| `voice.replaceCallApp({ callId, app })` | Replace the voice app on an active call |
| `voice.mute(channelId, action?, direction?)` | Mute or unmute a call leg |
| `voice.unmute(channelId, direction?)` | Unmute a call leg (alias) |
| `voice.hold(channels)` | Put channels on hold |
| `voice.sendDtmf(channelId, dtmf)` | Send DTMF tones |
| `voice.transfer(options)` | Transfer a call |
| `voice.conference(channels)` | Bridge channels into a conference |
| `voice.record(options)` | Start/stop/pause/resume recording |
| `voice.stopRecording(channelId)` | Stop recording (alias) |
| `voice.pauseRecording(channelId)` | Pause recording (alias) |
| `voice.resumeRecording(channelId)` | Resume recording (alias) |
| `voice.transcribe(channelId, action?, direction?, forwardText?, forwardRtp?)` | Start/stop live transcription |
| `voice.stopTranscribing(channelId)` | Stop transcription (alias) |

---

## `voice.call(options)`

Initiate an outbound call.

```javascript
const call = await api.voice.call({
    to: '+12135550100',
    from: '+18005551234',
    timeout: 30,
    app: {
        version: '2.0',
        name: 'welcome-ivr',
        commands: [
            { command: 'play', file: 'welcome.wav' },
            { command: 'gather', numDigits: 1, timeout: 10 },
        ],
    },
    customHeaders: {
        'X-Tenant-Id': 'tenant-abc',
    },
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `to` | string | ✅ | Destination number in E.164 format |
| `from` | string | ✅ | Originating number in E.164 format |
| `destination` | string | — | Alternate destination (overrides `to` in some routing configs) |
| `app` | object | — | Voice app to execute when the call is answered |
| `timeout` | number | — | Seconds to ring before treating as no-answer (default: 30) |
| `customHeaders` | object | — | SIP header key-value pairs to include on the INVITE |

### Response

```javascript
{
    id: 'call-9f3a2c1b',          // call ID — use for subsequent controls
    status: 'initiated',           // 'initiated' | 'ringing' | 'answered' | 'completed'
    to: '+12135550100',
    from: '+18005551234',
    direction: 'outbound',
    createdAt: '2024-03-15T10:30:00.000Z',
}
```

---

## `voice.hangup(callId)`

End an active call immediately.

```javascript
const result = await api.voice.hangup('call-9f3a2c1b');
// result.status → true
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `callId` | string | ✅ | The call ID returned by `voice.call()` or received via webhook |

### Response

```javascript
{
    status: true,    // true if hangup was accepted
}
```

---

## `voice.replaceCallApp({ callId, app })`

Dynamically swap the voice app running on an active call — change the call flow in real-time without interrupting the connection. Use this to inject a new IVR menu, play audio, or gather digits while a call is live.

```javascript
// Swap to a post-hold menu
const result = await api.voice.replaceCallApp({
    callId: 'call-9f3a2c1b',
    app: {
        version: '2.0',
        name: 'post-hold-menu',
        commands: [
            { command: 'play', file: 'thank-you-for-holding.wav' },
            {
                command: 'gather',
                numDigits: 1,
                timeout: 10,
                action: 'https://api.example.com/ivr/choice',
            },
        ],
    },
});
// result.status → true
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `callId` | string | ✅ | Active call ID to update |
| `app` | object | ✅ | New voice app object to execute |
| `app.version` | string | — | Voice app spec version (e.g., `'2.0'`) |
| `app.name` | string | — | Identifier name for the app |
| `app.commands` | array | — | Ordered list of voice commands to execute |

### Response

```javascript
{
    status: true,
    meta: {
        payload: { /* the app object sent to media manager */ },
        callId: 'call-9f3a2c1b',
    },
}
```

### Voice App Commands Reference

| Command | Key Parameters | Description |
|---|---|---|
| `play` | `file` (string) | Play an audio file URL or storage path |
| `gather` | `numDigits`, `timeout`, `action` | Collect DTMF digits from the caller |
| `say` | `text`, `voice`, `language` | TTS — speak text to the caller |
| `record` | `maxLength`, `action`, `finishOnKey` | Record caller audio to a file |
| `hangup` | — | Terminate the call |
| `dial` | `to`, `timeout`, `callerIdNumber` | Dial another number and bridge |
| `redirect` | `url` | Fetch a new voice app from a URL |
| `pause` | `length` | Pause execution for N seconds |
| `reject` | `reason` | Reject an incoming call (busy / no-answer) |

**Example — full IVR gather:**

```javascript
app: {
    version: '2.0',
    name: 'billing-ivr',
    commands: [
        {
            command: 'say',
            text: 'Press 1 for billing, press 2 for support.',
            voice: 'Polly.Joanna',
            language: 'en-US',
        },
        {
            command: 'gather',
            numDigits: 1,
            timeout: 8,
            action: 'https://api.example.com/ivr/billing-choice',
            method: 'POST',
        },
        {
            command: 'say',
            text: 'We did not receive your input. Goodbye.',
        },
        { command: 'hangup' },
    ],
}
```

---

## `voice.mute(voiceChannelId, action?, direction?)` / `voice.unmute(...)`

Mute or unmute a specific call leg.

```javascript
// Mute caller's inbound audio (agent can't hear them)
await api.voice.mute('channel-id-abc', 'mute', 'in');

// Mute agent's outbound audio (caller can't hear agent)
await api.voice.mute('channel-id-abc', 'mute', 'out');

// Mute both directions (total silence)
await api.voice.mute('channel-id-abc', 'mute', 'both');

// Unmute — restore inbound audio
await api.voice.unmute('channel-id-abc', 'in');

// Convenience alias
await api.voice.mute('channel-id-abc', 'unmute', 'in');
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `voiceChannelId` | string | — | The channel ID (leg of the call) |
| `action` | string | `'mute'` | `'mute'` or `'unmute'` |
| `direction` | string | `'in'` | `'in'` (caller→agent), `'out'` (agent→caller), or `'both'` |

:::tip Channel vs Call IDs
`voiceChannelId` is a **channel/leg ID** — each party in a call has their own channel. The `callId` from `voice.call()` is different. Channel IDs are typically received via webhooks or the task router's call events.
:::

---

## `voice.hold(channels)`

Put one or more channels on hold. Callers hear hold music until released.

```javascript
// Hold a single channel
await api.voice.hold(['channel-id-abc']);

// Hold multiple channels simultaneously
await api.voice.hold(['channel-id-abc', 'channel-id-xyz']);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `channels` | string[] | ✅ | Array of channel IDs to hold |

---

## `voice.sendDtmf(voiceChannelId, dtmf)`

Send DTMF tone(s) on an active call leg. Useful for navigating external IVR systems during transfers.

```javascript
// Send a single digit
await api.voice.sendDtmf('channel-id-abc', '1');

// Send a sequence (e.g., account number + confirm)
await api.voice.sendDtmf('channel-id-abc', '123456#');

// Send * for special menu options
await api.voice.sendDtmf('channel-id-abc', '*');
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `voiceChannelId` | string | ✅ | Channel ID to send DTMF on |
| `dtmf` | string | ✅ | DTMF digits: `0-9`, `*`, `#` |

---

## `voice.transfer(options)`

Transfer one or more channels to a new destination.

```javascript
// Blind transfer to a number
await api.voice.transfer({
    channels: ['channel-id-abc'],
    to: '+15556667777',
    callerIdName: 'Acme Support',
    callerIdNumber: '+18005551234',
    timeout: 30,
});

// Transfer with a fallback voice app (if no answer)
await api.voice.transfer({
    channels: ['channel-id-abc'],
    to: '+15556667777',
    timeout: 20,
    voiceApp: {
        version: '2.0',
        name: 'voicemail-prompt',
        commands: [
            { command: 'say', text: 'Please leave a message after the tone.' },
            { command: 'record', maxLength: 60, finishOnKey: '#' },
            { command: 'hangup' },
        ],
    },
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `channels` | string[] | ✅ | Channel IDs to transfer |
| `to` | string | — | Transfer destination in E.164 format |
| `callerIdName` | string | — | Caller ID name to present to the destination |
| `callerIdNumber` | string | — | Caller ID number to present to the destination |
| `timeout` | number | — | Ring timeout in seconds before fallback |
| `voiceApp` | object | — | Voice app to run if the destination doesn't answer |

---

## `voice.conference(channels)`

Bridge two or more channels into a conference call. All channels can hear each other.

```javascript
// Three-way conference
await api.voice.conference([
    'channel-id-agent',
    'channel-id-customer',
    'channel-id-supervisor',
]);
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `channels` | string[] | ✅ | Array of channel IDs to bridge |

:::note
All channels must be active (answered) before bridging. Attempting to conference a ringing or on-hold channel will fail.
:::

---

## `voice.record(options)`

Start, stop, pause, or resume call recording.

```javascript
// Start recording both legs
await api.voice.record({
    callId: 'call-9f3a2c1b',
    action: 'start',
    direction: 'sendrecv',
});

// Pause recording (e.g., collecting payment info)
await api.voice.record({
    callId: 'call-9f3a2c1b',
    action: 'pause',
});

// Resume after sensitive input
await api.voice.record({
    callId: 'call-9f3a2c1b',
    action: 'resume',
});

// Stop and finalize
await api.voice.record({
    callId: 'call-9f3a2c1b',
    action: 'stop',
});
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `callId` | string | — | Call ID to record |
| `cdrId` | string | — | CDR (Call Detail Record) ID — alternative to `callId` |
| `action` | string | `'start'` | `'start'`, `'stop'`, `'pause'`, or `'resume'` |
| `direction` | string | `'sendrecv'` | `'send'` (agent only), `'recv'` (caller only), or `'sendrecv'` (both) |

**Shorthand aliases** — take a channel ID and default to direction `'both'`:

```javascript
await api.voice.stopRecording('channel-id-abc');
await api.voice.pauseRecording('channel-id-abc');
await api.voice.resumeRecording('channel-id-abc');
```

---

## `voice.transcribe(voiceChannelId, action?, direction?, forwardText?, forwardRtp?)`

Start or stop live transcription on a call channel. Transcripts can be forwarded to a webhook or streamed as raw RTP audio.

```javascript
// Start transcribing inbound audio (caller's voice)
await api.voice.transcribe('channel-id-abc', 'start', 'in');

// Start transcribing outbound audio (agent's voice)
await api.voice.transcribe('channel-id-abc', 'start', 'out');

// Forward transcript text to a webhook in real-time
await api.voice.transcribe('channel-id-abc', 'start', 'in', {
    url: 'https://api.example.com/transcripts',
    method: 'POST',
    headers: { Authorization: 'Bearer my-webhook-token' },
});

// Forward raw RTP audio to a media server
await api.voice.transcribe('channel-id-abc', 'start', 'in', undefined, {
    host: '10.0.0.5',
    port: 5004,
    codec: 'PCMU',
});

// Stop transcription
await api.voice.stopTranscribing('channel-id-abc');

// Explicit stop
await api.voice.transcribe('channel-id-abc', 'stop', 'in');
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `voiceChannelId` | string | — | Channel ID to transcribe |
| `action` | string | `'start'` | `'start'` or `'stop'` |
| `direction` | string | `'in'` | `'in'` (caller), `'out'` (agent), or `'both'` |
| `forwardText` | object | — | Config to forward transcript text events to a webhook |
| `forwardRtp` | object | — | Config to forward raw RTP audio to a media server |

### `forwardText` Object

| Field | Type | Description |
|---|---|---|
| `url` | string | Webhook URL to POST transcript events |
| `method` | string | HTTP method (default: `'POST'`) |
| `headers` | object | HTTP headers to include on each request |

### `forwardRtp` Object

| Field | Type | Description |
|---|---|---|
| `host` | string | Target host/IP for RTP stream |
| `port` | number | UDP port for RTP packets |
| `codec` | string | Audio codec: `'PCMU'`, `'PCMA'`, `'OPUS'` |

---

## Common Patterns

### Pattern 1 — Outbound IVR with digit capture

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });

async function runSurveyCall(toNumber) {
    const call = await api.voice.call({
        to: toNumber,
        from: '+18005551234',
        timeout: 30,
        app: {
            version: '2.0',
            name: 'nps-survey',
            commands: [
                {
                    command: 'say',
                    text: 'Thank you for being a customer. On a scale of 1 to 5, how satisfied are you? Press 1 through 5 now.',
                    voice: 'Polly.Joanna',
                },
                {
                    command: 'gather',
                    numDigits: 1,
                    timeout: 8,
                    action: 'https://api.example.com/survey/response',
                    method: 'POST',
                },
                {
                    command: 'say',
                    text: 'We did not receive your response. Goodbye.',
                },
                { command: 'hangup' },
            ],
        },
    });

    console.log(`Survey call initiated: ${call.id}`);
    return call;
}
```

---

### Pattern 2 — Live call coaching (supervisor barge-in)

Supervisors can monitor a call, then barge in when needed:

```javascript
async function supervisorBargeIn(agentChannelId, supervisorChannelId) {
    // Mute supervisor so agent/caller can't hear them initially
    await api.voice.mute(supervisorChannelId, 'mute', 'out');

    // Bridge all three parties
    await api.voice.conference([agentChannelId, supervisorChannelId]);

    console.log('Supervisor joined (muted)');

    // Later: unmute supervisor to barge in
    // await api.voice.unmute(supervisorChannelId, 'out');
}
```

---

### Pattern 3 — PCI-compliant payment collection (pause recording)

Pause recording during sensitive data collection to comply with PCI-DSS:

```javascript
async function collectPayment(callId, channelId) {
    // Pause recording before asking for card details
    await api.voice.record({ callId, action: 'pause' });

    // Replace call app to collect card number via DTMF (never transcribed)
    await api.voice.replaceCallApp({
        callId,
        app: {
            version: '2.0',
            name: 'payment-collect',
            commands: [
                {
                    command: 'say',
                    text: 'Please enter your 16-digit card number followed by the pound key.',
                },
                {
                    command: 'gather',
                    numDigits: 16,
                    timeout: 30,
                    finishOnKey: '#',
                    action: 'https://api.example.com/payment/card',
                },
            ],
        },
    });

    // Resume recording after card is processed
    // (call your payment handler first, then:)
    await api.voice.record({ callId, action: 'resume' });
}
```

---

### Pattern 4 — Real-time transcription to webhook

Stream transcripts to your backend as the agent speaks:

```javascript
async function startAgentTranscription(channelId) {
    await api.voice.transcribe(
        channelId,
        'start',
        'out',   // transcribe agent's side
        {
            url: 'https://api.example.com/transcripts/live',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.WEBHOOK_SECRET}`,
                'X-Channel-Id': channelId,
            },
        },
    );

    console.log(`Transcription started for channel: ${channelId}`);
}

// Webhook receives events like:
// POST /transcripts/live
// { "text": "Hello, how can I help you today?", "final": true, "channelId": "..." }
```

---

### Pattern 5 — Automated DTMF navigation for outbound transfers

When transferring to an external number that has its own IVR:

```javascript
async function transferWithDtmf(channelId, destination, dtmfSequence) {
    // Transfer to external IVR
    await api.voice.transfer({
        channels: [channelId],
        to: destination,
        timeout: 30,
    });

    // Wait for the IVR to answer and play its prompt
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Navigate IVR menus automatically
    for (const digit of dtmfSequence.split('')) {
        await api.voice.sendDtmf(channelId, digit);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

// Usage: navigate external billing IVR
await transferWithDtmf('channel-id-abc', '+18005554321', '2#1234567890#');
```

---

### Pattern 6 — Dynamic hold with callback queue

Put a caller on hold and play a dynamic message before routing:

```javascript
async function holdAndRoute(callId, channelId, estimatedWaitSeconds) {
    // Put caller on hold
    await api.voice.hold([channelId]);

    // Play dynamic wait time message via replaceCallApp
    await api.voice.replaceCallApp({
        callId,
        app: {
            version: '2.0',
            name: 'hold-message',
            commands: [
                {
                    command: 'say',
                    text: `Your estimated wait time is ${Math.ceil(estimatedWaitSeconds / 60)} minutes. Please hold.`,
                },
                {
                    command: 'play',
                    file: 'hold-music.wav',
                },
            ],
        },
    });

    // Transfer when an agent becomes available
    // (triggered via queue event or task router)
}
```

---

## Error Handling

```javascript
try {
    await api.voice.call({ to: '+12135550100', from: '+18005551234' });
} catch (err) {
    if (err.status === 422) {
        // Validation error — check err.errors[] for field-level detail
        console.error('Invalid call parameters:', err.errors);
    } else if (err.status === 403) {
        // Insufficient permissions or number not provisioned to this namespace
        console.error('Authorization error:', err.message);
    } else if (err.status === 503) {
        // Media server unavailable — retry with backoff
        console.error('Service unavailable, retry after delay');
    } else {
        throw err;
    }
}
```

| HTTP Status | Meaning |
|---|---|
| `200` / `201` | Success |
| `400` | Bad request — malformed body |
| `403` | Unauthorized — number not owned or insufficient permissions |
| `404` | Call / channel not found (may have already ended) |
| `422` | Validation error — check `err.errors[]` |
| `503` | Media server unavailable |
