import React, { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';

const STORAGE_KEY = 'unbound_playground_auth';

interface AuthState {
    namespace: string;
    token: string;
    username: string;
}

interface RequestState {
    method: string;
    endpoint: string;
    body: string;
}

interface ResponseState {
    status: number | null;
    statusText: string;
    data: unknown;
    durationMs: number | null;
    error: string | null;
}

const EXAMPLE_REQUESTS: { label: string; method: string; endpoint: string; body: string }[] = [
    { label: 'List people', method: 'GET', endpoint: '/object/query/people?limit=10', body: '' },
    { label: 'UOQL — count CDRs by direction', method: 'POST', endpoint: '/object/query/v2', body: JSON.stringify({ query: 'SELECT direction, COUNT(*) as calls FROM cdr GROUP BY direction' }, null, 4) },
    { label: 'List queues', method: 'GET', endpoint: '/object/query/queues?limit=20', body: '' },
    { label: 'List tasks (open)', method: 'GET', endpoint: '/object/query/tasks?status=open&limit=20', body: '' },
    { label: 'SMS — send test', method: 'POST', endpoint: '/message/sms', body: JSON.stringify({ to: '+1...', from: '+1...', message: 'Hello from the playground!' }, null, 4) },
    { label: 'Storage — list files', method: 'GET', endpoint: '/storage?limit=10', body: '' },
];

function AuthPanel({ onAuth }: { onAuth: (auth: AuthState) => void }) {
    const [namespace, setNamespace] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const baseUrl = `https://${namespace}.api.dev-d01.app1svc.com`;
            const res = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Login failed (${res.status}): ${text}`);
            }

            const data = await res.json();
            const token = data.token ?? data.jwt ?? data.accessToken;
            if (!token) throw new Error('No token in response — check namespace and credentials.');

            const auth: AuthState = { namespace, token, username };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
            onAuth(auth);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    }, [namespace, username, password, onAuth]);

    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <span className={styles.panelIcon}>🔐</span>
                <div>
                    <h3 className={styles.panelTitle}>Authenticate</h3>
                    <p className={styles.panelSub}>Login to get a JWT and start making requests</p>
                </div>
            </div>

            <form onSubmit={handleLogin} className={styles.authForm}>
                <div className={styles.fieldRow}>
                    <label className={styles.label}>Namespace</label>
                    <div className={styles.namespaceInput}>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="your-namespace"
                            value={namespace}
                            onChange={e => setNamespace(e.target.value)}
                            required
                            autoFocus
                        />
                        <span className={styles.namespaceSuffix}>.api.unbound.cx</span>
                    </div>
                </div>
                <div className={styles.fieldRow}>
                    <label className={styles.label}>Username</label>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="user@example.com"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.fieldRow}>
                    <label className={styles.label}>Password</label>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <button className={styles.primaryBtn} type="submit" disabled={loading}>
                    {loading ? 'Logging in…' : 'Login & Get Token'}
                </button>
            </form>

            <div className={styles.hint}>
                <strong>Your token stays in your browser.</strong> Nothing is sent to our servers — requests go directly from your browser to your Unbound namespace.
            </div>
        </div>
    );
}

function TokenPanel({ auth, onClear }: { auth: AuthState; onClear: () => void }) {
    const [copied, setCopied] = useState(false);

    const copyToken = () => {
        navigator.clipboard.writeText(auth.token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const preview = auth.token.length > 60
        ? `${auth.token.slice(0, 30)}…${auth.token.slice(-20)}`
        : auth.token;

    return (
        <div className={styles.tokenPanel}>
            <div className={styles.tokenRow}>
                <div className={styles.tokenInfo}>
                    <span className={styles.tokenBadge}>✅ Authenticated</span>
                    <span className={styles.tokenNamespace}>{auth.namespace}.api.unbound.cx</span>
                    <span className={styles.tokenUser}>{auth.username}</span>
                </div>
                <div className={styles.tokenActions}>
                    <button className={styles.copyBtn} onClick={copyToken}>{copied ? 'Copied!' : 'Copy Token'}</button>
                    <button className={styles.clearBtn} onClick={onClear}>Log Out</button>
                </div>
            </div>
            <div className={styles.tokenPreview}>
                <span className={styles.tokenLabel}>Bearer</span>
                <code className={styles.tokenValue}>{preview}</code>
            </div>
        </div>
    );
}

function RequestBuilder({ auth, request, setRequest, onSend, loading }: {
    auth: AuthState;
    request: RequestState;
    setRequest: React.Dispatch<React.SetStateAction<RequestState>>;
    onSend: () => void;
    loading: boolean;
}) {
    const loadExample = (ex: typeof EXAMPLE_REQUESTS[0]) => {
        setRequest({ method: ex.method, endpoint: ex.endpoint, body: ex.body });
    };

    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <span className={styles.panelIcon}>⚡</span>
                <div>
                    <h3 className={styles.panelTitle}>Request</h3>
                    <p className={styles.panelSub}>Build and fire API requests against your namespace</p>
                </div>
            </div>

            <div className={styles.exampleRow}>
                <span className={styles.exampleLabel}>Quick examples:</span>
                {EXAMPLE_REQUESTS.map(ex => (
                    <button key={ex.label} className={styles.exampleChip} onClick={() => loadExample(ex)}>
                        {ex.label}
                    </button>
                ))}
            </div>

            <div className={styles.requestBar}>
                <select
                    className={styles.methodSelect}
                    value={request.method}
                    onChange={e => setRequest(r => ({ ...r, method: e.target.value }))}
                >
                    {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => (
                        <option key={m}>{m}</option>
                    ))}
                </select>
                <div className={styles.endpointWrap}>
                    <span className={styles.baseUrl}>{auth.namespace}.api.dev-d01.app1svc.com</span>
                    <input
                        className={styles.endpointInput}
                        type="text"
                        placeholder="/object/query/people"
                        value={request.endpoint}
                        onChange={e => setRequest(r => ({ ...r, endpoint: e.target.value }))}
                    />
                </div>
                <button className={styles.sendBtn} onClick={onSend} disabled={loading || !request.endpoint}>
                    {loading ? '…' : 'Send'}
                </button>
            </div>

            {(request.method !== 'GET' && request.method !== 'DELETE') && (
                <div className={styles.bodySection}>
                    <label className={styles.label}>Request Body (JSON)</label>
                    <textarea
                        className={styles.bodyInput}
                        value={request.body}
                        onChange={e => setRequest(r => ({ ...r, body: e.target.value }))}
                        placeholder={'{\n    "key": "value"\n}'}
                        rows={8}
                        spellCheck={false}
                    />
                </div>
            )}
        </div>
    );
}

function ResponsePanel({ response }: { response: ResponseState | null }) {
    const [copied, setCopied] = useState(false);

    if (!response) {
        return (
            <div className={styles.panel}>
                <div className={styles.panelHeader}>
                    <span className={styles.panelIcon}>📬</span>
                    <div>
                        <h3 className={styles.panelTitle}>Response</h3>
                        <p className={styles.panelSub}>Results will appear here after you send a request</p>
                    </div>
                </div>
                <div className={styles.emptyResponse}>
                    Hit <strong>Send</strong> to see a response
                </div>
            </div>
        );
    }

    const formatted = response.error
        ? response.error
        : JSON.stringify(response.data, null, 4);

    const copyResponse = () => {
        navigator.clipboard.writeText(formatted);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isOk = response.status !== null && response.status < 400;

    return (
        <div className={styles.panel}>
            <div className={styles.responseHeader}>
                <div className={styles.panelHeader} style={{ marginBottom: 0 }}>
                    <span className={styles.panelIcon}>📬</span>
                    <div>
                        <h3 className={styles.panelTitle}>Response</h3>
                        {response.durationMs !== null && (
                            <p className={styles.panelSub}>{response.durationMs}ms</p>
                        )}
                    </div>
                </div>
                <div className={styles.responseMeta}>
                    {response.status !== null && (
                        <span className={isOk ? styles.statusOk : styles.statusErr}>
                            {response.status} {response.statusText}
                        </span>
                    )}
                    <button className={styles.copyBtn} onClick={copyResponse}>{copied ? 'Copied!' : 'Copy'}</button>
                </div>
            </div>
            <pre className={`${styles.responseBody} ${response.error ? styles.responseError : ''}`}>
                <code>{formatted}</code>
            </pre>
        </div>
    );
}

export default function ApiPlayground(): React.ReactElement {
    const [auth, setAuth] = useState<AuthState | null>(null);
    const [request, setRequest] = useState<RequestState>({ method: 'GET', endpoint: '', body: '' });
    const [response, setResponse] = useState<ResponseState | null>(null);
    const [loading, setLoading] = useState(false);

    // Restore saved auth on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setAuth(JSON.parse(saved));
        } catch {
            // ignore
        }
    }, []);

    const handleAuth = (newAuth: AuthState) => setAuth(newAuth);

    const handleClear = () => {
        localStorage.removeItem(STORAGE_KEY);
        setAuth(null);
        setResponse(null);
    };

    const handleSend = useCallback(async () => {
        if (!auth || !request.endpoint) return;
        setLoading(true);
        setResponse(null);

        const start = Date.now();
        try {
            const baseUrl = `https://${auth.namespace}.api.dev-d01.app1svc.com`;
            const url = `${baseUrl}${request.endpoint.startsWith('/') ? '' : '/'}${request.endpoint}`;

            const opts: RequestInit = {
                method: request.method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.token}`,
                },
            };

            if (request.body && request.method !== 'GET' && request.method !== 'DELETE') {
                opts.body = request.body;
            }

            const res = await fetch(url, opts);
            const durationMs = Date.now() - start;

            let data: unknown;
            const ct = res.headers.get('content-type') ?? '';
            if (ct.includes('application/json')) {
                data = await res.json();
            } else {
                data = await res.text();
            }

            setResponse({ status: res.status, statusText: res.statusText, data, durationMs, error: null });
        } catch (err: unknown) {
            setResponse({
                status: null,
                statusText: '',
                data: null,
                durationMs: Date.now() - start,
                error: err instanceof Error ? err.message : String(err),
            });
        } finally {
            setLoading(false);
        }
    }, [auth, request]);

    return (
        <div className={styles.playground}>
            <div className={styles.playgroundHeader}>
                <h1 className={styles.playgroundTitle}>API Playground</h1>
                <p className={styles.playgroundSub}>
                    Authenticate with your namespace and fire live requests against the Unbound API.
                    Your token is stored locally in your browser — nothing is proxied.
                </p>
            </div>

            {!auth ? (
                <AuthPanel onAuth={handleAuth} />
            ) : (
                <>
                    <TokenPanel auth={auth} onClear={handleClear} />
                    <div className={styles.twoCol}>
                        <RequestBuilder
                            auth={auth}
                            request={request}
                            setRequest={setRequest}
                            onSend={handleSend}
                            loading={loading}
                        />
                        <ResponsePanel response={response} />
                    </div>
                </>
            )}
        </div>
    );
}
