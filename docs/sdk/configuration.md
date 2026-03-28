---
id: configuration
title: Configuration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SDK Configuration

The Unbound SDK accepts a rich set of constructor options and runtime methods for tuning behavior, switching namespaces, enabling debug logging, and registering custom transport plugins.

---

## Constructor Options

```typescript
new SDK({
    namespace?: string,      // Your Unbound tenant namespace
    token?: string,          // JWT bearer token (optional — skips login)
    callId?: string,         // Active call ID for in-call context
    fwRequestId?: string,    // Request-ID forwarded for distributed tracing
    url?: string,            // Override base domain (browser only)
    socketStore?: any,       // WebSocket store (browser/Svelte only)
})
```

All options are optional, but `namespace` is required before making any API calls.

---

## Option Reference

### `namespace`

**Type:** `string` — **Required for API calls**

Your Unbound tenant identifier. The SDK uses this to construct the base API URL:

```
https://{namespace}.api.unbound.cx
```

```javascript
const api = new SDK({ namespace: 'acme' });
// All requests go to https://acme.api.unbound.cx
```

Omit `namespace` only if you're bootstrapping (e.g., checking namespace availability before login):

```javascript
const api = new SDK({});
const available = await api.enroll.checkNamespace('acme-corp');
```

---

### `token`

**Type:** `string` — **Optional**

A pre-supplied JWT bearer token. When set, the SDK skips the login step and attaches `Authorization: Bearer <token>` to every request.

```javascript
const api = new SDK({
    namespace: 'acme',
    token: process.env.UNBOUND_TOKEN,
});

// Immediately ready — no login() call needed
const contacts = await api.objects.query({ object: 'contacts' });
```

:::tip When to use token vs. login
- **`token`** — Best for server-to-server calls, background jobs, and microservices where credentials are managed externally.
- **`login()`** — Best for interactive apps where a user types their credentials.
:::

---

### `callId`

**Type:** `string` — **Optional**

The active call ID to attach to every request as `x-call-id`. Used for in-call operations where the platform routes the request through an active voice channel.

```javascript
const api = new SDK({
    namespace: 'acme',
    callId: currentCallId,
});

// All requests carry x-call-id: <callId>
await api.voice.mute(voiceChannelId);
```

You can update `callId` at runtime:

```javascript
api.callId = incomingCall.callId;
```

---

### `fwRequestId`

**Type:** `string` — **Optional**

A forwarded request ID attached as `x-request-id-fw` for distributed tracing. Useful when your backend proxies Unbound SDK calls and you want to correlate logs across services.

```javascript
const api = new SDK({
    namespace: 'acme',
    fwRequestId: req.headers['x-request-id'],
});
```

---

### `url` *(browser only)*

**Type:** `string` — **Optional**

Override the base domain. Defaults to `api.unbound.cx`. Useful for staging environments:

```javascript
// In browser (Svelte, React, etc.)
const api = new SDK({
    namespace: 'acme-staging',
    url: 'api.staging.unbound.cx',
});
```

In Node.js, set the environment variable `API_BASE_URL` instead:

```bash
API_BASE_URL=api.staging.unbound.cx node server.js
```

---

### `socketStore` *(browser only)*

**Type:** `any` — **Optional**

A reactive store (e.g., Svelte writable) for WebSocket session data. The SDK persists socket connection state here, enabling reactivity in UI frameworks.

```javascript
import { writable } from 'svelte/store';
import SDK from '@unboundcx/sdk';

const socketStore = writable(null);

const api = new SDK({
    namespace: 'acme',
    socketStore,
});
```

---

## Runtime Configuration

These methods change SDK behavior after initialization without creating a new instance.

---

### `api.setToken(token)`

Swap the active bearer token at runtime. Essential for token refresh workflows:

```javascript
const api = new SDK({ namespace: 'acme' });

// Initial login
await api.login.login(process.env.UNBOUND_USER, process.env.UNBOUND_PASS);

// Later: inject a refreshed token from your auth service
const newToken = await myAuth.refreshToken();
api.setToken(newToken);

// All subsequent calls use the new token
```

---

### `api.setNamespace(namespace)`

Switch to a different tenant namespace. Updates the base URL automatically:

```javascript
const api = new SDK({ namespace: 'acme-dev' });

// Switch to production
api.setNamespace('acme-prod');
// Now targeting https://acme-prod.api.unbound.cx

const contacts = await api.objects.query({ object: 'contacts' });
```

:::caution Thread safety
`setNamespace()` mutates the SDK instance. For concurrent multi-tenant workloads, create separate SDK instances per tenant instead of switching namespaces dynamically.
:::

---

### `api.debug(enabled?)`

Enable or disable verbose request logging. Returns `this` for chaining:

