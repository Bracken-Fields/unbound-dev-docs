---
id: cli-quickstart
title: CLI Quickstart
---

# CLI Quickstart

Get up and running with the Unbound CLI in 5 minutes. By the end of this guide you will have logged in, explored your namespace, sent an SMS, queried call data, and managed contacts -- all from the terminal.

---

## 1. Install

Install the CLI globally via npm:

```bash
npm install -g @unboundcx/cli
```

Verify the installation:

```bash
unbound --version
```

---

## 2. Login

Authenticate with your Unbound namespace:

```bash
unbound login
```

The CLI walks you through an interactive prompt:

```
? Namespace: your-namespace
? Username: your-username
? Password: ********

Authenticated successfully.
Session stored at ~/.unbound/credentials.json
```

Your session is cached locally so you do not need to log in again until the token expires.

---

## 3. Explore Your Namespace

Get a feel for what is in your account:

```bash
# List all object types available in your namespace
unbound objects list

# List provisioned phone numbers
unbound phones list

# List call queues
unbound queues list
```

Each command prints a formatted table by default. Add `--json` to any command for machine-readable output:

```bash
unbound phones list --json
```

---

## 4. Send Your First SMS

Send an outbound SMS from one of your provisioned numbers:

```bash
unbound sms send \
    --from "+1234567890" \
    --to "+0987654321" \
    --message "Hello from the Unbound CLI"
```

You should see a confirmation with the message ID and delivery status:

```
Message sent.
ID:     msg_abc123
Status: queued
```

---

## 5. Query Data with UOQL

UOQL is a SQL-style query language built into the platform. The CLI gives you direct access.

Pull recent call records:

```bash
unbound uoql "SELECT id, direction, duration FROM cdr LIMIT 10"
```

Run an aggregate query and pipe the JSON output to `jq` for further processing:

```bash
unbound uoql "SELECT direction, COUNT(*) as total FROM cdr GROUP BY direction" --json | jq
```

Example output:

```json
[
    { "direction": "inbound", "total": 842 },
    { "direction": "outbound", "total": 315 }
]
```

See the [Analyze Call Data with UOQL](/guides/query-with-uoql) guide for advanced analytics queries, pagination, and window functions.

---

## 6. Manage Contacts

Create a new contact:

```bash
unbound contacts create \
    --name "Jane Smith" \
    --email "jane@example.com" \
    --phone "+1234567890"
```

Search for contacts by name:

```bash
unbound contacts list --search "Jane"
```

```
ID              NAME          EMAIL               PHONE
ppl_xyz789      Jane Smith    jane@example.com    +1234567890
```

---

## 7. Check Call Records

List recent call detail records:

```bash
unbound cdr list --limit 5
```

```
ID            DIRECTION   DURATION   STATUS      CREATED
cdr_a1b2c3    inbound     245s       completed   2026-03-25 09:14:02
cdr_d4e5f6    outbound    32s        completed   2026-03-25 09:11:48
cdr_g7h8i9    inbound     0s         missed      2026-03-25 09:08:30
cdr_j0k1l2    outbound    187s       completed   2026-03-25 09:02:15
cdr_m3n4o5    inbound     91s        completed   2026-03-25 08:55:44
```

Combine with UOQL for deeper analysis:

```bash
# Average call duration by direction
unbound uoql "SELECT direction, AVG(duration) as avg_duration FROM cdr GROUP BY direction"

# Longest calls today
unbound uoql "SELECT id, direction, duration FROM cdr ORDER BY createdAt DESC LIMIT 20" --json | jq 'sort_by(-.duration) | .[0:5]'
```

---

## 8. What's Next

You have the basics down. Here is where to go from here:

- [Analyze Call Data with UOQL](/guides/query-with-uoql) -- build agent leaderboards, compute averages, paginate through large datasets
- [Send Your First SMS](/guides/send-sms) -- SDK-based SMS guide with full code examples
- [Make an Outbound Call](/guides/make-call) -- programmatic call control
- [Build an Automation Workflow](/guides/build-workflow) -- wire up AI-powered routing
- [UOQL API Reference](/api-reference/uoql) -- full SQL syntax and function reference
- [Getting Started with the SDK](/getting-started) -- initialize the JavaScript SDK
