/**
 * Configuration settings for chat agent.
 * Also, exposes some configuration options that
 * can be used to configure a custom chat agent.
 */

/**
 * Types of vector databases supported
 */
export const enum VECTOR_DB_TYPE {
  PINECONE,
  MEMORY,
}

/**
 * Types of Large Language Models (LLMs) supported
 */
export const enum LLM_TYPE {
  OPEN_AI,
  PALM,
}

/**
 * Chat agent configurations
 */
export interface ChatAgentConfig {
  debug_mode: boolean;
  use_knowledge_base: boolean;
  remember_history: boolean;
  initial_prompt: string;
  vector_db_type: VECTOR_DB_TYPE;
  vector_db_address: string;
  llm_type: LLM_TYPE;
  llm_api_key: string;
}

/**
 * Default configurations
 */
export const default_config: ChatAgentConfig = {
  debug_mode: false,
  use_knowledge_base: false,
  vector_db_address: "",
  vector_db_type: VECTOR_DB_TYPE.MEMORY,
  remember_history: false,
  initial_prompt: "",
  llm_type: LLM_TYPE.OPEN_AI,
  llm_api_key: "",
};
