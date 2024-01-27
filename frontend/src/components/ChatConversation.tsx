import { fetchConversation } from "/src/api/Conversation.ts";
import {
    PostResponseFail,
    PostResponseSuccess
} from "/src/api/interfaces/Conversation.ts";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { v4 as uuid } from "uuid";

export default function ChatConversation() {
    const messages = [
        { sender: "You", text: "Hello" },
        { sender: "Advisor", text: "Hello" },
        { sender: "You", text: "Hello" },
        { sender: "Advisor", text: "Hello" },
        { sender: "You", text: "Hello" },
        { sender: "Advisor", text: "Hello" },
        { sender: "You", text: "Hello" },
        { sender: "Advisor", text: "Hello" },
        { sender: "You", text: "Hello" },
        { sender: "Advisor", text: "Hello" },
        { sender: "You", text: "Hello" },
        { sender: "Advisor", text: "Hello" }
    ];

    void fetchConversation(
        {
            id: uuid(),
            contentType: "text/plain",
            content: "Hello, this is the client",
            author: {
                role: "user"
            }
        },
        (response) => {
            if (response.status === "success") {
                const successResponse = response as PostResponseSuccess;
                console.log(successResponse);
            } else if (response.status === "fail") {
                const failResponse = response as PostResponseFail;
                console.error(failResponse);
            }
        }
    );

    return (
        <div className="flex-1">
            {messages.map((message, index) => (
                <Card key={index} className="my-4">
                    <CardHeader className="font-semibold">
                        {message.sender}
                    </CardHeader>
                    <Divider />
                    <CardBody>{message.text}</CardBody>
                </Card>
            ))}
        </div>
    );
}
