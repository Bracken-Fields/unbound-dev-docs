---
id: handle-inbound-calls
title: Handle Inbound Calls
---

# Handle Inbound Calls

This guide walks through building a complete inbound call handler — from webhook receipt through IVR menus, DTMF routing, agent transfer, recording, and real-time transcription. By the end, you will have a production-ready Express.js server that answers calls intelligently and routes them to the right place.

---

## How Inbound Calls Work

When a call arrives on one of your Unbound numbers, the platform fires a `call.initiated` webhook to the URL configured on that phone number. Your server responds with a **voice app** — a JSON document containing an ordered list of commands — that tells Unbound exactly what to do with the call: play audio, gather digits, say text, transfer, hang up, or fetch a new voice app from a URL.

```
Phone rings → Unbound fires call.initiated webhook → Your server returns voice app JSON
                                                          ↓
                                                Unbound executes commands
                                                   (play, gather, say...)
                                                          ↓
                                              Gather result posted to action URL
                                                          ↓
                                                Your server returns next app
```

You can also use `voice.replaceCallApp()` at any time to inject new commands into a live call — useful for pushing updates from your backend asynchronously (e.g., after a CRM lookup completes).

---

## Prerequisites

- Node.js 16+
- An Unbound phone number with a webhook URL configured
- The `@unboundcx/sdk` package installed
- An Express.js server reachable via HTTPS (use [ngrok](https://ngrok.com) for local dev)

---

## 1. Configure Your Phone Number Webhook

Before your server receives calls, set the inbound webhook URL on your phone number. You can do this from the SDK:

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: process.env.UNBOUND_TOKEN });

// Find the number you want to configure
const numbers = await api.phoneNumbers.list();
const myNumber = numbers.find((n) => n.phoneNumber === '+18005551234');

// Attach the webhook
await api.phoneNumbers.update(myNumber.id, {
    voiceWebhookUrl: 'https://your-server.example.com/voice/inbound',
    voiceWebhookMethod: 'POST',
});

console.log('Webhook configured for', myNumber.phoneNumber);
```

Alternatively, configure the URL in the Unbound dashboard under **Phone Numbers → Settings**.

---

## 2. Handle the Webhook: Simple Auto-Attendant

The `call.initiated` event arrives as a POST request. Your handler reads the call payload and returns a voice app JSON. Here is the minimal structure:

```javascript
import express from 'express';

const app = express();
app.use(express.json());

// Respond to every inbound call with a greeting and menu
app.post('/voice/inbound', (req, res) => {
    const { callId, from, to, direction } = req.body;

    console.log(`Inbound call: ${callId} | From: ${from} | To: ${to}`);

    // Return a voice app
    res.json({
        version: '2.0',
        name: 'main-ivr',
        commands: [
            {
                command: 'say',
                text: 'Thank you for calling Acme Corp. Press 1 for Sales, 2 for Support, or 3 for our hours.',
                voice: 'Polly.Joanna',
            },
            {
                command: 'gather',
                numDigits: 1,
                timeout: 8,
                action: 'https://your-server.example.com/voice/menu',
                method: 'POST',
            },
            {
                command: 'say',
                text: 'We did not receive your selection. Please call back and try again. Goodbye.',
                voice: 'Polly.Joanna',
            },
            { command: 'hangup' },
        ],
    });
});

