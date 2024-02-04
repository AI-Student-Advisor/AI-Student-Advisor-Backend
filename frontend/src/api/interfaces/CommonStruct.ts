export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/**
 * Interface of normal messages
 */
export interface Message {
    /**
     * Message ID. Should uniquely identify a single message.
     */
    id: UUID;
    /**
     * A MIME type that describes `content`.
     */
    contentType: MessageContentType;
    content?: string;
    /**
     * Specify who is the author of this message.
     */
    author: {
        role: "user" | "assistant" | "system";
    };
}

export type MessageContentType = "text/plain";

/**
 * Interface of control instructions
 */
export interface Control {
    /**
     * Predefined control signals.
     */
    signal:
        | "generation-pending"
        | "generation-started"
        | "generation-done"
        | "generation-error";
}

/**
 * Describe a history conversation entry that is meant to be displayed in the
 * sidebar.
 */
export interface HistoryConversation {
    /**
     * Session ID
     */
    id: UUID;
    /**
     * Data & time string in ISO 8601 standard
     */
    dateTimeIso: string;
    title: string;
}
