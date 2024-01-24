/* 
Class representing the chat agent

Attributes:
  debug_mode: set the debug mode; if true, then prints additional messages
  use_knowledge_base: whether to use knowledge base or not
  remember_history: whether to remember conversation history or not
  initial_prompt: initial prompt for the AI chat agent, for example, to set tone or context
  vector_db_type: one of the supported vector database types
  vector_db_address: address of the vector database 
  llm_type: one of the supported Large Language Model (LLM) types
  llm_api_key: API key for the LLM

Methods:
  - query() : returns response once query is complete
  - query_stream() : stream back response from LLM as it is generated
*/

import { ChatAgentConfig, LLM_TYPE, VECTOR_DB_TYPE } from "./ChatAgentConfig";

// private class
class ChatAgent {
  _chatConfig: ChatAgentConfig;

  constructor(chatConfig: ChatAgentConfig) {
    this._chatConfig = chatConfig;
  }

  // Setters for configuring the chat agent
  setDebugMode = (debugMode: boolean) =>
    (this._chatConfig.debug_mode = debugMode);
  setUseKnowledgeBase = (useKnowledgeBase: boolean) =>
    (this._chatConfig.use_knowledge_base = useKnowledgeBase);
  setVectorDBAddress = (vectorDBAddress: string) =>
    (this._chatConfig.vector_db_address = vectorDBAddress);
  setVectorDBType = (vectorDBType: VECTOR_DB_TYPE) =>
    (this._chatConfig.vector_db_type = vectorDBType);
  setRememberHistory = (rememberHistory: boolean) =>
    (this._chatConfig.remember_history = rememberHistory);
  setInitialPrompt = (initialPrompt: string) =>
    (this._chatConfig.initial_prompt = initialPrompt);
  setLLMType = (llmType: LLM_TYPE) => (this._chatConfig.llm_type = llmType);
  setLLMApiKey = (llmApiKey: string) =>
    (this._chatConfig.llm_api_key = llmApiKey);

  // Getters for getting the chat agent configuration
  getDebugMode = (): boolean => this._chatConfig.debug_mode;
  getUseKnowledgeBase = (): boolean => this._chatConfig.use_knowledge_base;
  getVectorDBAddress = (): string => this._chatConfig.vector_db_address;
  getVectorDBType = (): VECTOR_DB_TYPE => this._chatConfig.vector_db_type;
  getRememberHistory = (): boolean => this._chatConfig.remember_history;
  getInitialPrompt = (): string => this._chatConfig.initial_prompt;
  getLLMType = (): LLM_TYPE => this._chatConfig.llm_type;
  getLLMApiKey = (): string => this._chatConfig.llm_api_key;

  // Method to query the chat agent and get a response when the query is complete
  query(userQuery: string) {
    return "Query response";
  }

  // Method to query the chat agent and get a stream of responses
  query_stream(userQuery: string) {
    return "Query stream response";
  }
}

// export type ChatAgent
export type ChatAgentType = ChatAgent;

export function getNewChatAgent(chatConfig: ChatAgentConfig) {
  return new ChatAgent(chatConfig);
}
