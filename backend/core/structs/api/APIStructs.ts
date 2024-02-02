/**
 * Type for session ID
 */
export type SessionId = string | undefined;

/**
 * Interface for the parameters for the event handler
 */
export interface EventHandlerParams {
  id?: SessionId;
  message?: Message;
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
  GENERATION_DONE = "generation-done",
  GENERATION_ERROR = "generation-error",
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
  FAIL = "fail",
}

export const enum RESPONSE_TYPE {
  MESSAGE = "message",
  CONTROL = "control",
}

/**
 * Base response payload interface
 */
interface ResponseBase {
  status: REQUEST_STATUS;
}

/**
 * `POST /api/conversation`
 *
 * Response payload interface when request succeeds
 */
export interface PostResponseSuccess extends ResponseBase {
  type: RESPONSE_TYPE;
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
  control?: Control;
}

/**
 * `POST /api/conversation`
 *
 * Response payload interface when request fails
 */
export interface PostResponseFail extends ResponseBase {
  reason: string;
  control?: Control;
}

/**
 * Structure of a single API Session
 */
export interface APISession {
  id: SessionId;
  chatAgent?: any;
  response?: PostResponseSuccess | PostResponseFail;
}
