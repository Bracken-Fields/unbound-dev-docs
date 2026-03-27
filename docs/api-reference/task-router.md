---
id: task-router
title: Task Router
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Task Router

`api.taskRouter` — Unbound's contact center routing engine. Route inbound contacts (calls, chats, emails) to the right agents and queues, manage worker state, control tasks through their full lifecycle, and monitor real-time metrics.

---

## Overview

The Task Router has three sub-namespaces:

| Namespace | Description |
|---|---|
| `api.taskRouter.worker` | Create and manage workers (agents) |
| `api.taskRouter.task` | Create and control tasks through their lifecycle |
| `api.taskRouter.metrics` | Query real-time queue and worker metrics |

### Task Lifecycle

```
pending → assigned → connected → wrapUp → completed
                 ↘ rejected → (back to queue)
                 ↗      ↕ hold ↕
```

| Status | Description |
|---|---|
| `pending` | Task created, waiting in queue |
| `assigned` | Routed to a specific worker, awaiting acceptance |
| `rejected` | Worker rejected; task returns to queue |
| `connected` | Worker accepted the task — active interaction |
| `hold` | Task paused, worker temporarily unavailable |
| `wrapUp` | Interaction ended, worker completing post-task work |
| `completed` | Task finished, removed from routing |

---

## Workers

Workers represent agents that can receive routed tasks. A worker record must exist before an agent can accept tasks from the queue.

### `taskRouter.worker.create(options?)`

Creates a worker in the task router system for a user.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Create a worker for the authenticated user
const result = await api.taskRouter.worker.create();
console.log(result.workerId); // "0860002026012400000006665842155429980"

// Create for a specific user (admin use)
const result = await api.taskRouter.worker.create({ userId: 'user-id-123' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Create a worker for the authenticated user
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({})
});
const data = await res.json();

// Create for a specific user (admin use)
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ userId: "user-id-123" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Create a worker for the authenticated user
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Create for a specific user (admin use)
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["userId" => "user-id-123"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Create a worker for the authenticated user
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker",
    headers={"Authorization": "Bearer {token}"},
    json={}
)
data = response.json()

# Create for a specific user (admin use)
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker",
    headers={"Authorization": "Bearer {token}"},
    json={"userId": "user-id-123"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Create a worker for the authenticated user
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'

# Create for a specific user (admin use)
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-123"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `userId` | string | — | User to create the worker for. Defaults to the authenticated user |

**Response**

```javascript
{
    workerId: "0860002026012400000006665842155429980"
}
```

---

### `taskRouter.worker.get(options?)`

Retrieves worker details for a user.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Get worker for the authenticated user
const worker = await api.taskRouter.worker.get();

// Get worker for a specific user
const worker = await api.taskRouter.worker.get({ userId: 'user-id-123' });
console.log(worker.workerId);
console.log(worker.status);   // 'available' | 'offline' | 'busy'
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get worker for the authenticated user
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const worker = await res.json();

// Get worker for a specific user
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker?userId=user-id-123", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const worker = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get worker for the authenticated user
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$worker = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get worker for a specific user
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker?userId=user-id-123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$worker = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Get worker for the authenticated user
response = requests.get(
    "https://{namespace}.api.unbound.cx/task-router/worker",
    headers={"Authorization": "Bearer {token}"}
)
worker = response.json()

# Get worker for a specific user
response = requests.get(
    "https://{namespace}.api.unbound.cx/task-router/worker",
    headers={"Authorization": "Bearer {token}"},
    params={"userId": "user-id-123"}
)
worker = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get worker for the authenticated user
curl -X GET "https://{namespace}.api.unbound.cx/task-router/worker" \
  -H "Authorization: Bearer {token}"

# Get worker for a specific user
curl -X GET "https://{namespace}.api.unbound.cx/task-router/worker?userId=user-id-123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `userId` | string | — | User whose worker to retrieve. Defaults to the authenticated user |

---

### Worker Status

Set a worker's availability so they can start or stop receiving tasks.

#### `taskRouter.worker.setAvailable(options?)`

Marks the worker as available — they will begin receiving task assignments.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Go available as the authenticated user
const result = await api.taskRouter.worker.setAvailable();

// Go available by workerId
await api.taskRouter.worker.setAvailable({ workerId: '0860002026012400000006665842155429980' });

// Go available by userId
await api.taskRouter.worker.setAvailable({ userId: 'user-id-123' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Go available as the authenticated user
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/available", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({})
});
const data = await res.json();

// Go available by workerId
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/available", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ workerId: "0860002026012400000006665842155429980" })
});
const data = await res.json();

// Go available by userId
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/available", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ userId: "user-id-123" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Go available as the authenticated user
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker/available");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Go available by workerId
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker/available");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["workerId" => "0860002026012400000006665842155429980"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Go available as the authenticated user
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/available",
    headers={"Authorization": "Bearer {token}"},
    json={}
)
data = response.json()

# Go available by workerId
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/available",
    headers={"Authorization": "Bearer {token}"},
    json={"workerId": "0860002026012400000006665842155429980"}
)
data = response.json()

