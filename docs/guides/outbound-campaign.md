---
id: outbound-campaign
title: Build an Outbound Contact Center Campaign
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Build an Outbound Contact Center Campaign

This guide walks through building a production-grade outbound calling campaign from scratch. You'll combine the Voice API, Task Router, Objects (for contact and CDR data), AI (for transcription and sentiment), and SMS (for follow-up) into a complete, end-to-end campaign system.

By the end you'll have:
- A contact list loaded from your CRM
- An agent pool with queue-based distribution
- Automatic call placement with live transcription
- Post-call AI summary, sentiment scoring, and disposition capture
- SMS follow-up triggered by call outcome

---

## Architecture Overview

```
contacts table (Objects)
        │
        ▼
Campaign loop (your app)
        │
  api.voice.call() ──► Unbound SIP ──► Customer phone
        │                                    │
        │                                    ▼
        │                          Voice App (IVR / agent)
        │
  Task Router ──► Available agent ──► Accept task
        │
  ai.stt.stream() ──► Live transcript + sentiment
        │
  Post-call:
    - task.wrapUp() → task.complete()
    - objects.updateById() → write CDR + disposition
    - ai.generative.chat() → generate summary note
    - messaging.sms.send() → follow-up SMS
```

---

## Prerequisites

- Node.js 18+
- An Unbound namespace with at least one provisioned DID
- At least one agent user account in your namespace
- Task Router queue set up with agents logged in
- Contacts stored in an `objects` table (see [Schema Bootstrap](#1-bootstrap-the-schema) below)

---

## Install the SDK

```bash
npm install @unboundcx/sdk
```

---

## 1. Bootstrap the Schema

Before making calls, ensure your contacts table has the right shape. Run this **once** during provisioning:

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: process.env.UNBOUND_TOKEN });

async function bootstrapSchema() {
    const objects = await api.objects.list();
    const existing = objects.map(o => o.name);

    // Create contacts object if it doesn't exist
    if (!existing.includes('contacts')) {
        await api.objects.createObject({ name: 'contacts' });
        console.log('Created contacts object');
    }

    // Describe current columns
    const schema = await api.objects.describe('contacts');
    const existingCols = schema.columns.map(c => c.name);

    const requiredColumns = [
        { columnName: 'firstName',      type: 'text' },
        { columnName: 'lastName',       type: 'text' },
        { columnName: 'phone',          type: 'text' },
        { columnName: 'email',          type: 'text' },
        { columnName: 'campaignStatus', type: 'text' },   // 'pending' | 'calling' | 'completed' | 'failed' | 'no-answer'
        { columnName: 'disposition',    type: 'text' },   // 'interested' | 'not-interested' | 'callback' | 'dnc'
        { columnName: 'callAttempts',   type: 'number' },
        { columnName: 'lastCalledAt',   type: 'date' },
        { columnName: 'callSummary',    type: 'text' },
        { columnName: 'sentimentScore', type: 'number' },
        { columnName: 'followUpSent',   type: 'boolean' },
    ];

    for (const col of requiredColumns) {
        if (!existingCols.includes(col.columnName)) {
            await api.objects.createColumn({
                objectName: 'contacts',
                ...col,
            });
            console.log(`Created column: contacts.${col.columnName}`);
        }
    }

    console.log('Schema bootstrap complete');
}

await bootstrapSchema();
```

---

## 2. Load the Contact List

Import contacts from a CSV or your existing CRM. This example reads from a CSV and upserts into the objects table:

```javascript
import { parse } from 'csv-parse/sync';
import fs from 'fs';

async function importContacts(csvPath) {
    const raw = fs.readFileSync(csvPath, 'utf-8');
    const rows = parse(raw, { columns: true, skip_empty_lines: true });

    console.log(`Importing ${rows.length} contacts...`);
    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
        // Normalize phone to E.164
        const phone = normalizePhone(row.phone);
        if (!phone) {
            console.warn(`Skipping invalid phone: ${row.phone}`);
            skipped++;
            continue;
        }

        // Check if contact already exists
        const existing = await api.objects.query({
            object: 'contacts',
            where: { phone },
            select: ['id', 'campaignStatus'],
            limit: 1,
        });

        if (existing.data.length > 0) {
            // Skip already-processed contacts
            if (['completed', 'dnc'].includes(existing.data[0].campaignStatus)) {
                skipped++;
                continue;
            }
        } else {
            // Create new contact
            await api.objects.create({
                object: 'contacts',
                data: {
                    firstName:      row.firstName || '',
                    lastName:       row.lastName || '',
                    phone,
                    email:          row.email || '',
                    campaignStatus: 'pending',
                    callAttempts:   0,
                    followUpSent:   false,
                },
            });
            imported++;
        }
    }

    console.log(`Import complete: ${imported} imported, ${skipped} skipped`);
}

