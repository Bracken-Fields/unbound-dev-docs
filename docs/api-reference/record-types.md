---
id: record-types
title: Record Types
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Record Types

`api.recordTypes` — Data access permissions. Record Types control which users can create, read, update, and delete objects. Assign them to object records, mailboxes, SIP endpoints, and storage.

---

## Overview

A **Record Type** defines a named permission set:

- `null` on any permission = **universal access** (everyone)
- Array of user IDs = **restricted** to those users

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

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

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
// Universal access (default behavior)
const res1 = await fetch("https://{namespace}.api.unbound.cx/record-type", {
    method: "POST",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name: "Public",
        description: "Anyone can read and write",
        create: null,
        read: null,
        update: null,
        delete: null,
    }),
});
const rt1 = await res1.json();

// Restricted — only sales managers can create/delete
const res2 = await fetch("https://{namespace}.api.unbound.cx/record-type", {
    method: "POST",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name: "Sales - Restricted",
        description: "Sensitive sales records",
        create: ["user-mgr-1", "user-mgr-2"],
        read: null,
        update: ["user-mgr-1", "user-mgr-2"],
        delete: ["user-admin-1"],
    }),
});
const rt2 = await res2.json();
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
// Universal access (default behavior)
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'name' => 'Public',
    'description' => 'Anyone can read and write',
    'create' => null,
    'read' => null,
    'update' => null,
    'delete' => null,
]));
$rt1 = json_decode(curl_exec($ch), true);
curl_close($ch);

// Restricted — only sales managers can create/delete
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'name' => 'Sales - Restricted',
    'description' => 'Sensitive sales records',
    'create' => ['user-mgr-1', 'user-mgr-2'],
    'read' => null,
    'update' => ['user-mgr-1', 'user-mgr-2'],
    'delete' => ['user-admin-1'],
]));
$rt2 = json_decode(curl_exec($ch), true);
curl_close($ch);
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

# Universal access (default behavior)
res1 = requests.post(
    "https://{namespace}.api.unbound.cx/record-type",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "Public",
        "description": "Anyone can read and write",
        "create": None,
        "read": None,
        "update": None,
        "delete": None,
    })
rt1 = res1.json()

# Restricted — only sales managers can create/delete
res2 = requests.post(
    "https://{namespace}.api.unbound.cx/record-type",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "Sales - Restricted",
        "description": "Sensitive sales records",
        "create": ["user-mgr-1", "user-mgr-2"],
        "read": None,
        "update": ["user-mgr-1", "user-mgr-2"],
        "delete": ["user-admin-1"],
    })
rt2 = res2.json()
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
# Universal access (default behavior)
DATA=$(cat <<'EOF'
{
  "name": "Public",
  "description": "Anyone can read and write",
  "create": null,
  "read": null,
  "update": null,
  "delete": null
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/record-type" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Restricted — only sales managers can create/delete
DATA=$(cat <<'EOF'
{
  "name": "Sales - Restricted",
  "description": "Sensitive sales records",
  "create": ["user-mgr-1", "user-mgr-2"],
  "read": null,
  "update": ["user-mgr-1", "user-mgr-2"],
  "delete": ["user-admin-1"]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/record-type" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>

</Tabs>

---

## `recordTypes.create(options)`

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

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

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/record-type", {
    method: "POST",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name: "Support Queue Records",
        description: "Visible to support team only",
        create: ["user-1", "user-2"],
        read: null,
        update: ["user-1", "user-2"],
        delete: ["user-admin"],
    }),
});
const rt = await res.json();
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'name' => 'Support Queue Records',
    'description' => 'Visible to support team only',
    'create' => ['user-1', 'user-2'],
    'read' => null,
    'update' => ['user-1', 'user-2'],
    'delete' => ['user-admin'],
]));
$rt = json_decode(curl_exec($ch), true);
curl_close($ch);
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

res = requests.post(
    "https://{namespace}.api.unbound.cx/record-type",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "Support Queue Records",
        "description": "Visible to support team only",
        "create": ["user-1", "user-2"],
        "read": None,
        "update": ["user-1", "user-2"],
        "delete": ["user-admin"],
    })
