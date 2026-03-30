---
id: objects
title: Objects (Data)
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Objects

`api.objects` — A flexible CRM-style data layer. Store and query any structured data — contacts, leads, tickets, orders, and custom types you define.

Object types are user-definable schemas. Use schema management methods to create types and columns, then CRUD methods to work with records.

---

## Core Record Methods

### `objects.create(params)`

Create a new record.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Preferred (new) syntax
const contact = await api.objects.create({
    object: 'contacts',
    body: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        company: 'Acme Corp',
        status: 'active',
    },
});

// Returns the created record with generated id
console.log(contact.id); // 'rec_abc123'

// Legacy syntax (also supported)
const contact = await api.objects.create('contacts', {
    name: 'Jane Smith',
    email: 'jane@example.com',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/contacts", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1234567890",
    company: "Acme Corp",
    status: "active"
  })
});
const contact = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "Jane Smith",
    "email" => "jane@example.com",
    "phone" => "+1234567890",
    "company" => "Acme Corp",
    "status" => "active"
]));
$contact = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/object/contacts",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1234567890",
        "company": "Acme Corp",
        "status": "active"
    }
)
contact = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "status": "active"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/contacts" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `object` | string | ✓ | Object type to create the record in |
| `body` | object | ✓ | Field values for the new record |

---

### `objects.byId(params)`

Fetch a single record by ID.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Simple lookup
const contact = await api.objects.byId('rec_abc123');

// With field selection
const contact = await api.objects.byId({
    id: 'rec_abc123',
    query: { select: 'id,name,email,company' },
});

// Cleaned for AI prompt usage (removes internal system fields)
const contact = await api.objects.byId({
    id: 'rec_abc123',
    isAiPrompt: true,
});

console.log(contact);
// {
//   id: 'rec_abc123',
//   name: 'Jane Smith',
//   email: 'jane@example.com',
//   company: 'Acme Corp',
//   status: 'active',
//   createdAt: '2024-01-15T10:30:00Z',
//   updatedAt: '2024-01-15T14:22:00Z'
// }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Simple lookup
const res = await fetch("https://{namespace}.api.unbound.cx/object/record/rec_abc123", {
  headers: { "Authorization": "Bearer {token}" }
});
const contact = await res.json();

// With field selection
const res = await fetch("https://{namespace}.api.unbound.cx/object/record/rec_abc123?select=id,name,email,company", {
  headers: { "Authorization": "Bearer {token}" }
});
const contact = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Simple lookup
$ch = curl_init("https://{namespace}.api.unbound.cx/object/record/rec_abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$contact = json_decode(curl_exec($ch), true);
curl_close($ch);

// With field selection
$ch = curl_init("https://{namespace}.api.unbound.cx/object/record/rec_abc123?select=id,name,email,company");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$contact = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Simple lookup
response = requests.get(
    "https://{namespace}.api.unbound.cx/object/record/rec_abc123",
    headers={"Authorization": "Bearer {token}"}
)
contact = response.json()

# With field selection
response = requests.get(
    "https://{namespace}.api.unbound.cx/object/record/rec_abc123",
    headers={"Authorization": "Bearer {token}"},
    params={"select": "id,name,email,company"}
)
contact = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Simple lookup
curl "https://{namespace}.api.unbound.cx/object/record/rec_abc123" \
  -H "Authorization: Bearer {token}"

# With field selection
curl "https://{namespace}.api.unbound.cx/object/record/rec_abc123?select=id,name,email,company" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✓ | Record ID |
| `query.select` | string | — | Comma-separated list of fields to return |
| `isAiPrompt` | boolean | — | Strip system fields for AI prompt use |

---

### `objects.query(options)`

Query records with filters, sorting, and pagination.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Basic query with filters
const results = await api.objects.query({
    object: 'contacts',
    where: { company: 'Acme Corp', status: 'active' },
    limit: 50,
});

// With field selection and sorting
const results = await api.objects.query({
    object: 'contacts',
    select: ['id', 'name', 'email', 'company'],
    where: { status: 'active' },
    limit: 25,
    orderByDirection: 'ASC',
});

// With related data expanded
const results = await api.objects.query({
    object: 'contacts',
    expandDetails: true,
    limit: 100,
});

// results.data → array of records
// results.data[0].id → use as nextId for cursor pagination
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/contacts/query", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    where: { company: "Acme Corp", status: "active" },
    select: ["id", "name", "email", "company"],
    limit: 50,
    orderByDirection: "ASC",
    expandDetails: true
  })
});
const results = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts/query");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "where" => ["company" => "Acme Corp", "status" => "active"],
    "select" => ["id", "name", "email", "company"],
    "limit" => 50,
    "orderByDirection" => "ASC",
    "expandDetails" => true
]));
$results = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/object/contacts/query",
    headers={"Authorization": "Bearer {token}"},
    json={
        "where": {"company": "Acme Corp", "status": "active"},
        "select": ["id", "name", "email", "company"],
        "limit": 50,
        "orderByDirection": "ASC",
        "expandDetails": True
    }
)
results = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "where": {"company": "Acme Corp", "status": "active"},
  "select": ["id", "name", "email", "company"],
  "limit": 50,
  "orderByDirection": "ASC",
  "expandDetails": true
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/contacts/query" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

Paginate through all records:

```javascript
let nextId = null;
do {
    const page = await api.objects.query({
        object: 'contacts',
        limit: 100,
        nextId,
    });
    process(page.data);
    nextId = page.data.length === 100 ? page.data[page.data.length - 1].id : null;
} while (nextId);
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `object` | string | — | Object type to query |
| `select` | string[] | — | Fields to return (omit for all) |
| `where` | object | `{}` | Field equality filters |
| `limit` | number | `100` | Max records per page |
| `nextId` | string | — | Cursor for next page (ID of last record from previous page) |
| `previousId` | string | — | Cursor for previous page |
| `orderByDirection` | `'ASC'` \| `'DESC'` | `'DESC'` | Sort direction |
| `expandDetails` | boolean | `false` | Resolve related object references inline |
| `meta` | object | `{}` | Additional metadata to pass with the query |

**Response shape:**
```javascript
{
    data: [
        {
            id: 'rec_abc123',
            name: 'Jane Smith',
            email: 'jane@example.com',
            // ... other fields
        },
        // ...
    ]
}
```

**Legacy syntax:**
```javascript
await api.objects.query('contacts', { status: 'active', limit: 25 });
```

---

### `objects.updateById(params)`

Update a single record by ID.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Preferred syntax
const updated = await api.objects.updateById({
    object: 'contacts',
    id: 'rec_abc123',
    update: {
        company: 'New Corp',
        status: 'inactive',
        updatedAt: new Date().toISOString(),
    },
});

// Legacy syntax
await api.objects.updateById('contacts', 'rec_abc123', {
    company: 'New Corp',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/contacts/rec_abc123", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    company: "New Corp",
    status: "inactive"
  })
});
const updated = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts/rec_abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "company" => "New Corp",
    "status" => "inactive"
]));
$updated = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.put(
    "https://{namespace}.api.unbound.cx/object/contacts/rec_abc123",
    headers={"Authorization": "Bearer {token}"},
    json={
        "company": "New Corp",
        "status": "inactive"
    }
)
updated = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "company": "New Corp",
  "status": "inactive"
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/object/contacts/rec_abc123" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `object` | string | ✓ | Object type |
| `id` | string | ✓ | Record ID to update |
| `update` | object | ✓ | Fields to update (partial updates supported) |

---

### `objects.update({ object, where, update })`

Bulk update records matching a `where` clause.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Update all matching records
const result = await api.objects.update({
    object: 'contacts',
    where: { company: 'Old Corp', status: 'active' },
    update: { company: 'Acquired Corp' },
});

// Mark all unresponsive leads as cold
await api.objects.update({
    object: 'leads',
    where: { lastContactDays: 90, status: 'open' },
    update: { status: 'cold', archivedAt: new Date().toISOString() },
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/contacts", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    where: { company: "Old Corp", status: "active" },
    update: { company: "Acquired Corp" }
  })
});
const result = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "where" => ["company" => "Old Corp", "status" => "active"],
    "update" => ["company" => "Acquired Corp"]
]));
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.put(
    "https://{namespace}.api.unbound.cx/object/contacts",
    headers={"Authorization": "Bearer {token}"},
    json={
        "where": {"company": "Old Corp", "status": "active"},
        "update": {"company": "Acquired Corp"}
    }
)
result = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "where": {"company": "Old Corp", "status": "active"},
  "update": {"company": "Acquired Corp"}
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/object/contacts" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `object` | string | ✓ | Object type |
| `where` | object | ✓ | Filter — all matching records will be updated |
| `update` | object | ✓ | Fields to set on matching records |

:::caution
`where: {}` will update **all** records of that type. Always double-check your filter.
:::

---

### `objects.deleteById({ object, id })`

Delete a single record by ID.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.objects.deleteById({
    object: 'contacts',
    id: 'rec_abc123',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/contacts/rec_abc123", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts/rec_abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    "https://{namespace}.api.unbound.cx/object/contacts/rec_abc123",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/object/contacts/rec_abc123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### `objects.delete({ object, where })`

Delete records matching a `where` clause.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Delete all archived contacts older than a date
await api.objects.delete({
    object: 'contacts',
    where: { status: 'archived', company: 'Old Corp' },
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/contacts", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    where: { status: "archived", company: "Old Corp" }
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "where" => ["status" => "archived", "company" => "Old Corp"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    "https://{namespace}.api.unbound.cx/object/contacts",
    headers={"Authorization": "Bearer {token}"},
    json={
        "where": {"status": "archived", "company": "Old Corp"}
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "where": {"status": "archived", "company": "Old Corp"}
}
EOF
)

curl -X DELETE "https://{namespace}.api.unbound.cx/object/contacts" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

:::caution
`where: {}` will delete **all** records of that type. There is no soft delete — this is permanent.
:::

---

## Schema Inspection

### `objects.list()`

List all object types defined in your namespace.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const types = await api.objects.list();
// → ['contacts', 'leads', 'tickets', 'orders', 'invoices', ...]
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/types", {
  headers: { "Authorization": "Bearer {token}" }
});
const types = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/types");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$types = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/object/types",
    headers={"Authorization": "Bearer {token}"}
)
types = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/object/types" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### `objects.describe(object)`

Inspect the full schema for an object type.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const schema = await api.objects.describe('contacts');

console.log(schema);
// {
//   name: 'contacts',
//   fields: [
//     { name: 'id', type: 'varchar', required: true, isSystem: true },
//     { name: 'name', type: 'varchar', length: 255, required: false },
//     { name: 'email', type: 'varchar', length: 255, required: false },
//     { name: 'companyId', type: 'varchar', required: false },
//     { name: 'status', type: 'varchar', length: 50, required: false },
//     { name: 'fullName', type: 'varchar', isGenerated: true },
//     ...
//   ]
// }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/contacts/describe", {
  headers: { "Authorization": "Bearer {token}" }
});
const schema = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts/describe");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$schema = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/object/contacts/describe",
    headers={"Authorization": "Bearer {token}"}
)
schema = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/object/contacts/describe" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Schema Management

### `objects.createObject({ name })`

Create a new object type (table).

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.objects.createObject({ name: 'invoices' });
await api.objects.createObject({ name: 'support_tickets' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/types", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ name: "invoices" })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/types");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["name" => "invoices"]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/object/types",
    headers={"Authorization": "Bearer {token}"},
    json={"name": "invoices"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/object/types" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "invoices"}'
```

