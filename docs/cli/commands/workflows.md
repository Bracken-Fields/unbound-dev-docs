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
