import { faPaperPlane, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Textarea } from "@nextui-org/react";
import React, { useState } from "react";

export type OnSendMessageCallback = (text: string) => void;
export type OnStopGenerateCallback = () => void;

export type ChatInputStatus = "idle" | "waiting" | "pending" | "generating";

export interface ChatInputProps extends React.ComponentProps<"form"> {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    status: ChatInputStatus;
    onSendMessage?: OnSendMessageCallback;
    onStopGenerate?: OnStopGenerateCallback;
}

export default function ChatInput({
    value,
    setValue,
    status,
    onSendMessage,
    onStopGenerate,
    ...otherProps
}: ChatInputProps) {
    const [isInputEmpty, setIsInputEmpty] = useState(true);

    function buttonClickHandler() {
        if (onSendMessage && status === "idle") {
            onSendMessage(value);
        }
        if (onStopGenerate && status === "generating") {
            onStopGenerate();
        }
    }

    return (
        <form {...otherProps}>
            <Textarea
                isRequired
                variant="flat"
                size="lg"
                value={value}
                minRows={1}
                onValueChange={(v) => {
                    setValue(v);
                    setIsInputEmpty(v === "");
                }}
                type="text"
                placeholder="Type your message..."
                color="secondary"
                isDisabled={status !== "idle"}
            />
            <div role="separator" className="px-3"></div>
            <Button
                isIconOnly
                className="text-base text-white"
                onClick={buttonClickHandler}
                color="primary"
                variant="solid"
                isDisabled={
                    isInputEmpty || status === "waiting" || status === "pending"
                }
            >
                {status === "generating" ? (
                    <FontAwesomeIcon icon={faStop} />
                ) : (
                    <FontAwesomeIcon icon={faPaperPlane} />
                )}
            </Button>
        </form>
    );
}
