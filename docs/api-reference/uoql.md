---
id: uoql
title: UOQL — Query Language
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# UOQL — Unbound Object Query Language

UOQL is Unbound's SQL-style query engine. It lets you run full SQL queries against any object in the platform — contacts, CDRs, tasks, queues, recordings, and any custom type you've defined.

**Endpoint:** `POST /object/query/v2`

---

## Why UOQL?

The standard `objects.query()` method supports simple field filters and pagination. UOQL goes further:

| Feature | `objects.query()` | UOQL |
|---|---|---|
| Field filters | ✅ | ✅ |
| Pagination | ✅ (cursor) | ✅ (OFFSET) |
| Aggregate functions | ❌ | ✅ COUNT, SUM, AVG, MIN, MAX |
| GROUP BY / HAVING | ❌ | ✅ |
| Window functions | ❌ | ✅ ROW_NUMBER, RANK, LAG, LEAD |
| LIKE / IN operators | ❌ | ✅ |
| OR conditions | ❌ | ✅ |

Use `objects.query()` for simple lookups. Use UOQL for analytics, reporting, and complex filtering.

---

## SDK Usage

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: 'your-jwt' });

const data = await api.objects.uoql({
    query: 'SELECT id, direction, duration FROM cdr WHERE direction = \'inbound\' LIMIT 20',
    expandDetails: false,
});

// data.results  — array of matching rows
// data.pagination.totalRecords
// data.pagination.hasNextPage
// data.pagination.offset
// data.query.objectName  — which object was queried
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch(
    'https://your-namespace.api.unbound.cx/object/query/v2',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-jwt-token',
        },
        body: JSON.stringify({
            query: 'SELECT id, firstName, lastName FROM people LIMIT 50',
            expandDetails: false,
        }),
    }
);

const data = await response.json();
console.log(data.results);
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://your-namespace.api.unbound.cx/object/query/v2');

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer your-jwt-token',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'query' => 'SELECT id, firstName, lastName FROM people LIMIT 50',
        'expandDetails' => false,
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data['results']);
?>
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://your-namespace.api.unbound.cx/object/query/v2',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-jwt-token',
    },
    json={
        'query': 'SELECT id, firstName, lastName FROM people LIMIT 50',
        'expandDetails': False,
    }
)

data = response.json()
print(data['results'])
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "query": "SELECT id, firstName, lastName FROM people LIMIT 50",
  "expandDetails": false
}
EOF
)

curl -X POST https://your-namespace.api.unbound.cx/object/query/v2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

## SQL Syntax

```sql
SELECT field1, field2, ...
FROM   objectName
WHERE  conditions
GROUP BY field
HAVING condition
ORDER BY createdAt DESC
LIMIT n OFFSET n
```

---

## SELECT

List the fields you want returned. No `SELECT *` — always specify fields explicitly.

```sql
SELECT id, firstName, lastName, email FROM people LIMIT 25
```

### Aggregate Functions

Use aggregate functions to compute summary statistics. When using aggregates, `GROUP BY` is required.

| Function | Description |
|---|---|
| `COUNT(*)` | Count of rows |
| `SUM(field)` | Sum of a numeric field |
| `AVG(field)` | Average of a numeric field |
| `MIN(field)` | Minimum value |
| `MAX(field)` | Maximum value |

```sql
SELECT direction, COUNT(*) as calls, AVG(duration) as avg_duration
FROM cdr
GROUP BY direction
```

### Window Functions

Window functions compute a value for each row relative to a group, without collapsing rows.

| Function | Description |
|---|---|
| `ROW_NUMBER() OVER (ORDER BY field)` | Sequential row number |
| `RANK() OVER (PARTITION BY field ORDER BY field)` | Rank within a partition |
| `LAG(field) OVER (PARTITION BY field ORDER BY field)` | Previous row's value |
| `LEAD(field) OVER (PARTITION BY field ORDER BY field)` | Next row's value |

```sql
SELECT
    userId,
    COUNT(*) as calls,
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rank
FROM cdr
GROUP BY userId
LIMIT 10
```

---

## FROM

Specify the object type to query. Use the platform's internal object names (not always the display names):

| What you'd expect | Actual object name |
|---|---|
| Contacts | `people` |
| SMS messages | `messagesSmsMms` |
| SMS templates | `messagesSmsMmsTemplates` |
| Email messages | `emails` |
| Email templates | `emailMessageTemplates` |
| Call recordings | `storage` (use `WHERE classification = 'call_recording'`) |
| Call records | `cdr` |
| Users | `users` |

