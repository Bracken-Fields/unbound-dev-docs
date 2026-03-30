---
id: contacts
title: Contacts & People
---

# Contacts & People

The `contacts` command lets you create, list, search, and update contact records on the Unbound platform. Contacts are the central people records used across messaging, voice, and task routing.

---

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

**Example — list the first 20 contacts:**

```bash
unbound contacts list --limit 20
```

**Example — search for contacts by name:**

```bash
unbound contacts list --search "Jane"
```

**Example — get JSON output for scripting:**

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

**Example — extract specific fields:**

```bash
unbound contacts get con_abc123 --json | jq '{name: .name, phone: .phone, email: .email}'
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

**Example — create a contact with all fields:**

```bash
unbound contacts create \
    --name "Jane Doe" \
    --email "jane@example.com" \
    --phone "+15559876543"
```

**Example — create a contact with name only:**

```bash
unbound contacts create --name "John Smith"
```

**Example — capture the new contact ID:**

```bash
CONTACT_ID=$(unbound contacts create \
    --name "Alex Rivera" \
    --email "alex@corp.com" \
    --phone "+15551234567" \
    --json | jq -r '.id')
echo "Created contact: $CONTACT_ID"
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

**Example — update a contact's email:**

```bash
unbound contacts update con_abc123 --email "jane.doe@newdomain.com"
```

**Example — update multiple fields at once:**

```bash
unbound contacts update con_abc123 --name "Jane Smith" --phone "+15551234567"
```

---

## Scripting Patterns

### Pattern 1 — Bulk import contacts from CSV

Read a CSV of contacts and create each one via the CLI:

```bash
#!/bin/bash
# contacts.csv: name,email,phone
# Jane Doe,jane@example.com,+15551234567
# John Smith,john@example.com,+15559876543

CREATED=0
FAILED=0

tail -n +2 contacts.csv | while IFS=, read -r name email phone; do
    result=$(unbound contacts create \
        --name "$name" \
        --email "$email" \
        --phone "$phone" \
        --json 2>&1)

    if echo "$result" | jq -e '.id' > /dev/null 2>&1; then
        id=$(echo "$result" | jq -r '.id')
        echo "✓ Created: $name ($id)"
        ((CREATED++))
    else
        echo "✗ Failed: $name — $(echo "$result" | jq -r '.error // .message // "unknown error"')"
        ((FAILED++))
    fi

    sleep 0.2  # Rate limit
done

echo ""
echo "Import complete. Created: $CREATED | Failed: $FAILED"
```

### Pattern 2 — Find and merge duplicate contacts

Search for contacts with the same email domain and flag potential duplicates:

```bash
#!/bin/bash

echo "Searching for potential duplicate contacts..."

# Get all contacts with emails
unbound uoql \
    "SELECT id, name, email FROM contacts WHERE email IS NOT NULL LIMIT 1000" \
    --json | jq -r '.[] | "\(.email)|\(.id)|\(.name)"' | sort | \
while IFS='|' read -r email id name; do
    echo "$email|$id|$name"
done | awk -F'|' '
{
    emails[$1] = emails[$1] "  " $3 " (" $2 ")\n"
    counts[$1]++
}
END {
    for (email in counts) {
        if (counts[email] > 1) {
            print "DUPLICATE EMAIL: " email
            printf emails[email]
            print ""
        }
    }
}'
```

### Pattern 3 — Update phone numbers from E.164 normalization script

Fetch contacts missing properly formatted phone numbers and fix them:

```bash
#!/bin/bash

# Find contacts with non-E.164 phone numbers (missing + prefix)
unbound uoql \
    "SELECT id, name, phone FROM contacts WHERE phone IS NOT NULL AND phone NOT LIKE '+%' LIMIT 200" \
    --json | jq -r '.[] | "\(.id)|\(.name)|\(.phone)"' | \
while IFS='|' read -r id name phone; do
    # Normalize: strip non-digits, prepend +1 for US numbers
    clean=$(echo "$phone" | tr -cd '0-9')
    if [ ${#clean} -eq 10 ]; then
        normalized="+1${clean}"
    elif [ ${#clean} -eq 11 ] && [[ "$clean" == 1* ]]; then
        normalized="+${clean}"
    else
        echo "⚠ Cannot normalize: $name — $phone (${#clean} digits)"
        continue
    fi

    echo "Updating $name: $phone → $normalized"
    unbound contacts update "$id" --phone "$normalized" --json > /dev/null
    sleep 0.1
done
```

