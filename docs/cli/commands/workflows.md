---
id: workflows
title: Workflows
---

# Workflows

The `workflows` command lets you build, inspect, import, and export automation workflows. The `modules` command lists the available building blocks that workflows can use.

---

## workflows

Manage automation workflows.

### Subcommands

#### `unbound workflows list [options]`

List all workflows in your namespace.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound workflows list
```

---

#### `unbound workflows get <id> [options]`

Retrieve a workflow by ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound workflows get wf_abc123
```

---

#### `unbound workflows inspect <id> [options]`

Inspect a workflow's full configuration, including its steps, conditions, and module usage.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound workflows inspect wf_abc123
```

**Example -- output as JSON for programmatic analysis:**

```bash
unbound workflows inspect wf_abc123 --json | jq '.steps'
```

---

#### `unbound workflows create <name> [options]`

Create a new workflow.

| Option | Description |
|---|---|
| `--type <type>` | Workflow type |
| `--description <text>` | Human-readable description of the workflow |
| `--json` | Output raw JSON |

**Example:**

```bash
unbound workflows create "Inbound Call Handler" --type voice --description "Routes inbound calls to the sales queue"
```

---

#### `unbound workflows build <file> [options]`

Build and deploy a workflow from a local definition file.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound workflows build workflow-definition.json
```

---

#### `unbound workflows export <id> [options]`

Export a workflow definition to a file. Useful for version control or migrating workflows between namespaces.

| Option | Description |
|---|---|
| `--output <path>` | File path to write the exported definition |
| `--json` | Output raw JSON |

**Example -- export to a file:**

```bash
unbound workflows export wf_abc123 --output my-workflow.json
```

**Example -- export as JSON to stdout:**

```bash
unbound workflows export wf_abc123 --json
```

---

## modules

List available workflow modules. Modules are the building blocks (steps) that you assemble into workflows.

### Subcommands

#### `unbound modules list [options]`

List all available workflow modules.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound modules list
```

**Example -- get module details as JSON:**

```bash
unbound modules list --json | jq '.[].name'
```

---

## Scripting Patterns

### Pattern 1 — List all workflows and their statuses

Get an overview of workflows with their current state:

```bash
#!/bin/bash

echo "=== Workflow Inventory ==="

unbound workflows list --json | jq -r \
    '.[] | "\(.id)\t\(.name)\t\(.status // "unknown")\t\(.type // "—")"' | \
    column -t -s $'\t'
```

### Pattern 2 — Inspect a workflow and list its module types

Quickly audit what modules a workflow uses:

```bash
#!/bin/bash

WORKFLOW_ID="wf_abc123"

echo "Workflow: $WORKFLOW_ID"
echo ""

unbound workflows inspect "$WORKFLOW_ID" --json | jq -r '
    "Name:    \(.name)",
    "Type:    \(.type // "—")",
    "Steps:   \(.steps | length)",
    "",
    "Modules used:",
    (.steps[] | "  - \(.module) (\(.name // "unnamed"))")
'
```

### Pattern 3 — Export all workflows for backup

Export every workflow definition to individual JSON files:

```bash
#!/bin/bash

BACKUP_DIR="workflow-backups-$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

unbound workflows list --json | jq -r '.[] | "\(.id)|\(.name)"' | \
while IFS='|' read -r wf_id wf_name; do
    safe_name=$(echo "$wf_name" | tr ' /' '_-' | tr -cd '[:alnum:]_-')
    output="${BACKUP_DIR}/${safe_name}-${wf_id}.json"

    echo "Exporting: $wf_name → $output"
    unbound workflows export "$wf_id" --output "$output" --json > /dev/null
done

echo ""
echo "All workflows backed up to: $BACKUP_DIR/"
echo "Files: $(ls "$BACKUP_DIR" | wc -l)"
```

### Pattern 4 — Deploy a workflow from source control

Build and deploy a workflow from a version-controlled definition file, then verify it:

```bash
#!/bin/bash

