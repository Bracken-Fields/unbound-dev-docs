---
id: workflows
title: Workflows
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Workflows

`api.workflows` — Build, modify, and execute automation workflows programmatically. Workflows are directed graphs of items connected by ports.

---

## Overview

A workflow is composed of:
- **Items** — individual steps (actions, conditions, integrations)
- **Connections** — wires between item output ports and input ports
- **Sessions** — runtime executions of a workflow version

---

## Workflow Items

### `workflows.items.create(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const item = await api.workflows.items.create({
    workflowVersionId: 'wf-version-id',
    category: 'communication',
    type: 'sendSms',
    settings: {
        from: '+18005551234',
        messageTemplate: 'appointment-reminder',
    },
    description: 'Send appointment reminder SMS',
    position: { x: 200, y: 150 },
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/workflow/item", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    workflowVersionId: "wf-version-id",
    category: "communication",
    type: "sendSms",
    settings: {
      from: "+18005551234",
      messageTemplate: "appointment-reminder"
    },
    description: "Send appointment reminder SMS",
    position: { x: 200, y: 150 }
  })
});
const item = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/item");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "workflowVersionId" => "wf-version-id",
    "category" => "communication",
    "type" => "sendSms",
    "settings" => [
        "from" => "+18005551234",
        "messageTemplate" => "appointment-reminder"
    ],
    "description" => "Send appointment reminder SMS",
    "position" => ["x" => 200, "y" => 150]
]));
$item = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/workflow/item",
    headers={"Authorization": "Bearer {token}"},
    json={
        "workflowVersionId": "wf-version-id",
        "category": "communication",
        "type": "sendSms",
        "settings": {
            "from": "+18005551234",
            "messageTemplate": "appointment-reminder"
        },
        "description": "Send appointment reminder SMS",
        "position": {"x": 200, "y": 150}
    }
)
item = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "workflowVersionId": "wf-version-id",
  "category": "communication",
  "type": "sendSms",
  "settings": {
    "from": "+18005551234",
    "messageTemplate": "appointment-reminder"
  },
  "description": "Send appointment reminder SMS",
  "position": { "x": 200, "y": 150 }
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/workflow/item" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `workflowVersionId` | string | ✅ | Workflow version this item belongs to |
| `category` | string | ✅ | Item category (see table below) |
| `type` | string | ✅ | Item type within the category |
| `settings` | object | — | Item-specific configuration |
| `description` | string | — | Human-readable step description |
| `position` | object | — | `{ x, y }` canvas position |

### Item Categories & Types

| Category | Example Types |
|---|---|
| `flow` | `trigger`, `branch`, `loop`, `wait`, `end` |
| `communication` | `sendSms`, `sendEmail`, `makeCall`, `sendVoicemail` |
| `routing` | `routeToAgent`, `routeToQueue`, `routeByCondition` |
| `ai` | `aiChat`, `aiTts`, `aiStt`, `aiPlaybook`, `aiExtract` |
| `data` | `createObject`, `updateObject`, `queryObjects`, `deleteObject` |
| `integration` | `webhook`, `httpRequest`, `customCode` |
| `taskRouter` | `createTask`, `completeTask` |