# Go available by userId
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/available",
    headers={"Authorization": "Bearer {token}"},
    json={"userId": "user-id-123"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Go available as the authenticated user
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/available" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'

# Go available by workerId
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/available" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"workerId": "0860002026012400000006665842155429980"}'

# Go available by userId
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/available" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-123"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `workerId` | string | — | Worker to mark available |
| `userId` | string | — | User whose worker to mark available. Defaults to the authenticated user |

**Response**

```javascript
{
    workerId: "0860002026012400000006665842155429980"
}
```

#### `taskRouter.worker.setOffline(options?)`

Marks the worker as offline — they will stop receiving new task assignments.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Go offline as the authenticated user
await api.taskRouter.worker.setOffline();

// Go offline by workerId
await api.taskRouter.worker.setOffline({ workerId: '0860002026012400000006665842155429980' });

// Go offline by userId
await api.taskRouter.worker.setOffline({ userId: 'user-id-123' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Go offline as the authenticated user
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/offline", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({})
});
const data = await res.json();

// Go offline by workerId
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/offline", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ workerId: "0860002026012400000006665842155429980" })
});
const data = await res.json();

// Go offline by userId
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/offline", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ userId: "user-id-123" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Go offline as the authenticated user
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker/offline");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Go offline by workerId
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker/offline");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["workerId" => "0860002026012400000006665842155429980"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Go offline as the authenticated user
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/offline",
    headers={"Authorization": "Bearer {token}"},
    json={}
)
data = response.json()

# Go offline by workerId
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/offline",
    headers={"Authorization": "Bearer {token}"},
    json={"workerId": "0860002026012400000006665842155429980"}
)
data = response.json()

# Go offline by userId
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/offline",
    headers={"Authorization": "Bearer {token}"},
    json={"userId": "user-id-123"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Go offline as the authenticated user
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/offline" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'

# Go offline by workerId
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/offline" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"workerId": "0860002026012400000006665842155429980"}'

# Go offline by userId
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/offline" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-123"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `workerId` | string | — | Worker to take offline |
| `userId` | string | — | User whose worker to take offline. Defaults to the authenticated user |

**Response**

```javascript
{
    workerId: "0860002026012400000006665842155429980"
}
```

---

### Queue Management

Workers must be logged into queues to receive tasks from them. Use `queueAutoLogin` on startup and `queueLogoutAll` on shutdown.

#### `taskRouter.worker.queueLogin(options)`

Logs a worker into a specific queue.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.taskRouter.worker.queueLogin({ queueId: 'queue-id' });
console.log(result.userId);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/queue-login", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ queueId: "queue-id" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker/queue-login");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["queueId" => "queue-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/queue-login",
    headers={"Authorization": "Bearer {token}"},
    json={"queueId": "queue-id"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/queue-login" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"queueId": "queue-id"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `queueId` | string | ✅ | Queue to log into |
| `userId` | string | — | User to log in. Defaults to the authenticated user |

#### `taskRouter.worker.queueLogout(options)`

Logs a worker out of a specific queue.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.taskRouter.worker.queueLogout({ queueId: 'queue-id' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/queue-logout", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ queueId: "queue-id" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker/queue-logout");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["queueId" => "queue-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/queue-logout",
    headers={"Authorization": "Bearer {token}"},
    json={"queueId": "queue-id"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/queue-logout" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"queueId": "queue-id"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `queueId` | string | ✅ | Queue to log out of |
| `userId` | string | — | User to log out. Defaults to the authenticated user |

#### `taskRouter.worker.queueAutoLogin(options?)`

Logs the worker into all queues configured with `autoLogin = true`. Typically called after `setAvailable()`.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.taskRouter.worker.queueAutoLogin();

// For a specific user
await api.taskRouter.worker.queueAutoLogin({ userId: 'user-id-123' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Auto-login to configured queues
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/queue-auto-login", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({})
});
const data = await res.json();

// For a specific user
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/queue-auto-login", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ userId: "user-id-123" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Auto-login to configured queues
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker/queue-auto-login");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// For a specific user
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker/queue-auto-login");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["userId" => "user-id-123"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Auto-login to configured queues
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/queue-auto-login",
    headers={"Authorization": "Bearer {token}"},
    json={}
)
data = response.json()

# For a specific user
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/queue-auto-login",
    headers={"Authorization": "Bearer {token}"},
    json={"userId": "user-id-123"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Auto-login to configured queues
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/queue-auto-login" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'

# For a specific user
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/queue-auto-login" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-123"}'
```

</TabItem>
</Tabs>

**Response**

```javascript
{
    userId: "user-id-123"
}
```

#### `taskRouter.worker.queueLogoutAll(options?)`

Logs the worker out of all queues. Typically called during shift end or before `setOffline()`.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.taskRouter.worker.queueLogoutAll();

// For a specific user
await api.taskRouter.worker.queueLogoutAll({ userId: 'user-id-123' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Logout from all queues
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/queue-logout-all", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({})
});
const data = await res.json();

// For a specific user
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/worker/queue-logout-all", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ userId: "user-id-123" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Logout from all queues
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker/queue-logout-all");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// For a specific user
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/worker/queue-logout-all");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["userId" => "user-id-123"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Logout from all queues
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/queue-logout-all",
    headers={"Authorization": "Bearer {token}"},
    json={}
)
data = response.json()

# For a specific user
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/worker/queue-logout-all",
    headers={"Authorization": "Bearer {token}"},
    json={"userId": "user-id-123"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Logout from all queues
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/queue-logout-all" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'

# For a specific user
curl -X POST "https://{namespace}.api.unbound.cx/task-router/worker/queue-logout-all" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-123"}'
```

</TabItem>
</Tabs>

**Response**

```javascript
{
    userId: "user-id-123"
}
```

---

## Tasks

Tasks represent inbound or created contacts moving through the routing system. Each task tracks its assigned worker, queue, skills, and lifecycle status.

### `taskRouter.task.create(options)`

Creates a new task and routes it to a queue.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Minimal — route a phone call to a queue
const task = await api.taskRouter.task.create({
    type: 'phoneCall',
    queueId: 'queue-id',
});
console.log(task.id); // "task789"

// Full example — inbound call with skills and engagement
const task = await api.taskRouter.task.create({
    type: 'phoneCall',
    queueId: 'queue-id',
    priority: 5,
    subject: 'Inbound sales call',
    requiredSkills: ['spanish', 'enterprise-tier'],
    optionalSkills: ['billing'],
    cdrId: 'cdr-id',
    sipCallId: 'sip-call-id',
    peopleId: 'person-id',
    companyId: 'company-id',
    createEngagement: true,
});

// Email task with metadata tracking
const task = await api.taskRouter.task.create({
    type: 'email',
    queueId: 'queue-id',
    subject: 'Support ticket #4821',
    optionalSkills: 'billing',
    relatedObject: 'supportTicket',
    relatedId: 'ticket-id',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Minimal — route a phone call to a queue
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "phoneCall",
    queueId: "queue-id"
  })
});
const task = await res.json();

// Full example — inbound call with skills and engagement
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "phoneCall",
    queueId: "queue-id",
    priority: 5,
    subject: "Inbound sales call",
    requiredSkills: ["spanish", "enterprise-tier"],
    optionalSkills: ["billing"],
    cdrId: "cdr-id",
    sipCallId: "sip-call-id",
    peopleId: "person-id",
    companyId: "company-id",
    createEngagement: true
  })
});
const task = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Minimal — route a phone call to a queue
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "type" => "phoneCall",
    "queueId" => "queue-id"
]));
$task = json_decode(curl_exec($ch), true);
curl_close($ch);

