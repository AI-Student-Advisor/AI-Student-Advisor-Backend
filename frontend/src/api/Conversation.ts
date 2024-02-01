import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
    PostRequest,
    PostResponseFail,
    PostResponseSuccess
} from "api/interfaces/Conversation.ts";

type SseOnPushCallback = (
    response: PostResponseFail | PostResponseSuccess
) => void;

const apiEndpoint = "/api/conversation";

export async function sendMessage(
    request: PostRequest,
    onPush: SseOnPushCallback,
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
