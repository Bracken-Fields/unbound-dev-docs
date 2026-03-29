---
id: concepts-overview
title: Core Concepts
---

# Core Concepts

Understanding Unbound's data model makes everything click. This page explains the core building blocks so you can read the SDK docs and API reference without getting lost.

---

## Namespaces

Every Unbound account has a **namespace** — a unique identifier that scopes all your data, users, and phone numbers.

```
https://your-namespace.api.unbound.cx
```

The SDK connects to this URL automatically when you initialize with `new SDK({ namespace: 'your-namespace' })`. All API calls are namespaced — two accounts never share data.

---

## Authentication & Tokens

Unbound uses **JWT tokens** for authentication. Two token types exist:

| Token Type | Transport | Use Case |
|---|---|---|
| `cookie` | Cookie header (`authToken=...`) | Browser apps, SSO redirects |
| `bearer` | `Authorization: Bearer ...` | Server-to-server, API scripts |

The SDK login method (`api.login.login()`) issues a cookie-type token by default and caches it internally. For server-to-server workloads, issue a bearer token from the dashboard and pass it directly:

```javascript
const api = new SDK({
    namespace: 'your-namespace',
    token: 'your-bearer-token',   // skips the login step entirely
});
```

:::important Token type matching
The API enforces token type matching. A cookie token sent as `Authorization: Bearer` will be rejected with `401 Token type mismatch`. Always match the transport to the type.
:::

---

## Objects

Unbound's **Objects** system is a flexible, CRM-style data layer. It works like a schemaless relational database: you define object types (tables) and columns, then store and query records.

**Built-in object types:**

| Type | Description |
|---|---|
| `contacts` | People — unified across voice, SMS, email |
| `people` | Same as contacts (alias) |
| `companies` | Organizations |
| `leads` | Pre-conversion prospects |
| `engagementSessions` | Interaction records (calls, chats, tasks) |
| `tasks` | Task Router work items |
| `queues` | Call/task queue definitions |
| `cdr` | Call Detail Records |
| `recordings` | Voice recording metadata |
| `sipEndpoints` | SIP endpoint configuration |

You can also define **custom object types** with your own columns:

```javascript
// Create a new object type
await api.objects.createObject({ name: 'tickets' });

// Add columns to it
await api.objects.createColumn({
    objectName: 'tickets',
    columns: [
        { name: 'subject',    type: 'varchar', length: 255, isRequired: true },
        { name: 'priority',   type: 'varchar', length: 20, defaultValue: 'normal' },
        { name: 'status',     type: 'varchar', length: 50 },
        { name: 'assigneeId', type: 'varchar', length: 128 },
        { name: 'body',       type: 'text' },
    ],
});
```

All objects support CRUD (`create`, `query`, `byId`, `updateById`, `deleteById`) plus schema inspection (`describe`, `list`). See [Objects reference](/api-reference/objects).

---

## Engagement Sessions

An **Engagement Session** is the central concept in Unbound's contact center model. Every customer interaction — a call, a chat thread, an email exchange, a task — is anchored to an engagement session.

An engagement session tracks:

| Field | Description |
|---|---|
| `status` | `new` → `working` → `wrapUp` → `completed` |
| `queueId` | Which queue handled this interaction |
| `peopleId` | The customer (contact) record |
| `companyId` | The customer's company |
| `assignedUserId` | The agent who handled it |
| `channel` | `voice`, `sms`, `email`, `chat`, `video` |
| `engagementDuration` | Talk/handle time in seconds |
| `createdAt` / `completedAt` | Start and end timestamps |

Engagement sessions are queryable via UOQL for reporting and analytics:

```javascript
// Daily call volume by channel
const { results } = await api.objects.uoql({
    query: `
        SELECT channel, COUNT(*) AS total, AVG(engagementDuration) AS avgDuration
        FROM engagementSessions
        WHERE DATE(createdAt) = CURDATE()
        GROUP BY channel
    `,
});
```

