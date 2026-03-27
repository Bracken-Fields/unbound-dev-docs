---
id: faxes
title: Faxes
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Faxes

`api.messaging.fax` — Send, receive, and track fax transmissions over the PSTN.

Fax support is included for healthcare, legal, and finance workflows where fax remains a required delivery channel. Faxes are delivered as PDF or TIFF documents. Numbers must be fax-capable DID lines provisioned in your Unbound account.

---

## Fax Status Lifecycle

Every fax moves through a predictable sequence of states:

```
queued → sending → delivered
                ↘ failed
```

| Status | Description |
|---|---|
| `queued` | Fax accepted and queued for transmission |
| `sending` | Actively dialing and transmitting pages |
| `delivered` | All pages confirmed received by recipient machine |
| `failed` | Transmission failed — check `errorCode` for reason |

Use `messaging.fax.get(id)` to poll status, or subscribe to fax events via [Subscriptions](/api-reference/subscriptions).

---

## `messaging.fax.send(options)`

Send a fax document to a recipient fax number.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Send a PDF document
const fax = await api.messaging.fax.send({
    to: '+12135550100',
    from: '+18005551234',
    fileUrl: 'https://example.com/documents/referral.pdf',
});

console.log('Fax ID:', fax.id);
// → 'fax_abc123def456'
console.log('Status:', fax.status);
// → 'queued'

// Send with a media attachment
const faxWithAttachment = await api.messaging.fax.send({
    to: '+12135550100',
    from: '+18005551234',
    fileUrl: 'https://example.com/documents/cover-sheet.pdf',
    mediaUrl: 'https://example.com/documents/attachment.pdf',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/messaging/fax', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        to: '+12135550100',
        from: '+18005551234',
        fileUrl: 'https://example.com/documents/referral.pdf',
    }),
});

const fax = await response.json();
console.log('Fax ID:', fax.id);
console.log('Status:', fax.status);
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init('https://{namespace}.api.unbound.cx/messaging/fax');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'to'      => '+12135550100',
    'from'    => '+18005551234',
    'fileUrl' => 'https://example.com/documents/referral.pdf',
]));

$response = curl_exec($ch);
$fax = json_decode($response, true);
curl_close($ch);

echo 'Fax ID: ' . $fax['id'] . "\n";
echo 'Status: ' . $fax['status'] . "\n";
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/messaging/fax',
    headers={
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    json={
        'to':      '+12135550100',
        'from':    '+18005551234',
        'fileUrl': 'https://example.com/documents/referral.pdf',
    }
)

fax = response.json()
print(f"Fax ID: {fax['id']}")
print(f"Status: {fax['status']}")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "to":      "+12135550100",
  "from":    "+18005551234",
  "fileUrl": "https://example.com/documents/referral.pdf"
}
EOF
)

curl -X POST https://{namespace}.api.unbound.cx/messaging/fax \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `to` | string | ✓ | Recipient fax number in E.164 format (e.g. `+12135550100`) |
| `from` | string | ✓ | Sending fax number in E.164 format — must be a fax-capable DID in your account |
| `fileUrl` | string | — | Publicly accessible URL of the primary document to fax (PDF or TIFF) |
| `mediaUrl` | string | — | URL of a secondary media attachment to include after the primary document |

:::tip Document requirements
Documents must be publicly accessible (no auth required). PDF is the most reliable format. Multi-page PDFs are transmitted in page order. Maximum recommended file size: 20 MB.
:::

### Response

```javascript
{
    id: 'fax_abc123def456',
    to: '+12135550100',
    from: '+18005551234',
    status: 'queued',              // 'queued' | 'sending' | 'delivered' | 'failed'
    direction: 'outbound',
    fileUrl: 'https://example.com/documents/referral.pdf',
    mediaUrl: null,
    pages: null,                   // populated after delivery
    duration: null,                // transmission duration in seconds, populated after delivery
    errorCode: null,               // populated on failure
    errorMessage: null,
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
}
```

### Error Codes

| HTTP Status | Cause | Resolution |
|---|---|---|
| `400` | Invalid `to` or `from` number | Ensure both are in E.164 format |
| `400` | `fileUrl` not reachable | Make the document publicly accessible |
| `403` | `from` number not in your account | Provision a fax-capable DID first |
| `422` | Document format unsupported | Convert to PDF or TIFF |
| `429` | Rate limit exceeded | Back off and retry — see [Limits](/reference/limits) |

---

## `messaging.fax.list(options?)`

List sent and received faxes with optional filters and pagination.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// All recent faxes (default limit 25)
const faxes = await api.messaging.fax.list();

// Filter to outbound only, last 50
const outbound = await api.messaging.fax.list({
    direction: 'outbound',
    limit: 50,
});

// Filter to inbound faxes received on a specific number
const inbound = await api.messaging.fax.list({
    direction: 'inbound',
    to: '+18005551234',
    limit: 100,
});

