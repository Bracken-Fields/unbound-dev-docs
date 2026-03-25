---
id: transports
title: Transports
---

# Transports

The SDK automatically selects the best transport based on your environment. You can also add custom transports.

## Default Behavior

| Environment | Primary | Fallback |
|---|---|---|
| Node.js | NATS | HTTP |
| Browser | WebSocket | HTTP |
| All | HTTP | — |

## Custom Transport

```javascript
import SDK from '@unboundcx/sdk';

class CustomTransport {
  constructor(config) {
    this.config = config;
    this.name = 'custom';
  }

  getPriority() {
    return 10; // Lower number = higher priority
  }

  async isAvailable() {
    return true; // Return false to skip this transport
  }

  async request(endpoint, method, params, options) {
    // Implement your transport logic
    const response = await myCustomFetch(endpoint, method, params);
    return response;
  }
}

const api = new SDK({ namespace: 'namespace', token: 'token' });
api.addTransport(new CustomTransport({ /* config */ }));
```

## Extensions

Extend the SDK with custom methods:

```javascript
const api = new SDK({ namespace: 'namespace' });

api.extend({
  getActiveContacts: function() {
    return this.objects.query('contacts', {
      filters: [{ field: 'status', operator: 'eq', value: 'active' }],
    });
  },
});

// Use it
const contacts = await api.getActiveContacts();
```
