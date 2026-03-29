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
DATA=$(cat <<'EOF'
{
  "phoneNumbers": ["+12135550100", "+12135550101"],
  "name": "LA Support Line"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/phone-number/order" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
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
DATA=$(cat <<'EOF'
{
  "name": "Main Support",
  "voiceWebHookUrl": "https://yourapp.com/webhooks/voice",
  "messagingWebHookUrl": "https://yourapp.com/webhooks/sms",
  "voiceApp": "workflow",
  "recordCalls": true,
  "voiceRecordTypeId": "record-type-id",
  "messagingRecordTypeId": "record-type-id"
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/phone-number/number-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
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
DATA=$(cat <<'EOF'
{
  "phone": "+12135550100",
  "cnam": "Acme Support"
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/phone-number/cnam" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
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
DATA=$(cat <<'EOF'
{
  "phoneNumbers": ["+15551234567", "+15551234568"]
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/check" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Phase 2: External carrier validation
DATA=$(cat <<'EOF'
{
  "phoneNumbers": ["+15551234567"],
  "portingOrderId": "order-id",
  "runPortabilityCheck": true
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/check" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
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
DATA=$(cat <<'EOF'
{
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
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/order" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
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

### Update a Porting Order

Update the metadata on an existing porting order — such as customer reference, end-user information, activation settings, or port type. All fields are optional; only the fields you provide are changed.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Update customer reference and end-user contact
const updated = await api.phoneNumbers.updatePortingOrder('order-id', {
    customerReference: 'ACME-PORT-2025-001',
    endUser: {
        companyName: 'Acme Corp',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+15551234567',
        email: 'jane.smith@acme.com',
    },
});

// Change activation timing (scheduled vs. immediate)
const updated = await api.phoneNumbers.updatePortingOrder('order-id', {
    activationSettings: {
        activationType: 'Scheduled',
        activationDate: '2025-09-15T14:00:00.000Z',
    },
});

// Change port order type
const updated = await api.phoneNumbers.updatePortingOrder('order-id', {
    portOrderType: 'FullPortOut',
    tags: ['priority', 'q3-migration'],
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Update customer reference and end-user contact
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id", {
    method: "PUT",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        customerReference: "ACME-PORT-2025-001",
        endUser: {
            companyName: "Acme Corp",
            firstName: "Jane",
            lastName: "Smith",
            phone: "+15551234567",
            email: "jane.smith@acme.com",
        },
    }),
});
const updated = await res.json();

// Change activation timing
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id", {
    method: "PUT",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        activationSettings: {
            activationType: "Scheduled",
            activationDate: "2025-09-15T14:00:00.000Z",
        },
    }),
});
const updated = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Update customer reference and end-user contact
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}",
    "Content-Type: application/json",
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "customerReference" => "ACME-PORT-2025-001",
    "endUser" => [
        "companyName" => "Acme Corp",
        "firstName" => "Jane",
        "lastName" => "Smith",
        "phone" => "+15551234567",
        "email" => "jane.smith@acme.com",
    ],
]));
$updated = json_decode(curl_exec($ch), true);
curl_close($ch);

// Change activation settings
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}",
    "Content-Type: application/json",
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "activationSettings" => [
        "activationType" => "Scheduled",
        "activationDate" => "2025-09-15T14:00:00.000Z",
    ],
]));
$updated = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

headers = {
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json",
}
base = "https://{namespace}.api.unbound.cx/phone-number/porting/orders"

# Update customer reference and end-user contact
updated = requests.put(
    f"{base}/order-id",
    headers=headers,
    json={
        "customerReference": "ACME-PORT-2025-001",
        "endUser": {
            "companyName": "Acme Corp",
            "firstName": "Jane",
            "lastName": "Smith",
            "phone": "+15551234567",
            "email": "jane.smith@acme.com",
        },
    },
).json()

# Change activation timing
updated = requests.put(
    f"{base}/order-id",
    headers=headers,
    json={
        "activationSettings": {
            "activationType": "Scheduled",
            "activationDate": "2025-09-15T14:00:00.000Z",
        },
    },
).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Update customer reference and end-user contact
curl -X PUT "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "customerReference": "ACME-PORT-2025-001",
    "endUser": {
      "companyName": "Acme Corp",
      "firstName": "Jane",
      "lastName": "Smith",
      "phone": "+15551234567",
      "email": "jane.smith@acme.com"
    }
  }'

