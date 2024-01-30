import { Message } from "/src/api/interfaces/StructMessage.ts";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import React from "react";

export interface ChatConversationProps extends React.ComponentProps<"div"> {
    messages: Message[];
}

export default function ChatConversation({
    messages,
    ...otherProps
}: ChatConversationProps) {
    return (
        <div {...otherProps}>
            {messages.map((message, index) => (
                <Card key={index} className="my-4">
                    <CardHeader className="font-semibold">
                        {message.author.role}
                    </CardHeader>
                    <Divider />
                    {message.contentType === "text/plain" ? (
                        <CardBody>{message.content}</CardBody>
                    ) : (
                        <></>
                    )}
                </Card>
            ))}
        </div>
    );
}