rt = res.json()
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "Support Queue Records",
  "description": "Visible to support team only",
  "create": ["user-1", "user-2"],
  "read": null,
  "update": ["user-1", "user-2"],
  "delete": ["user-admin"]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/record-type" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>

</Tabs>

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

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

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

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/record-type/rt-id-123", {
    method: "PUT",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        add: {
            create: ["new-user-1", "new-user-2"],
            delete: ["manager-1"],
        },
        remove: {
            update: ["old-user-1"],
        },
    }),
});
const data = await res.json();
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type/rt-id-123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'add' => [
        'create' => ['new-user-1', 'new-user-2'],
        'delete' => ['manager-1'],
    ],
    'remove' => [
        'update' => ['old-user-1'],
    ],
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

response = requests.put(
    "https://{namespace}.api.unbound.cx/record-type/rt-id-123",
    headers={"Authorization": "Bearer {token}"},
    json={
        "add": {
            "create": ["new-user-1", "new-user-2"],
            "delete": ["manager-1"],
        },
        "remove": {
            "update": ["old-user-1"],
        },
    })
data = response.json()
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "add": {
    "create": ["new-user-1", "new-user-2"],
    "delete": ["manager-1"]
  },
  "remove": {
    "update": ["old-user-1"]
  }
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/record-type/rt-id-123" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>

</Tabs>

| Parameter | Type | Description |
|---|---|---|
| `name` | string | New name (optional) |
| `description` | string | New description (optional) |
| `add` | object | Users to add — keys: `create`, `read`, `update`, `delete` |
| `remove` | object | Users to remove — same keys |

---

## `recordTypes.get(id, options?)`

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

```javascript
const rt = await api.recordTypes.get('rt-id-123', { includeUsers: true });

// rt.permissions.read.type → 'universal' or 'restricted'
// rt.currentUserAccess.canCreate → true/false
// rt.currentUserAccess.canRead → true/false
```

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/record-type/rt-id-123?includeUsers=true", {
    headers: {
        "Authorization": "Bearer {token}",
    },
});
const rt = await res.json();

// rt.permissions.read.type → 'universal' or 'restricted'
// rt.currentUserAccess.canCreate → true/false
// rt.currentUserAccess.canRead → true/false
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type/rt-id-123?includeUsers=true");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$rt = json_decode(curl_exec($ch), true);
curl_close($ch);

// $rt['permissions']['read']['type'] → 'universal' or 'restricted'
// $rt['currentUserAccess']['canCreate'] → true/false
// $rt['currentUserAccess']['canRead'] → true/false
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/record-type/rt-id-123",
    headers={"Authorization": "Bearer {token}"},
    params={"includeUsers": "true"})
rt = response.json()

# rt['permissions']['read']['type'] → 'universal' or 'restricted'
# rt['currentUserAccess']['canCreate'] → True/False
# rt['currentUserAccess']['canRead'] → True/False
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/record-type/rt-id-123?includeUsers=true" \
  -H "Authorization: Bearer {token}"

# Response includes:
# permissions.read.type → 'universal' or 'restricted'
# currentUserAccess.canCreate → true/false
# currentUserAccess.canRead → true/false
```

</TabItem>

</Tabs>

| Option | Type | Description |
|---|---|---|
| `includeUsers` | boolean | Include user default assignments |

---

## `recordTypes.list(options?)`

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

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

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
    search: "sales",
    page: "1",
    limit: "25",
    sortBy: "name",
    sortOrder: "asc",
});
const res = await fetch(`https://{namespace}.api.unbound.cx/record-type?${params}`, {
    headers: {
        "Authorization": "Bearer {token}",
    },
});
const result = await res.json();

// result.recordTypes — array of record types
// result.pagination  — { page, limit, total, totalPages }
// result.summary     — statistics
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
$params = http_build_query([
    'search' => 'sales',
    'page' => 1,
    'limit' => 25,
    'sortBy' => 'name',
    'sortOrder' => 'asc',
]);
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type?" . $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$result = json_decode(curl_exec($ch), true);
curl_close($ch);

