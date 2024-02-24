import { AgentInput, type AgentResponse, QUERY_STATUS } from "/ai/AIStructs.js";
import { logger } from "/utilities/Log.js";

const loggerContext = "ChatAgent";

export class ChatAgent {
  protected chatAgent: any;
  private chatEnabled: boolean = false;

  constructor() {
    // Set up the chat agent
    this.chatAgent = undefined;
  }

  // return in the format {"input":"foo"}, {"configurable":{"sessionId":"123"}}
  static prepareInput(userQuery: string, sessionId: string): AgentInput {
    return {
      user: { input: userQuery },
      config: { configurable: { sessionId } }
    };
  }

  enableChat() {
    // check if chat is already enabled
    if (this.chatEnabled) return this.chatEnabled;

    // enable chat
    this.chatEnabled = true;
    logger.debug({ context: loggerContext }, "Chat enabled");

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

  async *query(agentInput: AgentInput): AsyncGenerator<AgentResponse> {
    logger.debug(
      {
        context: loggerContext
      },
      "User query received",
      agentInput
    );
    // check if chat is enabled
    if (!this.chatEnabled) {
      yield {
        status: QUERY_STATUS.ERROR,
        error: new Error("Chat is disabled")
      };
    }
    yield { status: QUERY_STATUS.PENDING };
    try {
      // retrieve and return response
      const response = await this.chatAgent.invoke(
        agentInput.user, // user input
        agentInput.config // session ID
      );
      yield { status: QUERY_STATUS.SUCCESS, response: response };
    } catch (error) {
      yield { status: QUERY_STATUS.ERROR, error: error };
    }
  }

  async *queryStream(agentInput: AgentInput): AsyncGenerator<AgentResponse> {
    // TODO: NOT IMPLEMENTED
    void agentInput;

    // check if chat is enabled
    if (!this.chatEnabled) {
      yield {
        status: QUERY_STATUS.ERROR,
        error: new Error("Chat is disabled")
      };
    }
    yield { status: QUERY_STATUS.PENDING };
    // retrieve and return response
    const response = await this.chatAgent.invoke();
    yield { status: QUERY_STATUS.SUCCESS, response: response };
  }
}