function normalizePhone(raw) {
    // Strip everything but digits
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits[0] === '1') return `+${digits}`;
    return null;
}

await importContacts('./contacts.csv');
```

---

## 3. Create the Campaign Loop

The campaign loop pulls pending contacts, places calls, and tracks state. Use a controlled concurrency pattern to stay within rate limits:

```javascript
const CONCURRENT_CALLS = 5;       // Max simultaneous outbound calls
const MAX_ATTEMPTS     = 3;       // Retry no-answers up to 3x
const FROM_NUMBER      = '+18005551234';  // Your Unbound DID
const QUEUE_ID         = 'your-queue-id'; // Task Router queue

class CampaignRunner {
    constructor(api) {
        this.api = api;
        this.activeCalls = new Map();  // callId → contactId
        this.running = false;
    }

    async start() {
        this.running = true;
        console.log('Campaign started');

        while (this.running) {
            // Backfill up to CONCURRENT_CALLS active calls
            const slots = CONCURRENT_CALLS - this.activeCalls.size;

            if (slots > 0) {
                const contacts = await this.fetchPendingContacts(slots);

                if (contacts.length === 0 && this.activeCalls.size === 0) {
                    console.log('No more pending contacts — campaign complete');
                    this.running = false;
                    break;
                }

                for (const contact of contacts) {
                    await this.dialContact(contact);
                }
            }

            // Poll every 5 seconds
            await sleep(5000);
        }
    }

    async fetchPendingContacts(limit) {
        const result = await this.api.objects.query({
            object: 'contacts',
            where: {
                campaignStatus: 'pending',
                callAttempts: { $lt: MAX_ATTEMPTS },
            },
            orderBy: 'callAttempts',
            orderDirection: 'asc',
            limit,
            select: ['id', 'firstName', 'lastName', 'phone', 'callAttempts'],
        });
        return result.data;
    }

    async dialContact(contact) {
        // Mark as 'calling' to prevent double-dialing
        await this.api.objects.updateById({
            object: 'contacts',
            id: contact.id,
            data: {
                campaignStatus: 'calling',
                lastCalledAt: new Date().toISOString(),
            },
        });

        try {
            const call = await this.api.voice.call({
                from: FROM_NUMBER,
                to:   contact.phone,
                app: {
                    type: 'queue',
                    queueId: QUEUE_ID,
                    timeout: 30,     // Ring for 30 seconds before treating as no-answer
                },
                record: {
                    enabled:   true,
                    stereo:    true,
                    direction: 'both',
                },
            });

            console.log(`Dialing ${contact.phone} → callId: ${call.id}`);
            this.activeCalls.set(call.id, contact.id);

            // Monitor this call in the background
            this.monitorCall(call.id, contact).catch(err => {
                console.error(`Monitor error for ${call.id}:`, err);
            });

        } catch (err) {
            console.error(`Failed to dial ${contact.phone}:`, err.message);

            // Revert status and increment attempts
            await this.api.objects.updateById({
                object: 'contacts',
                id: contact.id,
                data: {
                    campaignStatus: 'pending',
                    callAttempts: (contact.callAttempts || 0) + 1,
                },
            });
        }
    }

    async monitorCall(callId, contact) {
        // Use webhook/subscription in production — here we poll for simplicity
        const POLL_INTERVAL = 3000;
        const TIMEOUT_MS    = 300_000;  // 5-minute hard timeout
        const start = Date.now();

        while (Date.now() - start < TIMEOUT_MS) {
            await sleep(POLL_INTERVAL);

            // CDR status is updated by the webhook handler
            const updated = await this.api.objects.query({
                object: 'contacts',
                where: { id: contact.id },
                select: ['campaignStatus', 'callAttempts'],
                limit: 1,
            });

            const status = updated.data[0]?.campaignStatus;

            if (status !== 'calling') {
                // Webhook handler already processed the completion
                this.activeCalls.delete(callId);
                return;
            }
        }

        // Timed out — treat as failed
        console.warn(`Call ${callId} timed out`);
        await this.handleCallOutcome(callId, contact.id, 'timeout', null);
        this.activeCalls.delete(callId);
    }

