import { Control, Message, UUID } from "api/interfaces/CommonStruct.ts";

/**
 * `POST /api/conversation`
 *
 * Request payload interface
 */
export interface PostRequest {
    /**
     * Conversation ID
     *
     * A unique identifier for a conversation.
     *
     * Can be `undefined` for creating a new conversation.
     */
    id?: UUID;
    message: Message;
}

interface ResponseBase {
    status: "success" | "fail";
}

/**
 * `POST /api/conversation`
 *
 * Response payload interface when request succeeds
 */
export interface PostResponseSuccess extends ResponseBase {
    type: "message" | "control";
    /**
     * Conversation ID
     *
     * A unique identifier for a conversation.
     *
     * Always not `undefined`, since server will always allocate a new
     * conversation ID or return the conversation ID that is sent through the
     * request payload.
     */
    id: UUID;
}

export interface PostResponseMessage extends PostResponseSuccess {
    message: Message;
}

export interface PostResponseControl extends PostResponseSuccess {
    control: Control;
}

/**
 * `POST /api/conversation`
 *
 * Response payload interface when request fails
 */
export interface PostResponseFail extends ResponseBase {
    reason: string;
}
