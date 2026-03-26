---
id: types
title: TypeScript Types
sidebar_label: TypeScript Types
---

# TypeScript Types Reference

Complete TypeScript interface definitions for every major data structure in the Unbound SDK. Use these as a reference when typing your own application code or when extending the SDK.

:::info
The SDK ships as ESM JavaScript. These TypeScript definitions are provided as a reference — you can copy them into a `.d.ts` file in your project, or declare them inline.
:::

---

## SDK Constructor

```typescript
interface UnboundSDKOptions {
    /** Your Unbound namespace (e.g. `"mycompany"`) */
    namespace?: string;
    /** Active call ID for in-call context */
    callId?: string;
    /** Bearer token for API authentication */
    token?: string;
    /** Forwarded request ID for distributed tracing */
    fwRequestId?: string;
    /** Override the base API URL (browser only) */
    url?: string;
    /** WebSocket socket store (browser only) */
    socketStore?: any;
}
```

---

## Authentication

### LoginResult

```typescript
interface LoginResult {
    /** JWT bearer token */
    token: string;
    /** Token expiry timestamp (Unix ms) */
    expiresAt: number;
    /** Namespace the token is scoped to */
    namespace: string;
    /** Authenticated user record */
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}
```

### PasswordResetRequest

```typescript
interface PasswordResetRequest {
    email: string;
    namespace: string;
}
```

---

## Objects Service

### QueryParams

```typescript
interface ObjectQueryParams {
    /** Object type name (e.g. `"contacts"`, `"leads"`) */
    object: string;
    /** Fields to return. Omit for all fields */
    select?: string[] | string;
    /** Filter conditions (UOQL-compatible key/value map) */
    where?: Record<string, any>;
    /** Maximum records to return (default: 100, max: 1000) */
    limit?: number;
    /** Cursor ID for forward pagination */
    nextId?: string;
    /** Cursor ID for backward pagination */
    previousId?: string;
    /** Sort direction: `"ASC"` or `"DESC"` (default: `"DESC"`) */
    orderByDirection?: 'ASC' | 'DESC';
    /** Expand detail/relationship fields */
    expandDetails?: boolean;
    /** Additional metadata to include */
    meta?: Record<string, any>;
}
```

### QueryResult

```typescript
interface ObjectQueryResult<T = Record<string, any>> {
    /** Array of matching records */
    data: T[];
    /** Pagination metadata */
    pagination: {
        /** ID of the first record in this page */
        firstId: string | null;
        /** ID of the last record in this page */
        lastId: string | null;
        /** Whether more pages exist forward */
        hasNext: boolean;
        /** Whether more pages exist backward */
        hasPrevious: boolean;
        /** Total count (may be omitted for large sets) */
        total?: number;
    };
}
```

### UpdateParams

```typescript
interface ObjectUpdateParams {
    /** Object type name */
    object: string;
    /** ID of the record to update */
    id: string;
    /** Fields to update */
    update: Record<string, any>;
}
```

### CreateParams

```typescript
interface ObjectCreateParams {
    /** Object type name */
    object: string;
    /** Fields for the new record */
    body: Record<string, any>;
}
```

### DeleteParams

```typescript
interface ObjectDeleteParams {
    /** Object type name */
    object: string;
    /** ID of the record to delete */
    id: string;
}
```

### ExpandDetails

```typescript
interface ExpandDetailsParams {
    /** Object type name */
    object: string;
    /** Dot-path to the detail field (e.g. `"details.customFields"`) */
    detailKey: string;
    /** Body/value to set */
    body?: Record<string, any>;
}

interface ExpandDetailsResult {
    id: string;
    [detailKey: string]: any;
}
```

### GeneratedColumn

```typescript
interface GeneratedColumnDefinition {
    /** Column name */
    name: string;
    /** SQL-like formula string */
    formula: string;
    /** Return type: `"string"`, `"number"`, `"boolean"` */
    returnType: 'string' | 'number' | 'boolean';
    /** Object type this column belongs to */
    objectType: string;
}
```

