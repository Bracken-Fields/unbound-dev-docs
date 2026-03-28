---
id: layouts
title: Layouts
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Layouts

`api.layouts` — UI layout definitions for CRM objects. Layouts control how fields are arranged and displayed in the Unbound interface for a given object type.

---

## `layouts.get(objectName, id?, query?)`

Fetch layouts for an object type, or a specific layout by ID.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// All layouts for contacts
const layouts = await api.layouts.get('contacts');

// Specific layout by ID
const layout = await api.layouts.get('contacts', 'layout-id-123');
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
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$layouts = json_decode(curl_exec($ch), true);
curl_close($ch);

// Specific layout by ID
$ch = curl_init('https://{namespace}.api.unbound.cx/layouts/contacts/layout-id-123');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
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

---

## `layouts.create(layout)`

Create a new layout definition.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const layout = await api.layouts.create({
    name: 'Contact Detail',
    objectName: 'contacts',
    sections: [
        {
            label: 'Basic Info',
            columns: 2,
            fields: ['firstName', 'lastName', 'email', 'phone'],
        },
        {
            label: 'Company',
            columns: 1,
            fields: ['company', 'title', 'department'],
        },
    ],
});
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
        name: 'Contact Detail',
        objectName: 'contacts',
        sections: [
            {
                label: 'Basic Info',
                columns: 2,
                fields: ['firstName', 'lastName', 'email', 'phone'],
            },
            {
                label: 'Company',
                columns: 1,
                fields: ['company', 'title', 'department'],
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
    'name' => 'Contact Detail',
    'objectName' => 'contacts',
    'sections' => [
        [
            'label' => 'Basic Info',
            'columns' => 2,
            'fields' => ['firstName', 'lastName', 'email', 'phone'],
        ],
        [
            'label' => 'Company',
            'columns' => 1,
            'fields' => ['company', 'title', 'department'],
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
        'name': 'Contact Detail',
        'objectName': 'contacts',
        'sections': [
            {
                'label': 'Basic Info',
                'columns': 2,
                'fields': ['firstName', 'lastName', 'email', 'phone'],
            },
            {
                'label': 'Company',
                'columns': 1,
                'fields': ['company', 'title', 'department'],
            },
        ],
    }
)
layout = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "Contact Detail",
  "objectName": "contacts",
  "sections": [
    {
      "label": "Basic Info",
      "columns": 2,
      "fields": ["firstName", "lastName", "email", "phone"]
    },
    {
      "label": "Company",
      "columns": 1,
      "fields": ["company", "title", "department"]
    }
  ]
}
EOF
)

curl -X POST https://{namespace}.api.unbound.cx/layouts \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

## `layouts.update(id, layout)`

Update an existing layout.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.layouts.update('layout-id-123', {
    sections: [
        {
            label: 'Contact Info',
            columns: 2,
            fields: ['firstName', 'lastName', 'email', 'phone', 'mobile'],
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
DATA=$(cat <<'EOF'
{
  "sections": [
    {
      "label": "Contact Info",
      "columns": 2,
      "fields": ["firstName", "lastName", "email", "phone", "mobile"]
    }
  ]
}
EOF
)

curl -X PUT https://{namespace}.api.unbound.cx/layouts/layout-id-123 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

## `layouts.delete(id)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.layouts.delete('layout-id-123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch('https://{namespace}.api.unbound.cx/layouts/layout-id-123', {
    method: 'DELETE',
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/layouts/layout-id-123');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
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

Search for values to populate dynamic select fields in a layout.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const results = await api.layouts.dynamicSelectSearch({
    objectName: 'companies',
    field: 'name',
    search: 'Acme',
    limit: 10,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/layouts/dynamic-select-search', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        objectName: 'companies',
        field: 'name',
        search: 'Acme',
        limit: 10,
    }),
});
const results = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/layouts/dynamic-select-search');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'objectName' => 'companies',
    'field' => 'name',
    'search' => 'Acme',
    'limit' => 10,
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$results = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/layouts/dynamic-select-search',
    headers={'Authorization': 'Bearer {token}'},
    json={
        'objectName': 'companies',
        'field': 'name',
        'search': 'Acme',
        'limit': 10,
    }
)
results = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "objectName": "companies",
  "field": "name",
  "search": "Acme",
  "limit": 10
}
EOF
)

curl -X POST https://{namespace}.api.unbound.cx/layouts/dynamic-select-search \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

## Response Shapes

### Layout Object

```json
{
    "id": "layout-id-123",
    "name": "Contact Detail",
    "objectName": "contacts",
    "sections": [
        {
            "label": "Basic Info",
            "columns": 2,
            "fields": ["firstName", "lastName", "email", "phone"]
        },
        {
            "label": "Company",
            "columns": 1,
            "fields": ["company", "title", "department"]
        }
    ],
    "createdAt": "2024-03-15T10:00:00.000Z",
    "updatedAt": "2024-03-15T10:00:00.000Z"
}
```

