import { AgentInput, QUERY_STATUS } from "/structs/ai/AIStructs.js";
import { dlog } from "/utilities/dlog.js";

export class ChatAgent {
  protected chatAgent: any;
  private chatEnabled: boolean = false;

  constructor() {
    // Setup the chat agent
    this.chatAgent = undefined;
  }

  async enableChat() {
    // check if chat is already enabled
    if (this.chatEnabled) return this.chatEnabled;

    // enable chat
    this.chatEnabled = true;
    dlog.msg("ChatAgent: Chat enabled");
    return this.chatEnabled;
  }

  disableChat(): boolean {
    this.chatEnabled = false;
    return this.chatEnabled;
  }

  // check if chat is enabled
  isChatEnabled(): boolean {
    return this.chatEnabled;
  }

  async query(agentInput: AgentInput, responseHandler?: any) {
    // check if valid input
    if (!agentInput) {
      throw new Error("Invalid user query");
    }
    dlog.msg(
      `ChatAgent: user query received: ${agentInput.user.input} sessionID: ${agentInput.config.configurable.sessionId}`
    );
    // check if chat is enabled
    if (!this.chatEnabled) {
      throw new Error("Chat is disabled");
    }
    // let response handler know response is being prepared
    if (responseHandler !== null && responseHandler !== undefined) {
      responseHandler({ status: QUERY_STATUS.PENDING });
    }
    try {
      // retrieve and return response
      const response = await this.chatAgent.invoke(
        agentInput.user, // user input
        agentInput.config // session ID
      );
      // let response handler know response is ready
      if (responseHandler) {
        responseHandler({ status: QUERY_STATUS.SUCCESS, response });
      }
      // return the response directly as well in case response handler is not being used
      return response;
    } catch (error) {
      // let response handler know about the error
      if (responseHandler) {
        responseHandler({ status: QUERY_STATUS.ERROR, response: error });
      }
      // return the response directly as well in case response handler is not being used
      return "Error: Unable to generate response. Please try again later.";
    }
  }

  // NOT IMPLEMENTED
  async queryStream(agentInput: AgentInput, responseHandler?: any) {
    // check if valid input
    if (!agentInput) {
      throw new Error("Invalid user query");
    }
    // check if chat is enabled
    if (!this.chatEnabled) {
      throw new Error("Chat is disabled");
    }
    // let response handler know response is being prepared
    if (responseHandler) {
      responseHandler({ status: QUERY_STATUS.PENDING });
    }
    // retrieve and return response
    const response = await this.chatAgent.invoke();
    // let response handler know response is ready
    if (responseHandler) {
      responseHandler({ status: QUERY_STATUS.SUCCESS, response });
    }
    // return the response directly as well in case response handler is not being used
    return response;
  }

  // return in the format {"input":"foo"}, {"configurable":{"sessionId":"123"}}
  static prepareInput(userQuery: string, sessionId: string): AgentInput {
    return {
      user: { input: userQuery },
      config: { configurable: { sessionId } }
    };
  }
}
