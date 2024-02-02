/**
 * Type for session ID
 */
export type SessionId = string;

export const enum CONTENT_TYPE {
    TEXT = "text/plain",
    JSON = "application/json"
}

export const enum AUTHOR_ROLE {
    USER = "user",
    ASSISTANT = "assistant",
    SYSTEM = "system"
}

/**
 * Interface of normal messages
 */
export interface Message {
    /**
     * Message ID. Should uniquely identify a single message.
     */
    id: string;
    /**
     * A MIME type that describes `content`.
     */
    contentType: string;
    content?: string;
    /**
     * Specify who is the author of this message.
     */
    author: {
        role: "user" | "assistant" | "system";
    };
}

/**
 * Predefined control signals.
 */
export const enum CONTROL_SIGNAL {
    GENERATION_PENDING = "generation-pending",
    GENERATION_STARTED = "generation-started",
    GENERATION_DONE = "generation-done",
    GENERATION_ERROR = "generation-error"
}

/**
 * Interface of control instructions
 */
export interface Control {
    signal: CONTROL_SIGNAL;
}

/**
 * Describe a history conversation entry that is meant to be displayed in the
 * sidebar.
 */
export interface HistoryConversation {
    // session ID
    id: string;
    /**
     * Data & time string in ISO 8601 standard
     */
    dateTimeIso: string;
    title: string;
}

/**
 * `POST /api/conversation`
 *
 * Request payload interface
 */
export interface PostRequest {
    /**
     * Session ID
     *
     * A unique identifier for a conversation.
     *
     * Can be `undefined` for creating a new conversation.
     */
    id?: string;
    message: Message;
}

export const enum REQUEST_STATUS {
    SUCCESS = "success",
    FAIL = "fail"
}

export const enum RESPONSE_TYPE {
    MESSAGE = "message",
    CONTROL = "control"
}

/**
 * Base response payload interface
 */
interface ResponseBase {
    status: REQUEST_STATUS;
    type: RESPONSE_TYPE;
}

/**
 * `POST /api/conversation`
 *
 * Response payload interface when request succeeds
 */
export interface PostResponseSuccess extends ResponseBase {
    /**
     * Conversation ID
     *
     * A unique identifier for a conversation.
     *
     * Always not `undefined`, since server will always allocate a new
     * conversation ID or return the conversation ID that is sent through the
     * request payload.
     */
    id: string;
    message?: Message;
}

/**
 * `POST /api/conversation`
 *
 * Response payload interface when request fails
 */
export interface PostResponseFail extends ResponseBase {
    reason: string;
}

export interface PostResponseControl {
    type: RESPONSE_TYPE.CONTROL;
    control: Control;
    message?: Message;
}
