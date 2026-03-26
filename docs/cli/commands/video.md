---
id: cli-video
title: Video
---

# Video

The `video` command lets you manage video rooms, control participants, and initiate outbound calls into video sessions.

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
