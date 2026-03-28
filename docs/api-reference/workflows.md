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

---

## Workflow Versions

Workflows use an immutable versioning model. Each published version is a permanent snapshot — you never edit a published version, you create a new one (optionally copying from an existing version). This preserves reporting data and audit history.

### Version Lifecycle

```
Create Workflow
     │
     ▼
Create Version (blank or copyFrom existing)
     │  Auto-creates a start node
     ▼
Add Nodes + Connections
     │  (versions are mutable until published)
     ▼
Publish Version  →  version is now immutable (isPublished: true)
     │
     ▼
Set as Current   →  live traffic routes to this version (isCurrent: true)
     │
     ▼
(need changes?)  →  Create new version with copyFrom, edit, publish, activate
```

:::important
Every workflow version automatically receives a **start node** on creation. Do **not** create a start node manually — you will end up with two start nodes and the workflow will fail to open.
:::

:::warning
Published versions **cannot be unpublished**. Once `isPublished: true`, the version is permanently locked. To make changes, create a new version with `copyFrom`.
:::

---

### `POST /object/workflowVersions` — Create a new version

**Blank version:**

```json
{
  "workflowId": "074d...",
  "name": "v1.0"
}
```

**Fork from an existing version (recommended for edits):**

```json
{
  "workflowId": "074d...",
  "name": "v1.1",
  "copyFrom": "075d..."
}
```

When `copyFrom` is provided, all nodes, ports, connections, and settings are deep-copied into the new version with new IDs. Connections are automatically remapped.

**Required fields:** `workflowId`, `name`

**Optional fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Version label (e.g. `"v1.0"`, `"hotfix-jan"`) |
| `description` | string | Human-readable description |
| `copyFrom` | string | Version ID to fork from |
| `variables` | array | Custom session variables |
| `maxIdleTime` | number | Max session idle time in seconds (default: 7200) |
| `maxSessionLength` | number | Max session length in seconds (default: 86400) |

**Response:**

```json
{ "id": "075d0120260327..." }
```

---

### `PUT /object/workflowVersions` — Publish a version

Marks the version as immutable. Do this only when all nodes and connections are finalized.

```json
{
  "where": { "id": "075d..." },
  "update": { "isPublished": true }
}
```

**Response:**

```json
{ "updated": ["075d..."] }
```

---

### `PUT /object/workflowVersions` — Activate a version (set as current)

Routes live traffic to this version. Automatically clears `isCurrent` from all other versions and updates `currentWorkflowVersionId` on the parent workflow.

```json
{
  "where": { "id": "075d..." },
  "update": { "isCurrent": true }
}
```

:::info
Publish before activating. The typical sequence is: publish → then set as current.
:::

---

### Full version promotion example

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// 1. Create a new workflow
const workflow = await api.workflows.create({ name: 'Hello World', type: 'engagement' });

// 2. Create a version (auto-creates start node)
const version = await api.workflows.versions.create({
  workflowId: workflow.id,
  name: 'v1.0',
});

// 3. Add nodes (do NOT add a start node — it already exists)
const sayNode = await api.workflows.items.create({
  workflowVersionId: version.id,
  category: 'engagement',
  type: 'say',
  label: 'Say Hello',
  settings: { 'phone.playback.type': 'tts', 'phone.playback.message': 'Hello world' },
});

const hangupNode = await api.workflows.items.create({
  workflowVersionId: version.id,
  category: 'actions',
  type: 'hangUp',
  label: 'Hang Up',
});

// 4. Wire connections (start → say → hangup)
// Fetch ports first to get port IDs
const ports = await api.workflows.ports.list(version.id);
// ... connect start.Continue → say, say.Continue → hangup

// 5. Publish (locks the version)
await api.workflows.versions.publish(version.id);

// 6. Activate (routes live traffic here)
await api.workflows.versions.activate(version.id);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const BASE = 'https://{namespace}.api.unbound.cx';
const headers = { 'Authorization': 'Bearer {token}', 'Content-Type': 'application/json' };

// 1. Create a new workflow
const wf = await fetch(`${BASE}/object/workflows`, {
  method: 'POST', headers,
  body: JSON.stringify({ name: 'Hello World', type: 'engagement' })
}).then(r => r.json());

// 2. Create a version (blank — auto-creates start node)
const ver = await fetch(`${BASE}/object/workflowVersions`, {
  method: 'POST', headers,
  body: JSON.stringify({ workflowId: wf.id, name: 'v1.0' })
}).then(r => r.json());

