---
id: layouts
title: Layouts
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Layouts

`api.layouts` — UI layout definitions for CRM objects. Layouts control how fields are arranged and displayed in the Unbound interface for a given object type. Every CRM view (contact detail, ticket form, agent screen-pop) is driven by a layout definition you create and update via this API.

---

## Overview

A **layout** is a JSON document that describes:

- Which **object** it belongs to (e.g., `contacts`, `tickets`, `orders`)
- One or more **sections** — labeled groups of fields
- Within each section, **columns** (1 or 2) and an ordered list of **field definitions**

Field definitions go beyond a simple name: they can specify display labels, field types (text, select, date, relationship), validation hints, read-only conditions, and dynamic-select sources.

### Layout vs. Record Type

Layouts and [Record Types](/api-reference/record-types) are related but distinct:

| Concept | Purpose |
|---|---|
| **Record Type** | Controls permissions and default schema for a user or team |
| **Layout** | Controls visual arrangement of fields in the UI |

A record type can have one or more layouts; your code selects the right layout at runtime based on role or context.

---

## `layouts.get(objectName, id?, query?)`

Fetch layouts for an object type, or a specific layout by ID.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// All layouts for the contacts object
const layouts = await api.layouts.get('contacts');

// Specific layout by ID
const layout = await api.layouts.get('contacts', 'layout-id-123');

// With query options (e.g., filtering)
const layouts = await api.layouts.get('contacts', null, { recordTypeId: 'rt-456' });
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// All layouts for contacts
const response = await fetch('https://{namespace}.api.unbound.cx/layouts/contacts', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const layouts = await response.json();

// Specific layout by ID
const response2 = await fetch('https://{namespace}.api.unbound.cx/layouts/contacts/layout-id-123', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const layout = await response2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
// All layouts for contacts
$ch = curl_init('https://{namespace}.api.unbound.cx/layouts/contacts');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$layouts = json_decode(curl_exec($ch), true);
curl_close($ch);

// Specific layout by ID
$ch = curl_init('https://{namespace}.api.unbound.cx/layouts/contacts/layout-id-123');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$layout = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# All layouts for contacts
response = requests.get(
    'https://{namespace}.api.unbound.cx/layouts/contacts',
    headers={'Authorization': 'Bearer {token}'}
)
layouts = response.json()

# Specific layout by ID
response = requests.get(
    'https://{namespace}.api.unbound.cx/layouts/contacts/layout-id-123',
    headers={'Authorization': 'Bearer {token}'}
)
layout = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# All layouts for contacts
curl https://{namespace}.api.unbound.cx/layouts/contacts \
  -H "Authorization: Bearer {token}"

# Specific layout by ID
curl https://{namespace}.api.unbound.cx/layouts/contacts/layout-id-123 \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `objectName` | string | — | The object type name (e.g., `contacts`, `tickets`) |
| `id` | string | — | Specific layout ID. Omit to list all layouts for the object |
| `query` | object | — | Optional query filters (e.g., `{ recordTypeId }`) |

### Response

When no `id` is given, returns an array of layout objects. When an `id` is given, returns the single layout object.

---

## `layouts.create(layout)`

Create a new layout definition.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const layout = await api.layouts.create({
    name: 'Contact Detail — Agent',
    objectName: 'contacts',
    recordTypeId: 'rt-agent-456',   // Optional: scope to a record type
    sections: [
        {
            label: 'Core Info',
            columns: 2,
            fields: [
                { name: 'firstName',  label: 'First Name',   type: 'text',  required: true },
                { name: 'lastName',   label: 'Last Name',    type: 'text',  required: true },
                { name: 'email',      label: 'Email',        type: 'email', required: false },
                { name: 'phone',      label: 'Phone',        type: 'phone', required: false },
            ],
        },
        {
            label: 'Company',
            columns: 1,
            fields: [
                {
                    name: 'companyId',
                    label: 'Company',
                    type: 'relationship',
                    relatedObject: 'companies',
                    displayField: 'name',
                },
                { name: 'title',      label: 'Job Title',    type: 'text'  },
                { name: 'department', label: 'Department',   type: 'text'  },
            ],
        },
    ],
});

console.log('Layout created:', layout.id);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/layouts', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: 'Contact Detail — Agent',
        objectName: 'contacts',
        sections: [
            {
                label: 'Core Info',
                columns: 2,
                fields: [
                    { name: 'firstName', label: 'First Name', type: 'text',  required: true },
                    { name: 'lastName',  label: 'Last Name',  type: 'text',  required: true },
                    { name: 'email',     label: 'Email',      type: 'email' },
                    { name: 'phone',     label: 'Phone',      type: 'phone' },
                ],
            },
        ],
    }),
});
const layout = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/layouts');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'name' => 'Contact Detail — Agent',
    'objectName' => 'contacts',
    'sections' => [
        [
            'label' => 'Core Info',
            'columns' => 2,
            'fields' => [
                ['name' => 'firstName', 'label' => 'First Name', 'type' => 'text', 'required' => true],
                ['name' => 'lastName',  'label' => 'Last Name',  'type' => 'text', 'required' => true],
                ['name' => 'email',     'label' => 'Email',      'type' => 'email'],
                ['name' => 'phone',     'label' => 'Phone',      'type' => 'phone'],
            ],
        ],
    ],
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$layout = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/layouts',
    headers={'Authorization': 'Bearer {token}'},
    json={
        'name': 'Contact Detail — Agent',
        'objectName': 'contacts',
        'sections': [
            {
                'label': 'Core Info',
                'columns': 2,
                'fields': [
                    {'name': 'firstName', 'label': 'First Name', 'type': 'text', 'required': True},
                    {'name': 'lastName',  'label': 'Last Name',  'type': 'text', 'required': True},
                    {'name': 'email',     'label': 'Email',      'type': 'email'},
                    {'name': 'phone',     'label': 'Phone',      'type': 'phone'},
                ],
            },
        ],
    }
)
layout = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST https://{namespace}.api.unbound.cx/layouts \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Contact Detail - Agent",
    "objectName": "contacts",
    "sections": [
      {
        "label": "Core Info",
        "columns": 2,
        "fields": [
          {"name": "firstName", "label": "First Name", "type": "text", "required": true},
          {"name": "lastName",  "label": "Last Name",  "type": "text", "required": true},
          {"name": "email",     "label": "Email",      "type": "email"},
          {"name": "phone",     "label": "Phone",      "type": "phone"}
        ]
      }
    ]
  }'
