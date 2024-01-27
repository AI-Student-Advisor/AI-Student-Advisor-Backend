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
TU.setTitle(TEST_NAME);

const url = "https://catalogue.uottawa.ca/en/courses/csi/";
const testQuery =
  "Which computer science courses should I take if I'm interested in machine learning?";
// const url = "https://example.com/";
// const testQuery = "What is example domain used for?";

async function testChatAgent() {
  // PART 1: Get Retriever Tool
  const webDataLoader = getWebBaseLoader(url);
  const dataRetriever = new DataRetriever({
    type: "webpage",
    name: "uOttawaChat",
    context: "University of Ottawa",
    loader: webDataLoader,
    loadCloseVectorStoreFromCloud: true,
    vectorDBType: VECTOR_DB_TYPE.CLOSE_VECTOR_STORE,
    embeddingModelType: EMBEDDING_MODELS.OPENAI,
  });
  const retrieverTool = await dataRetriever.setupRetriever();

  // PART 2: Create Chat Agent
  const chatAgentConfig: ChatAgentConfig = {
    sessionId: "123", // required parameter
    llm_type: LLM_TYPE.LLAMA, // we will be using Llama 2 model
    // provide retriever tool so chat agent can retriever context from out data
    tools: [retrieverTool],
  };
  const chatAgent = new ChatAgent(chatAgentConfig);

  // PART 3: Enable Chat and Query the Chat Agent
  chatAgent.enableChat();
  // prepare input method returns the AgentInput object with the session ID associated with the chat agent
  const agentInput = chatAgent.prepareInput(testQuery);
  // create a response handler which takes in AgentResponse object
  const responseHandler = getResponseHandler();
  // query the chat agent with the user query and the response handler
  chatAgent.query(agentInput, responseHandler);
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
        // if response is not pending, print the response
        TU.tmprint(
          "testChatAgent SUCCESS",
          "ChatAgent response: " + response.response
        );
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
      TU.tmprint("testChatAgent", "Query in process. Waiting for response...");
    }, 10000);
    return;
  } else {
    clearInterval(printingMessage);
    return;
  }
}

// execute tests
export function executeChatAgentTests() {
  TU.tprint(`Running ${TEST_NAME}!`);
  testChatAgent();
}
