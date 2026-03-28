---
id: lookup
title: Lookup & Verification
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Lookup & Verification

Two services for phone number intelligence and identity verification.

---

## Lookup

`api.lookup` — Real-time phone number intelligence.

### CNAM Lookup

Look up the Caller ID Name registered to a phone number.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const cnam = await api.lookup.cnam('+12135550100');
// cnam.name → 'ACME CORP'
// cnam.number → '+12135550100'
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/lookup/cnam/+12135550100", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const cnam = await res.json();
// cnam.name → 'ACME CORP'
// cnam.number → '+12135550100'
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/lookup/cnam/+12135550100");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
// $response['name'] → 'ACME CORP'
// $response['number'] → '+12135550100'
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/lookup/cnam/+12135550100",
    headers={"Authorization": "Bearer {token}"}
)
cnam = response.json()
# cnam['name'] → 'ACME CORP'
# cnam['number'] → '+12135550100'
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/lookup/cnam/+12135550100" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### LRN Lookup

Look up Local Routing Number (carrier and port status).

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const lrn = await api.lookup.lrn('+12135550100');
// lrn.carrier → 'AT&T'
// lrn.lrn → routing number
// lrn.ported → true/false

// Include CNAM in the same call
const lrnWithCnam = await api.lookup.lrn('+12135550100', true);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/lookup/lrn/+12135550100", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const lrn = await res.json();
// lrn.carrier → 'AT&T'
// lrn.lrn → routing number
// lrn.ported → true/false

// Include CNAM in the same call
const resWithCnam = await fetch("https://{namespace}.api.unbound.cx/lookup/lrn/+12135550100?includeCnam=true", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const lrnWithCnam = await resWithCnam.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/lookup/lrn/+12135550100");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
// $response['carrier'] → 'AT&T'
// $response['lrn'] → routing number
// $response['ported'] → true/false

// Include CNAM in the same call
$ch = curl_init("https://{namespace}.api.unbound.cx/lookup/lrn/+12135550100?includeCnam=true");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$responseWithCnam = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/lookup/lrn/+12135550100",
    headers={"Authorization": "Bearer {token}"}
)
lrn = response.json()
# lrn['carrier'] → 'AT&T'
# lrn['lrn'] → routing number
# lrn['ported'] → true/false

# Include CNAM in the same call
response_with_cnam = requests.get(
    "https://{namespace}.api.unbound.cx/lookup/lrn/+12135550100?includeCnam=true",
    headers={"Authorization": "Bearer {token}"}
)
lrn_with_cnam = response_with_cnam.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/lookup/lrn/+12135550100" \
  -H "Authorization: Bearer {token}"

# Include CNAM in the same call
curl -X GET "https://{namespace}.api.unbound.cx/lookup/lrn/+12135550100?includeCnam=true" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### Number Lookup

Combined number intelligence — format validation, carrier, line type.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const info = await api.lookup.number('+12135550100');
// info.valid → true/false
// info.lineType → 'mobile' | 'landline' | 'voip' | 'toll_free'
// info.carrier → 'Verizon'
// info.countryCode → 'US'
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/lookup/number/+12135550100", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const info = await res.json();
// info.valid → true/false
// info.lineType → 'mobile' | 'landline' | 'voip' | 'toll_free'
// info.carrier → 'Verizon'
// info.countryCode → 'US'
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/lookup/number/+12135550100");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
// $response['valid'] → true/false
// $response['lineType'] → 'mobile' | 'landline' | 'voip' | 'toll_free'
// $response['carrier'] → 'Verizon'
// $response['countryCode'] → 'US'
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/lookup/number/+12135550100",
    headers={"Authorization": "Bearer {token}"}
)
info = response.json()
# info['valid'] → true/false
# info['lineType'] → 'mobile' | 'landline' | 'voip' | 'toll_free'
# info['carrier'] → 'Verizon'
# info['countryCode'] → 'US'
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/lookup/number/+12135550100" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Verification

`api.verification` — Send and validate SMS/email verification codes.

### SMS Verification

#### Send a code

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const verification = await api.verification.createSmsVerification({
    phoneNumber: '+12135550100',
    code: '123456',          // optional: provide your own, otherwise auto-generated
    expiresIn: 600,          // seconds (default: 600 = 10 min)
    metadata: { userId: 'user-123' },
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/verification/sms", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    phoneNumber: "+12135550100",
    code: "123456",
    expiresIn: 600,
    metadata: { userId: "user-123" }
  })
});
const verification = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/verification/sms");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'phoneNumber' => '+12135550100',
    'code' => '123456',
    'expiresIn' => 600,
    'metadata' => ['userId' => 'user-123']
]));
$verification = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/verification/sms",
    headers={"Authorization": "Bearer {token}"},
    json={
        "phoneNumber": "+12135550100",
        "code": "123456",
        "expiresIn": 600,
        "metadata": {"userId": "user-123"}
    }
)
verification = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "phoneNumber": "+12135550100",
  "code": "123456",
  "expiresIn": 600,
  "metadata": {"userId": "user-123"}
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/verification/sms" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

