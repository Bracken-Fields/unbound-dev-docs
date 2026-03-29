---
id: stt-streaming
title: Real-Time STT Streaming
---

# Real-Time Speech-to-Text Streaming

Stream live audio from a call — or any audio source — and receive transcripts word-by-word as speech is detected. Transcripts are automatically linked to engagement sessions, stored, and retrievable via the AI STT API.

## Prerequisites

- An active Unbound namespace with AI access
- A live voice call (or a Node.js audio source)
- An STT engine configured in your namespace (Google, Deepgram, or Whisper)

---

## How It Works

1. Call `api.ai.stt.stream(options)` to open a streaming session
2. Pipe raw PCM audio chunks to the stream
3. The stream emits `transcript` events with `isFinal: false` (interim) and `isFinal: true` (confirmed) segments
4. When the stream ends, the full transcript is stored and retrievable via `api.ai.stt.get(sessionId)`

Interim results let you display live captions. Final results are accurate and stored persistently.

---

## 1. Minimal Streaming Example

```javascript
import SDK from '@unboundcx/sdk';
import { createAudioCapture } from './audio.js'; // Your audio source

const api = new SDK({ namespace: 'your-namespace', token: process.env.UNBOUND_TOKEN });

// Open the streaming session
const stream = await api.ai.stt.stream({
    engine: 'google',
    model: 'phone_call',
    languageCode: 'en-US',
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    engagementSessionId: 'eng-session-123',  // Link transcript to a session
});

// Handle transcript events
stream.on('transcript', (result) => {
    if (result.isFinal) {
        console.log('[FINAL]', result.text);
        // Persist, analyze, or route based on final text
    } else {
        // Interim — update live captions display
        process.stdout.write(`\r[live] ${result.text}    `);
    }
});

stream.on('error', (err) => {
    console.error('STT stream error:', err);
});

stream.on('close', () => {
    console.log('\nStream closed. Session ID:', stream.sessionId);
});

// Pipe audio into the stream
const audio = createAudioCapture({ sampleRate: 16000 });
audio.on('data', (chunk) => stream.write(chunk));
audio.on('end', () => stream.end());
```

---

## 2. Engine Options

| `engine` | `model` options | Best for |
|---|---|---|
| `google` | `phone_call`, `default`, `video`, `command_and_search` | Contact center / telephony |
| `deepgram` | `nova-2`, `enhanced`, `base` | High accuracy, fast interim results |
| `whisper` | `tiny`, `base`, `small`, `medium`, `large` | Multilingual, offline-capable |

### Google Phone Call (Contact Center)

```javascript
const stream = await api.ai.stt.stream({
    engine: 'google',
    model: 'phone_call',
    languageCode: 'en-US',
    encoding: 'MULAW',           // MULAW is native for most telephony
    sampleRateHertz: 8000,       // 8kHz is standard for PSTN calls
    profanityFilter: true,
    diarizationEnabled: true,    // Separate speaker 1 / speaker 2
    diarizationMinSpeakers: 2,
    diarizationMaxSpeakers: 2,
});
```

### Deepgram Nova-2 (High Accuracy)

```javascript
const stream = await api.ai.stt.stream({
    engine: 'deepgram',
    model: 'nova-2',
    languageCode: 'en-US',
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    punctuate: true,             // Add punctuation automatically
    smartFormat: true,           // Format numbers, dates, currencies
    utteranceEndMs: 1000,        // Silence threshold for utterance boundary
});
```

### Whisper (Multilingual)

```javascript
const stream = await api.ai.stt.stream({
    engine: 'whisper',
    model: 'large',
    languageCode: 'es-MX',       // Spanish (Mexico)
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
});
```

---

## 3. Transcribe a Live Voice Call

When Unbound is handling the call, you can start transcription server-side at call creation:

```javascript
// Server-side transcription — easiest setup
const call = await api.voice.call({
    to: '+12135550100',
    from: '+18005551234',
    app: { type: 'dial' },
    transcribe: true,
    transcribeMethod: 'google',
    transcribeLanguage: 'en-US',
    engagementSessionId: existingSessionId,
});
```

For client-side control (start/stop mid-call, different engine per direction), use `api.voice.transcribe`:

```javascript
// Start transcription on both audio directions
await api.voice.transcribe(callControlId, 'start', 'both');

// Or transcribe only the customer's voice (inbound direction)
await api.voice.transcribe(callControlId, 'start', 'recv');

// Forward transcripts to your own webhook in real time
await api.voice.transcribe(callControlId, 'start', 'both', {
    url: 'https://yourapp.com/webhooks/transcript',
    urlMethod: 'POST',
});

// Stop transcription
await api.voice.transcribe(callControlId, 'stop');
```

---

## 4. Manual Streaming with Node.js Microphone

Use the `mic` package to stream live microphone input:

```javascript
import SDK from '@unboundcx/sdk';
import mic from 'mic';

const api = new SDK({ namespace: 'your-namespace', token: process.env.UNBOUND_TOKEN });

async function transcribeMicrophone() {
    const stream = await api.ai.stt.stream({
        engine: 'google',
        model: 'default',
        languageCode: 'en-US',
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
    });

    const micInstance = mic({
        rate: '16000',
        channels: '1',
        fileType: 'raw',
    });

    const micInputStream = micInstance.getAudioStream();

    // Pipe mic audio to the STT stream
    micInputStream.on('data', (data) => {
        stream.write(data);
    });

    micInputStream.on('error', (err) => {
        console.error('Mic error:', err);
        stream.end();
    });

    stream.on('transcript', (result) => {
        if (result.isFinal) {
            console.log('You said:', result.text);
        }
    });

    stream.on('close', () => {
        console.log('Session ID:', stream.sessionId);
    });

    micInstance.start();
    console.log('Recording... Press Ctrl+C to stop.');

    process.on('SIGINT', () => {
        micInstance.stop();
        stream.end();
    });
}

transcribeMicrophone().catch(console.error);
```

