---
id: portals
title: Portals
---

# Portals

`api.portals` — Create and manage branded customer portals hosted on custom domains.

---

## `portals.create(options)`

```javascript
const portal = await api.portals.create({
  name: 'Customer Support Portal',
  domain: 'support.yourcompany.com',
  isPublic: true,
  settings: {
    theme: 'dark',
    primaryColor: '#1D949A',
  },
  customCss: '/* custom styles */',
  customJs: '/* custom scripts */',
  logo: 'storage-id-for-logo',
  favicon: 'storage-id-for-favicon',
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Portal display name |
| `domain` | string | ✅ | Custom domain for this portal |
| `isPublic` | boolean | — | Allow unauthenticated access |
| `settings` | object | — | Portal configuration (theme, colors, etc.) |
| `customCss` | string | — | Custom CSS injected into portal |
| `customJs` | string | — | Custom JS injected into portal |
| `logo` | string | — | Storage ID for logo image |
| `favicon` | string | — | Storage ID for favicon |

---

## `portals.get(portalId)` / `portals.list()`

```javascript
const portal = await api.portals.get('portal-id');
const portals = await api.portals.list();
```

---

## `portals.getPublic(domain)`

Fetch a portal by domain without authentication — for public portal pages.

```javascript
const portal = await api.portals.getPublic('support.yourcompany.com');
```

---

## `portals.update(portalId, updates)`

```javascript
await api.portals.update('portal-id', {
  name: 'Renamed Portal',
  settings: { primaryColor: '#FF6600' },
  isPublic: false,
});
```

---

## `portals.verifyDns(portalId)`

Verify the portal's custom domain DNS is configured correctly.

```javascript
const result = await api.portals.verifyDns('portal-id');
// result.verified → true/false
// result.records → DNS record statuses
```

---

## `portals.delete(portalId)`

```javascript
await api.portals.delete('portal-id');
```
