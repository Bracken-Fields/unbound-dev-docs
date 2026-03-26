---
id: messaging
title: Messaging
---

# Messaging

`api.messaging` — SMS, MMS, email (with full mailbox, drafts, templates, analytics, and suppression), and carrier campaign registration.

---

## SMS

### `messaging.sms.send(options)`

```javascript
const msg = await api.messaging.sms.send({
    to: '+10987654321',
    from: '+11234567890',
    message: 'Your appointment is tomorrow at 3pm.',
    mediaUrls: ['https://example.com/image.jpg'],  // MMS
    webhookUrl: 'https://yourapp.com/webhooks/sms', // delivery callbacks
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `to` | string | ✅ | Recipient phone number (E.164) |
| `from` | string | — | Sending number (E.164) |
| `message` | string | — | Message text |
| `templateId` | string | — | Template ID to use |
| `variables` | object | — | Template variable substitutions |
| `mediaUrls` | string[] | — | Media URLs for MMS |
| `webhookUrl` | string | — | Webhook for delivery status updates |

### `messaging.sms.get(id)`

```javascript
const msg = await api.messaging.sms.get('msg-id-123');
```

---

## SMS Templates

### Create

```javascript
await api.messaging.sms.templates.create({
    name: 'appointment-reminder',
    message: 'Hi {{name}}, your appointment is at {{time}}.',
    variables: { name: 'string', time: 'string' },
});
```

### CRUD

```javascript
await api.messaging.sms.templates.get('template-id');
await api.messaging.sms.templates.list();
await api.messaging.sms.templates.update('template-id', { message: 'Updated text' });
await api.messaging.sms.templates.delete('template-id');
```

---

## Email

### `messaging.email.send(options)`

```javascript
await api.messaging.email.send({
    from: 'support@yourcompany.com',
    to: ['customer@example.com'],
    cc: ['manager@yourcompany.com'],
    subject: 'Your order is confirmed',
    html: '<h1>Thanks for your order!</h1>',
    text: 'Thanks for your order!',
    storageId: ['file-id-123'],       // attachments
    replyToEmailId: 'email-id-456',   // thread reply
    templateId: 'tpl-789',
    variables: { orderId: 'ORD-001' },
    emailType: 'transactional',       // 'marketing' | 'transactional'
    tracking: true,
    mailboxId: 'mailbox-id-abc',
    engagementSessionId: 'eng-123',
});
```

| Parameter | Type | Description |
|---|---|---|
| `from` | string | Sender address (required unless using `draftId`) |
| `to` | string/string[] | Recipient(s) |
| `cc` / `bcc` | string/string[] | CC/BCC recipients |
| `subject` | string | Email subject |
| `html` | string | HTML body |
| `text` | string | Plain text fallback |
| `templateId` | string | Use an email template |
| `variables` | object | Template substitutions |
| `storageId` | string[] | Attachment file IDs |
| `replyToEmailId` | string | Thread this as a reply |
| `emailType` | string | `'marketing'` or `'transactional'` |
| `tracking` | boolean | Track opens and clicks |
| `mailboxId` | string | Send from a specific mailbox |
| `draftId` | string | Convert a draft to sent |

### `messaging.email.get(id)`

Returns full email with related emails from the same person/company.

```javascript
const email = await api.messaging.email.get('email-id-123');
// email.relatedEmails — other emails from this contact
```

### `messaging.email.update(emailId, updates)`

Move between folders or mark as read/unread.

```javascript
// Move to completed
await api.messaging.email.update('email-id', { folder: 'completed' });

// Mark as read
await api.messaging.email.update('email-id', { isRead: true });

