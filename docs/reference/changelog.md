---
id: changelog
title: SDK Changelog
sidebar_label: Changelog
---

# SDK Changelog

Release history for the Unbound JavaScript/Node.js SDK.

---

## v2.6.0 — LOA Generation & Enhanced Document Management

### New Features

#### `sdk.phoneNumbers.generateLoa(params)` — NEW

Fully automated Letter of Authorization (LOA) generation for porting orders. This method processes an RTF template, replaces brand and order variables, generates a professional PDF, uploads it to Storage, and attaches it to the porting order — all in a single call.

```javascript
const result = await sdk.phoneNumbers.generateLoa({
    portingOrderId: 'port-123',
    signerName: 'John Smith',
    signerTitle: 'IT Director',
});

// {
//   success: true,
//   loaDocumentId: "doc-456",
//   storageId: "file-789",
//   filename: "loa-port-123-1640995200000.pdf",
//   message: "Letter of Authorization generated and attached successfully"
// }
```

**Template variable support:**

| Variable | Source |
|---|---|
| `{{BRAND_LOGO}}` | Brand configuration |
| `{{BRAND_NAME}}` | Brand configuration |
| `{{NUMBER_PORT_ORDER_ACCOUNT_NAME}}` | Porting order `endUser.admin.entityName` |
| `{{NUMBER_PORT_ORDER_STREET_ADDRESS}}` | Porting order `endUser.location.streetAddress` |
| `{{NUMBER_PORT_ORDER_CITY}}` | Porting order `endUser.location.city` |
| `{{NUMBER_PORT_ORDER_STATE}}` | Porting order `endUser.location.state` |
| `{{NUMBER_PORT_ORDER_ZIP_CODE}}` | Porting order `endUser.location.zipCode` |
| `{{NUMBER_PORT_ORDER_CURRENT_CARRIER}}` | Porting order current carrier |
| `{{NUMBER_PORT_ORDER_BTN}}` | Billing Telephone Number |
| `{{NUMBER_PORT_ORDER_NUMBERS}}` | Comma-separated phone number list |
| `{{SIGNATURE}}` | Digital signature image |
| `{{PERSON_NAME}}` | `signerName` parameter |
| `{{PERSON_TITLE}}` | `signerTitle` parameter |
| `{{DATE}}` | Generation date |

**Complete LOA workflow:**

```javascript
// 1. Create porting order
const order = await sdk.phoneNumbers.createPortingOrder({
    customerReference: 'CUST-123',
    endUser: {
        admin: { entityName: 'Acme Corp' },
        location: {
            streetAddress: '123 Main St',
            city: 'Indianapolis',
            state: 'IN',
            zipCode: '46204',
        },
    },
});

// 2. Add and validate phone numbers
await sdk.phoneNumbers.checkPortability({
    phoneNumbers: ['+15551234567', '+15559876543'],
    portingOrderId: order.id,
    runPortabilityCheck: true,
});

// 3. Generate LOA — uploads and attaches automatically
const loa = await sdk.phoneNumbers.generateLoa({
    portingOrderId: order.id,
    signerName: 'John Smith',
    signerTitle: 'IT Director',
});

console.log(`LOA ready: ${loa.filename}`);
```

#### `sdk.phoneNumbers.attachPortingDocument(params)` — Enhanced

- **Document replacement**: Automatically replaces an existing document of the same type rather than creating a duplicate
- **File clearing**: Pass `storageId: null` to clear an attached document
- **Action tracking**: Response now includes `action: "created"` or `action: "updated"`

```javascript
// Replace an existing document
const result = await sdk.phoneNumbers.attachPortingDocument({
    portingOrderId: order.id,
    documentType: 'loa',
    storageId: 'file-new-789',
});
// result.action === "updated"

// Clear a document
await sdk.phoneNumbers.attachPortingDocument({
    portingOrderId: order.id,
    documentType: 'loa',
    storageId: null,
});
```

---

## v2.5.0 — Enhanced Phone Number Porting

### New Features

#### Two-Phase Portability Validation

`checkPortability()` now supports a `runPortabilityCheck` boolean parameter (default: `false`) enabling a two-phase validation strategy:

**Phase 1 — Internal validation (default, fast)**

Uses internal LRN (Local Routing Number) lookup for instant carrier and compatibility checks. No external API calls; results are immediate.

```javascript
// Fast — no external calls
await sdk.phoneNumbers.checkPortability({
    phoneNumbers: ['+15551234567', '+15559876543'],
    portingOrderId: order.id,
    // runPortabilityCheck: false (default)
});
```

**Phase 2 — External validation (when ready to submit)**

Runs a full external portability check. Use this right before submitting the order.

```javascript
// Full external validation
await sdk.phoneNumbers.checkPortability({
    phoneNumbers: ['+15551234567', '+15559876543'],
    portingOrderId: order.id,
    runPortabilityCheck: true,
});
```

**Recommended pattern:**

