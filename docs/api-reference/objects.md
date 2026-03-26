---
id: objects
title: Objects (Data)
---

# Objects

`api.objects` — A flexible CRM-style data layer. Store and query any structured data — contacts, leads, tickets, orders, and custom types you define.

---

## `objects.create(object, body)`

Create a new record.

```javascript
// Preferred (new) syntax
const contact = await api.objects.create({
    object: 'contacts',
    body: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        company: 'Acme Corp',
    },
});

// Legacy syntax (also supported)
const contact = await api.objects.create('contacts', { name: 'Jane Smith', ... });
```

---

## `objects.query(options)`

Query records with filters, sorting, and pagination.

```javascript
const results = await api.objects.query({
    object: 'contacts',
    select: ['id', 'name', 'email', 'company'],
    where: {
        company: 'Acme Corp',
        status: 'active',
    },
    limit: 50,
    orderByDirection: 'DESC',
    expandDetails: true,
});

// results.data → array of matching objects
// Use results.data[0].id as nextId for cursor pagination
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `object` | string | — | Object type to query |
| `select` | string[] | — | Fields to return (omit for all) |
| `where` | object | `{}` | Field filters |
| `limit` | number | `100` | Max records to return |
| `nextId` | string | — | Cursor for next page |
| `previousId` | string | — | Cursor for previous page |
| `orderByDirection` | string | `'DESC'` | `'ASC'` or `'DESC'` |
| `expandDetails` | boolean | `false` | Resolve related object references |

**Legacy syntax:**
```javascript
await api.objects.query('contacts', { status: 'active', limit: 25 });
```

---

## `objects.byId(id)`

Fetch a record by its ID.

```javascript
const contact = await api.objects.byId('contact-id-123');

// With field selection
const contact = await api.objects.byId({
    id: 'contact-id-123',
    query: { select: 'id,name,email' },
});
```

---

## `objects.updateById(object, id, update)`

Update a record by ID.

```javascript
// Preferred syntax
await api.objects.updateById({
    object: 'contacts',
    id: 'contact-id-123',
    update: { company: 'New Corp', status: 'active' },
});

// Legacy syntax
await api.objects.updateById('contacts', 'contact-id-123', { company: 'New Corp' });
```

---

## `objects.update({ object, where, update })`

Update records matching a `where` clause (bulk update).

```javascript
await api.objects.update({
    object: 'contacts',
    where: { company: 'Old Corp' },
    update: { company: 'New Corp' },
});
```

---

## `objects.deleteById({ object, id })`

Delete a single record by ID.

```javascript
await api.objects.deleteById({
    object: 'contacts',
    id: 'contact-id-123',
});
```

---

## `objects.delete({ object, where })`

Delete records matching a `where` clause.

```javascript
await api.objects.delete({
    object: 'contacts',
    where: { status: 'archived' },
});
```

---

## `objects.describe(object)`

Inspect the schema for an object type — fields, types, relationships.

```javascript
const schema = await api.objects.describe('contacts');
// schema.fields → array of { name, type, required, ... }
```

---

## `objects.list()`

List all available object types in your namespace.

```javascript
const types = await api.objects.list();
// → ['contacts', 'leads', 'tickets', 'orders', ...]
```

---

## `objects.uoql(options)`

Run a UOQL (SQL-style) query against any object type. See the [full UOQL reference](/api-reference/uoql) for syntax details.

```javascript
const data = await api.objects.uoql({
    query: 'SELECT direction, COUNT(*) as total FROM cdr GROUP BY direction',
    expandDetails: false,
});

// data.results — array of matching rows
// data.pagination.totalRecords
// data.pagination.hasNextPage
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `query` | string | — | UOQL SQL query string |
| `expandDetails` | boolean | `false` | Resolve foreign key references inline |

---

## Schema Management

### Create a New Object Type

```javascript
await api.objects.createObject({ name: 'invoices' });
```

### Add Columns to an Object

```javascript
// Single column
await api.objects.createColumn({
    objectName: 'invoices',
    name: 'amount',
    type: 'decimal',
    length: null,
    isRequired: true,
});

// Batch columns
await api.objects.createColumn({
    objectName: 'invoices',
    columns: [
        { name: 'amount', type: 'decimal' },
        { name: 'dueDate', type: 'datetime' },
        { name: 'status', type: 'varchar', length: 50 },
    ],
});
```

| Column Type | Description |
|---|---|
| `varchar` | Short string (default length 255) |
| `text` | Long string / unlimited |
| `int` | Integer |
| `decimal` | Decimal number |
| `boolean` | True/false |
| `datetime` | Date and time |
| `json` | JSON blob |

### Modify a Column

```javascript
await api.objects.modifyColumn({
    objectName: 'invoices',
    columnName: 'status',
    columnType: 'varchar',
    length: 100,
    isRequired: false,
});
```

### Delete a Column

```javascript
await api.objects.deleteColumn({
    objectName: 'invoices',
    columnName: 'legacyField',
});
```

---

## Expand Details

Expand details define automatic joins — when querying one object, related objects are auto-resolved.

```javascript
// Define a relationship: contacts.companyId → companies.id
await api.objects.createExpandDetail({
    objectName: 'contacts',
    fieldName: 'companyId',
    targetObject: 'companies',
    lookupColumn: 'id',
    expandFields: ['name', 'website', 'industry'],
});

// Now queries with expandDetails:true will include company data
const contacts = await api.objects.query({
    object: 'contacts',
    expandDetails: true,
});
// contacts[0].companyId_expanded → { name: 'Acme Corp', website: '...' }
```

---

## Generated Columns

Computed columns derived from expressions or formulas.

```javascript
await api.objects.createGeneratedColumn({
    objectName: 'contacts',
    columnName: 'fullName',
    value: "CONCAT(firstName, ' ', lastName)",
    type: 'string',
    columnType: 'varchar',
    length: '255',
});
```
