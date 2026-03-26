---
id: knowledge-base
title: Knowledge Base
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Knowledge Base

`api.knowledgeBase` — Build, search, and manage AI-powered knowledge bases for support teams and customer portals.

---

## `knowledgeBase.list(options?)`

List all knowledge bases.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const kbs = await api.knowledgeBase.list({
    limit: 25,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/knowledge-base?limit=25', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const kbs = await response.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base?limit=25');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$kbs = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/knowledge-base',
    headers={'Authorization': 'Bearer {token}'},
    params={'limit': 25}
)
kbs = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/knowledge-base?limit=25" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `knowledgeBase.get(id)`

Get a knowledge base by ID.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const kb = await api.knowledgeBase.get('kb-id-123');
// kb.name, kb.articleCount, kb.status
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const kb = await response.json();
// kb.name, kb.articleCount, kb.status
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$kb = json_decode(curl_exec($ch), true);
// $kb['name'], $kb['articleCount'], $kb['status']
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123',
    headers={'Authorization': 'Bearer {token}'}
)
kb = response.json()
# kb['name'], kb['articleCount'], kb['status']
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123 \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `knowledgeBase.search(query, options?)`

Search across knowledge base articles using semantic search.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const results = await api.knowledgeBase.search('how to reset password', {
    kbId: 'kb-id-123',
    limit: 10,
});

// results[0].title → 'Password Reset Guide'
// results[0].content → article content
// results[0].score → relevance score
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/knowledge-base/search', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: 'how to reset password',
        kbId: 'kb-id-123',
        limit: 10,
    }),
});
const results = await response.json();

// results[0].title → 'Password Reset Guide'
// results[0].content → article content
// results[0].score → relevance score
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base/search');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'query' => 'how to reset password',
    'kbId' => 'kb-id-123',
    'limit' => 10,
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$results = json_decode(curl_exec($ch), true);
curl_close($ch);

// $results[0]['title'] → 'Password Reset Guide'
// $results[0]['content'] → article content
// $results[0]['score'] → relevance score
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/knowledge-base/search',
    headers={'Authorization': 'Bearer {token}'},
    json={
        'query': 'how to reset password',
        'kbId': 'kb-id-123',
        'limit': 10,
    }
)
results = response.json()

# results[0]['title'] → 'Password Reset Guide'
# results[0]['content'] → article content
# results[0]['score'] → relevance score
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST https://{namespace}.api.unbound.cx/knowledge-base/search \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "how to reset password",
    "kbId": "kb-id-123",
    "limit": 10
  }'
```

</TabItem>
</Tabs>

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | Yes | Search query |
| `kbId` | string | — | Limit search to a specific knowledge base |
| `limit` | number | — | Max results (default: 10) |

---

## `knowledgeBase.ingest(url, options)`

Ingest a URL's content into the knowledge base.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.knowledgeBase.ingest('https://docs.yourcompany.com/faq', {
    kbId: 'kb-id-123',
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch('https://{namespace}.api.unbound.cx/knowledge-base/ingest', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        url: 'https://docs.yourcompany.com/faq',
        kbId: 'kb-id-123',
    }),
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base/ingest');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'url' => 'https://docs.yourcompany.com/faq',
    'kbId' => 'kb-id-123',
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

requests.post(
    'https://{namespace}.api.unbound.cx/knowledge-base/ingest',
    headers={'Authorization': 'Bearer {token}'},
    json={
        'url': 'https://docs.yourcompany.com/faq',
        'kbId': 'kb-id-123',
    }
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST https://{namespace}.api.unbound.cx/knowledge-base/ingest \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.yourcompany.com/faq",
    "kbId": "kb-id-123"
  }'
```

</TabItem>
</Tabs>

---

## `knowledgeBase.discover(url)`

Discover all pages at a URL for potential ingestion.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const pages = await api.knowledgeBase.discover('https://docs.yourcompany.com');
// pages → [{ url: '...', title: '...' }, ...]
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch('https://{namespace}.api.unbound.cx/knowledge-base/discover', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        url: 'https://docs.yourcompany.com',
    }),
});
const pages = await response.json();
// pages → [{ url: '...', title: '...' }, ...]
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base/discover');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'url' => 'https://docs.yourcompany.com',
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$pages = json_decode(curl_exec($ch), true);
curl_close($ch);
// $pages → [['url' => '...', 'title' => '...'], ...]
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/knowledge-base/discover',
    headers={'Authorization': 'Bearer {token}'},
    json={'url': 'https://docs.yourcompany.com'}
)
pages = response.json()
# pages → [{'url': '...', 'title': '...'}, ...]
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST https://{namespace}.api.unbound.cx/knowledge-base/discover \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://docs.yourcompany.com"}'
```

</TabItem>
</Tabs>

---

## `knowledgeBase.analytics(kbId, options?)`

Get usage analytics and knowledge gaps for a knowledge base.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Usage analytics
const analytics = await api.knowledgeBase.analytics('kb-id-123');

// Knowledge gaps — queries that returned no results
const gaps = await api.knowledgeBase.analytics('kb-id-123', {
    gaps: true,
});
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Usage analytics
const response = await fetch('https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const analytics = await response.json();

// Knowledge gaps — queries that returned no results
const response2 = await fetch('https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics?gaps=true', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const gaps = await response2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
// Usage analytics
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$analytics = json_decode(curl_exec($ch), true);
curl_close($ch);

// Knowledge gaps — queries that returned no results
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics?gaps=true');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$gaps = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Usage analytics
response = requests.get(
    'https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics',
    headers={'Authorization': 'Bearer {token}'}
)
analytics = response.json()

# Knowledge gaps — queries that returned no results
response = requests.get(
    'https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics',
    headers={'Authorization': 'Bearer {token}'},
    params={'gaps': 'true'}
)
gaps = response.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Usage analytics
curl https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics \
  -H "Authorization: Bearer {token}"

# Knowledge gaps — queries that returned no results
curl "https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics?gaps=true" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

---

## `knowledgeBase.publish(articleId)`

Publish a draft knowledge base article.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
await api.knowledgeBase.publish('article-id-456');
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
await fetch('https://{namespace}.api.unbound.cx/knowledge-base/articles/article-id-456/publish', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base/articles/article-id-456/publish');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

requests.post(
    'https://{namespace}.api.unbound.cx/knowledge-base/articles/article-id-456/publish',
    headers={'Authorization': 'Bearer {token}'}
)
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST https://{namespace}.api.unbound.cx/knowledge-base/articles/article-id-456/publish \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>
