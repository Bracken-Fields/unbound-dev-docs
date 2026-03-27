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
| `calendarId` | string | ✅ | Google Calendar ID (use `'primary'` for the main calendar) |
| `eventTypes` | string[] | ✅ | Event types: `'created'`, `'updated'`, `'deleted'` |
| `webhookUrl` | string | ✅ | Public HTTPS endpoint to receive notifications |
| `expirationTime` | number | — | Unix timestamp in milliseconds when the webhook expires. Defaults to 30 days if omitted. |

**Response shape:**
```javascript
{
    id: 'wh_abc123',
    calendarId: 'primary',
    eventTypes: ['created', 'updated', 'deleted'],
    webhookUrl: 'https://yourapp.com/webhooks/gcal',
    expirationTime: 1704067200000,
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
}
```

:::tip Webhook expiration
Google Calendar webhooks expire. Set `expirationTime` to at most 30 days out, and use a cron job to call `setupWebhook` again before expiry to rotate the channel. See [Pattern 3](#pattern-3--auto-renewing-webhooks) below.
:::

---

## `googleCalendar.removeWebhook(webhookId)`

Stop receiving notifications for a previously registered webhook channel.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.googleCalendar.removeWebhook('wh_abc123');

// Common pattern: find and remove by calendarId
const webhooks = await api.googleCalendar.listWebhooks();
const toRemove = webhooks.find(w => w.calendarId === 'primary');
if (toRemove) {
    await api.googleCalendar.removeWebhook(toRemove.id);
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch('https://{namespace}.api.unbound.cx/google-calendar/webhooks/wh_abc123', {
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
$ch = curl_init('https://{namespace}.api.unbound.cx/google-calendar/webhooks/wh_abc123');
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
    'https://{namespace}.api.unbound.cx/google-calendar/webhooks/wh_abc123',
    headers={'Authorization': 'Bearer {token}'}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE https://{namespace}.api.unbound.cx/google-calendar/webhooks/wh_abc123 \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `webhookId` | string | ✅ | ID of the webhook to remove |

**Response shape:**
```javascript
{
    success: true,
    id: 'wh_abc123'
}
```

---

## `googleCalendar.listWebhooks()`

List all active webhook registrations for the namespace.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const webhooks = await api.googleCalendar.listWebhooks();

// Check for expiring webhooks (expiring within 24 hours)
const soon = Date.now() + 24 * 60 * 60 * 1000;
const expiring = webhooks.filter(w => w.expirationTime < soon);
console.log(`${expiring.length} webhooks expiring soon`);
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

**Response shape:**
```javascript
[
    {
        id: 'wh_abc123',
        calendarId: 'primary',
        eventTypes: ['created', 'updated', 'deleted'],
        webhookUrl: 'https://yourapp.com/webhooks/gcal',
        expirationTime: 1704067200000,
        createdAt: '2024-01-01T00:00:00Z',
        isActive: true
    },
    // ...
]
```

---

## `googleCalendar.getCalendarList()`

List all calendars accessible to the connected Google account.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const calendars = await api.googleCalendar.getCalendarList();

// Find a specific calendar by name
const work = calendars.find(c => c.summary === 'Work');
console.log(work.id); // Use this id in getCalendarEvents()
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

**Response shape:**
```javascript
[
    {
        id: 'primary',
        summary: 'John Smith',
        description: null,
        timeZone: 'America/New_York',
        accessRole: 'owner',
        backgroundColor: '#9fc6e7',
        foregroundColor: '#000000',
        primary: true
    },
    {
        id: 'team-calendar@group.calendar.google.com',
        summary: 'Team Calendar',
        description: 'Shared team availability',
        timeZone: 'America/Chicago',
        accessRole: 'reader',
        primary: false
    },
    // ...
]
```

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

| Parameter | Type | Required | Description |
|---|---|---|---|
| `calendarId` | string | ✅ | Google Calendar ID (use `'primary'` or an ID from `getCalendarList()`) |
| `options.timeMin` | string | — | ISO 8601 lower bound for event start time |
| `options.timeMax` | string | — | ISO 8601 upper bound for event start time |
| `options.maxResults` | number | — | Maximum number of events to return (default: 250) |
| `options.orderBy` | string | — | Sort order: `'startTime'` (requires `singleEvents`) or `'updated'` |

**Response shape:**
```javascript
{
    items: [
        {
            id: 'event_abc123',
            summary: 'Team Standup',
            description: 'Daily sync',
            location: 'Zoom',
            status: 'confirmed',
            start: {
                dateTime: '2024-01-15T09:00:00-05:00',
                timeZone: 'America/New_York'
            },
            end: {
                dateTime: '2024-01-15T09:30:00-05:00',
                timeZone: 'America/New_York'
            },
            attendees: [
                { email: 'alice@example.com', responseStatus: 'accepted' },
                { email: 'bob@example.com', responseStatus: 'tentative' }
            ],
            organizer: { email: 'alice@example.com', self: true },
            htmlLink: 'https://www.google.com/calendar/event?eid=...',
            created: '2024-01-10T12:00:00Z',
            updated: '2024-01-14T08:30:00Z',
            recurringEventId: null   // set if this is an instance of a recurring event
        },
        // ...
    ],
    nextPageToken: null,   // non-null if more results available
    summary: 'John Smith',
    timeZone: 'America/New_York'
}
```

:::note All-day events
For all-day events, `start` and `end` use `date` instead of `dateTime`:
```javascript
{ start: { date: '2024-01-15' }, end: { date: '2024-01-16' } }
```
:::

---

## `googleCalendar.processCalendarChange(changeData)`

Process an incoming Google Calendar change notification. Call this from your webhook endpoint after Google sends a push notification.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// In your Express webhook handler:
app.post('/webhooks/gcal', async (req, res) => {
    // Always respond 200 quickly — Google will retry on failure
    res.sendStatus(200);

    await api.googleCalendar.processCalendarChange(req.body);
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// In your Express webhook handler:
app.post('/webhooks/gcal', async (req, res) => {
    // Respond immediately, process async
    res.sendStatus(200);

    await fetch('https://{namespace}.api.unbound.cx/google-calendar/process-change', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer {token}',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
    });
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
// In your webhook handler script:
$changeData = json_decode(file_get_contents('php://input'), true);

// Respond 200 immediately
http_response_code(200);

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
```

</TabItem>
<TabItem value="python" label="Python">

```python
# In your Flask webhook handler:
from flask import Flask, request
import requests, threading

app = Flask(__name__)

def process_async(data):
    requests.post(
        'https://{namespace}.api.unbound.cx/google-calendar/process-change',
        headers={'Authorization': 'Bearer {token}'},
        json=data
    )

@app.route('/webhooks/gcal', methods=['POST'])
def handle_gcal_webhook():
    # Process in background, respond 200 immediately
    t = threading.Thread(target=process_async, args=(request.json,))
    t.start()
    return '', 200
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Typically called from your webhook handler, not directly
DATA=$(cat <<'EOF'
{
  "calendarId": "primary",
  "eventId": "event_abc123",
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

| Parameter | Type | Required | Description |
|---|---|---|---|
| `changeData` | object | ✅ | The raw body from Google's push notification |
| `changeData.calendarId` | string | ✅ | The calendar that changed |
| `changeData.eventId` | string | — | The specific event that changed (if applicable) |
| `changeData.changeType` | string | — | `'created'`, `'updated'`, or `'deleted'` |

**Response shape:**
```javascript
{
    success: true,
    processed: true,
    eventId: 'event_abc123',
    changeType: 'updated'
}
```

:::warning Respond 200 first
Google requires your webhook endpoint to respond with HTTP 200 within a few seconds. If you time out or return an error, Google will retry — potentially causing duplicate processing. Always acknowledge the request immediately and process asynchronously.
:::

---

## Common Patterns

### Pattern 1 — Meeting room availability check

Fetch events from multiple room calendars to show free/busy status in a scheduling UI.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function getRoomAvailability(roomCalendarIds, date) {
    const dayStart = `${date}T00:00:00Z`;
    const dayEnd = `${date}T23:59:59Z`;

    // Fetch all room calendars in parallel
    const results = await Promise.all(
        roomCalendarIds.map(async (calId) => {
            const events = await api.googleCalendar.getCalendarEvents(calId, {
                timeMin: dayStart,
                timeMax: dayEnd,
                maxResults: 50,
                orderBy: 'startTime',
            });
            return { calendarId: calId, events: events.items };
        })
    );

    // Build a free/busy map
    return results.map(({ calendarId, events }) => ({
        calendarId,
        busySlots: events.map(e => ({
            start: e.start.dateTime,
            end: e.end.dateTime,
            summary: e.summary,
        })),
        isFreeNow: !events.some(e => {
            const now = new Date().toISOString();
            return e.start.dateTime <= now && e.end.dateTime >= now;
        }),
    }));
}

// Usage
const rooms = await getRoomAvailability(
    ['conf-room-a@example.com', 'conf-room-b@example.com'],
    '2024-01-15'
);
rooms.forEach(r => {
    console.log(`${r.calendarId}: ${r.isFreeNow ? '🟢 Free' : '🔴 Busy'}`);
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function getRoomAvailability(roomCalendarIds, date) {
    const dayStart = `${date}T00:00:00Z`;
    const dayEnd = `${date}T23:59:59Z`;

    const results = await Promise.all(
        roomCalendarIds.map(async (calId) => {
            const params = new URLSearchParams({
                timeMin: dayStart,
                timeMax: dayEnd,
                maxResults: '50',
                orderBy: 'startTime',
            });
            const res = await fetch(
                `https://{namespace}.api.unbound.cx/google-calendar/calendars/${encodeURIComponent(calId)}/events?${params}`,
                { headers: { 'Authorization': 'Bearer {token}' } }
            );
            const data = await res.json();
            return { calendarId: calId, events: data.items };
        })
    );

    return results.map(({ calendarId, events }) => ({
        calendarId,
        busySlots: events.map(e => ({
            start: e.start.dateTime,
            end: e.end.dateTime,
            summary: e.summary,
        })),
        isFreeNow: !events.some(e => {
            const now = new Date().toISOString();
            return e.start.dateTime <= now && e.end.dateTime >= now;
        }),
    }));
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from datetime import datetime

def get_room_availability(room_calendar_ids, date):
    day_start = f"{date}T00:00:00Z"
    day_end = f"{date}T23:59:59Z"
    results = []

    for cal_id in room_calendar_ids:
        response = requests.get(
            f"https://{{namespace}}.api.unbound.cx/google-calendar/calendars/{cal_id}/events",
            headers={"Authorization": "Bearer {token}"},
            params={
                "timeMin": day_start,
                "timeMax": day_end,
                "maxResults": 50,
                "orderBy": "startTime",
            }
        )
        data = response.json()
        events = data.get("items", [])

        now = datetime.utcnow().isoformat() + "Z"
        is_free_now = not any(
            e["start"]["dateTime"] <= now <= e["end"]["dateTime"]
            for e in events if "dateTime" in e.get("start", {})
        )

        results.append({
            "calendarId": cal_id,
            "busySlots": [
                {
                    "start": e["start"]["dateTime"],
                    "end": e["end"]["dateTime"],
                    "summary": e.get("summary"),
                }
                for e in events if "dateTime" in e.get("start", {})
            ],
            "isFreeNow": is_free_now,
        })

    return results
```

</TabItem>
</Tabs>

---

### Pattern 2 — Upcoming events digest

Query the next 7 days of events across all calendars and create a daily digest stored as an Unbound object.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function buildEventDigest() {
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Get all accessible calendars
    const calendars = await api.googleCalendar.getCalendarList();

    // Collect events from all calendars
    const allEvents = [];
    for (const calendar of calendars) {
        const result = await api.googleCalendar.getCalendarEvents(calendar.id, {
            timeMin: now.toISOString(),
            timeMax: weekLater.toISOString(),
            maxResults: 100,
            orderBy: 'startTime',
        });
        allEvents.push(
            ...result.items.map(e => ({
                ...e,
                calendarName: calendar.summary,
            }))
        );
    }

    // Sort by start time
    allEvents.sort((a, b) => {
        const aTime = a.start.dateTime ?? a.start.date;
        const bTime = b.start.dateTime ?? b.start.date;
        return aTime.localeCompare(bTime);
    });

    // Store as an Unbound object for the UI to query
    await api.objects.create({
        object: 'calendar_digests',
        body: {
            generatedAt: now.toISOString(),
            weekStart: now.toISOString(),
            weekEnd: weekLater.toISOString(),
            eventCount: allEvents.length,
            events: JSON.stringify(allEvents),
        },
    });

    console.log(`Digest built with ${allEvents.length} events`);
    return allEvents;
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function buildEventDigest() {
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Get all accessible calendars
    const calRes = await fetch('https://{namespace}.api.unbound.cx/google-calendar/calendars', {
        headers: { 'Authorization': 'Bearer {token}' }
    });
    const calendars = await calRes.json();

    const allEvents = [];
    for (const calendar of calendars) {
        const params = new URLSearchParams({
            timeMin: now.toISOString(),
            timeMax: weekLater.toISOString(),
            maxResults: '100',
            orderBy: 'startTime',
        });
        const evRes = await fetch(
            `https://{namespace}.api.unbound.cx/google-calendar/calendars/${encodeURIComponent(calendar.id)}/events?${params}`,
            { headers: { 'Authorization': 'Bearer {token}' } }
        );
        const evData = await evRes.json();
        allEvents.push(...(evData.items || []).map(e => ({ ...e, calendarName: calendar.summary })));
    }

    // Sort by start time
    allEvents.sort((a, b) => {
        const aTime = a.start.dateTime ?? a.start.date;
        const bTime = b.start.dateTime ?? b.start.date;
        return aTime.localeCompare(bTime);
    });

    return allEvents;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from datetime import datetime, timedelta

def build_event_digest():
    now = datetime.utcnow()
    week_later = now + timedelta(days=7)

    # Get all accessible calendars
    cal_res = requests.get(
        'https://{namespace}.api.unbound.cx/google-calendar/calendars',
        headers={'Authorization': 'Bearer {token}'}
    )
    calendars = cal_res.json()

    all_events = []
    for calendar in calendars:
        ev_res = requests.get(
            f"https://{{namespace}}.api.unbound.cx/google-calendar/calendars/{calendar['id']}/events",
            headers={'Authorization': 'Bearer {token}'},
            params={
                'timeMin': now.isoformat() + 'Z',
                'timeMax': week_later.isoformat() + 'Z',
                'maxResults': 100,
                'orderBy': 'startTime',
            }
        )
        ev_data = ev_res.json()
        for event in ev_data.get('items', []):
            event['calendarName'] = calendar['summary']
            all_events.append(event)

    # Sort by start time
    all_events.sort(key=lambda e: e['start'].get('dateTime', e['start'].get('date', '')))

    return all_events
```

</TabItem>
</Tabs>

---

### Pattern 3 — Auto-renewing webhooks

Google Calendar webhooks expire (max 30 days). This pattern keeps them alive by checking expiry daily and renewing before they expire.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function renewExpiringWebhooks() {
    const webhooks = await api.googleCalendar.listWebhooks();
    const renewThreshold = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 days out

    for (const webhook of webhooks) {
        if (webhook.expirationTime < renewThreshold) {
            console.log(`Renewing webhook ${webhook.id} for calendar ${webhook.calendarId}`);

            // Remove the old webhook
            await api.googleCalendar.removeWebhook(webhook.id);

            // Re-register with a fresh 28-day expiry
            const newWebhook = await api.googleCalendar.setupWebhook({
                calendarId: webhook.calendarId,
                eventTypes: webhook.eventTypes,
                webhookUrl: webhook.webhookUrl,
                expirationTime: Date.now() + 28 * 24 * 60 * 60 * 1000,
            });

            console.log(`Renewed → new id: ${newWebhook.id}`);
        }
    }
}

// Run daily via cron
await renewExpiringWebhooks();
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function renewExpiringWebhooks() {
    const listRes = await fetch('https://{namespace}.api.unbound.cx/google-calendar/webhooks', {
        headers: { 'Authorization': 'Bearer {token}' }
    });
    const webhooks = await listRes.json();
    const renewThreshold = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 days

    for (const webhook of webhooks) {
        if (webhook.expirationTime < renewThreshold) {
            // Remove old webhook
            await fetch(`https://{namespace}.api.unbound.cx/google-calendar/webhooks/${webhook.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer {token}' }
            });

            // Register new webhook
            const newRes = await fetch('https://{namespace}.api.unbound.cx/google-calendar/webhooks', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    calendarId: webhook.calendarId,
                    eventTypes: webhook.eventTypes,
                    webhookUrl: webhook.webhookUrl,
                    expirationTime: Date.now() + 28 * 24 * 60 * 60 * 1000,
                })
            });
            const newWebhook = await newRes.json();
            console.log(`Renewed webhook for ${webhook.calendarId} → new id: ${newWebhook.id}`);
        }
    }
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import time

def renew_expiring_webhooks():
    list_res = requests.get(
        'https://{namespace}.api.unbound.cx/google-calendar/webhooks',
        headers={'Authorization': 'Bearer {token}'}
    )
    webhooks = list_res.json()
    renew_threshold = int(time.time() * 1000) + 3 * 24 * 60 * 60 * 1000  # 3 days

    for webhook in webhooks:
        if webhook['expirationTime'] < renew_threshold:
            # Remove old webhook
            requests.delete(
                f"https://{{namespace}}.api.unbound.cx/google-calendar/webhooks/{webhook['id']}",
                headers={'Authorization': 'Bearer {token}'}
            )

            # Register new webhook
            new_res = requests.post(
                'https://{namespace}.api.unbound.cx/google-calendar/webhooks',
                headers={'Authorization': 'Bearer {token}'},
                json={
                    'calendarId': webhook['calendarId'],
                    'eventTypes': webhook['eventTypes'],
                    'webhookUrl': webhook['webhookUrl'],
                    'expirationTime': int(time.time() * 1000) + 28 * 24 * 60 * 60 * 1000,
                }
            )
            new_webhook = new_res.json()
            print(f"Renewed webhook for {webhook['calendarId']} → new id: {new_webhook['id']}")
```

</TabItem>
</Tabs>

---

### Pattern 4 — Trigger Unbound workflow on calendar event

Use `processCalendarChange` as a webhook handler and trigger a workflow when a meeting is created or updated.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Webhook handler — processes Google Calendar changes and
// triggers a pre-meeting workflow for new meetings with ≥2 attendees
app.post('/webhooks/gcal', async (req, res) => {
    res.sendStatus(200); // Acknowledge immediately

    const change = req.body;

    // Let Unbound process the raw change
    await api.googleCalendar.processCalendarChange(change);

    // If a meeting was created/updated, fetch its details and run a workflow
    if (
        change.changeType === 'created' &&
        change.eventId
    ) {
        // Fetch the updated event to get attendee count
        const events = await api.googleCalendar.getCalendarEvents(change.calendarId, {
            timeMin: new Date().toISOString(),
            timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            maxResults: 10,
        });
        const event = events.items.find(e => e.id === change.eventId);

        if (event && event.attendees && event.attendees.length >= 2) {
            // Trigger a pre-meeting prep workflow
            await api.workflows.trigger({
                workflowId: 'wf_pre_meeting_prep',
                payload: {
                    eventId: event.id,
                    summary: event.summary,
                    startTime: event.start.dateTime,
                    attendees: event.attendees.map(a => a.email),
                    organizer: event.organizer.email,
                },
            });

            console.log(`Triggered pre-meeting workflow for: ${event.summary}`);
        }
    }
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
app.post('/webhooks/gcal', async (req, res) => {
    res.sendStatus(200);

    const change = req.body;

    // Forward to Unbound
    await fetch('https://{namespace}.api.unbound.cx/google-calendar/process-change', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
        body: JSON.stringify(change)
    });

    // Trigger workflow on new meeting creation
    if (change.changeType === 'created' && change.eventId) {
        const params = new URLSearchParams({
            timeMin: new Date().toISOString(),
            timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            maxResults: '10',
        });
        const evRes = await fetch(
            `https://{namespace}.api.unbound.cx/google-calendar/calendars/${change.calendarId}/events?${params}`,
            { headers: { 'Authorization': 'Bearer {token}' } }
        );
        const evData = await evRes.json();
        const event = evData.items?.find(e => e.id === change.eventId);

        if (event?.attendees?.length >= 2) {
            await fetch('https://{namespace}.api.unbound.cx/workflows/wf_pre_meeting_prep/trigger', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event.id,
                    summary: event.summary,
                    startTime: event.start.dateTime,
                    attendees: event.attendees.map(a => a.email),
                })
            });
        }
    }
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
from flask import Flask, request
import requests, threading

