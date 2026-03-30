---
id: overview
title: API Reference
slug: /api-reference/overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# API Reference

The Unbound API is a REST API organized into focused services. The TypeScript/JavaScript SDK wraps every endpoint with strong types, automatic auth, and retry handling. Every SDK method maps 1:1 to an HTTP endpoint — so you can use the SDK, call the API directly, or mix both.

---

## Services

### Communication

| Service | SDK Property | Description |
|---|---|---|
| [Messaging](/api-reference/messaging) | `api.messaging` | SMS, MMS, email, templates, campaigns, opt-out management |
| [Faxes](/api-reference/faxes) | `api.messaging.fax` | Send, receive, and track faxes with polling and retry |
| [Voice](/api-reference/voice) | `api.voice` | Calls, conferencing, recording, real-time transcription, IVR |
| [Video](/api-reference/video) | `api.video` | Rooms, participants, signaling, room chat, recordings, analytics |

### AI

| Service | SDK Property | Description |
|---|---|---|
| [AI Services](/api-reference/ai) | `api.ai` | Generative chat, TTS, real-time STT streaming, data extraction, playbooks |
| [Knowledge Base](/api-reference/knowledge-base) | `api.knowledgeBase` | AI-powered knowledge bases, semantic search, content ingestion |

### Contact Center

| Service | SDK Property | Description |
|---|---|---|
| [Task Router](/api-reference/task-router) | `api.taskRouter` | Routing engine — workers, tasks, queues, metrics |
| [Engagement Metrics](/api-reference/engagement-metrics) | `api.engagementMetrics` | Queue and agent performance dashboards |

### Data & Automation

| Service | SDK Property | Description |
|---|---|---|
| [Objects](/api-reference/objects) | `api.objects` | CRM-style data — CRUD, queries, schema management, expand details, generated columns |
| [UOQL](/api-reference/uoql) | `POST /object/query/v2` | SQL query engine — SELECT, GROUP BY, aggregates, window functions |
| [Workflows](/api-reference/workflows) | `api.workflows` | Build and run multi-step automation flows |
| [Notes](/api-reference/notes) | `api.notes` | Rich-text notes attached to any CRM record |
| [Storage](/api-reference/storage) | `api.storage` | File upload, signed access, metadata, classification |

### Platform & Infrastructure

| Service | SDK Property | Description |
|---|---|---|
| [Subscriptions](/api-reference/subscriptions) | `api.subscriptions` | Real-time WebSocket event subscriptions |
| [Phone Numbers](/api-reference/phone-numbers) | `api.phoneNumbers` | DID inventory, configuration, number porting |
| [SIP Endpoints](/api-reference/sip-endpoints) | `api.sipEndpoints` | WebRTC and IP phone endpoint provisioning |
| [Portals](/api-reference/portals) | `api.portals` | Branded customer portals on custom domains |
| [Lookup](/api-reference/lookup) | `api.lookup` | CNAM, LRN, and number intelligence |
| [Verification](/api-reference/verification) | `api.verification` | SMS and email OTP verification |
| [External OAuth](/api-reference/external-oauth) | `api.externalOAuth` | Third-party OAuth integrations (Salesforce, HubSpot, etc.) |
| [Record Types](/api-reference/record-types) | `api.recordTypes` | Data access permission schemas for agents and teams |
| [Layouts](/api-reference/layouts) | `api.layouts` | UI layout definitions for CRM objects |
| [Google Calendar](/api-reference/google-calendar) | `api.googleCalendar` | Calendar sync, webhooks, and event fetching |
| [Enrollment](/api-reference/enroll) | `api.enroll` | White-label account provisioning, namespace checks, KYC |
| Authentication | `api.login` | Login, logout, validate, change password, token management |

---

## Base URL

All API requests go to a namespace-scoped base URL:

```
https://{namespace}.api.unbound.cx
```

Replace `{namespace}` with your Unbound tenant namespace (e.g., `acme`). The SDK resolves this automatically from `new SDK({ namespace: 'acme' })`.

---

## Authentication

All API requests require a valid JWT token. The SDK handles this automatically after login:

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme' });
await api.login.login('user@acme.com', 'password');

