---
id: messaging
title: Messaging
---

# Messaging

`api.messaging` — Send SMS/MMS and email, manage templates and campaigns.

## SMS

### Send SMS

```javascript
const sms = await api.messaging.sms.send({
  from: '+1234567890',
  to: '+0987654321',
  message: 'Hello from Unbound!',
  mediaUrls: ['https://example.com/image.jpg'], // Optional MMS
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `from` | string | ✅ | Sender phone number (E.164) |
| `to` | string | ✅ | Recipient phone number (E.164) |
| `message` | string | ✅ | Message body |
| `mediaUrls` | string[] | — | Media attachments (MMS) |

### SMS Templates

```javascript
// Create a template
await api.messaging.sms.templates.create({
  name: 'appointment-reminder',
  message: 'Hi {{name}}, your appointment is at {{time}}.',
  variables: { name: 'string', time: 'string' },
});

// List templates
const templates = await api.messaging.sms.templates.list();

// Send with template
await api.messaging.sms.templates.send('appointment-reminder', {
  to: '+0987654321',
  variables: { name: 'Jane', time: '3:00 PM' },
});
```

---

## Email

### Send Email

```javascript
await api.messaging.email.send({
  from: 'support@yourcompany.com',
  to: 'customer@example.com',
  subject: 'Your order is confirmed',
  htmlBody: '<h1>Thanks for your order!</h1>',
  textBody: 'Thanks for your order!', // Optional plain-text fallback
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `from` | string | ✅ | Sender address |
| `to` | string | ✅ | Recipient address |
| `subject` | string | ✅ | Email subject |
| `htmlBody` | string | ✅ | HTML email content |
| `textBody` | string | — | Plain text fallback |

---

## Campaigns

Manage toll-free and 10DLC campaign registrations.

```javascript
// Register a toll-free campaign
await api.messaging.campaigns.tollFree.create({
  companyName: 'Acme Corp',
  phoneNumber: '+18005551234',
  description: 'Customer support messaging',
  useCase: 'customer_care',
});

// List campaigns
const campaigns = await api.messaging.campaigns.tollFree.list();

// Get campaign status
const campaign = await api.messaging.campaigns.tollFree.get(campaignId);
```
