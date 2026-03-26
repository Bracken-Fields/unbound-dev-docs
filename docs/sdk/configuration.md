---
id: configuration
title: Configuration
---

# Configuration

## Constructor Options

```typescript
new SDK({
    namespace: string,      // Required — your Unbound namespace
    token?: string,         // JWT auth token
    callId?: string,        // Optional call tracking ID
    fwRequestId?: string,   // Optional request forwarding ID
    socketStore?: any,      // Socket.io store (Svelte/browser)
})
```

### `namespace`
Your Unbound account namespace. The SDK connects to `{namespace}.api.unbound.cx`.

### `token`
A valid JWT. If omitted, you must call `api.login.login()` before making authenticated requests.

### `callId`
Attach a call ID to all requests from this SDK instance — useful for correlating requests to an active voice call.

### `socketStore`
A Svelte-compatible store wrapping a Socket.io connection. When provided, the SDK uses WebSocket transport for lower latency.

## Node.js Example

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE,
    token: process.env.UNBOUND_TOKEN,
});
```

## Browser / Svelte Example

```javascript
import SDK from '@unboundcx/sdk';
import { socketAppStore } from '$lib/stores/socket.js';

const api = new SDK({
    namespace: 'your-namespace',
    socketStore: socketAppStore,
});
```

## Legacy Positional Constructor

Still supported for backwards compatibility:

```javascript
// new SDK(namespace, callId, token, fwRequestId)
const api = new SDK('your-namespace', null, 'your-jwt-token');
```
