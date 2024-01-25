import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

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
