---
id: google-calendar
title: Google Calendar
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Google Calendar

`api.googleCalendar` — Sync Google Calendar with Unbound. Set up webhooks to receive calendar change events, list calendars, and fetch events.

---

## `googleCalendar.setupWebhook(options)`

Register a webhook to receive Google Calendar change notifications.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const webhook = await api.googleCalendar.setupWebhook({
    calendarId: 'primary',
    eventTypes: ['created', 'updated', 'deleted'],
    webhookUrl: 'https://yourapp.com/webhooks/gcal',
    expirationTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/google-calendar/webhooks', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        calendarId: 'primary',
        eventTypes: ['created', 'updated', 'deleted'],
        webhookUrl: 'https://yourapp.com/webhooks/gcal',
        expirationTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }),
});
const webhook = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/google-calendar/webhooks');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'calendarId' => 'primary',
    'eventTypes' => ['created', 'updated', 'deleted'],
    'webhookUrl' => 'https://yourapp.com/webhooks/gcal',
    'expirationTime' => time() * 1000 + 7 * 24 * 60 * 60 * 1000,
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$webhook = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import time

response = requests.post(
    'https://{namespace}.api.unbound.cx/google-calendar/webhooks',
    headers={'Authorization': 'Bearer {token}'},
    json={
        'calendarId': 'primary',
        'eventTypes': ['created', 'updated', 'deleted'],
        'webhookUrl': 'https://yourapp.com/webhooks/gcal',
        'expirationTime': int(time.time() * 1000) + 7 * 24 * 60 * 60 * 1000,
    }
)
webhook = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "calendarId": "primary",
  "eventTypes": ["created", "updated", "deleted"],
  "webhookUrl": "https://yourapp.com/webhooks/gcal",
  "expirationTime": 1672531200000
}
EOF
)

curl -X POST https://{namespace}.api.unbound.cx/google-calendar/webhooks \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `calendarId` | string | ✅ | Google Calendar ID |
| `eventTypes` | string[] | ✅ | Event types to watch |
| `webhookUrl` | string | ✅ | Your endpoint |
| `expirationTime` | number | — | Unix timestamp (ms) |

---

## `googleCalendar.removeWebhook(webhookId)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.googleCalendar.removeWebhook('webhook-id-123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch('https://{namespace}.api.unbound.cx/google-calendar/webhooks/webhook-id-123', {
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
$ch = curl_init('https://{namespace}.api.unbound.cx/google-calendar/webhooks/webhook-id-123');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

requests.delete(
    'https://{namespace}.api.unbound.cx/google-calendar/webhooks/webhook-id-123',
    headers={'Authorization': 'Bearer {token}'}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE https://{namespace}.api.unbound.cx/google-calendar/webhooks/webhook-id-123 \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `googleCalendar.listWebhooks()`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const webhooks = await api.googleCalendar.listWebhooks();
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/google-calendar/webhooks', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const webhooks = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/google-calendar/webhooks');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$webhooks = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/google-calendar/webhooks',
    headers={'Authorization': 'Bearer {token}'}
)
webhooks = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl https://{namespace}.api.unbound.cx/google-calendar/webhooks \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `googleCalendar.getCalendarList()`

List all calendars accessible to the connected Google account.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const calendars = await api.googleCalendar.getCalendarList();
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/google-calendar/calendars', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const calendars = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/google-calendar/calendars');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$calendars = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/google-calendar/calendars',
    headers={'Authorization': 'Bearer {token}'}
)
calendars = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl https://{namespace}.api.unbound.cx/google-calendar/calendars \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `googleCalendar.getCalendarEvents(calendarId, options?)`

Fetch events from a calendar.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const events = await api.googleCalendar.getCalendarEvents('primary', {
    timeMin: '2024-01-01T00:00:00Z',
    timeMax: '2024-01-31T23:59:59Z',
    maxResults: 50,
    orderBy: 'startTime',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
    timeMin: '2024-01-01T00:00:00Z',
    timeMax: '2024-01-31T23:59:59Z',
    maxResults: '50',
    orderBy: 'startTime',
});

const response = await fetch(
    `https://{namespace}.api.unbound.cx/google-calendar/calendars/primary/events?${params}`,
    {
        headers: {
            'Authorization': 'Bearer {token}',
        },
    }
);
const events = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$params = http_build_query([
    'timeMin' => '2024-01-01T00:00:00Z',
    'timeMax' => '2024-01-31T23:59:59Z',
    'maxResults' => 50,
    'orderBy' => 'startTime',
]);

$ch = curl_init('https://{namespace}.api.unbound.cx/google-calendar/calendars/primary/events?' . $params);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$events = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/google-calendar/calendars/primary/events',
    headers={'Authorization': 'Bearer {token}'},
    params={
        'timeMin': '2024-01-01T00:00:00Z',
        'timeMax': '2024-01-31T23:59:59Z',
        'maxResults': 50,
        'orderBy': 'startTime',
    }
)
events = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/google-calendar/calendars/primary/events?timeMin=2024-01-01T00:00:00Z&timeMax=2024-01-31T23:59:59Z&maxResults=50&orderBy=startTime" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

| Option | Type | Description |
|---|---|---|
| `timeMin` | string | ISO 8601 start |
| `timeMax` | string | ISO 8601 end |
| `maxResults` | number | Maximum events |
| `orderBy` | string | `'startTime'` or `'updated'` |

---

## `googleCalendar.processCalendarChange(changeData)`

Process an incoming Google Calendar change notification.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// In your webhook handler:
app.post('/webhooks/gcal', async (req, res) => {
    await api.googleCalendar.processCalendarChange(req.body);
    res.sendStatus(200);
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// In your Express webhook handler:
app.post('/webhooks/gcal', async (req, res) => {
    await fetch('https://{namespace}.api.unbound.cx/google-calendar/process-change', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer {token}',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
    });
    res.sendStatus(200);
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
// In your webhook handler script:
$changeData = json_decode(file_get_contents('php://input'), true);

$ch = curl_init('https://{namespace}.api.unbound.cx/google-calendar/process-change');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($changeData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch);
curl_close($ch);

http_response_code(200);
```

</TabItem>
<TabItem value="python" label="Python">

```python
# In your Flask webhook handler:
from flask import Flask, request
import requests

app = Flask(__name__)

@app.route('/webhooks/gcal', methods=['POST'])
def handle_gcal_webhook():
    requests.post(
        'https://{namespace}.api.unbound.cx/google-calendar/process-change',
        headers={'Authorization': 'Bearer {token}'},
        json=request.json
    )
    return '', 200
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Typically called from your webhook handler, not directly
DATA=$(cat <<'EOF'
{
  "calendarId": "primary",
  "eventId": "event-123",
  "changeType": "updated"
}
EOF
)

curl -X POST https://{namespace}.api.unbound.cx/google-calendar/process-change \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>
