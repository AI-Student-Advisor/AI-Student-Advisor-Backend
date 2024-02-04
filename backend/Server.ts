import express, { Express, Request, Response } from "express";
import { AppConfig } from "./config/AppConfig";
import { ConversationEndpoints } from "./server/api/Conversation";
import { Session, SessionManager } from "./server/Sessions";
import {
  PostResponseSuccess,
  REQUEST_STATUS,
  RESPONSE_TYPE,
  Message,
  PostRequest,
  PostResponseFail,
  CONTROL_SIGNAL,
  PostResponseControl,
  SessionId,
} from "./structs/api/APIStructs";
import { dlog } from "./utilities/dlog";

dlog.msg("Server.ts - Setting up Server");

// Create a new Express application
const app: Express = express();
// Get the port from the config file or use 3001 as default
const port = AppConfig.api.port || 3001;
// Session manager
const sessionManager = new SessionManager();

// Set up the Express application
app.use(express.static("public"));
app.use(express.json());

// Set up CORS
// TESTING: Allow all origins
app.use((req: Request, res: Response, next: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.options("/api/conversation", (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.flushHeaders();
  res.end();
});

// Set up the event handler
async function eventHandler(
  req: Request,
  res: Response,
  next: any,
  params: PostRequest
) {
  console.log(
    "INFO: Request received on /api/conversation: " + JSON.stringify(params)
  );
  // Set up the response headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  });

  try {
    // Get session if ID provided, otherwise create a new session
    const session = getSession(params.id, res);

    // Query the chat agent - asynchoronous
    await ConversationEndpoints.query(session, params.message, res);

    // Close the connection when the client disconnects
    req.on("close", () => {
      dlog.msg("Server: Client disconnected");
      res.end("OK");
      sessionManager.deleteSession(session.id);
    });
  } catch (err: any) {
    dlog.err("Server: Error in eventHandler: " + err);
    sendErrResponse(err instanceof Error ? err.message : err, res);
    sendControlResponse(
      CONTROL_SIGNAL.GENERATION_ERROR,
      REQUEST_STATUS.FAIL,
      res
    );
    // timeout for 4 seconds to allow the client to receive the error message
    setTimeout(() => {
      res.destroy(err);
      dlog.msg("Server: response destroyed");
    }, 4000);
  }
}

export function getSession(
  sessionID: string | undefined,
  res: Response
): Session {
  // If a valid session ID is provided, get the session by ID
  if (sessionID) {
    // get the session by ID
    const session = sessionManager.getSession(sessionID);
    // If the session does not exist, return an error control?: Control,
    if (session === undefined)
      throw new Error("Session not found for the given id: " + sessionID);
    else return session;
  }
  // Create a new session
  else return sessionManager.getNewSession({ id: crypto.randomUUID() });
}

function sendData(res: Response, data: string) {
  res.write("event: message\n");
  res.write("data: " + data + "\n");
  res.write("\n\n");
}

export function sendMsgResponse(
  id: SessionId,
  message: Message,
  res: Response
) {
  const userRequest: PostResponseSuccess = {
    id,
    status: REQUEST_STATUS.SUCCESS,
    type: RESPONSE_TYPE.MESSAGE,
    message,
  };
  sendData(res, JSON.stringify(userRequest));
  console.log("INFO: Sent Message: ");
  console.dir(message);
}

export function sendErrResponse(err: string, res: Response) {
  const errResponse: PostResponseFail = {
    type: RESPONSE_TYPE.MESSAGE,
    status: REQUEST_STATUS.FAIL,
    reason: err,
  };
  const sessionStr = JSON.stringify(errResponse);
  sendData(res, sessionStr);
  console.log("INFO: Sent error:");
  console.dir(errResponse);
}

export function sendControlResponse(
  signal: CONTROL_SIGNAL,
  status: REQUEST_STATUS,
  res: Response
) {
  const controlResponse: PostResponseControl = {
    type: RESPONSE_TYPE.CONTROL,
    control: { signal },
    status,
  };
  sendData(res, JSON.stringify(controlResponse));
  console.log("INFO: Sent Control: " + controlResponse.control.signal);
}

/**
 * `POST /api/conversation`
 *
 * Handles the conversation API endpoint.
 * Expects a 'PostRequest' object in the request body.
 */
app.post("/api/conversation", (req: Request, res: Response, next: any) =>
  eventHandler(req, res, next, req.body)
);

app.get("/api", (req: Request, res: Response) => {
  res.send("AI Student Advisor - API up and running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
