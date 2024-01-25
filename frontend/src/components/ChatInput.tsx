import { faPaperPlane, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Textarea } from "@nextui-org/react";
import { useState } from "react";

export default function ChatInput() {
    const [input, setInput] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [isGenerating] = useState(false);

    return (
        <form className="flex items-center">
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
            />
            <div role="separator" className="px-3"></div>
            <Button
                isIconOnly
                className="text-base text-white"
                onClick={() => {}}
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
