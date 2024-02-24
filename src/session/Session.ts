import { ChatAgent } from "/ai/chat-agents/ChatAgent.js";
import type { SessionId } from "/api/interfaces/Common.js";

export interface Session {
  id: SessionId;
  chatAgent: ChatAgent;
}
