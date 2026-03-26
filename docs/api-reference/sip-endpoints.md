---
id: sip-endpoints
title: SIP Endpoints
---

# SIP Endpoints

`api.sipEndpoints` — Manage SIP devices and WebRTC endpoints for users. Supports both WebRTC (browser-based) and IP phone endpoints.

---

## `sipEndpoints.create(options)`

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

```javascript
const config = await api.sipEndpoints.getWebRtcDetails();
// config.sipUser     → SIP username
// config.sipPassword → SIP password
// config.domain      → SIP domain
// config.stunServers → STUN/TURN server list
```

---

## `sipEndpoints.update(endpointId, options)`

```javascript
await api.sipEndpoints.update('endpoint-id', {
    name: 'Updated Endpoint Name',
    userId: 'new-user-id',
    useSecureCalling: false,
    macAddress: 'AA:BB:CC:DD:EE:FF',
});
```

---

## `sipEndpoints.reboot(endpointId)`

Force a SIP endpoint to re-register — useful after configuration changes on IP phones.

```javascript
await api.sipEndpoints.reboot('endpoint-id');
```

---

## `sipEndpoints.changeAccessSecret(endpointId)`

Rotate the SIP access credentials for an endpoint. Returns new credentials.

```javascript
const newCreds = await api.sipEndpoints.changeAccessSecret('endpoint-id');
// newCreds.password → new SIP password
```

---

## `sipEndpoints.changeProvisioningSecret(endpointId)`

Rotate the provisioning secret used for IP phone auto-provisioning.

```javascript
await api.sipEndpoints.changeProvisioningSecret('endpoint-id');
```

---

## `sipEndpoints.delete(endpointId)`

```javascript
await api.sipEndpoints.delete('endpoint-id');
```
