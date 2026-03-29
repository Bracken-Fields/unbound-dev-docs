---
id: webhooks
title: Webhooks
---

# Webhooks

Unbound delivers real-time event notifications to your server via HTTP webhooks. Configure a webhook URL on a phone number, workflow, or subscription, and Unbound will POST to it whenever relevant events occur.

---

## Overview

Webhooks let you react to events asynchronously — a call ends, an SMS is received, a task is assigned — without polling. Unbound POSTs a JSON payload to your configured URL and expects a `2xx` response within **5 seconds**.

**When to use webhooks vs. WebSocket subscriptions:**

| | Webhooks | WebSocket (`subscriptions`) |
|---|---|---|
| Server-side processing | ✅ Best fit | Possible |
| Real-time browser UI | — | ✅ Best fit |
| Zero infrastructure | — | ✅ (SDK manages connection) |
| Guaranteed delivery + retries | ✅ Yes | No |
| Survives server restarts | ✅ Yes | Reconnects |
| Works behind NAT/firewall | ✅ Yes | ✅ Yes |

Use webhooks when your processing happens server-side. Use [`subscriptions.socket`](../api-reference/subscriptions) when you need real-time events in a browser or agent UI.

---

## Configure a Webhook

### On a Phone Number

Attach webhooks to a phone number for inbound voice and SMS events:

```javascript
await api.phoneNumbers.update('number-id', {
    voiceWebHookUrl: 'https://yourapp.com/webhooks/voice',
    messagingWebHookUrl: 'https://yourapp.com/webhooks/sms',
});
```

You can also set these at provisioning time:

```javascript
const number = await api.phoneNumbers.create({
    phoneNumberId: 'dids-available-id',
    voiceWebHookUrl: 'https://yourapp.com/webhooks/voice',
    messagingWebHookUrl: 'https://yourapp.com/webhooks/sms',
});
```

### In a Workflow Item

Use a webhook workflow item to call out to an external system during a workflow execution:

```javascript
await api.workflows.items.create({
    workflowVersionId: 'wf-version-id',
    category: 'integration',
    type: 'webhook',
    settings: {
        url: 'https://yourapp.com/webhooks/workflow',
        method: 'POST',
        headers: {
            'X-Secret': process.env.WORKFLOW_WEBHOOK_SECRET,
            'Content-Type': 'application/json',
        },
        // Optionally map workflow variables into the payload
        body: {
            sessionId: '{{session.id}}',
            callerPhone: '{{session.callerNumber}}',
            queueName: '{{session.queue.name}}',
        },
    },
});
```

Workflow webhooks fire synchronously as the workflow executes — the workflow waits for a `2xx` response before continuing.

### Via Cron/Delivery on Subscriptions

When using `api.subscriptions.socket`, you can also route event delivery to a webhook endpoint as a fallback for offline servers. See [Subscriptions](../api-reference/subscriptions) for details.

---

## Receiving Webhooks

All webhook payloads are sent as `application/json` via `POST`. Your endpoint must:

1. Respond with `HTTP 200` (or any `2xx`) within **5 seconds**
2. Acknowledge receipt immediately; do any heavy processing asynchronously
3. Be **idempotent** — the same event may be delivered more than once

### Express.js Handler

```javascript
import express from 'express';

const app = express();
app.use(express.json());

// ─── Voice webhook ───────────────────────────────────────────────────────────
app.post('/webhooks/voice', async (req, res) => {
    // Verify signature (see Security section below)
    if (!verifySignature(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Acknowledge immediately — never block the response
    res.status(200).json({ received: true });

    // Process asynchronously
    processVoiceEvent(req.body).catch(err => {
        console.error('Voice webhook processing error:', err);
    });
});

// ─── SMS webhook ─────────────────────────────────────────────────────────────
app.post('/webhooks/sms', async (req, res) => {
    if (!verifySignature(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    res.status(200).json({ received: true });

    processMessageEvent(req.body).catch(console.error);
});

app.listen(3000, () => console.log('Webhook server running on :3000'));
```

