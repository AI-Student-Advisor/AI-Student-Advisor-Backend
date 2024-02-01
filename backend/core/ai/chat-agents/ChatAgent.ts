import { getCustomAgentExecutor } from "./CustomAgentExecutor";
import { getOpenAIAgentExecutor } from "./OpenAIAgentExecutor";
import { getChatModel } from "../chat-models/ChatModels";
import { dlog } from "../../utilities/dlog";
import {
  AgentInput,
  QUERY_STATUS,
  USER_ROLE,
  LLM_TYPE,
  ChatAgentConfig,
} from "../../types/ai/AITypes";

export class ChatAgent {
  private chatAgent: any;
  private chatEnabled: boolean = false;
  private userRole: USER_ROLE;
  private sessionId: string = "";
  private llmType: LLM_TYPE;
  private initialPrompt?: string;
  private tools?: [];
  private maxIterations?: number;
  private verbose?: boolean;

  constructor(chatAgentConfig: ChatAgentConfig) {
    // Order is important

    // Set the user role
    this.userRole = chatAgentConfig.user_role || "student";
    // Set the sessionId
    this.sessionId = chatAgentConfig.sessionId;
    // Set params for the chat agent
    this.llmType = chatAgentConfig.llm_type;
    this.initialPrompt = chatAgentConfig.initial_prompt;
    this.tools = chatAgentConfig.tools;
    this.maxIterations = chatAgentConfig.maxIterations;
    this.verbose = chatAgentConfig.verbose;

    // Setup the chat agent
    this.chatAgent = undefined;
  }

  private getSystemPrompt(initialPrompt?: string) {
    if (initialPrompt) {
      return initialPrompt;
    } else {
      return `You're an extremely helpful and insightful academic adivisor who is an expert on University of Ottawa. You're helping a ${this.userRole} who is interested in the University of Ottawa.`;
    }
  }

  async enableChat() {
    // initialize chat agent if not already initialized
    if (this.chatAgent === null || this.chatAgent == undefined) {
      // if using Open AI LLM
      if (this.llmType === LLM_TYPE.OPEN_AI) {
        this.chatAgent = await getOpenAIAgentExecutor(
          this.getSystemPrompt(this.initialPrompt),
          this.tools,
          this.maxIterations,
          this.verbose
        );
        dlog.msg("ChatAgent.ts: Open AI agent initialized");
      }
      // if using custom LLM
      else {
        this.chatAgent = getCustomAgentExecutor(
          getChatModel(this.llmType),
          this.getSystemPrompt(this.initialPrompt),
          this.tools,
          this.maxIterations,
          this.verbose
        );
        dlog.msg("ChatAgent.ts: Custom agent initialized");
      }
    }
    // enable chat
    this.chatEnabled = true;
    dlog.msg("ChatAgent.ts: Chat enabled");
    return this.chatEnabled;
  }

  disableChat(): boolean {
    this.chatEnabled = false;
    return this.chatEnabled;
  }

  async query(agentInput: AgentInput, responseHandler?: any) {
    // check if valid input
    if (!agentInput) throw new Error("Invalid user query");
    dlog.msg(
      "ChatAgent.ts: user query received: " +
        agentInput.user.input +
        " sessionID: " +
        agentInput.config.configurable.sessionId
    );
    // check if chat is enabled
    if (!this.chatEnabled) throw new Error("Chat is disabled");
    // let response handler know response is being prepared
    if (responseHandler != null && responseHandler != undefined)
      responseHandler({ status: QUERY_STATUS.PENDING });
    try {
      // retrieve and return response
      const response = await this.chatAgent.invoke(
        agentInput.user, // user input
        agentInput.config // session ID
      );
      // let response handler know response is ready
      if (responseHandler)
        responseHandler({ status: QUERY_STATUS.SUCCESS, response });
      // return the response directly as well in case response handler is not being used
      return response;
    } catch (error) {
      // let response handler know about the error
      if (responseHandler)
        responseHandler({ status: QUERY_STATUS.ERROR, response: error });
      // return the response directly as well in case response handler is not being used
      return "Error: Unable to generate response. Please try again later.";
    }
  }

  // NOT IMPLEMENTED
  async queryStream(agentInput: AgentInput, responseHandler?: any) {
    // check if valid input
    if (!agentInput) throw new Error("Invalid user query");
    // check if chat is enabled
    if (!this.chatEnabled) throw new Error("Chat is disabled");
    // let response handler know response is being prepared
    if (responseHandler) responseHandler({ status: QUERY_STATUS.PENDING });
    // retrieve and return response
    const response = await this.chatAgent.invoke();
    // let response handler know response is ready
    if (responseHandler)
      responseHandler({ status: QUERY_STATUS.SUCCESS, response });
    // return the response directly as well in case response handler is not being used
    return response;
  }

  // return in the format {"input":"foo"}, {"configurable":{"sessionId":"123"}}
  prepareInput(userQuery: string): AgentInput {
    return {
      user: { input: userQuery },
      config: { configurable: { sessionId: this.sessionId } },
    };
  }
}
