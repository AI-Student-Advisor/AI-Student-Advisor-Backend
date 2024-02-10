import { getAstraDBChatHistoryStore } from "./AstraDBChatHistoryStore";
import {
  getUpstashRedisRESTAPIKey,
  getUpstashRedisRESTAPIURL
} from "/config/keys";
import { CHAT_HISTORY_STORE } from "/structs/ai/AIStructs.js";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";

export function getChatHistoryStore(
  sessionId: string,
  chatHistoryStore: CHAT_HISTORY_STORE
) {
  switch (chatHistoryStore) {
    case CHAT_HISTORY_STORE.ASTRA_DB:
      return getAstraDBChatHistoryStore(sessionId);
    case CHAT_HISTORY_STORE.UPSTASH:
      return new UpstashRedisChatMessageHistory({
        sessionId,
        config: {
          url: getUpstashRedisRESTAPIURL(),
          token: getUpstashRedisRESTAPIKey()
        }
      });
    default:
      throw new Error("Invalid chat history store");
  }
}
