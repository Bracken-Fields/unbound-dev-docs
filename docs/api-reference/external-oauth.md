---
id: external-oauth
title: External OAuth
---

# External OAuth

`api.externalOAuth` — Connect and manage third-party OAuth integrations. Store OAuth credentials and configurations that can be referenced by workflows and automations.

---

## `externalOAuth.create(options)`

Register a new OAuth integration.

```javascript
const oauth = await api.externalOAuth.create({
    name: 'Salesforce CRM',
    provider: 'salesforce',
    scopes: ['read', 'write', 'offline_access'],
    credentials: {
        clientId: 'your-client-id',
        clientSecret: 'your-client-secret',
    },
    configuration: {
        instanceUrl: 'https://yourorg.salesforce.com',
    },
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Display name for this integration |
| `provider` | string | ✅ | OAuth provider identifier (e.g. `'salesforce'`, `'google'`, `'hubspot'`) |
| `scopes` | string[] | ✅ | OAuth scopes to request |
| `credentials` | object | — | Client ID/secret and other auth credentials |
| `configuration` | object | — | Provider-specific configuration (instance URL, etc.) |

---

## `externalOAuth.update(id, updates)`

```javascript
await api.externalOAuth.update('oauth-id-123', {
    name: 'Salesforce CRM (Production)',
    scopes: ['read', 'write', 'offline_access', 'api'],
    credentials: { clientSecret: 'new-secret' },
});
```

---

## `externalOAuth.get(id)`

```javascript
const oauth = await api.externalOAuth.get('oauth-id-123');
```

---

## `externalOAuth.getByName(name)`

Look up an integration by its display name.

```javascript
const oauth = await api.externalOAuth.getByName('Salesforce CRM');
```

---

## `externalOAuth.getByScopeAndProvider(scope, provider)`

Find an integration by scope and provider — useful when resolving which credentials to use for a specific operation.

```javascript
const oauth = await api.externalOAuth.getByScopeAndProvider('write', 'salesforce');
```

---

## `externalOAuth.list()`

```javascript
const integrations = await api.externalOAuth.list();
// Returns array of all registered OAuth integrations
```

---

## `externalOAuth.delete(id)`

```javascript
await api.externalOAuth.delete('oauth-id-123');
```
