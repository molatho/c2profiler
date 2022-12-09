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


export type TerminationName = "header" | "parameter" | "print" | "uri-append";
export const TerminationNames: TerminationName[] = ["header", "parameter", "print", "uri-append"];

export interface IMetaTransformDefinition extends IHasDocumentation, IHasDisplayName {
    operand: boolean;
}

export interface IMetaTerminationDefinition extends IHasDocumentation, IHasDisplayName {
    operand: boolean;
}