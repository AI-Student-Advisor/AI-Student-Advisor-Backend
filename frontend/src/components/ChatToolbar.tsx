import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@nextui-org/react";
import useDarkMode from "use-dark-mode";

export default function ChatToolbar() {
    const darkMode = useDarkMode();

    return (
        <div className="flex justify-between items-center">
            <Switch
                isSelected={!darkMode.value}
                onValueChange={darkMode.toggle}
                thumbIcon={(props) =>
                    props.isSelected ? <FontAwesomeIcon icon={faSun} /> : <></>
                }
                endContent={<FontAwesomeIcon icon={faMoon} />}
            />
        </div>
    );
}