---

## Messaging Service

### SMS

#### SmsSendParams

```typescript
interface SmsSendParams {
    /** Recipient phone number in E.164 format (required) */
    to: string;
    /** Sender phone number in E.164 format */
    from?: string;
    /** Message text body */
    message?: string;
    /** Template ID to populate message from */
    templateId?: string;
    /** Variable substitution map for templates */
    variables?: Record<string, string>;
    /** MMS media URLs (images, video) */
    mediaUrls?: string[];
    /** Webhook URL for delivery status callbacks */
    webhookUrl?: string;
}
```

#### SmsMessage

```typescript
interface SmsMessage {
    id: string;
    to: string;
    from: string;
    message: string;
    status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered';
    direction: 'inbound' | 'outbound';
    mediaUrls?: string[];
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
    namespace: string;
    /** Carrier error code if failed */
    errorCode?: string;
    errorMessage?: string;
}
```

### Email

#### EmailSendParams

```typescript
interface EmailSendParams {
    /** Sender address (required unless using draftId) */
    from?: string;
    /** One or more recipient addresses */
    to?: string | string[];
    /** Subject line (required unless using draftId) */
    subject?: string;
    /** CC recipients */
    cc?: string | string[];
    /** BCC recipients */
    bcc?: string | string[];
    /** HTML body */
    html?: string;
    /** Plain-text body */
    text?: string;
    /** Template ID */
    templateId?: string;
    /** Template variable substitutions */
    variables?: Record<string, string>;
    /** Storage IDs for attachments */
    storageId?: string[];
    /** Reply-to address */
    replyTo?: string;
    /** ID of email being replied to (for threading) */
    replyToEmailId?: string;
    /** Related record ID */
    relatedId?: string;
    /** `"marketing"` or `"transactional"` (default: `"marketing"`) */
    emailType?: 'marketing' | 'transactional';
    /** Enable open/click tracking (default: true) */
    tracking?: boolean;
    /** Specific mailbox to send from */
    mailboxId?: string;
    /** Send an existing draft */
    draftId?: string;
    /** Engagement session to associate */
    engagementSessionId?: string;
}
```

#### EmailMessage

```typescript
interface EmailMessage {
    id: string;
    from: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    html?: string;
    text?: string;
    status: 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
    direction: 'inbound' | 'outbound';
    emailType: 'marketing' | 'transactional';
    tracking: boolean;
    /** Thread ID for email chains */
    threadId?: string;
    createdAt: string;
    updatedAt: string;
    namespace: string;
}
```

### Campaign

```typescript
interface Campaign {
    id: string;
    name: string;
    type: 'sms' | 'email';
    status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
    /** Scheduled send time (ISO 8601) */
    scheduledAt?: string;
    /** Total recipient count */
    recipientCount: number;
    /** Successful send count */
    sentCount: number;
    /** Failed send count */
    failedCount: number;
    createdAt: string;
    updatedAt: string;
}
```

---

## Voice Service

### VoiceCallParams

```typescript
interface VoiceCallParams {
    /** Destination number or SIP URI (required) */
    to: string;
    /** Caller ID number (required) */
    from: string;
    /** SIP URI destination override */
    destination?: string;
    /** Voice app to run on answer */
    app?: VoiceApp;
    /** Ring timeout in seconds */
    timeout?: number;
    /** Custom SIP headers */
    customHeaders?: Record<string, string>;
}
```

### VoiceApp

```typescript
interface VoiceApp {
    /** App schema version (e.g. `"2.0"`) */
    version: string;
    /** Identifying name for this app */
    name?: string;
    /** Ordered list of commands to execute */
    commands: VoiceCommand[];
}
```

### VoiceCommand

