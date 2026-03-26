---
id: send-sms
title: Send Your First SMS
---

# Send Your First SMS

This guide walks through authenticating and sending an outbound SMS in under 10 lines of code.

## Prerequisites

- Node.js 16+
- An Unbound namespace and credentials
- A provisioned phone number in your namespace

## 1. Install the SDK

```bash
npm install @unboundcx/sdk
```

## 2. Authenticate

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'your-namespace' });

await api.login.login('your-username', 'your-password');
```

## 3. Send the SMS

```javascript
const sms = await api.messaging.sms.send({
    from: '+1234567890',   // Your Unbound DID
    to: '+0987654321',     // Recipient
    message: 'Hello from Unbound! 👋',
});

console.log('Message SID:', sms.id);
console.log('Status:', sms.status);
```

## Full Example

```javascript
import SDK from '@unboundcx/sdk';

async function main() {
    const api = new SDK({ namespace: 'your-namespace' });

    await api.login.login('your-username', 'your-password');

    const sms = await api.messaging.sms.send({
        from: '+1234567890',
        to: '+0987654321',
        message: 'Hello from Unbound!',
    });

    console.log('Sent:', sms.id, '| Status:', sms.status);
}

main().catch(console.error);
```

## What's Next

- [Send Email](/api-reference/messaging#email)
- [SMS Templates](/api-reference/messaging#sms-templates)
- [Campaigns](/api-reference/messaging#campaigns)
