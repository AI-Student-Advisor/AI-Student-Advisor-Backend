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
  AgentInput,
  AgentResponse,
  ChatAgent,
  QUERY_STATUS,
} from "./src/chat-agents/ChatAgent";
import { ChatAgentConfig } from "./src/chat-agents/ChatAgentConfig";
import { LLM_TYPE } from "./src/chat-models/ChatModelsConfig";
import { getWebBaseLoader } from "./src/data-loaders/WebDataLoaders";
import { EMBEDDING_MODELS } from "./src/embedding-models/EmbeddingModelsConfig";
import { DataRetriever } from "./src/retrievers/DataRetriever";
import { VECTOR_DB_TYPE } from "./src/vector-databases/VectorDatabasesConfig";
import { TU } from "./test/Util";

export class TestChatAgent {
  private static TEST_PARAMS = {
    using_test_query: false, // if false, will start CLI interface
    testUrl: "https://catalogue.uottawa.ca/en/courses/csi/",
    testQuery:
      "What courses should I take if I am interested in machine learning?",
    llm_model: LLM_TYPE.OPEN_AI,
    embeddings_model: EMBEDDING_MODELS.OPENAI,
    data_retriever_name: "uOttawaChat",
    data_context: "University of Ottawa",
    loadCloseVectorStoreFromCloud: true,
    vector_db_type: VECTOR_DB_TYPE.CLOSE_VECTOR_STORE,
    sessionId: crypto.randomUUID(),
  };
  private chatAgent: any;

  // constructor
  constructor(chatAgentConfig: ChatAgentConfig) {
    // setup chat agent
    // this.setupChatAgent();
  }

  async setupChatAgent() {
    // setup chat agent
    // PART 1: Get Retriever Tool
    const webDataLoader = getWebBaseLoader(TestChatAgent.TEST_PARAMS.testUrl);
    const dataRetriever = new DataRetriever({
      name: TestChatAgent.TEST_PARAMS.data_retriever_name,
      context: TestChatAgent.TEST_PARAMS.data_context,
      loader: webDataLoader,
      loadCloseVectorStoreFromCloud:
        TestChatAgent.TEST_PARAMS.loadCloseVectorStoreFromCloud,
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

  // enable chat agent
  async enableChat() {
    const chatEnabled = await this.chatAgent.enableChat();
    if (!chatEnabled) {
      TU.tmprintError("testChatAgent FAILED", "Chat agent failed to enable");
      return;
    } else {
      TU.tmprint("testChatAgent", "Chat agent enabled");
    }
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
