---
id: objects
title: Objects (Data)
---

# Objects

`api.objects` — A flexible CRM-style data layer. Store and query any structured data: contacts, leads, tickets, orders, and custom types.

## Create

```javascript
const contact = await api.objects.create('contacts', {
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '+1234567890',
  company: 'Acme Corp',
});

console.log('Created ID:', contact.id);
```

## Query

```javascript
const results = await api.objects.query('contacts', {
  limit: 25,
  orderBy: 'createdAt',
  orderDirection: 'desc',
  filters: [
    { field: 'company', operator: 'eq', value: 'Acme Corp' },
    { field: 'email', operator: 'contains', value: '@example.com' },
  ],
});

// results.data — array of objects
// results.total — total count
// results.cursor — pagination cursor
```

### Filter Operators

| Operator | Description |
|---|---|
| `eq` | Equals |
| `neq` | Not equals |
| `contains` | String contains |
| `startsWith` | String starts with |
| `gt` / `gte` | Greater than / or equal |
| `lt` / `lte` | Less than / or equal |
| `in` | Value in array |
| `isNull` | Field is null |

## Get by ID

```javascript
const contact = await api.objects.byId('contact-id-123');
```

## Update

```javascript
await api.objects.updateById('contacts', 'contact-id-123', {
  company: 'New Corp',
  status: 'active',
});
```

## Delete

```javascript
await api.objects.deleteById('contacts', 'contact-id-123');
```

## Introspection

```javascript
// Get the schema for an object type
const schema = await api.objects.describe('contacts');

// List all available object types
const types = await api.objects.list();
```

## Relationships

Objects can reference each other by ID. Use `describe()` to understand the relationship fields available on a given type.

```javascript
// Create a ticket linked to a contact
await api.objects.create('tickets', {
  subject: 'Need help with billing',
  contactId: 'contact-id-123',
  priority: 'high',
  status: 'open',
});
```