---

## 5. Speaker Diarization (Who Said What)

Diarization separates multiple speakers in the transcript:

```javascript
const stream = await api.ai.stt.stream({
    engine: 'google',
    model: 'phone_call',
    languageCode: 'en-US',
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    diarizationEnabled: true,
    diarizationMinSpeakers: 2,
    diarizationMaxSpeakers: 2,
});

const transcript = [];

stream.on('transcript', (result) => {
    if (result.isFinal) {
        // result.words contains per-word speaker tags
        const speakerSegments = groupBySpeaker(result.words || []);
        for (const seg of speakerSegments) {
            console.log(`Speaker ${seg.speakerTag}: ${seg.text}`);
            transcript.push({ speaker: seg.speakerTag, text: seg.text });
        }
    }
});

function groupBySpeaker(words) {
    const segments = [];
    let currentSpeaker = null;
    let currentWords = [];

    for (const word of words) {
        if (word.speakerTag !== currentSpeaker) {
            if (currentWords.length > 0) {
                segments.push({
                    speakerTag: currentSpeaker,
                    text: currentWords.join(' '),
                });
            }
            currentSpeaker = word.speakerTag;
            currentWords = [word.word];
        } else {
            currentWords.push(word.word);
        }
    }

    if (currentWords.length > 0) {
        segments.push({ speakerTag: currentSpeaker, text: currentWords.join(' ') });
    }

    return segments;
}
```

---

## 6. Retrieve and Search Saved Transcripts

After a stream ends, the transcript is stored under the `sessionId`:

```javascript
// Retrieve the full transcript
const transcript = await api.ai.stt.get(stream.sessionId, {
    includeMessages: true,
});

console.log('Full transcript text:', transcript.fullText);
console.log('Segments:', transcript.messages);

// List all transcripts for a date range
const transcripts = await api.ai.stt.list({
    limit: 50,
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    engagementSessionId: 'eng-session-123',
});

console.log(`Found ${transcripts.total} transcripts`);
```

---

## 7. Live Agent Assist — Real-Time Coaching

Use interim transcripts to surface real-time guidance for agents:

```javascript
const stream = await api.ai.stt.stream({
    engine: 'google',
    model: 'phone_call',
    languageCode: 'en-US',
    encoding: 'MULAW',
    sampleRateHertz: 8000,
    engagementSessionId: engagementSessionId,
});

// Accumulate the conversation
const conversationBuffer = [];

stream.on('transcript', async (result) => {
    if (!result.isFinal) return;

    conversationBuffer.push(result.text);

    // Every 3 utterances, ask the AI for coaching suggestions
    if (conversationBuffer.length % 3 === 0) {
        const context = conversationBuffer.slice(-6).join(' ');
        const suggestion = await api.ai.generative.chat({
            messages: [
                {
                    role: 'system',
                    content: 'You are a contact center coach. In one short sentence, '
                        + 'suggest what the agent should do next based on this conversation.',
                },
                { role: 'user', content: `Conversation so far: ${context}` },
            ],
            model: 'gpt-4',
            temperature: 0.3,
            method: 'openai',
        });

        // Push suggestion to agent's UI via WebSocket
        agentSocket.emit('coaching-suggestion', {
            text: suggestion.choices[0].message.content,
        });
    }
});
```

---

## 8. Forward Transcripts to a Webhook

Stream transcripts directly to your own endpoint in real time:

```javascript
await api.voice.transcribe(
    callControlId,
    'start',
    'both',
    {
        url: 'https://yourapp.com/webhooks/transcript',
        urlMethod: 'POST',
    },
);
```

Your webhook will receive POST requests with payloads like:

```json
{
    "callControlId": "call-abc123",
    "direction": "inbound",
    "text": "I'd like to check my account balance",
    "isFinal": true,
    "confidence": 0.97,
    "timestamp": "2024-06-01T14:00:15Z"
}
```

---

## Configuration Reference

| Option | Type | Default | Description |
|---|---|---|---|
| `engine` | string | — | `google`, `deepgram`, or `whisper` |
| `model` | string | `default` | Engine-specific model name |
| `languageCode` | string | `en-US` | BCP-47 language code |
| `encoding` | string | `LINEAR16` | `LINEAR16`, `FLAC`, `MULAW`, `MP3`, `OGG_OPUS` |
| `sampleRateHertz` | number | `16000` | Audio sample rate. Use 8000 for PSTN calls |
| `engagementSessionId` | string | — | Link transcript to an engagement session |
| `diarizationEnabled` | boolean | `false` | Separate speakers in the transcript |
| `diarizationMinSpeakers` | number | `2` | Minimum expected speakers |
| `diarizationMaxSpeakers` | number | `6` | Maximum expected speakers |
| `profanityFilter` | boolean | `false` | Replace profanity with `***` |
| `punctuate` | boolean | `false` | Auto-add punctuation (Deepgram) |
| `smartFormat` | boolean | `false` | Format numbers/dates/currency (Deepgram) |
| `utteranceEndMs` | number | `1000` | Silence ms to finalize an utterance (Deepgram) |

---

## What's Next

- [AI API Reference](/api-reference/ai) — generative chat, TTS, data extraction, playbooks
- [Voice API Reference](/api-reference/voice) — `transcribe()` method details
- [Make an Outbound Call](/guides/make-call) — initiate and control calls
- [Subscriptions](/api-reference/subscriptions) — stream transcript events via WebSocket
