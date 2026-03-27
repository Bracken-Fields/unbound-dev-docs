---
id: voice
title: Voice
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/voice/calls", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "+12135550100",
    from: "+18005551234",
    timeout: 30,
    app: {
      version: "2.0",
      name: "welcome-ivr",
      commands: [
        { command: "play", file: "welcome.wav" },
        { command: "gather", numDigits: 1, timeout: 10 }
      ]
    },
    customHeaders: {
      "X-Tenant-Id": "tenant-abc"
    }
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/calls");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "to" => "+12135550100",
    "from" => "+18005551234",
    "timeout" => 30,
    "app" => [
        "version" => "2.0",
        "name" => "welcome-ivr",
        "commands" => [
            ["command" => "play", "file" => "welcome.wav"],
            ["command" => "gather", "numDigits" => 1, "timeout" => 10]
        ]
    ],
    "customHeaders" => [
        "X-Tenant-Id" => "tenant-abc"
    ]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/calls",
    headers={"Authorization": "Bearer {token}"},
    json={
        "to": "+12135550100",
        "from": "+18005551234",
        "timeout": 30,
        "app": {
            "version": "2.0",
            "name": "welcome-ivr",
            "commands": [
                {"command": "play", "file": "welcome.wav"},
                {"command": "gather", "numDigits": 1, "timeout": 10}
            ]
        },
        "customHeaders": {
            "X-Tenant-Id": "tenant-abc"
        }
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "to": "+12135550100",
  "from": "+18005551234",
  "timeout": 30,
  "app": {
    "version": "2.0",
    "name": "welcome-ivr",
    "commands": [
      {"command": "play", "file": "welcome.wav"},
      {"command": "gather", "numDigits": 1, "timeout": 10}
    ]
  },
  "customHeaders": {
    "X-Tenant-Id": "tenant-abc"
  }
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/voice/calls" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.voice.hangup('call-9f3a2c1b');
// result.status → true
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/voice/calls/call-9f3a2c1b/hangup", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/calls/call-9f3a2c1b/hangup");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/calls/call-9f3a2c1b/hangup",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/voice/calls/call-9f3a2c1b/hangup" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/voice/calls/call-9f3a2c1b/replace-app", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    app: {
      version: "2.0",
      name: "post-hold-menu",
      commands: [
        { command: "play", file: "thank-you-for-holding.wav" },
        {
          command: "gather",
          numDigits: 1,
          timeout: 10,
          action: "https://api.example.com/ivr/choice"
        }
      ]
    }
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/calls/call-9f3a2c1b/replace-app");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "app" => [
        "version" => "2.0",
        "name" => "post-hold-menu",
        "commands" => [
            ["command" => "play", "file" => "thank-you-for-holding.wav"],
            [
                "command" => "gather",
                "numDigits" => 1,
                "timeout" => 10,
                "action" => "https://api.example.com/ivr/choice"
            ]
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
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/calls/call-9f3a2c1b/replace-app",
    headers={"Authorization": "Bearer {token}"},
    json={
        "app": {
            "version": "2.0",
            "name": "post-hold-menu",
            "commands": [
                {"command": "play", "file": "thank-you-for-holding.wav"},
                {
                    "command": "gather",
                    "numDigits": 1,
                    "timeout": 10,
                    "action": "https://api.example.com/ivr/choice"
                }
            ]
        }
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "app": {
    "version": "2.0",
    "name": "post-hold-menu",
    "commands": [
      {"command": "play", "file": "thank-you-for-holding.wav"},
      {
        "command": "gather",
        "numDigits": 1,
        "timeout": 10,
        "action": "https://api.example.com/ivr/choice"
      }
    ]
  }
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/voice/calls/call-9f3a2c1b/replace-app" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Mute caller's inbound audio
const res = await fetch("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/mute", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "mute",
    direction: "in"
  })
});
const data = await res.json();

// Unmute — restore inbound audio
const res2 = await fetch("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/unmute", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    direction: "in"
  })
});
const data2 = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Mute caller's inbound audio
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/mute");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "action" => "mute",
    "direction" => "in"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Unmute — restore inbound audio
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/unmute");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "direction" => "in"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Mute caller's inbound audio
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/mute",
    headers={"Authorization": "Bearer {token}"},
    json={
        "action": "mute",
        "direction": "in"
    }
)
data = response.json()

