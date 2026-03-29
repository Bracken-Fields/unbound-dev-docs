---
id: enroll
title: Enrollment
---

# Enrollment

The Enrollment API enables white-label partners to embed Unbound account provisioning directly into their own onboarding flows. With it you can validate namespace availability, collect company details, verify identity (email, SMS, Stripe KYC), capture payment, collect agreement acceptance, and trigger the full account build pipeline — all programmatically.

---

## Overview

A typical enrollment moves through these stages in order:

1. **Check namespace** — confirm the desired subdomain is available
2. **Collect company info** — start the enrollment record with business details
3. **Verify identity** — confirm email and/or SMS ownership
4. **Payment** — attach and verify a payment method (Stripe)
5. **KYC (optional)** — run Stripe identity verification for regulated industries
6. **Agreements** — present and collect acceptance of the service agreement
7. **Complete** — finalize the enrollment and trigger account provisioning
8. **Poll build status** — wait for the account database and services to come online

All enrollment methods live on `api.enroll`.

---

## `enroll.checkNamespace(namespace)`

Check whether a namespace (account subdomain) is available before starting enrollment. Call this live as the user types to give instant feedback.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `namespace` | string | ✅ | Desired namespace (alphanumeric, hyphens allowed). Must be globally unique. |

**Response**

```json
{
    "available": true,
    "namespace": "acme-corp"
}
```

| Field | Type | Description |
|---|---|---|
| `available` | boolean | `true` if the namespace is unclaimed. |
| `namespace` | string | Echo of the requested namespace. |

**Example — live availability check**

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'enroll', token: 'partner-token' });

async function checkNamespace(namespace) {
    const result = await api.enroll.checkNamespace(namespace);
    if (result.available) {
        console.log(`✅ "${namespace}" is available`);
    } else {
        console.log(`❌ "${namespace}" is already taken`);
    }
    return result.available;
}

// Debounced usage in a form field
let debounceTimer;
document.getElementById('namespace-input').addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        checkNamespace(e.target.value.trim().toLowerCase());
    }, 400);
});
```

---

## `enroll.collectCompanyInfo(companyInfo)`

Start an enrollment by submitting company information. This creates an enrollment record on the platform and returns an `enrollmentId` used in all subsequent steps.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `companyInfo` | object | ✅ | Company details object (see fields below) |

**`companyInfo` fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `namespace` | string | ✅ | Desired account namespace (validate first with `checkNamespace`) |
| `companyName` | string | ✅ | Legal name of the company |
| `firstName` | string | ✅ | Admin contact first name |
| `lastName` | string | ✅ | Admin contact last name |
| `email` | string | ✅ | Admin contact email address |
| `phoneNumber` | string | ✅ | Admin contact phone in E.164 format |
| `address` | string | — | Street address |
| `city` | string | — | City |
| `state` | string | — | State / province code (e.g., `IN`) |
| `zip` | string | — | Postal code |
| `country` | string | — | ISO 3166-1 alpha-2 country code (e.g., `US`) |
| `website` | string | — | Company website URL |
| `industry` | string | — | Industry category |

**Response**

```json
{
    "enrollmentId": "enroll_01hxyz1234567890",
    "namespace": "acme-corp",
    "status": "pending",
    "createdAt": "2026-03-29T12:00:00Z"
}
```

**Example**

```javascript
const enrollment = await api.enroll.collectCompanyInfo({
    namespace: 'acme-corp',
    companyName: 'Acme Corporation',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@acme.com',
    phoneNumber: '+13175551234',
    address: '100 Main St',
    city: 'Indianapolis',
    state: 'IN',
    zip: '46201',
    country: 'US',
    website: 'https://acme.com',
    industry: 'Technology',
});

const { enrollmentId } = enrollment;
console.log('Enrollment started:', enrollmentId);
// → Enrollment started: enroll_01hxyz1234567890
```

---

## `enroll.updateEnrollmentInfo(enrollmentId, updateData)`

Update fields on an in-progress enrollment. Use this if the user goes back to correct information or if additional details are collected in later steps.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `enrollmentId` | string | ✅ | Enrollment ID from `collectCompanyInfo` |
| `updateData` | object | ✅ | Partial update — any fields from `companyInfo` |

**Example — correct a typo in company name**

```javascript
await api.enroll.updateEnrollmentInfo(enrollmentId, {
    companyName: 'Acme Corp, Inc.',
    website: 'https://www.acme.com',
});

