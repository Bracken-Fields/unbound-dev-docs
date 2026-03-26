---
id: integrate-auth
title: Integrate with Unbound Auth
---

# Integrate with Unbound Auth

This guide covers how to connect any web application to Unbound's centralized login system. Unbound supports Google OAuth, Microsoft OAuth, and email/password authentication via Firebase — and any internal service can delegate auth to it with a redirect-and-validate flow.

---

## Prerequisites

- Your app must be served over **HTTPS**. The `authToken` cookie is set with `secure: true` and `sameSite: none` — it will not be sent over plain HTTP.
- Your app must share a **common base domain** with the Unbound API (`app1svc.com`). Any subdomain (e.g., `myapp.dev-d01.app1svc.com`) will receive the cookie automatically.
- Your reverse proxy (Nginx, etc.) should pass the `X-Forwarded-Proto` header so your app knows the original request was HTTPS.

---

## How It Works

1. User visits your app with no valid session
2. Your app redirects to the Unbound login portal with a `referenceUrl` pointing back
3. User authenticates (Google, Microsoft, or email/password)
4. User selects an account if they belong to multiple
5. Login portal redirects back to your `referenceUrl` with the `authToken` cookie set
6. Your app validates the session by calling `/login/validate` on the API

---

## Step 1: Redirect to Login

When a user hits your app without a valid session, redirect them to the login portal:

```
https://login.{region}.app1svc.com/?referenceUrl=https://myapp.{region}.app1svc.com/
```

**Available query parameters:**

| Parameter | Required | Description |
|---|---|---|
| `referenceUrl` | ✅ | Full URL to redirect back to after login. Must be URL-encoded. |
| `includeNamespace` | — | Set to `true` to append `?namespace={account_namespace}` to the redirect. You'll need this to know which namespace to use when calling validate. |
| `namespace` | — | Pre-select an account namespace, skipping the account selection screen. |
| `email` | — | Pre-fill the email field on the login form. |

**Example:**

```
https://login.dev-d01.app1svc.com/?referenceUrl=https%3A%2F%2Fmyapp.dev-d01.app1svc.com%2F&includeNamespace=true
```

After login, the user is redirected to:

```
https://myapp.dev-d01.app1svc.com/?namespace=their_account_namespace
```

---

## Step 2: Read the authToken Cookie

After the redirect, the browser automatically includes the `authToken` cookie on requests to your app.

| Property | Value |
|---|---|
| Name | `authToken` |
| Domain | `.app1svc.com` |
| HttpOnly | `true` — not accessible from JavaScript |
| Secure | `true` — HTTPS only |
| SameSite | `none` |

Because it's `HttpOnly`, you must read it server-side. In SvelteKit, `event.cookies.get()` may not see cookies set on parent domains in dev mode — parse the raw header instead:

```javascript
const cookieHeader = request.headers.get('cookie') || '';
const token = cookieHeader.split(';')
    .map(c => c.trim().split('='))
    .find(([name]) => name === 'authToken')?.[1] || null;
```

---

## Step 3: Store the Namespace

If you used `includeNamespace=true`, the namespace arrives as a query parameter on the redirect. Store it in your own cookie for subsequent requests:

```javascript
const namespace = url.searchParams.get('namespace');
if (namespace) {
    cookies.set('myapp_namespace', namespace, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    // Redirect to clean URL without ?namespace= param
}
```

---

## Step 4: Validate the Session

Call `/login/validate` using the user's account namespace and the auth cookie:

```
POST https://{namespace}.api.{region}.app1svc.com/login/validate
```

:::important
The token was created with `tokenType: 'cookie'`. You **must** send it as a `Cookie` header — not as an `Authorization: Bearer` header. The API enforces token type matching and will reject cookie tokens sent as bearer tokens.
:::

