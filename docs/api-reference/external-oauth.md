---
id: external-oauth
title: External OAuth
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# External OAuth

`api.externalOAuth` — Connect and manage third-party OAuth integrations. Store OAuth credentials and configurations that can be referenced by workflows and automations.

---

## `externalOAuth.create(options)`

Register a new OAuth integration.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/external-oauth', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
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
    }),
});
const oauth = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/external-oauth');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'name' => 'Salesforce CRM',
    'provider' => 'salesforce',
    'scopes' => ['read', 'write', 'offline_access'],
    'credentials' => [
        'clientId' => 'your-client-id',
        'clientSecret' => 'your-client-secret',
    ],
    'configuration' => [
        'instanceUrl' => 'https://yourorg.salesforce.com',
    ],
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$oauth = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/external-oauth',
    headers={'Authorization': 'Bearer {token}'},
    json={
        'name': 'Salesforce CRM',
        'provider': 'salesforce',
        'scopes': ['read', 'write', 'offline_access'],
        'credentials': {
            'clientId': 'your-client-id',
            'clientSecret': 'your-client-secret',
        },
        'configuration': {
            'instanceUrl': 'https://yourorg.salesforce.com',
        },
    }
)
oauth = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "Salesforce CRM",
  "provider": "salesforce",
  "scopes": ["read", "write", "offline_access"],
  "credentials": {
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret"
  },
  "configuration": {
    "instanceUrl": "https://yourorg.salesforce.com"
  }
}
EOF
)

curl -X POST https://{namespace}.api.unbound.cx/external-oauth \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Display name for this integration |
| `provider` | string | ✅ | OAuth provider identifier (e.g. `'salesforce'`, `'hubspot'`, `'google'`) |
| `scopes` | string[] | ✅ | OAuth scopes to request |
| `credentials` | object | — | Client ID/secret and other auth credentials (stored encrypted) |
| `configuration` | object | — | Provider-specific configuration (e.g. instance URL, tenant ID) |

**Response**

```javascript
// {
//   id: 'oauth-abc123',
//   name: 'Salesforce CRM',
//   provider: 'salesforce',
//   scopes: ['read', 'write', 'offline_access'],
//   configuration: {
//     instanceUrl: 'https://yourorg.salesforce.com',
//   },
//   // credentials are NOT returned after creation (write-only)
//   createdAt: '2024-06-01T10:00:00.000Z',
//   updatedAt: '2024-06-01T10:00:00.000Z',
// }
```

:::caution
`credentials` (client secret, tokens) are **write-only** — they are stored encrypted and never returned in responses. Store them securely before submitting.
:::

---

## `externalOAuth.update(id, updates)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.externalOAuth.update('oauth-id-123', {
    name: 'Salesforce CRM (Production)',
    scopes: ['read', 'write', 'offline_access', 'api'],
    credentials: { clientSecret: 'new-secret' },
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch('https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123', {
    method: 'PUT',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: 'Salesforce CRM (Production)',
        scopes: ['read', 'write', 'offline_access', 'api'],
        credentials: { clientSecret: 'new-secret' },
    }),
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'name' => 'Salesforce CRM (Production)',
    'scopes' => ['read', 'write', 'offline_access', 'api'],
    'credentials' => ['clientSecret' => 'new-secret'],
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
    'https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123',
    headers={'Authorization': 'Bearer {token}'},
    json={
        'name': 'Salesforce CRM (Production)',
        'scopes': ['read', 'write', 'offline_access', 'api'],
        'credentials': {'clientSecret': 'new-secret'},
    }
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "Salesforce CRM (Production)",
  "scopes": ["read", "write", "offline_access", "api"],
  "credentials": {"clientSecret": "new-secret"}
}
EOF
)

curl -X PUT https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Description |
|---|---|---|
| `name` | string | New display name |
| `scopes` | string[] | Replacement scope list (replaces existing, not merged) |
| `credentials` | object | Updated credentials — pass only changed fields |
| `configuration` | object | Updated provider configuration |

**Response** — updated integration object (same shape as `create`, credentials omitted).

---

## `externalOAuth.get(id)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const oauth = await api.externalOAuth.get('oauth-id-123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const oauth = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$oauth = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123',
    headers={'Authorization': 'Bearer {token}'}
)
oauth = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123 \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Response**

