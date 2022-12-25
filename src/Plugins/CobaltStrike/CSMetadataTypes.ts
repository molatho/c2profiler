import metadata from "./metadata.json"

export type TopBlockName = "code_signer" | "http_get" | "http_post" | "http_stager" | "http_config" | "https_certificate" | "stage" | "dns_beacon" | "post_ex" | "process_inject";
export const TopBlockNames: TopBlockName[] = ["code_signer", "http_get", "http_post", "http_stager", "http_config", "https_certificate", "stage", "dns_beacon", "post_ex", "process_inject"];

export type TopBlockMetaName = "global" | TopBlockName;
export const TopBlockMetaNames: string[] = ["global"].concat(TopBlockNames);
export const TopBlockMetaDisplayNames = {
    "global": "Global",
    "code_signer": metadata.blocks["code_signer"].displayName,
    "http_get": metadata.blocks["http_get"].displayName,
    "http_post": metadata.blocks["http_post"].displayName,
    "http_stager": metadata.blocks["http_stager"].displayName,
    "http_config": metadata.blocks["http_config"].displayName,
    "https_certificate": metadata.blocks["https_certificate"].displayName,
    "stage": metadata.blocks["stage"].displayName,
    "dns_beacon": metadata.blocks["dns_beacon"].displayName,
    "post_ex": metadata.blocks["post_ex"].displayName,
    "process_inject": metadata.blocks["process_inject"].displayName
}

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
    type: "string" | "number" | "boolean" | "option" | "list";
    defaultValue: string;
    opsec?: boolean;
    required?: boolean;
    options?: string[];
    listDelimiter?: string;
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