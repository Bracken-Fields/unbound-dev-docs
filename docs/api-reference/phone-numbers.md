---
id: phone-numbers
title: Phone Numbers
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Phone Numbers

`api.phoneNumbers` — Search, order, configure, and port phone numbers.

---

## Search Available Numbers

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/search?type=local&country=US&state=CA&city=Los+Angeles&contains=555&sms=true&mms=true&voice=true&limit=20", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" },
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$query = http_build_query([
    "type" => "local",
    "country" => "US",
    "state" => "CA",
    "city" => "Los Angeles",
    "contains" => "555",
    "sms" => "true",
    "mms" => "true",
    "voice" => "true",
    "limit" => 20,
]);
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/search?" . $query);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/phone-number/search",
    headers={"Authorization": "Bearer {token}"},
    params={
        "type": "local",
        "country": "US",
        "state": "CA",
        "city": "Los Angeles",
        "contains": "555",
        "sms": True,
        "mms": True,
        "voice": True,
        "limit": 20,
    },
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/search?type=local&country=US&state=CA&city=Los+Angeles&contains=555&sms=true&mms=true&voice=true&limit=20" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Order Numbers

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const order = await api.phoneNumbers.order({
    phoneNumbers: ['+12135550100', '+12135550101'],
    name: 'LA Support Line',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/order", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    phoneNumbers: ["+12135550100", "+12135550101"],
    name: "LA Support Line",
  }),
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/order");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "phoneNumbers" => ["+12135550100", "+12135550101"],
    "name" => "LA Support Line",
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/phone-number/order",
    headers={"Authorization": "Bearer {token}"},
    json={
        "phoneNumbers": ["+12135550100", "+12135550101"],
        "name": "LA Support Line",
    },
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/order" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumbers": ["+12135550100", "+12135550101"],
    "name": "LA Support Line"
  }'
```

</TabItem>
</Tabs>

---

## Configure a Number

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/number-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Main Support",
    voiceWebHookUrl: "https://yourapp.com/webhooks/voice",
    messagingWebHookUrl: "https://yourapp.com/webhooks/sms",
    voiceApp: "workflow",
    recordCalls: true,
    voiceRecordTypeId: "record-type-id",
    messagingRecordTypeId: "record-type-id",
  }),
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/number-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "Main Support",
    "voiceWebHookUrl" => "https://yourapp.com/webhooks/voice",
    "messagingWebHookUrl" => "https://yourapp.com/webhooks/sms",
    "voiceApp" => "workflow",
    "recordCalls" => true,
    "voiceRecordTypeId" => "record-type-id",
    "messagingRecordTypeId" => "record-type-id",
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.put(
    "https://{namespace}.api.unbound.cx/phone-number/number-id",
    headers={"Authorization": "Bearer {token}"},
    json={
        "name": "Main Support",
        "voiceWebHookUrl": "https://yourapp.com/webhooks/voice",
        "messagingWebHookUrl": "https://yourapp.com/webhooks/sms",
        "voiceApp": "workflow",
        "recordCalls": True,
        "voiceRecordTypeId": "record-type-id",
        "messagingRecordTypeId": "record-type-id",
    },
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "https://{namespace}.api.unbound.cx/phone-number/number-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Support",
    "voiceWebHookUrl": "https://yourapp.com/webhooks/voice",
    "messagingWebHookUrl": "https://yourapp.com/webhooks/sms",
    "voiceApp": "workflow",
    "recordCalls": true,
    "voiceRecordTypeId": "record-type-id",
    "messagingRecordTypeId": "record-type-id"
  }'
```

</TabItem>
</Tabs>

---

## Update CNAM (Caller ID Name)

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.phoneNumbers.updateCnam('+12135550100', {
    cnam: 'Acme Support',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/cnam", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    phone: "+12135550100",
    cnam: "Acme Support",
  }),
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/cnam");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "phone" => "+12135550100",
    "cnam" => "Acme Support",
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.put(
    "https://{namespace}.api.unbound.cx/phone-number/cnam",
    headers={"Authorization": "Bearer {token}"},
    json={
        "phone": "+12135550100",
        "cnam": "Acme Support",
    },
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "https://{namespace}.api.unbound.cx/phone-number/cnam" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+12135550100",
    "cnam": "Acme Support"
  }'
