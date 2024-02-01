import {
  AgentExecutor,
  createOpenAIFunctionsAgent,
  createOpenAIToolsAgent,
} from "langchain/agents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import {
  getUpstashRedisRESTAPIKey,
  getUpstashRedisRESTAPIURL,
} from "../../config/keys";
import { dlog } from "../../utilities/dlog";
import { getOpenAIChatModel } from "../chat-models/OpenAIChatModel";
import { AppConfig } from "config/AppConfig";

export const INPUT_MESSAGE_KEY = "input";
export const HISTORY_MESSAGE_KEY = "history";

export async function getOpenAIAgentExecutor(
  systemPrompt: string,
  tools?: any,
  maxIterations?: number,
  verbose?: boolean
) {
  dlog.msg("Setting up Open AI agent executor...");
  // verify optional parameters
  // check if any tools provided
  if (tools === undefined || tools === null) tools = [];
  if (maxIterations === undefined || maxIterations === null)
    maxIterations = 100;
  if (verbose === undefined || verbose === null) verbose = false;

  // Setup chat agent prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder(HISTORY_MESSAGE_KEY),
    new MessagesPlaceholder("agent_scratchpad"),
    ["user", `{${INPUT_MESSAGE_KEY}}`],
  ]);

  const llm = getOpenAIChatModel();

  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
  });

  dlog.msg("Done initializing agent");

  // AgentExecutor - calls the agent and executes the tools
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: verbose,
    maxIterations: maxIterations,
    // returnIntermediateSteps: false,  // turn on for debugging
  });
  dlog.msg("Done initializing agent executor");

  return new RunnableWithMessageHistory({
    runnable: agentExecutor,
    getMessageHistory: (sessionId: string) =>
      new UpstashRedisChatMessageHistory({
        sessionId,
        config: {
          url: getUpstashRedisRESTAPIURL(),
          token: getUpstashRedisRESTAPIKey(),
        },
      }),
    inputMessagesKey: INPUT_MESSAGE_KEY,
    historyMessagesKey: HISTORY_MESSAGE_KEY,
  });
}
