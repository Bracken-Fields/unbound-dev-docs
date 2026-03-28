---
id: sip-endpoints
title: SIP Endpoints
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# SIP Endpoints

`api.sipEndpoints` — Manage SIP devices and WebRTC endpoints for users. Supports both WebRTC (browser-based) and IP phone endpoints.

---

## `sipEndpoints.create(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// WebRTC endpoint (browser-based)
const endpoint = await api.sipEndpoints.create({
    type: 'webRtc',
    name: 'Jane Smith - Browser',
    userId: 'user-id-123',
    recordTypeId: 'record-type-id',
    useSecureCalling: true,
});

// IP Phone endpoint
const ipPhone = await api.sipEndpoints.create({
    type: 'ipPhone',
    name: 'Conference Room Phone',
    macAddress: '00:11:22:33:44:55',
    userId: 'user-id-123',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// WebRTC endpoint (browser-based)
const res = await fetch("https://{namespace}.api.unbound.cx/sip-endpoint", {
    method: "POST",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        type: "webRtc",
        name: "Jane Smith - Browser",
        userId: "user-id-123",
        recordTypeId: "record-type-id",
        useSecureCalling: true,
    }),
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// WebRTC endpoint (browser-based)
$ch = curl_init("https://{namespace}.api.unbound.cx/sip-endpoint");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}",
    "Content-Type: application/json",
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "type" => "webRtc",
    "name" => "Jane Smith - Browser",
    "userId" => "user-id-123",
    "recordTypeId" => "record-type-id",
    "useSecureCalling" => true,
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# WebRTC endpoint (browser-based)
response = requests.post(
    "https://{namespace}.api.unbound.cx/sip-endpoint",
    headers={"Authorization": "Bearer {token}"},
    json={
        "type": "webRtc",
        "name": "Jane Smith - Browser",
        "userId": "user-id-123",
        "recordTypeId": "record-type-id",
        "useSecureCalling": True,
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# WebRTC endpoint (browser-based)
DATA=$(cat <<'EOF'
{
  "type": "webRtc",
  "name": "Jane Smith - Browser",
  "userId": "user-id-123",
  "recordTypeId": "record-type-id",
  "useSecureCalling": true
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/sip-endpoint" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `type` | string | ✅ | `'webRtc'` or `'ipPhone'` |
| `name` | string | — | Display name for the endpoint |
| `userId` | string | — | User to associate this endpoint with |
| `recordTypeId` | string | — | Record type for permission scoping |
| `useSecureCalling` | boolean | — | Enable TLS/SRTP secure calling |
| `macAddress` | string | — | MAC address (required for `ipPhone`) |

**Response shape:**

```javascript
{
    id: 'sip_abc123',
    type: 'webRtc',               // 'webRtc' | 'ipPhone'
    name: 'Jane Smith - Browser',
    userId: 'user-id-123',
    recordTypeId: 'record-type-id',
    useSecureCalling: true,
    sipUser: 'acme-sip-jane',     // SIP username to register with
    sipPassword: 'auto-generated',
    domain: 'sip.acme.unbound.cx',
    status: 'active',             // 'active' | 'inactive' | 'unregistered'
    macAddress: null,             // populated for ipPhone type
    provisioningUrl: null,        // auto-provisioning URL for ipPhone
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
}
```

:::note IP Phone MAC Address
For `ipPhone` type, `macAddress` is required and is used for zero-touch provisioning. The phone fetches its config from `provisioningUrl` on boot using the MAC address.
:::

---

## `sipEndpoints.getWebRtcDetails()`

Get the authenticated user's WebRTC endpoint configuration — SIP credentials, domain, and STUN/TURN servers. Use this to initialize a SIP.js or similar WebRTC client.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const config = await api.sipEndpoints.getWebRtcDetails();
// config.sipUser     → SIP username
// config.sipPassword → SIP password
// config.domain      → SIP domain
// config.stunServers → STUN/TURN server list
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/sip-endpoint/webrtc", {
    method: "GET",
    headers: { "Authorization": "Bearer {token}" },
});
const data = await res.json();
// data.sipUser     → SIP username
// data.sipPassword → SIP password
// data.domain      → SIP domain
// data.stunServers → STUN/TURN server list
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/sip-endpoint/webrtc");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
// $response['sipUser']     → SIP username
// $response['sipPassword'] → SIP password
// $response['domain']      → SIP domain
// $response['stunServers'] → STUN/TURN server list
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/sip-endpoint/webrtc",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
# data['sipUser']     → SIP username
# data['sipPassword'] → SIP password
# data['domain']      → SIP domain
# data['stunServers'] → STUN/TURN server list
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/sip-endpoint/webrtc" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Response shape:**

```javascript
{
    sipUser: 'acme-sip-jane',
    sipPassword: 's3cr3tP@ssw0rd',
    domain: 'sip.acme.unbound.cx',
    wsUri: 'wss://sip.acme.unbound.cx:7443',  // WebSocket URI for SIP.js
    stunServers: [
        { urls: 'stun:stun.unbound.cx:3478' },
        { urls: 'turn:turn.unbound.cx:3478', username: 'user', credential: 'pass' },
    ],
    displayName: 'Jane Smith',
    endpointId: 'sip_abc123',
}
```

:::tip Using with SIP.js
Pass `sipUser`, `sipPassword`, `domain`, `wsUri`, and `stunServers` directly to a [SIP.js](https://sipjs.com/) `UserAgent` to register for inbound/outbound calls in the browser.
:::

---

## `sipEndpoints.update(endpointId, options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.sipEndpoints.update('endpoint-id', {
    name: 'Updated Endpoint Name',
    userId: 'new-user-id',
    useSecureCalling: false,
    macAddress: 'AA:BB:CC:DD:EE:FF',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/sip-endpoint/{id}", {
    method: "PUT",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name: "Updated Endpoint Name",
        userId: "new-user-id",
        useSecureCalling: false,
        macAddress: "AA:BB:CC:DD:EE:FF",
    }),
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/sip-endpoint/{id}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}",
    "Content-Type: application/json",
]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "Updated Endpoint Name",
    "userId" => "new-user-id",
    "useSecureCalling" => false,
    "macAddress" => "AA:BB:CC:DD:EE:FF",
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.put(
    "https://{namespace}.api.unbound.cx/sip-endpoint/{id}",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "Updated Endpoint Name",
        "userId": "new-user-id",
        "useSecureCalling": False,
        "macAddress": "AA:BB:CC:DD:EE:FF",
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "name": "Updated Endpoint Name",
  "userId": "new-user-id",
  "useSecureCalling": false,
  "macAddress": "AA:BB:CC:DD:EE:FF"
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/sip-endpoint/{id}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

**Response shape:**

```javascript
// Returns the full updated endpoint object (same shape as create response)
{
    id: 'sip_abc123',
    type: 'webRtc',
    name: 'Updated Endpoint Name',
    userId: 'new-user-id',
    useSecureCalling: false,
    status: 'active',
    updatedAt: '2024-02-01T09:00:00.000Z',
    // ...all other endpoint fields
}
```

---

## `sipEndpoints.reboot(endpointId)`

Force a SIP endpoint to re-register — useful after configuration changes on IP phones.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.sipEndpoints.reboot('endpoint-id');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/sip-endpoint/{id}/reboot", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}" },
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/sip-endpoint/{id}/reboot");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/sip-endpoint/{id}/reboot",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/sip-endpoint/{id}/reboot" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Response shape:**

