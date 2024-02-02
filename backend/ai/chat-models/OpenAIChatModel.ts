import { ChatOpenAI } from "@langchain/openai";
import { AppConfig } from "../../config/AppConfig";
import { getOpenAIAPIKey } from "../../config/keys";

export function getOpenAIChatModel() {
  return new ChatOpenAI({
    openAIApiKey: getOpenAIAPIKey(),
    modelName: AppConfig.ai.openai.chat_model_name,
    maxTokens: AppConfig.ai.openai.chat_model_max_tokens,
    temperature: AppConfig.ai.openai.chat_model_temperature,
    maxRetries: AppConfig.ai.openai.chat_model_max_retries,
  });
}