console.log('Enrollment updated');
```

---

## `enroll.validateEnrollment(enrollmentData)`

Run server-side validation against a complete set of enrollment data before committing. Returns field-level errors without creating or modifying any records. Use this for pre-submit validation on long forms.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `enrollmentData` | object | ✅ | Full enrollment data object (same shape as `collectCompanyInfo`) |

**Response**

```json
{
    "valid": false,
    "errors": [
        { "field": "email", "message": "Invalid email format" },
        { "field": "phoneNumber", "message": "Must be in E.164 format (e.g. +13175551234)" }
    ]
}
```

| Field | Type | Description |
|---|---|---|
| `valid` | boolean | `true` if all fields pass validation |
| `errors` | array | Array of `{ field, message }` objects. Empty when valid. |

**Example**

```javascript
const validation = await api.enroll.validateEnrollment({
    namespace: 'acme-corp',
    companyName: 'Acme Corp',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'not-an-email',       // will fail
    phoneNumber: '3175551234',   // will fail (no + prefix)
});

if (!validation.valid) {
    validation.errors.forEach(({ field, message }) => {
        console.error(`${field}: ${message}`);
    });
}
```

---

## `enroll.verifyEmail(email, code)`

Verify ownership of an email address. The platform sends a one-time code to the address; pass the code back here to confirm it.

**How it works:** The verification code is sent automatically when the enrollment is created (or on a resend trigger). You don't send the code yourself — you only call this to confirm the code the user enters.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `email` | string | ✅ | Email address to verify (must match the enrollment) |
| `code` | string | ✅ | 6-digit code entered by the user |

**Response**

```json
{
    "verified": true,
    "email": "jane.doe@acme.com"
}
```

**Example**

```javascript
const result = await api.enroll.verifyEmail('jane.doe@acme.com', '847291');
if (result.verified) {
    console.log('Email verified ✅');
} else {
    console.error('Invalid or expired code');
}
```

---

## `enroll.verifySms(phoneNumber, code)`

Verify ownership of a phone number via SMS OTP. The platform sends the code; you confirm it.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `phoneNumber` | string | ✅ | Phone number in E.164 format (must match the enrollment) |
| `code` | string | ✅ | OTP code entered by the user |

**Response**

```json
{
    "verified": true,
    "phoneNumber": "+13175551234"
}
```

**Example**

```javascript
const result = await api.enroll.verifySms('+13175551234', '583920');
if (result.verified) {
    console.log('Phone number verified ✅');
} else {
    console.error('Invalid or expired code');
}
```

---

## `enroll.verifyPayment(paymentData)`

Attach and verify a payment method for the account. The platform uses Stripe under the hood; pass a Stripe `paymentMethodId` obtained from Stripe.js or the Stripe Elements SDK.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `paymentData` | object | ✅ | Payment data object (see fields below) |

**`paymentData` fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `paymentMethodId` | string | ✅ | Stripe `pm_xxx` payment method ID from Stripe.js |
| `enrollmentId` | string | ✅ | Enrollment ID to attach the payment method to |
| `billingEmail` | string | — | Billing contact email (defaults to enrollment email) |

**Response**

```json
{
    "verified": true,
    "paymentMethodId": "pm_1NqAbc2eZvKYlo2CXyz",
    "last4": "4242",
    "brand": "visa"
}
```

**Example — full Stripe.js + SDK flow**

```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_live_...');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

