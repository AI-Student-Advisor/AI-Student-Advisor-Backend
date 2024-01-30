import { faPaperPlane, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Textarea } from "@nextui-org/react";
import React, { useState } from "react";

export type OnSendMessageCallback = (text: string) => void;
export type OnStopGenerateCallback = () => void;

export interface ChatInputProps extends React.ComponentProps<"form"> {
    onSendMessage?: OnSendMessageCallback;
    onStopGenerate?: OnStopGenerateCallback;
    isGenerating: boolean;
}

export default function ChatInput({
    onSendMessage,
    onStopGenerate,
    isGenerating,
    ...otherProps
}: ChatInputProps) {
    const [input, setInput] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);

    function buttonClickHandler() {
        if (onSendMessage && !isGenerating) {
            onSendMessage(input);
            setInput("");
        }
        if (onStopGenerate && isGenerating) {
            onStopGenerate();
        }
    }

    return (
        <form {...otherProps}>
            <Textarea
                isRequired
                variant="flat"
                size="lg"
                value={input}
                minRows={1}
                onValueChange={(v) => {
                    setInput(v);
                    setButtonDisabled(v === "");
                }}
                type="text"
                placeholder="Type your message..."
                color="secondary"
                isDisabled={isGenerating}
            />
            <div role="separator" className="px-3"></div>
            <Button
                isIconOnly
                className="text-base text-white"
                onClick={buttonClickHandler}
                color="primary"
                variant="solid"
                isDisabled={buttonDisabled}
            >
                {isGenerating ? (
                    <FontAwesomeIcon icon={faStop} />
                ) : (
                    <FontAwesomeIcon icon={faPaperPlane} />
                )}
            </Button>
        </form>
    );
}