app = Flask(__name__)

def handle_change(change):
    # Forward to Unbound
    requests.post(
        'https://{namespace}.api.unbound.cx/google-calendar/process-change',
        headers={'Authorization': 'Bearer {token}'},
        json=change
    )

    # Trigger workflow on new meeting creation
    if change.get('changeType') == 'created' and change.get('eventId'):
        from datetime import datetime, timedelta
        now = datetime.utcnow()
        later = now + timedelta(days=30)

        ev_res = requests.get(
            f"https://{{namespace}}.api.unbound.cx/google-calendar/calendars/{change['calendarId']}/events",
            headers={'Authorization': 'Bearer {token}'},
            params={
                'timeMin': now.isoformat() + 'Z',
                'timeMax': later.isoformat() + 'Z',
                'maxResults': 10,
            }
        )
        events = ev_res.json().get('items', [])
        event = next((e for e in events if e['id'] == change['eventId']), None)

        if event and len(event.get('attendees', [])) >= 2:
            requests.post(
                'https://{namespace}.api.unbound.cx/workflows/wf_pre_meeting_prep/trigger',
                headers={'Authorization': 'Bearer {token}'},
                json={
                    'eventId': event['id'],
                    'summary': event.get('summary'),
                    'startTime': event['start'].get('dateTime'),
                    'attendees': [a['email'] for a in event.get('attendees', [])],
                }
            )

