---
id: phone-numbers
title: Phone Numbers
---

# Phone Numbers

`api.phoneNumbers` — Search, order, configure, and port phone numbers.

---

## Search Available Numbers

```javascript
const numbers = await api.phoneNumbers.search({
  type: 'local',          // 'local' | 'toll_free'
  country: 'US',
  state: 'CA',
  city: 'Los Angeles',
  contains: '555',        // filter by digit pattern
  sms: true,
  mms: true,
  voice: true,
  limit: 20,
});
```

---

## Order Numbers

```javascript
const order = await api.phoneNumbers.order({
  phoneNumbers: ['+12135550100', '+12135550101'],
  name: 'LA Support Line',
});
```

---

## Configure a Number

```javascript
await api.phoneNumbers.update('number-id', {
  name: 'Main Support',
  voiceWebHookUrl: 'https://yourapp.com/webhooks/voice',
  messagingWebHookUrl: 'https://yourapp.com/webhooks/sms',
  voiceApp: 'workflow',
  recordCalls: true,
  voiceRecordTypeId: 'record-type-id',
  messagingRecordTypeId: 'record-type-id',
});
```

---

## Update CNAM (Caller ID Name)

```javascript
await api.phoneNumbers.updateCnam('+12135550100', {
  cnam: 'Acme Support',
});
```

---

## Format a Number

```javascript
const formatted = await api.phoneNumbers.format('2135550100');
// → '+12135550100' (E.164)
```

---

## Release a Number

```javascript
await api.phoneNumbers.remove('+12135550100');
```

---

## Get Routing Options

```javascript
// Get all routing app types and their options
const options = await api.phoneNumbers.getRoutingOptions();

// Get only voice routing options
const voice = await api.phoneNumbers.getRoutingOptions({ type: 'voice' });

// Get available workflows
const workflows = await api.phoneNumbers.getRoutingOptions({ appType: 'workflows' });

// Search workflows by name
const filtered = await api.phoneNumbers.getRoutingOptions({
  appType: 'workflows',
  search: 'customer',
});

// Get versions for a specific workflow
const versions = await api.phoneNumbers.getRoutingOptions({ workflowId: 'wf-123' });
```

---

## Number Porting

### Check Portability

```javascript
// Phase 1: Internal validation
const check = await api.phoneNumbers.checkPortability({
  phoneNumbers: ['+15551234567', '+15551234568'],
});

// Phase 2: External carrier validation
const fullCheck = await api.phoneNumbers.checkPortability({
  phoneNumbers: ['+15551234567'],
  portingOrderId: 'order-id',
  runPortabilityCheck: true,
});
```

### Create a Porting Order

```javascript
const order = await api.phoneNumbers.createPortingOrder({
  customerReference: 'CUST-2024-001',
  endUser: {
    admin: {
      entityName: 'Acme Corp',
      authPersonName: 'Jane Smith',
      billingPhoneNumber: '+18005551234',
      accountNumber: 'ACC-123456',
      pinPasscode: '1234',
    },
    location: {
      streetAddress: '123 Main St',
      locality: 'Los Angeles',
      administrativeArea: 'CA',
      postalCode: '90001',
      countryCode: 'US',
    },
  },
  activationSettings: {
    focDatetimeRequested: '2024-06-15T08:00:00Z',
    fastPortEligible: true,
  },
  portOrderType: 'full',
});
```

### Manage Porting Orders

```javascript
// Get order status
const portOrder = await api.phoneNumbers.getPortingOrder('order-id', {
  includePhoneNumbers: true,
  includeExceptions: true,
  includeDocuments: true,
});

// List all orders
const orders = await api.phoneNumbers.getPortingOrders({ status: 'pending' });

// Submit a draft order
await api.phoneNumbers.submitPortingOrder('order-id');

// Cancel an order
await api.phoneNumbers.deletePortingOrder('order-id');

// Get available FOC windows (activation dates)
const windows = await api.phoneNumbers.getFocWindows('order-id');

// Sync with carrier
await api.phoneNumbers.syncPortingOrder('order-id');
```

### Generate LOA (Letter of Authorization)

```javascript
const loa = await api.phoneNumbers.generateLoa({
  portingOrderId: 'order-id',
  signerName: 'Jane Smith',
  signerTitle: 'Director of IT',
});
// loa.documentId, loa.storageId, loa.url
```

### Auto-Create Orders by Carrier

```javascript
// Preview groupings
const preview = await api.phoneNumbers.autoCreateOrders({
  phoneNumbers: ['+15551234567', '+15551234568', '+15551234569'],
  name: 'Q1 2024 Port',
  dryRun: true,
});

// Create orders
const result = await api.phoneNumbers.autoCreateOrders({
  phoneNumbers: ['+15551234567', '+15551234568', '+15551234569'],
  name: 'Q1 2024 Port',
  dryRun: false,
});
```

### Comments

```javascript
// Get all comments
const comments = await api.phoneNumbers.getPortingComments('order-id');

// Post a public comment (shared with carrier)
await api.phoneNumbers.postPortingComment('order-id', {
  comment: 'Please expedite — customer is switching providers.',
  isInternal: false,
});

// Post an internal note
await api.phoneNumbers.postPortingComment('order-id', {
  comment: 'Called customer — confirmed details.',
  isInternal: true,
});
```
