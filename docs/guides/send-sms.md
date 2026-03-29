---
id: send-sms
title: Send Your First SMS
---

# Send Your First SMS

This guide walks through sending your first SMS, then builds up to templates, MMS attachments, inbound handling, and a complete two-way conversation loop.

## Prerequisites

- Node.js 16+
- An Unbound namespace and credentials
- A provisioned phone number in your namespace (or a toll-free / 10DLC registered number for application-to-person messaging)

---

## 1. Install the SDK

```bash
npm install @unboundcx/sdk
```

---

## 2. Authenticate

```javascript
import SDK from '@unboundcx/sdk';

// Option A: Username/password (server-side or dev)
const api = new SDK({ namespace: 'your-namespace' });
await api.login.login('your-username', 'your-password');

// Option B: Pre-supplied JWT (recommended for production)
const api = new SDK({ namespace: 'your-namespace', token: process.env.UNBOUND_TOKEN });
```

---

## 3. Send a Simple SMS

```javascript
const sms = await api.messaging.sms.send({
    from: '+18005551234',   // Your Unbound DID in E.164 format
    to: '+12135550100',     // Recipient in E.164 format
    message: 'Hello from Unbound! 👋',
});

console.log('Message SID:', sms.id);
console.log('Status:', sms.status);
// Status is typically 'queued' immediately; delivery is async
```

### Check Delivery Status

```javascript
const message = await api.messaging.sms.get(sms.id);
console.log('Status:', message.status);
// 'queued' → 'sent' → 'delivered' (or 'failed' / 'undelivered')
```

---

## 4. Send MMS with Media

Attach an image, PDF, or audio clip:

```javascript
const mms = await api.messaging.sms.send({
    from: '+18005551234',
    to: '+12135550100',
    message: 'Check out your receipt 📄',
    mediaUrls: [
        'https://yourapp.com/receipts/receipt-12345.pdf',
    ],
});
```

You can also use a storage ID from a file you've already uploaded:

```javascript
// Upload a file first
const upload = await api.storage.upload({
    file: fs.createReadStream('./invoice.pdf'),
    filename: 'invoice.pdf',
    mimeType: 'application/pdf',
});

// Send as MMS attachment via the public URL
const url = await api.storage.getFileUrl(upload.storageId);

const mms = await api.messaging.sms.send({
    from: '+18005551234',
    to: '+12135550100',
    message: 'Your invoice is attached.',
    mediaUrls: [url],
});
```

---

## 5. Send Using a Template

Templates let you maintain reusable message copy and inject dynamic variables at send time.

### Create a Template

```javascript
const template = await api.messaging.sms.templates.create({
    name: 'appointment-reminder',
    template: 'Hi {{firstName}}, reminder: your appointment is {{date}} at {{time}}. Reply CONFIRM or CANCEL.',
    variables: ['firstName', 'date', 'time'],
});

console.log('Template ID:', template.id);
```

### Send from Template

```javascript
const sms = await api.messaging.sms.send({
    from: '+18005551234',
    to: '+12135550100',
    templateId: template.id,
    variables: {
        firstName: 'Sarah',
        date: 'Tuesday, April 1st',
        time: '2:00 PM',
    },
});
```

---

## 6. Handle Inbound SMS (Webhook)

Configure your phone number's messaging webhook URL, then process inbound messages with Express:

```javascript
import express from 'express';
import SDK from '@unboundcx/sdk';

const app = express();
app.use(express.json());

const api = new SDK({ namespace: 'your-namespace', token: process.env.UNBOUND_TOKEN });

app.post('/webhooks/sms', async (req, res) => {
    const { type, id, from, to, body, mediaUrls } = req.body;
    res.json({ received: true }); // Acknowledge immediately

    if (type === 'message.received') {
        console.log(`SMS from ${from}: ${body}`);

        // Simple keyword auto-reply
        const text = body.trim().toUpperCase();

        if (text === 'CONFIRM') {
            await api.messaging.sms.send({
                from: to,   // Reply from the same DID they texted
                to: from,
                message: "✅ Confirmed! We'll see you at your appointment.",
            });
            // Update the appointment record
            await api.objects.update({
                object: 'appointments',
                where: { phone: from },
                update: { status: 'confirmed', confirmedAt: new Date().toISOString() },
            });
        } else if (text === 'CANCEL') {
            await api.messaging.sms.send({
                from: to,
                to: from,
                message: "❌ Your appointment has been cancelled. Text REBOOK to reschedule.",
            });
            await api.objects.update({
                object: 'appointments',
                where: { phone: from },
                update: { status: 'cancelled' },
            });
        } else if (text === 'STOP') {
            // Opt-out — STOP is handled automatically by carriers,
            // but log it in your CRM too
            await api.objects.update({
                object: 'contacts',
                where: { phone: from },
                update: { smsOptOut: true },
            });
        } else {
            // Route unknown messages to an agent
            await api.taskRouter.task.create({
                type: 'sms',
                queueId: 'support-queue-id',
                subject: `Inbound SMS from ${from}: ${body.substring(0, 50)}`,
                createEngagement: true,
            });
        }
    }
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));
```

