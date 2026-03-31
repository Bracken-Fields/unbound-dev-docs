---
id: authentication
title: Authentication
---

# Authentication

Unbound uses JWT tokens for all API requests. The SDK handles token attachment automatically once you have a valid session. This page covers every authentication pattern — from a quick dev setup to production multi-tenant deployments, browser-side usage, custom transport plugins, and the full SDK extension API.

---

## SDK Initialization

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: 'your-namespace',   // Required: your Unbound tenant namespace
    token: 'optional-jwt-token',   // Optional: pre-supplied JWT
});
```

### Full Constructor Options

| Option | Type | Required | Description |
|---|---|---|---|
| `namespace` | string | ✅ | Your Unbound tenant namespace (e.g., `acme`) |
| `token` | string | — | Pre-supplied JWT token — skips login |
| `callId` | string | — | Voice call ID — auto-attached as `x-call-id` header on every request |
| `fwRequestId` | string | — | Forwarded request ID — attached as `x-request-id-fw` for distributed tracing |
| `url` | string | — | Override base API URL (browser environments only) |
| `socketStore` | object | — | Shared WebSocket/transport store for custom transport plugins |

```javascript
// Full options example (voice service context)
const api = new SDK({
    namespace: 'acme',
    token: process.env.UNBOUND_TOKEN,
    callId: 'call_abc123',
    fwRequestId: req.headers['x-request-id'],  // Propagate tracing header
});
```

### Factory Function

The `createSDK` helper is equivalent to `new SDK()` but reads more naturally in functional code:

```javascript
import { createSDK } from '@unboundcx/sdk';

const api = createSDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });
```

### Legacy Positional Parameters

The SDK supports backwards-compatible positional parameters from older integrations. Avoid this pattern in new code:

```javascript
// Legacy style — do not use in new code
const api = new SDK('acme', 'call_abc123', 'jwt-token', 'fw-req-id');

// New equivalent
const api = new SDK({
    namespace: 'acme',
    callId: 'call_abc123',
    token: 'jwt-token',
    fwRequestId: 'fw-req-id',
});
```

---

## Login Flows

### Username / Password Login

The most common flow for server-side or agent-initiated sessions:

```javascript
const api = new SDK({ namespace: 'acme' });

const session = await api.login.login('agent@acme.com', 'password123');
// Returns: { valid: true, userId: '...', namespace: 'acme', url: '...' }
```

The SDK automatically attaches the session cookie for all subsequent calls. In Node.js, the JWT is stored in-process. In browser environments, namespace details are persisted to `localStorage`.

### Login with Cross-Namespace Override

When authenticating into a namespace different from the one in your SDK instance:

```javascript
const session = await api.login.login('admin@acme.com', 'password', 'acme-prod');
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `username` | string | ✅ | User's login email or username |
| `password` | string | ✅ | User's password |
| `namespace` | string | — | Override namespace for this login |

**Login response shape:**

```javascript
{
    valid: true,
    userId: 'usr_abc123',
    namespace: 'acme',
    url: 'https://acme.api.unbound.cx'
}
```

### Pre-supplied Token (Server-to-Server)

If your backend issues tokens or you have a long-lived service token:

```javascript
const api = new SDK({
    namespace: 'acme',
    token: process.env.UNBOUND_TOKEN,
});

// All calls now use Bearer <UNBOUND_TOKEN> automatically
const records = await api.objects.query('contacts', {});
```

This is the recommended pattern for background jobs, cron tasks, and microservices.

---

## Token Management

### `api.login.validate()`

Check whether the current session/token is still valid. Always forces a fresh HTTP request (bypasses transport cache) to ensure accuracy:

```javascript
try {
    const validation = await api.login.validate();
    console.log('Session valid:', validation);
} catch (err) {
    // Token expired or invalid — re-authenticate
    await api.login.login(username, password);
}
```

### `api.setToken(token)`

Swap in a new token at runtime without creating a new SDK instance:

```javascript
// Token obtained from your auth service
const newToken = await myAuthService.refreshToken();

api.setToken(newToken);

// All subsequent SDK calls use the new token
```

This is essential for token refresh patterns in long-running processes.

### `api.setNamespace(namespace)`

Switch the active namespace after initialization. Updates the base URL automatically:

```javascript
// Start in namespace A
const api = new SDK({ namespace: 'acme-dev' });

// Switch to production namespace
api.setNamespace('acme-prod');
// baseURL is now: https://acme-prod.api.unbound.cx
```

:::caution
`setNamespace` is not safe for concurrent requests — in-flight requests that started under the old namespace will complete against the old URL. For concurrent multi-tenant workloads, use the [per-instance pattern](#one-sdk-instance-per-tenant).
:::

---

## Token Refresh Patterns

### Manual Polling Refresh

For long-running server processes, periodically re-authenticate before tokens expire:

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme' });

async function refreshSession() {
    try {
        await api.login.validate();
    } catch (err) {
        console.log('Session expired, re-authenticating...');
        await api.login.login(
            process.env.UNBOUND_USER,
            process.env.UNBOUND_PASS,
        );
    }
}

// Validate every 30 minutes
setInterval(refreshSession, 30 * 60 * 1000);

await api.login.login(process.env.UNBOUND_USER, process.env.UNBOUND_PASS);
// Your app logic here
```

### Auto-Retry on 401

Wrap SDK calls with automatic re-auth on token expiry:

```javascript
async function callWithRetry(fn) {
    try {
        return await fn();
    } catch (err) {
        if (err.status === 401) {
            // Re-authenticate and retry once
            await api.login.login(
                process.env.UNBOUND_USER,
                process.env.UNBOUND_PASS,
            );
            return await fn();
        }
        throw err;
    }
}

// Usage
const contacts = await callWithRetry(() =>
    api.objects.query('contacts', { limit: 50 })
);
```

### Exponential Backoff Retry

More robust retry with backoff for transient network issues:

```javascript
async function callWithBackoff(fn, { maxRetries = 3, baseDelayMs = 500 } = {}) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;

            if (err.status === 401 && attempt === 0) {
                // Re-auth on first 401
                await api.login.login(
                    process.env.UNBOUND_USER,
                    process.env.UNBOUND_PASS,
                );
                continue; // Retry immediately after re-auth
            }

            if (err.status === 429 || (err.status >= 500 && err.status < 600)) {
                // Rate limit or server error — back off
                const delay = baseDelayMs * Math.pow(2, attempt);
                console.warn(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms...`);
                await new Promise((res) => setTimeout(res, delay));
                continue;
            }

            throw err; // Non-retryable error
        }
    }

    throw lastError;
}

// Usage
const result = await callWithBackoff(() =>
    api.objects.query('contacts', { limit: 100 })
);
```

---

## Multi-Tenant Setups

### One SDK Instance Per Tenant

For SaaS applications managing multiple Unbound namespaces, create isolated instances:

```javascript
const tenantApis = new Map();

function getTenantApi(namespace, token) {
    if (!tenantApis.has(namespace)) {
        tenantApis.set(namespace, new SDK({ namespace, token }));
    }
    return tenantApis.get(namespace);
}

// Per-tenant operations
const acmeApi = getTenantApi('acme', acmeToken);
const globexApi = getTenantApi('globex', globexToken);

const acmeContacts = await acmeApi.objects.query('contacts', {});
const globexContacts = await globexApi.objects.query('contacts', {});
```

### Tenant Pool with Login

Manage a pool of authenticated sessions, re-authenticating lazily:

```javascript
class TenantPool {
    constructor() {
        this.pool = new Map();
    }

    async get(namespace, credentials) {
        if (this.pool.has(namespace)) {
            const { api } = this.pool.get(namespace);
            try {
                await api.login.validate();
                return api;
            } catch {
                // Session expired — fall through to re-auth
            }
        }

        const api = new SDK({ namespace });
        await api.login.login(credentials.username, credentials.password);
        this.pool.set(namespace, { api, credentials });
        return api;
    }

    async invalidate(namespace) {
        const entry = this.pool.get(namespace);
        if (entry) {
            try {
                await entry.api.login.logout();
            } catch { /* ignore */ }
            this.pool.delete(namespace);
        }
    }

    async invalidateAll() {
        const namespaces = [...this.pool.keys()];
        await Promise.allSettled(namespaces.map((ns) => this.invalidate(ns)));
    }
}

// Usage
const pool = new TenantPool();

const acme = await pool.get('acme', {
    username: process.env.ACME_USER,
    password: process.env.ACME_PASS,
});
const contacts = await acme.objects.query('contacts', {});
```

### Dynamic Namespace Switching (Single-Threaded Only)

For simpler use cases where only one tenant is active at a time:

```javascript
const api = new SDK({ namespace: 'acme' });

async function withTenant(namespace, token, fn) {
    const savedNamespace = api.namespace;
    const savedToken = api.token;

    api.setNamespace(namespace);
    api.setToken(token);

    try {
        return await fn(api);
    } finally {
        api.setNamespace(savedNamespace);
        api.setToken(savedToken);
    }
}

await withTenant('acme', acmeToken, (api) =>
    api.objects.query('contacts', {})
);
```

:::caution
Dynamic namespace switching is not safe for concurrent requests. Use the per-instance pattern for high-concurrency workloads.
:::

---

## Environment Variable Configuration

Store credentials in environment variables — never hard-code them:

```bash
# .env
UNBOUND_NAMESPACE=acme
UNBOUND_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
UNBOUND_USER=service@acme.com
UNBOUND_PASS=super-secret-password

# Optional: override the default API domain (e.g., for on-premise or staging)
API_BASE_URL=api.staging.unbound.cx
```

```javascript
import SDK from '@unboundcx/sdk';
import 'dotenv/config';

const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE,
    token: process.env.UNBOUND_TOKEN,
});

// Or login dynamically
const api2 = new SDK({ namespace: process.env.UNBOUND_NAMESPACE });
await api2.login.login(process.env.UNBOUND_USER, process.env.UNBOUND_PASS);
```

### Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `UNBOUND_NAMESPACE` | — | Tenant namespace (read by convention; pass to `SDK({ namespace })`) |
| `UNBOUND_TOKEN` | — | Pre-supplied JWT token (pass to `SDK({ token })`) |
| `UNBOUND_USER` | — | Login username for password-based auth |
| `UNBOUND_PASS` | — | Login password for password-based auth |
| `API_BASE_URL` | `api.unbound.cx` | Override the default API domain. Set to `api.staging.unbound.cx` for staging |
| `namespace` | — | Alternative env var the SDK reads for namespace (legacy) |
| `AUTH_V3_TOKEN_TYPE_OVERRIDE` | — | Internal: override token type header for v3 auth on forced-fetch requests |

### Multi-Environment Config Pattern

Manage dev / staging / production configs cleanly:

```javascript
// config/unbound.js
const configs = {
    development: {
        namespace: 'acme-dev',
        apiBase: 'api.dev.unbound.cx',
    },
    staging: {
        namespace: 'acme-staging',
        apiBase: 'api.staging.unbound.cx',
    },
    production: {
        namespace: 'acme',
        apiBase: 'api.unbound.cx',  // Default
    },
};

const env = process.env.NODE_ENV || 'development';
const config = configs[env];

// Set API_BASE_URL before SDK init (or override in constructor)
process.env.API_BASE_URL = config.apiBase;

export const api = new SDK({
    namespace: config.namespace,
    token: process.env.UNBOUND_TOKEN,
});
```

---

## Health Check & Connectivity

### `api.status()`

Verify SDK configuration and API reachability before handling traffic:

```javascript
const health = await api.status();
console.log(health);
// {
//     healthy: true,
//     hasAuthorization: true,
//     authType: 'bearer',         // 'bearer', 'cookie', or 'bearer+cookie'
//     namespace: 'acme',
//     environment: 'node',
//     transport: 'HTTP',
//     timestamp: '2026-03-31T08:00:00Z',
//     url: 'https://acme.api.unbound.cx',
//     statusCode: 200
// }
```

**Response shape:**

| Field | Type | Description |
|---|---|---|
| `healthy` | boolean | `true` if the API responded with HTTP 200 |
| `hasAuthorization` | boolean | `true` if the API received valid auth credentials |
| `authType` | string \| null | Auth method detected: `'bearer'`, `'cookie'`, `'bearer+cookie'`, or `null` |
| `namespace` | string | Active namespace |
| `environment` | string | `'node'` or `'browser'` |
| `transport` | string | Transport method used (e.g., `'HTTP'`, `'WebSocket'`) |
| `timestamp` | string | ISO timestamp from the health endpoint |
| `url` | string \| null | Resolved base URL |
| `statusCode` | number \| null | HTTP status code (or `null` on network failure) |

**Startup health check pattern:**

```javascript
import SDK from '@unboundcx/sdk';

async function initApi() {
    const api = new SDK({ namespace: process.env.UNBOUND_NAMESPACE });

    await api.login.login(
        process.env.UNBOUND_USER,
        process.env.UNBOUND_PASS,
    );

    const health = await api.status();

    if (!health.healthy) {
        throw new Error(`Unbound API unreachable: ${health.error}`);
    }

    if (!health.hasAuthorization) {
        throw new Error(`Auth failed — check credentials for namespace: ${health.namespace}`);
    }

    console.log(`Connected to Unbound (${health.namespace}) via ${health.transport}`);
    return api;
}

const api = await initApi();
```

### `api.getIp()`

Returns the client's IP address as seen by the Unbound API. Always uses the HTTP transport (never WebSocket or plugins):

```javascript
const { ip } = await api.getIp();
console.log('Client IP:', ip);  // e.g., '203.0.113.42'
```

Useful for debugging connectivity in Docker, VPNs, or behind proxies.

---

## Debug Mode

Enable verbose request logging during development:

```javascript
const api = new SDK({ namespace: 'acme' });
api.debug(true);

// Every request now logs:
// API :: https :: POST :: https://acme.api.unbound.cx/objects/contacts :: 200 :: req-abc :: 42ms

// On errors:
// API :: ERROR :: https :: POST :: https://acme.api.unbound.cx/objects/contacts :: 400 :: req-abc :: 12ms
```

Disable when done:

```javascript
api.debug(false);
```

`debug()` returns `this`, so it can be chained:

```javascript
const api = new SDK({ namespace: 'acme' }).debug(true);
```

---

## Session Validation & Password Management

### `api.login.validate()`

Verify the current session is still alive. Bypasses all transport caches (always hits the API):

```javascript
const status = await api.login.validate();
```

### `api.login.changePassword(newPassword)`

Change the authenticated user's password:

```javascript
await api.login.changePassword('new-secure-password-456');
```

### `api.login.getPasswordRequirements()`

Fetch the namespace's password policy before prompting a user:

```javascript
const requirements = await api.login.getPasswordRequirements();
// { minLength: 8, requireUppercase: true, requireNumbers: true, ... }
```

### `api.login.validatePasswordStrength(password)`

Check a candidate password against the namespace's policy:

```javascript
const result = await api.login.validatePasswordStrength('MyNewPass123!');
// { valid: true, score: 4, feedback: [] }
```

### `api.login.forgotPassword(email)`

Trigger a password reset email:

```javascript
await api.login.forgotPassword('agent@acme.com');
// Returns true; sends reset email to the address
```

### `api.login.logout()`

End the current session. In browser environments, also clears the `unbound_url`, `unbound_userId`, and `unbound_namespace` keys from `localStorage`:

```javascript
await api.login.logout();
// Returns true
```

---

## Browser-Specific Behavior

When running in a browser environment, the SDK has several differences from Node.js:

### Cookie Credentials

All browser HTTP requests are made with `credentials: 'include'`, so session cookies are automatically sent cross-origin (required for Unbound's cookie-based auth in browser contexts).

### localStorage Persistence

After a successful login, the SDK writes to `localStorage`:

| Key | Value |
|---|---|
| `unbound_url` | The resolved API URL (e.g., `https://acme.api.unbound.cx`) |
| `unbound_userId` | The authenticated user's ID |
| `unbound_namespace` | The namespace |

On logout, these three keys are removed. You can read these directly to restore a session after a page reload:

```javascript
// Restore session from localStorage (browser only)
const savedUrl = localStorage.getItem('unbound_url');
const savedNamespace = localStorage.getItem('unbound_namespace');

if (savedNamespace) {
    const api = new SDK({
        namespace: savedNamespace,
        url: savedUrl,
    });

    // Validate the existing cookie-based session
    try {
        await api.login.validate();
        console.log('Session restored');
    } catch {
        // Session expired — redirect to login
        window.location.href = '/login';
    }
}
```

### URL Override in Browser

Pass `url` to control which API domain the browser SDK uses (useful for custom domains or staging):

```javascript
const api = new SDK({
    namespace: 'acme',
    url: 'api.staging.unbound.cx',
});
// Resolves to: https://acme.api.staging.unbound.cx
```

---

## Error Handling

All SDK errors thrown from failed API requests are structured `Error` objects with extra properties:

```javascript
try {
    await api.objects.query('contacts', { limit: 50 });
} catch (err) {
    console.log(err.status);      // HTTP status code (e.g., 401, 403, 404, 429, 500)
    console.log(err.statusText);  // HTTP status text (e.g., 'Unauthorized')
    console.log(err.method);      // HTTP method (e.g., 'POST')
    console.log(err.endpoint);    // API endpoint (e.g., '/objects/contacts')
    console.log(err.body);        // Parsed response body (object) or raw error string
    console.log(err.message);     // Human-readable message (from body.error or body.message)
}
```

**Error status codes relevant to auth:**

| Status | Meaning | What to do |
|---|---|---|
| `400` | Bad request / validation error | Check parameters; inspect `err.body` |
| `401` | Unauthorized — token missing or expired | Re-authenticate with `api.login.login()` |
| `403` | Forbidden — insufficient permissions | Check user role/scope; contact admin |
| `429` | Rate limited | Back off and retry; see [Rate Limits](/reference/limits) |
| `500` | Internal server error | Retry with backoff; report if persistent |

**Type-safe error handling in TypeScript:**

```typescript
import SDK from '@unboundcx/sdk';

interface UnboundError extends Error {
    status: number;
    statusText: string;
    method: string;
    endpoint: string;
    body: unknown;
    message: string;
}

function isUnboundError(err: unknown): err is UnboundError {
    return err instanceof Error && 'status' in err;
}

try {
    await api.objects.query('contacts', {});
} catch (err) {
    if (isUnboundError(err)) {
        if (err.status === 401) {
            await api.login.login(user, pass);
        } else {
            throw err;
        }
    }
}
```

---

## Transport Plugin System

The SDK ships a built-in HTTP transport and supports custom transport plugins. Plugins let you route SDK calls over WebSockets, message queues, or any other channel — with HTTP as an automatic fallback.

### `api.addTransport(transport)`

Register a custom transport. Lower `priority` number = higher precedence:

```javascript
api.addTransport(myWebSocketTransport);
```

### `api.removeTransport(name)`

Remove a transport by name:

```javascript
api.removeTransport('my-websocket-transport');
```

### Transport Priority

When multiple transports are registered, the SDK picks the highest-priority one that reports `isAvailable() === true`. If no custom transport is available, the SDK falls back to HTTP.

```javascript
// Lower number = tried first
const highPriorityTransport = {
    name: 'websocket',
    getPriority: () => 10,   // Tried before priority-50 transports
    isAvailable: async () => socket.readyState === WebSocket.OPEN,
    request: async (endpoint, method, params, context) => { /* ... */ },
};

const fallbackTransport = {
    name: 'queue',
    getPriority: () => 50,   // Default priority
    isAvailable: async () => queue.isConnected(),
    request: async (endpoint, method, params, context) => { /* ... */ },
};

api.addTransport(highPriorityTransport);
api.addTransport(fallbackTransport);
```

### Authoring a Transport Plugin

A transport plugin is a plain object with these methods:

```javascript
const myTransport = {
    // Required: unique name for this transport
    name: 'my-transport',

    // Optional: priority (lower = higher precedence). Default: 50
    getPriority() {
        return 20;
    },

    // Optional: return false to skip this transport for a given request
    async isAvailable() {
        return this.connection !== null && this.connection.isOpen;
    },

    // Required: execute the request
    // - endpoint: string (e.g., '/objects/contacts')
    // - method: string ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')
    // - params: { body, query, headers, returnRawResponse }
    // - context: { namespace, token, callId, fwRequestId, baseURL }
    //
    // IMPORTANT:
    //   - Return API responses normally (including 400, 500 status codes)
    //   - Only THROW for transport-level failures (connection dropped, etc.)
    //   - If you throw, the SDK falls back to HTTP for that request
    async request(endpoint, method, params, context) {
        const { body, query, headers } = params;
        const url = `${context.baseURL}${endpoint}`;

        // Example: route through a WebSocket
        const response = await this.connection.send({
            url,
            method,
            body,
            query,
            headers: {
                ...headers,
                Authorization: `Bearer ${context.token}`,
            },
        });

        // Return a response object that matches the shape the SDK expects:
        // { ok: boolean, status: number, statusText: string, body: any,
        //   headers: { 'content-type': string, 'x-request-id': string } }
        return {
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.statusText,
            body: response.data,
            headers: response.headers,
        };
    },
};

api.addTransport(myTransport);
```

:::note
The `forceFetch` flag (used internally by `validate()`, `login()`, `logout()`, and `forgotPassword()`) bypasses all transport plugins and always uses direct HTTP. This ensures auth calls are never intercepted.
:::

---

## SDK Extension API

### `api.use(plugin)`

Install a plugin that mutates the SDK instance. Plugins can add services, override methods, or set up side effects:

```javascript
// Plugin as a function
const metricsPlugin = (sdk) => {
    const originalFetch = sdk._fetch.bind(sdk);
    sdk._fetch = async (endpoint, method, params, forceFetch) => {
        const start = Date.now();
        try {
            const result = await originalFetch(endpoint, method, params, forceFetch);
            metrics.recordSuccess(endpoint, Date.now() - start);
            return result;
        } catch (err) {
            metrics.recordError(endpoint, err.status);
            throw err;
        }
    };
};

api.use(metricsPlugin);

// Plugin as an object with install()
const retryPlugin = {
    install(sdk) {
        sdk.retryOnError = async (fn, retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    return await fn();
                } catch (err) {
                    if (i === retries - 1) throw err;
                    await new Promise((r) => setTimeout(r, 500 * (i + 1)));
                }
            }
        };
    },
};

api.use(retryPlugin);
await api.retryOnError(() => api.objects.query('contacts', {}));
```

`use()` returns `this` for chaining:

```javascript
const api = new SDK({ namespace: 'acme' })
    .use(metricsPlugin)
    .use(retryPlugin)
    .debug(true);
```

### `api.extend(extension)`

Merge an extension class or object into the SDK instance:

```javascript
// Extension as a class
class CRMExtension {
    constructor(sdk) {
        this.sdk = sdk;
    }

    async getActiveLeads() {
        return this.sdk.objects.query('leads', {
            filters: [{ field: 'status', operator: '=', value: 'active' }],
        });
    }

    async assignLead(leadId, agentId) {
        return this.sdk.objects.update('leads', leadId, { assignedAgent: agentId });
    }
}

api.extend(CRMExtension);

// Now callable directly on the SDK instance
const leads = await api.getActiveLeads();
await api.assignLead('lead_abc', 'usr_xyz');

// Extension as a plain object
api.extend({
    async ping() {
        const { ip } = await this.getIp();
        return `pong from ${ip}`;
    },
});

console.log(await api.ping());
```

---

## Advanced Patterns

### Express.js Middleware

Attach a per-request authenticated SDK instance to every Express request:

```javascript
import SDK from '@unboundcx/sdk';

// Shared SDK instance for service-to-service calls
const serviceApi = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE,
    token: process.env.UNBOUND_TOKEN,
});

// Middleware: attach SDK to req, passing the request's forwarded ID for tracing
export function unboundMiddleware(req, res, next) {
    req.api = new SDK({
        namespace: process.env.UNBOUND_NAMESPACE,
        token: req.headers['x-unbound-token'] || process.env.UNBOUND_TOKEN,
        fwRequestId: req.headers['x-request-id'],
    });
    next();
}

// Usage
app.use(unboundMiddleware);

app.get('/contacts', async (req, res) => {
    const contacts = await req.api.objects.query('contacts', { limit: 20 });
    res.json(contacts);
});
```

### React Context

Share a single SDK instance across a React application:

```javascript
// contexts/UnboundContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import SDK from '@unboundcx/sdk';

const UnboundContext = createContext(null);

export function UnboundProvider({ namespace, children }) {
    const [api, setApi] = useState(null);
    const [authState, setAuthState] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'

    useEffect(() => {
        const instance = new SDK({ namespace });

        // Try to restore session from localStorage
        instance.login.validate()
            .then(() => {
                setApi(instance);
                setAuthState('authenticated');
            })
            .catch(() => {
                setApi(instance);
                setAuthState('unauthenticated');
            });
    }, [namespace]);

    async function login(username, password) {
        await api.login.login(username, password);
        setAuthState('authenticated');
    }

    async function logout() {
        await api.login.logout();
        setAuthState('unauthenticated');
    }

    return (
        <UnboundContext.Provider value={{ api, authState, login, logout }}>
            {children}
        </UnboundContext.Provider>
    );
}

export function useUnbound() {
    return useContext(UnboundContext);
}

// Usage
function ContactsList() {
    const { api, authState } = useUnbound();

    if (authState !== 'authenticated') return <LoginForm />;

    async function load() {
        const data = await api.objects.query('contacts', { limit: 50 });
        // ...
    }
}
```

### Next.js Server Actions

Using the SDK in Next.js server components and actions:

```javascript
// lib/unbound.js — server-only helper
import SDK from '@unboundcx/sdk';

let _api = null;

export function getApi() {
    if (!_api) {
        _api = new SDK({
            namespace: process.env.UNBOUND_NAMESPACE,
            token: process.env.UNBOUND_TOKEN,
        });
    }
    return _api;
}

// app/contacts/page.jsx — server component
import { getApi } from '@/lib/unbound';

export default async function ContactsPage() {
    const api = getApi();
    const { data: contacts } = await api.objects.query('contacts', { limit: 20 });

    return (
        <ul>
            {contacts.map((c) => <li key={c.id}>{c.name}</li>)}
        </ul>
    );
}

// app/actions/createContact.js — server action
'use server';
import { getApi } from '@/lib/unbound';

export async function createContact(formData) {
    const api = getApi();
    return api.objects.create('contacts', {
        name: formData.get('name'),
        email: formData.get('email'),
    });
}
```

### Worker Threads (Node.js)

Each worker thread should have its own SDK instance — the SDK is not thread-safe across shared state:

```javascript
// main.js
import { Worker } from 'worker_threads';

const workers = Array.from({ length: 4 }, (_, i) =>
    new Worker('./worker.js', {
        workerData: {
            namespace: process.env.UNBOUND_NAMESPACE,
            token: process.env.UNBOUND_TOKEN,
            workerId: i,
        },
    })
);

// worker.js
import { workerData } from 'worker_threads';
import SDK from '@unboundcx/sdk';

// Each worker has its own isolated SDK instance
const api = new SDK({
    namespace: workerData.namespace,
    token: workerData.token,
});

// Process work...
const contacts = await api.objects.query('contacts', {
    filters: [{ field: 'shardId', operator: '=', value: workerData.workerId }],
    limit: 1000,
});
```

---

## Service Overview

After initialization, the SDK exposes these service namespaces:

| Namespace | Description |
|---|---|
| `api.login` | Authentication, sessions, password management |
| `api.objects` | CRUD operations on custom object types |
| `api.messaging` | SMS, email, fax, and multi-channel messaging |
| `api.voice` | Outbound calls, voice apps, IVR, recording |
| `api.video` | Video rooms, participants, recording |
| `api.ai` | AI completion, TTS, STT, playbooks |
| `api.taskRouter` | Task and worker queue management |
| `api.subscriptions` | Real-time event subscriptions |
| `api.workflows` | Automation workflow CRUD |
| `api.layouts` | UI layout definitions |
| `api.storage` | File and binary storage |
| `api.notes` | Contact/record note management |
| `api.lookup` | Phone number and address lookup |
| `api.verification` | Identity verification flows |
| `api.portals` | External portal management |
| `api.sipEndpoints` | SIP trunk and endpoint config |
| `api.externalOAuth` | Third-party OAuth token management |
| `api.googleCalendar` | Google Calendar integration |
| `api.enroll` | Device and user enrollment |
| `api.phoneNumbers` | Phone number provisioning |
| `api.recordTypes` | Custom record type definitions |
| `api.engagementMetrics` | Contact center analytics |
| `api.generateId` | Deterministic ID generation |
