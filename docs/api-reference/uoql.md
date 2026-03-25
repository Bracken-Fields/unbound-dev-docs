---
id: uoql
title: UOQL — Query Language
---

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

### Direct REST

If you're calling the API directly (without the SDK):

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

```javascript
const data = await api.objects.uoql({
    query: 'SELECT id, direction, duration, userId FROM cdr LIMIT 25',
    expandDetails: true,
});
// userId field will be expanded to a full user object
```

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

## Limitations (v2.0)

- No `BETWEEN` — use `>= x AND <= y`
- No `SELECT *` — always list fields explicitly
- No subqueries or JOINs
- `ORDER BY` supports `createdAt` only (custom field ordering coming)
- Max **500 records** per query
