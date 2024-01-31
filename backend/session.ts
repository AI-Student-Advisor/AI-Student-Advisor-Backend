import {
  ResponseBase,
  Message,
  Control,
  HistoryConversation,
  PostResponseSuccess,
  PostResponseFail,
  Agent,
  AgentResponse,
} from "./session_interface";
import { v4 as uuidv4 } from "uuid";
import * as express from "express";
import SSE from "express-sse-ts";
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.options("/api/conversation", (req, res) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.flushHeaders();
  res.end();
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
const event = new SSE();
const sessions: PostResponseSuccess[] = [];

function parameterHandler(res, req, next) {
  return req.body;
}

function eventHandlers(req, res, next) {
  const parameters = parameterHandler(res, req, next);
  let session: PostResponseSuccess | undefined;
  /*
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  });*/

  if (parameters.id == undefined) {
    //Request a query in a new conversation
    try {
      session = getNewSession();
      sessions.push(session);
    } catch (error) {
      const errSession = getErrorSession(error);
      event.send(JSON.stringify(errSession));
    }
  } else {
    //Request a query in a created conversation
    const index = findSession(parameters.id);
    if (index != -1) {
      session = sessions[index];
    } else {
      const errSession = getErrorSession(
        new Error("Cannot find the conversation.")
      );
      event.send(JSON.stringify(errSession));
    }
  }
  if (session == undefined) {
    res.end("ERROR");
    return;
  }
  session.chatAgent = getTestChatAgent();
  if (
    parameters.message.content != undefined &&
    session.chatAgent != undefined
  ) {
    //Testing
    let solution: string = session.chatAgent.query(
      session.id,
      parameters.message.content
    );
    var flag = 10;
    var loop = setInterval(() => {
      try {
        let result: AgentResponse = JSON.parse(solution);
        //Testing condition
        if (result.status !== "yes") {
          throw new Error("Collect data failed.");
        }
        if (flag < 0) {
          //Generation done
          session!.type = "control";
          let control: Control = { signal: "generation-done" };
          session!.control = control;
          session!.message = undefined;
          console.log("Loop done");
          event.send(JSON.stringify(session.control), "message");
          clearInterval(loop);
        } else {
          let message: Message = getNewMessage(result.response);
          session!.message = message;
          event.send(JSON.stringify(session.message), "message");
          console.log(
            "LOG: Message sent: session ID: " +
              session?.id +
              "\nMessage: " +
              message.content
          );
        }
      } catch (error) {
        session!.type = "control";
        let control: Control = { signal: "generation-error" };
        session!.control = control;
        session!.message = undefined;
        event.send(JSON.stringify(session.control), "message");
        clearInterval(loop);
      } finally {
        flag--;
      }
    }, 5000);
  } else {
    ///Testing code
    ///The query.message that should not be empty
    console.log("Invalid.");
    res.end("ERROR");
  }
  // Close the connection when the client disconnects
  console.log("Session out");
  req.on("close", () => res.end("OK"));
}

function getNewSession(): PostResponseSuccess {
  const newSession: PostResponseSuccess = {
    status: "success",
    type: "message",
    id: uuidv4(),
    message: undefined,
    control: undefined,
    chatAgent: undefined,
  };
  if (findSession(newSession.id) != -1) {
    throw new Error("Create new session failed: session id confilct.");
  }
  return newSession;
}

function getErrorSession(error: Error): PostResponseFail {
  const newSession: PostResponseFail = {
    status: "fail",
    reason: error.message,
  };
  console.log("INFO: Created error session:" + error.message);
  return newSession;
}

function getNewMessage(response: string): Message {
  const message: Message = {
    id: uuidv4(),
    contentType: "message",
    content: response,
    author: { role: "assistant" },
  };
  return message;
}

function getTestChatAgent(): Agent {
  const newAgent: Agent = {
    query(id: string, queryStr: string): string {
      //TO DO: testing code
      return '{"status": "yes", "response": "abcccc"}';
    },
  };
  return newAgent;
}

function findSession(id: string): number {
  for (let index = 0; index < sessions.length; index++) {
    const tmp: PostResponseSuccess = sessions[index];
    if (tmp.id === id) {
      return index;
    }
  }
  return -1;
}
/*
function sendSuccessResponse(
  event: SSE,
  type: string,
  id: string,
  data: Message | Control
) {
  event.send();
}*/

app.post("/api/conversation", eventHandlers);
//app.get("/api/conversation", eventHandlers);
app.get("/api", event.init);
app.listen(3001, () => console.log("App listening: http://localhost:3001"));