```typescript
type VoiceCommand =
    | PlayCommand
    | GatherCommand
    | RecordCommand
    | SayCommand
    | HangupCommand
    | ForwardCommand
    | BridgeCommand
    | PauseCommand
    | SendDtmfCommand
    | TranscribeCommand;

interface PlayCommand {
    command: 'play';
    file: string;
    loop?: number;
}

interface GatherCommand {
    command: 'gather';
    /** Number of digits to collect */
    numDigits?: number;
    /** Silence timeout before finalizing input (ms) */
    timeout?: number;
    /** DTMF terminator character */
    finishOnKey?: string;
    /** Webhook to POST gathered digits to */
    action?: string;
    /** Prompt to play while gathering */
    say?: string;
    /** Audio file to play while gathering */
    file?: string;
}

interface RecordCommand {
    command: 'record';
    /** Max recording duration (seconds) */
    maxLength?: number;
    /** Silence timeout before stopping */
    timeout?: number;
    /** Webhook for recording complete */
    action?: string;
    /** Audio direction: `"sendrecv"` | `"sendonly"` | `"recvonly"` */
    direction?: 'sendrecv' | 'sendonly' | 'recvonly';
}

interface SayCommand {
    command: 'say';
    text: string;
    voice?: string;
    language?: string;
}

interface HangupCommand {
    command: 'hangup';
}

interface ForwardCommand {
    command: 'forward';
    to: string;
    from?: string;
    timeout?: number;
    customHeaders?: Record<string, string>;
}

interface BridgeCommand {
    command: 'bridge';
    callId: string;
}

interface PauseCommand {
    command: 'pause';
    duration: number;  // seconds
}

interface SendDtmfCommand {
    command: 'sendDtmf';
    digits: string;
}

interface TranscribeCommand {
    command: 'transcribe';
    action?: string;
    engine?: 'google' | 'deepgram' | 'whisper';
    languageCode?: string;
}
```

### VoiceRecordParams

```typescript
interface VoiceRecordParams {
    /** CDR (Call Detail Record) ID */
    cdrId?: string;
    /** Active call ID */
    callId?: string;
    /** `"start"` or `"stop"` (default: `"start"`) */
    action?: 'start' | 'stop';
    /** Audio stream direction (default: `"sendrecv"`) */
    direction?: 'sendrecv' | 'sendonly' | 'recvonly';
}
```

### CallResult

```typescript
interface CallResult {
    /** Unique call ID */
    callId: string;
    /** SIP call ID */
    sipCallId?: string;
    /** CDR ID */
    cdrId?: string;
    /** Call status */
    status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer';
    /** Call duration in seconds */
    duration?: number;
    direction: 'inbound' | 'outbound';
    from: string;
    to: string;
    createdAt: string;
    updatedAt: string;
}
```

---

## Video Service

### VideoTokenParams

```typescript
interface VideoTokenParams {
    /** Room name to generate a token for */
    roomName: string;
    /** Participant identity (usually user ID or name) */
    identity: string;
    /** Display name shown to other participants */
    displayName?: string;
    /** Token validity in seconds */
    expiresIn?: number;
    /** Whether this participant can publish video */
    canPublish?: boolean;
    /** Whether this participant can subscribe to others */
    canSubscribe?: boolean;
}
```

### VideoToken

```typescript
interface VideoToken {
    /** JWT access token for the LiveKit/video room */
    token: string;
    /** Room name */
    roomName: string;
    /** WebSocket URL for the video server */
    serverUrl: string;
    /** Token expiry timestamp (Unix ms) */
    expiresAt: number;
}
```

### VideoRoom

```typescript
interface VideoRoom {
    id: string;
    name: string;
    /** `"active"` | `"completed"` | `"scheduled"` */
    status: 'active' | 'completed' | 'scheduled';
    participantCount: number;
    maxParticipants?: number;
    createdAt: string;
    updatedAt: string;
}
```

### GuestTokenParams

```typescript
interface GuestTokenParams {
    /** Room name */
    roomName: string;
    /** Guest display name */
    displayName?: string;
    /** Token TTL in seconds (default: 3600) */
    expiresIn?: number;
}
```

---

## AI Service

### GenerativeChatParams

