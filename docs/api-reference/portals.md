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

**Response shape:**

```javascript
{
    id: 'portal_abc123',
    name: 'Customer Support Portal',
    domain: 'support.yourcompany.com',
    isPublic: true,
    status: 'active',             // 'active' | 'pending' | 'dns_error'
    settings: {
        theme: 'dark',
        primaryColor: '#1D949A',
    },
    customCss: '/* custom styles */',
    customJs: '/* custom scripts */',
    logo: 'storage-id-for-logo',
    favicon: 'storage-id-for-favicon',
    dnsVerified: false,           // true once DNS verification passes
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
    namespace: 'acme',
}
```

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

**Response shape:**

```javascript
// portals.get() — single portal object (same shape as create response above)

// portals.list() — array of portal objects
[
    {
        id: 'portal_abc123',
        name: 'Customer Support Portal',
        domain: 'support.yourcompany.com',
        isPublic: true,
        status: 'active',
        dnsVerified: true,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-20T14:00:00.000Z',
    },
    // ...
]
```

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

**Response shape:**

```javascript
// Returns only publicly safe fields (no customJs, no internal settings)
{
    id: 'portal_abc123',
    name: 'Customer Support Portal',
    domain: 'support.yourcompany.com',
    isPublic: true,
    settings: {
        theme: 'dark',
        primaryColor: '#1D949A',
    },
    logo: 'storage-id-for-logo',
    favicon: 'storage-id-for-favicon',
}
```

:::note
`getPublic()` does not require an `Authorization` header — it is safe to call from unauthenticated browser pages.
:::

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

**Response shape:**

```javascript
// Returns the full updated portal object (same shape as create response)
{
    id: 'portal_abc123',
    name: 'Renamed Portal',
    domain: 'support.yourcompany.com',
    isPublic: false,
    settings: { primaryColor: '#FF6600' },
    dnsVerified: true,
    updatedAt: '2024-02-01T09:00:00.000Z',
    // ...all other portal fields
}
```

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

**Response shape:**

```javascript
{
    verified: true,
    portalId: 'portal_abc123',
    domain: 'support.yourcompany.com',
    records: [
        {
            type: 'CNAME',
            name: 'support.yourcompany.com',
            expected: 'portals.unbound.cx',
            actual: 'portals.unbound.cx',
            status: 'verified',   // 'verified' | 'pending' | 'mismatch' | 'missing'
        },
    ],
    checkedAt: '2024-02-01T09:15:00.000Z',
}
```

:::tip DNS Setup
Point your domain's CNAME record to `portals.unbound.cx`. DNS propagation typically takes 2–15 minutes. Call `verifyDns()` in a loop until `verified: true`.
:::

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

---

## Common Patterns

### Pattern 1 — Create portal and wait for DNS verification

Create a portal, then poll until DNS propagates and the portal goes live.

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });

async function createAndVerifyPortal() {
    // 1. Create portal
    const portal = await api.portals.create({
        name: 'Customer Self-Service',
        domain: 'self-service.acme.com',
        isPublic: true,
        settings: {
            theme: 'light',
            primaryColor: '#0070f3',
        },
    });

    console.log(`Portal created: ${portal.id}`);
    console.log('Now add a CNAME record:');
    console.log(`  ${portal.domain}  →  portals.unbound.cx`);

    // 2. Poll for DNS verification (up to 10 minutes)
    const maxAttempts = 20;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`Checking DNS... attempt ${attempt}/${maxAttempts}`);

        const result = await api.portals.verifyDns(portal.id);

        if (result.verified) {
            console.log('✅ DNS verified — portal is live!');
            return portal;
        }

        // Log which records are still pending
        const pending = result.records.filter(r => r.status !== 'verified');
        console.log('Still pending:', pending.map(r => `${r.type} ${r.name}`));

        if (attempt < maxAttempts) {
            // Wait 30 seconds before retrying
            await new Promise(r => setTimeout(r, 30_000));
        }
    }

    throw new Error('DNS verification timed out after 10 minutes');
}

