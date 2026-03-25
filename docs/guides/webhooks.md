---
id: webhooks
title: Webhooks
---

# Webhooks

Unbound delivers real-time event notifications to your server via HTTP webhooks. Configure a webhook URL on a phone number, workflow, or subscription, and Unbound will POST to it whenever relevant events occur.

---

## Configure a Webhook

### On a Phone Number

```javascript
await api.phoneNumbers.update('number-id', {
  voiceWebHookUrl: 'https://yourapp.com/webhooks/voice',
  messagingWebHookUrl: 'https://yourapp.com/webhooks/sms',
});
```

### In a Workflow Item

```javascript
await api.workflows.items.create({
  workflowVersionId: 'wf-version-id',
  category: 'integration',
  type: 'webhook',
  settings: {
    url: 'https://yourapp.com/webhooks/workflow',
    method: 'POST',
    headers: { 'X-Secret': 'your-secret' },
  },
});
```

---

## Receiving Webhooks

Webhook payloads are sent as JSON `POST` requests. Respond with `200 OK` within 5 seconds to acknowledge receipt.

### Express.js Example

```javascript
import express from 'express';

const app = express();
app.use(express.json());

app.post('/webhooks/voice', (req, res) => {
  const event = req.body;
  console.log('Voice event:', event.type, event.callId);

  // Acknowledge immediately
  res.status(200).json({ received: true });

  // Process asynchronously
  processVoiceEvent(event).catch(console.error);
});

app.post('/webhooks/sms', (req, res) => {
  const { from, to, body, mediaUrls } = req.body;
  console.log(`SMS from ${from}: ${body}`);
  res.status(200).json({ received: true });
});

app.listen(3000);
```

---

## Webhook Event Payloads

### Voice Events

```json
{
  "type": "call.started",
  "callId": "call-id-123",
  "from": "+12135550100",
  "to": "+18005551234",
  "direction": "inbound",
  "timestamp": "2024-06-01T14:00:00Z"
}
```

```json
{
  "type": "call.ended",
  "callId": "call-id-123",
  "duration": 245,
  "recordingUrl": "https://...",
  "timestamp": "2024-06-01T14:04:05Z"
}
```

### SMS Events

```json
{
  "type": "message.received",
  "id": "msg-id-456",
  "from": "+12135550100",
  "to": "+18005551234",
  "body": "Hello, I need help with my order",
  "mediaUrls": [],
  "timestamp": "2024-06-01T14:00:00Z"
}
```

```json
{
  "type": "message.status",
  "id": "msg-id-456",
  "status": "delivered",
  "timestamp": "2024-06-01T14:00:05Z"
}
```

### Task Router Events

```json
{
  "type": "task.created",
  "taskId": "task-id-789",
  "queueId": "queue-id",
  "taskType": "phoneCall",
  "priority": 0,
  "timestamp": "2024-06-01T14:00:00Z"
}
```

```json
{
  "type": "task.assigned",
  "taskId": "task-id-789",
  "workerId": "worker-id",
  "userId": "user-id",
  "timestamp": "2024-06-01T14:00:01Z"
}
```

---

## Security: Verifying Webhook Signatures

Add a shared secret header to verify requests genuinely come from Unbound.

```javascript
app.post('/webhooks/voice', (req, res) => {
  const secret = req.headers['x-unbound-secret'];
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // process event...
  res.json({ received: true });
});
```

---

## Retries

If your endpoint returns a non-2xx status or times out (>5 seconds), Unbound retries with exponential backoff:

| Attempt | Delay |
|---|---|
| 1 | Immediate |
| 2 | 30 seconds |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |

After 5 failed attempts the event is dropped. Make your handlers **idempotent** — the same event may arrive more than once.

---

## Idempotency

Use the event `id` field to deduplicate:

```javascript
const processedEvents = new Set();

app.post('/webhooks/voice', (req, res) => {
  const { id, type } = req.body;

  if (processedEvents.has(id)) {
    return res.json({ duplicate: true });
  }

  processedEvents.add(id);
  // process...
  res.json({ received: true });
});
```

In production, use a persistent store (Redis, database) instead of an in-memory Set.
