import { getAstraDBChatHistoryStore } from "./AstraDBChatHistoryStore";
import { getUpstashChatHistoryStore } from "./UpstashChatHistoryStore";
import { CHAT_HISTORY_STORE } from "/structs/ai/AIStructs.js";

export function getChatHistoryStore(
  sessionId: string,
  chatHistoryStore: CHAT_HISTORY_STORE
) {
  switch (chatHistoryStore) {
    case CHAT_HISTORY_STORE.ASTRA_DB:
      return getAstraDBChatHistoryStore(sessionId);
    case CHAT_HISTORY_STORE.UPSTASH:
      return getUpstashChatHistoryStore(sessionId);
    default:
      throw new Error("Invalid chat history store");
  }
}
