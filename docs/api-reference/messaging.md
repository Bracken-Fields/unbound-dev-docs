---
id: messaging
title: Messaging
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Messaging

`api.messaging` — SMS, MMS, email (with full mailbox, drafts, templates, analytics, and suppression), and carrier campaign registration.

---

## SMS

### `messaging.sms.send(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const msg = await api.messaging.sms.send({
    to: '+10987654321',
    from: '+11234567890',
    message: 'Your appointment is tomorrow at 3pm.',
    mediaUrls: ['https://example.com/image.jpg'],  // MMS
    webhookUrl: 'https://yourapp.com/webhooks/sms', // delivery callbacks
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/message/sms", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "+10987654321",
    from: "+11234567890",
    message: "Your appointment is tomorrow at 3pm.",
    mediaUrls: ["https://example.com/image.jpg"],
    webhookUrl: "https://yourapp.com/webhooks/sms"
  })
});
const msg = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/message/sms");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "to" => "+10987654321",
    "from" => "+11234567890",
    "message" => "Your appointment is tomorrow at 3pm.",
    "mediaUrls" => ["https://example.com/image.jpg"],
    "webhookUrl" => "https://yourapp.com/webhooks/sms"
]));
$msg = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/message/sms",
    headers={"Authorization": "Bearer {token}"},
    json={
        "to": "+10987654321",
        "from": "+11234567890",
        "message": "Your appointment is tomorrow at 3pm.",
        "mediaUrls": ["https://example.com/image.jpg"],
        "webhookUrl": "https://yourapp.com/webhooks/sms"
    }
)
msg = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "to": "+10987654321",
  "from": "+11234567890",
  "message": "Your appointment is tomorrow at 3pm.",
  "mediaUrls": ["https://example.com/image.jpg"],
  "webhookUrl": "https://yourapp.com/webhooks/sms"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/message/sms" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const msg = await api.messaging.sms.get('msg-id-123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/message/sms/msg-id-123", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const msg = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/message/sms/msg-id-123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$msg = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/message/sms/msg-id-123",
    headers={"Authorization": "Bearer {token}"}
)
msg = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/message/sms/msg-id-123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## SMS Templates