@app.route('/webhooks/gcal', methods=['POST'])
def gcal_webhook():
    t = threading.Thread(target=handle_change, args=(request.json,))
    t.start()
    return '', 200
```

</TabItem>
</Tabs>

---

### Pattern 5 — Today's schedule summary stored in objects

Fetch today's events and store a structured summary record — useful for building a "today at a glance" dashboard widget.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function storeTodaySummary(agentId) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const events = await api.googleCalendar.getCalendarEvents('primary', {
        timeMin: startOfDay.toISOString(),
        timeMax: tomorrow.toISOString(),
        maxResults: 50,
        orderBy: 'startTime',
    });

    const meetings = events.items.filter(e => e.attendees && e.attendees.length > 1);
    const personal = events.items.filter(e => !e.attendees || e.attendees.length <= 1);

    const nextMeeting = meetings.find(e => {
        const start = new Date(e.start.dateTime ?? e.start.date);
        return start > today;
    });

    // Store summary as an Unbound object
    await api.objects.create({
        object: 'daily_summaries',
        body: {
            agentId,
            date: today.toISOString().slice(0, 10),
            totalEvents: events.items.length,
            meetingCount: meetings.length,
            personalEventCount: personal.length,
            nextMeetingAt: nextMeeting?.start?.dateTime ?? null,
            nextMeetingSummary: nextMeeting?.summary ?? null,
            busyMinutes: meetings.reduce((acc, e) => {
                const start = new Date(e.start.dateTime);
                const end = new Date(e.end.dateTime);
                return acc + Math.round((end - start) / 60000);
            }, 0),
            rawEvents: JSON.stringify(events.items),
        },
    });

    return {
        totalEvents: events.items.length,
        meetingCount: meetings.length,
        nextMeeting: nextMeeting?.summary,
    };
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function storeTodaySummary(agentId) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const tomorrow = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const params = new URLSearchParams({
        timeMin: startOfDay.toISOString(),
        timeMax: tomorrow.toISOString(),
        maxResults: '50',
        orderBy: 'startTime',
    });

    const evRes = await fetch(
        `https://{namespace}.api.unbound.cx/google-calendar/calendars/primary/events?${params}`,
        { headers: { 'Authorization': 'Bearer {token}' } }
    );
    const evData = await evRes.json();
    const items = evData.items || [];

    const meetings = items.filter(e => e.attendees && e.attendees.length > 1);
    const now = new Date().toISOString();
    const nextMeeting = meetings.find(e => (e.start.dateTime ?? '') > now);

    // Store summary as an Unbound object
    await fetch('https://{namespace}.api.unbound.cx/object/daily_summaries', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            agentId,
            date: new Date().toISOString().slice(0, 10),
            totalEvents: items.length,
            meetingCount: meetings.length,
            nextMeetingAt: nextMeeting?.start?.dateTime ?? null,
            nextMeetingSummary: nextMeeting?.summary ?? null,
        })
    });

    return { totalEvents: items.length, meetingCount: meetings.length };
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from datetime import datetime, timedelta

