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
| `provider` | string | ✅ | OAuth provider identifier |
| `scopes` | string[] | ✅ | OAuth scopes to request |
| `credentials` | object | — | Client ID/secret and other auth credentials |
| `configuration` | object | — | Provider-specific configuration |

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
