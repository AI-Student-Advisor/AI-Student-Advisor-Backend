const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.static("public"));

let servers = [];

function eventHandlers(req, res, next) {
  let server = undefined;
  let uuid = undefined;

  const { query } = req;
  if (query.id == undefined) {
    server = getNewServer(req, res, next);
    servers.push(server);
    uuid = servers;
  } else {
    server = servers.find((tmp) => tmp.id === query.id);
    if (server == undefined) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      });
      let error = {
        type: "fail",
        message: "Cannot find the conversation.",
      };
      res.write(JSON.stringify(error));
    }
  }

  if (query.message != undefined) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    });
    let message = newMessage(query.message);
    server.message = message;
    server.type = "message";
    res.write(JSON.stringify(server));
  } else {
    let counter = 0;
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    });
    while (counter < 10) {
      let message = newMessage(counter);
      server.message = message;
      server.type = "message";
      res.write(JSON.stringify(server));
      counter += 1;
    }
  }

  // Close the connection when the client disconnects
  req.on("close", () => res.end("OK"));
}

function getNewServer(req, res, next) {
  let uuid = crypto.randomUUID();
  let response_type = "Control";
  let newServer = {
    id: uuid,
    type: response_type,
    message: undefined,
    control: undefined,
  };
  return newServer;
}

function newMessage(query) {
  let solution = getSolution(query);

  let message = {
    id: crypto.randomUUID(),
    content_type: solution.type,
    content: solution.content,
    author: { role: "system" },
  };
  return message;
}

function getSolution(query) {
  //Test
  let solution = { content: query, type: "message" };
  //TO DO: Implement the API call here

  return solution;
}

app.get("/api", eventHandlers);

app.listen(3001, () => console.log("App listening: http://localhost:3001"));
