import ChatConversation from "/src/components/ChatConversation.tsx";
import ChatConversationHistory from "/src/components/ChatConversationHistory.tsx";
import ChatInput from "/src/components/ChatInput.tsx";
import ChatToolbar from "/src/components/ChatToolbar.tsx";
import { faPenFancy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ScrollShadow } from "@nextui-org/react";

export default function Chat() {
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
                    <ChatConversationHistory />
                </ScrollShadow>
            </div>
            <div className="flex flex-col flex-1 items-center">
                <div className="sticky top-0 w-full pt-2 px-4 min-h-14">
                    <ChatToolbar />
                </div>
                <ScrollShadow className="px-4 w-[56rem]">
                    <ChatConversation />
                </ScrollShadow>
                <div className="pb-4 w-[64rem]">
                    <ChatInput />
                </div>
            </div>
        </div>
    );
}
