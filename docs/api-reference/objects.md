---
id: objects
title: Objects (Data)
---

# Objects

`api.objects` — A flexible CRM-style data layer. Store and query any structured data — contacts, leads, tickets, orders, and custom types you define.

Object types are user-definable schemas. Use schema management methods to create types and columns, then CRUD methods to work with records.

---

## Core Record Methods

### `objects.create(params)`

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

| Parameter | Type | Required | Description |
|---|---|---|---|
| `object` | string | ✓ | Object type to create the record in |
| `body` | object | ✓ | Field values for the new record |

---

### `objects.byId(params)`

Fetch a single record by ID.

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

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✓ | Record ID |
| `query.select` | string | — | Comma-separated list of fields to return |
| `isAiPrompt` | boolean | — | Strip system fields for AI prompt use |

---

### `objects.query(options)`

Query records with filters, sorting, and pagination.

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

// Paginate through all records
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

| Parameter | Type | Required | Description |
|---|---|---|---|
| `object` | string | ✓ | Object type |
| `id` | string | ✓ | Record ID to update |
| `update` | object | ✓ | Fields to update (partial updates supported) |

---

### `objects.update({ object, where, update })`

Bulk update records matching a `where` clause.

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

```javascript
await api.objects.deleteById({
    object: 'contacts',
    id: 'rec_abc123',
});
```

---

### `objects.delete({ object, where })`

Delete records matching a `where` clause.

```javascript
// Delete all archived contacts older than a date
await api.objects.delete({
    object: 'contacts',
    where: { status: 'archived', company: 'Old Corp' },
});
```

:::caution
`where: {}` will delete **all** records of that type. There is no soft delete — this is permanent.
:::

---

## Schema Inspection

### `objects.list()`

List all object types defined in your namespace.

```javascript
const types = await api.objects.list();
// → ['contacts', 'leads', 'tickets', 'orders', 'invoices', ...]
```

---

### `objects.describe(object)`

Inspect the full schema for an object type.

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

---

## Schema Management

### `objects.createObject({ name })`

Create a new object type (table).

```javascript
await api.objects.createObject({ name: 'invoices' });
await api.objects.createObject({ name: 'support_tickets' });
```

---

### `objects.createColumn(params)`

Add one or more columns to an existing object type.

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

```javascript
await api.objects.deleteColumn({
    objectName: 'contacts',
    columnName: 'legacyExternalId',
});
```

:::danger
Deletes the column and all data in it. This is irreversible.
:::

---

## Expand Details

Expand details are join definitions — when querying an object, related objects can be auto-resolved and inlined. Enable with `expandDetails: true` on any query.

### `objects.createExpandDetail(params)`

Define a join relationship between two object types.

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

---

### `objects.updateExpandDetail(params)`

Update an expand detail definition. Only pass fields you want to change.

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

```javascript
await api.objects.deleteExpandDetail('exp_xyz789');
```

After deletion, queries with `expandDetails: true` will no longer include the previously-expanded fields.

---

## Generated Columns

Computed columns derived from SQL expressions. Generated columns are virtual — they're calculated at query time, not stored. Useful for concatenated fields, formatted values, or derived metrics.

### `objects.createGeneratedColumn(params)`

Create a computed column on an object type.

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

---

### `objects.updateGeneratedColumn(params)`

Update a generated column definition. Only pass fields to change.

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

```javascript
await api.objects.deleteGeneratedColumn('gen_abc123');
```

---

## UOQL Queries

For complex SQL-style queries, use the [UOQL engine](/api-reference/uoql) directly:

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

See the [UOQL reference](/api-reference/uoql) for the full syntax, operators, aggregates, and window functions.

---

## Common Patterns

### Full-Text Contact Search

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

### Upsert Pattern

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

### Paginate Through All Records

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

### Related Data with Expand Details

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

### Dynamic Schema Bootstrap

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
