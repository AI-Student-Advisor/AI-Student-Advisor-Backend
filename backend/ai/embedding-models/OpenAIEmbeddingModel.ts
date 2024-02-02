import { OpenAIEmbeddings } from "@langchain/openai";
import { AppConfig } from "../../config/AppConfig";
import { getOpenAIAPIKey } from "../../config/keys";

export function getOpenAIEmbeddingModel() {
  return new OpenAIEmbeddings({
    modelName: AppConfig.ai.openai.embedding_model_name,
    openAIApiKey: getOpenAIAPIKey(),
    timeout: AppConfig.ai.openai.embedding_model_timeout,
    maxRetries: AppConfig.ai.openai.embedding_model_max_retries,
  });
}
