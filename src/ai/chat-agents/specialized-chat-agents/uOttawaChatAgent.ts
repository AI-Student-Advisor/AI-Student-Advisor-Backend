import { ChatAgent } from "../ChatAgent";
import { getSystemPrompt } from "../ChatAgentSystemPrompt";
import { getCustomAgentExecutor } from "../CustomAgentExecutor";
import { getOpenAIAgentExecutor } from "../OpenAIAgentExecutor";
import { getChatModel } from "/ai/chat-models/ChatModels";
import { DataRetriever } from "/ai/data-retrievers/DataRetriever";
import {
  CHAT_HISTORY_STORE,
  ChatAgentConfig,
  EMBEDDING_MODELS,
  LLM_TYPE,
  VECTOR_STORE
} from "/structs/ai/AIStructs";
import { dlog } from "/utilities/dlog";

export class uOttawaChatAgent extends ChatAgent {
  async setupNewUOttawaChatAgent() {
    // PART 1: Configurations
    const vectorStoreConfig = {
      loader: undefined,
      vectorDBType: VECTOR_STORE.ASTRA_DB,
      embeddingModelType: EMBEDDING_MODELS.OPENAI,
      loadVectorStoreFromCloud: true,
      saveEmbeddingsToCloud: undefined,
      chunkSize: undefined,
      chunkOverlap: undefined
    };

    const dataRetrieverConfig = {
      retrieverToolName: "uOttawaChat",
      context: "University of Ottawa",
      vectorStoreConfig
    };

    const config: ChatAgentConfig = {
      llmType: LLM_TYPE.OPEN_AI,
      context: "University of Ottawa",
      userRole: "student",
      chatHistoryStore: CHAT_HISTORY_STORE.ASTRA_DB,
      maxIterations: undefined,
      verbose: undefined
    };

    // PART 2: Setup tools
    const dataRetriever = new DataRetriever();
    await dataRetriever.setupRetriever(dataRetrieverConfig);
    const tools = [dataRetriever.getRetrieverTool()];

    // PART 3: Initialize Chat Agent
    if (config.llmType === LLM_TYPE.OPEN_AI) {
      this.chatAgent = await getOpenAIAgentExecutor(
        getSystemPrompt(config.context, config.userRole),
        config.chatHistoryStore,
        tools,
        config.maxIterations,
        config.verbose
      );
      dlog.msg("uOttawaChatAgent: Open AI agent initialized");
    } else {
      this.chatAgent = getCustomAgentExecutor(
        getChatModel(config.llmType),
        getSystemPrompt(config.context, config.userRole),
        tools,
        config.maxIterations,
        config.verbose
      );
      dlog.msg("uOttawaChatAgent: Custom agent initialized");
    }

    // PART 4: Enable chat by default
    this.enableChat();
  }
}
