import { HistoryConversation } from "api/interfaces/CommonStruct.ts";

const apiEndpoint = "/api/history-conversations";

export async function fetchHistoryConversations(): Promise<
    HistoryConversation[]
> {
    // TODO: Now simulating server response, will be a real fetch() operation later
    void apiEndpoint;

    return Array.from({ length: 30 }, (...[, index]) => ({
        id: crypto.randomUUID(),
        // eslint-disable-next-line no-magic-numbers
        dateTimeIso: new Date(new Date().getTime() - index * 1e7).toISOString(),
        title: `Test entry ${index}`
    }));
}
