---
id: video
title: Video
---

# Video

The `video` command lets you manage video rooms, control participants, and initiate outbound calls into video sessions.

---

## video

Manage video rooms and participants.

### Subcommands

#### `unbound video list [options]`

List video rooms.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of rooms to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound video list --limit 10
```

**Example — get room IDs only:**

```bash
unbound video list --json | jq -r '.[].id'
```

---

#### `unbound video join <roomId> [options]`

Join a video room.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound video join room_abc123
```

---

#### `unbound video leave <roomId>`

Leave a video room.

**Example:**

```bash
unbound video leave room_abc123
```

---

#### `unbound video add-participant <roomId> [options]`

Add a participant to a video room.

| Option | Description |
|---|---|
| `--user-id <userId>` | **(Required)** ID of the user to add |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound video add-participant room_abc123 --user-id usr_def456
```

---

#### `unbound video remove-participant <roomId> [options]`

Remove a participant from a video room.

| Option | Description |
|---|---|
| `--user-id <userId>` | **(Required)** ID of the user to remove |

**Example:**

```bash
unbound video remove-participant room_abc123 --user-id usr_def456
```

---

#### `unbound video outbound-call <roomId> [options]`

Place an outbound phone call and connect the recipient to a video room.

| Option | Description |
|---|---|
| `--to <number>` | **(Required)** Phone number to dial in E.164 format |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound video outbound-call room_abc123 --to "+15559876543"
```

---

## Scripting Patterns

### Pattern 1 — Spin up a room, add participants, and dial a customer

Complete flow to create a multi-party video session and dial in a customer via phone:

```bash
#!/bin/bash

CUSTOMER_PHONE="+15559876543"
AGENT_USER_ID="usr_agent001"
SUPERVISOR_USER_ID="usr_supervisor002"

# Create the room (via API — CLI uses existing rooms)
ROOM=$(curl -s -X POST "https://${UNBOUND_NAMESPACE}.api.unbound.cx/video/rooms" \
    -H "Authorization: Bearer $UNBOUND_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name": "Customer Session"}')
ROOM_ID=$(echo "$ROOM" | jq -r '.id')
echo "Room created: $ROOM_ID"

# Add agent and supervisor
unbound video add-participant "$ROOM_ID" --user-id "$AGENT_USER_ID" --json
unbound video add-participant "$ROOM_ID" --user-id "$SUPERVISOR_USER_ID" --json

# Dial the customer into the room
unbound video outbound-call "$ROOM_ID" --to "$CUSTOMER_PHONE" --json
echo "Dialing $CUSTOMER_PHONE into room $ROOM_ID"
```

### Pattern 2 — List all rooms and their participant count

Audit active video rooms with participant info:

```bash
#!/bin/bash

unbound video list --limit 100 --json | jq -r '
    .[] |
    "\(.id)\t\(.name // "unnamed")\t\(.participantCount // 0) participants"
' | column -t -s $'\t'
```

### Pattern 3 — Cleanup stale rooms

Find and leave any rooms you're currently in (useful for session cleanup scripts):

```bash
#!/bin/bash

MY_USER_ID="usr_abc123"

# Get all rooms where I'm a participant
MY_ROOMS=$(unbound video list --limit 100 --json | jq -r \
    --arg uid "$MY_USER_ID" \
    '.[] | select(.participants[]? == $uid) | .id')

if [ -z "$MY_ROOMS" ]; then
    echo "No active rooms to clean up."
    exit 0
fi

echo "Leaving rooms:"
echo "$MY_ROOMS" | while read -r room_id; do
    echo "  Leaving $room_id..."
    unbound video leave "$room_id"
done
echo "Done."
```

### Pattern 4 — Scheduled video team standup

Set up a daily standup that dials all team members into a shared room:

```bash
#!/bin/bash
# Run daily at 9:00 AM via cron: 0 9 * * 1-5 /path/to/standup.sh

ROOM_ID="room_standup_daily"

# Team phone numbers
declare -a TEAM_PHONES=(
    "+15551000001"
    "+15551000002"
    "+15551000003"
)

echo "Starting daily standup in room $ROOM_ID..."

for phone in "${TEAM_PHONES[@]}"; do
    echo "  Dialing $phone..."
    unbound video outbound-call "$ROOM_ID" --to "$phone" --json
    sleep 2  # Stagger dials to avoid overwhelming the room
done

echo "All team members dialed. Standup started."
```

### Pattern 5 — Monitor room and alert when empty

Poll a room periodically and notify when all participants have left:

```bash
#!/bin/bash

ROOM_ID="room_abc123"
ALERT_EMAIL="admin@example.com"
POLL_INTERVAL=30  # seconds
MAX_POLLS=60      # 30 minutes max

echo "Monitoring room $ROOM_ID for empty state..."

for i in $(seq 1 $MAX_POLLS); do
    PARTICIPANT_COUNT=$(unbound video list --json | \
        jq --arg rid "$ROOM_ID" '.[] | select(.id == $rid) | .participantCount // 0')

    echo "[$(date +%H:%M:%S)] Participants: $PARTICIPANT_COUNT"

    if [ "$PARTICIPANT_COUNT" -eq 0 ]; then
        echo "Room is empty. Sending alert..."
        unbound email send \
            --from "noreply@acme.com" \
            --to "$ALERT_EMAIL" \
            --subject "Video Room Empty: $ROOM_ID" \
            --body "Room $ROOM_ID is now empty. Session ended at $(date)."
        exit 0
    fi

    sleep $POLL_INTERVAL
done

echo "Max polling time reached. Room may still have participants."
```

### Pattern 6 — Post-session report

After a video session ends, generate a summary of who attended and for how long:

```bash
#!/bin/bash

ROOM_ID="room_abc123"

# Fetch room session data
SESSION=$(curl -s \
    "https://${UNBOUND_NAMESPACE}.api.unbound.cx/video/rooms/${ROOM_ID}" \
    -H "Authorization: Bearer $UNBOUND_TOKEN")

echo "=== Video Session Report ==="
echo "Room:     $(echo "$SESSION" | jq -r '.name')"
echo "Created:  $(echo "$SESSION" | jq -r '.createdAt')"
echo "Status:   $(echo "$SESSION" | jq -r '.status')"
echo ""
echo "Participants:"
echo "$SESSION" | jq -r '.participants[] | "  - \(.name // .userId) (\(.joinedAt // "unknown"))"'

# Summarize via AI
SUMMARY_INPUT="Video room: $(echo "$SESSION" | jq -c '.')"
unbound ai chat \
    "Write a one-sentence summary of this video session: $SUMMARY_INPUT" \
    --json | jq -r '.response'
```
