import {
  getUpstashRedisRESTAPIKey,
  getUpstashRedisRESTAPIURL
} from "/ai/AIKeys.js";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";

export function getUpstashChatHistoryStore(sessionId: string) {
  return new UpstashRedisChatMessageHistory({
    sessionId,
    config: {
      url: getUpstashRedisRESTAPIURL(),
      token: getUpstashRedisRESTAPIKey()
    }
  });
}