```

</TabItem>
</Tabs>

---

## `layouts.update(id, layout)`

Update an existing layout by replacing it with a new definition. The entire layout document is replaced — partial updates are not supported. Fetch first, modify, then write back.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Fetch, modify, save back
const existing = await api.layouts.get('contacts', 'layout-id-123');

const updated = await api.layouts.update('layout-id-123', {
    ...existing,
    sections: [
        ...existing.sections,
        {
            label: 'Custom Fields',
            columns: 2,
            fields: [
                { name: 'tier',        label: 'Customer Tier', type: 'select', options: ['standard', 'premium', 'vip'] },
                { name: 'accountOwner', label: 'Account Owner', type: 'relationship', relatedObject: 'users', displayField: 'fullName' },
            ],
        },
    ],
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch('https://{namespace}.api.unbound.cx/layouts/layout-id-123', {
    method: 'PUT',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: 'Contact Detail — Agent',
        objectName: 'contacts',
        sections: [
            {
                label: 'Contact Info',
                columns: 2,
                fields: ['firstName', 'lastName', 'email', 'phone', 'mobile'],
            },
        ],
    }),
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/layouts/layout-id-123');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'name' => 'Contact Detail — Agent',
    'objectName' => 'contacts',
    'sections' => [
        [
            'label' => 'Contact Info',
            'columns' => 2,
            'fields' => ['firstName', 'lastName', 'email', 'phone', 'mobile'],
        ],
    ],
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

requests.put(
    'https://{namespace}.api.unbound.cx/layouts/layout-id-123',
    headers={'Authorization': 'Bearer {token}'},
    json={
        'name': 'Contact Detail — Agent',
        'objectName': 'contacts',
        'sections': [
            {
                'label': 'Contact Info',
                'columns': 2,
                'fields': ['firstName', 'lastName', 'email', 'phone', 'mobile'],
            },
        ],
    }
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT https://{namespace}.api.unbound.cx/layouts/layout-id-123 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Contact Detail - Agent", "objectName": "contacts", "sections": [...]}'
```

</TabItem>
</Tabs>

---

## `layouts.delete(id)`