# Unmute — restore inbound audio
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/unmute",
    headers={"Authorization": "Bearer {token}"},
    json={
        "direction": "in"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Mute caller's inbound audio
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/mute" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"action": "mute", "direction": "in"}'

# Unmute — restore inbound audio
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/unmute" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"direction": "in"}'
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Hold a single channel
await api.voice.hold(['channel-id-abc']);

// Hold multiple channels simultaneously
await api.voice.hold(['channel-id-abc', 'channel-id-xyz']);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/voice/hold", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    channels: ["channel-id-abc", "channel-id-xyz"]
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/hold");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "channels" => ["channel-id-abc", "channel-id-xyz"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/hold",
    headers={"Authorization": "Bearer {token}"},
    json={
        "channels": ["channel-id-abc", "channel-id-xyz"]
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/voice/hold" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"channels": ["channel-id-abc", "channel-id-xyz"]}'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `channels` | string[] | ✅ | Array of channel IDs to hold |

---

## `voice.sendDtmf(voiceChannelId, dtmf)`

Send DTMF tone(s) on an active call leg. Useful for navigating external IVR systems during transfers.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Send a single digit
await api.voice.sendDtmf('channel-id-abc', '1');

// Send a sequence (e.g., account number + confirm)
await api.voice.sendDtmf('channel-id-abc', '123456#');

// Send * for special menu options
await api.voice.sendDtmf('channel-id-abc', '*');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/dtmf", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    dtmf: "123456#"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/dtmf");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "dtmf" => "123456#"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/dtmf",
    headers={"Authorization": "Bearer {token}"},
    json={
        "dtmf": "123456#"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/dtmf" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"dtmf": "123456#"}'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `voiceChannelId` | string | ✅ | Channel ID to send DTMF on |
| `dtmf` | string | ✅ | DTMF digits: `0-9`, `*`, `#` |

---

## `voice.transfer(options)`

Transfer one or more channels to a new destination.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/voice/transfer", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    channels: ["channel-id-abc"],
    to: "+15556667777",
    callerIdName: "Acme Support",
    callerIdNumber: "+18005551234",
    timeout: 30
  })
});
const data = await res.json();

// Transfer with a fallback voice app (if no answer)
const res2 = await fetch("https://{namespace}.api.unbound.cx/voice/transfer", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    channels: ["channel-id-abc"],
    to: "+15556667777",
    timeout: 20,
    voiceApp: {
      version: "2.0",
      name: "voicemail-prompt",
      commands: [
        { command: "say", text: "Please leave a message after the tone." },
        { command: "record", maxLength: 60, finishOnKey: "#" },
        { command: "hangup" }
      ]
    }
  })
});
const data2 = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Blind transfer to a number
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/transfer");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "channels" => ["channel-id-abc"],
    "to" => "+15556667777",
    "callerIdName" => "Acme Support",
    "callerIdNumber" => "+18005551234",
    "timeout" => 30
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Transfer with a fallback voice app (if no answer)
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/transfer");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "channels" => ["channel-id-abc"],
    "to" => "+15556667777",
    "timeout" => 20,
    "voiceApp" => [
        "version" => "2.0",
        "name" => "voicemail-prompt",
        "commands" => [
            ["command" => "say", "text" => "Please leave a message after the tone."],
            ["command" => "record", "maxLength" => 60, "finishOnKey" => "#"],
            ["command" => "hangup"]
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

# Blind transfer to a number
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/transfer",
    headers={"Authorization": "Bearer {token}"},
    json={
        "channels": ["channel-id-abc"],
        "to": "+15556667777",
        "callerIdName": "Acme Support",
        "callerIdNumber": "+18005551234",
        "timeout": 30
    }
)
data = response.json()

# Transfer with a fallback voice app (if no answer)
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/transfer",
    headers={"Authorization": "Bearer {token}"},
    json={
        "channels": ["channel-id-abc"],
        "to": "+15556667777",
        "timeout": 20,
        "voiceApp": {
            "version": "2.0",
            "name": "voicemail-prompt",
            "commands": [
                {"command": "say", "text": "Please leave a message after the tone."},
                {"command": "record", "maxLength": 60, "finishOnKey": "#"},
                {"command": "hangup"}
            ]
        }
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "channels": ["channel-id-abc"],
  "to": "+15556667777",
  "callerIdName": "Acme Support",
  "callerIdNumber": "+18005551234",
  "timeout": 30
}
EOF
)

# Blind transfer to a number
curl -X POST "https://{namespace}.api.unbound.cx/voice/transfer" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

DATA=$(cat <<'EOF'
{
  "channels": ["channel-id-abc"],
  "to": "+15556667777",
  "timeout": 20,
  "voiceApp": {
    "version": "2.0",
    "name": "voicemail-prompt",
    "commands": [
      {"command": "say", "text": "Please leave a message after the tone."},
      {"command": "record", "maxLength": 60, "finishOnKey": "#"},
      {"command": "hangup"}
    ]
  }
}
EOF
)

# Transfer with a fallback voice app (if no answer)
curl -X POST "https://{namespace}.api.unbound.cx/voice/transfer" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Three-way conference
await api.voice.conference([
    'channel-id-agent',
    'channel-id-customer',
    'channel-id-supervisor',
]);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/voice/conference", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    channels: ["channel-id-agent", "channel-id-customer", "channel-id-supervisor"]
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/conference");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "channels" => ["channel-id-agent", "channel-id-customer", "channel-id-supervisor"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/conference",
    headers={"Authorization": "Bearer {token}"},
    json={
        "channels": ["channel-id-agent", "channel-id-customer", "channel-id-supervisor"]
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/voice/conference" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"channels": ["channel-id-agent", "channel-id-customer", "channel-id-supervisor"]}'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `channels` | string[] | ✅ | Array of channel IDs to bridge |

:::note
All channels must be active (answered) before bridging. Attempting to conference a ringing or on-hold channel will fail.
:::

---

## `voice.record(options)`

Start, stop, pause, or resume call recording.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Start recording both legs
const res = await fetch("https://{namespace}.api.unbound.cx/voice/record", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    callId: "call-9f3a2c1b",
    action: "start",
    direction: "sendrecv"
  })
});
const data = await res.json();

