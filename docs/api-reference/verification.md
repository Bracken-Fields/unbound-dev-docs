---
id: verification
title: Verification
---

# Verification

`api.verification` — Send and validate one-time verification codes via SMS and email. Use for identity verification, 2FA, and account confirmation flows.

---

## SMS Verification

### `verification.createSmsVerification(options)`

Send a verification code via SMS.

```javascript
const verification = await api.verification.createSmsVerification({
    phoneNumber: '+12135550100',
    code: '123456',          // optional — auto-generated if omitted
    expiresIn: 600,          // seconds (default: 600 = 10 min)
    metadata: {
        userId: 'user-123',
        action: 'login',
    },
});
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `phoneNumber` | string | Yes | Recipient phone number (E.164) |
| `code` | string | — | Custom code (auto-generated if omitted) |
| `expiresIn` | number | — | TTL in seconds (default: 600) |
| `metadata` | object | — | Custom metadata to attach |

### `verification.validateSmsVerification(phoneNumber, code)`

Validate a code the user entered.

```javascript
const result = await api.verification.validateSmsVerification(
    '+12135550100',
    '123456',
);
// result.valid → true/false
```

---

## Email Verification

### `verification.createEmailVerification(options)`

Send a verification code via email.

```javascript
await api.verification.createEmailVerification({
    email: 'user@example.com',
    code: '789012',
    expiresIn: 3600,         // 1 hour
    metadata: {
        action: 'signup',
    },
});
```

### `verification.validateEmailVerification(email, code)`

```javascript
const result = await api.verification.validateEmailVerification(
    'user@example.com',
    '789012',
);
// result.valid → true/false
```

---

## Full Example: Login with SMS 2FA

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