# Change activation timing
curl -X PUT "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"activationSettings": {"activationType": "Scheduled", "activationDate": "2025-09-15T14:00:00.000Z"}}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Porting order ID |
| `customerReference` | string | — | Your internal reference/ticket number for this port |
| `endUser` | object | — | End-user contact info (see below) |
| `activationSettings` | object | — | Activation timing preferences (see below) |
| `portOrderType` | string | — | Port type — e.g., `'FullPortOut'`, `'PartialPortOut'` |
| `tags` | string[] | — | Arbitrary string tags for filtering/tracking |

**`endUser` object**

```javascript
{
    companyName: 'Acme Corp',         // string — business name
    firstName:   'Jane',              // string — contact first name
    lastName:    'Smith',             // string — contact last name
    phone:       '+15551234567',      // string — contact phone (E.164)
    email:       'jane@acme.com',     // string — contact email
}
```

**`activationSettings` object**

```javascript
{
    activationType: 'Scheduled',               // 'Scheduled' | 'Immediate'
    activationDate: '2025-09-15T14:00:00.000Z' // ISO 8601 UTC — only for 'Scheduled'
}
```

**Response** — Returns the updated porting order object.

> **Note:** Orders can only be updated while in `draft` or `pending` status. Once submitted, call support to make changes.

---

### Get FOC Windows — `phoneNumbers.getFocWindows(id)`

Fetch the available Firm Order Commitment (FOC) windows — i.e., the dates the carrier can activate the port. This call also syncs the order to the carrier if it hasn't been registered yet, so it may take a moment on first call.

Use the returned dates to present an activation date picker to your customer.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.phoneNumbers.getFocWindows('order-id');

console.log(result.orderReady);       // true — all required fields are complete
console.log(result.availableDates);
// [
//   { date: '2025-09-02T00:00:00.000Z', type: 'Standard', available: true },
//   { date: '2025-09-04T00:00:00.000Z', type: 'Express',  available: true },
// ]

