---
id: cli-platform
title: Platform & Infrastructure
---

# Platform & Infrastructure

These commands manage the core infrastructure of your Unbound platform: phone numbers, SIP endpoints, customer portals, webhooks, OAuth integrations, UI layouts, record types, subscriptions, recordings, and system provisioning.

---

## phones

Manage phone numbers on your account.

### Subcommands

#### `unbound phones list [options]`

List phone numbers currently provisioned on your account.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of phone numbers to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound phones list --limit 20
```

---

#### `unbound phones search [options]`

Search for available phone numbers to provision.

| Option | Description |
|---|---|
| `--state <state>` | Filter by US state (two-letter code, e.g., `CA`, `NY`) |
| `--contains <digits>` | Filter by numbers containing specific digits |
| `--limit <number>` | Maximum number of results to return |
| `--json` | Output raw JSON |

**Example -- search by state:**

```bash
unbound phones search --state CA --limit 10
```

**Example -- search for vanity numbers:**

```bash
unbound phones search --contains 2255 --limit 5
```

---

## sip

Manage SIP endpoints.

### Subcommands

#### `unbound sip list [options]`

List SIP endpoints.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of endpoints to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound sip list
```

---

#### `unbound sip get <id> [options]`

Retrieve a SIP endpoint by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound sip get sip_abc123
```

---

## portals

Manage customer-facing portals.

### Subcommands

#### `unbound portals list [options]`

List all portals.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound portals list
```

---

#### `unbound portals get <id> [options]`

Retrieve a portal by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound portals get portal_abc123
```

---

#### `unbound portals lookup [options]`

Look up a portal by its slug.

| Option | Description |
|---|---|
| `--slug <slug>` | **(Required)** The portal slug to look up |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound portals lookup --slug my-customer-portal
```

---

#### `unbound portals delete <id>`

Delete a portal.

**Example:**

```bash
unbound portals delete portal_abc123
```

---

## provisioning

System provisioning status. Also available via the `prov` alias.

### Subcommands

#### `unbound provisioning status [options]`

Check the provisioning status of your namespace.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound provisioning status
```

**Example -- using the alias:**

```bash
unbound prov status
```

---

## enroll

Enrollment and onboarding commands for new namespaces and brand verification.

### Subcommands

#### `unbound enroll check-namespace <namespace> [options]`

Check whether a namespace is available.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound enroll check-namespace acme-corp
```

---

#### `unbound enroll brand [options]`

Retrieve brand registration information.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound enroll brand
```

---

#### `unbound enroll company-info <id> [options]`

Retrieve company information for an enrollment.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound enroll company-info enroll_abc123
```

---

#### `unbound enroll verify-sms [options]`

Start or complete SMS verification during enrollment. Call without `--code` to send a verification code, then call again with `--code` to verify.

| Option | Description |
|---|---|
| `--phone <number>` | **(Required)** Phone number to verify in E.164 format |
| `--code <code>` | Verification code received via SMS |
| `--json` | Output raw JSON |

**Example -- send verification code:**

```bash
unbound enroll verify-sms --phone "+15559876543"
```

**Example -- submit verification code:**

```bash
unbound enroll verify-sms --phone "+15559876543" --code 123456
```

---

#### `unbound enroll verify-email [options]`

Start or complete email verification during enrollment. Call without `--code` to send a verification email, then call again with `--code` to verify.

| Option | Description |
|---|---|
| `--email <address>` | **(Required)** Email address to verify |
| `--code <code>` | Verification code received via email |
| `--json` | Output raw JSON |

**Example -- send verification email:**

```bash
unbound enroll verify-email --email "admin@acme.com"
```

**Example -- submit verification code:**

```bash
unbound enroll verify-email --email "admin@acme.com" --code 654321
```

---

## oauth

Manage external OAuth integrations.

### Subcommands

#### `unbound oauth list [options]`

List configured OAuth integrations.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound oauth list
```

---

#### `unbound oauth providers [options]`

List available OAuth providers.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound oauth providers
```

---

#### `unbound oauth get <nameOrId> [options]`

Retrieve an OAuth integration by name or ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound oauth get google-calendar
```

---

#### `unbound oauth unified [options]`

List unified OAuth integrations across all providers.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound oauth unified
```

---

#### `unbound oauth create [options]`

Create a new OAuth integration.

| Option | Description |
|---|---|
| `--name <name>` | **(Required)** Name for the integration |
| `--provider <provider>` | **(Required)** OAuth provider (e.g., `google`, `microsoft`) |
| `--client-id <clientId>` | OAuth client ID |
| `--client-secret <secret>` | OAuth client secret |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound oauth create --name "Google Workspace" --provider google --client-id "abc123.apps.googleusercontent.com" --client-secret "secret_xyz"
```

---

#### `unbound oauth delete <id>`

Delete an OAuth integration.

**Example:**

```bash
unbound oauth delete oauth_abc123
```

---

## record-types

Manage record types that define how objects are categorized and displayed. Also available via the `rt` alias.

### Subcommands

#### `unbound record-types list [options]`

List all record types.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound record-types list
```

