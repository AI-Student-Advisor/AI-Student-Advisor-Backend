import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { CONTENT_TYPE, Message } from "api/interfaces/APIStructs.ts";
import React from "react";

export interface ChatConversationProps extends React.ComponentProps<"div"> {
    messages: Message[];
}

export default function ChatConversation({
    messages,
    ...otherProps
}: ChatConversationProps) {
    console.log("DEBUG: ChatConversation: messages: ", messages);
    return (
        <div {...otherProps}>
            {messages.map((message, index) => (
                <Card key={index} className="my-4">
                    <CardHeader className="font-semibold">
                        {message.author.role}
                    </CardHeader>
                    <Divider />
                    {message.contentType === CONTENT_TYPE.TEXT ? (
                        <CardBody className="whitespace-pre-line">
                            {message.content}
                        </CardBody>
                    ) : (
                        <></>
                    )}
                </Card>
            ))}
        </div>
    );
}