document.getElementById('submit-payment').addEventListener('click', async () => {
    // 1. Create a Stripe payment method from the card element
    const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
            email: 'jane.doe@acme.com',
            name: 'Jane Doe',
        },
    });

    if (error) {
        console.error('Stripe error:', error.message);
        return;
    }

    // 2. Pass the payment method to Unbound enrollment
    const result = await api.enroll.verifyPayment({
        paymentMethodId: paymentMethod.id,
        enrollmentId: enrollmentId,
        billingEmail: 'jane.doe@acme.com',
    });

    if (result.verified) {
        console.log(`Payment attached: ${result.brand} ****${result.last4}`);
    }
});
```

---

## `enroll.createStripeVerificationSession(sessionData)`

Create a Stripe Identity verification session for KYC (Know Your Customer) compliance. This is required for accounts in regulated industries or high-risk billing tiers. Returns a Stripe client secret used to launch the Stripe Identity modal.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `sessionData` | object | ✅ | Session configuration |

**`sessionData` fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `enrollmentId` | string | ✅ | Enrollment to attach this verification to |
| `returnUrl` | string | ✅ | URL Stripe redirects to after the verification flow |
| `userId` | string | — | ID of the user undergoing verification (for multi-user accounts) |

**Response**

```json
{
    "sessionId": "vs_1NqAbc2eZvKYlo2C...",
    "clientSecret": "vs_1NqAbc2eZvKYlo2C..._secret_...",
    "status": "requires_input"
}
```

**Example**

```javascript
const session = await api.enroll.createStripeVerificationSession({
    enrollmentId: enrollmentId,
    returnUrl: 'https://signup.acme.com/enroll/verify-complete',
});

// Launch Stripe Identity modal
const stripe = await loadStripe('pk_live_...');
const { error } = await stripe.verifyIdentity(session.clientSecret);

if (error) {
    console.error('Identity verification failed:', error.message);
} else {
    console.log('Identity verification initiated — awaiting Stripe webhook');
}
```

---

## `enroll.getStripeVerificationStatus(sessionId)`

Poll the status of a Stripe Identity verification session. Call this after the user completes the Stripe modal or returns from the `returnUrl`.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | ✅ | Stripe verification session ID from `createStripeVerificationSession` |

**Response**

```json
{
    "sessionId": "vs_1NqAbc2eZvKYlo2C...",
    "status": "verified",
    "verifiedAt": "2026-03-29T12:45:00Z"
}
```

**Status values**

| Status | Meaning |
|---|---|
| `requires_input` | Verification not yet started or in progress |
| `processing` | Stripe is reviewing submitted documents |
| `verified` | Identity confirmed — proceed to next enrollment step |
| `canceled` | User abandoned the flow — prompt to restart |
| `requires_action` | Additional information needed from the user |

**Example — poll until resolved**

```javascript
async function pollVerification(sessionId, maxAttempts = 30) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const status = await api.enroll.getStripeVerificationStatus(sessionId);

        if (status.status === 'verified') {
            console.log('Identity verified ✅');
            return true;
        }
        if (status.status === 'canceled') {
            console.error('Verification canceled — user must retry');
            return false;
        }
        if (status.status === 'requires_input' || status.status === 'processing') {
            console.log(`Still processing (attempt ${attempt + 1}/${maxAttempts})...`);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            continue;
        }
    }
    throw new Error('Verification polling timed out');
}
```

---

## `enroll.getAgreement(agreementType, version?)`

Retrieve the text of a service agreement so you can render it to the user before asking them to sign. Always fetch the current version fresh — never hardcode agreement text.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `agreementType` | string | ✅ | Agreement type identifier (e.g., `'terms_of_service'`, `'privacy_policy'`, `'data_processing'`) |
| `version` | string | — | Specific version string. Omit for the current active version. |

**Response**

```json
{
    "agreementType": "terms_of_service",
    "version": "2026-01",
    "title": "Unbound Terms of Service",
    "content": "...full agreement text as HTML or Markdown...",
    "effectiveDate": "2026-01-01T00:00:00Z"
}
```

**Example**

```javascript
const tos = await api.enroll.getAgreement('terms_of_service');
const dpa = await api.enroll.getAgreement('data_processing');

console.log(`Showing ToS version: ${tos.version}`);
console.log(`Showing DPA version: ${dpa.version}`);