DEFINITION_FILE="$1"
if [ -z "$DEFINITION_FILE" ]; then
    echo "Usage: $0 <workflow-definition.json>"
    exit 1
fi

if [ ! -f "$DEFINITION_FILE" ]; then
    echo "Error: File not found: $DEFINITION_FILE"
    exit 1
fi

echo "Deploying workflow from: $DEFINITION_FILE"

RESULT=$(unbound workflows build "$DEFINITION_FILE" --json)
WF_ID=$(echo "$RESULT" | jq -r '.id // empty')

if [ -z "$WF_ID" ]; then
    echo "Deployment failed:"
    echo "$RESULT" | jq -r '.error // .message // "Unknown error"'
    exit 1
fi

echo "Deployed workflow: $WF_ID"

# Verify by inspecting
unbound workflows inspect "$WF_ID" --json | jq '{id: .id, name: .name, status: .status, steps: (.steps | length)}'
```

### Pattern 5 — Find workflows using a specific module type

Search all workflows for use of a particular module (useful before deprecating a module):

```bash
#!/bin/bash

TARGET_MODULE="${1:-sms}"
echo "Searching for workflows using module: $TARGET_MODULE"

MATCHES=0

unbound workflows list --json | jq -r '.[].id' | while read -r wf_id; do
    USES_MODULE=$(unbound workflows inspect "$wf_id" --json | \
        jq -r --arg m "$TARGET_MODULE" \
        '.steps[]? | select(.module == $m) | .module' | head -1)

    if [ -n "$USES_MODULE" ]; then
        WF_NAME=$(unbound workflows inspect "$wf_id" --json | jq -r '.name')
        echo "  ✓ $WF_NAME ($wf_id)"
        ((MATCHES++))
    fi
done

echo ""
echo "Found $MATCHES workflow(s) using '$TARGET_MODULE'"
```

### Pattern 6 — CI/CD workflow deployment pipeline

Full pipeline: export current, build new, verify, and alert on failure:

```bash
#!/bin/bash

set -e

DEFINITION_DIR="./workflows"
SLACK_WEBHOOK="${SLACK_WEBHOOK_URL}"  # Optional: set for Slack alerts
ENVIRONMENT="${DEPLOY_ENV:-staging}"

send_alert() {
    local message="$1"
    echo "ALERT: $message"
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -s -X POST "$SLACK_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{\"text\": \"[Unbound Workflows / $ENVIRONMENT] $message\"}" > /dev/null
    fi
}

echo "=== Workflow Deployment Pipeline ($ENVIRONMENT) ==="

# Step 1: Backup current state
echo "Step 1: Backing up current workflows..."
BACKUP_DIR="backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
unbound workflows list --json | jq -r '.[].id' | while read -r wf_id; do
    unbound workflows export "$wf_id" --output "${BACKUP_DIR}/${wf_id}.json" > /dev/null 2>&1 || true
done
echo "  Backed up to: $BACKUP_DIR"

# Step 2: Deploy each workflow definition file
echo "Step 2: Deploying workflows from $DEFINITION_DIR/..."
DEPLOYED=0
FAILED=0

for def_file in "$DEFINITION_DIR"/*.json; do
    [ -f "$def_file" ] || continue
    name=$(basename "$def_file" .json)
    echo "  Deploying: $name..."

    result=$(unbound workflows build "$def_file" --json 2>&1)
    wf_id=$(echo "$result" | jq -r '.id // empty')

    if [ -n "$wf_id" ]; then
        echo "    ✓ Deployed: $wf_id"
        ((DEPLOYED++))
    else
        error=$(echo "$result" | jq -r '.error // .message // "unknown"')
        echo "    ✗ Failed: $error"
        send_alert "Deployment failed for $name: $error"
        ((FAILED++))
    fi
done

echo ""
echo "Pipeline complete. Deployed: $DEPLOYED | Failed: $FAILED"

if [ "$FAILED" -gt 0 ]; then
    send_alert "Pipeline finished with $FAILED failure(s). Check logs."
    exit 1
fi

send_alert "Deployment successful. $DEPLOYED workflow(s) updated."
