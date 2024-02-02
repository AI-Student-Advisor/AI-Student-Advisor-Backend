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