// Move and mark unread
await api.messaging.email.update('email-id', { folder: 'open', isRead: false });
```

**Folders:** `open`, `completed`, `trash`, `spam`

### `messaging.email.delete(emailId)`

Two-stage deletion: first call moves to trash, second call permanently deletes.

```javascript
await api.messaging.email.delete('email-id');
```

---

## Email Drafts

### Create a Draft

```javascript
const draft = await api.messaging.email.createDraft({
    from: 'support@yourcompany.com',
    to: ['customer@example.com'],
    subject: 'Following up on your request',
    html: '<p>Hi there...</p>',
    mailboxId: 'mailbox-id',
    replyToEmailId: 'email-id-456',
    replyType: 'reply',          // 'reply' | 'replyAll' | 'forward'
    engagementSessionId: 'eng-123',
});
```

### Manage Drafts

```javascript
await api.messaging.email.getDraft('draft-id');
await api.messaging.email.updateDraft('draft-id', { subject: 'Updated subject' });
await api.messaging.email.deleteDraft('draft-id');
await api.messaging.email.listDrafts({ mailboxId: 'mailbox-id', limit: 50 });

// Send a draft
await api.messaging.email.send({ draftId: 'draft-id' });
```

---

## Email Mailboxes

Mailboxes are inboxes your platform receives email to. Each gets a system address (`random@your-namespace.unbound.cx`) plus optional custom aliases on verified domains.

### Create a Mailbox

```javascript
const mailbox = await api.messaging.email.mailboxes.create({
    mailbox: 'support',
    name: 'Support Team',
    useEngagementSessions: true,    // link emails to engagement sessions
    queueId: 'queue-id',
    ticketPrefix: 'SUP',
    ticketCreateEmailTemplateId: 'template-id',
    ticketCreateEmailFrom: 'support@yourcompany.com',
});
```

### List Mailboxes

```javascript
const result = await api.messaging.email.mailboxes.list({
    folderCounts: ['open', 'completed', 'trash'],
    search: 'support',
    limit: 50,
});
// result.mailboxes[0].messageCounts → { open: 5, completed: 3, total: 8 }
```

### Get / Update / Delete

```javascript
const mailbox = await api.messaging.email.mailboxes.get('mailbox-id', true); // includeAliases

await api.messaging.email.mailboxes.update('mailbox-id', {
    name: 'Customer Success',
    queueId: 'new-queue-id',
});

await api.messaging.email.mailboxes.delete('mailbox-id');
```

### Mailbox Email View

Fetch emails from a mailbox in a Gmail-style threaded view.

```javascript
const emails = await api.messaging.email.getMailboxEmails('mailbox-id', {
    folder: 'open',          // 'open' | 'completed' | 'trash' | 'spam'
    includeDrafts: false,
    search: 'invoice',
    sortBy: 'dateTime',
    sortOrder: 'desc',
    limit: 25,
    offset: 0,
});
// emails.messages[0].threads → nested reply thread
```

### Aliases

Add custom addresses like `support@yourcompany.com` on a verified domain.

```javascript
// Add custom alias
const alias = await api.messaging.email.mailboxes.createAlias(
    'mailbox-id',
    'email-domain-id',
    'support',    // → support@yourdomain.com
    null,         // recordTypeId
    true,         // isDefault
);

await api.messaging.email.mailboxes.updateAlias('alias-id', true);  // set as default
await api.messaging.email.mailboxes.deleteAlias('alias-id');

// List folders for a mailbox
const folders = await api.messaging.email.mailboxes.listFolders('mailbox-id');
```

---

## Email Templates

```javascript
// Create (variables auto-extracted from {{placeholders}})
await api.messaging.email.templates.create({
    name: 'Welcome Email',
    subject: 'Welcome {{firstName}}!',
    html: '<h1>Hello {{firstName}} {{lastName}}</h1>',
    text: 'Hello {{firstName}} {{lastName}}',
});

await api.messaging.email.templates.get('template-id');
await api.messaging.email.templates.list();
await api.messaging.email.templates.update('template-id', { subject: 'New subject' });
await api.messaging.email.templates.delete('template-id');
```

---

## Email Domains

Verify sending domains for custom `from` addresses.

```javascript
// Verify a domain
const domain = await api.messaging.email.domains.create({
    domain: 'yourcompany.com',
    primaryRegion: 'us-east-1',
    secondaryRegion: 'us-west-2',
    mailFromSubdomain: 'mail',
});
// domain.dns → array of DNS records to add (CNAME, TXT, DMARC)

// Get full DNS config for a domain
const full = await api.messaging.email.domains.get('domain-id');