### Create

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.messaging.sms.templates.create({
    name: 'appointment-reminder',
    message: 'Hi {{name}}, your appointment is at {{time}}.',
    variables: { name: 'string', time: 'string' },
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/message/sms/template", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "appointment-reminder",
    message: "Hi {{name}}, your appointment is at {{time}}.",
    variables: { name: "string", time: "string" }
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/message/sms/template");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "appointment-reminder",
    "message" => "Hi {{name}}, your appointment is at {{time}}.",
    "variables" => ["name" => "string", "time" => "string"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/message/sms/template",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "appointment-reminder",
        "message": "Hi {{name}}, your appointment is at {{time}}.",
        "variables": {"name": "string", "time": "string"}
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "appointment-reminder",
  "message": "Hi {{name}}, your appointment is at {{time}}.",
  "variables": {"name": "string", "time": "string"}
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/message/sms/template" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### CRUD

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.messaging.sms.templates.get('template-id');
await api.messaging.sms.templates.list();
await api.messaging.sms.templates.update('template-id', { message: 'Updated text' });
await api.messaging.sms.templates.delete('template-id');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get template
const tmpl = await (await fetch("https://{namespace}.api.unbound.cx/message/sms/template/template-id", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// List templates
const list = await (await fetch("https://{namespace}.api.unbound.cx/message/sms/template", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Update template
await fetch("https://{namespace}.api.unbound.cx/message/sms/template/template-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Updated text" })
});

// Delete template
await fetch("https://{namespace}.api.unbound.cx/message/sms/template/template-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get template
$ch = curl_init("https://{namespace}.api.unbound.cx/message/sms/template/template-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$tmpl = json_decode(curl_exec($ch), true);
curl_close($ch);

// List templates
$ch = curl_init("https://{namespace}.api.unbound.cx/message/sms/template");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$list = json_decode(curl_exec($ch), true);
curl_close($ch);

// Update template
$ch = curl_init("https://{namespace}.api.unbound.cx/message/sms/template/template-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["message" => "Updated text"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Delete template
$ch = curl_init("https://{namespace}.api.unbound.cx/message/sms/template/template-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Get template
tmpl = requests.get("https://{namespace}.api.unbound.cx/message/sms/template/template-id", headers=headers).json()

# List templates
templates = requests.get("https://{namespace}.api.unbound.cx/message/sms/template", headers=headers).json()

# Update template
requests.put("https://{namespace}.api.unbound.cx/message/sms/template/template-id", headers=headers, json={"message": "Updated text"})

# Delete template
requests.delete("https://{namespace}.api.unbound.cx/message/sms/template/template-id", headers=headers)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get template
curl -X GET "https://{namespace}.api.unbound.cx/message/sms/template/template-id" \
  -H "Authorization: Bearer {token}"

# List templates
curl -X GET "https://{namespace}.api.unbound.cx/message/sms/template" \
  -H "Authorization: Bearer {token}"

# Update template
curl -X PUT "https://{namespace}.api.unbound.cx/message/sms/template/template-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Updated text"}'

# Delete template
curl -X DELETE "https://{namespace}.api.unbound.cx/message/sms/template/template-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Email

### `messaging.email.send(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/message/email", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    from: "support@yourcompany.com",
    to: ["customer@example.com"],
    cc: ["manager@yourcompany.com"],
    subject: "Your order is confirmed",
    html: "<h1>Thanks for your order!</h1>",
    text: "Thanks for your order!",
    storageId: ["file-id-123"],
    replyToEmailId: "email-id-456",
    templateId: "tpl-789",
    variables: { orderId: "ORD-001" },
    emailType: "transactional",
    tracking: true,
    mailboxId: "mailbox-id-abc",
    engagementSessionId: "eng-123"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "from" => "support@yourcompany.com",
    "to" => ["customer@example.com"],
    "cc" => ["manager@yourcompany.com"],
    "subject" => "Your order is confirmed",
    "html" => "<h1>Thanks for your order!</h1>",
    "text" => "Thanks for your order!",
    "storageId" => ["file-id-123"],
    "replyToEmailId" => "email-id-456",
    "templateId" => "tpl-789",
    "variables" => ["orderId" => "ORD-001"],
    "emailType" => "transactional",
    "tracking" => true,
    "mailboxId" => "mailbox-id-abc",
    "engagementSessionId" => "eng-123"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/message/email",
    headers={"Authorization": "Bearer {token}"},
    json={
        "from": "support@yourcompany.com",
        "to": ["customer@example.com"],
        "cc": ["manager@yourcompany.com"],
        "subject": "Your order is confirmed",
        "html": "<h1>Thanks for your order!</h1>",
        "text": "Thanks for your order!",
        "storageId": ["file-id-123"],
        "replyToEmailId": "email-id-456",
        "templateId": "tpl-789",
        "variables": {"orderId": "ORD-001"},
        "emailType": "transactional",
        "tracking": True,
        "mailboxId": "mailbox-id-abc",
        "engagementSessionId": "eng-123"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "from": "support@yourcompany.com",
  "to": ["customer@example.com"],
  "cc": ["manager@yourcompany.com"],
  "subject": "Your order is confirmed",
  "html": "<h1>Thanks for your order!</h1>",
  "text": "Thanks for your order!",
  "storageId": ["file-id-123"],
  "replyToEmailId": "email-id-456",
  "templateId": "tpl-789",
  "variables": {"orderId": "ORD-001"},
  "emailType": "transactional",
  "tracking": true,
  "mailboxId": "mailbox-id-abc",
  "engagementSessionId": "eng-123"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/message/email" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const email = await api.messaging.email.get('email-id-123');
// email.relatedEmails — other emails from this contact
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/message/email/email-id-123", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const email = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/email-id-123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$email = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/message/email/email-id-123",
    headers={"Authorization": "Bearer {token}"}
)
email = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/message/email/email-id-123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### `messaging.email.update(emailId, updates)`

Move between folders or mark as read/unread.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Move to completed
await api.messaging.email.update('email-id', { folder: 'completed' });

// Mark as read
await api.messaging.email.update('email-id', { isRead: true });

// Move and mark unread
await api.messaging.email.update('email-id', { folder: 'open', isRead: false });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Move to completed
await fetch("https://{namespace}.api.unbound.cx/message/email/email-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ folder: "completed" })
});

// Mark as read
await fetch("https://{namespace}.api.unbound.cx/message/email/email-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ isRead: true })
});

// Move and mark unread
await fetch("https://{namespace}.api.unbound.cx/message/email/email-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ folder: "open", isRead: false })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Move to completed
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/email-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["folder" => "completed"]));
curl_exec($ch);
curl_close($ch);

// Mark as read
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/email-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["isRead" => true]));
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Move to completed
requests.put("https://{namespace}.api.unbound.cx/message/email/email-id", headers=headers, json={"folder": "completed"})

# Mark as read
requests.put("https://{namespace}.api.unbound.cx/message/email/email-id", headers=headers, json={"isRead": True})

# Move and mark unread
requests.put("https://{namespace}.api.unbound.cx/message/email/email-id", headers=headers, json={"folder": "open", "isRead": False})
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Move to completed
curl -X PUT "https://{namespace}.api.unbound.cx/message/email/email-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"folder": "completed"}'

# Mark as read
curl -X PUT "https://{namespace}.api.unbound.cx/message/email/email-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"isRead": true}'

# Move and mark unread
curl -X PUT "https://{namespace}.api.unbound.cx/message/email/email-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"folder": "open", "isRead": false}'
```

</TabItem>
</Tabs>

**Folders:** `open`, `completed`, `trash`, `spam`

### `messaging.email.delete(emailId)`

Two-stage deletion: first call moves to trash, second call permanently deletes.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.messaging.email.delete('email-id');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch("https://{namespace}.api.unbound.cx/message/email/email-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/email-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
requests.delete(
    "https://{namespace}.api.unbound.cx/message/email/email-id",
    headers={"Authorization": "Bearer {token}"}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/message/email/email-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Email Drafts

### Create a Draft

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/message/email/draft", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    from: "support@yourcompany.com",
    to: ["customer@example.com"],
    subject: "Following up on your request",
    html: "<p>Hi there...</p>",
    mailboxId: "mailbox-id",
    replyToEmailId: "email-id-456",
    replyType: "reply",
    engagementSessionId: "eng-123"
  })
});
const draft = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/draft");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "from" => "support@yourcompany.com",
    "to" => ["customer@example.com"],
    "subject" => "Following up on your request",
    "html" => "<p>Hi there...</p>",
    "mailboxId" => "mailbox-id",
    "replyToEmailId" => "email-id-456",
    "replyType" => "reply",
    "engagementSessionId" => "eng-123"
]));
$draft = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/message/email/draft",
    headers={"Authorization": "Bearer {token}"},
    json={
        "from": "support@yourcompany.com",
        "to": ["customer@example.com"],
        "subject": "Following up on your request",
        "html": "<p>Hi there...</p>",
        "mailboxId": "mailbox-id",
        "replyToEmailId": "email-id-456",
        "replyType": "reply",
        "engagementSessionId": "eng-123"
    }
)
draft = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "from": "support@yourcompany.com",
  "to": ["customer@example.com"],
  "subject": "Following up on your request",
  "html": "<p>Hi there...</p>",
  "mailboxId": "mailbox-id",
  "replyToEmailId": "email-id-456",
  "replyType": "reply",
  "engagementSessionId": "eng-123"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/message/email/draft" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### Manage Drafts

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.messaging.email.getDraft('draft-id');
await api.messaging.email.updateDraft('draft-id', { subject: 'Updated subject' });
await api.messaging.email.deleteDraft('draft-id');
await api.messaging.email.listDrafts({ mailboxId: 'mailbox-id', limit: 50 });

// Send a draft
await api.messaging.email.send({ draftId: 'draft-id' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get draft
const draft = await (await fetch("https://{namespace}.api.unbound.cx/message/email/draft/draft-id", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Update draft
await fetch("https://{namespace}.api.unbound.cx/message/email/draft/draft-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ subject: "Updated subject" })
});

// Delete draft
await fetch("https://{namespace}.api.unbound.cx/message/email/draft/draft-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});

// List drafts
const drafts = await (await fetch("https://{namespace}.api.unbound.cx/message/email/draft?mailboxId=mailbox-id&limit=50", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Send a draft
await fetch("https://{namespace}.api.unbound.cx/message/email", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ draftId: "draft-id" })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get draft
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/draft/draft-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$draft = json_decode(curl_exec($ch), true);
curl_close($ch);

// Update draft
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/draft/draft-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["subject" => "Updated subject"]));
curl_exec($ch);
curl_close($ch);

// Delete draft
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/draft/draft-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);

// List drafts
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/draft?mailboxId=mailbox-id&limit=50");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$drafts = json_decode(curl_exec($ch), true);
curl_close($ch);

// Send a draft
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["draftId" => "draft-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Get draft
draft = requests.get("https://{namespace}.api.unbound.cx/message/email/draft/draft-id", headers=headers).json()

# Update draft
requests.put("https://{namespace}.api.unbound.cx/message/email/draft/draft-id", headers=headers, json={"subject": "Updated subject"})

# Delete draft
requests.delete("https://{namespace}.api.unbound.cx/message/email/draft/draft-id", headers=headers)

# List drafts
drafts = requests.get("https://{namespace}.api.unbound.cx/message/email/draft", headers=headers, params={"mailboxId": "mailbox-id", "limit": 50}).json()

# Send a draft
requests.post("https://{namespace}.api.unbound.cx/message/email", headers=headers, json={"draftId": "draft-id"})
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get draft
curl -X GET "https://{namespace}.api.unbound.cx/message/email/draft/draft-id" \
  -H "Authorization: Bearer {token}"

# Update draft
curl -X PUT "https://{namespace}.api.unbound.cx/message/email/draft/draft-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"subject": "Updated subject"}'

# Delete draft
curl -X DELETE "https://{namespace}.api.unbound.cx/message/email/draft/draft-id" \
  -H "Authorization: Bearer {token}"

# List drafts
curl -X GET "https://{namespace}.api.unbound.cx/message/email/draft?mailboxId=mailbox-id&limit=50" \
  -H "Authorization: Bearer {token}"

# Send a draft
curl -X POST "https://{namespace}.api.unbound.cx/message/email" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"draftId": "draft-id"}'
```

</TabItem>
</Tabs>

---

## Email Mailboxes

Mailboxes are inboxes your platform receives email to. Each gets a system address (`random@your-namespace.unbound.cx`) plus optional custom aliases on verified domains.

### Create a Mailbox

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/message/email/mailbox", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    mailbox: "support",
    name: "Support Team",
    useEngagementSessions: true,
    queueId: "queue-id",
    ticketPrefix: "SUP",
    ticketCreateEmailTemplateId: "template-id",
    ticketCreateEmailFrom: "support@yourcompany.com"
  })
});
const mailbox = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/mailbox");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "mailbox" => "support",
    "name" => "Support Team",
    "useEngagementSessions" => true,
    "queueId" => "queue-id",
    "ticketPrefix" => "SUP",
    "ticketCreateEmailTemplateId" => "template-id",
    "ticketCreateEmailFrom" => "support@yourcompany.com"
]));
$mailbox = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/message/email/mailbox",
    headers={"Authorization": "Bearer {token}"},
    json={
        "mailbox": "support",
        "name": "Support Team",
        "useEngagementSessions": True,
        "queueId": "queue-id",
        "ticketPrefix": "SUP",
        "ticketCreateEmailTemplateId": "template-id",
        "ticketCreateEmailFrom": "support@yourcompany.com"
    }
)
mailbox = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "mailbox": "support",
  "name": "Support Team",
  "useEngagementSessions": true,
  "queueId": "queue-id",
  "ticketPrefix": "SUP",
  "ticketCreateEmailTemplateId": "template-id",
  "ticketCreateEmailFrom": "support@yourcompany.com"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/message/email/mailbox" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### List Mailboxes

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.messaging.email.mailboxes.list({
    folderCounts: ['open', 'completed', 'trash'],
    search: 'support',
    limit: 50,
});
// result.mailboxes[0].messageCounts → { open: 5, completed: 3, total: 8 }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/message/email/mailbox?search=support&limit=50&folderCounts=open,completed,trash", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const result = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/mailbox?search=support&limit=50&folderCounts=open,completed,trash");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/message/email/mailbox",
    headers={"Authorization": "Bearer {token}"},
    params={"folderCounts": "open,completed,trash", "search": "support", "limit": 50}
)
result = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/message/email/mailbox?search=support&limit=50&folderCounts=open,completed,trash" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### Get / Update / Delete

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const mailbox = await api.messaging.email.mailboxes.get('mailbox-id', true); // includeAliases