```javascript
{
    success: true,
    endpointId: 'sip_abc123',
    message: 'Endpoint reboot initiated',
}
```

:::note
Reboot triggers a SIP `NOTIFY` with `Event: check-sync` to IP phones. WebRTC endpoints receive a re-registration event over their WebSocket connection. The endpoint typically reconnects within 5–30 seconds.
:::

---

## `sipEndpoints.changeAccessSecret(endpointId)`

Rotate the SIP access credentials for an endpoint. Returns new credentials.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const newCreds = await api.sipEndpoints.changeAccessSecret('endpoint-id');
// newCreds.password → new SIP password
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/sip-endpoint/{id}/access-secret", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}" },
});
const data = await res.json();
// data.password → new SIP password
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/sip-endpoint/{id}/access-secret");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
// $response['password'] → new SIP password
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/sip-endpoint/{id}/access-secret",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
# data['password'] → new SIP password
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/sip-endpoint/{id}/access-secret" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Response shape:**

```javascript
{
    endpointId: 'sip_abc123',
    sipUser: 'acme-sip-jane',
    sipPassword: 'new-generated-password',   // New password — save this immediately
    domain: 'sip.acme.unbound.cx',
    rotatedAt: '2024-02-01T09:00:00.000Z',
}
```

:::warning Save the new password
The new `sipPassword` is only returned once in this response. Store it securely before the response is discarded. Any registered clients will need to re-authenticate with the new credentials.
:::