Permanently delete a layout. This cannot be undone.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.layouts.delete('layout-id-123');
// Returns true on success
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch('https://{namespace}.api.unbound.cx/layouts/layout-id-123', {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer {token}' },
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/layouts/layout-id-123');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

requests.delete(
    'https://{namespace}.api.unbound.cx/layouts/layout-id-123',
    headers={'Authorization': 'Bearer {token}'}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE https://{namespace}.api.unbound.cx/layouts/layout-id-123 \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `layouts.dynamicSelectSearch(query)`

Search for values to populate a `relationship` or `dynamicSelect` field in real time (typeahead). Called client-side as the user types.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const results = await api.layouts.dynamicSelectSearch({
    objectName: 'companies',
    field: 'name',
    search: 'Acme',
    limit: 10,
});

// results.results — array of { id, label, value }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/layouts/dynamic-select-search?' + new URLSearchParams({
    objectName: 'companies',
    field: 'name',
    search: 'Acme',
    limit: '10',
}), {
    headers: { 'Authorization': 'Bearer {token}' },
});
const results = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$params = http_build_query([
    'objectName' => 'companies',
    'field' => 'name',
    'search' => 'Acme',
    'limit' => 10,
]);
$ch = curl_init('https://{namespace}.api.unbound.cx/layouts/dynamic-select-search?' . $params);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$results = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/layouts/dynamic-select-search',
    headers={'Authorization': 'Bearer {token}'},
    params={'objectName': 'companies', 'field': 'name', 'search': 'Acme', 'limit': 10}
)
results = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/layouts/dynamic-select-search?objectName=companies&field=name&search=Acme&limit=10" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `objectName` | string | ✅ | Object to search in (e.g., `companies`, `users`) |
| `field` | string | ✅ | Field name to search against |
| `search` | string | ✅ | Search string (prefix match) |
| `limit` | number | — | Max results to return (default: 10, max: 50) |

---

## Layout Object Schema

Understanding the full schema lets you build layouts with the correct structure from the start.

### Top-Level Fields

```typescript
interface Layout {
    id: string;                  // Auto-generated on create
    name: string;                // Human-readable name (must be unique per objectName)
    objectName: string;          // Target object type
    recordTypeId?: string;       // Optional: scope to a record type
    sections: LayoutSection[];   // Ordered list of sections
    createdAt: string;           // ISO 8601 timestamp
    updatedAt: string;           // ISO 8601 timestamp
}
```

### Section Schema

```typescript
interface LayoutSection {
    label: string;               // Section heading shown in the UI
    columns: 1 | 2;              // Field grid — 1 or 2 columns
    collapsible?: boolean;       // Whether the section can be collapsed
    collapsed?: boolean;         // Default collapsed state
    fields: LayoutField[];       // Ordered field definitions
}
```

### Field Definition Schema

Fields can be a simple string (just the field name) or a full object with display and validation config:

```typescript
// Simple form — just a field name reference
type SimpleField = string;

// Full form — complete display config
interface LayoutField {
    name: string;                // Field name in the object schema
    label?: string;              // Override display label
    type?: FieldType;            // Display/input type (see below)
    required?: boolean;          // Show required indicator; enforce on save
    readOnly?: boolean;          // Render as read-only text (no input)
    hidden?: boolean;            // Include in layout but hide from view
    placeholder?: string;        // Input placeholder text
    helpText?: string;           // Tooltip or helper text below the field
    options?: string[];          // For 'select' type — fixed options list
    relatedObject?: string;      // For 'relationship' type — target object
    displayField?: string;       // For 'relationship' type — field to display
    searchFields?: string[];     // For 'relationship' type — fields to search
    dynamicSelect?: DynamicSelectConfig;   // For typeahead from an object
    fullWidth?: boolean;         // Span both columns in a 2-column section
}

type FieldType =
    | 'text'
    | 'textarea'
    | 'number'
    | 'email'
    | 'phone'
    | 'url'
    | 'date'
    | 'datetime'
    | 'boolean'
    | 'select'
    | 'multiselect'
    | 'relationship'
    | 'dynamicSelect'
    | 'currency'
    | 'percentage'
    | 'json'
    | 'html';

interface DynamicSelectConfig {
    objectName: string;          // Object to search against
    field: string;               // Field to search
    displayField?: string;       // Field to show in the dropdown
    limit?: number;              // Max typeahead results
}
```

### Complete Layout Example

