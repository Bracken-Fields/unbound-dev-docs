---
id: objects
title: Objects & UOQL
---

# Objects & UOQL

The `objects` command, its `query` alias, and the `uoql` command give you powerful ways to inspect and query platform data. Use `objects` for structured queries with filters and field selection, or use `uoql` to write full SQL against the Unbound Object Query Language engine.

---

## objects

Manage and query platform objects.

### Subcommands

#### `unbound objects list [options]`

List all available object types on the platform.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound objects list
```

---

#### `unbound objects query <type> [options]`

Query records of a specific object type. Supports filtering, field selection, ordering, and relationship expansion.

| Option | Description |
|---|---|
| `--where <filters...>` | Filter conditions (e.g., `status=active`) |
| `--select <fields>` | Comma-separated list of fields to return |
| `--limit <number>` | Maximum number of records to return |
| `--order <field>` | Field to sort results by |
| `--expand` | Expand related object references |
| `--json` | Output raw JSON |

**Example -- query contacts with filters:**

```bash
unbound objects query contacts --where "status=active" --limit 10
```

**Example -- select specific fields and order results:**

```bash
unbound objects query contacts --select "name,email,phone" --order "name" --limit 50
```

**Example -- expand related records:**

```bash
unbound objects query tasks --where "status=open" --expand --json
```

---

#### `unbound objects describe <type> [options]`

Describe the schema of an object type, including its fields, data types, and relationships.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound objects describe contacts
```

---

## query

The `query` command is a shorthand alias for `objects query`. It accepts the same options.

**Example:**

```bash
unbound query contacts --where "status=active" --select "name,email" --limit 25
```

---

## uoql

Run a UOQL (Unbound Object Query Language) SQL query against your platform data. UOQL supports standard SQL syntax including `SELECT`, `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`, and `OFFSET`.

#### `unbound uoql <sql> [options]`

Execute a UOQL SQL query.

| Option | Description |
|---|---|
| `--expand` | Expand related object references in the results |
| `--json` | Output raw JSON |

**Example -- basic query:**

```bash
unbound uoql "SELECT name, email FROM contacts WHERE created_at > '2025-01-01' LIMIT 20"
```

**Example -- aggregation with grouping:**

```bash
unbound uoql "SELECT status, COUNT(*) as total FROM tasks GROUP BY status ORDER BY total DESC"
```

**Example -- join and filter:**

```bash
unbound uoql "SELECT c.name, t.subject FROM contacts c JOIN tasks t ON c.id = t.contact_id WHERE t.status = 'open'"
```

**Example -- window functions:**

```bash
unbound uoql "SELECT name, created_at, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num FROM contacts LIMIT 10"
```

**Example -- expand related objects:**

```bash
unbound uoql "SELECT * FROM tasks WHERE assignee IS NOT NULL LIMIT 5" --expand
```

**Example -- pipe JSON output for processing:**

```bash
unbound uoql "SELECT name, phone FROM contacts WHERE phone IS NOT NULL" --json | jq '.[] | .phone'
```
