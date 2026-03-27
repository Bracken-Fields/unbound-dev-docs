---
id: notes
title: Notes
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Notes

`api.notes` — Rich-text notes attached to any CRM object (contacts, leads, tickets, etc.).

Notes support HTML, binary, and structured JSON content formats. A note is always tied to a specific record via `relatedId`, and optionally scoped to a `recordTypeId` for permission control.

---

## Content Formats

Each note stores content in one or more of three formats:

| Format | Field | Use case |
|---|---|---|
| HTML | `content_html` | Rich text from a WYSIWYG editor |
| Binary | `content_binary` | Raw binary (images, attachments encoded as array) |
| JSON | `content_json` | Structured document (e.g., TipTap/ProseMirror JSON) |

You may supply multiple formats simultaneously (e.g., both `content_html` and `content_json`). At least one content format or a title is recommended.

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

**Response**

```javascript
{
    id: "note-id-456",
    relatedId: "contact-id-123",
    recordTypeId: "record-type-id",
    title: "Follow-up call notes",
    content_html: "<p>Customer mentioned interest in <strong>Pro plan</strong>.</p>",
    content_json: null,
    content_binary: null,
    version: 1,
    createdAt: "2026-03-15T14:32:00.000Z",
    updatedAt: "2026-03-15T14:32:00.000Z",
    createdBy: "user-id-789"
}
```

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

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `relatedId` | string | ✅ | Filter notes to this object's ID |
| `recordTypeId` | string | — | Filter by record type |
| `limit` | number | — | Max records to return |
| `orderBy` | string | — | Field to sort by (e.g., `'createdAt'`, `'updatedAt'`) |
| `orderDirection` | string | — | `'asc'` or `'desc'` (default: `'desc'`) |

**Response**

```javascript
[
    {
        id: "note-id-456",
        relatedId: "contact-id-123",
        recordTypeId: "record-type-id",
        title: "Follow-up call notes",
        content_html: "<p>Customer mentioned interest in Pro plan.</p>",
        content_json: null,
        content_binary: null,
        version: 1,
        createdAt: "2026-03-15T14:32:00.000Z",
        updatedAt: "2026-03-15T14:32:00.000Z",
        createdBy: "user-id-789"
    },
    // ...
]
```

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

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `noteId` | string | ✅ | ID of the note to retrieve |

**Response**

```javascript
{
    id: "note-id-456",
    relatedId: "contact-id-123",
    recordTypeId: "record-type-id",
    title: "Follow-up call notes",
    content_html: "<p>Customer mentioned interest in <strong>Pro plan</strong>.</p>",
    content_json: null,
    content_binary: null,
    version: 1,
    createdAt: "2026-03-15T14:32:00.000Z",
    updatedAt: "2026-03-15T14:32:00.000Z",
    createdBy: "user-id-789"
}
```

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

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `noteId` | string | ✅ | ID of the note to update |
| `title` | string | — | New note title |
| `content_html` | string | — | Replacement HTML content |
| `content_binary` | array | — | Replacement binary content |
| `content_json` | object | — | Replacement structured JSON content |
| `version` | number | — | Content version (used for optimistic locking) |

**Response**

```javascript
{
    id: "note-id-456",
    relatedId: "contact-id-123",
    recordTypeId: "record-type-id",
    title: "Updated call notes",
    content_html: "<p>Updated content.</p>",
    content_json: null,
    content_binary: null,
    version: 2,
    createdAt: "2026-03-15T14:32:00.000Z",
    updatedAt: "2026-03-15T15:10:00.000Z",
    createdBy: "user-id-789"
}
```

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

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `noteId` | string | ✅ | ID of the note to delete |

**Response**

```javascript
true
```

---

## Common Patterns

### Pattern 1 — Post-call note with HTML rich text

Attach a formatted call summary to a contact record after a task completes:

```javascript
async function saveCallNote(api, contactId, recordTypeId, callSummary) {
    const note = await api.notes.create({
        relatedId: contactId,
        recordTypeId,
        title: `Call — ${new Date().toLocaleDateString()}`,
        content_html: `
            <h3>Call Summary</h3>
            <p>${callSummary.text}</p>
            <ul>
                <li><strong>Duration:</strong> ${callSummary.duration}s</li>
                <li><strong>Disposition:</strong> ${callSummary.disposition}</li>
                <li><strong>Agent:</strong> ${callSummary.agentName}</li>
            </ul>
        `,
    });
    console.log('Note saved:', note.id);
    return note.id;
}
```

### Pattern 2 — Structured TipTap / ProseMirror JSON

Store rich structured content compatible with TipTap editors:

```javascript
const note = await api.notes.create({
    relatedId: 'contact-id-123',
    title: 'Onboarding checklist',
    content_json: {
        type: 'doc',
        content: [
            {
                type: 'heading',
                attrs: { level: 2 },
                content: [{ type: 'text', text: 'Onboarding Steps' }],
            },
            {
                type: 'taskList',
                content: [
                    {
                        type: 'taskItem',
                        attrs: { checked: true },
                        content: [{ type: 'text', text: 'Welcome email sent' }],
                    },
                    {
                        type: 'taskItem',
                        attrs: { checked: false },
                        content: [{ type: 'text', text: 'Schedule kickoff call' }],
                    },
                ],
            },
        ],
    },
});
```

### Pattern 3 — List and display notes for a contact

Fetch notes in reverse chronological order and render them in a feed:

```javascript
async function getNotesFeed(api, contactId, limit = 10) {
    const notes = await api.notes.list({
        relatedId: contactId,
        limit,
        orderBy: 'createdAt',
        orderDirection: 'desc',
    });

    return notes.map(n => ({
        id: n.id,
        title: n.title || 'Untitled note',
        preview: n.content_html
            ? n.content_html.replace(/<[^>]+>/g, '').slice(0, 120) + '…'
            : '(no content)',
        createdAt: n.createdAt,
        author: n.createdBy,
    }));
}
```

### Pattern 4 — Versioned note update (optimistic locking)

Fetch a note's current version, then update it only if the version hasn't changed:

```javascript
async function safeUpdateNote(api, noteId, newHtml) {
    // 1. Get current state
    const current = await api.notes.get(noteId);

    // 2. Update with version — prevents overwriting concurrent edits
    const updated = await api.notes.update(noteId, {
        content_html: newHtml,
        version: current.version + 1,
    });

    console.log('Updated to version:', updated.version);
    return updated;
}
```

### Pattern 5 — Bulk note cleanup (delete old notes)

Delete all notes older than 90 days for a record:

```javascript
async function pruneOldNotes(api, relatedId, daysOld = 90) {
    const notes = await api.notes.list({
        relatedId,
        limit: 100,
        orderBy: 'createdAt',
        orderDirection: 'asc',
    });

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);

    const stale = notes.filter(n => new Date(n.createdAt) < cutoff);

    for (const note of stale) {
        await api.notes.delete(note.id);
        console.log('Deleted note:', note.id);
    }

    console.log(`Pruned ${stale.length} notes older than ${daysOld} days`);
    return stale.length;
}
```

### Pattern 6 — AI-generated call summary note

Use the AI service to summarize a transcript and save it as a note:

```javascript
async function saveAiSummaryNote(api, contactId, recordTypeId, transcript) {
    // Generate summary with AI
    const { result } = await api.ai.run({
        prompt: `Summarize this call transcript in 2-3 sentences:\n\n${transcript}`,
        model: 'gpt-4o-mini',
    });

    // Save structured note
    const note = await api.notes.create({
        relatedId: contactId,
        recordTypeId,
        title: `AI Summary — ${new Date().toISOString().split('T')[0]}`,
        content_html: `
            <div class="ai-summary">
                <p><em>AI-generated summary</em></p>
                <p>${result}</p>
            </div>
            <details>
                <summary>Full transcript</summary>
                <pre>${transcript}</pre>
            </details>
        `,
    });

    return note.id;
}
```