// Validate DNS records
await api.messaging.email.domains.validateDns('yourcompany.com');

// Check status
await api.messaging.email.domains.checkStatus('yourcompany.com');

await api.messaging.email.domains.list();
await api.messaging.email.domains.delete('domain-id');
```

---

## Verified Addresses

Verify individual sending email addresses.

```javascript
await api.messaging.email.addresses.create('sender@yourcompany.com');
await api.messaging.email.addresses.list();
await api.messaging.email.addresses.checkStatus('sender@yourcompany.com');
await api.messaging.email.addresses.delete('sender@yourcompany.com');
```

---

## Email Analytics

```javascript
// Time-series delivery metrics
const series = await api.messaging.email.analytics.timeSeries({
    period: '24h',           // '1h' | '6h' | '24h' | '7d' | '30d'
    granularity: 'hour',     // 'minute' | 'hour' | 'day'
    timezone: 'America/New_York',
});
// series.data → [{ timestamp, sent, delivered, failed, queued }]

// Summary stats (includes opens, clicks, bounces, complaints)
const summary = await api.messaging.email.analytics.summary({
    period: '7d',
    timezone: 'America/Chicago',
});
// summary.openRate, summary.clickRate, summary.bounceRate, ...

// Real-time queue depth
const realtime = await api.messaging.email.analytics.realtime();
// realtime.queueDepth, realtime.currentSendRatePerMinute

// Error analysis by domain
const errors = await api.messaging.email.analytics.errors({ period: '7d' });
// errors.topErrorDomains → [{ domain, errorRate, totalErrors }]
```

---

## Email Queue

```javascript
const queued    = await api.messaging.email.queue.getQueued({ limit: 25 });
const failed    = await api.messaging.email.queue.getFailed({ limit: 25 });
const sent      = await api.messaging.email.queue.getSent({ limit: 25 });
const delivered = await api.messaging.email.queue.getDelivered({ limit: 25 });

// Or filter manually
const all = await api.messaging.email.queue.list({
    status: 'queued',   // 'queued' | 'sent' | 'delivered' | 'failed'
    page: 1,
    limit: 50,
});
```

---

## Email Suppression

Manage email addresses suppressed due to bounces or complaints.

```javascript
// List suppressions
const suppressions = await api.messaging.email.suppression.getBounces();
const complaints   = await api.messaging.email.suppression.getComplaints();

// Custom filter
const all = await api.messaging.email.suppression.list({
    type: 'bounce',
    emailAddress: '@example.com',
    page: 1,
});

// Check if an address is globally suppressed
const status = await api.messaging.email.suppression.checkGlobal('user@example.com');
// status.suppressed → true/false
// status.canRequestRemoval → true/false

// Request removal from global suppression
await api.messaging.email.suppression.requestRemoval(
    'user@example.com',
    'Customer re-opted in via web form'
);

// Delete a suppression entry (with required reason)
await api.messaging.email.suppression.delete('suppression-id', 'Customer request');
```

---

## Campaigns

### Toll-Free

```javascript
await api.messaging.campaigns.tollFree.create({
    companyName: 'Acme Corp',
    phoneNumber: '+18005551234',
    description: 'Customer support SMS',
    useCase: 'customer_care',
});

await api.messaging.campaigns.tollFree.list();
await api.messaging.campaigns.tollFree.get('campaign-id');
```

### 10DLC Brands

```javascript
// Register a brand
const brand = await api.messaging.campaigns.tenDlc.brands.create({
    name: 'Acme Support',
    entityType: 'PRIVATE_PROFIT',     // 'PRIVATE_PROFIT' | 'PUBLIC_PROFIT' | 'NON_PROFIT'
    companyName: 'Acme Corp',
    address1: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'US',
    pocEmail: 'admin@acme.com',
    pocPhone: '+13235550100',
    vertical: 'RETAIL',
    website: 'https://acme.com',
});

