import { ChatAgent } from "../ChatAgent.js";
import { getSystemPrompt } from "../ChatAgentSystemPrompt.js";
import { getCustomAgentExecutor } from "../CustomAgentExecutor.js";
import { getOpenAIAgentExecutor } from "../OpenAIAgentExecutor.js";
import {
  CHAT_HISTORY_STORE,
  ChatAgentConfig,
  EMBEDDING_MODELS,
  LLM_TYPE,
  VECTOR_STORE
} from "/ai/AIStructs.js";
import { getChatModel } from "/ai/chat-models/ChatModels.js";
import { DataRetriever } from "/ai/data-retrievers/DataRetriever.js";
import { logger } from "/utilities/Log.js";
import { JSONLinesLoader } from "langchain/document_loaders/fs/json";

const loggerContext = "uOttawaChatAgent";

export class uOttawaChatAgent extends ChatAgent {
  async setupNewUOttawaChatAgent() {
    // specify whether to generate embeddings
    const GENERATE_EMBEDDINGS = false;
    const DATA_FILE_PATH =
      "src/ai/chat-agents/specialized-chat-agents/uottawa_catalog_data.jsonl";
    const loader = GENERATE_EMBEDDINGS
      ? new JSONLinesLoader(DATA_FILE_PATH, "/text")
      : undefined;

    // PART 1: Configurations
    const vectorStoreConfig = {
      loader: loader,
      vectorDBType: VECTOR_STORE.PINECONE,
      embeddingModelType: EMBEDDING_MODELS.OPENAI,
      loadVectorStoreFromCloud: !GENERATE_EMBEDDINGS,
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
      chatHistoryStore: CHAT_HISTORY_STORE.UPSTASH,
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
      logger.debug({ context: loggerContext }, "Open AI agent initialized");
    } else {
      this.chatAgent = getCustomAgentExecutor(
        getChatModel(config.llmType),
        getSystemPrompt(config.context, config.userRole),
        tools,
        config.maxIterations,
        config.verbose
      );
      logger.debug({ context: loggerContext }, "Custom agent initialized");
    }

    // PART 4: Enable chat by default
    this.enableChat();
  }
}