```

</TabItem>
</Tabs>

---

## Format a Number

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const formatted = await api.phoneNumbers.format('2135550100');
// → '+12135550100' (E.164)
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/format/2135550100", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" },
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/format/2135550100");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/phone-number/format/2135550100",
    headers={"Authorization": "Bearer {token}"},
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/format/2135550100" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Release a Number

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.phoneNumbers.remove('+12135550100');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/+12135550100", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" },
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/+12135550100");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    "https://{namespace}.api.unbound.cx/phone-number/+12135550100",
    headers={"Authorization": "Bearer {token}"},
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/phone-number/+12135550100" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Get Routing Options

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get all routing options
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/routing-options", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" },
});
const data = await res.json();

// Get only voice routing options
const voiceRes = await fetch("https://{namespace}.api.unbound.cx/phone-number/routing-options?type=voice", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" },
});

// Search workflows by name
const filteredRes = await fetch("https://{namespace}.api.unbound.cx/phone-number/routing-options?appType=workflows&search=customer", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" },
});

// Get versions for a specific workflow
const versionsRes = await fetch("https://{namespace}.api.unbound.cx/phone-number/routing-options?workflowId=wf-123", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" },
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get all routing options
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/routing-options");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Get only voice routing options
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/routing-options?type=voice");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$voice = json_decode(curl_exec($ch), true);
curl_close($ch);

// Search workflows by name
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/routing-options?appType=workflows&search=customer");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$filtered = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

headers = {"Authorization": "Bearer {token}"}

# Get all routing options
response = requests.get(
    "https://{namespace}.api.unbound.cx/phone-number/routing-options",
    headers=headers,
)
data = response.json()

# Get only voice routing options
voice = requests.get(
    "https://{namespace}.api.unbound.cx/phone-number/routing-options",
    headers=headers,
    params={"type": "voice"},
).json()

# Search workflows by name
filtered = requests.get(
    "https://{namespace}.api.unbound.cx/phone-number/routing-options",
    headers=headers,
    params={"appType": "workflows", "search": "customer"},
).json()

# Get versions for a specific workflow
versions = requests.get(
    "https://{namespace}.api.unbound.cx/phone-number/routing-options",
    headers=headers,
    params={"workflowId": "wf-123"},
).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get all routing options
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/routing-options" \
  -H "Authorization: Bearer {token}"

# Get only voice routing options
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/routing-options?type=voice" \
  -H "Authorization: Bearer {token}"

# Search workflows by name
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/routing-options?appType=workflows&search=customer" \
  -H "Authorization: Bearer {token}"

# Get versions for a specific workflow
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/routing-options?workflowId=wf-123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Number Porting

### Check Portability

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Phase 1: Internal validation
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/check", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    phoneNumbers: ["+15551234567", "+15551234568"],
  }),
});
const check = await res.json();

// Phase 2: External carrier validation
const fullRes = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/check", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    phoneNumbers: ["+15551234567"],
    portingOrderId: "order-id",
    runPortabilityCheck: true,
  }),
});
const fullCheck = await fullRes.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Phase 1: Internal validation
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/check");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "phoneNumbers" => ["+15551234567", "+15551234568"],
]));
$check = json_decode(curl_exec($ch), true);
curl_close($ch);

// Phase 2: External carrier validation
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/check");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "phoneNumbers" => ["+15551234567"],
    "portingOrderId" => "order-id",
    "runPortabilityCheck" => true,
]));
$fullCheck = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

headers = {"Authorization": "Bearer {token}"}
url = "https://{namespace}.api.unbound.cx/phone-number/porting/check"

# Phase 1: Internal validation
check = requests.post(
    url,
    headers=headers,
    json={
        "phoneNumbers": ["+15551234567", "+15551234568"],
    },
).json()

# Phase 2: External carrier validation
full_check = requests.post(
    url,
    headers=headers,
    json={
        "phoneNumbers": ["+15551234567"],
        "portingOrderId": "order-id",
        "runPortabilityCheck": True,
    },
).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Phase 1: Internal validation
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/check" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumbers": ["+15551234567", "+15551234568"]
  }'

# Phase 2: External carrier validation
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/check" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumbers": ["+15551234567"],
    "portingOrderId": "order-id",
    "runPortabilityCheck": true
  }'
```

</TabItem>
</Tabs>

