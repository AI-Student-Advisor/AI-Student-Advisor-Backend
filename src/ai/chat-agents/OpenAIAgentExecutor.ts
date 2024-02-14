import { getChatHistoryStore } from "../chat-history/getChatHistoryStore.js";
import { getOpenAIChatModel } from "/ai/chat-models/OpenAIChatModel.js";
import { CHAT_HISTORY_STORE } from "/structs/ai/AIStructs.js";
import { dlog } from "/utilities/dlog.js";
import {
  ChatPromptTemplate,
  MessagesPlaceholder
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";

export const INPUT_MESSAGE_KEY = "input";
export const HISTORY_MESSAGE_KEY = "history";

export async function getOpenAIAgentExecutor(
  systemPrompt: string,
  chatHistoryStore: CHAT_HISTORY_STORE,
  tools?: any,
  maxIterations?: number,
  verbose?: boolean
) {
  dlog.msg("Setting up Open AI agent executor...");
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

  dlog.msg("Done initializing agent");

  // AgentExecutor - calls the agent and executes the tools
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: verbose,
    maxIterations: maxIterations
    // returnIntermediateSteps: false,  // turn on for debugging
  });
  dlog.msg("Done initializing agent executor");

  return new RunnableWithMessageHistory({
    runnable: agentExecutor,
    getMessageHistory: (sessionId: string) =>
      getChatHistoryStore(sessionId, chatHistoryStore),
    inputMessagesKey: INPUT_MESSAGE_KEY,
    historyMessagesKey: HISTORY_MESSAGE_KEY
  });
}