// Filter by status — find all failures
const failed = await api.messaging.fax.list({
    status: 'failed',
    limit: 100,
});

// Paginate with cursor
const page1 = await api.messaging.fax.list({ limit: 25 });
const page2 = await api.messaging.fax.list({
    limit: 25,
    before: page1.data[page1.data.length - 1].id,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// All recent faxes
const response = await fetch('https://{namespace}.api.unbound.cx/messaging/fax?limit=25', {
    headers: { 'Authorization': 'Bearer {token}' },
});
const faxes = await response.json();

// Outbound only
const outboundRes = await fetch(
    'https://{namespace}.api.unbound.cx/messaging/fax?direction=outbound&limit=50',
    { headers: { 'Authorization': 'Bearer {token}' } }
);
const outbound = await outboundRes.json();

// Failed faxes
const failedRes = await fetch(
    'https://{namespace}.api.unbound.cx/messaging/fax?status=failed&limit=100',
    { headers: { 'Authorization': 'Bearer {token}' } }
);
const failed = await failedRes.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// All recent faxes
$ch = curl_init('https://{namespace}.api.unbound.cx/messaging/fax?limit=25');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
$faxes = json_decode(curl_exec($ch), true);
curl_close($ch);

// Outbound only, paginated
$ch = curl_init('https://{namespace}.api.unbound.cx/messaging/fax?direction=outbound&limit=50');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
$outbound = json_decode(curl_exec($ch), true);
curl_close($ch);

// Failed faxes
$ch = curl_init('https://{namespace}.api.unbound.cx/messaging/fax?status=failed&limit=100');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
$failed = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

headers = {'Authorization': 'Bearer {token}'}

# All recent faxes
response = requests.get(
    'https://{namespace}.api.unbound.cx/messaging/fax',
    headers=headers,
    params={'limit': 25}
)
faxes = response.json()

# Outbound only
response = requests.get(
    'https://{namespace}.api.unbound.cx/messaging/fax',
    headers=headers,
    params={'direction': 'outbound', 'limit': 50}
)
outbound = response.json()

# Failed faxes
response = requests.get(
    'https://{namespace}.api.unbound.cx/messaging/fax',
    headers=headers,
    params={'status': 'failed', 'limit': 100}
)
failed = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# All recent faxes
curl "https://{namespace}.api.unbound.cx/messaging/fax?limit=25" \
  -H "Authorization: Bearer {token}"

# Outbound only
curl "https://{namespace}.api.unbound.cx/messaging/fax?direction=outbound&limit=50" \
  -H "Authorization: Bearer {token}"

# Failed faxes
curl "https://{namespace}.api.unbound.cx/messaging/fax?status=failed&limit=100" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | number | `25` | Max records to return (max: 100) |
| `before` | string | — | Return faxes before this fax ID (cursor pagination) |
| `after` | string | — | Return faxes after this fax ID (cursor pagination) |
| `direction` | `'inbound'` \| `'outbound'` | — | Filter by transmission direction |
| `status` | `'queued'` \| `'sending'` \| `'delivered'` \| `'failed'` | — | Filter by current status |
| `to` | string | — | Filter by recipient number (E.164) |
| `from` | string | — | Filter by sender number (E.164) |

### Response

```javascript
{
    data: [
        {
            id: 'fax_abc123def456',
            to: '+12135550100',
            from: '+18005551234',
            status: 'delivered',
            direction: 'outbound',
            fileUrl: 'https://example.com/documents/referral.pdf',
            mediaUrl: null,
            pages: 3,
            duration: 47,                  // seconds
            errorCode: null,
            errorMessage: null,
            createdAt: '2024-03-15T10:30:00Z',
            updatedAt: '2024-03-15T10:31:12Z',
        },
        {
            id: 'fax_xyz789uvw012',
            to: '+18005551234',
            from: '+19175550199',
            status: 'delivered',
            direction: 'inbound',
            fileUrl: 'https://storage.unbound.cx/fax/xyz789uvw012.pdf',
            mediaUrl: null,
            pages: 1,
            duration: 18,
            errorCode: null,
            errorMessage: null,
            createdAt: '2024-03-15T09:45:00Z',
            updatedAt: '2024-03-15T09:45:22Z',
        },
        // ...
    ],
    meta: {
        total: 142,
        limit: 25,
        hasMore: true,
    }
}
```

---

## `messaging.fax.get(id)`

Fetch a single fax by ID. Use this to poll delivery status after `send()`.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const fax = await api.messaging.fax.get('fax_abc123def456');

console.log(fax.status);
// 'queued' | 'sending' | 'delivered' | 'failed'

console.log(fax.pages);
// 3  (null until delivery completes)

console.log(fax.duration);
// 47  (seconds, null until delivery completes)

// On failure
if (fax.status === 'failed') {
    console.log(fax.errorCode);
    // e.g. 'NO_ANSWER', 'BUSY', 'FAX_NOT_DETECTED', 'LINE_ERROR'
    console.log(fax.errorMessage);
    // Human-readable failure description
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch(
    'https://{namespace}.api.unbound.cx/messaging/fax/fax_abc123def456',
    { headers: { 'Authorization': 'Bearer {token}' } }
);

const fax = await response.json();

if (fax.status === 'failed') {
    console.error('Fax failed:', fax.errorCode, fax.errorMessage);
} else if (fax.status === 'delivered') {
    console.log(`Delivered: ${fax.pages} pages in ${fax.duration}s`);
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init('https://{namespace}.api.unbound.cx/messaging/fax/fax_abc123def456');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
$fax = json_decode(curl_exec($ch), true);
curl_close($ch);

if ($fax['status'] === 'failed') {
    error_log('Fax failed: ' . $fax['errorCode'] . ' - ' . $fax['errorMessage']);
} elseif ($fax['status'] === 'delivered') {
    echo "Delivered: {$fax['pages']} pages in {$fax['duration']}s\n";
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/messaging/fax/fax_abc123def456',
    headers={'Authorization': 'Bearer {token}'}
)
fax = response.json()

if fax['status'] == 'failed':
    print(f"Fax failed: {fax['errorCode']} — {fax['errorMessage']}")
elif fax['status'] == 'delivered':
    print(f"Delivered: {fax['pages']} pages in {fax['duration']}s")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/messaging/fax/fax_abc123def456" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### Response

```javascript
{
    id: 'fax_abc123def456',
    to: '+12135550100',
    from: '+18005551234',
    status: 'delivered',           // 'queued' | 'sending' | 'delivered' | 'failed'
    direction: 'outbound',         // 'outbound' | 'inbound'
    fileUrl: 'https://example.com/documents/referral.pdf',
    mediaUrl: null,
    pages: 3,                      // null until delivered
    duration: 47,                  // seconds — null until delivered
    errorCode: null,               // see Error Codes below
    errorMessage: null,
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:31:12Z',
}
```

### Fax Error Codes

When `status` is `'failed'`, the `errorCode` field will contain one of:

| Error Code | Description | Retry? |
|---|---|---|
| `NO_ANSWER` | Recipient did not answer within timeout | ✓ Yes |
| `BUSY` | Recipient line was busy | ✓ Yes |
| `FAX_NOT_DETECTED` | Call connected but no fax tone detected (wrong number, voicemail, etc.) | ✓ Maybe |
| `LINE_ERROR` | Line quality too poor to complete transmission | ✓ Yes |
| `DOCUMENT_ERROR` | Could not download or render the source document | ✗ Fix document URL |
| `INVALID_NUMBER` | Dialed number is not valid or not reachable | ✗ Verify number |
| `CARRIER_REJECTED` | Carrier blocked the transmission | ✗ Contact support |
| `TIMEOUT` | Transmission exceeded maximum allowed duration | ✓ Try smaller document |

---

## Common Patterns

### Pattern 1 — Poll until delivered (with timeout)

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function sendAndWait(options, { pollIntervalMs = 5000, timeoutMs = 300000 } = {}) {
    // Send the fax
    const fax = await api.messaging.fax.send(options);
    const startTime = Date.now();

    // Poll until terminal state or timeout
    while (Date.now() - startTime < timeoutMs) {
        const current = await api.messaging.fax.get(fax.id);

        if (current.status === 'delivered') {
            console.log(`Delivered: ${current.pages} pages in ${current.duration}s`);
            return current;
        }

        if (current.status === 'failed') {
            throw new Error(`Fax failed: ${current.errorCode} — ${current.errorMessage}`);
        }

        // Still in-progress; wait before polling again
        await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }

    throw new Error(`Fax ${fax.id} did not complete within ${timeoutMs / 1000}s`);
}

// Usage
const result = await sendAndWait({
    to: '+12135550100',
    from: '+18005551234',
    fileUrl: 'https://example.com/referral.pdf',
});
console.log('Fax confirmed:', result.id, result.status);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function sendAndWait(payload, { pollIntervalMs = 5000, timeoutMs = 300000 } = {}) {
    // Send the fax
    const sendRes = await fetch('https://{namespace}.api.unbound.cx/messaging/fax', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const fax = await sendRes.json();
    const startTime = Date.now();

    // Poll until terminal state or timeout
    while (Date.now() - startTime < timeoutMs) {
        const pollRes = await fetch(
            `https://{namespace}.api.unbound.cx/messaging/fax/${fax.id}`,
            { headers: { 'Authorization': 'Bearer {token}' } }
        );
        const current = await pollRes.json();

        if (current.status === 'delivered') {
            console.log(`Delivered: ${current.pages} pages in ${current.duration}s`);
            return current;
        }

        if (current.status === 'failed') {
            throw new Error(`Fax failed: ${current.errorCode} — ${current.errorMessage}`);
        }

        await new Promise(r => setTimeout(r, pollIntervalMs));
    }

    throw new Error(`Fax ${fax.id} timed out after ${timeoutMs / 1000}s`);
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function sendAndWait($payload, $pollIntervalMs = 5000, $timeoutMs = 300000) {
    // Send the fax
    $ch = curl_init('https://{namespace}.api.unbound.cx/messaging/fax');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}', 'Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    $fax = json_decode(curl_exec($ch), true);
    curl_close($ch);

    $startTime = microtime(true) * 1000;

    // Poll until terminal state or timeout
    while ((microtime(true) * 1000 - $startTime) < $timeoutMs) {
        usleep($pollIntervalMs * 1000);

        $ch = curl_init("https://{namespace}.api.unbound.cx/messaging/fax/{$fax['id']}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
        $current = json_decode(curl_exec($ch), true);
        curl_close($ch);

        if ($current['status'] === 'delivered') {
            echo "Delivered: {$current['pages']} pages in {$current['duration']}s\n";
            return $current;
        }

        if ($current['status'] === 'failed') {
            throw new Exception("Fax failed: {$current['errorCode']} — {$current['errorMessage']}");
        }
    }

    throw new Exception("Fax {$fax['id']} timed out");
}

// Usage
$result = sendAndWait([
    'to'      => '+12135550100',
    'from'    => '+18005551234',
    'fileUrl' => 'https://example.com/referral.pdf',
]);
echo "Confirmed: {$result['id']}\n";
```

</TabItem>
<TabItem value="python" label="Python">

```python
import time
import requests

def send_and_wait(payload, poll_interval_s=5, timeout_s=300):
    # Send the fax
    response = requests.post(
        'https://{namespace}.api.unbound.cx/messaging/fax',
        headers={'Authorization': 'Bearer {token}'},
        json=payload
    )
    fax = response.json()
    start = time.time()

    # Poll until terminal state or timeout
    while time.time() - start < timeout_s:
        time.sleep(poll_interval_s)

        poll = requests.get(
            f"https://{{namespace}}.api.unbound.cx/messaging/fax/{fax['id']}",
            headers={'Authorization': 'Bearer {token}'}
        )
        current = poll.json()

        if current['status'] == 'delivered':
            print(f"Delivered: {current['pages']} pages in {current['duration']}s")
            return current

        if current['status'] == 'failed':
            raise Exception(f"Fax failed: {current['errorCode']} — {current['errorMessage']}")

    raise TimeoutError(f"Fax {fax['id']} timed out after {timeout_s}s")

# Usage
result = send_and_wait({
    'to':      '+12135550100',
    'from':    '+18005551234',
    'fileUrl': 'https://example.com/referral.pdf',
})
print(f"Confirmed: {result['id']}")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Step 1: Send the fax
RESPONSE=$(curl -s -X POST https://{namespace}.api.unbound.cx/messaging/fax \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"to":"+12135550100","from":"+18005551234","fileUrl":"https://example.com/referral.pdf"}')

FAX_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
echo "Fax ID: $FAX_ID"

# Step 2: Poll until delivered or failed
for i in $(seq 1 60); do
  sleep 5
  STATUS=$(curl -s "https://{namespace}.api.unbound.cx/messaging/fax/$FAX_ID" \
    -H "Authorization: Bearer {token}" | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])")
  echo "Status: $STATUS"
  if [ "$STATUS" = "delivered" ] || [ "$STATUS" = "failed" ]; then
    break
  fi
done
```

</TabItem>
</Tabs>

---

### Pattern 2 — Retry failed faxes with exponential backoff

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const RETRYABLE_ERRORS = ['NO_ANSWER', 'BUSY', 'LINE_ERROR', 'TIMEOUT'];

async function sendWithRetry(options, maxRetries = 3) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        if (attempt > 0) {
            // Exponential backoff: 30s, 60s, 120s
            const waitMs = 30000 * Math.pow(2, attempt - 1);
            console.log(`Retry ${attempt}/${maxRetries} in ${waitMs / 1000}s...`);
            await new Promise(r => setTimeout(r, waitMs));
        }

        const fax = await api.messaging.fax.send(options);

        // Poll for result
        let current;
        for (let poll = 0; poll < 60; poll++) {
            await new Promise(r => setTimeout(r, 5000));
            current = await api.messaging.fax.get(fax.id);
            if (current.status === 'delivered' || current.status === 'failed') break;
        }

        if (current.status === 'delivered') {
            return current;
        }

        lastError = current;
        const isRetryable = RETRYABLE_ERRORS.includes(current.errorCode);
        if (!isRetryable) {
            throw new Error(`Non-retryable fax failure: ${current.errorCode}`);
        }

        console.warn(`Attempt ${attempt + 1} failed (${current.errorCode})`);
    }

    throw new Error(`Fax failed after ${maxRetries + 1} attempts: ${lastError?.errorCode}`);
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const RETRYABLE_ERRORS = ['NO_ANSWER', 'BUSY', 'LINE_ERROR', 'TIMEOUT'];

async function sendWithRetry(payload, maxRetries = 3) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        if (attempt > 0) {
            const waitMs = 30000 * Math.pow(2, attempt - 1);
            await new Promise(r => setTimeout(r, waitMs));
        }

        const sendRes = await fetch('https://{namespace}.api.unbound.cx/messaging/fax', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const fax = await sendRes.json();

        // Poll for result
        let current;
        for (let i = 0; i < 60; i++) {
            await new Promise(r => setTimeout(r, 5000));
            const pollRes = await fetch(
                `https://{namespace}.api.unbound.cx/messaging/fax/${fax.id}`,
                { headers: { 'Authorization': 'Bearer {token}' } }
            );
            current = await pollRes.json();
            if (current.status === 'delivered' || current.status === 'failed') break;
        }

        if (current.status === 'delivered') return current;

        lastError = current;
        if (!RETRYABLE_ERRORS.includes(current.errorCode)) {
            throw new Error(`Non-retryable: ${current.errorCode}`);
        }
    }

    throw new Error(`Failed after ${maxRetries + 1} attempts: ${lastError?.errorCode}`);
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$retryableErrors = ['NO_ANSWER', 'BUSY', 'LINE_ERROR', 'TIMEOUT'];

function sendWithRetry($payload, $maxRetries = 3) {
    global $retryableErrors;
    $lastError = null;

    for ($attempt = 0; $attempt <= $maxRetries; $attempt++) {
        if ($attempt > 0) {
            $waitSeconds = 30 * pow(2, $attempt - 1);
            sleep($waitSeconds);
        }

        $ch = curl_init('https://{namespace}.api.unbound.cx/messaging/fax');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}', 'Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        $fax = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $current = null;
        for ($i = 0; $i < 60; $i++) {
            sleep(5);
            $ch = curl_init("https://{namespace}.api.unbound.cx/messaging/fax/{$fax['id']}");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
            $current = json_decode(curl_exec($ch), true);
            curl_close($ch);
            if (in_array($current['status'], ['delivered', 'failed'])) break;
        }

        if ($current['status'] === 'delivered') return $current;

        $lastError = $current;
        if (!in_array($current['errorCode'], $retryableErrors)) {
            throw new Exception("Non-retryable: {$current['errorCode']}");
        }
    }

    throw new Exception("Failed after " . ($maxRetries + 1) . " attempts: {$lastError['errorCode']}");
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import time
import requests

RETRYABLE_ERRORS = {'NO_ANSWER', 'BUSY', 'LINE_ERROR', 'TIMEOUT'}

def send_with_retry(payload, max_retries=3):
    last_error = None

    for attempt in range(max_retries + 1):
        if attempt > 0:
            wait_s = 30 * (2 ** (attempt - 1))  # 30s, 60s, 120s
            print(f"Retry {attempt}/{max_retries} in {wait_s}s...")
            time.sleep(wait_s)

        # Send
        res = requests.post(
            'https://{namespace}.api.unbound.cx/messaging/fax',
            headers={'Authorization': 'Bearer {token}'},
            json=payload
        )
        fax = res.json()

        # Poll
        current = None
        for _ in range(60):
            time.sleep(5)
            poll = requests.get(
                f"https://{{namespace}}.api.unbound.cx/messaging/fax/{fax['id']}",
                headers={'Authorization': 'Bearer {token}'}
            )
            current = poll.json()
            if current['status'] in ('delivered', 'failed'):
                break

        if current['status'] == 'delivered':
            return current

        last_error = current
        if current.get('errorCode') not in RETRYABLE_ERRORS:
            raise Exception(f"Non-retryable failure: {current.get('errorCode')}")

    raise Exception(f"Failed after {max_retries + 1} attempts: {last_error.get('errorCode')}")
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Retry logic is best handled in a script language.
# cURL example for the underlying API calls is identical to Pattern 1.
# Wire up retry loop in your shell or calling language.
echo "Use SDK, Node.js, PHP, or Python tab for retry logic."
```

</TabItem>
</Tabs>

---

### Pattern 3 — Inbound fax webhook handler

Receive inbound faxes by subscribing to `fax.received` events. Configure your webhook in the Subscriptions settings, then handle the payload:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Express.js webhook handler
import express from 'express';

const app = express();
app.use(express.json());

app.post('/webhooks/fax', async (req, res) => {
    const event = req.body;

    // Verify it's a fax event
    if (event.type !== 'fax.received') {
        return res.sendStatus(200);
    }

    const fax = event.data;
    console.log('Inbound fax received:', {
        id:        fax.id,
        from:      fax.from,
        to:        fax.to,
        pages:     fax.pages,
        fileUrl:   fax.fileUrl,   // PDF download URL
        receivedAt: fax.createdAt,
    });

    // Download and store the PDF
    const response = await fetch(fax.fileUrl, {
        headers: { 'Authorization': 'Bearer {token}' },
    });
    const pdfBuffer = await response.arrayBuffer();
    await saveFaxToStorage(fax.id, Buffer.from(pdfBuffer));

    // Route to the right team based on DID
    const routing = {
        '+18005551234': 'billing',
        '+18005555678': 'clinical',
        '+18005559999': 'admin',
    };
    const department = routing[fax.to] ?? 'general';
    await notifyDepartment(department, fax);

    res.sendStatus(200);
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
import http from 'http';

const server = http.createServer(async (req, res) => {
    if (req.method !== 'POST' || req.url !== '/webhooks/fax') {
        res.writeHead(404);
        res.end();
        return;
    }

    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
        const event = JSON.parse(body);

        if (event.type === 'fax.received') {
            const fax = event.data;
            console.log('Inbound fax:', fax.id, 'from', fax.from, `(${fax.pages} pages)`);

            // Download the fax PDF
            const pdfRes = await fetch(fax.fileUrl, {
                headers: { 'Authorization': 'Bearer {token}' },
            });
            const pdf = await pdfRes.arrayBuffer();
            // Save to disk, S3, etc.

            // Log to your CRM
            await fetch('https://{namespace}.api.unbound.cx/object/inbound_faxes', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    faxId:      fax.id,
                    fromNumber: fax.from,
                    toNumber:   fax.to,
                    pages:      fax.pages,
                    fileUrl:    fax.fileUrl,
                    receivedAt: fax.createdAt,
                }),
            });
        }

        res.writeHead(200);
        res.end();
    });
});

server.listen(3000);
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// webhook.php
$payload = file_get_contents('php://input');
$event = json_decode($payload, true);

if ($event['type'] !== 'fax.received') {
    http_response_code(200);
    exit;
}

$fax = $event['data'];

// Download the fax PDF
$ch = curl_init($fax['fileUrl']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
$pdfContent = curl_exec($ch);
curl_close($ch);

// Save to storage
file_put_contents("/var/faxes/{$fax['id']}.pdf", $pdfContent);

// Log to your CRM
$ch = curl_init('https://{namespace}.api.unbound.cx/object/inbound_faxes');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}', 'Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'faxId'      => $fax['id'],
    'fromNumber' => $fax['from'],
    'toNumber'   => $fax['to'],
    'pages'      => $fax['pages'],
    'fileUrl'    => $fax['fileUrl'],
    'receivedAt' => $fax['createdAt'],
]));
curl_exec($ch);
curl_close($ch);

http_response_code(200);
```

</TabItem>
<TabItem value="python" label="Python">

```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/webhooks/fax', methods=['POST'])
def fax_webhook():
    event = request.json

    if event.get('type') != 'fax.received':
        return '', 200

    fax = event['data']
    print(f"Inbound fax {fax['id']} from {fax['from']} ({fax['pages']} pages)")

    # Download the fax PDF
    pdf_res = requests.get(
        fax['fileUrl'],
        headers={'Authorization': 'Bearer {token}'}
    )
    with open(f"/var/faxes/{fax['id']}.pdf", 'wb') as f:
        f.write(pdf_res.content)

    # Log to CRM
    requests.post(
        'https://{namespace}.api.unbound.cx/object/inbound_faxes',
        headers={'Authorization': 'Bearer {token}'},
        json={
            'faxId':      fax['id'],
            'fromNumber': fax['from'],
            'toNumber':   fax['to'],
            'pages':      fax['pages'],
            'fileUrl':    fax['fileUrl'],
            'receivedAt': fax['createdAt'],
        }
    )

    return '', 200

if __name__ == '__main__':
    app.run(port=3000)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Inbound webhooks are server-side receivers, not cURL calls.
# Subscribe to fax events in the Subscriptions dashboard or via API:

DATA=$(cat <<'EOF'
{
  "url":    "https://yourapp.example.com/webhooks/fax",
  "events": ["fax.received", "fax.delivered", "fax.failed"]
}
EOF
)

curl -X POST https://{namespace}.api.unbound.cx/subscriptions \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

### Pattern 4 — Fax blast to a contact list

Send the same document to multiple recipients with rate control:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function faxBlast(recipients, fileUrl, fromNumber, { delayMs = 2000 } = {}) {
    const results = [];

    for (const recipient of recipients) {
        try {
            const fax = await api.messaging.fax.send({
                to: recipient.faxNumber,
                from: fromNumber,
                fileUrl,
            });

            results.push({ recipient, faxId: fax.id, status: 'queued' });
            console.log(`Queued fax to ${recipient.name}: ${fax.id}`);
        } catch (err) {
            results.push({ recipient, faxId: null, status: 'error', error: err.message });
            console.error(`Failed to queue fax to ${recipient.name}: ${err.message}`);
        }

        // Throttle — avoid sending too many in parallel
        await new Promise(r => setTimeout(r, delayMs));
    }

    return results;
}

// Usage
const recipients = [
    { name: 'Dr. Smith Clinic',      faxNumber: '+12135550100' },
    { name: 'Riverside Medical',     faxNumber: '+13105550200' },
    { name: 'Valley Health Partners', faxNumber: '+16195550300' },
];

const results = await faxBlast(
    recipients,
    'https://example.com/policy-update.pdf',
    '+18005551234',
    { delayMs: 3000 }
);

// Check results
const failed = results.filter(r => r.status === 'error');
if (failed.length > 0) {
    console.warn('Failed to queue:', failed.map(r => r.recipient.name));
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function faxBlast(recipients, fileUrl, fromNumber, delayMs = 2000) {
    const results = [];

    for (const recipient of recipients) {
        try {
            const res = await fetch('https://{namespace}.api.unbound.cx/messaging/fax', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: recipient.faxNumber,
                    from: fromNumber,
                    fileUrl,
                }),
            });
            const fax = await res.json();
            results.push({ recipient, faxId: fax.id, status: 'queued' });
        } catch (err) {
            results.push({ recipient, faxId: null, status: 'error', error: err.message });
        }

        await new Promise(r => setTimeout(r, delayMs));
    }

    return results;
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function faxBlast($recipients, $fileUrl, $fromNumber, $delayMs = 2000) {
    $results = [];

    foreach ($recipients as $recipient) {
        $ch = curl_init('https://{namespace}.api.unbound.cx/messaging/fax');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}', 'Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'to'      => $recipient['faxNumber'],
            'from'    => $fromNumber,
            'fileUrl' => $fileUrl,
        ]));
        $fax = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $results[] = ['recipient' => $recipient, 'faxId' => $fax['id'], 'status' => 'queued'];
        echo "Queued fax to {$recipient['name']}: {$fax['id']}\n";

        usleep($delayMs * 1000);
    }

    return $results;
}

// Usage
$recipients = [
    ['name' => 'Dr. Smith Clinic',       'faxNumber' => '+12135550100'],
    ['name' => 'Riverside Medical',      'faxNumber' => '+13105550200'],
    ['name' => 'Valley Health Partners', 'faxNumber' => '+16195550300'],
];

$results = faxBlast($recipients, 'https://example.com/policy-update.pdf', '+18005551234');
```

</TabItem>
<TabItem value="python" label="Python">

```python
import time
import requests

def fax_blast(recipients, file_url, from_number, delay_s=2):
    results = []

    for recipient in recipients:
        try:
            res = requests.post(
                'https://{namespace}.api.unbound.cx/messaging/fax',
                headers={'Authorization': 'Bearer {token}'},
                json={
                    'to':      recipient['faxNumber'],
                    'from':    from_number,
                    'fileUrl': file_url,
                }
            )
            fax = res.json()
            results.append({'recipient': recipient, 'faxId': fax['id'], 'status': 'queued'})
            print(f"Queued fax to {recipient['name']}: {fax['id']}")
        except Exception as e:
            results.append({'recipient': recipient, 'faxId': None, 'status': 'error', 'error': str(e)})

        time.sleep(delay_s)

    return results

# Usage
recipients = [
    {'name': 'Dr. Smith Clinic',       'faxNumber': '+12135550100'},
    {'name': 'Riverside Medical',      'faxNumber': '+13105550200'},
    {'name': 'Valley Health Partners', 'faxNumber': '+16195550300'},
]

results = fax_blast(recipients, 'https://example.com/policy-update.pdf', '+18005551234')
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Loop through recipients in a shell script
FROM="+18005551234"
FILE_URL="https://example.com/policy-update.pdf"

for TO in "+12135550100" "+13105550200" "+16195550300"; do
  RESULT=$(curl -s -X POST https://{namespace}.api.unbound.cx/messaging/fax \
    -H "Authorization: Bearer {token}" \
    -H "Content-Type: application/json" \
    -d "{\"to\":\"$TO\",\"from\":\"$FROM\",\"fileUrl\":\"$FILE_URL\"}")
  echo "Queued to $TO: $(echo $RESULT | python3 -c 'import sys,json; print(json.load(sys.stdin)["id"])')"
  sleep 3
done
```

</TabItem>
</Tabs>

---

### Pattern 5 — Fax delivery report dashboard

Pull recent fax history and compute a delivery summary:

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
async function faxDeliveryReport(options = {}) {
    const allFaxes = [];
    let before = undefined;

    // Paginate through all outbound faxes
    do {
        const page = await api.messaging.fax.list({
            direction: 'outbound',
            limit: 100,
            before,
            ...options,
        });

        allFaxes.push(...page.data);
        before = page.meta.hasMore ? page.data[page.data.length - 1].id : undefined;
    } while (before);

    // Compute stats
    const stats = allFaxes.reduce((acc, fax) => {
        acc[fax.status] = (acc[fax.status] ?? 0) + 1;
        return acc;
    }, {});

    const total = allFaxes.length;
    const deliveredPct = ((stats.delivered ?? 0) / total * 100).toFixed(1);
    const failedPct    = ((stats.failed ?? 0) / total * 100).toFixed(1);
    const avgPages     = (allFaxes
        .filter(f => f.pages)
        .reduce((sum, f) => sum + f.pages, 0) / (stats.delivered ?? 1)).toFixed(1);

    // Top error codes
    const errors = allFaxes
        .filter(f => f.errorCode)
        .reduce((acc, f) => {
            acc[f.errorCode] = (acc[f.errorCode] ?? 0) + 1;
            return acc;
        }, {});

    return {
        total,
        delivered:      stats.delivered ?? 0,
        failed:         stats.failed ?? 0,
        queued:         stats.queued ?? 0,
        sending:        stats.sending ?? 0,
        deliveredPct:   `${deliveredPct}%`,
        failedPct:      `${failedPct}%`,
        avgPagesDelivered: parseFloat(avgPages),
        topErrors:      Object.entries(errors)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5),
    };
}

// Usage
const report = await faxDeliveryReport();
console.table(report);
// {
//   total: 847,
//   delivered: 791,
//   failed: 56,
//   queued: 0,
//   sending: 0,
//   deliveredPct: '93.4%',
//   failedPct: '6.6%',
//   avgPagesDelivered: 2.3,
//   topErrors: [['NO_ANSWER', 28], ['BUSY', 14], ['FAX_NOT_DETECTED', 8], ...]
// }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
async function faxDeliveryReport() {
    const allFaxes = [];
    let before = undefined;

    do {
        const params = new URLSearchParams({ direction: 'outbound', limit: '100' });
        if (before) params.set('before', before);

        const res = await fetch(
            `https://{namespace}.api.unbound.cx/messaging/fax?${params}`,
            { headers: { 'Authorization': 'Bearer {token}' } }
        );
        const page = await res.json();
        allFaxes.push(...page.data);
        before = page.meta.hasMore ? page.data[page.data.length - 1].id : undefined;
    } while (before);

    const total = allFaxes.length;
    const delivered = allFaxes.filter(f => f.status === 'delivered').length;
    const failed    = allFaxes.filter(f => f.status === 'failed').length;

    return {
        total,
        delivered,
        failed,
        deliveredPct: `${(delivered / total * 100).toFixed(1)}%`,
        failedPct:    `${(failed / total * 100).toFixed(1)}%`,
    };
}

console.log(await faxDeliveryReport());
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function faxDeliveryReport() {
    $allFaxes = [];
    $before   = null;

    do {
        $url = 'https://{namespace}.api.unbound.cx/messaging/fax?direction=outbound&limit=100';
        if ($before) $url .= "&before=$before";

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
        $page = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $allFaxes = array_merge($allFaxes, $page['data']);
        $before   = $page['meta']['hasMore'] ? end($page['data'])['id'] : null;
    } while ($before);

    $total     = count($allFaxes);
    $delivered = count(array_filter($allFaxes, fn($f) => $f['status'] === 'delivered'));
    $failed    = count(array_filter($allFaxes, fn($f) => $f['status'] === 'failed'));

    return [
        'total'        => $total,
        'delivered'    => $delivered,
        'failed'       => $failed,
        'deliveredPct' => number_format($delivered / $total * 100, 1) . '%',
        'failedPct'    => number_format($failed / $total * 100, 1) . '%',
    ];
}

print_r(faxDeliveryReport());
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

def fax_delivery_report():
    all_faxes = []
    before    = None

    while True:
        params = {'direction': 'outbound', 'limit': 100}
        if before:
            params['before'] = before

        res = requests.get(
            'https://{namespace}.api.unbound.cx/messaging/fax',
            headers={'Authorization': 'Bearer {token}'},
            params=params
        )
        page = res.json()
        all_faxes.extend(page['data'])

        if not page['meta']['hasMore']:
            break
        before = page['data'][-1]['id']

    total     = len(all_faxes)
    delivered = sum(1 for f in all_faxes if f['status'] == 'delivered')
    failed    = sum(1 for f in all_faxes if f['status'] == 'failed')

    from collections import Counter
    errors = Counter(f['errorCode'] for f in all_faxes if f.get('errorCode'))

    return {
        'total':          total,
        'delivered':      delivered,
        'failed':         failed,
        'delivered_pct':  f"{delivered / total * 100:.1f}%",
        'failed_pct':     f"{failed / total * 100:.1f}%",
        'top_errors':     errors.most_common(5),
    }

import pprint
pprint.pprint(fax_delivery_report())
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Fetch outbound faxes and pipe to jq for a quick summary
curl -s "https://{namespace}.api.unbound.cx/messaging/fax?direction=outbound&limit=100" \
  -H "Authorization: Bearer {token}" \
  | jq '{
      total:     (.data | length),
      delivered: (.data | map(select(.status == "delivered")) | length),
      failed:    (.data | map(select(.status == "failed"))    | length),
      queued:    (.data | map(select(.status == "queued"))    | length)
    }'
```

</TabItem>
</Tabs>
