---
id: installation
title: Installation
---

# Installation

## Requirements

- Node.js 16+ (for server-side use)
- Any modern browser (for client-side use)

## npm

```bash
npm install @unboundcx/sdk
```

## Optional Dependencies

```bash
# Socket.io transport (browser/realtime)
npm install socket.io-client

# Better MIME type detection (file uploads)
npm install mime-types
```

## Importing

```javascript
// ESM (recommended)
import SDK from '@unboundcx/sdk';

// CommonJS
const SDK = require('@unboundcx/sdk');

// Named imports
import { createSDK } from '@unboundcx/sdk';
```

## Environments

| Environment | Transport | Notes |
|---|---|---|
| Node.js | NATS → HTTP fallback | Best for server-side, webhooks, workers |
| Browser | WebSocket → HTTP fallback | Auto-detects, connects via your namespace |
| Svelte | Socket.io + HTTP | Pass `socketStore` for optimized WS transport |

## Verify Install

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'test', token: 'test' });
console.log('SDK ready:', !!api.messaging);
// → SDK ready: true
```