app.listen(3000);
```

**Voice app command reference:**

| Command | Description |
|---|---|
| `say` | Text-to-speech using AWS Polly or a compatible engine |
| `play` | Play a hosted audio file (`.wav`, `.mp3`) |
| `gather` | Collect DTMF digits from the caller |
| `hangup` | End the call |
| `redirect` | Fetch a new voice app from a URL (dynamic routing) |
| `dial` | Transfer to a phone number |

---

## 3. Process DTMF Digits

After the `gather` command collects digits, Unbound posts the result to your `action` URL. Handle it and return the next voice app:

```javascript
app.post('/voice/menu', (req, res) => {
    const { callId, digits, from } = req.body;

    console.log(`Menu selection: ${digits} from ${from} on call ${callId}`);

    switch (digits) {
        case '1':
            // Transfer to Sales queue
            res.json({
                version: '2.0',
                name: 'transfer-sales',
                commands: [
                    {
                        command: 'say',
                        text: 'Connecting you to our Sales team. Please hold.',
                        voice: 'Polly.Joanna',
                    },
                    {
                        command: 'dial',
                        to: '+18005551001',   // Sales DID
                        timeout: 30,
                    },
                ],
            });
            break;

        case '2':
            // Transfer to Support queue
            res.json({
                version: '2.0',
                name: 'transfer-support',
                commands: [
                    {
                        command: 'say',
                        text: 'Connecting you to Support. Your call may be recorded.',
                        voice: 'Polly.Joanna',
                    },
                    {
                        command: 'dial',
                        to: '+18005551002',   // Support DID
                        timeout: 30,
                    },
                ],
            });
            break;

        case '3':
            // Play hours message
            res.json({
                version: '2.0',
                name: 'hours',
                commands: [
                    {
                        command: 'say',
                        text: 'Our hours are Monday through Friday, 8am to 6pm Central time. Thank you for calling Acme.',
                        voice: 'Polly.Joanna',
                    },
                    { command: 'hangup' },
                ],
            });
            break;

        default:
            // Invalid input — replay menu
            res.json({
                version: '2.0',
                name: 'retry-menu',
                commands: [
                    {
                        command: 'say',
                        text: 'That was not a valid selection. Press 1 for Sales, 2 for Support, or 3 for our hours.',
                        voice: 'Polly.Joanna',
                    },
                    {
                        command: 'gather',
                        numDigits: 1,
                        timeout: 8,
                        action: 'https://your-server.example.com/voice/menu',
                        method: 'POST',
                    },
                    { command: 'hangup' },
                ],
            });
    }
});
```

---

## 4. Record Inbound Calls

Start recording when the call answers. Use the SDK's `voice.record()` with the `cdrId` from the webhook payload:

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: process.env.UNBOUND_TOKEN });

app.post('/voice/inbound', async (req, res) => {
    const { callId, cdrId, from, to } = req.body;

    // Kick off recording immediately (non-blocking)
    api.voice.record({
        cdrId,
        action: 'start',
        direction: 'sendrecv',   // Record both caller and agent
    }).catch((err) => console.error('Recording start failed:', err));

    res.json({
        version: '2.0',
        name: 'main-ivr',
        commands: [
            {
                command: 'say',
                text: 'This call may be recorded for quality assurance. Thank you for calling Acme.',
                voice: 'Polly.Joanna',
            },
            {
                command: 'gather',
                numDigits: 1,
                timeout: 8,
                action: 'https://your-server.example.com/voice/menu',
                method: 'POST',
            },
            { command: 'hangup' },
        ],
    });
});
```

Recording options:

| Parameter | Type | Description |
|---|---|---|
| `cdrId` | string | CDR record ID from the `call.initiated` event |
| `callId` | string | Call control ID (alternative to `cdrId`) |
| `action` | string | `'start'`, `'stop'`, `'pause'`, or `'resume'` |
| `direction` | string | `'sendrecv'` (both), `'send'` (outbound only), `'recv'` (inbound only) |

---

## 5. Real-Time Transcription

Start transcription on the inbound audio to power live agent coaching, compliance logging, or AI assist:

```javascript
app.post('/voice/inbound', async (req, res) => {
    const { callId, cdrId, from } = req.body;

    // Start recording
    api.voice.record({
        cdrId,
        action: 'start',
        direction: 'sendrecv',
    }).catch(() => {});

    // Start transcribing — forward transcript text to your webhook
    api.voice.transcribe(
        callId,
        'start',
        'in',   // Transcribe caller's audio
        {
            // Forward each utterance to a webhook URL
            url: 'https://your-server.example.com/voice/transcript',
            method: 'POST',
        },
    ).catch(() => {});

    res.json({
        version: '2.0',
        name: 'main-ivr',
        commands: [
            {
                command: 'say',
                text: 'Thank you for calling. How can I help you today?',
                voice: 'Polly.Joanna',
            },
            {
                command: 'gather',
                numDigits: 1,
                timeout: 6,
                action: 'https://your-server.example.com/voice/menu',
                method: 'POST',
            },
            { command: 'hangup' },
        ],
    });
});

// Receive transcript utterances
app.post('/voice/transcript', (req, res) => {
    const { callId, text, isFinal, confidence } = req.body;
    if (isFinal) {
        console.log(`[${callId}] "${text}" (confidence: ${confidence})`);
        // Store, push to agent UI, or run AI analysis
    }
    res.sendStatus(200);
});
```

---

## 6. Dynamic Routing with `replaceCallApp`

Sometimes you need to decide routing asynchronously — after a database lookup, CRM check, or AI classification. Use `replaceCallApp()` to inject new commands into a live call while it is waiting:

```javascript
app.post('/voice/inbound', async (req, res) => {
    const { callId, cdrId, from } = req.body;

    // Immediately tell the call to play hold music while you look up the caller
    res.json({
        version: '2.0',
        name: 'hold-lookup',
        commands: [
            {
                command: 'say',
                text: 'One moment while we look up your account.',
                voice: 'Polly.Joanna',
            },
            {
                command: 'play',
                file: 'https://assets.example.com/hold-music.wav',
                loop: 3,   // Loop hold music up to 3 times while lookup runs
            },
        ],
    });

    // Run the lookup concurrently
    setImmediate(async () => {
        try {
            const contact = await lookupCallerByPhone(from);
            const route = await getRouteForContact(contact);

            // Replace the hold music with the routing destination
            await api.voice.replaceCallApp({
                callId,
                app: {
                    version: '2.0',
                    name: 'routed',
                    commands: [
                        {
                            command: 'say',
                            text: `Hello ${contact.firstName}, connecting you to your account manager now.`,
                            voice: 'Polly.Joanna',
                        },
                        {
                            command: 'dial',
                            to: route.agentNumber,
                            timeout: 30,
                        },
                    ],
                },
            });
        } catch (err) {
            // Fallback if lookup fails
            await api.voice.replaceCallApp({
                callId,
                app: {
                    version: '2.0',
                    name: 'fallback',
                    commands: [
                        {
                            command: 'say',
                            text: 'We are connecting you to the next available agent.',
                            voice: 'Polly.Joanna',
                        },
                        {
                            command: 'dial',
                            to: '+18005551000',
                            timeout: 30,
                        },
                    ],
                },
            });
        }
    });
});
```

---

## 7. Route to a Task Router Queue

Rather than dialing a static number, route the call into a Task Router queue so it lands on the next available qualified agent:

```javascript
app.post('/voice/inbound', async (req, res) => {
    const { callId, cdrId, from } = req.body;

    // Enqueue the call as a Task Router task
    // The task will be assigned when an eligible worker becomes available
    const task = await api.taskRouter.tasks.create({
        queueId: 'queue-support-tier1',
        attributes: {
            callId,
            cdrId,
            callerNumber: from,
            channel: 'voice',
        },
        priority: 0,
    });

    console.log('Call enqueued as task:', task.id);

    // Tell the call to wait while in the queue
    res.json({
        version: '2.0',
        name: 'queue-hold',
        commands: [
            {
                command: 'say',
                text: 'All agents are currently assisting other customers. Please hold and your call will be answered shortly.',
                voice: 'Polly.Joanna',
            },
            {
                command: 'play',
                file: 'https://assets.example.com/hold-music.wav',
                loop: 20,
            },
        ],
    });
});

// When Task Router assigns a worker, connect them to the caller
// This is handled by your task assignment webhook or subscription
async function connectWorkerToCall(taskId, callId, workerNumber) {
    await api.voice.replaceCallApp({
        callId,
        app: {
            version: '2.0',
            name: 'connect-agent',
            commands: [
                {
                    command: 'say',
                    text: 'An agent is now joining your call.',
                    voice: 'Polly.Joanna',
                },
                {
                    command: 'dial',
                    to: workerNumber,
                    timeout: 30,
                },
            ],
        },
    });

    await api.taskRouter.tasks.update(taskId, { status: 'working' });
}
```

---

## 8. Full Example: Business Hours IVR

A complete inbound handler that checks business hours, routes by department, records the call, and handles missed calls gracefully:

