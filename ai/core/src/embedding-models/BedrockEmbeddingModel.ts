import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
import { AppConfig } from "../../config/AppConfig";
import {
  getAWSAccessKeyID,
  getAWSRegion,
  getAWSSecretAccessKey,
} from "../../config/keys";

export function getBedrockEmbeddingModel() {
  return new BedrockEmbeddings({
    model: AppConfig.ai.bedrock_embedding_model_name,
    region: getAWSRegion(),
    credentials: {
      accessKeyId: getAWSAccessKeyID(),
      secretAccessKey: getAWSSecretAccessKey(),
    },
    maxRetries: 3,
  });
}
