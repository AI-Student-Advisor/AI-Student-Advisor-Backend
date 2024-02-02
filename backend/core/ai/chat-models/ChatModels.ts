// Return chat model based on llm type

import { LLM_TYPE } from "../../structs/ai/AIStructs";
import { getLlamaChatModel } from "./BedrockChatModel";
import { getOpenAIChatModel } from "./OpenAIChatModel";

export function getChatModel(llmType: LLM_TYPE) {
  switch (llmType) {
    case LLM_TYPE.OPEN_AI:
      return getOpenAIChatModel();
    case LLM_TYPE.PALM:
    // return new PalmChatModel();
    case LLM_TYPE.LLAMA:
      return getLlamaChatModel();
    default:
      throw new Error("Invalid LLM type");
  }
}