</TabItem>
</Tabs>

---

### `objects.createColumn(params)`

Add one or more columns to an existing object type.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Single column
await api.objects.createColumn({
    objectName: 'invoices',
    name: 'amount',
    type: 'decimal',
    isRequired: true,
});

// Single column with all options
await api.objects.createColumn({
    objectName: 'invoices',
    name: 'invoiceNumber',
    type: 'varchar',
    length: 50,
    defaultValue: 'INV-0000',
    isEncrypted: false,
    isRequired: true,
});

// Batch — add multiple columns at once
await api.objects.createColumn({
    objectName: 'invoices',
    columns: [
        { name: 'amount', type: 'decimal' },
        { name: 'dueDate', type: 'datetime' },
        { name: 'status', type: 'varchar', length: 50 },
        { name: 'notes', type: 'text' },
        { name: 'isPaid', type: 'boolean' },
        { name: 'metadata', type: 'json' },
    ],
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Single column
const res = await fetch("https://{namespace}.api.unbound.cx/object/invoices/columns", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "amount",
    type: "decimal",
    isRequired: true
  })
});
const data = await res.json();

// Batch — add multiple columns at once
const res = await fetch("https://{namespace}.api.unbound.cx/object/invoices/columns", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    columns: [
      { name: "amount", type: "decimal" },
      { name: "dueDate", type: "datetime" },
      { name: "status", type: "varchar", length: 50 },
      { name: "notes", type: "text" },
      { name: "isPaid", type: "boolean" },
      { name: "metadata", type: "json" }
    ]
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Single column
$ch = curl_init("https://{namespace}.api.unbound.cx/object/invoices/columns");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "amount",
    "type" => "decimal",
    "isRequired" => true
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Batch — add multiple columns at once
$ch = curl_init("https://{namespace}.api.unbound.cx/object/invoices/columns");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "columns" => [
        ["name" => "amount", "type" => "decimal"],
        ["name" => "dueDate", "type" => "datetime"],
        ["name" => "status", "type" => "varchar", "length" => 50],
        ["name" => "notes", "type" => "text"],
        ["name" => "isPaid", "type" => "boolean"],
        ["name" => "metadata", "type" => "json"]
    ]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Single column
response = requests.post(
    "https://{namespace}.api.unbound.cx/object/invoices/columns",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "amount",
        "type": "decimal",
        "isRequired": True
    }
)
data = response.json()

