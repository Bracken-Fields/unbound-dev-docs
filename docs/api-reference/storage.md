---
id: storage
title: Storage
---

# Storage

`api.storage` — Upload, retrieve, and manage files.

## Upload Files

```javascript
const files = await api.storage.uploadFiles(fileData, {
  classification: 'documents',  // Organizational tag
  isPublic: false,              // Public or private
  expireAfter: '30d',           // Optional TTL: 1h, 7d, 30d, etc.
});

console.log('Storage ID:', files[0].storageId);
console.log('URL:', files[0].url);
```

| Option | Type | Description |
|---|---|---|
| `classification` | string | Category tag (`documents`, `recordings`, `media`, etc.) |
| `isPublic` | boolean | Whether file is publicly accessible |
| `expireAfter` | string | TTL string — `1h`, `7d`, `30d` |

## Get File URL

```javascript
const url = api.storage.getFileUrl(storageId);
```

## Delete a File

```javascript
await api.storage.deleteFile(storageId);
```

## List Files

```javascript
const files = await api.storage.list({
  classification: 'recordings',
  limit: 50,
});
```

## Usage with AI STT

Storage IDs are used when submitting recorded audio for transcription:

```javascript
// 1. Upload audio
const [file] = await api.storage.uploadFiles(audioBuffer, {
  classification: 'recordings',
});

// 2. Transcribe
const transcription = await api.ai.stt.create({
  sourceType: 'storage',
  storageId: file.storageId,
  engine: 'google',
  languageCode: 'en-US',
});
```