// $result['recordTypes'] — array of record types
// $result['pagination']  — ['page', 'limit', 'total', 'totalPages']
// $result['summary']     — statistics
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/record-type",
    headers={"Authorization": "Bearer {token}"},
    params={
        "search": "sales",
        "page": 1,
        "limit": 25,
        "sortBy": "name",
        "sortOrder": "asc",
    })
result = response.json()

# result['recordTypes'] — array of record types
# result['pagination']  — {'page', 'limit', 'total', 'totalPages'}
# result['summary']     — statistics
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/record-type?search=sales&page=1&limit=25&sortBy=name&sortOrder=asc" \
  -H "Authorization: Bearer {token}"

# Response includes:
# recordTypes — array of record types
# pagination  — { page, limit, total, totalPages }
# summary     — statistics
```

</TabItem>

</Tabs>

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

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

```javascript
await api.recordTypes.delete('rt-id-123');
```

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/record-type/rt-id-123", {
    method: "DELETE",
    headers: {
        "Authorization": "Bearer {token}",
    },
});
const data = await res.json();
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type/rt-id-123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    "https://{namespace}.api.unbound.cx/record-type/rt-id-123",
    headers={"Authorization": "Bearer {token}"})
data = response.json()
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/record-type/rt-id-123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>

</Tabs>

---

## User Defaults (`recordTypes.user`)

Assign default record types per user per object type — controls which record type is applied when a user creates a new record.

### `recordTypes.user.create({ recordTypeId, object, userId? })`

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

```javascript
await api.recordTypes.user.create({
    recordTypeId: 'rt-id-123',
    object: 'contacts',
    userId: 'user-id-456',  // omit for current user
});
```

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/record-type/user-default", {
    method: "POST",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        recordTypeId: "rt-id-123",
        object: "contacts",
        userId: "user-id-456",
    }),
});
const data = await res.json();
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type/user-default");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'recordTypeId' => 'rt-id-123',
    'object' => 'contacts',
    'userId' => 'user-id-456',
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/record-type/user-default",
    headers={"Authorization": "Bearer {token}"},
    json={
        "recordTypeId": "rt-id-123",
        "object": "contacts",
        "userId": "user-id-456",
    })
data = response.json()
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "recordTypeId": "rt-id-123",
  "object": "contacts",
  "userId": "user-id-456"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/record-type/user-default" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>

</Tabs>

### `recordTypes.user.update({ recordTypeId, object, userId? })`

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

```javascript
await api.recordTypes.user.update({
    recordTypeId: 'rt-id-new',
    object: 'contacts',
    userId: 'user-id-456',
});
```

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/record-type/user-default", {
    method: "PUT",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        recordTypeId: "rt-id-new",
        object: "contacts",
        userId: "user-id-456",
    }),
});
const data = await res.json();
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type/user-default");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'recordTypeId' => 'rt-id-new',
    'object' => 'contacts',
    'userId' => 'user-id-456',
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

response = requests.put(
    "https://{namespace}.api.unbound.cx/record-type/user-default",
    headers={"Authorization": "Bearer {token}"},
    json={
        "recordTypeId": "rt-id-new",
        "object": "contacts",
        "userId": "user-id-456",
    })
data = response.json()
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "recordTypeId": "rt-id-new",
  "object": "contacts",
  "userId": "user-id-456"
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/record-type/user-default" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>

</Tabs>

### `recordTypes.user.get({ object, userId? })`

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

```javascript
const def = await api.recordTypes.user.get({
    object: 'contacts',
    userId: 'user-id-456',
});
```

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
    object: "contacts",
    userId: "user-id-456",
});
const res = await fetch(`https://{namespace}.api.unbound.cx/record-type/user-default?${params}`, {
    headers: {
        "Authorization": "Bearer {token}",
    },
});
const data = await res.json();
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
$params = http_build_query([
    'object' => 'contacts',
    'userId' => 'user-id-456',
]);
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type/user-default?" . $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/record-type/user-default",
    headers={"Authorization": "Bearer {token}"},
    params={
        "object": "contacts",
        "userId": "user-id-456",
    })
