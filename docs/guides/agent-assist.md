---
id: agent-assist
title: AI-Powered Agent Assist
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# AI-Powered Agent Assist

Build a real-time assistant that listens to live calls, transcribes every word, searches your knowledge base for relevant answers, and surfaces AI-generated suggestions to the agent — all while the conversation is happening.

By the end of this guide you'll have a working Node.js service that:

1. Connects to an active voice call's audio stream
2. Feeds audio to Unbound's real-time STT over gRPC
3. Runs semantic KB search on each final transcript segment
4. Sends AI-generated response suggestions to the agent's UI via WebSocket
5. Logs a post-call summary note to the CRM record

---

## Prerequisites

- Unbound SDK installed (`npm install @unboundcx/sdk`)
- A live call with a CDR and bridgeId (from the Task Router flow)
- At least one knowledge base already indexed (see [Knowledge Base reference](/api-reference/knowledge-base))
- An active engagement session tied to the call

---

## Architecture

```
Voice Call (active)
        │
        ▼
STT Stream (gRPC) ──► transcript events
        │                    │
        │                    ▼
        │         KB Search (per final segment)
        │                    │
        │                    ▼
        │         AI Chat Completion (context-aware)
        │                    │
        │                    ▼
        └──────────► WebSocket push to agent UI
                             │
                             ▼
               (call ends) POST note to CRM
```

---

## Step 1 — Initialize the SDK and Session

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: process.env.UNBOUND_NAMESPACE });
await api.login.login(
    process.env.UNBOUND_USER,
    process.env.UNBOUND_PASS,
);
```

---

## Step 2 — Start a Streaming Transcription Session

Create an STT streaming session before the call audio starts:

```javascript
async function createTranscriptionSession(callId) {
    // Create a named session tied to this call
    const session = await api.ai.stt.create({
        name: `agent-assist-${callId}`,
        status: 'active',
    });

    console.log('STT session created:', session.id);
    return session.id;
}
```

Then open the live gRPC stream:

```javascript
async function startAudioStream(sessionId) {
    const stream = await api.ai.stt.stream({
        sessionId,
        sampleRate: 8000,        // standard telephony rate
        encoding: 'MULAW',       // G.711 μ-law, common for SIP
        languageCode: 'en-US',
        interimResults: true,    // get partials as the speaker talks
        model: 'telephony',      // telephony-optimized acoustic model
    });

    return stream;
}
```

The stream emits:

| Event | When | Payload |
|---|---|---|
| `ready` | gRPC connection established | — |
| `transcript` | Interim (in-progress) segment | `{ text, isFinal: false, confidence }` |
| `final-transcript` | Speaker paused, segment complete | `{ text, isFinal: true, confidence, words[] }` |
| `error` | gRPC or network error | Error object |
| `close` | Stream ended | — |

---

## Step 3 — Build the Agent Assist Engine

The core engine listens to final transcripts, searches the KB, and queries AI for a contextual suggestion:

```javascript
class AgentAssistEngine {
    constructor(api, options) {
        this.api = api;
        this.kbId = options.kbId;           // knowledge base ID to search
        this.engagementId = options.engagementId;
        this.onSuggestion = options.onSuggestion;  // callback for UI push

        this.conversationHistory = [];       // rolling context for AI
        this.MAX_HISTORY = 6;               // last 3 turns (user + assistant pairs)
    }

    async handleFinalTranscript(segment) {
        const { text, speaker } = segment;

        // Add to rolling conversation context
        this.conversationHistory.push({
            role: speaker === 'agent' ? 'assistant' : 'user',
            content: text,
        });

        // Trim to last N messages
        if (this.conversationHistory.length > this.MAX_HISTORY) {
            this.conversationHistory = this.conversationHistory.slice(-this.MAX_HISTORY);
        }

        // Only surface suggestions on customer speech (not agent)
        if (speaker === 'agent') return;

        // Run KB search and AI completion in parallel
        const [kbResults, aiSuggestion] = await Promise.all([
            this._searchKnowledgeBase(text),
            this._getAiSuggestion(text),
        ]);

        // Fire the suggestion callback
        this.onSuggestion({
            triggerText: text,
            aiSuggestion,
            kbResults: kbResults.slice(0, 3),   // top 3 articles
            timestamp: Date.now(),
        });
    }

