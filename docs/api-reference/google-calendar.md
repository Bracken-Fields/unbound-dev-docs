---
id: google-calendar
title: Google Calendar
---

# Google Calendar

`api.googleCalendar` — Sync Google Calendar with Unbound. Set up webhooks to receive calendar change events, list calendars, and fetch events.

---

## `googleCalendar.setupWebhook(options)`

Register a webhook to receive Google Calendar change notifications.

```javascript
const webhook = await api.googleCalendar.setupWebhook({
    calendarId: 'primary',
    eventTypes: ['created', 'updated', 'deleted'],
    webhookUrl: 'https://yourapp.com/webhooks/gcal',
    expirationTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `calendarId` | string | ✅ | Google Calendar ID (use `'primary'` for the main calendar) |
| `eventTypes` | string[] | ✅ | Event types to watch: `'created'`, `'updated'`, `'deleted'` |
| `webhookUrl` | string | ✅ | Your endpoint to receive notifications |
| `expirationTime` | number | — | Unix timestamp (ms) when the webhook should expire |

---

## `googleCalendar.removeWebhook(webhookId)`

```javascript
await api.googleCalendar.removeWebhook('webhook-id-123');
```

---

## `googleCalendar.listWebhooks()`

```javascript
const webhooks = await api.googleCalendar.listWebhooks();
```

---

## `googleCalendar.getCalendarList()`

List all calendars accessible to the connected Google account.

```javascript
const calendars = await api.googleCalendar.getCalendarList();
// Array of { id, summary, primary, accessRole, ... }
```

---

## `googleCalendar.getCalendarEvents(calendarId, options?)`

Fetch events from a calendar with optional time range filtering.

```javascript
const events = await api.googleCalendar.getCalendarEvents('primary', {
    timeMin: '2024-01-01T00:00:00Z',
    timeMax: '2024-01-31T23:59:59Z',
    maxResults: 50,
    orderBy: 'startTime',
});
```

| Option | Type | Description |
|---|---|---|
| `timeMin` | string | ISO 8601 start of range |
| `timeMax` | string | ISO 8601 end of range |
| `maxResults` | number | Maximum events to return |
| `orderBy` | string | `'startTime'` or `'updated'` |

---

## `googleCalendar.processCalendarChange(changeData)`

Process an incoming Google Calendar change notification (called from your webhook handler).

```javascript
// In your webhook handler:
app.post('/webhooks/gcal', async (req, res) => {
    await api.googleCalendar.processCalendarChange(req.body);
    res.sendStatus(200);
});
```
