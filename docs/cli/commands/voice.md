---
id: voice
title: Voice & CDR
---

# Voice & CDR

The `voice` command handles outbound calls and live call control (hold, transfer, record, hangup). The `cdr` command gives you access to call detail records for reporting and analytics.

---

## voice

Initiate and manage voice calls.

### Subcommands

#### `unbound voice call [options]`

Place an outbound voice call.

| Option | Description |
|---|---|
| `--from <number>` | **(Required)** Caller ID phone number in E.164 format |
| `--to <number>` | **(Required)** Destination phone number in E.164 format |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound voice call --from "+15551000100" --to "+15559876543"
```

---

#### `unbound voice hangup <callId> [options]`

Hang up an active call.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound voice hangup call_abc123
```

---

#### `unbound voice hold <callId> [options]`

Place an active call on hold.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound voice hold call_abc123
```

---

#### `unbound voice transfer <callId> [options]`

Transfer an active call to another number.

| Option | Description |
|---|---|
| `--to <number>` | **(Required)** Transfer destination phone number in E.164 format |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound voice transfer call_abc123 --to "+15557654321"
```

---

#### `unbound voice record <callId> [options]`

Start or stop recording on an active call. By default, this starts recording. Use `--stop` to end an active recording.

| Option | Description |
|---|---|
| `--stop` | Stop an active recording instead of starting one |
| `--json` | Output raw JSON |

**Example -- start recording:**

```bash
unbound voice record call_abc123
```

**Example -- stop recording:**

```bash
unbound voice record call_abc123 --stop
```

---

#### `unbound voice list [options]`

List recent voice calls.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of calls to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound voice list --limit 30
```

---

## cdr

Query call detail records. CDRs contain metadata about completed calls including duration, status, and timestamps.

### Subcommands

#### `unbound cdr list [options]`

List call detail records. Optionally filter by date range.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of records to return |
| `--from <date>` | Start date filter (e.g., `2025-01-01`) |
| `--to <date>` | End date filter (e.g., `2025-01-31`) |
| `--json` | Output raw JSON |

**Example -- list recent CDRs:**

```bash
unbound cdr list --limit 50
```

**Example -- filter by date range:**

```bash
unbound cdr list --from 2025-03-01 --to 2025-03-31 --limit 100
```

**Example -- export CDRs as JSON for analysis:**

```bash
unbound cdr list --from 2025-01-01 --to 2025-12-31 --json > cdrs-2025.json
```

---

#### `unbound cdr get <id> [options]`

Retrieve a single call detail record by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound cdr get cdr_abc123
```