// Pick an activation date and update the order
if (result.orderReady && result.availableDates.length > 0) {
    const earliest = result.availableDates[0];
    await api.phoneNumbers.updatePortingOrder('order-id', {
        activationSettings: {
            activationType: 'Scheduled',
            activationDate: earliest.date,
        },
    });
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch(
    "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/foc-windows",
    { headers: { "Authorization": "Bearer {token}" } }
);
const result = await res.json();

console.log(result.orderReady);      // true
console.log(result.availableDates);  // array of { date, type, available }
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/foc-windows");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$result = json_decode(curl_exec($ch), true);
curl_close($ch);

if ($result['orderReady'] && count($result['availableDates']) > 0) {
    $earliest = $result['availableDates'][0]['date'];
    // proceed with updatePortingOrder ...
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

result = requests.get(
    "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/foc-windows",
    headers={"Authorization": "Bearer {token}"},
).json()

if result["orderReady"] and result["availableDates"]:
    earliest = result["availableDates"][0]["date"]
    # proceed with update_porting_order(activation_date=earliest)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET \
  "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/foc-windows" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Porting order ID |

**Response**

```javascript
{
    id:                 "port_abc123",
    status:             "draft",
    orderReady:         true,           // all required fields complete; ready to submit
    phoneNumbersCount:  3,
    availableDates: [
        {
            date:       "2025-09-02T00:00:00.000Z",
            type:       "Standard",     // 'Standard' | 'Express'
            available:  true,
        },
        {
            date:       "2025-09-04T00:00:00.000Z",
            type:       "Express",
            available:  true,
        },
    ],
}
```

> **Note:** `orderReady: false` means the order is missing required fields (LOA, end-user details, etc.). Check for validation errors before presenting the date picker.

---

### Sync a Porting Order — `phoneNumbers.syncPortingOrder(id)`

Fetches the latest status, updates, and carrier comments for an order and writes them back to the local database. Use this to refresh an order's state after carrier activity — for example, after a FOC date change or a carrier note is added.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const syncResult = await api.phoneNumbers.syncPortingOrder('order-id');

console.log(syncResult.orderUpdated);   // true — carrier had new data
console.log(syncResult.commentsAdded);  // 2 — new carrier comments ingested
console.log(syncResult.errors);         // [] — no sync errors
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch(
    "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/sync",
    {
        method: "POST",
        headers: { "Authorization": "Bearer {token}" },
    }
);
const syncResult = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/sync");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$syncResult = json_decode(curl_exec($ch), true);
curl_close($ch);

echo $syncResult['orderUpdated'] ? "Order was updated" : "No changes";
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

sync_result = requests.post(
    "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/sync",
    headers={"Authorization": "Bearer {token}"},
).json()

print("Updated:", sync_result["orderUpdated"])
print("New comments:", sync_result["commentsAdded"])
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST \
  "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/sync" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Porting order ID |

**Response**

```javascript
{
    id:              "port_abc123",
    carrierOrderId:  "carrier_xyz789",
    orderUpdated:    true,   // true if carrier had changes to apply
    commentsAdded:   2,      // number of new carrier comments ingested
    errors:          [],     // array of sync error strings (empty = success)
}
```

> **Tip:** Call `syncPortingOrder` before displaying order status to customers to ensure you're showing the latest carrier data.

---

### Get Porting Events — `phoneNumbers.getPortingEvents(id, options?)`

Retrieve the event history for a porting order — status transitions, carrier updates, activations, exceptions, and document changes. Useful for audit trails and debugging porting issues.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Get all events for an order
const events = await api.phoneNumbers.getPortingEvents('order-id');
console.log(events.data.length);   // total event count
events.data.forEach(e => {
    console.log(`[${e.createdAt}] ${e.type} — ${e.description}`);
});

// Paginate through large event histories
const page1 = await api.phoneNumbers.getPortingEvents('order-id', {
    page: 1,
    limit: 25,
});
const page2 = await api.phoneNumbers.getPortingEvents('order-id', {
    page: 2,
    limit: 25,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get all events
const res = await fetch(
    "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/events",
    { headers: { "Authorization": "Bearer {token}" } }
);
const events = await res.json();

// Get page 2
const res = await fetch(
    "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/events?page=2&limit=25",
    { headers: { "Authorization": "Bearer {token}" } }
);
const page2 = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get all events
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/events");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$events = json_decode(curl_exec($ch), true);
curl_close($ch);

foreach ($events['data'] as $event) {
    echo "[{$event['createdAt']}] {$event['type']}: {$event['description']}\n";
}

// Get page 2 with limit
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/events?page=2&limit=25");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$page2 = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

headers = {"Authorization": "Bearer {token}"}
base = "https://{namespace}.api.unbound.cx/phone-number/porting/orders"

# Get all events
events = requests.get(
    f"{base}/order-id/events",
    headers=headers,
).json()

for event in events["data"]:
    print(f"[{event['createdAt']}] {event['type']}: {event['description']}")

# Paginate
page2 = requests.get(
    f"{base}/order-id/events",
    headers=headers,
    params={"page": 2, "limit": 25},
).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get all events
curl -X GET \
  "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/events" \
  -H "Authorization: Bearer {token}"

# Get page 2 with limit
curl -X GET \
  "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/events?page=2&limit=25" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Porting order ID |
| `page` | number | — | Page number for pagination (1-based) |
| `limit` | number | — | Results per page (default: all) |

**Response**

```javascript
{
    data: [
        {
            id:          "evt_001",
            type:        "status_change",       // event type (see table below)
            description: "Order submitted to carrier",
            previousStatus: "draft",
            newStatus:      "pending",
            createdAt:   "2025-08-28T12:30:00.000Z",
            metadata:    {},                    // additional event-specific data
        },
        {
            id:          "evt_002",
            type:        "foc_date_received",
            description: "Carrier confirmed FOC date: 2025-09-02",
            createdAt:   "2025-08-29T09:15:00.000Z",
            metadata:    { focDate: "2025-09-02T14:00:00.000Z" },
        },
    ],
    total:   12,     // total number of events for this order
    page:    1,
    limit:   100,
}
```

**Event type values**

| `type` | Description |
|---|---|
| `status_change` | Order status transitioned (e.g., `draft` → `pending`) |
| `foc_date_received` | Carrier confirmed an activation (FOC) date |
| `foc_date_changed` | Carrier modified the previously confirmed FOC date |
| `exception_raised` | Carrier flagged an issue requiring action |
| `exception_resolved` | A prior exception was cleared |
| `document_attached` | LOA or supporting document was attached |
| `comment_added` | Carrier or internal team added a comment |
| `number_added` | Phone number added to the order |
| `number_removed` | Phone number removed from the order |
| `activated` | Phone numbers went live on the new carrier |
| `cancelled` | Order was cancelled |

---

### Remove a Phone Number from an Order

Remove a single number from a porting order before it has been submitted. Useful for correcting mistakes or splitting orders.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.phoneNumbers.removePhoneNumberFromOrder(
    'order-id',
    '+15551234567',
);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const phoneEncoded = encodeURIComponent('+15551234567');
await fetch(
    `https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/numbers/${phoneEncoded}`,
    {
        method: "DELETE",
        headers: { "Authorization": "Bearer {token}" }
    }
);
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$phone = urlencode('+15551234567');
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/numbers/$phone");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from urllib.parse import quote

phone = quote('+15551234567')
requests.delete(
    f"https://{{namespace}}.api.unbound.cx/phone-number/porting/orders/order-id/numbers/{phone}",
    headers={"Authorization": "Bearer {token}"},
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/phone-number/porting/orders/order-id/numbers/%2B15551234567" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `portingOrderId` | string | ✅ | ID of the porting order |
| `phoneNumber` | string | ✅ | Phone number to remove (E.164 format, e.g., `+15551234567`) |

> **Note:** Numbers can only be removed from orders in `draft` or `pending` status. Submitted orders cannot be modified — contact support if changes are needed.

---

### Attach a Porting Document

Attach a document (LOA, phone bill, CSR, etc.) to a porting order. Use `generateLoa` for auto-generated LOAs, or this method to attach a manually uploaded document via a `storageId` from the Storage API.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Attach an uploaded LOA document
const result = await api.phoneNumbers.attachPortingDocument({
    portingOrderId: 'order-id',
    storageId: 'storage-id-from-upload',
    documentType: 'loa',
    isRequired: true,
});
// result.action → 'created' | 'updated'

// Attach a phone bill as supporting document
await api.phoneNumbers.attachPortingDocument({
    portingOrderId: 'order-id',
    storageId: 'storage-id-of-bill',
    documentType: 'bill',
    isRequired: false,
});

// Update an existing attached document
await api.phoneNumbers.attachPortingDocument({
    portingOrderId: 'order-id',
    storageId: 'new-storage-id',
    documentType: 'loa',
    documentId: 'existing-doc-id',   // update in-place
});

// Clear a document (set storageId to null)
await api.phoneNumbers.attachPortingDocument({
    portingOrderId: 'order-id',
    storageId: null,
    documentType: 'loa',
    documentId: 'doc-id-to-clear',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Attach an uploaded LOA document
const res = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/documents", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    portingOrderId: "order-id",
    storageId: "storage-id-from-upload",
    documentType: "loa",
    isRequired: true
  })
});
const result = await res.json();
// result.action → "created" | "updated"

// Update an existing document
const res2 = await fetch("https://{namespace}.api.unbound.cx/phone-number/porting/documents", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    portingOrderId: "order-id",
    storageId: "new-storage-id",
    documentType: "loa",
    documentId: "existing-doc-id"
  })
});
const result2 = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Attach an uploaded LOA document
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/porting/documents");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "portingOrderId" => "order-id",
    "storageId"      => "storage-id-from-upload",
    "documentType"   => "loa",
    "isRequired"     => true
]));
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
// $result['action'] → 'created' | 'updated'
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Attach an uploaded LOA document
response = requests.post(
    "https://{namespace}.api.unbound.cx/phone-number/porting/documents",
    headers={"Authorization": "Bearer {token}"},
    json={
        "portingOrderId": "order-id",
        "storageId": "storage-id-from-upload",
        "documentType": "loa",
        "isRequired": True
    }
)
result = response.json()
# result['action'] → 'created' | 'updated'
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Attach an uploaded LOA document
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/documents" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "portingOrderId": "order-id",
    "storageId": "storage-id-from-upload",
    "documentType": "loa",
    "isRequired": true
  }'

