---
id: knowledge-base
title: Knowledge Base
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Knowledge Base

`api.knowledgeBase` — Build, search, and manage AI-powered knowledge bases for support teams and customer portals.

---

## Overview

A knowledge base holds a collection of articles that agents and AI systems can search against. The typical workflow is:

1. **Discover** pages from a docs site → `knowledgeBase.discover()`
2. **Ingest** selected URLs → `knowledgeBase.ingest()`
3. **Search** articles at query time → `knowledgeBase.search()`
4. **Publish** draft articles when ready → `knowledgeBase.publish()`
5. **Monitor** analytics and knowledge gaps → `knowledgeBase.analytics()`

---

## `knowledgeBase.list(options?)`

List all knowledge bases in the namespace.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// List all knowledge bases
const kbs = await api.knowledgeBase.list();

// With pagination
const kbs = await api.knowledgeBase.list({
    limit: 25,
    offset: 0,
});

console.log(kbs[0].name);         // "Customer Support KB"
console.log(kbs[0].articleCount); // 142
console.log(kbs[0].status);       // "active"
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// List all knowledge bases
const response = await fetch('https://{namespace}.api.unbound.cx/knowledge-base?limit=25', {
    headers: {
        'Authorization': 'Bearer {token}',
    },
});
const kbs = await response.json();

console.log(kbs[0].name);         // "Customer Support KB"
console.log(kbs[0].articleCount); // 142
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

echo $kbs[0]['name'];         // "Customer Support KB"
echo $kbs[0]['articleCount']; // 142
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

print(kbs[0]['name'])         # "Customer Support KB"
print(kbs[0]['articleCount']) # 142
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl "https://{namespace}.api.unbound.cx/knowledge-base?limit=25" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `limit` | number | — | Max records returned. Default: `25` |
| `offset` | number | — | Pagination offset. Default: `0` |

**Response**

```javascript
[
    {
        id: "kb-id-123",
        name: "Customer Support KB",
        description: "All support articles for the helpdesk",
        status: "active",            // "active" | "draft" | "archived"
        articleCount: 142,
        language: "en",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-06-01T09:22:00Z"
    },
    // ...
]
```

---

## `knowledgeBase.get(id)`

Get a single knowledge base by ID, including article counts and status.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const kb = await api.knowledgeBase.get('kb-id-123');

console.log(kb.name);         // "Customer Support KB"
console.log(kb.articleCount); // 142
console.log(kb.status);       // "active"
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

console.log(kb.name);         // "Customer Support KB"
console.log(kb.articleCount); // 142
console.log(kb.status);       // "active"
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
curl_close($ch);

echo $kb['name'];         // "Customer Support KB"
echo $kb['articleCount']; // 142
echo $kb['status'];       // "active"
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

print(kb['name'])         # "Customer Support KB"
print(kb['articleCount']) # 142
print(kb['status'])       # "active"
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123 \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Response**

```javascript
{
    id: "kb-id-123",
    name: "Customer Support KB",
    description: "All support articles for the helpdesk",
    status: "active",          // "active" | "draft" | "archived"
    articleCount: 142,
    publishedArticleCount: 138,
    draftArticleCount: 4,
    language: "en",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-06-01T09:22:00Z"
}
```

---

## `knowledgeBase.search(query, options?)`

Semantic search across knowledge base articles. Returns ranked results with relevance scores and content snippets.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Basic search across all KBs
const results = await api.knowledgeBase.search('how to reset password');

// Search within a specific KB
const results = await api.knowledgeBase.search('how to reset password', {
    kbId: 'kb-id-123',
    limit: 10,
});

console.log(results[0].title);   // "Password Reset Guide"
console.log(results[0].content); // article body
console.log(results[0].score);   // 0.94 (0–1, higher = more relevant)
console.log(results[0].url);     // source URL if ingested from web

// Filter to high-confidence results only
const topResults = results.filter(r => r.score > 0.7);
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

