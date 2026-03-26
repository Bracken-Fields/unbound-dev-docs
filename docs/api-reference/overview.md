---
id: overview
title: API Reference
slug: /api-reference/overview
---

# API Reference

The Unbound SDK exposes the following services via `api.<service>`:

## Communication

| Service | Property | Description |
|---|---|---|
| [Messaging](/api-reference/messaging) | `api.messaging` | SMS, MMS, email, templates, campaigns |
| [Faxes](/api-reference/faxes) | `api.messaging.fax` | Send, receive, and track faxes |
| [Voice](/api-reference/voice) | `api.voice` | Calls, conferencing, recording, transcription |
| [Video](/api-reference/video) | `api.video` | Rooms, participants, chat, analytics |

## AI

| Service | Property | Description |
|---|---|---|
| [AI Services](/api-reference/ai) | `api.ai` | Generative chat, TTS, real-time STT streaming, data extraction, playbooks |
| [Knowledge Base](/api-reference/knowledge-base) | `api.knowledgeBase` | AI-powered knowledge bases, semantic search, content ingestion |

## Contact Center

| Service | Property | Description |
|---|---|---|
| [Task Router](/api-reference/task-router) | `api.taskRouter` | Routing engine — workers, tasks, queues, metrics |
| [Engagement Metrics](/api-reference/engagement-metrics) | `api.engagementMetrics` | Queue and agent performance dashboards |

## Data & Automation

| Service | Property | Description |
|---|---|---|
| [Objects](/api-reference/objects) | `api.objects` | CRM-style data — CRUD, queries, schemas |
| [UOQL](/api-reference/uoql) | `POST /object/query/v2` | SQL query engine — SELECT, GROUP BY, aggregates, window functions |
| [Workflows](/api-reference/workflows) | `api.workflows` | Build and run automation flows |
| [Notes](/api-reference/notes) | `api.notes` | Rich-text notes on any CRM object |
| [Storage](/api-reference/storage) | `api.storage` | File upload, access control, metadata |

## Platform & Infrastructure

| Service | Property | Description |
|---|---|---|
| [Subscriptions](/api-reference/subscriptions) | `api.subscriptions` | Real-time WebSocket event subscriptions |
| [Phone Numbers](/api-reference/phone-numbers) | `api.phoneNumbers` | DID inventory, configuration, porting |
| [SIP Endpoints](/api-reference/sip-endpoints) | `api.sipEndpoints` | WebRTC and IP phone endpoint management |
| [Portals](/api-reference/portals) | `api.portals` | Branded customer portals on custom domains |
| [Lookup](/api-reference/lookup) | `api.lookup` | CNAM, LRN, and number intelligence |
| [Verification](/api-reference/verification) | `api.verification` | SMS and email OTP verification |
| Authentication | `api.login` | Login, logout, validate, change password |
| Record Types | `api.recordTypes` | Data access permission schemas |
| Layouts | `api.layouts` | UI layout definitions |

---

## Base URL

All API requests go to:

```
https://{namespace}.api.unbound.cx
```

The SDK handles this automatically based on your configured namespace.

## Authentication

All requests require a valid JWT in the `Authorization: Bearer` header. The SDK manages this automatically after login or when you pass `token` to the constructor.

See [Authentication](/sdk/authentication) for details.
