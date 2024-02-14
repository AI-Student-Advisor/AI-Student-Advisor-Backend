/**
 * Interfaces and types used primarily by the ChatAgent class.
 */

export const enum QUERY_STATUS {
  SUCCESS = "success",
  ERROR = "error",
  PENDING = "pending",
  STARTED = "started",
  DONE = "done"
}

export type AgentResponse = {
  status: QUERY_STATUS;
  response?: any;
};

export type AgentInput = {
  user: { input: string };
  config: { configurable: { sessionId: string } };
};

export type USER_ROLE = "student" | "faculty member";

export const enum LLM_TYPE {
  OPEN_AI,
  PALM,
  LLAMA
}

/**
 * Chat agent configurations required to initialize the chat agent.
 */
export type ChatAgentConfig = {
  llmType: LLM_TYPE;
  context: string;
  userRole: USER_ROLE;
  chatHistoryStore: CHAT_HISTORY_STORE;
  useKnowledgeBase?: boolean;
  initialPrompt?: string;
  rememberHistory?: boolean;
  tools?: any;
  maxIterations?: number;
  verbose?: boolean;
};

export type DataRetrieverConfig = {
  retrieverToolName: string;
  context: string;
  vectorStoreConfig: VectorStoreConfig;
};

export type VectorStoreConfig = {
  vectorDBType: VECTOR_STORE;
  embeddingModelType: EMBEDDING_MODELS;
  loader: any;
  loadVectorStoreFromCloud?: boolean;
  saveEmbeddingsToCloud?: boolean;
  chunkSize?: number;
  chunkOverlap?: number;
};

/**
 * Supported embedding models
 */
export const enum EMBEDDING_MODELS {
  OPENAI,
  BEDROCK
}

/**
 * Types of vector databases supported
 */
export const enum VECTOR_STORE {
  // local in-memory
  MEMORY,
  // cloud-hosted
  ASTRA_DB,
  PINECONE
}

/**
 * Types of databases supported for storing chat history
 */
export const enum CHAT_HISTORY_STORE {
  ASTRA_DB,
  UPSTASH
}

/**
 * Supported chat agents for specific schools
 */
export const enum SUPPORTED_CHAT_AGENTS {
  U_OTTAWA = "uOttawa"
}
