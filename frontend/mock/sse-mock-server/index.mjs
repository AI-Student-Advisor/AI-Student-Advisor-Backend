import express from "express";
import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json())
app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

const responseWords = "Hi, I'm the mock server. It's nice to meet you!"
    .split(" ")
    .flatMap((value, index, array) => {
        if (index === array.length - 1) {
            return value;
        }
        return [value, " "];
    });

app.options("/api/conversation", (request, response) => {
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.flushHeaders();
    response.end();
});

app.post("/api/conversation", (request, response) => {
    const data = request.body;
    console.log(data);

    let sessionId = uuid();

    if (data.message.id) {
        sessionId = data.message.id;
    }

    const responseUserMessage = {
        status: "success",
        type: "message",
        id: sessionId,
        message: data.message
    };

    const responseMessage = {
        status: "success",
        type: "message",
        id: sessionId,
        message: {
            id: uuid(),
            contentType: "text/plain",
            content: "",
            author: {
                role: "assistant"
            }
        }
    };
    const responseControl = {
        status: "success",
        type: "control",
        id: sessionId,
        control: {
            signal: "generation-done"
        }
    };

    response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    response.setHeader("Connection", "keep-alive");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("X-Accel-Buffering", "no");

    response.write("event: message\n");
    response.write(`data: ${JSON.stringify(responseUserMessage)}`);
    response.write("\n\n");

    let counter = 0;
    setInterval(() => {
        responseMessage.message.content += responseWords[counter++];

        response.write("event: message\n");
        response.write(`data: ${JSON.stringify(responseMessage)}\n`);
        response.write("\n\n");

        if (counter >= responseWords.length) {
            response.write("event: message\n");
            response.write(`data: ${JSON.stringify(responseControl)}\n`);
            response.write("\n\n");
            response.end();
        }
    }, 100);

    response.on("close", () => {
        response.end();
    });
});

app.listen(3001);
