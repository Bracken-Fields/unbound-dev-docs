---
id: ai
title: AI Services
---

# AI Services

`api.ai` — Generative chat, text-to-speech, and real-time speech-to-text.

## Generative AI Chat

```javascript
const response = await api.ai.generative.chat({
  messages: [
    { role: 'system', content: 'You are a helpful customer support agent.' },
    { role: 'user', content: 'What is your return policy?' },
  ],
  model: 'gpt-4',
  temperature: 0.7,
  method: 'openai',
});

console.log(response.choices[0].message.content);
```

| Parameter | Type | Description |
|---|---|---|
| `messages` | array | Conversation history (role/content pairs) |
| `model` | string | Model to use (`gpt-4`, `gpt-3.5-turbo`, etc.) |
| `temperature` | number | Creativity (0–1) |
| `method` | string | Provider (`openai`, etc.) |

---

## Text-to-Speech

```javascript
const audio = await api.ai.tts.create({
  text: 'Hello, thank you for calling Unbound support.',
  voice: 'en-US-Standard-C',
  audioEncoding: 'MP3',
  speakingRate: 1.0,
  pitch: 0,
});

// audio.audioContent — base64 encoded audio
// audio.url — hosted URL (if storage enabled)
```

| Parameter | Type | Description |
|---|---|---|
| `text` | string | Text to synthesize |
| `voice` | string | Voice name |
| `audioEncoding` | string | `MP3`, `OGG_OPUS`, `LINEAR16` |
| `speakingRate` | number | Speed (0.25–4.0, default 1.0) |
| `pitch` | number | Pitch in semitones (-20 to 20) |

---

## Speech-to-Text

### File Transcription

```javascript
const transcription = await api.ai.stt.create({
  sourceType: 'storage',
  storageId: 'audio-file-id',
  engine: 'google',
  languageCode: 'en-US',
  metadata: {
    diarization: true,
    speakerCount: 2,
  },
});
```

### Real-Time Streaming

Stream live audio and receive transcripts as they happen:

```javascript
const stream = await api.ai.stt.stream({
  engine: 'google',
  model: 'phone_call',
  languageCode: 'en-US',
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  engagementSessionId: 'eng-session-123',
});

// Listen for events
stream.on('transcript', (result) => {
  if (result.isFinal) {
    console.log('[FINAL]', result.text);
  } else {
    console.log('[interim]', result.text);
  }
});

stream.on('error', (error) => console.error(error));
stream.on('close', () => console.log('Stream closed'));

// Write audio chunks
stream.write(audioBuffer); // Buffer or Uint8Array
stream.end();              // Close when done
```

:::info Automatic Storage
Transcripts from streaming sessions are automatically saved to the database. Retrieve them later with `api.ai.stt.get(sessionId)`.
:::

### Retrieve a Transcript

```javascript
const saved = await api.ai.stt.get(stream.sessionId, {
  includeMessages: true,
});
```

### List Transcriptions

```javascript
const transcriptions = await api.ai.stt.list({
  engagementSessionId: 'eng-123',
  status: 'completed',
  limit: 50,
});
```

---

## AI Playbooks

Playbooks define scripted AI behaviors for voice/chat flows.

```javascript
// Create a playbook
await api.ai.playbooks.create({
  name: 'support-triage',
  instructions: 'Greet the caller, identify their issue, and route accordingly.',
  steps: [ /* ... */ ],
});

// List playbooks
const playbooks = await api.ai.playbooks.list();
```
