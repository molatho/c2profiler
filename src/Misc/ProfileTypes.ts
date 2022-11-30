// References:
// - https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2_main.htm
// - https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2-extend_main.htm
// - https://bigb0sss.github.io/posts/redteam-cobalt-strike-malleable-profile/

export interface IProfile extends IHasOptions {
    http_get?: IBlockHttpGet;
    http_post?: IBlockHttpPost;
    http_stager?: IBlockHttpStager;
    http_config?: IBlockHttpConfig;
    https_certificate?: IBlockHttpsCertificate;
    stage?: IBlockStage;
    dns_beacon?: IBlockDnsBeacon;
    post_ex?: IBlockPostEx;
    code_signer?: IBlockCodeSigner;
    process_inject?: IBlockProcessInject;
}

export interface IOption {
    name: string;
    value: string;
}

export interface IHeader {
    name: string;
    value: string;
}

export interface IHasOptions {
    options: IOption[];
}

export interface IHasVariant {
    variant?: string;
}

export interface IHasHeaders {
    headers: IHeader[];
}

// HTTP

export interface IBlockHttpBaseClient extends IHasHeaders { }

export interface IBlockHttpBaseServer extends IHasHeaders { }

export interface IBlockHttpGet extends IHasOptions, IHasVariant {
    client?: IBlockHttpGetClient;
    server?: IBlockHttpGetServer;
}

export interface IBlockHttpPost extends IHasOptions, IHasVariant {
    client?: IBlockHttpPostClient;
    server?: IBlockHttpPostServer;
}

export interface IBlockHttpGetClient extends IBlockHttpBaseClient {
    metadata?: IBlockTransformInformation;
}

export interface IBlockTransformInformation {
    transforms: IDataTransform[];
    termination: ITermination;
}

export interface IBlockHttpGetServer extends IBlockHttpBaseServer {
    output?: IBlockTransformInformation;
}

export interface IBlockHttpPostClient extends IBlockHttpBaseClient {
    id?: IBlockTransformInformation;
    output?: IBlockTransformInformation;
}

export interface IBlockHttpPostServer extends IBlockHttpBaseServer {
    output?: IBlockTransformInformation;
}

export interface IBlockHttpConfig extends IHasOptions, IHasHeaders { }

export interface IBlockHttpsCertificate extends IHasOptions, IHasVariant { }

export interface IBlockHttpStager extends IHasOptions, IHasVariant {
    client?: IBlockHttpStagerClient;
    server: IBlockHttpStagerServer;
}

export interface IBlockHttpStagerClient extends IHasHeaders {
    termination: ITermination;
}

export interface IBlockHttpStagerServer extends IHasHeaders {
    output: IBlockTransformInformation;
}


// Payloads

export interface IDataTransform {
    type: "append" | "prepend" | "base64" | "base64url" | "mask" | "netbios" | "netbiosu";
    operand?: string;
}

export interface ITermination {
    type: "header" | "parameter" | "print" | "uri-append";
    operand?: string;
}

export interface IPayloadTransform {
    type: "transform-x86" | "transform-x64";
    operations: IPayloadTransformOperation[];
}

export interface IPayloadTransformOperation {
    type: "prepend" | "append" | "strrep";
    operand1: string;
    operand2?: string;
}

export interface IPayloadCommand {
    type: "stringw" | "string" | "data";
    operand: string;
}

// Stage

export interface IBlockStage extends IHasOptions {
    transforms: IPayloadTransform[];
    commands: IPayloadCommand[];
}

// DNS

export interface IBlockDnsBeacon extends IHasOptions, IHasVariant { }

// Post-Ex

export interface IBlockPostEx extends IHasOptions { }

// Code-Signer

export interface IBlockCodeSigner extends IHasOptions { }

// Process-Inject

export interface IBlockProcessInject extends IHasOptions {
    transforms: IPayloadTransform[];
    execute?: IProcessInjectExecute;
}

export interface IProcessInjectExecute extends IHasOptions {
    commands: IProcessInjectExecuteCommand[];
}

export interface IProcessInjectExecuteCommand {
    name: "CreateThread" | "CreateRemoteThread" | "NtQueueApcThread" | "NtQueueApcThread-s" | "RtlCreateUserThread" | "SetThreadContext";
    operand?: string;
}