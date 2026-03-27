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
DATA=$(cat <<'EOF'
{
  "queueIds": ["queue-1", "queue-2"],
  "statuses": ["new", "working", "wrapUp"],
  "userIds": ["user-1", "user-2"],
  "includeSummary": true,
  "includeByQueue": true,
  "includeQueuePerformance": true,
  "includeAgentPerformance": true
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
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

### Response Shape

The `getMetrics` response is a composite object. Each top-level key is present only when the corresponding `include*` flag is `true`.

```javascript
// Full response (all flags true)
{
    summary: {
        total: 47,           // all engagements across all queues
        new: 12,             // waiting, not yet assigned
        working: 28,         // actively being handled
        wrapUp: 7,           // in after-call / post-chat work
        completed: 0,        // completed in the current window
    },

    byQueue: [
        {
            queueId: 'queue-1',
            queueName: 'Sales',
            new: 4,
            working: 11,
            wrapUp: 2,
            completed: 0,
            total: 17,
        },
        {
            queueId: 'queue-2',
            queueName: 'Support',
            new: 8,
            working: 17,
            wrapUp: 5,
            completed: 0,
            total: 30,
        },
    ],

    queuePerformance: [
        {
            queueId: 'queue-1',
            queueName: 'Sales',
            avgHandleTime: 342,       // seconds
            avgWaitTime: 28,          // seconds before first assignment
            avgWrapUpTime: 65,        // seconds
            abandonRate: 0.04,        // 0.0–1.0 fraction
            serviceLevel: 0.87,       // fraction handled within SLA threshold
            totalHandled: 142,
            totalAbandoned: 6,
        },
    ],

    agentPerformance: [
        {
            userId: 'user-1',
            userName: 'Alice Smith',
            queueId: 'queue-1',
            status: 'working',        // current worker status
            totalHandled: 18,
            avgHandleTime: 310,       // seconds
            avgWrapUpTime: 52,        // seconds
            utilization: 0.82,        // 0.0–1.0 fraction of time on engagements
            concurrentEngagements: 2,
        },
    ],
}
```

#### Status Values

| Status | Meaning |
|---|---|
| `new` | Engagement waiting — not yet assigned to an agent |
| `working` | Agent actively handling the engagement |
| `wrapUp` | Agent in after-work (ACW) for this engagement |
| `completed` | Engagement finished and closed |

---

## Convenience Methods

### `engagementMetrics.getSummary(options?)`

Returns only the `summary` block — a lightweight overall count by status. Good for header KPI tiles.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const summary = await api.engagementMetrics.getSummary({
    queueIds: ['queue-1'],
    statuses: ['new', 'working'],
});

// summary.summary.total   → 40
// summary.summary.new     → 12
// summary.summary.working → 28
// summary.summary.wrapUp  → 0
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
DATA=$(cat <<'EOF'
{
  "queueIds": ["queue-1"],
  "statuses": ["new", "working"]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics/summary" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### `engagementMetrics.getByQueue(options?)`

Returns only the `byQueue` array — per-queue breakdown of current engagement counts by status. Use this for queue-level status cards.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const byQueue = await api.engagementMetrics.getByQueue({
    queueIds: ['queue-1', 'queue-2'],
});

// byQueue.byQueue → [{ queueId, queueName, new, working, wrapUp, total }, ...]
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
DATA=$(cat <<'EOF'
{
  "queueIds": ["queue-1", "queue-2"]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics/by-queue" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### `engagementMetrics.getQueuePerformance(options?)`

Returns only the `queuePerformance` array — historical KPIs including handle time, wait time, abandon rate, and service level per queue.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const queuePerf = await api.engagementMetrics.getQueuePerformance({
    queueIds: ['queue-1'],
});

// queuePerf.queuePerformance[0].serviceLevel  → 0.87 (87% within SLA)
// queuePerf.queuePerformance[0].avgWaitTime   → 28 (seconds)
// queuePerf.queuePerformance[0].abandonRate   → 0.04 (4%)
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
DATA=$(cat <<'EOF'
{
  "queueIds": ["queue-1"]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics/queue-performance" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### `engagementMetrics.getAgentPerformance(options?)`

Returns only the `agentPerformance` array — per-agent KPIs including handle time, utilization, and concurrent engagements.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const agentPerf = await api.engagementMetrics.getAgentPerformance({
    queueIds: ['queue-1'],
    userIds: ['user-1', 'user-2'],
});

// agentPerf.agentPerformance[0].utilization           → 0.82
// agentPerf.agentPerformance[0].avgHandleTime         → 310 (seconds)
// agentPerf.agentPerformance[0].concurrentEngagements → 2
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
DATA=$(cat <<'EOF'
{
  "queueIds": ["queue-1"],
  "userIds": ["user-1", "user-2"]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics/agent-performance" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### `engagementMetrics.getDashboardMetrics(options?)`

Convenience alias that sets all four `include*` flags to `true`. Returns summary + byQueue + queuePerformance + agentPerformance in a single call — ideal for a supervisor wall board or full analytics page.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const dashboard = await api.engagementMetrics.getDashboardMetrics({
    queueIds: ['queue-1'],
    statuses: ['new', 'working'],
    userIds: [],
});

// dashboard.summary          → overall totals
// dashboard.byQueue          → per-queue breakdown
// dashboard.queuePerformance → KPIs per queue
// dashboard.agentPerformance → KPIs per agent
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
DATA=$(cat <<'EOF'
{
  "queueIds": ["queue-1"],
  "statuses": ["new", "working"],
  "userIds": []
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/engagement-metrics/dashboard" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

## Common Patterns

### Real-Time Supervisor Dashboard (Polling)

Poll every 10 seconds and update UI widgets with current queue state:

```javascript
class SupervisorDashboard {
    constructor(queueIds) {
        this.queueIds = queueIds;
        this.intervalId = null;
    }

    start(onUpdate) {
        const poll = async () => {
            try {
                const data = await api.engagementMetrics.getDashboardMetrics({
                    queueIds: this.queueIds,
                    statuses: ['new', 'working', 'wrapUp'],
                });
                onUpdate(data);
            } catch (err) {
                console.error('Metrics poll failed:', err.message);
            }
        };

        poll();  // immediate first fetch
        this.intervalId = setInterval(poll, 10_000);
    }

    stop() {
        clearInterval(this.intervalId);
    }
}

// Usage
const dash = new SupervisorDashboard(['queue-sales', 'queue-support']);
dash.start((data) => {
    console.log('Total waiting:', data.summary.new);
    console.log('Total working:', data.summary.working);
    data.byQueue.forEach((q) => {
        console.log(`  ${q.queueName}: ${q.new} waiting, ${q.working} working`);
    });
});
```

---

### SLA Alert: Queue Falling Behind

Trigger an alert when a queue's service level drops below threshold:

```javascript
const SLA_THRESHOLD = 0.80;   // 80%
const WAIT_THRESHOLD = 120;   // 2 minutes

async function checkSlaAlerts(queueIds) {
    const perf = await api.engagementMetrics.getQueuePerformance({ queueIds });
    const alerts = [];

    for (const q of perf.queuePerformance) {
        if (q.serviceLevel < SLA_THRESHOLD) {
            alerts.push({
                type: 'service_level',
                queue: q.queueName,
                value: (q.serviceLevel * 100).toFixed(1) + '%',
                threshold: (SLA_THRESHOLD * 100) + '%',
            });
        }
        if (q.avgWaitTime > WAIT_THRESHOLD) {
            alerts.push({
                type: 'wait_time',
                queue: q.queueName,
                value: q.avgWaitTime + 's',
                threshold: WAIT_THRESHOLD + 's',
            });
        }
    }

    return alerts;
}

// Schedule a check every minute
setInterval(async () => {
    const alerts = await checkSlaAlerts(['queue-sales', 'queue-support']);
    if (alerts.length > 0) {
        console.warn('SLA alerts:', alerts);
        // send to PagerDuty, Slack, etc.
    }
}, 60_000);
```

---

### Agent Utilization Report

Build a ranked utilization report for a shift:

```javascript
async function agentUtilizationReport(queueIds) {
    const data = await api.engagementMetrics.getAgentPerformance({ queueIds });

    // Sort by utilization descending
    const ranked = [...data.agentPerformance].sort(
        (a, b) => b.utilization - a.utilization,
    );

    return ranked.map((agent, i) => ({
        rank: i + 1,
        name: agent.userName,
        utilization: (agent.utilization * 100).toFixed(1) + '%',
        avgHandleTime: Math.round(agent.avgHandleTime) + 's',
        totalHandled: agent.totalHandled,
        status: agent.status,
    }));
}

const report = await agentUtilizationReport(['queue-sales']);
console.table(report);
// rank | name         | utilization | avgHandleTime | totalHandled | status
// 1    | Alice Smith  | 92.0%       | 310s          | 18           | working
// 2    | Bob Johnson  | 78.5%       | 420s          | 12           | working
// 3    | Carol Davis  | 45.2%       | 290s          | 8            | wrapUp
```

---

### Queue Health Summary for Status Page

Emit a clean health snapshot suitable for an internal status page or webhook:

```javascript
async function queueHealthSnapshot(queueIds) {
    const [summary, performance] = await Promise.all([
        api.engagementMetrics.getSummary({ queueIds }),
        api.engagementMetrics.getQueuePerformance({ queueIds }),
    ]);

    const perfMap = Object.fromEntries(
        performance.queuePerformance.map((q) => [q.queueId, q]),
    );

    return {
        timestamp: new Date().toISOString(),
        overall: {
            waiting: summary.summary.new,
            active: summary.summary.working,
            wrapUp: summary.summary.wrapUp,
        },
        queues: queueIds.map((id) => {
            const p = perfMap[id] || {};
            return {
                queueId: id,
                queueName: p.queueName || id,
                serviceLevel: p.serviceLevel ?? null,
                avgWaitSeconds: p.avgWaitTime ?? null,
                abandonRate: p.abandonRate ?? null,
                healthy: (p.serviceLevel ?? 1) >= 0.80 && (p.avgWaitTime ?? 0) < 120,
            };
        }),
    };
}

const snapshot = await queueHealthSnapshot(['queue-sales', 'queue-support']);
// POST snapshot to your status dashboard / monitoring system
```

---

### Filter to Active Engagements Only

When building a live "on the floor" view, exclude wrapUp and completed:

```javascript
async function liveFloorView(queueIds) {
    const data = await api.engagementMetrics.getMetrics({
        queueIds,
        statuses: ['new', 'working'],   // exclude wrapUp and completed
        includeSummary: true,
        includeByQueue: true,
        includeQueuePerformance: false,
        includeAgentPerformance: true,
    });

    const activeAgents = data.agentPerformance.filter(
        (a) => a.status === 'working',
    );

    return {
        waitingCount: data.summary.new,
        activeAgentCount: activeAgents.length,
        avgConcurrent: activeAgents.length
            ? (activeAgents.reduce((s, a) => s + a.concurrentEngagements, 0) / activeAgents.length).toFixed(1)
            : 0,
        queues: data.byQueue,
    };
}
```
