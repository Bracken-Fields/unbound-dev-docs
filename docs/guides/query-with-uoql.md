---
id: query-with-uoql
title: Analyze Call Data with UOQL
---

# Analyze Call Data with UOQL

UOQL (Unbound Object Query Language) is a SQL-style query engine that runs against any object in the platform. While the standard `objects.query()` method handles simple lookups and filters, UOQL unlocks aggregations, grouping, window functions, and complex conditions -- everything you need to build call analytics dashboards and performance reports without exporting data to an external tool.

This guide walks through real call center scenarios: pulling recent CDR (Call Detail Record) data, building agent leaderboards, computing averages, and paginating through large result sets.

---

## Setup

Install the SDK and initialize with your namespace credentials:

```bash
npm install @unboundcx/sdk
```

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace' });

await api.login.login('your-username', 'your-password');
```

All UOQL queries go through `api.objects.uoql()`. The method accepts a `query` string (your SQL) and an optional `expandDetails` flag.

---

## Basic Queries

### List Recent Calls

Pull the 20 most recent call records to see what is flowing through your system:

```javascript
const recent = await api.objects.uoql({
    query: `
        SELECT id, direction, duration, status
        FROM cdr
        ORDER BY createdAt DESC
        LIMIT 20
    `,
    expandDetails: false,
});

console.log(`${recent.pagination.totalRecords} total calls`);
recent.results.forEach((call) => {
    console.log(`${call.id} | ${call.direction} | ${call.duration}s | ${call.status}`);
});
```

### Filter Inbound Calls

Narrow to inbound traffic only. Add a `WHERE` clause:

```javascript
const inbound = await api.objects.uoql({
    query: `
        SELECT id, direction, duration, status
        FROM cdr
        WHERE direction = 'inbound'
        ORDER BY createdAt DESC
        LIMIT 20
    `,
    expandDetails: false,
});

console.log(`${inbound.pagination.totalRecords} inbound calls total`);
```

You can combine conditions with `AND` and `OR`:

```sql
-- Inbound calls longer than 2 minutes
SELECT id, direction, duration
FROM cdr
WHERE direction = 'inbound' AND duration > 120
ORDER BY createdAt DESC
LIMIT 20
```

---

## Analytics Queries

This is where UOQL pulls ahead of `objects.query()`. Aggregate functions, grouping, and window functions let you answer operational questions directly.

### Count Calls by Direction

How many inbound vs. outbound calls are in the system?

```javascript
const breakdown = await api.objects.uoql({
    query: `
        SELECT direction, COUNT(*) as total
        FROM cdr
        GROUP BY direction
    `,
    expandDetails: false,
});

breakdown.results.forEach((row) => {
    console.log(`${row.direction}: ${row.total} calls`);
});
```

### Average Call Duration by Direction

Are inbound calls longer than outbound? This matters for staffing:

```javascript
const avgDuration = await api.objects.uoql({
    query: `
        SELECT direction, AVG(duration) as avg_duration
        FROM cdr
        GROUP BY direction
    `,
    expandDetails: false,
});

avgDuration.results.forEach((row) => {
    const minutes = (row.avg_duration / 60).toFixed(1);
    console.log(`${row.direction}: avg ${minutes} min`);
});
```

### Agent Leaderboard

Which agents handle the most calls, and how long do they spend on the phone? Filter out agents with fewer than 10 calls to remove noise:

```javascript
const leaderboard = await api.objects.uoql({
    query: `
        SELECT userId, COUNT(*) as calls, AVG(duration) as avg_duration, SUM(duration) as total_talk_time
        FROM cdr
        GROUP BY userId
        HAVING COUNT(*) > 10
        LIMIT 25
    `,
    expandDetails: false,
});

leaderboard.results.forEach((agent) => {
    const avgMin = (agent.avg_duration / 60).toFixed(1);
    const totalHrs = (agent.total_talk_time / 3600).toFixed(1);
    console.log(`Agent ${agent.userId}: ${agent.calls} calls, avg ${avgMin} min, total ${totalHrs} hrs`);
});
```

### Rank Agents by Call Volume

Use `ROW_NUMBER()` to assign an explicit rank to each agent:

```javascript
const ranked = await api.objects.uoql({
    query: `
        SELECT userId, COUNT(*) as calls, ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rank
        FROM cdr
        GROUP BY userId
        LIMIT 10
    `,
    expandDetails: false,
});

