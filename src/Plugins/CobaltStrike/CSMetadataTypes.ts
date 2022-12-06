export type TopBlockName = "code_signer" | "http_get" | "http_post" | "http_stager" | "http_config" | "https_certificate" | "stage" | "dns_beacon" | "post_ex" | "process_inject";
export const TopBlockNames: TopBlockName[] = ["code_signer", "http_get", "http_post", "http_stager", "http_config", "https_certificate", "stage", "dns_beacon", "post_ex", "process_inject"];
export const TopBlockDisplayNames: Map<TopBlockName, string> = new Map<TopBlockName, string>([
    ["code_signer", "Code Signer"],
    ["http_get", "HTTP Get"],
    ["http_post", "HTTP Post"],
    ["http_stager", "HTTP Stager"],
    ["http_config", "HTTP Config"],
    ["https_certificate", "HTTPS Certificate"],
    ["stage", "Stage"],
    ["dns_beacon", "DNS Beacon"],
    ["post_ex", "Post-Exploitation"],
    ["process_inject", "Process Inject"],
]);

export interface IMetaOptionDefinition {
    name: string;
    type: "string" | "number" | "boolean";
    defaultValue: string;
    description?: string;
    opsec?: boolean;
}

export type TransformName = "append" | "prepend" | "base64" | "base64url" | "mask" | "netbios" | "netbiosu";
export const TransformNames: TransformName[] = ["append", "prepend", "base64", "base64url", "mask", "netbios", "netbiosu"];
export const TransformDisplayNames: Map<TransformName, string> = new Map<TransformName, string>([
    ["append", "Append"],
    ["prepend", "Prepend"],
    ["base64", "Base64"],
    ["base64url", "Base64 URL"],
    ["mask", "Mask"],
    ["netbios", "NetBIOS"],
    ["netbiosu", "NetBIOS (U)"]
]);


export type TerminationName = "header" | "parameter" | "print" | "uri-append";
export const TerminatioNames: TerminationName[] = ["header", "parameter", "print", "uri-append"];

export interface IMetaTransformDefinition {
    operand: boolean;
    description: string;
}

export interface IMetaTerminationDefinition {
    operand: boolean;
    description: string;
}