    async stop() {
        this.running = false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## 4. Handle Call Completion via Webhook

Set up a webhook endpoint to receive call events. This fires when calls are answered, ended, or fail:

```javascript
import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// Verify HMAC signature to reject forged webhooks
function verifySignature(req, secret) {
    const signature = req.headers['x-unbound-signature'];
    if (!signature) return false;
    const expected = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expected, 'hex'),
    );
}

app.post('/webhooks/call', async (req, res) => {
    if (!verifySignature(req, process.env.UNBOUND_WEBHOOK_SECRET)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    // Acknowledge immediately — process async
    res.json({ received: true });

    const event = req.body;

    try {
        switch (event.type) {
            case 'call.answered':
                await handleCallAnswered(event);
                break;

            case 'call.ended':
                await handleCallEnded(event);
                break;

            case 'call.failed':
            case 'call.no-answer':
                await handleCallFailed(event);
                break;

            default:
                // Ignore other event types
                break;
        }
    } catch (err) {
        console.error(`Webhook processing error for ${event.type}:`, err);
    }
});

async function handleCallAnswered(event) {
    const { callId, from, to } = event;
    console.log(`Call answered: ${callId}`);

    // Start real-time transcription on answer
    const session = await api.ai.stt.stream({
        sipCallId: callId,
        model:     'nova-2',
        language:  'en-US',
        side:      'both',   // Transcribe both agent and customer
    });

    console.log(`Transcription session: ${session.sessionId}`);
}

async function handleCallEnded(event) {
    const { callId, cdrId, duration, from, to } = event;

    // Find the associated contact
    const contact = await findContactByPhone(to);
    if (!contact) {
        console.warn(`No contact found for ${to}`);
        return;
    }

    // Process the completed call
    await processCompletedCall({
        callId,
        cdrId,
        contactId: contact.id,
        contact,
        duration,
    });
}

async function handleCallFailed(event) {
    const { callId, from, to, reason } = event;

    const contact = await findContactByPhone(to);
    if (!contact) return;

    const isNoAnswer = ['no-answer', 'timeout', 'busy'].includes(reason);

    await api.objects.updateById({
        object: 'contacts',
        id: contact.id,
        data: {
            campaignStatus: isNoAnswer ? 'pending' : 'failed',
            callAttempts: (contact.callAttempts || 0) + 1,
        },
    });

    console.log(`Call ${reason} for ${to} — attempt ${contact.callAttempts + 1}`);
}

async function findContactByPhone(phone) {
    const result = await api.objects.query({
        object: 'contacts',
        where: { phone, campaignStatus: 'calling' },
        limit: 1,
    });
    return result.data[0] || null;
}

app.listen(3001, () => console.log('Webhook server on :3001'));
```

---

## 5. Process the Completed Call

After a call ends, run the full post-call pipeline — fetch the transcript, generate an AI summary, score sentiment, and update the contact record:

```javascript
async function processCompletedCall({ callId, cdrId, contactId, contact, duration }) {
    console.log(`Processing completed call ${callId} (${duration}s)`);

    let summary = null;
    let sentimentScore = null;
    let transcript = null;

    // 1. Fetch the transcript (may not be ready immediately — retry)
    try {
        transcript = await fetchTranscriptWithRetry(callId);
    } catch (err) {
        console.warn(`Transcript unavailable for ${callId}:`, err.message);
    }

    // 2. Generate AI summary and extract disposition
    if (transcript) {
        try {
            const aiResult = await api.ai.generative.chat({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are a call center analyst. Analyze the following call transcript and return a JSON object with:
{
  "summary": "2-3 sentence summary of the call",
  "disposition": "interested" | "not-interested" | "callback" | "dnc" | "no-contact",
  "sentimentScore": 0-100,
  "callbackDate": "ISO date string if callback requested, else null",
  "keyPoints": ["bullet 1", "bullet 2"]
}
Only return valid JSON.`,
                    },
                    {
                        role: 'user',
                        content: `Call transcript:\n\n${transcript.text}`,
                    },
                ],
            });

            const parsed = JSON.parse(aiResult.choices[0].message.content);
            summary        = parsed.summary;
            sentimentScore = parsed.sentimentScore;

            // Update contact with AI analysis
            await api.objects.updateById({
                object: 'contacts',
                id: contactId,
                data: {
                    campaignStatus: 'completed',
                    disposition:    parsed.disposition,
                    callSummary:    summary,
                    sentimentScore,
                    callAttempts:   (contact.callAttempts || 0) + 1,
                },
            });

            console.log(`Contact ${contactId} → disposition: ${parsed.disposition}, sentiment: ${sentimentScore}`);

            // Trigger follow-up for interested contacts
            if (parsed.disposition === 'interested') {
                await sendFollowUpSms(contact, summary);
            }

        } catch (err) {
            console.error(`AI analysis failed for ${callId}:`, err.message);

            // Fallback: mark completed without AI data
            await api.objects.updateById({
                object: 'contacts',
                id: contactId,
                data: {
                    campaignStatus: 'completed',
                    callAttempts: (contact.callAttempts || 0) + 1,
                },
            });
        }
    } else {
        // No transcript — mark completed
        await api.objects.updateById({
            object: 'contacts',
            id: contactId,
            data: {
                campaignStatus: 'completed',
                callAttempts: (contact.callAttempts || 0) + 1,
            },
        });
    }
}