Other built-in types: `tasks`, `workflows`, `queues`, `skills`, `sipEndpoints`, `phoneNumbers`, `feeds`, `companies`

---

## WHERE

Filter rows using field comparisons. Supports `AND`, `OR`, and a full set of comparison operators.

### Operators

| Operator | Example |
|---|---|
| `=` | `WHERE status = 'active'` |
| `!=` | `WHERE status != 'deleted'` |
| `>` | `WHERE duration > 120` |
| `>=` | `WHERE duration >= 60` |
| `<` | `WHERE duration < 300` |
| `<=` | `WHERE createdAt <= '2024-12-31'` |
| `LIKE` | `WHERE firstName LIKE '%Cameron%'` |
| `IN (...)` | `WHERE status IN ('open', 'pending')` |

:::note
`BETWEEN` is not supported. Use `>= x AND <= y` instead.
:::

### AND / OR

```sql
-- AND: inbound calls over 2 minutes
SELECT id, direction, duration
FROM cdr
WHERE direction = 'inbound' AND duration > 120
ORDER BY createdAt DESC
LIMIT 20

-- OR: multiple queue names
SELECT id, name
FROM queues
WHERE name = 'Support' OR name = 'Sales'

-- IN: cleaner than multiple OR conditions
SELECT id, name, status
FROM tasks
WHERE status IN ('open', 'pending')
LIMIT 50
```

---

## GROUP BY / HAVING

Use `GROUP BY` to aggregate rows by a field. Use `HAVING` to filter the aggregated results (like `WHERE` but for groups).

```sql
-- Directions with more than 100 calls
SELECT direction, COUNT(*) as calls, AVG(duration) as avg_duration
FROM cdr
GROUP BY direction
HAVING COUNT(*) > 100
```

---

## ORDER BY

:::note
In v2.0, ordering is supported on `createdAt` only. Custom field ordering is coming.
:::

```sql
SELECT id, direction, duration
FROM cdr
ORDER BY createdAt DESC
LIMIT 25
```

---

## LIMIT / OFFSET

Use `LIMIT` to cap results and `OFFSET` for pagination.

```sql
-- First page
SELECT id, firstName FROM people LIMIT 50

-- Second page
SELECT id, firstName FROM people LIMIT 50 OFFSET 50

-- Third page
SELECT id, firstName FROM people LIMIT 50 OFFSET 100
```

The response includes pagination metadata:

```json
{
    "results": [ ... ],
    "pagination": {
        "totalRecords": 312,
        "hasNextPage": true,
        "offset": 50
    },
    "query": {
        "objectName": "people"
    }
}
```

**Maximum:** 500 records per query.

---

## expandDetails

Pass `expandDetails: true` to resolve related object references (foreign keys) inline.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const data = await api.objects.uoql({
    query: 'SELECT id, direction, duration, userId FROM cdr LIMIT 25',
    expandDetails: true,
});
// userId field will be expanded to a full user object
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch(
    'https://your-namespace.api.unbound.cx/object/query/v2',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-jwt-token',
        },
        body: JSON.stringify({
            query: 'SELECT id, direction, duration, userId FROM cdr LIMIT 25',
            expandDetails: true,
        }),
    }
);

const data = await response.json();
// userId field will be expanded to a full user object
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://your-namespace.api.unbound.cx/object/query/v2');

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer your-jwt-token',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'query' => 'SELECT id, direction, duration, userId FROM cdr LIMIT 25',
        'expandDetails' => true,
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
// userId field will be expanded to a full user object
?>
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://your-namespace.api.unbound.cx/object/query/v2',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-jwt-token',
    },
    json={
        'query': 'SELECT id, direction, duration, userId FROM cdr LIMIT 25',
        'expandDetails': True,
    }
)

data = response.json()
# userId field will be expanded to a full user object
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "query": "SELECT id, direction, duration, userId FROM cdr LIMIT 25",
  "expandDetails": true
}
EOF
)

curl -X POST https://your-namespace.api.unbound.cx/object/query/v2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

## Example Queries

### Count calls by direction
```sql
SELECT direction, COUNT(*) FROM cdr GROUP BY direction
```

### Inbound calls over 2 minutes
```sql
SELECT id, direction, duration
FROM cdr
WHERE direction = 'inbound' AND duration > 120
ORDER BY createdAt DESC
LIMIT 20
```