console.log(results[0].title);   // "Password Reset Guide"
console.log(results[0].content); // article body
console.log(results[0].score);   // 0.94
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

echo $results[0]['title'];   // "Password Reset Guide"
echo $results[0]['score'];   // 0.94
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

print(results[0]['title'])   # "Password Reset Guide"
print(results[0]['score'])   # 0.94
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
DATA=$(cat <<'EOF'
{
  "query": "how to reset password",
  "kbId": "kb-id-123",
  "limit": 10
}
EOF
)

curl -X POST https://{namespace}.api.unbound.cx/knowledge-base/search \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | ✅ | Natural-language search query |
| `kbId` | string | — | Limit search to a specific knowledge base ID. Omit to search all KBs |
| `limit` | number | — | Max results. Default: `10` |

**Response**

```javascript
[
    {
        id: "article-id-456",
        kbId: "kb-id-123",
        title: "Password Reset Guide",
        content: "To reset your password, click the 'Forgot Password' link...",
        snippet: "...click the 'Forgot Password' link on the login page and enter your email...",
        score: 0.94,               // 0–1, higher = more semantically relevant
        url: "https://docs.yourcompany.com/password-reset",
        status: "published",       // "published" | "draft"
        createdAt: "2024-02-01T08:00:00Z",
        updatedAt: "2024-05-15T14:30:00Z"
    },
    // ...
]
```

:::tip
Scores above `0.7` are generally high-confidence matches. For AI-assisted agent responses, pass the top 2–3 results as context rather than just the top one.
:::

---

## `knowledgeBase.ingest(url, options)`

Fetch and index a URL's content into a knowledge base. The platform crawls the page, extracts text, and creates a searchable article.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Ingest a single FAQ page
const result = await api.knowledgeBase.ingest(
    'https://docs.yourcompany.com/faq',
    { kbId: 'kb-id-123' }
);
console.log(result.articleId); // "article-id-789"
console.log(result.status);    // "processing" | "completed"

// Ingest with custom title override
const result = await api.knowledgeBase.ingest(
    'https://docs.yourcompany.com/billing',
    {
        kbId: 'kb-id-123',
        title: 'Billing & Payments FAQ',
    }
);

// Ingest and immediately publish
const result = await api.knowledgeBase.ingest(
    'https://docs.yourcompany.com/getting-started',
    {
        kbId: 'kb-id-123',
        publish: true,
    }
);
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Ingest a single page
const response = await fetch('https://{namespace}.api.unbound.cx/knowledge-base/ingest', {
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
const result = await response.json();
console.log(result.articleId); // "article-id-789"

// Ingest with custom title and publish
const response2 = await fetch('https://{namespace}.api.unbound.cx/knowledge-base/ingest', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        url: 'https://docs.yourcompany.com/billing',
        kbId: 'kb-id-123',
        title: 'Billing & Payments FAQ',
        publish: true,
    }),
});
const result2 = await response2.json();
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
// Ingest a single page
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
$result = json_decode(curl_exec($ch), true);
curl_close($ch);

echo $result['articleId']; // "article-id-789"

// Ingest with custom title and publish
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base/ingest');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer {token}',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'url' => 'https://docs.yourcompany.com/billing',
    'kbId' => 'kb-id-123',
    'title' => 'Billing & Payments FAQ',
    'publish' => true,
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = json_decode(curl_exec($ch), true);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Ingest a single page
response = requests.post(
    'https://{namespace}.api.unbound.cx/knowledge-base/ingest',
    headers={'Authorization': 'Bearer {token}'},
    json={
        'url': 'https://docs.yourcompany.com/faq',
        'kbId': 'kb-id-123',
    }
)
result = response.json()
print(result['articleId'])  # "article-id-789"