await api.messaging.email.mailboxes.update('mailbox-id', {
    name: 'Customer Success',
    queueId: 'new-queue-id',
});

await api.messaging.email.mailboxes.delete('mailbox-id');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get mailbox (with aliases)
const mailbox = await (await fetch("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id?includeAliases=true", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Update mailbox
await fetch("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Customer Success", queueId: "new-queue-id" })
});

// Delete mailbox
await fetch("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get mailbox (with aliases)
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id?includeAliases=true");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$mailbox = json_decode(curl_exec($ch), true);
curl_close($ch);

// Update mailbox
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["name" => "Customer Success", "queueId" => "new-queue-id"]));
curl_exec($ch);
curl_close($ch);

// Delete mailbox
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Get mailbox (with aliases)
mailbox = requests.get("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id", headers=headers, params={"includeAliases": "true"}).json()

# Update mailbox
requests.put("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id", headers=headers, json={"name": "Customer Success", "queueId": "new-queue-id"})

# Delete mailbox
requests.delete("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id", headers=headers)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get mailbox (with aliases)
curl -X GET "https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id?includeAliases=true" \
  -H "Authorization: Bearer {token}"

# Update mailbox
curl -X PUT "https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Customer Success", "queueId": "new-queue-id"}'

# Delete mailbox
curl -X DELETE "https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### Mailbox Email View

Fetch emails from a mailbox in a Gmail-style threaded view.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/emails", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    folder: "open",
    includeDrafts: false,
    search: "invoice",
    sortBy: "dateTime",
    sortOrder: "desc",
    limit: 25,
    offset: 0
  })
});
const emails = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/emails");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "folder" => "open",
    "includeDrafts" => false,
    "search" => "invoice",
    "sortBy" => "dateTime",
    "sortOrder" => "desc",
    "limit" => 25,
    "offset" => 0
]));
$emails = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/emails",
    headers={"Authorization": "Bearer {token}"},
    json={
        "folder": "open",
        "includeDrafts": False,
        "search": "invoice",
        "sortBy": "dateTime",
        "sortOrder": "desc",
        "limit": 25,
        "offset": 0
    }
)
emails = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "folder": "open",
  "includeDrafts": false,
  "search": "invoice",
  "sortBy": "dateTime",
  "sortOrder": "desc",
  "limit": 25,
  "offset": 0
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/emails" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### Aliases

Add custom addresses like `support@yourcompany.com` on a verified domain.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Add custom alias
const alias = await (await fetch("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/alias", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    emailDomainId: "email-domain-id",
    alias: "support",
    recordTypeId: null,
    isDefault: true
  })
})).json();

// Update alias (set as default)
await fetch("https://{namespace}.api.unbound.cx/message/email/mailbox/alias/alias-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ isDefault: true })
});

// Delete alias
await fetch("https://{namespace}.api.unbound.cx/message/email/mailbox/alias/alias-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});

// List folders for a mailbox
const folders = await (await fetch("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/folder", {
  headers: { "Authorization": "Bearer {token}" }
})).json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Add custom alias
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/alias");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "emailDomainId" => "email-domain-id",
    "alias" => "support",
    "recordTypeId" => null,
    "isDefault" => true
]));
$alias = json_decode(curl_exec($ch), true);
curl_close($ch);

// Update alias (set as default)
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/mailbox/alias/alias-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["isDefault" => true]));
curl_exec($ch);
curl_close($ch);

// Delete alias
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/mailbox/alias/alias-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);

// List folders for a mailbox
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/folder");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$folders = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Add custom alias
alias = requests.post(
    "https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/alias",
    headers=headers,
    json={"emailDomainId": "email-domain-id", "alias": "support", "recordTypeId": None, "isDefault": True}
).json()

# Update alias (set as default)
requests.put("https://{namespace}.api.unbound.cx/message/email/mailbox/alias/alias-id", headers=headers, json={"isDefault": True})

# Delete alias
requests.delete("https://{namespace}.api.unbound.cx/message/email/mailbox/alias/alias-id", headers=headers)

# List folders for a mailbox
folders = requests.get("https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/folder", headers=headers).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Add custom alias
curl -X POST "https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/alias" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"emailDomainId": "email-domain-id", "alias": "support", "recordTypeId": null, "isDefault": true}'

# Update alias (set as default)
curl -X PUT "https://{namespace}.api.unbound.cx/message/email/mailbox/alias/alias-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"isDefault": true}'

# Delete alias
curl -X DELETE "https://{namespace}.api.unbound.cx/message/email/mailbox/alias/alias-id" \
  -H "Authorization: Bearer {token}"

# List folders for a mailbox
curl -X GET "https://{namespace}.api.unbound.cx/message/email/mailbox/mailbox-id/folder" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Email Templates

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Create template
await fetch("https://{namespace}.api.unbound.cx/message/email/template", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Welcome Email",
    subject: "Welcome {{firstName}}!",
    html: "<h1>Hello {{firstName}} {{lastName}}</h1>",
    text: "Hello {{firstName}} {{lastName}}"
  })
});

