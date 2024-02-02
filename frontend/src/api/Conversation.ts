import {
    PostRequest,
    PostResponseFail,
    PostResponseSuccess,
    PostResponseControl
} from "./interfaces/APIStructs";
import { fetchEventSource } from "@microsoft/fetch-event-source";

type SseOnPushCallback = (
    response: PostResponseFail | PostResponseSuccess | PostResponseControl
) => void;

const apiEndpoint = "/api/conversation";

export async function sendMessage(
    request: PostRequest,
    onPush: SseOnPushCallback,
    onError: (error: Error) => void,
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
            console.log("onopen", response);
            const contentType = response.headers.get("Content-Type");
            if (
                Boolean(contentType) &&
                // eslint-disable-next-line no-magic-numbers
                contentType!.indexOf("application/json") >= 0
            ) {
                throw await response.json();
            }
        },
        onclose() {
            console.log("querying completed");
        },
        onerror(error) {
            onError(error);
        },
        onmessage(event) {
            console.log("onmessage", event);
            const { data } = event;
            if (data) {
                onPush(JSON.parse(data));
            }
        }
    });
}