```javascript
const layout = await api.layouts.create({
    name: 'Support Ticket — Full',
    objectName: 'tickets',
    sections: [
        {
            label: 'Ticket Details',
            columns: 2,
            fields: [
                {
                    name: 'subject',
                    label: 'Subject',
                    type: 'text',
                    required: true,
                    fullWidth: true,       // Spans both columns
                    placeholder: 'Brief description of the issue',
                },
                {
                    name: 'priority',
                    label: 'Priority',
                    type: 'select',
                    options: ['low', 'medium', 'high', 'critical'],
                    required: true,
                },
                {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    options: ['new', 'open', 'pending', 'resolved', 'closed'],
                    required: true,
                },
            ],
        },
        {
            label: 'Contact & Assignee',
            columns: 2,
            fields: [
                {
                    name: 'contactId',
                    label: 'Contact',
                    type: 'relationship',
                    relatedObject: 'contacts',
                    displayField: 'fullName',
                    searchFields: ['firstName', 'lastName', 'email', 'phone'],
                },
                {
                    name: 'assignedUserId',
                    label: 'Assigned To',
                    type: 'relationship',
                    relatedObject: 'users',
                    displayField: 'fullName',
                    searchFields: ['firstName', 'lastName', 'email'],
                },
                {
                    name: 'queueId',
                    label: 'Queue',
                    type: 'dynamicSelect',
                    dynamicSelect: {
                        objectName: 'queues',
                        field: 'name',
                        displayField: 'name',
                        limit: 20,
                    },
                },
            ],
        },
        {
            label: 'Description',
            columns: 1,
            collapsible: false,
            fields: [
                {
                    name: 'description',
                    label: 'Problem Description',
                    type: 'textarea',
                    required: true,
                    helpText: 'Describe the issue in detail. Include error messages or steps to reproduce.',
                    fullWidth: true,
                },
            ],
        },
        {
            label: 'Internal Notes',
            columns: 1,
            collapsible: true,
            collapsed: true,     // Collapsed by default
            fields: [
                {
                    name: 'internalNote',
                    label: 'Internal Note',
                    type: 'textarea',
                    helpText: 'Not visible to the customer.',
                    fullWidth: true,
                },
                {
                    name: 'escalationReason',
                    label: 'Escalation Reason',
                    type: 'select',
                    options: ['technical', 'billing', 'executive', 'legal'],
                },
            ],
        },
    ],
});
```

---

## Response Shapes

### Layout Object

```json
{
    "id": "layout-id-123",
    "name": "Contact Detail — Agent",
    "objectName": "contacts",
    "recordTypeId": "rt-agent-456",
    "sections": [
        {
            "label": "Core Info",
            "columns": 2,
            "collapsible": false,
            "collapsed": false,
            "fields": [
                {
                    "name": "firstName",
                    "label": "First Name",
                    "type": "text",
                    "required": true
                },
                {
                    "name": "lastName",
                    "label": "Last Name",
                    "type": "text",
                    "required": true
                },
                {
                    "name": "email",
                    "label": "Email",
                    "type": "email",
                    "required": false
                },
                {
                    "name": "phone",
                    "label": "Phone",
                    "type": "phone",
                    "required": false
                }
            ]
        }
    ],
    "createdAt": "2026-03-15T10:00:00.000Z",
    "updatedAt": "2026-03-15T10:00:00.000Z"
}
```

### `layouts.get()` — list response

Returns an array when no `id` is supplied:

```json
[
    {
        "id": "layout-id-123",
        "name": "Contact Detail — Agent",
        "objectName": "contacts",
        "sections": [...]
    },
    {
        "id": "layout-id-456",
        "name": "Contact Detail — Supervisor",
        "objectName": "contacts",
        "sections": [...]
    }
]
```

### `layouts.dynamicSelectSearch()` — response

```json
{
    "results": [
        { "id": "company-001", "label": "Acme Corp",    "value": "Acme Corp" },
        { "id": "company-002", "label": "Acme Systems", "value": "Acme Systems" }
    ],
    "total": 2
}
```

---

## Field Type Reference

| Type | Input rendered | Stored as | Notes |
|---|---|---|---|
| `text` | Single-line text input | string | Default type when omitted |
| `textarea` | Multi-line textarea | string | Use for descriptions, notes |
| `number` | Numeric input | number | Validates numeric input |
| `email` | Email input | string | Client-side email format validation |
| `phone` | Phone input | string | E.164 format hint |
| `url` | URL input | string | Validates URL format |
| `date` | Date picker | string (ISO date) | Format: `YYYY-MM-DD` |
| `datetime` | Date+time picker | string (ISO 8601) | Format: `YYYY-MM-DDTHH:MM:SSZ` |
| `boolean` | Checkbox or toggle | boolean | Renders as toggle switch |
| `select` | Dropdown | string | Use `options: []` array |
| `multiselect` | Multi-select dropdown | string[] | Use `options: []` array |
| `relationship` | Search + select | string (ID) | Resolved to object on `expandDetails` |
| `dynamicSelect` | Typeahead autocomplete | string (ID) | Backed by `dynamicSelectSearch` |
| `currency` | Currency input | number | Formatted with currency symbol |
| `percentage` | Percentage input | number | Formatted with `%` suffix |
| `json` | Code editor (JSON) | object | For advanced/technical users |
| `html` | Rich text editor (HTML) | string | WYSIWYG editor |

