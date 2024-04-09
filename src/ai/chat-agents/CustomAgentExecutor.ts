import {
  getUpstashRedisRESTAPIKey,
  getUpstashRedisRESTAPIURL
} from "/ai/AIKeys.js";
import { logger } from "/utilities/Log.js";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import {
  ChatPromptTemplate,
  MessagesPlaceholder
} from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnableWithMessageHistory
} from "@langchain/core/runnables";
import { AgentExecutor } from "langchain/agents";

const loggerContext = "CustomAgentExecutor";

export const INPUT_MESSAGE_KEY = "input";
export const HISTORY_MESSAGE_KEY = "history";

export function getCustomAgentExecutor(
  llm: any,
  systemPrompt: string,
  tools?: any,
  maxIterations?: number,
  verbose?: boolean
) {
  logger.debug(
    { context: loggerContext },
    "Setting up custom agent executor..."
  );
  // verify optional parameters
  // check if any tools provided
  if (tools === undefined || tools === null) {
    tools = [];
  }
  if (maxIterations === undefined || maxIterations === null) {
    maxIterations = 10;
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

  // bind tools to the llm
  const llm_with_tools = llm.bind({
    tools
  });
  logger.debug({ context: loggerContext }, "Done binding tools to LLM");

  // Initialize the agent with the LLM (with tools) and prompt
  const agent = RunnableSequence.from([
    {
      input: (i) => i.input,
      agent_scratchpad: (i) => i.steps,
      history: (i) => i.history
    },
    prompt,
    llm_with_tools
  ]);
  logger.debug({ context: loggerContext }, "Done initializing agent");

  // AgentExecutor - calls the agent and executes the tools
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: verbose,
    maxIterations: maxIterations
  });
  logger.debug({ context: loggerContext }, "Done initializing agent executor");

  return new RunnableWithMessageHistory({
    runnable: agentExecutor,
    getMessageHistory: (sessionId: string) =>
      new UpstashRedisChatMessageHistory({
        sessionId,
        config: {
          url: getUpstashRedisRESTAPIURL(),
          token: getUpstashRedisRESTAPIKey()
        }
      }),
    inputMessagesKey: INPUT_MESSAGE_KEY,
    historyMessagesKey: HISTORY_MESSAGE_KEY
  });
}