# Update an existing attached document
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/documents" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "portingOrderId": "order-id",
    "storageId": "new-storage-id",
    "documentType": "loa",
    "documentId": "existing-doc-id"
  }'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `portingOrderId` | string | ✅ | ID of the porting order to attach the document to |
| `storageId` | string \| null | — | Storage ID from the Storage API upload. Set to `null` to clear the document |
| `documentType` | string | — | Type of document: `'loa'` (default), `'bill'`, `'csr'`, or carrier-specific types |
| `isRequired` | boolean | — | Whether this document is required before the order can be submitted. Default: `false` |
| `documentId` | string | — | Existing document ID to update in-place. If omitted, a new document record is created |

**Response**

```javascript
{
    action: "created",      // "created" | "updated"
    documentId: "doc-id",
    portingOrderId: "order-id",
    documentType: "loa",
    storageId: "storage-id-from-upload",
    isRequired: true
}
```

**Document Types Reference**

| Type | Description |
|---|---|
| `loa` | Letter of Authorization — authorizes the number transfer |
| `bill` | Recent phone bill showing the number and account details |
| `csr` | Customer Service Record — carrier-issued number ownership proof |

> **Tip:** Use `generateLoa()` to auto-generate and attach a LOA from a template. Use `attachPortingDocument()` when you need to attach a manually signed LOA, a phone bill, or other supporting evidence.

