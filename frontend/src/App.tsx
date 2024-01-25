import Chat from "/src/pages/Chat.tsx";
import useDarkMode from "use-dark-mode";

export default function App() {
    const darkMode = useDarkMode(false);

    return (
        <div
            className={`${darkMode.value ? "dark" : ""} text-foreground bg-background full-screen`}
        >
            <Chat />
        </div>
    );
}
