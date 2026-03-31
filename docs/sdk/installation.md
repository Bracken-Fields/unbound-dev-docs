---
id: installation
title: Installation
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Installation

Everything you need to install and wire up the Unbound SDK in any JavaScript or TypeScript project.

---

## Requirements

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 16+ | LTS releases recommended (18, 20, 22) |
| Modern browser | ES2019+ | Chrome 80+, Firefox 75+, Safari 13.1+, Edge 80+ |
| npm / yarn / pnpm | Any recent | All package managers work |

---

## Install the Package

<Tabs groupId="pkg-manager">
<TabItem value="npm" label="npm">

```bash
npm install @unboundcx/sdk
```

</TabItem>
<TabItem value="yarn" label="Yarn">

```bash
yarn add @unboundcx/sdk
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add @unboundcx/sdk
```

</TabItem>
</Tabs>

---

## Optional Dependencies

Some features require additional packages:

| Package | Purpose | When needed |
|---|---|---|
| `socket.io-client` | WebSocket transport for subscriptions | Real-time events in browser or Node.js |
| `mime-types` | MIME type detection for uploads | Better accuracy on `storage.upload()` |

<Tabs groupId="pkg-manager">
<TabItem value="npm" label="npm">

```bash
# Real-time WebSocket subscriptions
npm install socket.io-client

# Better MIME detection for file uploads
npm install mime-types
```

</TabItem>
<TabItem value="yarn" label="Yarn">

```bash
yarn add socket.io-client mime-types
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add socket.io-client mime-types
```

</TabItem>
</Tabs>

---

## Importing the SDK

The package ships with both ESM and CommonJS bundles. Use whichever matches your project:

<Tabs groupId="import-style">
<TabItem value="esm" label="ESM (recommended)">

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: 'your-namespace',
    token: process.env.UNBOUND_TOKEN,
});
```

</TabItem>
<TabItem value="cjs" label="CommonJS">

```javascript
const SDK = require('@unboundcx/sdk');

const api = new SDK({
    namespace: 'your-namespace',
    token: process.env.UNBOUND_TOKEN,
});
```

</TabItem>
<TabItem value="factory" label="Factory function">

```javascript
import { createSDK } from '@unboundcx/sdk';

const api = createSDK({
    namespace: 'your-namespace',
    token: process.env.UNBOUND_TOKEN,
});
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```typescript
import SDK from '@unboundcx/sdk';
// Named type imports
import type { SmsSendOptions, VideoRoom } from '@unboundcx/sdk';

const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE!,
    token: process.env.UNBOUND_TOKEN!,
});
```

</TabItem>
</Tabs>

---

## TypeScript Setup

The SDK ships bundled TypeScript declaration files (`.d.ts`). No extra `@types` package is needed.

### tsconfig.json requirements

Make sure your `tsconfig.json` includes:

```json
{
    "compilerOptions": {
        "module": "ESNext",
        "moduleResolution": "bundler",
        "target": "ES2020",
        "strict": true,
        "esModuleInterop": true
    }
}
```

For older Node.js setups that use `"moduleResolution": "node"`:

```json
{
    "compilerOptions": {
        "module": "CommonJS",
        "moduleResolution": "node",
        "target": "ES2019",
        "strict": true,
        "esModuleInterop": true
    }
}
```

### Verify types

After install, you should get full autocomplete in your editor:

```typescript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme', token: 'tok' });

// Your IDE will autocomplete api.messaging.sms.send(...), api.voice.call(...), etc.
const result = await api.messaging.sms.send({
    from: '+15551000100',
    to: '+15559876543',
    message: 'Hello!',
    // ^^^ IDE completes all options, flags wrong types, shows docs on hover
});
```

---

## Environment Variables

Never hardcode credentials. Store them in environment variables:

```bash
# .env (never commit this file)
UNBOUND_NAMESPACE=your-namespace
UNBOUND_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# For login-based flows (optional — use token above for production)
UNBOUND_USERNAME=agent@yourcompany.com
UNBOUND_PASSWORD=your-password
```

