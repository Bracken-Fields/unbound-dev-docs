---
id: errors
title: Error Reference
---

# Error Reference

A complete reference for every error type, status code, and error shape you may encounter when using the Unbound SDK.

---

## Error Shape

Every SDK method throws a structured JavaScript `Error` when something goes wrong. The error object has the following properties:

```typescript
interface UnboundError extends Error {
    // Human-readable error message from the API
    message: string;

    // HTTP status code (400, 401, 403, 404, 429, 500, etc.)
    status: number;

    // HTTP status text ("Bad Request", "Unauthorized", etc.)
    statusText: string;

    // HTTP method that failed ("GET", "POST", "PUT", "DELETE")
    method: string;

    // API endpoint that was called ("/messaging/sms", "/video/room-id", etc.)
    endpoint: string;

    // Full error body from the API response (may be a string or parsed object)
    body: string | object;

    // Full error name including transport, method, and endpoint
    name: string;
    // Example: "API :: Error :: https :: POST :: /messaging/sms :: 400 :: Bad Request"
}
```

### Reading an Error

```javascript
try {
    await api.messaging.sms.send({
        from: '+1234567890',
        to: '+0987654321',
        message: 'Hello!',
    });
} catch (err) {
    // Status-based routing
    if (err.status === 400) {
        console.error('Invalid request:', err.message);
        console.error('Details:', err.body);
    } else if (err.status === 401) {
        console.error('Auth failed — re-authenticate');
    } else if (err.status === 429) {
        console.error('Rate limited — back off and retry');
    } else {
        console.error(`Unexpected error [${err.status}]:`, err.message);
    }
}
```

---

## HTTP Status Codes

### 400 — Bad Request

The request was malformed or contained invalid parameters.

**Common causes:**

- Missing required field (e.g., no `to` on an SMS)
- Invalid phone number format — must be E.164 (`+15551234567`)
- Invalid enum value (e.g., `mediaType: 'speaker'` instead of `'microphone'` or `'camera'`)
- Incompatible field combinations (e.g., mixing toll-free and local numbers in a porting order)
- Date/time in the wrong format — ISO 8601 expected (`2024-06-01T14:00:00Z`)
- JSON body that can't be parsed

**Example response body:**

```json
{
    "error": "Invalid phone number format",
    "field": "to",
    "received": "555-1234"
}
```

**Fix:** Check `err.body` for the specific field and reason. Validate all required parameters before calling.

---

### 401 — Unauthorized

The request lacked valid authentication credentials, or the token has expired.

**Common causes:**

- No token provided at SDK initialization
- Token has expired (tokens are session-scoped)
- Token was revoked (password changed, session killed)
- Calling an authenticated endpoint as a guest

**Example:**

```javascript
import { SDK } from '@unbound/sdk';

// Wrong — no token
const api = new SDK({ namespace: 'acme' });

// Right — valid token
const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });
```

**Fix:** Re-authenticate with `api.login.password()` or `api.login.token()` and retry with the new token.

---

### 403 — Forbidden

The token is valid, but the caller doesn't have permission to access this resource or namespace.

**Common causes:**

- Calling a resource in a different namespace than the token was issued for
- User role lacks the required permission (e.g., a contact-only user calling admin APIs)
- Attempting to edit another user's video settings without admin scope
- Expired or invalid namespace

**Example:**

```javascript
try {
    await api.video.updateParticipant('room-id', 'participant-id', { role: 'host' });
} catch (err) {
    if (err.status === 403) {
        // Current user is not a host in this room
        console.error('Permission denied:', err.message);
    }
}
```

**Fix:** Check that the token was issued for the correct namespace. Verify the user's role and permissions in the Unbound console.

---

### 404 — Not Found

The requested resource does not exist.

**Common causes:**

- Resource ID is wrong or was deleted
- Calling `describe` on a room that has already been closed
- Referencing a storage file by ID after it expired
- Namespace does not exist

**Example:**

