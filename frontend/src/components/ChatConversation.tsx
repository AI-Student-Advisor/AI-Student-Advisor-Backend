import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider
} from "@nextui-org/react";
import { Message } from "api/interfaces/CommonStruct.ts";
import React from "react";

export interface ChatConversationProps extends React.ComponentProps<"div"> {
    messages: Message[];
}

export default function ChatConversation({
    messages,
    ...otherProps
}: ChatConversationProps) {
    const context = "University of Ottawa";
    const introductionView = (
        <div className="flex w-full h-full justify-center items-center">
            <Card className="max-w-[600px] h-fit" shadow="lg">
                <CardHeader className="text-4xl font-bold text-center">
                    <span className="w-full">Bonjour!</span>
                </CardHeader>
                <CardBody className="text-lg px-8">
                    <p>
                        This is AI Student Advisor - your virtual companion here
                        to assist you with any information related to the{" "}
                        {context}!
                    </p>
                </CardBody>
                <CardFooter className="text-lg text-center">
                    <span className="w-full">How can I help you today?</span>
                </CardFooter>
            </Card>
        </div>
    );

    const conversationView = messages.map((message, index) => (
        <Card key={index} className="my-4">
            <CardHeader className="font-semibold">
                {message.author.role}
            </CardHeader>
            <Divider />
            {message.contentType === "text/plain" ? (
                <CardBody className="whitespace-pre-line">
                    {message.content}
                </CardBody>
            ) : (
                <></>
            )}
        </Card>
    ));

    return (
        <div className={messages.length ? "" : "h-full"} {...otherProps}>
            {/* eslint-disable-next-line no-magic-numbers */}
            {messages.length === 0 ? introductionView : conversationView}
        </div>
    );
}
