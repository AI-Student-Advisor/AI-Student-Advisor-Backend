import {
  ChatAgentConfig,
  default_config,
} from "../../core/chat-agent/ChatAgentConfig";
import {
  ChatAgentType,
  getNewChatAgent,
} from "../../core/chat-agent/ChatAgent";
import { TU } from "../Util";

// chat agent instance
let chatAgent: ChatAgentType;

// initialize chat agent
function initChatAgent(chatConfig: ChatAgentConfig | undefined) {
  // if no chatConfig is provided, use default_config
  if (chatConfig == undefined) {
    chatConfig = default_config;
    TU.tprint("CHAT_AGENT_TEST", "Using default_config for Chat Agent");
  }
  // initialize the chat agent instance to be used for tests
  chatAgent = getNewChatAgent(chatConfig);
}

// test query method is working by providing an empty query string
function testQuery() {
  try {
    chatAgent.query("");
    TU.tprint("CHAT_AGENT_TEST", "query method is working");
  } catch (error: any) {
    TU.tprintError("CHAT_AGENT_TEST", "query method is not working");
    TU.printError(error.message);
  }
}

// test query_stream method is working by providing an empty query string
function testQueryStream() {
  try {
    chatAgent.query_stream("");
    TU.tprint("CHAT_AGENT_TEST", "query_stream method is working");
  } catch (error) {
    TU.tprint("CHAT_AGENT_TEST", "query_stream method is not working");
  }
}

// execute tests
export function executeChatAgentTests(
  chatAgentConfig?: ChatAgentConfig | undefined
) {
  TU.tprint("CHAT_AGENT_TEST", "Running ChatAgentTest!");
  initChatAgent(chatAgentConfig);
  testQuery();
  testQueryStream();
}
