import express, { Express, Request, Response } from "express";
import { AppConfig } from "../config/AppConfig";
import { query } from "./api/Conversation";
import { Session, SessionManager } from "./Sessions";
import {
  APISession,
  EventHandlerParams,
  PostResponseSuccess,
  REQUEST_STATUS,
  RESPONSE_TYPE,
  Message,
  PostRequest,
  PostResponseFail,
  SessionId,
  Control,
} from "structs/api/APIStructs";

// Create a new Express application
const app: Express = express();
// Get the port from the config file or use 3000 as default
const port = AppConfig.api.port || 3000;
// Session manager
const sessionManager = new SessionManager();

// Set up the Express application
app.use(express.static("public"));
app.use(express.json());

// Set up CORS
// TESTING: Allow all origins
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.options("/api/conversation", (req, res) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.flushHeaders();
  res.end();
});

// Set up the event handler
function eventHandler(
  req: Request,
  res: Response,
  next: any,
  params: PostRequest
) {
  // Set up the response headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  });
  // Close the connection when the client disconnects
  req.on("close", () => res.end("OK"));
}

export function getSession(
  sessionID: SessionId,
  res: Response
): Session | undefined {
  // If a valid session ID is provided, get the session by ID
  if (sessionID) {
    // get the session by ID
    const session = sessionManager.getSession(sessionID);
    // If the session does not exist, return an error control?: Control,
    if (session === undefined) {
      sendErrResponse(`Session not found for the given id: ${sessionID}`, res);
    }
    return session;
  } else {
    // Create a new session
    return sessionManager.getNewSession({ id: crypto.randomUUID() });
  }
}

function getNewSession(): Session {
  const newSessionConfig: APISession = {
    id: crypto.randomUUID(), // session ID
    response: {
      id: crypto.randomUUID(), // response ID
      status: REQUEST_STATUS.SUCCESS,
      type: RESPONSE_TYPE.MESSAGE,
    },
  };
  return sessionManager.getNewSession(newSessionConfig);
}

function sendData(res: Response, data: string) {
  res.write("event: message\n");
  res.write("data: " + data + "\n");
  res.write("\n\n");
}

export function sendMsgResponse(message: Message, res: Response) {
  const userRequest: PostResponseSuccess = {
    id: crypto.randomUUID(), // unqiue ID for each message
    status: REQUEST_STATUS.SUCCESS,
    type: RESPONSE_TYPE.MESSAGE,
    message,
  };
  sendData(res, JSON.stringify(userRequest));
  console.log("INFO: Sent Message: " + message);
}

export function sendErrResponse(err: string, res: Response) {
  const errResponse: PostResponseFail = {
    status: REQUEST_STATUS.FAIL,
    reason: err,
  };
  const sessionStr = JSON.stringify(errResponse);
  sendData(res, sessionStr);
  console.log("INFO: Sent error:" + sessionStr);
}

export function sendControlResponse(
  control: Control,
  status: REQUEST_STATUS,
  res: Response,
  message?: Message
) {
  const controlResponse: PostResponseSuccess = {
    id: crypto.randomUUID(), // unqiue ID for each message
    status,
    type: RESPONSE_TYPE.CONTROL,
    control,
    message,
  };
  sendData(res, JSON.stringify(controlResponse));
  console.log("INFO: Sent Control: " + control);
}

/**
 * `POST /api/conversation`
 *
 * Handles the conversation API endpoint.
 * Expects a 'PostRequest' object in the request body.
 */
app.post("/api/conversation", (req, res, next) =>
  eventHandler(req, res, next, req.body)
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function eventHandlers(req: Request, res: Response, next: any) {}
