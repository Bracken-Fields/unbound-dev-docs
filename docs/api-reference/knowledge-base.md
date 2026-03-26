---
id: knowledge-base
title: Knowledge Base
---

# Knowledge Base

`api.knowledgeBase` — Build, search, and manage AI-powered knowledge bases for support teams and customer portals.

---

## `knowledgeBase.list(options?)`

List all knowledge bases.

```javascript
const kbs = await api.knowledgeBase.list({
    limit: 25,
});
```

---

## `knowledgeBase.get(id)`

Get a knowledge base by ID.

```javascript
const kb = await api.knowledgeBase.get('kb-id-123');
// kb.name, kb.articleCount, kb.status
```

---

## `knowledgeBase.search(query, options?)`

Search across knowledge base articles using semantic search.

```javascript
const results = await api.knowledgeBase.search('how to reset password', {
    kbId: 'kb-id-123',
    limit: 10,
});

// results[0].title → 'Password Reset Guide'
// results[0].content → article content
// results[0].score → relevance score
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | Yes | Search query |
| `kbId` | string | — | Limit search to a specific knowledge base |
| `limit` | number | — | Max results (default: 10) |

---

## `knowledgeBase.ingest(url, options)`

Ingest a URL's content into the knowledge base.

```javascript
await api.knowledgeBase.ingest('https://docs.yourcompany.com/faq', {
    kbId: 'kb-id-123',
});
```

---

## `knowledgeBase.discover(url)`

Discover all pages at a URL for potential ingestion.

```javascript
const pages = await api.knowledgeBase.discover('https://docs.yourcompany.com');
// pages → [{ url: '...', title: '...' }, ...]
```

---

## `knowledgeBase.analytics(kbId, options?)`

Get usage analytics and knowledge gaps for a knowledge base.

```javascript
// Usage analytics
const analytics = await api.knowledgeBase.analytics('kb-id-123');

// Knowledge gaps — queries that returned no results
const gaps = await api.knowledgeBase.analytics('kb-id-123', {
    gaps: true,
});
```

---

## `knowledgeBase.publish(articleId)`

Publish a draft knowledge base article.

```javascript
await api.knowledgeBase.publish('article-id-456');
```