```javascript
try {
    const room = await api.video.describe('nonexistent-room-id');
} catch (err) {
    if (err.status === 404) {
        console.log('Room not found — may have been deleted');
    }
}
```

**Fix:** Verify the ID exists before referencing it. Handle 404s gracefully in UI flows — resources can be deleted by other users.

---

### 409 — Conflict

The request conflicts with existing state.

**Common causes:**

- Creating a resource that already exists (e.g., duplicate phone number in a porting order)
- Updating a resource that was concurrently modified
- Attempting to port a number already in an active porting order

**Example:**

```javascript
try {
    await api.phoneNumbers.checkPortability({
        phoneNumbers: ['+15551234567'],
        portingOrderId: 'existing-order',
    });
} catch (err) {
    if (err.status === 409) {
        console.error('Number already in another porting order');
    }
}
```

---

### 422 — Unprocessable Entity

The request was syntactically valid but semantically invalid — the API understood the request but can't process it.

**Common causes:**

- Phone number is not portable
- Workflow trigger condition is invalid
- Task Router configuration references a non-existent queue
- Attempting to assign an agent to a task they're not qualified for

---

### 429 — Too Many Requests

The request was rate limited.

**The response includes a `Retry-After` header** indicating how many seconds to wait.

**Recommended handling:**

```javascript
async function withRetry(fn, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            if (err.status !== 429 || attempt === maxRetries - 1) {
                throw err;
            }
            // Exponential backoff: 1s, 2s, 4s
            const delayMs = Math.pow(2, attempt) * 1000;
            console.warn(`Rate limited. Retrying in ${delayMs}ms...`);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
}

const result = await withRetry(() =>
    api.messaging.sms.send({ from: '+1...', to: '+1...', message: 'Hi' })
);
```

**See also:** [Rate Limits reference](./limits) for per-endpoint limits.

---

### 500 — Internal Server Error

An unexpected error occurred on the server.

**What to do:**

1. Check `err.body` for any diagnostic message
2. Note the `x-request-id` header (captured in `err.name`) and include it in support requests
3. Retry once after a short delay — transient 500s are rare but possible
4. If persistent, contact Unbound support with the request ID

---

### 502 / 503 / 504 — Gateway / Service Unavailable

The server is temporarily unavailable or a dependent service is down.

**What to do:** Retry with exponential backoff. These are almost always transient.

```javascript
async function robustRequest(fn) {
    const retryableCodes = new Set([429, 500, 502, 503, 504]);
    for (let i = 0; i < 4; i++) {
        try {
            return await fn();
        } catch (err) {
            if (!retryableCodes.has(err.status) || i === 3) throw err;
            await new Promise(r => setTimeout(r, (i + 1) * 1500));
        }
    }
}
```

---

## SDK Validation Errors

Before any network request is made, the SDK validates parameters client-side. These errors are plain `Error` instances (no `.status` property).

### Missing Required Parameter

Thrown when a required parameter is omitted.

```javascript
// Throws: "Missing required parameter room"
await api.video.joinRoom(undefined, 'password', 'user@example.com', 'Jane');
```

**Pattern:** `Missing required parameter <name>`

### Type Mismatch

Thrown when a parameter has the wrong JavaScript type.

```javascript
// Throws: "Invalid type for parameter isMute: expected boolean, got string"
await api.video.mute('room-id', 'participant-id', 'microphone', 'true');
```

**Pattern:** `Invalid type for parameter <name>: expected <type>, got <actualType>`

### Catching SDK Validation Errors

SDK validation errors don't have a `.status` property. Use that to distinguish them from API errors:

```javascript
try {
    await api.video.mute('room-id', 'participant-id', 'microphone', 'true');
} catch (err) {
    if (err.status) {
        // API error — came from the server
        console.error(`API error [${err.status}]:`, err.message);
    } else {
        // Validation error — caught before network call
        console.error('SDK validation error:', err.message);
    }
}
```

---

## Service-Specific Errors

### Messaging