### Fastify Handler

```javascript
import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    (req, body, done) => done(null, body),
);

app.post('/webhooks/voice', async (request, reply) => {
    const rawBody = request.body;

    // Verify signature against raw buffer
    if (!verifyHmac(rawBody, request.headers['x-unbound-signature'])) {
        return reply.code(401).send({ error: 'Unauthorized' });
    }

    const event = JSON.parse(rawBody.toString());
    reply.code(200).send({ received: true });

    // Async processing
    processVoiceEvent(event).catch(console.error);
});

await app.listen({ port: 3000 });
```

---

## Webhook Event Payloads

### Common Envelope Fields

Every webhook payload includes a standard envelope regardless of event type:

```json
{
    "id": "evt_01HX2YABCDEF",
    "type": "call.started",
    "timestamp": "2024-06-01T14:00:00.000Z",
    "namespace": "acme",
    "version": "1",
    "data": { ... }
}
```

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique event ID — use for deduplication |
| `type` | string | Event type (see tables below) |
| `timestamp` | ISO string | UTC timestamp when the event was emitted |
| `namespace` | string | Namespace the event originated from |
| `version` | string | Payload schema version |
| `data` | object | Event-specific payload (see below) |

---

### Voice Events

#### `call.initiated`

Fired when an outbound call is placed (before it rings).

```json
{
    "id": "evt_01HX2Y001",
    "type": "call.initiated",
    "timestamp": "2024-06-01T14:00:00.000Z",
    "data": {
        "callId": "call-abc123",
        "cdrId": "cdr-abc123",
        "from": "+18005550001",
        "to": "+13175551234",
        "direction": "outbound",
        "voiceChannelId": "vc-xyz",
        "engagementSessionId": "eng-001"
    }
}
```

#### `call.started`

Fired when a call is answered (inbound connected or outbound answered).

```json
{
    "id": "evt_01HX2Y002",
    "type": "call.started",
    "timestamp": "2024-06-01T14:00:05.000Z",
    "data": {
        "callId": "call-abc123",
        "cdrId": "cdr-abc123",
        "from": "+13175551234",
        "to": "+18005550001",
        "direction": "inbound",
        "voiceChannelId": "vc-xyz",
        "callerName": "John Doe",
        "engagementSessionId": "eng-001"
    }
}
```

#### `call.ended`

Fired when a call leg disconnects.

```json
{
    "id": "evt_01HX2Y003",
    "type": "call.ended",
    "timestamp": "2024-06-01T14:04:05.000Z",
    "data": {
        "callId": "call-abc123",
        "cdrId": "cdr-abc123",
        "duration": 240,
        "endReason": "hangup",
        "recordingUrl": "https://storage.unbound.cx/recordings/cdr-abc123.mp3",
        "recordingDuration": 235,
        "engagementSessionId": "eng-001"
    }
}
```

| `endReason` value | Description |
|---|---|
| `hangup` | Normal termination by either party |
| `transfer` | Call was transferred to another destination |
| `voicemail` | Dropped to voicemail |
| `busy` | Destination was busy |
| `no-answer` | Destination didn't answer within timeout |
| `failed` | SIP error or unreachable destination |

#### `call.recording.started` / `call.recording.stopped`

```json
{
    "type": "call.recording.started",
    "data": {
        "callId": "call-abc123",
        "cdrId": "cdr-abc123",
        "direction": "sendrecv",
        "recordingId": "rec-001"
    }
}
```

#### `call.transcription`

Fired periodically during an active transcription session with incremental text.

```json
{
    "type": "call.transcription",
    "data": {
        "callId": "call-abc123",
        "cdrId": "cdr-abc123",
        "voiceChannelId": "vc-xyz",
        "segment": {
            "text": "I'd like to check on my order status",
            "speaker": "customer",
            "isFinal": true,
            "startMs": 2400,
            "endMs": 4200,
            "confidence": 0.94
        }
    }
}
```

---

### Messaging Events

#### `message.received`

Fired when an inbound SMS or MMS is received on a Unbound number.