---

## Common Patterns

### Pattern 1 — Bootstrap layouts for a new custom object

When you programmatically create a new object type via `objects.createObject()`, create matching layouts in the same step so the UI is immediately usable.

```javascript
async function bootstrapObject(objectName, fields) {
    // 1. Create the object schema
    await api.objects.createObject({ name: objectName });

    // 2. Create columns for each field
    await api.objects.createColumn({
        objectName,
        columns: fields.map(f => ({ name: f.name, type: f.type })),
    });

    // 3. Create a detail layout (full field set, 2-column)
    const detailLayout = await api.layouts.create({
        name: `${objectName} — Detail`,
        objectName,
        sections: [
            {
                label: 'Details',
                columns: 2,
                fields: fields.map(f => ({
                    name: f.name,
                    label: f.label || f.name,
                    type: f.uiType || 'text',
                    required: f.required || false,
                })),
            },
        ],
    });

    // 4. Create a compact list/summary layout (key fields only, 1-column)
    const summaryFields = fields.filter(f => f.summary);
    const listLayout = await api.layouts.create({
        name: `${objectName} — Summary`,
        objectName,
        sections: [
            {
                label: 'Summary',
                columns: 1,
                fields: summaryFields.map(f => ({
                    name: f.name,
                    label: f.label || f.name,
                    type: f.uiType || 'text',
                    readOnly: true,
                })),
            },
        ],
    });

    return { detailLayout, listLayout };
}

await bootstrapObject('orders', [
    { name: 'orderId',    label: 'Order ID',    type: 'string', uiType: 'text',   summary: true, required: true  },
    { name: 'customerId', label: 'Customer',    type: 'string', uiType: 'relationship', relatedObject: 'contacts', summary: true },
    { name: 'amount',     label: 'Amount',      type: 'number', uiType: 'currency', summary: true },
    { name: 'status',     label: 'Status',      type: 'string', uiType: 'select', options: ['pending', 'fulfilled', 'cancelled'], summary: true },
    { name: 'notes',      label: 'Notes',       type: 'string', uiType: 'textarea' },
    { name: 'createdAt',  label: 'Created',     type: 'string', uiType: 'datetime', summary: false, readOnly: true },
]);
```

---

### Pattern 2 — Clone a layout

Copy an existing layout, rename it, and save as a new variant. Useful for creating role-specific variations.

```javascript
async function cloneLayout(objectName, sourceId, newName) {
    // 1. Fetch the source layout
    const source = await api.layouts.get(objectName, sourceId);

    // 2. Strip identity fields; apply new name
    const { id, createdAt, updatedAt, ...rest } = source;
    const cloned = await api.layouts.create({
        ...rest,
        name: newName,
    });

    console.log(`Cloned '${source.name}' → '${cloned.name}' (${cloned.id})`);
    return cloned;
}

// Create a supervisor variant with extra fields visible
const supervisorLayout = await cloneLayout('contacts', 'layout-id-123', 'Contact Detail — Supervisor');

// Now update the supervisor variant to add internal fields
const existing = await api.layouts.get('contacts', supervisorLayout.id);
await api.layouts.update(supervisorLayout.id, {
    ...existing,
    sections: [
        ...existing.sections,
        {
            label: 'Supervisor Notes',
            columns: 1,
            collapsible: true,
            collapsed: false,
            fields: [
                { name: 'supervisorNote', label: 'Supervisor Note', type: 'textarea', fullWidth: true },
                { name: 'flaggedForReview', label: 'Flagged for Review', type: 'boolean' },
            ],
        },
    ],
});
```

---

### Pattern 3 — Role-based layout selection

Different roles (agent, supervisor, admin) may need different field arrangements. Select the right layout at runtime based on the authenticated user's role.