### Find contacts by name
```sql
SELECT id, firstName, lastName, email
FROM people
WHERE firstName LIKE '%Cameron%'
```

### Active tasks in specific statuses
```sql
SELECT id, name, status
FROM tasks
WHERE status IN ('open', 'pending')
LIMIT 50
```

### Agent performance — calls handled + avg duration
```sql
SELECT
    userId,
    COUNT(*) as total_calls,
    AVG(duration) as avg_duration,
    SUM(duration) as total_talk_time
FROM cdr
GROUP BY userId
HAVING COUNT(*) > 10
LIMIT 25
```

### Rank agents by call volume
```sql
SELECT
    userId,
    COUNT(*) as calls,
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rank
FROM cdr
GROUP BY userId
LIMIT 10
```

### Paginate through all contacts
```sql
-- Page 1
SELECT id, firstName, lastName FROM people LIMIT 100

-- Page 2
SELECT id, firstName, lastName FROM people LIMIT 100 OFFSET 100
```

### Call recordings (storage with classification filter)
```sql
SELECT id, fileName, relatedId, createdAt
FROM storage
WHERE classification = 'call_recording'
ORDER BY createdAt DESC
LIMIT 20
```

---

## CLI Usage

If you're using the [Unbound CLI](https://github.com/Bracken-Fields/unbound-cli), UOQL is available as a first-class command:

```bash
# Basic query
unbound uoql "SELECT direction, COUNT(*) FROM cdr GROUP BY direction"

# Raw JSON output (pipe to jq)
unbound uoql "SELECT id, duration FROM cdr LIMIT 100" --json | jq '[.[] | select(.duration > 300)]'

# Expand related objects
unbound uoql "SELECT id, direction, userId FROM cdr LIMIT 25" --expand
```

---

## Common Patterns

Real-world UOQL recipes for contact center analytics, CRM reporting, and operational dashboards.

---

### Pattern 1 — Daily Call Volume Summary

Aggregate inbound vs. outbound call counts and average durations for a daily operations dashboard.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const summary = await api.objects.uoql({
    query: `
        SELECT
            direction,
            COUNT(*) AS total_calls,
            AVG(duration) AS avg_duration_seconds,
            SUM(duration) AS total_talk_seconds,
            MIN(duration) AS shortest_call,
            MAX(duration) AS longest_call
        FROM cdr
        WHERE createdAt >= '2024-01-01'
        GROUP BY direction
    `,
});

// summary.results → [
//   { direction: 'inbound', total_calls: 412, avg_duration_seconds: 187, ... },
//   { direction: 'outbound', total_calls: 188, avg_duration_seconds: 94, ... }
// ]
summary.results.forEach(row => {
    const minutes = Math.round(row.total_talk_seconds / 60);
    console.log(`${row.direction}: ${row.total_calls} calls, ${minutes} min total`);
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {token}' },
    body: JSON.stringify({
        query: `SELECT
                    direction,
                    COUNT(*) AS total_calls,
                    AVG(duration) AS avg_duration_seconds,
                    SUM(duration) AS total_talk_seconds,
                    MIN(duration) AS shortest_call,
                    MAX(duration) AS longest_call
                FROM cdr
                WHERE createdAt >= '2024-01-01'
                GROUP BY direction`,
    }),
});
const summary = await res.json();

summary.results.forEach(row => {
    const minutes = Math.round(row.total_talk_seconds / 60);
    console.log(`${row.direction}: ${row.total_calls} calls, ${minutes} min total`);
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/object/query/v2',
    headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'},
    json={
        'query': """SELECT
                        direction,
                        COUNT(*) AS total_calls,
                        AVG(duration) AS avg_duration_seconds,
                        SUM(duration) AS total_talk_seconds,
                        MIN(duration) AS shortest_call,
                        MAX(duration) AS longest_call
                    FROM cdr
                    WHERE createdAt >= '2024-01-01'
                    GROUP BY direction""",
    }
)
summary = response.json()

for row in summary['results']:
    minutes = round(row['total_talk_seconds'] / 60)
    print(f"{row['direction']}: {row['total_calls']} calls, {minutes} min total")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "query": "SELECT direction, COUNT(*) AS total_calls, AVG(duration) AS avg_duration_seconds, SUM(duration) AS total_talk_seconds FROM cdr WHERE createdAt >= '2024-01-01' GROUP BY direction"
}
EOF
)

curl -X POST 'https://{namespace}.api.unbound.cx/object/query/v2' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

### Pattern 2 — Agent Leaderboard

