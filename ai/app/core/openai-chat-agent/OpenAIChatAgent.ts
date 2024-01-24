import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { Agent, AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";

import { ChatAgentInterface } from "core/chat-agent/ChatAgentInterface";
import {
  getUpstashRedisRESTAPIKey,
  getUpstashRedisRESTAPIURL,
} from "core/config/keys";

type OpenAIChatAgentConfig = {
  openAIApiKey: string;
  initialPrompt?: string;
  rememberHistory?: boolean;
  userRole?: USER_ROLE;
  maxIterations?: number;
  verbose?: boolean;
  sessionId: string;
};

type USER_ROLE = "student" | "faculty member";

// Type for input to agent
// should look like {input: string}, {configurable={sessionId: string}}
// sessionId is used to identify the user and their history
type AgentInput = {
  input: string;
  configurable?: { sessionId: string };
};

class OpenAIChatAgent implements ChatAgentInterface {
  private chatAgent: any;
  private chatEnabled: boolean = false;
  private userRole: USER_ROLE;
  private systemPrompt: string = "";
  private maxIterations: number = 10;
  private verbose: boolean = true;
  private sessionId: string = "";
  private static INPUT_MESSAGE_KEY = "input";
  private static HISTORY_MESSAGE_KEY = "history";

  constructor(openAIChatAgentConfig: OpenAIChatAgentConfig) {
    // Order is important

    // Set the user role
    this.userRole = openAIChatAgentConfig.userRole || "student";
    // Set the system prompt if provided, otherwise use the default
    this.setSystemPrompt(openAIChatAgentConfig.initialPrompt || "");
    // Set other configuration options
    this.maxIterations = openAIChatAgentConfig.maxIterations || 10;
    this.verbose = openAIChatAgentConfig.verbose || true;
    this.sessionId = openAIChatAgentConfig.sessionId;
    // Setup the chat agent
    this.setupChatAgent(openAIChatAgentConfig.openAIApiKey);
  }

  private async setupChatAgent(openAIApiKey: string) {
    // Setup the Open AI LLM chat agent
    let llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      openAIApiKey: openAIApiKey,
    });

    // Pull the chat prompt from the hub for Open AI Functions Agent
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", this.systemPrompt],
      new MessagesPlaceholder(OpenAIChatAgent.HISTORY_MESSAGE_KEY),
      new MessagesPlaceholder("agent_scratchpad"),
      ["user", `{${OpenAIChatAgent.INPUT_MESSAGE_KEY}}`],
    ]);

    // Setup the tools for Open AI Functions Agent
    const tools: [] = [];

    // Initialize the agent with the LLM, tools, and prompt
    const agent = await createOpenAIToolsAgent({
      llm,
      tools,
      prompt,
    });

    // AgentExecutor - calls the agent and executes the tools
    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      verbose: this.verbose,
      maxIterations: this.maxIterations,
    });

    this.chatAgent = new RunnableWithMessageHistory({
      runnable: agentExecutor,
      getMessageHistory: (sessionId: string) =>
        new UpstashRedisChatMessageHistory({
          sessionId,
          config: {
            url: getUpstashRedisRESTAPIURL(),
            token: getUpstashRedisRESTAPIKey(),
          },
        }),
      inputMessagesKey: OpenAIChatAgent.INPUT_MESSAGE_KEY,
      historyMessagesKey: OpenAIChatAgent.HISTORY_MESSAGE_KEY,
    });
  }

  private setSystemPrompt(initialPrompt: string) {
    if (initialPrompt) {
      this.systemPrompt = initialPrompt;
    } else {
      this.systemPrompt = `You're an extremely helpful and insightful academic adivisor who is an expert on University of Ottawa. You're helping a ${this.userRole} who is interested in the University of Ottawa.`;
    }
  }

  enableChat(): boolean {
    // confirm chatAgent has been initialized
    if (!this.chatAgent) throw new Error("Chat agent not initialized");
    this.chatEnabled = true;
    return this.chatEnabled;
  }

  disableChat(): boolean {
    this.chatEnabled = false;
    return this.chatEnabled;
  }

  async query(userQuery: AgentInput) {
    // check if valid input
    if (!userQuery) throw new Error("Invalid input");
    // check if chat is enabled
    if (!this.chatEnabled) throw new Error("Chat is disabled");
    // retrieve and return response
    const response = await this.chatAgent.invoke(userQuery);
    return response;
  }

  async queryStream(userQuery: AgentInput) {
    // check if valid input
    if (!userQuery) throw new Error("Invalid input");
    // check if chat is enabled
    if (!this.chatEnabled) throw new Error("Chat is disabled");
    // retrieve and return response
    const response = await this.chatAgent.invoke(userQuery);
    return response;
  }

  prepareInput(userQuery: string): AgentInput {
    return { input: userQuery, configurable: { sessionId: this.sessionId } };
  }
}