```javascript
/**
 * Select the best layout for a user role.
 * Convention: layout names include a role suffix separated by ' — '
 * e.g., "Contact Detail — Agent", "Contact Detail — Supervisor"
 */
async function getLayoutForRole(objectName, userRole) {
    const all = await api.layouts.get(objectName);

    // 1. Try exact role match
    const exact = all.find(l =>
        l.name.toLowerCase().endsWith(`— ${userRole.toLowerCase()}`)
    );
    if (exact) return exact;

    // 2. Fall back to 'Default' layout
    const defaultLayout = all.find(l => l.name.toLowerCase().includes('default'));
    if (defaultLayout) return defaultLayout;

    // 3. Fall back to first available
    return all[0] ?? null;
}

// In your screen-pop / contact detail rendering
async function renderContactDetail(contactId) {
    const [contact, layout] = await Promise.all([
        api.objects.byId({ object: 'contacts', id: contactId, expandDetails: true }),
        getLayoutForRole('contacts', currentUser.role),
    ]);

    if (!layout) {
        console.warn('No layout found for contacts — using raw fields');
        return renderRawContact(contact);
    }

    renderWithLayout(contact, layout);
}

function renderWithLayout(record, layout) {
    for (const section of layout.sections) {
        console.log(`=== ${section.label} ===`);
        const grid = [];
        for (let i = 0; i < section.fields.length; i += section.columns) {
            grid.push(section.fields.slice(i, i + section.columns));
        }
        for (const row of grid) {
            for (const field of row) {
                const fieldName = typeof field === 'string' ? field : field.name;
                const label = typeof field === 'object' ? (field.label ?? fieldName) : fieldName;
                const value = record[fieldName];
                console.log(`  ${label}: ${formatFieldValue(value, field)}`);
            }
        }
    }
}
```

---

### Pattern 4 — Typeahead dynamic select

Drive an autocomplete input from `dynamicSelectSearch` as the user types. Debounce the search to avoid hammering the API.

```javascript
class DynamicSelectInput {
    constructor(config) {
        this.config = config;   // { objectName, field, limit }
        this.debounceMs = 250;
        this._timer = null;
    }

    search(inputValue) {
        clearTimeout(this._timer);

        return new Promise((resolve) => {
            if (inputValue.length < 2) {
                resolve([]);
                return;
            }

            this._timer = setTimeout(async () => {
                try {
                    const { results } = await api.layouts.dynamicSelectSearch({
                        objectName: this.config.objectName,
                        field: this.config.field,
                        search: inputValue,
                        limit: this.config.limit ?? 10,
                    });
                    resolve(results);
                } catch (err) {
                    console.error('Dynamic select search failed:', err);
                    resolve([]);
                }
            }, this.debounceMs);
        });
    }
}

// Usage in a browser UI
const companySearch = new DynamicSelectInput({
    objectName: 'companies',
    field: 'name',
    limit: 10,
});

const input = document.getElementById('company-input');
const dropdown = document.getElementById('company-dropdown');

input.addEventListener('input', async (e) => {
    const results = await companySearch.search(e.target.value);

    dropdown.innerHTML = '';
    for (const item of results) {
        const option = document.createElement('li');
        option.textContent = item.label;
        option.dataset.id = item.id;
        option.addEventListener('click', () => {
            input.value = item.label;
            // Store the ID in a hidden field
            document.getElementById('company-id').value = item.id;
            dropdown.innerHTML = '';
        });
        dropdown.appendChild(option);
    }
});
```

---

### Pattern 5 — Sync layouts across environments

Export all layouts from staging, commit the JSON to git, then import them into production. Implements upsert logic to avoid duplicates.

```javascript
/**
 * Export all layouts for one or more objects as plain JSON
 * (strips identity and timestamp fields for clean diffs)
 */
async function exportLayouts(objectNames) {
    const allLayouts = {};
    for (const objectName of objectNames) {
        const layouts = await api.layouts.get(objectName);
        // Strip server-generated fields for clean git diffs
        allLayouts[objectName] = layouts.map(({ id, createdAt, updatedAt, ...rest }) => rest);
    }
    return allLayouts;
}

/**
 * Import a layout export into the current namespace.
 * Creates new layouts; updates existing ones by name match.
 */
async function importLayouts(exportData) {
    const results = [];

    for (const [objectName, layouts] of Object.entries(exportData)) {
        const existing = await api.layouts.get(objectName);
        const existingByName = Object.fromEntries(existing.map(l => [l.name, l]));

        for (const def of layouts) {
            const match = existingByName[def.name];
            if (match) {
                await api.layouts.update(match.id, def);
                results.push({ action: 'updated', objectName, name: def.name, id: match.id });
            } else {
                const created = await api.layouts.create(def);
                results.push({ action: 'created', objectName, name: def.name, id: created.id });
            }
        }
    }

    return results;
}

// --- Staging: export and save ---
const staging = new SDK({ namespace: 'acme-staging', token: STAGING_TOKEN });
const exported = await exportLayouts(['contacts', 'tickets', 'orders']);
fs.writeFileSync('./layouts.json', JSON.stringify(exported, null, 4));
// git add layouts.json && git commit -m "update layouts"

// --- Production: import ---
const prod = new SDK({ namespace: 'acme-prod', token: PROD_TOKEN });
const importData = JSON.parse(fs.readFileSync('./layouts.json', 'utf8'));
const importResults = await importLayouts(importData);
console.table(importResults);
```