    async _searchKnowledgeBase(query) {
        try {
            const results = await this.api.knowledgeBase.search(query, {
                kbId: this.kbId,
                limit: 5,
            });
            return results;
        } catch (err) {
            console.error('KB search error:', err.message);
            return [];
        }
    }

    async _getAiSuggestion(customerText) {
        try {
            const systemPrompt = `You are an expert customer service assistant.
You are helping a live agent respond to a customer in real time.
Based on the customer's latest message and the conversation so far, suggest a concise, 
helpful response for the agent to use. Keep it professional and under 2 sentences.
Do NOT include preamble like "Here's a suggestion:" — just the response text itself.`;

            const messages = [
                ...this.conversationHistory.slice(0, -1),  // history minus the latest
                {
                    role: 'user',
                    content: `Customer said: "${customerText}"\n\nSuggest a response for the agent:`,
                },
            ];

            const result = await this.api.ai.generative.chat({
                model: 'gpt-4o-mini',    // fast model for low-latency suggestions
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages,
                ],
                maxTokens: 150,
                temperature: 0.3,        // lower temp = more predictable suggestions
            });

            return result.message || result.content || '';
        } catch (err) {
            console.error('AI suggestion error:', err.message);
            return null;
        }
    }
}
```

---

## Step 4 — Wire the STT Stream to the Engine

```javascript
async function startAgentAssist({ callId, engagementId, kbId, sendToAgent }) {
    const sessionId = await createTranscriptionSession(callId);
    const stream = await startAudioStream(sessionId);

    const engine = new AgentAssistEngine(api, {
        kbId,
        engagementId,
        onSuggestion: (suggestion) => {
            // Push to the agent's UI via WebSocket, SSE, or your push layer
            sendToAgent(engagementId, {
                type: 'agent_assist_suggestion',
                ...suggestion,
            });
        },
    });

    // Route events to the engine
    stream.on('ready', () => {
        console.log(`[${callId}] STT stream ready`);
    });

    stream.on('transcript', (segment) => {
        // Optional: stream partials to UI for live captioning
        if (!segment.isFinal) {
            sendToAgent(engagementId, {
                type: 'live_caption',
                text: segment.text,
                isFinal: false,
            });
        }
    });

    stream.on('final-transcript', async (segment) => {
        sendToAgent(engagementId, {
            type: 'live_caption',
            text: segment.text,
            isFinal: true,
        });

        // Async — don't block the stream
        engine.handleFinalTranscript(segment).catch((err) => {
            console.error('Engine error:', err.message);
        });
    });

    stream.on('error', (err) => {
        console.error(`[${callId}] STT error:`, err.message);
    });

    stream.on('close', () => {
        console.log(`[${callId}] STT stream closed`);
    });

    return stream;
}
```

---

## Step 5 — Feed Audio to the Stream

In a real deployment, audio arrives from SIP via RTP or from a recording bridge. Here's the pattern for piping audio data:

```javascript
// If receiving RTP packets from a SIP media server
rtpSocket.on('message', (packet) => {
    // Strip 12-byte RTP header, send raw MULAW payload
    const audioPayload = packet.slice(12);
    stream.write(audioPayload);
});

// If receiving audio via HTTP from a call bridge webhook
app.post('/audio-stream', (req, res) => {
    req.on('data', (chunk) => {
        stream.write(chunk);
    });
    req.on('end', () => {
        res.sendStatus(200);
    });
});