Rank agents by call count. Use `ROW_NUMBER()` to add a rank column without affecting other results.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const leaderboard = await api.objects.uoql({
    query: `
        SELECT
            userId,
            COUNT(*) AS calls_handled,
            AVG(duration) AS avg_talk_seconds,
            SUM(duration) AS total_talk_seconds,
            ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS rank
        FROM cdr
        WHERE direction = 'inbound'
        GROUP BY userId
        HAVING COUNT(*) > 0
        LIMIT 20
    `,
    expandDetails: true,   // resolves userId → full user object
});

leaderboard.results.forEach(agent => {
    const user = agent.userId_expanded;
    const avgMin = Math.round(agent.avg_talk_seconds / 60);
    console.log(`#${agent.rank} ${user?.name ?? agent.userId} — ${agent.calls_handled} calls, ${avgMin} min avg`);
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {token}' },
    body: JSON.stringify({
        query: `SELECT
                    userId,
                    COUNT(*) AS calls_handled,
                    AVG(duration) AS avg_talk_seconds,
                    SUM(duration) AS total_talk_seconds,
                    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS rank
                FROM cdr
                WHERE direction = 'inbound'
                GROUP BY userId
                HAVING COUNT(*) > 0
                LIMIT 20`,
        expandDetails: true,
    }),
});
const leaderboard = await res.json();
leaderboard.results.forEach(agent => {
    console.log(`#${agent.rank} ${agent.userId} — ${agent.calls_handled} calls`);
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/object/query/v2',
    headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'},
    json={
        'query': """SELECT
                        userId,
                        COUNT(*) AS calls_handled,
                        AVG(duration) AS avg_talk_seconds,
                        SUM(duration) AS total_talk_seconds,
                        ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS rank
                    FROM cdr
                    WHERE direction = 'inbound'
                    GROUP BY userId
                    HAVING COUNT(*) > 0
                    LIMIT 20""",
        'expandDetails': True,
    }
)
leaderboard = response.json()
for agent in leaderboard['results']:
    print(f"#{agent['rank']} {agent['userId']} — {agent['calls_handled']} calls")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "query": "SELECT userId, COUNT(*) AS calls_handled, AVG(duration) AS avg_talk_seconds, ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS rank FROM cdr WHERE direction = 'inbound' GROUP BY userId HAVING COUNT(*) > 0 LIMIT 20",
  "expandDetails": true
}
EOF
)

curl -X POST 'https://{namespace}.api.unbound.cx/object/query/v2' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

### Pattern 3 — Contacts Matching Multiple Criteria

Find contacts by partial name, email, or company — the CRM "type-ahead" or search bar pattern.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function searchContacts(term) {
    const { results } = await api.objects.uoql({
        query: `
            SELECT id, firstName, lastName, email, company, phone, status
            FROM people
            WHERE firstName LIKE '%${term}%'
               OR lastName LIKE '%${term}%'
               OR email LIKE '%${term}%'
               OR company LIKE '%${term}%'
            LIMIT 25
        `,
    });
    return results;
}

// Usage
const matches = await searchContacts('acme');
console.log(`Found ${matches.length} contacts`);