### `workflows.items.update(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.workflows.items.update({
    id: 'item-id',
    settings: { messageTemplate: 'new-template' },
    position: { x: 300, y: 200 },
    label: 'Send Reminder',
    labelBgColor: '#1D949A',
    labelTextColor: '#ffffff',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/workflow/item/item-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    settings: { messageTemplate: "new-template" },
    position: { x: 300, y: 200 },
    label: "Send Reminder",
    labelBgColor: "#1D949A",
    labelTextColor: "#ffffff"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/item/item-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "settings" => ["messageTemplate" => "new-template"],
    "position" => ["x" => 300, "y" => 200],
    "label" => "Send Reminder",
    "labelBgColor" => "#1D949A",
    "labelTextColor" => "#ffffff"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.put(
    "https://{namespace}.api.unbound.cx/workflow/item/item-id",
    headers={"Authorization": "Bearer {token}"},
    json={
        "settings": {"messageTemplate": "new-template"},
        "position": {"x": 300, "y": 200},
        "label": "Send Reminder",
        "labelBgColor": "#1D949A",
        "labelTextColor": "#ffffff"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "settings": { "messageTemplate": "new-template" },
  "position": { "x": 300, "y": 200 },
  "label": "Send Reminder",
  "labelBgColor": "#1D949A",
  "labelTextColor": "#ffffff"
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/workflow/item/item-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### `workflows.items.get(id)` / `workflows.items.list(workflowVersionId)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const item = await api.workflows.items.get('item-id');
const items = await api.workflows.items.list('wf-version-id');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get a single item
const res = await fetch("https://{namespace}.api.unbound.cx/workflow/item/item-id", {
  headers: { "Authorization": "Bearer {token}" }
});
const item = await res.json();

// List all items for a workflow version
const listRes = await fetch("https://{namespace}.api.unbound.cx/workflow/item?workflowVersionId=wf-version-id", {
  headers: { "Authorization": "Bearer {token}" }
});
const items = await listRes.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get a single item
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/item/item-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$item = json_decode(curl_exec($ch), true);
curl_close($ch);

// List all items for a workflow version
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/item?workflowVersionId=wf-version-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$items = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Get a single item
response = requests.get(
    "https://{namespace}.api.unbound.cx/workflow/item/item-id",
    headers={"Authorization": "Bearer {token}"}
)
item = response.json()

# List all items for a workflow version
response = requests.get(
    "https://{namespace}.api.unbound.cx/workflow/item",
    headers={"Authorization": "Bearer {token}"},
    params={"workflowVersionId": "wf-version-id"}
)
items = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get a single item
curl "https://{namespace}.api.unbound.cx/workflow/item/item-id" \
  -H "Authorization: Bearer {token}"

# List all items for a workflow version
curl "https://{namespace}.api.unbound.cx/workflow/item?workflowVersionId=wf-version-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### `workflows.items.delete(id)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.workflows.items.delete('item-id');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/workflow/item/item-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/item/item-id");
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
    "https://{namespace}.api.unbound.cx/workflow/item/item-id",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/workflow/item/item-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Connections

Connections wire item output ports to other items' input ports.

### `workflows.connections.create(options)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.workflows.connections.create({
    workflowItemId: 'item-1-id',
    workflowItemPortId: 'output',          // source port name
    inWorkflowItemId: 'item-2-id',
    inWorkflowItemPortId: 'input',         // destination port name
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/workflow/connection", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    workflowItemId: "item-1-id",
    workflowItemPortId: "output",
    inWorkflowItemId: "item-2-id",
    inWorkflowItemPortId: "input"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/connection");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "workflowItemId" => "item-1-id",
    "workflowItemPortId" => "output",
    "inWorkflowItemId" => "item-2-id",
    "inWorkflowItemPortId" => "input"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/workflow/connection",
    headers={"Authorization": "Bearer {token}"},
    json={
        "workflowItemId": "item-1-id",
        "workflowItemPortId": "output",
        "inWorkflowItemId": "item-2-id",
        "inWorkflowItemPortId": "input"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "workflowItemId": "item-1-id",
  "workflowItemPortId": "output",
  "inWorkflowItemId": "item-2-id",
  "inWorkflowItemPortId": "input"
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/workflow/connection" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

For conditional branches, port names vary by item type (e.g., `output-yes`, `output-no`, `output-default`).

### `workflows.connections.delete(...)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.workflows.connections.delete(
    workflowItemId,
    workflowItemPortId,
    inWorkflowItemId,
    inWorkflowItemPortId,
);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
  workflowItemId: "item-1-id",
  workflowItemPortId: "output",
  inWorkflowItemId: "item-2-id",
  inWorkflowItemPortId: "input"
});
const res = await fetch(`https://{namespace}.api.unbound.cx/workflow/connection?${params}`, {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$query = http_build_query([
    "workflowItemId" => "item-1-id",
    "workflowItemPortId" => "output",
    "inWorkflowItemId" => "item-2-id",
    "inWorkflowItemPortId" => "input"
]);
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/connection?$query");
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
    "https://{namespace}.api.unbound.cx/workflow/connection",
    headers={"Authorization": "Bearer {token}"},
    params={
        "workflowItemId": "item-1-id",
        "workflowItemPortId": "output",
        "inWorkflowItemId": "item-2-id",
        "inWorkflowItemPortId": "input"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/workflow/connection?workflowItemId=item-1-id&workflowItemPortId=output&inWorkflowItemId=item-2-id&inWorkflowItemPortId=input" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Workflow Settings & Modules

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Get workflow-level settings
const settings = await api.workflows.getSettings('voice');  // or 'sms', 'email', etc.

// List all available workflow modules
const modules = await api.workflows.listModules();
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Get workflow-level settings
const settingsRes = await fetch("https://{namespace}.api.unbound.cx/workflow/settings/voice", {
  headers: { "Authorization": "Bearer {token}" }
});
const settings = await settingsRes.json();

// List all available workflow modules
const modulesRes = await fetch("https://{namespace}.api.unbound.cx/workflow/module", {
  headers: { "Authorization": "Bearer {token}" }
});
const modules = await modulesRes.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Get workflow-level settings
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/settings/voice");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$settings = json_decode(curl_exec($ch), true);
curl_close($ch);

// List all available workflow modules
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/module");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$modules = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Get workflow-level settings
response = requests.get(
    "https://{namespace}.api.unbound.cx/workflow/settings/voice",
    headers={"Authorization": "Bearer {token}"}
)
settings = response.json()

# List all available workflow modules
response = requests.get(
    "https://{namespace}.api.unbound.cx/workflow/module",
    headers={"Authorization": "Bearer {token}"}
)
modules = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Get workflow-level settings
curl "https://{namespace}.api.unbound.cx/workflow/settings/voice" \
  -H "Authorization: Bearer {token}"

# List all available workflow modules
curl "https://{namespace}.api.unbound.cx/workflow/module" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Workflow Sessions

Sessions are runtime executions of a workflow. Use them to run a workflow on demand, track its progress, and update execution state.

### `workflows.sessions.create(workflowVersionId, sessionData?)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const session = await api.workflows.sessions.create('wf-version-id', {
    contactId: 'contact-id',
    channel: 'sms',
    input: { phoneNumber: '+12135550100' },
});
console.log(session.id);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/workflow/session", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    workflowVersionId: "wf-version-id",
    contactId: "contact-id",
    channel: "sms",
    input: { phoneNumber: "+12135550100" }
  })
});
const session = await res.json();
console.log(session.id);
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/session");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "workflowVersionId" => "wf-version-id",
    "contactId" => "contact-id",
    "channel" => "sms",
    "input" => ["phoneNumber" => "+12135550100"]
]));
$session = json_decode(curl_exec($ch), true);
curl_close($ch);
echo $session["id"];
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/workflow/session",
    headers={"Authorization": "Bearer {token}"},
    json={
        "workflowVersionId": "wf-version-id",
        "contactId": "contact-id",
        "channel": "sms",
        "input": {"phoneNumber": "+12135550100"}
    }
)
session = response.json()
print(session["id"])
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "workflowVersionId": "wf-version-id",
  "contactId": "contact-id",
  "channel": "sms",
  "input": { "phoneNumber": "+12135550100" }
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/workflow/session" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### `workflows.sessions.get(sessionId)`

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const session = await api.workflows.sessions.get('session-id');
// session.status → 'running' | 'paused' | 'completed' | 'failed'
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/workflow/session/session-id", {
  headers: { "Authorization": "Bearer {token}" }
});
const session = await res.json();
// session.status → 'running' | 'paused' | 'completed' | 'failed'
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/session/session-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$session = json_decode(curl_exec($ch), true);
curl_close($ch);
// $session["status"] → 'running' | 'paused' | 'completed' | 'failed'
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.get(
    "https://{namespace}.api.unbound.cx/workflow/session/session-id",
    headers={"Authorization": "Bearer {token}"}
)
session = response.json()
# session["status"] → 'running' | 'paused' | 'completed' | 'failed'
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/workflow/session/session-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### `workflows.sessions.update(sessionId, updateData)`