// Graceful shutdown when call ends
function stopAssist() {
    stream.end();
}
```

---

## Step 6 — Log a Post-Call AI Summary

When the call ends, generate and save a summary note to the CRM engagement record:

```javascript
async function savePostCallNote(engagementId, conversationHistory) {
    if (conversationHistory.length === 0) return;

    // Build the transcript text for summarization
    const transcriptText = conversationHistory
        .map((m) => `${m.role === 'user' ? 'Customer' : 'Agent'}: ${m.content}`)
        .join('\n');

    try {
        // Ask AI to summarize
        const summary = await api.ai.generative.chat({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are a call summary assistant. Summarize the key points of this customer service call in 3-5 bullet points. Include: the customer\'s issue, what was resolved, and any next steps.',
                },
                {
                    role: 'user',
                    content: `Transcript:\n${transcriptText}`,
                },
            ],
            maxTokens: 300,
        });

        const summaryText = summary.message || summary.content || 'No summary available.';

        // Save as a note on the engagement record
        await api.notes.create({
            relatedId: engagementId,
            title: 'AI Call Summary',
            content_html: `<h3>AI-Generated Call Summary</h3><pre>${summaryText}</pre>`,
            content_json: {
                type: 'doc',
                content: [{
                    type: 'paragraph',
                    content: [{ type: 'text', text: summaryText }],
                }],
            },
        });

        console.log(`Post-call summary saved for engagement ${engagementId}`);
    } catch (err) {
        console.error('Failed to save post-call note:', err.message);
    }
}
```

---

## Complete Integration Example

Here's a condensed, production-ready class that wraps the entire flow:

```javascript
import SDK from '@unboundcx/sdk';

export class AgentAssist {
    constructor(config) {
        this.api = new SDK({ namespace: config.namespace });
        this.kbId = config.kbId;
        this.callId = config.callId;
        this.engagementId = config.engagementId;
        this.sendToAgent = config.sendToAgent;

        this.stream = null;
        this.sessionId = null;
        this.conversationHistory = [];
    }

    async start() {
        await this.api.login.login(
            process.env.UNBOUND_USER,
            process.env.UNBOUND_PASS,
        );

        // Create STT session
        const session = await this.api.ai.stt.create({
            name: `assist-${this.callId}`,
            status: 'active',
        });
        this.sessionId = session.id;

        // Open gRPC stream
        this.stream = await this.api.ai.stt.stream({
            sessionId: this.sessionId,
            sampleRate: 8000,
            encoding: 'MULAW',
            languageCode: 'en-US',
            interimResults: true,
            model: 'telephony',
        });

        this._attachStreamHandlers();
        return this;
    }

    write(audioChunk) {
        if (this.stream && !this.stream.isClosed) {
            this.stream.write(audioChunk);
        }
    }

    async stop() {
        if (this.stream) {
            this.stream.end();
        }
        await this._finalize();
    }

    _attachStreamHandlers() {
        this.stream.on('ready', () => {
            console.log(`[AgentAssist] Stream ready for call ${this.callId}`);
        });

        this.stream.on('transcript', (seg) => {
            if (!seg.isFinal) {
                this.sendToAgent(this.engagementId, {
                    type: 'caption',
                    text: seg.text,
                    isFinal: false,
                });
            }
        });

        this.stream.on('final-transcript', (seg) => {
            this.sendToAgent(this.engagementId, {
                type: 'caption',
                text: seg.text,
                isFinal: true,
            });

            this.conversationHistory.push({
                role: seg.speaker === 'agent' ? 'assistant' : 'user',
                content: seg.text,
            });

            // Only generate suggestions for customer speech
            if (seg.speaker !== 'agent') {
                this._generateSuggestion(seg.text).catch(console.error);
            }
        });

        this.stream.on('error', (err) => {
            console.error(`[AgentAssist] Error:`, err.message);
        });
    }

    async _generateSuggestion(customerText) {
        const [kbResults, aiText] = await Promise.all([
            this.api.knowledgeBase.search(customerText, {
                kbId: this.kbId,
                limit: 3,
            }).catch(() => []),
            this.api.ai.generative.chat({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Suggest a brief, professional agent response. 1-2 sentences max. No preamble.',
                    },
                    ...this.conversationHistory.slice(-4),
                    {
                        role: 'user',
                        content: `Customer: "${customerText}" — Suggest response:`,
                    },
                ],
                maxTokens: 120,
                temperature: 0.3,
            }).then((r) => r.message || r.content || '').catch(() => ''),
        ]);

        this.sendToAgent(this.engagementId, {
            type: 'suggestion',
            aiText,
            kbArticles: kbResults.map((r) => ({
                title: r.title,
                snippet: r.snippet,
                url: r.url,
                score: r.score,
            })),
            timestamp: Date.now(),
        });
    }

    async _finalize() {
        if (this.conversationHistory.length === 0) return;

        // Complete the STT session
        if (this.sessionId) {
            await this.api.ai.stt.complete(this.sessionId, {
                status: 'completed',
            }).catch(console.error);
        }

        // Save AI summary note
        await savePostCallNote(
            this.api,
            this.engagementId,
            this.conversationHistory,
        ).catch(console.error);
    }
}

