import { getChatHistoryStore } from "../chat-history/getChatHistoryStore.js";
import { CHAT_HISTORY_STORE } from "/ai/AIStructs.js";
import { getOpenAIChatModel } from "/ai/chat-models/OpenAIChatModel.js";
import { logger } from "/utilities/Log.js";
import {
  ChatPromptTemplate,
  MessagesPlaceholder
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";

const loggerContext = "OpenAIAgentExecutor";

export const INPUT_MESSAGE_KEY = "input";
export const HISTORY_MESSAGE_KEY = "history";

export async function getOpenAIAgentExecutor(
  systemPrompt: string,
  chatHistoryStore: CHAT_HISTORY_STORE,
  tools?: any,
  maxIterations?: number,
  verbose?: boolean
) {
  logger.debug(
    { context: loggerContext },
    "Setting up Open AI agent executor..."
  );
  // verify optional parameters
  // check if any tools provided
  if (tools === undefined || tools === null) {
    tools = [];
  }
  if (maxIterations === undefined || maxIterations === null) {
    maxIterations = 100;
  }
  if (verbose === undefined || verbose === null) {
    verbose = false;
  }

  // Setup chat agent prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder(HISTORY_MESSAGE_KEY),
    new MessagesPlaceholder("agent_scratchpad"),
    ["user", `{${INPUT_MESSAGE_KEY}}`]
  ]);

  const llm = getOpenAIChatModel();

  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt
  });

  logger.debug({ context: loggerContext }, "Done initializing agent");

  // AgentExecutor - calls the agent and executes the tools
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: verbose,
    maxIterations: maxIterations
    // returnIntermediateSteps: false,  // turn on for debugging
  });
  logger.debug({ context: loggerContext }, "Done initializing agent executor");

  return new RunnableWithMessageHistory({
    runnable: agentExecutor,
    getMessageHistory: (sessionId: string) =>
      getChatHistoryStore(sessionId, chatHistoryStore),
    inputMessagesKey: INPUT_MESSAGE_KEY,
    historyMessagesKey: HISTORY_MESSAGE_KEY
  });
}
