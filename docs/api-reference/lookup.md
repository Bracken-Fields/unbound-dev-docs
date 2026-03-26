---
id: lookup
title: Lookup & Verification
---

# Lookup & Verification

Two services for phone number intelligence and identity verification.

---

## Lookup

`api.lookup` — Real-time phone number intelligence.

### CNAM Lookup

Look up the Caller ID Name registered to a phone number.

```javascript
const cnam = await api.lookup.cnam('+12135550100');
// cnam.name → 'ACME CORP'
// cnam.number → '+12135550100'
```

### LRN Lookup

Look up Local Routing Number (carrier and port status).

```javascript
const lrn = await api.lookup.lrn('+12135550100');
// lrn.carrier → 'AT&T'
// lrn.lrn → routing number
// lrn.ported → true/false

// Include CNAM in the same call
const lrnWithCnam = await api.lookup.lrn('+12135550100', true);
```

### Number Lookup

Combined number intelligence — format validation, carrier, line type.

```javascript
const info = await api.lookup.number('+12135550100');
// info.valid → true/false
// info.lineType → 'mobile' | 'landline' | 'voip' | 'toll_free'
// info.carrier → 'Verizon'
// info.countryCode → 'US'
```

---

## Verification

`api.verification` — Send and validate SMS/email verification codes.

### SMS Verification

```javascript
// Send a code
const verification = await api.verification.createSmsVerification({
    phoneNumber: '+12135550100',
    code: '123456',          // optional: provide your own, otherwise auto-generated
    expiresIn: 600,          // seconds (default: 600 = 10 min)
    metadata: { userId: 'user-123' },
});

// Validate the code the user entered
const result = await api.verification.validateSmsVerification(
    '+12135550100',
    '123456',
);
// result.valid → true/false
```

### Email Verification

```javascript
// Send a code
await api.verification.createEmailVerification({
    email: 'user@example.com',
    code: '789012',
    expiresIn: 3600,
});

// Validate
const result = await api.verification.validateEmailVerification(
    'user@example.com',
    '789012',
);
```
