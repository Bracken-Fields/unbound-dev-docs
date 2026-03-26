---
id: faxes
title: Faxes
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Faxes

`api.messaging.fax` — Send, receive, and track fax transmissions.

---

## `messaging.fax.send(options)`

Send a fax document to a recipient.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const fax = await api.messaging.fax.send({
    to: '+12135550100',
    from: '+18005551234',
    fileUrl: 'https://example.com/document.pdf',
    mediaUrl: 'https://example.com/attachment.pdf',
});

console.log('Fax ID:', fax.id);
console.log('Status:', fax.status);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/messaging/fax', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        to: '+12135550100',
        from: '+18005551234',
        fileUrl: 'https://example.com/document.pdf',
        mediaUrl: 'https://example.com/attachment.pdf',
    }),
});

const fax = await response.json();
console.log('Fax ID:', fax.id);
console.log('Status:', fax.status);
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/messaging/fax');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'to' => '+12135550100',
    'from' => '+18005551234',
    'fileUrl' => 'https://example.com/document.pdf',
    'mediaUrl' => 'https://example.com/attachment.pdf',
]));

$response = curl_exec($ch);
$fax = json_decode($response, true);
curl_close($ch);

echo 'Fax ID: ' . $fax['id'] . "\n";
echo 'Status: ' . $fax['status'] . "\n";
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/messaging/fax',
    headers={
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    json={
        'to': '+12135550100',
        'from': '+18005551234',
        'fileUrl': 'https://example.com/document.pdf',
        'mediaUrl': 'https://example.com/attachment.pdf',
    }
)

fax = response.json()
print(f"Fax ID: {fax['id']}")
print(f"Status: {fax['status']}")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST https://{namespace}.api.unbound.cx/messaging/fax \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+12135550100",
    "from": "+18005551234",
    "fileUrl": "https://example.com/document.pdf",
    "mediaUrl": "https://example.com/attachment.pdf"
  }'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `to` | string | Yes | Recipient fax number (E.164) |
| `from` | string | Yes | Sending fax number (E.164) |
| `fileUrl` | string | — | URL of document to fax |
| `mediaUrl` | string | — | URL of media attachment |

---

## `messaging.fax.list(options?)`

List sent and received faxes.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const faxes = await api.messaging.fax.list({
    limit: 25,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/messaging/fax?limit=25', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer {token}',
    },
});

const faxes = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/messaging/fax?limit=25');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);

$response = curl_exec($ch);
$faxes = json_decode($response, true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/messaging/fax',
    headers={
        'Authorization': 'Bearer {token}',
    },
    params={
        'limit': 25,
    }
)

faxes = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/messaging/fax?limit=25" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `messaging.fax.get(id)`

Get fax status and details.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const fax = await api.messaging.fax.get('fax-id-123');
// fax.status → 'queued' | 'sending' | 'delivered' | 'failed'
// fax.pages → number of pages transmitted
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/messaging/fax/fax-id-123', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer {token}',
    },
});

const fax = await response.json();
// fax.status → 'queued' | 'sending' | 'delivered' | 'failed'
// fax.pages → number of pages transmitted
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/messaging/fax/fax-id-123');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);

$response = curl_exec($ch);
$fax = json_decode($response, true);
curl_close($ch);

// $fax['status'] → 'queued' | 'sending' | 'delivered' | 'failed'
// $fax['pages'] → number of pages transmitted
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/messaging/fax/fax-id-123',
    headers={
        'Authorization': 'Bearer {token}',
    }
)

fax = response.json()
# fax['status'] → 'queued' | 'sending' | 'delivered' | 'failed'
# fax['pages'] → number of pages transmitted
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET https://{namespace}.api.unbound.cx/messaging/fax/fax-id-123 \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>
