import { AppConfig } from "/config/AppConfig.js";
import {
  getAWSAccessKeyID,
  getAWSRegion,
  getAWSSecretAccessKey
} from "/config/keys.js";
import { Bedrock } from "@langchain/community/llms/bedrock";

export function getLlamaChatModel() {
  return new Bedrock({
    model: AppConfig.ai.bedrock.chat_model_name,
    maxTokens: AppConfig.ai.bedrock.chat_model_max_tokens,
    temperature: AppConfig.ai.bedrock.chat_model_temperature,
    region: getAWSRegion(),
    credentials: {
      accessKeyId: getAWSAccessKeyID(),
      secretAccessKey: getAWSSecretAccessKey()
    },
    maxRetries: AppConfig.ai.bedrock.chat_model_max_retries
  });
}