```typescript
interface GenerativeChatParams {
    /** Single-turn prompt string */
    prompt?: string;
    /** Multi-turn message array */
    messages?: ChatMessage[];
    /** System prompt to prepend */
    systemPrompt?: string;
    /** Related record ID for context */
    relatedId?: string;
    /** AI provider: `"openai"` | `"anthropic"` | `"google"` | `"azure"` */
    provider?: 'openai' | 'anthropic' | 'google' | 'azure';
    /** Model name (e.g. `"gpt-4o"`, `"claude-3-5-sonnet"`) */
    model?: string;
    /** Sampling temperature (0.0 – 1.0) */
    temperature?: number;
    /** AI subscription ID for billing tracking */
    subscriptionId?: string;
    /** Enable streaming response */
    stream?: boolean;
    /** Structured output format */
    responseFormat?: ResponseFormat;
    /** Internal playground flag */
    isPlayground?: boolean;
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ResponseFormat {
    type: 'json_object' | 'text';
    /** JSON schema for structured output */
    schema?: Record<string, any>;
}
```

### GenerativeChatResult

```typescript
interface GenerativeChatResult {
    /** Generated text content */
    content: string;
    /** Model used */
    model: string;
    /** Token usage */
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    /** Finish reason */
    finishReason: 'stop' | 'length' | 'content_filter';
}
```

### TTSParams

```typescript
interface TTSParams {
    /** Text to synthesize (required) */
    text: string;
    /** Voice name (provider-specific) */
    voice?: string;
    /** BCP-47 language code (e.g. `"en-US"`) */
    languageCode?: string;
    /** `"MALE"` | `"FEMALE"` | `"NEUTRAL"` */
    ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
    /** `"MP3"` | `"LINEAR16"` | `"OGG_OPUS"` */
    audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS';
    /** Speech rate multiplier (0.25 – 4.0) */
    speakingRate?: number;
    /** Pitch adjustment in semitones (-20 to +20) */
    pitch?: number;
    /** Volume gain in dB (-96 to +16) */
    volumeGainDb?: number;
    /** Audio effects profiles */
    effectsProfileIds?: string[];
    /** Return a storage access key with the result */
    createAccessKey?: boolean;
}
```

### TTSResult

```typescript
interface TTSResult {
    /** Storage ID of the generated audio file */
    storageId: string;
    /** Public URL (if createAccessKey was true) */
    url?: string;
    /** Audio encoding used */
    audioEncoding: string;
    /** Duration in seconds */
    duration?: number;
}
```

### STTParams

```typescript
interface STTParams {
    /** Source type: `"file"` | `"storage"` | `"stream"` | `"url"` */
    sourceType: 'file' | 'storage' | 'stream' | 'url';
    /** Source identifier (file path, URL, etc.) */
    sourceId?: string;
    /** SIP call ID for in-call transcription */
    sipCallId?: string;
    /** CDR ID for post-call transcription */
    cdrId?: string;
    /** Storage file ID */
    storageId?: string;
    /** STT engine: `"google"` | `"deepgram"` | `"whisper"` */
    engine?: 'google' | 'deepgram' | 'whisper';
    /** BCP-47 language code (default: `"en-US"`) */
    languageCode?: string;
    /** Engine-specific configuration */
    metadata?: Record<string, any>;
    /** Engagement session ID */
    engagementSessionId?: string;
    /** Playbook ID for post-processing */
    playbookId?: string;
    /** Label for this transcription */
    name?: string;
    /** Speaker role label */
    role?: string;
    /** Audio direction label */
    direction?: string;
}
```

### STTResult

```typescript
interface STTResult {
    id: string;
    /** Full transcript as a single string */
    transcript: string;
    /** Word-level segments with timestamps */
    segments?: TranscriptSegment[];
    /** Confidence score 0–1 */
    confidence?: number;
    /** STT engine used */
    engine: string;
    languageCode: string;
    createdAt: string;
}

interface TranscriptSegment {
    word: string;
    startTime: number;  // seconds
    endTime: number;    // seconds
    confidence?: number;
    speakerTag?: number;
}
```

### ExtractParams

