import { TopBlockName } from "./CSMetadataTypes";
import { ICSBlockHttpPost, ICSBlockHttpStager, ICSBlockDnsBeacon, ICSProfile, ICSBlockHttpGet, ICSBlockTransformInformation } from "./CSProfileTypes";

export class CSProfileHelper {
    static create_http_post_variant(name?: string): ICSBlockHttpPost {
        return {
            options: [],
            variant: name
        };
    }
    static create_http_stager_variant(name?: string): ICSBlockHttpStager {
        return {
            options: [],
            variant: name
        }
    }
    static create_dns_beacon_variant(name?: string): ICSBlockDnsBeacon {
        return {
            options: [],
            variant: name
        }
    }
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
            options: []
        }
        return profile;
    }
    static create_dns_beacon(profile: ICSProfile): ICSProfile {
        profile.dns_beacon = {
            baseline: CSProfileHelper.create_dns_beacon_variant(),
            variants: []
        }
        return profile;
    }
    static create_stage(profile: ICSProfile): ICSProfile {
        profile.stage = {
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
            baseline: CSProfileHelper.create_http_stager_variant(),
            variants: []
        }
        return profile;
    }
    static create_http_get = (profile: ICSProfile): ICSProfile => {
        profile.http_get = {
            baseline: CSProfileHelper.create_http_get_variant(),
            variants: []
        }
        return profile;
    }
    static create_http_get_variant = (name?: string): ICSBlockHttpGet => {
        return {
            options: [],
            variant: name
        }
    }

    static create_http_post(profile: ICSProfile): ICSProfile {
        profile.http_post = {
            baseline: CSProfileHelper.create_http_post_variant(),
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
        profile[blockName] = null;
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

    static create_variant = (profile: ICSProfile, blockName: "http_get" | "http_post" | "http_stager" | "http_config" | "dns_beacon", name: string): ICSProfile => {
        switch (blockName) {
            case "http_get":
                profile.http_get?.variants.push(CSProfileHelper.create_http_get_variant(name))
                break;
            case "http_post":
                profile.http_post?.variants.push(CSProfileHelper.create_http_post_variant(name))
                break;
            case "http_stager":
                profile.http_stager?.variants.push(CSProfileHelper.create_http_stager_variant(name))
                break;
            case "dns_beacon":
                profile.dns_beacon?.variants.push(CSProfileHelper.create_dns_beacon_variant(name))
                break;
        }
        return profile;
    }
}