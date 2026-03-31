---
id: tasks
title: Task Router
---

# Task Router

The Task Router CLI commands let you manage the full contact center routing stack: tasks, queues, skills, and agents (workers). Use these commands to configure how work is distributed to your team.

---

## tasks

Manage tasks in the task routing system.

### Subcommands

#### `unbound tasks list [options]`

List tasks, optionally filtered by status.

| Option | Description |
|---|---|
| `--status <status>` | Filter by task status (e.g., `open`, `assigned`, `completed`) |
| `--limit <number>` | Maximum number of tasks to return |
| `--json` | Output raw JSON |

**Example -- list all tasks:**

```bash
unbound tasks list --limit 50
```

**Example -- list only open tasks:**

```bash
unbound tasks list --status open
```

---

#### `unbound tasks get <id> [options]`

Retrieve a single task by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound tasks get task_abc123
```

---

## queues

Manage task queues. Queues hold tasks until a matching agent becomes available.

### Subcommands

#### `unbound queues list [options]`

List all queues.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of queues to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound queues list
```

---

#### `unbound queues get <id> [options]`

Retrieve a single queue by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound queues get queue_abc123
```

---

#### `unbound queues create <name> [options]`

Create a new queue.

| Option | Description |
|---|---|
| `--type <type>` | Queue type |
| `--caller-id <number>` | Default caller ID for outbound calls from this queue |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound queues create "Sales Queue" --type voice --caller-id "+15551000100"
```

---

## skills

Manage skill definitions. Skills are used to match tasks to agents with the right capabilities.

### Subcommands

#### `unbound skills list [options]`

List all skill definitions.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of skills to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound skills list
```

---

#### `unbound skills create <name> [options]`

Create a new skill definition.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound skills create "Spanish Speaking"
```

---

## agents

Manage agents (workers) and their skill assignments.

### Subcommands

#### `unbound agents list [options]`

List all agents.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of agents to return |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound agents list --limit 25
```

---

#### `unbound agents get <id> [options]`

Retrieve a single agent by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound agents get agent_abc123
```

---

#### `unbound agents worker create [options]`

Create a new worker record for an agent.

| Option | Description |
|---|---|
| `--user-id <userId>` | User ID to associate with the worker |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound agents worker create --user-id usr_def456
```

---

#### `unbound agents worker get [options]`

Get worker details for an agent.

| Option | Description |
|---|---|
| `--user-id <userId>` | User ID of the worker to retrieve |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound agents worker get --user-id usr_def456
```

---

#### `unbound agents skills list <workerId> [options]`

List skills assigned to a specific worker.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound agents skills list worker_abc123
```

---

#### `unbound agents skills add <workerId> <skillId> [options]`

Assign a skill to a worker.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound agents skills add worker_abc123 skill_spanish
```

---

#### `unbound agents skills remove <workerId> <skillId> [options]`

Remove a skill from a worker.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound agents skills remove worker_abc123 skill_spanish
```

---

## Scripting Patterns

### Pattern 1 — Queue health monitor with Slack alert

Poll task queue depth every minute and send a Slack alert when wait time exceeds threshold:

```bash
#!/bin/bash

THRESHOLD=10      # Alert when more than 10 tasks are waiting
SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
CHECK_INTERVAL=60 # seconds

while true; do
    # Count open tasks across all queues
    OPEN_TASKS=$(unbound tasks list --status open --json | jq 'length')

    echo "$(date '+%H:%M:%S') — Open tasks: $OPEN_TASKS"

    if [ "$OPEN_TASKS" -gt "$THRESHOLD" ]; then
        # Get queue breakdown
        BREAKDOWN=$(unbound tasks list --status open --json | \
            jq -r 'group_by(.queueName) | .[] | "\(.[0].queueName): \(length) waiting"' | \
            head -5 | tr '\n' '\n')

        curl -s -X POST "$SLACK_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{
                \"text\": \"⚠️ Queue Alert: $OPEN_TASKS tasks waiting\\n\`\`\`$BREAKDOWN\`\`\`\"
            }"

        echo "Alert sent: $OPEN_TASKS open tasks"
    fi

    sleep "$CHECK_INTERVAL"