// Pause recording
const res2 = await fetch("https://{namespace}.api.unbound.cx/voice/record", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    callId: "call-9f3a2c1b",
    action: "pause"
  })
});
const data2 = await res2.json();

// Resume recording
const res3 = await fetch("https://{namespace}.api.unbound.cx/voice/record", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    callId: "call-9f3a2c1b",
    action: "resume"
  })
});
const data3 = await res3.json();

// Stop recording
const res4 = await fetch("https://{namespace}.api.unbound.cx/voice/record", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    callId: "call-9f3a2c1b",
    action: "stop"
  })
});
const data4 = await res4.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Start recording both legs
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/record");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "callId" => "call-9f3a2c1b",
    "action" => "start",
    "direction" => "sendrecv"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Pause recording
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/record");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "callId" => "call-9f3a2c1b",
    "action" => "pause"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Resume recording
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/record");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "callId" => "call-9f3a2c1b",
    "action" => "resume"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Stop recording
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/record");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "callId" => "call-9f3a2c1b",
    "action" => "stop"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Start recording both legs
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/record",
    headers={"Authorization": "Bearer {token}"},
    json={
        "callId": "call-9f3a2c1b",
        "action": "start",
        "direction": "sendrecv"
    }
)
data = response.json()

# Pause recording
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/record",
    headers={"Authorization": "Bearer {token}"},
    json={
        "callId": "call-9f3a2c1b",
        "action": "pause"
    }
)

# Resume recording
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/record",
    headers={"Authorization": "Bearer {token}"},
    json={
        "callId": "call-9f3a2c1b",
        "action": "resume"
    }
)

# Stop recording
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/record",
    headers={"Authorization": "Bearer {token}"},
    json={
        "callId": "call-9f3a2c1b",
        "action": "stop"
    }
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Start recording both legs
curl -X POST "https://{namespace}.api.unbound.cx/voice/record" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"callId": "call-9f3a2c1b", "action": "start", "direction": "sendrecv"}'

# Pause recording
curl -X POST "https://{namespace}.api.unbound.cx/voice/record" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"callId": "call-9f3a2c1b", "action": "pause"}'

# Resume recording
curl -X POST "https://{namespace}.api.unbound.cx/voice/record" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"callId": "call-9f3a2c1b", "action": "resume"}'