async function fetchTranscriptWithRetry(callId, maxAttempts = 5, delayMs = 3000) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            // List transcriptions for this call's STT session
            const transcripts = await api.ai.stt.list({
                sipCallId: callId,
                limit: 1,
            });

            if (transcripts.data.length > 0 && transcripts.data[0].status === 'completed') {
                const full = await api.ai.stt.get(transcripts.data[0].id, {
                    include: ['utterances'],
                });
                return full;
            }

            if (attempt < maxAttempts - 1) {
                await sleep(delayMs * (attempt + 1));  // Exponential backoff
            }
        } catch (err) {
            if (attempt === maxAttempts - 1) throw err;
            await sleep(delayMs);
        }
    }

    throw new Error(`Transcript not ready after ${maxAttempts} attempts`);
}
```

---

## 6. Send Follow-Up SMS

For contacts who expressed interest, send a follow-up SMS with a personalized message:

```javascript
async function sendFollowUpSms(contact, callSummary) {
    // Don't send twice
    if (contact.followUpSent) return;

    const message = `Hi ${contact.firstName}! Thanks for chatting with us today. ` +
        `As promised, here's how to get started: https://yourapp.com/get-started ` +
        `Reply STOP to opt out.`;

    try {
        const sms = await api.messaging.sms.send({
            from: FROM_NUMBER,
            to:   contact.phone,
            message,
        });

        await api.objects.updateById({
            object: 'contacts',
            id: contact.id,
            data: { followUpSent: true },
        });

        console.log(`Follow-up SMS sent to ${contact.phone}: ${sms.id}`);

    } catch (err) {
        console.error(`Failed to send follow-up SMS to ${contact.phone}:`, err.message);
    }
}
```

---

## 7. Agent-Side Integration

In a human-agent queue, agents need to accept tasks and see call details. This class wraps the agent's session lifecycle:

```javascript
class AgentSession {
    constructor(api, userId) {
        this.api    = api;
        this.userId = userId;
        this.worker = null;
    }

    async goOnline() {
        // Create worker record if it doesn't exist
        try {
            const result = await this.api.taskRouter.worker.create({ userId: this.userId });
            this.worker = result;
        } catch (err) {
            if (!err.message?.includes('already exists')) throw err;
            const result = await this.api.taskRouter.worker.get({ userId: this.userId });
            this.worker = result;
        }

        // Log into auto-login queues
        await this.api.taskRouter.worker.queueAutoLogin({ userId: this.userId });

        // Set available to start receiving tasks
        await this.api.taskRouter.worker.setAvailable({ userId: this.userId });

        console.log(`Agent ${this.userId} is online`);
    }

    async acceptTask(taskId) {
        const result = await this.api.taskRouter.task.accept({
            taskId,
            userId: this.userId,
        });

        console.log(`Agent ${this.userId} accepted task ${taskId}`);
        return result;
    }