#### Validate the code

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.verification.validateSmsVerification(
    '+12135550100',
    '123456',
);
// result.valid → true/false
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/verification/sms/validate", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    phoneNumber: "+12135550100",
    code: "123456"
  })
});
const result = await res.json();
// result.valid → true/false
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/verification/sms/validate");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'phoneNumber' => '+12135550100',
    'code' => '123456'
]));
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
// $result['valid'] → true/false
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/verification/sms/validate",
    headers={"Authorization": "Bearer {token}"},
    json={
        "phoneNumber": "+12135550100",
        "code": "123456"
    }
)
result = response.json()
# result['valid'] → true/false
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "phoneNumber": "+12135550100",
  "code": "123456"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/verification/sms/validate" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### Email Verification

#### Send a code

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.verification.createEmailVerification({
    email: 'user@example.com',
    code: '789012',
    expiresIn: 3600,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/verification/email", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    code: "789012",
    expiresIn: 3600
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/verification/email");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'user@example.com',
    'code' => '789012',
    'expiresIn' => 3600
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/verification/email",
    headers={"Authorization": "Bearer {token}"},
    json={
        "email": "user@example.com",
        "code": "789012",
        "expiresIn": 3600
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "email": "user@example.com",
  "code": "789012",
  "expiresIn": 3600
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/verification/email" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

#### Validate the code

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.verification.validateEmailVerification(
    'user@example.com',
    '789012',
);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/verification/email/validate", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    code: "789012"
  })
});
const result = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/verification/email/validate");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'user@example.com',
    'code' => '789012'
]));
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/verification/email/validate",
    headers={"Authorization": "Bearer {token}"},
    json={
        "email": "user@example.com",
        "code": "789012"
    }
)
result = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "email": "user@example.com",
  "code": "789012"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/verification/email/validate" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

## Response Shapes

### `lookup.cnam()` — response

```json
{
    "number": "+12135550100",
    "name": "ACME CORP",
    "error": null
}
```

`name` is `null` when no CNAM record is registered. `error` is non-null if the lookup itself failed (invalid number format, carrier timeout, etc.).

---

### `lookup.lrn()` — response

```json
{
    "number": "+12135550100",
    "lrn": "2135550100",
    "carrier": "AT&T",
    "ocn": "7366",
    "ported": true,
    "portedTo": "Verizon",
    "lineType": "mobile",
    "error": null
}
```

When `cnam: true` is passed, the response also includes a `cnam` field with the CNAM string.

```json
{
    "number": "+12135550100",
    "lrn": "2135550100",
    "carrier": "Verizon",
    "ported": true,
    "cnam": "JOHN DOE",
    "error": null
}
```

---

### `lookup.number()` — response

```json
{
    "number": "+12135550100",
    "valid": true,
    "lineType": "mobile",
    "carrier": "Verizon",
    "countryCode": "US",
    "nationalFormat": "(213) 555-0100",
    "e164": "+12135550100",
    "error": null
}
```

**`lineType` values:**

| Value | Description |
|---|---|
| `mobile` | Mobile/cellular line |
| `landline` | Traditional PSTN landline |
| `voip` | VoIP/cloud-based line |
| `toll_free` | Toll-free (800/888/etc.) |
| `unknown` | Could not be determined |

---

## Common Patterns

### Pattern 1 — Pre-call number hygiene

Validate and enrich a phone number before initiating an outbound call. Reject VoIP numbers for live agent queues, flag ported lines for carrier routing.

```javascript
async function validateForOutboundCall(rawNumber) {
    const info = await api.lookup.number(rawNumber);

    if (!info.valid) {
        throw new Error(`Invalid phone number: ${rawNumber}`);
    }

    if (info.lineType === 'voip') {
        // Some campaigns exclude VoIP lines
        return { allowed: false, reason: 'voip_number', info };
    }

    // Optionally fetch CNAM for call display
    const cnam = await api.lookup.cnam(info.e164);

    return {
        allowed: true,
        e164: info.e164,
        carrier: info.carrier,
        lineType: info.lineType,
        ported: false,  // from lrn() if needed
        displayName: cnam.name ?? null,
    };
}

const check = await validateForOutboundCall('(213) 555-0100');
if (check.allowed) {
    await api.voice.call({
        to: check.e164,
        from: '+18005550000',
        app: { actions: [{ action: 'dial' }] },
    });
}
```