// Render to user
document.getElementById('tos-container').innerHTML = tos.content;
document.getElementById('dpa-container').innerHTML = dpa.content;
```

---

## `enroll.signAgreement(agreementData)`

Record the user's acceptance of one or more service agreements. Store the `version` from `getAgreement` so the exact version they accepted is captured.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `agreementData` | object | ✅ | Agreement acceptance record |

**`agreementData` fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `enrollmentId` | string | ✅ | Enrollment ID |
| `agreementType` | string | ✅ | Agreement type (must match what was shown via `getAgreement`) |
| `version` | string | ✅ | Agreement version accepted |
| `acceptedAt` | string | ✅ | ISO 8601 timestamp of acceptance (use `new Date().toISOString()`) |
| `ipAddress` | string | — | Client IP address for audit trail |
| `userAgent` | string | — | Browser user agent string for audit trail |

**Response**

```json
{
    "recorded": true,
    "enrollmentId": "enroll_01hxyz1234567890",
    "agreementType": "terms_of_service",
    "version": "2026-01",
    "acceptedAt": "2026-03-29T12:30:00Z"
}
```

**Example**

```javascript
// Capture acceptance when user ticks the checkbox
document.getElementById('accept-checkbox').addEventListener('change', async (e) => {
    if (!e.target.checked) return;

    const [tos, dpa] = await Promise.all([
        api.enroll.signAgreement({
            enrollmentId,
            agreementType: 'terms_of_service',
            version: tosVersion,           // from getAgreement response
            acceptedAt: new Date().toISOString(),
            ipAddress: userIp,
            userAgent: navigator.userAgent,
        }),
        api.enroll.signAgreement({
            enrollmentId,
            agreementType: 'data_processing',
            version: dpaVersion,
            acceptedAt: new Date().toISOString(),
            ipAddress: userIp,
            userAgent: navigator.userAgent,
        }),
    ]);

    console.log('Agreements signed:', tos.recorded, dpa.recorded);
});
```

---

## `enroll.getBrandForEnrollment(enrollmentId)`

Retrieve the white-label brand configuration associated with an enrollment. Use this to customize the signup UI — colors, logos, support contact — if you're embedding enrollment in a partner portal.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `enrollmentId` | string | ✅ | Enrollment ID |

**Response**

```json
{
    "brandId": "brand_xyz",
    "name": "Acme White-Label",
    "logoUrl": "https://cdn.partner.com/acme-logo.png",
    "primaryColor": "#0057B7",
    "supportEmail": "support@acme.com",
    "supportPhone": "+18005551234",
    "termsUrl": "https://acme.com/terms",
    "privacyUrl": "https://acme.com/privacy"
}
```

**Example**

```javascript
const brand = await api.enroll.getBrandForEnrollment(enrollmentId);

// Apply brand to UI
document.documentElement.style.setProperty('--primary-color', brand.primaryColor);
document.getElementById('brand-logo').src = brand.logoUrl;
document.getElementById('support-link').href = `mailto:${brand.supportEmail}`;
```

---

## `enroll.getBuildStatus(enrollmentId)`

Check provisioning progress after `completeEnrollment` is called. The platform builds the account database, provisions services, and assigns resources asynchronously. Poll this until `status` is `'ready'`.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `enrollmentId` | string | ✅ | Enrollment ID |

**Response**

```json
{
    "enrollmentId": "enroll_01hxyz1234567890",
    "status": "building",
    "progress": 65,
    "steps": [
        { "name": "database", "status": "complete" },
        { "name": "services", "status": "in_progress" },
        { "name": "phone_numbers", "status": "pending" },
        { "name": "email_config", "status": "pending" }
    ],
    "namespace": "acme-corp",
    "estimatedSecondsRemaining": 45
}
```

**Status values**

| Status | Meaning |
|---|---|
| `pending` | Enrollment submitted, build not yet started |
| `building` | Active provisioning in progress |
| `ready` | All services provisioned — account is live |
| `failed` | Provisioning failed — contact support |

**Example — poll with exponential backoff**

```javascript
async function waitForAccountReady(enrollmentId) {
    const delays = [2000, 3000, 5000, 8000, 13000, 21000]; // Fibonacci-ish
    let attempt = 0;

    while (true) {
        const build = await api.enroll.getBuildStatus(enrollmentId);
        console.log(`Build status: ${build.status} (${build.progress}%)`);

        if (build.status === 'ready') {
            console.log(`✅ Account live at ${build.namespace}.app1svc.com`);
            return build;
        }
        if (build.status === 'failed') {
            throw new Error(`Provisioning failed for enrollment ${enrollmentId}`);
        }

        const delay = delays[Math.min(attempt, delays.length - 1)];
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
    }
}
```

---

## `enroll.completeEnrollment(enrollmentId, completionData)`

Finalize the enrollment and trigger account provisioning. Call this only after all verification steps are complete (email, SMS, payment, KYC if required, agreements). This is the point of no return — it kicks off the build pipeline.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `enrollmentId` | string | ✅ | Enrollment ID |
| `completionData` | object | ✅ | Final data needed to complete enrollment |

**`completionData` fields**

| Field | Type | Required | Description |
|---|---|---|---|
| `adminPassword` | string | ✅ | Initial password for the admin user (must meet password requirements) |
| `plan` | string | — | Billing plan identifier (e.g., `'starter'`, `'professional'`, `'enterprise'`) |
| `addons` | string[] | — | Array of addon identifiers to activate |
| `referralCode` | string | — | Partner referral code for attribution |
| `metadata` | object | — | Arbitrary key-value pairs for partner use |

**Response**

```json
{
    "enrollmentId": "enroll_01hxyz1234567890",
    "status": "building",
    "namespace": "acme-corp",
    "adminUserId": "usr_01hxyz",
    "apiBaseUrl": "https://acme-corp.api.dev-d01.app1svc.com",
    "startedAt": "2026-03-29T12:50:00Z"
}
```

**Example**

```javascript
const completion = await api.enroll.completeEnrollment(enrollmentId, {
    adminPassword: 'Str0ng!Pass#2026',
    plan: 'professional',
    addons: ['ai_transcription', 'kb_search'],
    referralCode: 'PARTNER-ACME',
    metadata: {
        partnerAccountId: 'acct_12345',
        salesRepId: 'rep_67890',
    },
});