---

### Pattern 6 — Agent screen-pop with context-aware layout

When an inbound call arrives, load the contact record and select a layout tailored to the call context (VIP vs. standard, inbound vs. outbound).

```javascript
async function onInboundCall(callEvent) {
    const { from, engagementSessionId } = callEvent;

    // 1. Look up the contact by phone number
    const [contact] = await api.objects.query({
        object: 'contacts',
        where: { phone: from },
        expandDetails: true,
        limit: 1,
    }).then(r => r.data);

    if (!contact) {
        // No match — render new-contact form
        const newLayout = await getLayoutForRole('contacts', 'new');
        showScreenPop({ mode: 'create', layout: newLayout, prefill: { phone: from } });
        return;
    }

    // 2. Pick the right layout based on customer tier
    const tier = contact.tier ?? 'standard';
    const layoutName = tier === 'vip'
        ? 'Contact Detail — VIP'
        : 'Contact Detail — Agent';

    const allLayouts = await api.layouts.get('contacts');
    const layout = allLayouts.find(l => l.name === layoutName)
        ?? allLayouts.find(l => l.name.includes('Agent'))
        ?? allLayouts[0];

    // 3. Show the screen-pop
    showScreenPop({
        mode: 'view',
        contact,
        layout,
        engagementSessionId,
        badge: tier === 'vip' ? '⭐ VIP Customer' : null,
    });
}
```

---

### Pattern 7 — Add a field to all layouts for an object

When you add a new column to an object, append it to every existing layout so it shows up everywhere automatically.

```javascript
async function addFieldToAllLayouts(objectName, newField) {
    const layouts = await api.layouts.get(objectName);

    const updates = layouts.map(async (layout) => {
        // Check if the field is already present
        const alreadyPresent = layout.sections.some(section =>
            section.fields.some(f =>
                (typeof f === 'string' ? f : f.name) === newField.name
            )
        );
        if (alreadyPresent) {
            return { id: layout.id, action: 'skipped' };
        }

        // Append to the last section
        const updatedSections = layout.sections.map((section, idx) => {
            if (idx !== layout.sections.length - 1) return section;
            return {
                ...section,
                fields: [...section.fields, newField],
            };
        });

        await api.layouts.update(layout.id, { ...layout, sections: updatedSections });
        return { id: layout.id, name: layout.name, action: 'updated' };
    });

    const results = await Promise.all(updates);
    console.table(results);
    return results;
}

// Example: add a 'preferredLanguage' select field to all contact layouts
await addFieldToAllLayouts('contacts', {
    name: 'preferredLanguage',
    label: 'Preferred Language',
    type: 'select',
    options: ['en', 'es', 'fr', 'de', 'pt'],
    helpText: 'Language to use in all automated messages.',
});
```

---

### Pattern 8 — Read-only layout for audit/history views

Create a fully read-only version of a layout for history, compliance, or audit views — all fields set to `readOnly: true`.

```javascript
async function createAuditLayout(objectName, sourceLayoutId) {
    const source = await api.layouts.get(objectName, sourceLayoutId);

    // Deep-clone sections; set every field to readOnly
    const readOnlySections = source.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => {
            const f = typeof field === 'string' ? { name: field } : { ...field };
            return { ...f, readOnly: true };
        }),
    }));

    const auditLayout = await api.layouts.create({
        name: `${source.name} — Audit View`,
        objectName,
        sections: readOnlySections,
    });

    console.log(`Audit layout created: ${auditLayout.id}`);
    return auditLayout;
}

await createAuditLayout('contacts', 'layout-id-123');
```

---

