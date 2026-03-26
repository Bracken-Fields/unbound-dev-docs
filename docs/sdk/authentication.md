---
id: authentication
title: Authentication
---

# Authentication

Unbound uses JWT tokens for authentication. You can either pass a token directly or use `api.login` to obtain one at runtime.

## Login

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace' });

const session = await api.login.login('username', 'password');
// session.token contains your JWT
```

After login, the SDK automatically uses the returned token for subsequent calls.

## Pass a Token Directly

If you already have a JWT (e.g., from your backend):

```javascript
const api = new SDK({
    namespace: 'your-namespace',
    token: process.env.UNBOUND_TOKEN,
});
```

## Other Auth Methods

```javascript
// Validate current session
await api.login.validate();

// Change password
await api.login.changePassword('current-password', 'new-password');

// Logout
await api.login.logout();
```

## Token Lifecycle

Tokens are scoped to your namespace. For server-side usage, store the token securely and refresh it as needed. For browser apps, obtain tokens server-side and pass them down — never expose service credentials in client code.

## Enroll (New Users)

```javascript
await api.enroll.create({
    email: 'newuser@example.com',
    namespace: 'your-namespace',
    role: 'agent',
});
```