**Example -- using the alias:**

```bash
unbound rt list
```

---

#### `unbound record-types get <id> [options]`

Retrieve a record type by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound record-types get rt_abc123
```

---

#### `unbound record-types users <recordTypeId> [options]`

List users associated with a record type.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound record-types users rt_abc123
```

---

#### `unbound record-types defaults [userId] [options]`

Get default record types, optionally for a specific user.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example -- get system defaults:**

```bash
unbound record-types defaults
```

**Example -- get defaults for a specific user:**

```bash
unbound record-types defaults usr_def456
```

---

#### `unbound record-types create [options]`

Create a new record type.

| Option | Description |
|---|---|
| `--name <name>` | **(Required)** Name of the record type |
| `--object <object>` | **(Required)** Object this record type applies to |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound record-types create --name "VIP Contact" --object contacts
```

---

#### `unbound record-types update <id> [options]`

Update an existing record type.

| Option | Description |
|---|---|
| `--name <name>` | Updated name |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound record-types update rt_abc123 --name "Premium Contact"
```

---

#### `unbound record-types delete <id>`

Delete a record type.

**Example:**

```bash
unbound record-types delete rt_abc123
```

---

## layouts

Manage UI layouts that control how object records are displayed.

### Subcommands

#### `unbound layouts list <objectName> [options]`

List layouts for a specific object type.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound layouts list contacts
```

---

#### `unbound layouts get <objectName> <id> [options]`

Retrieve a specific layout for an object type.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound layouts get contacts layout_abc123
```

---

#### `unbound layouts create [options]`

Create a new layout.

| Option | Description |
|---|---|
| `--name <name>` | **(Required)** Name of the layout |
| `--object <object>` | **(Required)** Object this layout applies to |
| `--type <type>` | Layout type |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound layouts create --name "Compact Contact View" --object contacts --type detail
```

---

#### `unbound layouts update <id> [options]`

Update an existing layout.

| Option | Description |
|---|---|
| `--name <name>` | Updated name |
| `--config <json>` | Layout configuration as JSON |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound layouts update layout_abc123 --name "Updated Contact View"
```

---

#### `unbound layouts delete <id>`

Delete a layout.

**Example:**

```bash
unbound layouts delete layout_abc123
```

---

## webhooks

Manage webhook endpoints that receive event notifications from the platform.

### Subcommands

#### `unbound webhooks list [options]`

List configured webhooks.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of webhooks to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound webhooks list
```

---

#### `unbound webhooks get <id> [options]`

Retrieve a webhook by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound webhooks get wh_abc123
```

---

#### `unbound webhooks create [options]`

Create a new webhook endpoint.

| Option | Description |
|---|---|
| `--name <name>` | **(Required)** Name of the webhook |
| `--url <url>` | **(Required)** URL to receive webhook events |
| `--events <events>` | Comma-separated list of event types to subscribe to |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound webhooks create --name "Call Events" --url "https://api.acme.com/webhooks/calls" --events "call.started,call.ended"
```

---

#### `unbound webhooks delete <id>`

Delete a webhook.

**Example:**

```bash
unbound webhooks delete wh_abc123
```

---

#### `unbound webhooks fire <webhookId> [options]`

Manually fire a webhook for testing purposes.

| Option | Description |
|---|---|
| `--data <json>` | JSON payload to send with the test webhook |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound webhooks fire wh_abc123 --data '{"event": "call.started", "callId": "call_test"}'
```

---

## subscriptions

Manage real-time socket subscriptions for event streaming. Also available via the `subs` alias.

### Subcommands

#### `unbound subscriptions list [options]`

List active subscriptions.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound subscriptions list
```

**Example -- using the alias:**

```bash
unbound subs list
```

---

#### `unbound subscriptions create [options]`

Create a new subscription.

| Option | Description |
|---|---|
| `--id <id>` | Custom subscription ID |
| `--events <events>` | Comma-separated list of event types to subscribe to |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound subscriptions create --events "call.started,call.ended,sms.received"
```

---

#### `unbound subscriptions delete [id]`

Delete a subscription. If no ID is provided, deletes the default subscription.

**Example:**

```bash
unbound subscriptions delete sub_abc123
```

---

## recordings

Manage call and session recordings.

### Subcommands

#### `unbound recordings list [options]`

List recordings.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of recordings to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound recordings list --limit 20
```

---

#### `unbound recordings get <id> [options]`

Retrieve a specific recording by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound recordings get rec_abc123
```
