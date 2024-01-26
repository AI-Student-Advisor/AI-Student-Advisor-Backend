import { ChatAgentInterface } from "./ChatAgentInterface";
import { USER_ROLE, ChatAgentConfig } from "./ChatAgentConfig";
import { getCustomAgentExecutor } from "./CustomAgentExecutor";
import { getChatModel } from "src/chat-models/ChatModels";

// sessionId is used to identify the user and their history
type AgentInput = {
  input: string;
  configurable?: { sessionId: string };
};

export const enum QUERY_STATUS {
  SUCCESS = "success",
  ERROR = "error",
  PENDING = "pending",
}

export class ChatAgent implements ChatAgentInterface {
  private chatAgent: any;
  private chatEnabled: boolean = false;
  private userRole: USER_ROLE;
  private sessionId: string = "";

  constructor(chatAgentConfig: ChatAgentConfig) {
    // Order is important

    // Set the user role
    this.userRole = chatAgentConfig.user_role || "student";
    // Set the sessionId
    this.sessionId = chatAgentConfig.sessionId;

    // Setup the chat agent
    this.chatAgent = getCustomAgentExecutor(
      getChatModel(chatAgentConfig.llm_type),
      this.getSystemPrompt(chatAgentConfig.initial_prompt),
      chatAgentConfig.tools,
      chatAgentConfig.maxIterations,
      chatAgentConfig.verbose
    );
  }

  private getSystemPrompt(initialPrompt?: string) {
    if (initialPrompt) {
      return initialPrompt;
    } else {
      return `You're an extremely helpful and insightful academic adivisor who is an expert on University of Ottawa. You're helping a ${this.userRole} who is interested in the University of Ottawa.`;
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

  async query(userQuery: AgentInput, responseHandler?: any) {
    // check if valid input
    if (!userQuery) throw new Error("Invalid user query");
    // check if chat is enabled
    if (!this.chatEnabled) throw new Error("Chat is disabled");
    // let response handler know response is being prepared
    if (responseHandler) responseHandler({ status: QUERY_STATUS.PENDING });
    // retrieve and return response
    const response = await this.chatAgent.invoke(userQuery);
    // let response handler know response is ready
    if (responseHandler)
      responseHandler({ status: QUERY_STATUS.SUCCESS, response });
    // return the response directly as well in case response handler is not being used
    return response;
  }

  // NOT IMPLEMENTED
  async queryStream(userQuery: AgentInput, responseHandler?: any) {
    // check if valid input
    if (!userQuery) throw new Error("Invalid user query");
    // check if chat is enabled
    if (!this.chatEnabled) throw new Error("Chat is disabled");
    // let response handler know response is being prepared
    if (responseHandler) responseHandler({ status: QUERY_STATUS.PENDING });
    // retrieve and return response
    const response = await this.chatAgent.invoke(userQuery);
    // let response handler know response is ready
    if (responseHandler)
      responseHandler({ status: QUERY_STATUS.SUCCESS, response });
    // return the response directly as well in case response handler is not being used
    return response;
  }

  prepareInput(userQuery: string): AgentInput {
    return { input: userQuery, configurable: { sessionId: this.sessionId } };
  }
}
