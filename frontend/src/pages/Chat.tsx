import { faPenFancy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ScrollShadow } from "@nextui-org/react";
import { sendMessage } from "api/Conversation.ts";
import { fetchHistoryConversations } from "api/HistoryConversations.ts";
import {
    Message,
    CONTROL_SIGNAL,
    PostResponseControl,
    PostResponseFail,
    PostResponseSuccess,
    REQUEST_STATUS,
    RESPONSE_TYPE,
    AUTHOR_ROLE,
    CONTENT_TYPE
} from "api/interfaces/APIStructs.ts";
import { HistoryConversation } from "api/interfaces/StructHistoryConversation.ts";
import ChatConversation from "components/ChatConversation.tsx";
import ChatConversationHistory from "components/ChatConversationHistory.tsx";
import ChatInput from "components/ChatInput.tsx";
import ChatToolbar from "components/ChatToolbar.tsx";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [historyConversations, setHistoryConversations] = useState<
        HistoryConversation[]
    >([]);
    const context = "University of Ottawa";
    const initialAssistantMessage: Message = {
        id: crypto.randomUUID(),
        contentType: CONTENT_TYPE.TEXT,
        content: `Bonjour! This is AI Student Advisor - your virtual companion here to assist you with any information related to the ${context}! How can I help you today?`,
        author: {
            role: AUTHOR_ROLE.ASSISTANT
        }
    };
    const [messages, setMessages] = useState<Message[]>([
        initialAssistantMessage
    ]);
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
            contentType: CONTENT_TYPE.TEXT,
            content: text,
            author: {
                role: AUTHOR_ROLE.USER
            }
        };

        // add user input to conversation messages
        setMessages([...messages, message]);

        void sendMessage(
            { message: message },
            handleResponse,
            sendMessageErrorHandler,
            generationController.current.signal
        );

        setIsGenerating(true);
    }

    function sendMessageErrorHandler(err: Error) {
        const message: Message = {
            id: crypto.randomUUID(),
            contentType: CONTENT_TYPE.TEXT,
            content: err.message,
            author: {
                role: AUTHOR_ROLE.SYSTEM
            }
        };
        setMessages([...messages, message]);
    }

    function handleResponse(
        response: PostResponseFail | PostResponseSuccess | PostResponseControl
    ) {
        if (response.type === RESPONSE_TYPE.MESSAGE) {
            switch (response.status) {
                case REQUEST_STATUS.SUCCESS: {
                    const successResponse = response as PostResponseSuccess;
                    handleMessageResponse(successResponse.message!);
                    break;
                }
                case REQUEST_STATUS.FAIL: {
                    const failResponse = response as PostResponseFail;
                    console.error(`Request failed: ${failResponse.reason}`);
                    break;
                }
                default:
                    console.error(`Unknown response status ${response.status}`);
            }
        } else if (response.type === RESPONSE_TYPE.CONTROL) {
            const controlResponse = response as PostResponseControl;
            handleControlResponse(controlResponse.control.signal);
        } else {
            console.error(`Unknown response type ${response}`);
        }
    }

    function handleMessageResponse(message: Message) {
        console.log(
            "DEBUG: handleMessageResponse: New message recieved",
            message
        );
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

    function handleControlResponse(signal: CONTROL_SIGNAL) {
        switch (signal) {
            case CONTROL_SIGNAL.GENERATION_PENDING:
                console.log("DEBUG: Message generation pending");
                break;
            case CONTROL_SIGNAL.GENERATION_STARTED:
                console.log("DEBUG: Message generation started");
                break;
            case CONTROL_SIGNAL.GENERATION_DONE:
                console.log("DEBUG: Message generation done");
                setIsGenerating(false);
                break;
            case CONTROL_SIGNAL.GENERATION_ERROR:
                console.error("Message generation error");
                setIsGenerating(false);
                break;
            default:
                console.error(`Unknown control signal: ${signal}`);
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
