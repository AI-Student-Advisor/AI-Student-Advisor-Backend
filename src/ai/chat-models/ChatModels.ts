// Return chat model based on llm type
import { getLlamaChatModel } from "./BedrockChatModel.js";
import { getOpenAIChatModel } from "./OpenAIChatModel.js";
import { LLM_TYPE } from "/structs/ai/AIStructs.js";

export function getChatModel(llmType: LLM_TYPE) {
  switch (llmType) {
    case LLM_TYPE.OPEN_AI:
      return getOpenAIChatModel();
    case LLM_TYPE.LLAMA:
      return getLlamaChatModel();
    default:
      throw new Error("Invalid LLM type");
  }
}
