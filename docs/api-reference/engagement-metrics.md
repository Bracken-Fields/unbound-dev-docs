---
id: engagement-metrics
title: Engagement Metrics
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Engagement Metrics

`api.engagementMetrics` — Real-time and historical metrics for engagement queues, agents, and performance.

---

## `engagementMetrics.getMetrics(options?)`

Full metrics with flexible include flags.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const metrics = await api.engagementMetrics.getMetrics({
    queueIds: ['queue-1', 'queue-2'],
    statuses: ['new', 'working', 'wrapUp'],
    userIds: ['user-1', 'user-2'],
    includeSummary: true,
    includeByQueue: true,
    includeQueuePerformance: true,
    includeAgentPerformance: true,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/engagement-metrics", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
    body: JSON.stringify({
        queueIds: ["queue-1", "queue-2"],
        statuses: ["new", "working", "wrapUp"],
        userIds: ["user-1", "user-2"],
        includeSummary: true,
        includeByQueue: true,
        includeQueuePerformance: true,
        includeAgentPerformance: true
    })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/engagement-metrics");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "queueIds" => ["queue-1", "queue-2"],
    "statuses" => ["new", "working", "wrapUp"],
    "userIds" => ["user-1", "user-2"],
    "includeSummary" => true,
    "includeByQueue" => true,
    "includeQueuePerformance" => true,
    "includeAgentPerformance" => true
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/engagement-metrics",
    headers={"Authorization": "Bearer {token}"},
    json={
        "queueIds": ["queue-1", "queue-2"],
        "statuses": ["new", "working", "wrapUp"],
        "userIds": ["user-1", "user-2"],
        "includeSummary": True,
        "includeByQueue": True,
        "includeQueuePerformance": True,
        "includeAgentPerformance": True
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "queueIds": ["queue-1", "queue-2"],
    "statuses": ["new", "working", "wrapUp"],
    "userIds": ["user-1", "user-2"],
    "includeSummary": true,
    "includeByQueue": true,
    "includeQueuePerformance": true,
    "includeAgentPerformance": true
  }'
```

</TabItem>
</Tabs>

| Parameter | Type | Default | Description |
|---|---|---|---|
| `queueIds` | string[] | `[]` | Filter to specific queues |
| `statuses` | string[] | `[]` | Filter by status: `new`, `working`, `wrapUp`, `completed` |
| `userIds` | string[] | `[]` | Filter to specific agents |
| `includeSummary` | boolean | `true` | Overall summary metrics |
| `includeByQueue` | boolean | `true` | Metrics grouped by queue + status |
| `includeQueuePerformance` | boolean | `false` | Queue performance KPIs |
| `includeAgentPerformance` | boolean | `false` | Agent performance KPIs |

---

## Convenience Methods

### Summary Only

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const summary = await api.engagementMetrics.getSummary({
    queueIds: ['queue-1'],
    statuses: ['new', 'working'],
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/engagement-metrics/summary", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
    body: JSON.stringify({
        queueIds: ["queue-1"],
        statuses: ["new", "working"]
    })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/engagement-metrics/summary");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "queueIds" => ["queue-1"],
    "statuses" => ["new", "working"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/engagement-metrics/summary",
    headers={"Authorization": "Bearer {token}"},
    json={
        "queueIds": ["queue-1"],
        "statuses": ["new", "working"]
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics/summary" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "queueIds": ["queue-1"],
    "statuses": ["new", "working"]
  }'
```

</TabItem>
</Tabs>

### By Queue

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const byQueue = await api.engagementMetrics.getByQueue({
    queueIds: ['queue-1', 'queue-2'],
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/engagement-metrics/by-queue", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
    body: JSON.stringify({
        queueIds: ["queue-1", "queue-2"]
    })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/engagement-metrics/by-queue");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "queueIds" => ["queue-1", "queue-2"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/engagement-metrics/by-queue",
    headers={"Authorization": "Bearer {token}"},
    json={
        "queueIds": ["queue-1", "queue-2"]
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics/by-queue" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "queueIds": ["queue-1", "queue-2"]
  }'
```

</TabItem>
</Tabs>

### Queue Performance

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const queuePerf = await api.engagementMetrics.getQueuePerformance({
    queueIds: ['queue-1'],
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/engagement-metrics/queue-performance", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
    body: JSON.stringify({
        queueIds: ["queue-1"]
    })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/engagement-metrics/queue-performance");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "queueIds" => ["queue-1"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/engagement-metrics/queue-performance",
    headers={"Authorization": "Bearer {token}"},
    json={
        "queueIds": ["queue-1"]
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics/queue-performance" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "queueIds": ["queue-1"]
  }'
```

</TabItem>
</Tabs>

### Agent Performance

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const agentPerf = await api.engagementMetrics.getAgentPerformance({
    queueIds: ['queue-1'],
    userIds: ['user-1', 'user-2'],
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/engagement-metrics/agent-performance", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
    body: JSON.stringify({
        queueIds: ["queue-1"],
        userIds: ["user-1", "user-2"]
    })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/engagement-metrics/agent-performance");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "queueIds" => ["queue-1"],
    "userIds" => ["user-1", "user-2"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/engagement-metrics/agent-performance",
    headers={"Authorization": "Bearer {token}"},
    json={
        "queueIds": ["queue-1"],
        "userIds": ["user-1", "user-2"]
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics/agent-performance" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "queueIds": ["queue-1"],
    "userIds": ["user-1", "user-2"]
  }'
```

</TabItem>
</Tabs>

### Full Dashboard Metrics

Returns all sections (summary + by queue + queue performance + agent performance).

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const dashboard = await api.engagementMetrics.getDashboardMetrics({
    queueIds: ['queue-1'],
    statuses: ['new', 'working'],
    userIds: [],
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/engagement-metrics/dashboard", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
    body: JSON.stringify({
        queueIds: ["queue-1"],
        statuses: ["new", "working"],
        userIds: []
    })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/engagement-metrics/dashboard");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "queueIds" => ["queue-1"],
    "statuses" => ["new", "working"],
    "userIds" => []
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/engagement-metrics/dashboard",
    headers={"Authorization": "Bearer {token}"},
    json={
        "queueIds": ["queue-1"],
        "statuses": ["new", "working"],
        "userIds": []
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics/dashboard" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "queueIds": ["queue-1"],
    "statuses": ["new", "working"],
    "userIds": []
  }'
```

</TabItem>
</Tabs>