def store_today_summary(agent_id):
    today = datetime.utcnow()
    start_of_day = today.replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow = start_of_day + timedelta(days=1)

    ev_res = requests.get(
        'https://{namespace}.api.unbound.cx/google-calendar/calendars/primary/events',
        headers={'Authorization': 'Bearer {token}'},
        params={
            'timeMin': start_of_day.isoformat() + 'Z',
            'timeMax': tomorrow.isoformat() + 'Z',
            'maxResults': 50,
            'orderBy': 'startTime',
        }
    )
    items = ev_res.json().get('items', [])

    meetings = [e for e in items if len(e.get('attendees', [])) > 1]
    now = today.isoformat() + 'Z'
    next_meeting = next(
        (e for e in meetings if e['start'].get('dateTime', '') > now),
        None
    )

    # Store summary as an Unbound object
    requests.post(
        'https://{namespace}.api.unbound.cx/object/daily_summaries',
        headers={'Authorization': 'Bearer {token}'},
        json={
            'agentId': agent_id,
            'date': today.strftime('%Y-%m-%d'),
            'totalEvents': len(items),
            'meetingCount': len(meetings),
            'nextMeetingAt': next_meeting['start'].get('dateTime') if next_meeting else None,
            'nextMeetingSummary': next_meeting.get('summary') if next_meeting else None,
        }
    )

    return {'totalEvents': len(items), 'meetingCount': len(meetings)}
```

</TabItem>
</Tabs>
