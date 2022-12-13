export type TopBlockName = "code_signer" | "http_get" | "http_post" | "http_stager" | "http_config" | "https_certificate" | "stage" | "dns_beacon" | "post_ex" | "process_inject";
export const TopBlockNames: TopBlockName[] = ["code_signer", "http_get", "http_post", "http_stager", "http_config", "https_certificate", "stage", "dns_beacon", "post_ex", "process_inject"];

export interface IHasDocumentation {
    description?: string;
    link?: string;
}

export interface IHasDisplayName {
    displayName: string;
}

export interface IMetaTopBlockDefinition extends IHasDocumentation, IHasDisplayName {
}


export interface IMetaOptionDefinition extends IHasDocumentation {
    name: string;
    type: "string" | "number" | "boolean";
    defaultValue: string;
    opsec?: boolean;
}

export type TransformName = "append" | "prepend" | "base64" | "base64url" | "mask" | "netbios" | "netbiosu";
export const TransformNames: TransformName[] = ["append", "prepend", "base64", "base64url", "mask", "netbios", "netbiosu"];

export interface IMetaTransformDefinition extends IHasDocumentation, IHasDisplayName {
    operand: boolean;
}

export type TerminationName = "header" | "parameter" | "print" | "uri-append";
export const TerminationNames: TerminationName[] = ["header", "parameter", "print", "uri-append"];

export interface IMetaTerminationDefinition extends IHasDocumentation, IHasDisplayName {
    operand: boolean;
}

export type PayloadTransformName = "append" | "prepend" | "strrep";
export const PayloadTransformNames: PayloadTransformName[] = ["append", "prepend", "strrep"];


export interface IMetaPayloadTransformDefinition extends IHasDocumentation, IHasDisplayName {
    operand2: boolean;
}

export type PayloadCommandName = "string" | "stringw" | "data";
export const PayloadCommandNames: PayloadCommandName[] = ["string", "stringw", "data"];

export interface IMetaPayloadCommandDefinition extends IHasDocumentation, IHasDisplayName {
}

export type ExecuteCommandName = "CreateThread" | "CreateRemoteThread" | "NtQueueApcThread" | "NtQueueApcThread-s" | "RtlCreateUserThread" | "SetThreadContext";
export const ExecuteCommandNames: ExecuteCommandName[] = ["CreateThread", "CreateRemoteThread", "NtQueueApcThread", "NtQueueApcThread-s", "RtlCreateUserThread", "SetThreadContext"];

export interface IMeteExecuteCommandDefinition extends IHasDocumentation {
    operand: boolean;
}