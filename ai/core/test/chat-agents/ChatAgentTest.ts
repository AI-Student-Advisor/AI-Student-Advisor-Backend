/*

Basic workflow for a webpage based chat agent:

1. Create a DataRetriever object with a WebDataLoader
  - The WebDataLoader is initialized with a URL
  - The DataRetriever is initialized with the WebDataLoader and a vector database type and an embedding model type
  - Returns a Retriever tool which will be used by the chat agent

2. Create a ChatAgent object instance
  - The ChatAgent is initialized with a ChatAgentConfig object
  - The ChatAgentConfig object contains the following properties:
    - user_role: to let LLM know the user's role
    - sessionId: to identify the user and their history
    - llm_type: the LLM chat model to use (ex: Open AI, Llama etc.)
    - initial_prompt: system prompt to use
    - tools: the retriever tool + any other tools
    - maxIterations: maximum number of iterations agent should run
    - verbose: boolean to enable verbose mode
  - The ChatAgent object instance is then used to enable and disable chat

3. Query the chat agent
  - The chat agent is queried with a AgentInput object
  - The AgentInput object contains the user query and the sessionId
  - The chat agent returns a response once the query is complete
  - A response handler can be used to handle the response and get the status of the query (ex: to show a loading spinner)

*/
import {
  AgentResponse,
  ChatAgent,
  QUERY_STATUS,
} from "../../src/chat-agents/ChatAgent";
import { ChatAgentConfig } from "../../src/chat-agents/ChatAgentConfig";
import { LLM_TYPE } from "../../src/chat-models/ChatModelsConfig";
import { getWebBaseLoader } from "../../src/data-loaders/WebDataLoaders";
import { EMBEDDING_MODELS } from "../../src/embedding-models/EmbeddingModelsConfig";
import { DataRetriever } from "../../src/retrievers/DataRetriever";
import { VECTOR_DB_TYPE } from "../../src/vector-databases/VectorDatabasesConfig";
import { TU } from "../Util";

const TEST_NAME = "CHAT_AGENT_TEST";

const TEST_PARAMS = {
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

async function testChatAgent() {
  // PART 1: Get Retriever Tool
  const webDataLoader = getWebBaseLoader(TEST_PARAMS.testUrl);
  const dataRetriever = new DataRetriever({
    name: TEST_PARAMS.data_retriever_name,
    context: TEST_PARAMS.data_context,
    loader: webDataLoader,
    loadCloseVectorStoreFromCloud: TEST_PARAMS.loadCloseVectorStoreFromCloud,
    vectorDBType: TEST_PARAMS.vector_db_type,
    embeddingModelType: TEST_PARAMS.embeddings_model,
  });
  const retrieverTool = await dataRetriever.setupRetriever();

  // PART 2: Create Chat Agent
  const chatAgentConfig: ChatAgentConfig = {
    sessionId: TEST_PARAMS.sessionId, // required parameter
    llm_type: TEST_PARAMS.llm_model, // LLM to use
    // provide retriever tool so chat agent can retriever context from out data
    tools: [retrieverTool],
  };
  const chatAgent = new ChatAgent(chatAgentConfig);

  // PART 3: Enable Chat and Query the Chat Agent
  const chatEnabled = await chatAgent.enableChat();
  if (!chatEnabled) {
    TU.tmprintError("testChatAgent FAILED", "Chat agent failed to enable");
    return;
  } else {
    TU.tmprint("testChatAgent", "Chat agent enabled");
  }

  if (TEST_PARAMS.using_test_query) {
    // prepare input method returns the AgentInput object with the session ID associated with the chat agent
    const agentInput = chatAgent.prepareInput(TEST_PARAMS.testQuery);
    // create a response handler which takes in AgentResponse object
    const responseHandler = getResponseHandler();
    // query the chat agent with the user query and the response handler
    await chatAgent.query(agentInput, responseHandler);
  } else {
    // start CLI interface for chat agent
    cli(chatAgent);
  }
}

function cli(chatAgent: ChatAgent) {
  TU.print(
    "\nCLI-based AI Student Advisor ready for your query related to " +
      TEST_PARAMS.data_context +
      ". Type 'exit' to exit.\n"
  );
  // start prompt
  const prompt = require("prompt");
  // start prompt
  prompt.start();
  // start chat
  startChat(prompt, chatAgent);
}

function startChat(prompt: any, chatAgent: ChatAgent) {
  prompt.get(["query"], async (err: any, result: any) => {
    // check for error
    if (err) {
      TU.tmprintError("cli FAILED", err);
      return;
    }
    // check if user wants to exit
    if (result.query === "exit") {
      TU.tmprint("cli EXIT", "Exiting CLI");
      printTestDone();
      return;
    }
    // prepare input method returns the AgentInput object with the session ID associated with the chat agent
    const agentInput = chatAgent.prepareInput(result.query);
    // create a response handler which takes in AgentResponse object
    const responseHandler = getResponseHandler();
    // query the chat agent with the user query and the response handler
    await chatAgent.query(agentInput, responseHandler);
    startChat(prompt, chatAgent);
  });
}

// utility method to get a response handler
function getResponseHandler() {
  return (response: AgentResponse) => {
    // check the status of the response
    switch (response.status) {
      case QUERY_STATUS.PENDING:
        // if response is pending, print a loading message
        printLoadingMessage(false);
        break;
      case QUERY_STATUS.ERROR:
        // stop the response is loading message
        printLoadingMessage(true);
        // if response is error, print the error message
        TU.tmprintError("testChatAgent FAILED", response.response);
        break;
      case QUERY_STATUS.SUCCESS:
        // stop the response is loading message
        printLoadingMessage(true);
        // Below line for additional debugging
        // console.log(JSON.stringify(response.response, null, 2));
        // if response is not pending, print the response
        TU.print("AI Student Advisor response: " + response.response.output);
        break;
      default:
        TU.tmprintError("testChatAgent FAILED", "Invalid response status");
        break;
    }
  };
}

// method to print a message indicating that the query is in process
// and to stop the message if the response is not pending
let printingMessage: any = undefined;
function printLoadingMessage(stopExecution: boolean) {
  if (!stopExecution) {
    printingMessage = setInterval(() => {
      TU.print("Waiting for LLM response...");
    }, 2000);
    return;
  } else {
    clearInterval(printingMessage);
    return;
  }
}

function printTestDone() {
  TU.tprint(`Done ${TEST_NAME}!`);
}

// execute tests
export async function executeChatAgentTests() {
  TU.setTitle(TEST_NAME);
  TU.tprint(`Running ${TEST_NAME}!`);
  await testChatAgent();
}