```typescript
interface ExtractParams {
    /** Storage ID of the document to extract from */
    storageId: string;
    /** Extraction instructions or schema */
    prompt?: string;
    /** Fields to extract */
    fields?: ExtractField[];
    /** AI model to use */
    model?: string;
}

interface ExtractField {
    /** Field name in output */
    name: string;
    /** Human-readable description for the AI */
    description?: string;
    /** Expected type */
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    /** Whether this field is required */
    required?: boolean;
}
```

---

## Task Router

### TaskCreateParams

```typescript
interface TaskCreateParams {
    /** Task type: `"chat"` | `"phoneCall"` | `"email"` | `"other"` (required) */
    type: 'chat' | 'phoneCall' | 'email' | 'other';
    /** Queue ID to route to (required) */
    queueId: string;
    /** Required worker skill IDs */
    requiredSkills?: string | string[];
    /** Optional/preferred worker skill IDs */
    optionalSkills?: string | string[];
    /** Alias for requiredSkills */
    skills?: string | string[];
    /** Higher value = higher priority (default: 0) */
    priority?: number;
    /** Task subject or title */
    subject?: string;
    /** CDR ID for voice tasks */
    cdrId?: string;
    /** SIP call ID for voice tasks */
    sipCallId?: string;
    /** Associated person record ID */
    peopleId?: string;
    /** Associated company record ID */
    companyId?: string;
    /** Auto-create an engagement session */
    createEngagement?: boolean;
    /** Related object type */
    relatedObject?: string;
    /** Related object record ID */
    relatedId?: string;
}
```

### Task

```typescript
interface Task {
    id: string;
    type: 'chat' | 'phoneCall' | 'email' | 'other';
    status: 'pending' | 'reserved' | 'accepted' | 'completed' | 'cancelled' | 'timeout';
    queueId: string;
    workerId?: string;
    priority: number;
    subject?: string;
    cdrId?: string;
    peopleId?: string;
    companyId?: string;
    engagementSessionId?: string;
    requiredSkills?: string[];
    optionalSkills?: string[];
    /** Time task entered queue (ISO 8601) */
    queuedAt: string;
    /** Time task was accepted by worker */
    acceptedAt?: string;
    /** Time task was completed */
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}
```

### Worker

```typescript
interface Worker {
    id: string;
    workerId: string;
    userId: string;
    status: 'available' | 'unavailable' | 'busy';
    /** Assigned skill IDs */
    skills?: string[];
    /** Active task IDs */
    activeTasks?: string[];
    createdAt: string;
    updatedAt: string;
}
```

### WorkerStatusParams

```typescript
interface WorkerStatusParams {
    workerId?: string;
    userId?: string;
    /** Status reason (for unavailable) */
    reason?: string;
}
```

---

## Storage Service

### StorageUploadParams

```typescript
interface StorageUploadParams {
    /** File data (Buffer in Node.js, File/Blob in browser) */
    file: Buffer | File | Blob;
    /** File name with extension */
    fileName?: string;
    /**
     * Storage classification bucket.
     * Common values: `"generic"` | `"user_images"` | `"account_logo"`
     */
    classification?: string;
    /** Sub-folder path within the bucket */
    folder?: string;
    /** Make file publicly accessible */
    isPublic?: boolean;
    /** Storage country/region code (default: `"US"`) */
    country?: string;
    /** ISO 8601 duration or date after which to delete (e.g. `"P30D"`) */
    expireAfter?: string;
    /** Related record ID for context */
    relatedId?: string;
    /** Generate a signed access key with the result */
    createAccessKey?: boolean;
    /** Expiry for the generated access key (seconds) */
    accessKeyExpiresIn?: number;
    /** Upload progress callback (0–100) */
    onProgress?: (percent: number) => void;
}
```

### StorageFile

```typescript
interface StorageFile {
    id: string;
    /** Public or signed URL */
    url: string;
    fileName: string;
    contentType: string;
    /** File size in bytes */
    size: number;
    classification: string;
    folder?: string;
    isPublic: boolean;
    country: string;
    relatedId?: string;
    /** Expiry date if set (ISO 8601) */
    expiresAt?: string;
    /** Signed access key (only present when requested) */
    accessKey?: string;
    createdAt: string;
    updatedAt: string;
    namespace: string;
}
```