// Get template
const tmpl = await (await fetch("https://{namespace}.api.unbound.cx/message/email/template/template-id", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// List templates
const list = await (await fetch("https://{namespace}.api.unbound.cx/message/email/template", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Update template
await fetch("https://{namespace}.api.unbound.cx/message/email/template/template-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ subject: "New subject" })
});

// Delete template
await fetch("https://{namespace}.api.unbound.cx/message/email/template/template-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Create template
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/template");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "Welcome Email",
    "subject" => "Welcome {{firstName}}!",
    "html" => "<h1>Hello {{firstName}} {{lastName}}</h1>",
    "text" => "Hello {{firstName}} {{lastName}}"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get template
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/template/template-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$tmpl = json_decode(curl_exec($ch), true);
curl_close($ch);

// List templates
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/template");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$list = json_decode(curl_exec($ch), true);
curl_close($ch);

// Update template
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/template/template-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["subject" => "New subject"]));
curl_exec($ch);
curl_close($ch);

// Delete template
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/template/template-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Create template
requests.post("https://{namespace}.api.unbound.cx/message/email/template", headers=headers, json={
    "name": "Welcome Email",
    "subject": "Welcome {{firstName}}!",
    "html": "<h1>Hello {{firstName}} {{lastName}}</h1>",
    "text": "Hello {{firstName}} {{lastName}}"
})

# Get template
tmpl = requests.get("https://{namespace}.api.unbound.cx/message/email/template/template-id", headers=headers).json()

# List templates
templates = requests.get("https://{namespace}.api.unbound.cx/message/email/template", headers=headers).json()

# Update template
requests.put("https://{namespace}.api.unbound.cx/message/email/template/template-id", headers=headers, json={"subject": "New subject"})

# Delete template
requests.delete("https://{namespace}.api.unbound.cx/message/email/template/template-id", headers=headers)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "Welcome Email",
  "subject": "Welcome {{firstName}}!",
  "html": "<h1>Hello {{firstName}} {{lastName}}</h1>",
  "text": "Hello {{firstName}} {{lastName}}"
}
EOF
)

# Create template
curl -X POST "https://{namespace}.api.unbound.cx/message/email/template" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Get template
curl -X GET "https://{namespace}.api.unbound.cx/message/email/template/template-id" \
  -H "Authorization: Bearer {token}"

# List templates
curl -X GET "https://{namespace}.api.unbound.cx/message/email/template" \
  -H "Authorization: Bearer {token}"

# Update template
curl -X PUT "https://{namespace}.api.unbound.cx/message/email/template/template-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"subject": "New subject"}'

# Delete template
curl -X DELETE "https://{namespace}.api.unbound.cx/message/email/template/template-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Email Domains

Verify sending domains for custom `from` addresses.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Verify a domain
const domain = await (await fetch("https://{namespace}.api.unbound.cx/message/email/domain", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    domain: "yourcompany.com",
    primaryRegion: "us-east-1",
    secondaryRegion: "us-west-2",
    mailFromSubdomain: "mail"
  })
})).json();

// Get full DNS config for a domain
const full = await (await fetch("https://{namespace}.api.unbound.cx/message/email/domain/domain-id", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Validate DNS records
await fetch("https://{namespace}.api.unbound.cx/message/email/domain/validate", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ domain: "yourcompany.com" })
});

// Check status
const status = await (await fetch("https://{namespace}.api.unbound.cx/message/email/domain/status/yourcompany.com", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// List domains
const list = await (await fetch("https://{namespace}.api.unbound.cx/message/email/domain", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Delete domain
await fetch("https://{namespace}.api.unbound.cx/message/email/domain/domain-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Verify a domain
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/domain");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "domain" => "yourcompany.com",
    "primaryRegion" => "us-east-1",
    "secondaryRegion" => "us-west-2",
    "mailFromSubdomain" => "mail"
]));
$domain = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get full DNS config
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/domain/domain-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$full = json_decode(curl_exec($ch), true);
curl_close($ch);

// Validate DNS records
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/domain/validate");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["domain" => "yourcompany.com"]));
curl_exec($ch);
curl_close($ch);

// Check status
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/domain/status/yourcompany.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$status = json_decode(curl_exec($ch), true);
curl_close($ch);

// List domains
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/domain");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$list = json_decode(curl_exec($ch), true);
curl_close($ch);

// Delete domain
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/domain/domain-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Verify a domain
domain = requests.post("https://{namespace}.api.unbound.cx/message/email/domain", headers=headers, json={
    "domain": "yourcompany.com",
    "primaryRegion": "us-east-1",
    "secondaryRegion": "us-west-2",
    "mailFromSubdomain": "mail"
}).json()

# Get full DNS config
full = requests.get("https://{namespace}.api.unbound.cx/message/email/domain/domain-id", headers=headers).json()

# Validate DNS records
requests.post("https://{namespace}.api.unbound.cx/message/email/domain/validate", headers=headers, json={"domain": "yourcompany.com"})

# Check status
status = requests.get("https://{namespace}.api.unbound.cx/message/email/domain/status/yourcompany.com", headers=headers).json()

# List domains
domains = requests.get("https://{namespace}.api.unbound.cx/message/email/domain", headers=headers).json()

# Delete domain
requests.delete("https://{namespace}.api.unbound.cx/message/email/domain/domain-id", headers=headers)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Verify a domain
curl -X POST "https://{namespace}.api.unbound.cx/message/email/domain" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"domain": "yourcompany.com", "primaryRegion": "us-east-1", "secondaryRegion": "us-west-2", "mailFromSubdomain": "mail"}'

# Get full DNS config
curl -X GET "https://{namespace}.api.unbound.cx/message/email/domain/domain-id" \
  -H "Authorization: Bearer {token}"

# Validate DNS records
curl -X POST "https://{namespace}.api.unbound.cx/message/email/domain/validate" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"domain": "yourcompany.com"}'

# Check status
curl -X GET "https://{namespace}.api.unbound.cx/message/email/domain/status/yourcompany.com" \
  -H "Authorization: Bearer {token}"

# List domains
curl -X GET "https://{namespace}.api.unbound.cx/message/email/domain" \
  -H "Authorization: Bearer {token}"

# Delete domain
curl -X DELETE "https://{namespace}.api.unbound.cx/message/email/domain/domain-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Verified Addresses

Verify individual sending email addresses.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.messaging.email.addresses.create('sender@yourcompany.com');
await api.messaging.email.addresses.list();
await api.messaging.email.addresses.checkStatus('sender@yourcompany.com');
await api.messaging.email.addresses.delete('sender@yourcompany.com');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Create verified address
await fetch("https://{namespace}.api.unbound.cx/message/email/address", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ email: "sender@yourcompany.com" })
});

