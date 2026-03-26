---
id: ai
title: AI Services
---

# AI Services

`sdk.ai` — Generative chat, text-to-speech, real-time speech-to-text streaming, AI playbooks, and data extraction.

---

## Generative AI

### `ai.generative.chat(options)`

Send a conversation to a generative AI model and receive a response.

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

```javascript
const response = await sdk.ai.generative.playbook({
    playbookId: 'pb_support_triage',
    messages: [
        { role: 'user', content: 'My internet is down.' },
    ],
    sessionId: 'session_abc123',  // maintain conversation state
});
```

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

```javascript
const voices = await sdk.ai.tts.list();
// voices.voices → [{ name: 'en-US-Neural2-A', gender: 'FEMALE', languageCodes: ['en-US'], ... }, ...]
// voices.count → 380
// voices.supportedEncodings → ['MP3', 'OGG_OPUS', 'LINEAR16']
// voices.supportedLanguages → ['en-US', 'es-MX', 'fr-FR', ...]
```

---

## Speech-to-Text

### `ai.stt.create(options)` — File/Batch Transcription

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
| `sipCallId` | string | — | SIP call identifier |
| `bridgeId` | string | — | Bridge identifier for multi-leg calls |
| `name` | string | — | Human-readable session name |
| `metadata` | object | — | Arbitrary key-value metadata |

**Stream events:**

| Event | Payload | Description |
|---|---|---|
| `transcript` | `{ text, isFinal, confidence, words }` | Transcription result |
| `sentiment` | `{ score, trend, emotions, intensity }` | Sentiment update |
| `error` | `Error` | Stream or connection error |
| `close` | — | Stream has fully closed |

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

```javascript
const transcript = await sdk.ai.stt.get('stt_abc123', {
    includeMessages: true,  // default: true
});
```

---

### `ai.stt.list(filters?)` — List Transcriptions

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

---

### `ai.stt.logMessage(sessionId, message)` — Log a Transcript Segment

Manually log a message to a streaming session (for custom or external STT integrations).

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

---

### `ai.stt.complete(sessionId, options?)` — Finalize a Session

```javascript
// Mark as successful
await sdk.ai.stt.complete('stt_stream_abc', { status: 'completed' });

// Mark as failed
await sdk.ai.stt.complete('stt_stream_abc', {
    status: 'failed',
    error: 'WebSocket connection dropped unexpectedly',
});
```

---

## Data Extraction

`sdk.ai.extract` — Extract and validate structured data from unstructured text using AI.

### Extract a Phone Number

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

### Extract an Email

```javascript
const result = await sdk.ai.extract.email({
    value: 'Reach me at jane at example dot com',
});
// result.isValid → true
// result.parsedValue → 'jane@example.com'
// result.metadata → { domain: 'example.com' }
```

### Extract an Address

```javascript
const result = await sdk.ai.extract.address({
    value: '123 Main Street, Springfield, IL 62701',
    useAI: true,  // true = better for conversational text
});
// result.isValid → true
// result.parsedValue → '123 Main St, Springfield, IL 62701, USA'
// result.metadata.components → { streetNumber: '123', route: 'Main St', ... }
```

### Extract a Name

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

### Detect Yes/No from Natural Language

```javascript
const result = await sdk.ai.extract.correctIncorrect({
    value: 'Yeah that sounds right',
});
// result.parsedValue → 'correct'
// result.booleanValue → true
```

### Extract a Credit Card Number

```javascript
const result = await sdk.ai.extract.creditCard({
    value: '4111 1111 1111 1111',
    maskOutput: true,   // default: true — returns only last 4
});
// result.isValid → true
// result.parsedValue → '************1111'
// result.metadata → { cardType: 'Visa', length: 16 }
```

### Extract an SSN

```javascript
const result = await sdk.ai.extract.ssn({
    value: 'My social is 123-45-6789',
    maskOutput: true,
});
// result.isValid → true
// result.parsedValue → '*****6789'
```

### Extract a Phone Extension

```javascript
const result = await sdk.ai.extract.extension({
    value: 'extension four two one',
    minLength: 1,
    maxLength: 10,
});
// result.parsedValue → '421'
```

### Detect Intent

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

### Extract All Entities

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

### Custom Regex Extraction

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

#### `ai.playbooks.getPlaybook({ playbookId })`

```javascript
const pb = await sdk.ai.playbooks.getPlaybook({
    playbookId: 'pb_123456',
});
// pb.id → 'pb_123456'
// pb.name → 'Inbound Support Script'
// pb.isPublished → true
// pb.goals → [...] (ordered array of PlaybookGoal objects)
```

