---
id: overview
title: API Reference
slug: /api-reference/overview
---

# API Reference

The Unbound SDK exposes the following top-level services:

| Service | Property | Description |
|---|---|---|
| [Messaging](/api-reference/messaging) | `api.messaging` | SMS, MMS, email, templates, campaigns |
| [Voice](/api-reference/voice) | `api.voice` | Calls, conferencing, recording, transcription |
| [Video](/api-reference/video) | `api.video` | Rooms, participants, analytics |
| [AI](/api-reference/ai) | `api.ai` | Generative chat, TTS, STT streaming |
| [Objects](/api-reference/objects) | `api.objects` | CRM-style data — CRUD, queries, schemas |
| [Workflows](/api-reference/workflows) | `api.workflows` | Build and run automation workflows |
| [Storage](/api-reference/storage) | `api.storage` | File upload, retrieval, deletion |
| [Subscriptions](/api-reference/subscriptions) | `api.subscriptions` | Realtime event subscriptions |
| Authentication | `api.login` | Login, logout, validate, change password |
| Phone Numbers | `api.phoneNumbers` | Manage DID inventory |
| SIP Endpoints | `api.sipEndpoints` | SIP trunk configuration |
| Portals | `api.portals` | Customer portal management |
| Layouts | `api.layouts` | UI layout definitions |
| Record Types | `api.recordTypes` | Custom record type schemas |
| Lookup | `api.lookup` | Address and data lookup |
| Verification | `api.verification` | Identity verification flows |

## Base URL

All API requests go to:

```
https://{namespace}.api.unbound.cx
```

The SDK handles this automatically based on your configured namespace.

## Authentication

All requests require a valid JWT in the `Authorization: Bearer` header. The SDK manages this automatically after login or when you pass `token` to the constructor.

See [Authentication](/sdk/authentication) for details.