// Full example — inbound call with skills and engagement
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "type" => "phoneCall",
    "queueId" => "queue-id",
    "priority" => 5,
    "subject" => "Inbound sales call",
    "requiredSkills" => ["spanish", "enterprise-tier"],
    "optionalSkills" => ["billing"],
    "cdrId" => "cdr-id",
    "sipCallId" => "sip-call-id",
    "peopleId" => "person-id",
    "companyId" => "company-id",
    "createEngagement" => true
]));
$task = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Minimal — route a phone call to a queue
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task",
    headers={"Authorization": "Bearer {token}"},
    json={
        "type": "phoneCall",
        "queueId": "queue-id"
    }
)
task = response.json()

# Full example — inbound call with skills and engagement
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task",
    headers={"Authorization": "Bearer {token}"},
    json={
        "type": "phoneCall",
        "queueId": "queue-id",
        "priority": 5,
        "subject": "Inbound sales call",
        "requiredSkills": ["spanish", "enterprise-tier"],
        "optionalSkills": ["billing"],
        "cdrId": "cdr-id",
        "sipCallId": "sip-call-id",
        "peopleId": "person-id",
        "companyId": "company-id",
        "createEngagement": True
    }
)
task = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Minimal — route a phone call to a queue
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"type": "phoneCall", "queueId": "queue-id"}'

# Full example — inbound call with skills and engagement
DATA=$(cat <<'EOF'
{
  "type": "phoneCall",
  "queueId": "queue-id",
  "priority": 5,
  "subject": "Inbound sales call",
  "requiredSkills": ["spanish", "enterprise-tier"],
  "optionalSkills": ["billing"],
  "cdrId": "cdr-id",
  "sipCallId": "sip-call-id",
  "peopleId": "person-id",
  "companyId": "company-id",
  "createEngagement": true
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/task-router/task" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `type` | string | ✅ | `'phoneCall'`, `'chat'`, `'email'`, or `'other'` |
| `queueId` | string | ✅ | Queue to route this task to |
| `priority` | number | — | Routing priority; higher = higher priority. Default: `0` |
| `subject` | string | — | Task title. Defaults to `"New {type}"` |
| `requiredSkills` | string \| string[] | — | Skill IDs workers **must** have |
| `optionalSkills` | string \| string[] | — | Skill IDs that are preferred but not required |
| `skills` | string \| string[] | — | Alias for `requiredSkills` |
| `cdrId` | string | — | Call Detail Record ID — links a voice task to its CDR |
| `sipCallId` | string | — | SIP call leg ID to associate with this task |
| `peopleId` | string | — | Associated contact (People record) |
| `companyId` | string | — | Associated company |
| `createEngagement` | boolean | — | Auto-create an engagement session when task is created |
| `relatedObject` | string | — | Object type for metadata tracking (e.g., `'supportTicket'`) |
| `relatedId` | string | — | Object ID for metadata tracking |

**Response**

```javascript
{
    id: "task-id-789",
    type: "phoneCall",
    status: "pending",
    queueId: "queue-id",
    priority: 5,
    subject: "Inbound sales call"
}
```

---

### `taskRouter.task.accept(options)`

Accepts a task that has been assigned to a worker. Changes status from `assigned` → `connected`.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Accept as the authenticated user
const result = await api.taskRouter.task.accept({ taskId: 'task-id' });
console.log(result.status); // "connected"

// Accept by userId
const result = await api.taskRouter.task.accept({
    taskId: 'task-id',
    userId: 'user-id',
});

// Accept by workerId (alternative to userId)
const result = await api.taskRouter.task.accept({
    taskId: 'task-id',
    workerId: 'worker-id',
});

// Accept and link to a SIP call leg
const result = await api.taskRouter.task.accept({
    taskId: 'task-id',
    userId: 'user-id',
    workerSipCallId: 'sip-call-leg-id',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Accept as the authenticated user
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/accept", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id" })
});
const data = await res.json();

