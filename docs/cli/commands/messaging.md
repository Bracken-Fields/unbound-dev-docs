---
id: messaging
title: Messaging
---

# Messaging

The messaging commands cover three channels: SMS, email, and fax. Each command provides subcommands for sending messages, listing history, and working with templates.

---

## sms

Send and manage SMS messages.

### Subcommands

#### `unbound sms send [options]`

Send an SMS message. All three flags are required.

| Option | Description |
|---|---|
| `--from <number>` | **(Required)** Sender phone number in E.164 format |
| `--to <number>` | **(Required)** Recipient phone number in E.164 format |
| `--message <text>` | **(Required)** Message body |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound sms send --from "+15551000100" --to "+15559876543" --message "Your order has shipped!"
```

---

#### `unbound sms list [options]`

List sent and received SMS messages.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of messages to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound sms list --limit 25
```

---

#### `unbound sms templates list [options]`

List available SMS templates.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of templates to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound sms templates list --limit 10
```

---

## email

Send and manage emails.

### Subcommands

#### `unbound email send [options]`

Send an email. All four flags are required.

| Option | Description |
|---|---|
| `--from <address>` | **(Required)** Sender email address |
| `--to <address>` | **(Required)** Recipient email address |
| `--subject <text>` | **(Required)** Email subject line |
| `--body <text>` | **(Required)** Email body content |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound email send \
    --from "noreply@acme.com" \
    --to "customer@example.com" \
    --subject "Welcome to Acme" \
    --body "Thank you for signing up. We are glad to have you on board."
```

---

#### `unbound email list [options]`

List sent and received emails.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of emails to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound email list --limit 50
```

---

#### `unbound email templates list [options]`

List available email templates.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of templates to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound email templates list
```

---

## faxes

Send and manage faxes.

### Subcommands

#### `unbound faxes send [options]`

Send a fax. Provide either `--file-url` or `--media-url` to specify the document.

| Option | Description |
|---|---|
| `--to <number>` | **(Required)** Recipient fax number in E.164 format |
| `--from <number>` | **(Required)** Sender fax number in E.164 format |
| `--file-url <url>` | URL of the document to fax |
| `--media-url <url>` | URL of the media to fax |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound faxes send --from "+15551000100" --to "+15559876543" --file-url "https://example.com/invoice.pdf"
```

---

#### `unbound faxes list [options]`

List fax records.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of fax records to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound faxes list --limit 20
```

---

#### `unbound faxes status <id> [options]`

Check the delivery status of a specific fax.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound faxes status fax_abc123
```