# Stop recording
curl -X POST "https://{namespace}.api.unbound.cx/voice/record" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"callId": "call-9f3a2c1b", "action": "stop"}'
```

</TabItem>
</Tabs>

| Parameter | Type | Default | Description |
|---|---|---|---|
| `callId` | string | — | Call ID to record |
| `cdrId` | string | — | CDR (Call Detail Record) ID — alternative to `callId` |
| `action` | string | `'start'` | `'start'`, `'stop'`, `'pause'`, or `'resume'` |
| `direction` | string | `'sendrecv'` | `'send'` (agent only), `'recv'` (caller only), or `'sendrecv'` (both) |

**Shorthand aliases** — take a channel ID and default to direction `'both'`:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.voice.stopRecording('channel-id-abc');
await api.voice.pauseRecording('channel-id-abc');
await api.voice.resumeRecording('channel-id-abc');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Stop recording
await fetch("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/stop-recording", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" }
});

// Pause recording
await fetch("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/pause-recording", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" }
});

// Resume recording
await fetch("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/resume-recording", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Stop recording
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/stop-recording");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Pause recording
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/pause-recording");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Resume recording
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/resume-recording");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Stop recording
requests.post(
    "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/stop-recording",
    headers={"Authorization": "Bearer {token}"}
)

# Pause recording
requests.post(
    "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/pause-recording",
    headers={"Authorization": "Bearer {token}"}
)

# Resume recording
requests.post(
    "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/resume-recording",
    headers={"Authorization": "Bearer {token}"}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Stop recording
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/stop-recording" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"

# Pause recording
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/pause-recording" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"

# Resume recording
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/resume-recording" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

</TabItem>
</Tabs>

---

## `voice.transcribe(voiceChannelId, action?, direction?, forwardText?, forwardRtp?)`

Start or stop live transcription on a call channel. Transcripts can be forwarded to a webhook or streamed as raw RTP audio.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Start transcribing inbound audio (caller's voice)
const res = await fetch("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "start",
    direction: "in"
  })
});
const data = await res.json();

// Forward transcript text to a webhook in real-time
const res2 = await fetch("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "start",
    direction: "in",
    forwardText: {
      url: "https://api.example.com/transcripts",
      method: "POST",
      headers: { "Authorization": "Bearer my-webhook-token" }
    }
  })
});
const data2 = await res2.json();

// Forward raw RTP audio to a media server
const res3 = await fetch("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "start",
    direction: "in",
    forwardRtp: {
      host: "10.0.0.5",
      port: 5004,
      codec: "PCMU"
    }
  })
});
const data3 = await res3.json();

// Stop transcription
const res4 = await fetch("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/stop-transcribing", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" }
});
const data4 = await res4.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Start transcribing inbound audio (caller's voice)
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "action" => "start",
    "direction" => "in"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Forward transcript text to a webhook in real-time
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "action" => "start",
    "direction" => "in",
    "forwardText" => [
        "url" => "https://api.example.com/transcripts",
        "method" => "POST",
        "headers" => ["Authorization" => "Bearer my-webhook-token"]
    ]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Forward raw RTP audio to a media server
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "action" => "start",
    "direction" => "in",
    "forwardRtp" => [
        "host" => "10.0.0.5",
        "port" => 5004,
        "codec" => "PCMU"
    ]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Stop transcription
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/stop-transcribing");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Start transcribing inbound audio (caller's voice)
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe",
    headers={"Authorization": "Bearer {token}"},
    json={
        "action": "start",
        "direction": "in"
    }
)
data = response.json()

# Forward transcript text to a webhook in real-time
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe",
    headers={"Authorization": "Bearer {token}"},
    json={
        "action": "start",
        "direction": "in",
        "forwardText": {
            "url": "https://api.example.com/transcripts",
            "method": "POST",
            "headers": {"Authorization": "Bearer my-webhook-token"}
        }
    }
)

# Forward raw RTP audio to a media server
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe",
    headers={"Authorization": "Bearer {token}"},
    json={
        "action": "start",
        "direction": "in",
        "forwardRtp": {
            "host": "10.0.0.5",
            "port": 5004,
            "codec": "PCMU"
        }
    }
)

# Stop transcription
response = requests.post(
    "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/stop-transcribing",
    headers={"Authorization": "Bearer {token}"}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Start transcribing inbound audio (caller's voice)
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"action": "start", "direction": "in"}'

DATA=$(cat <<'EOF'
{
  "action": "start",
  "direction": "in",
  "forwardText": {
    "url": "https://api.example.com/transcripts",
    "method": "POST",
    "headers": {"Authorization": "Bearer my-webhook-token"}
  }
}
EOF
)

# Forward transcript text to a webhook in real-time
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

DATA=$(cat <<'EOF'
{
  "action": "start",
  "direction": "in",
  "forwardRtp": {
    "host": "10.0.0.5",
    "port": 5004,
    "codec": "PCMU"
  }
}
EOF
)

# Forward raw RTP audio to a media server
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/transcribe" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Stop transcription
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/stop-transcribing" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function runSurveyCall(toNumber) {
    const res = await fetch("https://{namespace}.api.unbound.cx/voice/calls", {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({
            to: toNumber,
            from: "+18005551234",
            timeout: 30,
            app: {
                version: "2.0",
                name: "nps-survey",
                commands: [
                    {
                        command: "say",
                        text: "Thank you for being a customer. On a scale of 1 to 5, how satisfied are you? Press 1 through 5 now.",
                        voice: "Polly.Joanna"
                    },
                    {
                        command: "gather",
                        numDigits: 1,
                        timeout: 8,
                        action: "https://api.example.com/survey/response",
                        method: "POST"
                    },
                    {
                        command: "say",
                        text: "We did not receive your response. Goodbye."
                    },
                    { command: "hangup" }
                ]
            }
        })
    });

    const call = await res.json();
    console.log(`Survey call initiated: ${call.id}`);
    return call;
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function runSurveyCall($toNumber) {
    $ch = curl_init("https://{namespace}.api.unbound.cx/voice/calls");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "to" => $toNumber,
        "from" => "+18005551234",
        "timeout" => 30,
        "app" => [
            "version" => "2.0",
            "name" => "nps-survey",
            "commands" => [
                [
                    "command" => "say",
                    "text" => "Thank you for being a customer. On a scale of 1 to 5, how satisfied are you? Press 1 through 5 now.",
                    "voice" => "Polly.Joanna"
                ],
                [
                    "command" => "gather",
                    "numDigits" => 1,
                    "timeout" => 8,
                    "action" => "https://api.example.com/survey/response",
                    "method" => "POST"
                ],
                [
                    "command" => "say",
                    "text" => "We did not receive your response. Goodbye."
                ],
                ["command" => "hangup"]
            ]
        ]
    ]));

    $call = json_decode(curl_exec($ch), true);
    curl_close($ch);

    echo "Survey call initiated: " . $call['id'];
    return $call;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import os

def run_survey_call(to_number):
    response = requests.post(
        "https://{namespace}.api.unbound.cx/voice/calls",
        headers={"Authorization": f"Bearer {os.environ['UNBOUND_TOKEN']}"},
        json={
            "to": to_number,
            "from": "+18005551234",
            "timeout": 30,
            "app": {
                "version": "2.0",
                "name": "nps-survey",
                "commands": [
                    {
                        "command": "say",
                        "text": "Thank you for being a customer. On a scale of 1 to 5, how satisfied are you? Press 1 through 5 now.",
                        "voice": "Polly.Joanna"
                    },
                    {
                        "command": "gather",
                        "numDigits": 1,
                        "timeout": 8,
                        "action": "https://api.example.com/survey/response",
                        "method": "POST"
                    },
                    {
                        "command": "say",
                        "text": "We did not receive your response. Goodbye."
                    },
                    {"command": "hangup"}
                ]
            }
        }
    )

    call = response.json()
    print(f"Survey call initiated: {call['id']}")
    return call
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "to": "+12135550100",
  "from": "+18005551234",
  "timeout": 30,
  "app": {
    "version": "2.0",
    "name": "nps-survey",
    "commands": [
      {
        "command": "say",
        "text": "Thank you for being a customer. On a scale of 1 to 5, how satisfied are you? Press 1 through 5 now.",
        "voice": "Polly.Joanna"
      },
      {
        "command": "gather",
        "numDigits": 1,
        "timeout": 8,
        "action": "https://api.example.com/survey/response",
        "method": "POST"
      },
      {
        "command": "say",
        "text": "We did not receive your response. Goodbye."
      },
      {"command": "hangup"}
    ]
  }
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/voice/calls" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

### Pattern 2 — Live call coaching (supervisor barge-in)

Supervisors can monitor a call, then barge in when needed:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function supervisorBargeIn(agentChannelId, supervisorChannelId) {
    // Mute supervisor so agent/caller can't hear them initially
    await fetch(`https://{namespace}.api.unbound.cx/voice/channels/${supervisorChannelId}/mute`, {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mute", direction: "out" })
    });

    // Bridge all three parties
    await fetch("https://{namespace}.api.unbound.cx/voice/conference", {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({ channels: [agentChannelId, supervisorChannelId] })
    });

    console.log('Supervisor joined (muted)');

    // Later: unmute supervisor to barge in
    // await fetch(`https://{namespace}.api.unbound.cx/voice/channels/${supervisorChannelId}/unmute`, ...);
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function supervisorBargeIn($agentChannelId, $supervisorChannelId) {
    // Mute supervisor so agent/caller can't hear them initially
    $ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/{$supervisorChannelId}/mute");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["action" => "mute", "direction" => "out"]));
    curl_exec($ch);
    curl_close($ch);

    // Bridge all three parties
    $ch = curl_init("https://{namespace}.api.unbound.cx/voice/conference");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["channels" => [$agentChannelId, $supervisorChannelId]]));
    curl_exec($ch);
    curl_close($ch);

    echo 'Supervisor joined (muted)';

    // Later: unmute supervisor to barge in
    // curl to /voice/channels/{$supervisorChannelId}/unmute
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