// All subsequent calls are authenticated
const contacts = await api.objects.query({ object: 'contacts' });
```

For server-to-server or background services, pass a pre-issued token:

```javascript
const api = new SDK({
    namespace: 'acme',
    token: process.env.UNBOUND_TOKEN,
});
```

**Token types:**
- `cookie` — set by browser login flow; must be sent as a `Cookie` header
- `bearer` — standard JWT for server-side and SDK use; sent as `Authorization: Bearer <token>`

:::caution
Tokens are type-locked. A cookie token cannot be used as a bearer token, and vice versa. Sending a cookie token as a bearer header returns `401 Token type mismatch`.
:::

See [Authentication](/sdk/authentication) for token refresh, multi-tenant, and environment variable patterns.

---

## Request Format

All write requests (`POST`, `PUT`, `PATCH`) accept JSON bodies:

```http
POST /object/contacts HTTP/1.1
Host: acme.api.unbound.cx
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+15551234567"
}
```

All query parameters must be URL-encoded for `GET` requests.

---

## Response Format

Successful responses return JSON with an HTTP `2xx` status. Response shapes vary by endpoint but typically follow one of these patterns:

**Single object:**
```json
{
    "id": "obj_abc123",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "createdAt": "2026-01-15T14:30:00Z"
}
```

**Paginated list:**
```json
{
    "data": [
        { "id": "obj_abc123", "name": "Jane Smith" },
        { "id": "obj_def456", "name": "Bob Johnson" }
    ],
    "pagination": {
        "totalRecords": 142,
        "hasNextPage": true,
        "nextId": "obj_def456"
    }
}
```

**Operation result:**
```json
{
    "success": true,
    "id": "obj_abc123"
}
```

---

## Error Format

Errors return a non-`2xx` HTTP status with a JSON error body:

```json
{
    "message": "Invalid phone number format. Expected E.164 (e.g., +15551234567)",
    "statusCode": 400,
    "error": "Bad Request"
}
```

The SDK translates errors into structured `Error` objects with `.status`, `.body`, `.endpoint`, and `.method` properties:

```javascript
try {
    await api.voice.calls.dial({ to: '555-1234', from: '+15551234567' });
} catch (err) {
    console.error(err.status);    // 400
    console.error(err.message);   // "Invalid phone number format..."
    console.error(err.endpoint);  // "/voice/dial"
    console.error(err.method);    // "POST"
}
```

See the [Error Reference](/reference/errors) for a full list of error codes and their meanings.

---

## Pagination

Most list endpoints support cursor-based pagination via `nextId`:

```javascript
let nextId = null;
do {
    const page = await api.objects.query({
        object: 'contacts',
        limit: 100,
        nextId,
    });

    for (const record of page.data) {
        // process record
    }

    nextId = page.data.length === 100
        ? page.data[page.data.length - 1].id
        : null;
} while (nextId);
```

UOQL queries use `LIMIT` / `OFFSET` pagination:

```javascript
const PAGE_SIZE = 500; // maximum per query
let offset = 0;
let hasMore = true;

