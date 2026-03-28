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

## Response Shapes

### `createSmsVerification` / `createEmailVerification`

```json
{
    "id": "ver_01j2kxp7b8rqtv3mxn9w",
    "channel": "sms",
    "phoneNumber": "+12135550100",
    "status": "pending",
    "expiresAt": "2024-03-15T10:15:00Z",
    "createdAt": "2024-03-15T10:05:00Z",
    "metadata": {
        "userId": "user-123",
        "action": "login"
    }
}
```

For email verifications, `phoneNumber` is replaced by `email`:

```json
{
    "id": "ver_01j2kxp7b8rqtv3mxn9x",
    "channel": "email",
    "email": "user@example.com",
    "status": "pending",
    "expiresAt": "2024-03-15T11:05:00Z",
    "createdAt": "2024-03-15T10:05:00Z",
    "metadata": {
        "action": "signup"
    }
}
```

**Status values:**

| Status | Description |
|---|---|
| `pending` | Code was sent and is awaiting validation |
| `verified` | Code was validated successfully |
| `expired` | Code TTL elapsed before validation |
| `failed` | Too many incorrect attempts |

---

### `validateSmsVerification` / `validateEmailVerification`

**Success:**

```json
{
    "valid": true,
    "id": "ver_01j2kxp7b8rqtv3mxn9w",
    "metadata": {
        "userId": "user-123",
        "action": "login"
    }
}
```

**Failure — wrong code:**

```json
{
    "valid": false,
    "reason": "invalid_code",
    "attemptsRemaining": 2
}
```

**Failure — expired:**

```json
{
    "valid": false,
    "reason": "expired",
    "expiredAt": "2024-03-15T10:15:00Z"
}
```

**Failure — too many attempts:**

```json
{
    "valid": false,
    "reason": "max_attempts_exceeded",
    "attemptsRemaining": 0
}
```

---

## Error Codes

| HTTP Status | Error | Description |
|---|---|---|
| `400` | `invalid_phone_number` | Phone number is not in E.164 format |
| `400` | `invalid_email` | Email address is malformed |
| `400` | `invalid_code_format` | Code must be a numeric string |
| `404` | `verification_not_found` | No pending verification for this phone/email |
| `410` | `verification_expired` | Code TTL has elapsed — create a new verification |
| `429` | `rate_limit_exceeded` | Too many verifications sent to this number/address |
| `422` | `max_attempts_exceeded` | Too many failed validate attempts — send a new code |

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


---

## Common Patterns

### Signup Flow with Email Verification

Verify an email address before activating a new account:

```javascript
async function signupWithEmailVerification(email, password) {
    // 1. Create the account in a pending state
    const user = await api.objects.create({
        object: 'users',
        body: {
            email,
            passwordHash: hashPassword(password),
            status: 'pending_verification',
        },
    });

    // 2. Send a verification code (auto-generated, 1 hour TTL)
    await api.verification.createEmailVerification({
        email,
        expiresIn: 3600,
        metadata: {
            userId: user.id,
            action: 'signup',
        },
    });

    return { userId: user.id, message: 'Check your email for a verification code.' };
}

async function confirmEmail(email, code) {
    // 3. Validate the code
    const result = await api.verification.validateEmailVerification(email, code);

    if (!result.valid) {
        const reasons = {
            invalid_code: 'Incorrect code. Try again.',
            expired: 'Code has expired. Request a new one.',
            max_attempts_exceeded: 'Too many attempts. Request a new code.',
        };
        throw new Error(reasons[result.reason] || 'Verification failed.');
    }

    // 4. Activate the account
    await api.objects.update({
        object: 'users',
        where: { email },
        update: { status: 'active', emailVerifiedAt: new Date().toISOString() },
    });

    return { success: true };
}
```

---

### Password Reset with SMS

Use SMS verification as the identity check before allowing a password change:

```javascript
async function requestPasswordReset(phoneNumber) {
    // Verify user exists first (don't leak info on failure)
    const [user] = await api.objects.query({
        object: 'users',
        where: { phone: phoneNumber },
        select: ['id'],
        limit: 1,
    });

    if (!user) {
        // Return generic response regardless to prevent enumeration
        return { message: 'If that number is registered, you will receive a code.' };
    }

    // Send a 10-minute code
    await api.verification.createSmsVerification({
        phoneNumber,
        expiresIn: 600,
        metadata: { userId: user.id, action: 'password_reset' },
    });

    return { message: 'If that number is registered, you will receive a code.' };
}

async function resetPassword(phoneNumber, code, newPassword) {
    const result = await api.verification.validateSmsVerification(phoneNumber, code);

    if (!result.valid) {
        throw new Error('Invalid or expired verification code.');
    }

    // Code is valid — safe to update the password
    await api.objects.update({
        object: 'users',
        where: { phone: phoneNumber },
        update: {
            passwordHash: hashPassword(newPassword),
            passwordChangedAt: new Date().toISOString(),
        },
    });

    return { success: true };
}
```

---

### Resend with Rate-Limit Awareness

Handle the `429` rate limit gracefully and surface a sensible delay to the user:

```javascript
async function sendVerificationWithRetry(phoneNumber, options = {}) {
    const MAX_RETRIES = 1;
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
        try {
            const result = await api.verification.createSmsVerification({
                phoneNumber,
                expiresIn: options.expiresIn || 300,
                metadata: options.metadata || {},
            });
            return result;
        } catch (err) {
            if (err.status === 429) {
                // Parse retry delay from headers or use a default
                const retryAfter = parseInt(err.headers?.['retry-after'] || '60', 10);
                throw new Error(
                    `Too many verification requests. Please wait ${retryAfter} seconds before trying again.`
                );
            }

            if (err.status === 400 && err.message?.includes('invalid_phone_number')) {
                throw new Error('Phone number must be in E.164 format (e.g. +12135550100).');
            }

            throw err;
        }
    }
}
```

---

### Dual-Channel 2FA (SMS + Email Fallback)

Try SMS first; fall back to email if the phone is unavailable:

```javascript
async function send2FACode(user) {
    if (user.phone) {
        try {
            await api.verification.createSmsVerification({
                phoneNumber: user.phone,
                expiresIn: 300,
                metadata: { userId: user.id, channel: 'sms' },
            });
            return { channel: 'sms', destination: maskPhone(user.phone) };
        } catch (err) {
            console.warn('SMS verification failed, falling back to email:', err.message);
        }
    }

    // Fallback: email
    await api.verification.createEmailVerification({
        email: user.email,
        expiresIn: 600,
        metadata: { userId: user.id, channel: 'email' },
    });

    return { channel: 'email', destination: maskEmail(user.email) };
}

async function verify2FACode(user, channel, code) {
    let result;

    if (channel === 'sms') {
        result = await api.verification.validateSmsVerification(user.phone, code);
    } else {
        result = await api.verification.validateEmailVerification(user.email, code);
    }

    if (!result.valid) {
        throw new Error('Invalid verification code.');
    }

    return { verified: true, userId: user.id };
}

function maskPhone(phone) {
    // Show last 4 digits only: ••••••6789
    return '••••••' + phone.slice(-4);
}

function maskEmail(email) {
    // Show first 2 chars and domain: jo***@example.com
    const [local, domain] = email.split('@');
    return local.slice(0, 2) + '***@' + domain;
}
```

---

### Custom Code for Branded SMS Messages

Supply your own code so you can embed it in a branded message via another channel:

```javascript
async function sendBrandedVerification(phoneNumber, userId) {
    // Generate a 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // Create the verification record (Unbound stores and tracks it)
    await api.verification.createSmsVerification({
        phoneNumber,
        code,
        expiresIn: 300,
        metadata: { userId, action: 'login' },
    });

    // Send a branded SMS via your preferred template
    await api.messaging.sms.send({
        from: '+18005550100',
        to: phoneNumber,
        message: `Your Acme Corp login code is ${code}. It expires in 5 minutes. Do not share it.`,
    });
}
```