### Create a Porting Order

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/order", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    customerReference: "CUST-2024-001",
    endUser: {
      admin: {
        entityName: "Acme Corp",
        authPersonName: "Jane Smith",
        billingPhoneNumber: "+18005551234",
        accountNumber: "ACC-123456",
        pinPasscode: "1234",
      },
      location: {
        streetAddress: "123 Main St",
        locality: "Los Angeles",
        administrativeArea: "CA",
        postalCode: "90001",
        countryCode: "US",
      },
    },
    activationSettings: {
      focDatetimeRequested: "2024-06-15T08:00:00Z",
      fastPortEligible: true,
    },
    portOrderType: "full",
  }),
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/order");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "customerReference" => "CUST-2024-001",
    "endUser" => [
        "admin" => [
            "entityName" => "Acme Corp",
            "authPersonName" => "Jane Smith",
            "billingPhoneNumber" => "+18005551234",
            "accountNumber" => "ACC-123456",
            "pinPasscode" => "1234",
        ],
        "location" => [
            "streetAddress" => "123 Main St",
            "locality" => "Los Angeles",
            "administrativeArea" => "CA",
            "postalCode" => "90001",
            "countryCode" => "US",
        ],
    ],
    "activationSettings" => [
        "focDatetimeRequested" => "2024-06-15T08:00:00Z",
        "fastPortEligible" => true,
    ],
    "portOrderType" => "full",
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/phone-number/porting/order",
    headers={"Authorization": "Bearer {token}"},
    json={
        "customerReference": "CUST-2024-001",
        "endUser": {
            "admin": {
                "entityName": "Acme Corp",
                "authPersonName": "Jane Smith",
                "billingPhoneNumber": "+18005551234",
                "accountNumber": "ACC-123456",
                "pinPasscode": "1234",
            },
            "location": {
                "streetAddress": "123 Main St",
                "locality": "Los Angeles",
                "administrativeArea": "CA",
                "postalCode": "90001",
                "countryCode": "US",
            },
        },
        "activationSettings": {
            "focDatetimeRequested": "2024-06-15T08:00:00Z",
            "fastPortEligible": True,
        },
        "portOrderType": "full",
    },
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/order" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "customerReference": "CUST-2024-001",
    "endUser": {
      "admin": {
        "entityName": "Acme Corp",
        "authPersonName": "Jane Smith",
        "billingPhoneNumber": "+18005551234",
        "accountNumber": "ACC-123456",
        "pinPasscode": "1234"
      },
      "location": {
        "streetAddress": "123 Main St",
        "locality": "Los Angeles",
        "administrativeArea": "CA",
        "postalCode": "90001",
        "countryCode": "US"
      }
    },
    "activationSettings": {
      "focDatetimeRequested": "2024-06-15T08:00:00Z",
      "fastPortEligible": true
    },
    "portOrderType": "full"
  }'
```

</TabItem>
</Tabs>

### Manage Porting Orders

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get order status
const orderRes = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id?includePhoneNumbers=true&includeExceptions=true&includeDocuments=true", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" },
});
const portOrder = await orderRes.json();

// List all orders
const listRes = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/order?status=pending", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" },
});
const orders = await listRes.json();

// Submit a draft order
await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/submit", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}" },
});

// Cancel an order
await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" },
});

// Get available FOC windows (activation dates)
const windowsRes = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/foc-windows", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" },
});
const windows = await windowsRes.json();

// Sync with carrier
await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/sync", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}" },
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get order status
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id?includePhoneNumbers=true&includeExceptions=true&includeDocuments=true");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$portOrder = json_decode(curl_exec($ch), true);
curl_close($ch);

// List all orders
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/order?status=pending");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$orders = json_decode(curl_exec($ch), true);
curl_close($ch);

// Submit a draft order
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/submit");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_exec($ch);
curl_close($ch);

// Cancel an order
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_exec($ch);
curl_close($ch);

// Get available FOC windows (activation dates)
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/foc-windows");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$windows = json_decode(curl_exec($ch), true);
curl_close($ch);

// Sync with carrier
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/sync");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

headers = {"Authorization": "Bearer {token}"}
base = "https://{namespace}.api.unbound.cx/phone-number/porting/order"

# Get order status
port_order = requests.get(
    f"{base}/order-id",
    headers=headers,
    params={
        "includePhoneNumbers": True,
        "includeExceptions": True,
        "includeDocuments": True,
    },
).json()

# List all orders
orders = requests.get(
    base,
    headers=headers,
    params={"status": "pending"},
).json()

# Submit a draft order
requests.post(f"{base}/order-id/submit", headers=headers)

# Cancel an order
requests.delete(f"{base}/order-id", headers=headers)

# Get available FOC windows (activation dates)
windows = requests.get(
    f"{base}/order-id/foc-windows",
    headers=headers,
).json()

# Sync with carrier
requests.post(f"{base}/order-id/sync", headers=headers)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get order status
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id?includePhoneNumbers=true&includeExceptions=true&includeDocuments=true" \
  -H "Authorization: Bearer {token}"

# List all orders
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/porting/order?status=pending" \
  -H "Authorization: Bearer {token}"

# Submit a draft order
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/submit" \
  -H "Authorization: Bearer {token}"

# Cancel an order
curl -X DELETE "https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id" \
  -H "Authorization: Bearer {token}"

# Get available FOC windows (activation dates)
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/foc-windows" \
  -H "Authorization: Bearer {token}"

# Sync with carrier
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/sync" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### Generate LOA (Letter of Authorization)

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const loa = await api.phoneNumbers.generateLoa({
    portingOrderId: 'order-id',
    signerName: 'Jane Smith',
    signerTitle: 'Director of IT',
});
// loa.documentId, loa.storageId, loa.url
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/loa", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    portingOrderId: "order-id",
    signerName: "Jane Smith",
    signerTitle: "Director of IT",
  }),
});
const loa = await res.json();
// loa.documentId, loa.storageId, loa.url
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/loa");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "portingOrderId" => "order-id",
    "signerName" => "Jane Smith",
    "signerTitle" => "Director of IT",
]));
$loa = json_decode(curl_exec($ch), true);
curl_close($ch);
// $loa["documentId"], $loa["storageId"], $loa["url"]
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/phone-number/porting/loa",
    headers={"Authorization": "Bearer {token}"},
    json={
        "portingOrderId": "order-id",
        "signerName": "Jane Smith",
        "signerTitle": "Director of IT",
    },
)
loa = response.json()
# loa["documentId"], loa["storageId"], loa["url"]
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/loa" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "portingOrderId": "order-id",
    "signerName": "Jane Smith",
    "signerTitle": "Director of IT"
  }'
```