// List verified addresses
const list = await (await fetch("https://{namespace}.api.unbound.cx/message/email/address", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Check status
const status = await (await fetch("https://{namespace}.api.unbound.cx/message/email/address/status/sender@yourcompany.com", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Delete verified address
await fetch("https://{namespace}.api.unbound.cx/message/email/address/sender@yourcompany.com", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Create verified address
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/address");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["email" => "sender@yourcompany.com"]));
curl_exec($ch);
curl_close($ch);

// List verified addresses
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/address");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$list = json_decode(curl_exec($ch), true);
curl_close($ch);

// Check status
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/address/status/sender@yourcompany.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$status = json_decode(curl_exec($ch), true);
curl_close($ch);

// Delete verified address
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/address/sender@yourcompany.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Create verified address
requests.post("https://{namespace}.api.unbound.cx/message/email/address", headers=headers, json={"email": "sender@yourcompany.com"})

# List verified addresses
addresses = requests.get("https://{namespace}.api.unbound.cx/message/email/address", headers=headers).json()

# Check status
status = requests.get("https://{namespace}.api.unbound.cx/message/email/address/status/sender@yourcompany.com", headers=headers).json()

# Delete verified address
requests.delete("https://{namespace}.api.unbound.cx/message/email/address/sender@yourcompany.com", headers=headers)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Create verified address
curl -X POST "https://{namespace}.api.unbound.cx/message/email/address" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"email": "sender@yourcompany.com"}'

# List verified addresses
curl -X GET "https://{namespace}.api.unbound.cx/message/email/address" \
  -H "Authorization: Bearer {token}"

# Check status
curl -X GET "https://{namespace}.api.unbound.cx/message/email/address/status/sender@yourcompany.com" \
  -H "Authorization: Bearer {token}"

# Delete verified address
curl -X DELETE "https://{namespace}.api.unbound.cx/message/email/address/sender@yourcompany.com" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Email Analytics

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Time-series delivery metrics
const series = await (await fetch("https://{namespace}.api.unbound.cx/message/email/analytics/timeseries", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ period: "24h", granularity: "hour", timezone: "America/New_York" })
})).json();

// Summary stats
const summary = await (await fetch("https://{namespace}.api.unbound.cx/message/email/analytics/summary", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ period: "7d", timezone: "America/Chicago" })
})).json();

// Real-time queue depth
const realtime = await (await fetch("https://{namespace}.api.unbound.cx/message/email/analytics/realtime", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Error analysis by domain
const errors = await (await fetch("https://{namespace}.api.unbound.cx/message/email/analytics/errors", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ period: "7d" })
})).json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Time-series delivery metrics
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/analytics/timeseries");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["period" => "24h", "granularity" => "hour", "timezone" => "America/New_York"]));
$series = json_decode(curl_exec($ch), true);
curl_close($ch);

// Summary stats
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/analytics/summary");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["period" => "7d", "timezone" => "America/Chicago"]));
$summary = json_decode(curl_exec($ch), true);
curl_close($ch);

// Real-time queue depth
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/analytics/realtime");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$realtime = json_decode(curl_exec($ch), true);
curl_close($ch);

// Error analysis by domain
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/analytics/errors");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["period" => "7d"]));
$errors = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Time-series delivery metrics
series = requests.post("https://{namespace}.api.unbound.cx/message/email/analytics/timeseries", headers=headers, json={"period": "24h", "granularity": "hour", "timezone": "America/New_York"}).json()

# Summary stats
summary = requests.post("https://{namespace}.api.unbound.cx/message/email/analytics/summary", headers=headers, json={"period": "7d", "timezone": "America/Chicago"}).json()

# Real-time queue depth
realtime = requests.get("https://{namespace}.api.unbound.cx/message/email/analytics/realtime", headers=headers).json()

# Error analysis by domain
errors = requests.post("https://{namespace}.api.unbound.cx/message/email/analytics/errors", headers=headers, json={"period": "7d"}).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Time-series delivery metrics
curl -X POST "https://{namespace}.api.unbound.cx/message/email/analytics/timeseries" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"period": "24h", "granularity": "hour", "timezone": "America/New_York"}'

# Summary stats
curl -X POST "https://{namespace}.api.unbound.cx/message/email/analytics/summary" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"period": "7d", "timezone": "America/Chicago"}'

# Real-time queue depth
curl -X GET "https://{namespace}.api.unbound.cx/message/email/analytics/realtime" \
  -H "Authorization: Bearer {token}"

# Error analysis by domain
curl -X POST "https://{namespace}.api.unbound.cx/message/email/analytics/errors" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"period": "7d"}'
```

</TabItem>
</Tabs>

---

## Email Queue

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get queued emails
const queued = await (await fetch("https://{namespace}.api.unbound.cx/message/email/queue?status=queued&limit=25", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Get failed emails
const failed = await (await fetch("https://{namespace}.api.unbound.cx/message/email/queue?status=failed&limit=25", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Get sent emails
const sent = await (await fetch("https://{namespace}.api.unbound.cx/message/email/queue?status=sent&limit=25", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Get delivered emails
const delivered = await (await fetch("https://{namespace}.api.unbound.cx/message/email/queue?status=delivered&limit=25", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Or filter manually
const all = await (await fetch("https://{namespace}.api.unbound.cx/message/email/queue?status=queued&page=1&limit=50", {
  headers: { "Authorization": "Bearer {token}" }
})).json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get queued emails
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/queue?status=queued&limit=25");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$queued = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get failed emails
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/queue?status=failed&limit=25");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$failed = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get sent emails
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/queue?status=sent&limit=25");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$sent = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get delivered emails
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/queue?status=delivered&limit=25");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$delivered = json_decode(curl_exec($ch), true);
curl_close($ch);

// Or filter manually
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/queue?status=queued&page=1&limit=50");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$all = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Get queued/failed/sent/delivered emails
queued = requests.get("https://{namespace}.api.unbound.cx/message/email/queue", headers=headers, params={"status": "queued", "limit": 25}).json()
failed = requests.get("https://{namespace}.api.unbound.cx/message/email/queue", headers=headers, params={"status": "failed", "limit": 25}).json()
sent = requests.get("https://{namespace}.api.unbound.cx/message/email/queue", headers=headers, params={"status": "sent", "limit": 25}).json()
delivered = requests.get("https://{namespace}.api.unbound.cx/message/email/queue", headers=headers, params={"status": "delivered", "limit": 25}).json()

# Or filter manually
all_items = requests.get("https://{namespace}.api.unbound.cx/message/email/queue", headers=headers, params={"status": "queued", "page": 1, "limit": 50}).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get queued emails
curl -X GET "https://{namespace}.api.unbound.cx/message/email/queue?status=queued&limit=25" \
  -H "Authorization: Bearer {token}"

# Get failed emails
curl -X GET "https://{namespace}.api.unbound.cx/message/email/queue?status=failed&limit=25" \
  -H "Authorization: Bearer {token}"

# Get sent emails
curl -X GET "https://{namespace}.api.unbound.cx/message/email/queue?status=sent&limit=25" \
  -H "Authorization: Bearer {token}"

# Get delivered emails
curl -X GET "https://{namespace}.api.unbound.cx/message/email/queue?status=delivered&limit=25" \
  -H "Authorization: Bearer {token}"

# Or filter manually
curl -X GET "https://{namespace}.api.unbound.cx/message/email/queue?status=queued&page=1&limit=50" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Email Suppression

Manage email addresses suppressed due to bounces or complaints.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// List bounces
const bounces = await (await fetch("https://{namespace}.api.unbound.cx/message/email/suppression?type=bounce", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// List complaints
const complaints = await (await fetch("https://{namespace}.api.unbound.cx/message/email/suppression?type=complaint", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Custom filter
const all = await (await fetch("https://{namespace}.api.unbound.cx/message/email/suppression?type=bounce&emailAddress=@example.com&page=1", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Check if an address is globally suppressed
const status = await (await fetch("https://{namespace}.api.unbound.cx/message/email/suppression/global/user@example.com", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Request removal from global suppression
await fetch("https://{namespace}.api.unbound.cx/message/email/suppression/removal", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com", reason: "Customer re-opted in via web form" })
});

// Delete a suppression entry
await fetch("https://{namespace}.api.unbound.cx/message/email/suppression/suppression-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ reason: "Customer request" })
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// List bounces
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/suppression?type=bounce");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$bounces = json_decode(curl_exec($ch), true);
curl_close($ch);

// List complaints
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/suppression?type=complaint");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$complaints = json_decode(curl_exec($ch), true);
curl_close($ch);

// Custom filter
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/suppression?type=bounce&emailAddress=@example.com&page=1");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$all = json_decode(curl_exec($ch), true);
curl_close($ch);

// Check if an address is globally suppressed
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/suppression/global/user@example.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$status = json_decode(curl_exec($ch), true);
curl_close($ch);

// Request removal from global suppression
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/suppression/removal");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["email" => "user@example.com", "reason" => "Customer re-opted in via web form"]));
curl_exec($ch);
curl_close($ch);

// Delete a suppression entry
$ch = curl_init("https://{namespace}.api.unbound.cx/message/email/suppression/suppression-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["reason" => "Customer request"]));
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# List bounces
bounces = requests.get("https://{namespace}.api.unbound.cx/message/email/suppression", headers=headers, params={"type": "bounce"}).json()

# List complaints
complaints = requests.get("https://{namespace}.api.unbound.cx/message/email/suppression", headers=headers, params={"type": "complaint"}).json()

# Custom filter
all_items = requests.get("https://{namespace}.api.unbound.cx/message/email/suppression", headers=headers, params={"type": "bounce", "emailAddress": "@example.com", "page": 1}).json()

# Check if an address is globally suppressed
status = requests.get("https://{namespace}.api.unbound.cx/message/email/suppression/global/user@example.com", headers=headers).json()

# Request removal from global suppression
requests.post("https://{namespace}.api.unbound.cx/message/email/suppression/removal", headers=headers, json={"email": "user@example.com", "reason": "Customer re-opted in via web form"})

# Delete a suppression entry
requests.delete("https://{namespace}.api.unbound.cx/message/email/suppression/suppression-id", headers=headers, json={"reason": "Customer request"})
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# List bounces
curl -X GET "https://{namespace}.api.unbound.cx/message/email/suppression?type=bounce" \
  -H "Authorization: Bearer {token}"

# List complaints
curl -X GET "https://{namespace}.api.unbound.cx/message/email/suppression?type=complaint" \
  -H "Authorization: Bearer {token}"

# Custom filter
curl -X GET "https://{namespace}.api.unbound.cx/message/email/suppression?type=bounce&emailAddress=@example.com&page=1" \
  -H "Authorization: Bearer {token}"

# Check if globally suppressed
curl -X GET "https://{namespace}.api.unbound.cx/message/email/suppression/global/user@example.com" \
  -H "Authorization: Bearer {token}"

# Request removal from global suppression
curl -X POST "https://{namespace}.api.unbound.cx/message/email/suppression/removal" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "reason": "Customer re-opted in via web form"}'

# Delete a suppression entry
curl -X DELETE "https://{namespace}.api.unbound.cx/message/email/suppression/suppression-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Customer request"}'
```