ranked.results.forEach((agent) => {
    console.log(`#${agent.rank} — Agent ${agent.userId}: ${agent.calls} calls`);
});
```

---

## Pagination

UOQL uses `LIMIT` / `OFFSET` for pagination. The response includes metadata so you know when to stop:

```javascript
const PAGE_SIZE = 50;
let offset = 0;
let hasMore = true;

while (hasMore) {
    const page = await api.objects.uoql({
        query: `
            SELECT id, direction, duration, status
            FROM cdr
            ORDER BY createdAt DESC
            LIMIT ${PAGE_SIZE} OFFSET ${offset}
        `,
        expandDetails: false,
    });

    console.log(`Page at offset ${offset}: ${page.results.length} records`);

    // Process this page
    page.results.forEach((call) => {
        // ... your processing logic
    });

    hasMore = page.pagination.hasNextPage;
    offset += PAGE_SIZE;
}
```

The response shape includes:

```json
{
    "results": [],
    "pagination": {
        "totalRecords": 1482,
        "hasNextPage": true,
        "offset": 50
    },
    "query": {
        "objectName": "cdr"
    }
}
```

The maximum page size is **500 records** per query.

---

## Expanding Related Objects

By default, foreign key fields like `userId` return a raw ID string. Pass `expandDetails: true` to resolve them into full objects -- useful when you want agent names instead of IDs:

```javascript
const data = await api.objects.uoql({
    query: `
        SELECT id, direction, duration, userId
        FROM cdr
        ORDER BY createdAt DESC
        LIMIT 10
    `,
    expandDetails: true,
});

data.results.forEach((call) => {
    // userId is now an object with name, email, etc.
    const agentName = call.userId?.firstName
        ? `${call.userId.firstName} ${call.userId.lastName}`
        : 'Unknown';
    console.log(`${call.direction} call — ${call.duration}s — handled by ${agentName}`);
});
```

This is particularly useful for building dashboards where you display human-readable names instead of opaque IDs.

---

## CLI Usage

The Unbound CLI exposes UOQL as a first-class command. This is ideal for quick ad-hoc queries, scripting, and piping into other tools.

```bash
# Quick call breakdown
unbound uoql "SELECT direction, COUNT(*) as total FROM cdr GROUP BY direction"

# JSON output piped to jq — filter calls over 5 minutes
unbound uoql "SELECT id, direction, duration FROM cdr LIMIT 100" --json | jq '[.[] | select(.duration > 300)]'

# Agent leaderboard in JSON
unbound uoql "SELECT userId, COUNT(*) as calls, AVG(duration) as avg_duration FROM cdr GROUP BY userId HAVING COUNT(*) > 10 LIMIT 25" --json

# Expand related objects (resolve userId to user details)
unbound uoql "SELECT id, direction, userId FROM cdr LIMIT 25" --expand

# Combine with other CLI tools
unbound uoql "SELECT id, duration FROM cdr WHERE direction = 'inbound' LIMIT 500" --json | jq '.[].duration' | sort -n | tail -20
```

---

## Tips and Gotchas

**Object name mapping.** UOQL uses the platform's internal object names, not the display labels you see in the UI. The most common ones to know:

| What you want | Object name in UOQL |
|---|---|
| Contacts | `people` |
| Call records | `cdr` |
| SMS messages | `messagesSmsMms` |
| Email messages | `emails` |
| Users / Agents | `users` |
| Call recordings | `storage` (filter with `WHERE classification = 'call_recording'`) |

**No `SELECT *`.** You must list fields explicitly. This keeps queries fast and responses predictable.

**500-record maximum.** A single query returns at most 500 rows. Use `LIMIT` / `OFFSET` pagination to work through larger datasets.

**`ORDER BY` is limited to `createdAt`.** Custom field ordering is not yet supported in UOQL v2. Sort client-side if you need to order by other fields.

**No `BETWEEN`.** Use `>= x AND <= y` instead:

```sql
SELECT id, duration FROM cdr
WHERE duration >= 60 AND duration <= 300
LIMIT 50
```

**No subqueries or JOINs.** Use `expandDetails: true` to resolve foreign keys instead of trying to join across object types.

---

## What's Next

- [UOQL API Reference](/api-reference/uoql) -- full syntax, operators, and all supported functions
- [Objects API Reference](/api-reference/objects) -- `objects.query()` for simple lookups
- [CLI Quickstart](/guides/cli-quickstart) -- get started with the Unbound CLI
- [Task Router Quickstart](/guides/task-router-quickstart) -- route calls to agents
