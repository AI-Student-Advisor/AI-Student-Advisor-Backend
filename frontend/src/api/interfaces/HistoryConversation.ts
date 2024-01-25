interface ResponseBase {
    status: "success" | "fail";
}

export interface GetRequest {}

export interface GetResponse extends ResponseBase {}

export interface PatchRequest {}

export interface PatchResponse extends ResponseBase {}

export interface DeleteRequest {}

export interface DeleteResponse extends ResponseBase {}