# Batch — add multiple columns at once
response = requests.post(
    "https://{namespace}.api.unbound.cx/object/invoices/columns",
    headers={"Authorization": "Bearer {token}"},
    json={
        "columns": [
            {"name": "amount", "type": "decimal"},
            {"name": "dueDate", "type": "datetime"},
            {"name": "status", "type": "varchar", "length": 50},
            {"name": "notes", "type": "text"},
            {"name": "isPaid", "type": "boolean"},
            {"name": "metadata", "type": "json"}
        ]
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Single column
DATA=$(cat <<'EOF'
{
  "name": "amount",
  "type": "decimal",
  "isRequired": true
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/invoices/columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Batch — add multiple columns at once
DATA=$(cat <<'EOF'
{
  "columns": [
    {"name": "amount", "type": "decimal"},
    {"name": "dueDate", "type": "datetime"},
    {"name": "status", "type": "varchar", "length": 50},
    {"name": "notes", "type": "text"},
    {"name": "isPaid", "type": "boolean"},
    {"name": "metadata", "type": "json"}
  ]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/invoices/columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `objectName` | string | ✓ | Target object type |
| `name` | string | ✓* | Column name (*required unless using `columns`) |
| `type` | string | ✓* | Column data type (*required unless using `columns`) |
| `columns` | object[] | — | Array of column definitions for batch creation |
| `length` | number | — | Max character length (for varchar) |
| `defaultValue` | string | — | Default value for new records |
| `isEncrypted` | boolean | `false` | Encrypt column values at rest |
| `isRequired` | boolean | `false` | Require a value on create |

**Column types:**

| Type | Description |
|---|---|
| `varchar` | Short string (default length 255) |
| `text` | Long string / unlimited length |
| `int` | Integer number |
| `decimal` | Floating-point / decimal number |
| `boolean` | True/false flag |
| `datetime` | Date and time value |
| `json` | Arbitrary JSON blob |

---

### `objects.modifyColumn(params)`

Modify an existing column's definition.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Change type and length
await api.objects.modifyColumn({
    objectName: 'invoices',
    columnName: 'status',
    columnType: 'varchar',
    length: 100,
});

// Add a default value and make required
await api.objects.modifyColumn({
    objectName: 'contacts',
    columnName: 'tier',
    columnType: 'varchar',
    defaultValue: 'standard',
    isRequired: true,
});

// Encrypt an existing column
await api.objects.modifyColumn({
    objectName: 'contacts',
    columnName: 'ssn',
    columnType: 'varchar',
    isEncrypted: true,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Change type and length
const res = await fetch("https://{namespace}.api.unbound.cx/object/invoices/columns/status", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    columnType: "varchar",
    length: 100
  })
});
const data = await res.json();

// Add a default value and make required
const res2 = await fetch("https://{namespace}.api.unbound.cx/object/contacts/columns/tier", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    columnType: "varchar",
    defaultValue: "standard",
    isRequired: true
  })
});
const data2 = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Change type and length
$ch = curl_init("https://{namespace}.api.unbound.cx/object/invoices/columns/status");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "columnType" => "varchar",
    "length" => 100
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Add a default value and make required
$ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts/columns/tier");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "columnType" => "varchar",
    "defaultValue" => "standard",
    "isRequired" => true
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Change type and length
response = requests.put(
    "https://{namespace}.api.unbound.cx/object/invoices/columns/status",
    headers={"Authorization": "Bearer {token}"},
    json={"columnType": "varchar", "length": 100}
)
data = response.json()

# Add a default value and make required
response = requests.put(
    "https://{namespace}.api.unbound.cx/object/contacts/columns/tier",
    headers={"Authorization": "Bearer {token}"},
    json={
        "columnType": "varchar",
        "defaultValue": "standard",
        "isRequired": True
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Change type and length
curl -X PUT "https://{namespace}.api.unbound.cx/object/invoices/columns/status" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"columnType": "varchar", "length": 100}'

# Add a default value and make required
DATA=$(cat <<'EOF'
{
  "columnType": "varchar",
  "defaultValue": "standard",
  "isRequired": true
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/object/contacts/columns/tier" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `objectName` | string | ✓ | Object type containing the column |
| `columnName` | string | ✓ | Column to modify |
| `columnType` | string | — | New data type |
| `length` | number | — | New max length |
| `defaultValue` | string | — | New default value |
| `isEncrypted` | boolean | — | Toggle encryption |
| `isRequired` | boolean | — | Toggle required constraint |

---

### `objects.deleteColumn({ objectName, columnName })`

Permanently remove a column from an object type.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.objects.deleteColumn({
    objectName: 'contacts',
    columnName: 'legacyExternalId',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/contacts/columns/legacyExternalId", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts/columns/legacyExternalId");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    "https://{namespace}.api.unbound.cx/object/contacts/columns/legacyExternalId",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/object/contacts/columns/legacyExternalId" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

:::danger
Deletes the column and all data in it. This is irreversible.
:::

---

## Expand Details

Expand details are join definitions — when querying an object, related objects can be auto-resolved and inlined. Enable with `expandDetails: true` on any query.

### `objects.createExpandDetail(params)`

Define a join relationship between two object types.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// contacts.companyId → companies.id
await api.objects.createExpandDetail({
    objectName: 'contacts',
    fieldName: 'companyId',
    targetObject: 'companies',
    lookupColumn: 'id',
    expandFields: ['name', 'website', 'industry', 'tier'],
});

// tickets.assignedUserId → users.id
await api.objects.createExpandDetail({
    objectName: 'tickets',
    fieldName: 'assignedUserId',
    targetObject: 'users',
    lookupColumn: 'id',
    expandFields: ['name', 'email', 'role'],
    keyField: 'userId',   // custom key name in expanded output
    isActive: true,
});

// Now queries return expanded data automatically
const tickets = await api.objects.query({
    object: 'tickets',
    expandDetails: true,
});
// tickets.data[0].assignedUserId_expanded → { name: 'Alice', email: '...', role: 'agent' }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/expand-details", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    objectName: "contacts",
    fieldName: "companyId",
    targetObject: "companies",
    lookupColumn: "id",
    expandFields: ["name", "website", "industry", "tier"]
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/expand-details");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "objectName" => "contacts",
    "fieldName" => "companyId",
    "targetObject" => "companies",
    "lookupColumn" => "id",
    "expandFields" => ["name", "website", "industry", "tier"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/object/expand-details",
    headers={"Authorization": "Bearer {token}"},
    json={
        "objectName": "contacts",
        "fieldName": "companyId",
        "targetObject": "companies",
        "lookupColumn": "id",
        "expandFields": ["name", "website", "industry", "tier"]
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "objectName": "contacts",
  "fieldName": "companyId",
  "targetObject": "companies",
  "lookupColumn": "id",
  "expandFields": ["name", "website", "industry", "tier"]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/expand-details" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `objectName` | string | ✓ | Source object type |
| `fieldName` | string | ✓ | Field on the source that holds the foreign ID |
| `targetObject` | string | ✓ | Target object type to look up |
| `lookupColumn` | string | ✓ | Column on target to match against (usually `'id'`) |
| `expandFields` | string[] | ✓ | Fields from target to include in expanded output |
| `keyField` | string | — | Custom key name for expanded output (defaults to `fieldName + '_expanded'`) |
| `isActive` | boolean | `true` | Whether this expand detail is currently active |
| `isSystem` | number | `0` | Mark as system-managed (internal use) |

---

### `objects.getExpandDetails(params)`

List all expand detail definitions, with optional filters.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// All expand details
const details = await api.objects.getExpandDetails();

// Filter by source object
const contactExpands = await api.objects.getExpandDetails({
    objectName: 'contacts',
});

// Filter by target object
const companyJoins = await api.objects.getExpandDetails({
    targetObject: 'companies',
});

// Active details only, paginated
const activeDetails = await api.objects.getExpandDetails({
    isActive: true,
    limit: 50,
    offset: 0,
});

console.log(details);
// [
//   {
//     id: 'exp_xyz789',
//     objectName: 'contacts',
//     fieldName: 'companyId',
//     targetObject: 'companies',
//     lookupColumn: 'id',
//     expandFields: ['name', 'website'],
//     isActive: true,
//     isSystem: 0
//   },
//   ...
// ]
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// All expand details
const res = await fetch("https://{namespace}.api.unbound.cx/object/expand-details", {
  headers: { "Authorization": "Bearer {token}" }
});
const details = await res.json();

// Filter by source object
const res2 = await fetch("https://{namespace}.api.unbound.cx/object/expand-details?objectName=contacts", {
  headers: { "Authorization": "Bearer {token}" }
});
const contactExpands = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// All expand details
$ch = curl_init("https://{namespace}.api.unbound.cx/object/expand-details");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$details = json_decode(curl_exec($ch), true);
curl_close($ch);

// Filter by source object
$ch = curl_init("https://{namespace}.api.unbound.cx/object/expand-details?objectName=contacts");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$contactExpands = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# All expand details
response = requests.get(
    "https://{namespace}.api.unbound.cx/object/expand-details",
    headers={"Authorization": "Bearer {token}"}
)
details = response.json()

# Filter by source object
response = requests.get(
    "https://{namespace}.api.unbound.cx/object/expand-details",
    headers={"Authorization": "Bearer {token}"},
    params={"objectName": "contacts"}
)
contact_expands = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# All expand details
curl "https://{namespace}.api.unbound.cx/object/expand-details" \
  -H "Authorization: Bearer {token}"

# Filter by source object
curl "https://{namespace}.api.unbound.cx/object/expand-details?objectName=contacts" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

| Parameter | Type | Default | Description |
|---|---|---|---|
| `objectName` | string | — | Filter by source object type |
| `fieldName` | string | — | Filter by source field name |
| `targetObject` | string | — | Filter by target object type |
| `isActive` | boolean | — | Filter by active status |
| `isSystem` | boolean | — | Filter by system-managed flag |
| `limit` | number | `100` | Max results per page |
| `offset` | number | `0` | Pagination offset |

---

### `objects.getExpandDetailById(id)`

Fetch a single expand detail definition by ID.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const detail = await api.objects.getExpandDetailById('exp_xyz789');

console.log(detail);
// {
//   id: 'exp_xyz789',
//   objectName: 'contacts',
//   fieldName: 'companyId',
//   targetObject: 'companies',
//   lookupColumn: 'id',
//   expandFields: ['name', 'website', 'industry'],
//   isActive: true,
//   isSystem: 0
// }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789", {
  headers: { "Authorization": "Bearer {token}" }
});
const detail = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$detail = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789",
    headers={"Authorization": "Bearer {token}"}
)
detail = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### `objects.updateExpandDetail(params)`

Update an expand detail definition. Only pass fields you want to change.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Add more fields to the expansion
await api.objects.updateExpandDetail({
    id: 'exp_xyz789',
    expandFields: ['name', 'website', 'industry', 'tier', 'contractValue'],
});

// Disable without deleting
await api.objects.updateExpandDetail({
    id: 'exp_xyz789',
    isActive: false,
});

// Change the target fields
await api.objects.updateExpandDetail({
    id: 'exp_xyz789',
    targetObject: 'organizations',
    lookupColumn: 'id',
    fieldName: 'orgId',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Add more fields to the expansion
const res = await fetch("https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    expandFields: ["name", "website", "industry", "tier", "contractValue"]
  })
});
const data = await res.json();

// Disable without deleting
const res2 = await fetch("https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ isActive: false })
});
const data2 = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Add more fields to the expansion
$ch = curl_init("https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "expandFields" => ["name", "website", "industry", "tier", "contractValue"]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Disable without deleting
$ch = curl_init("https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["isActive" => false]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Add more fields to the expansion
response = requests.put(
    "https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789",
    headers={"Authorization": "Bearer {token}"},
    json={
        "expandFields": ["name", "website", "industry", "tier", "contractValue"]
    }
)
data = response.json()

# Disable without deleting
response = requests.put(
    "https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789",
    headers={"Authorization": "Bearer {token}"},
    json={"isActive": False}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Add more fields to the expansion
DATA=$(cat <<'EOF'
{
  "expandFields": ["name", "website", "industry", "tier", "contractValue"]
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Disable without deleting
curl -X PUT "https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✓ | Expand detail ID to update |
| `objectName` | string | — | New source object type |
| `fieldName` | string | — | New source field name |
| `targetObject` | string | — | New target object type |
| `lookupColumn` | string | — | New lookup column on target |
| `expandFields` | string[] | — | New set of fields to expand |
| `keyField` | string | — | New output key name |
| `isActive` | boolean | — | Toggle active status |

---

### `objects.deleteExpandDetail(id)`

Remove an expand detail definition permanently.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.objects.deleteExpandDetail('exp_xyz789');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    "https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

After deletion, queries with `expandDetails: true` will no longer include the previously-expanded fields.

---

## Generated Columns

Computed columns derived from SQL expressions. Generated columns are virtual — they're calculated at query time, not stored. Useful for concatenated fields, formatted values, or derived metrics.

### `objects.createGeneratedColumn(params)`

Create a computed column on an object type.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Concatenate first and last name
await api.objects.createGeneratedColumn({
    objectName: 'contacts',
    columnName: 'fullName',
    value: "CONCAT(firstName, ' ', lastName)",
    type: 'string',
    columnType: 'varchar',
    length: '255',
});

// Formatted phone number
await api.objects.createGeneratedColumn({
    objectName: 'contacts',
    columnName: 'displayPhone',
    value: "CONCAT('(', SUBSTR(phone, 2, 3), ') ', SUBSTR(phone, 5, 3), '-', SUBSTR(phone, 8, 4))",
    type: 'string',
    columnType: 'varchar',
    length: '20',
});

// Full address as single field
await api.objects.createGeneratedColumn({
    objectName: 'contacts',
    columnName: 'fullAddress',
    value: "CONCAT(street, ', ', city, ', ', state, ' ', zip)",
    columnType: 'varchar',
    length: '500',
});

// Days since last contact
await api.objects.createGeneratedColumn({
    objectName: 'leads',
    columnName: 'daysSinceContact',
    value: 'DATEDIFF(NOW(), lastContactedAt)',
    type: 'number',
    columnType: 'int',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Concatenate first and last name
const res = await fetch("https://{namespace}.api.unbound.cx/object/generated-columns", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    objectName: "contacts",
    columnName: "fullName",
    value: "CONCAT(firstName, ' ', lastName)",
    type: "string",
    columnType: "varchar",
    length: "255"
  })
});
const data = await res.json();

// Days since last contact
const res2 = await fetch("https://{namespace}.api.unbound.cx/object/generated-columns", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    objectName: "leads",
    columnName: "daysSinceContact",
    value: "DATEDIFF(NOW(), lastContactedAt)",
    type: "number",
    columnType: "int"
  })
});
const data2 = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Concatenate first and last name
$ch = curl_init("https://{namespace}.api.unbound.cx/object/generated-columns");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "objectName" => "contacts",
    "columnName" => "fullName",
    "value" => "CONCAT(firstName, ' ', lastName)",
    "type" => "string",
    "columnType" => "varchar",
    "length" => "255"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Days since last contact
$ch = curl_init("https://{namespace}.api.unbound.cx/object/generated-columns");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "objectName" => "leads",
    "columnName" => "daysSinceContact",
    "value" => "DATEDIFF(NOW(), lastContactedAt)",
    "type" => "number",
    "columnType" => "int"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Concatenate first and last name
response = requests.post(
    "https://{namespace}.api.unbound.cx/object/generated-columns",
    headers={"Authorization": "Bearer {token}"},
    json={
        "objectName": "contacts",
        "columnName": "fullName",
        "value": "CONCAT(firstName, ' ', lastName)",
        "type": "string",
        "columnType": "varchar",
        "length": "255"
    }
)
data = response.json()

# Days since last contact
response = requests.post(
    "https://{namespace}.api.unbound.cx/object/generated-columns",
    headers={"Authorization": "Bearer {token}"},
    json={
        "objectName": "leads",
        "columnName": "daysSinceContact",
        "value": "DATEDIFF(NOW(), lastContactedAt)",
        "type": "number",
        "columnType": "int"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Concatenate first and last name
DATA=$(cat <<'EOF'
{
  "objectName": "contacts",
  "columnName": "fullName",
  "value": "CONCAT(firstName, ' ', lastName)",
  "type": "string",
  "columnType": "varchar",
  "length": "255"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/generated-columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Days since last contact
DATA=$(cat <<'EOF'
{
  "objectName": "leads",
  "columnName": "daysSinceContact",
  "value": "DATEDIFF(NOW(), lastContactedAt)",
  "type": "number",
  "columnType": "int"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/generated-columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Default | Description |
|---|---|---|---|
| `objectName` | string | ✓ | Object type to add the column to |
| `columnName` | string | ✓ | Name of the generated column |
| `value` | string | ✓ | SQL expression defining the computation |
| `type` | string | `'string'` | Logical type: `'string'` or `'number'` |
| `columnType` | string | `'varchar'` | Storage type: `'varchar'`, `'int'`, etc. |
| `length` | string | `'255'` | Max length (for varchar output) |
| `isActive` | boolean | `true` | Whether the column is currently computed |
| `isSystem` | number | `0` | Mark as system-managed (internal use) |

---

### `objects.getGeneratedColumns(params)`

List generated column definitions with optional filters.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// All generated columns
const columns = await api.objects.getGeneratedColumns();

// For a specific object type
const contactColumns = await api.objects.getGeneratedColumns({
    objectName: 'contacts',
});

// Active columns only
const activeColumns = await api.objects.getGeneratedColumns({
    isActive: true,
    limit: 50,
    offset: 0,
});

// Specific column by name
const column = await api.objects.getGeneratedColumns({
    objectName: 'contacts',
    columnName: 'fullName',
});

console.log(columns);
// [
//   {
//     id: 'gen_abc123',
//     objectName: 'contacts',
//     columnName: 'fullName',
//     value: "CONCAT(firstName, ' ', lastName)",
//     type: 'string',
//     columnType: 'varchar',
//     length: '255',
//     isActive: true,
//     isSystem: 0
//   },
//   ...
// ]
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// All generated columns
const res = await fetch("https://{namespace}.api.unbound.cx/object/generated-columns", {
  headers: { "Authorization": "Bearer {token}" }
});
const columns = await res.json();

// For a specific object type
const res2 = await fetch("https://{namespace}.api.unbound.cx/object/generated-columns?objectName=contacts", {
  headers: { "Authorization": "Bearer {token}" }
});
const contactColumns = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// All generated columns
$ch = curl_init("https://{namespace}.api.unbound.cx/object/generated-columns");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$columns = json_decode(curl_exec($ch), true);
curl_close($ch);

// For a specific object type
$ch = curl_init("https://{namespace}.api.unbound.cx/object/generated-columns?objectName=contacts");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$contactColumns = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# All generated columns
response = requests.get(
    "https://{namespace}.api.unbound.cx/object/generated-columns",
    headers={"Authorization": "Bearer {token}"}
)
columns = response.json()

# For a specific object type
response = requests.get(
    "https://{namespace}.api.unbound.cx/object/generated-columns",
    headers={"Authorization": "Bearer {token}"},
    params={"objectName": "contacts"}
)
contact_columns = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# All generated columns
curl "https://{namespace}.api.unbound.cx/object/generated-columns" \
  -H "Authorization: Bearer {token}"

# For a specific object type
curl "https://{namespace}.api.unbound.cx/object/generated-columns?objectName=contacts" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

| Parameter | Type | Default | Description |
|---|---|---|---|
| `objectName` | string | — | Filter by object type |
| `columnName` | string | — | Filter by column name |
| `isActive` | boolean | — | Filter by active status |
| `isSystem` | boolean | — | Filter by system-managed flag |
| `limit` | number | `100` | Max results per page |
| `offset` | number | `0` | Pagination offset |

---

### `objects.getGeneratedColumnById(id)`

Fetch a single generated column definition by ID.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const col = await api.objects.getGeneratedColumnById('gen_abc123');

console.log(col);
// {
//   id: 'gen_abc123',
//   objectName: 'contacts',
//   columnName: 'fullName',
//   value: "CONCAT(firstName, ' ', lastName)",
//   type: 'string',
//   columnType: 'varchar',
//   length: '255',
//   isActive: true
// }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123", {
  headers: { "Authorization": "Bearer {token}" }
});
const col = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$col = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123",
    headers={"Authorization": "Bearer {token}"}
)
col = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### `objects.updateGeneratedColumn(params)`

Update a generated column definition. Only pass fields to change.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Fix the expression
await api.objects.updateGeneratedColumn({
    id: 'gen_abc123',
    value: "TRIM(CONCAT(IFNULL(firstName, ''), ' ', IFNULL(lastName, '')))",
});

// Disable without deleting
await api.objects.updateGeneratedColumn({
    id: 'gen_abc123',
    isActive: false,
});

// Re-enable and rename
await api.objects.updateGeneratedColumn({
    id: 'gen_abc123',
    columnName: 'displayName',
    isActive: true,
    length: '300',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Fix the expression
const res = await fetch("https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    value: "TRIM(CONCAT(IFNULL(firstName, ''), ' ', IFNULL(lastName, '')))"
  })
});
const data = await res.json();

// Disable without deleting
const res2 = await fetch("https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({ isActive: false })
});
const data2 = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Fix the expression
$ch = curl_init("https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "value" => "TRIM(CONCAT(IFNULL(firstName, ''), ' ', IFNULL(lastName, '')))"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Disable without deleting
$ch = curl_init("https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["isActive" => false]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Fix the expression
response = requests.put(
    "https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123",
    headers={"Authorization": "Bearer {token}"},
    json={
        "value": "TRIM(CONCAT(IFNULL(firstName, ''), ' ', IFNULL(lastName, '')))"
    }
)
data = response.json()

# Disable without deleting
response = requests.put(
    "https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123",
    headers={"Authorization": "Bearer {token}"},
    json={"isActive": False}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Fix the expression
DATA=$(cat <<'EOF'
{
  "value": "TRIM(CONCAT(IFNULL(firstName, ''), ' ', IFNULL(lastName, '')))"
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Disable without deleting
curl -X PUT "https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✓ | Generated column ID to update |
| `objectName` | string | — | New source object type |
| `columnName` | string | — | New column name |
| `value` | string | — | New SQL expression |
| `type` | string | — | New logical type |
| `columnType` | string | — | New storage type |
| `length` | string | — | New max length |
| `isActive` | boolean | — | Toggle active status |

---

### `objects.deleteGeneratedColumn(id)`

Remove a generated column definition.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.objects.deleteGeneratedColumn('gen_abc123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    "https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## UOQL Queries

For complex SQL-style queries, use the [UOQL engine](/api-reference/uoql) directly:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const data = await api.objects.uoql({
    query: 'SELECT direction, COUNT(*) as total FROM cdr GROUP BY direction',
    expandDetails: false,
});

// Aggregation with window function
const ranked = await api.objects.uoql({
    query: `
        SELECT
            id,
            name,
            company,
            revenue,
            RANK() OVER (PARTITION BY company ORDER BY revenue DESC) as rank
        FROM leads
        WHERE status = 'won'
    `,
});

// data.results → array of rows
// data.pagination.totalRecords
// data.pagination.hasNextPage
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/query/v2", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "SELECT direction, COUNT(*) as total FROM cdr GROUP BY direction",
    expandDetails: false
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/query/v2");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "query" => "SELECT direction, COUNT(*) as total FROM cdr GROUP BY direction",
    "expandDetails" => false
]));
$data = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/object/query/v2",
    headers={"Authorization": "Bearer {token}"},
    json={
        "query": "SELECT direction, COUNT(*) as total FROM cdr GROUP BY direction",
        "expandDetails": False
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "query": "SELECT direction, COUNT(*) as total FROM cdr GROUP BY direction",
  "expandDetails": false
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/query/v2" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

See the [UOQL reference](/api-reference/uoql) for the full syntax, operators, aggregates, and window functions.

---

## Common Patterns

### Full-Text Contact Search

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Use UOQL for multi-field search
const results = await api.objects.uoql({
    query: `
        SELECT id, name, email, company, phone
        FROM contacts
        WHERE name LIKE '%${searchTerm}%'
           OR email LIKE '%${searchTerm}%'
           OR company LIKE '%${searchTerm}%'
        ORDER BY name ASC
        LIMIT 20
    `,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/object/query/v2", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `SELECT id, name, email, company, phone
            FROM contacts
            WHERE name LIKE '%${searchTerm}%'
               OR email LIKE '%${searchTerm}%'
               OR company LIKE '%${searchTerm}%'
            ORDER BY name ASC
            LIMIT 20`
  })
});
const results = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/object/query/v2");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "query" => "SELECT id, name, email, company, phone
                FROM contacts
                WHERE name LIKE '%{$searchTerm}%'
                   OR email LIKE '%{$searchTerm}%'
                   OR company LIKE '%{$searchTerm}%'
                ORDER BY name ASC
                LIMIT 20"
]));
$results = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/object/query/v2",
    headers={"Authorization": "Bearer {token}"},
    json={
        "query": f"""SELECT id, name, email, company, phone
                     FROM contacts
                     WHERE name LIKE '%{search_term}%'
                        OR email LIKE '%{search_term}%'
                        OR company LIKE '%{search_term}%'
                     ORDER BY name ASC
                     LIMIT 20"""
    }
)
results = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/object/query/v2" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"SELECT id, name, email, company, phone FROM contacts WHERE name LIKE '%${SEARCH_TERM}%' OR email LIKE '%${SEARCH_TERM}%' OR company LIKE '%${SEARCH_TERM}%' ORDER BY name ASC LIMIT 20\"
  }"
```

</TabItem>
</Tabs>

### Upsert Pattern

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function upsertContact(email, data) {
    // Check if exists
    const existing = await api.objects.query({
        object: 'contacts',
        where: { email },
        limit: 1,
    });

    if (existing.data.length > 0) {
        return await api.objects.updateById({
            object: 'contacts',
            id: existing.data[0].id,
            update: data,
        });
    } else {
        return await api.objects.create({
            object: 'contacts',
            body: { email, ...data },
        });
    }
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function upsertContact(email, data) {
    // Check if exists
    const checkRes = await fetch("https://{namespace}.api.unbound.cx/object/contacts/query", {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({ where: { email }, limit: 1 })
    });
    const existing = await checkRes.json();

    if (existing.data.length > 0) {
        // Update existing
        const updateRes = await fetch(`https://{namespace}.api.unbound.cx/object/contacts/${existing.data[0].id}`, {
            method: "PUT",
            headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await updateRes.json();
    } else {
        // Create new
        const createRes = await fetch("https://{namespace}.api.unbound.cx/object/contacts", {
            method: "POST",
            headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
            body: JSON.stringify({ email, ...data })
        });
        return await createRes.json();
    }
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function upsertContact($email, $data) {
    // Check if exists
    $ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts/query");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["where" => ["email" => $email], "limit" => 1]));
    $existing = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if (count($existing["data"]) > 0) {
        // Update existing
        $ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts/{$existing['data'][0]['id']}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        $result = json_decode(curl_exec($ch), true);
        curl_close($ch);
        return $result;
    } else {
        // Create new
        $ch = curl_init("https://{namespace}.api.unbound.cx/object/contacts");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array_merge(["email" => $email], $data)));
        $result = json_decode(curl_exec($ch), true);
        curl_close($ch);
        return $result;
    }
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

def upsert_contact(email, data):
    # Check if exists
    check_response = requests.post(
        "https://{namespace}.api.unbound.cx/object/contacts/query",
        headers={"Authorization": "Bearer {token}"},
        json={"where": {"email": email}, "limit": 1}
    )
    existing = check_response.json()

    if len(existing["data"]) > 0:
        # Update existing
        update_response = requests.put(
            f"https://{{namespace}}.api.unbound.cx/object/contacts/{existing['data'][0]['id']}",
            headers={"Authorization": "Bearer {token}"},
            json=data
        )
        return update_response.json()
    else:
        # Create new
        create_response = requests.post(
            "https://{namespace}.api.unbound.cx/object/contacts",
            headers={"Authorization": "Bearer {token}"},
            json={"email": email, **data}
        )
        return create_response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# This is a multi-step operation, shown as separate commands:

# Step 1: Check if contact exists
EXISTING=$(curl -s -X POST "https://{namespace}.api.unbound.cx/object/contacts/query" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"where": {"email": "user@example.com"}, "limit": 1}')

# Step 2: If exists, update; otherwise create
# (In shell script, you'd parse $EXISTING and conditionally run PUT or POST)
```

</TabItem>
</Tabs>

### Paginate Through All Records

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function* iterateAll(object, where = {}) {
    let nextId = null;

    do {
        const page = await api.objects.query({
            object,
            where,
            limit: 100,
            nextId,
        });

        yield* page.data;

        nextId = page.data.length === 100
            ? page.data[page.data.length - 1].id
            : null;
    } while (nextId);
}

// Usage
for await (const contact of iterateAll('contacts', { status: 'active' })) {
    console.log(contact.name);
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function* iterateAll(object, where = {}) {
    let nextId = null;

    do {
        const res = await fetch(`https://{namespace}.api.unbound.cx/object/${object}/query`, {
            method: "POST",
            headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
            body: JSON.stringify({ where, limit: 100, nextId })
        });
        const page = await res.json();

        yield* page.data;

        nextId = page.data.length === 100
            ? page.data[page.data.length - 1].id
            : null;
    } while (nextId);
}

// Usage
for await (const contact of iterateAll('contacts', { status: 'active' })) {
    console.log(contact.name);
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function iterateAll($object, $where = []) {
    $nextId = null;
    $allRecords = [];

    do {
        $ch = curl_init("https://{namespace}.api.unbound.cx/object/{$object}/query");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            "where" => $where,
            "limit" => 100,
            "nextId" => $nextId
        ]));
        $page = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $allRecords = array_merge($allRecords, $page["data"]);

        $nextId = count($page["data"]) === 100
            ? $page["data"][count($page["data"]) - 1]["id"]
            : null;
    } while ($nextId);

    return $allRecords;
}

// Usage
$contacts = iterateAll('contacts', ['status' => 'active']);
foreach ($contacts as $contact) {
    echo $contact['name'] . "\n";
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

def iterate_all(object_name, where=None):
    if where is None:
        where = {}
    next_id = None

    while True:
        payload = {"where": where, "limit": 100}
        if next_id:
            payload["nextId"] = next_id

        response = requests.post(
            f"https://{{namespace}}.api.unbound.cx/object/{object_name}/query",
            headers={"Authorization": "Bearer {token}"},
            json=payload
        )
        page = response.json()

        for record in page["data"]:
            yield record

        if len(page["data"]) == 100:
            next_id = page["data"][-1]["id"]
        else:
            break

# Usage
for contact in iterate_all('contacts', {'status': 'active'}):
    print(contact['name'])
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Pagination with cURL requires a loop in your shell script:
NEXT_ID=""
while true; do
  RESPONSE=$(curl -s -X POST "https://{namespace}.api.unbound.cx/object/contacts/query" \
    -H "Authorization: Bearer {token}" \
    -H "Content-Type: application/json" \
    -d "{\"where\": {\"status\": \"active\"}, \"limit\": 100, \"nextId\": \"$NEXT_ID\"}")

  # Process $RESPONSE here
  # Extract nextId from last record if 100 records returned
  # Break if fewer than 100 records
done
```

</TabItem>
</Tabs>

### Related Data with Expand Details

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// 1. Define the relationship once
await api.objects.createExpandDetail({
    objectName: 'tickets',
    fieldName: 'contactId',
    targetObject: 'contacts',
    lookupColumn: 'id',
    expandFields: ['name', 'email', 'company'],
});

// 2. All subsequent queries can expand it
const tickets = await api.objects.query({
    object: 'tickets',
    where: { status: 'open' },
    expandDetails: true,
});

// 3. Access expanded data
tickets.data.forEach(ticket => {
    console.log(`Ticket for: ${ticket.contactId_expanded?.name}`);
    console.log(`Company: ${ticket.contactId_expanded?.company}`);
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// 1. Define the relationship once
await fetch("https://{namespace}.api.unbound.cx/object/expand-details", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
    body: JSON.stringify({
        objectName: 'tickets',
        fieldName: 'contactId',
        targetObject: 'contacts',
        lookupColumn: 'id',
        expandFields: ['name', 'email', 'company']
    })
});

// 2. All subsequent queries can expand it
const res = await fetch("https://{namespace}.api.unbound.cx/object/tickets/query", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
    body: JSON.stringify({ where: { status: 'open' }, expandDetails: true })
});
const tickets = await res.json();

// 3. Access expanded data
tickets.data.forEach(ticket => {
    console.log(`Ticket for: ${ticket.contactId_expanded?.name}`);
    console.log(`Company: ${ticket.contactId_expanded?.company}`);
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// 1. Define the relationship once
$ch = curl_init("https://{namespace}.api.unbound.cx/object/expand-details");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "objectName" => "tickets",
    "fieldName" => "contactId",
    "targetObject" => "contacts",
    "lookupColumn" => "id",
    "expandFields" => ["name", "email", "company"]
]));
curl_exec($ch);
curl_close($ch);

// 2. All subsequent queries can expand it
$ch = curl_init("https://{namespace}.api.unbound.cx/object/tickets/query");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "where" => ["status" => "open"],
    "expandDetails" => true
]));
$tickets = json_decode(curl_exec($ch), true);
curl_close($ch);

// 3. Access expanded data
foreach ($tickets["data"] as $ticket) {
    echo "Ticket for: {$ticket['contactId_expanded']['name']}\n";
    echo "Company: {$ticket['contactId_expanded']['company']}\n";
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# 1. Define the relationship once
requests.post(
    "https://{namespace}.api.unbound.cx/object/expand-details",
    headers={"Authorization": "Bearer {token}"},
    json={
        "objectName": "tickets",
        "fieldName": "contactId",
        "targetObject": "contacts",
        "lookupColumn": "id",
        "expandFields": ["name", "email", "company"]
    }
)

# 2. All subsequent queries can expand it
response = requests.post(
    "https://{namespace}.api.unbound.cx/object/tickets/query",
    headers={"Authorization": "Bearer {token}"},
    json={"where": {"status": "open"}, "expandDetails": True}
)
tickets = response.json()

# 3. Access expanded data
for ticket in tickets["data"]:
    print(f"Ticket for: {ticket.get('contactId_expanded', {}).get('name')}")
    print(f"Company: {ticket.get('contactId_expanded', {}).get('company')}")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# 1. Define the relationship once
DATA=$(cat <<'EOF'
{
  "objectName": "tickets",
  "fieldName": "contactId",
  "targetObject": "contacts",
  "lookupColumn": "id",
  "expandFields": ["name", "email", "company"]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/expand-details" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# 2. Query with expansion enabled
DATA=$(cat <<'EOF'
{
  "where": {"status": "open"},
  "expandDetails": true
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/tickets/query" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### Dynamic Schema Bootstrap

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function bootstrapCRM() {
    // Create object type
    await api.objects.createObject({ name: 'leads' });

    // Add all columns at once
    await api.objects.createColumn({
        objectName: 'leads',
        columns: [
            { name: 'firstName', type: 'varchar', length: 100 },
            { name: 'lastName', type: 'varchar', length: 100 },
            { name: 'email', type: 'varchar', length: 255, isRequired: true },
            { name: 'phone', type: 'varchar', length: 20 },
            { name: 'company', type: 'varchar', length: 255 },
            { name: 'status', type: 'varchar', length: 50, defaultValue: 'new' },
            { name: 'score', type: 'int' },
            { name: 'notes', type: 'text' },
            { name: 'metadata', type: 'json' },
            { name: 'lastContactedAt', type: 'datetime' },
        ],
    });

    // Add generated column for display name
    await api.objects.createGeneratedColumn({
        objectName: 'leads',
        columnName: 'fullName',
        value: "CONCAT(firstName, ' ', lastName)",
        columnType: 'varchar',
        length: '200',
    });

    console.log('CRM schema ready');
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function bootstrapCRM() {
    // Create object type
    await fetch("https://{namespace}.api.unbound.cx/object/types", {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({ name: "leads" })
    });

    // Add all columns at once
    await fetch("https://{namespace}.api.unbound.cx/object/leads/columns", {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({
            columns: [
                { name: 'firstName', type: 'varchar', length: 100 },
                { name: 'lastName', type: 'varchar', length: 100 },
                { name: 'email', type: 'varchar', length: 255, isRequired: true },
                { name: 'phone', type: 'varchar', length: 20 },
                { name: 'company', type: 'varchar', length: 255 },
                { name: 'status', type: 'varchar', length: 50, defaultValue: 'new' },
                { name: 'score', type: 'int' },
                { name: 'notes', type: 'text' },
                { name: 'metadata', type: 'json' },
                { name: 'lastContactedAt', type: 'datetime' }
            ]
        })
    });

    // Add generated column for display name
    await fetch("https://{namespace}.api.unbound.cx/object/generated-columns", {
        method: "POST",
        headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
        body: JSON.stringify({
            objectName: 'leads',
            columnName: 'fullName',
            value: "CONCAT(firstName, ' ', lastName)",
            columnType: 'varchar',
            length: '200'
        })
    });

    console.log('CRM schema ready');
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function bootstrapCRM() {
    // Create object type
    $ch = curl_init("https://{namespace}.api.unbound.cx/object/types");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["name" => "leads"]));
    curl_exec($ch);
    curl_close($ch);

    // Add all columns at once
    $ch = curl_init("https://{namespace}.api.unbound.cx/object/leads/columns");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "columns" => [
            ["name" => "firstName", "type" => "varchar", "length" => 100],
            ["name" => "lastName", "type" => "varchar", "length" => 100],
            ["name" => "email", "type" => "varchar", "length" => 255, "isRequired" => true],
            ["name" => "phone", "type" => "varchar", "length" => 20],
            ["name" => "company", "type" => "varchar", "length" => 255],
            ["name" => "status", "type" => "varchar", "length" => 50, "defaultValue" => "new"],
            ["name" => "score", "type" => "int"],
            ["name" => "notes", "type" => "text"],
            ["name" => "metadata", "type" => "json"],
            ["name" => "lastContactedAt", "type" => "datetime"]
        ]
    ]));
    curl_exec($ch);
    curl_close($ch);

    // Add generated column for display name
    $ch = curl_init("https://{namespace}.api.unbound.cx/object/generated-columns");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "objectName" => "leads",
        "columnName" => "fullName",
        "value" => "CONCAT(firstName, ' ', lastName)",
        "columnType" => "varchar",
        "length" => "200"
    ]));
    curl_exec($ch);
    curl_close($ch);

    echo "CRM schema ready\n";
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

def bootstrap_crm():
    # Create object type
    requests.post(
        "https://{namespace}.api.unbound.cx/object/types",
        headers={"Authorization": "Bearer {token}"},
        json={"name": "leads"}
    )

    # Add all columns at once
    requests.post(
        "https://{namespace}.api.unbound.cx/object/leads/columns",
        headers={"Authorization": "Bearer {token}"},
        json={
            "columns": [
                {"name": "firstName", "type": "varchar", "length": 100},
                {"name": "lastName", "type": "varchar", "length": 100},
                {"name": "email", "type": "varchar", "length": 255, "isRequired": True},
                {"name": "phone", "type": "varchar", "length": 20},
                {"name": "company", "type": "varchar", "length": 255},
                {"name": "status", "type": "varchar", "length": 50, "defaultValue": "new"},
                {"name": "score", "type": "int"},
                {"name": "notes", "type": "text"},
                {"name": "metadata", "type": "json"},
                {"name": "lastContactedAt", "type": "datetime"}
            ]
        }
    )

    # Add generated column for display name
    requests.post(
        "https://{namespace}.api.unbound.cx/object/generated-columns",
        headers={"Authorization": "Bearer {token}"},
        json={
            "objectName": "leads",
            "columnName": "fullName",
            "value": "CONCAT(firstName, ' ', lastName)",
            "columnType": "varchar",
            "length": "200"
        }
    )

    print("CRM schema ready")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Create object type
curl -X POST "https://{namespace}.api.unbound.cx/object/types" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "leads"}'

# Add all columns at once
DATA=$(cat <<'EOF'
{
  "columns": [
    {"name": "firstName", "type": "varchar", "length": 100},
    {"name": "lastName", "type": "varchar", "length": 100},
    {"name": "email", "type": "varchar", "length": 255, "isRequired": true},
    {"name": "phone", "type": "varchar", "length": 20},
    {"name": "company", "type": "varchar", "length": 255},
    {"name": "status", "type": "varchar", "length": 50, "defaultValue": "new"},
    {"name": "score", "type": "int"},
    {"name": "notes", "type": "text"},
    {"name": "metadata", "type": "json"},
    {"name": "lastContactedAt", "type": "datetime"}
  ]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/leads/columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Add generated column for display name
DATA=$(cat <<'EOF'
{
  "objectName": "leads",
  "columnName": "fullName",
  "value": "CONCAT(firstName, ' ', lastName)",
  "columnType": "varchar",
  "length": "200"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/object/generated-columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

echo "CRM schema ready"
```

</TabItem>
</Tabs>


### Batch Chunked Inserts

When importing large datasets, chunk writes to stay within API limits and track progress:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
/**
 * Insert records in chunks of `chunkSize` and return a summary.
 * @param {Object} api        - Unbound SDK instance
 * @param {string} objectName - Target object type (e.g. "contacts")
 * @param {Object[]} records  - Array of record data objects
 * @param {number} chunkSize  - Records per batch (recommended: 50-100)
 */
async function batchInsert(api, objectName, records, chunkSize = 50) {
    let inserted = 0;
    let errors = [];

    for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);

        // Use Promise.allSettled so one failure doesn't abort the batch
        const results = await Promise.allSettled(
            chunk.map(record =>
                api.objects.create({ object: objectName, ...record })
            )
        );

        for (const result of results) {
            if (result.status === 'fulfilled') {
                inserted++;
            } else {
                errors.push(result.reason?.message ?? 'unknown error');
            }
        }

        console.log(`Progress: ${Math.min(i + chunkSize, records.length)}/${records.length}`);

        // Throttle between chunks to avoid 429s
        if (i + chunkSize < records.length) {
            await new Promise(r => setTimeout(r, 250));
        }
    }

    return { inserted, failed: errors.length, errors };
}

// Usage: import 500 contacts from a CSV
const contacts = csvRows.map(row => ({
    name:    row.full_name,
    email:   row.email,
    phone:   row.phone,
    company: row.company,
    status:  'new',
}));

const summary = await batchInsert(api, 'contacts', contacts, 50);
console.log(`Inserted: ${summary.inserted} | Failed: ${summary.failed}`);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function batchInsert(namespace, token, objectName, records, chunkSize = 50) {
    let inserted = 0;
    let errors = [];

    for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);

        const results = await Promise.allSettled(
            chunk.map(record =>
                fetch(`https://${namespace}.api.unbound.cx/object/${objectName}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(record),
                }).then(r => r.json())
            )
        );

        for (const result of results) {
            if (result.status === 'fulfilled') inserted++;
            else errors.push(result.reason?.message ?? 'unknown');
        }

        if (i + chunkSize < records.length) {
            await new Promise(r => setTimeout(r, 250));
        }
    }

    return { inserted, failed: errors.length, errors };
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import asyncio
import aiohttp

async def batch_insert(namespace, token, object_name, records, chunk_size=50):
    inserted = 0
    errors = []
    url = f"https://{namespace}.api.unbound.cx/object/{object_name}"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    async with aiohttp.ClientSession() as session:
        for i in range(0, len(records), chunk_size):
            chunk = records[i:i + chunk_size]
            tasks = [session.post(url, headers=headers, json=r) for r in chunk]
            responses = await asyncio.gather(*tasks, return_exceptions=True)

            for resp in responses:
                if isinstance(resp, Exception):
                    errors.append(str(resp))
                else:
                    inserted += 1
                    resp.close()

            if i + chunk_size < len(records):
                await asyncio.sleep(0.25)

    return {"inserted": inserted, "failed": len(errors), "errors": errors}
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Bash loop — insert contacts from a JSON array file
# Format: one JSON object per line in contacts.jsonl
while IFS= read -r record; do
    curl -s -X POST "https://{namespace}.api.unbound.cx/object/contacts" \
        -H "Authorization: Bearer {token}" \
        -H "Content-Type: application/json" \
        -d "$record" > /dev/null
    sleep 0.05   # ~20 req/s — stay under rate limits
done < contacts.jsonl
echo "Import complete"
```

</TabItem>
</Tabs>

---

### Soft-Delete Pattern

Avoid permanent data loss — mark records as deleted with a flag and filter them out of normal queries:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Step 1: Add a deletedAt column to your object type (run once)
await api.objects.createColumn({
    objectName: 'contacts',
    columnName: 'deletedAt',
    columnType: 'datetime',
    isRequired:  false,
});

// Soft-delete a record
async function softDelete(api, object, id) {
    await api.objects.updateById({
        object,
        id,
        update: { deletedAt: new Date().toISOString() },
    });
    console.log(`${object} ${id} soft-deleted`);
}

// Query only active (non-deleted) records
async function queryActive(api, object, extraWhere = '') {
    const whereClause = extraWhere
        ? `deletedAt IS NULL AND (${extraWhere})`
        : 'deletedAt IS NULL';

    return api.objects.uoql({
        query: `SELECT * FROM ${object} WHERE ${whereClause} ORDER BY createdAt DESC LIMIT 100`,
    });
}

// Restore a soft-deleted record
async function restore(api, object, id) {
    await api.objects.updateById({
        object,
        id,
        update: { deletedAt: null },
    });
}

// Permanently purge records deleted more than 90 days ago
async function purgeOldDeleted(api, object) {
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    await api.objects.delete({
        object,
        where: { deletedAt: { lt: cutoff } },
    });
    console.log(`Purged ${object} records deleted before ${cutoff}`);
}

// Usage
await softDelete(api, 'contacts', 'contact-id-123');
const active = await queryActive(api, 'contacts', 'status = "lead"');
await purgeOldDeleted(api, 'contacts');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Soft-delete
await fetch(`https://{namespace}.api.unbound.cx/object/contacts/{id}`, {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
    body: JSON.stringify({ update: { deletedAt: new Date().toISOString() } }),
});

// Query active records only
const res = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
    body: JSON.stringify({
        query: 'SELECT * FROM contacts WHERE deletedAt IS NULL ORDER BY createdAt DESC LIMIT 100',
    }),
});
const active = await res.json();
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from datetime import datetime

BASE = "https://{namespace}.api.unbound.cx"
HEADERS = {"Authorization": "Bearer {token}", "Content-Type": "application/json"}

def soft_delete(contact_id):
    requests.put(
        f"{BASE}/object/contacts/{contact_id}",
        headers=HEADERS,
        json={"update": {"deletedAt": datetime.utcnow().isoformat() + "Z"}},
    )

def query_active():
    return requests.post(
        f"{BASE}/object/query/v2",
        headers=HEADERS,
        json={"query": "SELECT * FROM contacts WHERE deletedAt IS NULL ORDER BY createdAt DESC LIMIT 100"},
    ).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Soft-delete a contact
curl -X PUT "https://{namespace}.api.unbound.cx/object/contacts/{id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"update": {"deletedAt": "2026-03-30T12:00:00Z"}}'

# Query active records only
curl -X POST "https://{namespace}.api.unbound.cx/object/query/v2" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM contacts WHERE deletedAt IS NULL ORDER BY createdAt DESC LIMIT 100"}'
```

</TabItem>
</Tabs>

---

### Audit Trail: Track All Record Changes

Capture every field change in a separate `auditLog` object for compliance or debugging:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Step 1: Create the auditLog object type (run once during setup)
async function setupAuditLog(api) {
    await api.objects.createObject({ name: 'auditLog' });
    const columns = [
        { columnName: 'targetObject', columnType: 'varchar', length: 100, isRequired: true },
        { columnName: 'targetId',     columnType: 'varchar', length: 100, isRequired: true },
        { columnName: 'action',       columnType: 'varchar', length: 50,  isRequired: true },
        { columnName: 'changedFields',columnType: 'json',    isRequired: false },
        { columnName: 'previousValues',columnType: 'json',   isRequired: false },
        { columnName: 'newValues',    columnType: 'json',    isRequired: false },
        { columnName: 'performedBy',  columnType: 'varchar', length: 100, isRequired: false },
        { columnName: 'performedAt',  columnType: 'datetime',isRequired: true },
        { columnName: 'ipAddress',    columnType: 'varchar', length: 45,  isRequired: false },
    ];
    for (const col of columns) {
        await api.objects.createColumn({ objectName: 'auditLog', ...col });
    }
    console.log('auditLog schema ready');
}

// Step 2: Wrap updateById to automatically log changes
async function auditedUpdate(api, object, id, update, performedBy) {
    // Fetch current state before updating
    const current = await api.objects.byId({ object, id });

    // Apply the update
    await api.objects.updateById({ object, id, update });

    // Determine which fields changed
    const changedFields = Object.keys(update);
    const previousValues = Object.fromEntries(
        changedFields.map(k => [k, current[k]])
    );

    // Write audit log entry
    await api.objects.create({
        object:         'auditLog',
        targetObject:   object,
        targetId:       id,
        action:         'update',
        changedFields,
        previousValues,
        newValues:      update,
        performedBy,
        performedAt:    new Date().toISOString(),
    });
}

// Usage
await auditedUpdate(
    api,
    'contacts',
    'contact-id-123',
    { status: 'customer', tier: 'pro' },
    'user-id-456'
);

// Query the audit trail for a specific record
const history = await api.objects.uoql({
    query: `
        SELECT targetObject, action, changedFields, previousValues, newValues,
               performedBy, performedAt
        FROM auditLog
        WHERE targetId = 'contact-id-123'
        ORDER BY performedAt DESC
        LIMIT 50
    `,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function auditedUpdate(namespace, token, object, id, update, performedBy) {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    // Fetch current state
    const currentRes = await fetch(
        `https://${namespace}.api.unbound.cx/object/${object}/${id}`,
        { headers }
    );
    const current = await currentRes.json();

    // Apply update
    await fetch(`https://${namespace}.api.unbound.cx/object/${object}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ update }),
    });

    // Write audit entry
    const changedFields = Object.keys(update);
    await fetch(`https://${namespace}.api.unbound.cx/object/auditLog`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            targetObject:   object,
            targetId:       id,
            action:         'update',
            changedFields,
            previousValues: Object.fromEntries(changedFields.map(k => [k, current[k]])),
            newValues:      update,
            performedBy,
            performedAt:    new Date().toISOString(),
        }),
    });
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from datetime import datetime

def audited_update(namespace, token, object_name, record_id, update, performed_by):
    base = f"https://{namespace}.api.unbound.cx"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Fetch current state
    current = requests.get(f"{base}/object/{object_name}/{record_id}", headers=headers).json()

    # Apply update
    requests.put(f"{base}/object/{object_name}/{record_id}", headers=headers, json={"update": update})

    # Write audit entry
    changed_fields = list(update.keys())
    requests.post(f"{base}/object/auditLog", headers=headers, json={
        "targetObject":   object_name,
        "targetId":       record_id,
        "action":         "update",
        "changedFields":  changed_fields,
        "previousValues": {k: current.get(k) for k in changed_fields},
        "newValues":      update,
        "performedBy":    performed_by,
        "performedAt":    datetime.utcnow().isoformat() + "Z",
    })
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# 1. Fetch current record
CURRENT=$(curl -s "https://{namespace}.api.unbound.cx/object/contacts/{id}" \
  -H "Authorization: Bearer {token}")

# 2. Apply the update
curl -X PUT "https://{namespace}.api.unbound.cx/object/contacts/{id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"update": {"status": "customer", "tier": "pro"}}'

# 3. Write audit log entry
curl -X POST "https://{namespace}.api.unbound.cx/object/auditLog" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "targetObject":    "contacts",
    "targetId":        "{id}",
    "action":          "update",
    "changedFields":   ["status", "tier"],
    "previousValues":  {"status": "lead", "tier": "free"},
    "newValues":       {"status": "customer", "tier": "pro"},
    "performedBy":     "user-id-456",
    "performedAt":     "2026-03-30T12:00:00Z"
  }'
```

</TabItem>
</Tabs>

---

### Safe Schema Migration: Add a Non-Breaking Column

Safely add a new column to a live object type without breaking existing queries or applications:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
/**
 * Idempotent column addition — checks if the column already exists before creating.
 * Safe to run in CI/CD pipelines and on every deploy.
 */
async function addColumnIfMissing(api, objectName, columnDef) {
    // Fetch the current schema
    const schema = await api.objects.describe(objectName);
    const exists = schema.columns?.some(col => col.name === columnDef.columnName);

    if (exists) {
        console.log(`Column "${columnDef.columnName}" already exists on "${objectName}" — skipping.`);
        return false;
    }

    await api.objects.createColumn({ objectName, ...columnDef });
    console.log(`Column "${columnDef.columnName}" added to "${objectName}".`);
    return true;
}

// Run as part of your app startup / migration script
async function migrateSchema(api) {
    const migrations = [
        {
            objectName:   'contacts',
            columnName:   'leadSource',
            columnType:   'varchar',
            length:        100,
            isRequired:   false,
            defaultValue: 'unknown',
        },
        {
            objectName:   'contacts',
            columnName:   'lastActivityAt',
            columnType:   'datetime',
            isRequired:   false,
        },
        {
            objectName:   'contacts',
            columnName:   'tags',
            columnType:   'json',
            isRequired:   false,
        },
    ];

    let added = 0;
    for (const migration of migrations) {
        const didAdd = await addColumnIfMissing(api, migration.objectName, migration);
        if (didAdd) added++;
    }

    console.log(`Migration complete: ${added}/${migrations.length} columns added.`);
}

await migrateSchema(api);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function addColumnIfMissing(namespace, token, objectName, columnDef) {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    // Check current schema
    const schemaRes = await fetch(
        `https://${namespace}.api.unbound.cx/object/types/${objectName}`,
        { headers }
    );
    const schema = await schemaRes.json();

    if (schema.columns?.some(c => c.name === columnDef.columnName)) {
        console.log(`Column "${columnDef.columnName}" already exists — skipping.`);
        return false;
    }

    await fetch(`https://${namespace}.api.unbound.cx/object/${objectName}/columns`, {
        method: 'POST',
        headers,
        body: JSON.stringify(columnDef),
    });

    console.log(`Added column "${columnDef.columnName}" to "${objectName}".`);
    return true;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

def add_column_if_missing(namespace, token, object_name, column_def):
    base = f"https://{namespace}.api.unbound.cx"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    schema = requests.get(f"{base}/object/types/{object_name}", headers=headers).json()
    existing = {c["name"] for c in schema.get("columns", [])}

    if column_def["columnName"] in existing:
        print(f"Column '{column_def['columnName']}' already exists — skipping.")
        return False

    requests.post(
        f"{base}/object/{object_name}/columns",
        headers=headers,
        json=column_def,
    )
    print(f"Added column '{column_def['columnName']}' to '{object_name}'.")
    return True
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Check if column exists first
SCHEMA=$(curl -s "https://{namespace}.api.unbound.cx/object/types/contacts" \
  -H "Authorization: Bearer {token}")

# Check if "leadSource" exists (use jq for reliable parsing)
if echo "$SCHEMA" | jq -e '.columns[] | select(.name == "leadSource")' > /dev/null 2>&1; then
    echo "Column already exists — skipping"
else
    curl -X POST "https://{namespace}.api.unbound.cx/object/contacts/columns" \
        -H "Authorization: Bearer {token}" \
        -H "Content-Type: application/json" \
        -d '{
            "columnName":   "leadSource",
            "columnType":   "varchar",
            "length":       100,
            "isRequired":   false,
            "defaultValue": "unknown"
        }'
    echo "Column added"
fi
```

</TabItem>
</Tabs>

---

### Generated Column Recipes

`objects.createGeneratedColumn` creates virtual columns computed from other fields at query time — no redundant storage or manual sync required.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Recipe 1: Full name from first + last name
await api.objects.createGeneratedColumn({
    objectName:  'contacts',
    columnName:  'fullName',
    value:       "CONCAT(firstName, ' ', lastName)",
    columnType:  'varchar',
    length:      '255',
});

// Recipe 2: Display label combining name and company
await api.objects.createGeneratedColumn({
    objectName:  'contacts',
    columnName:  'displayLabel',
    value:       "CONCAT(firstName, ' ', lastName, ' (', company, ')')",
    columnType:  'varchar',
    length:      '300',
});

// Recipe 3: Masked phone number for display (keep last 4 digits)
await api.objects.createGeneratedColumn({
    objectName:  'contacts',
    columnName:  'maskedPhone',
    value:       "CONCAT('***-***-', RIGHT(phone, 4))",
    columnType:  'varchar',
    length:      '15',
});

// Recipe 4: Age in years from birthDate
await api.objects.createGeneratedColumn({
    objectName:  'contacts',
    columnName:  'ageYears',
    value:       'TIMESTAMPDIFF(YEAR, birthDate, NOW())',
    columnType:  'int',
    length:      '3',
});

// Recipe 5: Days since last contact
await api.objects.createGeneratedColumn({
    objectName:  'contacts',
    columnName:  'daysSinceContact',
    value:       'DATEDIFF(NOW(), lastContactedAt)',
    columnType:  'int',
    length:      '5',
});

// Use generated columns in UOQL queries just like real columns
const staleLeads = await api.objects.uoql({
    query: `
        SELECT id, fullName, email, daysSinceContact
        FROM contacts
        WHERE status = 'lead'
          AND daysSinceContact > 30
        ORDER BY daysSinceContact DESC
        LIMIT 50
    `,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Create a fullName generated column
await fetch('https://{namespace}.api.unbound.cx/object/generated-columns', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
    body: JSON.stringify({
        objectName:  'contacts',
        columnName:  'fullName',
        value:       "CONCAT(firstName, ' ', lastName)",
        columnType:  'varchar',
        length:      '255',
    }),
});

// Use it in a query
const res = await fetch('https://{namespace}.api.unbound.cx/object/query/v2', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
    body: JSON.stringify({
        query: "SELECT id, fullName, email FROM contacts WHERE daysSinceContact > 30 ORDER BY daysSinceContact DESC LIMIT 50",
    }),
});
const staleLeads = await res.json();
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

BASE = "https://{namespace}.api.unbound.cx"
HEADERS = {"Authorization": "Bearer {token}", "Content-Type": "application/json"}

# Create fullName generated column
requests.post(f"{BASE}/object/generated-columns", headers=HEADERS, json={
    "objectName":  "contacts",
    "columnName":  "fullName",
    "value":       "CONCAT(firstName, ' ', lastName)",
    "columnType":  "varchar",
    "length":      "255",
})

# Query using the generated column
stale_leads = requests.post(f"{BASE}/object/query/v2", headers=HEADERS, json={
    "query": "SELECT id, fullName, email FROM contacts WHERE daysSinceContact > 30 ORDER BY daysSinceContact DESC LIMIT 50"
}).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Create fullName generated column
curl -X POST "https://{namespace}.api.unbound.cx/object/generated-columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "objectName":  "contacts",
    "columnName":  "fullName",
    "value":       "CONCAT(firstName, '"'"' '"'"', lastName)",
    "columnType":  "varchar",
    "length":      "255"
  }'

# Query using the generated column
curl -X POST "https://{namespace}.api.unbound.cx/object/query/v2" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT id, fullName, email FROM contacts WHERE daysSinceContact > 30 ORDER BY daysSinceContact DESC LIMIT 50"}'
```

</TabItem>
</Tabs>

---

### Multi-Filter Bulk Update

Apply a conditional update across many records at once — useful for migrations, status transitions, or mass re-assignments:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Promote all "qualified" leads created in Q1 2026 to "opportunity"
await api.objects.update({
    object: 'contacts',
    where: {
        status:    'qualified',
        createdAt: { gte: '2026-01-01', lt: '2026-04-01' },
    },
    update: {
        status:       'opportunity',
        promotedAt:   new Date().toISOString(),
        promotedBy:   'batch-migration-script',
    },
});

// Re-assign all open tasks from a departing agent to a replacement
await api.objects.update({
    object: 'supportTickets',
    where: {
        assignedTo: 'departing-user-id',
        status:     { in: ['open', 'pending'] },
    },
    update: {
        assignedTo:    'replacement-user-id',
        reassignedAt:  new Date().toISOString(),
        reassignNote:  'Auto-reassigned due to agent departure',
    },
});

// Archive all completed tickets older than 1 year
const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
await api.objects.update({
    object: 'supportTickets',
    where: {
        status:      'completed',
        completedAt: { lt: oneYearAgo },
        archived:    false,
    },
    update: {
        archived:   true,
        archivedAt: new Date().toISOString(),
    },
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Promote qualified leads to opportunity
await fetch('https://{namespace}.api.unbound.cx/object/contacts', {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
    body: JSON.stringify({
        where: {
            status:    'qualified',
            createdAt: { gte: '2026-01-01', lt: '2026-04-01' },
        },
        update: {
            status:     'opportunity',
            promotedAt: new Date().toISOString(),
        },
    }),
});

// Re-assign open tickets
await fetch('https://{namespace}.api.unbound.cx/object/supportTickets', {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
    body: JSON.stringify({
        where: {
            assignedTo: 'departing-user-id',
            status:     { in: ['open', 'pending'] },
        },
        update: {
            assignedTo:   'replacement-user-id',
            reassignedAt: new Date().toISOString(),
        },
    }),
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from datetime import datetime, timedelta

BASE = "https://{namespace}.api.unbound.cx"
HEADERS = {"Authorization": "Bearer {token}", "Content-Type": "application/json"}

# Promote qualified leads
requests.put(f"{BASE}/object/contacts", headers=HEADERS, json={
    "where": {
        "status":    "qualified",
        "createdAt": {"gte": "2026-01-01", "lt": "2026-04-01"},
    },
    "update": {
        "status":     "opportunity",
        "promotedAt": datetime.utcnow().isoformat() + "Z",
    },
})

# Re-assign open tickets
requests.put(f"{BASE}/object/supportTickets", headers=HEADERS, json={
    "where": {
        "assignedTo": "departing-user-id",
        "status":     {"in": ["open", "pending"]},
    },
    "update": {
        "assignedTo":   "replacement-user-id",
        "reassignedAt": datetime.utcnow().isoformat() + "Z",
    },
})
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Promote qualified leads
curl -X PUT "https://{namespace}.api.unbound.cx/object/contacts" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "where": {
        "status":    "qualified",
        "createdAt": {"gte": "2026-01-01", "lt": "2026-04-01"}
    },
    "update": {
        "status":     "opportunity",
        "promotedAt": "2026-03-30T12:00:00Z"
    }
  }'

# Re-assign open tickets
curl -X PUT "https://{namespace}.api.unbound.cx/object/supportTickets" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "where": {
        "assignedTo": "departing-user-id",
        "status":     {"in": ["open", "pending"]}
    },
    "update": {
        "assignedTo":   "replacement-user-id",
        "reassignedAt": "2026-03-30T12:00:00Z"
    }
  }'
```

</TabItem>
</Tabs>

---

### Cross-Object Relation Traversal

Use multiple queries to join related objects when building detail views — the recommended pattern for fetching a contact with their associated tickets, notes, and calls:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
/**
 * Fetch a contact with all related records populated.
 * Returns a single enriched contact object.
 */
async function getContactWithRelations(api, contactId) {
    // Fetch the contact record itself (with expand details)
    const contact = await api.objects.byId({
        object:        'contacts',
        id:            contactId,
        expandDetails: true,
    });

    // Parallel-fetch related records across object types
    const [tickets, notes, calls] = await Promise.all([
        api.objects.query({
            object: 'supportTickets',
            where:  { contactId },
            limit:  20,
            orderBy: 'createdAt',
            orderDirection: 'desc',
        }),
        api.objects.query({
            object: 'notes',
            where:  { relatedId: contactId },
            limit:  20,
            orderBy: 'createdAt',
            orderDirection: 'desc',
        }),
        api.objects.uoql({
            query: `
                SELECT id, direction, duration, recordingId, createdAt, disposition
                FROM calls
                WHERE contactId = '${contactId}'
                ORDER BY createdAt DESC
                LIMIT 20
            `,
        }),
    ]);

    return {
        ...contact,
        tickets:  tickets.data ?? tickets,
        notes:    notes.data   ?? notes,
        calls:    calls.data   ?? calls,
    };
}

// Usage
const contactDetail = await getContactWithRelations(api, 'contact-id-123');
console.log(`Contact: ${contactDetail.firstName} ${contactDetail.lastName}`);
console.log(`Open tickets: ${contactDetail.tickets.filter(t => t.status === 'open').length}`);
console.log(`Total calls: ${contactDetail.calls.length}`);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function getContactWithRelations(namespace, token, contactId) {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    const base = `https://${namespace}.api.unbound.cx`;

    const [contact, tickets, calls] = await Promise.all([
        fetch(`${base}/object/contacts/${contactId}?expandDetails=true`, { headers }).then(r => r.json()),
        fetch(`${base}/object/supportTickets?contactId=${contactId}&limit=20&orderBy=createdAt&orderDirection=desc`, { headers }).then(r => r.json()),
        fetch(`${base}/object/query/v2`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query: `SELECT id, direction, duration, createdAt FROM calls WHERE contactId = '${contactId}' ORDER BY createdAt DESC LIMIT 20`,
            }),
        }).then(r => r.json()),
    ]);

    return { ...contact, tickets: tickets.data ?? tickets, calls: calls.data ?? calls };
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from concurrent.futures import ThreadPoolExecutor