done
```

---

### Pattern 2 — Provision a new agent (full onboarding)

Create a worker record, assign required skills, and log them into their queues:

```bash
#!/bin/bash

USER_ID="usr_newagent123"
AGENT_NAME="Jane Smith"

echo "Provisioning agent: $AGENT_NAME ($USER_ID)"

# Step 1: Create the worker record
WORKER=$(unbound agents worker create \
    --user-id "$USER_ID" \
    --json)
WORKER_ID=$(echo "$WORKER" | jq -r '.workerId')
echo "  Worker created: $WORKER_ID"

# Step 2: Assign skills
for SKILL_ID in skill_english skill_billing skill_tier1; do
    echo "  Assigning skill: $SKILL_ID"
    unbound agents skills add "$WORKER_ID" "$SKILL_ID"
done

# Step 3: Log them into their queues
for QUEUE_ID in queue_billing queue_support; do
    echo "  Logging into queue: $QUEUE_ID"
    # Use SDK or API to queue-login — CLI queue login via agent worker
    curl -s -X PUT \
        "https://${UNBOUND_NAMESPACE}.api.unbound.cx/taskRouter/worker/queueLogin" \
        -H "Authorization: Bearer $UNBOUND_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"userId\": \"$USER_ID\", \"queueId\": \"$QUEUE_ID\"}" > /dev/null
    echo "    Logged into $QUEUE_ID"
done

echo "Agent $AGENT_NAME provisioned successfully."
echo "Worker ID: $WORKER_ID"
```

---

### Pattern 3 — Daily task completion report

Generate a CSV of completed tasks for the day with agent and queue breakdown:

```bash
#!/bin/bash

REPORT_DATE=$(date '+%Y-%m-%d')
OUTPUT="task-report-${REPORT_DATE}.csv"

echo "Generating task report for $REPORT_DATE..."

# Fetch completed tasks
TASKS=$(unbound tasks list --status completed --json)

# Write CSV header
echo "taskId,agentName,queueName,completedAt,duration,type" > "$OUTPUT"