async function savePostCallNote(api, engagementId, history) {
    const transcript = history
        .map((m) => `${m.role === 'user' ? 'Customer' : 'Agent'}: ${m.content}`)
        .join('\n');

    const summary = await api.ai.generative.chat({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: 'Summarize this customer service call in 3-5 bullet points. Cover: issue, resolution, next steps.',
            },
            { role: 'user', content: transcript },
        ],
        maxTokens: 300,
    });

    const text = summary.message || summary.content || '';

    await api.notes.create({
        relatedId: engagementId,
        title: 'AI Call Summary',
        content_html: `<h3>AI-Generated Summary</h3><pre>${text}</pre>`,
    });
}
```

---

## Usage in a Task Router Handler

Wire it into your existing call handling:

```javascript
import { AgentAssist } from './AgentAssist.js';

// When a task is accepted by an agent
async function onTaskAccepted(taskId, engagementId, wsServer) {
    const assist = new AgentAssist({
        namespace: process.env.UNBOUND_NAMESPACE,
        kbId: 'your-kb-id',
        callId: taskId,
        engagementId,
        sendToAgent: (engId, payload) => {
            // Push to agent's browser via WebSocket
            wsServer.to(`engagement:${engId}`).emit('assist', payload);
        },
    });

    await assist.start();

    // Return so caller can feed audio and call stop() later
    return assist;
}

// When the call ends
async function onCallEnded(assist) {
    await assist.stop();
    console.log('Agent assist finalized');
}
```

---

## Agent UI Handling (Browser)

On the agent's browser, listen for `assist` events over your WebSocket:

```javascript
socket.on('assist', (payload) => {
    if (payload.type === 'caption') {
        updateLiveCaption(payload.text, payload.isFinal);
    }

    if (payload.type === 'suggestion') {
        // Show AI suggestion in a card
        showAiCard({
            text: payload.aiText,
            timestamp: payload.timestamp,
        });

        // Show top KB article if relevant
        if (payload.kbArticles.length > 0 && payload.kbArticles[0].score > 0.7) {
            showKbArticle(payload.kbArticles[0]);
        }
    }
});
```

---

## Performance Tips

**Throttle KB search on rapid speech.** If a customer speaks fast, you may get many final segments in quick succession. Debounce or coalesce before searching:

```javascript
let pendingSearch = null;

stream.on('final-transcript', (seg) => {
    if (pendingSearch) clearTimeout(pendingSearch);
    pendingSearch = setTimeout(() => {
        engine.handleFinalTranscript(seg);
        pendingSearch = null;
    }, 300);  // 300ms debounce
});
```

**Use a fast AI model for real-time suggestions.** `gpt-4o-mini` or equivalent is preferred over `gpt-4o` during the live call — latency matters more than perfection. Reserve the larger model for the post-call summary.

**Cap conversation history.** Keep the rolling context to 6-8 messages max. Longer context increases latency and rarely improves real-time suggestion quality.

**Pre-warm the KB index.** For production, call `knowledgeBase.search('test')` once at startup to ensure the search index is warm before the first call comes in.

---

## Related

- [Speech-to-Text reference](/api-reference/ai#speech-to-text)
- [Knowledge Base reference](/api-reference/knowledge-base)
- [Generative AI reference](/api-reference/ai#generative-ai)
- [Task Router reference](/api-reference/task-router)
- [Notes reference](/api-reference/notes)
- [Real-Time Subscriptions guide](/guides/real-time-subscriptions)
- [Task Router Quickstart](/guides/task-router-quickstart)
