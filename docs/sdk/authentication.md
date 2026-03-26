---
id: authentication
title: Authentication
---

# Authentication

Unbound uses JWT tokens for all API requests. The SDK handles token attachment automatically once you have a valid session. This page covers every authentication pattern — from a quick dev setup to production multi-tenant deployments.

---

## SDK Initialization

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: 'your-namespace',   // Required: your Unbound tenant namespace
    token: 'optional-jwt-token',   // Optional: pre-supplied JWT
});
```

| Option | Type | Required | Description |
|---|---|---|---|
| `namespace` | string | ✅ | Your Unbound tenant namespace (e.g., `acme`) |
| `token` | string | — | Pre-supplied JWT token — skips login |

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

Check whether the current session/token is still valid. Useful on app startup or after a period of inactivity:

```javascript
try {
    const validation = await api.login.validate();
    console.log('Session valid:', validation);
} catch (err) {
    // Token expired or invalid — re-authenticate
    await api.login.login(username, password);
}
```

`validate()` always forces a fresh HTTP request (bypasses transport cache) to ensure accuracy.

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

Switch the active namespace after initialization:

```javascript
// Start in namespace A
const api = new SDK({ namespace: 'acme-dev' });

// Switch to production namespace
api.setNamespace('acme-prod');
// baseURL is updated automatically
```

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

### Dynamic Namespace Switching

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

---

## Debug Mode

Enable verbose request logging during development:

```javascript
const api = new SDK({ namespace: 'acme' });
api.debug(true);

// Now all requests log:
// API :: https :: POST :: https://acme.api.unbound.cx/objects/contacts :: 200 :: req-id :: 42ms
```

Disable when done:

```javascript
api.debug(false);
```

---

## Session Validation & Password Management

### `api.login.validate()`

Verify the current session is still alive:

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

End the current session:

```javascript
await api.login.logout();
// Returns true
```