data = response.json()
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/record-type/user-default?object=contacts&userId=user-id-456" \
  -H "Authorization: Bearer {token}"
```

</TabItem>

</Tabs>

### `recordTypes.user.getDefaults(userId?, options?)`

Get all record type defaults for a user, organized by object type. Useful for user detail pages.

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

```javascript
const defaults = await api.recordTypes.user.getDefaults('user-id-456', {
    includeRecordTypeDetails: true,
});
// defaults organized by object: { contacts: {...}, tasks: {...}, ... }
```

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
    includeRecordTypeDetails: "true",
});
const res = await fetch(`https://{namespace}.api.unbound.cx/record-type/user-default/all?userId=user-id-456&${params}`, {
    headers: {
        "Authorization": "Bearer {token}",
    },
});
const defaults = await res.json();
// defaults organized by object: { contacts: {...}, tasks: {...}, ... }
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
$params = http_build_query([
    'userId' => 'user-id-456',
    'includeRecordTypeDetails' => 'true',
]);
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type/user-default/all?" . $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$defaults = json_decode(curl_exec($ch), true);
curl_close($ch);
// defaults organized by object: { contacts: {...}, tasks: {...}, ... }
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/record-type/user-default/all",
    headers={"Authorization": "Bearer {token}"},
    params={
        "userId": "user-id-456",
        "includeRecordTypeDetails": "true",
    })
defaults = response.json()
# defaults organized by object: { contacts: {...}, tasks: {...}, ... }
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/record-type/user-default/all?userId=user-id-456&includeRecordTypeDetails=true" \
  -H "Authorization: Bearer {token}"

# Response organized by object: { contacts: {...}, tasks: {...}, ... }
```

</TabItem>

</Tabs>

### `recordTypes.user.listUsersWithDefault(recordTypeId, options?)`

Find all users who have a specific record type as their default.

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

```javascript
const users = await api.recordTypes.user.listUsersWithDefault('rt-id-123', {
    object: 'contacts',
    includeUserDetails: true,
    page: 1,
    limit: 50,
});
```

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
    object: "contacts",
    includeUserDetails: "true",
    page: "1",
    limit: "50",
});
const res = await fetch(`https://{namespace}.api.unbound.cx/record-type/rt-id-123/users?${params}`, {
    headers: {
        "Authorization": "Bearer {token}",
    },
});
const users = await res.json();
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
$params = http_build_query([
    'object' => 'contacts',
    'includeUserDetails' => 'true',
    'page' => 1,
    'limit' => 50,
]);
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type/rt-id-123/users?" . $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$users = json_decode(curl_exec($ch), true);
curl_close($ch);
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/record-type/rt-id-123/users",
    headers={"Authorization": "Bearer {token}"},
    params={
        "object": "contacts",
        "includeUserDetails": "true",
        "page": 1,
        "limit": 50,
    })
users = response.json()
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/record-type/rt-id-123/users?object=contacts&includeUserDetails=true&page=1&limit=50" \
  -H "Authorization: Bearer {token}"
```

</TabItem>

</Tabs>

### `recordTypes.user.delete({ object, userId? })`

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

```javascript
await api.recordTypes.user.delete({ object: 'contacts', userId: 'user-id-456' });
```

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
    object: "contacts",
    userId: "user-id-456",
});
const res = await fetch(`https://{namespace}.api.unbound.cx/record-type/user-default?${params}`, {
    method: "DELETE",
    headers: {
        "Authorization": "Bearer {token}",
    },
});
const data = await res.json();
```

</TabItem>

<TabItem value="php" label="PHP">

```php
<?php
$params = http_build_query([
    'object' => 'contacts',
    'userId' => 'user-id-456',
]);
$ch = curl_init("https://{namespace}.api.unbound.cx/record-type/user-default?" . $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
?>
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    "https://{namespace}.api.unbound.cx/record-type/user-default",
    headers={"Authorization": "Bearer {token}"},
    params={
        "object": "contacts",
        "userId": "user-id-456",
    })
data = response.json()
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/record-type/user-default?object=contacts&userId=user-id-456" \
  -H "Authorization: Bearer {token}"
```

</TabItem>

</Tabs>