console.log('Build started:', completion.status);
console.log('API base URL:', completion.apiBaseUrl);

// Now poll build status
await waitForAccountReady(enrollmentId);
```

---

## `enroll.createAccountDatabase(enrollmentId)`

Explicitly trigger the database creation step for an enrollment. This is normally called automatically by `completeEnrollment`. Use it only if you need to trigger database provisioning independently (e.g., in a custom multi-step partner pipeline that separates database creation from full account activation).

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `enrollmentId` | string | ✅ | Enrollment ID |

**Response**

```json
{
    "enrollmentId": "enroll_01hxyz1234567890",
    "databaseStatus": "creating",
    "startedAt": "2026-03-29T12:51:00Z"
}
```

**Example**

```javascript
// Advanced: separate database creation from full activation
const dbResult = await api.enroll.createAccountDatabase(enrollmentId);
console.log('Database creation triggered:', dbResult.databaseStatus);

// Continue to monitor build status
const build = await api.enroll.getBuildStatus(enrollmentId);
console.log('Overall status:', build.status);
```

---

## Response Shape Reference

### Enrollment record

Most enrollment methods return (or accept) an enrollment record with this shape:

```typescript
interface EnrollmentRecord {
    enrollmentId: string;       // Unique enrollment ID (prefix: enroll_)
    namespace: string;          // Desired account namespace
    status: EnrollmentStatus;   // Current enrollment stage
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    website?: string;
    industry?: string;
    createdAt: string;          // ISO 8601
    updatedAt: string;
}

type EnrollmentStatus =
    | 'pending'       // Just created
    | 'verifying'     // Identity/payment verification in progress
    | 'verified'      // All verification steps complete
    | 'completing'    // completeEnrollment called, build starting
    | 'building'      // Provisioning in progress
    | 'ready'         // Account live
    | 'failed';       // Enrollment failed
```

---

## Error Handling

Enrollment errors use the standard SDK error shape. Key codes to handle:

| Error Code | HTTP | When It Occurs |
|---|---|---|
| `NAMESPACE_TAKEN` | 409 | `checkNamespace` — namespace already claimed |
| `NAMESPACE_INVALID` | 422 | Namespace contains invalid characters |
| `ENROLLMENT_NOT_FOUND` | 404 | `enrollmentId` does not exist |
| `VERIFICATION_FAILED` | 422 | Wrong OTP code or expired code |
| `PAYMENT_DECLINED` | 402 | Stripe payment method was declined |
| `ALREADY_COMPLETED` | 409 | `completeEnrollment` called on an already-completed enrollment |
| `MISSING_VERIFICATION` | 422 | `completeEnrollment` called before required verification steps |
| `BUILD_FAILED` | 500 | Provisioning pipeline error — contact support |

```javascript
import { UnboundError } from '@unboundcx/sdk';

