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

---

### Real-Time Metrics with WebSocket Subscriptions

Poll is adequate for most dashboards, but Unbound's subscription system lets you push updates instantly when engagement state changes — zero-latency supervisor views.

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace' });
await api.login.login('supervisor@example.com', 'password');

// Step 1: Open a WebSocket session
const session = await api.subscriptions.socket.getConnection();

// Step 2: Subscribe to the engagements channel
await api.subscriptions.socket.create(session.sessionId, {
    channel: 'engagements',
    queueIds: ['queue-sales', 'queue-support'],
});

// Step 3: Listen for events — refetch metrics on each update
session.ws.on('message', async (raw) => {
    const event = JSON.parse(raw);

    if (event.channel === 'engagements') {
        // Engagement state changed — refresh metrics for the affected queue
        const queueId = event.data?.queueId;
        const metrics = await api.engagementMetrics.getByQueue({
            queueIds: queueId ? [queueId] : [],
        });

        const q = metrics.byQueue.find((r) => r.queueId === queueId);
        if (q) {
            console.log(`[${q.queueName}] ${q.new} waiting | ${q.working} active | ${q.wrapUp} wrapUp`);
        }
    }
});

// Step 4: Clean up when done
process.on('SIGINT', async () => {
    await api.subscriptions.socket.delete(session.sessionId);
    process.exit(0);
});
```

---

### Combine Real-Time + Historical: UOQL Trending + Live Metrics

Show current queue depth alongside a 7-day trend line. The live snapshot comes from `engagementMetrics`; the trend data comes from UOQL.

```javascript
async function buildQueueTrendDashboard(queueId) {
    // Parallel fetch: live + historical
    const [live, trend] = await Promise.all([
        api.engagementMetrics.getDashboardMetrics({ queueIds: [queueId] }),
        api.objects.uoql({
            query: `
                SELECT
                    DATE(createdAt)  AS day,
                    COUNT(*)         AS total,
                    AVG(duration)    AS avg_handle_time,
                    SUM(CASE WHEN status = 'abandoned' THEN 1 ELSE 0 END) AS abandoned
                FROM engagements
                WHERE queueId = '${queueId}'
                  AND createdAt >= NOW() - INTERVAL '7 days'
                GROUP BY DATE(createdAt)
                ORDER BY day ASC
            `,
            expandDetails: false,
        }),
    ]);

    // Live snapshot
    const queueLive = live.byQueue.find((q) => q.queueId === queueId) ?? {};
    const perfLive  = live.queuePerformance.find((q) => q.queueId === queueId) ?? {};

    return {
        live: {
            waiting:      queueLive.new     ?? 0,
            active:       queueLive.working ?? 0,
            wrapUp:       queueLive.wrapUp  ?? 0,
            serviceLevel: perfLive.serviceLevel ?? null,
            avgWait:      perfLive.avgWaitTime  ?? null,
        },
        trend: trend.results.map((row) => ({
            day:           row.day,
            total:         row.total,
            avgHandleTime: Math.round(row.avg_handle_time),
            abandonRate:   row.total > 0
                ? (row.abandoned / row.total * 100).toFixed(1) + '%'
                : '0.0%',
        })),
    };
}

const dash = await buildQueueTrendDashboard('queue-sales');
console.log('Live:', dash.live);
console.log('7-day trend:');
dash.trend.forEach((d) => console.log(`  ${d.day}: ${d.total} engagements, ${d.abandonRate} abandon`));
```

---

### Auto-Priority Escalation Based on Queue Depth

Automatically raise task priority when the queue is overloaded — protecting SLAs without manual intervention.

```javascript
const ESCALATION_THRESHOLDS = {
    // If this many tasks are waiting AND service level is below target → escalate
    waiting: 10,
    serviceLevel: 0.80,
    priorityBoost: 5,   // how much to add to existing task priority
};