// Accept and link to a SIP call leg
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/accept", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    taskId: "task-id",
    userId: "user-id",
    workerSipCallId: "sip-call-leg-id"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Accept as the authenticated user
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/accept");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["taskId" => "task-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Accept and link to a SIP call leg
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/accept");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "taskId" => "task-id",
    "userId" => "user-id",
    "workerSipCallId" => "sip-call-leg-id"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Accept as the authenticated user
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/accept",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id"}
)
data = response.json()

# Accept and link to a SIP call leg
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/accept",
    headers={"Authorization": "Bearer {token}"},
    json={
        "taskId": "task-id",
        "userId": "user-id",
        "workerSipCallId": "sip-call-leg-id"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Accept as the authenticated user
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/accept" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id"}'

# Accept and link to a SIP call leg
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/accept" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id", "userId": "user-id", "workerSipCallId": "sip-call-leg-id"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to accept |
| `userId` | string | — | User accepting the task. Defaults to the authenticated user |
| `workerId` | string | — | Worker accepting the task (alternative to `userId`) |
| `workerSipCallId` | string | — | SIP call leg ID for the worker's phone connection |

**Response**

```javascript
{
    taskId: "task-id-789",
    workerId: "worker-id-456",
    userId: "user-id-123",
    workerSipCallId: "sip-call-leg-id",
    status: "connected"
}
```

---

### `taskRouter.task.reject(options)`

Rejects an assigned task. The task returns to the queue for reassignment.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Reject as the authenticated user
await api.taskRouter.task.reject({ taskId: 'task-id' });

// Reject on behalf of a specific user
await api.taskRouter.task.reject({
    taskId: 'task-id',
    userId: 'user-id',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Reject as the authenticated user
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/reject", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id" })
});
const data = await res.json();

// Reject on behalf of a specific user
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/reject", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id", userId: "user-id" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Reject as the authenticated user
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/reject");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["taskId" => "task-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Reject on behalf of a specific user
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/reject");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["taskId" => "task-id", "userId" => "user-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Reject as the authenticated user
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/reject",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id"}
)
data = response.json()

# Reject on behalf of a specific user
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/reject",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id", "userId": "user-id"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Reject as the authenticated user
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/reject" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id"}'

# Reject on behalf of a specific user
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/reject" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id", "userId": "user-id"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to reject |
| `userId` | string | — | User rejecting the task. Defaults to the authenticated user |

**Response**

```javascript
{
    taskId: "task-id-789",
    workerId: "worker-id-456",
    userId: "user-id-123",
    status: "pending"   // returned to queue
}
```

---

### `taskRouter.task.hold(options)`

Toggles hold state on a connected task. `connected` → `hold`, or `hold` → `connected`.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Put on hold
const result = await api.taskRouter.task.hold({ taskId: 'task-id' });
console.log(result.status); // "hold"

// Resume from hold (same call toggles it back)
const result = await api.taskRouter.task.hold({ taskId: 'task-id' });
console.log(result.status); // "connected"
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Toggle hold on a task
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/hold", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/hold");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["taskId" => "task-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/hold",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/hold" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to toggle hold on |

**Response**

```javascript
{
    taskId: "task-id-789",
    status: "hold"   // or "connected"
}
```

---

### `taskRouter.task.wrapUp(options)`

Transitions a connected or held task to `wrapUp` status. The worker can now take notes, set a disposition, or handle follow-up work before completing the task.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.taskRouter.task.wrapUp({ taskId: 'task-id' });
console.log(result.status); // "wrapUp"
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/wrap-up", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/wrap-up");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["taskId" => "task-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/wrap-up",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/wrap-up" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to move to wrap-up |

**Response**

```javascript
{
    taskId: "task-id-789",
    status: "wrapUp"
}
```

---

### `taskRouter.task.wrapUpExtend(options)`

Extends the wrap-up timer for a task currently in `wrapUp` status. Useful when an agent needs more time to complete notes before the task auto-completes.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Extend by queue default (typically 30 seconds)
const result = await api.taskRouter.task.wrapUpExtend({ taskId: 'task-id' });
console.log(result.extend); // 30

// Extend by a specific number of seconds
const result = await api.taskRouter.task.wrapUpExtend({
    taskId: 'task-id',
    extend: 120,   // 2 more minutes
});
console.log(result.extend); // 120
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Extend by queue default
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/wrap-up-extend", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id" })
});
const data = await res.json();

