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