```json
{
    "id": "evt_01HX2Y010",
    "type": "message.received",
    "data": {
        "id": "msg-def456",
        "from": "+13175551234",
        "to": "+18005550001",
        "body": "Hello, I need help with my order #12345",
        "direction": "inbound",
        "mediaUrls": [
            "https://storage.unbound.cx/media/img-001.jpg"
        ],
        "numSegments": 1,
        "timestamp": "2024-06-01T14:00:00.000Z"
    }
}
```

#### `message.status`

Fired when the delivery status of an outbound message changes.

```json
{
    "id": "evt_01HX2Y011",
    "type": "message.status",
    "data": {
        "id": "msg-def456",
        "status": "delivered",
        "errorCode": null,
        "errorMessage": null,
        "timestamp": "2024-06-01T14:00:05.000Z"
    }
}
```

| `status` | Description |
|---|---|
| `queued` | Message accepted by Unbound, not yet sent |
| `sending` | Being sent to carrier |
| `sent` | Delivered to carrier |
| `delivered` | Carrier confirmed delivery to handset |
| `undelivered` | Carrier could not deliver |
| `failed` | Could not be sent (see `errorCode`) |

#### `email.received`

Fired when an inbound email arrives at a configured inbox.

```json
{
    "type": "email.received",
    "data": {
        "id": "email-ghi789",
        "from": "customer@example.com",
        "to": "support@yourdomain.com",
        "subject": "Order inquiry",
        "bodyText": "Hello, I have a question about...",
        "bodyHtml": "<p>Hello...</p>",
        "attachments": [
            {
                "filename": "invoice.pdf",
                "contentType": "application/pdf",
                "storageId": "file-jkl012"
            }
        ],
        "headers": {
            "Message-ID": "<msg-id@example.com>",
            "Reply-To": "customer@example.com"
        }
    }
}
```

---

### Task Router Events

#### `task.created`

```json
{
    "type": "task.created",
    "data": {
        "taskId": "task-mno345",
        "queueId": "queue-pqr678",
        "queueName": "Technical Support",
        "taskType": "phoneCall",
        "priority": 5,
        "attributes": {
            "callId": "call-abc123",
            "callerPhone": "+13175551234",
            "intent": "order_inquiry"
        },
        "requiredSkills": ["billing", "orders"],
        "engagementSessionId": "eng-001"
    }
}
```

#### `task.assigned`

```json
{
    "type": "task.assigned",
    "data": {
        "taskId": "task-mno345",
        "workerId": "worker-stu901",
        "userId": "usr-vwx234",
        "agentName": "Sarah Chen",
        "queueId": "queue-pqr678",
        "waitDuration": 45,
        "engagementSessionId": "eng-001"
    }
}
```

#### `task.completed`

```json
{
    "type": "task.completed",
    "data": {
        "taskId": "task-mno345",
        "workerId": "worker-stu901",
        "userId": "usr-vwx234",
        "resolution": "resolved",
        "wrapUpDuration": 60,
        "totalDuration": 305,
        "engagementSessionId": "eng-001"
    }
}
```

#### Other Task Router Events

| Event type | Fired when |
|---|---|
| `task.rejected` | Agent rejects the task assignment |
| `task.transferred` | Task is reassigned to a different agent/queue |
| `task.escalated` | Task priority was elevated |
| `task.timeout` | Task exceeded the queue wait timeout |
| `worker.available` | Agent sets status to available |
| `worker.offline` | Agent sets status to offline |
| `worker.queue_login` | Agent logs into a queue |
| `worker.queue_logout` | Agent logs out of a queue |

---

### Workflow Events

#### `workflow.session.started`

```json
{
    "type": "workflow.session.started",
    "data": {
        "sessionId": "wf-sess-abc",
        "workflowId": "wf-001",
        "workflowVersionId": "wfv-001",
        "trigger": "inbound_call",
        "variables": {
            "callerPhone": "+13175551234",
            "queueId": "queue-pqr678"
        }
    }
}
```