### Pattern 9 — Remove a deprecated field from all layouts

When you deprecate a column, sweep all layouts and remove references to it.

```javascript
async function removeFieldFromAllLayouts(objectName, fieldName) {
    const layouts = await api.layouts.get(objectName);
    const results = [];

    for (const layout of layouts) {
        let changed = false;
        const updatedSections = layout.sections.map(section => {
            const filteredFields = section.fields.filter(f => {
                const name = typeof f === 'string' ? f : f.name;
                if (name === fieldName) {
                    changed = true;
                    return false;
                }
                return true;
            });
            return { ...section, fields: filteredFields };
        });

        if (changed) {
            await api.layouts.update(layout.id, { ...layout, sections: updatedSections });
            results.push({ id: layout.id, name: layout.name, action: 'field removed' });
        } else {
            results.push({ id: layout.id, name: layout.name, action: 'not present' });
        }
    }

    console.table(results);
    return results;
}

// Remove a deprecated 'legacyAccountCode' field from all ticket layouts
await removeFieldFromAllLayouts('tickets', 'legacyAccountCode');
```

---

### Pattern 10 — Multi-tenant: provision a full layout set for a new namespace

When onboarding a new tenant, seed a standard set of layouts so their CRM looks right from day one.

```javascript
const STANDARD_LAYOUTS = [
    {
        name: 'Contact Detail',
        objectName: 'contacts',
        sections: [
            {
                label: 'Contact Info',
                columns: 2,
                fields: [
                    { name: 'firstName',   label: 'First Name',  type: 'text',  required: true  },
                    { name: 'lastName',    label: 'Last Name',   type: 'text',  required: true  },
                    { name: 'email',       label: 'Email',       type: 'email'                  },
                    { name: 'phone',       label: 'Phone',       type: 'phone'                  },
                    { name: 'company',     label: 'Company',     type: 'text'                   },
                    { name: 'title',       label: 'Job Title',   type: 'text'                   },
                ],
            },
            {
                label: 'Address',
                columns: 2,
                collapsible: true,
                collapsed: true,
                fields: [
                    { name: 'addressStreet',  label: 'Street',   type: 'text', fullWidth: true },
                    { name: 'addressCity',    label: 'City',     type: 'text'                  },
                    { name: 'addressState',   label: 'State',    type: 'text'                  },
                    { name: 'addressZip',     label: 'Zip',      type: 'text'                  },
                    { name: 'addressCountry', label: 'Country',  type: 'text'                  },
                ],
            },
        ],
    },
    {
        name: 'Support Ticket',
        objectName: 'tickets',
        sections: [
            {
                label: 'Ticket',
                columns: 2,
                fields: [
                    { name: 'subject',  label: 'Subject',   type: 'text',   required: true, fullWidth: true },
                    { name: 'priority', label: 'Priority',  type: 'select', options: ['low', 'medium', 'high', 'critical'], required: true },
                    { name: 'status',   label: 'Status',    type: 'select', options: ['new', 'open', 'pending', 'resolved', 'closed'], required: true },
                ],
            },
            {
                label: 'Description',
                columns: 1,
                fields: [
                    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
                ],
            },
        ],
    },
];

async function provisionTenantLayouts(namespace, token) {
    const tenantApi = new SDK({ namespace, token });
    const results = [];

    for (const layoutDef of STANDARD_LAYOUTS) {
        const layout = await tenantApi.layouts.create(layoutDef);
        results.push({ namespace, objectName: layoutDef.objectName, id: layout.id, name: layout.name });
    }

    console.log(`Provisioned ${results.length} layouts for ${namespace}`);
    return results;
}

await provisionTenantLayouts('new-tenant', NEW_TENANT_TOKEN);
```

---

## Error Codes

| HTTP Status | Code | Description |
|---|---|---|
| `400` | `INVALID_LAYOUT` | Layout body is missing required fields (`name`, `objectName`) |
| `400` | `INVALID_SECTION` | A section is missing `label` or `columns` |
| `400` | `UNKNOWN_FIELD` | A field name references a column that does not exist on the object |
| `404` | `LAYOUT_NOT_FOUND` | No layout found for the given ID |
| `409` | `DUPLICATE_LAYOUT_NAME` | A layout with this `name` already exists for this `objectName` |

---

## Related

- [Objects API Reference](/api-reference/objects) — create and manage object schemas
- [Record Types API Reference](/api-reference/record-types) — permission scoping for layouts
- [UOQL Reference](/api-reference/uoql) — query object data
