---
id: admin
title: Admin & Utilities
---

# Admin & Utilities

These commands handle authentication, engagement metrics, notes, phone number lookups, identity verification, knowledge base management, and calendar integrations.

---

## login

Authenticate with the Unbound platform.

#### `unbound login`

Starts an interactive login prompt that asks for your namespace, email, and password. On success, your session credentials are stored locally.

**Example -- interactive login:**

```bash
unbound login
```

For non-interactive authentication (CI/CD, scripts), set environment variables instead of using the interactive prompt:

| Environment Variable | Description |
|---|---|
| `UNBOUND_NAMESPACE` | Your Unbound namespace |
| `UNBOUND_EMAIL` | Your account email address |
| `UNBOUND_PASSWORD` | Your account password |

**Example -- authenticate via environment variables:**

```bash
export UNBOUND_NAMESPACE=acme-corp
export UNBOUND_EMAIL=admin@acme.com
export UNBOUND_PASSWORD=my-secret-password
unbound contacts list
```

---

## metrics

Retrieve engagement metrics for your namespace.

### Subcommands

#### `unbound metrics get [options]`

Get engagement metrics, optionally filtered by date range and type.

| Option | Description |
|---|---|
| `--start <date>` | Start date for the metrics window (e.g., `2025-01-01`) |
| `--end <date>` | End date for the metrics window (e.g., `2025-01-31`) |
| `--type <type>` | Metric type to retrieve |
| `--json` | Output raw JSON |

**Example -- get all metrics:**

```bash
unbound metrics get
```

**Example -- filter by date range:**

```bash
unbound metrics get --start 2025-03-01 --end 2025-03-31
```

**Example -- get a specific metric type as JSON:**

```bash
unbound metrics get --type calls --start 2025-01-01 --end 2025-12-31 --json
```

---

## notes

Manage notes attached to records and contacts.

### Subcommands

#### `unbound notes list [options]`

List notes.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of notes to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound notes list --limit 25
```

---

#### `unbound notes get <id> [options]`

Retrieve a single note by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound notes get note_abc123
```

---

#### `unbound notes create [options]`

Create a new note. Optionally attach it to a related record.

| Option | Description |
|---|---|
| `--title <title>` | **(Required)** Title of the note |
| `--body <text>` | Body content of the note |
| `--related-id <id>` | ID of the related record to attach the note to |
| `--related-type <type>` | Type of the related record (e.g., `contacts`, `tasks`) |
| `--json` | Output raw JSON |

**Example -- create a standalone note:**

```bash
unbound notes create --title "Meeting Notes" --body "Discussed Q2 roadmap and priorities."
```

**Example -- attach a note to a contact:**

```bash
unbound notes create --title "Follow-up" --body "Call back next week." --related-id con_abc123 --related-type contacts
```

---

#### `unbound notes update <id> [options]`

Update an existing note.

| Option | Description |
|---|---|
| `--title <title>` | Updated title |
| `--body <text>` | Updated body content |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound notes update note_abc123 --body "Updated: Call back on Monday."
```

---

#### `unbound notes delete <id>`

Delete a note.

**Example:**

```bash
unbound notes delete note_abc123
```

---

#### `unbound notes search <query> [options]`

Search notes by keyword.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound notes search "roadmap"
```

---

## lookup

Look up information about phone numbers using LRN, CNAM, and general number lookups.

### Subcommands

#### `unbound lookup lrn <phoneNumber> [options]`

Perform a Location Routing Number (LRN) lookup to determine the carrier and routing information for a phone number.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound lookup lrn "+15559876543"
```

---

#### `unbound lookup cnam <phoneNumber> [options]`

Perform a Caller Name (CNAM) lookup to retrieve the caller ID name associated with a phone number.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound lookup cnam "+15559876543"
```

---

#### `unbound lookup number <phoneNumber> [options]`

Perform a general lookup on a phone number, returning all available information.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound lookup number "+15559876543"
```

**Example -- get JSON for scripting:**

```bash
unbound lookup number "+15559876543" --json | jq '.carrier'
```

---

## verification

Identity verification via SMS or other channels. Also available via the `verify` alias.

### Subcommands

#### `unbound verification start [options]`

Start a new verification session. This sends a verification code to the recipient.

| Option | Description |
|---|---|
| `--type <type>` | Verification channel type (e.g., `sms`, `call`) |
| `--to <destination>` | Destination phone number or address |
| `--json` | Output raw JSON |

**Example -- start SMS verification:**

```bash
unbound verification start --type sms --to "+15559876543"
```

**Example -- using the alias:**

```bash
unbound verify start --type sms --to "+15559876543"
```

---

#### `unbound verification check [options]`

Check a verification code submitted by the user.

| Option | Description |
|---|---|
| `--session <sessionId>` | **(Required)** Verification session ID returned by `start` |
| `--code <code>` | **(Required)** Verification code to check |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound verification check --session vs_abc123 --code 123456
```

---

## kb

Manage knowledge bases, articles, and content ingestion. Use knowledge bases to power AI-driven search and support.

### Subcommands

#### `unbound kb list [options]`

List knowledge bases.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of knowledge bases to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound kb list
```

---

#### `unbound kb get <id> [options]`

Retrieve a knowledge base by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound kb get kb_abc123
```

---

#### `unbound kb search <query> [options]`

Search across knowledge base articles.

| Option | Description |
|---|---|
| `--kb-id <kbId>` | Restrict search to a specific knowledge base |
| `--limit <number>` | Maximum number of results to return |
| `--json` | Output raw JSON |

**Example -- search all knowledge bases:**

```bash
unbound kb search "how to reset password"
```

**Example -- search within a specific knowledge base:**

```bash
unbound kb search "billing" --kb-id kb_abc123 --limit 5
```

---

#### `unbound kb ingest <url> [options]`

Ingest content from a URL into a knowledge base.

| Option | Description |
|---|---|
| `--kb-id <kbId>` | **(Required)** Knowledge base to ingest the content into |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound kb ingest "https://docs.acme.com/faq" --kb-id kb_abc123
```

---

#### `unbound kb discover <url> [options]`

Discover content and links at a URL for potential ingestion.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound kb discover "https://docs.acme.com"
```

---

#### `unbound kb analytics <kbId> [options]`

View analytics for a knowledge base, including content gaps.

| Option | Description |
|---|---|
| `--gaps` | Show content gap analysis |
| `--json` | Output raw JSON |

**Example -- view analytics:**

```bash
unbound kb analytics kb_abc123
```

**Example -- identify content gaps:**

```bash
unbound kb analytics kb_abc123 --gaps
```

---

#### `unbound kb publish <articleId> [options]`

Publish a draft article in a knowledge base.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound kb publish article_def456
```

---

## calendar

Google Calendar integration for managing calendar webhooks. Also available via the `cal` alias.

### Subcommands

#### `unbound calendar webhooks [options]`

List active calendar webhooks.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound calendar webhooks
```

**Example -- using the alias:**

```bash
unbound cal webhooks
```

---

#### `unbound calendar setup-webhook [options]`

Set up a new webhook to receive calendar event notifications.

| Option | Description |
|---|---|
| `--calendar-id <calendarId>` | Google Calendar ID to watch |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound calendar setup-webhook --calendar-id "primary"
```

---

#### `unbound calendar remove-webhook <id>`

Remove a calendar webhook.

**Example:**

```bash
unbound calendar remove-webhook calwh_abc123
```
