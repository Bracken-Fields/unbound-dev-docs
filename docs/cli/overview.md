---
id: cli-overview
title: CLI Reference
---

# CLI Reference

The `unbound` command-line tool gives you full control over the Unbound platform from your terminal. Use it to send messages, manage contacts, run queries, configure workflows, and automate platform operations -- all without leaving the command line.

## Installation

Install the CLI globally via npm:

```bash
npm install -g @unboundcx/cli
```

Verify the installation:

```bash
unbound --help
```

## Authentication

Before using any commands, authenticate with the Unbound platform:

```bash
unbound login
```

The interactive prompt will ask for your namespace, email, and password.

For CI/CD pipelines and scripting, set environment variables instead:

```bash
export UNBOUND_NAMESPACE=my-namespace
export UNBOUND_EMAIL=user@example.com
export UNBOUND_PASSWORD=my-password
```

When these environment variables are set, the CLI authenticates automatically without prompting.

## Global Flags

Every command supports these global flags:

| Flag | Description |
|---|---|
| `--json` | Output raw JSON instead of formatted text. Useful for piping into `jq` or other tools. |
| `--help` | Display help information for any command or subcommand. |

## Quick Examples

Send an SMS:

```bash
unbound sms send --from "+15551000100" --to "+15559876543" --message "Hello from the CLI"
```

List your contacts:

```bash
unbound contacts list --limit 10
```

Run a UOQL query:

```bash
unbound uoql "SELECT name, email FROM contacts WHERE created_at > '2025-01-01' LIMIT 20"
```

Make a voice call:

```bash
unbound voice call --from "+15551000100" --to "+15559876543"
```

Get call detail records as JSON for scripting:

```bash
unbound cdr list --limit 50 --json | jq '.[] | .duration'
```

Search for available phone numbers:

```bash
unbound phones search --state CA --limit 5
```

## Command Groups

| Group | Commands | Description |
|---|---|---|
| [Contacts & People](./commands/contacts) | `contacts` | Create, list, search, and update contacts |
| [Messaging](./commands/messaging) | `sms`, `email`, `faxes` | Send and manage SMS, email, and fax messages |
| [Voice & CDR](./commands/voice) | `voice`, `cdr` | Make calls, manage active calls, and query call records |
| [Video](./commands/video) | `video` | Create and manage video rooms and participants |
| [AI](./commands/ai) | `ai` | Chat with AI models and generate text-to-speech audio |
| [Objects & UOQL](./commands/objects) | `objects`, `query`, `uoql` | Query platform data with the object system and UOQL SQL engine |
| [Task Router](./commands/tasks) | `tasks`, `queues`, `skills`, `agents` | Manage contact center task routing |
| [Workflows](./commands/workflows) | `workflows`, `modules` | Build, inspect, and manage automation workflows |
| [Platform & Infrastructure](./commands/platform) | `phones`, `sip`, `portals`, `provisioning`, `enroll`, `oauth`, `record-types`, `layouts`, `webhooks`, `subscriptions`, `recordings` | Phone numbers, SIP, portals, webhooks, and system configuration |
| [Admin & Utilities](./commands/admin) | `login`, `metrics`, `notes`, `lookup`, `verification`, `kb`, `calendar` | Authentication, analytics, notes, lookups, and integrations |
