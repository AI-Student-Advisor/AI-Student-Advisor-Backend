import { faPenFancy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ScrollShadow } from "@nextui-org/react";
import { sendMessage } from "api/Conversation.ts";
import { fetchHistoryConversations } from "api/HistoryConversations.ts";
import {
    HistoryConversation,
    Message,
    UUID
} from "api/interfaces/CommonStruct.ts";
import {
    PostResponseBase,
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
    const [sessionId, setSessionId] = useState<UUID | undefined>(undefined);
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

    function handleSendMessage(text: string) {
        setInputStatus("waiting");
        generationController.current = new AbortController();

        const message: Message = {
            id: crypto.randomUUID(),
            contentType: "text/plain",
            content: text,
            author: {
                role: "user"
            }
        };

        // Append user sent message
        setMessages((prevMessages) => [...prevMessages, message]);

        void sendMessage(
            { id: sessionId, message: message },
            handleResponse,
            generationController.current.signal
        ).catch((error) => {
            console.error(error);
            handleError(error);
        });
    }

    function handleResponse(response: PostResponseBase) {
        let errorString = "";

        switch (response.status) {
            case "success":
                handleSuccessResponse(response as PostResponseSuccess);
                break;
            case "fail":
                errorString = `Request failed: ${(response as PostResponseFail).reason}`;
                console.error(errorString);
                handleError(errorString);
                break;
            default:
                errorString = `Unknown response status ${response.status}`;
                console.error(errorString);
                handleError(errorString);
        }
    }

    function handleSuccessResponse(response: PostResponseSuccess) {
        let errorString = "";

        switch (response.type) {
            case "message":
                handleMessageResponse(response as PostResponseMessage);
                break;
            case "control":
                handleControlResponse(response as PostResponseControl);
                break;
            default:
                errorString = `Unknown response type ${response.type}`;
                console.error(errorString);
                handleError(errorString);
        }
    }

    function handleMessageResponse(response: PostResponseMessage) {
        const { id, message } = response;
        setSessionId(id);

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

    function handleControlResponse(response: PostResponseControl) {
        const { control } = response;
        let errorString = "";

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
                errorString = "Signal generation-error received";
                console.error(errorString);
                handleError(errorString);
                break;
            default:
                errorString = `Unknown control signal: ${control.signal}`;
                console.error(errorString);
                handleError(errorString);
        }
    }

    // eslint-disable-next-line
    function handleError(error: any | object | string) {
        // TODO: Need more user-friendly error prompt
        const message: Message = {
            id: crypto.randomUUID(),
            contentType: "text/plain",
            content: error.toString(),
            author: {
                role: "system"
            }
        };
        setMessages((prevMessages) => [...prevMessages, message]);
        setInputStatus("idle");
    }

    function handleStopGenerate() {
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
                    onSendMessage={handleSendMessage}
                    onStopGenerate={handleStopGenerate}
                    status={inputStatus}
                />
            </div>
        </div>
    );
}
