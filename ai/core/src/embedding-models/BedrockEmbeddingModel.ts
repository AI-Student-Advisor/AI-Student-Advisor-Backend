import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
import { AppConfig } from "../../config/AppConfig";
import {
  getAWSAccessKeyID,
  getAWSRegion,
  getAWSSecretAccessKey,
} from "../../config/keys";

export function getBedrockEmbeddingModel() {
  return new BedrockEmbeddings({
    model: AppConfig.ai.bedrock.embedding_model_name,
    region: getAWSRegion(),
    credentials: {
      accessKeyId: getAWSAccessKeyID(),
      secretAccessKey: getAWSSecretAccessKey(),
    },
    maxRetries: AppConfig.ai.bedrock.embedding_model_max_retries,
  });
}
