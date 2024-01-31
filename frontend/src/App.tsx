import Chat from "/src/pages/Chat.tsx";
import { useDarkMode } from "usehooks-ts";

export default function App() {
    const { isDarkMode } = useDarkMode();

    return (
        <div
            className={`${isDarkMode ? "dark" : ""} text-foreground bg-background full-screen`}
        >
            <Chat />
        </div>
    );
}
