---
id: record-types
title: Record Types
---

# Record Types

`api.recordTypes` — Data access permissions. Record Types control which users can create, read, update, and delete objects. Assign them to object records, mailboxes, SIP endpoints, and storage.

---

## Overview

A **Record Type** defines a named permission set:

- `null` on any permission = **universal access** (everyone)
- Array of user IDs = **restricted** to those users

```javascript
// Universal access (default behavior)
await api.recordTypes.create({
    name: 'Public',
    description: 'Anyone can read and write',
    create: null,
    read: null,
    update: null,
    delete: null,
});

// Restricted — only sales managers can create/delete
await api.recordTypes.create({
    name: 'Sales - Restricted',
    description: 'Sensitive sales records',
    create: ['user-mgr-1', 'user-mgr-2'],
    read: null,
    update: ['user-mgr-1', 'user-mgr-2'],
    delete: ['user-admin-1'],
});
```

---

## `recordTypes.create(options)`

```javascript
const rt = await api.recordTypes.create({
    name: 'Support Queue Records',
    description: 'Visible to support team only',
    create: ['user-1', 'user-2'],
    read: null,
    update: ['user-1', 'user-2'],
    delete: ['user-admin'],
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Record type name |
| `description` | string | ✅ | Description |
| `create` | string[] \| null | — | User IDs allowed to create (`null` = everyone) |
| `read` | string[] \| null | — | User IDs allowed to read (`null` = everyone) |
| `update` | string[] \| null | — | User IDs allowed to update (`null` = everyone) |
| `delete` | string[] \| null | — | User IDs allowed to delete (`null` = everyone) |

---

## `recordTypes.update(id, updates)`

Uses an **add/remove pattern** — you don't replace the full list, you add or remove individual users.

```javascript
await api.recordTypes.update('rt-id-123', {
    add: {
        create: ['new-user-1', 'new-user-2'],
        delete: ['manager-1'],
    },
    remove: {
        update: ['old-user-1'],
    },
});
```

| Parameter | Type | Description |
|---|---|---|
| `name` | string | New name (optional) |
| `description` | string | New description (optional) |
| `add` | object | Users to add — keys: `create`, `read`, `update`, `delete` |
| `remove` | object | Users to remove — same keys |

---

## `recordTypes.get(id, options?)`

```javascript
const rt = await api.recordTypes.get('rt-id-123', { includeUsers: true });

// rt.permissions.read.type → 'universal' or 'restricted'
// rt.currentUserAccess.canCreate → true/false
// rt.currentUserAccess.canRead → true/false
```

| Option | Type | Description |
|---|---|---|
| `includeUsers` | boolean | Include user default assignments |

---

## `recordTypes.list(options?)`

```javascript
const result = await api.recordTypes.list({
    search: 'sales',
    isAccountDefault: false,
    page: 1,
    limit: 25,
    sortBy: 'name',
    sortOrder: 'asc',
});

// result.recordTypes — array of record types
// result.pagination  — { page, limit, total, totalPages }
// result.summary     — statistics
```

| Option | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Search name or description |
| `isAccountDefault` | boolean | — | Filter by account default status |
| `page` | number | `1` | Page number |
| `limit` | number | `50` | Items per page (max 100) |
| `sortBy` | string | `'name'` | `'name'`, `'createdAt'`, `'updatedAt'` |
| `sortOrder` | string | `'asc'` | `'asc'` or `'desc'` |

---

## `recordTypes.delete(id)`

```javascript
await api.recordTypes.delete('rt-id-123');
```

---

## User Defaults (`recordTypes.user`)

Assign default record types per user per object type — controls which record type is applied when a user creates a new record.

### `recordTypes.user.create({ recordTypeId, object, userId? })`

```javascript
await api.recordTypes.user.create({
    recordTypeId: 'rt-id-123',
    object: 'contacts',
    userId: 'user-id-456',  // omit for current user
});
```

### `recordTypes.user.update({ recordTypeId, object, userId? })`

```javascript
await api.recordTypes.user.update({
    recordTypeId: 'rt-id-new',
    object: 'contacts',
    userId: 'user-id-456',
});
```

### `recordTypes.user.get({ object, userId? })`

```javascript
const def = await api.recordTypes.user.get({
    object: 'contacts',
    userId: 'user-id-456',
});
```

### `recordTypes.user.getDefaults(userId?, options?)`

Get all record type defaults for a user, organized by object type. Useful for user detail pages.

```javascript
const defaults = await api.recordTypes.user.getDefaults('user-id-456', {
    includeRecordTypeDetails: true,
});
// defaults organized by object: { contacts: {...}, tasks: {...}, ... }
```

### `recordTypes.user.listUsersWithDefault(recordTypeId, options?)`

Find all users who have a specific record type as their default.

```javascript
const users = await api.recordTypes.user.listUsersWithDefault('rt-id-123', {
    object: 'contacts',
    includeUserDetails: true,
    page: 1,
    limit: 50,
});
```

### `recordTypes.user.delete({ object, userId? })`

```javascript
await api.recordTypes.user.delete({ object: 'contacts', userId: 'user-id-456' });
```
