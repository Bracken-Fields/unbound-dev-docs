---
id: notes
title: Notes
---

# Notes

`api.notes` — Rich-text notes attached to any CRM object (contacts, leads, tickets, etc.).

Notes support HTML, binary, and structured JSON content formats.

---

## `notes.create(options)`

```javascript
const note = await api.notes.create({
  relatedId: 'contact-id-123',      // Required: object this note belongs to
  recordTypeId: 'record-type-id',   // Optional: permission scope
  title: 'Follow-up call notes',
  content_html: '<p>Customer mentioned interest in <strong>Pro plan</strong>.</p>',
});
```

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

```javascript
const notes = await api.notes.list({
  relatedId: 'contact-id-123',
  recordTypeId: 'record-type-id',
  limit: 25,
  orderBy: 'createdAt',
  orderDirection: 'desc',
});
```

---

## `notes.get(noteId)`

```javascript
const note = await api.notes.get('note-id-456');
```

---

## `notes.update(noteId, options)`

```javascript
await api.notes.update('note-id-456', {
  title: 'Updated call notes',
  content_html: '<p>Updated content.</p>',
});
```

---

## `notes.delete(noteId)`

```javascript
await api.notes.delete('note-id-456');
```