</TabItem>
</Tabs>

---

## Campaigns

### Toll-Free

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Create toll-free campaign
await fetch("https://{namespace}.api.unbound.cx/message/campaign/toll-free", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    companyName: "Acme Corp",
    phoneNumber: "+18005551234",
    description: "Customer support SMS",
    useCase: "customer_care"
  })
});

// List toll-free campaigns
const list = await (await fetch("https://{namespace}.api.unbound.cx/message/campaign/toll-free", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Get toll-free campaign
const campaign = await (await fetch("https://{namespace}.api.unbound.cx/message/campaign/toll-free/campaign-id", {
  headers: { "Authorization": "Bearer {token}" }
})).json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Create toll-free campaign
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/toll-free");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "companyName" => "Acme Corp",
    "phoneNumber" => "+18005551234",
    "description" => "Customer support SMS",
    "useCase" => "customer_care"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// List toll-free campaigns
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/toll-free");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$list = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get toll-free campaign
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/toll-free/campaign-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$campaign = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Create toll-free campaign
requests.post("https://{namespace}.api.unbound.cx/message/campaign/toll-free", headers=headers, json={
    "companyName": "Acme Corp",
    "phoneNumber": "+18005551234",
    "description": "Customer support SMS",
    "useCase": "customer_care"
})

# List toll-free campaigns
campaigns = requests.get("https://{namespace}.api.unbound.cx/message/campaign/toll-free", headers=headers).json()

# Get toll-free campaign
campaign = requests.get("https://{namespace}.api.unbound.cx/message/campaign/toll-free/campaign-id", headers=headers).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "companyName": "Acme Corp",
  "phoneNumber": "+18005551234",
  "description": "Customer support SMS",
  "useCase": "customer_care"
}
EOF
)

# Create toll-free campaign
curl -X POST "https://{namespace}.api.unbound.cx/message/campaign/toll-free" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# List toll-free campaigns
curl -X GET "https://{namespace}.api.unbound.cx/message/campaign/toll-free" \
  -H "Authorization: Bearer {token}"

# Get toll-free campaign
curl -X GET "https://{namespace}.api.unbound.cx/message/campaign/toll-free/campaign-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### 10DLC Brands

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Register a brand
const brand = await (await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Acme Support",
    entityType: "PRIVATE_PROFIT",
    companyName: "Acme Corp",
    address1: "123 Main St",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90001",
    country: "US",
    pocEmail: "admin@acme.com",
    pocPhone: "+13235550100",
    vertical: "RETAIL",
    website: "https://acme.com"
  })
})).json();

// Get brand
const b = await (await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// List brands
const brands = await (await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand?status=VERIFIED", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Update brand
await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ website: "https://newsite.com" })
});

// Revet (resubmit for carrier approval)
await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id/revet", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}" }
});

// Get feedback
const feedback = await (await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id/feedback", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Delete brand
await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Register a brand
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "Acme Support",
    "entityType" => "PRIVATE_PROFIT",
    "companyName" => "Acme Corp",
    "address1" => "123 Main St",
    "city" => "Los Angeles",
    "state" => "CA",
    "postalCode" => "90001",
    "country" => "US",
    "pocEmail" => "admin@acme.com",
    "pocPhone" => "+13235550100",
    "vertical" => "RETAIL",
    "website" => "https://acme.com"
]));
$brand = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get brand
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$b = json_decode(curl_exec($ch), true);
curl_close($ch);

// List brands
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand?status=VERIFIED");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$brands = json_decode(curl_exec($ch), true);
curl_close($ch);

// Update brand
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["website" => "https://newsite.com"]));
curl_exec($ch);
curl_close($ch);

// Revet (resubmit for carrier approval)
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id/revet");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_exec($ch);
curl_close($ch);

// Get feedback
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id/feedback");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$feedback = json_decode(curl_exec($ch), true);
curl_close($ch);

// Delete brand
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Register a brand
brand = requests.post("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand", headers=headers, json={
    "name": "Acme Support",
    "entityType": "PRIVATE_PROFIT",
    "companyName": "Acme Corp",
    "address1": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "country": "US",
    "pocEmail": "admin@acme.com",
    "pocPhone": "+13235550100",
    "vertical": "RETAIL",
    "website": "https://acme.com"
}).json()

# Get brand
b = requests.get("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id", headers=headers).json()

# List brands
brands = requests.get("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand", headers=headers, params={"status": "VERIFIED"}).json()

# Update brand
requests.put("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id", headers=headers, json={"website": "https://newsite.com"})

# Revet (resubmit for carrier approval)
requests.post("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id/revet", headers=headers)

# Get feedback
feedback = requests.get("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id/feedback", headers=headers).json()

