/* 
Class representing the chat agent

Attributes:
  - debug_mode: false
  - use_knowledge_base: false
  - vector_db_address: ""
  - vector_db_type: Pinecone | Memory
  - remember_history: false
  - chat_agent_initial_prompt: ""
  - llm_type: OpenAI | PaLM

Methods:
  - query() : returns response
  - query_stream() : stream back response
*/

import { ChatAgentConfig } from "./ChatAgentConfig";

// private class
class ChatAgent {
  chatConfig: ChatAgentConfig;

  constructor(chatConfig: ChatAgentConfig) {
    this.chatConfig = chatConfig;
  }

  query(userQuery: string) {
    return "Query response";
  }

  query_stream(userQuery: string) {
    return "Query stream response";
  }
}

// export type ChatAgent
export type ChatAgentType = ChatAgent;

export function getNewChatAgent(chatConfig: ChatAgentConfig) {
  return new ChatAgent(chatConfig);
}
