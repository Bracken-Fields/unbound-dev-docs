---
id: error-handling
title: Error Handling
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Error Handling

All SDK methods return Promises and throw a structured `Error` object on failure. Every error carries the HTTP status, method, endpoint, and full response body — giving you everything you need for logging, retrying, and presenting user-friendly messages.

For a complete list of error codes, see the [Error Reference](/reference/errors).

---

## Error Shape

```typescript
interface UnboundError extends Error {
    /** Human-readable error message from the API */
    message: string;

    /** HTTP status code: 400, 401, 403, 404, 409, 422, 429, 500, 503 */
    status: number;

    /** HTTP status text: "Bad Request", "Unauthorized", etc. */
    statusText: string;

    /** HTTP method: "GET", "POST", "PUT", "DELETE" */
    method: string;

    /** API endpoint: "/messaging/sms", "/object/contacts", etc. */
    endpoint: string;

    /** Full response body from the API (parsed object or raw string) */
    body: string | object;

    /** Composite name: "API :: Error :: https :: POST :: /messaging/sms :: 400 :: Bad Request" */
    name: string;
}
```

---

## Basic Error Handling

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'acme', token: process.env.UNBOUND_TOKEN });

try {
    const sms = await api.messaging.sms.send({
        from: '+18005551234',
        to:   '+12135550100',
        message: 'Hello!',
    });
    console.log('Sent:', sms.id);
} catch (err) {
    console.error('Status:',   err.status);      // 400
    console.error('Message:',  err.message);     // "Invalid phone number format"
    console.error('Endpoint:', err.endpoint);    // "/messaging/sms"
    console.error('Method:',   err.method);      // "POST"
    console.error('Body:',     err.body);        // { errors: [...] }
}
```

---

## HTTP Status Code Reference

| Status | Meaning | Typical Cause | Action |
|---|---|---|---|
| `400` | Bad Request | Missing or invalid parameters | Check `err.body.errors` for field-level detail |
| `401` | Unauthorized | Token missing, expired, or invalid | Re-authenticate; call `api.login.login()` |
| `403` | Forbidden | Insufficient permissions or wrong namespace | Check user role or namespace |
| `404` | Not Found | Resource doesn't exist or was deleted | Verify the ID; handle gracefully |
| `409` | Conflict | Duplicate record or state conflict | Check for existing resource before creating |
| `422` | Unprocessable Entity | Validation failed — semantically invalid input | Check `err.body.errors[]` for per-field messages |
| `429` | Too Many Requests | Rate limit exceeded | Back off; see `Retry-After` header |
| `500` | Internal Server Error | Unexpected server failure | Retry with backoff; contact support if persistent |
| `503` | Service Unavailable | Media server or downstream unavailable | Retry with exponential backoff |

---

## Status-Based Routing

Handle different error types with specific strategies:

```javascript
async function sendSms(params) {
    try {
        return await api.messaging.sms.send(params);
    } catch (err) {
        switch (err.status) {
            case 400:
            case 422:
                // Validation error — log details and surface to caller
                console.error('Validation errors:', err.body?.errors);
                throw new Error(`Invalid SMS parameters: ${err.message}`);

            case 401:
                // Token expired — re-authenticate and retry once
                await api.login.login(
                    process.env.UNBOUND_USER,
                    process.env.UNBOUND_PASS,
                );
                return api.messaging.sms.send(params);

            case 403:
                // Permission issue — cannot retry
                throw new Error(`Access denied: ${err.message}`);

            case 404:
                // Number not found — caller should handle
                return null;

            case 429: {
                // Rate limited — wait and retry
                const retryAfter = parseInt(err.body?.retryAfter || '1', 10);
                await sleep(retryAfter * 1000);
                return api.messaging.sms.send(params);
            }

            case 500:
            case 503:
                // Server error — retry with backoff
                await sleep(2000);
                return api.messaging.sms.send(params);

            default:
                throw err;
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
```

---

## Retry with Exponential Backoff

A production-grade retry wrapper covering transient failures and rate limits:

```javascript
/**
 * Retry an SDK call with exponential backoff.
 *
 * @param {Function} fn          - Async function to retry
 * @param {object}   opts
 * @param {number}   opts.maxRetries   - Maximum retry attempts (default: 3)
 * @param {number}   opts.baseDelay    - Initial delay in ms (default: 500)
 * @param {number}   opts.maxDelay     - Maximum delay cap in ms (default: 30000)
 * @param {number[]} opts.retryCodes   - HTTP codes that trigger a retry (default: [429, 500, 503])
 */
async function withRetry(fn, opts = {}) {
    const {
        maxRetries  = 3,
        baseDelay   = 500,
        maxDelay    = 30_000,
        retryCodes  = [429, 500, 503],
    } = opts;

    let lastErr;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastErr = err;

            if (!retryCodes.includes(err.status) || attempt === maxRetries) {
                throw err;
            }

            // Respect Retry-After header for 429s
            const retryAfterMs = err.status === 429
                ? (parseInt(err.body?.retryAfter || '1', 10) * 1000)
                : 0;

            const backoff = Math.min(
                retryAfterMs || baseDelay * Math.pow(2, attempt),
                maxDelay,
            );

            console.warn(
                `SDK attempt ${attempt + 1} failed (${err.status}). ` +
                `Retrying in ${backoff}ms...`
            );

            await new Promise((r) => setTimeout(r, backoff));
        }
    }

    throw lastErr;
}

// Usage
const contacts = await withRetry(() =>
    api.objects.query({ object: 'contacts', limit: 100 })
);
```

---

## Auth Refresh on 401

For long-running services that may encounter token expiry mid-operation:

```javascript
let isRefreshing = false;
let refreshPromise = null;

async function callWithAuthRefresh(fn) {
    try {
        return await fn();
    } catch (err) {
        if (err.status !== 401) throw err;

        // Prevent duplicate refresh calls (only one refresh in-flight at a time)
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = api.login.login(
                process.env.UNBOUND_USER,
                process.env.UNBOUND_PASS,
            ).finally(() => {
                isRefreshing = false;
                refreshPromise = null;
            });
        }

        await refreshPromise;

        // Retry once after refresh
        return fn();
    }
}