// Extend by a specific number of seconds
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/wrap-up-extend", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id", extend: 120 })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Extend by queue default
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/wrap-up-extend");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["taskId" => "task-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Extend by a specific number of seconds
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/wrap-up-extend");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["taskId" => "task-id", "extend" => 120]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Extend by queue default
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/wrap-up-extend",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id"}
)
data = response.json()

# Extend by a specific number of seconds
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/wrap-up-extend",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id", "extend": 120}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Extend by queue default
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/wrap-up-extend" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id"}'

# Extend by a specific number of seconds
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/wrap-up-extend" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id", "extend": 120}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to extend |
| `extend` | number | — | Seconds to add. Omit to use the queue's default `wrapUpExtend` value |

**Response**

```javascript
{
    taskId: "task-id-789",
    extend: 60
}
```

---

### `taskRouter.task.complete(options)`

Marks a task as completed. Can be called from any non-completed status. Typically called after `wrapUp`.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.taskRouter.task.complete({ taskId: 'task-id' });
console.log(result.status); // "completed"
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/complete", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/complete");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["taskId" => "task-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/complete",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/complete" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to complete |

**Response**

```javascript
{
    taskId: "task-id-789",
    status: "completed"
}
```

---

### `taskRouter.task.update(options)`

Updates metadata on an existing task. At least one updatable field must be provided.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Update subject and disposition after wrap-up
await api.taskRouter.task.update({
    taskId: 'task-id',
    subject: 'Billing inquiry — upgraded to Pro',
    disposition: 'resolved',
    summary: 'Customer upgraded from Core to Pro plan after a discount was offered.',
});

// Update with sentiment data (e.g., from AI analysis)
await api.taskRouter.task.update({
    taskId: 'task-id',
    sentiment: {
        score: 72,           // 0–100
        trend: 'improving',  // 'improving' | 'declining' | 'stable'
    },
});

// Link a SIP call leg after task creation
await api.taskRouter.task.update({
    taskId: 'task-id',
    sipCallId: 'sip-call-id',
    cdrId: 'cdr-id',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Update subject and disposition after wrap-up
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/task-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    subject: "Billing inquiry — upgraded to Pro",
    disposition: "resolved",
    summary: "Customer upgraded from Core to Pro plan after a discount was offered."
  })
});
const data = await res.json();

// Update with sentiment data
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/task-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    sentiment: { score: 72, trend: "improving" }
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Update subject and disposition after wrap-up
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/task-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "subject" => "Billing inquiry — upgraded to Pro",
    "disposition" => "resolved",
    "summary" => "Customer upgraded from Core to Pro plan after a discount was offered."
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Update with sentiment data
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/task-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "sentiment" => ["score" => 72, "trend" => "improving"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Update subject and disposition after wrap-up
response = requests.put(
    "https://{namespace}.api.unbound.cx/task-router/task/task-id",
    headers={"Authorization": "Bearer {token}"},
    json={
        "subject": "Billing inquiry — upgraded to Pro",
        "disposition": "resolved",
        "summary": "Customer upgraded from Core to Pro plan after a discount was offered."
    }
)
data = response.json()

# Update with sentiment data
response = requests.put(
    "https://{namespace}.api.unbound.cx/task-router/task/task-id",
    headers={"Authorization": "Bearer {token}"},
    json={
        "sentiment": {"score": 72, "trend": "improving"}
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Update subject and disposition after wrap-up
DATA=$(cat <<'EOF'
{
  "subject": "Billing inquiry — upgraded to Pro",
  "disposition": "resolved",
  "summary": "Customer upgraded from Core to Pro plan after a discount was offered."
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/task-router/task/task-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Update with sentiment data
curl -X PUT "https://{namespace}.api.unbound.cx/task-router/task/task-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"sentiment": {"score": 72, "trend": "improving"}}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to update |
| `subject` | string | — | New subject/title for the task |
| `disposition` | string | — | Outcome code (e.g., `'resolved'`, `'escalated'`, `'callback-scheduled'`) |
| `summary` | string | — | Free-text summary of the interaction |
| `sentiment` | object | — | Sentiment data object (see below) |
| `cdrId` | string | — | Call Detail Record ID to link |
| `sipCallId` | string | — | SIP call leg ID to associate |

**Sentiment object**

```javascript
{
    score: 72,          // number 0–100 (0 = very negative, 100 = very positive)
    trend: 'improving'  // 'improving' | 'declining' | 'stable'
}
```

**Response**

```javascript
{
    taskId: "task-id-789"
}
```

---

### `taskRouter.task.statusEvent(options)`

Fires a status-change event for a task. This is used internally by webhooks and automated processes that need to notify downstream systems when a task status transitions.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.taskRouter.task.statusEvent({
    taskId: 'task-id',
    status: 'completed',
    previousStatus: 'wrapUp',
});
console.log(result.taskId);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/status-event", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    taskId: "task-id",
    status: "completed",
    previousStatus: "wrapUp"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/status-event");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "taskId" => "task-id",
    "status" => "completed",
    "previousStatus" => "wrapUp"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/status-event",
    headers={"Authorization": "Bearer {token}"},
    json={
        "taskId": "task-id",
        "status": "completed",
        "previousStatus": "wrapUp"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/status-event" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id", "status": "completed", "previousStatus": "wrapUp"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task that changed status |
| `status` | string | ✅ | New status value |
| `previousStatus` | string | ✅ | Previous status value |

**Response**

```javascript
{
    taskId: "task-id-789"
}
```

:::note
`statusEvent` is typically called by the Unbound platform automatically. Use it only if you're building a custom integration that manages task state externally.
:::

---

### `taskRouter.task.createCall(options)`

Initiates an outbound call to a worker's extension to bridge them into an active task. The task must have an associated CDR with a bridge ID and cannot be in `completed` or `wrapUp` status.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Dial the authenticated user into a task
const result = await api.taskRouter.task.createCall({ taskId: 'task-id' });
console.log(result.bridgeId); // "bridge-456"

// Dial a specific user into a task
const result = await api.taskRouter.task.createCall({
    taskId: 'task-id',
    userId: 'user-id',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Dial the authenticated user into a task
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/call", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id" })
});
const data = await res.json();

// Dial a specific user into a task
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/call", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id", userId: "user-id" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Dial the authenticated user into a task
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/call");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["taskId" => "task-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Dial a specific user into a task
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/call");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["taskId" => "task-id", "userId" => "user-id"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Dial the authenticated user into a task
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/call",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id"}
)
data = response.json()

# Dial a specific user into a task
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/call",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id", "userId": "user-id"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Dial the authenticated user into a task
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/call" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id"}'

# Dial a specific user into a task
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/call" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id", "userId": "user-id"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Active task to dial the worker into |
| `userId` | string | — | User to call. Defaults to the authenticated user |

**Response**

```javascript
{
    taskId: "task-id-789",
    userId: "user-id-123",
    bridgeId: "bridge-456"
}
```

---

### `taskRouter.task.changePriority(options)`

Adjusts the routing priority of a pending task. Higher priority tasks are assigned to available workers first.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Set priority to an absolute value
await api.taskRouter.task.changePriority({
    taskId: 'task-id',
    action: 'set',
    value: 10,
});

// Increase priority by a delta
await api.taskRouter.task.changePriority({
    taskId: 'task-id',
    action: 'increase',
    value: 5,
});

// Decrease priority by a delta (floor is 0)
await api.taskRouter.task.changePriority({
    taskId: 'task-id',
    action: 'decrease',
    value: 3,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Set priority to an absolute value
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/priority", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id", action: "set", value: 10 })
});
const data = await res.json();

