---
id: portals
title: Portals & SIP Endpoints
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
| `logo` | string | — | Storage ID for logo |
| `favicon` | string | — | Storage ID for favicon |

---

## `portals.get(portalId)` / `portals.list()`

```javascript
const portal = await api.portals.get('portal-id');
const portals = await api.portals.list();
```

---

## `portals.getPublic(domain)`

Fetch a portal by domain (no auth required — for public portal pages).

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

Verify that the portal's custom domain DNS is configured correctly.

```javascript
const result = await api.portals.verifyDns('portal-id');
// result.verified → true/false
// result.records → DNS records status
```

---

## `portals.delete(portalId)`

```javascript
await api.portals.delete('portal-id');
```

---

# SIP Endpoints

`api.sipEndpoints` — Manage SIP devices and WebRTC endpoints for users.

---

## `sipEndpoints.create(options)`

```javascript
const endpoint = await api.sipEndpoints.create({
  type: 'webRtc',           // 'webRtc' | 'ipPhone'
  name: 'Jane Smith - Desk',
  userId: 'user-id-123',
  recordTypeId: 'record-type-id',
  useSecureCalling: true,
});

// IP Phone
const ipPhone = await api.sipEndpoints.create({
  type: 'ipPhone',
  name: 'Conference Room Phone',
  macAddress: '00:11:22:33:44:55',
  userId: 'user-id-123',
});
```

---

## `sipEndpoints.getWebRtcDetails()`

Get the authenticated user's WebRTC endpoint configuration (SIP credentials, STUN/TURN servers).

```javascript
const webrtc = await api.sipEndpoints.getWebRtcDetails();
// webrtc.sipUser, webrtc.sipPassword, webrtc.domain, webrtc.stunServers
```

---

## `sipEndpoints.update(endpointId, options)`

```javascript
await api.sipEndpoints.update('endpoint-id', {
  name: 'Updated Name',
  userId: 'new-user-id',
  useSecureCalling: false,
});
```

---

## `sipEndpoints.reboot(endpointId)`

Force a SIP endpoint to re-register (useful after config changes on IP phones).

```javascript
await api.sipEndpoints.reboot('endpoint-id');
```

---

## `sipEndpoints.changeAccessSecret(endpointId)`

Rotate the SIP access credentials for an endpoint.

```javascript
const newCreds = await api.sipEndpoints.changeAccessSecret('endpoint-id');
// newCreds.password → new SIP password
```

---

## `sipEndpoints.changeProvisioningSecret(endpointId)`

Rotate the provisioning secret (for IP phone auto-provisioning).

```javascript
await api.sipEndpoints.changeProvisioningSecret('endpoint-id');
```

---

## `sipEndpoints.delete(endpointId)`

```javascript
await api.sipEndpoints.delete('endpoint-id');
```