def supervisor_barge_in(agent_channel_id, supervisor_channel_id):
    # Mute supervisor so agent/caller can't hear them initially
    requests.post(
        f"https://{{namespace}}.api.unbound.cx/voice/channels/{supervisor_channel_id}/mute",
        headers={"Authorization": "Bearer {token}"},
        json={"action": "mute", "direction": "out"}
    )

    # Bridge all three parties
    requests.post(
        "https://{namespace}.api.unbound.cx/voice/conference",
        headers={"Authorization": "Bearer {token}"},
        json={"channels": [agent_channel_id, supervisor_channel_id]}
    )

    print('Supervisor joined (muted)')

    # Later: unmute supervisor to barge in
    # requests.post(f"https://{{namespace}}.api.unbound.cx/voice/channels/{supervisor_channel_id}/unmute", ...)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Mute supervisor so agent/caller can't hear them initially
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/{supervisorChannelId}/mute" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"action": "mute", "direction": "out"}'

# Bridge all three parties
curl -X POST "https://{namespace}.api.unbound.cx/voice/conference" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"channels": ["{agentChannelId}", "{supervisorChannelId}"]}'

# Later: unmute supervisor to barge in
# curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/{supervisorChannelId}/unmute" ...
```

</TabItem>
</Tabs>

---

### Pattern 3 — PCI-compliant payment collection (pause recording)

Pause recording during sensitive data collection to comply with PCI-DSS:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function collectPayment(callId, channelId) {
    // Pause recording before asking for card details
    await fetch("https://{namespace}.api.unbound.cx/voice/record", {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({ callId, action: "pause" })
    });

    // Replace call app to collect card number via DTMF (never transcribed)
    await fetch(`https://{namespace}.api.unbound.cx/voice/calls/${callId}/replace-app`, {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({
            app: {
                version: "2.0",
                name: "payment-collect",
                commands: [
                    {
                        command: "say",
                        text: "Please enter your 16-digit card number followed by the pound key."
                    },
                    {
                        command: "gather",
                        numDigits: 16,
                        timeout: 30,
                        finishOnKey: "#",
                        action: "https://api.example.com/payment/card"
                    }
                ]
            }
        })
    });

    // Resume recording after card is processed
    await fetch("https://{namespace}.api.unbound.cx/voice/record", {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({ callId, action: "resume" })
    });
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function collectPayment($callId, $channelId) {
    // Pause recording before asking for card details
    $ch = curl_init("https://{namespace}.api.unbound.cx/voice/record");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["callId" => $callId, "action" => "pause"]));
    curl_exec($ch);
    curl_close($ch);

    // Replace call app to collect card number via DTMF (never transcribed)
    $ch = curl_init("https://{namespace}.api.unbound.cx/voice/calls/{$callId}/replace-app");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "app" => [
            "version" => "2.0",
            "name" => "payment-collect",
            "commands" => [
                [
                    "command" => "say",
                    "text" => "Please enter your 16-digit card number followed by the pound key."
                ],
                [
                    "command" => "gather",
                    "numDigits" => 16,
                    "timeout" => 30,
                    "finishOnKey" => "#",
                    "action" => "https://api.example.com/payment/card"
                ]
            ]
        ]
    ]));
    curl_exec($ch);
    curl_close($ch);

    // Resume recording after card is processed
    $ch = curl_init("https://{namespace}.api.unbound.cx/voice/record");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["callId" => $callId, "action" => "resume"]));
    curl_exec($ch);
    curl_close($ch);
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