// Increase priority by a delta
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/priority", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ taskId: "task-id", action: "increase", value: 5 })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Set priority to an absolute value
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/priority");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "taskId" => "task-id",
    "action" => "set",
    "value" => 10
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Increase priority by a delta
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/priority");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "taskId" => "task-id",
    "action" => "increase",
    "value" => 5
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Set priority to an absolute value
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/priority",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id", "action": "set", "value": 10}
)
data = response.json()

# Increase priority by a delta
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/priority",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id", "action": "increase", "value": 5}
)
data = response.json()

# Decrease priority by a delta (floor is 0)
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/priority",
    headers={"Authorization": "Bearer {token}"},
    json={"taskId": "task-id", "action": "decrease", "value": 3}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Set priority to an absolute value
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/priority" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id", "action": "set", "value": 10}'

# Increase priority by a delta
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/priority" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id", "action": "increase", "value": 5}'

# Decrease priority by a delta (floor is 0)
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/priority" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id", "action": "decrease", "value": 3}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to reprioritize |
| `action` | string | — | `'set'`, `'increase'`, or `'decrease'`. Default: `'set'` |
| `value` | number | — | Priority value or delta. Default: `0` |

**Response**

```javascript
{
    taskId: "task-id-789",
    priority: 10    // new priority value (min 0)
}
```

---

### `taskRouter.task.updateSkills(options)`

Dynamically adds or removes required/optional skills from an in-flight task. Useful for escalation flows where a task needs different skills mid-queue.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Add required skills to an escalated task
await api.taskRouter.task.updateSkills({
    taskId: 'task-id',
    skills: ['spanish', 'enterprise-tier'],
    action: 'add',
    required: true,
});

// Remove a single optional skill
await api.taskRouter.task.updateSkills({
    taskId: 'task-id',
    skills: 'billing',
    action: 'remove',
    required: false,
});

// Add optional skills (default required: false)
await api.taskRouter.task.updateSkills({
    taskId: 'task-id',
    skills: ['upsell'],
    action: 'add',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Add required skills to an escalated task
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/skills", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    taskId: "task-id",
    skills: ["spanish", "enterprise-tier"],
    action: "add",
    required: true
  })
});
const data = await res.json();

// Remove a single optional skill
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/task/skills", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    taskId: "task-id",
    skills: ["billing"],
    action: "remove",
    required: false
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Add required skills to an escalated task
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/skills");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "taskId" => "task-id",
    "skills" => ["spanish", "enterprise-tier"],
    "action" => "add",
    "required" => true
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Remove a single optional skill
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/task/skills");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "taskId" => "task-id",
    "skills" => ["billing"],
    "action" => "remove",
    "required" => false
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Add required skills to an escalated task
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/skills",
    headers={"Authorization": "Bearer {token}"},
    json={
        "taskId": "task-id",
        "skills": ["spanish", "enterprise-tier"],
        "action": "add",
        "required": True
    }
)
data = response.json()

