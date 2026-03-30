---
id: storage
title: Storage
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Storage

`api.storage` — Upload, retrieve, update, and delete files. Supports multi-region replication, access control, TTL, and upload progress tracking.

---

## `storage.upload(options)`

Upload a single file with full control over options.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const fs = require("fs");
const FormData = require("form-data");

const form = new FormData();
form.append("file", fs.createReadStream("contract.pdf"));
form.append("fileName", "contract.pdf");
form.append("classification", "documents");
form.append("isPublic", "false");
form.append("country", "US");
form.append("expireAfter", "30d");
form.append("relatedId", "contact-id-123");
form.append("createAccessKey", "true");
form.append("accessKeyExpiresIn", "3600");

const res = await fetch("https://{namespace}.api.unbound.cx/storage", {
  method: "POST",
  headers: {
    "Authorization": "Bearer {token}",
    ...form.getHeaders()
  },
  body: form
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    "file"               => new CURLFile("contract.pdf", "application/pdf", "contract.pdf"),
    "fileName"           => "contract.pdf",
    "classification"     => "documents",
    "isPublic"           => "false",
    "country"            => "US",
    "expireAfter"        => "30d",
    "relatedId"          => "contact-id-123",
    "createAccessKey"    => "true",
    "accessKeyExpiresIn" => "3600"
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

with open("contract.pdf", "rb") as f:
    response = requests.post(
        "https://{namespace}.api.unbound.cx/storage",
        headers={"Authorization": "Bearer {token}"},
        files={"file": ("contract.pdf", f, "application/pdf")},
        data={
            "fileName": "contract.pdf",
            "classification": "documents",
            "isPublic": "false",
            "country": "US",
            "expireAfter": "30d",
            "relatedId": "contact-id-123",
            "createAccessKey": "true",
            "accessKeyExpiresIn": "3600"
        }
    )
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/storage" \
  -H "Authorization: Bearer {token}" \
  -F "file=@contract.pdf" \
  -F "fileName=contract.pdf" \
  -F "classification=documents" \
  -F "isPublic=false" \
  -F "country=US" \
  -F "expireAfter=30d" \
  -F "relatedId=contact-id-123" \
  -F "createAccessKey=true" \
  -F "accessKeyExpiresIn=3600"
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const fs = require("fs");
const FormData = require("form-data");

const form = new FormData();
form.append("files", fs.createReadStream("file1.pdf"));
form.append("files", fs.createReadStream("file2.pdf"));
form.append("classification", "recordings");
form.append("isPublic", "false");

const res = await fetch("https://{namespace}.api.unbound.cx/storage", {
  method: "POST",
  headers: {
    "Authorization": "Bearer {token}",
    ...form.getHeaders()
  },
  body: form
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    "files[0]"       => new CURLFile("file1.pdf", "application/pdf", "file1.pdf"),
    "files[1]"       => new CURLFile("file2.pdf", "application/pdf", "file2.pdf"),
    "classification" => "recordings",
    "isPublic"       => "false"
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/storage",
    headers={"Authorization": "Bearer {token}"},
    files=[
        ("files", ("file1.pdf", open("file1.pdf", "rb"), "application/pdf")),
        ("files", ("file2.pdf", open("file2.pdf", "rb"), "application/pdf"))
    ],
    data={
        "classification": "recordings",
        "isPublic": "false"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/storage" \
  -H "Authorization: Bearer {token}" \
  -F "files=@file1.pdf" \
  -F "files=@file2.pdf" \
  -F "classification=recordings" \
  -F "isPublic=false"
```

</TabItem>
</Tabs>

---

## `storage.getFileUrl(storageId, download?)`

Get the URL for a stored file.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const url = await api.storage.getFileUrl('storage-id-123');
const downloadUrl = await api.storage.getFileUrl('storage-id-123', true);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/storage/storage-id-123/url?download=true", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/storage-id-123/url?download=true");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}"
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/storage/storage-id-123/url",
    headers={"Authorization": "Bearer {token}"},
    params={"download": "true"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/storage/storage-id-123/url?download=true" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `storage.getFile(storageId, path?, download?)`

Retrieve raw file content as a response object.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const file = await api.storage.getFile('storage-id-123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/storage/storage-id-123", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const fileData = await res.blob();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/storage-id-123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}"
]);
$fileData = curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/storage/storage-id-123",
    headers={"Authorization": "Bearer {token}"}
)
file_data = response.content
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/storage/storage-id-123" \
  -H "Authorization: Bearer {token}" \
  --output downloaded-file
```

</TabItem>
</Tabs>

---

## `storage.getFileInfo(storageId)`

Get metadata about a file without downloading it.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const info = await api.storage.getFileInfo('storage-id-123');
// info.fileName, info.mimeType, info.fileSize, info.classification, ...
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/storage/storage-id-123/info", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/storage-id-123/info");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}"
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/storage/storage-id-123/info",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/storage/storage-id-123/info" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `storage.updateFile(storageId, options)`

Update file contents, metadata, or both. When `file` is provided, content is replaced via multipart upload. Without `file`, only metadata fields are updated via a JSON `PUT`.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Update metadata only (no re-upload)
await api.storage.updateFile('storage-id-123', {
    fileName: 'renamed-contract.pdf',
    classification: 'legal',
    isPublic: true,
    folder: 'contracts/2026',
    country: 'US',
    expireAfter: '2027-01-01T00:00:00Z',
    relatedId: 'case-id-456',
});

// Replace file content and move to a new folder
await api.storage.updateFile('storage-id-123', {
    file: newFileBuffer,
    fileName: 'updated-contract.pdf',
    folder: 'contracts/executed',
    classification: 'legal',
});

// Move file to a different folder without changing content
await api.storage.updateFile('storage-id-123', {
    folder: 'archive/2025',
    isPublic: false,
});

// Set a file expiration (GDPR / retention policies)
await api.storage.updateFile('storage-id-123', {
    expireAfter: '2026-12-31T23:59:59Z',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const fs = require("fs");
const FormData = require("form-data");

// Replace file content with full metadata update
const form = new FormData();
form.append("file", fs.createReadStream("updated-contract.pdf"));
form.append("fileName", "updated-contract.pdf");
form.append("classification", "legal");
form.append("folder", "contracts/executed");
form.append("isPublic", "false");
form.append("country", "US");
form.append("expireAfter", "2027-01-01T00:00:00Z");
form.append("relatedId", "case-id-456");

const res = await fetch("https://{namespace}.api.unbound.cx/storage/storage-id-123", {
  method: "PUT",
  headers: {
    "Authorization": "Bearer {token}",
    ...form.getHeaders()
  },
  body: form
});
const data = await res.json();

// Metadata-only update (no file, uses JSON body)
const res2 = await fetch("https://{namespace}.api.unbound.cx/storage/storage-id-123", {
  method: "PUT",
  headers: {
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    folder: "archive/2025",
    isPublic: false,
    expireAfter: "2026-12-31T23:59:59Z"
  })
});
const data2 = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Replace file content
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/storage-id-123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    "file"           => new CURLFile("updated-contract.pdf", "application/pdf", "updated-contract.pdf"),
    "fileName"       => "updated-contract.pdf",
    "classification" => "legal",
    "folder"         => "contracts/executed",
    "isPublic"       => "false",
    "country"        => "US",
    "expireAfter"    => "2027-01-01T00:00:00Z",
    "relatedId"      => "case-id-456"
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Metadata-only update
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/storage-id-123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "folder"      => "archive/2025",
    "isPublic"    => false,
    "expireAfter" => "2026-12-31T23:59:59Z"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Replace file content with full metadata update
with open("updated-contract.pdf", "rb") as f:
    response = requests.put(
        "https://{namespace}.api.unbound.cx/storage/storage-id-123",
        headers={"Authorization": "Bearer {token}"},
        files={"file": ("updated-contract.pdf", f, "application/pdf")},
        data={
            "fileName": "updated-contract.pdf",
            "classification": "legal",
            "folder": "contracts/executed",
            "isPublic": "false",
            "country": "US",
            "expireAfter": "2027-01-01T00:00:00Z",
            "relatedId": "case-id-456"
        }
    )
data = response.json()

# Metadata-only update
response2 = requests.put(
    "https://{namespace}.api.unbound.cx/storage/storage-id-123",
    headers={"Authorization": "Bearer {token}"},
    json={
        "folder": "archive/2025",
        "isPublic": False,
        "expireAfter": "2026-12-31T23:59:59Z"
    }
)
data2 = response2.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Replace file content with full metadata update
curl -X PUT "https://{namespace}.api.unbound.cx/storage/storage-id-123" \
  -H "Authorization: Bearer {token}" \
  -F "file=@updated-contract.pdf" \
  -F "fileName=updated-contract.pdf" \
  -F "classification=legal" \
  -F "folder=contracts/executed" \
  -F "isPublic=false" \
  -F "country=US" \
  -F "expireAfter=2027-01-01T00:00:00Z" \
  -F "relatedId=case-id-456"

# Metadata-only update (JSON body)
curl -X PUT "https://{namespace}.api.unbound.cx/storage/storage-id-123" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"folder": "archive/2025", "isPublic": false, "expireAfter": "2026-12-31T23:59:59Z"}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `storageId` | string | ✅ | Storage ID of the file to update |
| `file` | Buffer / File | — | New file content. When provided, triggers a multipart upload replacing the stored bytes |
| `fileName` | string | — | New display name for the file (does not need to match extension) |
| `classification` | string | — | Storage classification (e.g., `'legal'`, `'medical'`, `'financial'`). Determines storage tier and compliance controls |
| `folder` | string | — | Virtual folder path (e.g., `'contracts/2026'`). Use `/` as separator — no leading slash |
| `isPublic` | boolean | — | `true` to make the file publicly accessible via its URL without authentication |
| `country` | string | — | 2-letter ISO country code for data residency (e.g., `'US'`, `'EU'`). Used to control where file data is stored |
| `expireAfter` | string | — | ISO 8601 timestamp after which the file should be automatically deleted (e.g., `'2027-01-01T00:00:00Z'`) |
| `relatedId` | string | — | ID of a related record (contact, engagement, etc.) to associate with this file |

> **Behavior note:** If `file` is provided, the update uses multipart form encoding — all other fields must also be sent as form fields (not JSON). If `file` is omitted, the request uses a JSON body and only metadata fields are updated.

**Response**

```javascript
{
    storageId: "storage-id-123",
    fileName: "updated-contract.pdf",
    classification: "legal",
    folder: "contracts/executed",
    isPublic: false,
    url: "https://storage.unbound.cx/...",
    updatedAt: "2026-03-28T12:00:00Z"
}
```

---

## `storage.updateFileMetadata(storageId, metadata)`

Update custom metadata fields.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.storage.updateFileMetadata('storage-id-123', {
    tags: ['contract', 'signed'],
    owner: 'jane@example.com',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/storage/storage-id-123/metadata", {
  method: "PUT",
  headers: {
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    tags: ["contract", "signed"],
    owner: "jane@example.com"
  })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/storage-id-123/metadata");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "tags"  => ["contract", "signed"],
    "owner" => "jane@example.com"
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.put(
    "https://{namespace}.api.unbound.cx/storage/storage-id-123/metadata",
    headers={"Authorization": "Bearer {token}"},
    json={
        "tags": ["contract", "signed"],
        "owner": "jane@example.com"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "tags": ["contract", "signed"],
  "owner": "jane@example.com"
}
EOF
)

curl -X PUT "https://{namespace}.api.unbound.cx/storage/storage-id-123/metadata" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

---

## `storage.deleteFile(storageId)`

Permanently delete a file.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.storage.deleteFile('storage-id-123');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/storage/storage-id-123", {
  method: "DELETE",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/storage-id-123");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}"
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    "https://{namespace}.api.unbound.cx/storage/storage-id-123",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/storage/storage-id-123" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `storage.listFiles(options?)`

List files with filters.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const params = new URLSearchParams({
  classification: "recordings",
  folder: "calls/2024",
  limit: "50",
  offset: "0",
  orderBy: "createdAt",
  orderDirection: "desc"
});

const res = await fetch(`https://{namespace}.api.unbound.cx/storage?${params}`, {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$query = http_build_query([
    "classification" => "recordings",
    "folder"         => "calls/2024",
    "limit"          => 50,
    "offset"         => 0,
    "orderBy"        => "createdAt",
    "orderDirection" => "desc"
]);

$ch = curl_init("https://{namespace}.api.unbound.cx/storage?" . $query);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}"
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/storage",
    headers={"Authorization": "Bearer {token}"},
    params={
        "classification": "recordings",
        "folder": "calls/2024",
        "limit": 50,
        "offset": 0,
        "orderBy": "createdAt",
        "orderDirection": "desc"
    }
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/storage?classification=recordings&folder=calls/2024&limit=50&offset=0&orderBy=createdAt&orderDirection=desc" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `storage.generateAccessKey(fileId, expiresIn?)`

Generate a temporary access key for a private file.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const access = await api.storage.generateAccessKey('storage-id-123', 3600);
// access.key → temporary access key
// access.url → URL with key embedded
// access.expiresAt → ISO timestamp
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/storage/storage-id-123/access-key", {
  method: "POST",
  headers: {
    "Authorization": "Bearer {token}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ expiresIn: 3600 })
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/storage-id-123/access-key");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "expiresIn" => 3600
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/storage/storage-id-123/access-key",
    headers={"Authorization": "Bearer {token}"},
    json={"expiresIn": 3600}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/storage/storage-id-123/access-key" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"expiresIn": 3600}'
```

</TabItem>
</Tabs>

---

## Profile Image Upload

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.storage.uploadProfileImage({
    file: imageBuffer,
    fileName: 'avatar.jpg',
    classification: 'user_images',   // or 'account_logo'
    userId: 'user-id-123',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const fs = require("fs");
const FormData = require("form-data");

const form = new FormData();
form.append("file", fs.createReadStream("avatar.jpg"));
form.append("fileName", "avatar.jpg");
form.append("classification", "user_images");
form.append("userId", "user-id-123");

const res = await fetch("https://{namespace}.api.unbound.cx/storage/profile-image", {
  method: "POST",
  headers: {
    "Authorization": "Bearer {token}",
    ...form.getHeaders()
  },
  body: form
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/profile-image");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    "file"           => new CURLFile("avatar.jpg", "image/jpeg", "avatar.jpg"),
    "fileName"       => "avatar.jpg",
    "classification" => "user_images",
    "userId"         => "user-id-123"
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

with open("avatar.jpg", "rb") as f:
    response = requests.post(
        "https://{namespace}.api.unbound.cx/storage/profile-image",
        headers={"Authorization": "Bearer {token}"},
        files={"file": ("avatar.jpg", f, "image/jpeg")},
        data={
            "fileName": "avatar.jpg",
            "classification": "user_images",
            "userId": "user-id-123"
        }
    )
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "https://{namespace}.api.unbound.cx/storage/profile-image" \
  -H "Authorization: Bearer {token}" \
  -F "file=@avatar.jpg" \
  -F "fileName=avatar.jpg" \
  -F "classification=user_images" \
  -F "userId=user-id-123"
```

</TabItem>
</Tabs>

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

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const classifications = await api.storage.getStorageClassifications();
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch("https://{namespace}.api.unbound.cx/storage/classifications", {
  method: "GET",
  headers: { "Authorization": "Bearer {token}" }
});
const data = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/classifications");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}"
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    "https://{namespace}.api.unbound.cx/storage/classifications",
    headers={"Authorization": "Bearer {token}"}
)
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "https://{namespace}.api.unbound.cx/storage/classifications" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## Storage Configurations

Storage configurations define how and where files are stored — which cloud providers, which regions, and how many providers are required for redundancy. The platform ships with built-in system configurations; you can also create custom ones.

### `storage.listStorageConfigurations(options?)`

List available storage configurations. Returns both system configurations and any custom ones you've created.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// List all configurations
const configs = await api.storage.listStorageConfigurations();

// Filter by classification
const voiceConfigs = await api.storage.listStorageConfigurations({
    classification: 'recordings',
});

// Filter by country, exclude global
const usConfigs = await api.storage.listStorageConfigurations({
    country: 'US',
    includeGlobal: false,
});

// Only custom configs (not system)
const customOnly = await api.storage.listStorageConfigurations({
    isSystem: false,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// List all configurations
const res = await fetch(
    "https://{namespace}.api.unbound.cx/storage/configurations",
    {
        method: "GET",
        headers: { "Authorization": "Bearer {token}" }
    }
);
const data = await res.json();

// Filter by classification
const res2 = await fetch(
    "https://{namespace}.api.unbound.cx/storage/configurations?classification=recordings",
    {
        method: "GET",
        headers: { "Authorization": "Bearer {token}" }
    }
);
const filtered = await res2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// List all configurations
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/configurations");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Filter by classification
$ch = curl_init(
    "https://{namespace}.api.unbound.cx/storage/configurations?classification=recordings"
);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# List all configurations
response = requests.get(
    "https://{namespace}.api.unbound.cx/storage/configurations",
    headers={"Authorization": "Bearer {token}"}
)
configs = response.json()

# Filter by classification
response = requests.get(
    "https://{namespace}.api.unbound.cx/storage/configurations",
    headers={"Authorization": "Bearer {token}"},
    params={"classification": "recordings", "includeGlobal": "false"}
)
filtered = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# List all configurations
curl -X GET "https://{namespace}.api.unbound.cx/storage/configurations" \
  -H "Authorization: Bearer {token}"

# Filter by classification
curl -X GET "https://{namespace}.api.unbound.cx/storage/configurations?classification=recordings" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `classification` | string | — | Filter by file classification (e.g. `'recordings'`, `'documents'`) |
| `country` | string | — | Filter by country code (e.g. `'US'`, `'EU'`) |
| `isSystem` | boolean | — | `true` = system configs only; `false` = custom only |
| `includeGlobal` | boolean | — | Whether to include global (non-country-specific) configs. Default: `true` |

**Response**

```javascript
{
    configurations: [
        {
            id: "config-id-123",
            classification: "recordings",
            country: "US",
            isSystem: true,
            s3Regions: ["us-east-1", "us-west-2"],
            gccRegions: [],
            azureRegions: [],
            minimumProviders: 1,
            minimumRegionsS3: 1,
            minimumRegionsGCC: 0,
            minimumRegionsAzure: 0,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z"
        }
    ],
    summary: {
        total: 8,
        system: 6,
        custom: 2
    }
}
```

---

### `storage.createStorageConfiguration(config)`

Create a custom storage configuration — for example, a EU-only config for GDPR compliance or a high-redundancy config for regulated recordings.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Create an EU-only config for GDPR-sensitive data
const config = await api.storage.createStorageConfiguration({
    classification: 'documents',
    country: 'EU',
    s3Regions: ['eu-west-1', 'eu-central-1'],
    gccRegions: ['europe-west1'],
    azureRegions: [],
    minimumProviders: 2,
    minimumRegionsS3: 1,
    minimumRegionsGCC: 1,
    minimumRegionsAzure: 0,
});

// Create a US-only high-redundancy config for call recordings
const recordingConfig = await api.storage.createStorageConfiguration({
    classification: 'recordings',
    country: 'US',
    s3Regions: ['us-east-1', 'us-west-2', 'us-east-2'],
    gccRegions: [],
    azureRegions: ['eastus', 'westus'],
    minimumProviders: 2,
    minimumRegionsS3: 2,
    minimumRegionsGCC: 0,
    minimumRegionsAzure: 1,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch(
    "https://{namespace}.api.unbound.cx/storage/configurations",
    {
        method: "POST",
        headers: {
            "Authorization": "Bearer {token}",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            classification: "documents",
            country: "EU",
            s3Regions: ["eu-west-1", "eu-central-1"],
            gccRegions: ["europe-west1"],
            azureRegions: [],
            minimumProviders: 2,
            minimumRegionsS3: 1,
            minimumRegionsGCC: 1,
            minimumRegionsAzure: 0
        })
    }
);
const config = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/configurations");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "classification"       => "documents",
    "country"              => "EU",
    "s3Regions"            => ["eu-west-1", "eu-central-1"],
    "gccRegions"           => ["europe-west1"],
    "azureRegions"         => [],
    "minimumProviders"     => 2,
    "minimumRegionsS3"     => 1,
    "minimumRegionsGCC"    => 1,
    "minimumRegionsAzure"  => 0
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://{namespace}.api.unbound.cx/storage/configurations",
    headers={
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json"
    },
    json={
        "classification": "documents",
        "country": "EU",
        "s3Regions": ["eu-west-1", "eu-central-1"],
        "gccRegions": ["europe-west1"],
        "azureRegions": [],
        "minimumProviders": 2,
        "minimumRegionsS3": 1,
        "minimumRegionsGCC": 1,
        "minimumRegionsAzure": 0
    }
)
config = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "classification": "documents",
  "country": "EU",
  "s3Regions": ["eu-west-1", "eu-central-1"],
  "gccRegions": ["europe-west1"],
  "azureRegions": [],
  "minimumProviders": 2,
  "minimumRegionsS3": 1,
  "minimumRegionsGCC": 1,
  "minimumRegionsAzure": 0
}
EOF
)

curl -X POST "https://{namespace}.api.unbound.cx/storage/configurations" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `classification` | string | ✅ | File classification this config applies to |
| `country` | string | ✅ | Country or region code (e.g. `'US'`, `'EU'`, `'AU'`) |
| `s3Regions` | string[] | — | AWS S3 regions to use (e.g. `['us-east-1', 'us-west-2']`) |
| `gccRegions` | string[] | — | Google Cloud regions to use (e.g. `['us-central1']`) |
| `azureRegions` | string[] | — | Azure regions to use (e.g. `['eastus', 'westus']`) |
| `minimumProviders` | number | — | Minimum number of cloud providers required. Default: `1` |
| `minimumRegionsS3` | number | — | Minimum S3 regions required. Default: `1` |
| `minimumRegionsGCC` | number | — | Minimum GCC regions required. Default: `1` |
| `minimumRegionsAzure` | number | — | Minimum Azure regions required. Default: `1` |

**Response**

```javascript
{
    id: "config-id-456",
    classification: "documents",
    country: "EU",
    isSystem: false,
    s3Regions: ["eu-west-1", "eu-central-1"],
    gccRegions: ["europe-west1"],
    azureRegions: [],
    minimumProviders: 2,
    minimumRegionsS3: 1,
    minimumRegionsGCC: 1,
    minimumRegionsAzure: 0,
    createdAt: "2024-03-01T12:00:00Z",
    updatedAt: "2024-03-01T12:00:00Z"
}
```

---

### `storage.updateStorageConfiguration(id, updates)`

Update a storage configuration. Custom configurations can update all fields. System configurations have limited update capabilities — only regions and minimum levels can be changed.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Add a new region to an existing config
const updated = await api.storage.updateStorageConfiguration('config-id-456', {
    s3Regions: ['eu-west-1', 'eu-central-1', 'eu-north-1'],
    minimumRegionsS3: 2,
});

// Bump minimum provider requirement
const stricter = await api.storage.updateStorageConfiguration('config-id-456', {
    minimumProviders: 3,
    minimumRegionsS3: 2,
    minimumRegionsGCC: 1,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch(
    "https://{namespace}.api.unbound.cx/storage/configurations/{configId}",
    {
        method: "PUT",
        headers: {
            "Authorization": "Bearer {token}",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            s3Regions: ["eu-west-1", "eu-central-1", "eu-north-1"],
            minimumRegionsS3: 2
        })
    }
);
const updated = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/configurations/{configId}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {token}",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "s3Regions"        => ["eu-west-1", "eu-central-1", "eu-north-1"],
    "minimumRegionsS3" => 2
]));
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.put(
    "https://{namespace}.api.unbound.cx/storage/configurations/{configId}",
    headers={
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json"
    },
    json={
        "s3Regions": ["eu-west-1", "eu-central-1", "eu-north-1"],
        "minimumRegionsS3": 2
    }
)
updated = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "https://{namespace}.api.unbound.cx/storage/configurations/{configId}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"s3Regions": ["eu-west-1", "eu-central-1", "eu-north-1"], "minimumRegionsS3": 2}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Configuration ID to update |
| `updates` | object | ✅ | Fields to update (same shape as create, all optional) |

:::note System configuration limits
System configurations (`isSystem: true`) only allow updates to `s3Regions`, `gccRegions`, `azureRegions`, `minimumProviders`, `minimumRegionsS3`, `minimumRegionsGCC`, and `minimumRegionsAzure`. Attempting to change `classification` or `country` on a system config will return an error.
:::

**Response**

Returns the updated configuration object (same shape as create response).

---

### `storage.deleteStorageConfiguration(id)`

Delete a custom storage configuration. System configurations cannot be deleted.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.storage.deleteStorageConfiguration('config-id-456');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const res = await fetch(
    "https://{namespace}.api.unbound.cx/storage/configurations/{configId}",
    {
        method: "DELETE",
        headers: { "Authorization": "Bearer {token}" }
    }
);
const result = await res.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init("https://{namespace}.api.unbound.cx/storage/configurations/{configId}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {token}"]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    "https://{namespace}.api.unbound.cx/storage/configurations/{configId}",
    headers={"Authorization": "Bearer {token}"}
)
result = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "https://{namespace}.api.unbound.cx/storage/configurations/{configId}" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Configuration ID to delete |

:::warning
Only custom configurations (`isSystem: false`) can be deleted. Attempting to delete a system configuration will return an error.
:::

**Response**

```javascript
{
    id: "config-id-456",
    deleted: true
}
```

---

## Common Patterns

### Pattern 1 — GDPR-Compliant EU Storage

Ensure documents and recordings for EU customers never leave EU infrastructure:

```javascript
// 1. Create a strict EU-only configuration
const euConfig = await api.storage.createStorageConfiguration({
    classification: 'documents',
    country: 'EU',
    s3Regions: ['eu-west-1', 'eu-central-1'],
    gccRegions: ['europe-west1', 'europe-north1'],
    azureRegions: ['westeurope', 'northeurope'],
    minimumProviders: 2,
    minimumRegionsS3: 1,
    minimumRegionsGCC: 1,
    minimumRegionsAzure: 0,
});

// 2. Upload a document using EU storage
const uploadResult = await api.storage.upload({
    file: documentBuffer,
    fileName: 'contract.pdf',
    classification: 'documents',
    country: 'EU',
    folder: 'contracts',
});

console.log('Stored at:', uploadResult.uploaded[0].id);
```

### Pattern 2 — Audit Storage Configurations Before Upload

Check what configurations are active and auto-provision any missing ones:

```javascript
async function ensureStorageConfig(api, classification, country) {
    const { configurations } = await api.storage.listStorageConfigurations({
        classification,
    });

    const existing = configurations.find(
        c => c.country === country && c.classification === classification
    );

    if (existing) {
        console.log(`Config found: ${existing.id}`);
        return existing;
    }

    console.warn(`No ${country} ${classification} config found — creating one`);
    const created = await api.storage.createStorageConfiguration({
        classification,
        country,
        s3Regions: country === 'EU' ? ['eu-west-1'] : ['us-east-1'],
        minimumProviders: 1,
        minimumRegionsS3: 1,
        minimumRegionsGCC: 0,
        minimumRegionsAzure: 0,
    });
    return created;
}

// Usage — ensure config before uploading EU recordings
await ensureStorageConfig(api, 'recordings', 'EU');
const recording = await api.storage.upload({
    file: audioBuffer,
    fileName: 'call-recording.mp3',
    classification: 'recordings',
    country: 'EU',
});
```

### Pattern 3 — Rotating Signed Access Keys

Use `generateAccessKey` to create short-lived download URLs for temporary access:

```javascript
async function getTemporaryDownloadUrl(api, storageId, expiresInSeconds = 3600) {
    const { accessKey } = await api.storage.generateAccessKey(
        storageId,
        expiresInSeconds
    );

    const downloadUrl =
        `https://{namespace}.api.unbound.cx/storage/file/${storageId}` +
        `?key=${accessKey}`;

    return { url: downloadUrl, expiresIn: expiresInSeconds };
}

// Share a 1-hour download link
const { url } = await getTemporaryDownloadUrl(api, storageId, 3600);
res.json({ url });

// Share a 5-minute preview link
const { url: previewUrl } = await getTemporaryDownloadUrl(api, storageId, 300);
```

### Pattern 4 — Post-Call Recording Archiver

After a call ends, upload the recording, link it to the contact record, and set a 90-day TTL:

```javascript
async function archiveCallRecording(api, {
    audioBuffer,
    callId,
    contactId,
    agentId,
    durationSeconds,
    direction,   // 'inbound' | 'outbound'
}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${direction}-${callId}-${timestamp}.mp3`;

    const result = await api.storage.upload({
        file: audioBuffer,
        fileName,
        classification: 'recordings',
        folder: `calls/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        isPublic: false,
        country: 'US',
        expireAfter: '90d',        // auto-delete after 90 days
        relatedId: contactId,
        createAccessKey: true,
        accessKeyExpiresIn: 3600,  // 1-hour shareable link
    });

    const file = result.uploaded[0];
    if (!file) throw new Error('Upload failed');

    // Update the CDR record with storage reference
    await api.objects.update({
        object: 'callDetailRecords',
        where: { id: callId },
        update: {
            recordingStorageId: file.id,
            recordingDuration: durationSeconds,
            recordingUrl: file.url,
        },
    });

    console.log(`Recording archived: ${file.id} (${(file.fileSize / 1024).toFixed(1)} KB)`);
    return { storageId: file.id, downloadUrl: file.url };
}
```

### Pattern 5 — Batch Document Upload with Progress Tracking

Upload multiple files at once with per-file progress reporting (browser environment):

```javascript
async function uploadDocumentBatch(api, files, contactId) {
    const results = [];
    const errors = [];

    // Process in groups of 5 to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);

        const fileEntries = batch.map(f => ({
            file: f.buffer,
            fileName: f.name,
        }));

        const result = await api.storage.uploadFiles(fileEntries, {
            classification: 'documents',
            folder: `contacts/${contactId}/documents`,
            isPublic: false,
            relatedId: contactId,
            onProgress: (loaded, total) => {
                const pct = Math.round((loaded / total) * 100);
                console.log(`Batch ${Math.floor(i / batchSize) + 1}: ${pct}%`);
            },
        });

        results.push(...result.uploaded);
        errors.push(...result.errors);
    }

    console.log(`Uploaded: ${results.length}, Errors: ${errors.length}`);

    if (errors.length > 0) {
        console.warn('Failed uploads:', errors.map(e => e.fileName));
    }

    return { results, errors };
}
```

### Pattern 6 — Secure Document Delivery via Pre-Signed URL

Generate a short-lived download link for a document and email it to a recipient:

```javascript
async function sendDocumentLink(api, storageId, recipientEmail, expiresInMinutes = 60) {
    // 1. Generate a time-limited access key
    const { accessKey } = await api.storage.generateAccessKey(
        storageId,
        expiresInMinutes * 60
    );

    // 2. Build the signed URL
    const signedUrl =
        `https://{namespace}.api.unbound.cx/storage/file/${storageId}` +
        `?key=${accessKey}&download=true`;

    // 3. Get file metadata for the email body
    const info = await api.storage.getFileInfo(storageId);

    // 4. Send email via Unbound messaging
    await api.messaging.email.send({
        to: recipientEmail,
        subject: `Your document: ${info.fileName}`,
        html: `
            <p>Your document is ready for download:</p>
            <p><a href="${signedUrl}">${info.fileName}</a>
               (${(info.fileSize / 1024).toFixed(1)} KB)</p>
            <p>This link expires in ${expiresInMinutes} minutes.</p>
        `,
    });

    console.log(`Document link sent to ${recipientEmail}, expires in ${expiresInMinutes}m`);
    return { signedUrl, expiresIn: expiresInMinutes * 60 };
}
```

### Pattern 7 — Multi-Classification Upload Router

Detect file type and route to the correct classification and folder automatically:

```javascript
function classifyFile(fileName, mimeType) {
    if (mimeType.startsWith('audio/') || mimeType.startsWith('video/')) {
        return { classification: 'recordings', folder: 'media' };
    }
    if (['application/pdf', 'application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)) {
        return { classification: 'documents', folder: 'docs' };
    }
    if (mimeType.startsWith('image/')) {
        return { classification: 'images', folder: 'images' };
    }
    return { classification: 'generic', folder: 'misc' };
}

async function smartUpload(api, fileBuffer, fileName, mimeType, relatedId) {
    const { classification, folder } = classifyFile(fileName, mimeType);
    const year = new Date().getFullYear();

    const result = await api.storage.upload({
        file: fileBuffer,
        fileName,
        classification,
        folder: `${folder}/${year}`,
        isPublic: false,
        relatedId,
    });

    const file = result.uploaded[0];
    if (!file) {
        throw new Error(`Upload failed: ${result.errors[0]?.message || 'unknown error'}`);
    }

    console.log(`Uploaded as ${classification}: ${file.id}`);
    return file;
}
```

### Pattern 8 — Paginate and Audit All Stored Files

List all files for a folder, audit their metadata, and flag anomalies:

```javascript
async function auditStorageFolder(api, folder, classification = 'documents') {
    const allFiles = [];
    let offset = 0;
    const limit = 50;

    // Paginate through all files
    while (true) {
        const page = await api.storage.listFiles({
            folder,
            classification,
            limit,
            offset,
        });

        if (!page.files || page.files.length === 0) break;
        allFiles.push(...page.files);

        if (page.files.length < limit) break;
        offset += limit;
    }

    console.log(`Total files: ${allFiles.length}`);

    // Audit: flag files missing relatedId (orphaned files)
    const orphaned = allFiles.filter(f => !f.relatedId);
    console.log(`Orphaned (no relatedId): ${orphaned.length}`);

    // Audit: flag very large files (> 50 MB)
    const largeFiles = allFiles.filter(f => f.fileSize > 50 * 1024 * 1024);
    console.log(`Large files (> 50 MB): ${largeFiles.length}`);

    // Audit: flag files expiring in the next 7 days
    const soon = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const expiringFiles = allFiles.filter(f => f.expiresAt && new Date(f.expiresAt) < soon);
    console.log(`Expiring within 7 days: ${expiringFiles.length}`);

    return {
        total: allFiles.length,
        orphaned: orphaned.map(f => f.id),
        large: largeFiles.map(f => ({ id: f.id, sizeMB: (f.fileSize / 1024 / 1024).toFixed(1) })),
        expiring: expiringFiles.map(f => ({ id: f.id, expiresAt: f.expiresAt })),
    };
}
```

### Pattern 9 — Replace File Content on Update

Re-upload a document to replace its content while preserving the storage ID and linked records:

```javascript
async function replaceDocument(api, storageId, newBuffer, newFileName) {
    // Fetch current metadata to preserve context
    const current = await api.storage.getFileInfo(storageId);

    // Replace file content — storageId stays the same, linked records unchanged
    const updated = await api.storage.updateFile(storageId, {
        file: newBuffer,
        fileName: newFileName || current.fileName,
        classification: current.classification,
        folder: current.folder,
    });

    console.log(`Replaced: ${storageId}`);
    console.log(`Old size: ${(current.fileSize / 1024).toFixed(1)} KB`);
    console.log(`New size: ${(updated.fileSize / 1024).toFixed(1)} KB`);

    return updated;
}
```

### Pattern 10 — Profile Image Upload with Resize Hint

Upload a user profile image, store the storage ID on their contact record, and serve via a permanent URL:

```javascript
async function updateProfileImage(api, contactId, imageBuffer, originalFileName) {
    // Delete old profile image if one exists
    const contact = await api.objects.getById({
        object: 'contacts',
        id: contactId,
    });

    if (contact.profileImageStorageId) {
        try {
            await api.storage.deleteFile(contact.profileImageStorageId);
        } catch (err) {
            console.warn('Could not delete old profile image:', err.message);
        }
    }

    // Upload new profile image
    const ext = originalFileName.split('.').pop().toLowerCase();
    const result = await api.storage.upload({
        file: imageBuffer,
        fileName: `profile-${contactId}.${ext}`,
        classification: 'images',
        folder: 'profiles',
        isPublic: true,    // profile images are public
        relatedId: contactId,
    });

    const file = result.uploaded[0];
    if (!file) throw new Error('Profile image upload failed');

    // Update contact record with new image reference
    await api.objects.update({
        object: 'contacts',
        where: { id: contactId },
        update: {
            profileImageStorageId: file.id,
            profileImageUrl: file.url,
        },
    });

    console.log(`Profile image updated for contact ${contactId}: ${file.url}`);
    return { storageId: file.id, url: file.url };
}