// Combine with AND for power search
const { results } = await api.objects.uoql({
    query: `
        SELECT id, firstName, lastName, email, company
        FROM people
        WHERE (firstName LIKE '%Jane%' OR lastName LIKE '%Jane%')
          AND status = 'active'
          AND company LIKE '%Corp%'
        LIMIT 50
    `,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function searchContacts(term) {
    const res = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {token}' },
        body: JSON.stringify({
            query: `SELECT id, firstName, lastName, email, company, phone, status
                    FROM people
                    WHERE firstName LIKE '%${term}%'
                       OR lastName LIKE '%${term}%'
                       OR email LIKE '%${term}%'
                       OR company LIKE '%${term}%'
                    LIMIT 25`,
        }),
    });
    const data = await res.json();
    return data.results;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

def search_contacts(term):
    response = requests.post(
        'https://{namespace}.api.unbound.cx/object/query/v2',
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'},
        json={
            'query': f"""SELECT id, firstName, lastName, email, company, phone, status
                         FROM people
                         WHERE firstName LIKE '%{term}%'
                            OR lastName LIKE '%{term}%'
                            OR email LIKE '%{term}%'
                            OR company LIKE '%{term}%'
                         LIMIT 25""",
        }
    )
    return response.json()['results']
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
TERM="acme"

curl -X POST 'https://{namespace}.api.unbound.cx/object/query/v2' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d "{\"query\": \"SELECT id, firstName, lastName, email, company FROM people WHERE firstName LIKE '%${TERM}%' OR email LIKE '%${TERM}%' OR company LIKE '%${TERM}%' LIMIT 25\"}"
```

</TabItem>
</Tabs>

:::caution SQL Injection
Always validate or sanitize `term` before interpolating it into UOQL queries when input comes from user-supplied data.
:::

---

### Pattern 4 — Task Queue Depth by Status

Monitor your task router's queue health: how many tasks are in each status bucket right now.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const queueHealth = await api.objects.uoql({
    query: `
        SELECT
            status,
            COUNT(*) AS count,
            AVG(waitDuration) AS avg_wait_seconds
        FROM tasks
        WHERE status IN ('pending', 'assigned', 'open', 'completed', 'abandoned')
        GROUP BY status
    `,
});

// Build a status map for quick lookup
const byStatus = {};
queueHealth.results.forEach(row => {
    byStatus[row.status] = row;
});

const pending = byStatus['pending']?.count ?? 0;
const abandoned = byStatus['abandoned']?.count ?? 0;
const abandonRate = abandoned / (pending + abandoned) * 100;

console.log(`Queue depth (pending): ${pending}`);
console.log(`Abandon rate: ${abandonRate.toFixed(1)}%`);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {token}' },
    body: JSON.stringify({
        query: `SELECT
                    status,
                    COUNT(*) AS count,
                    AVG(waitDuration) AS avg_wait_seconds
                FROM tasks
                WHERE status IN ('pending', 'assigned', 'open', 'completed', 'abandoned')
                GROUP BY status`,
    }),
});
const queueHealth = await res.json();
queueHealth.results.forEach(row => {
    console.log(`${row.status}: ${row.count} tasks, avg wait ${Math.round(row.avg_wait_seconds)}s`);
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/object/query/v2',
    headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'},
    json={
        'query': """SELECT
                        status,
                        COUNT(*) AS count,
                        AVG(waitDuration) AS avg_wait_seconds
                    FROM tasks
                    WHERE status IN ('pending', 'assigned', 'open', 'completed', 'abandoned')
                    GROUP BY status""",
    }
)
queue_health = response.json()
for row in queue_health['results']:
    print(f"{row['status']}: {row['count']} tasks")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "query": "SELECT status, COUNT(*) AS count, AVG(waitDuration) AS avg_wait_seconds FROM tasks WHERE status IN ('pending', 'assigned', 'open', 'completed', 'abandoned') GROUP BY status"
}
EOF
)

curl -X POST 'https://{namespace}.api.unbound.cx/object/query/v2' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

### Pattern 5 — Full Paginator (Iterate All Results)

UOQL uses OFFSET-based pagination. This pattern iterates through all pages without knowing the total up front.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function* queryAll(query, pageSize = 500) {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
        const { results, pagination } = await api.objects.uoql({
            query: `${query} LIMIT ${pageSize} OFFSET ${offset}`,
        });

        yield* results;

        hasMore = pagination.hasNextPage;
        offset += pageSize;
    }
}

// Usage — iterate all CDR records
let totalCalls = 0;
let totalDuration = 0;

for await (const record of queryAll('SELECT id, direction, duration FROM cdr ORDER BY createdAt DESC')) {
    totalCalls++;
    totalDuration += record.duration ?? 0;
}

console.log(`Processed ${totalCalls} records, total duration: ${Math.round(totalDuration / 3600)}h`);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function* queryAll(baseQuery, pageSize = 500) {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
        const res = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {token}' },
            body: JSON.stringify({
                query: `${baseQuery} LIMIT ${pageSize} OFFSET ${offset}`,
            }),
        });
        const { results, pagination } = await res.json();

        yield* results;
        hasMore = pagination.hasNextPage;
        offset += pageSize;
    }
}

// Usage
let count = 0;
for await (const contact of queryAll('SELECT id, email FROM people ORDER BY createdAt DESC')) {
    count++;
    // process contact
}
console.log(`Iterated ${count} contacts`);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

def query_all(base_query, page_size=500):
    offset = 0
    has_more = True

    while has_more:
        response = requests.post(
            'https://{namespace}.api.unbound.cx/object/query/v2',
            headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'},
            json={'query': f'{base_query} LIMIT {page_size} OFFSET {offset}'}
        )
        data = response.json()

        for record in data['results']:
            yield record

        has_more = data['pagination']['hasNextPage']
        offset += page_size

# Usage
count = 0
for contact in query_all('SELECT id, email FROM people ORDER BY createdAt DESC'):
    count += 1
    # process contact

print(f'Iterated {count} contacts')
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Manual pagination with cURL — increment OFFSET by 500 each iteration
OFFSET=0
PAGE_SIZE=500

while true; do
    RESPONSE=$(curl -s -X POST 'https://{namespace}.api.unbound.cx/object/query/v2' \
        -H 'Content-Type: application/json' \
        -H 'Authorization: Bearer {token}' \
        -d "{\"query\": \"SELECT id, email FROM people ORDER BY createdAt DESC LIMIT ${PAGE_SIZE} OFFSET ${OFFSET}\"}")

    echo "$RESPONSE" | jq '.results[]'

    HAS_MORE=$(echo "$RESPONSE" | jq -r '.pagination.hasNextPage')
    if [ "$HAS_MORE" != "true" ]; then
        break
    fi
    OFFSET=$((OFFSET + PAGE_SIZE))
done
```

</TabItem>
</Tabs>

---

### Pattern 6 — Recent Call Recordings

Fetch the 20 most recent call recordings. Storage records with `classification = 'call_recording'` represent recorded calls.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const recordings = await api.objects.uoql({
    query: `
        SELECT id, fileName, fileSize, relatedId, userId, duration, createdAt
        FROM storage
        WHERE classification = 'call_recording'
        ORDER BY createdAt DESC
        LIMIT 20
    `,
    expandDetails: true,   // resolves userId → agent name/email
});

recordings.results.forEach(rec => {
    const agent = rec.userId_expanded;
    const mb = (rec.fileSize / 1024 / 1024).toFixed(1);
    console.log(`${rec.createdAt} | ${agent?.name ?? rec.userId} | ${Math.round(rec.duration / 60)}min | ${mb}MB | ${rec.fileName}`);
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {token}' },
    body: JSON.stringify({
        query: `SELECT id, fileName, fileSize, relatedId, userId, duration, createdAt
                FROM storage
                WHERE classification = 'call_recording'
                ORDER BY createdAt DESC
                LIMIT 20`,
        expandDetails: true,
    }),
});
const recordings = await res.json();
recordings.results.forEach(rec => {
    console.log(`${rec.fileName} — ${Math.round(rec.duration / 60)} min`);
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/object/query/v2',
    headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'},
    json={
        'query': """SELECT id, fileName, fileSize, relatedId, userId, duration, createdAt
                    FROM storage
                    WHERE classification = 'call_recording'
                    ORDER BY createdAt DESC
                    LIMIT 20""",
        'expandDetails': True,
    }
)
recordings = response.json()
for rec in recordings['results']:
    print(f"{rec['fileName']} — {round(rec['duration'] / 60)} min")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "query": "SELECT id, fileName, fileSize, relatedId, userId, duration, createdAt FROM storage WHERE classification = 'call_recording' ORDER BY createdAt DESC LIMIT 20",
  "expandDetails": true
}
EOF
)