def collect_payment(call_id, channel_id):
    # Pause recording before asking for card details
    requests.post(
        "https://{namespace}.api.unbound.cx/voice/record",
        headers={"Authorization": "Bearer {token}"},
        json={"callId": call_id, "action": "pause"}
    )

    # Replace call app to collect card number via DTMF (never transcribed)
    requests.post(
        f"https://{{namespace}}.api.unbound.cx/voice/calls/{call_id}/replace-app",
        headers={"Authorization": "Bearer {token}"},
        json={
            "app": {
                "version": "2.0",
                "name": "payment-collect",
                "commands": [
                    {
                        "command": "say",
                        "text": "Please enter your 16-digit card number followed by the pound key."
                    },
                    {
                        "command": "gather",
                        "numDigits": 16,
                        "timeout": 30,
                        "finishOnKey": "#",
                        "action": "https://api.example.com/payment/card"
                    }
                ]
            }
        }
    )

    # Resume recording after card is processed
    requests.post(
        "https://{namespace}.api.unbound.cx/voice/record",
        headers={"Authorization": "Bearer {token}"},
        json={"callId": call_id, "action": "resume"}
    )
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Pause recording before asking for card details
curl -X POST "https://{namespace}.api.unbound.cx/voice/record" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"callId": "call-9f3a2c1b", "action": "pause"}'

DATA=$(cat <<'EOF'
{
  "app": {
    "version": "2.0",
    "name": "payment-collect",
    "commands": [
      {
        "command": "say",
        "text": "Please enter your 16-digit card number followed by the pound key."
      },
      {
        "command": "gather",
        "numDigits": 16,
        "timeout": 30,
        "finishOnKey": "#",
        "action": "https://api.example.com/payment/card"
      }
    ]
  }
}
EOF
)

# Replace call app to collect card number via DTMF (never transcribed)
curl -X POST "https://{namespace}.api.unbound.cx/voice/calls/call-9f3a2c1b/replace-app" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Resume recording after card is processed
curl -X POST "https://{namespace}.api.unbound.cx/voice/record" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"callId": "call-9f3a2c1b", "action": "resume"}'
```

</TabItem>
</Tabs>

---

### Pattern 4 — Real-time transcription to webhook

Stream transcripts to your backend as the agent speaks:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function startAgentTranscription(channelId) {
    await fetch(`https://{namespace}.api.unbound.cx/voice/channels/${channelId}/transcribe`, {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "start",
            direction: "out",
            forwardText: {
                url: "https://api.example.com/transcripts/live",
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.WEBHOOK_SECRET}`,
                    "X-Channel-Id": channelId
                }
            }
        })
    });

    console.log(`Transcription started for channel: ${channelId}`);
}

// Webhook receives events like:
// POST /transcripts/live
// { "text": "Hello, how can I help you today?", "final": true, "channelId": "..." }
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function startAgentTranscription($channelId) {
    $ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/{$channelId}/transcribe");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "action" => "start",
        "direction" => "out",
        "forwardText" => [
            "url" => "https://api.example.com/transcripts/live",
            "method" => "POST",
            "headers" => [
                "Authorization" => "Bearer " . getenv('WEBHOOK_SECRET'),
                "X-Channel-Id" => $channelId
            ]
        ]
    ]));
    curl_exec($ch);
    curl_close($ch);

    echo "Transcription started for channel: {$channelId}";
}

// Webhook receives events like:
// POST /transcripts/live
// { "text": "Hello, how can I help you today?", "final": true, "channelId": "..." }
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import os

def start_agent_transcription(channel_id):
    requests.post(
        f"https://{{namespace}}.api.unbound.cx/voice/channels/{channel_id}/transcribe",
        headers={"Authorization": "Bearer {token}"},
        json={
            "action": "start",
            "direction": "out",
            "forwardText": {
                "url": "https://api.example.com/transcripts/live",
                "method": "POST",
                "headers": {
                    "Authorization": f"Bearer {os.environ['WEBHOOK_SECRET']}",
                    "X-Channel-Id": channel_id
                }
            }
        }
    )

    print(f"Transcription started for channel: {channel_id}")

# Webhook receives events like:
# POST /transcripts/live
# { "text": "Hello, how can I help you today?", "final": true, "channelId": "..." }
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "action": "start",
  "direction": "out",
  "forwardText": {
    "url": "https://api.example.com/transcripts/live",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer {WEBHOOK_SECRET}",
      "X-Channel-Id": "{channelId}"
    }
  }
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/{channelId}/transcribe" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Webhook receives events like:
# POST /transcripts/live
# { "text": "Hello, how can I help you today?", "final": true, "channelId": "..." }
```

