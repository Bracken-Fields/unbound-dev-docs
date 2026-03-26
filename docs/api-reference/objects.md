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
curl -X POST "https://{namespace}.api.unbound.cx/object/contacts" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "status": "active"
  }'
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
curl -X POST "https://{namespace}.api.unbound.cx/object/contacts/query" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "where": {"company": "Acme Corp", "status": "active"},
    "select": ["id", "name", "email", "company"],
    "limit": 50,
    "orderByDirection": "ASC",
    "expandDetails": true
  }'
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
curl -X PUT "https://{namespace}.api.unbound.cx/object/contacts/rec_abc123" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "New Corp",
    "status": "inactive"
  }'
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
curl -X PUT "https://{namespace}.api.unbound.cx/object/contacts" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "where": {"company": "Old Corp", "status": "active"},
    "update": {"company": "Acquired Corp"}
  }'
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
curl -X DELETE "https://{namespace}.api.unbound.cx/object/contacts" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "where": {"status": "archived", "company": "Old Corp"}
  }'
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
curl -X POST "https://{namespace}.api.unbound.cx/object/invoices/columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "amount",
    "type": "decimal",
    "isRequired": true
  }'

# Batch — add multiple columns at once
curl -X POST "https://{namespace}.api.unbound.cx/object/invoices/columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "columns": [
      {"name": "amount", "type": "decimal"},
      {"name": "dueDate", "type": "datetime"},
      {"name": "status", "type": "varchar", "length": 50},
      {"name": "notes", "type": "text"},
      {"name": "isPaid", "type": "boolean"},
      {"name": "metadata", "type": "json"}
    ]
  }'
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
curl -X PUT "https://{namespace}.api.unbound.cx/object/contacts/columns/tier" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "columnType": "varchar",
    "defaultValue": "standard",
    "isRequired": true
  }'
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
curl -X POST "https://{namespace}.api.unbound.cx/object/expand-details" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "objectName": "contacts",
    "fieldName": "companyId",
    "targetObject": "companies",
    "lookupColumn": "id",
    "expandFields": ["name", "website", "industry", "tier"]
  }'
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
curl -X PUT "https://{namespace}.api.unbound.cx/object/expand-details/exp_xyz789" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "expandFields": ["name", "website", "industry", "tier", "contractValue"]
  }'

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
curl -X POST "https://{namespace}.api.unbound.cx/object/generated-columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "objectName": "contacts",
    "columnName": "fullName",
    "value": "CONCAT(firstName, '\''  '\'' , lastName)",
    "type": "string",
    "columnType": "varchar",
    "length": "255"
  }'

# Days since last contact
curl -X POST "https://{namespace}.api.unbound.cx/object/generated-columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "objectName": "leads",
    "columnName": "daysSinceContact",
    "value": "DATEDIFF(NOW(), lastContactedAt)",
    "type": "number",
    "columnType": "int"
  }'
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
curl -X PUT "https://{namespace}.api.unbound.cx/object/generated-columns/gen_abc123" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "TRIM(CONCAT(IFNULL(firstName, '\''\\''), '\\'' '\\'', IFNULL(lastName, '\\'''\\'')))"
  }'

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
curl -X POST "https://{namespace}.api.unbound.cx/object/query/v2" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT direction, COUNT(*) as total FROM cdr GROUP BY direction",
    "expandDetails": false
  }'
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
curl -X POST "https://{namespace}.api.unbound.cx/object/expand-details" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "objectName": "tickets",
    "fieldName": "contactId",
    "targetObject": "contacts",
    "lookupColumn": "id",
    "expandFields": ["name", "email", "company"]
  }'

# 2. Query with expansion enabled
curl -X POST "https://{namespace}.api.unbound.cx/object/tickets/query" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "where": {"status": "open"},
    "expandDetails": true
  }'
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
curl -X POST "https://{namespace}.api.unbound.cx/object/leads/columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'

# Add generated column for display name
curl -X POST "https://{namespace}.api.unbound.cx/object/generated-columns" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "objectName": "leads",
    "columnName": "fullName",
    "value": "CONCAT(firstName, '\''  '\'' , lastName)",
    "columnType": "varchar",
    "length": "200"
  }'

echo "CRM schema ready"
```

</TabItem>
</Tabs>
