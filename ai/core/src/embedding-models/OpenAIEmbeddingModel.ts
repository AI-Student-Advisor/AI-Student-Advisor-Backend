import { OpenAIEmbeddings } from "@langchain/openai";
import { AppConfig } from "../../config/AppConfig";
import { getOpenAIAPIKey } from "../../config/keys";

export function getOpenAIEmbeddingModel() {
  return new OpenAIEmbeddings({
    modelName: AppConfig.ai.openai_embedding_model_name,
    openAIApiKey: getOpenAIAPIKey(),
    timeout: 10000,
    maxRetries: 3,
  });
}
