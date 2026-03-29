---
id: ai
title: AI Services
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# AI Services

`sdk.ai` — Generative chat, text-to-speech, real-time speech-to-text streaming, AI playbooks, and data extraction.

---

## Generative AI

### `ai.generative.chat(options)`

Send a conversation to a generative AI model and receive a response.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const response = await sdk.ai.generative.chat({
    messages: [
        { role: 'system', content: 'You are a helpful support agent.' },
        { role: 'user', content: 'What is your return policy?' },
    ],
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.7,
    subscriptionId: 'sub_123',
});

console.log(response.choices[0].message.content);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/chat", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [
      { role: "system", content: "You are a helpful support agent." },
      { role: "user", content: "What is your return policy?" }
    ],
    provider: "openai",
    model: "gpt-4o",
    temperature: 0.7,
    subscriptionId: "sub_123"
  })
});
const data = await res.json();
console.log(data.choices[0].message.content);
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/chat");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "messages" => [
        ["role" => "system", "content" => "You are a helpful support agent."],
        ["role" => "user", "content" => "What is your return policy?"]
    ],
    "provider" => "openai",
    "model" => "gpt-4o",
    "temperature" => 0.7,
    "subscriptionId" => "sub_123"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
echo $response["choices"][0]["message"]["content"];
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/chat",
    headers={"Authorization": "Bearer {token}"},
    json={
        "messages": [
            {"role": "system", "content": "You are a helpful support agent."},
            {"role": "user", "content": "What is your return policy?"}
        ],
        "provider": "openai",
        "model": "gpt-4o",
        "temperature": 0.7,
        "subscriptionId": "sub_123"
    }
)
data = response.json()
print(data["choices"][0]["message"]["content"])
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "messages": [
    {"role": "system", "content": "You are a helpful support agent."},
    {"role": "user", "content": "What is your return policy?"}
  ],
  "provider": "openai",
  "model": "gpt-4o",
  "temperature": 0.7,
  "subscriptionId": "sub_123"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/chat" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Default | Description |
|---|---|---|---|
| `prompt` | string | — | Simple single-turn prompt (alternative to `messages`) |
| `messages` | array | — | Multi-turn message array `[{ role, content }]` |
| `systemPrompt` | string | — | System-level instruction (alternative to messages system role) |
| `provider` | string | — | AI provider (`openai`, `anthropic`, `google`, etc.) |
| `model` | string | — | Model identifier (e.g., `gpt-4o`, `claude-3-5-sonnet`, `gemini-1.5-pro`) |
| `temperature` | number | — | Sampling temperature (0.0–2.0); lower = more deterministic |
| `subscriptionId` | string | — | AI subscription configuration to use |
| `stream` | boolean | `false` | Stream the response (returns raw HTTP response) |
| `responseFormat` | object | — | Structured output format (e.g., `{ type: 'json_object' }`) |
| `relatedId` | string | — | ID of a related entity to attach this chat to |
| `isPlayground` | boolean | `false` | Mark as a playground/test call |

**Response shape:**

```javascript
{
    choices: [
        {
            message: { role: 'assistant', content: 'Our return policy...' },
            finish_reason: 'stop',
            index: 0,
        }
    ],
    usage: {
        prompt_tokens: 45,
        completion_tokens: 120,
        total_tokens: 165,
    },
    model: 'gpt-4o',
    id: 'chatcmpl_abc123',
}
```

**Streaming example:**

```javascript
const rawResponse = await sdk.ai.generative.chat({
    prompt: 'Summarize this support ticket in 3 bullet points.',
    stream: true,
});

// rawResponse is a fetch Response object
const reader = rawResponse.body.getReader();
const decoder = new TextDecoder();

while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    // Parse server-sent events
    for (const line of chunk.split('\n')) {
        if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            const parsed = JSON.parse(data);
            process.stdout.write(parsed.choices[0].delta.content || '');
        }
    }
}
```

---

### `ai.generative.playbook(options)`

