/*
 * Exposing ChatAgent methods for API calls

  Usage:

  - Enabling chat agent
    chatAgent.enableChat()
  - Querying chat agent
    chatAgent.query(agentInput, responseHandler)
  - Disabling chat agent
    chatAgent.disableChat()
 */

import {
  LLM_TYPE,
  EMBEDDING_MODELS,
  VECTOR_DB_TYPE,
  AgentInput,
  ChatAgentConfig,
} from "./structs/ai/AIStructs";
import { getWebBaseLoader } from "./ai/data-loaders/WebDataLoaders";
import { DataRetriever } from "./ai/data-retrievers/DataRetriever";
import { TU } from "./test/Util";
import { ChatAgent } from "./ai/chat-agents/ChatAgent";
import * as crypto from "crypto";
class TestChatAgent {
  private static TEST_PARAMS = {
    using_test_query: false, // if false, will start CLI interface
    testUrl: "https://catalogue.uottawa.ca/en/courses/csi/",
    testQuery:
      "What courses should I take if I am interested in machine learning?",
    llm_model: LLM_TYPE.OPEN_AI,
    embeddings_model: EMBEDDING_MODELS.OPENAI,
    data_retriever_name: "uOttawaChat",
    data_context: "University of Ottawa",
    generateEmbeddings: false,
    loadVectorStoreFromCloud: true,
    vector_db_type: VECTOR_DB_TYPE.ASTRA_DB,
    sessionId: crypto.randomUUID(),
  };
  private chatAgent: any;

  // constructor
  constructor() {}

  async setupChatAgent() {
    // setup chat agent
    // PART 1: Get Retriever Tool
    const webDataLoader = getWebBaseLoader(TestChatAgent.TEST_PARAMS.testUrl);
    const dataRetriever = new DataRetriever({
      name: TestChatAgent.TEST_PARAMS.data_retriever_name,
      context: TestChatAgent.TEST_PARAMS.data_context,
      loader: webDataLoader,
      generateEmbeddings: TestChatAgent.TEST_PARAMS.generateEmbeddings,
      loadVectorStoreFromCloud:
        TestChatAgent.TEST_PARAMS.loadVectorStoreFromCloud,
      vectorDBType: TestChatAgent.TEST_PARAMS.vector_db_type,
      embeddingModelType: TestChatAgent.TEST_PARAMS.embeddings_model,
    });
    const retrieverTool = await dataRetriever.setupRetriever();

    // PART 2: Create Chat Agent
    const chatAgentConfig: ChatAgentConfig = {
      sessionId: TestChatAgent.TEST_PARAMS.sessionId, // required parameter
      llm_type: TestChatAgent.TEST_PARAMS.llm_model, // LLM to use
      // provide retriever tool so chat agent can retriever context from out data
      tools: [retrieverTool],
    };
    this.chatAgent = new ChatAgent(chatAgentConfig);
  }

  // get chat agent
  getChatAgent() {
    return this.chatAgent;
  }

  // enable chat agent
  async enableChat() {
    await this.chatAgent.enableChat();
  }

  // query the chat agent with the user query and the response handler
  async query(agentInput: AgentInput, responseHandler: any) {
    await this.chatAgent.query(agentInput, responseHandler);
  }

  // disable chat agent
  async disableChat() {
    this.chatAgent.disableChat();
  }
}

export async function getTestChatAgent() {
  const tca = new TestChatAgent();
  await tca.setupChatAgent();
  await tca.enableChat();
  return tca.getChatAgent();
}