await api.messaging.campaigns.tenDlc.brands.get('brand-id');
await api.messaging.campaigns.tenDlc.brands.list({ status: 'VERIFIED' });
await api.messaging.campaigns.tenDlc.brands.update('brand-id', { website: 'https://newsite.com' });
await api.messaging.campaigns.tenDlc.brands.revet('brand-id');         // resubmit for carrier approval
await api.messaging.campaigns.tenDlc.brands.getFeedback('brand-id');
await api.messaging.campaigns.tenDlc.brands.delete('brand-id');
```

### 10DLC Campaigns

```javascript
const campaign = await api.messaging.campaigns.tenDlc.campaigns.create({
    brandId: 'brand-id',
    description: 'Customer support and appointment reminders',
    messageFlow: 'Users opt-in via web form at acme.com/subscribe',
    helpMessage: 'For help, text HELP or call 1-800-555-0100',
    optInMessage: 'You\'ve subscribed to Acme alerts. Msg&data rates may apply. Reply STOP to unsubscribe.',
    optOutMessage: 'You\'ve been unsubscribed. Reply START to re-subscribe.',
    useCase: 'CUSTOMER_CARE',
});

await api.messaging.campaigns.tenDlc.campaigns.update('campaign-id', {
    samples: ['Your appt is tomorrow at 3pm', 'Your order shipped!'],
    embeddedLink: false,
    subscriberOptout: true,
});

await api.messaging.campaigns.tenDlc.campaigns.get('campaign-id');
await api.messaging.campaigns.tenDlc.campaigns.list();
await api.messaging.campaigns.tenDlc.campaigns.delete('campaign-id');
```

---

## Common Patterns

### Pattern 1 — SMS appointment reminder with template

Use SMS templates to send personalized reminders at scale. Always include opt-out language for compliance.

```javascript
// Step 1: Create a reusable reminder template
const template = await api.messaging.sms.templates.create({
    name: 'appointment-reminder',
    message: 'Hi {{firstName}}, your appointment with {{providerName}} is tomorrow at {{time}}. Reply STOP to unsubscribe.',
    variables: {
        firstName: 'string',
        providerName: 'string',
        time: 'string',
    },
});

// Step 2: Send using the template (variables substituted server-side)
const msg = await api.messaging.sms.send({
    to: '+13175550100',
    from: '+18005551234',
    templateId: template.id,
    variables: {
        firstName: 'Sarah',
        providerName: 'Dr. Evans',
        time: '2:00 PM',
    },
    webhookUrl: 'https://yourapp.com/webhooks/sms-delivery',
});
// msg.id → use to poll delivery status

// Step 3: Check delivery status
const status = await api.messaging.sms.get(msg.id);
// status.status → 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered'
// status.errorCode → carrier error code if failed
```

---

### Pattern 2 — MMS with media attachment

Send images, PDFs, or other media via MMS. Multiple `mediaUrls` supported.

```javascript
// Attach a receipt image and coupon PDF
const mms = await api.messaging.sms.send({
    to: '+13175550100',
    from: '+18005551234',
    message: 'Thanks for your purchase! Here is your receipt and a coupon for your next visit.',
    mediaUrls: [
        'https://cdn.yourapp.com/receipts/receipt-1234.pdf',
        'https://cdn.yourapp.com/coupons/10off.jpg',
    ],
});
```

:::note
MMS is only available on 10DLC and Toll-Free numbers that have been properly registered. Short codes require a separate MMS-enabled provisioning. `mediaUrls` must be publicly accessible; presigned S3 URLs work if they remain valid through delivery.
:::

---

### Pattern 3 — Inbound SMS webhook + auto-reply

Handle inbound messages by processing the webhook payload and sending a reply in the same flow.

```javascript
// Express.js webhook handler
app.post('/webhooks/sms-inbound', async (req, res) => {
    const { from, to, message, id } = req.body;

    if (message.trim().toUpperCase() === 'STATUS') {
        // Auto-reply with order status
        const order = await db.orders.findByPhone(from);
        await api.messaging.sms.send({
            to: from,
            from: to,       // reply from the number that received the message
            message: order
                ? `Your order #${order.id} is currently: ${order.status}.`
                : 'No order found for this number. Reply HELP for assistance.',
        });
    }

    res.sendStatus(200);   // always acknowledge quickly
});
```

---

### Pattern 4 — Draft → review → send email workflow

Create a draft, allow human review in the UI, then send programmatically when approved.

```javascript
// Step 1: Create draft (e.g., from automated template generation)
const draft = await api.messaging.email.createDraft({
    mailboxId: 'mailbox-support-id',
    from: 'support@yourcompany.com',
    to: ['customer@example.com'],
    replyToEmailId: 'email-id-of-inbound',  // thread the reply
    replyType: 'reply',                      // auto-formats with quoted original
    subject: 'Re: Your support ticket #1234',
    html: '<p>Thank you for reaching out. Here is our response...</p>',
    templateId: 'tpl-support-reply',
    variables: { ticketId: '1234', agentName: 'Maria' },
});
// draft.id → persisted, visible in mailbox UI for agent review