async function autoEscalateIfOverloaded(queueId, pendingTaskIds) {
    const perf = await api.engagementMetrics.getQueuePerformance({ queueIds: [queueId] });
    const q    = perf.queuePerformance.find((r) => r.queueId === queueId);

    if (!q) {
        console.warn(`Queue ${queueId} not found in performance data`);
        return;
    }

    const isOverloaded = q.avgWaitTime > 90
        || q.serviceLevel < ESCALATION_THRESHOLDS.serviceLevel;

    const isCrowded = (q.totalHandled > 0)
        && (pendingTaskIds.length >= ESCALATION_THRESHOLDS.waiting);

    if (isOverloaded || isCrowded) {
        console.log(`Queue ${q.queueName} overloaded — escalating ${pendingTaskIds.length} tasks`);

        // Boost priority on all waiting tasks in parallel (batch of 5 at a time)
        const BATCH = 5;
        for (let i = 0; i < pendingTaskIds.length; i += BATCH) {
            const batch = pendingTaskIds.slice(i, i + BATCH);
            await Promise.all(
                batch.map((taskId) =>
                    api.taskRouter.task.changePriority({
                        taskId,
                        action: 'increase',
                        value: ESCALATION_THRESHOLDS.priorityBoost,
                    }),
                ),
            );
        }

        return {
            escalated: true,
            queueName: q.queueName,
            avgWaitTime: q.avgWaitTime,
            serviceLevel: q.serviceLevel,
            tasksEscalated: pendingTaskIds.length,
        };
    }

    return { escalated: false };
}

// Call from your task management loop
const result = await autoEscalateIfOverloaded('queue-support', waitingTaskIds);
if (result.escalated) {
    console.log(`Escalated ${result.tasksEscalated} tasks. SL: ${(result.serviceLevel * 100).toFixed(1)}%`);
}
```

---

### Shift Handoff Report

Generate a summary for an outgoing supervisor — total handled, top agents, and queue health at shift end.

```javascript
async function generateShiftHandoffReport(queueIds, shiftLabel = 'Shift') {
    const [dashboard, history] = await Promise.all([
        api.engagementMetrics.getDashboardMetrics({ queueIds }),
        api.objects.uoql({
            query: `
                SELECT userId, COUNT(*) AS handled, AVG(duration) AS avg_duration
                FROM engagements
                WHERE queueId IN (${queueIds.map((q) => `'${q}'`).join(',')})
                  AND status = 'completed'
                  AND createdAt >= NOW() - INTERVAL '8 hours'
                GROUP BY userId
                ORDER BY handled DESC
                LIMIT 10
            `,
            expandDetails: true,   // resolve userId → user object
        }),
    ]);

    const topAgents = history.results.map((r, i) => ({
        rank: i + 1,
        name: r.userId?.firstName
            ? `${r.userId.firstName} ${r.userId.lastName}`
            : r.userId,
        handled:        r.handled,
        avgHandleTime:  `${Math.round(r.avg_duration)}s`,
    }));

    const queueSummaries = dashboard.queuePerformance.map((q) => ({
        queue:        q.queueName,
        serviceLevel: (q.serviceLevel * 100).toFixed(1) + '%',
        avgWait:      q.avgWaitTime + 's',
        abandonRate:  (q.abandonRate * 100).toFixed(1) + '%',
        totalHandled: q.totalHandled,
    }));

    const report = {
        label:         shiftLabel,
        generatedAt:   new Date().toISOString(),
        overallCounts: dashboard.summary,
        topAgents,
        queueSummaries,
        handoffAlerts: queueSummaries.filter((q) =>
            parseFloat(q.serviceLevel) < 80 || parseFloat(q.avgWait) > 120,
        ),
    };

    console.log(`\n📋 ${shiftLabel} Handoff Report`);
    console.log(`Generated: ${report.generatedAt}`);
    console.log(`\nOverall: ${report.overallCounts.working} active, ${report.overallCounts.new} waiting`);
    console.log('\nTop 5 Agents:');
    topAgents.slice(0, 5).forEach((a) => {
        console.log(`  #${a.rank} ${a.name}: ${a.handled} handled, avg ${a.avgHandleTime}`);
    });
    if (report.handoffAlerts.length > 0) {
        console.warn('\n⚠️  Queues needing attention:');
        report.handoffAlerts.forEach((q) => {
            console.warn(`  ${q.queue}: SL ${q.serviceLevel}, avg wait ${q.avgWait}`);
        });
    }

    return report;
}

