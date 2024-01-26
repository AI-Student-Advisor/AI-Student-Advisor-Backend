import { RunnableSequence } from "@langchain/core/runnables";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AgentExecutor } from "langchain/agents";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import {
  getUpstashRedisRESTAPIKey,
  getUpstashRedisRESTAPIURL,
} from "../../config/keys";

import { formatToOpenAIFunctionMessages } from "langchain/agents/format_scratchpad";

export const INPUT_MESSAGE_KEY = "input";
export const HISTORY_MESSAGE_KEY = "history";

export function getCustomAgentExecutor(
  llm: any,
  systemPrompt: string,
  tools?: any,
  maxIterations?: number,
  verbose?: boolean
) {
  // verify optional parameters
  // check if any tools provided
  if (tools === undefined || tools === null) tools = [];
  if (maxIterations === undefined || maxIterations === null) maxIterations = 10;
  if (verbose === undefined || verbose === null) verbose = false;

  // Setup chat agent prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder(HISTORY_MESSAGE_KEY),
    new MessagesPlaceholder("agent_scratchpad"),
    ["user", `{${INPUT_MESSAGE_KEY}}`],
  ]);

  // bind tools to the llm
  const llm_with_tools = llm.bind({
    tools,
  });

  // Initialize the agent with the LLM (with tools) and prompt
  const agent = RunnableSequence.from([
    {
      input: (i) => i.input,
      agent_scratchpad: (i) => formatToOpenAIFunctionMessages(i.steps),
      chat_history: (i) => i.chat_history,
    },
    prompt,
    llm_with_tools,
  ]);

  // AgentExecutor - calls the agent and executes the tools
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: verbose,
    maxIterations: maxIterations,
  });

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