```javascript
// During order build-up: fast internal validation
await sdk.phoneNumbers.checkPortability({
    phoneNumbers: numbersToAdd,
    portingOrderId: order.id,
});

// Pre-submission: full external validation
await sdk.phoneNumbers.checkPortability({
    phoneNumbers: allOrderNumbers,
    portingOrderId: order.id,
    runPortabilityCheck: true,
});

// Submit once external validation passes
await sdk.phoneNumbers.submitPortingOrder(order.id);
```

### Updated Compatibility Rules

| Number Type | US/Canada | International |
|---|---|---|
| Mobile + landline + local | Can be grouped | Must be separate orders |
| Toll-free | Separate order required | Separate order required |
| Mixed carriers | Not allowed | Not allowed |

### New Database Fields

The phone number entries on porting orders now include:

| Field | Description |
|---|---|
| `currentProvider` | SPID carrier name from LRN lookup |
| `country` | Extracted from E.164 phone number |
| `phoneNumberType` | `mobile`, `local`, `toll-free` from LRN |
| `portabilityStatus` | `pending` → `portable` / `not-portable` / `error` |

### Migration

No breaking changes. Existing code continues to work without modification. The `runPortabilityCheck` parameter is purely additive.

---

## v2.4.0 — Breaking Changes: Phone Number Porting Redesign

:::danger Breaking Changes
This release contains breaking changes to `createPortingOrder()` and `updatePortingOrder()`. See the migration guide below.
:::

### What Changed

Phone numbers are no longer passed directly to `createPortingOrder()` or `updatePortingOrder()`. Instead, numbers must be added through `checkPortability()` with a `portingOrderId`. This enforces proper validation before numbers are associated with an order.

#### `createPortingOrder(params)` — Parameters removed

| Parameter | Status |
|---|---|
| `phoneNumbers` | ❌ Removed |
| `phoneNumberBlocks` | ❌ Removed |
| `phoneNumberConfiguration` | ❌ Removed |
| `customerReference` | ✅ Kept |
| `endUser` | ✅ Kept |
| `activationSettings` | ✅ Kept |
| `tags` | ✅ Kept |

#### `updatePortingOrder(id, params)` — Parameters removed

Same removals as `createPortingOrder` above.

#### `checkPortability(params)` — New parameter added

| Parameter | Type | Description |
|---|---|---|
| `portingOrderId` | string (optional) | Associates validated numbers with an order |

### Migration Guide

**Before (v2.3.x):**

```javascript
// Old: phone numbers in order creation
const order = await sdk.phoneNumbers.createPortingOrder({
    phoneNumbers: ['+15551234567', '+15559876543'],
    customerReference: 'CUST-123',
    endUser: { admin: { entityName: 'My Company' } },
});
```

**After (v2.4.0):**

```javascript
// Step 1: Create the order (no phone numbers yet)
const order = await sdk.phoneNumbers.createPortingOrder({
    customerReference: 'CUST-123',
    endUser: { admin: { entityName: 'My Company' } },
});

// Step 2: Validate and associate numbers
await sdk.phoneNumbers.checkPortability({
    phoneNumbers: ['+15551234567', '+15559876543'],
    portingOrderId: order.id,
});

// Step 3: Retrieve the complete order (now includes phone numbers)
const completeOrder = await sdk.phoneNumbers.getPortingOrder(order.id);
console.log(completeOrder.phoneNumbers); // [{...}, {...}]
```

### New Validations

`checkPortability()` with `portingOrderId` now validates:

- **Ownership**: Numbers not already owned by the account
- **Availability**: Numbers not in another active porting order
- **Compatibility**: Numbers compatible within the same order (country, type, SPID, FastPort)

**Compatibility error example:**

```javascript
try {
    await sdk.phoneNumbers.checkPortability({
        phoneNumbers: ['+15551234567'], // US local
        portingOrderId: 'existing-order-with-uk-numbers',
    });
} catch (error) {
    console.error(error.message);
    // "Cannot add these numbers to the existing porting order.
    //  Numbers differ in: country. Please create a separate porting order."
}
```

### Required Frontend Updates

If you have a frontend that uses the SDK directly:

1. **Update order creation flow**: Remove `phoneNumbers` from the initial `createPortingOrder()` call
2. **Add a validation step**: Call `checkPortability()` with `portingOrderId` after creating the order
3. **Handle new errors**: Surface compatibility error messages to users
4. **Update number management UI**: Use the dedicated add/remove flow for porting numbers

---

## Versioning Policy

The Unbound SDK follows [Semantic Versioning](https://semver.org/):

- **Patch** (x.x.Z): Bug fixes, no API changes
- **Minor** (x.Y.0): New features, backwards-compatible
- **Major** (X.0.0): Breaking changes

Breaking changes in minor releases (like v2.4.0) occur during the pre-1.0 development phase where the API is still stabilizing.

---

*For questions or migration assistance, contact [support@unbound.cx](mailto:support@unbound.cx).*