curl -X POST 'https://{namespace}.api.unbound.cx/object/query/v2' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

### Pattern 7 — Active Queues with Busiest Queues First

List all queues ranked by number of assigned tasks. Useful for real-time supervisor dashboards.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const queueLoad = await api.objects.uoql({
    query: `
        SELECT
            queueId,
            COUNT(*) AS assigned_tasks,
            RANK() OVER (ORDER BY COUNT(*) DESC) AS load_rank
        FROM tasks
        WHERE status = 'assigned'
        GROUP BY queueId
        LIMIT 25
    `,
    expandDetails: true,   // resolves queueId → queue name/details
});

queueLoad.results.forEach(row => {
    const queue = row.queueId_expanded;
    console.log(`#${row.load_rank} ${queue?.name ?? row.queueId} — ${row.assigned_tasks} active`);
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {token}' },
    body: JSON.stringify({
        query: `SELECT
                    queueId,
                    COUNT(*) AS assigned_tasks,
                    RANK() OVER (ORDER BY COUNT(*) DESC) AS load_rank
                FROM tasks
                WHERE status = 'assigned'
                GROUP BY queueId
                LIMIT 25`,
        expandDetails: true,
    }),
});
const queueLoad = await res.json();
queueLoad.results.forEach(row => {
    console.log(`#${row.load_rank} Queue ${row.queueId} — ${row.assigned_tasks} active tasks`);
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/object/query/v2',
    headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'},
    json={
        'query': """SELECT
                        queueId,
                        COUNT(*) AS assigned_tasks,
                        RANK() OVER (ORDER BY COUNT(*) DESC) AS load_rank
                    FROM tasks
                    WHERE status = 'assigned'
                    GROUP BY queueId
                    LIMIT 25""",
        'expandDetails': True,
    }
)
queue_load = response.json()
for row in queue_load['results']:
    print(f"#{row['load_rank']} Queue {row['queueId']} — {row['assigned_tasks']} active tasks")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "query": "SELECT queueId, COUNT(*) AS assigned_tasks, RANK() OVER (ORDER BY COUNT(*) DESC) AS load_rank FROM tasks WHERE status = 'assigned' GROUP BY queueId LIMIT 25",
  "expandDetails": true
}
EOF
)