#### `workflow.session.completed`

```json
{
    "type": "workflow.session.completed",
    "data": {
        "sessionId": "wf-sess-abc",
        "workflowId": "wf-001",
        "exitReason": "completed",
        "durationMs": 12400,
        "variables": {
            "intent": "billing_question",
            "disposition": "transferred_to_agent"
        }
    }
}
```

---

## Security: Signature Verification

:::danger
Never trust a webhook without verifying it came from Unbound. A simple shared secret in a header is a start, but HMAC signature verification is the recommended approach.
:::

### Simple Shared Secret (Basic)

Configure a secret in your webhook URL or header, then verify it:

```javascript
// Configure webhook with secret header
await api.phoneNumbers.update('number-id', {
    messagingWebHookUrl: 'https://yourapp.com/webhooks/sms',
    // Pass secret in a custom header via workflow webhook settings
});

// Server-side verification
function verifySignature(req) {
    const incomingSecret = req.headers['x-unbound-secret'];
    return incomingSecret === process.env.WEBHOOK_SECRET;
}
```

### HMAC-SHA256 Verification (Recommended)

When Unbound signs payloads with your configured signing key:

```javascript
import crypto from 'crypto';

const SIGNING_KEY = process.env.WEBHOOK_SIGNING_KEY;

/**
 * Verify an Unbound webhook signature.
 * @param {Buffer} rawBody - The raw request body buffer (not parsed)
 * @param {string} signature - Value from X-Unbound-Signature header
 * @param {string} timestamp - Value from X-Unbound-Timestamp header
 */
function verifyHmac(rawBody, signature, timestamp) {
    if (!signature || !timestamp) return false;

    // Reject requests older than 5 minutes to prevent replay attacks
    const requestTime = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - requestTime) > 300) {
        console.warn('Webhook timestamp too old — possible replay attack');
        return false;
    }

    // Compute expected signature
    const signedPayload = `${timestamp}.${rawBody.toString()}`;
    const expected = crypto
        .createHmac('sha256', SIGNING_KEY)
        .update(signedPayload)
        .digest('hex');

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(`sha256=${expected}`),
    );
}

// Express middleware to capture raw body
app.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    }),
);

app.post('/webhooks/voice', (req, res) => {
    const signature = req.headers['x-unbound-signature'];
    const timestamp = req.headers['x-unbound-timestamp'];

    if (!verifyHmac(req.rawBody, signature, timestamp)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    res.json({ received: true });
    processVoiceEvent(req.body).catch(console.error);
});
```

:::tip
**Always use the raw request body** for signature verification — `JSON.parse()` / `JSON.stringify()` roundtrips can alter whitespace and break the HMAC. Capture it with a `verify` function in Express or `addContentTypeParser` in Fastify.
:::

---

## Idempotency

Unbound may deliver the same event more than once (e.g., after a delivery timeout + retry). Make your handlers idempotent:

### In-Memory (Development Only)

```javascript
const processedEvents = new Set();

function isAlreadyProcessed(eventId) {
    if (processedEvents.has(eventId)) return true;
    processedEvents.add(eventId);
    return false;
}

app.post('/webhooks/voice', (req, res) => {
    const { id, type, data } = req.body;

    if (isAlreadyProcessed(id)) {
        return res.json({ duplicate: true });
    }

    res.json({ received: true });
    processVoiceEvent({ id, type, data }).catch(console.error);
});
```

### Redis (Production)

```javascript
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

async function isAlreadyProcessed(eventId) {
    // SET NX with 24-hour TTL — atomic, no race conditions
    const key = `webhook:processed:${eventId}`;
    const result = await redis.set(key, '1', { NX: true, EX: 86400 });
    return result === null; // null = key already existed
}

app.post('/webhooks/voice', async (req, res) => {
    const { id, type, data } = req.body;

    if (await isAlreadyProcessed(id)) {
        console.log(`Duplicate event skipped: ${id}`);
        return res.json({ duplicate: true });
    }

    res.json({ received: true });
    processVoiceEvent({ id, type, data }).catch(console.error);
});
```

