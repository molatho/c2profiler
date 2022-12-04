// References:
// - https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2_main.htm
// - https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2-extend_main.htm
// - https://github.com/Cobalt-Strike/Malleable-C2-Profiles/blob/master/normal/reference.profile
// - https://bigb0sss.github.io/posts/redteam-cobalt-strike-malleable-profile/

export type TopBlockName = "code_signer" | "http_get" | "http_post" | "http_stager" | "http_config" | "https_certificate" | "stage" | "dns_beacon" | "post_ex" | "process_inject";
export const TopBlockNames: TopBlockName[] = ["code_signer", "http_get", "http_post", "http_stager", "http_config", "https_certificate", "stage", "dns_beacon", "post_ex", "process_inject"]
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
export interface ICSProfile extends ICSHasOptions {
    http_get?: ICSVariantContainer<ICSBlockHttpGet>;
    http_post?: ICSVariantContainer<ICSBlockHttpPost>;
    http_stager?: ICSVariantContainer<ICSBlockHttpStager>;
    http_config?: ICSVariantContainer<ICSBlockHttpConfig>;
    https_certificate?: ICSBlockHttpsCertificate;
    stage?: ICSBlockStage;
    dns_beacon?: ICSVariantContainer<ICSBlockDnsBeacon>;
    post_ex?: ICSBlockPostEx;
    code_signer?: ICSBlockCodeSigner;
    process_inject?: ICSBlockProcessInject;
}

export class CSProfileHelper {
    static create_http_config(profile: ICSProfile): ICSProfile {
        profile.http_config = {
            baseline: {
                options: [],
                headers: []
            },
            variants: []
        }
        return profile;
    }
    static create_post_ex(profile: ICSProfile): ICSProfile {
        profile.post_ex = {
            options: []
        }
        return profile;
    }
    static create_code_signer(profile: ICSProfile): ICSProfile {
        profile.code_signer = {
            options: []
        }
        return profile;
    }
    static create_process_inject(profile: ICSProfile): ICSProfile {
        profile.process_inject = {
            transforms: [],
            options: []
        }
        return profile;
    }
    static create_dns_beacon(profile: ICSProfile): ICSProfile {
        profile.dns_beacon = {
            baseline: { options: [] },
            variants: []
        }
        return profile;
    }
    static create_stage(profile: ICSProfile): ICSProfile {
        profile.stage = {
            transforms: [],
            commands: [],
            options: []
        }
        return profile;
    }
    static create_https_certificate(profile: ICSProfile): ICSProfile {
        profile.https_certificate = {
            options: []
        }
        return profile;
    }
    static create_http_stager(profile: ICSProfile): ICSProfile {
        profile.http_stager = {
            baseline: {
                server: {
                    output: CSProfileHelper.create_default_transform_info(),
                    headers: []
                },
                options: []
            },
            variants: []
        }
        return profile;
    }
    static create_http_get = (profile: ICSProfile): ICSProfile => {
        profile.http_get = {
            baseline: { options: [] },
            variants: []
        }
        return profile;
    }

    static create_http_post(profile: ICSProfile): ICSProfile {
        profile.http_post = {
            baseline: { options: [] },
            variants: []
        }
        return profile;
    }

    private static create_default_transform_info = (): ICSBlockTransformInformation => {
        return {
            transforms: [],
            termination: {
                type: "print"
            }
        };
    }

    static remove_top_block = (profile: ICSProfile, blockName: TopBlockName): ICSProfile => {
        profile[blockName] = undefined;
        return profile;
    }

    static create_top_block = (profile: ICSProfile, blockName: TopBlockName): ICSProfile => {
        switch (blockName) {
            case "http_get":
                return CSProfileHelper.create_http_get(profile);
            case "http_post":
                return CSProfileHelper.create_http_post(profile);
            case "http_config":
                return CSProfileHelper.create_http_config(profile);
            case "http_stager":
                return CSProfileHelper.create_http_stager(profile);
            case "https_certificate":
                return CSProfileHelper.create_https_certificate(profile);
            case "stage":
                return CSProfileHelper.create_stage(profile);
            case "dns_beacon":
                return CSProfileHelper.create_dns_beacon(profile);
            case "post_ex":
                return CSProfileHelper.create_post_ex(profile);
            case "code_signer":
                return CSProfileHelper.create_code_signer(profile);
            case "process_inject":
                return CSProfileHelper.create_process_inject(profile);
        }
        return profile;
    }
}

export interface ICSVariantContainer<T> {
    baseline: T;
    variants: T[];
}

export interface ICSOption {
    name: string;
    value: string;
}

export interface ICSHeader {
    name: string;
    value: string;
}

export interface ICSParameter {
    name: string;
    value: string;
}

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

export interface ICSBlockHttpBaseClient extends ICSHasHeaders { }

export interface ICSBlockHttpBaseServer extends ICSHasHeaders { }

export interface ICSBlockHttpGet extends ICSHasOptions, ICSHasVariant {
    client?: ICSBlockHttpGetClient;
    server?: ICSBlockHttpGetServer;
    parameter?: ICSParameter;
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

export interface ICSBlockHttpConfig extends ICSHasOptions, ICSHasHeaders { }

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