---
id: cli-ai
title: AI
---

# AI

The `ai` command provides access to Unbound's AI-powered tools, including conversational chat and text-to-speech synthesis.

## ai

AI-powered tools for chat and audio generation.

### Subcommands

#### `unbound ai chat <prompt> [options]`

Send a prompt to an AI model and receive a response.

| Option | Description |
|---|---|
| `--model <model>` | AI model to use (defaults to the platform default) |
| `--json` | Output raw JSON |

**Example -- simple prompt:**

```bash
unbound ai chat "Summarize the key features of the Unbound platform"
```

**Example -- specify a model:**

```bash
unbound ai chat "Write a professional voicemail greeting" --model gpt-4
```

**Example -- pipe output into another command:**

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

**Example -- generate speech with default voice:**

```bash
unbound ai tts "Thank you for calling. Please hold while we connect you."
```

**Example -- specify voice and output file:**

```bash
unbound ai tts "Welcome to Acme support." --voice alloy --output welcome.mp3
```