# Ingest with custom title and publish
response2 = requests.post(
    'https://{namespace}.api.unbound.cx/knowledge-base/ingest',
    headers={'Authorization': 'Bearer {token}'},
    json={
        'url': 'https://docs.yourcompany.com/billing',
        'kbId': 'kb-id-123',
        'title': 'Billing & Payments FAQ',
        'publish': True,
    }
)
result2 = response2.json()
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# Ingest a single page
DATA=$(cat <<'EOF'
{
  "url": "https://docs.yourcompany.com/faq",
  "kbId": "kb-id-123"
}
EOF
)

curl -X POST https://{namespace}.api.unbound.cx/knowledge-base/ingest \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d "$DATA"

# Ingest with title override and auto-publish
curl -X POST https://{namespace}.api.unbound.cx/knowledge-base/ingest \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://docs.yourcompany.com/billing", "kbId": "kb-id-123", "title": "Billing FAQ", "publish": true}'
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string | ✅ | URL to crawl and index |
| `kbId` | string | ✅ | Knowledge base to add the article to |
| `title` | string | — | Override the article title (defaults to page `<title>`) |
| `publish` | boolean | — | Publish the article immediately. Default: `false` (creates as draft) |

**Response**

```javascript
{
    articleId: "article-id-789",
    kbId: "kb-id-123",
    url: "https://docs.yourcompany.com/faq",
    title: "Frequently Asked Questions",
    status: "processing",   // "processing" | "completed" | "failed"
    createdAt: "2024-06-01T12:00:00Z"
}
```

:::note
Ingestion is asynchronous. The article will be searchable once `status` becomes `"completed"`. For large pages, this typically takes a few seconds.
:::

---

## `knowledgeBase.discover(url)`

Crawl a URL and return all discoverable pages — useful for bulk ingestion workflows. Returns a list of URLs and titles found at the given root URL.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// Discover all pages under a docs site
const pages = await api.knowledgeBase.discover('https://docs.yourcompany.com');

console.log(pages.length);       // 47
console.log(pages[0].url);       // "https://docs.yourcompany.com/getting-started"
console.log(pages[0].title);     // "Getting Started"

// Filter to relevant sections before ingesting
const supportPages = pages.filter(p =>
    p.url.includes('/support') || p.url.includes('/faq')
);

// Ingest only the filtered pages
for (const page of supportPages) {
    await api.knowledgeBase.ingest(page.url, {
        kbId: 'kb-id-123',
        publish: true,
    });
}
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// Discover all pages under a docs site
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

console.log(pages.length);   // 47
console.log(pages[0].url);   // "https://docs.yourcompany.com/getting-started"
console.log(pages[0].title); // "Getting Started"
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

echo count($pages);          // 47
echo $pages[0]['url'];       // "https://docs.yourcompany.com/getting-started"
echo $pages[0]['title'];     // "Getting Started"
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

print(len(pages))           # 47
print(pages[0]['url'])      # "https://docs.yourcompany.com/getting-started"
print(pages[0]['title'])    # "Getting Started"
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

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string | ✅ | Root URL to crawl. All pages found under this domain/path are returned |

**Response**

```javascript
[
    {
        url: "https://docs.yourcompany.com/getting-started",
        title: "Getting Started Guide"
    },
    {
        url: "https://docs.yourcompany.com/faq",
        title: "Frequently Asked Questions"
    },
    {
        url: "https://docs.yourcompany.com/billing",
        title: "Billing & Payments"
    },
    // ...
]
```

---

## `knowledgeBase.analytics(kbId, options?)`

Get usage analytics for a knowledge base — search volumes, top queries, click-through rates, and knowledge gaps (queries that returned no useful results).

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
// General usage analytics
const analytics = await api.knowledgeBase.analytics('kb-id-123');

console.log(analytics.totalSearches);   // 1842
console.log(analytics.topQueries[0]);   // { query: "reset password", count: 234 }
console.log(analytics.avgScore);        // 0.81

// Knowledge gaps — queries with no good results
const gaps = await api.knowledgeBase.analytics('kb-id-123', {
    gaps: true,
});

