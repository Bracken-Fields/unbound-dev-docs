---
id: faxes
title: Faxes
---

# Faxes

`api.messaging.fax` — Send, receive, and track fax transmissions.

---

## `messaging.fax.send(options)`

Send a fax document to a recipient.

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

| Parameter | Type | Required | Description |
|---|---|---|---|
| `to` | string | Yes | Recipient fax number (E.164) |
| `from` | string | Yes | Sending fax number (E.164) |
| `fileUrl` | string | — | URL of document to fax |
| `mediaUrl` | string | — | URL of media attachment |

---

## `messaging.fax.list(options?)`

List sent and received faxes.

```javascript
const faxes = await api.messaging.fax.list({
    limit: 25,
});
```

---

## `messaging.fax.get(id)`

Get fax status and details.

```javascript
const fax = await api.messaging.fax.get('fax-id-123');
// fax.status → 'queued' | 'sending' | 'delivered' | 'failed'
// fax.pages → number of pages transmitted
```