### `layouts.get()` — list response

```json
[
    {
        "id": "layout-id-123",
        "name": "Contact Detail",
        "objectName": "contacts",
        "sections": [ "..." ]
    },
    {
        "id": "layout-id-456",
        "name": "Contact List",
        "objectName": "contacts",
        "sections": [ "..." ]
    }
]
```

### `layouts.dynamicSelectSearch()` — response

```json
{
    "results": [
        { "id": "company-001", "label": "Acme Corp", "value": "Acme Corp" },
        { "id": "company-002", "label": "Acme Systems", "value": "Acme Systems" }
    ],
    "total": 2
}
```

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

    // 3. Create a detail layout
    const detailLayout = await api.layouts.create({
        name: `${objectName} Detail`,
        objectName,
        sections: [
            {
                label: 'Details',
                columns: 2,
                fields: fields.map(f => f.name),
            },
        ],
    });

    // 4. Create a compact list layout (key fields only)
    const listLayout = await api.layouts.create({
        name: `${objectName} List`,
        objectName,
        sections: [
            {
                label: 'Summary',
                columns: 1,
                fields: fields.slice(0, 3).map(f => f.name),
            },
        ],
    });

    return { detailLayout, listLayout };
}

await bootstrapObject('orders', [
    { name: 'orderId', type: 'string' },
    { name: 'customerId', type: 'string' },
    { name: 'amount', type: 'number' },
    { name: 'status', type: 'string' },
]);
```

---

### Pattern 2 — Clone a layout

Copy an existing layout, rename it, and save as a new variant.

```javascript
async function cloneLayout(sourceId, newName) {
    // 1. Fetch the existing layout
    const [source] = await api.layouts.get(null, sourceId);

    // 2. Strip the id and timestamps, apply new name
    const { id, createdAt, updatedAt, ...rest } = source;
    const cloned = await api.layouts.create({
        ...rest,
        name: newName,
    });

    console.log(`Cloned '${source.name}' → '${cloned.name}' (${cloned.id})`);
    return cloned;
}

await cloneLayout('layout-id-123', 'Contact Detail — EMEA');
```

---

### Pattern 3 — Role-based layout selection

Different roles (agent vs. supervisor) may need different field arrangements. Retrieve the right layout at runtime based on the current user's role.

```javascript
async function getLayoutForRole(objectName, role) {
    const all = await api.layouts.get(objectName);

    // Convention: layout names include the role suffix
    const match = all.find(l =>
        l.name.toLowerCase().includes(role.toLowerCase())
    );

    // Fall back to the first available layout
    return match ?? all[0] ?? null;
}

// In your UI rendering code
const userRole = currentUser.role; // 'agent' | 'supervisor' | 'admin'
const layout = await getLayoutForRole('contacts', userRole);

if (layout) {
    renderContactForm(contactData, layout.sections);
}
```

---

### Pattern 4 — Typeahead dynamic select

Drive an autocomplete input from `dynamicSelectSearch` as the user types.

```javascript
// Debounced typeahead handler
let debounceTimer;

function onSearchInput(inputValue) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        if (inputValue.length < 2) return;

        const { results } = await api.layouts.dynamicSelectSearch({
            objectName: 'companies',
            field: 'name',
            search: inputValue,
            limit: 10,
        });

        // Render the dropdown
        renderDropdown(results.map(r => ({
            label: r.label,
            value: r.id,
        })));
    }, 250);
}

// Attach to your input element
document.getElementById('company-input')
    .addEventListener('input', e => onSearchInput(e.target.value));
```

---

### Pattern 5 — Sync layouts across environments

Export all layouts from staging, then import them to production.

```javascript
async function exportLayouts(objectName) {
    const layouts = await api.layouts.get(objectName);
    return layouts.map(({ id, createdAt, updatedAt, ...rest }) => rest);
}

async function importLayouts(layoutDefinitions) {
    const results = [];
    for (const def of layoutDefinitions) {
        // Check if a layout with this name already exists
        const existing = await api.layouts.get(def.objectName);
        const match = existing.find(l => l.name === def.name);

        if (match) {
            // Update in-place
            const updated = await api.layouts.update(match.id, def);
            results.push({ action: 'updated', id: match.id, name: def.name });
        } else {
            // Create fresh
            const created = await api.layouts.create(def);
            results.push({ action: 'created', id: created.id, name: def.name });
        }
    }
    return results;
}

// Export from staging
const stagingLayouts = await exportLayouts('contacts');
const json = JSON.stringify(stagingLayouts, null, 4);
// Write json to a file, commit to git, transfer to prod...

// Import to production (in prod environment)
const importResults = await importLayouts(JSON.parse(json));
console.table(importResults);
```
