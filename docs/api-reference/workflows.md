---
id: workflows
title: Workflows
---

# Workflows

`api.workflows` — Build and manage automation workflows programmatically. Each workflow is a directed graph of items connected by ports.

## Workflow Items

Items are the individual steps in a workflow (send email, route call, trigger webhook, etc.).

```javascript
// Create a workflow item
const item = await api.workflows.items.create({
  workflowVersionId: 'wf-version-123',
  category: 'communication',
  type: 'sendSms',
  settings: {
    from: '+1234567890',
    messageTemplate: 'appointment-reminder',
  },
  position: { x: 200, y: 150 },
});
```

### Item Types (by Category)

| Category | Types |
|---|---|
| `communication` | `sendSms`, `sendEmail`, `makeCall`, `sendVoicemail` |
| `routing` | `routeToAgent`, `routeToQueue`, `routeByCondition` |
| `ai` | `aiChat`, `aiTts`, `aiStt`, `aiPlaybook` |
| `data` | `createObject`, `updateObject`, `queryObjects` |
| `flow` | `wait`, `branch`, `loop`, `trigger`, `end` |
| `integration` | `webhook`, `httpRequest`, `customCode` |

## Connections

Connect item outputs to item inputs:

```javascript
await api.workflows.connections.create({
  workflowItemId: 'item-1',
  workflowItemPortId: 'output',
  inWorkflowItemId: 'item-2',
  inWorkflowItemPortId: 'input',
});
```

## Update an Item

```javascript
await api.workflows.items.update('item-id', {
  settings: {
    messageTemplate: 'new-template',
  },
});
```

## Delete an Item

```javascript
await api.workflows.items.delete('item-id');
```

## List Items

```javascript
const items = await api.workflows.items.list({
  workflowVersionId: 'wf-version-123',
});
```
