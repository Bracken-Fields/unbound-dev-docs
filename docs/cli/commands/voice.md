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

**Example — capture the call ID for further control:**

```bash
CALL_ID=$(unbound voice call \
    --from "+15551000100" \
    --to "+15559876543" \
    --json | jq -r '.id')
echo "Call started: $CALL_ID"
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

**Example — start recording:**

```bash
unbound voice record call_abc123
```

**Example — stop recording:**

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

**Example — show only call IDs and statuses:**

```bash
unbound voice list --limit 50 --json | jq -r '.[] | "\(.id)\t\(.status)"'
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

**Example — list recent CDRs:**

```bash
unbound cdr list --limit 50
```

**Example — filter by date range:**

```bash
unbound cdr list --from 2025-03-01 --to 2025-03-31 --limit 100
```

**Example — export CDRs as JSON for analysis:**

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

---

## Scripting Patterns

### Pattern 1 — Automated outbound call sequence with recording

Call a list of numbers, capture IDs, start recording on each, and log outcomes:

```bash
#!/bin/bash

FROM_NUMBER="+15551000100"
LOG_FILE="outbound-calls-$(date +%Y%m%d).log"

declare -a NUMBERS=(
    "+15559876543"
    "+15551234567"
    "+15557890123"
)

echo "Starting outbound call sequence..."

for to_number in "${NUMBERS[@]}"; do
    echo "Calling $to_number..."

    result=$(unbound voice call \
        --from "$FROM_NUMBER" \
        --to "$to_number" \
        --json)

    call_id=$(echo "$result" | jq -r '.id // empty')

    if [ -n "$call_id" ]; then
        echo "  Call started: $call_id"

        # Wait for call to connect (typically 3-5s for outbound)
        sleep 5

        # Start recording
        unbound voice record "$call_id" --json > /dev/null
        echo "  Recording started"

        # Log to file
        echo "$(date -Iseconds),$to_number,$call_id,started" >> "$LOG_FILE"
    else
        echo "  Failed to initiate call: $(echo "$result" | jq -r '.error // "unknown error"')"
        echo "$(date -Iseconds),$to_number,,failed" >> "$LOG_FILE"
    fi

    sleep 2
done

echo "Sequence complete. Log: $LOG_FILE"
```

### Pattern 2 — Daily CDR report by direction and status

Generate a summary of call volume for the previous day:

```bash
#!/bin/bash

YESTERDAY=$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d 'yesterday' +%Y-%m-%d)
TODAY=$(date +%Y-%m-%d)

echo "=== CDR Report for $YESTERDAY ==="
echo ""

# Total calls
TOTAL=$(unbound uoql \
    "SELECT COUNT(*) as count FROM cdr WHERE createdAt >= '$YESTERDAY' AND createdAt < '$TODAY'" \
    --json | jq -r '.[0].count')

# Inbound vs outbound
INBOUND=$(unbound uoql \
    "SELECT COUNT(*) as count FROM cdr WHERE direction = 'inbound' AND createdAt >= '$YESTERDAY' AND createdAt < '$TODAY'" \
    --json | jq -r '.[0].count')

OUTBOUND=$(unbound uoql \
    "SELECT COUNT(*) as count FROM cdr WHERE direction = 'outbound' AND createdAt >= '$YESTERDAY' AND createdAt < '$TODAY'" \
    --json | jq -r '.[0].count')

# Average duration (seconds)
AVG_DUR=$(unbound uoql \
    "SELECT AVG(duration) as avg FROM cdr WHERE createdAt >= '$YESTERDAY' AND createdAt < '$TODAY'" \
    --json | jq -r '.[0].avg // 0')

# Missed calls
MISSED=$(unbound uoql \
    "SELECT COUNT(*) as count FROM cdr WHERE status = 'no-answer' AND createdAt >= '$YESTERDAY' AND createdAt < '$TODAY'" \
    --json | jq -r '.[0].count')

echo "Total calls:      $TOTAL"
echo "Inbound:          $INBOUND"
echo "Outbound:         $OUTBOUND"
echo "Avg duration:     ${AVG_DUR}s"
echo "Missed calls:     $MISSED"
echo ""

# Top callers (inbound)
echo "Top 5 inbound numbers:"
unbound uoql \
    "SELECT fromNumber, COUNT(*) as calls FROM cdr
     WHERE direction = 'inbound' AND createdAt >= '$YESTERDAY' AND createdAt < '$TODAY'
     GROUP BY fromNumber ORDER BY calls DESC LIMIT 5" \
    --json | jq -r '.[] | "  \(.fromNumber)\t\(.calls) calls"'
```

### Pattern 3 — Alert on missed calls during business hours

Find missed calls from the last hour and send SMS alerts to the on-call number:

```bash
#!/bin/bash

ALERT_PHONE="+15551111111"
FROM_NUMBER="+15551000100"
ONE_HOUR_AGO=$(date -v-1H +%Y-%m-%dT%H:%M:%S 2>/dev/null || date -d '1 hour ago' +%Y-%m-%dT%H:%M:%S)

MISSED=$(unbound uoql \
    "SELECT fromNumber, toNumber, createdAt FROM cdr
     WHERE status = 'no-answer'
     AND createdAt > '$ONE_HOUR_AGO'
     ORDER BY createdAt DESC" \
    --json)

COUNT=$(echo "$MISSED" | jq 'length')

if [ "$COUNT" -gt 0 ]; then
    NUMBERS=$(echo "$MISSED" | jq -r '.[].fromNumber' | tr '\n' ', ' | sed 's/,$//')
    MESSAGE="⚠ $COUNT missed call(s) in the last hour from: $NUMBERS"
    echo "$MESSAGE"

    unbound sms send \
        --from "$FROM_NUMBER" \
        --to "$ALERT_PHONE" \
        --message "$MESSAGE"
fi
```

### Pattern 4 — Export CDRs to CSV for billing

Export all calls for the month with duration and direction for billing reconciliation:

```bash
#!/bin/bash

MONTH_START=$(date +%Y-%m-01)
MONTH_END=$(date +%Y-%m-%d)
OUTPUT="billing-cdrs-$(date +%Y-%m).csv"

echo "id,fromNumber,toNumber,direction,status,duration,createdAt" > "$OUTPUT"

OFFSET=0
LIMIT=500

while true; do
    BATCH=$(unbound uoql \
        "SELECT id, fromNumber, toNumber, direction, status, duration, createdAt
         FROM cdr
         WHERE createdAt >= '$MONTH_START' AND createdAt <= '$MONTH_END'
         ORDER BY createdAt ASC
         LIMIT $LIMIT OFFSET $OFFSET" \
        --json)

    COUNT=$(echo "$BATCH" | jq 'length')
    [ "$COUNT" -eq 0 ] && break

    echo "$BATCH" | jq -r '.[] | [.id, .fromNumber, .toNumber, .direction, .status, .duration, .createdAt] | @csv' >> "$OUTPUT"

    echo "  Exported records $OFFSET–$((OFFSET + COUNT))..."
    OFFSET=$((OFFSET + LIMIT))
    [ "$COUNT" -lt "$LIMIT" ] && break
done

echo "Export complete: $OUTPUT"
```

### Pattern 5 — Auto-transfer long-holding calls

Monitor active calls and auto-transfer any that have been on hold more than 5 minutes:

```bash
#!/bin/bash

FALLBACK_NUMBER="+15551999000"  # Overflow / backup agent number
HOLD_THRESHOLD=300              # 5 minutes in seconds

echo "Monitoring for long-hold calls..."

while true; do
    # Fetch active calls that are on hold
    HOLDING_CALLS=$(unbound voice list --limit 100 --json | \
        jq -r '.[] | select(.status == "hold") | "\(.id)|\(.holdStartedAt)"')

    NOW=$(date +%s)

    echo "$HOLDING_CALLS" | while IFS='|' read -r call_id hold_started; do
        [ -z "$call_id" ] && continue

        hold_epoch=$(date -d "$hold_started" +%s 2>/dev/null || \
                     date -j -f "%Y-%m-%dT%H:%M:%S" "$hold_started" +%s 2>/dev/null)

        hold_duration=$((NOW - hold_epoch))

        if [ "$hold_duration" -gt "$HOLD_THRESHOLD" ]; then
            echo "  Call $call_id on hold for ${hold_duration}s — transferring to overflow..."
            unbound voice transfer "$call_id" --to "$FALLBACK_NUMBER" --json > /dev/null
        fi
    done

    sleep 30
done
```

### Pattern 6 — Hang up all calls from a specific caller

Emergency action: immediately terminate all active calls from a particular number:

```bash
#!/bin/bash

TARGET_NUMBER="+15559876543"

echo "Finding active calls from $TARGET_NUMBER..."

ACTIVE_CALLS=$(unbound voice list --limit 100 --json | \
    jq -r --arg num "$TARGET_NUMBER" \
    '.[] | select(.fromNumber == $num and (.status == "active" or .status == "hold")) | .id')

if [ -z "$ACTIVE_CALLS" ]; then
    echo "No active calls from $TARGET_NUMBER."
    exit 0
fi

echo "$ACTIVE_CALLS" | while read -r call_id; do
    echo "  Hanging up: $call_id"
    unbound voice hangup "$call_id" --json > /dev/null
done

echo "Done."
```