---

### Pattern 2 — Inbound caller screen-pop with CNAM

When an inbound call arrives via webhook, look up the caller's name and load their CRM record simultaneously.

```javascript
// POST /webhooks/inbound-call
async function handleInboundCall(req, res) {
    const { callId, from, to } = req.body;

    // Fire both lookups in parallel
    const [cnam, contact] = await Promise.all([
        api.lookup.cnam(from),
        api.objects.query({
            object: 'contacts',
            where: [{ field: 'phone', operator: '=', value: from }],
            limit: 1,
        }),
    ]);

    const callerName = cnam.name ?? contact.data?.[0]?.name ?? 'Unknown Caller';

    // Deliver screen-pop to the agent via subscription event
    await api.subscriptions.emit({
        event: 'screen_pop',
        payload: {
            callId,
            callerNumber: from,
            callerName,
            contactId: contact.data?.[0]?.id ?? null,
        },
    });

    res.json({ status: 'ok' });
}
```

---

### Pattern 3 — Carrier-aware SMS routing

Use LRN to determine the current carrier before sending an SMS — useful for routing through carrier-specific gateways or adjusting rate-limit strategies.

```javascript
async function routeSms(to, message) {
    const lrn = await api.lookup.lrn(to);

    // Map carrier to preferred SMS route
    const carrierRoutes = {
        'AT&T': 'att-gateway',
        'Verizon': 'verizon-gateway',
        'T-Mobile': 'tmobile-gateway',
    };

    const route = carrierRoutes[lrn.carrier] ?? 'default-gateway';

    await api.messaging.sms.send({
        to,
        from: '+18005550000',
        message,
        metadata: {
            carrier: lrn.carrier,
            route,
            ported: lrn.ported,
        },
    });
}
```

---

### Pattern 4 — Bulk number validation with rate limiting

Validate a large list of phone numbers, respecting API rate limits by batching with a delay.

```javascript
async function bulkValidate(phoneNumbers, batchSize = 10, delayMs = 500) {
    const results = [];

    for (let i = 0; i < phoneNumbers.length; i += batchSize) {
        const batch = phoneNumbers.slice(i, i + batchSize);

        const batchResults = await Promise.all(
            batch.map(async (num) => {
                try {
                    const info = await api.lookup.number(num);
                    return { number: num, ...info, error: null };
                } catch (err) {
                    return { number: num, valid: false, error: err.message };
                }
            })
        );

        results.push(...batchResults);

        // Throttle between batches
        if (i + batchSize < phoneNumbers.length) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return {
        total: results.length,
        valid: results.filter(r => r.valid).length,
        invalid: results.filter(r => !r.valid).length,
        byLineType: results.reduce((acc, r) => {
            if (r.lineType) acc[r.lineType] = (acc[r.lineType] ?? 0) + 1;
            return acc;
        }, {}),
        results,
    };
}

const report = await bulkValidate([
    '+12135550100',
    '+13105550200',
    '+18005550300',
]);
console.log(`Valid: ${report.valid}/${report.total}`);
console.log('By line type:', report.byLineType);
```

---

### Pattern 5 — SMS OTP with retry and expiry

Send a verification code via SMS using the verification service, validate it on submit, and handle expiry gracefully.

```javascript
const CODE_TTL = 300; // 5 minutes

async function sendOtp(phoneNumber) {
    // Validate the number is reachable before sending
    const info = await api.lookup.number(phoneNumber);
    if (!info.valid || info.lineType === 'landline') {
        throw new Error('Phone number cannot receive SMS');
    }

    await api.verification.createSmsVerification({
        phoneNumber: info.e164,
        expiresIn: CODE_TTL,
    });

    return { sent: true, expires: Date.now() + CODE_TTL * 1000 };
}

async function verifyOtp(phoneNumber, code) {
    try {
        const result = await api.verification.validateSmsVerification(
            phoneNumber,
            code,
        );

        if (!result.valid) {
            return { success: false, reason: 'invalid_code' };
        }

        return { success: true };
    } catch (err) {
        if (err.message?.includes('expired')) {
            return { success: false, reason: 'expired' };
        }
        throw err;
    }
}

// Usage
const { sent } = await sendOtp('+12135550100');
// ... user enters code ...
const { success, reason } = await verifyOtp('+12135550100', userEnteredCode);
if (!success && reason === 'expired') {
    // Prompt user to request a new code
}
```
