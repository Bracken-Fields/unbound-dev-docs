---
id: error-handling
title: Error Handling
---

# Error Handling

All SDK methods return Promises and throw on API errors.

## Basic Pattern

```javascript
try {
    const sms = await api.messaging.sms.send({
        from: '+1234567890',
        to: '+0987654321',
        message: 'Hello!',
    });
} catch (error) {
    console.error('Name:', error.name);
    // → 'API :: Error :: https :: POST :: /messaging/sms :: ...'

    console.error('Message:', error.message);
    // → 'Invalid phone number format'

    console.error('Status:', error.status);
    // → 400

    console.error('Method:', error.method);
    // → 'POST'

    console.error('Endpoint:', error.endpoint);
    // → '/messaging/sms'
}
```

## Error Properties

| Property | Type | Description |
|---|---|---|
| `name` | string | Full error name including transport, method, and endpoint |
| `message` | string | Human-readable error description from the API |
| `status` | number | HTTP status code (400, 401, 403, 404, 500, etc.) |
| `method` | string | HTTP method that failed |
| `endpoint` | string | API endpoint that was called |

## Common Status Codes

| Code | Meaning |
|---|---|
| `400` | Bad request — check your parameters |
| `401` | Unauthorized — token is missing or expired |
| `403` | Forbidden — insufficient permissions for this namespace |
| `404` | Not found — resource doesn't exist |
| `429` | Rate limited — slow down requests |
| `500` | Server error — contact support if persistent |

## Retry Pattern

```javascript
async function withRetry(fn, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (err.status === 429 && i < retries - 1) {
                await new Promise(r => setTimeout(r, 1000 * (i + 1)));
                continue;
            }
            throw err;
        }
    }
}

const result = await withRetry(() => api.messaging.sms.send({ ... }));
```