---

## `sipEndpoints.changeProvisioningSecret(endpointId)`

Rotate the provisioning secret used for IP phone auto-provisioning.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.sipEndpoints.changeProvisioningSecret('endpoint-id');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/sip-endpoint/{id}/provisioning-secret", {
    method: "POST",
    headers: { "Authorization": "Bearer {token}" },
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/sip-endpoint/{id}/provisioning-secret");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/sip-endpoint/{id}/provisioning-secret",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/sip-endpoint/{id}/provisioning-secret" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Response shape:**

```javascript
{
    endpointId: 'sip_abc123',
    provisioningUrl: 'https://provision.acme.unbound.cx/sip/sip_abc123?secret=new-secret',
    provisioningSecret: 'new-provisioning-secret',
    rotatedAt: '2024-02-01T09:00:00.000Z',
}
```

:::note
Rotate the provisioning secret after a phone is deployed to prevent unauthorized devices from fetching the config. After rotation, any phone that hasn't yet provisioned must use the new URL/secret.
:::

---

## `sipEndpoints.delete(endpointId)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.sipEndpoints.delete('endpoint-id');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/sip-endpoint/{id}", {
    method: "DELETE",
    headers: { "Authorization": "Bearer {token}" },
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/sip-endpoint/{id}");
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
    "https://{namespace}.api.unbound.cx/sip-endpoint/{id}",
    headers={"Authorization": "Bearer {token}"}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/sip-endpoint/{id}" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Common Patterns

### Pattern 1 — Provision a WebRTC softphone for a new user

Create a SIP endpoint and hand off the credentials to a browser-based SIP client.

```javascript
import SDK from '@unboundcx/sdk';
import { UserAgent, Registerer } from 'sip.js';

const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });

async function provisionWebRtcForUser(userId, recordTypeId) {
    // 1. Create WebRTC endpoint
    const endpoint = await api.sipEndpoints.create({
        type: 'webRtc',
        name: `WebRTC — ${userId}`,
        userId,
        recordTypeId,
        useSecureCalling: true,
    });

    console.log('Endpoint created:', endpoint.id);

    // 2. Get WebRTC connection details for this user's session
    const config = await api.sipEndpoints.getWebRtcDetails();

    // 3. Register with SIP.js
    const userAgent = new UserAgent({
        uri: UserAgent.makeURI(`sip:${config.sipUser}@${config.domain}`),
        transportOptions: {
            server: config.wsUri,
        },
        authorizationUsername: config.sipUser,
        authorizationPassword: config.sipPassword,
        iceServers: config.stunServers,
        displayName: config.displayName,
    });

    const registerer = new Registerer(userAgent);
    await userAgent.start();
    await registerer.register();

    console.log('SIP registered — ready to make and receive calls');
    return { endpoint, userAgent, registerer };
}

const { endpoint } = await provisionWebRtcForUser('user-123', 'rt-agent');
```

---

### Pattern 2 — Bulk-provision IP phones from a MAC address list

Zero-touch provisioning: create endpoints for each phone and log the provisioning URLs.