curl -X POST 'https://{namespace}.api.unbound.cx/object/query/v2' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

### Pattern 8 — SMS / Email Message Activity

Count outbound messages by channel and status. Useful for campaign delivery tracking.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// SMS delivery breakdown
const smsStats = await api.objects.uoql({
    query: `
        SELECT
            status,
            direction,
            COUNT(*) AS count
        FROM messagesSmsMms
        WHERE direction = 'outbound'
        GROUP BY status, direction
        HAVING COUNT(*) > 0
    `,
});

// Email campaign stats
const emailStats = await api.objects.uoql({
    query: `
        SELECT
            status,
            COUNT(*) AS count,
            SUM(openCount) AS total_opens,
            SUM(clickCount) AS total_clicks
        FROM emails
        WHERE direction = 'outbound'
        GROUP BY status
    `,
});

console.log('SMS delivery:', smsStats.results);
console.log('Email stats:', emailStats.results);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// SMS delivery breakdown
const smsRes = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {token}' },
    body: JSON.stringify({
        query: `SELECT status, direction, COUNT(*) AS count
                FROM messagesSmsMms
                WHERE direction = 'outbound'
                GROUP BY status, direction
                HAVING COUNT(*) > 0`,
    }),
});
const smsStats = await smsRes.json();
console.log('SMS delivery:', smsStats.results);

// Email campaign stats
const emailRes = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {token}' },
    body: JSON.stringify({
        query: `SELECT status, COUNT(*) AS count, SUM(openCount) AS total_opens, SUM(clickCount) AS total_clicks
                FROM emails
                WHERE direction = 'outbound'
                GROUP BY status`,
    }),
});
const emailStats = await emailRes.json();
console.log('Email stats:', emailStats.results);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# SMS delivery breakdown
sms_response = requests.post(
    'https://{namespace}.api.unbound.cx/object/query/v2',
    headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'},
    json={
        'query': """SELECT status, direction, COUNT(*) AS count
                    FROM messagesSmsMms
                    WHERE direction = 'outbound'
                    GROUP BY status, direction
                    HAVING COUNT(*) > 0""",
    }
)
sms_stats = sms_response.json()
print('SMS delivery:', sms_stats['results'])

# Email campaign stats
email_response = requests.post(
    'https://{namespace}.api.unbound.cx/object/query/v2',
    headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'},
    json={
        'query': """SELECT status, COUNT(*) AS count, SUM(openCount) AS total_opens, SUM(clickCount) AS total_clicks
                    FROM emails
                    WHERE direction = 'outbound'
                    GROUP BY status""",
    }
)
email_stats = email_response.json()
print('Email stats:', email_stats['results'])
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# SMS delivery breakdown
curl -X POST 'https://{namespace}.api.unbound.cx/object/query/v2' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d '{"query": "SELECT status, direction, COUNT(*) AS count FROM messagesSmsMms WHERE direction = '\''outbound'\'' GROUP BY status, direction HAVING COUNT(*) > 0"}'