console.log(gaps[0].query);  // "refund processing time"
console.log(gaps[0].count);  // 47 — how often this was asked with poor results
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
// General usage analytics
const response = await fetch(
    'https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics',
    { headers: { 'Authorization': 'Bearer {token}' } }
);
const analytics = await response.json();

console.log(analytics.totalSearches); // 1842

// Knowledge gaps
const response2 = await fetch(
    'https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics?gaps=true',
    { headers: { 'Authorization': 'Bearer {token}' } }
);
const gaps = await response2.json();

console.log(gaps[0].query); // "refund processing time"
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
// General usage analytics
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$analytics = json_decode(curl_exec($ch), true);
curl_close($ch);

echo $analytics['totalSearches']; // 1842

// Knowledge gaps
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics?gaps=true');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$gaps = json_decode(curl_exec($ch), true);
curl_close($ch);

echo $gaps[0]['query']; // "refund processing time"
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# General usage analytics
response = requests.get(
    'https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics',
    headers={'Authorization': 'Bearer {token}'}
)
analytics = response.json()

print(analytics['totalSearches'])  # 1842

# Knowledge gaps
response = requests.get(
    'https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics',
    headers={'Authorization': 'Bearer {token}'},
    params={'gaps': 'true'}
)
gaps = response.json()

print(gaps[0]['query'])  # "refund processing time"
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
# General usage analytics
curl https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics \
  -H "Authorization: Bearer {token}"

# Knowledge gaps — queries that returned no results
curl "https://{namespace}.api.unbound.cx/knowledge-base/kb-id-123/analytics?gaps=true" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `kbId` | string | ✅ | Knowledge base ID to analyze |
| `gaps` | boolean | — | If `true`, returns queries with no useful results instead of general analytics |

**Response — usage analytics**

```javascript
{
    kbId: "kb-id-123",
    totalSearches: 1842,
    uniqueQueries: 634,
    avgScore: 0.81,            // average relevance of top result across all searches
    topQueries: [
        { query: "reset password", count: 234, avgScore: 0.95 },
        { query: "billing issues", count: 187, avgScore: 0.88 },
        { query: "cancel subscription", count: 142, avgScore: 0.79 }
    ],
    searchesByDay: [
        { date: "2024-06-01", count: 62 },
        { date: "2024-06-02", count: 71 },
        // ...
    ]
}
```

**Response — knowledge gaps (`gaps: true`)**

```javascript
[
    {
        query: "refund processing time",
        count: 47,           // times searched with poor results
        avgScore: 0.31       // low score = no good article exists
    },
    {
        query: "export data csv",
        count: 38,
        avgScore: 0.28
    },
    // ...
]
```

:::tip
Knowledge gaps are the highest-value input for your content calendar. Any query with `count > 10` and `avgScore < 0.5` is a strong signal that a new article is needed.
:::

---

## `knowledgeBase.publish(articleId)`

Publish a draft knowledge base article, making it live for search and AI retrieval.

<Tabs groupId="lang">
<TabItem value="sdk" label="SDK">

```javascript
const result = await api.knowledgeBase.publish('article-id-456');
console.log(result.status); // "published"
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch(
    'https://{namespace}.api.unbound.cx/knowledge-base/articles/article-id-456/publish',
    {
        method: 'POST',
        headers: { 'Authorization': 'Bearer {token}' },
    }
);
const result = await response.json();
console.log(result.status); // "published"
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://{namespace}.api.unbound.cx/knowledge-base/articles/article-id-456/publish');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer {token}']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = json_decode(curl_exec($ch), true);
curl_close($ch);

echo $result['status']; // "published"
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    'https://{namespace}.api.unbound.cx/knowledge-base/articles/article-id-456/publish',
    headers={'Authorization': 'Bearer {token}'}
)
result = response.json()

print(result['status'])  # "published"
```

</TabItem>
<TabItem value="curl" label="cURL">

