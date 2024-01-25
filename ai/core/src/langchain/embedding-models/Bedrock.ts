import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
import { AppConfig } from "config/AppConfig";
import {
  getAWSAccessKeyID,
  getAWSRegion,
  getAWSSecretAccessKey,
} from "config/keys";

const embedding_model_name = AppConfig.ai.embedding_model_name;

export function getEmbeddingModel() {
  return new BedrockEmbeddings({
    region: getAWSRegion(),
    credentials: {
      accessKeyId: getAWSAccessKeyID(),
      secretAccessKey: getAWSSecretAccessKey(),
    },
    model: embedding_model_name,
  });
}
