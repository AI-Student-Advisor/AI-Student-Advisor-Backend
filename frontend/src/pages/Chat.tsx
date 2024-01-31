import { sendMessage } from "/src/api/Conversation.ts";
import { fetchHistoryConversations } from "/src/api/HistoryConversations.ts";
import {
    PostResponseFail,
    PostResponseSuccess
} from "/src/api/interfaces/Conversation.ts";
import { Control } from "/src/api/interfaces/StructControl.ts";
import { HistoryConversation } from "/src/api/interfaces/StructHistoryConversation.ts";
import { Message } from "/src/api/interfaces/StructMessage.ts";
import ChatConversation from "/src/components/ChatConversation.tsx";
import ChatConversationHistory from "/src/components/ChatConversationHistory.tsx";
import ChatInput from "/src/components/ChatInput.tsx";
import ChatToolbar from "/src/components/ChatToolbar.tsx";
import { faPenFancy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ScrollShadow } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

export default function Chat() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [historyConversations, setHistoryConversations] = useState<
        HistoryConversation[]
    >([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const generationController = useRef<AbortController>(new AbortController());

    useEffect(() => {
        void (async () => {
            setHistoryConversations(await fetchHistoryConversations());
        })();
    }, []);

    function sendMessageHandler(text: string) {
        generationController.current = new AbortController();

        const message: Message = {
            id: uuid(),
            contentType: "text/plain",
            content: text,
            author: {
                role: "user"
            }
        };

        void sendMessage(
            { message: message },
            handleResponse,
            generationController.current.signal
        );

        setIsGenerating(true);
    }

    function handleResponse(response: PostResponseFail | PostResponseSuccess) {
        if (response.status === "success") {
            const successResponse = response as PostResponseSuccess;
            switch (successResponse.type) {
                case "message":
                    handleMessageResponse(successResponse.message!);
                    break;
                case "control":
                    handleControlResponse(successResponse.control!);
                    break;
                default:
                    console.error(
                        `Unknown response type ${successResponse.type}`
                    );
            }
        } else if (response.status === "fail") {
            const failResponse = response as PostResponseFail;
            console.error(`Request failed: ${failResponse.reason}`);
        }
    }

    function handleMessageResponse(message: Message) {
        setMessages((prevMessages) => {
            /* eslint-disable no-magic-numbers */
            if (
                prevMessages.length > 0 &&
                prevMessages[prevMessages.length - 1].id === message.id
            ) {
                return [...prevMessages.slice(0, -1), message];
            }
            /* eslint-enable no-magic-numbers */
            return [...prevMessages, message];
        });
    }

    function handleControlResponse(control: Control) {
        switch (control.signal) {
            case "generation-done":
                setIsGenerating(false);
                break;
            case "generation-error":
                setIsGenerating(false);
                break;
            default:
                console.error(`Unknown control signal: ${control.signal}`);
        }
    }

    function stopGenerateHandler() {
        generationController.current.abort();
        setIsGenerating(false);
    }

    return (
        <div className="h-full flex">
            <div className="flex flex-col min-w-64 p-3 bg-secondary-50">
                <Button
                    variant="solid"
                    color="primary"
                    className="text-white text-lg font-bold w-full min-h-12"
                    size="lg"
                    startContent={<FontAwesomeIcon icon={faPenFancy} />}
                >
                    New Chat
                </Button>
                <div role="separator" className="py-3"></div>
                <ScrollShadow className="h-full flex-1">
                    <ChatConversationHistory
                        historyConversations={historyConversations}
                    />
                </ScrollShadow>
            </div>
            <div className="flex flex-col flex-1 items-center">
                <ChatToolbar className="sticky top-0 w-full pt-2 px-4 min-h-14 flex justify-between items-center" />
                <ScrollShadow className="px-4 w-[56rem] h-full">
                    <ChatConversation messages={messages} />
                </ScrollShadow>
                <ChatInput
                    className="pb-4 w-[64rem] flex items-center"
                    onSendMessage={sendMessageHandler}
                    onStopGenerate={stopGenerateHandler}
                    isGenerating={isGenerating}
                />
            </div>
        </div>
    );
}