// 3. Get the auto-created start node ID
const verData = await fetch(`${BASE}/object/query/workflowVersions?id=${ver.id}`, { headers })
  .then(r => r.json());
const startNodeId = verData.results[0].startWorkflowItemId;

// 4. Add nodes (NOT a start node)
const sayNode = await fetch(`${BASE}/object/workflowItems`, {
  method: 'POST', headers,
  body: JSON.stringify({
    workflowVersionId: ver.id,
    category: 'engagement',
    type: 'say',
    label: 'Say Hello',
    settings: { 'phone.playback.type': 'tts', 'phone.playback.message': 'Hello world' },
    position: { x: 200, y: 260 }
  })
}).then(r => r.json());

const hangupNode = await fetch(`${BASE}/object/workflowItems`, {
  method: 'POST', headers,
  body: JSON.stringify({
    workflowVersionId: ver.id,
    category: 'actions',
    type: 'hangUp',
    label: 'Hang Up',
    position: { x: 200, y: 420 }
  })
}).then(r => r.json());

// 5. Fetch ports and wire connections
const portsData = await fetch(`${BASE}/object/query/workflowItemPorts?workflowVersionId=${ver.id}`, { headers })
  .then(r => r.json());
// Find ports by item ID and direction, then create workflowItemConnections...

// 6. Publish
await fetch(`${BASE}/object/workflowVersions`, {
  method: 'PUT', headers,
  body: JSON.stringify({ where: { id: ver.id }, update: { isPublished: true } })
});

// 7. Activate
await fetch(`${BASE}/object/workflowVersions`, {
  method: 'PUT', headers,
  body: JSON.stringify({ where: { id: ver.id }, update: { isCurrent: true } })
});
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
BASE="https://{namespace}.api.unbound.cx"
TOKEN="{token}"

