const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.static("public"));

app.post("/api/conversation", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  });

  let uuid = undefined;
  req.id == undefined ? (uuid = crypto.randomUUID()) : (uuid = req.id);

  let counter = 0;

  // Send a message every 5 seconds
  setInterval(() => {
    let message_id = crypto.randomUUID();
    let author = { role: "system" };

    //current default
    let response_type = "message";
    let data_type = "text";
    let data = counter;

    let message = {
      id: message_id,
      content_type: data_type,
      content: data,
      author: author,
    };

    let output = { type: response_type, id: uuid, message: message };

    res.write("event: message\n");
    res.write(JSON.stringify(output));
    counter += 1;
  }, 5000);

  // Close the connection when the client disconnects
  req.on("close", () => res.end("OK"));
});

app.get("/api", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  });

  let uuid = undefined;
  req.id == undefined ? (uuid = crypto.randomUUID()) : (uuid = req.id);

  let counter = 0;

  // Send a message every 5 seconds
  setInterval(() => {
    let message_id = crypto.randomUUID();
    let author = { role: "system" };

    //current default
    let response_type = "message";
    let data_type = "text";
    let data = counter;

    let message = {
      id: message_id,
      content_type: data_type,
      content: data,
      author: author,
    };

    let output = { type: response_type, id: uuid, message: message };

    res.write("event: message\n");
    res.write(JSON.stringify(output));
    res.write("\n\n");
    counter += 1;
  }, 5000);

  // Close the connection when the client disconnects
  req.on("close", () => res.end("OK"));
});

app.listen(3001, () => console.log("App listening: http://localhost:3001"));