    async completeTask(taskId, disposition, summary) {
        // Move to wrap-up
        await this.api.taskRouter.task.wrapUp({ taskId });

        // Record disposition and summary
        await this.api.taskRouter.task.update({
            taskId,
            disposition,
            summary,
        });

        // Complete the task
        await this.api.taskRouter.task.complete({ taskId });

        console.log(`Task ${taskId} completed: ${disposition}`);
    }

    async goOffline() {
        await this.api.taskRouter.worker.queueLogoutAll({ userId: this.userId });
        await this.api.taskRouter.worker.setOffline({ userId: this.userId });
        console.log(`Agent ${this.userId} is offline`);
    }
}
```

---

## 8. Real-Time Supervisor Dashboard

Subscribe to Task Router metrics to monitor the campaign as it runs:

```javascript
async function startSupervisorDashboard() {
    // Get a WebSocket connection
    const conn = await api.subscriptions.socket.getConnection();

    // Subscribe to task router events
    const sub = await api.subscriptions.socket.create(conn.sessionId, {
        channel: 'taskRouter',
    });

    console.log('Supervisor dashboard active. Monitoring task router...');

    // Metrics poll — every 30 seconds
    setInterval(async () => {
        const metrics = await api.taskRouter.metrics.getCurrent({
            period: '5min',
            metricType: 'all',
        });

        const { queue, worker, task } = metrics.metrics;

        console.log('\n── Campaign Metrics (last 5 min) ──');
        console.log(`  Queue:   ${queue.tasksWaiting} waiting  |  ${queue.tasksConnected} connected  |  avg wait ${queue.avgWaitTime.toFixed(1)}s`);
        console.log(`  Workers: ${worker.available} available  |  ${worker.busy} busy  |  ${worker.offline} offline`);
        console.log(`  Tasks:   ${task.completed} completed  |  ${task.abandoned} abandoned`);

        // Alert if wait time is too high
        if (queue.avgWaitTime > 60) {
            console.warn('⚠️  Average wait time exceeds 60s — consider adding agents');
        }

    }, 30_000);
}
```

---

## 9. Campaign Analytics Report

After the campaign completes (or at any point during), generate a summary using UOQL:

```javascript
async function generateCampaignReport() {
    // Disposition breakdown
    const dispositions = await api.objects.uoql({
        query: `
            SELECT disposition, COUNT(*) as count
            FROM contacts
            WHERE campaignStatus = 'completed'
            GROUP BY disposition
            ORDER BY count DESC
        `,
    });

    console.log('\n── Campaign Disposition Breakdown ──');
    for (const row of dispositions.data) {
        console.log(`  ${row.disposition || 'unknown'}: ${row.count}`);
    }

    // Sentiment distribution
    const sentiment = await api.objects.uoql({
        query: `
            SELECT
                COUNT(*) as total,
                AVG(sentimentScore) as avgSentiment,
                MIN(sentimentScore) as minSentiment,
                MAX(sentimentScore) as maxSentiment,
                SUM(CASE WHEN sentimentScore >= 70 THEN 1 ELSE 0 END) as positive,
                SUM(CASE WHEN sentimentScore < 40 THEN 1 ELSE 0 END) as negative
            FROM contacts
            WHERE campaignStatus = 'completed'
              AND sentimentScore IS NOT NULL
        `,
    });

    const s = sentiment.data[0];
    console.log('\n── Sentiment Analysis ──');
    console.log(`  Average:  ${s.avgSentiment?.toFixed(1) ?? 'N/A'}`);
    console.log(`  Positive (≥70): ${s.positive}`);
    console.log(`  Negative (<40): ${s.negative}`);

    // SMS follow-up rate for interested contacts
    const followUps = await api.objects.uoql({
        query: `
            SELECT
                COUNT(*) as interested,
                SUM(CASE WHEN followUpSent = true THEN 1 ELSE 0 END) as followUpSent
            FROM contacts
            WHERE disposition = 'interested'
        `,
    });

    const f = followUps.data[0];
    const followUpRate = f.interested > 0
        ? ((f.followUpSent / f.interested) * 100).toFixed(1)
        : '0';

    console.log('\n── Follow-Up SMS ──');
    console.log(`  Interested contacts: ${f.interested}`);
    console.log(`  Follow-up sent: ${f.followUpSent} (${followUpRate}%)`);

    // Attempt distribution — understand retry patterns
    const attempts = await api.objects.uoql({
        query: `
            SELECT callAttempts, COUNT(*) as contacts
            FROM contacts
            GROUP BY callAttempts
            ORDER BY callAttempts ASC
        `,
    });

    console.log('\n── Call Attempt Distribution ──');
    for (const row of attempts.data) {
        console.log(`  ${row.callAttempts} attempt(s): ${row.contacts} contacts`);
    }
}
```

---

## 10. Putting It All Together

Here's the complete entry point that wires everything together:

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE,
    token:     process.env.UNBOUND_TOKEN,
});

async function main() {
    console.log('Starting outbound campaign...');

    // Step 1: Bootstrap the schema
    await bootstrapSchema();

    // Step 2: Import contacts
    if (process.env.CONTACTS_CSV) {
        await importContacts(process.env.CONTACTS_CSV);
    }

    // Step 3: Start the webhook server (runs in background)
    const webhookServer = startWebhookServer();

    // Step 4: Start the supervisor dashboard (optional)
    if (process.env.SUPERVISOR_MODE) {
        await startSupervisorDashboard();
    }

    // Step 5: Run the campaign
    const campaign = new CampaignRunner(api);
    await campaign.start();

    // Step 6: Print the final report
    await generateCampaignReport();

    console.log('Campaign complete.');
    webhookServer.close();
}

main().catch(err => {
    console.error('Campaign failed:', err);
    process.exit(1);
});
```

