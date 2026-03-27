---
id: subscriptions
title: Subscriptions
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Subscriptions

`api.subscriptions` — Real-time event subscriptions via WebSocket. Subscribe to platform events and react as they happen.

---

## Overview

The subscriptions service uses Socket.io under the hood. In browser environments it uses WebSocket transport automatically. Pass `socketStore` to your SDK constructor for optimized performance in Svelte/browser apps.

**Base URL:** `https://{namespace}.api.unbound.cx`

**Authentication:** `Authorization: Bearer {token}`

---

## `subscriptions.socket.getConnection(sessionId?)`

Get or create a WebSocket connection for subscriptions.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const connection = await api.subscriptions.socket.getConnection();
// connection.sessionId → your socket session ID
// connection.endpoint → WebSocket endpoint
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/subscription/socket/connection", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/subscription/socket/connection");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/subscription/socket/connection",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/subscription/socket/connection" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

</TabItem>
</Tabs>

---

## `subscriptions.socket.create(sessionId, subscriptionParams)`

Subscribe to a specific event or data stream.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const sub = await api.subscriptions.socket.create(sessionId, {
    channel: 'engagements',
    filters: {
        queueId: 'queue-id',
        status: ['new', 'working'],
    },
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/subscription/socket", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId: "{sessionId}",
    channel: "engagements",
    filters: {
      queueId: "queue-id",
      status: ["new", "working"]
    }
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/subscription/socket");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "sessionId" => "{sessionId}",
    "channel" => "engagements",
    "filters" => [
        "queueId" => "queue-id",
        "status" => ["new", "working"]
    ]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/subscription/socket",
    headers={"Authorization": "Bearer {token}"},
    json={
        "sessionId": "{sessionId}",
        "channel": "engagements",
        "filters": {
            "queueId": "queue-id",
            "status": ["new", "working"]
        }
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "sessionId": "{sessionId}",
  "channel": "engagements",
  "filters": {
    "queueId": "queue-id",
    "status": ["new", "working"]
  }
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/subscription/socket" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### Common Subscription Channels

| Channel | Description |
|---|---|
| `engagements` | Real-time engagement session updates |
| `voice` | Call state changes (ringing, answered, ended) |
| `messages` | Inbound SMS/email notifications |
| `video` | Video room participant events |
| `taskRouter` | Task assignment and worker state changes |
| `ai.transcripts` | Live STT transcript updates |
| `engagementMetrics` | Dashboard metrics refresh events |

### Example: Real-Time Engagement Feed

```javascript
import SDK from '@unboundcx/sdk';
import { io } from 'socket.io-client';

const api = new SDK({
    namespace: 'your-namespace',
    token: 'your-jwt',
});

// 1. Get connection details
const { sessionId, endpoint } = await api.subscriptions.socket.getConnection();

// 2. Connect Socket.io
const socket = io(endpoint, { withCredentials: true });

socket.on('connect', async () => {
    // 3. Subscribe to engagement updates
    await api.subscriptions.socket.create(sessionId, {
        channel: 'engagements',
    });
});

// 4. Listen for events
socket.on('engagement:updated', (data) => {
    console.log('Engagement updated:', data.id, data.status);
});

socket.on('voice:call:started', (data) => {
    console.log('Inbound call from:', data.from);
});

socket.on('message:received', (data) => {
    console.log('New SMS from:', data.from, '—', data.body);
});
```

---

## `subscriptions.socket.delete(id, sessionId)`

Unsubscribe from a specific subscription.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.subscriptions.socket.delete(subscriptionId, sessionId);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/subscription/socket/{subscriptionId}", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/subscription/socket/{subscriptionId}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.delete(
    "https://{namespace}.api.unbound.cx/subscription/socket/{subscriptionId}",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/subscription/socket/{subscriptionId}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

</TabItem>
</Tabs>

---

## Browser / Svelte Usage

Pass `socketStore` to the SDK constructor to enable the built-in WebSocket transport — no manual Socket.io setup required:

```javascript
import SDK from '@unboundcx/sdk';
import { socketAppStore } from '$lib/stores/socket.js';

const api = new SDK({
    namespace: 'your-namespace',
    socketStore: socketAppStore,
});

// Subscribe directly — SDK handles the connection
await api.subscriptions.socket.create(sessionId, { channel: 'engagements' });
```
