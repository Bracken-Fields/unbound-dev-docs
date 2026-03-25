---
id: engagement-metrics
title: Engagement Metrics
---

# Engagement Metrics

`api.engagementMetrics` — Real-time and historical metrics for engagement queues, agents, and performance.

---

## `engagementMetrics.getMetrics(options?)`

Full metrics with flexible include flags.

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

```javascript
const summary = await api.engagementMetrics.getSummary({
  queueIds: ['queue-1'],
  statuses: ['new', 'working'],
});
```

### By Queue

```javascript
const byQueue = await api.engagementMetrics.getByQueue({
  queueIds: ['queue-1', 'queue-2'],
});
```

### Queue Performance

```javascript
const queuePerf = await api.engagementMetrics.getQueuePerformance({
  queueIds: ['queue-1'],
});
```

### Agent Performance

```javascript
const agentPerf = await api.engagementMetrics.getAgentPerformance({
  queueIds: ['queue-1'],
  userIds: ['user-1', 'user-2'],
});
```

### Full Dashboard Metrics

Returns all sections (summary + by queue + queue performance + agent performance).

```javascript
const dashboard = await api.engagementMetrics.getDashboardMetrics({
  queueIds: ['queue-1'],
  statuses: ['new', 'working'],
  userIds: [],
});
```