Load them in your app:

<Tabs groupId="env-loader">
<TabItem value="dotenv" label="dotenv (Node.js)">

```bash
npm install dotenv
```

```javascript
import 'dotenv/config';
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE,
    token: process.env.UNBOUND_TOKEN,
});
```

</TabItem>
<TabItem value="vite" label="Vite">

Vite loads `.env` automatically. Prefix client-side vars with `VITE_`:

```bash
# .env
VITE_UNBOUND_NAMESPACE=your-namespace
VITE_UNBOUND_TOKEN=your-token
```

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: import.meta.env.VITE_UNBOUND_NAMESPACE,
    token: import.meta.env.VITE_UNBOUND_TOKEN,
});
```

:::caution
Never expose long-lived server tokens to the browser. Use short-lived tokens or proxy calls through your backend.
:::

</TabItem>
<TabItem value="nextjs" label="Next.js">

```bash
# .env.local
UNBOUND_NAMESPACE=your-namespace
UNBOUND_TOKEN=your-token  # server-side only (no NEXT_PUBLIC_ prefix)
```

```typescript
// lib/api.ts — server-side only
import SDK from '@unboundcx/sdk';

export const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE!,
    token: process.env.UNBOUND_TOKEN!,
});
```

```typescript
// app/api/sms/route.ts — Next.js API route
import { api } from '@/lib/api';

export async function POST(request: Request) {
    const { to, message } = await request.json();
    const sms = await api.messaging.sms.send({
        from: '+15551000100',
        to,
        message,
    });
    return Response.json({ id: sms.id });
}
```

</TabItem>
</Tabs>

---

## Framework Setup

### Node.js (Express)

```bash
npm install @unboundcx/sdk dotenv express
```

```javascript
// src/lib/unbound.js
import 'dotenv/config';
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
```

```javascript
// src/routes/sms.js
import express from 'express';
import { getApi } from '../lib/unbound.js';

const router = express.Router();

router.post('/send', async (req, res) => {
    const api = getApi();
    try {
        const sms = await api.messaging.sms.send({
            from: req.body.from,
            to: req.body.to,
            message: req.body.message,
        });
        res.json({ id: sms.id, status: sms.status });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

export default router;
```

---

### Next.js (App Router)

```bash
npm install @unboundcx/sdk
```

```typescript
// lib/api.ts
import SDK from '@unboundcx/sdk';

// Singleton — created once per process
export const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE!,
    token: process.env.UNBOUND_TOKEN!,
});
```

```typescript
// app/api/voice/route.ts
import { api } from '@/lib/api';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const { to } = await req.json();

    const call = await api.voice.call({
        to,
        from: '+15551000100',
        app: { type: 'tts', message: 'Hello! Your appointment is confirmed.' },
    });

    return Response.json({ callId: call.callControlId });
}
```

---

### Svelte / SvelteKit

```bash
npm install @unboundcx/sdk socket.io-client
```

```typescript
// src/lib/api.ts (server-side, for SvelteKit server routes)
import SDK from '@unboundcx/sdk';
import { UNBOUND_NAMESPACE, UNBOUND_TOKEN } from '$env/static/private';

export const api = new SDK({
    namespace: UNBOUND_NAMESPACE,
    token: UNBOUND_TOKEN,
});
```

For client-side Svelte with real-time subscriptions, pass a socket store:

```typescript
// src/lib/socket.ts
import { writable } from 'svelte/store';
import io from 'socket.io-client';

export const socketStore = writable(null);

export function connectSocket(namespace: string, token: string) {
    const socket = io(`https://${namespace}.api.unbound.cx`, {
        auth: { token },
    });
    socketStore.set(socket);
    return socket;
}
```

```typescript
// src/lib/api.ts (browser-side)
import SDK from '@unboundcx/sdk';
import { socketStore } from './socket';