# 1. Create workflow
WF_ID=$(curl -s -X POST "$BASE/object/workflows" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Hello World","type":"engagement"}' | jq -r '.id')

# 2. Create version (auto-creates start node)
VER_ID=$(curl -s -X POST "$BASE/object/workflowVersions" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"workflowId\":\"$WF_ID\",\"name\":\"v1.0\"}" | jq -r '.id')

# 3. Get auto-created start node
START_ID=$(curl -s "$BASE/object/query/workflowVersions?id=$VER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.results[0].startWorkflowItemId')

# 4. Add nodes (no start node!)
SAY_ID=$(curl -s -X POST "$BASE/object/workflowItems" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"workflowVersionId\":\"$VER_ID\",\"category\":\"engagement\",\"type\":\"say\",\"label\":\"Say Hello\",\"position\":{\"x\":200,\"y\":260},\"settings\":{\"phone.playback.type\":\"tts\",\"phone.playback.message\":\"Hello world\"}}" | jq -r '.id')

HANGUP_ID=$(curl -s -X POST "$BASE/object/workflowItems" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"workflowVersionId\":\"$VER_ID\",\"category\":\"actions\",\"type\":\"hangUp\",\"label\":\"Hang Up\",\"position\":{\"x\":200,\"y\":420}}" | jq -r '.id')

# 5. Fetch ports, wire connections (see full port connection example above)

# 6. Publish
curl -s -X PUT "$BASE/object/workflowVersions" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"where\":{\"id\":\"$VER_ID\"},\"update\":{\"isPublished\":true}}"

# 7. Activate
curl -s -X PUT "$BASE/object/workflowVersions" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"where\":{\"id\":\"$VER_ID\"},\"update\":{\"isCurrent\":true}}"
```

</TabItem>
</Tabs>

---

### Fork a version to make edits

The correct way to modify a live workflow:

```json
POST /object/workflowVersions
{
  "workflowId": "074d...",
  "name": "v1.1",
  "copyFrom": "075d..."
}
```

This deep-copies the entire version — all nodes, ports, connections, and settings — with new IDs. The original published version is untouched. After editing, publish and activate the new version.

---

## Common Patterns

### 1. Create → Build → Publish → Activate (Full Lifecycle)

The canonical sequence for launching a new workflow from scratch:

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: 'your-jwt' });

async function buildAndLaunchWorkflow() {
    // Step 1: Create the workflow definition
    const workflow = await api.objects.create('workflows', {
        name: 'SMS Appointment Reminder',
        type: 'engagement',
        description: 'Sends reminder 24h before appointment',
    });
    console.log('Workflow ID:', workflow.id);

    // Step 2: Create a version (auto-creates a start node — do NOT add one manually)
    const version = await api.objects.create('workflowVersions', {
        workflowId: workflow.id,
        name: 'v1.0',
        description: 'Initial release',
    });
    console.log('Version ID:', version.id);

    // Step 3: Add nodes
    const sendSmsNode = await api.workflows.items.create({
        workflowVersionId: version.id,
        category: 'communication',
        type: 'sendSms',
        label: 'Send Reminder',
        settings: {
            from: '+18005551234',
            messageTemplate: 'appointment-reminder-24h',
        },
        position: { x: 200, y: 260 },
    });

    const endNode = await api.workflows.items.create({
        workflowVersionId: version.id,
        category: 'flow',
        type: 'end',
        label: 'Done',
        position: { x: 200, y: 420 },
    });

    // Step 4: Wire connections using port IDs
    // (Fetch existing ports to find the start node's output port)
    const ports = await api.objects.query('workflowItemPorts', {
        where: { workflowVersionId: version.id },
    });
    const startOutputPort = ports.results.find(
        p => p.type === 'output' && p.workflowItemId === version.startWorkflowItemId
    );
    const smsInputPort = ports.results.find(
        p => p.type === 'input' && p.workflowItemId === sendSmsNode.id
    );
    const smsOutputPort = ports.results.find(
        p => p.type === 'output' && p.workflowItemId === sendSmsNode.id
    );
    const endInputPort = ports.results.find(
        p => p.type === 'input' && p.workflowItemId === endNode.id
    );

    // start → sendSms
    await api.objects.create('workflowItemConnections', {
        workflowItemPortId: startOutputPort.id,
        inWorkflowItemPortId: smsInputPort.id,
    });

    // sendSms → end
    await api.objects.create('workflowItemConnections', {
        workflowItemPortId: smsOutputPort.id,
        inWorkflowItemPortId: endInputPort.id,
    });

    // Step 5: Publish (locks the version permanently)
    await api.objects.update('workflowVersions', {
        where: { id: version.id },
        update: { isPublished: true },
    });
    console.log('Version published');

    // Step 6: Activate (routes live traffic here)
    await api.objects.update('workflowVersions', {
        where: { id: version.id },
        update: { isCurrent: true },
    });
    console.log('Workflow is live!');

    return { workflowId: workflow.id, versionId: version.id };
}
```

---

### 2. Safe Hotfix: Fork → Edit → Promote

Never edit a live published version. Fork it, patch the issue, promote the fix:

```javascript
async function hotfixWorkflow(api, workflowId, currentVersionId, patchFn) {
    // 1. Fork the current live version
    const newVersion = await api.objects.create('workflowVersions', {
        workflowId,
        name: `hotfix-${Date.now()}`,
        copyFrom: currentVersionId,   // deep-copies all nodes, ports, connections
    });
    console.log('Forked to version:', newVersion.id);

    // 2. Apply the patch (caller supplies a function that edits nodes/settings)
    await patchFn(newVersion.id);

    // 3. Publish the hotfix version
    await api.objects.update('workflowVersions', {
        where: { id: newVersion.id },
        update: { isPublished: true },
    });

    // 4. Activate — takes over live traffic from the old version
    await api.objects.update('workflowVersions', {
        where: { id: newVersion.id },
        update: { isCurrent: true },
    });

    console.log(`Hotfix deployed: ${currentVersionId} → ${newVersion.id}`);
    return newVersion.id;
}

// Usage: update a node's message template
await hotfixWorkflow(api, 'workflow-id', 'old-version-id', async (versionId) => {
    // Find the SMS node in the forked version
    const items = await api.workflows.items.list(versionId);
    const smsNode = items.find(i => i.type === 'sendSms');

    await api.workflows.items.update({
        id: smsNode.id,
        settings: { messageTemplate: 'appointment-reminder-updated' },
    });
});
```

---

### 3. Trigger a Workflow Session On Demand

Kick off a workflow execution programmatically (e.g., from a webhook, a scheduled job, or an inbound event):

```javascript
async function triggerReminderWorkflow(api, workflowVersionId, contact) {
    // Start the session with contact context
    const session = await api.workflows.sessions.create(workflowVersionId, {
        contactId: contact.id,
        channel: 'sms',
        input: {
            phoneNumber: contact.phone,
            appointmentTime: contact.appointmentAt,
            providerName: contact.assignedProvider,
        },
    });
    console.log('Session started:', session.id, '| status:', session.status);
    return session.id;
}

// Run for a batch of contacts
async function sendBatchReminders(api, versionId, contacts) {
    const results = [];

    for (const contact of contacts) {
        try {
            const sessionId = await triggerReminderWorkflow(api, versionId, contact);
            results.push({ contactId: contact.id, sessionId, ok: true });
        } catch (err) {
            console.error(`Failed for contact ${contact.id}:`, err.message);
            results.push({ contactId: contact.id, ok: false, error: err.message });
        }
    }

    const succeeded = results.filter(r => r.ok).length;
    console.log(`Sent ${succeeded}/${contacts.length} reminders`);
    return results;
}
```

---

### 4. Poll Until Session Completes

Wait for a workflow session to finish and inspect the outcome:

```javascript
async function waitForSession(api, sessionId, { pollMs = 2000, timeoutMs = 120_000 } = {}) {
    const TERMINAL = new Set(['completed', 'failed', 'cancelled']);
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        const session = await api.workflows.sessions.get(sessionId);

        if (TERMINAL.has(session.status)) {
            console.log(`Session ${sessionId} finished: ${session.status}`);

            if (session.status === 'failed') {
                throw new Error(`Session failed: ${session.errorMessage || 'unknown error'}`);
            }
            return session;
        }

        console.log(`Session status: ${session.status} — waiting ${pollMs}ms`);
        await new Promise(r => setTimeout(r, pollMs));
    }

    // Timed out — force-complete and surface the error
    await api.workflows.sessions.complete(sessionId);
    throw new Error(`Session ${sessionId} timed out after ${timeoutMs}ms`);
}

// Example: trigger and await
const sessionId = await api.workflows.sessions.create(versionId, {
    contactId: 'contact-id',
    channel: 'voice',
    input: { phoneNumber: '+13175551234' },
}).then(s => s.id);

const result = await waitForSession(api, sessionId, { pollMs: 3000, timeoutMs: 60_000 });
console.log('Output variables:', result.variables);
```

---

### 5. Update Session Variables Mid-Execution

Inject real-time data into a running workflow session (e.g., from an IVR digit-collection step or a CRM lookup):

```javascript
async function injectSessionData(api, sessionId, data) {
    // Merge new variables into the running session
    await api.workflows.sessions.update(sessionId, {
        variables: {
            ...data,
            updatedAt: new Date().toISOString(),
        },
    });
    console.log('Injected variables into session:', sessionId);
}

// Practical example: IVR captures account number, triggers a CRM lookup,
// then updates the session so downstream nodes have the resolved customer data
async function handleIvrInput(api, sessionId, dtmfDigits) {
    // Look up the customer from the entered account number
    const customers = await api.objects.query('contacts', {
        where: { accountNumber: dtmfDigits },
        limit: 1,
    });

    if (customers.total === 0) {
        await injectSessionData(api, sessionId, {
            customerFound: false,
            accountNumber: dtmfDigits,
        });
        return;
    }

    const customer = customers.results[0];
    await injectSessionData(api, sessionId, {
        customerFound: true,
        customerId: customer.id,
        customerName: customer.name,
        customerTier: customer.tier,
        accountNumber: dtmfDigits,
    });
}
```

---

### 6. Audit All Versions of a Workflow

List every version of a workflow with its publish and activation status — useful for rollback planning or compliance audits:

```javascript
async function auditWorkflowVersions(api, workflowId) {
    const versions = await api.objects.query('workflowVersions', {
        where: { workflowId },
        orderBy: [{ field: 'createdAt', direction: 'desc' }],
        limit: 100,
    });

    console.log(`\nWorkflow ${workflowId} — ${versions.total} version(s)\n`);
    console.log('Version ID'.padEnd(38), 'Name'.padEnd(20), 'Published', 'Live');
    console.log('-'.repeat(80));

    for (const v of versions.results) {
        const published = v.isPublished ? '✓' : '—';
        const live      = v.isCurrent  ? '★ LIVE' : '';
        console.log(
            v.id.padEnd(38),
            (v.name || 'unnamed').padEnd(20),
            published.padEnd(12),
            live
        );
    }

    const liveVersion = versions.results.find(v => v.isCurrent);
    return { versions: versions.results, liveVersion };
}

// Rollback to a previous published version
async function rollbackWorkflow(api, targetVersionId) {
    // Verify target is published (cannot activate an unpublished version)
    const version = await api.objects.byId({ object: 'workflowVersions', id: targetVersionId });

    if (!version.isPublished) {
        throw new Error(`Version ${targetVersionId} is not published — publish it first`);
    }

    await api.objects.update('workflowVersions', {
        where: { id: targetVersionId },
        update: { isCurrent: true },
    });

    console.log(`Rolled back to version: ${targetVersionId}`);
}
```