```javascript
const response = await fetch(`https://${namespace}.api.dev-d01.app1svc.com/login/validate`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Cookie': `authToken=${token}`,
    },
});
```

**Successful response (200):**

```json
{
    "user": {
        "id": "002d032023121400...",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "username": "john.doe"
    },
    "account": {
        "id": "001d032023121400...",
        "namespace": "myaccount",
        "baseUrl": "app1svc.com"
    },
    "namespace": "myaccount",
    "accountList": [
        { "namespace": "account1", "accountId": "...", "accountName": "..." }
    ],
    "token": {
        "id": "006d032023121400...",
        "authType": "user",
        "expiresAt": "2026-03-26 20:00:00"
    }
}
```

---

## Step 5: Load the Profile Image

The user's profile image is available at:

```
GET https://{namespace}.api.{region}.app1svc.com/storage/{userId}
```

This endpoint does not require authentication for profile images.

---

## Common Mistakes

| Problem | Cause | Fix |
|---|---|---|
| Cookie not present | App not on a subdomain of `app1svc.com` | Use a subdomain like `myapp.dev-d01.app1svc.com` |
| Cookie not present | App served over HTTP | Serve over HTTPS — the cookie has `secure: true` |
| `Token type mismatch` 401 | Sending cookie token as `Authorization: Bearer` | Send as `Cookie: authToken=xxx` instead |
| `Invalid namespace` 401 | Using `login` as the namespace | Use the user's account namespace from the redirect or validate response |
| Login redirect loop | Namespace not stored after first redirect | Store the `?namespace=` param in a cookie and use it on subsequent validate calls |
| `referenceUrl` uses `http://` | Reverse proxy not passing protocol | Add `proxy_set_header X-Forwarded-Proto $scheme;` to Nginx |
| SvelteKit can't read cookie | `event.cookies.get()` doesn't see parent domain cookies in dev | Parse the raw `Cookie` header from `request.headers.get('cookie')` |

---

## Full Example: SvelteKit `hooks.server.js`

```javascript
import { redirect } from '@sveltejs/kit';

const AUTH_COOKIE = 'authToken';
const NAMESPACE_COOKIE = 'myapp_namespace';
const LOGIN_URL = 'https://login.dev-d01.app1svc.com';

function getCookieValue(cookieHeader, name) {
    return cookieHeader.split(';')
        .map(c => c.trim().split('='))
        .find(([n]) => n === name)?.[1] || null;
}

export async function handle({ event, resolve }) {
    // Skip auth for static assets
    if (event.url.pathname.startsWith('/_app/')) {
        return resolve(event);
    }

    const cookieHeader = event.request.headers.get('cookie') || '';
    const token = getCookieValue(cookieHeader, AUTH_COOKIE);

    if (!token) {
        const proto = event.request.headers.get('x-forwarded-proto') || 'https';
        const host = event.request.headers.get('host');
        const referenceUrl = `${proto}://${host}${event.url.pathname}`;
        throw redirect(302,
            `${LOGIN_URL}?referenceUrl=${encodeURIComponent(referenceUrl)}&includeNamespace=true`
        );
    }

    // Capture namespace from login redirect
    let namespace = event.url.searchParams.get('namespace');
    if (namespace) {
        event.cookies.set(NAMESPACE_COOKIE, namespace, {
            path: '/', httpOnly: true, secure: true,
            sameSite: 'lax', maxAge: 60 * 60 * 24 * 30,
        });
        const cleanUrl = new URL(event.url);
        cleanUrl.searchParams.delete('namespace');
        throw redirect(302, cleanUrl.pathname + cleanUrl.search);
    }

    namespace = getCookieValue(cookieHeader, NAMESPACE_COOKIE);
    if (!namespace) {
        throw redirect(302, `${LOGIN_URL}?referenceUrl=...&includeNamespace=true`);
    }

    // Validate session
    const res = await fetch(
        `https://${namespace}.api.dev-d01.app1svc.com/login/validate`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `authToken=${token}`,
            },
        }
    );

    if (!res.ok) {
        event.cookies.delete(NAMESPACE_COOKIE, { path: '/' });
        throw redirect(302, `${LOGIN_URL}?referenceUrl=...&includeNamespace=true`);
    }

    const data = await res.json();
    event.locals.user = {
        userId: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        profileImageUrl: `https://${namespace}.api.dev-d01.app1svc.com/storage/${data.user.id}`,
        namespace: data.namespace,
        accountId: data.account?.id,
    };

    return resolve(event);
}
```

---

## Nginx Configuration

Your server block needs these headers for the auth flow to work correctly:

```nginx
location / {
    proxy_set_header X-Real-IP          $remote_addr;
    proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto  $scheme;
    proxy_set_header Host               $host;
    proxy_pass http://localhost:YOUR_PORT;
}
```

The `X-Forwarded-Proto` header is critical — without it, your app will generate `http://` redirect URLs which breaks the cookie flow.