### StorageListParams

```typescript
interface StorageListParams {
    classification?: string;
    folder?: string;
    limit?: number;
    offset?: number;
    /** Field name to sort by */
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
}
```

---

## Subscriptions / WebSocket

### SocketConnectionResult

```typescript
interface SocketConnectionResult {
    /** WebSocket server URL */
    url: string;
    /** Connection token */
    connectionToken: string;
    /** Session ID for subscription management */
    sessionId: string;
}
```

### SubscriptionParams

```typescript
interface SubscriptionParams {
    /** Subscription ID (optional, auto-generated if omitted) */
    id?: string;
    /** Event type to subscribe to (e.g. `"taskRouter.taskAssigned"`) */
    event: string;
    /** Additional filter criteria */
    filter?: Record<string, any>;
    /** Webhook URL instead of WebSocket push */
    webhookUrl?: string;
}
```

---

## Workflows

### WorkflowItem

```typescript
interface WorkflowItem {
    id: string;
    workflowVersionId: string;
    category: string;
    type: string;
    description?: string;
    label?: string;
    /** Canvas position */
    position?: { x: number; y: number };
    /** Node-specific settings */
    settings?: Record<string, any>;
    /** Display style overrides */
    style?: {
        labelBgColor?: string;
        labelTextColor?: string;
        iconBgColor?: string;
        iconTextColor?: string;
        icon?: string;
    };
    createdAt: string;
    updatedAt: string;
}
```

### WorkflowConnection

```typescript
interface WorkflowConnection {
    id: string;
    workflowVersionId: string;
    /** Source node ID */
    sourceId: string;
    /** Destination node ID */
    targetId: string;
    /** Output handle on the source node */
    sourceHandle?: string;
    /** Input handle on the target node */
    targetHandle?: string;
    /** Edge label */
    label?: string;
    createdAt: string;
    updatedAt: string;
}
```

### WorkflowSession

```typescript
interface WorkflowSession {
    id: string;
    workflowId: string;
    workflowVersionId: string;
    status: 'running' | 'completed' | 'failed' | 'paused';
    /** Trigger event that started the session */
    trigger?: Record<string, any>;
    /** Current node ID being executed */
    currentNodeId?: string;
    /** Session-level variables */
    variables?: Record<string, any>;
    startedAt: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}
```

---

## Lookup Service

### CnamResult

```typescript
interface CnamResult {
    phoneNumber: string;
    /** Caller name from CNAM database */
    name?: string;
    /** Whether the lookup returned a result */
    found: boolean;
}
```

### LrnResult

```typescript
interface LrnResult {
    phoneNumber: string;
    /** Local Routing Number */
    lrn?: string;
    /** Ported carrier name */
    carrier?: string;
    /** Line type: `"mobile"` | `"landline"` | `"voip"` */
    lineType?: string;
    /** Originating OCN */
    ocn?: string;
    /** CNAM data (only when cnam=true) */
    cnam?: CnamResult;
}
```

### NumberLookupResult

```typescript
interface NumberLookupResult {
    phoneNumber: string;
    /** E.164 formatted number */
    e164?: string;
    /** Country code (ISO 3166-1 alpha-2) */
    country?: string;
    lineType?: 'mobile' | 'landline' | 'voip' | 'toll-free' | 'premium';
    carrier?: string;
    /** Whether the number is valid */
    valid: boolean;
    /** Whether the number is ported */
    ported?: boolean;
    /** LRN data */
    lrn?: string;
    cnam?: CnamResult;
}
```

---

## Verification Service

### VerificationSendParams

```typescript
interface VerificationSendParams {
    /** Phone number or email to verify */
    to: string;
    /** `"sms"` | `"call"` | `"email"` */
    channel: 'sms' | 'call' | 'email';
    /** Custom message template */
    template?: string;
    /** Code expiry in minutes (default: 10) */
    expiresIn?: number;
    /** Code length (default: 6) */
    codeLength?: number;
}
```

