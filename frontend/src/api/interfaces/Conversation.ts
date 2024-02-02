import { Control } from "api/interfaces/StructControl.ts";
import { Message } from "api/interfaces/StructMessage.ts";

export const enum REQUEST_STATUS {
    SUCCESS = "success",
    FAIL = "fail"
}

interface ResponseBase {
    status: "success" | "fail";
}

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
    id?: string;
    message: Message;
}

export enum RESPONSE_TYPE {
    MESSAGE = "message",
    CONTROL = "control"
}

/**
 * `POST /api/conversation`
 *
 * Response payload interface when request succeeds
 */
export interface PostResponseSuccess extends ResponseBase {
    type: "message";
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
    type: "message";
    reason: string;
}

export interface PostResponseControl {
    type: RESPONSE_TYPE.CONTROL;
    control: Control;
    message?: Message;
}