await createAndVerifyPortal();
```

---

### Pattern 2 — Branded portal per tenant (multi-tenant SaaS)

For SaaS platforms, each customer gets their own branded portal at their own subdomain.

```javascript
async function provisionTenantPortal(tenant) {
    const { id: tenantId, slug, domain, primaryColor, logoStorageId } = tenant;

    // Check if portal already exists for this tenant
    const allPortals = await api.portals.list();
    const existing = allPortals.find(p => p.name === `Portal — ${slug}`);

    if (existing) {
        console.log(`Portal already exists for ${slug}: ${existing.id}`);
        return existing;
    }

    // Create portal for this tenant
    const portal = await api.portals.create({
        name: `Portal — ${slug}`,
        domain: domain || `${slug}.support.mysaas.com`,
        isPublic: false,    // Require login
        settings: {
            theme: 'light',
            primaryColor: primaryColor || '#1D949A',
        },
        logo: logoStorageId,
    });

    // Inject custom branding CSS
    await api.portals.update(portal.id, {
        customCss: `
            :root {
                --brand-color: ${primaryColor};
            }
            .portal-header {
                background-color: var(--brand-color);
            }
        `,
    });

    console.log(`Provisioned portal for tenant ${slug}: ${portal.id}`);
    return portal;
}

// Run for all tenants
const tenants = await getTenantsFromDatabase();
for (const tenant of tenants) {
    await provisionTenantPortal(tenant);
}
```

---

### Pattern 3 — Portal health dashboard (monitor DNS + status)

Periodically check all portals and alert on any DNS failures.

```javascript
async function checkPortalHealth() {
    const portals = await api.portals.list();
    const issues = [];

    for (const portal of portals) {
        if (!portal.dnsVerified) {
            // Re-verify
            const check = await api.portals.verifyDns(portal.id);

            if (!check.verified) {
                const badRecords = check.records.filter(r => r.status !== 'verified');
                issues.push({
                    portalId: portal.id,
                    name: portal.name,
                    domain: portal.domain,
                    problems: badRecords.map(r => ({
                        record: `${r.type} ${r.name}`,
                        expected: r.expected,
                        actual: r.actual || 'NOT FOUND',
                    })),
                });
            }
        }
    }

    if (issues.length > 0) {
        console.error(`⚠️  ${issues.length} portal(s) have DNS issues:`);
        for (const issue of issues) {
            console.error(`\n  ${issue.name} (${issue.domain})`);
            for (const p of issue.problems) {
                console.error(`    ${p.record}: expected ${p.expected}, got ${p.actual}`);
            }
        }
    } else {
        console.log(`✅ All ${portals.length} portals are healthy`);
    }

    return issues;
}

await checkPortalHealth();
```

---

### Pattern 4 — Toggle portal visibility (maintenance mode)

Quickly take a portal private (maintenance mode) and re-enable it when done.

```javascript
async function setMaintenanceMode(portalId, enabled) {
    await api.portals.update(portalId, {
        isPublic: !enabled,
        customCss: enabled
            ? `
                body::before {
                    content: 'Scheduled maintenance in progress. Back soon!';
                    display: block;
                    background: #ff9800;
                    color: white;
                    text-align: center;
                    padding: 12px;
                    font-weight: bold;
                }
              `
            : '',
    });

    console.log(`Portal ${portalId} maintenance mode: ${enabled ? 'ON' : 'OFF'}`);
}

// Take portal offline at midnight
await setMaintenanceMode('portal_abc123', true);

// ... do maintenance work ...

// Re-enable portal
await setMaintenanceMode('portal_abc123', false);
```

---

### Pattern 5 — Fetch public portal config for unauthenticated frontend

Load portal settings from the browser without exposing credentials — ideal for login pages and embedded widgets.

```javascript
// This runs in the browser with NO auth token
async function loadPortalBranding() {
    const hostname = window.location.hostname;  // e.g. 'support.acme.com'

    // getPublic() requires no Authorization header
    const response = await fetch(
        `https://login.api.unbound.cx/portals/public?domain=${hostname}`
    );
    const portal = await response.json();

    if (portal?.settings?.primaryColor) {
        document.documentElement.style.setProperty(
            '--primary-color',
            portal.settings.primaryColor
        );
    }

    if (portal?.logo) {
        const logoImg = document.querySelector('#portal-logo');
        if (logoImg) {
            logoImg.src = `/api/storage/${portal.logo}`;
        }
    }

    return portal;
}

document.addEventListener('DOMContentLoaded', loadPortalBranding);
```
