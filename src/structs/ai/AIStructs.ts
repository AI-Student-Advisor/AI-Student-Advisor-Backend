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
  sessionId: string;
  user_role?: USER_ROLE;
  llm_type: LLM_TYPE;
  initial_prompt?: string;
  remember_history?: boolean;
  tools?: any;
  maxIterations?: number;
  verbose?: boolean;
};

export type DataRetrieverConfig = {
  name: string;
  context: string;
  loader: any;
  vectorDBType: VECTOR_DB_TYPE;
  embeddingModelType: EMBEDDING_MODELS;
  generateEmbeddings?: boolean;
  loadVectorStoreFromCloud?: boolean;
  saveEmbeddingsToCloud?: boolean;
  chunkSize?: number;
  chunkOverlap?: number;
};

export type VectorStoreConfig = {
  vectorDBType: VECTOR_DB_TYPE;
  embeddingModelType: EMBEDDING_MODELS;
  loader: any;
  generateEmbeddings?: boolean;
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
export const enum VECTOR_DB_TYPE {
  // local in-memory
  CLOSE_VECTOR_STORE,
  MEMORY,
  // cloud-hosted
  ASTRA_DB
}