while (hasMore) {
    const page = await api.objects.uoql({
        query: `SELECT id, name, email FROM contacts LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
    });

    for (const record of page.results) {
        // process record
    }

    hasMore = page.pagination.hasNextPage;
    offset += PAGE_SIZE;
}
```

**Pagination limits by endpoint:**

| Endpoint | Max per page | Method |
|---|---|---|
| `objects.query` | 100 records | Cursor (`nextId`) |
| `objects.uoql` | 500 records | `LIMIT`/`OFFSET` |
| `messaging.listMessages` | 100 records | Cursor |
| `voice.calls.list` | 100 records | Cursor |
| `storage.list` | 100 records | Cursor |
| `phoneNumbers.list` | 100 records | Cursor |
| `taskRouter.tasks.list` | 100 records | Offset |

---

## Rate Limits

Rate limit headers are returned on every response:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1711425600
Retry-After: 30
```

Default limits per namespace:

| Category | Limit | Window |
|---|---|---|
| General API | 1,000 req/min | 1 minute |
| Messaging send | 100 req/min | 1 minute |
| Voice / call initiation | 60 req/min | 1 minute |
| AI / inference | 60 req/min | 1 minute |
| Storage upload | 30 req/min | 1 minute |
| Authentication | 20 req/min | 1 minute |

When rate limited (`429`), the `Retry-After` header tells you how many seconds to wait. See [Rate Limits & Quotas](/reference/limits) for retry patterns and burst strategies.

---

## Choosing the Right Query Method

Unbound offers two ways to query data — choose based on what you need:

| Need | Use |
|---|---|
| Fetch a record by ID | `api.objects.byId()` |
| Filter records by field values | `api.objects.query()` |
| Count, average, group, or rank records | `api.objects.uoql()` |
| Full-text search across fields | `api.objects.uoql()` with `LIKE` |
| Paginate through millions of records | `api.objects.uoql()` with `LIMIT`/`OFFSET` |
| Resolve foreign keys in results | Either — use `expandDetails: true` |
| Build analytics dashboards | `api.objects.uoql()` with `GROUP BY` + aggregates |

```javascript
// objects.query — simple field filter, up to 100 records per page
const openTickets = await api.objects.query({
    object: 'tickets',
    where: { status: 'open', assignedUserId: agentId },
    limit: 50,
    expandDetails: true,
});

// objects.uoql — aggregates, complex filters, large datasets
const ticketCountByStatus = await api.objects.uoql({
    query: `
        SELECT status, COUNT(*) as count, AVG(resolutionTimeHours) as avg_hours
        FROM tickets
        GROUP BY status
        ORDER BY count DESC
    `,
});
```

---

## Real-Time Events

For live dashboards and reactive UIs, use [Subscriptions](/api-reference/subscriptions) instead of polling:

```javascript
const conn = await api.subscriptions.socket.getConnection();

await api.subscriptions.socket.create(conn.sessionId, {
    channel: 'taskRouter',
    queueIds: ['queue_sales', 'queue_support'],
});

// Handle events via WebSocket
conn.ws.on('message', (data) => {
    const event = JSON.parse(data);
    // event.channel, event.type, event.data
    if (event.type === 'task.created') {
        updateDashboard(event.data);
    }
});
```

**Available subscription channels:**

| Channel | Events |
|---|---|
| `engagements` | Engagement start, update, end |
| `voice` | Call state, transfer, hold, recording |
| `messages` | Inbound SMS, email, MMS |
| `taskRouter` | Task created, assigned, completed, queue metrics |
| `ai.transcripts` | Real-time STT words and final transcripts |
| `engagementMetrics` | Queue depth, agent availability updates |

---

## Webhooks vs. Subscriptions

Both deliver events in real time — choose based on your infrastructure:

| | Webhooks | Subscriptions |
|---|---|---|
| **Transport** | HTTP POST to your server | WebSocket connection |
| **Best for** | Server-side event handlers | Browser/UI real-time |
| **Reliability** | Persisted; retried on failure | Connection-dependent |
| **Auth** | `X-Unbound-Signature` header | Same JWT as API |
| **Setup** | Register URL in Unbound dashboard | SDK `subscriptions.socket` |

For webhook setup, event signatures, and payload shapes, see the [Webhooks Guide](/guides/webhooks).

---

## SDK vs. Direct HTTP

Use the **SDK** when:
- Building Node.js/TypeScript applications
- You want automatic auth, retry, and error typing
- You need STT streaming (`api.ai.stt.stream()`) — not available via raw HTTP

Use **direct HTTP** when:
- Integrating from PHP, Python, Ruby, or any non-JS language
- Calling from CLI scripts or cURL
- You need fine-grained control over headers and timeouts

Both approaches use the same endpoints and auth. All examples in these docs include SDK, Node.js fetch, PHP, Python, and cURL tabs.

---

## Debug Mode

Enable verbose request logging during development:

```javascript
const api = new SDK({ namespace: 'acme' });
api.debug(true);

// Console output for every request:
// API :: https :: POST :: https://acme.api.unbound.cx/object/contacts :: 200 :: req-id-xyz :: 38ms
```

This logs the HTTP method, full URL, status code, request ID, and latency for every call — invaluable for debugging unexpected errors or slow endpoints.

---

## Service Capability Matrix

Quick reference for what each service can do:

| Capability | Service |
|---|---|
| Send SMS / MMS | [Messaging](/api-reference/messaging) |
| Send email | [Messaging](/api-reference/messaging) |
| Send fax | [Faxes](/api-reference/faxes) |
| Make / receive phone calls | [Voice](/api-reference/voice) |
| Video conferencing rooms | [Video](/api-reference/video) |
| Generative AI chat | [AI](/api-reference/ai) — `ai.generative.chat()` |
| Text-to-speech | [AI](/api-reference/ai) — `ai.tts.create()` |
| Real-time speech-to-text | [AI](/api-reference/ai) — `ai.stt.stream()` |
| AI data extraction | [AI](/api-reference/ai) — `ai.extract.*` |
| AI call quality scoring | [AI](/api-reference/ai) — `ai.playbooks.*` |
| Semantic search / RAG | [Knowledge Base](/api-reference/knowledge-base) |
| Route tasks to agents | [Task Router](/api-reference/task-router) |
| Monitor queue performance | [Engagement Metrics](/api-reference/engagement-metrics) |
| Store custom CRM data | [Objects](/api-reference/objects) |
| Complex data queries | [UOQL](/api-reference/uoql) |
| Workflow automation | [Workflows](/api-reference/workflows) |
| Real-time events | [Subscriptions](/api-reference/subscriptions) |
| Manage phone numbers | [Phone Numbers](/api-reference/phone-numbers) |
| Verify phone / email OTP | [Verification](/api-reference/verification) |
| Caller ID / carrier lookup | [Lookup](/api-reference/lookup) |
| Store and serve files | [Storage](/api-reference/storage) |
| Attach notes to records | [Notes](/api-reference/notes) |
| Branded portals | [Portals](/api-reference/portals) |
| Google Calendar sync | [Google Calendar](/api-reference/google-calendar) |
| Third-party OAuth | [External OAuth](/api-reference/external-oauth) |

---

## TypeScript Types

The SDK ships with full TypeScript declarations. All method parameters and return types are typed:

```typescript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme' });

// Parameter type errors are caught at compile time
await api.messaging.sms.send({
    from: '+15551234567',
    to: '+15559876543',
    message: 'Hello!',
    // mediaUrl: 123,  // ← TypeScript error: expected string
});
```

For a complete reference of all shared TypeScript interfaces and union types used across the SDK, see [TypeScript Types](/reference/types).
