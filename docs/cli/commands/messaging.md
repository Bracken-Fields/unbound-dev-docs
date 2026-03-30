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

**Example — capture the message ID:**

```bash
MSG_ID=$(unbound sms send \
    --from "+15551000100" \
    --to "+15559876543" \
    --message "Appointment confirmed for tomorrow at 2pm." \
    --json | jq -r '.id')
echo "Sent message: $MSG_ID"
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

**Example — list only unread inbound messages:**

```bash
unbound uoql "SELECT id, fromNumber, body, createdAt FROM sms WHERE direction = 'inbound' AND isRead = false LIMIT 50" --json
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

**Example — list template names and IDs:**

```bash
unbound sms templates list --json | jq -r '.[] | "\(.id)\t\(.name)"'
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

**Example — send HTML email from a file:**

```bash
BODY=$(cat email-template.html)
unbound email send \
    --from "noreply@acme.com" \
    --to "vip@example.com" \
    --subject "Your Monthly Report" \
    --body "$BODY"
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
unbound faxes send \
    --from "+15551000100" \
    --to "+15559876543" \
    --file-url "https://example.com/invoice.pdf"
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

---

## Scripting Patterns

### Pattern 1 — Bulk SMS campaign from a contact list

Send personalized appointment reminders to all contacts with upcoming appointments:

```bash
#!/bin/bash

FROM_NUMBER="+15551000100"
SENT=0
FAILED=0

# Get contacts with appointments in the next 24 hours
TOMORROW=$(date -v+1d +%Y-%m-%d 2>/dev/null || date -d 'tomorrow' +%Y-%m-%d)

unbound uoql \
    "SELECT c.id, c.name, c.phone, a.appointmentTime
     FROM contacts c
     JOIN appointments a ON a.contactId = c.id
     WHERE a.appointmentDate = '$TOMORROW'
     AND c.phone IS NOT NULL" \
    --json | jq -r '.[] | "\(.name)|\(.phone)|\(.appointmentTime)"' | \
while IFS='|' read -r name phone appt_time; do
    first_name=$(echo "$name" | awk '{print $1}')
    message="Hi $first_name, reminder: your appointment is tomorrow at $appt_time. Reply CONFIRM or CANCEL."

    result=$(unbound sms send \
        --from "$FROM_NUMBER" \
        --to "$phone" \
        --message "$message" \
        --json 2>&1)

    if echo "$result" | jq -e '.id' > /dev/null 2>&1; then
        echo "✓ Sent to $name ($phone)"
        ((SENT++))
    else
        echo "✗ Failed for $name ($phone)"
        ((FAILED++))
    fi

    sleep 0.3  # ~3 SMS/sec
done

echo ""
echo "Campaign complete. Sent: $SENT | Failed: $FAILED"
```

### Pattern 2 — Send a daily digest email to managers

Pull key metrics from UOQL and email a report:

```bash
#!/bin/bash

MANAGER_EMAIL="manager@acme.com"
FROM_EMAIL="reports@acme.com"
TODAY=$(date +%Y-%m-%d)
YESTERDAY=$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d 'yesterday' +%Y-%m-%d)

# Gather metrics
TOTAL_CALLS=$(unbound uoql \
    "SELECT COUNT(*) as c FROM cdr WHERE createdAt >= '$YESTERDAY' AND createdAt < '$TODAY'" \
    --json | jq -r '.[0].c')

OPEN_TASKS=$(unbound uoql \
    "SELECT COUNT(*) as c FROM tasks WHERE status = 'open'" \
    --json | jq -r '.[0].c')

SMS_SENT=$(unbound uoql \
    "SELECT COUNT(*) as c FROM sms WHERE direction = 'outbound' AND createdAt >= '$YESTERDAY' AND createdAt < '$TODAY'" \
    --json | jq -r '.[0].c')

NEW_CONTACTS=$(unbound uoql \
    "SELECT COUNT(*) as c FROM contacts WHERE createdAt >= '$YESTERDAY' AND createdAt < '$TODAY'" \
    --json | jq -r '.[0].c')

BODY="Daily Report — $YESTERDAY

Calls:          $TOTAL_CALLS
SMS sent:       $SMS_SENT
Open tasks:     $OPEN_TASKS
New contacts:   $NEW_CONTACTS

Generated: $(date)"

unbound email send \
    --from "$FROM_EMAIL" \
    --to "$MANAGER_EMAIL" \
    --subject "Daily Operations Report — $YESTERDAY" \
    --body "$BODY"

echo "Report sent to $MANAGER_EMAIL"
```

### Pattern 3 — Two-way SMS survey

Send a survey question and process replies:

```bash
#!/bin/bash

FROM_NUMBER="+15551000100"
SURVEY_QUESTION="On a scale of 1-10, how satisfied are you with your recent support experience? Reply with a number."

# Get contacts who had a call close in the last 2 hours
TWO_HOURS_AGO=$(date -v-2H +%Y-%m-%dT%H:%M:%S 2>/dev/null || date -d '2 hours ago' +%Y-%m-%dT%H:%M:%S)

unbound uoql \
    "SELECT DISTINCT c.id, c.name, c.phone, cdr.fromNumber
     FROM cdr
     JOIN contacts c ON c.phone = cdr.fromNumber
     WHERE cdr.createdAt > '$TWO_HOURS_AGO'
     AND cdr.status = 'completed'
     AND c.phone IS NOT NULL
     LIMIT 20" \
    --json | jq -r '.[] | "\(.name)|\(.phone)"' | \
while IFS='|' read -r name phone; do
    echo "Sending survey to $name ($phone)..."
    unbound sms send \
        --from "$FROM_NUMBER" \
        --to "$phone" \
        --message "$SURVEY_QUESTION" \
        --json > /dev/null
    sleep 1
done

echo "Survey messages sent. Monitor inbound SMS for replies."
```

