interface ResponseBase {
    status: "success" | "fail";
}

export interface GetRequest {}

export interface GetResponse extends ResponseBase {}
