---
id: ai
title: AI Services
---

# AI Services

`api.ai` — Generative chat, text-to-speech, real-time speech-to-text streaming, AI playbooks, and data extraction.

---

## Generative AI

### `ai.generative.chat(options)`

```javascript
const response = await api.ai.generative.chat({
  messages: [
    { role: 'system', content: 'You are a helpful support agent.' },
    { role: 'user', content: 'What is your return policy?' },
  ],
  model: 'gpt-4',
  temperature: 0.7,
  method: 'openai',
});

console.log(response.choices[0].message.content);
```

---

## Text-to-Speech

### `ai.tts.create(options)`

```javascript
const audio = await api.ai.tts.create({
  text: 'Hello, thank you for calling.',
  voice: 'en-US-Standard-C',
  audioEncoding: 'MP3',
  speakingRate: 1.0,
  pitch: 0,
});

// audio.audioContent — base64-encoded audio
// audio.url — hosted URL (if storage is configured)
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `text` | string | — | Text to synthesize |
| `voice` | string | — | Voice name |
| `audioEncoding` | string | — | `MP3`, `OGG_OPUS`, or `LINEAR16` |
| `speakingRate` | number | `1.0` | Speech speed (0.25–4.0) |
| `pitch` | number | `0` | Pitch in semitones (−20 to +20) |

---

## Speech-to-Text

### `ai.stt.create(options)` — File/Batch Transcription

```javascript
const transcription = await api.ai.stt.create({
  sourceType: 'storage',      // 'storage' | 'file' | 'url' | 'stream'
  storageId: 'audio-file-id',
  engine: 'google',           // 'google' | 'deepgram' | 'whisper'
  languageCode: 'en-US',
  metadata: {
    diarization: true,
    speakerCount: 2,
  },
  engagementSessionId: 'eng-123',
  playbookId: 'pb-456',
});
```

| Parameter | Type | Description |
|---|---|---|
| `sourceType` | string | `storage`, `file`, `url`, or `stream` |
| `storageId` | string | Storage file ID (when `sourceType: 'storage'`) |
| `engine` | string | `google`, `deepgram`, or `whisper` |
| `languageCode` | string | BCP-47 language code |
| `metadata` | object | Engine-specific options (diarization, speaker count, etc.) |
| `engagementSessionId` | string | Link to an engagement session |
| `playbookId` | string | AI playbook to associate |

---

### `ai.stt.stream(options)` — Real-Time Streaming

:::info Node.js only
STT streaming requires a Node.js environment. Browser-based streaming is not supported.
:::

```javascript
const stream = await api.ai.stt.stream({
  engine: 'google',
  model: 'phone_call',
  languageCode: 'en-US',
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  audioChannelCount: 1,
  interimResults: true,
  enableAutomaticPunctuation: true,
  diarizationEnabled: false,
  vadEnabled: false,
  engagementSessionId: 'eng-123',
});

stream.on('transcript', (result) => {
  if (result.isFinal) {
    console.log('[FINAL]', result.text);
  } else {
    process.stdout.write(`\r[interim] ${result.text}`);
  }
});

stream.on('error', (err) => console.error('Stream error:', err));
stream.on('close', () => console.log('Stream closed:', stream.sessionId));

