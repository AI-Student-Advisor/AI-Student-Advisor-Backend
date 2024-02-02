import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@nextui-org/react";
import React from "react";
import { useDarkMode } from "usehooks-ts";

export interface ChatToolbarProps extends React.ComponentProps<"div"> {}

export default function ChatToolbar({ ...otherProps }: ChatToolbarProps) {
    const { isDarkMode, toggle } = useDarkMode();

    return (
        <div {...otherProps}>
            <Switch
                isSelected={!isDarkMode}
                onValueChange={toggle}
                thumbIcon={(props) =>
                    props.isSelected ? <FontAwesomeIcon icon={faSun} /> : <></>
                }
                endContent={<FontAwesomeIcon icon={faMoon} />}
            />
        </div>
    );
}