```javascript
const phonesToProvision = [
    { name: 'Lobby Phone',        macAddress: '00:1A:2B:3C:4D:5E', userId: 'user-lobby' },
    { name: 'Conference Room A',  macAddress: 'AA:BB:CC:DD:EE:FF', userId: 'user-conf-a' },
    { name: 'Sales Desk 1',       macAddress: '11:22:33:44:55:66', userId: 'user-sales-1' },
    { name: 'Sales Desk 2',       macAddress: '77:88:99:AA:BB:CC', userId: 'user-sales-2' },
];

const provisioningLog = [];

for (const phone of phonesToProvision) {
    const endpoint = await api.sipEndpoints.create({
        type: 'ipPhone',
        name: phone.name,
        macAddress: phone.macAddress,
        userId: phone.userId,
        useSecureCalling: true,
    });

    provisioningLog.push({
        mac: phone.macAddress,
        endpointId: endpoint.id,
        provisioningUrl: endpoint.provisioningUrl,
    });

    console.log(`✅ ${phone.name} (${phone.macAddress}) → ${endpoint.id}`);
}

// Print provisioning sheet
console.log('\n--- Provisioning URLs ---');
for (const entry of provisioningLog) {
    console.log(`${entry.mac}: ${entry.provisioningUrl}`);
}
```

---

### Pattern 3 — Rotate credentials on a schedule (security hardening)

Periodically rotate SIP access secrets for all active endpoints.

```javascript
async function rotateAllEndpointSecrets() {
    // Query all active SIP endpoints
    const endpoints = await api.objects.query({
        object: 'sipEndpoints',
        where: { type: 'webRtc', status: 'active' },
        limit: 500,
    });

    const rotated = [];
    const failed = [];

    for (const ep of endpoints.data) {
        try {
            const newCreds = await api.sipEndpoints.changeAccessSecret(ep.id);
            rotated.push({
                endpointId: ep.id,
                name: ep.name,
                newPassword: newCreds.sipPassword,
                rotatedAt: newCreds.rotatedAt,
            });
        } catch (err) {
            failed.push({ endpointId: ep.id, name: ep.name, error: err.message });
        }
    }

    console.log(`Rotated: ${rotated.length}, Failed: ${failed.length}`);

    // Persist new credentials to your secrets store
    for (const cred of rotated) {
        await mySecretsStore.set(`sip.${cred.endpointId}`, cred.newPassword);
    }

    if (failed.length > 0) {
        console.error('Failed rotations:', failed);
    }

    return { rotated, failed };
}

// Run monthly (or hook into a cron job)
await rotateAllEndpointSecrets();
```

---

### Pattern 4 — Reassign an endpoint when a user leaves

When a user account is deactivated, transfer their endpoint to a replacement user.

```javascript
async function reassignEndpoint(endpointId, oldUserId, newUserId) {
    // 1. Update userId on the endpoint
    const updated = await api.sipEndpoints.update(endpointId, {
        userId: newUserId,
        name: `Reassigned — ${newUserId}`,
    });

    // 2. Rotate access secret so old user can't re-register
    const newCreds = await api.sipEndpoints.changeAccessSecret(endpointId);

    // 3. Reboot endpoint to force re-registration with new credentials
    await api.sipEndpoints.reboot(endpointId);

    console.log(`Endpoint ${endpointId} reassigned: ${oldUserId} → ${newUserId}`);
    console.log('New SIP credentials:', newCreds.sipUser, newCreds.sipPassword);

    return { updated, newCreds };
}

await reassignEndpoint('sip_abc123', 'user-jane', 'user-bob');
```

---

### Pattern 5 — List and audit endpoints without an assigned user

Find orphaned SIP endpoints (user left, endpoint not cleaned up).

```javascript
async function auditOrphanedEndpoints() {
    const endpoints = await api.objects.uoql({
        query: `
            SELECT id, name, type, macAddress, status, createdAt
            FROM sipEndpoints
            WHERE userId IS NULL OR userId = ''
            ORDER BY createdAt DESC
            LIMIT 100
        `,
    });

    if (endpoints.results.length === 0) {
        console.log('No orphaned endpoints found ✅');
        return [];
    }

    console.log(`Found ${endpoints.results.length} orphaned endpoint(s):`);
    for (const ep of endpoints.results) {
        console.log(`  ${ep.id}  ${ep.type}  ${ep.name}  created: ${ep.createdAt}`);
    }

    // Optionally delete them
    const toDelete = endpoints.results.filter(
        ep => new Date(ep.createdAt) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    );

    for (const ep of toDelete) {
        await api.sipEndpoints.delete(ep.id);
        console.log(`Deleted stale endpoint: ${ep.id} (${ep.name})`);
    }

    return endpoints.results;
}

await auditOrphanedEndpoints();
```
