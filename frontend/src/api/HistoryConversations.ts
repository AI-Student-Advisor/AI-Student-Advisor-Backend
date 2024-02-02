import { HistoryConversation } from "api/interfaces/StructHistoryConversation.ts";
import { v4 as uuid } from "uuid";

// const apiEndpoint = "/api/history-conversations";

// TODO: Now simulating server response, will be a real fetch() operation later
export async function fetchHistoryConversations(): Promise<
    HistoryConversation[]
> {
    return Array.from({ length: 30 }, (...[, index]) => ({
        id: uuid(),
        // eslint-disable-next-line no-magic-numbers
        dateTimeIso: new Date(new Date().getTime() - index * 1e7).toISOString(),
        title: `Test entry ${index}`
    }));
}