```javascript
// {
//   id: 'oauth-abc123',
//   name: 'Salesforce CRM',
//   provider: 'salesforce',
//   scopes: ['read', 'write', 'offline_access'],
//   configuration: {
//     instanceUrl: 'https://yourorg.salesforce.com',
//   },
//   createdAt: '2024-06-01T10:00:00.000Z',
//   updatedAt: '2024-06-01T10:00:00.000Z',
// }
```

---

## `externalOAuth.getByName(name)`

Look up an integration by its display name.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const oauth = await api.externalOAuth.getByName('Salesforce CRM');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/external-oauth/by-name/Salesforce%20CRM', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const oauth = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/external-oauth/by-name/' . urlencode('Salesforce CRM'));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$oauth = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from urllib.parse import quote

response = requests.get(
    f'https://{{namespace}}.api.unbound.cx/external-oauth/by-name/{quote("Salesforce CRM")}',
    headers={'Authorization': 'Bearer {token}'}
)
oauth = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl https://{namespace}.api.unbound.cx/external-oauth/by-name/Salesforce%20CRM \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

Useful when you know the human-readable name but not the UUID — for example in workflow logic or bootstrap scripts.

**Response** — same object shape as `get(id)`. Throws `404` if no integration has that exact name.

---

## `externalOAuth.getByScopeAndProvider(scope, provider)`

Find an integration by scope and provider.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const oauth = await api.externalOAuth.getByScopeAndProvider('write', 'salesforce');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/external-oauth/by-scope/write/provider/salesforce', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const oauth = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/external-oauth/by-scope/write/provider/salesforce');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$oauth = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/external-oauth/by-scope/write/provider/salesforce',
    headers={'Authorization': 'Bearer {token}'}
)
oauth = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl https://{namespace}.api.unbound.cx/external-oauth/by-scope/write/provider/salesforce \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

Look up the integration that has a given scope for a given provider. Useful when a workflow or automation needs to resolve which credential to use at runtime without hardcoding an ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `scope` | string | ✅ | A single scope string (e.g. `'write'`, `'api'`) |
| `provider` | string | ✅ | Provider identifier (e.g. `'salesforce'`, `'hubspot'`) |

**Response** — same object shape as `get(id)`. Returns the first match if multiple integrations exist for the same scope+provider combination.

---

## `externalOAuth.list()`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const integrations = await api.externalOAuth.list();
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/external-oauth', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const integrations = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/external-oauth');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$integrations = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/external-oauth',
    headers={'Authorization': 'Bearer {token}'}
)
integrations = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl https://{namespace}.api.unbound.cx/external-oauth \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Response**

```javascript
// [
//   {
//     id: 'oauth-abc123',
//     name: 'Salesforce CRM',
//     provider: 'salesforce',
//     scopes: ['read', 'write', 'offline_access'],
//     configuration: { instanceUrl: 'https://yourorg.salesforce.com' },
//     createdAt: '2024-06-01T10:00:00.000Z',
//     updatedAt: '2024-06-01T10:00:00.000Z',
//   },
//   {
//     id: 'oauth-def456',
//     name: 'HubSpot Marketing',
//     provider: 'hubspot',
//     scopes: ['contacts', 'crm.objects.contacts.read'],
//     configuration: {},
//     createdAt: '2024-05-15T08:30:00.000Z',
//     updatedAt: '2024-05-20T12:00:00.000Z',
//   },
// ]
```

Returns all registered integrations for the account. Credentials are never included.

---

## `externalOAuth.delete(id)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.externalOAuth.delete('oauth-id-123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch('https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123', {
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
$ch = curl_init('https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123');
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
    'https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123',
    headers={'Authorization': 'Bearer {token}'}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE https://{namespace}.api.unbound.cx/external-oauth/oauth-id-123 \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

:::caution
Deleting an OAuth integration that is actively referenced by a workflow or automation will cause those steps to fail. Audit usages with `list()` and update workflows before deleting.
:::

**Response** — `{ success: true }` on success. Throws `404` if the integration does not exist.

---

## Common Patterns

### Bootstrap: Register All CRM Integrations on Setup