### Database (Postgres)

```javascript
// Assumes a table: webhook_events(event_id TEXT PRIMARY KEY, processed_at TIMESTAMPTZ)
import { pool } from './db.js';

async function markProcessed(eventId) {
    try {
        await pool.query(
            `INSERT INTO webhook_events (event_id, processed_at)
             VALUES ($1, NOW())
             ON CONFLICT (event_id) DO NOTHING
             RETURNING event_id`,
            [eventId],
        );
        return true; // inserted = first time
    } catch {
        return false; // conflict = already processed
    }
}
```

---

## Retry Behavior

If your endpoint returns a non-`2xx` status or times out after 5 seconds, Unbound retries the delivery with exponential backoff:

| Attempt | Delay |
|---|---|
| 1 | Immediate |
| 2 | 30 seconds |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |

After 5 failed attempts the event is **dropped**. Check your webhook endpoint health regularly.

:::warning
If your handler takes more than ~4 seconds, return `200` immediately and do the work asynchronously. A slow response counts as a timeout and triggers retries.
:::

---

## Async Processing Patterns

### Background Queue (Bull/BullMQ)

Don't block the webhook handler with database writes, API calls, or ML inference:

```javascript
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL);
const eventQueue = new Queue('webhook-events', { connection });

app.post('/webhooks/voice', async (req, res) => {
    if (!verifySignature(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id, type, data } = req.body;

    // Enqueue for async processing — returns in < 10ms
    await eventQueue.add(type, { id, type, data }, {
        jobId: id,          // deduplicates by event ID
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
    });

    res.json({ received: true });
});

// Worker (separate process)
import { Worker } from 'bullmq';

const worker = new Worker('webhook-events', async (job) => {
    const { id, type, data } = job.data;

    switch (type) {
        case 'call.ended':
            await createCallSummaryNote(data);
            await updateCrmRecord(data);
            break;
        case 'message.received':
            await autoRouteToQueue(data);
            break;
        case 'task.completed':
            await sendSatisfactionSurvey(data);
            break;
    }
}, { connection });
```

### Event Router Pattern

Centralize dispatch across event types:

```javascript
const handlers = {
    'call.started': handleCallStarted,
    'call.ended': handleCallEnded,
    'call.transcription': handleTranscriptionSegment,
    'message.received': handleInboundSms,
    'message.status': handleDeliveryStatus,
    'task.created': handleNewTask,
    'task.assigned': handleTaskAssigned,
    'task.completed': handleTaskCompleted,
};

app.post('/webhooks/events', async (req, res) => {
    if (!verifySignature(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({ received: true });

    const { id, type, data } = req.body;
    const handler = handlers[type];

    if (handler) {
        handler({ id, type, data }).catch(err => {
            console.error(`Error handling ${type} (${id}):`, err);
        });
    } else {
        console.warn(`No handler for event type: ${type}`);
    }
});
```

---

## Local Development with ngrok