#### `ai.playbooks.createPlaybook(options)`

```javascript
const pb = await sdk.ai.playbooks.createPlaybook({
    name: 'Sales Discovery Call',
    recordTypeId: 'rt_sales',
});
// Returns: { id: 'pb_new', name, recordTypeId, createdAt, ... }
```

#### `ai.playbooks.updatePlaybook(options)`

```javascript
const updated = await sdk.ai.playbooks.updatePlaybook({
    playbookId: 'pb_123456',
    name: 'Sales Discovery Call v2',
    isPublished: true,
});
```

#### `ai.playbooks.deletePlaybook({ playbookId })`

```javascript
await sdk.ai.playbooks.deletePlaybook({ playbookId: 'pb_123456' });
```

---

### Playbook Goal Types

Goal types are reusable templates that categorize the kind of behavior being measured (greeting, discovery, objection handling, closing, etc.).

#### `ai.playbooks.listPlaybookGoalTypes(options?)`

```javascript
const goalTypes = await sdk.ai.playbooks.listPlaybookGoalTypes({
    recommendedPhase: 'early',   // 'early' | 'middle' | 'late' | 'any'
    recordTypeId: 'rt_sales',
    limit: 50,
});
```

#### `ai.playbooks.getPlaybookGoalType({ goalTypeId })`

```javascript
const gt = await sdk.ai.playbooks.getPlaybookGoalType({
    goalTypeId: 'gt_greeting',
});
```

#### `ai.playbooks.createPlaybookGoalType(options)`

```javascript
const goalType = await sdk.ai.playbooks.createPlaybookGoalType({
    name: 'Opening/Greeting',
    description: 'Initial greeting and rapport building',
    keywords: ['hello', 'hi', 'good morning', 'thanks for taking the call'],
    recommendedPhase: 'early',
    recordTypeId: 'rt_sales',
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✓ | Display name for this goal type |
| `description` | string | — | What this goal type measures |
| `keywords` | array | — | Keywords that suggest this goal type |
| `recommendedPhase` | string | — | `early`, `middle`, `late`, or `any` |
| `recordTypeId` | string | — | Scope to a specific record type |

#### `ai.playbooks.updatePlaybookGoalType(options)`

```javascript
await sdk.ai.playbooks.updatePlaybookGoalType({
    goalTypeId: 'gt_greeting',
    keywords: ['hello', 'hi', 'good morning', 'greetings', 'thanks for calling'],
});
```

#### `ai.playbooks.deletePlaybookGoalType({ goalTypeId })`

```javascript
await sdk.ai.playbooks.deletePlaybookGoalType({ goalTypeId: 'gt_greeting' });
```

---

### Playbook Goals

Goals are the specific evaluation criteria attached to a playbook. Each goal can be weighted and scored.

#### `ai.playbooks.listPlaybookGoals({ playbookId })`

```javascript
const goals = await sdk.ai.playbooks.listPlaybookGoals({
    playbookId: 'pb_123456',
});
// goals.results → [{ id, goal, description, weight, scoreType, requiredForPass, ... }]
```

#### `ai.playbooks.getPlaybookGoal({ playbookId, goalId })`

```javascript
const goal = await sdk.ai.playbooks.getPlaybookGoal({
    playbookId: 'pb_123456',
    goalId: 'goal_789',
});
```

#### `ai.playbooks.createPlaybookGoal(options)`

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

```javascript
await sdk.ai.playbooks.updatePlaybookGoal({
    goalId: 'goal_789',
    playbookGoalTypeId: 'gt_discovery',
    weight: 30,
    description: 'Updated: discover at least 3 pain points',
});
```

#### `ai.playbooks.deletePlaybookGoal({ goalId })`

```javascript
await sdk.ai.playbooks.deletePlaybookGoal({ goalId: 'goal_789' });
```

#### `ai.playbooks.reorderPlaybookGoals({ playbookId, goalOrder })`

```javascript
await sdk.ai.playbooks.reorderPlaybookGoals({
    playbookId: 'pb_123456',
    goalOrder: ['goal_3', 'goal_1', 'goal_2'],  // IDs in desired display order
});
```

---

### Playbook Sessions

A playbook session tracks one instance of a playbook being run against a conversation (call, chat, etc.).

#### `ai.playbooks.createSession(options)`

Start a new evaluation session for a published playbook.

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

#### `ai.playbooks.getSession(options)`

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
