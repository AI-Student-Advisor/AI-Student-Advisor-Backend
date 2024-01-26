import { Bedrock } from "@langchain/community/llms/bedrock";
import { AppConfig } from "../../config/AppConfig";
import {
  getAWSAccessKeyID,
  getAWSRegion,
  getAWSSecretAccessKey,
} from "config/keys";

export function getLlamaChatModel() {
  return new Bedrock({
    model: AppConfig.ai.chat_model_name,
    region: getAWSRegion(),
    credentials: {
      accessKeyId: getAWSAccessKeyID(),
      secretAccessKey: getAWSSecretAccessKey(),
    },
    maxRetries: 3,
  });
}