Update session state mid-execution (e.g., pass input collected from a caller):

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.workflows.sessions.update('session-id', {
    variables: {
        accountNumber: '123456',
        verifiedIdentity: true,
    },
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/workflow/session/session-id", {
  method: "PUT",
  headers: { "Authorization": "Bearer {token}", "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {
      accountNumber: "123456",
      verifiedIdentity: true
    }
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/session/session-id");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "variables" => [
        "accountNumber" => "123456",
        "verifiedIdentity" => true
    ]
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.put(
    "https://{namespace}.api.unbound.cx/workflow/session/session-id",
    headers={"Authorization": "Bearer {token}"},
    json={
        "variables": {
            "accountNumber": "123456",
            "verifiedIdentity": True
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
  "variables": {
    "accountNumber": "123456",
    "verifiedIdentity": true
  }
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/workflow/session/session-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

### `workflows.sessions.complete(sessionId)`

Force-complete a running session.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.workflows.sessions.complete('session-id');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/workflow/session/session-id/complete", {
  method: "POST",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/session/session-id/complete");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, "");
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
response = requests.post(
    "https://{namespace}.api.unbound.cx/workflow/session/session-id/complete",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/workflow/session/session-id/complete" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

### `workflows.sessions.delete(sessionId)`

Delete a session record.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.workflows.sessions.delete('session-id');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/workflow/session/session-id", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/workflow/session/session-id");
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
    "https://{namespace}.api.unbound.cx/workflow/session/session-id",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/workflow/session/session-id" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Complete Example

Build an SMS triage workflow: receive → AI classify → route or auto-reply.

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: 'your-jwt' });

const versionId = 'your-workflow-version-id';

// 1. Trigger: SMS received
const trigger = await api.workflows.items.create({
    workflowVersionId: versionId,
    category: 'flow',
    type: 'trigger',
    settings: { event: 'message.received', channel: 'sms' },
    position: { x: 100, y: 50 },
});

// 2. AI classification
const classify = await api.workflows.items.create({
    workflowVersionId: versionId,
    category: 'ai',
    type: 'aiChat',
    settings: {
        instructions: 'Reply with exactly one word: support, sales, or spam',
        model: 'gpt-4',
    },
    position: { x: 100, y: 200 },
});

// 3a. Route to queue (support/sales)
const route = await api.workflows.items.create({
    workflowVersionId: versionId,
    category: 'routing',
    type: 'routeToQueue',
    settings: { queueId: 'support-queue-id' },
    position: { x: 0, y: 350 },
});

// 3b. Auto-reply (spam)
const reject = await api.workflows.items.create({
    workflowVersionId: versionId,
    category: 'communication',
    type: 'sendSms',
    settings: { message: 'Thanks for reaching out!' },
    position: { x: 250, y: 350 },
});

// Wire it together
await api.workflows.connections.create({
    workflowItemId: trigger.id,
    workflowItemPortId: 'output',
    inWorkflowItemId: classify.id,
    inWorkflowItemPortId: 'input',
});

await api.workflows.connections.create({
    workflowItemId: classify.id,
    workflowItemPortId: 'output-support',
    inWorkflowItemId: route.id,
    inWorkflowItemPortId: 'input',
});

await api.workflows.connections.create({
    workflowItemId: classify.id,
    workflowItemPortId: 'output-spam',
    inWorkflowItemId: reject.id,
    inWorkflowItemPortId: 'input',
});

console.log('Workflow wired ✓');
```