### Pattern 4 — Export contact list for external CRM sync

Generate a clean CSV export of all contacts for use in external tools:

```bash
#!/bin/bash

OUTPUT="contacts-export-$(date +%Y%m%d).csv"

echo "id,name,email,phone,createdAt" > "$OUTPUT"

# Paginate through all contacts
OFFSET=0
LIMIT=100

while true; do
    BATCH=$(unbound uoql \
        "SELECT id, name, email, phone, createdAt FROM contacts ORDER BY createdAt DESC LIMIT $LIMIT OFFSET $OFFSET" \
        --json)

    COUNT=$(echo "$BATCH" | jq 'length')
    if [ "$COUNT" -eq 0 ]; then
        break
    fi

    echo "$BATCH" | jq -r '.[] | [.id, .name // "", .email // "", .phone // "", .createdAt // ""] | @csv' >> "$OUTPUT"

    echo "  Exported $OFFSET–$((OFFSET + COUNT)) contacts..."
    OFFSET=$((OFFSET + LIMIT))

    if [ "$COUNT" -lt "$LIMIT" ]; then
        break
    fi
done

echo "Export complete: $OUTPUT ($(wc -l < "$OUTPUT") rows)"
```

### Pattern 5 — Contact health audit

Check for contacts with missing critical fields and report:

```bash
#!/bin/bash

echo "=== Contact Health Audit ==="
echo ""

# Missing email
MISSING_EMAIL=$(unbound uoql \
    "SELECT COUNT(*) as count FROM contacts WHERE email IS NULL" \
    --json | jq -r '.[0].count')

# Missing phone
MISSING_PHONE=$(unbound uoql \
    "SELECT COUNT(*) as count FROM contacts WHERE phone IS NULL" \
    --json | jq -r '.[0].count')

# Missing both
MISSING_BOTH=$(unbound uoql \
    "SELECT COUNT(*) as count FROM contacts WHERE email IS NULL AND phone IS NULL" \
    --json | jq -r '.[0].count')

# Total contacts
TOTAL=$(unbound uoql \
    "SELECT COUNT(*) as count FROM contacts" \
    --json | jq -r '.[0].count')

echo "Total contacts:      $TOTAL"
echo "Missing email:       $MISSING_EMAIL"
echo "Missing phone:       $MISSING_PHONE"
echo "Missing both:        $MISSING_BOTH"
echo ""

# Show contacts missing both as a list
if [ "$MISSING_BOTH" -gt 0 ]; then
    echo "Contacts with no email AND no phone:"
    unbound uoql \
        "SELECT id, name, createdAt FROM contacts WHERE email IS NULL AND phone IS NULL LIMIT 20" \
        --json | jq -r '.[] | "  \(.id)  \(.name // "unnamed")  (created: \(.createdAt))"'
fi
```

### Pattern 6 — Send a personalized SMS to a filtered contact list

Find contacts matching a condition and send each a personalized message:

```bash
#!/bin/bash

FROM_NUMBER="+15551000100"

# Find contacts who haven't been contacted in 30 days (using custom field)
CONTACTS=$(unbound uoql \
    "SELECT id, name, phone FROM contacts
     WHERE phone IS NOT NULL
     AND lastContactedAt < '$(date -d '30 days ago' +%Y-%m-%d 2>/dev/null || date -v-30d +%Y-%m-%d)'
     LIMIT 50" \
    --json)

COUNT=$(echo "$CONTACTS" | jq 'length')
echo "Found $COUNT contacts to re-engage."

echo "$CONTACTS" | jq -r '.[] | "\(.id)|\(.name)|\(.phone)"' | \
while IFS='|' read -r id name phone; do
    first_name=$(echo "$name" | cut -d' ' -f1)
    message="Hi $first_name! It's been a while — we'd love to reconnect. Reply STOP to opt out."

    echo "  Sending to $name ($phone)..."
    unbound sms send \
        --from "$FROM_NUMBER" \
        --to "$phone" \
        --message "$message" \
        --json > /dev/null

    sleep 0.5  # Respect rate limits
done

echo "Re-engagement campaign sent."
```
