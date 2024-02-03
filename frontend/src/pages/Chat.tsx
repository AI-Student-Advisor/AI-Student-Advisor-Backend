import { faPenFancy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ScrollShadow } from "@nextui-org/react";
import { sendMessage } from "api/Conversation.ts";
import { fetchHistoryConversations } from "api/HistoryConversations.ts";
import {
    Control,
    HistoryConversation,
    Message
} from "api/interfaces/CommonStruct.ts";
import {
    PostResponseControl,
    PostResponseFail,
    PostResponseMessage,
    PostResponseSuccess
} from "api/interfaces/Conversation.ts";
import ChatConversation from "components/ChatConversation.tsx";
import ChatConversationHistory from "components/ChatConversationHistory.tsx";
import ChatInput, { ChatInputStatus } from "components/ChatInput.tsx";
import ChatToolbar from "components/ChatToolbar.tsx";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
    const [inputStatus, setInputStatus] = useState<ChatInputStatus>("idle");
    const [inputValue, setInputValue] = useState("");
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
            id: crypto.randomUUID(),
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
        ).catch((error) => {
            // TODO: Implement proper error handling here
            console.error(error);
        });
    }

    function handleResponse(response: PostResponseFail | PostResponseSuccess) {
        if (response.status === "success") {
            const successResponse = response as PostResponseSuccess;
            switch (successResponse.type) {
                case "message":
                    handleMessageResponse(
                        (response as PostResponseMessage).message
                    );
                    break;
                case "control":
                    handleControlResponse(
                        (response as PostResponseControl).control
                    );
                    break;
                default:
                    // TODO: Implement proper error handling here
                    console.error(
                        `Unknown response type ${successResponse.type}`
                    );
            }
        } else if (response.status === "fail") {
            const failResponse = response as PostResponseFail;
            // TODO: Implement proper error handling here
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
            case "generation-pending":
                setInputStatus("pending");
                break;
            case "generation-started":
                setInputStatus("generating");
                break;
            case "generation-done":
                setInputStatus("idle");
                setInputValue("");
                break;
            case "generation-error":
                // TODO: Implement proper error handling here
                setInputStatus("idle");
                break;
            default:
                // TODO: Implement proper error handling here
                console.error(`Unknown control signal: ${control.signal}`);
        }
    }

    function stopGenerateHandler() {
        generationController.current.abort();
        setInputStatus("idle");
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
                    value={inputValue}
                    setValue={setInputValue}
                    className="pb-4 w-[64rem] flex items-center"
                    onSendMessage={sendMessageHandler}
                    onStopGenerate={stopGenerateHandler}
                    status={inputStatus}
                />
            </div>
        </div>
    );
}