### Pattern 4 — Fax blast with status polling

Send faxes to a list and poll until all are delivered or failed:

```bash
#!/bin/bash

FROM_FAX="+15551000100"
LOG_FILE="fax-log-$(date +%Y%m%d).txt"

declare -A FAX_JOBS  # job_id → recipient

# Send list of faxes
declare -a RECIPIENTS=(
    "+15551111111"
    "+15552222222"
    "+15553333333"
)

DOCUMENT_URL="https://example.com/documents/notice.pdf"

echo "Sending faxes..."
for to_fax in "${RECIPIENTS[@]}"; do
    result=$(unbound faxes send \
        --from "$FROM_FAX" \
        --to "$to_fax" \
        --file-url "$DOCUMENT_URL" \
        --json)
    fax_id=$(echo "$result" | jq -r '.id // empty')

    if [ -n "$fax_id" ]; then
        FAX_JOBS[$fax_id]="$to_fax"
        echo "  Queued: $fax_id → $to_fax"
    else
        echo "  Failed to queue fax to $to_fax"
    fi
    sleep 1
done

# Poll until all settled
echo ""
echo "Polling delivery status..."
MAX_POLLS=30
POLL=0

while [ "${#FAX_JOBS[@]}" -gt 0 ] && [ "$POLL" -lt "$MAX_POLLS" ]; do
    sleep 30
    ((POLL++))

    for fax_id in "${!FAX_JOBS[@]}"; do
        status=$(unbound faxes status "$fax_id" --json | jq -r '.status')
        recipient="${FAX_JOBS[$fax_id]}"

        case "$status" in
            delivered)
                echo "  ✓ Delivered: $recipient ($fax_id)"
                echo "$(date -Iseconds),$fax_id,$recipient,delivered" >> "$LOG_FILE"
                unset 'FAX_JOBS[$fax_id]'
                ;;
            failed|error)
                echo "  ✗ Failed: $recipient ($fax_id)"
                echo "$(date -Iseconds),$fax_id,$recipient,failed" >> "$LOG_FILE"
                unset 'FAX_JOBS[$fax_id]'
                ;;
            *)
                echo "  ⟳ Pending: $recipient ($fax_id) — $status"
                ;;
        esac
    done
done

echo ""
echo "Fax blast complete. Results: $LOG_FILE"
```

### Pattern 5 — Unsubscribe / opt-out management

Monitor inbound SMS for STOP replies and log them to a suppression list:

```bash
#!/bin/bash

SUPPRESSION_FILE="suppression-list.txt"
LAST_CHECK_FILE=".last-sms-check"

# Load last check timestamp
if [ -f "$LAST_CHECK_FILE" ]; then
    SINCE=$(cat "$LAST_CHECK_FILE")
else
    SINCE=$(date -v-1H +%Y-%m-%dT%H:%M:%S 2>/dev/null || date -d '1 hour ago' +%Y-%m-%dT%H:%M:%S)
fi

echo "Checking for opt-out replies since $SINCE..."

# Fetch inbound SMS since last check
unbound uoql \
    "SELECT id, fromNumber, body, createdAt FROM sms
     WHERE direction = 'inbound'
     AND createdAt > '$SINCE'
     ORDER BY createdAt ASC" \
    --json | jq -r '.[] | "\(.fromNumber)|\(.body)"' | \
while IFS='|' read -r from_number body; do
    body_upper=$(echo "$body" | tr '[:lower:]' '[:upper:]' | xargs)

    if [[ "$body_upper" == "STOP" || "$body_upper" == "UNSUBSCRIBE" || "$body_upper" == "OPTOUT" ]]; then
        if ! grep -qF "$from_number" "$SUPPRESSION_FILE" 2>/dev/null; then
            echo "$from_number" >> "$SUPPRESSION_FILE"
            echo "  Opt-out recorded: $from_number"
        fi
    fi
done

# Update last check timestamp
date +%Y-%m-%dT%H:%M:%S > "$LAST_CHECK_FILE"
echo "Done. Suppression list: $(wc -l < "$SUPPRESSION_FILE") entries"
```

### Pattern 6 — Multi-channel outreach (SMS → email fallback)

Try SMS first; fall back to email if no phone number is on file:

```bash
#!/bin/bash

FROM_SMS="+15551000100"
FROM_EMAIL="outreach@acme.com"
MESSAGE_TEXT="Important: Your account requires attention. Please log in to review."

# Get contacts to notify
unbound uoql \
    "SELECT id, name, email, phone FROM contacts WHERE needsAttention = true LIMIT 100" \
    --json | jq -r '.[] | "\(.id)|\(.name)|\(.email // "")|\(.phone // "")"' | \
while IFS='|' read -r id name email phone; do
    if [ -n "$phone" ]; then
        echo "SMS → $name ($phone)"
        unbound sms send \
            --from "$FROM_SMS" \
            --to "$phone" \
            --message "$MESSAGE_TEXT" \
            --json > /dev/null
    elif [ -n "$email" ]; then
        echo "Email → $name ($email)"
        unbound email send \
            --from "$FROM_EMAIL" \
            --to "$email" \
            --subject "Action Required: Your Account" \
            --body "Hi $name,\n\n$MESSAGE_TEXT\n\nThank you." \
            --json > /dev/null
    else
        echo "⚠ No contact method for: $name ($id)"
    fi

    sleep 0.3
done

echo "Multi-channel outreach complete."
```
