---
id: cli-tasks
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
