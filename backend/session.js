"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var express = require("express");
var express_sse_ts_1 = require("express-sse-ts");
var app = express();
app.use(express.static("public"));
app.use(express.json());
app.options("/api/conversation", function (req, res) {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.flushHeaders();
    res.end();
});
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});
var event = new express_sse_ts_1.default();
var sessions = [];
function parameterHandler(res, req, next) {
    return req.body;
}
function eventHandlers(req, res, next) {
    var parameters = parameterHandler(res, req, next);
    var session;
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
        }
        catch (error) {
            var errSession = getErrorSession(error);
            event.send(JSON.stringify(errSession));
        }
    }
    else {
        //Request a query in a created conversation
        var index = findSession(parameters.id);
        if (index != -1) {
            session = sessions[index];
        }
        else {
            var errSession = getErrorSession(new Error("Cannot find the conversation."));
            event.send(JSON.stringify(errSession));
        }
    }
    if (session == undefined) {
        res.end("ERROR");
        return;
    }
    session.chatAgent = getTestChatAgent();
    if (parameters.message.content != undefined &&
        session.chatAgent != undefined) {
        //Testing
        var solution_1 = session.chatAgent.query(session.id, parameters.message.content);
        var flag = 10;
        var loop = setInterval(function () {
            try {
                var result = JSON.parse(solution_1);
                //Testing condition
                if (result.status !== "yes") {
                    throw new Error("Collect data failed.");
                }
                if (flag < 0) {
                    //Generation done
                    session.type = "control";
                    var control = { signal: "generation-done" };
                    session.control = control;
                    session.message = undefined;
                    console.log("Loop done");
                    event.send(JSON.stringify(session.control), "message");
                    clearInterval(loop);
                }
                else {
                    var message = getNewMessage(result.response);
                    session.message = message;
                    event.send(JSON.stringify(session.message), "message");
                    console.log("LOG: Message sent: session ID: " +
                        (session === null || session === void 0 ? void 0 : session.id) +
                        "\nMessage: " +
                        message.content);
                }
            }
            catch (error) {
                session.type = "control";
                var control = { signal: "generation-error" };
                session.control = control;
                session.message = undefined;
                event.send(JSON.stringify(session.control), "message");
                clearInterval(loop);
            }
            finally {
                flag--;
            }
        }, 5000);
    }
    else {
        ///Testing code
        ///The query.message that should not be empty
        console.log("Invalid.");
        res.end("ERROR");
    }
    // Close the connection when the client disconnects
    console.log("Session out");
    req.on("close", function () { return res.end("OK"); });
}
function getNewSession() {
    var newSession = {
        status: "success",
        type: "message",
        id: (0, uuid_1.v4)(),
        message: undefined,
        control: undefined,
        chatAgent: undefined,
    };
    if (findSession(newSession.id) != -1) {
        throw new Error("Create new session failed: session id confilct.");
    }
    return newSession;
}
function getErrorSession(error) {
    var newSession = {
        status: "fail",
        reason: error.message,
    };
    console.log("INFO: Created error session:" + error.message);
    return newSession;
}
function getNewMessage(response) {
    var message = {
        id: (0, uuid_1.v4)(),
        contentType: "message",
        content: response,
        author: { role: "assistant" },
    };
    return message;
}
function getTestChatAgent() {
    var newAgent = {
        query: function (id, queryStr) {
            //TO DO: testing code
            return '{"status": "yes", "response": "abcccc"}';
        },
    };
    return newAgent;
}
function findSession(id) {
    for (var index = 0; index < sessions.length; index++) {
        var tmp = sessions[index];
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
app.listen(3001, function () { return console.log("App listening: http://localhost:3001"); });
