import { AppConfig } from "/config/AppConfig.js";
import { getOpenAIAPIKey } from "/config/keys.js";
import { OpenAIEmbeddings } from "@langchain/openai";

export function getOpenAIEmbeddingModel() {
  return new OpenAIEmbeddings({
    modelName: AppConfig.ai.openai.embedding_model_name,
    openAIApiKey: getOpenAIAPIKey(),
    timeout: AppConfig.ai.openai.embedding_model_timeout,
    maxRetries: AppConfig.ai.openai.embedding_model_max_retries
  });
}