```bash
curl -X POST https://{namespace}.api.unbound.cx/knowledge-base/articles/article-id-456/publish \
  -H "Authorization: Bearer {token}"
```

</TabItem>
</Tabs>

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `articleId` | string | ✅ | Article to publish |

**Response**

```javascript
{
    articleId: "article-id-456",
    kbId: "kb-id-123",
    status: "published",
    publishedAt: "2024-06-01T12:30:00Z"
}
```

---

## Common Patterns

### Pattern 1 — Bootstrap a KB from a Docs Site

Discover all pages, filter to relevant sections, then bulk-ingest and publish:

```javascript
async function bootstrapKnowledgeBase(api, kbId, docsUrl) {
    console.log(`Discovering pages at ${docsUrl}...`);
    const pages = await api.knowledgeBase.discover(docsUrl);
    console.log(`Found ${pages.length} pages`);

    // Filter out changelog, API reference, and internal pages
    const skipPatterns = ['/changelog', '/api-reference', '/internal', '/404'];
    const relevantPages = pages.filter(page =>
        !skipPatterns.some(pattern => page.url.includes(pattern))
    );
    console.log(`Ingesting ${relevantPages.length} relevant pages...`);

    // Ingest in batches of 5 to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < relevantPages.length; i += batchSize) {
        const batch = relevantPages.slice(i, i + batchSize);
        await Promise.all(
            batch.map(page =>
                api.knowledgeBase.ingest(page.url, {
                    kbId,
                    publish: true,
                })
            )
        );
        console.log(`Ingested batch ${Math.floor(i / batchSize) + 1}`);
        // Brief pause between batches
        await new Promise(r => setTimeout(r, 500));
    }

    const kb = await api.knowledgeBase.get(kbId);
    console.log(`Done. KB now has ${kb.articleCount} articles.`);
}

await bootstrapKnowledgeBase(api, 'kb-id-123', 'https://docs.yourcompany.com');
```

---

### Pattern 2 — AI Agent with KB Grounding

Use knowledge base search to ground AI generative responses with real documentation:

```javascript
async function agentWithKB(api, userQuestion, kbId) {
    // 1. Search the KB for relevant context
    const results = await api.knowledgeBase.search(userQuestion, {
        kbId,
        limit: 3,
    });

    // 2. Filter to high-confidence hits
    const goodResults = results.filter(r => r.score > 0.65);

    if (goodResults.length === 0) {
        // No good KB context — let agent respond from training only
        return api.ai.generative.chat({
            message: userQuestion,
            systemPrompt: 'You are a helpful customer support agent.',
        });
    }

    // 3. Build grounded context from KB articles
    const context = goodResults
        .map(r => `## ${r.title}\n${r.snippet}`)
        .join('\n\n---\n\n');

    // 4. Generate a grounded response
    const response = await api.ai.generative.chat({
        message: userQuestion,
        systemPrompt: `You are a customer support agent. Use only the following documentation to answer:

${context}

If the answer is not in the documentation, say so clearly.`,
    });

    return {
        answer: response.content,
        sources: goodResults.map(r => ({ title: r.title, url: r.url })),
    };
}

const { answer, sources } = await agentWithKB(
    api,
    'How do I export my contacts to CSV?',
    'kb-id-123'
);
console.log('Answer:', answer);
console.log('Sources:', sources);
```

---

### Pattern 3 — Live Agent Assist (Surface KB During a Call)

During a live support call, surface relevant KB articles as the customer speaks:

```javascript
// Called when the live transcript updates with a new customer utterance
async function agentAssist(api, kbId, customerUtterance) {
    if (customerUtterance.trim().length < 10) {
        return null;   // too short to be meaningful
    }

    const results = await api.knowledgeBase.search(customerUtterance, {
        kbId,
        limit: 2,
    });

    const topResult = results[0];
    if (!topResult || topResult.score < 0.70) {
        return null;   // no confident match
    }

    // Return suggestion for the agent UI overlay
    return {
        title: topResult.title,
        snippet: topResult.snippet,
        url: topResult.url,
        confidence: Math.round(topResult.score * 100),
    };
}