# Remove a single optional skill
response = requests.post(
    "https://{namespace}.api.unbound.cx/task-router/task/skills",
    headers={"Authorization": "Bearer {token}"},
    json={
        "taskId": "task-id",
        "skills": ["billing"],
        "action": "remove",
        "required": False
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Add required skills to an escalated task
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/skills" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id", "skills": ["spanish", "enterprise-tier"], "action": "add", "required": true}'

# Remove a single optional skill
curl -X POST "https://{namespace}.api.unbound.cx/task-router/task/skills" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "task-id", "skills": ["billing"], "action": "remove", "required": false}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `taskId` | string | ✅ | Task to modify |
| `skills` | string \| string[] | ✅ | Skill ID or array of IDs to add or remove |
| `action` | string | ✅ | `'add'` or `'remove'` |
| `required` | boolean | — | `true` = required skills, `false` = optional skills. Default: `false` |

**Response**

```javascript
{
    taskId: "task-id-789",
    params: {
        skills: ["spanish", "enterprise-tier"],
        action: "add",
        required: true
    }
}
```

---

## Metrics

Real-time task router performance metrics across queues, tasks, and workers.

### `taskRouter.metrics.getCurrent(accountId, params?)`

Retrieves current metrics snapshots for the routing system.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// All metrics across all queues, 15-minute window
const metrics = await api.taskRouter.metrics.getCurrent(null, {
    period: '15min',
    metricType: 'all',
});

// Queue-specific metrics
const queueMetrics = await api.taskRouter.metrics.getCurrent(null, {
    period: '5min',
    queueId: 'queue-id',
    metricType: 'queue',
    limit: 50,
});

// Worker availability snapshot
const workerMetrics = await api.taskRouter.metrics.getCurrent(null, {
    period: '1hour',
    metricType: 'worker',
});

