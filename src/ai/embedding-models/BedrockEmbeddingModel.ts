import { AppConfig } from "/config/AppConfig.js";
import {
  getAWSAccessKeyID,
  getAWSRegion,
  getAWSSecretAccessKey
} from "/ai/AIKeys.js";
import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";

export function getBedrockEmbeddingModel() {
  return new BedrockEmbeddings({
    model: AppConfig.ai.bedrock.embedding_model_name,
    region: getAWSRegion(),
    credentials: {
      accessKeyId: getAWSAccessKeyID(),
      secretAccessKey: getAWSSecretAccessKey()
    },
    maxRetries: AppConfig.ai.bedrock.embedding_model_max_retries
  });
}
