export interface ResponseBase {
  status: "success" | "fail";
}

export interface Message {
  id: string;
  contentType: string;
  content?: string;
  author: {
    role: "user" | "assistant" | "system";
  };
}

export interface Control {
  signal: "generation-done" | "generation-error";
}

export interface Agent {
  query: (id: string, input: string) => string;
}

export interface HistoryConversation {
  id: string;
  dateTimeIso: string;
  title: string;
}

export interface PostResponseSuccess extends ResponseBase {
  type: "message" | "control";
  id: string;
  message?: Message;
  control?: Control;
  chatAgent?: Agent;
}

export interface PostResponseFail extends ResponseBase {
  reason: string;
}

export interface AgentResponse {
  status: string;
  response: string;
}
