export interface ParseResult {
    type: "request" | "response";
    result: IHttpRequest | IHttpResponse;
}

export interface IHttpRequest {
    verb: string;
    path: IHttpPath;
    protocol: IHttpProtocol;
    headers: IHeader[];
    body: string
}

export interface IHttpPath {
    uri: string;
    parameters: IParameter[];
}

export interface IHttpProtocol {
    version: string
}

export interface IHeader {
    key: string;
    value: string;
}

export interface IParameter {
    name: string;
    value: string;
}

export interface IHttpResponse {
    protocol: IHttpProtocol;
    statusCode: number;
    statusMessage: string,
    headers: IHeader[];
    body: string
}