---
id: build-workflow
title: Build an Automation Workflow
---

# Build an Automation Workflow

Workflows are directed graphs — items connected by ports. This guide builds a simple inbound SMS triage flow: receive message → classify with AI → route to agent or send auto-reply.

## Concept

```
[Trigger: SMS Received]
        ↓
  [AI: Classify Intent]
        ↓
   ┌────┴────┐
[Route]  [Auto-Reply]
   ↓
[Assign to Queue]
```

## Step 1: Create Workflow Items

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace', token: 'your-jwt' });

const workflowVersionId = 'your-workflow-version-id';

// Step 1: Trigger
const trigger = await api.workflows.items.create({
  workflowVersionId,
  category: 'flow',
  type: 'trigger',
  settings: { event: 'message.received', channel: 'sms' },
  position: { x: 100, y: 100 },
});

// Step 2: AI classification
const classify = await api.workflows.items.create({
  workflowVersionId,
  category: 'ai',
  type: 'aiChat',
  settings: {
    instructions: 'Classify this SMS as: support, sales, or spam. Reply with one word.',
    model: 'gpt-4',
  },
  position: { x: 100, y: 250 },
});

// Step 3a: Route to agent queue
const route = await api.workflows.items.create({
  workflowVersionId,
  category: 'routing',
  type: 'routeToQueue',
  settings: { queueId: 'support-queue' },
  position: { x: 0, y: 400 },
});

// Step 3b: Auto-reply for spam
const autoReply = await api.workflows.items.create({
  workflowVersionId,
  category: 'communication',
  type: 'sendSms',
  settings: {
    messageTemplate: 'spam-deflect',
  },
  position: { x: 200, y: 400 },
});
```

## Step 2: Connect the Items

```javascript
// Trigger → Classify
await api.workflows.connections.create({
  workflowItemId: trigger.id,
  workflowItemPortId: 'output',
  inWorkflowItemId: classify.id,
  inWorkflowItemPortId: 'input',
});

// Classify → Route (support/sales branch)
await api.workflows.connections.create({
  workflowItemId: classify.id,
  workflowItemPortId: 'output-support',
  inWorkflowItemId: route.id,
  inWorkflowItemPortId: 'input',
});

// Classify → Auto-reply (spam branch)
await api.workflows.connections.create({
  workflowItemId: classify.id,
  workflowItemPortId: 'output-spam',
  inWorkflowItemId: autoReply.id,
  inWorkflowItemPortId: 'input',
});
```

## What's Next

- [Workflows API Reference](/api-reference/workflows)
- [AI Services](/api-reference/ai)
- [Subscriptions — Monitor Workflow Events](/api-reference/subscriptions)