</TabItem>
</Tabs>

---

### Pattern 5 — Automated DTMF navigation for outbound transfers

When transferring to an external number that has its own IVR:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function transferWithDtmf(channelId, destination, dtmfSequence) {
    // Transfer to external IVR
    await fetch("https://{namespace}.api.unbound.cx/voice/transfer", {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({
            channels: [channelId],
            to: destination,
            timeout: 30
        })
    });

    // Wait for the IVR to answer and play its prompt
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Navigate IVR menus automatically
    for (const digit of dtmfSequence.split('')) {
        await fetch(`https://{namespace}.api.unbound.cx/voice/channels/${channelId}/dtmf`, {
            method: "POST",
            headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
            body: JSON.stringify({ dtmf: digit })
        });
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

// Usage: navigate external billing IVR
await transferWithDtmf('channel-id-abc', '+18005554321', '2#1234567890#');
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function transferWithDtmf($channelId, $destination, $dtmfSequence) {
    // Transfer to external IVR
    $ch = curl_init("https://{namespace}.api.unbound.cx/voice/transfer");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "channels" => [$channelId],
        "to" => $destination,
        "timeout" => 30
    ]));
    curl_exec($ch);
    curl_close($ch);

    // Wait for the IVR to answer and play its prompt
    sleep(3);

    // Navigate IVR menus automatically
    foreach (str_split($dtmfSequence) as $digit) {
        $ch = curl_init("https://{namespace}.api.unbound.cx/voice/channels/{$channelId}/dtmf");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["dtmf" => $digit]));
        curl_exec($ch);
        curl_close($ch);
        usleep(500000); // 500ms
    }
}

// Usage: navigate external billing IVR
transferWithDtmf('channel-id-abc', '+18005554321', '2#1234567890#');
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import time

def transfer_with_dtmf(channel_id, destination, dtmf_sequence):
    # Transfer to external IVR
    requests.post(
        "https://{namespace}.api.unbound.cx/voice/transfer",
        headers={"Authorization": "Bearer {token}"},
        json={
            "channels": [channel_id],
            "to": destination,
            "timeout": 30
        }
    )

    # Wait for the IVR to answer and play its prompt
    time.sleep(3)

    # Navigate IVR menus automatically
    for digit in dtmf_sequence:
        requests.post(
            f"https://{{namespace}}.api.unbound.cx/voice/channels/{channel_id}/dtmf",
            headers={"Authorization": "Bearer {token}"},
            json={"dtmf": digit}
        )
        time.sleep(0.5)

# Usage: navigate external billing IVR
transfer_with_dtmf('channel-id-abc', '+18005554321', '2#1234567890#')
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "channels": ["channel-id-abc"],
  "to": "+18005554321",
  "timeout": 30
}
EOF
)

# Transfer to external IVR
curl -X POST "https://{namespace}.api.unbound.cx/voice/transfer" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Wait for the IVR to answer and play its prompt (sleep 3 seconds)
# Then navigate IVR menus automatically by sending DTMF digits:

curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/dtmf" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"dtmf": "2"}'

# Wait 500ms, then send next digit...
curl -X POST "https://{namespace}.api.unbound.cx/voice/channels/channel-id-abc/dtmf" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"dtmf": "#"}'

# Continue for each digit in the sequence
```

</TabItem>
</Tabs>

---

### Pattern 6 — Dynamic hold with callback queue

Put a caller on hold and play a dynamic message before routing:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function holdAndRoute(callId, channelId, estimatedWaitSeconds) {
    // Put caller on hold
    await fetch("https://{namespace}.api.unbound.cx/voice/hold", {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({ channels: [channelId] })
    });

    // Play dynamic wait time message via replaceCallApp
    await fetch(`https://{namespace}.api.unbound.cx/voice/calls/${callId}/replace-app`, {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({
            app: {
                version: "2.0",
                name: "hold-message",
                commands: [
                    {
                        command: "say",
                        text: `Your estimated wait time is ${Math.ceil(estimatedWaitSeconds / 60)} minutes. Please hold.`
                    },
                    {
                        command: "play",
                        file: "hold-music.wav"
                    }
                ]
            }
        })
    });

    // Transfer when an agent becomes available
    // (triggered via queue event or task router)
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function holdAndRoute($callId, $channelId, $estimatedWaitSeconds) {
    // Put caller on hold
    $ch = curl_init("https://{namespace}.api.unbound.cx/voice/hold");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["channels" => [$channelId]]));
    curl_exec($ch);
    curl_close($ch);

    // Play dynamic wait time message via replaceCallApp
    $waitMinutes = ceil($estimatedWaitSeconds / 60);
    $ch = curl_init("https://{namespace}.api.unbound.cx/voice/calls/{$callId}/replace-app");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "app" => [
            "version" => "2.0",
            "name" => "hold-message",
            "commands" => [
                [
                    "command" => "say",
                    "text" => "Your estimated wait time is {$waitMinutes} minutes. Please hold."
                ],
                [
                    "command" => "play",
                    "file" => "hold-music.wav"
                ]
            ]
        ]
    ]));
    curl_exec($ch);
    curl_close($ch);

    // Transfer when an agent becomes available
    // (triggered via queue event or task router)
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import math