export const api = new SDK({
    namespace: 'your-namespace',
    socketStore,   // enables optimized WebSocket transport
});
```

---

### Remix

```bash
npm install @unboundcx/sdk
```

```typescript
// app/utils/api.server.ts
import SDK from '@unboundcx/sdk';

// Server-only singleton
let _api: InstanceType<typeof SDK> | null = null;

export function getApi() {
    if (!_api) {
        _api = new SDK({
            namespace: process.env.UNBOUND_NAMESPACE!,
            token: process.env.UNBOUND_TOKEN!,
        });
    }
    return _api;
}
```

```typescript
// app/routes/api.sms.ts
import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getApi } from '~/utils/api.server';

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const to = formData.get('to') as string;
    const message = formData.get('message') as string;

    const api = getApi();
    const sms = await api.messaging.sms.send({
        from: '+15551000100',
        to,
        message,
    });

    return json({ id: sms.id });
}
```

---

### Hono (Cloudflare Workers / Bun)

```bash
npm install @unboundcx/sdk hono
```

```typescript
// src/index.ts
import { Hono } from 'hono';
import SDK from '@unboundcx/sdk';

type Env = {
    UNBOUND_NAMESPACE: string;
    UNBOUND_TOKEN: string;
};

const app = new Hono<{ Bindings: Env }>();

app.post('/sms', async (c) => {
    const { to, message } = await c.req.json();

    // Create SDK per-request (Workers are stateless)
    const api = new SDK({
        namespace: c.env.UNBOUND_NAMESPACE,
        token: c.env.UNBOUND_TOKEN,
    });

    const sms = await api.messaging.sms.send({
        from: '+15551000100',
        to,
        message,
    });

    return c.json({ id: sms.id });
});

export default app;
```

---

## Docker / CI Setup

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Never bake credentials into the image — use runtime env vars
# docker run -e UNBOUND_NAMESPACE=acme -e UNBOUND_TOKEN=xxx ...
ENV UNBOUND_NAMESPACE=""
ENV UNBOUND_TOKEN=""

CMD ["node", "src/index.js"]
```

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm test
        env:
          UNBOUND_NAMESPACE: ${{ secrets.UNBOUND_NAMESPACE }}
          UNBOUND_TOKEN: ${{ secrets.UNBOUND_TOKEN }}
```

---

## Monorepo Setup

In a monorepo (Turborepo, Nx, Yarn workspaces), install the SDK in the package that uses it:

```bash
# Turborepo / npm workspaces
npm install @unboundcx/sdk --workspace=apps/api

# Or add to a shared internal package
npm install @unboundcx/sdk --workspace=packages/unbound-client
```

**Shared client package pattern:**

```typescript
// packages/unbound-client/src/index.ts
import SDK from '@unboundcx/sdk';

let _api: InstanceType<typeof SDK> | null = null;

export function getApi() {
    if (!_api) {
        if (!process.env.UNBOUND_NAMESPACE || !process.env.UNBOUND_TOKEN) {
            throw new Error('UNBOUND_NAMESPACE and UNBOUND_TOKEN must be set');
        }
        _api = new SDK({
            namespace: process.env.UNBOUND_NAMESPACE,
            token: process.env.UNBOUND_TOKEN,
        });
    }
    return _api;
}

export type { SmsSendOptions, VideoRoom } from '@unboundcx/sdk';
```

```typescript
// apps/api/src/handlers/sms.ts
import { getApi } from '@your-org/unbound-client';

const api = getApi();
const sms = await api.messaging.sms.send({ ... });
```

---

## Transport Modes

The SDK selects a transport automatically based on environment:

| Environment | Primary Transport | Fallback |
|---|---|---|
| Node.js server | NATS (low-latency) | HTTPS |
| Browser | WebSocket (socket.io) | HTTPS |
| Svelte (with `socketStore`) | Socket.io (optimized) | HTTPS |
| Cloudflare Workers / Edge | HTTPS only | — |

All transports use the same API surface — you don't need to configure anything.

---

## Verify the Install

Run a quick smoke test to confirm everything is wired up:

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE,
    token: process.env.UNBOUND_TOKEN,
});

// Confirm the session is valid
try {
    const session = await api.login.validate();
    console.log('✅ Connected to Unbound:', session);
} catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
}
```