// Wire into the ai.stt transcription stream
const suggestion = await agentAssist(
    api,
    'kb-support',
    'I was charged twice for my subscription this month'
);

if (suggestion) {
    // Push to agent UI via WebSocket or subscription
    agentSocket.emit('kb-suggestion', suggestion);
}
```

---

### Pattern 4 — Weekly Knowledge Gap Review

Run weekly to surface questions customers are asking that aren't covered by existing articles:

```javascript
async function weeklyGapReport(api) {
    const kbs = await api.knowledgeBase.list();

    const report = [];

    for (const kb of kbs) {
        const gaps = await api.knowledgeBase.analytics(kb.id, { gaps: true });

        // Only report gaps asked more than 5 times with very low scores
        const actionable = gaps.filter(g => g.count >= 5 && g.avgScore < 0.45);

        if (actionable.length > 0) {
            report.push({
                kbName: kb.name,
                kbId: kb.id,
                gaps: actionable.slice(0, 10),   // top 10 per KB
            });
        }
    }

    // Format for Slack/email delivery
    const summary = report.map(r => {
        const gapList = r.gaps
            .map(g => `  - "${g.query}" (asked ${g.count}x, avg score ${g.avgScore.toFixed(2)})`)
            .join('\n');
        return `*${r.kbName}* — ${r.gaps.length} gaps:\n${gapList}`;
    }).join('\n\n');

    console.log('Weekly KB Gap Report:\n' + summary);
    return report;
}

const report = await weeklyGapReport(api);
```

---

### Pattern 5 — Incremental Docs Sync

Re-ingest changed pages when your docs site updates (e.g., via CI/CD webhook):

```javascript
// Called by CI/CD when docs pages are deployed
async function syncDocsPages(api, kbId, changedUrls) {
    console.log(`Syncing ${changedUrls.length} changed pages to KB ${kbId}`);

    const results = await Promise.allSettled(
        changedUrls.map(url =>
            api.knowledgeBase.ingest(url, {
                kbId,
                publish: true,
            })
        )
    );

    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results
        .filter(r => r.status === 'rejected')
        .map((r, i) => ({ url: changedUrls[i], error: r.reason.message }));

    console.log(`Synced ${succeeded}/${changedUrls.length} pages`);
    if (failed.length > 0) {
        console.error('Failed pages:', failed);
    }

    return { succeeded, failed };
}

// Example: called from a deployment webhook
await syncDocsPages(api, 'kb-id-123', [
    'https://docs.yourcompany.com/billing',
    'https://docs.yourcompany.com/refunds',
]);
```

---

### Pattern 6 — Multi-KB Search with Source Attribution

Search multiple knowledge bases and return merged, deduplicated results with clear attribution:

```javascript
async function multiKbSearch(api, query, kbIds) {
    // Search all KBs in parallel
    const searches = await Promise.all(
        kbIds.map(kbId =>
            api.knowledgeBase.search(query, { kbId, limit: 5 })
                .then(results => results.map(r => ({ ...r, kbId })))
        )
    );

    // Flatten, deduplicate by URL, and sort by score
    const seen = new Set();
    const merged = searches
        .flat()
        .filter(r => {
            if (seen.has(r.url)) return false;
            seen.add(r.url);
            return r.score > 0.5;
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    return merged;
}

// Search across product docs and support KB simultaneously
const results = await multiKbSearch(
    api,
    'how to connect to Salesforce',
    ['kb-product-docs', 'kb-support-articles', 'kb-integration-guides']
);

for (const r of results) {
    console.log(`[${r.kbId}] ${r.title} (score: ${r.score.toFixed(2)})`);
    console.log(`  ${r.url}`);
}
```