| Scenario | Status | Message |
|---|---|---|
| Invalid `from` number | 400 | `Invalid phone number format` |
| `from` number not owned by namespace | 403 | `Phone number not associated with account` |
| `to` number blocked or on DNC list | 422 | `Destination number is blocked` |
| Message too long (>1600 chars for SMS) | 400 | `Message body exceeds maximum length` |
| Messaging template not found | 404 | `Template not found` |
| Attachment URL unreachable | 400 | `Media URL is not accessible` |

```javascript
try {
    await api.messaging.sms.send({
        from: '+1987654321', // number you don't own
        to: '+15551234567',
        message: 'Hello',
    });
} catch (err) {
    // err.status === 403
    // err.message === "Phone number not associated with account"
}
```

---

### Voice

| Scenario | Status | Message |
|---|---|---|
| Invalid `to` number | 400 | `Invalid phone number format` |
| No voice channel configured | 422 | `No voice channel available` |
| Call leg not found | 404 | `Call not found` |
| Attempting to transfer a completed call | 409 | `Call is not in an active state` |
| SIP credentials invalid | 401 | `SIP authentication failed` |

---

### Video

| Scenario | Status | Message |
|---|---|---|
| Room not found | 404 | `Video room not found` |
| Wrong room password | 401 | `Invalid room password` |
| Joining a closed room | 409 | `Room is no longer active` |
| Non-host trying to remove participant | 403 | `Only hosts can remove participants` |
| Analytics for non-existent room | 404 | `Meeting not found` |
| `mediaType` not `microphone` or `camera` | 400 | `Invalid media type` |

```javascript
try {
    await api.video.joinRoom('room-id', 'wrongpassword', 'user@example.com', 'Jane');
} catch (err) {
    if (err.status === 401) {
        console.error('Check the room password');
    }
}
```

---

### Objects (UOQL / Records)

| Scenario | Status | Message |
|---|---|---|
| Object type not found | 404 | `Object type not found` |
| Required field missing in create | 400 | `Missing required field: <field>` |
| Unique constraint violation | 409 | `Duplicate value for unique field` |
| Invalid UOQL syntax | 400 | `UOQL parse error: <detail>` |
| Expand detail type not found | 404 | `Expand detail not found` |
| Generated column expression error | 422 | `Invalid expression for generated column` |
| Attempting to write to a generated column | 422 | `Cannot write to a generated column` |
| Record not found | 404 | `Record not found` |

```javascript
// Handle UOQL query errors distinctly
try {
    const results = await api.objects.query({
        objectType: 'contacts',
        filter: 'invalidsyntax %%% broken',
    });
} catch (err) {
    if (err.status === 400 && err.message.includes('UOQL')) {
        console.error('Fix your query syntax:', err.body);
    }
}
```

---

### Phone Numbers & Porting

| Scenario | Status | Message |
|---|---|---|
| Number not portable | 422 | `Phone number is not portable` |
| Number already in porting order | 409 | `Number already exists in a porting order` |
| Incompatible number types in same order | 400 | `Cannot add these numbers to the existing porting order. Numbers differ in: country` |
| Porting order already submitted | 409 | `Cannot modify a submitted porting order` |
| Invalid FCC OCN | 400 | `Invalid carrier code` |
| LOA template not configured | 422 | `No LOA template configured for brand` |

```javascript
try {
    await api.phoneNumbers.checkPortability({
        phoneNumbers: ['+15551234567'],
        portingOrderId: 'order-with-uk-numbers',
    });
} catch (err) {
    if (err.status === 400 && err.message.includes('differ in')) {
        // Parse the compatibility message to tell user which grouping rule failed
        console.error(err.message);
        // "Cannot add these numbers to the existing porting order.
        //  Numbers differ in: country. Please create a separate porting order."
    }
}
```

---

### Storage

| Scenario | Status | Message |
|---|---|---|
| File not found | 404 | `File not found` |
| File too large | 400 | `File size exceeds maximum` |
| Unsupported MIME type | 400 | `Unsupported file type` |
| Storage quota exceeded | 422 | `Storage quota exceeded` |
| Accessing expired file | 410 | `File has expired` |

