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