// Usage
const result = await callWithAuthRefresh(() =>
    api.objects.query({ object: 'contacts' })
);
```

---

## Validation Errors (400 / 422)

`400` and `422` errors often include a structured `errors` array in the body with per-field details:

```javascript
try {
    await api.objects.create({
        object: 'contacts',
        data: {
            firstName: '',      // required field left blank
            email: 'not-email', // invalid format
        },
    });
} catch (err) {
    if (err.status === 400 || err.status === 422) {
        // err.body.errors is an array of field-level problems
        for (const fieldError of err.body?.errors || []) {
            console.error(`Field '${fieldError.field}': ${fieldError.message}`);
        }
        // Field 'firstName': required
        // Field 'email': must be a valid email address
    }
}
```

---

## Client-Side Parameter Errors

The SDK validates required parameters before making any HTTP call. These throw a plain `Error` (not an `UnboundError`):

```javascript
try {
    await api.objects.query({ /* missing 'object' */ });
} catch (err) {
    // err.status is undefined — this is a local validation error
    console.error(err.message);
    // → "Missing required parameter object"
}
```

Distinguish local vs. remote errors:

```javascript
function isApiError(err) {
    return typeof err.status === 'number';
}

try {
    await api.objects.byId({ id: 'abc123' });
} catch (err) {
    if (isApiError(err)) {
        console.error(`API error ${err.status}: ${err.message}`);
    } else {
        console.error('SDK/parameter error:', err.message);
    }
}
```

---

## Error Logging Best Practices

### Structured Logging

Log all error fields to make debugging in production tractable:

```javascript
function logApiError(err, context = {}) {
    const entry = {
        ...context,
        error: {
            message:    err.message,
            status:     err.status,
            statusText: err.statusText,
            method:     err.method,
            endpoint:   err.endpoint,
            body:       err.body,
        },
        timestamp: new Date().toISOString(),
    };
    console.error(JSON.stringify(entry));
}

try {
    await api.voice.call({ to: '+12135550100', from: '+18005551234' });
} catch (err) {
    logApiError(err, { operation: 'outbound-call', customerId: 'cust_123' });
    throw err;
}
```

### Sentry / Error Trackers

Attach SDK error metadata as extra context:

```javascript
import * as Sentry from '@sentry/node';

try {
    await api.messaging.sms.send(params);
} catch (err) {
    Sentry.withScope((scope) => {
        scope.setExtra('status',   err.status);
        scope.setExtra('method',   err.method);
        scope.setExtra('endpoint', err.endpoint);
        scope.setExtra('body',     err.body);
        Sentry.captureException(err);
    });
    throw err;
}
```

---

## Global Error Handler

For Express.js or similar frameworks, a centralized handler converts SDK errors into HTTP responses:

```javascript
// Express error middleware
app.use((err, req, res, next) => {
    // Pass through non-SDK errors
    if (typeof err.status !== 'number') {
        return next(err);
    }

    // Map SDK status codes to appropriate response codes
    const responseCode = err.status === 404 ? 404
                       : err.status === 403 ? 403
                       : err.status >= 500  ? 502  // Bad Gateway
                       : 400;

    res.status(responseCode).json({
        error:    err.message,
        status:   err.status,
        endpoint: err.endpoint,
    });
});
```

---

## Testing Error Paths

Simulate SDK errors in Jest/Vitest tests:

```javascript
import { vi, describe, it, expect } from 'vitest';

describe('sendSms', () => {
    it('retries on 429', async () => {
        const mockSend = vi
            .fn()
            .mockRejectedValueOnce(
                Object.assign(new Error('Rate limited'), { status: 429, body: { retryAfter: '1' } })
            )
            .mockResolvedValueOnce({ id: 'sms_123' });

        vi.spyOn(api.messaging.sms, 'send').mockImplementation(mockSend);

        const result = await withRetry(() =>
            api.messaging.sms.send({ from: '+1...', to: '+1...', message: 'Hi' })
        );

        expect(result.id).toBe('sms_123');
        expect(mockSend).toHaveBeenCalledTimes(2);
    });

    it('throws immediately on 403', async () => {
        vi.spyOn(api.messaging.sms, 'send').mockRejectedValue(
            Object.assign(new Error('Forbidden'), { status: 403 })
        );

        await expect(
            withRetry(() => api.messaging.sms.send({ from: '+1...', to: '+1...', message: 'Hi' }))
        ).rejects.toMatchObject({ status: 403 });
    });
});
```

---

## Quick Reference

```javascript
// Catch and classify any SDK error
try {
    await api.someService.someMethod(params);
} catch (err) {
    if (!err.status) {
        // Local SDK validation error — bad params
    } else if (err.status === 401) {
        // Re-authenticate
    } else if (err.status === 403) {
        // Permission denied — cannot recover without role change
    } else if (err.status === 404) {
        // Resource not found — handle gracefully
    } else if (err.status === 429) {
        // Rate limited — back off
    } else if (err.status >= 500) {
        // Server error — retry with backoff
    } else {
        // 400/422 validation error — surface to user
    }
}
```

See the [Error Reference](/reference/errors) for a full listing of error codes, error shapes per service, and SDK-specific validation errors.