def get_contact_with_relations(namespace, token, contact_id):
    base = f"https://{namespace}.api.unbound.cx"
    headers = {"Authorization": f"Bearer {token}"}

    def fetch_contact():
        return requests.get(
            f"{base}/object/contacts/{contact_id}?expandDetails=true", headers=headers
        ).json()

    def fetch_tickets():
        return requests.get(
            f"{base}/object/supportTickets",
            headers=headers,
            params={"contactId": contact_id, "limit": 20, "orderBy": "createdAt", "orderDirection": "desc"},
        ).json()

    def fetch_calls():
        return requests.post(
            f"{base}/object/query/v2",
            headers={**headers, "Content-Type": "application/json"},
            json={"query": f"SELECT id, direction, duration, createdAt FROM calls WHERE contactId = '{contact_id}' ORDER BY createdAt DESC LIMIT 20"},
        ).json()

    with ThreadPoolExecutor(max_workers=3) as executor:
        contact_f  = executor.submit(fetch_contact)
        tickets_f  = executor.submit(fetch_tickets)
        calls_f    = executor.submit(fetch_calls)

    contact = contact_f.result()
    contact["tickets"] = tickets_f.result().get("data", tickets_f.result())
    contact["calls"]   = calls_f.result().get("data",   calls_f.result())
    return contact
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
CONTACT_ID="contact-id-123"