# Email campaign stats
curl -X POST 'https://{namespace}.api.unbound.cx/object/query/v2' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d '{"query": "SELECT status, COUNT(*) AS count, SUM(openCount) AS total_opens, SUM(clickCount) AS total_clicks FROM emails WHERE direction = '\''outbound'\'' GROUP BY status"}'
```

</TabItem>
</Tabs>

---

### Pattern 9 — CRM Funnel: Contacts by Status

Count your contacts or leads at each stage of a CRM pipeline. Great for sales funnel reporting.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const funnel = await api.objects.uoql({
    query: `
        SELECT
            status,
            COUNT(*) AS total,
            RANK() OVER (ORDER BY COUNT(*) DESC) AS volume_rank
        FROM people
        GROUP BY status
        HAVING COUNT(*) > 0
    `,
});

// Build ordered funnel
const stages = ['new', 'contacted', 'qualified', 'demo', 'proposal', 'won', 'lost'];
const byStatus = {};
funnel.results.forEach(r => { byStatus[r.status] = r.total; });

stages.forEach(stage => {
    const count = byStatus[stage] ?? 0;
    const bar = '█'.repeat(Math.ceil(count / 10));
    console.log(`${stage.padEnd(12)} ${bar} ${count}`);
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {token}' },
    body: JSON.stringify({
        query: `SELECT
                    status,
                    COUNT(*) AS total,
                    RANK() OVER (ORDER BY COUNT(*) DESC) AS volume_rank
                FROM people
                GROUP BY status
                HAVING COUNT(*) > 0`,
    }),
});
const funnel = await res.json();
funnel.results.forEach(row => {
    console.log(`${row.status}: ${row.total}`);
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/object/query/v2',
    headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'},
    json={
        'query': """SELECT
                        status,
                        COUNT(*) AS total,
                        RANK() OVER (ORDER BY COUNT(*) DESC) AS volume_rank
                    FROM people
                    GROUP BY status
                    HAVING COUNT(*) > 0""",
    }
)
funnel = response.json()
for row in funnel['results']:
    print(f"{row['status']}: {row['total']}")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "query": "SELECT status, COUNT(*) AS total, RANK() OVER (ORDER BY COUNT(*) DESC) AS volume_rank FROM people GROUP BY status HAVING COUNT(*) > 0"
}
EOF
)

curl -X POST 'https://{namespace}.api.unbound.cx/object/query/v2' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

### Pattern 10 — Stale Leads Report

Find leads that haven't been contacted in over 30 days and are still open. Requires a `lastContactedAt` field on your object.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// ISO date 30 days ago
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

const staleLeads = await api.objects.uoql({
    query: `
        SELECT id, firstName, lastName, email, company, lastContactedAt, status
        FROM leads
        WHERE status = 'open'
          AND lastContactedAt <= '${thirtyDaysAgo}'
        ORDER BY lastContactedAt DESC
        LIMIT 100
    `,
});

console.log(`${staleLeads.results.length} leads stale since ${thirtyDaysAgo}`);

// Bulk update them to 'cold'
if (staleLeads.results.length > 0) {
    await api.objects.update({
        object: 'leads',
        where: {
            status: 'open',
            // use the list of IDs to be safe
        },
        update: { status: 'cold' },
    });
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

const res = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer {token}' },
    body: JSON.stringify({
        query: `SELECT id, firstName, lastName, email, company, lastContactedAt, status
                FROM leads
                WHERE status = 'open'
                  AND lastContactedAt <= '${thirtyDaysAgo}'
                ORDER BY lastContactedAt DESC
                LIMIT 100`,
    }),
});
const staleLeads = await res.json();
console.log(`${staleLeads.results.length} stale leads`);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from datetime import datetime, timedelta

thirty_days_ago = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')

response = requests.post(
    'https://{namespace}.api.unbound.cx/object/query/v2',
    headers={'Content-Type': 'application/json', 'Authorization': 'Bearer {token}'},
    json={
        'query': f"""SELECT id, firstName, lastName, email, company, lastContactedAt, status
                     FROM leads
                     WHERE status = 'open'
                       AND lastContactedAt <= '{thirty_days_ago}'
                     ORDER BY lastContactedAt DESC
                     LIMIT 100""",
    }
)
stale_leads = response.json()
print(f"{len(stale_leads['results'])} stale leads")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
THIRTY_DAYS_AGO=$(date -d '30 days ago' '+%Y-%m-%d' 2>/dev/null || date -v -30d '+%Y-%m-%d')

curl -X POST 'https://{namespace}.api.unbound.cx/object/query/v2' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {token}' \
  -d "{\"query\": \"SELECT id, firstName, lastName, email, lastContactedAt FROM leads WHERE status = 'open' AND lastContactedAt <= '${THIRTY_DAYS_AGO}' ORDER BY lastContactedAt DESC LIMIT 100\"}"
```

</TabItem>
</Tabs>

---

## Limitations (v2.0)

- No `BETWEEN` — use `>= x AND <= y`
- No `SELECT *` — always list fields explicitly
- No subqueries or JOINs
- `ORDER BY` supports `createdAt` only (custom field ordering coming)
- Max **500 records** per query
