---
id: storage
title: Storage
---

# Storage

`api.storage` — Upload, retrieve, update, and delete files. Supports multi-region replication, access control, TTL, and upload progress tracking.

---

## `storage.upload(options)`

Upload a single file with full control over options.

```javascript
const result = await api.storage.upload({
    file: fileBuffer,               // Buffer, File, or binary data
    fileName: 'contract.pdf',
    classification: 'documents',
    isPublic: false,
    country: 'US',
    expireAfter: '30d',             // '1h', '7d', '30d', etc.
    relatedId: 'contact-id-123',
    createAccessKey: true,
    accessKeyExpiresIn: 3600,       // seconds
    onProgress: ({ percentage, speed }) => {
        console.log(`${percentage.toFixed(1)}% — ${(speed / 1024).toFixed(1)} KB/s`);
    },
});

console.log('Storage ID:', result.uploaded[0].id);
console.log('URL:', result.uploaded[0].url);
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `file` | Buffer/File | — | File content |
| `fileName` | string | — | File name with extension |
| `classification` | string | `'generic'` | Organizational tag |
| `folder` | string | — | Folder path |
| `isPublic` | boolean | `false` | Whether file is publicly accessible |
| `country` | string | `'US'` | Storage region preference |
| `expireAfter` | string | — | TTL: `'1h'`, `'7d'`, `'30d'` |
| `relatedId` | string | — | Link file to a CRM object ID |
| `createAccessKey` | boolean | `false` | Generate a temporary access key |
| `accessKeyExpiresIn` | number | — | Access key TTL in seconds |
| `onProgress` | function | — | Upload progress callback (browser only) |

**Response:**
```json
{
    "uploaded": [{
        "id": "017d0120251229hvdxjod...",
        "fileName": "contract.pdf",
        "fileSize": 45231,
        "url": "https://your-namespace.api.unbound.cx/storage/017d01...",
        "mimeType": "application/pdf",
        "s3Regions": ["d01", "d03"],
        "isPublic": false
    }],
    "viruses": [],
    "errors": []
}
```

---

## `storage.uploadFiles(files, options?)`

Upload multiple files at once.

```javascript
// Node.js: array of Buffers
const result = await api.storage.uploadFiles(
    [fileBuffer1, fileBuffer2],
    { classification: 'recordings', isPublic: false }
);

// Browser: FileList from an <input>
const result = await api.storage.uploadFiles(
    document.querySelector('#fileInput').files,
    { classification: 'documents' }
);
```

---

## `storage.getFileUrl(storageId, download?)`

Get the URL for a stored file.

```javascript
const url = await api.storage.getFileUrl('storage-id-123');
const downloadUrl = await api.storage.getFileUrl('storage-id-123', true);
```

---

## `storage.getFile(storageId, path?, download?)`

Retrieve raw file content as a response object.

```javascript
const file = await api.storage.getFile('storage-id-123');
```

---

## `storage.getFileInfo(storageId)`

Get metadata about a file without downloading it.

```javascript
const info = await api.storage.getFileInfo('storage-id-123');
// info.fileName, info.mimeType, info.fileSize, info.classification, ...
```

---

## `storage.updateFile(storageId, options)`

Update file contents or metadata.

```javascript
// Update metadata only (no re-upload)
await api.storage.updateFile('storage-id-123', {
    fileName: 'renamed-contract.pdf',
    classification: 'legal',
    isPublic: true,
});

// Replace file content
await api.storage.updateFile('storage-id-123', {
    file: newFileBuffer,
    fileName: 'updated-contract.pdf',
});
```

---

## `storage.updateFileMetadata(storageId, metadata)`

Update custom metadata fields.

```javascript
await api.storage.updateFileMetadata('storage-id-123', {
    tags: ['contract', 'signed'],
    owner: 'jane@example.com',
});
```

---

## `storage.deleteFile(storageId)`

Permanently delete a file.

```javascript
await api.storage.deleteFile('storage-id-123');
```

---

## `storage.listFiles(options?)`

List files with filters.

```javascript
const files = await api.storage.listFiles({
    classification: 'recordings',
    folder: 'calls/2024',
    limit: 50,
    offset: 0,
    orderBy: 'createdAt',
    orderDirection: 'desc',
});
```

---

## `storage.generateAccessKey(fileId, expiresIn?)`

Generate a temporary access key for a private file.

```javascript
const access = await api.storage.generateAccessKey('storage-id-123', 3600);
// access.key → temporary access key
// access.url → URL with key embedded
// access.expiresAt → ISO timestamp
```

---

## Profile Image Upload

```javascript
await api.storage.uploadProfileImage({
    file: imageBuffer,
    fileName: 'avatar.jpg',
    classification: 'user_images',   // or 'account_logo'
    userId: 'user-id-123',
});
```

---

## Storage Classifications

Standard classifications for organizing files:

| Classification | Use Case |
|---|---|
| `generic` | Default, uncategorized |
| `documents` | PDFs, Word docs, spreadsheets |
| `recordings` | Call recordings |
| `media` | Images, video, audio |
| `user_images` | Profile photos |
| `account_logo` | Organization logo |

```javascript
const classifications = await api.storage.getStorageClassifications();
```
