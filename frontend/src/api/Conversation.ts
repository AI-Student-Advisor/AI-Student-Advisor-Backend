import {
    PostRequest,
    PostResponseFail,
    PostResponseSuccess
} from "/src/api/interfaces/Conversation.ts";
import { fetchEventSource } from "@microsoft/fetch-event-source";

type SseOnEventCallbackType = (
    response: PostResponseFail | PostResponseSuccess
) => void;

// TODO: Now using the mock server. To be switched to the real backend.
export async function sendMessage(
    request: PostRequest,
    onPush: SseOnEventCallbackType,
    signal?: AbortSignal
) {
    await fetchEventSource("http://localhost:5174", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        signal: signal,
        openWhenHidden: true,
        body: JSON.stringify(request),
        async onopen(response) {
            const contentType = response.headers.get("Content-Type");
            if (
                Boolean(contentType) &&
                // eslint-disable-next-line no-magic-numbers
                contentType!.indexOf("application/json") >= 0
            ) {
                throw await response.json();
            }
        },
        onerror(error) {
            throw error;
        },
        onmessage(event) {
            const { data } = event;
            if (data) {
                onPush(JSON.parse(data));
            }
        }
    });
}
