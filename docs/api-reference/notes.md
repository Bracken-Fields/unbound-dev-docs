---
id: notes
title: Notes
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Notes

`api.notes` — Rich-text notes attached to any CRM object (contacts, leads, tickets, etc.).

Notes support HTML, binary, and structured JSON content formats.

---

## `notes.create(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const note = await api.notes.create({
    relatedId: 'contact-id-123',      // Required: object this note belongs to
    recordTypeId: 'record-type-id',   // Optional: permission scope
    title: 'Follow-up call notes',
    content_html: '<p>Customer mentioned interest in <strong>Pro plan</strong>.</p>',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/note', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        relatedId: 'contact-id-123',
        recordTypeId: 'record-type-id',
        title: 'Follow-up call notes',
        content_html: '<p>Customer mentioned interest in <strong>Pro plan</strong>.</p>',
    }),
});
const note = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/note');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'relatedId' => 'contact-id-123',
    'recordTypeId' => 'record-type-id',
    'title' => 'Follow-up call notes',
    'content_html' => '<p>Customer mentioned interest in <strong>Pro plan</strong>.</p>',
]));
$response = curl_exec($ch);
$note = json_decode($response, true);
curl_close($ch);
?>
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/note',
    headers={
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    json={
        'relatedId': 'contact-id-123',
        'recordTypeId': 'record-type-id',
        'title': 'Follow-up call notes',
        'content_html': '<p>Customer mentioned interest in <strong>Pro plan</strong>.</p>',
    }
)
note = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "relatedId": "contact-id-123",
  "recordTypeId": "record-type-id",
  "title": "Follow-up call notes",
  "content_html": "<p>Customer mentioned interest in <strong>Pro plan</strong>.</p>"
}
EOF
)

curl -X POST 'https://{namespace}.api.unbound.cx/note' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `relatedId` | string | ✅ | ID of the object this note is attached to |
| `recordTypeId` | string | — | Record type for permission scoping |
| `title` | string | — | Note title |
| `content_html` | string | — | HTML content |
| `content_binary` | array | — | Binary content |
| `content_json` | object | — | Structured JSON (e.g., TipTap document) |
| `version` | number | — | Content version number |

---

## `notes.list(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const notes = await api.notes.list({
    relatedId: 'contact-id-123',
    recordTypeId: 'record-type-id',
    limit: 25,
    orderBy: 'createdAt',
    orderDirection: 'desc',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
    relatedId: 'contact-id-123',
    recordTypeId: 'record-type-id',
    limit: '25',
    orderBy: 'createdAt',
    orderDirection: 'desc',
});
const response = await fetch(`https://{namespace}.api.unbound.cx/note?${params}`, {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const notes = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$params = http_build_query([
    'relatedId' => 'contact-id-123',
    'recordTypeId' => 'record-type-id',
    'limit' => 25,
    'orderBy' => 'createdAt',
    'orderDirection' => 'desc',
]);
$ch = curl_init("https://{namespace}.api.unbound.cx/note?{$params}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
$response = curl_exec($ch);
$notes = json_decode($response, true);
curl_close($ch);
?>
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/note',
    headers={
        'Authorization': 'Bearer {token}',
    },
    params={
        'relatedId': 'contact-id-123',
        'recordTypeId': 'record-type-id',
        'limit': 25,
        'orderBy': 'createdAt',
        'orderDirection': 'desc',
    }
)
notes = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET 'https://{namespace}.api.unbound.cx/note?relatedId=contact-id-123&recordTypeId=record-type-id&limit=25&orderBy=createdAt&orderDirection=desc' \
  -H 'Authorization: Bearer {token}'
```

</TabItem>
</Tabs>

---

## `notes.get(noteId)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const note = await api.notes.get('note-id-456');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/note/note-id-456', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const note = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/note/note-id-456');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
$response = curl_exec($ch);
$note = json_decode($response, true);
curl_close($ch);
?>
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/note/note-id-456',
    headers={
        'Authorization': 'Bearer {token}',
    }
)
note = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET 'https://{namespace}.api.unbound.cx/note/note-id-456' \
  -H 'Authorization: Bearer {token}'
```

</TabItem>
</Tabs>

---

## `notes.update(noteId, options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.notes.update('note-id-456', {
    title: 'Updated call notes',
    content_html: '<p>Updated content.</p>',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/note/note-id-456', {
    method: 'PUT',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        title: 'Updated call notes',
        content_html: '<p>Updated content.</p>',
    }),
});
const note = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/note/note-id-456');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'title' => 'Updated call notes',
    'content_html' => '<p>Updated content.</p>',
]));
$response = curl_exec($ch);
$note = json_decode($response, true);
curl_close($ch);
?>
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.put(
    'https://{namespace}.api.unbound.cx/note/note-id-456',
    headers={
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    json={
        'title': 'Updated call notes',
        'content_html': '<p>Updated content.</p>',
    }
)
note = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "title": "Updated call notes",
  "content_html": "<p>Updated content.</p>"
}
EOF
)

curl -X PUT 'https://{namespace}.api.unbound.cx/note/note-id-456' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

## `notes.delete(noteId)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.notes.delete('note-id-456');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/note/note-id-456', {
    method: 'DELETE',
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/note/note-id-456');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_exec($ch);
curl_close($ch);
?>
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    'https://{namespace}.api.unbound.cx/note/note-id-456',
    headers={
        'Authorization': 'Bearer {token}',
    }
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE 'https://{namespace}.api.unbound.cx/note/note-id-456' \
  -H 'Authorization: Bearer {token}'
```

</TabItem>
</Tabs>
