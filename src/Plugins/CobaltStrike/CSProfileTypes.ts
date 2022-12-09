// References:
// - https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2_main.htm
// - https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2-extend_main.htm
// - https://github.com/Cobalt-Strike/Malleable-C2-Profiles/blob/master/normal/reference.profile
// - https://bigb0sss.github.io/posts/redteam-cobalt-strike-malleable-profile/


export interface ICSProfile extends ICSHasOptions {
    http_get: ICSVariantContainer<ICSBlockHttpGet> | null;
    http_post: ICSVariantContainer<ICSBlockHttpPost> | null;
    http_stager: ICSVariantContainer<ICSBlockHttpStager> | null;
    http_config: ICSVariantContainer<ICSBlockHttpConfig> | null;
    https_certificate: ICSBlockHttpsCertificate | null;
    stage: ICSBlockStage | null;
    dns_beacon: ICSVariantContainer<ICSBlockDnsBeacon> | null;
    post_ex: ICSBlockPostEx | null;
    code_signer: ICSBlockCodeSigner | null;
    process_inject: ICSBlockProcessInject | null;
}



export interface ICSVariantContainer<T extends ICSHasVariant> {
    baseline: T;
    variants: T[];
}

export interface ICSKeyValue {
    name: string;
    value: string;
}

export interface ICSOption extends ICSKeyValue { }

export interface ICSHeader extends ICSKeyValue { }

export interface ICSParameter extends ICSKeyValue { }

export interface ICSHasOptions {
    options: ICSOption[];
}

export interface ICSHasVariant {
    variant?: string;
}

export interface ICSHasHeaders {
    headers: ICSHeader[];
}

// HTTP

export interface ICSBlockHttpBaseClient extends ICSHasHeaders {
    parameters: ICSParameter[];
}

export interface ICSBlockHttpBaseServer extends ICSHasHeaders { }

export interface ICSBlockHttpGet extends ICSHasOptions, ICSHasVariant {
    client?: ICSBlockHttpGetClient;
    server?: ICSBlockHttpGetServer;
}

export interface ICSBlockHttpPost extends ICSHasOptions, ICSHasVariant {
    client?: ICSBlockHttpPostClient;
    server?: ICSBlockHttpPostServer;
}

export interface ICSBlockHttpGetClient extends ICSBlockHttpBaseClient {
    metadata?: ICSBlockTransformInformation;
}

export interface ICSBlockTransformInformation {
    transforms: ICSDataTransform[];
    termination: ICSTermination;
}

export interface ICSBlockHttpGetServer extends ICSBlockHttpBaseServer {
    output?: ICSBlockTransformInformation;
}

export interface ICSBlockHttpPostClient extends ICSBlockHttpBaseClient {
    id?: ICSBlockTransformInformation;
    output?: ICSBlockTransformInformation;
}

export interface ICSBlockHttpPostServer extends ICSBlockHttpBaseServer {
    output?: ICSBlockTransformInformation;
}

export interface ICSBlockHttpConfig extends ICSHasOptions, ICSHasHeaders, ICSHasVariant { }

export interface ICSBlockHttpsCertificate extends ICSHasOptions, ICSHasVariant { }

export interface ICSBlockHttpStager extends ICSHasOptions, ICSHasVariant {
    client?: ICSBlockHttpStagerClient;
    server: ICSBlockHttpStagerServer;
}

export interface ICSBlockHttpStagerClient extends ICSHasHeaders {
    parameter?: ICSParameter;
}

export interface ICSBlockHttpStagerServer extends ICSHasHeaders {
    output: ICSBlockTransformInformation;
}


// Payloads

export interface ICSDataTransform {
    type: "append" | "prepend" | "base64" | "base64url" | "mask" | "netbios" | "netbiosu";
    operand?: string;
}

export interface ICSTermination {
    type: "header" | "parameter" | "print" | "uri-append";
    operand?: string;
}

export interface ICSPayloadTransform {
    type: "transform-x86" | "transform-x64";
    operations: ICSPayloadTransformOperation[];
}

export interface ICSPayloadTransformOperation {
    type: "prepend" | "append" | "strrep";
    operand1: string;
    operand2?: string;
}

export interface ICSPayloadCommand {
    type: "stringw" | "string" | "data";
    operand: string;
}

// Stage

export interface ICSBlockStage extends ICSHasOptions {
    transforms: ICSPayloadTransform[];
    commands: ICSPayloadCommand[];
}

// DNS

export interface ICSBlockDnsBeacon extends ICSHasOptions, ICSHasVariant { }

// Post-Ex

export interface ICSBlockPostEx extends ICSHasOptions { }

// Code-Signer

export interface ICSBlockCodeSigner extends ICSHasOptions { }

// Process-Inject

export interface ICSBlockProcessInject extends ICSHasOptions {
    transforms: ICSPayloadTransform[];
    execute?: ICSProcessInjectExecute;
}

export interface ICSProcessInjectExecute extends ICSHasOptions {
    commands: ICSProcessInjectExecuteCommand[];
}

export interface ICSProcessInjectExecuteCommand {
    type: "CreateThread" | "CreateRemoteThread" | "NtQueueApcThread" | "NtQueueApcThread-s" | "RtlCreateUserThread" | "SetThreadContext";
    operand?: string;
}