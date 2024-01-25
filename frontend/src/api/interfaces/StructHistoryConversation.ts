/**
 * Describe a history conversation entry that is meant to be displayed in the
 * sidebar.
 */
export interface HistoryConversation {
    /**
     * Conversation ID
     */
    id: string;
    /**
     * Data & time string in ISO 8601 standard
     */
    dateTimeIso: string;
    title: string;
}
