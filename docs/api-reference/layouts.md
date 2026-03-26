---
id: layouts
title: Layouts
---

# Layouts

`api.layouts` — UI layout definitions for CRM objects. Layouts control how fields are arranged and displayed in the Unbound interface for a given object type.

---

## `layouts.get(objectName, id?, query?)`

Fetch layouts for an object type, or a specific layout by ID.

```javascript
// All layouts for contacts
const layouts = await api.layouts.get('contacts');

// Specific layout by ID
const layout = await api.layouts.get('contacts', 'layout-id-123');
```

---

## `layouts.create(layout)`

Create a new layout definition.

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

---

## `layouts.update(id, layout)`

Update an existing layout.

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

---

## `layouts.delete(id)`

```javascript
await api.layouts.delete('layout-id-123');
```

---

## `layouts.dynamicSelectSearch(query)`

Search for values to populate dynamic select fields in a layout — used to resolve relationship fields at render time.

```javascript
const results = await api.layouts.dynamicSelectSearch({
    objectName: 'companies',
    field: 'name',
    search: 'Acme',
    limit: 10,
});
```