# Delete brand
requests.delete("https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id", headers=headers)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "Acme Support",
  "entityType": "PRIVATE_PROFIT",
  "companyName": "Acme Corp",
  "address1": "123 Main St",
  "city": "Los Angeles",
  "state": "CA",
  "postalCode": "90001",
  "country": "US",
  "pocEmail": "admin@acme.com",
  "pocPhone": "+13235550100",
  "vertical": "RETAIL",
  "website": "https://acme.com"
}
EOF
)

# Register a brand
curl -X POST "https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Get brand
curl -X GET "https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id" \
  -H "Authorization: Bearer {token}"

# List brands
curl -X GET "https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand?status=VERIFIED" \
  -H "Authorization: Bearer {token}"

# Update brand
curl -X PUT "https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"website": "https://newsite.com"}'

# Revet (resubmit for carrier approval)
curl -X POST "https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id/revet" \
  -H "Authorization: Bearer {token}"

# Get feedback
curl -X GET "https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id/feedback" \
  -H "Authorization: Bearer {token}"

# Delete brand
curl -X DELETE "https://{namespace}.api.unbound.cx/message/campaign/10dlc/brand/brand-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### 10DLC Campaigns

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Create 10DLC campaign
const campaign = await (await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    brandId: "brand-id",
    description: "Customer support and appointment reminders",
    messageFlow: "Users opt-in via web form at acme.com/subscribe",
    helpMessage: "For help, text HELP or call 1-800-555-0100",
    optInMessage: "You've subscribed to Acme alerts. Msg&data rates may apply. Reply STOP to unsubscribe.",
    optOutMessage: "You've been unsubscribed. Reply START to re-subscribe.",
    useCase: "CUSTOMER_CARE"
  })
})).json();

// Update campaign
await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    samples: ["Your appt is tomorrow at 3pm", "Your order shipped!"],
    embeddedLink: false,
    subscriberOptout: true
  })
});

// Get campaign
const c = await (await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// List campaigns
const campaigns = await (await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc", {
  headers: { "Authorization": "Bearer {token}" }
})).json();

// Delete campaign
await fetch("https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Create 10DLC campaign
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "brandId" => "brand-id",
    "description" => "Customer support and appointment reminders",
    "messageFlow" => "Users opt-in via web form at acme.com/subscribe",
    "helpMessage" => "For help, text HELP or call 1-800-555-0100",
    "optInMessage" => "You've subscribed to Acme alerts. Msg&data rates may apply. Reply STOP to unsubscribe.",
    "optOutMessage" => "You've been unsubscribed. Reply START to re-subscribe.",
    "useCase" => "CUSTOMER_CARE"
]));
$campaign = json_decode(curl_exec($ch), true);
curl_close($ch);

// Update campaign
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "samples" => ["Your appt is tomorrow at 3pm", "Your order shipped!"],
    "embeddedLink" => false,
    "subscriberOptout" => true
]));
curl_exec($ch);
curl_close($ch);

// Get campaign
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$c = json_decode(curl_exec($ch), true);
curl_close($ch);

// List campaigns
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$campaigns = json_decode(curl_exec($ch), true);
curl_close($ch);

// Delete campaign
$ch = curl_init("https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Create 10DLC campaign
campaign = requests.post("https://{namespace}.api.unbound.cx/message/campaign/10dlc", headers=headers, json={
    "brandId": "brand-id",
    "description": "Customer support and appointment reminders",
    "messageFlow": "Users opt-in via web form at acme.com/subscribe",
    "helpMessage": "For help, text HELP or call 1-800-555-0100",
    "optInMessage": "You've subscribed to Acme alerts. Msg&data rates may apply. Reply STOP to unsubscribe.",
    "optOutMessage": "You've been unsubscribed. Reply START to re-subscribe.",
    "useCase": "CUSTOMER_CARE"
}).json()

# Update campaign
requests.put("https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id", headers=headers, json={
    "samples": ["Your appt is tomorrow at 3pm", "Your order shipped!"],
    "embeddedLink": False,
    "subscriberOptout": True
})

# Get campaign
c = requests.get("https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id", headers=headers).json()

# List campaigns
campaigns = requests.get("https://{namespace}.api.unbound.cx/message/campaign/10dlc", headers=headers).json()

# Delete campaign
requests.delete("https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id", headers=headers)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "brandId": "brand-id",
  "description": "Customer support and appointment reminders",
  "messageFlow": "Users opt-in via web form at acme.com/subscribe",
  "helpMessage": "For help, text HELP or call 1-800-555-0100",
  "optInMessage": "You've subscribed to Acme alerts. Msg&data rates may apply. Reply STOP to unsubscribe.",
  "optOutMessage": "You've been unsubscribed. Reply START to re-subscribe.",
  "useCase": "CUSTOMER_CARE"
}
EOF
)

# Create 10DLC campaign
curl -X POST "https://{namespace}.api.unbound.cx/message/campaign/10dlc" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

DATA=$(cat <<'EOF'
{
  "samples": ["Your appt is tomorrow at 3pm", "Your order shipped!"],
  "embeddedLink": false,
  "subscriberOptout": true
}
EOF
)

# Update campaign
curl -X PUT "https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Get campaign
curl -X GET "https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id" \
  -H "Authorization: Bearer {token}"

# List campaigns
curl -X GET "https://{namespace}.api.unbound.cx/message/campaign/10dlc" \
  -H "Authorization: Bearer {token}"

# Delete campaign
curl -X DELETE "https://{namespace}.api.unbound.cx/message/campaign/10dlc/campaign-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### 10DLC Brand — External Vetting & 2FA

Some use cases require external vetting for higher throughput, and `PUBLIC_PROFIT` brands must verify via email 2FA before their brand is activated.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Submit external vetting request (for higher throughput tiers)
const vetting = await api.messaging.campaigns.tenDlc.brands.createExternalVetting(
    'brand-id',
    {
        evpId: 'ev-provider-id',          // External vetting provider ID
        vettingClass: 'STANDARD',         // Vetting class requested
    },
);
// {
//   id: "vet-abc123",
//   brandId: "brand-id",
//   evpId: "ev-provider-id",
//   vettingClass: "STANDARD",
//   vettingScore: null,
//   vettingStatus: "PENDING",
//   vettingToken: "vt-xyz789",
//   createDate: "2025-01-15T10:30:00Z"
// }

// Poll for vetting responses
const responses = await api.messaging.campaigns.tenDlc.brands.getExternalVettingResponses('brand-id');
// [
//   {
//     evpId: "ev-provider-id",
//     vettingClass: "STANDARD",
//     vettingScore: 75,
//     vettingStatus: "VETTED_VERIFIED",
//     vettingToken: "vt-xyz789",
//     createDate: "2025-01-15T10:30:00Z",
//     vettedDate: "2025-01-15T11:15:00Z"
//   }
// ]

// Resend 2FA email for PUBLIC_PROFIT brands
await api.messaging.campaigns.tenDlc.brands.resend2fa('brand-id');
// { success: true, message: "2FA email sent to brand contact" }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Submit external vetting
const vetting = await (await fetch(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/externalVetting",
    {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({ evpId: "ev-provider-id", vettingClass: "STANDARD" }),
    }
)).json();

// Get vetting responses
const responses = await (await fetch(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/externalvetting/responses",
    { headers: { "Authorization": "Bearer {token}" } }
)).json();