try {
    await api.enroll.verifyEmail(email, code);
} catch (err) {
    if (err instanceof UnboundError) {
        switch (err.code) {
            case 'VERIFICATION_FAILED':
                showError('Invalid or expired code. Please check your email and try again.');
                break;
            case 'ENROLLMENT_NOT_FOUND':
                showError('Session expired. Please restart enrollment.');
                break;
            default:
                showError(`Unexpected error: ${err.message}`);
        }
    }
}
```

---

## Common Patterns

### Pattern 1 — Full Enrollment Flow (Server-Side)

Complete white-label enrollment from a single Node.js backend handler:

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'enroll', token: process.env.PARTNER_API_TOKEN });

async function runEnrollment(formData) {
    // Step 1: Check namespace availability
    const { available } = await api.enroll.checkNamespace(formData.namespace);
    if (!available) {
        throw new Error(`Namespace "${formData.namespace}" is already taken`);
    }

    // Step 2: Collect company info — creates enrollment record
    const enrollment = await api.enroll.collectCompanyInfo({
        namespace: formData.namespace,
        companyName: formData.companyName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: 'US',
    });

    const { enrollmentId } = enrollment;
    console.log('Enrollment created:', enrollmentId);

    // Step 3: Verify email (user must enter code from their inbox)
    // ... wait for user to submit OTP ...
    await api.enroll.verifyEmail(formData.email, formData.emailCode);

    // Step 4: Verify phone
    await api.enroll.verifySms(formData.phoneNumber, formData.smsCode);

    // Step 5: Attach payment method (paymentMethodId from Stripe.js)
    await api.enroll.verifyPayment({
        paymentMethodId: formData.stripePaymentMethodId,
        enrollmentId,
        billingEmail: formData.email,
    });

    // Step 6: Fetch and sign service agreements
    const tos = await api.enroll.getAgreement('terms_of_service');
    const dpa = await api.enroll.getAgreement('data_processing');

    await api.enroll.signAgreement({
        enrollmentId,
        agreementType: 'terms_of_service',
        version: tos.version,
        acceptedAt: new Date().toISOString(),
        ipAddress: formData.clientIp,
        userAgent: formData.userAgent,
    });

    await api.enroll.signAgreement({
        enrollmentId,
        agreementType: 'data_processing',
        version: dpa.version,
        acceptedAt: new Date().toISOString(),
        ipAddress: formData.clientIp,
        userAgent: formData.userAgent,
    });

    // Step 7: Complete enrollment — triggers provisioning
    const completion = await api.enroll.completeEnrollment(enrollmentId, {
        adminPassword: formData.adminPassword,
        plan: formData.plan || 'professional',
        referralCode: formData.referralCode,
    });

    console.log('Provisioning started:', completion.apiBaseUrl);

    // Step 8: Poll until ready
    await waitForAccountReady(enrollmentId);

    return {
        enrollmentId,
        namespace: formData.namespace,
        apiBaseUrl: completion.apiBaseUrl,
    };
}

async function waitForAccountReady(enrollmentId, timeoutMs = 300_000) {
    const deadline = Date.now() + timeoutMs;
    let delay = 2000;

    while (Date.now() < deadline) {
        const build = await api.enroll.getBuildStatus(enrollmentId);

        if (build.status === 'ready') return build;
        if (build.status === 'failed') throw new Error('Account provisioning failed');

        await new Promise((r) => setTimeout(r, delay));
        delay = Math.min(delay * 1.5, 15_000); // cap at 15s
    }

    throw new Error('Account provisioning timed out');
}
```

---

### Pattern 2 — Multi-Step Wizard with State Persistence

Break enrollment into discrete wizard steps with backend state storage so users can resume after browser close:

```javascript
// Enrollment state machine
const STEPS = {
    NAMESPACE: 'namespace',
    COMPANY_INFO: 'company_info',
    EMAIL_VERIFY: 'email_verify',
    SMS_VERIFY: 'sms_verify',
    PAYMENT: 'payment',
    AGREEMENTS: 'agreements',
    COMPLETE: 'complete',
    DONE: 'done',
};

class EnrollmentWizard {
    constructor(api, store) {
        this.api = api;
        this.store = store; // e.g., Redis or DB
    }

    async getOrCreateEnrollment(sessionId) {
        const saved = await this.store.get(`enrollment:${sessionId}`);
        if (saved) return JSON.parse(saved);
        return { step: STEPS.NAMESPACE, enrollmentId: null };
    }

    async saveState(sessionId, state) {
        await this.store.set(
            `enrollment:${sessionId}`,
            JSON.stringify(state),
            'EX',
            86400 // 24h TTL
        );
    }

    async advance(sessionId, stepData) {
        const state = await this.getOrCreateEnrollment(sessionId);

        switch (state.step) {
            case STEPS.NAMESPACE: {
                const { available } = await this.api.enroll.checkNamespace(stepData.namespace);
                if (!available) throw new Error('Namespace taken');
                state.namespace = stepData.namespace;
                state.step = STEPS.COMPANY_INFO;
                break;
            }

            case STEPS.COMPANY_INFO: {
                const enrollment = await this.api.enroll.collectCompanyInfo({
                    namespace: state.namespace,
                    ...stepData,
                });
                state.enrollmentId = enrollment.enrollmentId;
                state.email = stepData.email;
                state.phoneNumber = stepData.phoneNumber;
                state.step = STEPS.EMAIL_VERIFY;
                break;
            }

            case STEPS.EMAIL_VERIFY: {
                await this.api.enroll.verifyEmail(state.email, stepData.code);
                state.emailVerified = true;
                state.step = STEPS.SMS_VERIFY;
                break;
            }

            case STEPS.SMS_VERIFY: {
                await this.api.enroll.verifySms(state.phoneNumber, stepData.code);
                state.phoneVerified = true;
                state.step = STEPS.PAYMENT;
                break;
            }

            case STEPS.PAYMENT: {
                await this.api.enroll.verifyPayment({
                    paymentMethodId: stepData.paymentMethodId,
                    enrollmentId: state.enrollmentId,
                });
                state.paymentVerified = true;
                state.step = STEPS.AGREEMENTS;
                break;
            }

            case STEPS.AGREEMENTS: {
                const [tos, dpa] = await Promise.all([
                    this.api.enroll.getAgreement('terms_of_service'),
                    this.api.enroll.getAgreement('data_processing'),
                ]);
                await Promise.all([
                    this.api.enroll.signAgreement({
                        enrollmentId: state.enrollmentId,
                        agreementType: 'terms_of_service',
                        version: tos.version,
                        acceptedAt: new Date().toISOString(),
                        ipAddress: stepData.ipAddress,
                    }),
                    this.api.enroll.signAgreement({
                        enrollmentId: state.enrollmentId,
                        agreementType: 'data_processing',
                        version: dpa.version,
                        acceptedAt: new Date().toISOString(),
                        ipAddress: stepData.ipAddress,
                    }),
                ]);
                state.agreementsSigned = true;
                state.step = STEPS.COMPLETE;
                break;
            }

            case STEPS.COMPLETE: {
                const completion = await this.api.enroll.completeEnrollment(
                    state.enrollmentId,
                    {
                        adminPassword: stepData.adminPassword,
                        plan: stepData.plan || 'professional',
                    }
                );
                state.apiBaseUrl = completion.apiBaseUrl;
                state.step = STEPS.DONE;
                break;
            }

            default:
                throw new Error(`Unknown step: ${state.step}`);
        }

        await this.saveState(sessionId, state);
        return state;
    }
}
```

---

### Pattern 3 — Namespace Availability Widget

A responsive namespace-picker component that debounces checks and shows real-time feedback:

```javascript
class NamespacePicker {
    constructor(api, inputEl, statusEl) {
        this.api = api;
        this.input = inputEl;
        this.status = statusEl;
        this.debounceTimer = null;
        this.lastChecked = null;

        this.input.addEventListener('input', () => this.onInput());
    }

    onInput() {
        const raw = this.input.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
        this.input.value = raw; // Sanitize in place

        clearTimeout(this.debounceTimer);

        if (raw.length < 3) {
            this.showStatus('neutral', 'At least 3 characters required');
            return;
        }
        if (raw.length > 32) {
            this.showStatus('error', 'Maximum 32 characters');
            return;
        }

        this.showStatus('checking', 'Checking availability...');
        this.debounceTimer = setTimeout(() => this.check(raw), 400);
    }

    async check(namespace) {
        if (namespace === this.lastChecked) return;
        this.lastChecked = namespace;

        try {
            const { available } = await this.api.enroll.checkNamespace(namespace);
            if (namespace !== this.input.value) return; // stale
            if (available) {
                this.showStatus('available', `✅ "${namespace}" is available`);
            } else {
                this.showStatus('taken', `❌ "${namespace}" is taken`);
            }
        } catch (err) {
            this.showStatus('error', 'Could not check availability');
        }
    }

    showStatus(type, message) {
        this.status.className = `namespace-status namespace-status--${type}`;
        this.status.textContent = message;
    }
}

// Usage
const picker = new NamespacePicker(
    api,
    document.getElementById('namespace-input'),
    document.getElementById('namespace-status')
);
```

---

### Pattern 4 — KYC-Gated Enrollment

Include Stripe Identity verification for high-compliance environments:

```javascript
async function enrollWithKyc(formData) {
    // Standard enrollment steps...
    const enrollment = await api.enroll.collectCompanyInfo(formData);
    const { enrollmentId } = enrollment;

    await api.enroll.verifyEmail(formData.email, formData.emailCode);
    await api.enroll.verifySms(formData.phoneNumber, formData.smsCode);

    // Launch Stripe Identity verification
    const kycSession = await api.enroll.createStripeVerificationSession({
        enrollmentId,
        returnUrl: `${window.location.origin}/enroll/kyc-complete?enrollmentId=${enrollmentId}`,
    });

    // Store session ID for polling after redirect
    sessionStorage.setItem('kyc_session_id', kycSession.sessionId);
    sessionStorage.setItem('enrollment_id', enrollmentId);

    // Redirect to Stripe Identity flow
    const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
    await stripe.verifyIdentity(kycSession.clientSecret);
}

// On the /enroll/kyc-complete page
async function handleKycReturn() {
    const sessionId = sessionStorage.getItem('kyc_session_id');
    const enrollmentId = sessionStorage.getItem('enrollment_id');

    if (!sessionId || !enrollmentId) {
        window.location.href = '/enroll?error=session_expired';
        return;
    }

    const status = await api.enroll.getStripeVerificationStatus(sessionId);

    if (status.status === 'verified') {
        // Proceed to payment and agreements steps
        redirectToStep('payment', { enrollmentId });
    } else if (status.status === 'canceled') {
        redirectToStep('kyc', { enrollmentId, error: 'verification_canceled' });
    } else {
        // Still processing — poll
        await pollVerification(sessionId);
    }
}
```

---

### Pattern 5 — Partner Enrollment Dashboard

Build a real-time dashboard that monitors enrollments across all your white-label customers:

```javascript
async function getEnrollmentDashboard(enrollmentIds) {
    const statuses = await Promise.allSettled(
        enrollmentIds.map((id) => api.enroll.getBuildStatus(id))
    );

    const dashboard = {
        ready: [],
        building: [],
        failed: [],
        pending: [],
    };

    statuses.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            const build = result.value;
            const bucket = dashboard[build.status] ?? dashboard.pending;
            bucket.push({
                enrollmentId: enrollmentIds[index],
                namespace: build.namespace,
                progress: build.progress,
                estimatedSecondsRemaining: build.estimatedSecondsRemaining,
            });
        } else {
            console.error(`Failed to fetch status for ${enrollmentIds[index]}:`, result.reason);
        }
    });

    console.log(`
Enrollment Dashboard:
  Ready:    ${dashboard.ready.length}
  Building: ${dashboard.building.length}
  Failed:   ${dashboard.failed.length}
  Pending:  ${dashboard.pending.length}
    `);

    // Alert on failures
    dashboard.failed.forEach(({ enrollmentId, namespace }) => {
        console.error(`⚠️  Provisioning failed for ${namespace} (${enrollmentId}) — requires support`);
    });

    return dashboard;
}
```