// Task volume for the day
const taskMetrics = await api.taskRouter.metrics.getCurrent(null, {
    period: '24hour',
    metricType: 'task',
    limit: 200,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// All metrics across all queues, 15-minute window
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/metrics?period=15min&metricType=all", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const metrics = await res.json();

// Queue-specific metrics
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/metrics?period=5min&queueId=queue-id&metricType=queue&limit=50", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const queueMetrics = await res.json();

// Worker availability snapshot
const res = await fetch("https://{namespace}.api.unbound.cx/task-router/metrics?period=1hour&metricType=worker", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const workerMetrics = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// All metrics across all queues, 15-minute window
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/metrics?period=15min&metricType=all");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$metrics = json_decode(curl_exec($ch), true);
curl_close($ch);

// Queue-specific metrics
$ch = curl_init("https://{namespace}.api.unbound.cx/task-router/metrics?period=5min&queueId=queue-id&metricType=queue&limit=50");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$queueMetrics = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# All metrics across all queues, 15-minute window
response = requests.get(
    "https://{namespace}.api.unbound.cx/task-router/metrics",
    headers={"Authorization": "Bearer {token}"},
    params={"period": "15min", "metricType": "all"}
)
metrics = response.json()

# Queue-specific metrics
response = requests.get(
    "https://{namespace}.api.unbound.cx/task-router/metrics",
    headers={"Authorization": "Bearer {token}"},
    params={"period": "5min", "queueId": "queue-id", "metricType": "queue", "limit": 50}
)
queue_metrics = response.json()

# Worker availability snapshot
response = requests.get(
    "https://{namespace}.api.unbound.cx/task-router/metrics",
    headers={"Authorization": "Bearer {token}"},
    params={"period": "1hour", "metricType": "worker"}
)
worker_metrics = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# All metrics across all queues, 15-minute window
curl -X GET "https://{namespace}.api.unbound.cx/task-router/metrics?period=15min&metricType=all" \
  -H "Authorization: Bearer {token}"

# Queue-specific metrics
curl -X GET "https://{namespace}.api.unbound.cx/task-router/metrics?period=5min&queueId=queue-id&metricType=queue&limit=50" \
  -H "Authorization: Bearer {token}"

# Worker availability snapshot
curl -X GET "https://{namespace}.api.unbound.cx/task-router/metrics?period=1hour&metricType=worker" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `period` | string | — | Time window: `'5min'`, `'15min'`, `'30min'`, `'1hour'`, `'24hour'` |
| `queueId` | string | — | Filter to a specific queue |
| `metricType` | string | — | `'queue'`, `'task'`, `'worker'`, or `'all'`. Default: `'all'` |
| `limit` | number | — | Max records returned. Default: `100` |

**Response shape**

```javascript
{
    period: "15min",
    queueId: "queue-id",   // present if filtered
    metrics: {
        queue: {
            tasksWaiting: 5,       // tasks in queue right now
            tasksAssigned: 2,      // assigned to workers, pending acceptance
            tasksConnected: 8,     // active interactions
            avgWaitTime: 42.5,     // seconds (period average)
            longestWaitTime: 180,  // seconds (current longest waiter)
        },
        worker: {
            available: 12,   // ready to receive tasks
            busy: 8,         // currently handling a task
            offline: 4,      // not logged in
        },
        task: {
            created: 47,     // tasks created in this period
            completed: 43,   // tasks completed in this period
            abandoned: 2,    // tasks abandoned before assignment
        }
    }
}
```

:::tip
For historical aggregated metrics broken down by queue and agent, use [Engagement Metrics](/api-reference/engagement-metrics) instead.
:::

---

## Common Patterns

### Agent Startup Flow

Call this sequence when an agent opens their softphone and is ready for calls:

```javascript
async function agentGoOnline(api) {
    // 1. Create worker record (idempotent — safe to call every startup)
    const { workerId } = await api.taskRouter.worker.create();
    console.log('Worker ready:', workerId);

    // 2. Log into all auto-login queues
    await api.taskRouter.worker.queueAutoLogin();

    // 3. Go available — start receiving tasks
    await api.taskRouter.worker.setAvailable();

    return workerId;
}
```

### Agent Shutdown Flow

```javascript
async function agentGoOffline(api) {
    // 1. Stop receiving new tasks
    await api.taskRouter.worker.setOffline();

    // 2. Flush all queue memberships
    await api.taskRouter.worker.queueLogoutAll();

    console.log('Agent is offline');
}
```

### Full Task Lifecycle (Voice Call)

```javascript
// When an inbound call arrives, create and route the task
async function handleInboundCall(api, cdrId, callerId) {
    const task = await api.taskRouter.task.create({
        type: 'phoneCall',
        queueId: 'sales-queue-id',
        cdrId,
        subject: `Inbound call from ${callerId}`,
        requiredSkills: ['sales'],
        priority: 3,
        createEngagement: true,
    });
    console.log('Task created:', task.id);
    return task.id;
}

// When the task is offered to this worker
async function acceptTask(api, taskId, sipCallId) {
    const result = await api.taskRouter.task.accept({
        taskId,
        workerSipCallId: sipCallId,   // link worker's call leg
    });
    console.log('Task accepted, status:', result.status); // "connected"
    return result;
}

// When the call ends — move to wrap-up
async function endCall(api, taskId) {
    await api.taskRouter.task.wrapUp({ taskId });
    console.log('Task in wrap-up');
}

// After notes and disposition are saved
async function completeTask(api, taskId, notes) {
    await api.taskRouter.task.update({
        taskId,
        disposition: notes.disposition,
        summary: notes.summary,
        sentiment: notes.sentiment,
    });
    await api.taskRouter.task.complete({ taskId });
    console.log('Task completed');
}
```

### Dynamic Escalation

Escalate a task to require a supervisor by boosting priority and changing required skills:

```javascript
async function escalateTask(api, taskId) {
    // Boost priority so it jumps to the front
    await api.taskRouter.task.changePriority({
        taskId,
        action: 'set',
        value: 100,
    });

    // Require supervisor skill
    await api.taskRouter.task.updateSkills({
        taskId,
        skills: 'supervisor',
        action: 'add',
        required: true,
    });

    // Update subject for visibility
    await api.taskRouter.task.update({
        taskId,
        subject: '[ESCALATED] Customer requiring supervisor',
        disposition: 'escalated',
    });

    console.log('Task escalated and re-queued for supervisor');
}
```

### Queue Monitoring Dashboard

Poll metrics every 30 seconds to display a live queue board:

```javascript
async function pollQueueMetrics(api, queueIds) {
    const results = await Promise.all(
        queueIds.map(queueId =>
            api.taskRouter.metrics.getCurrent(null, {
                period: '5min',
                queueId,
                metricType: 'all',
            })
        )
    );

    for (const data of results) {
        const { queue, worker, task } = data.metrics;
        console.log(`Queue: ${data.queueId}`);
        console.log(`  Waiting: ${queue.tasksWaiting}`);
        console.log(`  Avg wait: ${queue.avgWaitTime.toFixed(1)}s`);
        console.log(`  Available agents: ${worker.available}`);
        console.log(`  Completed (5min): ${task.completed}`);
    }
}

// Run every 30 seconds
setInterval(() => pollQueueMetrics(api, ['sales-q', 'support-q']), 30_000);
```

### Wrap-Up Extension with Retry

Give agents multiple extensions but cap the total extra time:

```javascript
const MAX_EXTENSIONS = 3;
const extensionCounts = new Map();

async function requestWrapUpExtension(api, taskId) {
    const count = extensionCounts.get(taskId) || 0;

    if (count >= MAX_EXTENSIONS) {
        console.warn('Max extensions reached — completing task');
        await api.taskRouter.task.complete({ taskId });
        extensionCounts.delete(taskId);
        return false;
    }

    await api.taskRouter.task.wrapUpExtend({ taskId, extend: 60 });
    extensionCounts.set(taskId, count + 1);
    console.log(`Extended wrap-up (${count + 1}/${MAX_EXTENSIONS})`);
    return true;
}
```

### Skill-Based Routing for Chat

Create a chat task that requires language-specific agents:

```javascript
async function routeChatByLanguage(api, language, visitorId) {
    const skillMap = {
        es: 'spanish-fluent',
        fr: 'french-fluent',
        de: 'german-fluent',
        en: null,   // no skill required for English
    };

    const requiredSkills = skillMap[language]
        ? [skillMap[language], 'chat-certified']
        : ['chat-certified'];

    const task = await api.taskRouter.task.create({
        type: 'chat',
        queueId: 'chat-support-queue-id',
        requiredSkills,
        subject: `Live chat — ${language.toUpperCase()} visitor`,
        peopleId: visitorId,
        priority: 2,
        createEngagement: true,
    });

    return task.id;
}
```