</TabItem>
</Tabs>

### Auto-Create Orders by Carrier

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Preview groupings
const previewRes = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/auto-create", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    phoneNumbers: ["+15551234567", "+15551234568", "+15551234569"],
    name: "Q1 2024 Port",
    dryRun: true,
  }),
});
const preview = await previewRes.json();

// Create orders
const resultRes = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/auto-create", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    phoneNumbers: ["+15551234567", "+15551234568", "+15551234569"],
    name: "Q1 2024 Port",
    dryRun: false,
  }),
});
const result = await resultRes.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Preview groupings
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/auto-create");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "phoneNumbers" => ["+15551234567", "+15551234568", "+15551234569"],
    "name" => "Q1 2024 Port",
    "dryRun" => true,
]));
$preview = json_decode(curl_exec($ch), true);
curl_close($ch);

// Create orders
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/auto-create");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "phoneNumbers" => ["+15551234567", "+15551234568", "+15551234569"],
    "name" => "Q1 2024 Port",
    "dryRun" => false,
]));
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

headers = {"Authorization": "Bearer {token}"}
url = "https://{namespace}.api.unbound.cx/phone-number/porting/auto-create"

# Preview groupings
preview = requests.post(
    url,
    headers=headers,
    json={
        "phoneNumbers": ["+15551234567", "+15551234568", "+15551234569"],
        "name": "Q1 2024 Port",
        "dryRun": True,
    },
).json()

# Create orders
result = requests.post(
    url,
    headers=headers,
    json={
        "phoneNumbers": ["+15551234567", "+15551234568", "+15551234569"],
        "name": "Q1 2024 Port",
        "dryRun": False,
    },
).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Preview groupings
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/auto-create" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumbers": ["+15551234567", "+15551234568", "+15551234569"],
    "name": "Q1 2024 Port",
    "dryRun": true
  }'

# Create orders
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/auto-create" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumbers": ["+15551234567", "+15551234568", "+15551234569"],
    "name": "Q1 2024 Port",
    "dryRun": false
  }'
```

</TabItem>
</Tabs>

### Comments

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get all comments
const commentsRes = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" },
});
const comments = await commentsRes.json();

// Post a public comment (shared with carrier)
await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    comment: "Please expedite — customer is switching providers.",
    isInternal: false,
  }),
});

// Post an internal note
await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    comment: "Called customer — confirmed details.",
    isInternal: true,
  }),
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get all comments
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$comments = json_decode(curl_exec($ch), true);
curl_close($ch);

// Post a public comment (shared with carrier)
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "comment" => "Please expedite — customer is switching providers.",
    "isInternal" => false,
]));
curl_exec($ch);
curl_close($ch);

// Post an internal note
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "comment" => "Called customer — confirmed details.",
    "isInternal" => true,
]));
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

headers = {"Authorization": "Bearer {token}"}
url = "https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment"

# Get all comments
comments = requests.get(url, headers=headers).json()

# Post a public comment (shared with carrier)
requests.post(
    url,
    headers=headers,
    json={
        "comment": "Please expedite — customer is switching providers.",
        "isInternal": False,
    },
)

# Post an internal note
requests.post(
    url,
    headers=headers,
    json={
        "comment": "Called customer — confirmed details.",
        "isInternal": True,
    },
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get all comments
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment" \
  -H "Authorization: Bearer {token}"

# Post a public comment (shared with carrier)
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Please expedite — customer is switching providers.",
    "isInternal": false
  }'

# Post an internal note
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Called customer — confirmed details.",
    "isInternal": true
  }'
```

</TabItem>
</Tabs>