---

### Task Router

| Scenario | Status | Message |
|---|---|---|
| Queue not found | 404 | `Queue not found` |
| Agent not in queue | 422 | `Agent is not assigned to this queue` |
| Task already assigned | 409 | `Task is already assigned to an agent` |
| Completing an already-completed task | 409 | `Task is already completed` |
| Invalid task attributes | 400 | `Invalid task attributes` |

---

### AI

| Scenario | Status | Message |
|---|---|---|
| Model not available | 422 | `Model not available in this region` |
| Knowledge base not found | 404 | `Knowledge base not found` |
| Context window exceeded | 400 | `Input exceeds model context limit` |
| Streaming connection lost | — | Network/transport error (no `.status`) |

---

## Transport Errors

Unlike API errors, **transport errors** are thrown when the connection itself fails — before the server responds. These do **not** have a `.status` property.

```javascript
try {
    await api.messaging.sms.send({ ... });
} catch (err) {
    if (!err.status) {
        // Network failure, WebSocket disconnected, plugin unavailable, etc.
        console.error('Transport error:', err.message);
        // → "fetch failed", "WebSocket not connected", "ECONNREFUSED", etc.
    }
}
```

**Common transport errors:**

| Error message | Cause |
|---|---|
| `fetch failed` | No network / DNS failure |
| `ECONNREFUSED` | Server not accepting connections |
| `ETIMEDOUT` | Request timed out |
| `WebSocket not connected` | Realtime transport dropped |
| `Transport not available: <name>` | Configured plugin failed to initialize |

---

## Global Error Handler Pattern

For production apps, add a wrapper that normalizes all Unbound errors in one place:

```javascript
class UnboundClient {
    constructor(api) {
        this.api = api;
    }

    async call(fn, context = '') {
        try {
            return await fn();
        } catch (err) {
            const label = context ? `[${context}] ` : '';

            if (!err.status) {
                // Transport/SDK validation error
                console.error(`${label}SDK error:`, err.message);
                throw err;
            }

            switch (err.status) {
                case 400:
                    console.warn(`${label}Bad request:`, err.message, err.body);
                    break;
                case 401:
                    console.warn(`${label}Unauthorized — refreshing token...`);
                    await this.refreshToken();
                    return await fn(); // one retry
                case 403:
                    console.error(`${label}Forbidden:`, err.message);
                    break;
                case 404:
                    console.info(`${label}Not found:`, err.endpoint);
                    return null; // graceful
                case 429:
                    // caller should retry — re-throw
                    break;
                default:
                    console.error(`${label}API error [${err.status}]:`, err.message);
            }

            throw err;
        }
    }

    async refreshToken() {
        const { token } = await this.api.login.password({
            email: process.env.UNBOUND_EMAIL,
            password: process.env.UNBOUND_PASSWORD,
        });
        this.api.setToken(token);
    }
}

// Usage
const client = new UnboundClient(api);

const room = await client.call(
    () => api.video.describe('room-id'),
    'video.describe'
);
```

---

## Debugging with `debug()`

Enable SDK debug logging to see request/response details including request IDs:

```javascript
api.debug(true);

// Now every request logs:
// API :: https :: POST :: https://acme.api.unbound.cx/messaging/sms
//     :: 200 :: req-abc123 :: 142ms
//
// On error:
// API :: ERROR :: https :: POST :: https://acme.api.unbound.cx/messaging/sms
//     :: 400 :: req-abc123 :: 38ms
//     Error { status: 400, message: "Invalid phone number format", ... }
```

The request ID (`req-abc123`) can be provided to Unbound support to look up the exact server-side trace.

---

## Related

- [Error Handling guide](../sdk/error-handling) — basic patterns and retry logic
- [Rate Limits](./limits) — per-endpoint limits and quota details
- [SDK Authentication](../sdk/authentication) — token lifecycle and refresh