# Parse tasks into CSV rows
echo "$TASKS" | jq -r '.[] | [
    .id,
    (.assignedAgentName // "unassigned"),
    (.queueName // "unknown"),
    (.completedAt // ""),
    (.durationSeconds // 0),
    .type
] | @csv' >> "$OUTPUT"

TOTAL=$(echo "$TASKS" | jq 'length')
echo "Report written: $OUTPUT ($TOTAL tasks)"

# Print a quick summary by queue
echo ""
echo "Tasks by queue:"
echo "$TASKS" | jq -r 'group_by(.queueName) | .[] |
    "  \(.[0].queueName // "Unknown"): \(length) completed"'
```

---

### Pattern 4 — Skill audit: find agents missing required skills

Check all agents in a queue and flag any missing a required skill (e.g., compliance training):

```bash
#!/bin/bash

REQUIRED_SKILL_ID="skill_compliance_2026"
REQUIRED_SKILL_NAME="Compliance Training 2026"

echo "Auditing agents for missing skill: $REQUIRED_SKILL_NAME"
echo ""

# Get all agents
AGENTS=$(unbound agents list --json)

MISSING_COUNT=0

echo "$AGENTS" | jq -c '.[]' | while read -r agent; do
    AGENT_ID=$(echo "$agent" | jq -r '.id')
    AGENT_NAME=$(echo "$agent" | jq -r '.name // .id')
    WORKER_ID=$(echo "$agent" | jq -r '.workerId // empty')

    if [ -z "$WORKER_ID" ]; then
        continue
    fi

    # Check agent's skills
    SKILLS=$(unbound agents skills list "$WORKER_ID" --json 2>/dev/null)
    HAS_SKILL=$(echo "$SKILLS" | jq --arg sid "$REQUIRED_SKILL_ID" \
        '[.[] | select(.id == $sid)] | length')

    if [ "$HAS_SKILL" -eq 0 ]; then
        echo "  ❌ MISSING — $AGENT_NAME (workerId: $WORKER_ID)"
        MISSING_COUNT=$((MISSING_COUNT + 1))
    else
        echo "  ✅ OK      — $AGENT_NAME"
    fi
done

echo ""
echo "Audit complete."
```

---

### Pattern 5 — Bulk queue setup from config file

Read a YAML/JSON config and create all queues and skills for a new tenant deployment:

```bash
#!/bin/bash

# queues.json format:
# [{ "name": "Sales", "type": "voice", "callerId": "+15551000100" }, ...]

CONFIG_FILE="queues.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: $CONFIG_FILE not found"
    exit 1
fi

echo "Creating queues from $CONFIG_FILE..."

QUEUE_COUNT=$(jq 'length' "$CONFIG_FILE")
echo "Found $QUEUE_COUNT queues to create"

for i in $(seq 0 $((QUEUE_COUNT - 1))); do
    QUEUE=$(jq -c ".[$i]" "$CONFIG_FILE")
    NAME=$(echo "$QUEUE" | jq -r '.name')
    TYPE=$(echo "$QUEUE" | jq -r '.type // "voice"')
    CALLER_ID=$(echo "$QUEUE" | jq -r '.callerId // empty')

    echo "  Creating queue: $NAME (type: $TYPE)"

    CMD="unbound queues create \"$NAME\" --type \"$TYPE\" --json"
    if [ -n "$CALLER_ID" ]; then
        CMD="$CMD --caller-id \"$CALLER_ID\""
    fi

    RESULT=$(eval "$CMD")
    QUEUE_ID=$(echo "$RESULT" | jq -r '.id')
    echo "    → Created: $QUEUE_ID"

    sleep 0.5 # avoid rate-limit bursts
done

echo ""
echo "All queues created. Run 'unbound queues list' to verify."
```

---

### Pattern 6 — Real-time agent status dashboard (terminal)

Print a live-refreshing terminal dashboard showing agent availability:

```bash
#!/bin/bash

REFRESH=10  # seconds between refreshes

while true; do
    clear
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Agent Status Dashboard"
    echo "  $(date '+%a %b %d %H:%M:%S')"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    AGENTS=$(unbound agents list --json 2>/dev/null)

    if [ -z "$AGENTS" ] || [ "$AGENTS" = "null" ]; then
        echo "  No data available"
        sleep "$REFRESH"
        continue
    fi

    # Count by status
    AVAILABLE=$(echo "$AGENTS" | jq '[.[] | select(.status == "available")] | length')
    BUSY=$(echo "$AGENTS" | jq '[.[] | select(.status == "busy")] | length')
    OFFLINE=$(echo "$AGENTS" | jq '[.[] | select(.status == "offline")] | length')
    TOTAL=$(echo "$AGENTS" | jq 'length')

    echo "  🟢 Available:  $AVAILABLE"
    echo "  🔴 Busy:       $BUSY"
    echo "  ⚫ Offline:    $OFFLINE"
    echo "  ─────────────────────"
    echo "  Total agents:  $TOTAL"
    echo ""

    # Open task queue depth
    OPEN=$(unbound tasks list --status open --json 2>/dev/null | jq 'length // 0')
    echo "  📋 Waiting tasks: $OPEN"
    echo ""

    # Per-queue breakdown (top 5)
    echo "  Queue Breakdown:"
    unbound queues list --json 2>/dev/null | jq -r \
        '.[] | "  \(.name): \(.tasksWaiting // 0) waiting"' | head -5

    echo ""
    echo "  Refreshing in ${REFRESH}s... (Ctrl-C to exit)"
    sleep "$REFRESH"
done
```