const report = await generateShiftHandoffReport(['queue-sales', 'queue-support'], 'Day Shift');
```

---

### SLA Compliance Tracker with Daily Rollup

Store daily SLA metrics in an Unbound object for historical tracking and trend analysis.

```javascript
async function recordDailySlaCompliance(queueIds, date = new Date()) {
    const dateStr = date.toISOString().split('T')[0];

    // Fetch today's queue performance
    const perf = await api.engagementMetrics.getQueuePerformance({ queueIds });

    const records = perf.queuePerformance.map((q) => ({
        date:         dateStr,
        queueId:      q.queueId,
        queueName:    q.queueName,
        serviceLevel: q.serviceLevel,
        avgWaitTime:  q.avgWaitTime,
        avgHandleTime: q.avgHandleTime,
        abandonRate:  q.abandonRate,
        totalHandled: q.totalHandled,
        slaMet:       q.serviceLevel >= 0.80,
    }));

    // Upsert each record into a custom "queueSlaLog" object
    // (assumes you've created this object schema via objects.createObject)
    await Promise.all(
        records.map((rec) =>
            api.objects.update({
                object: 'queueSlaLog',
                where:  { date: rec.date, queueId: rec.queueId },
                update: rec,
            }).catch(() =>
                // If no match to update, create instead
                api.objects.create({ object: 'queueSlaLog', ...rec }),
            ),
        ),
    );

    const slaFailures = records.filter((r) => !r.slaMet);
    if (slaFailures.length > 0) {
        console.warn(`[${dateStr}] SLA missed on ${slaFailures.length} queue(s):`);
        slaFailures.forEach((r) => {
            console.warn(`  ${r.queueName}: ${(r.serviceLevel * 100).toFixed(1)}% (target: 80%)`);
        });
    } else {
        console.log(`[${dateStr}] All queues met SLA. ✅`);
    }

    return records;
}

// Run this daily via a cron job or at end-of-day
await recordDailySlaCompliance(['queue-sales', 'queue-support']);
```

---

### Concurrent Engagement Cap Enforcement

Prevent any single agent from handling more concurrent engagements than your quality threshold allows.

```javascript
const MAX_CONCURRENT = 3;

async function enforceConcurrencyLimits(queueIds) {
    const data = await api.engagementMetrics.getAgentPerformance({ queueIds });

    const overloaded = data.agentPerformance.filter(
        (a) => a.status === 'working' && a.concurrentEngagements > MAX_CONCURRENT,
    );

    if (overloaded.length === 0) {
        console.log('All agents within concurrency limits.');
        return [];
    }

    console.warn(`${overloaded.length} agent(s) exceeding concurrency limit of ${MAX_CONCURRENT}:`);
    overloaded.forEach((a) => {
        console.warn(`  ${a.userName}: ${a.concurrentEngagements} concurrent (userId: ${a.userId})`);
    });

    // Optional: set these workers offline to stop new assignments
    // (un-comment to enforce hard cap)
    // await Promise.all(
    //     overloaded.map((a) =>
    //         api.taskRouter.worker.setOffline({ userId: a.userId }),
    //     ),
    // );

    return overloaded;
}