Webhooks require a public URL. During development, use [ngrok](https://ngrok.com) to expose your local server:

```bash
# Install ngrok
brew install ngrok  # macOS
# or: npm install -g ngrok

# Start your dev server
node server.js  # running on :3000

# Expose it publicly
ngrok http 3000
```

ngrok outputs a URL like `https://abc123.ngrok.io`. Use that as your webhook URL:

```javascript
await api.phoneNumbers.update('number-id', {
    messagingWebHookUrl: 'https://abc123.ngrok.io/webhooks/sms',
    voiceWebHookUrl: 'https://abc123.ngrok.io/webhooks/voice',
});
```

ngrok also provides a **web inspector** at `http://localhost:4040` where you can replay previous requests — invaluable for debugging payload shapes without making real calls.

### Alternatives to ngrok

| Tool | Notes |
|---|---|
| [ngrok](https://ngrok.com) | Easiest setup, free tier available |
| [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) | Free, no rate limits |
| [localtunnel](https://github.com/localtunnel/localtunnel) | Open source |
| [Tailscale Funnel](https://tailscale.com/kb/1223/funnel) | If you use Tailscale |

---

## Testing Webhooks

### Unit Test the Handler

Test your handler logic without running a real server:

```javascript
import { describe, it, expect, vi } from 'vitest';
import { app } from './server.js';
import request from 'supertest';
import crypto from 'crypto';

function makeSignature(body, secret, timestamp) {
    const signed = `${timestamp}.${JSON.stringify(body)}`;
    const hmac = crypto
        .createHmac('sha256', secret)
        .update(signed)
        .digest('hex');
    return `sha256=${hmac}`;
}

describe('Voice webhook handler', () => {
    it('accepts a valid call.ended event', async () => {
        const body = {
            id: 'evt_test_001',
            type: 'call.ended',
            timestamp: new Date().toISOString(),
            data: {
                callId: 'call-test',
                duration: 120,
                endReason: 'hangup',
            },
        };

        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signature = makeSignature(body, process.env.WEBHOOK_SIGNING_KEY, timestamp);

        const res = await request(app)
            .post('/webhooks/voice')
            .set('X-Unbound-Signature', signature)
            .set('X-Unbound-Timestamp', timestamp)
            .send(body);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ received: true });
    });

    it('rejects missing signature', async () => {
        const res = await request(app)
            .post('/webhooks/voice')
            .send({ id: 'evt_test_002', type: 'call.ended', data: {} });

        expect(res.status).toBe(401);
    });
});
```

### Replay from ngrok Inspector

The ngrok web inspector at `http://localhost:4040/inspect/http` lets you replay any captured request. After receiving a real event:

1. Find the request in the inspector
2. Click **Replay** to resend it to your local handler
3. Adjust the body as needed to test edge cases

---

## Production Checklist

Before going live with webhooks in production:

- [ ] **HTTPS only** — never accept webhook callbacks over plain HTTP
- [ ] **Verify signatures** on every request — reject anything without a valid signature
- [ ] **Respond in < 5 seconds** — acknowledge first, process async
- [ ] **Idempotent handlers** — use Redis/DB deduplication with the event `id`
- [ ] **Monitor 4xx/5xx webhook failures** — set up alerts if your endpoint starts returning errors
- [ ] **Dead letter queue** — capture events that fail all retries for manual replay
- [ ] **Structured logging** — log `event.id`, `event.type`, and processing duration for every event
- [ ] **Health check endpoint** — expose `/health` so load balancers don't send webhook traffic to unhealthy instances
- [ ] **Test replay** — confirm your handler behaves correctly when the same event is received twice

---

## Common Patterns

### Pattern 1 — Inbound SMS Auto-Responder

```javascript
app.post('/webhooks/sms', async (req, res) => {
    if (!verifySignature(req)) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ received: true });

    const { id, type, data } = req.body;
    if (type !== 'message.received') return;

    const { from, to, body: messageBody } = data;

    // Auto-reply with acknowledgment
    await api.messaging.sms.send({
        from: to,   // the Unbound number that received it
        to: from,   // reply to the sender
        message: `Thanks for reaching out! We'll get back to you shortly. Ref: ${id.slice(-6)}`,
    });

    // Create a task for agent follow-up
    await api.taskRouter.task.create({
        queueId: process.env.SMS_QUEUE_ID,
        taskType: 'sms',
        attributes: {
            customerPhone: from,
            messageBody,
            channel: 'sms',
        },
    });
});
```

---

### Pattern 2 — Post-Call Summary Note

Automatically create a structured note after every call ends:

```javascript
app.post('/webhooks/voice', async (req, res) => {
    if (!verifySignature(req)) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ received: true });

    const { type, data } = req.body;
    if (type !== 'call.ended') return;

    const { cdrId, duration, endReason, recordingUrl, engagementSessionId } = data;

    // Look up the engagement to find the contact
    const engagement = engagementSessionId
        ? await api.objects.byId({ object: 'engagements', id: engagementSessionId })
        : null;

    if (engagement?.contactId) {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        await api.notes.create({
            objectId: engagement.contactId,
            objectType: 'contacts',
            content: `<h3>Call Summary</h3>
                <p><strong>Duration:</strong> ${minutes}m ${seconds}s</p>
                <p><strong>End reason:</strong> ${endReason}</p>
                ${recordingUrl ? `<p><strong>Recording:</strong> <a href="${recordingUrl}">Listen</a></p>` : ''}
                <p><strong>CDR:</strong> ${cdrId}</p>`,
        });
    }
});
```

---

### Pattern 3 — Real-Time Call Transcription Relay

Forward live transcription segments to a CRM or AI system:

```javascript
app.post('/webhooks/transcription', async (req, res) => {
    if (!verifySignature(req)) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ received: true });

    const { type, data } = req.body;
    if (type !== 'call.transcription') return;

    const { callId, segment } = data;
    if (!segment.isFinal) return;  // only process final, committed segments

    // Push to AI for intent detection
    if (segment.speaker === 'customer') {
        const intent = await detectIntent(segment.text);

        if (intent === 'wants_to_cancel') {
            // Surface a retention script to the agent via subscription event
            await notifyAgent(callId, {
                alert: 'retention',
                suggestedResponse: 'I can offer you a 20% discount to stay...',
            });
        }
    }

    // Append to running transcript in your CRM
    await appendToTranscript(callId, segment);
});
```

---

### Pattern 4 — Task Completed → Trigger Survey

Automatically send a satisfaction survey when a support task completes:

```javascript
app.post('/webhooks/task-router', async (req, res) => {
    if (!verifySignature(req)) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ received: true });

    const { type, data } = req.body;
    if (type !== 'task.completed') return;
    if (data.resolution === 'abandoned') return;  // skip abandoned tasks

    const { engagementSessionId, totalDuration } = data;

    // Look up the customer phone from the engagement
    const engagement = await api.objects.byId({
        object: 'engagements',
        id: engagementSessionId,
    });

    if (engagement?.customerPhone) {
        // Send SMS survey after a short delay
        setTimeout(async () => {
            await api.messaging.sms.send({
                from: process.env.SURVEY_NUMBER,
                to: engagement.customerPhone,
                message: `Hi! We hope we helped today. How was your experience? Reply 1–5 (5=excellent). Ref: ${engagementSessionId.slice(-6)}`,
            });
        }, 60_000);  // 1 minute delay
    }
});
```

---

### Pattern 5 — Workflow Webhook: Enrich with CRM Data

In a workflow item, call out to your CRM to enrich the session before routing:

```javascript
// This endpoint is called by a Workflow webhook item
app.post('/webhooks/workflow/enrich', async (req, res) => {
    const { callerPhone, sessionId } = req.body;

    try {
        // Look up caller in your CRM
        const contact = await lookupCrmByPhone(callerPhone);

        if (!contact) {
            return res.json({
                tier: 'standard',
                language: 'en',
                intent: 'unknown',
            });
        }

        // Return enriched variables back to the workflow
        res.json({
            contactId: contact.id,
            contactName: contact.name,
            tier: contact.subscriptionTier,     // 'vip' | 'premium' | 'standard'
            language: contact.preferredLanguage,
            openTickets: contact.openTicketCount,
            lastContactDays: contact.daysSinceLastContact,
        });
    } catch (err) {
        console.error('CRM enrichment failed:', err);
        // Return safe defaults so workflow continues
        res.json({ tier: 'standard', language: 'en' });
    }
});
```

The workflow uses the returned fields as session variables to make routing decisions (e.g., direct VIP callers to a priority queue).

---

## Related

- [Subscriptions (WebSocket)](../api-reference/subscriptions) — real-time events in browser / agent UIs
- [Voice API](../api-reference/voice) — outbound calls, recording, transcription
- [Messaging API](../api-reference/messaging) — SMS, MMS, and email
- [Task Router API](../api-reference/task-router) — queue and agent management
- [Workflows API](../api-reference/workflows) — IVR and automation flows