Run a playbook-driven generative chat. The playbook defines the system prompt, model, and behavior.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const response = await sdk.ai.generative.playbook({
    playbookId: 'pb_support_triage',
    messages: [
        { role: 'user', content: 'My internet is down.' },
    ],
    sessionId: 'session_abc123',  // maintain conversation state
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    playbookId: "pb_support_triage",
    messages: [
      { role: "user", content: "My internet is down." }
    ],
    sessionId: "session_abc123"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "playbookId" => "pb_support_triage",
    "messages" => [
        ["role" => "user", "content" => "My internet is down."]
    ],
    "sessionId" => "session_abc123"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/playbook",
    headers={"Authorization": "Bearer {token}"},
    json={
        "playbookId": "pb_support_triage",
        "messages": [
            {"role": "user", "content": "My internet is down."}
        ],
        "sessionId": "session_abc123"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "playbookId": "pb_support_triage",
  "messages": [
    {"role": "user", "content": "My internet is down."}
  ],
  "sessionId": "session_abc123"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/playbook" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `playbookId` | string | ✓ | The playbook to use |
| `messages` | array | — | Conversation history |
| `prompt` | string | — | Single-turn prompt (if no messages) |
| `sessionId` | string | — | Session ID to maintain conversation continuity |
| `model` | string | — | Override the playbook's default model |
| `temperature` | number | — | Override temperature |
| `subscriptionId` | string | — | AI subscription override |
| `stream` | boolean | `false` | Stream the response |
| `relatedId` | string | — | Related entity ID |

---

## Text-to-Speech

### `ai.tts.create(options)`

Synthesize text to audio using Google Cloud TTS.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const audio = await sdk.ai.tts.create({
    text: 'Hello, thank you for calling Acme Support.',
    voice: 'en-US-Neural2-C',
    languageCode: 'en-US',
    audioEncoding: 'MP3',
    speakingRate: 1.0,
    pitch: 0,
    volumeGainDb: 0,
    createAccessKey: true,
});

// audio.audioContent — base64-encoded audio bytes
// audio.url — hosted URL (if createAccessKey: true)
// audio.storageId — ID of stored audio file
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/tts", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "Hello, thank you for calling Acme Support.",
    voice: "en-US-Neural2-C",
    languageCode: "en-US",
    audioEncoding: "MP3",
    speakingRate: 1.0,
    pitch: 0,
    volumeGainDb: 0,
    createAccessKey: true
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/tts");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "text" => "Hello, thank you for calling Acme Support.",
    "voice" => "en-US-Neural2-C",
    "languageCode" => "en-US",
    "audioEncoding" => "MP3",
    "speakingRate" => 1.0,
    "pitch" => 0,
    "volumeGainDb" => 0,
    "createAccessKey" => true
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/tts",
    headers={"Authorization": "Bearer {token}"},
    json={
        "text": "Hello, thank you for calling Acme Support.",
        "voice": "en-US-Neural2-C",
        "languageCode": "en-US",
        "audioEncoding": "MP3",
        "speakingRate": 1.0,
        "pitch": 0,
        "volumeGainDb": 0,
        "createAccessKey": True
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "text": "Hello, thank you for calling Acme Support.",
  "voice": "en-US-Neural2-C",
  "languageCode": "en-US",
  "audioEncoding": "MP3",
  "speakingRate": 1.0,
  "pitch": 0,
  "volumeGainDb": 0,
  "createAccessKey": true
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/tts" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Default | Description |
|---|---|---|---|
| `text` | string | **required** | Text to synthesize (max ~5000 chars) |
| `voice` | string | — | Voice name (see `ai.tts.list()` for options) |
| `languageCode` | string | — | BCP-47 language code (e.g., `en-US`, `es-MX`) |
| `ssmlGender` | string | — | `MALE`, `FEMALE`, or `NEUTRAL` |
| `audioEncoding` | string | — | `MP3`, `OGG_OPUS`, or `LINEAR16` |
| `speakingRate` | number | `1.0` | Speed multiplier (0.25–4.0) |
| `pitch` | number | `0` | Pitch in semitones (−20 to +20) |
| `volumeGainDb` | number | `0` | Volume gain in dB (−96.0 to +16.0) |
| `effectsProfileIds` | array | — | Audio effects profiles (e.g., `['telephony-class-application']`) |
| `createAccessKey` | boolean | `false` | Store audio and return a hosted URL |

**Response shape:**

```javascript
{
    audioContent: 'SUQzBAAAAAAAI...',  // base64 MP3/WAV bytes
    url: 'https://storage.example.com/tts/abc123.mp3',  // if createAccessKey: true
    storageId: 'store_abc123',
    durationMs: 1840,
}
```

---

### `ai.tts.list()`

List all available TTS voices.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const voices = await sdk.ai.tts.list();
// voices.voices → [{ name: 'en-US-Neural2-A', gender: 'FEMALE', languageCodes: ['en-US'], ... }, ...]
// voices.count → 380
// voices.supportedEncodings → ['MP3', 'OGG_OPUS', 'LINEAR16']
// voices.supportedLanguages → ['en-US', 'es-MX', 'fr-FR', ...]
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/tts/voices", {
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/tts/voices");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/ai/tts/voices",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/ai/tts/voices" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Speech-to-Text

### `ai.stt.create(options)` — File/Batch Transcription

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const transcription = await sdk.ai.stt.create({
    sourceType: 'storage',      // 'storage' | 'file' | 'url' | 'stream'
    storageId: 'store_audio_xyz',
    engine: 'google',           // 'google' | 'deepgram' | 'whisper'
    languageCode: 'en-US',
    metadata: {
        diarizationEnabled: true,
        speakerCount: 2,
        enableAutomaticPunctuation: true,
    },
    engagementSessionId: 'eng_123',
    playbookId: 'pb_456',
    name: 'Support Call 2024-01-15',
    role: 'agent',
    direction: 'inbound',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/stt", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    sourceType: "storage",
    storageId: "store_audio_xyz",
    engine: "google",
    languageCode: "en-US",
    metadata: {
      diarizationEnabled: true,
      speakerCount: 2,
      enableAutomaticPunctuation: true
    },
    engagementSessionId: "eng_123",
    playbookId: "pb_456",
    name: "Support Call 2024-01-15",
    role: "agent",
    direction: "inbound"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/stt");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "sourceType" => "storage",
    "storageId" => "store_audio_xyz",
    "engine" => "google",
    "languageCode" => "en-US",
    "metadata" => [
        "diarizationEnabled" => true,
        "speakerCount" => 2,
        "enableAutomaticPunctuation" => true
    ],
    "engagementSessionId" => "eng_123",
    "playbookId" => "pb_456",
    "name" => "Support Call 2024-01-15",
    "role" => "agent",
    "direction" => "inbound"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/stt",
    headers={"Authorization": "Bearer {token}"},
    json={
        "sourceType": "storage",
        "storageId": "store_audio_xyz",
        "engine": "google",
        "languageCode": "en-US",
        "metadata": {
            "diarizationEnabled": True,
            "speakerCount": 2,
            "enableAutomaticPunctuation": True
        },
        "engagementSessionId": "eng_123",
        "playbookId": "pb_456",
        "name": "Support Call 2024-01-15",
        "role": "agent",
        "direction": "inbound"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "sourceType": "storage",
  "storageId": "store_audio_xyz",
  "engine": "google",
  "languageCode": "en-US",
  "metadata": {
    "diarizationEnabled": true,
    "speakerCount": 2,
    "enableAutomaticPunctuation": true
  },
  "engagementSessionId": "eng_123",
  "playbookId": "pb_456",
  "name": "Support Call 2024-01-15",
  "role": "agent",
  "direction": "inbound"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/stt" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Description |
|---|---|---|
| `sourceType` | string | `storage`, `file`, `url`, or `stream` |
| `storageId` | string | Storage file ID (when `sourceType: 'storage'`) |
| `sourceId` | string | Source identifier (file path or URL) |
| `sipCallId` | string | SIP call ID to transcribe |
| `cdrId` | string | CDR record ID to transcribe |
| `engine` | string | `google`, `deepgram`, or `whisper` |
| `languageCode` | string | BCP-47 language code (default: `en-US`) |
| `metadata` | object | Engine-specific configuration |
| `engagementSessionId` | string | Link to an engagement session |
| `playbookId` | string | AI playbook to associate |
| `name` | string | Human-readable label for this transcription |
| `role` | string | Speaker role (`agent`, `customer`) |
| `direction` | string | Call direction (`inbound`, `outbound`) |

**Response shape:**

```javascript
{
    id: 'stt_abc123',
    status: 'completed',   // 'pending' | 'processing' | 'completed' | 'failed'
    engine: 'google',
    languageCode: 'en-US',
    sourceType: 'storage',
    storageId: 'store_xyz',
    messages: [
        {
            id: 'msg_1',
            text: 'Thank you for calling, how can I help?',
            role: 'agent',
            confidence: 0.97,
            duration: 2.3,
            timestamp: 1705339200000,
        },
        // ...
    ],
    duration: 185.4,
    wordCount: 312,
    engagementSessionId: 'eng_123',
    createdAt: '2024-01-15T14:23:00Z',
    completedAt: '2024-01-15T14:23:45Z',
}
```

---

### `ai.stt.stream(options)` — Real-Time Streaming

:::info Node.js only
STT streaming requires a Node.js environment. Browser-based streaming is not supported.
:::

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const stream = await sdk.ai.stt.stream({
    engine: 'google',
    model: 'phone_call',        // 'phone_call' | 'default' | 'video'
    languageCode: 'en-US',
    encoding: 'LINEAR16',
    sampleRateHertz: 8000,      // 8000 for telephony, 16000 for microphone
    audioChannelCount: 1,
    interimResults: true,
    enableAutomaticPunctuation: true,
    diarizationEnabled: false,
    vadEnabled: false,
    generateTranscriptSummary: true,
    generateSentiment: true,
    engagementSessionId: 'eng_123',
});

stream.on('transcript', (result) => {
    if (result.isFinal) {
        console.log('[FINAL]', result.text, '| confidence:', result.confidence);
    } else {
        process.stdout.write(`\r[interim] ${result.text}`);
    }
});

stream.on('sentiment', (data) => {
    console.log('Sentiment score:', data.score, '| trend:', data.trend);
});

stream.on('error', (err) => console.error('Stream error:', err));
stream.on('close', () => console.log('Stream ended. Session ID:', stream.sessionId));

// Write audio chunks (Buffer or Uint8Array)
stream.write(audioBuffer);
stream.end();  // Finalize when done
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const WebSocket = require("ws");
const ws = new WebSocket("wss://{namespace}.api.unbound.cx/ai/stt/stream", {
  headers: { "Authorization": "Bearer {token}" }
});

ws.on("open", () => {
  ws.send(JSON.stringify({
    engine: "google",
    model: "phone_call",
    languageCode: "en-US",
    encoding: "LINEAR16",
    sampleRateHertz: 8000,
    audioChannelCount: 1,
    interimResults: true,
    enableAutomaticPunctuation: true,
    diarizationEnabled: false,
    vadEnabled: false,
    generateTranscriptSummary: true,
    generateSentiment: true,
    engagementSessionId: "eng_123"
  }));
  // Then send binary audio frames via ws.send(audioBuffer)
});

ws.on("message", (data) => {
  const msg = JSON.parse(data);
  console.log(msg);
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// PHP WebSocket requires a library such as textalk/websocket
use WebSocket\Client;

$client = new Client("wss://{namespace}.api.unbound.cx/ai/stt/stream", [
    "headers" => ["Authorization" => "Bearer {token}"]
]);

$client->text(json_encode([
    "engine" => "google",
    "model" => "phone_call",
    "languageCode" => "en-US",
    "encoding" => "LINEAR16",
    "sampleRateHertz" => 8000,
    "audioChannelCount" => 1,
    "interimResults" => true,
    "enableAutomaticPunctuation" => true,
    "diarizationEnabled" => false,
    "vadEnabled" => false,
    "generateTranscriptSummary" => true,
    "generateSentiment" => true,
    "engagementSessionId" => "eng_123"
]));
// Then send binary audio frames via $client->binary($audioData)

while ($msg = $client->receive()) {
    echo $msg . "\n";
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import websockets, asyncio, json

async def stream_stt():
    uri = "wss://{namespace}.api.unbound.cx/ai/stt/stream"
    headers = {"Authorization": "Bearer {token}"}
    async with websockets.connect(uri, extra_headers=headers) as ws:
        await ws.send(json.dumps({
            "engine": "google",
            "model": "phone_call",
            "languageCode": "en-US",
            "encoding": "LINEAR16",
            "sampleRateHertz": 8000,
            "audioChannelCount": 1,
            "interimResults": True,
            "enableAutomaticPunctuation": True,
            "diarizationEnabled": False,
            "vadEnabled": False,
            "generateTranscriptSummary": True,
            "generateSentiment": True,
            "engagementSessionId": "eng_123"
        }))
        # Send binary audio frames via await ws.send(audio_bytes)
        async for message in ws:
            print(json.loads(message))

asyncio.run(stream_stt())
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# WebSocket-based endpoint — use a WebSocket client such as websocat
websocat "wss://{namespace}.api.unbound.cx/ai/stt/stream" \
  -H "Authorization: Bearer {token}" \
  --text '{"engine":"google","model":"phone_call","languageCode":"en-US","encoding":"LINEAR16","sampleRateHertz":8000,"audioChannelCount":1,"interimResults":true,"enableAutomaticPunctuation":true,"generateTranscriptSummary":true,"generateSentiment":true,"engagementSessionId":"eng_123"}'
# Then pipe binary audio data into the WebSocket connection
```

</TabItem>
</Tabs>

**Stream options:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `engine` | string | `'google'` | STT engine (`google`, `deepgram`, `whisper`) |
| `model` | string | — | Model variant (`phone_call`, `default`, `video`, `latest_long`) |
| `languageCode` | string | `'en-US'` | BCP-47 language code |
| `encoding` | string | `'LINEAR16'` | Audio encoding format |
| `sampleRateHertz` | number | `16000` | Sample rate in Hz (8000 for telephony) |
| `audioChannelCount` | number | `1` | Channels (1 = mono, 2 = stereo) |
| `singleUtterance` | boolean | `false` | Stop after first complete utterance |
| `interimResults` | boolean | `true` | Emit partial transcripts as you speak |
| `enableAutomaticPunctuation` | boolean | `true` | Add punctuation automatically |
| `diarizationEnabled` | boolean | `false` | Separate transcripts by speaker |
| `speakerCount` | number | — | Expected number of speakers (with diarization) |
| `vadEnabled` | boolean | `false` | Voice Activity Detection |
| `minSilenceDuration` | number | `500` | Min silence (ms) before VAD triggers |
| `speechPadMs` | number | `400` | Padding (ms) around speech segments |
| `generateSubject` | boolean | — | Auto-generate a subject line when stream ends |
| `generateTranscriptSummary` | boolean | — | Auto-generate summary when stream ends |
| `generateSentiment` | boolean | — | Analyze sentiment per transcript |
| `engagementSessionId` | string | — | Link to engagement session |
| `playbookId` | string | — | Associate with AI playbook |
| `taskId` | string | — | Link to task router task |
| `workerId` | string | — | Link to a specific worker |
| `sipCallId` | string | — | SIP call identifier (ties stream to a call record) |
| `cdrId` | string | — | CDR record ID (alternative call reference) |
| `bridgeId` | string | — | Bridge identifier for multi-leg calls |
| `name` | string | — | Human-readable session name |
| `metadata` | object | — | Arbitrary key-value metadata |

**Stream events:**

| Event | Payload | Description |
|---|---|---|
| `ready` | — | gRPC connection established; stream is ready to accept audio |
| `transcript` | `TranscriptResult` | Transcription result (interim or final) |
| `final-transcript` | `TranscriptResult` | Dedicated event — only fires when `isFinal: true` |
| `error` | `Error` | Stream or connection error |
| `close` | — | Stream has fully closed and all listeners removed |

**`transcript` / `final-transcript` payload shape:**

```typescript
interface TranscriptResult {
    text: string;          // Transcribed text (partial or final)
    isFinal: boolean;      // True when utterance is complete and committed
    confidence: number;    // 0.0–1.0 confidence score
    languageCode: string;  // BCP-47 code (e.g., "en-US")
    words: Array<{
        word: string;
        startTime: number;  // Seconds from stream start
        endTime: number;
        confidence: number;
    }>;
    startTime: number;     // Start of utterance (seconds)
    endTime: number;       // End of utterance (seconds)
    timestamp: Date;       // Wall-clock time of this result
    // Stream identification (set per chunk via streamMetadata)
    sipCallId: string;     // SIP call identifier (empty string if not set)
    side: string;          // 'send' | 'recv' (empty string if not set)
    role: string;          // Speaker role (empty string if not set)
}
```

**Listening to the `ready` event:**

```javascript
const stream = await sdk.ai.stt.stream({ engine: 'google' });

// Option A: wait for ready before writing audio
stream.once('ready', () => {
    console.log('Stream connected. Session ID:', stream.sessionId);
    audioSource.pipe(stream);
});

// Option B: write immediately — chunks are buffered until ready fires
stream.write(firstChunk);  // safe to call before 'ready'
```

**Using `final-transcript` to avoid filtering:**

```javascript
// Instead of checking isFinal in the transcript handler...
stream.on('transcript', (result) => {
    if (result.isFinal) { /* ... */ }
});

// ...use the dedicated event for final results only:
stream.on('final-transcript', (result) => {
    // result.isFinal is always true here
    transcript.push(result.text);
    console.log('[COMMITTED]', result.text, '| conf:', result.confidence.toFixed(2));
});

stream.on('transcript', (result) => {
    if (!result.isFinal) {
        process.stdout.write(`\r[interim] ${result.text}      `);
    }
});
```

---

**`stream.write(audioChunk, streamMetadata?)` — Writing audio with metadata:**

The second argument lets you attach per-chunk stream identification. On the first chunk, this metadata is included in the gRPC session config. On subsequent chunks, `sipCallId`, `side`, `role`, `bridgeId`, and VAD fields are forwarded with each gRPC write.

```typescript
interface StreamMetadata {
    sipCallId?: string;       // SIP call identifier (ties transcript to a call record)
    side?: string;            // 'send' (agent leg) | 'recv' (customer leg)
    role?: string;            // Speaker role: 'agent', 'customer', 'system', etc.
    isLastChunk?: boolean;    // Mark this chunk as the final audio for this stream (triggers end)
    bridgeId?: string;        // Bridge identifier for multi-leg calls
    // Voice Activity Detection (VAD) fields — sent when your client does its own VAD
    vad_event?: string;       // 'speech_start' | 'speech_end'
    vad_timestamp?: number;   // Milliseconds from stream start
    vad_energy?: number;      // Signal energy level (optional)
    vad_duration?: number;    // Duration of the VAD event in milliseconds (optional)
}
```

```javascript
// Basic write (no metadata)
stream.write(audioChunk);

// Write with call identification (best practice for telephony integrations)
stream.write(audioChunk, {
    sipCallId: 'sip_call_abc123',
    side: 'recv',       // 'recv' = inbound customer audio
    role: 'customer',
    bridgeId: 'bridge_xyz',
});

// Mark the final chunk (triggers stream end on the server side)
stream.write(lastChunk, {
    sipCallId: 'sip_call_abc123',
    side: 'recv',
    role: 'customer',
    isLastChunk: true,
});

// Client-driven VAD event (pass alongside audio when your app detects speech activity)
stream.write(audioChunk, {
    vad_event: 'speech_start',
    vad_timestamp: 4500,   // ms from stream start
    vad_energy: 0.82,
});
```

**`stream.write()` return value:** Returns `true` if the write succeeded, `false` if the stream is already closed. If the stream is not yet ready (gRPC not connected), the write is automatically deferred until `ready` fires.

---

**Stream properties and methods:**

| Property / Method | Type | Description |
|---|---|---|
| `stream.ready` | `boolean` | `true` when the gRPC connection is established and the stream is open |
| `stream.sessionId` | `string` | The server-assigned STT session ID (available after `ready`) |
| `stream.end()` | `void` | Gracefully finalize the stream — writes a zero-byte final chunk marker, then calls `grpcCall.end()` |
| `stream.close()` | `void` | Immediately close and destroy the stream, emit `'close'`, and remove all listeners |

**`end()` vs `close()` — when to use which:**

```javascript
// end() — use when audio is done; let the server finish processing and send final results
audioStream.on('finish', () => {
    stream.end();   // waits for final transcript(s) before 'close' fires
});

// close() — use for error recovery or forceful shutdown
stream.on('error', (err) => {
    console.error('STT error, aborting:', err.message);
    stream.close();  // immediately tears down; any buffered results are dropped
});

// Pattern: timeout guard — force-close if stream hangs
const timer = setTimeout(() => {
    if (!stream.isClosed) {
        console.warn('STT stream timeout — forcing close');
        stream.close();
    }
}, 30_000);

stream.once('close', () => clearTimeout(timer));
```

---

**Dual-channel telephony transcription (agent + customer legs):**

For live call transcription where you have separate audio streams for each leg:

```javascript
async function transcribeBothLegs(callId, bridgeId) {
    // Create two streams: one per leg
    const [agentStream, customerStream] = await Promise.all([
        sdk.ai.stt.stream({
            engine: 'google',
            model: 'phone_call',
            languageCode: 'en-US',
            encoding: 'LINEAR16',
            sampleRateHertz: 8000,
            generateSentiment: true,
            sipCallId: callId,
            bridgeId,
        }),
        sdk.ai.stt.stream({
            engine: 'google',
            model: 'phone_call',
            languageCode: 'en-US',
            encoding: 'LINEAR16',
            sampleRateHertz: 8000,
            generateSentiment: true,
            sipCallId: callId,
            bridgeId,
        }),
    ]);

    const combinedTranscript = [];

    // Collect final results from both legs into a unified timeline
    agentStream.on('final-transcript', (result) => {
        combinedTranscript.push({ ...result, side: 'send', role: 'agent' });
    });

    customerStream.on('final-transcript', (result) => {
        combinedTranscript.push({ ...result, side: 'recv', role: 'customer' });
    });

    // Write audio to each stream with per-chunk metadata
    return {
        writeAgent: (chunk) =>
            agentStream.write(chunk, {
                sipCallId: callId,
                side: 'send',
                role: 'agent',
                bridgeId,
            }),
        writeCustomer: (chunk) =>
            customerStream.write(chunk, {
                sipCallId: callId,
                side: 'recv',
                role: 'customer',
                bridgeId,
            }),
        end: () => {
            agentStream.end();
            customerStream.end();
        },
        getTranscript: () =>
            // Sort by startTime so the output is chronological
            [...combinedTranscript].sort((a, b) => a.startTime - b.startTime),
    };
}

// Usage
const call = await transcribeBothLegs('sip_abc123', 'bridge_xyz');

agentAudioPipeline.on('data', call.writeAgent);
customerAudioPipeline.on('data', call.writeCustomer);

agentAudioPipeline.on('end', call.end);
customerAudioPipeline.on('end', call.end);
```

---

**Supported languages:**

| Code | Language |
|---|---|
| `en-US` | English (US) |
| `en-GB` | English (UK) |
| `en-AU` | English (Australia) |
| `es-ES` | Spanish (Spain) |
| `es-MX` | Spanish (Mexico) |
| `es-US` | Spanish (US) |
| `fr-FR` | French |
| `fr-CA` | French (Canada) |
| `de-DE` | German |
| `it-IT` | Italian |
| `pt-BR` | Portuguese (Brazil) |
| `pt-PT` | Portuguese (Portugal) |
| `zh-CN` | Chinese (Simplified) |
| `ja-JP` | Japanese |
| `ko-KR` | Korean |

---

### `ai.stt.get(id, options?)` — Retrieve a Transcript

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const transcript = await sdk.ai.stt.get('stt_abc123', {
    includeMessages: true,  // default: true
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/stt/stt_abc123?includeMessages=true", {
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/stt/stt_abc123?includeMessages=true");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/ai/stt/stt_abc123",
    headers={"Authorization": "Bearer {token}"},
    params={"includeMessages": True}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/ai/stt/stt_abc123?includeMessages=true" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### `ai.stt.list(filters?)` — List Transcriptions

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const results = await sdk.ai.stt.list({
    engagementSessionId: 'eng_123',
    status: 'completed',    // 'pending' | 'processing' | 'completed' | 'failed'
    engine: 'google',
    sourceType: 'storage',
    playbookId: 'pb_456',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    limit: 50,
    offset: 0,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
  engagementSessionId: "eng_123",
  status: "completed",
  engine: "google",
  sourceType: "storage",
  playbookId: "pb_456",
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  limit: "50",
  offset: "0"
});
const res = await fetch(`https://{namespace}.api.unbound.cx/ai/stt?${params}`, {
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$query = http_build_query([
    "engagementSessionId" => "eng_123",
    "status" => "completed",
    "engine" => "google",
    "sourceType" => "storage",
    "playbookId" => "pb_456",
    "startDate" => "2024-01-01",
    "endDate" => "2024-01-31",
    "limit" => 50,
    "offset" => 0
]);
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/stt?" . $query);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/ai/stt",
    headers={"Authorization": "Bearer {token}"},
    params={
        "engagementSessionId": "eng_123",
        "status": "completed",
        "engine": "google",
        "sourceType": "storage",
        "playbookId": "pb_456",
        "startDate": "2024-01-01",
        "endDate": "2024-01-31",
        "limit": 50,
        "offset": 0
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/ai/stt?engagementSessionId=eng_123&status=completed&engine=google&sourceType=storage&playbookId=pb_456&startDate=2024-01-01&endDate=2024-01-31&limit=50&offset=0" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### `ai.stt.logMessage(sessionId, message)` — Log a Transcript Segment

Manually log a message to a streaming session (for custom or external STT integrations).

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await sdk.ai.stt.logMessage('stt_stream_abc', {
    messageId: 'msg_001',         // optional, for idempotency
    timestamp: Date.now(),
    text: 'Hello, how can I help you today?',
    role: 'agent',
    side: 'send',                 // 'send' | 'recv'
    confidence: 0.98,
    duration: 2.4,
    languageCode: 'en-US',
    userId: 'user_123',
    sipCallId: 'sip_abc',
    bridgeId: 'bridge_xyz',
    sentiment: {
        score: 15,
        previousScore: 10,
        delta: 5,
        agentScore: 20,
        customerScore: 10,
        intensity: 0.4,
        emotions: ['neutral', 'friendly'],
        trend: 'improving',       // 'improving' | 'stable' | 'declining'
        source: 'llm+acoustic',   // 'llm+acoustic' | 'acoustic_only' | 'carry_forward'
    },
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/message", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    messageId: "msg_001",
    timestamp: Date.now(),
    text: "Hello, how can I help you today?",
    role: "agent",
    side: "send",
    confidence: 0.98,
    duration: 2.4,
    languageCode: "en-US",
    userId: "user_123",
    sipCallId: "sip_abc",
    bridgeId: "bridge_xyz",
    sentiment: {
      score: 15,
      previousScore: 10,
      delta: 5,
      agentScore: 20,
      customerScore: 10,
      intensity: 0.4,
      emotions: ["neutral", "friendly"],
      trend: "improving",
      source: "llm+acoustic"
    }
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/message");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "messageId" => "msg_001",
    "timestamp" => time() * 1000,
    "text" => "Hello, how can I help you today?",
    "role" => "agent",
    "side" => "send",
    "confidence" => 0.98,
    "duration" => 2.4,
    "languageCode" => "en-US",
    "userId" => "user_123",
    "sipCallId" => "sip_abc",
    "bridgeId" => "bridge_xyz",
    "sentiment" => [
        "score" => 15,
        "previousScore" => 10,
        "delta" => 5,
        "agentScore" => 20,
        "customerScore" => 10,
        "intensity" => 0.4,
        "emotions" => ["neutral", "friendly"],
        "trend" => "improving",
        "source" => "llm+acoustic"
    ]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests, time
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/message",
    headers={"Authorization": "Bearer {token}"},
    json={
        "messageId": "msg_001",
        "timestamp": int(time.time() * 1000),
        "text": "Hello, how can I help you today?",
        "role": "agent",
        "side": "send",
        "confidence": 0.98,
        "duration": 2.4,
        "languageCode": "en-US",
        "userId": "user_123",
        "sipCallId": "sip_abc",
        "bridgeId": "bridge_xyz",
        "sentiment": {
            "score": 15,
            "previousScore": 10,
            "delta": 5,
            "agentScore": 20,
            "customerScore": 10,
            "intensity": 0.4,
            "emotions": ["neutral", "friendly"],
            "trend": "improving",
            "source": "llm+acoustic"
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
  "messageId": "msg_001",
  "timestamp": 1705339200000,
  "text": "Hello, how can I help you today?",
  "role": "agent",
  "side": "send",
  "confidence": 0.98,
  "duration": 2.4,
  "languageCode": "en-US",
  "userId": "user_123",
  "sipCallId": "sip_abc",
  "bridgeId": "bridge_xyz",
  "sentiment": {
    "score": 15,
    "previousScore": 10,
    "delta": 5,
    "agentScore": 20,
    "customerScore": 10,
    "intensity": 0.4,
    "emotions": ["neutral", "friendly"],
    "trend": "improving",
    "source": "llm+acoustic"
  }
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/message" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

### `ai.stt.complete(sessionId, options?)` — Finalize a Session

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Mark as successful
await sdk.ai.stt.complete('stt_stream_abc', { status: 'completed' });

// Mark as failed
await sdk.ai.stt.complete('stt_stream_abc', {
    status: 'failed',
    error: 'WebSocket connection dropped unexpectedly',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Mark as successful
await fetch("https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/complete", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ status: "completed" })
});

// Mark as failed
await fetch("https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/complete", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ status: "failed", error: "WebSocket connection dropped unexpectedly" })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Mark as successful
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/complete");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["status" => "completed"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Mark as failed
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/complete");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["status" => "failed", "error" => "WebSocket connection dropped unexpectedly"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Mark as successful
requests.post(
    "https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/complete",
    headers={"Authorization": "Bearer {token}"},
    json={"status": "completed"}
)

# Mark as failed
requests.post(
    "https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/complete",
    headers={"Authorization": "Bearer {token}"},
    json={"status": "failed", "error": "WebSocket connection dropped unexpectedly"}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Mark as successful
curl -X POST "https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/complete" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Mark as failed
curl -X POST "https://{namespace}.api.unbound.cx/ai/stt/stt_stream_abc/complete" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"status": "failed", "error": "WebSocket connection dropped unexpectedly"}'
```

</TabItem>
</Tabs>

---

## Data Extraction

`sdk.ai.extract` — Extract and validate structured data from unstructured text using AI.

### Extract a Phone Number

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await sdk.ai.extract.phone({
    value: 'Call me at eight hundred five five five twelve twelve',
    country: 'US',    // ISO 3166-1 alpha-2
    format: 'E164',   // 'E164' | 'national' | 'international'
});
// result.isValid → true
// result.parsedValue → '+18005551212'
// result.confidence → 0.99
// result.metadata → { country: 'US', type: 'TOLL_FREE', nationalNumber: '8005551212' }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/extract/phone", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    value: "Call me at eight hundred five five five twelve twelve",
    country: "US",
    format: "E164"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/extract/phone");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "value" => "Call me at eight hundred five five five twelve twelve",
    "country" => "US",
    "format" => "E164"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/extract/phone",
    headers={"Authorization": "Bearer {token}"},
    json={
        "value": "Call me at eight hundred five five five twelve twelve",
        "country": "US",
        "format": "E164"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "value": "Call me at eight hundred five five five twelve twelve",
  "country": "US",
  "format": "E164"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/extract/phone" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### Extract an Email

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await sdk.ai.extract.email({
    value: 'Reach me at jane at example dot com',
});
// result.isValid → true
// result.parsedValue → 'jane@example.com'
// result.metadata → { domain: 'example.com' }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/extract/email", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ value: "Reach me at jane at example dot com" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/extract/email");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["value" => "Reach me at jane at example dot com"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/extract/email",
    headers={"Authorization": "Bearer {token}"},
    json={"value": "Reach me at jane at example dot com"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/ai/extract/email" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"value": "Reach me at jane at example dot com"}'
```

</TabItem>
</Tabs>

### Extract an Address

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await sdk.ai.extract.address({
    value: '123 Main Street, Springfield, IL 62701',
    useAI: true,  // true = better for conversational text
});
// result.isValid → true
// result.parsedValue → '123 Main St, Springfield, IL 62701, USA'
// result.metadata.components → { streetNumber: '123', route: 'Main St', ... }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/extract/address", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    value: "123 Main Street, Springfield, IL 62701",
    useAI: true
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/extract/address");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "value" => "123 Main Street, Springfield, IL 62701",
    "useAI" => true
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/extract/address",
    headers={"Authorization": "Bearer {token}"},
    json={
        "value": "123 Main Street, Springfield, IL 62701",
        "useAI": True
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/ai/extract/address" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"value": "123 Main Street, Springfield, IL 62701", "useAI": true}'
```

</TabItem>
</Tabs>

### Extract a Name

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await sdk.ai.extract.personName({
    value: 'My name is Jane Marie Smith',
    useAI: true,
});
// result.parsedValue → 'Jane Marie Smith'
// result.firstName → 'Jane'
// result.lastName → 'Smith'
// result.title → null
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/extract/person-name", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ value: "My name is Jane Marie Smith", useAI: true })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/extract/person-name");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["value" => "My name is Jane Marie Smith", "useAI" => true]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/extract/person-name",
    headers={"Authorization": "Bearer {token}"},
    json={"value": "My name is Jane Marie Smith", "useAI": True}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/ai/extract/person-name" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"value": "My name is Jane Marie Smith", "useAI": true}'
```

</TabItem>
</Tabs>

### Detect Yes/No from Natural Language

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await sdk.ai.extract.correctIncorrect({
    value: 'Yeah that sounds right',
});
// result.parsedValue → 'correct'
// result.booleanValue → true
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/extract/correct-incorrect", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ value: "Yeah that sounds right" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/extract/correct-incorrect");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["value" => "Yeah that sounds right"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/extract/correct-incorrect",
    headers={"Authorization": "Bearer {token}"},
    json={"value": "Yeah that sounds right"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/ai/extract/correct-incorrect" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"value": "Yeah that sounds right"}'
```

</TabItem>
</Tabs>

### Extract a Credit Card Number

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await sdk.ai.extract.creditCard({
    value: '4111 1111 1111 1111',
    maskOutput: true,   // default: true — returns only last 4
});
// result.isValid → true
// result.parsedValue → '************1111'
// result.metadata → { cardType: 'Visa', length: 16 }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/extract/credit-card", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ value: "4111 1111 1111 1111", maskOutput: true })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/extract/credit-card");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["value" => "4111 1111 1111 1111", "maskOutput" => true]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/extract/credit-card",
    headers={"Authorization": "Bearer {token}"},
    json={"value": "4111 1111 1111 1111", "maskOutput": True}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/ai/extract/credit-card" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"value": "4111 1111 1111 1111", "maskOutput": true}'
```

</TabItem>
</Tabs>

### Extract an SSN

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await sdk.ai.extract.ssn({
    value: 'My social is 123-45-6789',
    maskOutput: true,
});
// result.isValid → true
// result.parsedValue → '*****6789'
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/extract/ssn", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ value: "My social is 123-45-6789", maskOutput: true })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/extract/ssn");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["value" => "My social is 123-45-6789", "maskOutput" => true]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/extract/ssn",
    headers={"Authorization": "Bearer {token}"},
    json={"value": "My social is 123-45-6789", "maskOutput": True}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/ai/extract/ssn" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"value": "My social is 123-45-6789", "maskOutput": true}'
```

</TabItem>
</Tabs>

### Extract a Phone Extension

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await sdk.ai.extract.extension({
    value: 'extension four two one',
    minLength: 1,
    maxLength: 10,
});
// result.parsedValue → '421'
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/extract/extension", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ value: "extension four two one", minLength: 1, maxLength: 10 })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/extract/extension");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["value" => "extension four two one", "minLength" => 1, "maxLength" => 10]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/extract/extension",
    headers={"Authorization": "Bearer {token}"},
    json={"value": "extension four two one", "minLength": 1, "maxLength": 10}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/ai/extract/extension" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"value": "extension four two one", "minLength": 1, "maxLength": 10}'
```

</TabItem>
</Tabs>

### Detect Intent

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await sdk.ai.extract.intent({
    value: 'I need help with my bill',
    params: {
        question: 'What can I help you with today?',
        validOptions: [
            { value: 'billing', label: 'Billing' },
            { value: 'technical', label: 'Technical Support' },
            { value: 'sales', label: 'Sales' },
        ],
    },
});
// result.value → 'billing'
// result.isValid → true
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/extract/intent", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    value: "I need help with my bill",
    params: {
      question: "What can I help you with today?",
      validOptions: [
        { value: "billing", label: "Billing" },
        { value: "technical", label: "Technical Support" },
        { value: "sales", label: "Sales" }
      ]
    }
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/extract/intent");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "value" => "I need help with my bill",
    "params" => [
        "question" => "What can I help you with today?",
        "validOptions" => [
            ["value" => "billing", "label" => "Billing"],
            ["value" => "technical", "label" => "Technical Support"],
            ["value" => "sales", "label" => "Sales"]
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
    "https://{namespace}.api.unbound.cx/ai/extract/intent",
    headers={"Authorization": "Bearer {token}"},
    json={
        "value": "I need help with my bill",
        "params": {
            "question": "What can I help you with today?",
            "validOptions": [
                {"value": "billing", "label": "Billing"},
                {"value": "technical", "label": "Technical Support"},
                {"value": "sales", "label": "Sales"}
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
  "value": "I need help with my bill",
  "params": {
    "question": "What can I help you with today?",
    "validOptions": [
      {"value": "billing", "label": "Billing"},
      {"value": "technical", "label": "Technical Support"},
      {"value": "sales", "label": "Sales"}
    ]
  }
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/extract/intent" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### Extract All Entities

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await sdk.ai.extract.all({
    value: 'Call John Smith at 555-1234 or john@example.com',
    types: ['phone', 'email', 'personName'],  // omit for all types
    question: 'What is the caller contact information?',
});
// result.extractions → [
//   { type: 'phone', value: '+15551234', confidence: 0.97 },
//   { type: 'email', value: 'john@example.com', confidence: 0.99 },
//   { type: 'personName', value: 'John Smith', firstName: 'John', ... }
// ]
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/extract/all", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    value: "Call John Smith at 555-1234 or john@example.com",
    types: ["phone", "email", "personName"],
    question: "What is the caller contact information?"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/extract/all");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "value" => "Call John Smith at 555-1234 or john@example.com",
    "types" => ["phone", "email", "personName"],
    "question" => "What is the caller contact information?"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/extract/all",
    headers={"Authorization": "Bearer {token}"},
    json={
        "value": "Call John Smith at 555-1234 or john@example.com",
        "types": ["phone", "email", "personName"],
        "question": "What is the caller contact information?"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "value": "Call John Smith at 555-1234 or john@example.com",
  "types": ["phone", "email", "personName"],
  "question": "What is the caller contact information?"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/extract/all" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### Custom Regex Extraction

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await sdk.ai.extract.regex({
    value: 'Order number is AB-123456',
    pattern: '[A-Z]{2}-\\d{6}',
    flags: 'g',
    replaceNumbers: true,  // convert word numbers to digits first
});
// result.parsedValue → 'AB-123456'
// result.isValid → true
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/extract/regex", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    value: "Order number is AB-123456",
    pattern: "[A-Z]{2}-\\d{6}",
    flags: "g",
    replaceNumbers: true
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/extract/regex");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "value" => "Order number is AB-123456",
    "pattern" => "[A-Z]{2}-\\d{6}",
    "flags" => "g",
    "replaceNumbers" => true
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/extract/regex",
    headers={"Authorization": "Bearer {token}"},
    json={
        "value": "Order number is AB-123456",
        "pattern": "[A-Z]{2}-\\d{6}",
        "flags": "g",
        "replaceNumbers": True
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "value": "Order number is AB-123456",
  "pattern": "[A-Z]{2}-\\d{6}",
  "flags": "g",
  "replaceNumbers": true
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/extract/regex" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

**Supported extraction types:**

| Type | `extract.*` method | Description |
|---|---|---|
| `phone` | `extract.phone()` | Phone numbers, handles spoken digits |
| `email` | `extract.email()` | Email addresses |
| `address` | `extract.address()` | Physical addresses with component parsing |
| `personName` | `extract.personName()` | Full names with first/last breakdown |
| `creditCard` | `extract.creditCard()` | Credit card numbers (masked output) |
| `ssn` | `extract.ssn()` | Social Security Numbers (masked output) |
| `extension` | `extract.extension()` | Phone extensions |
| `correctIncorrect` | `extract.correctIncorrect()` | Yes/no/correct/incorrect detection |
| `intent` | `extract.intent()` | Intent classification from a list of options |
| `regex` | `extract.regex()` | Custom regex with spoken-number conversion |
| `all` | `extract.all()` | Extract all entity types from text |

---

## AI Playbooks

Playbooks define scripted AI evaluation frameworks — goals are scored against conversation transcripts to measure agent quality, compliance, or customer outcomes.

### Playbooks CRUD

#### `ai.playbooks.listPlaybooks(options?)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const playbooks = await sdk.ai.playbooks.listPlaybooks({
    isPublished: true,
    recordTypeId: 'rt_support',
    limit: 50,
    orderBy: 'createdAt',
    orderDirection: 'DESC',
});
// playbooks.results → [{ id, name, isPublished, goals, recordTypeId, ... }]
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
  isPublished: "true",
  recordTypeId: "rt_support",
  limit: "50",
  orderBy: "createdAt",
  orderDirection: "DESC"
});
const res = await fetch(`https://{namespace}.api.unbound.cx/ai/playbook?${params}`, {
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$query = http_build_query([
    "isPublished" => "true",
    "recordTypeId" => "rt_support",
    "limit" => 50,
    "orderBy" => "createdAt",
    "orderDirection" => "DESC"
]);
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook?" . $query);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/ai/playbook",
    headers={"Authorization": "Bearer {token}"},
    params={
        "isPublished": True,
        "recordTypeId": "rt_support",
        "limit": 50,
        "orderBy": "createdAt",
        "orderDirection": "DESC"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/ai/playbook?isPublished=true&recordTypeId=rt_support&limit=50&orderBy=createdAt&orderDirection=DESC" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

#### `ai.playbooks.getPlaybook({ playbookId })`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const pb = await sdk.ai.playbooks.getPlaybook({
    playbookId: 'pb_123456',
});
// pb.id → 'pb_123456'
// pb.name → 'Inbound Support Script'
// pb.isPublished → true
// pb.goals → [...] (ordered array of PlaybookGoal objects)
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456", {
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

#### `ai.playbooks.createPlaybook(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const pb = await sdk.ai.playbooks.createPlaybook({
    name: 'Sales Discovery Call',
    recordTypeId: 'rt_sales',
});
// Returns: { id: 'pb_new', name, recordTypeId, createdAt, ... }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Sales Discovery Call", recordTypeId: "rt_sales" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["name" => "Sales Discovery Call", "recordTypeId" => "rt_sales"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/playbook",
    headers={"Authorization": "Bearer {token}"},
    json={"name": "Sales Discovery Call", "recordTypeId": "rt_sales"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/ai/playbook" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Sales Discovery Call", "recordTypeId": "rt_sales"}'
```

</TabItem>
</Tabs>

#### `ai.playbooks.updatePlaybook(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const updated = await sdk.ai.playbooks.updatePlaybook({
    playbookId: 'pb_123456',
    name: 'Sales Discovery Call v2',
    isPublished: true,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Sales Discovery Call v2", isPublished: true })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["name" => "Sales Discovery Call v2", "isPublished" => true]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.put(
    "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456",
    headers={"Authorization": "Bearer {token}"},
    json={"name": "Sales Discovery Call v2", "isPublished": True}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Sales Discovery Call v2", "isPublished": true}'
```

</TabItem>
</Tabs>

#### `ai.playbooks.deletePlaybook({ playbookId })`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await sdk.ai.playbooks.deletePlaybook({ playbookId: 'pb_123456' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
requests.delete(
    "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456",
    headers={"Authorization": "Bearer {token}"}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### Playbook Goal Types

Goal types are reusable templates that categorize the kind of behavior being measured (greeting, discovery, objection handling, closing, etc.).

#### `ai.playbooks.listPlaybookGoalTypes(options?)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const goalTypes = await sdk.ai.playbooks.listPlaybookGoalTypes({
    recommendedPhase: 'early',   // 'early' | 'middle' | 'late' | 'any'
    recordTypeId: 'rt_sales',
    limit: 50,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
  recommendedPhase: "early",
  recordTypeId: "rt_sales",
  limit: "50"
});
const res = await fetch(`https://{namespace}.api.unbound.cx/ai/playbook/goal-type?${params}`, {
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$query = http_build_query(["recommendedPhase" => "early", "recordTypeId" => "rt_sales", "limit" => 50]);
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/goal-type?" . $query);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/ai/playbook/goal-type",
    headers={"Authorization": "Bearer {token}"},
    params={"recommendedPhase": "early", "recordTypeId": "rt_sales", "limit": 50}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/ai/playbook/goal-type?recommendedPhase=early&recordTypeId=rt_sales&limit=50" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

#### `ai.playbooks.getPlaybookGoalType({ goalTypeId })`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const gt = await sdk.ai.playbooks.getPlaybookGoalType({
    goalTypeId: 'gt_greeting',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting", {
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

#### `ai.playbooks.createPlaybookGoalType(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const goalType = await sdk.ai.playbooks.createPlaybookGoalType({
    name: 'Opening/Greeting',
    description: 'Initial greeting and rapport building',
    keywords: ['hello', 'hi', 'good morning', 'thanks for taking the call'],
    recommendedPhase: 'early',
    recordTypeId: 'rt_sales',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/goal-type", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Opening/Greeting",
    description: "Initial greeting and rapport building",
    keywords: ["hello", "hi", "good morning", "thanks for taking the call"],
    recommendedPhase: "early",
    recordTypeId: "rt_sales"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/goal-type");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "Opening/Greeting",
    "description" => "Initial greeting and rapport building",
    "keywords" => ["hello", "hi", "good morning", "thanks for taking the call"],
    "recommendedPhase" => "early",
    "recordTypeId" => "rt_sales"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/playbook/goal-type",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "Opening/Greeting",
        "description": "Initial greeting and rapport building",
        "keywords": ["hello", "hi", "good morning", "thanks for taking the call"],
        "recommendedPhase": "early",
        "recordTypeId": "rt_sales"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "Opening/Greeting",
  "description": "Initial greeting and rapport building",
  "keywords": ["hello", "hi", "good morning", "thanks for taking the call"],
  "recommendedPhase": "early",
  "recordTypeId": "rt_sales"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/playbook/goal-type" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✓ | Display name for this goal type |
| `description` | string | — | What this goal type measures |
| `keywords` | array | — | Keywords that suggest this goal type |
| `recommendedPhase` | string | — | `early`, `middle`, `late`, or `any` |
| `recordTypeId` | string | — | Scope to a specific record type |

#### `ai.playbooks.updatePlaybookGoalType(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await sdk.ai.playbooks.updatePlaybookGoalType({
    goalTypeId: 'gt_greeting',
    keywords: ['hello', 'hi', 'good morning', 'greetings', 'thanks for calling'],
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch("https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    keywords: ["hello", "hi", "good morning", "greetings", "thanks for calling"]
  })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "keywords" => ["hello", "hi", "good morning", "greetings", "thanks for calling"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
requests.put(
    "https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting",
    headers={"Authorization": "Bearer {token}"},
    json={"keywords": ["hello", "hi", "good morning", "greetings", "thanks for calling"]}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"keywords": ["hello", "hi", "good morning", "greetings", "thanks for calling"]}'
```

</TabItem>
</Tabs>

#### `ai.playbooks.deletePlaybookGoalType({ goalTypeId })`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await sdk.ai.playbooks.deletePlaybookGoalType({ goalTypeId: 'gt_greeting' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch("https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
requests.delete(
    "https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting",
    headers={"Authorization": "Bearer {token}"}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/ai/playbook/goal-type/gt_greeting" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### Playbook Goals

Goals are the specific evaluation criteria attached to a playbook. Each goal can be weighted and scored.

#### `ai.playbooks.listPlaybookGoals({ playbookId })`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const goals = await sdk.ai.playbooks.listPlaybookGoals({
    playbookId: 'pb_123456',
});
// goals.results → [{ id, goal, description, weight, scoreType, requiredForPass, ... }]
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal", {
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

#### `ai.playbooks.getPlaybookGoal({ playbookId, goalId })`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const goal = await sdk.ai.playbooks.getPlaybookGoal({
    playbookId: 'pb_123456',
    goalId: 'goal_789',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal/goal_789", {
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal/goal_789");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal/goal_789",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal/goal_789" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

#### `ai.playbooks.createPlaybookGoal(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const goal = await sdk.ai.playbooks.createPlaybookGoal({
    playbookId: 'pb_123456',
    playbookGoalTypeId: 'gt_discovery',
    goal: 'Identify customer pain points',
    description: 'Agent should discover at least 2 key pain points',
    scoreType: 'scale',     // 'boolean' | 'scale'
    weight: 25,             // 0–100, used to compute total score
    requiredForPass: false,
    recordTypeId: 'rt_sales',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    playbookGoalTypeId: "gt_discovery",
    goal: "Identify customer pain points",
    description: "Agent should discover at least 2 key pain points",
    scoreType: "scale",
    weight: 25,
    requiredForPass: false,
    recordTypeId: "rt_sales"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "playbookGoalTypeId" => "gt_discovery",
    "goal" => "Identify customer pain points",
    "description" => "Agent should discover at least 2 key pain points",
    "scoreType" => "scale",
    "weight" => 25,
    "requiredForPass" => false,
    "recordTypeId" => "rt_sales"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal",
    headers={"Authorization": "Bearer {token}"},
    json={
        "playbookGoalTypeId": "gt_discovery",
        "goal": "Identify customer pain points",
        "description": "Agent should discover at least 2 key pain points",
        "scoreType": "scale",
        "weight": 25,
        "requiredForPass": False,
        "recordTypeId": "rt_sales"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "playbookGoalTypeId": "gt_discovery",
  "goal": "Identify customer pain points",
  "description": "Agent should discover at least 2 key pain points",
  "scoreType": "scale",
  "weight": 25,
  "requiredForPass": false,
  "recordTypeId": "rt_sales"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `playbookId` | string | ✓ | The playbook to add this goal to |
| `playbookGoalTypeId` | string | ✓ | The goal type template |
| `goal` | string | ✓ | Short description of what is evaluated |
| `description` | string | — | Detailed explanation for AI evaluator |
| `criteria` | object | — | Structured criteria for pass/fail determination |
| `scoreType` | string | — | `boolean` (pass/fail) or `scale` (0–10) |
| `weight` | number | — | Contribution to total score (0–100) |
| `requiredForPass` | boolean | — | If true, playbook fails if this goal is not achieved |
| `recordTypeId` | string | — | Scope to a record type |

#### `ai.playbooks.updatePlaybookGoal(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await sdk.ai.playbooks.updatePlaybookGoal({
    goalId: 'goal_789',
    playbookGoalTypeId: 'gt_discovery',
    weight: 30,
    description: 'Updated: discover at least 3 pain points',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch("https://{namespace}.api.unbound.cx/ai/playbook/goal/goal_789", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    playbookGoalTypeId: "gt_discovery",
    weight: 30,
    description: "Updated: discover at least 3 pain points"
  })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/goal/goal_789");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "playbookGoalTypeId" => "gt_discovery",
    "weight" => 30,
    "description" => "Updated: discover at least 3 pain points"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
requests.put(
    "https://{namespace}.api.unbound.cx/ai/playbook/goal/goal_789",
    headers={"Authorization": "Bearer {token}"},
    json={
        "playbookGoalTypeId": "gt_discovery",
        "weight": 30,
        "description": "Updated: discover at least 3 pain points"
    }
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "playbookGoalTypeId": "gt_discovery",
  "weight": 30,
  "description": "Updated: discover at least 3 pain points"
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/ai/playbook/goal/goal_789" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

#### `ai.playbooks.deletePlaybookGoal({ goalId })`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await sdk.ai.playbooks.deletePlaybookGoal({ goalId: 'goal_789' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch("https://{namespace}.api.unbound.cx/ai/playbook/goal/goal_789", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/goal/goal_789");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
requests.delete(
    "https://{namespace}.api.unbound.cx/ai/playbook/goal/goal_789",
    headers={"Authorization": "Bearer {token}"}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/ai/playbook/goal/goal_789" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

#### `ai.playbooks.reorderPlaybookGoals({ playbookId, goalOrder })`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await sdk.ai.playbooks.reorderPlaybookGoals({
    playbookId: 'pb_123456',
    goalOrder: ['goal_3', 'goal_1', 'goal_2'],  // IDs in desired display order
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal/reorder", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ goalOrder: ["goal_3", "goal_1", "goal_2"] })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal/reorder");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["goalOrder" => ["goal_3", "goal_1", "goal_2"]]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
requests.put(
    "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal/reorder",
    headers={"Authorization": "Bearer {token}"},
    json={"goalOrder": ["goal_3", "goal_1", "goal_2"]}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "https://{namespace}.api.unbound.cx/ai/playbook/pb_123456/goal/reorder" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"goalOrder": ["goal_3", "goal_1", "goal_2"]}'
```

</TabItem>
</Tabs>

---

### Playbook Sessions

A playbook session tracks one instance of a playbook being run against a conversation (call, chat, etc.).

#### `ai.playbooks.createSession(options)`

Start a new evaluation session for a published playbook.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const session = await sdk.ai.playbooks.createSession({
    playbookId: 'pb_sales_call',
    transcriptionSessionId: 'stt_abc',   // link to STT session
    method: 'ai',
    userId: 'user_789',
    sipCallId: 'sip_xyz',
    taskId: 'task_123',
    workerId: 'worker_456',
});
// session.id → 'pbs_abc123'
// session.playbookId → 'pb_sales_call'
// session.goals → [{ id, goal, weight, scoreType, ... }]  // ordered goal list
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/session", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    playbookId: "pb_sales_call",
    transcriptionSessionId: "stt_abc",
    method: "ai",
    userId: "user_789",
    sipCallId: "sip_xyz",
    taskId: "task_123",
    workerId: "worker_456"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/session");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "playbookId" => "pb_sales_call",
    "transcriptionSessionId" => "stt_abc",
    "method" => "ai",
    "userId" => "user_789",
    "sipCallId" => "sip_xyz",
    "taskId" => "task_123",
    "workerId" => "worker_456"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/playbook/session",
    headers={"Authorization": "Bearer {token}"},
    json={
        "playbookId": "pb_sales_call",
        "transcriptionSessionId": "stt_abc",
        "method": "ai",
        "userId": "user_789",
        "sipCallId": "sip_xyz",
        "taskId": "task_123",
        "workerId": "worker_456"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "playbookId": "pb_sales_call",
  "transcriptionSessionId": "stt_abc",
  "method": "ai",
  "userId": "user_789",
  "sipCallId": "sip_xyz",
  "taskId": "task_123",
  "workerId": "worker_456"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/playbook/session" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

#### `ai.playbooks.getSession(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// By session ID
const session = await sdk.ai.playbooks.getSession({
    sessionId: 'pbs_abc123',
});

// By taskId + workerId
const session = await sdk.ai.playbooks.getSession({
    taskId: 'task_123',
    workerId: 'worker_456',
});

// By taskId + userId
const session = await sdk.ai.playbooks.getSession({
    taskId: 'task_123',
    userId: 'user_789',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// By session ID
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123", {
  headers: { "Authorization": "Bearer {token}" }
});
const session = await res.json();

// By taskId + workerId
const res2 = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/session?taskId=task_123&workerId=worker_456", {
  headers: { "Authorization": "Bearer {token}" }
});
const session2 = await res2.json();

// By taskId + userId
const res3 = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/session?taskId=task_123&userId=user_789", {
  headers: { "Authorization": "Bearer {token}" }
});
const session3 = await res3.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// By session ID
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$session = json_decode(curl_exec($ch), true);
curl_close($ch);

// By taskId + workerId
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/session?taskId=task_123&workerId=worker_456");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$session2 = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# By session ID
response = requests.get(
    "https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123",
    headers={"Authorization": "Bearer {token}"}
)
session = response.json()

# By taskId + workerId
response = requests.get(
    "https://{namespace}.api.unbound.cx/ai/playbook/session",
    headers={"Authorization": "Bearer {token}"},
    params={"taskId": "task_123", "workerId": "worker_456"}
)
session2 = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# By session ID
curl "https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123" \
  -H "Authorization: Bearer {token}"

# By taskId + workerId
curl "https://{namespace}.api.unbound.cx/ai/playbook/session?taskId=task_123&workerId=worker_456" \
  -H "Authorization: Bearer {token}"

# By taskId + userId
curl "https://{namespace}.api.unbound.cx/ai/playbook/session?taskId=task_123&userId=user_789" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Session response shape:**

```javascript
{
    id: 'pbs_abc123',
    playbookId: 'pb_sales_call',
    playbookName: 'Sales Discovery Call',
    method: 'ai',
    userId: 'user_789',
    taskId: 'task_123',
    passed: null,          // null until completeSession is called
    totalScore: null,
    goals: [
        {
            id: 'goal_001',
            goal: 'Opened call professionally',
            weight: 20,
            scoreType: 'boolean',
            requiredForPass: true,
            achieved: true,     // set after logGoal is called
            score: 10,
            reason: 'Agent greeted professionally',
            confidence: 0.96,
        },
        // ...
    ],
    createdAt: '2024-01-15T14:00:00Z',
    completedAt: null,
}
```

#### `ai.playbooks.logGoal(options)` — Record Goal Achievement

Log whether a specific goal was achieved during the session, including evidence.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Log a successful goal
await sdk.ai.playbooks.logGoal({
    sessionId: 'pbs_abc123',
    goalId: 'goal_456',
    achieved: true,
    score: 10,
    reason: 'Customer clearly expressed interest in the product',
    confidence: 0.95,
    evidence: [
        { type: 'transcript', text: 'I would love to learn more about this' },
        { type: 'transcript', text: 'When can we schedule a demo?' },
    ],
});

// Log a failed goal
await sdk.ai.playbooks.logGoal({
    sessionId: 'pbs_abc123',
    goalId: 'goal_789',
    achieved: false,
    score: 0,
    reason: 'Pricing was never discussed during the call',
    confidence: 0.88,
});

// Log partial achievement (scale scoring)
await sdk.ai.playbooks.logGoal({
    sessionId: 'pbs_abc123',
    goalId: 'goal_discovery',
    achieved: true,
    score: 7,    // out of 10 on scale
    reason: 'Identified 2 of 3 key pain points',
    confidence: 0.85,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Log a successful goal
await fetch("https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123/goal", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    goalId: "goal_456",
    achieved: true,
    score: 10,
    reason: "Customer clearly expressed interest in the product",
    confidence: 0.95,
    evidence: [
      { type: "transcript", text: "I would love to learn more about this" },
      { type: "transcript", text: "When can we schedule a demo?" }
    ]
  })
});

// Log a failed goal
await fetch("https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123/goal", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    goalId: "goal_789",
    achieved: false,
    score: 0,
    reason: "Pricing was never discussed during the call",
    confidence: 0.88
  })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Log a successful goal
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123/goal");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "goalId" => "goal_456",
    "achieved" => true,
    "score" => 10,
    "reason" => "Customer clearly expressed interest in the product",
    "confidence" => 0.95,
    "evidence" => [
        ["type" => "transcript", "text" => "I would love to learn more about this"],
        ["type" => "transcript", "text" => "When can we schedule a demo?"]
    ]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Log a successful goal
requests.post(
    "https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123/goal",
    headers={"Authorization": "Bearer {token}"},
    json={
        "goalId": "goal_456",
        "achieved": True,
        "score": 10,
        "reason": "Customer clearly expressed interest in the product",
        "confidence": 0.95,
        "evidence": [
            {"type": "transcript", "text": "I would love to learn more about this"},
            {"type": "transcript", "text": "When can we schedule a demo?"}
        ]
    }
)

# Log a failed goal
requests.post(
    "https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123/goal",
    headers={"Authorization": "Bearer {token}"},
    json={
        "goalId": "goal_789",
        "achieved": False,
        "score": 0,
        "reason": "Pricing was never discussed during the call",
        "confidence": 0.88
    }
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Log a successful goal
DATA=$(cat <<'EOF'
{
  "goalId": "goal_456",
  "achieved": true,
  "score": 10,
  "reason": "Customer clearly expressed interest in the product",
  "confidence": 0.95,
  "evidence": [
    {"type": "transcript", "text": "I would love to learn more about this"},
    {"type": "transcript", "text": "When can we schedule a demo?"}
  ]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123/goal" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Log a failed goal
DATA=$(cat <<'EOF'
{
  "goalId": "goal_789",
  "achieved": false,
  "score": 0,
  "reason": "Pricing was never discussed during the call",
  "confidence": 0.88
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123/goal" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | ✓ | Session to log the goal result for |
| `goalId` | string | ✓ | Goal being evaluated |
| `achieved` | boolean | — | Whether the goal was met |
| `score` | number | — | Numeric score (for `scoreType: 'scale'`) |
| `reason` | string | — | AI or human explanation |
| `confidence` | number | — | Confidence level (0–1) |
| `evidence` | array | — | Supporting evidence items |

#### `ai.playbooks.completeSession(options)` — Finalize Session

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Session passed
const result = await sdk.ai.playbooks.completeSession({
    sessionId: 'pbs_abc123',
    passed: true,
    totalScore: 85,
    achievedGoals: 4,
    totalGoals: 5,
});
// result.playbookSessionId → 'pbs_abc123'

// Session failed
await sdk.ai.playbooks.completeSession({
    sessionId: 'pbs_xyz789',
    passed: false,
    totalScore: 45,
    achievedGoals: 2,
    totalGoals: 5,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Session passed
const res = await fetch("https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123/complete", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    passed: true,
    totalScore: 85,
    achievedGoals: 4,
    totalGoals: 5
  })
});
const data = await res.json();

// Session failed
await fetch("https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_xyz789/complete", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    passed: false,
    totalScore: 45,
    achievedGoals: 2,
    totalGoals: 5
  })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Session passed
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123/complete");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "passed" => true,
    "totalScore" => 85,
    "achievedGoals" => 4,
    "totalGoals" => 5
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Session failed
$ch = curl_init("https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_xyz789/complete");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "passed" => false,
    "totalScore" => 45,
    "achievedGoals" => 2,
    "totalGoals" => 5
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Session passed
response = requests.post(
    "https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123/complete",
    headers={"Authorization": "Bearer {token}"},
    json={
        "passed": True,
        "totalScore": 85,
        "achievedGoals": 4,
        "totalGoals": 5
    }
)
data = response.json()

# Session failed
requests.post(
    "https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_xyz789/complete",
    headers={"Authorization": "Bearer {token}"},
    json={
        "passed": False,
        "totalScore": 45,
        "achievedGoals": 2,
        "totalGoals": 5
    }
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Session passed
curl -X POST "https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_abc123/complete" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"passed": true, "totalScore": 85, "achievedGoals": 4, "totalGoals": 5}'

# Session failed
curl -X POST "https://{namespace}.api.unbound.cx/ai/playbook/session/pbs_xyz789/complete" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"passed": false, "totalScore": 45, "achievedGoals": 2, "totalGoals": 5}'
```

</TabItem>
</Tabs>

---

## Common Patterns

### Real-Time Call Transcription with Sentiment

```javascript
import { createReadStream } from 'fs';

async function transcribeCall(audioFilePath, engagementId) {
    const stream = await sdk.ai.stt.stream({
        engine: 'google',
        model: 'phone_call',
        languageCode: 'en-US',
        encoding: 'LINEAR16',
        sampleRateHertz: 8000,
        interimResults: true,
        generateSentiment: true,
        generateTranscriptSummary: true,
        engagementSessionId: engagementId,
    });

    const transcript = [];

    stream.on('transcript', (result) => {
        if (result.isFinal) {
            transcript.push(result.text);
            console.log('[FINAL]', result.text);
        }
    });

    stream.on('sentiment', (data) => {
        if (data.score < -20) {
            console.warn('⚠️  Negative sentiment detected:', data.score);
            // Trigger supervisor alert, offer callback, etc.
        }
    });

    stream.on('close', () => {
        console.log('Transcript complete. Lines:', transcript.length);
    });

    // Pipe audio file to stream
    const audioStream = createReadStream(audioFilePath);
    audioStream.on('data', (chunk) => stream.write(chunk));
    audioStream.on('end', () => stream.end());

    return stream;
}
```

### AI-Powered Intent Routing

```javascript
async function routeCallerIntent(spokenText) {
    const result = await sdk.ai.extract.intent({
        value: spokenText,
        params: {
            question: 'How can I help you today?',
            validOptions: [
                { value: 'billing',   label: 'Billing and Payments' },
                { value: 'technical', label: 'Technical Support' },
                { value: 'sales',     label: 'Sales and Upgrades' },
                { value: 'cancel',    label: 'Cancel Service' },
            ],
        },
    });

    if (!result.isValid) {
        return { queue: 'general', reason: 'Could not determine intent' };
    }

    const queueMap = {
        billing: 'billing-queue',
        technical: 'tech-support-queue',
        sales: 'sales-queue',
        cancel: 'retention-queue',
    };

    return {
        queue: queueMap[result.value] || 'general-queue',
        intent: result.value,
        confidence: result.confidence,
    };
}
```

### Automated Call Quality Scoring with Playbooks

```javascript
async function scoreCallQuality({ taskId, workerId, transcriptMessages }) {
    // 1. Create a playbook session for this call
    const session = await sdk.ai.playbooks.createSession({
        playbookId: process.env.QUALITY_PLAYBOOK_ID,
        method: 'ai',
        taskId,
        workerId,
    });

    // 2. Get the goals for this playbook
    const goals = session.goals;

    // 3. Use AI to evaluate each goal against the transcript
    const fullTranscript = transcriptMessages.map(m => `${m.role}: ${m.text}`).join('\n');

    for (const goal of goals) {
        const evaluation = await sdk.ai.generative.chat({
            messages: [
                {
                    role: 'system',
                    content: `You evaluate call quality goals. Respond in JSON: { achieved: bool, score: 0-10, reason: string, confidence: 0-1 }`,
                },
                {
                    role: 'user',
                    content: `Goal: ${goal.goal}\nDescription: ${goal.description}\n\nTranscript:\n${fullTranscript}`,
                },
            ],
            responseFormat: { type: 'json_object' },
        });

        const result = JSON.parse(evaluation.choices[0].message.content);

        await sdk.ai.playbooks.logGoal({
            sessionId: session.id,
            goalId: goal.id,
            achieved: result.achieved,
            score: result.score,
            reason: result.reason,
            confidence: result.confidence,
        });
    }

    // 4. Compute final score
    const achievedGoals = goals.filter(g => g.achieved).length;
    const totalScore = goals.reduce((sum, g) => sum + (g.score || 0) * (g.weight / 100), 0);
    const passed = totalScore >= 70;

    await sdk.ai.playbooks.completeSession({
        sessionId: session.id,
        passed,
        totalScore: Math.round(totalScore),
        achievedGoals,
        totalGoals: goals.length,
    });

    return { sessionId: session.id, passed, totalScore, achievedGoals };
}
```

### Multi-Field Extraction from Voice Input

```javascript
async function collectCallerInfo(spokenText) {
    // Extract all useful entities in one call
    const extracted = await sdk.ai.extract.all({
        value: spokenText,
        types: ['phone', 'email', 'personName', 'address'],
        question: 'What is your name, phone number, email, and address?',
    });

    const info = {};
    for (const entity of extracted.extractions) {
        if (entity.isValid) {
            info[entity.type] = entity.value;
        }
    }

    // Verify phone independently with country context
    if (info.phone) {
        const phoneCheck = await sdk.ai.extract.phone({
            value: info.phone,
            country: 'US',
            format: 'E164',
        });
        if (phoneCheck.isValid) {
            info.phone = phoneCheck.parsedValue;  // normalized E.164
        }
    }

    return info;
}
```

### Dynamic TTS with Voice Customization

```javascript
async function generateDynamicPrompt(text, callType = 'support') {
    const voiceProfiles = {
        support: {
            voice: 'en-US-Neural2-C',
            speakingRate: 0.95,
            pitch: -1,
            effectsProfileIds: ['telephony-class-application'],
        },
        sales: {
            voice: 'en-US-Neural2-D',
            speakingRate: 1.05,
            pitch: 1,
            effectsProfileIds: ['telephony-class-application'],
        },
        ivr: {
            voice: 'en-US-Standard-C',
            speakingRate: 0.9,
            pitch: 0,
            effectsProfileIds: ['telephony-class-application'],
        },
    };

    const profile = voiceProfiles[callType] || voiceProfiles.support;

    const audio = await sdk.ai.tts.create({
        text,
        audioEncoding: 'MP3',
        createAccessKey: true,   // store and get URL for playback
        ...profile,
    });

    return {
        url: audio.url,
        durationMs: audio.durationMs,
        storageId: audio.storageId,
    };
}
```