const flagged = await enforceConcurrencyLimits(['queue-chat', 'queue-email']);
```

---

### Multi-Queue Comparison Report (HTML Table)

Generate a formatted HTML comparison table — useful for embedding in a daily email digest or internal dashboard.

```javascript
async function buildQueueComparisonHtml(queueIds) {
    const perf = await api.engagementMetrics.getDashboardMetrics({ queueIds });

    const rows = perf.queuePerformance.map((q) => {
        const slColor = q.serviceLevel >= 0.90 ? '#22c55e'
                      : q.serviceLevel >= 0.80 ? '#f59e0b'
                      : '#ef4444';
        const slPct   = (q.serviceLevel * 100).toFixed(1);

        return `
            <tr>
                <td>${q.queueName}</td>
                <td style="color:${slColor};font-weight:bold">${slPct}%</td>
                <td>${q.avgWaitTime}s</td>
                <td>${q.avgHandleTime}s</td>
                <td>${(q.abandonRate * 100).toFixed(1)}%</td>
                <td>${q.totalHandled}</td>
            </tr>
        `;
    }).join('');

    const html = `
        <table border="1" cellpadding="8" style="border-collapse:collapse;font-family:sans-serif">
            <thead style="background:#f3f4f6">
                <tr>
                    <th>Queue</th>
                    <th>Service Level</th>
                    <th>Avg Wait</th>
                    <th>Avg Handle</th>
                    <th>Abandon Rate</th>
                    <th>Total Handled</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;

    return html;
}

const html = await buildQueueComparisonHtml(['queue-sales', 'queue-support', 'queue-billing']);
// Embed in an email via api.messaging.email.send({ ... content_html: html ... })
```

---

## TypeScript Interfaces

```typescript
interface EngagementMetricsSummary {
    /** Total engagements across all queues */
    total: number;
    /** Waiting — not yet assigned to a worker */
    new: number;
    /** Actively being handled by a worker */
    working: number;
    /** In after-call / post-chat wrap-up */
    wrapUp: number;
    /** Completed in the current window */
    completed: number;
}

interface QueueMetrics {
    queueId: string;
    queueName: string;
    new: number;
    working: number;
    wrapUp: number;
    completed: number;
    total: number;
}

interface QueuePerformance {
    queueId: string;
    queueName: string;
    /** Average time (seconds) a worker spends on an engagement */
    avgHandleTime: number;
    /** Average wait (seconds) before first assignment */
    avgWaitTime: number;
    /** Average wrap-up time (seconds) after engagement ends */
    avgWrapUpTime: number;
    /** Fraction (0–1) of engagements abandoned before assignment */
    abandonRate: number;
    /** Fraction (0–1) handled within the configured SLA threshold */
    serviceLevel: number;
    totalHandled: number;
    totalAbandoned: number;
}

interface AgentPerformance {
    userId: string;
    userName: string;
    queueId: string;
    /** Current worker status */
    status: 'available' | 'working' | 'wrapUp' | 'offline';
    totalHandled: number;
    /** Average handle time in seconds */
    avgHandleTime: number;
    /** Average wrap-up time in seconds */
    avgWrapUpTime: number;
    /** Fraction (0–1) of logged-in time spent on engagements */
    utilization: number;
    concurrentEngagements: number;
}

interface EngagementMetricsResponse {
    summary?: EngagementMetricsSummary;
    byQueue?: QueueMetrics[];
    queuePerformance?: QueuePerformance[];
    agentPerformance?: AgentPerformance[];
}

interface GetMetricsOptions {
    queueIds?: string[];
    statuses?: ('new' | 'working' | 'wrapUp' | 'completed')[];
    userIds?: string[];
    includeSummary?: boolean;
    includeByQueue?: boolean;
    includeQueuePerformance?: boolean;
    includeAgentPerformance?: boolean;
}
```

---

## Error Codes

| HTTP | Code | Meaning |
|---|---|---|
| `400` | `INVALID_QUEUE_ID` | One or more `queueIds` values are not valid IDs |
| `400` | `INVALID_STATUS` | A value in `statuses` is not one of `new`, `working`, `wrapUp`, `completed` |
| `401` | `UNAUTHORIZED` | Token missing, expired, or revoked — call `login.login()` again |
| `403` | `FORBIDDEN` | Authenticated user lacks permission to view metrics for the requested queues |
| `404` | `QUEUE_NOT_FOUND` | A requested queue ID does not exist in this namespace |
| `429` | `RATE_LIMITED` | Too many metrics requests — back off and retry after `Retry-After` seconds |
| `500` | `METRICS_UNAVAILABLE` | Internal aggregation error — safe to retry after a short delay |

### Error Handling Example

```javascript
try {
    const data = await api.engagementMetrics.getDashboardMetrics({
        queueIds: ['queue-sales'],
    });
    return data;
} catch (err) {
    if (err.status === 401) {
        await api.login.login(process.env.UNBOUND_USER, process.env.UNBOUND_PASS);
        return api.engagementMetrics.getDashboardMetrics({ queueIds: ['queue-sales'] });
    }
    if (err.status === 429) {
        const retryAfter = parseInt(err.headers?.['retry-after'] ?? '5', 10);
        console.warn(`Rate limited. Retrying in ${retryAfter}s…`);
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        return api.engagementMetrics.getDashboardMetrics({ queueIds: ['queue-sales'] });
    }
    if (err.status === 500) {
        console.error('Metrics unavailable, using cached data');
        return null;
    }
    throw err;
}
```

---

## Method Quick Reference

| Method | Include Flags | Use Case |
|---|---|---|
| `getMetrics(options)` | All configurable | Maximum flexibility — pick exactly what you need |
| `getSummary(options)` | `summary` only | Overall totals: waiting / active / wrapUp |
| `getByQueue(options)` | `byQueue` only | Per-queue status breakdown for a wall board |
| `getQueuePerformance(options)` | `queuePerformance` only | SLA tracking, wait time, abandon rate |
| `getAgentPerformance(options)` | `agentPerformance` only | Agent utilization, handle time, concurrent load |
| `getDashboardMetrics(options)` | All four | Full supervisor dashboard in a single call |

**Performance tip:** Always pass `queueIds` when you only need data for specific queues. Omitting it returns metrics for every queue in the namespace, which is slower and uses more bandwidth. Use the targeted convenience methods (`getSummary`, `getByQueue`, etc.) to avoid fetching metric sections you won't use.