```javascript
import express from 'express';
import SDK from '@unboundcx/sdk';

const app = express();
app.use(express.json());

const api = new SDK({ namespace: process.env.UNBOUND_NAMESPACE, token: process.env.UNBOUND_TOKEN });

// Business hours: Monday–Friday, 8am–6pm Central
function isBusinessHours() {
    const now = new Date();
    // Convert to America/Chicago time
    const ct = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    const day = ct.getDay();   // 0 = Sunday, 6 = Saturday
    const hour = ct.getHours();
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
}

// --- STEP 1: Receive the inbound call ---
app.post('/voice/inbound', async (req, res) => {
    const { callId, cdrId, from, to } = req.body;

    // Start recording immediately (non-blocking)
    api.voice.record({ cdrId, action: 'start', direction: 'sendrecv' })
        .catch((err) => console.error('Recording error:', err.message));

    if (!isBusinessHours()) {
        // After-hours message + voicemail redirect
        return res.json({
            version: '2.0',
            name: 'after-hours',
            commands: [
                {
                    command: 'say',
                    text: 'Thank you for calling Acme Corp. Our office is currently closed. Our hours are Monday through Friday, 8am to 6pm Central time.',
                    voice: 'Polly.Joanna',
                },
                {
                    command: 'say',
                    text: 'Please leave a message and we will call you back on the next business day.',
                    voice: 'Polly.Joanna',
                },
                {
                    command: 'redirect',
                    url: 'https://your-server.example.com/voice/voicemail',
                    method: 'POST',
                },
            ],
        });
    }

    // Business hours: show main menu
    res.json({
        version: '2.0',
        name: 'main-menu',
        commands: [
            {
                command: 'say',
                text: 'Thank you for calling Acme Corp. Press 1 for Sales, 2 for Support, or 0 to speak with an operator.',
                voice: 'Polly.Joanna',
            },
            {
                command: 'gather',
                numDigits: 1,
                timeout: 8,
                action: 'https://your-server.example.com/voice/route',
                method: 'POST',
            },
            {
                command: 'say',
                text: 'We did not receive your selection. Please hold while we connect you to an operator.',
                voice: 'Polly.Joanna',
            },
            {
                command: 'dial',
                to: '+18005551000',   // Operator
                timeout: 30,
            },
        ],
    });
});

// --- STEP 2: Route based on digit ---
app.post('/voice/route', async (req, res) => {
    const { callId, digits, from } = req.body;

    const routes = {
        '1': { label: 'Sales', to: '+18005551001', queue: 'queue-sales' },
        '2': { label: 'Support', to: '+18005551002', queue: 'queue-support' },
        '0': { label: 'Operator', to: '+18005551000', queue: null },
    };

    const route = routes[digits];

    if (!route) {
        // Replay menu on invalid input
        return res.json({
            version: '2.0',
            name: 'invalid-menu',
            commands: [
                {
                    command: 'say',
                    text: 'Invalid selection. Press 1 for Sales, 2 for Support, or 0 for the operator.',
                    voice: 'Polly.Joanna',
                },
                {
                    command: 'gather',
                    numDigits: 1,
                    timeout: 8,
                    action: 'https://your-server.example.com/voice/route',
                    method: 'POST',
                },
                { command: 'hangup' },
            ],
        });
    }

    // Log the routing decision to a CRM note (non-blocking)
    logCallRouting(callId, from, route.label).catch(() => {});

    // Return transfer voice app
    res.json({
        version: '2.0',
        name: `transfer-${route.label.toLowerCase()}`,
        commands: [
            {
                command: 'say',
                text: `Connecting you to ${route.label}. Please hold.`,
                voice: 'Polly.Joanna',
            },
            {
                command: 'dial',
                to: route.to,
                timeout: 30,
                // Fallback if no one answers
                action: 'https://your-server.example.com/voice/missed',
                method: 'POST',
            },
        ],
    });
});

// --- STEP 3: Handle missed / unanswered transfers ---
app.post('/voice/missed', async (req, res) => {
    const { callId, from } = req.body;

    // Log missed call
    console.log(`Missed call from ${from} on ${callId}`);

    res.json({
        version: '2.0',
        name: 'missed-fallback',
        commands: [
            {
                command: 'say',
                text: 'All representatives are currently busy. Please leave a message and we will return your call within 2 hours.',
                voice: 'Polly.Joanna',
            },
            {
                command: 'redirect',
                url: 'https://your-server.example.com/voice/voicemail',
                method: 'POST',
            },
        ],
    });
});

// --- STEP 4: Voicemail redirect ---
app.post('/voice/voicemail', (req, res) => {
    const { callId, from } = req.body;

    res.json({
        version: '2.0',
        name: 'voicemail',
        commands: [
            {
                command: 'say',
                text: 'Please leave your name, number, and a brief message after the tone.',
                voice: 'Polly.Joanna',
            },
            {
                command: 'record',
                maxLength: 120,           // Max 2 minutes
                action: 'https://your-server.example.com/voice/voicemail-saved',
                method: 'POST',
                trim: 'trim-silence',     // Remove silence from start/end
                playBeep: true,
            },
        ],
    });
});

// --- STEP 5: Voicemail saved callback ---
app.post('/voice/voicemail-saved', async (req, res) => {
    const { callId, from, recordingUrl, recordingDuration } = req.body;

    console.log(`Voicemail saved: ${recordingUrl} (${recordingDuration}s) from ${from}`);

    // Save to storage or send notification here
    res.json({
        version: '2.0',
        name: 'voicemail-confirm',
        commands: [
            {
                command: 'say',
                text: 'Your message has been saved. Thank you for calling Acme. Goodbye.',
                voice: 'Polly.Joanna',
            },
            { command: 'hangup' },
        ],
    });
});

// Helper: log call routing to a CRM note
async function logCallRouting(callId, callerNumber, department) {
    // You would look up the contact by phone number first
    // then attach a note to their record
    console.log(`Routing logged: ${callerNumber} → ${department} (callId: ${callId})`);
}

app.listen(3000, () => console.log('IVR server running on :3000'));
```