# Fetch contact
curl "https://{namespace}.api.unbound.cx/object/contacts/${CONTACT_ID}?expandDetails=true" \
  -H "Authorization: Bearer {token}"

# Fetch related tickets
curl "https://{namespace}.api.unbound.cx/object/supportTickets?contactId=${CONTACT_ID}&limit=20&orderBy=createdAt&orderDirection=desc" \
  -H "Authorization: Bearer {token}"

# Fetch related calls via UOQL
curl -X POST "https://{namespace}.api.unbound.cx/object/query/v2" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"SELECT id, direction, duration, createdAt FROM calls WHERE contactId = '${CONTACT_ID}' ORDER BY createdAt DESC LIMIT 20\"}"
```

</TabItem>
</Tabs>

---

### Multi-Criteria Delete with Dry Run

Preview which records will be deleted before committing — critical for bulk operations:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
/**
 * Dry-run aware bulk delete.
 * Pass dryRun: true to preview how many records would be deleted.
 * Pass dryRun: false (default) to execute.
 */
async function bulkDelete(api, object, where, { dryRun = true } = {}) {
    // Always preview first
    const preview = await api.objects.uoql({
        query: `SELECT COUNT(*) AS count FROM ${object} WHERE ${buildWhereClause(where)}`,
    });
    const count = preview?.data?.[0]?.count ?? 0;

    console.log(`${dryRun ? '[DRY RUN]' : '[LIVE]'} Would delete ${count} records from "${object}"`);

    if (dryRun) {
        return { dryRun: true, wouldDelete: count };
    }

    await api.objects.delete({ object, where });
    return { dryRun: false, deleted: count };
}

// Helper: turn a where object into a UOQL WHERE clause
function buildWhereClause(where) {
    return Object.entries(where)
        .map(([k, v]) => typeof v === 'string' ? `${k} = '${v}'` : `${k} = ${v}`)
        .join(' AND ');
}

// Usage
const criteria = {
    status:       'abandoned',
    lastActiveAt: { lt: '2025-01-01' },
};

// Preview first
const preview = await bulkDelete(api, 'leads', criteria, { dryRun: true });
console.log(`Will delete ${preview.wouldDelete} records`);

// User confirms → execute
if (preview.wouldDelete > 0 && userConfirmed) {
    const result = await bulkDelete(api, 'leads', criteria, { dryRun: false });
    console.log(`Deleted ${result.deleted} records`);
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function countMatchingRecords(namespace, token, object, where) {
    const res = await fetch(`https://${namespace}.api.unbound.cx/object/query/v2`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `SELECT COUNT(*) AS count FROM ${object} WHERE status = '${where.status}'`,
        }),
    });
    const data = await res.json();
    return data?.data?.[0]?.count ?? 0;
}