---

## 7. Two-Way Conversation with Session Tracking

Track conversation context using engagement sessions and objects:

```javascript
async function sendWithContext(to, from, message) {
    // Find or create an engagement session for this conversation
    const [existingSession] = await api.objects.query({
        object: 'engagementSessions',
        where: { 
            channel: 'sms',
            status: { $in: ['new', 'working'] },
        },
        select: ['id', 'status', 'peopleId'],
        limit: 1,
    }).then(r => r.data);

    const sms = await api.messaging.sms.send({
        from,
        to,
        message,
        engagementSessionId: existingSession?.id,
    });

    return sms;
}
```

---

## 8. Bulk Send (Campaign)

For high-volume sending to a list, use the messaging campaigns feature or batch individual sends with rate-limit awareness:

```javascript
const contacts = [
    { phone: '+12135550101', firstName: 'Alice' },
    { phone: '+12135550102', firstName: 'Bob' },
    { phone: '+12135550103', firstName: 'Carol' },
];

const DELAY_MS = 100; // Stay well under rate limits

async function sendBatch(contacts, templateId) {
    const results = [];
    for (const contact of contacts) {
        try {
            const sms = await api.messaging.sms.send({
                from: '+18005551234',
                to: contact.phone,
                templateId,
                variables: { firstName: contact.firstName },
            });
            results.push({ phone: contact.phone, id: sms.id, status: 'sent' });
        } catch (err) {
            console.error(`Failed to send to ${contact.phone}:`, err.message);
            results.push({ phone: contact.phone, status: 'failed', error: err.message });
        }

        // Throttle to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
    return results;
}

const results = await sendBatch(contacts, template.id);
console.log('Send results:', results);
```

---

## 9. Poll for Delivery Status

If you don't have a webhook endpoint, poll for delivery confirmation:

```javascript
async function waitForDelivery(messageId, timeoutMs = 30000) {
    const start = Date.now();
    const POLL_INTERVAL = 2000;

    while (Date.now() - start < timeoutMs) {
        const msg = await api.messaging.sms.get(messageId);

        if (msg.status === 'delivered') {
            console.log('✅ Delivered:', messageId);
            return msg;
        }

        if (['failed', 'undelivered'].includes(msg.status)) {
            throw new Error(`Message ${messageId} failed with status: ${msg.status}`);
        }

        // Still in-flight — keep waiting
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }

    throw new Error(`Delivery confirmation timed out after ${timeoutMs}ms`);
}

const sms = await api.messaging.sms.send({
    from: '+18005551234',
    to: '+12135550100',
    message: 'Verification code: 847293',
});

const delivered = await waitForDelivery(sms.id);
console.log('Delivered at:', delivered.updatedAt);
```

---

## 10. Error Handling

```javascript
import { UnboundError } from '@unboundcx/sdk';

try {
    const sms = await api.messaging.sms.send({
        from: '+18005551234',
        to: '+12135550100',
        message: 'Hello!',
    });
} catch (err) {
    if (err instanceof UnboundError) {
        switch (err.statusCode) {
            case 400:
                // Bad phone number format, missing required field, etc.
                console.error('Invalid request:', err.message);
                break;
            case 402:
                console.error('Insufficient messaging credits');
                break;
            case 403:
                // Recipient opted out, number not authorized, etc.
                console.error('Forbidden:', err.message);
                break;
            case 429:
                const retryAfter = parseInt(err.headers?.['retry-after'] || '60', 10);
                console.error(`Rate limited. Retry in ${retryAfter} seconds.`);
                await new Promise(r => setTimeout(r, retryAfter * 1000));
                // Retry the send...
                break;
            default:
                console.error(`Messaging error (${err.statusCode}):`, err.message);
        }
    } else {
        throw err; // Network error, timeout, etc.
    }
}
```

---

## Quick Reference

| Goal | Method |
|---|---|
| Send a text | `api.messaging.sms.send({ from, to, message })` |
| Send MMS | `api.messaging.sms.send({ ..., mediaUrls: [...] })` |
| Send from template | `api.messaging.sms.send({ ..., templateId, variables })` |
| Check status | `api.messaging.sms.get(id)` |
| Create template | `api.messaging.sms.templates.create({ name, template, variables })` |
| List templates | `api.messaging.sms.templates.list()` |

---

## What's Next

- [Messaging API Reference](/api-reference/messaging) — SMS, email, fax, templates, campaigns
- [Make an Outbound Call](/guides/make-call) — add voice to your communications
- [Webhooks](/guides/webhooks) — receive inbound messages and delivery updates
- [UOQL Queries](/guides/query-with-uoql) — query contact history and message logs
