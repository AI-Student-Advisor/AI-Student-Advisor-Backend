/**
 * Configuration settings for chat agent.
 * Also, exposes some configuration options that
 * can be used to configure a custom chat agent.
 */

import { LLM_TYPE } from "src/chat-models/ChatModelsConfig";

/**
 * User roles
 */
export type USER_ROLE = "student" | "faculty member";

/**
 * Chat agent configurations
 */
export type ChatAgentConfig = {
  sessionId: string;
  user_role?: USER_ROLE;
  llm_type: LLM_TYPE;
  initial_prompt?: string;
  remember_history?: boolean;
  tools?: [];
  maxIterations?: number;
  verbose?: boolean;
};

/**
 * Default configurations
 */
export const default_config: ChatAgentConfig = {
  sessionId: "",
  user_role: "student",
  llm_type: LLM_TYPE.OPEN_AI,
  initial_prompt: "",
  remember_history: false,
  tools: [],
  maxIterations: 10,
  verbose: false,
};