**Environment variables:**

```bash
UNBOUND_NAMESPACE=your-namespace
UNBOUND_TOKEN=your-bearer-token
UNBOUND_WEBHOOK_SECRET=your-webhook-signing-secret
CONTACTS_CSV=./contacts.csv
SUPERVISOR_MODE=true
```

---

## Common Issues

### Calls not reaching agents

1. **Check worker status** — agents must call `setAvailable()` before they receive tasks
2. **Check queue login** — agents must be logged into the queue (`queueLogin` or `queueAutoLogin`)
3. **Check skills** — if tasks require skills, agents must have those skill IDs on their worker record
4. **Check queue timeout** — if no agent accepts within the timeout window, the task is abandoned

### Transcripts missing

- Transcription is async. The `call.ended` webhook fires before transcription is complete.
- Use `fetchTranscriptWithRetry()` with exponential backoff (shown above)
- If `sipCallId` is not set on the STT stream, transcripts won't be linked to the call

### AI analysis errors

- Parse errors: Wrap `JSON.parse()` in try/catch — models occasionally return markdown code fences
- Rate limits: Space AI calls out or use a queue (BullMQ, pg-boss) if volume is high
- Prompt injection: Sanitize transcript content before inserting into the AI prompt

### Duplicate contacts dialed

- The `campaignStatus: 'calling'` update must happen **before** `voice.call()` is invoked
- In high-concurrency scenarios, add a database-level unique constraint or advisory lock

---

## Production Checklist

- [ ] Webhook endpoint is HTTPS with valid TLS certificate
- [ ] HMAC signature verification is enabled and tested
- [ ] `CONCURRENT_CALLS` tuned to your DID capacity and carrier limits
- [ ] `MAX_ATTEMPTS` set — do not retry DNC contacts
- [ ] All contacts with `disposition: 'dnc'` are excluded from future campaigns
- [ ] Transcription enabled only on consented recordings
- [ ] Follow-up SMS respects opt-outs (check `smsOptOut` field before sending)
- [ ] Webhook server has idempotency protection (use event `id` as a dedup key)
- [ ] Error alerts wired to Slack/PagerDuty for failed batches

---

## What's Next

- [Task Router API Reference](/api-reference/task-router) — full queue and worker control
- [Voice API Reference](/api-reference/voice) — all call control methods
- [AI API Reference](/api-reference/ai) — STT streaming, generative chat, data extraction
- [Objects API Reference](/api-reference/objects) — schema management, UOQL queries
- [Webhooks Guide](/guides/webhooks) — event payloads, signature verification, retry handling
- [Real-Time Subscriptions](/guides/real-time-subscriptions) — WebSocket events for live dashboards