---

## 9. Handling Transfer Failures

When a `dial` command's target is busy or doesn't answer, Unbound posts to the `action` URL you set on the `dial` command. Handle the fallback gracefully:

```javascript
app.post('/voice/transfer-failed', async (req, res) => {
    const { callId, from, dialStatus } = req.body;
    // dialStatus can be: 'busy', 'no-answer', 'failed', 'canceled'

    console.log(`Transfer failed: ${dialStatus} on call ${callId}`);

    switch (dialStatus) {
        case 'busy':
            return res.json({
                version: '2.0',
                name: 'busy-fallback',
                commands: [
                    {
                        command: 'say',
                        text: 'That line is currently busy. Let me try another agent.',
                        voice: 'Polly.Joanna',
                    },
                    {
                        command: 'dial',
                        to: '+18005551010',   // Backup agent
                        timeout: 30,
                    },
                ],
            });

        case 'no-answer':
            return res.json({
                version: '2.0',
                name: 'no-answer-fallback',
                commands: [
                    {
                        command: 'say',
                        text: 'No one is available to take your call right now. Please leave a message.',
                        voice: 'Polly.Joanna',
                    },
                    {
                        command: 'redirect',
                        url: 'https://your-server.example.com/voice/voicemail',
                        method: 'POST',
                    },
                ],
            });

        default:
            return res.json({
                version: '2.0',
                name: 'error-fallback',
                commands: [
                    {
                        command: 'say',
                        text: 'We encountered a problem. Please call back in a moment.',
                        voice: 'Polly.Joanna',
                    },
                    { command: 'hangup' },
                ],
            });
    }
});
```

---

## 10. Local Development with ngrok

Test your inbound handler locally without deploying:

```bash
# Start your server
node server.js

# In another terminal, expose it via ngrok
ngrok http 3000

# ngrok gives you a URL like:
# https://abc123.ngrok.io
# → set https://abc123.ngrok.io/voice/inbound as your phone number webhook
```

Update the webhook URL:

```javascript
await api.phoneNumbers.update(numberId, {
    voiceWebhookUrl: 'https://abc123.ngrok.io/voice/inbound',
});
```

---

## Webhook Payload Reference

The `call.initiated` POST body contains:

```javascript
{
    event: 'call.initiated',
    callId: 'call_abc123',          // Call control ID for SDK methods
    cdrId: 'cdr_xyz789',            // CDR record ID for recording/lookup
    from: '+12135550100',           // Caller's number (E.164)
    to: '+18005551234',             // Your number that was called (E.164)
    direction: 'inbound',
    status: 'initiated',
    timestamp: '2026-03-30T05:00:00.000Z',
    namespace: 'your-namespace',
}
```

---

## Error Handling

```javascript
import { UnboundError } from '@unboundcx/sdk';

app.post('/voice/inbound', async (req, res) => {
    try {
        const { callId, cdrId, from } = req.body;

        await api.voice.record({ cdrId, action: 'start', direction: 'sendrecv' });

        res.json({ /* voice app */ });
    } catch (err) {
        if (err instanceof UnboundError) {
            console.error(`[${err.statusCode}] Voice API error: ${err.message}`);
        } else {
            console.error('Unexpected error:', err);
        }

        // Always return a valid voice app — even on error — so the call doesn't drop silently
        res.json({
            version: '2.0',
            name: 'error-recovery',
            commands: [
                {
                    command: 'say',
                    text: 'We are experiencing a technical issue. Please try your call again. Goodbye.',
                    voice: 'Polly.Joanna',
                },
                { command: 'hangup' },
            ],
        });
    }
});
```

:::caution Always return a voice app on error
If your server returns a non-200 status or no valid voice app, the platform will hang up the call immediately. Wrap all handlers in `try/catch` and return a fallback voice app with a friendly message and `hangup`.
:::

---

## What's Next

- [Voice API Reference](/api-reference/voice) — complete method and command reference
- [Make an Outbound Call](/guides/make-call) — initiate programmatic outbound calls
- [Task Router Quickstart](/guides/task-router-quickstart) — route calls to qualified agents
- [Real-Time STT Streaming](/guides/stt-streaming) — transcribe calls as they happen
- [Webhooks](/guides/webhooks) — full event payload shapes and signature verification
- [Real-Time Subscriptions](/guides/real-time-subscriptions) — WebSocket alternative to webhooks