```javascript
async function bootstrapOAuthIntegrations() {
    const existing = await api.externalOAuth.list();
    const existingNames = new Set(existing.map(o => o.name));

    const integrations = [
        {
            name: 'Salesforce CRM',
            provider: 'salesforce',
            scopes: ['read', 'write', 'offline_access', 'api'],
            credentials: {
                clientId: process.env.SF_CLIENT_ID,
                clientSecret: process.env.SF_CLIENT_SECRET,
            },
            configuration: {
                instanceUrl: process.env.SF_INSTANCE_URL,
            },
        },
        {
            name: 'HubSpot Marketing',
            provider: 'hubspot',
            scopes: ['contacts', 'crm.objects.contacts.read', 'crm.objects.deals.read'],
            credentials: {
                clientId: process.env.HS_CLIENT_ID,
                clientSecret: process.env.HS_CLIENT_SECRET,
            },
        },
    ];

    for (const integration of integrations) {
        if (!existingNames.has(integration.name)) {
            const result = await api.externalOAuth.create(integration);
            console.log(`Created: ${result.name} (${result.id})`);
        } else {
            console.log(`Skipped (exists): ${integration.name}`);
        }
    }
}
```

---

### Rotate a Client Secret

```javascript
async function rotateClientSecret(integrationName, newSecret) {
    // Look up by name — no need to hardcode the ID
    const oauth = await api.externalOAuth.getByName(integrationName);

    await api.externalOAuth.update(oauth.id, {
        credentials: {
            clientSecret: newSecret,
        },
    });

    console.log(`Secret rotated for: ${oauth.name}`);
}

// Usage
await rotateClientSecret('Salesforce CRM', process.env.SF_NEW_CLIENT_SECRET);
```

---

### Resolve Integration at Runtime in a Workflow

```javascript
// Called from within a workflow action that needs to call Salesforce
async function getSalesforceCredentialId() {
    // Instead of hardcoding an ID, look up by scope+provider
    const oauth = await api.externalOAuth.getByScopeAndProvider('write', 'salesforce');
    return oauth.id;
}

// Then reference the ID in your workflow step config
const credentialId = await getSalesforceCredentialId();
const workflow = await api.workflows.create({
    name: 'Sync Contact to Salesforce',
    steps: [
        {
            type: 'httpRequest',
            config: {
                url: 'https://yourorg.salesforce.com/services/data/v58.0/sobjects/Contact',
                method: 'POST',
                oauthId: credentialId,
            },
        },
    ],
});
```

---

### Audit: List All Active OAuth Integrations

```javascript
async function auditOAuthIntegrations() {
    const integrations = await api.externalOAuth.list();

    console.table(
        integrations.map(o => ({
            id: o.id,
            name: o.name,
            provider: o.provider,
            scopes: o.scopes.join(', '),
            created: new Date(o.createdAt).toLocaleDateString(),
            lastUpdated: new Date(o.updatedAt).toLocaleDateString(),
        }))
    );

    return integrations;
}
```

---

### Decommission: Safe Delete with Dependency Check

```javascript
async function safeDeleteIntegration(integrationId) {
    // First check the integration exists
    let integration;
    try {
        integration = await api.externalOAuth.get(integrationId);
    } catch (err) {
        console.log('Integration not found — nothing to delete');
        return;
    }

    // List all workflows and check for references before deleting
    // (adapt to your platform's workflow listing API)
    const workflows = await api.workflows.list();
    const dependents = workflows.filter(w =>
        JSON.stringify(w).includes(integrationId)
    );

    if (dependents.length > 0) {
        console.warn(
            `Cannot delete "${integration.name}" — referenced by ${dependents.length} workflow(s):`,
            dependents.map(w => w.name).join(', ')
        );
        return;
    }

    await api.externalOAuth.delete(integrationId);
    console.log(`Deleted: ${integration.name}`);
}
```

---

### Multi-Tenant: Scope Integrations Per Namespace

```javascript
// If you manage multiple namespaces/tenants, bootstrap each with its own credentials
async function provisionTenantIntegrations(tenantConfig) {
    const { namespace, salesforceClientId, salesforceClientSecret, salesforceUrl } = tenantConfig;

    // Create SDK scoped to this tenant
    const tenantApi = new SDK({ namespace, token: tenantConfig.adminToken });

    const existing = await tenantApi.externalOAuth.list();
    const hasSalesforce = existing.some(o => o.provider === 'salesforce');

    if (!hasSalesforce) {
        await tenantApi.externalOAuth.create({
            name: 'Salesforce CRM',
            provider: 'salesforce',
            scopes: ['read', 'write', 'offline_access', 'api'],
            credentials: {
                clientId: salesforceClientId,
                clientSecret: salesforceClientSecret,
            },
            configuration: {
                instanceUrl: salesforceUrl,
            },
        });
        console.log(`[${namespace}] Salesforce integration provisioned`);
    }
}
```
