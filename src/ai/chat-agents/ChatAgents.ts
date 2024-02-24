/*
 * Class to get a specialized chat agent
 */
import { uOttawaChatAgent } from "./specialized-chat-agents/uOttawaChatAgent.js";
import { SUPPORTED_CHAT_AGENTS } from "/ai/AIStructs.js";

export async function setupNewChatAgent(agentType: SUPPORTED_CHAT_AGENTS) {
  switch (agentType) {
    case SUPPORTED_CHAT_AGENTS.U_OTTAWA: {
      const agent = new uOttawaChatAgent();
      await agent.setupNewUOttawaChatAgent();
      return agent;
    }
    default:
      throw new Error(`Unsupported chat agent type: ${agentType}`);
  }
}
