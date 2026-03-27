---
id: portals
title: Portals
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Portals

`api.portals` — Create and manage branded customer portals hosted on custom domains.

---

## `portals.create(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/portal", {
    method: "POST",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name: "Customer Support Portal",
        domain: "support.yourcompany.com",
        isPublic: true,
        settings: {
            theme: "dark",
            primaryColor: "#1D949A",
        },
        customCss: "/* custom styles */",
        customJs: "/* custom scripts */",
        logo: "storage-id-for-logo",
        favicon: "storage-id-for-favicon",
    }),
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/portal");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}",
    "Content-Type: application/json",
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "Customer Support Portal",
    "domain" => "support.yourcompany.com",
    "isPublic" => true,
    "settings" => [
        "theme" => "dark",
        "primaryColor" => "#1D949A",
    ],
    "customCss" => "/* custom styles */",
    "customJs" => "/* custom scripts */",
    "logo" => "storage-id-for-logo",
    "favicon" => "storage-id-for-favicon",
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/portal",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "Customer Support Portal",
        "domain": "support.yourcompany.com",
        "isPublic": True,
        "settings": {
            "theme": "dark",
            "primaryColor": "#1D949A",
        },
        "customCss": "/* custom styles */",
        "customJs": "/* custom scripts */",
        "logo": "storage-id-for-logo",
        "favicon": "storage-id-for-favicon",
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "Customer Support Portal",
  "domain": "support.yourcompany.com",
  "isPublic": true,
  "settings": {
    "theme": "dark",
    "primaryColor": "#1D949A"
  },
  "customCss": "/* custom styles */",
  "customJs": "/* custom scripts */",
  "logo": "storage-id-for-logo",
  "favicon": "storage-id-for-favicon"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/portal" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Get a single portal by ID
const portal = await api.portals.get('portal-id');

// List all portals
const portals = await api.portals.list();
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get a single portal by ID
const res = await fetch("https://{namespace}.api.unbound.cx/portal/{id}", {
    method: "GET",
    headers: { "Authorization": "Bearer {token}" },
});
const portal = await res.json();

// List all portals
const res = await fetch("https://{namespace}.api.unbound.cx/portal", {
    method: "GET",
    headers: { "Authorization": "Bearer {token}" },
});
const portals = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get a single portal by ID
$ch = curl_init("https://{namespace}.api.unbound.cx/portal/{id}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$portal = json_decode(curl_exec($ch), true);
curl_close($ch);

// List all portals
$ch = curl_init("https://{namespace}.api.unbound.cx/portal");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$portals = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Get a single portal by ID
response = requests.get(
    "https://{namespace}.api.unbound.cx/portal/{id}",
    headers={"Authorization": "Bearer {token}"}
)
portal = response.json()

# List all portals
response = requests.get(
    "https://{namespace}.api.unbound.cx/portal",
    headers={"Authorization": "Bearer {token}"}
)
portals = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get a single portal by ID
curl -X GET "https://{namespace}.api.unbound.cx/portal/{id}" \
  -H "Authorization: Bearer {token}"

# List all portals
curl -X GET "https://{namespace}.api.unbound.cx/portal" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `portals.getPublic(domain)`

Fetch a portal by domain without authentication — for public portal pages.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const portal = await api.portals.getPublic('support.yourcompany.com');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/portal/public/support.yourcompany.com", {
    method: "GET",
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/portal/public/support.yourcompany.com");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/portal/public/support.yourcompany.com"
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/portal/public/support.yourcompany.com"
```

</TabItem>
</Tabs>

---

## `portals.update(portalId, updates)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.portals.update('portal-id', {
    name: 'Renamed Portal',
    settings: { primaryColor: '#FF6600' },
    isPublic: false,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/portal/{id}", {
    method: "PUT",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name: "Renamed Portal",
        settings: { primaryColor: "#FF6600" },
        isPublic: false,
    }),
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/portal/{id}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}",
    "Content-Type: application/json",
]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "Renamed Portal",
    "settings" => ["primaryColor" => "#FF6600"],
    "isPublic" => false,
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.put(
    "https://{namespace}.api.unbound.cx/portal/{id}",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "Renamed Portal",
        "settings": {"primaryColor": "#FF6600"},
        "isPublic": False,
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "Renamed Portal",
  "settings": {"primaryColor": "#FF6600"},
  "isPublic": false
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/portal/{id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

## `portals.verifyDns(portalId)`

Verify the portal's custom domain DNS is configured correctly.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.portals.verifyDns('portal-id');
// result.verified → true/false
// result.records → DNS record statuses
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/portal/{id}/verify-dns", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}" },
});
const data = await res.json();
// data.verified → true/false
// data.records → DNS record statuses
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/portal/{id}/verify-dns");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
// $response['verified'] → true/false
// $response['records'] → DNS record statuses
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/portal/{id}/verify-dns",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
# data['verified'] → True/False
# data['records'] → DNS record statuses
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/portal/{id}/verify-dns" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `portals.delete(portalId)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.portals.delete('portal-id');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/portal/{id}", {
    method: "DELETE",
    headers: { "Authorization": "Bearer {token}" },
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/portal/{id}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

requests.delete(
    "https://{namespace}.api.unbound.cx/portal/{id}",
    headers={"Authorization": "Bearer {token}"}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/portal/{id}" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>