async function bulkDelete(namespace, token, object, where) {
    // Count first
    const count = await countMatchingRecords(namespace, token, object, where);
    console.log(`Would delete ${count} records`);

    // Confirm then delete
    const res = await fetch(`https://${namespace}.api.unbound.cx/object/${object}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ where }),
    });
    return res.json();
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

def bulk_delete_with_preview(namespace, token, object_name, where, dry_run=True):
    base = f"https://{namespace}.api.unbound.cx"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Build a simple WHERE clause for count
    where_clause = " AND ".join(
        f"{k} = '{v}'" if isinstance(v, str) else f"{k} = {v}"
        for k, v in where.items()
    )
    count_resp = requests.post(f"{base}/object/query/v2", headers=headers, json={
        "query": f"SELECT COUNT(*) AS count FROM {object_name} WHERE {where_clause}"
    }).json()
    count = count_resp.get("data", [{}])[0].get("count", 0)

    print(f"{'[DRY RUN]' if dry_run else '[LIVE]'} Would delete {count} records from '{object_name}'")

    if dry_run:
        return {"dry_run": True, "would_delete": count}

    requests.delete(f"{base}/object/{object_name}", headers=headers, json={"where": where})
    return {"dry_run": False, "deleted": count}
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
OBJECT="leads"
STATUS="abandoned"

# Step 1: Preview count
echo "=== DRY RUN ==="
curl -X POST "https://{namespace}.api.unbound.cx/object/query/v2" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"SELECT COUNT(*) AS count FROM ${OBJECT} WHERE status = '${STATUS}'\"}"

# Step 2: After confirmation, execute delete
echo "=== DELETING ==="
curl -X DELETE "https://{namespace}.api.unbound.cx/object/${OBJECT}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "{\"where\": {\"status\": \"${STATUS}\"}}"
```

</TabItem>
</Tabs>
