// Return embedding model by type

import { getBedrockEmbeddingModel } from "./BedrockEmbeddingModel";
import { EMBEDDING_MODELS } from "./EmbeddingModelsConfig";
import { getOpenAIEmbeddingModel } from "./OpenAIEmbeddingModel";

export function getEmbeddingModel(type: EMBEDDING_MODELS) {
  switch (type) {
    case EMBEDDING_MODELS.OPENAI:
      return getOpenAIEmbeddingModel();
    case EMBEDDING_MODELS.BEDROCK:
      return getBedrockEmbeddingModel();
    default:
      throw new Error(`Unsupported embedding model type: ${type}`);
  }
}