// Write audio chunks
stream.write(audioBuffer);  // Buffer or Uint8Array
stream.end();               // Finalize
```

**Stream options:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `engine` | string | `'google'` | STT engine |
| `model` | string | — | Model variant (`phone_call`, `default`, `video`) |
| `languageCode` | string | `'en-US'` | BCP-47 language code |
| `encoding` | string | `'LINEAR16'` | Audio encoding |
| `sampleRateHertz` | number | `16000` | Sample rate in Hz (8000 or 16000 recommended) |
| `audioChannelCount` | number | `1` | Channels (1 = mono, 2 = stereo) |
| `singleUtterance` | boolean | `false` | Stop after first complete utterance |
| `interimResults` | boolean | `true` | Emit partial transcripts as you speak |
| `enableAutomaticPunctuation` | boolean | `true` | Add punctuation automatically |
| `diarizationEnabled` | boolean | `false` | Separate transcripts by speaker |
| `speakerCount` | number | — | Expected number of speakers (if diarization enabled) |
| `vadEnabled` | boolean | `false` | Voice Activity Detection |
| `minSilenceDuration` | number | `500` | Min silence (ms) before VAD triggers |
| `speechPadMs` | number | `400` | Padding (ms) around speech segments |
| `engagementSessionId` | string | — | Link to engagement session |
| `generateTranscriptSummary` | boolean | — | Auto-generate summary when stream ends |
| `generateSentiment` | boolean | — | Analyze sentiment on each transcript |

**Supported languages:**

| Code | Language |
|---|---|
| `en-US` | English (US) |
| `en-GB` | English (UK) |
| `es-MX` | Spanish (Mexico) |
| `es-US` | Spanish (US) |
| `fr-FR` | French |
| `fr-CA` | French (Canada) |
| `de-DE` | German |
| `pt-BR` | Portuguese (Brazil) |
| `zh-CN` | Chinese (Simplified) |
| `ja-JP` | Japanese |
| `ko-KR` | Korean |

---

### `ai.stt.get(id, options?)` — Retrieve a Transcript

```javascript
const transcript = await api.ai.stt.get('session-id', {
  includeMessages: true,
});
```

---

### `ai.stt.list(filters?)` — List Transcriptions

```javascript
const results = await api.ai.stt.list({
  engagementSessionId: 'eng-123',
  status: 'completed',    // 'pending' | 'processing' | 'completed' | 'failed'
  engine: 'google',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  limit: 50,
  offset: 0,
});
```

---

### `ai.stt.logMessage(sessionId, message)` — Log a Transcript Segment

Manually log a message to a streaming session (for custom STT integrations).

```javascript
await api.ai.stt.logMessage('session-id', {
  text: 'Hello, how can I help you today?',
  role: 'agent',
  confidence: 0.98,
  duration: 2.4,
  sentiment: {
    score: 15,
    trend: 'stable',
    emotions: ['neutral', 'friendly'],
  },
});
```

---

### `ai.stt.complete(sessionId, options?)` — Finalize a Session

```javascript
await api.ai.stt.complete('session-id', { status: 'completed' });
// or on failure:
await api.ai.stt.complete('session-id', { status: 'failed', error: 'Connection dropped' });
```

---

## Data Extraction

`api.ai.extract` — Extract structured data from unstructured text using AI.

### Extract a Phone Number

```javascript
const result = await api.ai.extract.phone({
  value: 'Call me at eight hundred five five five twelve twelve',
  country: 'US',
  format: 'E164',
});
// result.isValid → true
// result.parsedValue → '+18005551212'
```

### Extract an Email

```javascript
const result = await api.ai.extract.email({ value: 'Reach me at jane at example dot com' });
```

### Extract an Address

```javascript
const result = await api.ai.extract.address({
  value: '123 Main Street, Springfield, IL 62701',
  useAI: true,
});
```

### Extract a Name

```javascript
const result = await api.ai.extract.personName({
  value: 'My name is Jane Marie Smith',
  useAI: true,
});
// result.parsedValue → 'Jane Marie Smith'
// result.firstName → 'Jane'
// result.lastName → 'Smith'
```

### Detect Yes/No from Natural Language

```javascript
const result = await api.ai.extract.correctIncorrect({
  value: 'Yeah that sounds right',
});
// result.parsedValue → 'correct'
// result.booleanValue → true
```

### Detect Intent

```javascript
const result = await api.ai.extract.intent({
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
```

### Extract All Entities

```javascript
const result = await api.ai.extract.all({
  value: 'Call John Smith at 555-1234 or john@example.com',
  types: ['phone', 'email', 'personName'],
  question: 'What is the caller contact information?',
});
// result.extractions → [{ type: 'phone', value: '+15551234', ... }, ...]
```

### Custom Regex Extraction

```javascript
const result = await api.ai.extract.regex({
  value: 'Order number is AB-123456',
  pattern: '[A-Z]{2}-\\d{6}',
  flags: 'g',
});
// result.parsedValue → 'AB-123456'
```

---

## AI Playbooks

Playbooks define scripted AI behaviors for voice and chat flows.

```javascript
// List playbooks
const playbooks = await api.ai.playbooks.list();

// Get a playbook
const pb = await api.ai.playbooks.get('playbook-id');
```