def hold_and_route(call_id, channel_id, estimated_wait_seconds):
    # Put caller on hold
    requests.post(
        "https://{namespace}.api.unbound.cx/voice/hold",
        headers={"Authorization": "Bearer {token}"},
        json={"channels": [channel_id]}
    )

    # Play dynamic wait time message via replaceCallApp
    wait_minutes = math.ceil(estimated_wait_seconds / 60)
    requests.post(
        f"https://{{namespace}}.api.unbound.cx/voice/calls/{call_id}/replace-app",
        headers={"Authorization": "Bearer {token}"},
        json={
            "app": {
                "version": "2.0",
                "name": "hold-message",
                "commands": [
                    {
                        "command": "say",
                        "text": f"Your estimated wait time is {wait_minutes} minutes. Please hold."
                    },
                    {
                        "command": "play",
                        "file": "hold-music.wav"
                    }
                ]
            }
        }
    )

    # Transfer when an agent becomes available
    # (triggered via queue event or task router)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Put caller on hold
curl -X POST "https://{namespace}.api.unbound.cx/voice/hold" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"channels": ["channel-id-abc"]}'

DATA=$(cat <<'EOF'
{
  "app": {
    "version": "2.0",
    "name": "hold-message",
    "commands": [
      {
        "command": "say",
        "text": "Your estimated wait time is 5 minutes. Please hold."
      },
      {
        "command": "play",
        "file": "hold-music.wav"
      }
    ]
  }
}
EOF
)

# Play dynamic wait time message via replaceCallApp
curl -X POST "https://{namespace}.api.unbound.cx/voice/calls/call-9f3a2c1b/replace-app" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Transfer when an agent becomes available
# (triggered via queue event or task router)
```

</TabItem>
</Tabs>

---

## Error Handling

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
try {
    const res = await fetch("https://{namespace}.api.unbound.cx/voice/calls", {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({ to: "+12135550100", from: "+18005551234" })
    });

    if (!res.ok) {
        const error = await res.json();
        if (res.status === 422) {
            // Validation error — check error.errors[] for field-level detail
            console.error('Invalid call parameters:', error.errors);
        } else if (res.status === 403) {
            // Insufficient permissions or number not provisioned to this namespace
            console.error('Authorization error:', error.message);
        } else if (res.status === 503) {
            // Media server unavailable — retry with backoff
            console.error('Service unavailable, retry after delay');
        } else {
            throw new Error(`HTTP ${res.status}: ${error.message}`);
        }
    }

    const data = await res.json();
} catch (err) {
    console.error('Request failed:', err);
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/voice/calls");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "to" => "+12135550100",
    "from" => "+18005551234"
]));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);

if ($httpCode === 422) {
    // Validation error — check $data['errors'] for field-level detail
    error_log('Invalid call parameters: ' . json_encode($data['errors']));
} elseif ($httpCode === 403) {
    // Insufficient permissions or number not provisioned to this namespace
    error_log('Authorization error: ' . $data['message']);
} elseif ($httpCode === 503) {
    // Media server unavailable — retry with backoff
    error_log('Service unavailable, retry after delay');
} elseif ($httpCode >= 400) {
    error_log("HTTP {$httpCode}: " . $data['message']);
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

try:
    response = requests.post(
        "https://{namespace}.api.unbound.cx/voice/calls",
        headers={"Authorization": "Bearer {token}"},
        json={"to": "+12135550100", "from": "+18005551234"}
    )

    if response.status_code == 422:
        # Validation error — check response.json()['errors'] for field-level detail
        print('Invalid call parameters:', response.json().get('errors'))
    elif response.status_code == 403:
        # Insufficient permissions or number not provisioned to this namespace
        print('Authorization error:', response.json().get('message'))
    elif response.status_code == 503:
        # Media server unavailable — retry with backoff
        print('Service unavailable, retry after delay')
    elif not response.ok:
        raise Exception(f"HTTP {response.status_code}: {response.json().get('message')}")

    data = response.json()
except requests.exceptions.RequestException as err:
    print('Request failed:', err)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Using curl with error handling requires checking the HTTP status code
response=$(curl -s -w "\n%{http_code}" -X POST "https://{namespace}.api.unbound.cx/voice/calls" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"to": "+12135550100", "from": "+18005551234"}')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "422" ]; then
    echo "Invalid call parameters: $body"
elif [ "$http_code" = "403" ]; then
    echo "Authorization error: $body"
elif [ "$http_code" = "503" ]; then
    echo "Service unavailable, retry after delay"
elif [ "$http_code" -ge 400 ]; then
    echo "HTTP $http_code: $body"
else
    echo "Success: $body"
fi
```

</TabItem>
</Tabs>

| HTTP Status | Meaning |
|---|---|
| `200` / `201` | Success |
| `400` | Bad request — malformed body |
| `403` | Unauthorized — number not owned or insufficient permissions |
| `404` | Call / channel not found (may have already ended) |
| `422` | Validation error — check `err.errors[]` |
| `503` | Media server unavailable |
