// Return chat model based on llm type

import { LLM_TYPE } from "./ChatModelsConfig";
import { getLlamaChatModel } from "./BedrockChatModel";

export function getChatModel(llmType: LLM_TYPE) {
  switch (llmType) {
    case LLM_TYPE.OPEN_AI:
    // return new OpenAIChatModel();
    case LLM_TYPE.PALM:
    // return new PalmChatModel();
    case LLM_TYPE.LLAMA:
      return getLlamaChatModel();
    default:
      throw new Error("Invalid LLM type");
  }
}