// Step 2: Agent edits draft in UI if needed, then approves
// Your webhook receives draft-approved event...

// Step 3: Convert draft to sent email
const sent = await api.messaging.email.send({
    draftId: draft.id,
    // No other fields needed — uses draft content as-is
});
// sent.id → final email ID for tracking
```

---

### Pattern 5 — Support ticket mailbox with auto-reply

Set up a mailbox that auto-creates engagement sessions (tickets) and sends acknowledgment emails.

```javascript
// Step 1: Create the support mailbox
const mailbox = await api.messaging.email.mailboxes.create({
    mailbox: 'support',           // results in: support@<yourdomain>.unbound.cx
    name: 'Support Team',
    useEngagementSessions: true,  // auto-creates a ticket per inbound thread
    queueId: 'queue-tier1-id',    // route ticket to correct queue
    ticketPrefix: 'SUP',          // tickets named SUP-0001, SUP-0002, ...
    ticketCreateEmailTemplateId: 'tpl-auto-ack',
    ticketCreateEmailFrom: 'noreply@yourcompany.com',
});

// Step 2: Add a custom alias on your verified domain
const alias = await api.messaging.email.mailboxes.createAlias(
    mailbox.id,
    'domain-id-for-yourcompany.com',
    'support',       // support@yourcompany.com → routes to this mailbox
    null,
    true,            // isDefault: use this alias as the default From address
);

// Step 3: Fetch open tickets (inbound emails not yet resolved)
const open = await api.messaging.email.getMailboxEmails(mailbox.id, {
    folder: 'open',
    sortBy: 'dateTime',
    sortOrder: 'asc',   // oldest first = fair FIFO queue
    limit: 25,
});

// Step 4: Move a ticket to completed when resolved
await api.messaging.email.update(open.messages[0].id, { folder: 'completed' });
```

---

### Pattern 6 — Email analytics dashboard

Pull delivery, engagement, and error metrics for a monitoring dashboard.

```javascript
// Current queue health (real-time)
const realtime = await api.messaging.email.analytics.realtime();
console.log(`Queue depth: ${realtime.queueDepth}`);
console.log(`Send rate: ${realtime.currentSendRatePerMinute}/min`);

// Last 24h engagement summary
const summary = await api.messaging.email.analytics.summary({
    period: '24h',
    timezone: 'America/Indianapolis',
});
console.log(`Delivery rate: ${(summary.deliveryRate * 100).toFixed(1)}%`);
console.log(`Open rate:     ${(summary.openRate * 100).toFixed(1)}%`);
console.log(`Click rate:    ${(summary.clickRate * 100).toFixed(1)}%`);
console.log(`Bounce rate:   ${(summary.bounceRate * 100).toFixed(1)}%`);

// Alert if error rate spikes above threshold
if (summary.errorRate > 0.05) {
    const errors = await api.messaging.email.analytics.errors({ period: '24h' });
    const worstDomain = errors.topErrorDomains[0];
    console.warn(`High error rate — worst domain: ${worstDomain.domain} (${(worstDomain.errorRate * 100).toFixed(1)}%)`);
}

