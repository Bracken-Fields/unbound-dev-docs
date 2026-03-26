---
id: configuration
title: Configuration
---

# Configuration

## Constructor Options

```typescript
new SDK({
    namespace: string,   // Required — your Unbound namespace
    token?: string,      // JWT auth token
})
```

### `namespace`
Your Unbound account namespace. The SDK connects to `{namespace}.api.unbound.cx`.

### `token`
A valid JWT. If omitted, you must call `api.login.login()` before making authenticated requests.

## Node.js Example

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE,
    token: process.env.UNBOUND_TOKEN,
});
```
