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

Update file contents or metadata.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

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

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const fs = require("fs");
const FormData = require("form-data");

// Replace file content
const form = new FormData();
form.append("file", fs.createReadStream("updated-contract.pdf"));
form.append("fileName", "updated-contract.pdf");
form.append("classification", "legal");
form.append("isPublic", "true");

const res = await fetch("https://{namespace}.api.unbound.cx/storage/storage-id-123", {
  method: "PUT",
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
    "isPublic"       => "true"
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

with open("updated-contract.pdf", "rb") as f:
    response = requests.put(
        "https://{namespace}.api.unbound.cx/storage/storage-id-123",
        headers={"Authorization": "Bearer {token}"},
        files={"file": ("updated-contract.pdf", f, "application/pdf")},
        data={
            "fileName": "updated-contract.pdf",
            "classification": "legal",
            "isPublic": "true"
        }
    )
data = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "https://{namespace}.api.unbound.cx/storage/storage-id-123" \
  -H "Authorization: Bearer {token}" \
  -F "file=@updated-contract.pdf" \
  -F "fileName=updated-contract.pdf" \
  -F "classification=legal" \
  -F "isPublic=true"
```

</TabItem>
</Tabs>

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