// Weekly trend (7-day chart data)
const trend = await api.messaging.email.analytics.timeSeries({
    period: '7d',
    granularity: 'day',
    timezone: 'America/Indianapolis',
});
// trend.data → [{ timestamp, sent, delivered, failed, queued }]
```

---

### Pattern 7 — Bounce suppression management

Check suppression status before sending to avoid wasting sends on blocked addresses, and handle removal requests.

```javascript
// Before a marketing blast, check if address is suppressed
async function canEmail(address) {
    const status = await api.messaging.email.suppression.checkGlobal(address);
    return !status.suppressed;
}

// Re-engagement flow: customer submits web form to re-subscribe
app.post('/resubscribe', async (req, res) => {
    const { email } = req.body;
    const status = await api.messaging.email.suppression.checkGlobal(email);

    if (!status.suppressed) {
        return res.json({ ok: true, message: 'Already subscribed.' });
    }

    if (!status.canRequestRemoval) {
        return res.status(403).json({
            ok: false,
            message: 'This address cannot be resubscribed due to repeated bounces.',
        });
    }

    // Request removal from global suppression list
    await api.messaging.email.suppression.requestRemoval(
        email,
        'Customer re-opted in via web form re-subscribe flow',
    );

    res.json({ ok: true, message: 'Resubscribe request submitted. Emails will resume within 24h.' });
});

// Periodic cleanup: review bounce list
const bounces = await api.messaging.email.suppression.getBounces();
// bounces.items → [{ id, emailAddress, type, createdAt, canRequestRemoval }]
```

---

### Pattern 8 — 10DLC brand + campaign registration flow

Full carrier compliance setup for A2P 10DLC SMS in the US. Required before sending at scale on local numbers.

```javascript
// Step 1: Register your brand (maps to your legal entity with TCR)
const brand = await api.messaging.campaigns.tenDlc.brands.create({
    name: 'Acme Support',
    entityType: 'PRIVATE_PROFIT',
    companyName: 'Acme Corp',
    ein: '12-3456789',             // Federal EIN — required for PRIVATE/PUBLIC_PROFIT
    address1: '123 Main St',
    city: 'Indianapolis',
    state: 'IN',
    postalCode: '46201',
    country: 'US',
    pocFirstName: 'Jane',
    pocLastName: 'Smith',
    pocEmail: 'jane@acmecorp.com',
    pocPhone: '+13175550100',
    vertical: 'RETAIL',            // see TCR vertical list
    website: 'https://acmecorp.com',
});
// brand.status → 'PENDING' initially; check back via brands.get()

// Step 2: Poll brand status until VERIFIED
let verified = false;
while (!verified) {
    await new Promise(r => setTimeout(r, 60_000));  // wait 1 min between polls
    const b = await api.messaging.campaigns.tenDlc.brands.get(brand.id);
    if (b.status === 'VERIFIED') { verified = true; }
    if (b.status === 'FAILED') {
        const feedback = await api.messaging.campaigns.tenDlc.brands.getFeedback(brand.id);
        throw new Error(`Brand registration failed: ${JSON.stringify(feedback)}`);
    }
}

// Step 3: Register a campaign under the verified brand
const campaign = await api.messaging.campaigns.tenDlc.campaigns.create({
    brandId: brand.id,
    useCase: 'CUSTOMER_CARE',
    description: 'Appointment reminders and support notifications for Acme customers.',
    messageFlow: 'Customers opt in at acmecorp.com/sms-alerts by entering their phone number and checking consent.',
    helpMessage: 'For help reply HELP or call 1-800-555-0100. Msg&Data rates may apply.',
    optInMessage: 'You are subscribed to Acme SMS alerts. Msg&Data rates may apply. Reply STOP to unsubscribe.',
    optOutMessage: 'You have been unsubscribed from Acme SMS alerts. No further messages will be sent.',
});

// Step 4: Check phone number campaign assignment
const numStatus = await api.messaging.campaigns.tenDlc.getPhoneNumberCampaignStatus('+13175550100');
// numStatus.campaignId → should match campaign.id once provisioned
```

:::tip
10DLC brand registration typically takes 1–3 business days for PRIVATE_PROFIT entities. PUBLIC_PROFIT entities require a two-factor email verification — use `brands.resend2fa(brandId)` if the email is not received. Plan registration 1–2 weeks before your go-live date.
:::
