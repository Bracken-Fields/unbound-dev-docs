---
id: concepts-overview
title: Core Concepts
---

# Core Concepts

Understanding Unbound's data model makes everything click.

---

## Namespaces

Every Unbound account has a **namespace** — a unique identifier that scopes all your data and routes your API calls.

```
your-namespace.api.unbound.cx
```

The SDK connects to this URL automatically when you initialize with `new SDK({ namespace: 'your-namespace' })`.

---

## Objects

Unbound's data layer is built on **Objects** — a flexible, CRM-style system for storing any structured data.

- You can query any object type with `api.objects.query()`
- You can define new object types and columns dynamically
- Built-in types include: `contacts`, `people`, `companies`, `leads`, `engagementSessions`

See [Objects reference](/api-reference/objects).

---

## Engagement Sessions

An **Engagement Session** is the central concept in Unbound's contact center model. Every interaction — a call, a chat, an email thread, a task — is tied to an engagement session.

Key properties:
- Has a `status`: `new`, `working`, `wrapUp`, `completed`
- Can have a `queueId` (routing destination)
- Links to a `peopleId` (contact) and `companyId`
- Carries a transcript, notes, recordings, and AI analysis
- Is the anchor for Task Router tasks

When you create a Task with `createEngagement: true`, an engagement session is created automatically.

---

## Task Router

The **Task Router** is Unbound's ACD (Automatic Call Distributor) engine.

Flow:
1. A contact arrives (call, chat, email)
2. A **Task** is created with a `queueId` and optional skill requirements
3. The Task Router finds an **available Worker** in that queue who matches the skills
4. The task is **assigned** → agent rings/receives notification
5. Agent **accepts** → task becomes **connected**
6. Interaction ends → agent moves to **wrapUp**
7. Agent completes wrap-up → task **completed**

Workers are user accounts that have been activated in a queue. Worker availability is managed with `api.taskRouter.worker.setAvailable()` and `api.taskRouter.worker.setOffline()`.

---

## Record Types

**Record Types** control data access permissions. Each object can have a record type that restricts which users can create, read, update, or delete it.

- `null` = universal access (everyone)
- Array of user IDs = restricted to those users

Used across objects, mailboxes, SIP endpoints, and storage.

---

## Channels

Unbound supports multiple communication channels through a single platform:

| Channel | SDK Service |
|---|---|
| Voice (inbound/outbound calls) | `api.voice` |
| SMS / MMS | `api.messaging.sms` |
| Email (send + full inbox) | `api.messaging.email` |
| Video conferencing | `api.video` |
| AI chat | `api.ai.generative` |

All channels can be tied to an engagement session for unified history.

---

## Portals

**Portals** are branded customer-facing web apps hosted on your own domain. They're powered by Unbound's object data and can be customized with CSS/JS.

See [Portals reference](/api-reference/portals).

---

## Storage

All files in Unbound are stored with multi-region replication by default. Storage IDs are portable — use them as attachments in emails, transcription sources, portal assets, or CRM attachments.

See [Storage reference](/api-reference/storage).

---

## Workflows

**Workflows** are visual automation graphs — a directed set of items connected by ports. Each item is a step (send email, route call, run AI, query data). Items connect output ports to input ports of the next item.

Use workflows to automate:
- Inbound routing (SMS → classify → route or auto-reply)
- Outbound campaigns (trigger → personalize → send)
- Support flows (ticket created → acknowledge → assign)

See [Workflows reference](/api-reference/workflows).