### VerificationCheckParams

```typescript
interface VerificationCheckParams {
    /** The same `to` used in send */
    to: string;
    /** Code entered by user */
    code: string;
}
```

### VerificationResult

```typescript
interface VerificationResult {
    /** Whether the verification was approved */
    approved: boolean;
    /** Verification record ID */
    id: string;
    /** Status: `"pending"` | `"approved"` | `"expired"` | `"failed"` */
    status: 'pending' | 'approved' | 'expired' | 'failed';
    /** Attempts made */
    attempts: number;
    /** Time remaining until expiry (seconds) */
    ttl?: number;
}
```

---

## Notes Service

### NoteCreateParams

```typescript
interface NoteCreateParams {
    /** Note body text (supports Markdown) */
    body: string;
    /** Related object type */
    objectType?: string;
    /** Related record ID */
    relatedId?: string;
    /** Note category/tag */
    category?: string;
    /** Pin this note */
    pinned?: boolean;
}
```

### Note

```typescript
interface Note {
    id: string;
    body: string;
    objectType?: string;
    relatedId?: string;
    category?: string;
    pinned: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    namespace: string;
}
```

---

## Engagement Metrics

### EngagementSession

```typescript
interface EngagementSession {
    id: string;
    type: 'chat' | 'phoneCall' | 'email' | 'other';
    status: 'open' | 'closed' | 'pending';
    /** Associated CDR ID */
    cdrId?: string;
    /** Task ID that created this session */
    taskId?: string;
    agentId?: string;
    contactId?: string;
    /** Session start time (ISO 8601) */
    startedAt?: string;
    /** Session end time */
    endedAt?: string;
    /** Total duration in seconds */
    duration?: number;
    /** Sentiment score: -1.0 (negative) to 1.0 (positive) */
    sentiment?: number;
    /** Computed quality score */
    qualityScore?: number;
    createdAt: string;
    updatedAt: string;
    namespace: string;
}
```

---

## Pagination Helpers

Most list endpoints support cursor-based pagination via `nextId` / `previousId`. A typical paginated fetch looks like:

```typescript
interface PaginationState {
    nextId: string | null;
    previousId: string | null;
    hasNext: boolean;
    hasPrevious: boolean;
}

async function fetchAllPages<T>(
    fetchFn: (cursor: string | null) => Promise<ObjectQueryResult<T>>,
): Promise<T[]> {
    const results: T[] = [];
    let cursor: string | null = null;

    while (true) {
        const page = await fetchFn(cursor);
        results.push(...page.data);

        if (!page.pagination.hasNext) break;
        cursor = page.pagination.lastId;
    }

    return results;
}

// Usage
const allContacts = await fetchAllPages((cursor) =>
    sdk.objects.query({
        object: 'contacts',
        limit: 200,
        nextId: cursor ?? undefined,
    })
);
```

---

## Error Types

### SDKError

```typescript
interface SDKError extends Error {
    /** HTTP status code */
    status: number;
    /** HTTP status text */
    statusText: string;
    /** HTTP method */
    method: string;
    /** API endpoint */
    endpoint: string;
    /** Raw response body */
    body: any;
    /** Human-readable message from the API */
    message: string;
}
```

See the [Error Reference](./errors.md) for a full list of status codes and error shapes.

---

## Utility Types

```typescript
/** ISO 8601 timestamp string */
type ISODate = string;

/** E.164 phone number (e.g. "+15551234567") */
type PhoneNumber = string;

/** Unbound namespaced record ID */
type RecordId = string;

/** UOQL filter expression */
type UOQLFilter = Record<string, any>;

/** Paginated response wrapper */
interface PagedResponse<T> {
    data: T[];
    pagination: {
        firstId: string | null;
        lastId: string | null;
        hasNext: boolean;
        hasPrevious: boolean;
        total?: number;
    };
}
```