// Resend 2FA
await fetch(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/resend-2fa",
    { method: "POST", headers: { "Authorization": "Bearer {token}" } }
);
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Submit external vetting
$ch = curl_init("https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/externalVetting");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["evpId" => "ev-provider-id", "vettingClass" => "STANDARD"]));
$vetting = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get vetting responses
$ch = curl_init("https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/externalvetting/responses");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$responses = json_decode(curl_exec($ch), true);
curl_close($ch);

// Resend 2FA
$ch = curl_init("https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/resend-2fa");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
headers = {"Authorization": "Bearer {token}"}

# Submit external vetting
vetting = requests.post(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/externalVetting",
    headers=headers,
    json={"evpId": "ev-provider-id", "vettingClass": "STANDARD"},
).json()

# Get vetting responses
responses = requests.get(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/externalvetting/responses",
    headers=headers,
).json()

# Resend 2FA
requests.post(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/resend-2fa",
    headers=headers,
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{"evpId": "ev-provider-id", "vettingClass": "STANDARD"}
EOF
)

# Submit external vetting
curl -X POST "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/externalVetting" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Get vetting responses
curl -X GET "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/externalvetting/responses" \
  -H "Authorization: Bearer {token}"

# Resend 2FA email
curl -X POST "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/brand/brand-id/resend-2fa" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

#### External Vetting Status Values

| Status | Meaning |
|---|---|
| `PENDING` | Vetting request submitted, waiting for provider response |
| `VETTED_VERIFIED` | Brand verified — higher throughput unlocked |
| `VETTED_UNVERIFIED` | Vetting complete but brand did not meet requirements |
| `SELF_DECLARED` | Brand self-declared (lower throughput tier) |

#### 2FA Note for `PUBLIC_PROFIT` Brands

When you create a `PUBLIC_PROFIT` brand, the point-of-contact email receives a 2FA verification email. The brand will not be approved until this step is completed. Use `resend2fa()` if the email was missed or expired.

---

### 10DLC Campaigns — Advanced Management

Beyond basic CRUD, campaigns support MNO status inspection, operation tracking, and phone number assignment.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Check campaign operation status (async operations like create/update can be polled)
const opStatus = await api.messaging.campaigns.tenDlc.campaigns.getOperationStatus('campaign-id');
// {
//   operationStatus: "COMPLETED",   // "PENDING" | "COMPLETED" | "FAILED"
//   operation: "CREATE",
//   completedDate: "2025-01-15T11:00:00Z"
// }

// Get MNO (Mobile Network Operator) metadata — carrier-level status per campaign
const mnoData = await api.messaging.campaigns.tenDlc.campaigns.getMnoMetaData('campaign-id');
// {
//   mnoMetaData: {
//     ATT:     { tpmScope: "CAMPAIGN", tpm: 2000, brandTier: "TOP" },
//     TMOBILE: { tpmScope: "CAMPAIGN", tpm: 10000, brandTier: "STANDARD" },
//     VERIZON: { tpmScope: "CAMPAIGN", tpm: 3600, brandTier: "STANDARD" }
//   }
// }

// Add a phone number to a campaign
await api.messaging.campaigns.tenDlc.campaigns.addPhoneNumber('campaign-id', {
    phoneNumber: '+13175550100',
});

// Update a phone number's campaign association
await api.messaging.campaigns.tenDlc.campaigns.updatePhoneNumber('campaign-id', {
    phoneNumber: '+13175550100',
    action: 'update',
});

// Remove a phone number from a campaign
await api.messaging.campaigns.tenDlc.campaigns.removePhoneNumber('campaign-id', {
    phoneNumber: '+13175550100',
});

// Check which campaign a phone number is registered to
const status = await api.messaging.campaigns.tenDlc.getPhoneNumberCampaignStatus('+13175550100');
// {
//   phoneNumber: "+13175550100",
//   campaignId: "campaign-id",
//   campaignStatus: "ACTIVE",
//   brandId: "brand-id",
//   useCase: "CUSTOMER_CARE"
// }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Check campaign operation status
const opStatus = await (await fetch(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/operationStatus",
    { headers: { "Authorization": "Bearer {token}" } }
)).json();

// Get MNO metadata
const mnoData = await (await fetch(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/mnoMetaData",
    { headers: { "Authorization": "Bearer {token}" } }
)).json();

// Add phone number to campaign
await fetch(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/phoneNumber",
    {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: "+13175550100" }),
    }
);

// Remove phone number from campaign
await fetch(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/phoneNumber",
    {
        method: "DELETE",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: "+13175550100" }),
    }
);

// Check phone number campaign status
const status = await (await fetch(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/phoneNumber/%2B13175550100/campaignStatus",
    { headers: { "Authorization": "Bearer {token}" } }
)).json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Check campaign operation status
$ch = curl_init("https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/operationStatus");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$opStatus = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get MNO metadata
$ch = curl_init("https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/mnoMetaData");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$mnoData = json_decode(curl_exec($ch), true);
curl_close($ch);

// Add phone number to campaign
$ch = curl_init("https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/phoneNumber");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["phoneNumber" => "+13175550100"]));
curl_exec($ch);
curl_close($ch);

// Remove phone number from campaign
$ch = curl_init("https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/phoneNumber");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["phoneNumber" => "+13175550100"]));
curl_exec($ch);
curl_close($ch);

// Check phone number campaign status
$ph = urlencode("+13175550100");
$ch = curl_init("https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/phoneNumber/$ph/campaignStatus");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$status = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from urllib.parse import quote
headers = {"Authorization": "Bearer {token}"}

# Check campaign operation status
op_status = requests.get(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/operationStatus",
    headers=headers,
).json()

# Get MNO metadata
mno_data = requests.get(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/mnoMetaData",
    headers=headers,
).json()

# Add phone number to campaign
requests.post(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/phoneNumber",
    headers=headers,
    json={"phoneNumber": "+13175550100"},
)

# Remove phone number from campaign
requests.delete(
    "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/phoneNumber",
    headers=headers,
    json={"phoneNumber": "+13175550100"},
)

# Check phone number campaign status
phone = quote("+13175550100")
status = requests.get(
    f"https://{{namespace}}.api.unbound.cx/messaging/campaigns/10dlc/phoneNumber/{phone}/campaignStatus",
    headers=headers,
).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Check campaign operation status
curl -X GET "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/operationStatus" \
  -H "Authorization: Bearer {token}"

# Get MNO metadata
curl -X GET "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/mnoMetaData" \
  -H "Authorization: Bearer {token}"

# Add phone number to campaign
curl -X POST "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/phoneNumber" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+13175550100"}'

# Remove phone number from campaign
curl -X DELETE "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/campaign/campaign-id/phoneNumber" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+13175550100"}'

# Check phone number campaign status (URL-encode the +)
curl -X GET "https://{namespace}.api.unbound.cx/messaging/campaigns/10dlc/phoneNumber/%2B13175550100/campaignStatus" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

#### MNO Throughput Reference

MNO metadata tells you the actual throughput each carrier allows for your campaign. `tpmScope` determines whether the limit is per-campaign or per-brand.

| MNO | Typical tpm (STANDARD brand) | Typical tpm (TOP brand) |
|---|---|---|
| AT&T | 2,000 | 10,000 |
| T-Mobile | 10,000 | 200,000 |
| Verizon | 3,600 | 72,000 |
| US Cellular | 1,000 | 5,000 |

> **Note:** `tpm` = messages per minute. Values vary by use case and are set by carriers. Always fetch live MNO metadata rather than relying on static values.

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