```javascript
api.debug(true);

// Every request now logs:
// API :: https :: POST :: https://acme.api.unbound.cx/messaging/sms :: 200 :: req-abc-123 :: 38ms

api.debug(false);  // Disable when done
```

`debug()` with no argument defaults to `true`:

```javascript
api.debug();   // Enable
api.debug();   // Still enabled (not a toggle)
api.debug(false);  // Explicitly disable
```

---

### `api.addTransport(transport)`

Register a custom transport plugin. The SDK tries registered transports (sorted by priority) before falling back to HTTP. Useful for in-process communication, WebSocket tunneling, or offline testing:

```javascript
class WebSocketTransport {
    name = 'websocket';
    
    getPriority() { return 10; }  // Lower = higher priority
    
    async isAvailable() {
        return this.socket?.readyState === WebSocket.OPEN;
    }
    
    async request(endpoint, method, params, context) {
        // Route through WebSocket instead of HTTP
        return new Promise((resolve, reject) => {
            this.socket.send(JSON.stringify({ endpoint, method, params }));
            this.socket.once('message', (data) => resolve(JSON.parse(data)));
        });
    }
}

api.addTransport(new WebSocketTransport());
```

Transport contract:
- **Return** API responses normally — including error status codes (`400`, `500`).
- **Throw only** for transport-level failures (connection dropped, socket closed).
- Implement `isAvailable()` to signal readiness.

---

### `api.removeTransport(name)`

Remove a previously registered transport:

```javascript
api.removeTransport('websocket');
// SDK falls back to HTTP for all subsequent requests
```

---

## Environment Variables

The SDK reads these environment variables in Node.js:

| Variable | Description |
|---|---|
| `namespace` | Fallback namespace if not set in constructor |
| `API_BASE_URL` | Override base domain (e.g., `api.staging.unbound.cx`) |
| `AUTH_V3_TOKEN_TYPE_OVERRIDE` | Force token type header (internal use) |
| `CLAMSCAN_OVERRIDE_KEY` | Skip virus scan on uploads (controlled environments only) |

Recommended `.env` setup:

```bash
# .env
UNBOUND_NAMESPACE=acme
UNBOUND_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
UNBOUND_USER=service@acme.com
UNBOUND_PASS=super-secret-password
```

```javascript
import 'dotenv/config';
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE,
    token: process.env.UNBOUND_TOKEN,
});
```

---

## Legacy (Positional) API

The SDK also supports the old positional-argument constructor for backward compatibility:

```javascript
// Legacy (deprecated)
const api = new SDK(namespace, callId, token, fwRequestId);

// Preferred (new)
const api = new SDK({ namespace, callId, token, fwRequestId });
```

:::note
New projects should always use the object-based constructor.
:::

---

## Multi-Tenant Configuration

For applications that manage multiple Unbound tenants, create one SDK instance per namespace:

```javascript
const clients = new Map();

function getClient(namespace, token) {
    if (!clients.has(namespace)) {
        clients.set(namespace, new SDK({ namespace, token }));
    }
    return clients.get(namespace);
}

// Each namespace gets its own isolated instance
const acmeApi   = getClient('acme', acmeToken);
const globexApi = getClient('globex', globexToken);

// Parallel queries to different tenants
const [acmeContacts, globexContacts] = await Promise.all([
    acmeApi.objects.query({ object: 'contacts' }),
    globexApi.objects.query({ object: 'contacts' }),
]);
```

---

## Browser vs. Node.js Differences

| Behavior | Node.js | Browser |
|---|---|---|
| Base URL construction | `https://{namespace}.{API_BASE_URL\|api.unbound.cx}` | `https://{namespace}.{url\|api.unbound.cx}` |
| Auth storage after login | In-process memory | `localStorage` (`unbound_url`, `unbound_userId`, `unbound_namespace`) |
| Cookie credentials | Not sent | `credentials: 'include'` (cookies sent automatically) |
| File uploads | Manual multipart construction via `Buffer` | Native `FormData` |
| Progress callbacks | Not supported | Supported via `XMLHttpRequest` |
| Debug log format | `API :: {transport} :: {method} :: {url} :: {status} :: {reqId} :: {ms}ms` | Same |

---

## Full Configuration Example

```javascript
import SDK from '@unboundcx/sdk';
import 'dotenv/config';

const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE,
    token:     process.env.UNBOUND_TOKEN,
    fwRequestId: generateTraceId(),  // Optional: distributed tracing
});

// Enable debug logging in development
if (process.env.NODE_ENV !== 'production') {
    api.debug(true);
}

// Refresh token every 25 minutes (before typical 30-min expiry)
setInterval(async () => {
    try {
        await api.login.validate();
    } catch {
        await api.login.login(
            process.env.UNBOUND_USER,
            process.env.UNBOUND_PASS,
        );
    }
}, 25 * 60 * 1000);

export default api;
```
