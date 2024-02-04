import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
    PostRequest,
    PostResponseFail,
    PostResponseSuccess
} from "api/interfaces/Conversation.ts";

type OnResponseCallback = (
    response: PostResponseFail | PostResponseSuccess
) => void;

const apiEndpoint = "/api/conversation";

export async function sendMessage(
    request: PostRequest,
    onResponse?: OnResponseCallback,
    signal?: AbortSignal
) {
    await fetchEventSource(`${import.meta.env.VITE_API_ROOT}${apiEndpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        signal: signal,
        openWhenHidden: true,
        body: JSON.stringify(request),
        async onopen(response) {
            const contentType = response.headers.get("Content-Type");
            if (!contentType) {
                throw new TypeError("Server did not specify Content-Type");
            }

            if (
                // eslint-disable-next-line no-magic-numbers
                contentType.indexOf("text/event-stream") >= 0
            ) {
                return;
            }

            if (
                // eslint-disable-next-line no-magic-numbers
                contentType.indexOf("application/json") >= 0
            ) {
                throw await response.json();
            }

            throw new TypeError(`Unknown Content-Type: ${contentType}`);
        },
        onerror(error) {
            throw error;
        },
        onmessage(event) {
            const { data } = event;
            if (data && onResponse) {
                onResponse(JSON.parse(data));
            }
        }
    });
}
