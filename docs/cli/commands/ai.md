---
id: ai
title: AI
---

# AI

The `ai` command provides access to Unbound's AI-powered tools, including conversational chat and text-to-speech synthesis.

---

## ai

AI-powered tools for chat and audio generation.

### Subcommands

#### `unbound ai chat <prompt> [options]`

Send a prompt to an AI model and receive a response.

| Option | Description |
|---|---|
| `--model <model>` | AI model to use (defaults to the platform default) |
| `--json` | Output raw JSON |

**Example — simple prompt:**

```bash
unbound ai chat "Summarize the key features of the Unbound platform"
```

**Example — specify a model:**

```bash
unbound ai chat "Write a professional voicemail greeting" --model gpt-4
```

**Example — pipe output into another command:**

```bash
unbound ai chat "Generate a CSV of 10 sample contacts" --json | jq -r '.response'
```

---

#### `unbound ai tts <text> [options]`

Convert text to speech and save the audio output.

| Option | Description |
|---|---|
| `--voice <voice>` | Voice to use for synthesis |
| `--output <path>` | File path to save the audio output |
| `--json` | Output raw JSON |

**Example — generate speech with default voice:**

```bash
unbound ai tts "Thank you for calling. Please hold while we connect you."
```

**Example — specify voice and output file:**

```bash
unbound ai tts "Welcome to Acme support." --voice alloy --output welcome.mp3
```

**Example — generate multiple greetings in a loop:**

```bash
for queue in sales support billing; do
    unbound ai tts "Thank you for calling the $queue team. An agent will be with you shortly." \
        --voice alloy \
        --output "greetings/${queue}.mp3"
    echo "Generated: greetings/${queue}.mp3"
done
```

---

## Scripting Patterns

### Pattern 1 — Generate and store a call summary note

Pull a recent call transcript and ask AI to summarize it, then store the result as a note on the contact:

```bash
#!/bin/bash

CALL_ID="call_abc123"
CONTACT_ID="con_xyz789"

# Fetch call transcript via UOQL
TRANSCRIPT=$(unbound uoql \
    "SELECT transcript FROM voice WHERE id = '$CALL_ID'" \
    --json | jq -r '.[0].transcript')

# Summarize with AI
SUMMARY=$(unbound ai chat \
    "Summarize this call transcript in 2-3 sentences, focusing on the customer's main issue and outcome: $TRANSCRIPT" \
    --json | jq -r '.response')

echo "Summary: $SUMMARY"

# Store as a note (via API — CLI notes support is in admin commands)
curl -s -X POST "https://${UNBOUND_NAMESPACE}.api.unbound.cx/notes" \
    -H "Authorization: Bearer $(unbound login --token-only)" \
    -H "Content-Type: application/json" \
    -d "{\"objectName\": \"contacts\", \"recordId\": \"$CONTACT_ID\", \"content\": \"$SUMMARY\"}"
```

### Pattern 2 — Bulk TTS for IVR greetings from a CSV

Generate audio files for all queues listed in a CSV:

```bash
#!/bin/bash
# queues.csv format: queue_name,greeting_text

while IFS=, read -r queue_name greeting_text; do
    output="audio/${queue_name// /_}.mp3"
    echo "Generating TTS for: $queue_name → $output"

    unbound ai tts "$greeting_text" \
        --voice alloy \
        --output "$output"

    sleep 1  # Respect rate limits
done < queues.csv

echo "All greetings generated in audio/"
```

### Pattern 3 — AI-powered contact enrichment

Use AI to infer missing fields from partial contact data:

```bash
#!/bin/bash

# Find contacts with no industry set
unbound uoql \
    "SELECT id, name, email FROM contacts WHERE industry IS NULL LIMIT 50" \
    --json | jq -r '.[] | "\(.id)|\(.name)|\(.email)"' | \
while IFS='|' read -r id name email; do
    domain=$(echo "$email" | cut -d@ -f2)

    # Ask AI to guess the industry from the email domain
    industry=$(unbound ai chat \
        "Based on the domain '$domain', what industry is this company most likely in? Reply with a single word or short phrase only." \
        --json | jq -r '.response')

    echo "  $name ($domain) → $industry"

    # Update the contact via API
    curl -s -X PUT "https://${UNBOUND_NAMESPACE}.api.unbound.cx/object/contacts/$id" \
        -H "Authorization: Bearer $UNBOUND_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"industry\": \"$industry\"}" > /dev/null
done
```

### Pattern 4 — Daily AI digest of open tasks

Generate a natural-language daily briefing of open tasks and send it as an SMS to a manager:

```bash
#!/bin/bash

MANAGER_PHONE="+15551234567"
FROM_NUMBER="+15551000100"

# Fetch open task counts by queue
TASK_DATA=$(unbound uoql \
    "SELECT queueName, COUNT(*) as count FROM tasks WHERE status = 'open' GROUP BY queueName ORDER BY count DESC" \
    --json | jq -r '.[] | "\(.queueName): \(.count) open"' | tr '\n' '; ')

# Generate AI summary
BRIEFING=$(unbound ai chat \
    "Write a brief, professional daily contact center status update (2-3 sentences) based on this data: $TASK_DATA" \
    --json | jq -r '.response')

echo "Daily briefing: $BRIEFING"

# Send as SMS
unbound sms send \
    --from "$FROM_NUMBER" \
    --to "$MANAGER_PHONE" \
    --message "Daily Briefing: $BRIEFING"
```

### Pattern 5 — AI-powered FAQ responder

Check if an inbound SMS question can be answered from a knowledge base, then auto-reply:

```bash
#!/bin/bash

INBOUND_PHONE="+15559876543"
FROM_NUMBER="+15551000100"
CUSTOMER_QUESTION="What are your hours of operation?"

# Ask AI to answer the question (assumes KB context is injected via model prompt)
ANSWER=$(unbound ai chat \
    "Answer this customer question concisely (max 160 chars for SMS): $CUSTOMER_QUESTION" \
    --model gpt-4 \
    --json | jq -r '.response')

echo "Answer: $ANSWER"

# Send auto-reply
unbound sms send \
    --from "$FROM_NUMBER" \
    --to "$INBOUND_PHONE" \
    --message "$ANSWER"
```

### Pattern 6 — Generate voicemail scripts and save as files

Create a set of professionally worded voicemail scripts for different scenarios:

```bash
#!/bin/bash

declare -A scenarios=(
    ["unavailable"]="The agent is unavailable"
    ["after_hours"]="Outside of business hours (9am-5pm ET, Mon-Fri)"
    ["max_wait"]="The customer waited more than 10 minutes"
    ["holiday"]="The office is closed for a holiday"
)

mkdir -p voicemail-scripts voicemail-audio

for key in "${!scenarios[@]}"; do
    context="${scenarios[$key]}"

    # Generate script text
    script=$(unbound ai chat \
        "Write a professional voicemail greeting for this scenario: $context. Max 30 words. Friendly but concise." \
        --json | jq -r '.response')

    # Save script text
    echo "$script" > "voicemail-scripts/${key}.txt"
    echo "Script ($key): $script"

    # Generate audio
    unbound ai tts "$script" \
        --voice alloy \
        --output "voicemail-audio/${key}.mp3"

    sleep 1
done

echo "Done. Scripts in voicemail-scripts/, audio in voicemail-audio/"
```
