---
id: contacts
title: Contacts & People
---

# Contacts & People

The `contacts` command lets you create, list, search, and update contact records on the Unbound platform. Contacts are the central people records used across messaging, voice, and task routing.

## contacts

Manage contacts in your Unbound namespace.

### Subcommands

#### `unbound contacts list [options]`

List contacts in your account. Results are paginated and returned in reverse chronological order by default.

| Option | Description |
|---|---|
| `--limit <number>` | Maximum number of contacts to return |
| `--search <query>` | Filter contacts by name, email, or phone number |
| `--json` | Output raw JSON |

**Example -- list the first 20 contacts:**

```bash
unbound contacts list --limit 20
```

**Example -- search for contacts by name:**

```bash
unbound contacts list --search "Jane"
```

**Example -- get JSON output for scripting:**

```bash
unbound contacts list --limit 100 --json | jq '.[].email'
```

---

#### `unbound contacts get <id> [options]`

Retrieve a single contact by its unique ID.

| Option | Description |
|---|---|
| `--json` | Output raw JSON |

**Example:**

```bash
unbound contacts get con_abc123
```

---

#### `unbound contacts create [options]`

Create a new contact. The `--name` flag is required; email and phone are optional.

| Option | Description |
|---|---|
| `--name <name>` | **(Required)** Full name of the contact |
| `--email <email>` | Email address |
| `--phone <phone>` | Phone number in E.164 format |
| `--json` | Output raw JSON |

**Example -- create a contact with all fields:**

```bash
unbound contacts create --name "Jane Doe" --email "jane@example.com" --phone "+15559876543"
```

**Example -- create a contact with name only:**

```bash
unbound contacts create --name "John Smith"
```

---

#### `unbound contacts update <id> [options]`

Update an existing contact. Provide only the fields you want to change.

| Option | Description |
|---|---|
| `--name <name>` | Updated name |
| `--email <email>` | Updated email address |
| `--phone <phone>` | Updated phone number |
| `--json` | Output raw JSON |

**Example -- update a contact's email:**

```bash
unbound contacts update con_abc123 --email "jane.doe@newdomain.com"
```

**Example -- update multiple fields at once:**

```bash
unbound contacts update con_abc123 --name "Jane Smith" --phone "+15551234567"
```
