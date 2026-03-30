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

---

## Scripting Patterns

### Pattern 1 — Explore all object types on a namespace

Get a quick overview of what objects exist and how many records each contains:

```bash
#!/bin/bash

echo "=== Object Inventory ==="

unbound objects list --json | jq -r '.[].name' | while read -r obj; do
    COUNT=$(unbound uoql "SELECT COUNT(*) as c FROM $obj" --json 2>/dev/null | jq -r '.[0].c // "?"')
    printf "  %-30s %s records\n" "$obj" "$COUNT"
done
```

### Pattern 2 — Describe all object schemas and export to file

Document your full data model for onboarding or compliance:

```bash
#!/bin/bash

OUTPUT="schema-$(date +%Y%m%d).json"
SCHEMAS=()

unbound objects list --json | jq -r '.[].name' | while read -r obj; do
    echo "Describing $obj..."
    schema=$(unbound objects describe "$obj" --json)
    echo "$schema" | jq --arg name "$obj" '{object: $name, fields: .}' >> "$OUTPUT.tmp"
done

# Combine into single JSON array
jq -s '.' "$OUTPUT.tmp" > "$OUTPUT"
rm "$OUTPUT.tmp"

echo "Schema exported: $OUTPUT"
```

### Pattern 3 — Full table export with pagination

Export every record from a large object type to a JSON file:

```bash
#!/bin/bash

OBJECT="contacts"
OUTPUT="${OBJECT}-full-export-$(date +%Y%m%d).json"
LIMIT=500
OFFSET=0
TOTAL=0

echo "[]" > "$OUTPUT"

while true; do
    BATCH=$(unbound uoql \
        "SELECT * FROM $OBJECT ORDER BY createdAt ASC LIMIT $LIMIT OFFSET $OFFSET" \
        --json)

    COUNT=$(echo "$BATCH" | jq 'length')
    [ "$COUNT" -eq 0 ] && break

    # Merge batch into output file
    jq -s '.[0] + .[1]' "$OUTPUT" <(echo "$BATCH") > "$OUTPUT.tmp" && mv "$OUTPUT.tmp" "$OUTPUT"

    TOTAL=$((TOTAL + COUNT))
    echo "  Exported $TOTAL records..."
    OFFSET=$((OFFSET + LIMIT))
    [ "$COUNT" -lt "$LIMIT" ] && break
done

echo "Export complete: $OUTPUT ($TOTAL records)"
```

### Pattern 4 — Cross-object report: open tasks per contact

Build a relational report joining contacts and tasks:

```bash
#!/bin/bash

echo "=== Open Tasks Per Contact (Top 20) ==="

unbound uoql "
    SELECT c.name, c.email, COUNT(t.id) as openTasks
    FROM contacts c
    JOIN tasks t ON t.contactId = c.id
    WHERE t.status = 'open'
    GROUP BY c.id, c.name, c.email
    ORDER BY openTasks DESC
    LIMIT 20
" --json | jq -r '.[] | "\(.openTasks)\t\(.name)\t\(.email // "—")"' | \
    column -t -s $'\t'
```

### Pattern 5 — Stale data cleanup report

Find records that haven't been updated in 90 days and flag them:

```bash
#!/bin/bash

DAYS=90
CUTOFF=$(date -v-${DAYS}d +%Y-%m-%d 2>/dev/null || date -d "${DAYS} days ago" +%Y-%m-%d)

for OBJ in contacts leads opportunities; do
    COUNT=$(unbound uoql \
        "SELECT COUNT(*) as c FROM $OBJ WHERE updatedAt < '$CUTOFF'" \
        --json 2>/dev/null | jq -r '.[0].c // 0')

    if [ "$COUNT" -gt 0 ]; then
        echo "⚠ $OBJ: $COUNT records not updated in ${DAYS}+ days"

        unbound uoql \
            "SELECT id, name, updatedAt FROM $OBJ WHERE updatedAt < '$CUTOFF' LIMIT 5" \
            --json | jq -r '.[] | "    \(.id)  \(.name // "unnamed")  (last: \(.updatedAt))"'
    else
        echo "✓ $OBJ: all records updated within ${DAYS} days"
    fi
done
```

### Pattern 6 — Validate required fields across records

Audit records missing required fields and output a CSV for remediation:

```bash
#!/bin/bash

OBJECT="contacts"
REQUIRED_FIELDS=("name" "email" "phone")
OUTPUT="missing-fields-$(date +%Y%m%d).csv"

echo "id,name,missingFields" > "$OUTPUT"

unbound uoql \
    "SELECT id, name, email, phone FROM $OBJECT LIMIT 5000" \
    --json | jq -c '.[]' | \
while IFS= read -r record; do
    id=$(echo "$record" | jq -r '.id')
    name=$(echo "$record" | jq -r '.name // ""')
    missing=()

    for field in "${REQUIRED_FIELDS[@]}"; do
        val=$(echo "$record" | jq -r --arg f "$field" '.[$f] // ""')
        [ -z "$val" ] && missing+=("$field")
    done

    if [ "${#missing[@]}" -gt 0 ]; then
        missing_str=$(IFS=';'; echo "${missing[*]}")
        echo "\"$id\",\"$name\",\"$missing_str\"" >> "$OUTPUT"
    fi
done

ROWS=$(($(wc -l < "$OUTPUT") - 1))
echo "Audit complete: $ROWS records with missing fields → $OUTPUT"
```
