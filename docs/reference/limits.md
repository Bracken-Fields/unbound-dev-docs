---
id: limits
title: Rate Limits & Quotas
sidebar_label: Rate Limits & Quotas
---

# Rate Limits & Quotas

Reference for API rate limits, pagination caps, payload size limits, and SDK pagination patterns.

---

## API Rate Limits

Unbound enforces per-namespace rate limits to ensure platform stability. Rate limit headers are returned on every API response.

### Response Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1711425600
Retry-After: 30
```

| Header | Description |
|---|---|
| `X-RateLimit-Limit` | Maximum requests allowed in the current window |
| `X-RateLimit-Remaining` | Requests remaining in the current window |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |
| `Retry-After` | Seconds to wait before retrying (present on 429 responses only) |

### Rate Limit Categories

| Category | Limit | Window |
|---|---|---|
| General API | 1,000 req/min | 1 minute |
| Messaging send | 100 req/min | 1 minute |
| Voice / call initiation | 60 req/min | 1 minute |
| AI / inference endpoints | 60 req/min | 1 minute |
| Storage upload | 30 req/min | 1 minute |
| Phone number porting | 30 req/min | 1 minute |
| Authentication | 20 req/min | 1 minute |

:::info
Limits above are defaults. Enterprise plans have higher limits. Contact [support@unbound.cx](mailto:support@unbound.cx) to request a quota increase.
:::

### Handling Rate Limits

When a 429 response is returned, back off and retry after the `Retry-After` interval:

```javascript
async function callWithRetry(fn, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (error.status === 429 && attempt < maxRetries - 1) {
                const retryAfter = parseInt(
                    error.headers?.['retry-after'] || '5',
                    10
                );
                console.log(`Rate limited. Retrying in ${retryAfter}s...`);
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                continue;
            }
            throw error;
        }
    }
}

// Usage
const messages = await callWithRetry(() =>
    sdk.messaging.listMessages({ conversationId: 'conv-123' })
);
```

**Exponential backoff for high-volume operations:**

```javascript
async function callWithBackoff(fn, maxRetries = 5) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (error.status !== 429 || attempt === maxRetries - 1) throw error;

            // Exponential backoff: 1s, 2s, 4s, 8s, 16s
            const delay = Math.pow(2, attempt) * 1000;
            const jitter = Math.random() * 500;
            await new Promise(resolve => setTimeout(resolve, delay + jitter));
        }
    }
}
```

---

## Pagination Limits

### Objects (UOQL Queries)

| Parameter | Default | Notes |
|---|---|---|
| `limit` | 100 | Number of rows returned |
| `offset` | 0 | Zero-based row offset |

```javascript
// Default: 100 rows starting at 0
const page1 = await sdk.objects.query({
    objectName: 'contacts',
});

// Custom pagination
const page2 = await sdk.objects.query({
    objectName: 'contacts',
    limit: 50,
    offset: 50,
});
```

**Full iteration pattern:**

```javascript
async function* fetchAllObjects(objectName, filters = {}) {
    const limit = 100;
    let offset = 0;

    while (true) {
        const page = await sdk.objects.query({
            objectName,
            ...filters,
            limit,
            offset,
        });

        const rows = page.data || page.rows || page;
        if (!rows || rows.length === 0) break;

        yield* rows;

        if (rows.length < limit) break; // Last page
        offset += limit;
    }
}

// Usage
for await (const contact of fetchAllObjects('contacts')) {
    console.log(contact.id, contact.name);
}
```

### Record Types

| Parameter | Default | Max |
|---|---|---|
| `limit` | 50 | 100 |
| `page` | 1 | — |

```javascript
const recordTypes = await sdk.recordTypes.list({
    limit: 100,
    page: 1,
});
```

### Storage Files

| Parameter | Default | Notes |
|---|---|---|
| `limit` | — | Not set by default |
| `offset` | 0 | Zero-based offset |

```javascript
const files = await sdk.storage.listFiles({
    folder: 'recordings',
    limit: 50,
    offset: 0,
});
```

### AI / Knowledge Base

| Parameter | Default | Notes |
|---|---|---|
| `limit` | 50 | Results per page |
| `offset` | 0 | Zero-based offset |

```javascript
const results = await sdk.ai.search({
    query: 'refund policy',
    limit: 10,
    offset: 0,
});
```

### Phone Numbers — Portability Check

| Constraint | Limit |
|---|---|
| Max numbers per `checkPortability()` call | 100 |

```javascript
// Check up to 100 numbers at once
await sdk.phoneNumbers.checkPortability({
    phoneNumbers: arrayOfUpTo100Numbers,
    portingOrderId: order.id,
});

