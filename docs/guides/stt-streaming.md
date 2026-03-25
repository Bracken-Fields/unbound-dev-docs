---
id: stt-streaming
title: Real-Time STT Streaming
---

# Real-Time Speech-to-Text Streaming

Stream live audio from a call and receive transcripts in real time. Transcripts are automatically stored and retrievable by session ID.

## Full Example

```javascript
import SDK from '@unboundcx/sdk';
import { createAudioCapture } from './audio.js'; // Your audio source

const api = new SDK({ namespace: 'your-namespace', token: 'your-jwt' });

// Start the stream
const stream = await api.ai.stt.stream({
  engine: 'google',
  model: 'phone_call',
  languageCode: 'en-US',
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  engagementSessionId: 'eng-session-123',
});

// Handle transcript events
stream.on('transcript', (result) => {
  if (result.isFinal) {
    console.log('[FINAL]', result.text);
    // Store, analyze, or route based on content
  } else {
    process.stdout.write(`\r[interim] ${result.text}`);
  }
});

stream.on('error', (error) => {
  console.error('Stream error:', error);
});

stream.on('close', () => {
  console.log('Stream closed. Session:', stream.sessionId);
});

// Pipe audio to the stream
const audio = createAudioCapture({ sampleRate: 16000 });
audio.on('data', (chunk) => stream.write(chunk));
audio.on('end', () => stream.end());
```

## Retrieve Saved Transcript

```javascript
const transcript = await api.ai.stt.get(stream.sessionId, {
  includeMessages: true,
});

console.log('Full transcript:', transcript.messages);
```

## Configuration Options

| Option | Type | Description |
|---|---|---|
| `engine` | string | `google`, `deepgram`, `whisper` |
| `model` | string | `phone_call`, `default`, `video`, `command_and_search` |
| `languageCode` | string | BCP-47 language code (`en-US`, `es-MX`, etc.) |
| `encoding` | string | Audio encoding — `LINEAR16`, `FLAC`, `MULAW` |
| `sampleRateHertz` | number | Sample rate (8000 or 16000 recommended) |
| `engagementSessionId` | string | Link transcript to an engagement session |

## Integration with Voice Calls

Pair with `api.voice.createCall()` to transcribe calls automatically:

```javascript
const call = await api.voice.createCall({
  to: '+1234567890',
  from: '+0987654321',
  transcribe: true, // Enables server-side transcription
});

// Or stream manually with api.ai.stt.stream for client-side control
```
