import {
  getUpstashRedisRESTAPIKey,
  getUpstashRedisRESTAPIURL
} from "/config/keys";
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