// For larger batches, chunk them
const chunkSize = 100;
for (let i = 0; i < allNumbers.length; i += chunkSize) {
    const chunk = allNumbers.slice(i, i + chunkSize);
    await sdk.phoneNumbers.checkPortability({
        phoneNumbers: chunk,
        portingOrderId: order.id,
    });
}
```

---

## File Size Limits

### Storage Uploads

| File Type | Max Size | Notes |
|---|---|---|
| General files | 100 MB | Per file |
| Audio recordings | 500 MB | Per file |
| Images | 10 MB | Per file |
| Documents (PDF, etc.) | 50 MB | Per file |
| LOA documents (auto-generated) | — | Generated server-side; no client limit |

```javascript
// Single file upload
const result = await sdk.storage.upload({
    file: fileObject, // Max 100 MB
    folder: 'uploads',
    classification: 'document',
});

// Multiple files
const results = await sdk.storage.uploadFiles([file1, file2], {
    folder: 'recordings',
});
```

### Messaging Attachments

| Media Type | Max Size | Supported Formats |
|---|---|---|
| MMS image | 1.5 MB | JPEG, PNG, GIF |
| MMS video | 3.5 MB | MP4, 3GP |
| MMS audio | 3.5 MB | MP3, AMR, WAV |
| Email attachment | 25 MB | Any |

### AI / Knowledge Base

| Content Type | Max Size | Notes |
|---|---|---|
| Text chunk | 32 KB | Per document chunk |
| Document upload | 10 MB | Per knowledge base document |
| Transcription input | 500 MB | Audio file for STT |

---

## Request Payload Limits

| Limit | Value |
|---|---|
| JSON request body | 10 MB |
| GraphQL query depth | 10 levels |
| URL length | 8 KB |
| Header count | 100 headers |
| Custom header value length | 4 KB |

---

## Concurrent Connection Limits

| Connection Type | Limit | Notes |
|---|---|---|
| WebSocket connections | 100 per namespace | Voice/real-time streaming |
| gRPC streams | 50 per namespace | Proto streaming channels |
| Simultaneous active calls | Plan-dependent | Contact support |

---

## Timeout Defaults

| Operation | Default Timeout | Configurable? |
|---|---|---|
| REST API requests | 30 seconds | No (SDK default) |
| File uploads | 5 minutes | Progress via `onProgress` callback |
| gRPC streams | No timeout | Use `AbortController` to cancel |
| WebSocket connections | No timeout | Manual reconnect required |

**Cancelling long-running requests:**

```javascript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

try {
    const result = await sdk.storage.upload({
        file: largeFile,
        folder: 'recordings',
        signal: controller.signal,
        onProgress: ({ percent }) => console.log(`${percent}%`),
    });
    clearTimeout(timeout);
    return result;
} catch (error) {
    if (error.name === 'AbortError') {
        console.error('Upload timed out');
    }
    throw error;
}
```

---

## Quota Errors

When you exceed a quota, you'll receive one of these errors:

| HTTP Status | Error Code | Description |
|---|---|---|
| `429` | `RATE_LIMIT_EXCEEDED` | Too many requests; see `Retry-After` header |
| `413` | `PAYLOAD_TOO_LARGE` | Request body or file exceeds size limit |
| `507` | `STORAGE_QUOTA_EXCEEDED` | Namespace storage quota reached |

See the [Error Reference](/reference/errors) for full error handling details.

---

## Best Practices

**Batch operations when possible:**
```javascript
// ✅ Good: batch SMS sends
await sdk.messaging.sendBulk({
    messages: [
        { to: '+15551234567', body: 'Hello!' },
        { to: '+15559876543', body: 'Hello!' },
    ],
});

// ❌ Avoid: tight loop of individual sends
for (const number of numbers) {
    await sdk.messaging.send({ to: number, body: 'Hello!' }); // burns rate limit
}
```

**Cache lookup results:**
```javascript
// Cache phone number lookup results to avoid repeated calls
const lookupCache = new Map();

async function lookupNumber(phoneNumber) {
    if (lookupCache.has(phoneNumber)) {
        return lookupCache.get(phoneNumber);
    }
    const result = await sdk.lookup.phoneNumber(phoneNumber);
    lookupCache.set(phoneNumber, result);
    return result;
}
```

**Use webhooks over polling:**
```javascript
// ✅ Good: use webhooks for status updates
// Configure in Unbound dashboard → Webhooks

// ❌ Avoid: polling for status changes (wastes rate limit budget)
while (order.status !== 'complete') {
    await sleep(2000);
    order = await sdk.phoneNumbers.getPortingOrder(order.id);
}
```
