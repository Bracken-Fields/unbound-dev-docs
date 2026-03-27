---
id: verification
title: Verification
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Verification

`api.verification` — Send and validate one-time verification codes via SMS and email. Use for identity verification, 2FA, and account confirmation flows.

---

## SMS Verification

### `verification.createSmsVerification(options)`

Send a verification code via SMS.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const verification = await api.verification.createSmsVerification({
    phoneNumber: '+12135550100',
    code: '123456',
    expiresIn: 600,
    metadata: {
        userId: 'user-123',
        action: 'login',
    },
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
    metadata: {
      userId: "user-123",
      action: "login"
    }
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
    'metadata' => [
        'userId' => 'user-123',
        'action' => 'login',
    ]
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
        "metadata": {
            "userId": "user-123",
            "action": "login"
        }
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
  "metadata": {
    "userId": "user-123",
    "action": "login"
  }
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

| Parameter | Type | Required | Description |
|---|---|---|---|
| `phoneNumber` | string | Yes | Recipient phone number (E.164) |
| `code` | string | — | Custom code (auto-generated if omitted) |
| `expiresIn` | number | — | TTL in seconds (default: 600) |
| `metadata` | object | — | Custom metadata to attach |

### `verification.validateSmsVerification(phoneNumber, code)`

Validate a code the user entered.

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
# result['valid'] → True/False
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

---

## Email Verification

### `verification.createEmailVerification(options)`

Send a verification code via email.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.verification.createEmailVerification({
    email: 'user@example.com',
    code: '789012',
    expiresIn: 3600,
    metadata: {
        action: 'signup',
    },
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
    expiresIn: 3600,
    metadata: {
      action: "signup"
    }
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
    'expiresIn' => 3600,
    'metadata' => [
        'action' => 'signup',
    ]
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
        "expiresIn": 3600,
        "metadata": {
            "action": "signup"
        }
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
  "expiresIn": 3600,
  "metadata": {
    "action": "signup"
  }
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

### `verification.validateEmailVerification(email, code)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.verification.validateEmailVerification(
    'user@example.com',
    '789012',
);
// result.valid → true/false
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
// result.valid → true/false
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
// $result['valid'] → true/false
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
# result['valid'] → True/False
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

## Full Example: Login with SMS 2FA

<Tabs groupId="lang">

<TabItem value="sdk" label="SDK">

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({
    namespace: 'your-namespace',
    token: 'your-jwt',
});

// 1. Send verification code
await api.verification.createSmsVerification({
    phoneNumber: '+12135550100',
    expiresIn: 300,
    metadata: { userId: 'user-123' },
});

// 2. User enters code in your UI...
const userCode = '123456';

// 3. Validate
const result = await api.verification.validateSmsVerification(
    '+12135550100',
    userCode,
);

if (result.valid) {
    console.log('Identity verified');
} else {
    console.log('Invalid code');
}
```

</TabItem>

<TabItem value="node" label="Node.js">

```javascript
const baseUrl = 'https://your-namespace.api.unbound.cx';
const token = 'your-jwt';

// 1. Send verification code
await fetch(`${baseUrl}/verification/sms`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        phoneNumber: '+12135550100',
        expiresIn: 300,
        metadata: { userId: 'user-123' },
    }),
});

// 2. User enters code in your UI...
const userCode = '123456';

// 3. Validate
const response = await fetch(`${baseUrl}/verification/sms/validate`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        phoneNumber: '+12135550100',
        code: userCode,
    }),
});

const result = await response.json();

if (result.valid) {
    console.log('Identity verified');
} else {
    console.log('Invalid code');
}
```

</TabItem>

<TabItem value="php" label="PHP">

```php
$baseUrl = 'https://your-namespace.api.unbound.cx';
$token = 'your-jwt';

// 1. Send verification code
$ch = curl_init("$baseUrl/verification/sms");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'phoneNumber' => '+12135550100',
    'expiresIn' => 300,
    'metadata' => ['userId' => 'user-123'],
]));
curl_exec($ch);
curl_close($ch);

// 2. User enters code in your UI...
$userCode = '123456';

// 3. Validate
$ch = curl_init("$baseUrl/verification/sms/validate");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'phoneNumber' => '+12135550100',
    'code' => $userCode,
]));

$result = json_decode(curl_exec($ch), true);
curl_close($ch);

if ($result['valid']) {
    echo 'Identity verified';
} else {
    echo 'Invalid code';
}
```

</TabItem>

<TabItem value="python" label="Python">

```python
import requests

base_url = 'https://your-namespace.api.unbound.cx'
token = 'your-jwt'

# 1. Send verification code
requests.post(
    f'{base_url}/verification/sms',
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    },
    json={
        'phoneNumber': '+12135550100',
        'expiresIn': 300,
        'metadata': {'userId': 'user-123'},
    }
)

# 2. User enters code in your UI...
user_code = '123456'

# 3. Validate
response = requests.post(
    f'{base_url}/verification/sms/validate',
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    },
    json={
        'phoneNumber': '+12135550100',
        'code': user_code,
    }
)

result = response.json()

if result['valid']:
    print('Identity verified')
else:
    print('Invalid code')
```

</TabItem>

<TabItem value="curl" label="cURL">

```bash
# 1. Send verification code
DATA=$(cat <<'EOF'
{
  "phoneNumber": "+12135550100",
  "expiresIn": 300,
  "metadata": {"userId": "user-123"}
}
EOF
)

curl -X POST https://your-namespace.api.unbound.cx/verification/sms \
  -H "Authorization: Bearer your-jwt" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# 2. User enters code in your UI...
# (assume code is 123456)

# 3. Validate
DATA=$(cat <<'EOF'
{
  "phoneNumber": "+12135550100",
  "code": "123456"
}
EOF
)

curl -X POST https://your-namespace.api.unbound.cx/verification/sms/validate \
  -H "Authorization: Bearer your-jwt" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Response: {"valid": true} or {"valid": false}
```

</TabItem>

</Tabs>