When you create a Task Router task with `createEngagement: true`, an engagement session is created automatically and linked to the task.

---

## Task Router

The **Task Router** is Unbound's ACD (Automatic Call Distributor) engine. It matches incoming work (tasks) to available agents (workers) in queues.

### Lifecycle

```
  Contact arrives
       ↓
  Task created (queueId + skills + priority)
       ↓
  Task Router finds available worker
       ↓
  Task assigned → agent rings / receives notification
       ↓
  Agent accepts → task status: "connected"
       ↓
  Interaction happens (call, chat, email)
       ↓
  Call/chat ends → task status: "wrapUp"
       ↓
  Agent completes wrap-up → task status: "completed"
```

### Key Entities

| Entity | Description |
|---|---|
| **Queue** | A named channel — "Sales", "Tier-2 Support" |
| **Worker** | An agent user account registered in one or more queues |
| **Task** | A work item in a queue — tied to an engagement session |
| **Skill** | A tag on workers and tasks — enables skills-based routing |

Workers must be **available** and **logged in** to a queue to receive tasks:

```javascript
// Agent comes online
await api.taskRouter.worker.setAvailable();
await api.taskRouter.worker.queueAutoLogin();   // login all auto-login queues

// Agent goes offline
await api.taskRouter.worker.queueLogoutAll();
await api.taskRouter.worker.setOffline();
```

See [Task Router reference](/api-reference/task-router) for full details.

---

## Record Types

**Record Types** control data visibility and access permissions within a namespace. They let you segment data so different teams or users only see their own records.

| Value | Behavior |
|---|---|
| `null` | Universal access — all users can see this record |
| Array of user IDs | Restricted — only listed users can access |

Record types apply to: contacts, companies, engagement sessions, mailboxes, SIP endpoints, and storage files.

```javascript
// Create a record type for the "Enterprise Sales" team
const rt = await api.recordTypes.create({
    name: 'Enterprise Sales',
    description: 'Visible only to Enterprise Sales reps',
    add: ['user-id-alice', 'user-id-bob'],
});

// Create a contact restricted to that team
await api.objects.create({
    object: 'contacts',
    body: {
        name: 'Big Corp Decision Maker',
        email: 'dm@bigcorp.com',
        recordTypeId: rt.id,   // only Enterprise Sales can see this
    },
});
```

See [Record Types reference](/api-reference/record-types).

---

## Channels

Unbound unifies multiple communication channels through a single SDK:

| Channel | SDK Service | Description |
|---|---|---|
| Voice | `api.voice` | Inbound/outbound calls, IVR, conferencing, recording, transcription |
| SMS / MMS | `api.messaging.sms` | Text messages with media attachments, templates, campaigns |
| Email | `api.messaging.email` | Full mailbox: send, receive, drafts, templates, analytics |
| Fax | `api.messaging.fax` | Send and receive faxes |
| Video | `api.video` | Video rooms, participants, chat, analytics |
| AI Chat | `api.ai.generative` | LLM-powered chat completions |

All channels integrate with the engagement session model — every interaction is traceable in one place.

---

## UOQL — Query Language

**UOQL** (Unbound Object Query Language) is a SQL-style query engine that lets you run read queries against any object in the platform.

Use `api.objects.query()` for simple lookups. Use UOQL when you need aggregates, GROUP BY, window functions, or OR conditions:

```javascript
// Average handle time by queue, last 7 days
const { results } = await api.objects.uoql({
    query: `
        SELECT queueId, COUNT(*) AS totalCalls, AVG(engagementDuration) AS avgHandleTime
        FROM engagementSessions
        WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          AND status = 'completed'
        GROUP BY queueId
        ORDER BY totalCalls DESC
        LIMIT 20
    `,
});
```

See [UOQL reference](/api-reference/uoql) for the full SQL syntax, aggregate functions, window functions, and pagination patterns.

---

## Workflows

