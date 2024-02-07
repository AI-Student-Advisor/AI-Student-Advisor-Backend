import {
  getUpstashRedisRESTAPIKey,
  getUpstashRedisRESTAPIURL
} from "/config/keys.js";
import { dlog } from "/utilities/dlog.js";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { AgentAction, AgentFinish } from "@langchain/core/agents";
import { BaseMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder
} from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnableWithMessageHistory
} from "@langchain/core/runnables";
import { AgentExecutor } from "langchain/agents";

export const INPUT_MESSAGE_KEY = "input";
export const HISTORY_MESSAGE_KEY = "history";

export function getCustomAgentExecutor(
  llm: any,
  systemPrompt: string,
  tools?: any,
  maxIterations?: number,
  verbose?: boolean
) {
  dlog.msg("Setting up custom agent executor...");
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
  dlog.msg("Done binding tools to LLM");

  // Initialize the agent with the LLM (with tools) and prompt
  const agent = RunnableSequence.from([
    {
      input: (i) => i.input,
      agent_scratchpad: (i) => i.steps,
      history: (i) => i.history
    },
    prompt,
    llm_with_tools,
    customOutputParser
  ]);
  dlog.msg("Done initializing agent");

  // AgentExecutor - calls the agent and executes the tools
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: verbose,
    maxIterations: maxIterations
  });
  dlog.msg("Done initializing agent executor");

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

/** Define the custom output parser */
function customOutputParser(message: BaseMessage): AgentAction | AgentFinish {
  const text = message.content;
  if (typeof text !== "string") {
    throw new Error(
      `Message content is not a string. Received: ${JSON.stringify(
        text,
        null,
        2
      )}`
    );
  }
  /** If the input includes "Final Answer" return as an instance of `AgentFinish` */
  if (text.includes("Final Answer:")) {
    const parts = text.split("Final Answer:");
    const input = parts[parts.length - 1].trim();
    const finalAnswers = { output: input };
    return { log: text, returnValues: finalAnswers };
  }
  /** Use RegEx to extract any actions and their values */
  const match = /Action: (.*)\nAction Input: (.*)/s.exec(text);
  if (!match) {
    throw new Error(`Could not parse LLM output: ${text}`);
  }
  /** Return as an instance of `AgentAction` */
  return {
    tool: match[1].trim(),
    toolInput: match[2].trim().replace(/^"+|"+$/g, ""),
    log: text
  };
}
