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