**Workflows** are visual automation graphs — a directed set of items connected by data ports. Each item is a step (send email, classify message, route call, run AI, query data, trigger webhook). Items connect output ports to input ports of the next step.

Workflows are created programmatically via the SDK or in the visual editor. They run on-demand, on a schedule, or triggered by platform events.

```javascript
// Trigger an existing workflow (fire-and-forget)
const session = await api.workflows.sessions.create(workflowVersionId);

// Or trigger and wait for completion
let session = await api.workflows.sessions.create(workflowVersionId);
while (session.status !== 'completed' && session.status !== 'error') {
    await new Promise(r => setTimeout(r, 2000));
    session = await api.workflows.sessions.get(session.id);
}
console.log('Workflow result:', session.status);
```

See [Workflows reference](/api-reference/workflows).

---

## Portals

**Portals** are branded, customer-facing web apps hosted on your own domain. They're built on top of Unbound's object data — a portal renders your contacts, tickets, or any custom object type as a styled web page.

Portals support:
- Custom domains (DNS-verified)
- CSS/JS customization
- Object-backed pages (render any object type as content)
- Authentication via Unbound's SSO flow

See [Portals reference](/api-reference/portals).

---

## Storage

All files in Unbound are stored with configurable multi-region replication. Storage IDs are portable — a storage file can be referenced as an email attachment, a fax document, an AI transcription source, a recording, or a portal asset.

```javascript
// Upload a file and get its storageId
const uploaded = await api.storage.upload({
    file: fs.readFileSync('report.pdf'),
    fileName: 'monthly-report.pdf',
    classification: 'documents',   // 'recordings' | 'documents' | 'images' | ...
    contentType: 'application/pdf',
});

// Use the storageId as an email attachment
await api.messaging.email.send({
    to: 'client@example.com',
    from: 'support@yourco.com',
    subject: 'Your Monthly Report',
    html: '<p>See attached.</p>',
    attachments: [{ storageId: uploaded.id, filename: 'monthly-report.pdf' }],
});
```

See [Storage reference](/api-reference/storage).

---

## Subscriptions (Real-Time Events)

**Subscriptions** let you listen to live platform events over WebSocket. Any event that happens on the platform — incoming call, task assignment, message delivered, transcript segment — can be streamed to your application in real time.

```javascript
// Subscribe to task router + voice events
await api.subscriptions.subscribe(['taskRouter', 'voice', 'messaging']);

api.subscriptions.on('task.assigned', (event) => {
    // Ring the agent UI
});

api.subscriptions.on('voice.ringing', (event) => {
    // Show incoming call notification
});

api.subscriptions.on('transcription.partial', (event) => {
    // Update live transcript display
});
```

See [Subscriptions reference](/api-reference/subscriptions) and [Real-Time Subscriptions guide](/guides/real-time-subscriptions).

---

## Data Architecture at a Glance

```
Namespace (your account)
├── Objects (data)
│   ├── contacts / people / companies
│   ├── engagementSessions (all interactions)
│   ├── cdr (call detail records)
│   └── custom types (tickets, orders, ...)
├── Communications
│   ├── Voice (calls, recordings, transcriptions)
│   ├── Messaging (SMS, email, fax)
│   └── Video (rooms, participants, recordings)
├── Task Router
│   ├── Queues
│   ├── Workers (agents)
│   └── Tasks (work items → engagement sessions)
├── AI
│   ├── Generative chat (LLM completions)
│   ├── TTS / STT (voice synthesis + transcription)
│   ├── Data extraction (phone, email, intent, ...)
│   └── Knowledge Base (semantic search)
├── Workflows (automation graphs)
├── Storage (files, recordings, attachments)
└── Subscriptions (real-time event stream)
```

Every piece of data lives in your namespace. Every interaction creates an engagement session. Every engagement session is queryable via UOQL. This unified model is what makes Unbound different from cobbling together separate APIs for voice, SMS, and CRM.