---

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
DATA=$(cat <<'EOF'
{
  "portingOrderId": "order-id",
  "signerName": "Jane Smith",
  "signerTitle": "Director of IT"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/loa" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
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
DATA=$(cat <<'EOF'
{
  "phoneNumbers": ["+15551234567", "+15551234568", "+15551234569"],
  "name": "Q1 2024 Port",
  "dryRun": true
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/auto-create" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Create orders
DATA=$(cat <<'EOF'
{
  "phoneNumbers": ["+15551234567", "+15551234568", "+15551234569"],
  "name": "Q1 2024 Port",
  "dryRun": false
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/auto-create" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
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
DATA=$(cat <<'EOF'
{
  "comment": "Please expedite — customer is switching providers.",
  "isInternal": false
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Post an internal note
DATA=$(cat <<'EOF'
{
  "comment": "Called customer — confirmed details.",
  "isInternal": true
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/phone-number/porting/order/order-id/comment" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

## Supported Countries

### `phoneNumbers.getSupportedCountries()`

Returns a list of all countries where Unbound supports phone number ordering.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const countries = await api.phoneNumbers.getSupportedCountries();
// [
//   { code: 'US', name: 'United States', supports: { local: true, tollFree: true } },
//   { code: 'CA', name: 'Canada',        supports: { local: true, tollFree: true } },
//   { code: 'GB', name: 'United Kingdom', supports: { local: true, tollFree: false } },
//   ...
// ]
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch(
    'https://{namespace}.api.unbound.cx/phone-number/supported-countries',
    { headers: { 'Authorization': 'Bearer {token}' } },
);
const countries = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init('https://{namespace}.api.unbound.cx/phone-number/supported-countries');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
$countries = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

countries = requests.get(
    'https://{namespace}.api.unbound.cx/phone-number/supported-countries',
    headers={'Authorization': 'Bearer {token}'},
).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/supported-countries" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Carrier Sync

`api.phoneNumbers.carrier` — Advanced carrier-level operations. Use these when you need to reconcile your Unbound account with carrier records (e.g. after a port-in completes externally) or retrieve deep carrier metadata for a specific DID.

### `phoneNumbers.carrier.sync(carrier, options)`

Pulls all phone numbers from a carrier's account and syncs them into Unbound. Optionally reconnects voice and/or messaging configurations during the sync.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `carrier` | string | ✅ | Carrier identifier (e.g. `'telnyx'`) |
| `updateVoiceConnection` | boolean | — | Re-apply voice connection settings after sync |
| `updateMessagingConnection` | boolean | — | Re-apply messaging connection settings after sync |

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Sync all numbers from Telnyx, reconnecting voice only
const result = await api.phoneNumbers.carrier.sync('telnyx', {
    updateVoiceConnection: true,
    updateMessagingConnection: false,
});
console.log(result);
// { synced: 42, created: 3, updated: 39, errors: [] }

// Full sync — reconnect both voice and messaging
const full = await api.phoneNumbers.carrier.sync('telnyx', {
    updateVoiceConnection: true,
    updateMessagingConnection: true,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch(
    'https://{namespace}.api.unbound.cx/phone-number/carrier/syncPhoneNumbers/telnyx?updateVoiceConnection=true&updateMessagingConnection=false',
    {
        method: 'POST',
        headers: { 'Authorization': 'Bearer {token}' },
    },
);
const result = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init('https://{namespace}.api.unbound.cx/phone-number/carrier/syncPhoneNumbers/telnyx?updateVoiceConnection=true&updateMessagingConnection=false');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

result = requests.post(
    'https://{namespace}.api.unbound.cx/phone-number/carrier/syncPhoneNumbers/telnyx',
    headers={'Authorization': 'Bearer {token}'},
    params={'updateVoiceConnection': 'true', 'updateMessagingConnection': 'false'},
).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/phone-number/carrier/syncPhoneNumbers/telnyx?updateVoiceConnection=true&updateMessagingConnection=false" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### `phoneNumbers.carrier.getDetails(phoneNumber)`

Fetches carrier-level metadata for a phone number. Returns the raw carrier record including current routing, messaging profile, and connection assignments.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `phoneNumber` | string | ✅ | Phone number in E.164 format (e.g. `'+12135550100'`) |

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const details = await api.phoneNumbers.carrier.getDetails('+12135550100');
// {
//   phoneNumber: '+12135550100',
//   carrier: 'telnyx',
//   carrierNumberId: 'telnyx-id-abc123',
//   voiceConnectionId: 'vc-456',
//   messagingProfileId: 'mp-789',
//   status: 'active',
//   purchasedAt: '2024-01-15T10:30:00.000Z'
// }
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch(
    'https://{namespace}.api.unbound.cx/phone-number/carrier/%2B12135550100',
    { headers: { 'Authorization': 'Bearer {token}' } },
);
const details = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$number = urlencode('+12135550100');
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/carrier/{$number}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
$details = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from urllib.parse import quote

number = quote('+12135550100', safe='')
details = requests.get(
    f'https://{{namespace}}.api.unbound.cx/phone-number/carrier/{number}',
    headers={'Authorization': 'Bearer {token}'},
).json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/phone-number/carrier/%2B12135550100" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

### `phoneNumbers.carrier.delete(phoneNumber)`

Removes a phone number from the carrier account (hard delete at the carrier level). Use with caution — this permanently releases the DID from the carrier, not just from Unbound's database.

:::warning
This permanently releases the number at the carrier level. The number may be reassigned to another customer immediately. Use `phoneNumbers.remove()` to release from Unbound's routing only.
:::

| Parameter | Type | Required | Description |
|---|---|---|---|
| `phoneNumber` | string | ✅ | Phone number in E.164 format |

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.phoneNumbers.carrier.delete('+12135550100');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch(
    'https://{namespace}.api.unbound.cx/phone-number/carrier/%2B12135550100',
    {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer {token}' },
    },
);
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$number = urlencode('+12135550100');
$ch = curl_init("https://{namespace}.api.unbound.cx/phone-number/carrier/{$number}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from urllib.parse import quote

number = quote('+12135550100', safe='')
requests.delete(
    f'https://{{namespace}}.api.unbound.cx/phone-number/carrier/{number}',
    headers={'Authorization': 'Bearer {token}'},
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/phone-number/carrier/%2B12135550100" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Common Patterns

### Pattern 1 — Search, order, and configure in one flow

The typical number provisioning flow: find an available number, order it, then attach it to a voice app.

```javascript
// 1. Search for a local number in area code 213 with SMS+MMS enabled
const available = await api.phoneNumbers.search({
    type: 'local',
    country: 'US',
    state: 'CA',
    contains: '213',
    sms: true,
    mms: true,
    voice: true,
    limit: 5,
});

const picked = available.phoneNumbers[0].phoneNumber;
console.log('Ordering:', picked);

// 2. Order the number
await api.phoneNumbers.order({ phoneNumbers: [picked] });

// 3. Configure it with a voice app
await api.phoneNumbers.update({
    phoneNumber: picked,
    voiceApp: {
        appType: 'workflow',
        workflowId: 'wf-inbound-ivr-001',
    },
});

console.log(`${picked} is live and routing to IVR.`);
```

---

### Pattern 2 — Full porting workflow (draft → validate → submit → activate)

Port a block of numbers from an existing carrier into Unbound.

```javascript
// Step 1: Create a draft porting order
const order = await api.phoneNumbers.createPortingOrder({
    customerReference: 'CUST-2024-001',
    portOrderType: 'full',
    endUser: {
        admin: {
            entityName: 'Acme Corp',
            authPersonName: 'Jane Smith',
            billingPhoneNumber: '+12135550100',
            accountNumber: 'ACME-12345',
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
        focDatetimeRequested: '2025-09-01T14:00:00Z',
        fastPortEligible: false,
    },
    tags: ['q3-migration', 'acme'],
});
console.log('Draft order:', order.id);

// Step 2: Phase 1 — add numbers with internal validation
await api.phoneNumbers.checkPortability({
    phoneNumbers: ['+12135550101', '+12135550102', '+12135550103'],
    portingOrderId: order.id,
    runPortabilityCheck: false,  // internal LRN validation only
});

// Step 3: Phase 2 — run external carrier portability check
const portCheck = await api.phoneNumbers.checkPortability({
    phoneNumbers: ['+12135550101', '+12135550102', '+12135550103'],
    portingOrderId: order.id,
    runPortabilityCheck: true,   // full carrier validation
});

// Check results
const notPortable = portCheck.results?.filter(r => r.status !== 'portable');
if (notPortable?.length) {
    console.warn('Some numbers not portable:', notPortable);
}

// Step 4: Generate LOA document
const loa = await api.phoneNumbers.generateLoa({
    portingOrderId: order.id,
    signerName: 'Jane Smith',
    signerTitle: 'IT Director',
});
console.log('LOA attached, document ID:', loa.loaDocumentId);

// Step 5: Get available FOC windows and pick one
const windows = await api.phoneNumbers.getFocWindows(order.id);
const preferred = windows.availableDates?.find(d => d.type === 'Standard' && d.available);
console.log('Requested FOC date:', preferred?.date);

// Step 6: Submit the order
const submitted = await api.phoneNumbers.submitPortingOrder(order.id);
console.log('Order submitted, status:', submitted.status);

// Step 7: Monitor progress
const events = await api.phoneNumbers.getPortingEvents(order.id);
console.log('Events so far:', events.length);
```

---

### Pattern 3 — Auto-create orders by carrier (bulk port)

When porting a large number block that may span multiple carriers, let Unbound group them automatically.

```javascript
const numbersToPort = [
    '+12135550101', '+12135550102',  // AT&T
    '+13105550201', '+13105550202',  // Verizon
    '+14155550301',                  // T-Mobile
];

// Preview groupings first
const preview = await api.phoneNumbers.autoCreateOrders({
    phoneNumbers: numbersToPort,
    name: 'Q3 Migration',
    dryRun: true,
});

console.log('Carrier groups:');
preview.groups?.forEach(g => {
    console.log(`  ${g.carrier}: ${g.phoneNumbers.length} numbers`);
});
// Carrier groups:
//   att: 2 numbers
//   verizon: 2 numbers
//   tmobile: 1 numbers

// If groupings look right, create the actual orders
const result = await api.phoneNumbers.autoCreateOrders({
    phoneNumbers: numbersToPort,
    name: 'Q3 Migration',
    dryRun: false,
});

result.orders?.forEach(o => {
    console.log(`Created order ${o.id} for ${o.carrier} (${o.phoneNumbers.length} numbers)`);
});
```

---

### Pattern 4 — Post-port carrier sync

After a port-in completes at the carrier level, sync the numbers into Unbound and restore their voice/messaging connections.

```javascript
// Sync all Telnyx numbers into Unbound, restoring voice + messaging connections
const syncResult = await api.phoneNumbers.carrier.sync('telnyx', {
    updateVoiceConnection: true,
    updateMessagingConnection: true,
});

console.log(`Sync complete: ${syncResult.synced} numbers`);
console.log(`  Created: ${syncResult.created}`);
console.log(`  Updated: ${syncResult.updated}`);
if (syncResult.errors?.length) {
    console.warn('Errors:', syncResult.errors);
}

// Verify a specific number's carrier details
const details = await api.phoneNumbers.carrier.getDetails('+12135550101');
console.log('Voice connection:', details.voiceConnectionId);
console.log('Messaging profile:', details.messagingProfileId);
```

---

### Pattern 5 — Supported countries check before ordering

Validate country support before presenting options in a provisioning UI.

```javascript
const countries = await api.phoneNumbers.getSupportedCountries();

// Build a map for quick lookup
const supported = new Map(
    countries.map(c => [c.code, c])
);

function canOrderLocal(countryCode) {
    return supported.get(countryCode)?.supports?.local ?? false;
}

function canOrderTollFree(countryCode) {
    return supported.get(countryCode)?.supports?.tollFree ?? false;
}

// Example: check before ordering
const country = 'DE';
if (!canOrderLocal(country)) {
    console.warn(`Local numbers not available in ${country}`);
} else {
    const numbers = await api.phoneNumbers.search({ type: 'local', country });
    console.log(`Found ${numbers.phoneNumbers.length} numbers in ${country}`);
}
```