Or with a real API call:

```javascript
// List your provisioned phone numbers
const numbers = await api.objects.query({
    object: 'phoneNumbers',
    limit: 5,
});
console.log('Phone numbers:', numbers.data?.length ?? 0);
```

---

## Troubleshooting

### `Cannot find module '@unboundcx/sdk'`

The package is not installed in the right directory. Check you're running `npm install` in the correct project root:

```bash
# Confirm the package exists
ls node_modules/@unboundcx/sdk

# If missing, re-install
npm install @unboundcx/sdk
```

For monorepos, make sure you installed in the right workspace:

```bash
npm install @unboundcx/sdk --workspace=apps/api
```

---

### `SyntaxError: Cannot use import statement in a module`

Your Node.js project is using CommonJS but the SDK uses ESM syntax. Fix options:

**Option A — Switch to ESM** (recommended):
```json
// package.json
{
    "type": "module"
}
```

**Option B — Use the CommonJS build**:
```javascript
const SDK = require('@unboundcx/sdk');
```

**Option C — Dynamic import**:
```javascript
const { default: SDK } = await import('@unboundcx/sdk');
```

---

### `401 Unauthorized` on first request

Your token is missing or expired. Check your environment variables are loaded:

```javascript
console.log('Namespace:', process.env.UNBOUND_NAMESPACE);  // should print your namespace
console.log('Token set:', !!process.env.UNBOUND_TOKEN);     // should print true
```

If you're using login-based auth:

```javascript
await api.login.login(
    process.env.UNBOUND_USERNAME,
    process.env.UNBOUND_PASSWORD,
);
// Now make your API calls
```

---

### TypeScript: `Type 'string | undefined' is not assignable`

You're accessing an env var without a fallback. Fix with a non-null assertion or a runtime check:

```typescript
// Option A: non-null assertion (throws at runtime if missing)
const api = new SDK({
    namespace: process.env.UNBOUND_NAMESPACE!,
    token: process.env.UNBOUND_TOKEN!,
});

// Option B: runtime check (better for production)
const namespace = process.env.UNBOUND_NAMESPACE;
const token = process.env.UNBOUND_TOKEN;

if (!namespace || !token) {
    throw new Error('Missing UNBOUND_NAMESPACE or UNBOUND_TOKEN');
}

const api = new SDK({ namespace, token });
```

---

### Bundler: `Module not found` or ESM issues in Vite/Webpack

If your bundler has trouble with the SDK, add it to the `optimizeDeps` list (Vite) or `resolve.alias` (Webpack):

**Vite:**
```javascript
// vite.config.ts
export default {
    optimizeDeps: {
        include: ['@unboundcx/sdk'],
    },
};
```

**Webpack (Next.js):**
```javascript
// next.config.js
module.exports = {
    webpack: (config) => {
        config.resolve.extensionAlias = {
            '.js': ['.ts', '.tsx', '.js', '.jsx'],
        };
        return config;
    },
};
```

---

## What's Next

| Goal | Where to go |
|---|---|
| Authenticate and manage tokens | [Authentication](/sdk/authentication) |
| Configure timeouts, debug, transport | [Configuration](/sdk/configuration) |
| Handle errors and retries | [Error Handling](/sdk/error-handling) |
| Send your first SMS | [Send Your First SMS](/guides/send-sms) |
| Make your first voice call | [Make an Outbound Call](/guides/make-call) |
| Set up real-time event subscriptions | [Real-Time Subscriptions](/guides/real-time-subscriptions) |
| Full SDK quick tour | [Getting Started](/getting-started) |
| TypeScript interface reference | [TypeScript Types](/reference/types) |
