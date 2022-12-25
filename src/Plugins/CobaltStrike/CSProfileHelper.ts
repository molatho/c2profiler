import { IMetaOptionDefinition, TopBlockName, TopBlockNames } from "./CSMetadataTypes";
import { ICSBlockHttpPost, ICSBlockHttpStager, ICSBlockDnsBeacon, ICSProfile, ICSBlockHttpGet, ICSBlockTransformInformation, ICSBlockHttpsCertificate, ICSOption } from "./CSProfileTypes";
import metadata from './metadata.json'

export class CSProfileHelper {
    static create_required_options(blockName: TopBlockName): ICSOption[] {
        const options = metadata.options[blockName] as IMetaOptionDefinition[];
        return options.filter(o => o.required).map(o => { return { name: o.name, value: o.defaultValue } });
    }
    static create_http_post_variant(name?: string): ICSBlockHttpPost {
        return {
            options: this.create_required_options("http_post"),
            variant: name
        };
    }
    static create_http_stager_variant(name?: string): ICSBlockHttpStager {
        return {
            options: this.create_required_options("http_stager"),
            variant: name
        }
    }
    static create_dns_beacon_variant(name?: string): ICSBlockDnsBeacon {
        return {
            options: this.create_required_options("dns_beacon"),
            variant: name
        }
    }
    static create_http_config(profile: ICSProfile): ICSProfile {
        profile.http_config = {
            options: this.create_required_options("http_config"),
            headers: []
        }
        return profile;
    }
    static create_post_ex(profile: ICSProfile): ICSProfile {
        profile.post_ex = {
            options: this.create_required_options("post_ex")
        }
        return profile;
    }
    static create_code_signer(profile: ICSProfile): ICSProfile {
        profile.code_signer = {
            options: this.create_required_options("code_signer")
        }
        return profile;
    }
    static create_process_inject(profile: ICSProfile): ICSProfile {
        profile.process_inject = {
            options: this.create_required_options("process_inject")
        }
        return profile;
    }
    static create_dns_beacon(profile: ICSProfile): ICSProfile {
        profile.dns_beacon = {
            baseline: this.create_dns_beacon_variant(),
            variants: []
        }
        return profile;
    }
    static create_stage(profile: ICSProfile): ICSProfile {
        profile.stage = {
            commands: [],
            options: this.create_required_options("stage")
        }
        return profile;
    }
    static create_https_certificate(profile: ICSProfile): ICSProfile {
        profile.https_certificate = {
            baseline: this.create_https_certificate_variant(),
            variants: []
        }
        return profile;
    }
    static create_https_certificate_variant(name?: string): ICSBlockHttpsCertificate {
        return { options: this.create_required_options("https_certificate") }
    }
    static create_http_stager(profile: ICSProfile): ICSProfile {
        profile.http_stager = {
            baseline: this.create_http_stager_variant(),
            variants: []
        }
        return profile;
    }
    static create_http_get = (profile: ICSProfile): ICSProfile => {
        profile.http_get = {
            baseline: this.create_http_get_variant(),
            variants: []
        }
        return profile;
    }
    static create_http_get_variant = (name?: string): ICSBlockHttpGet => {
        return {
            options: this.create_required_options("http_get"),
            variant: name
        }
    }

    static create_http_post(profile: ICSProfile): ICSProfile {
        profile.http_post = {
            baseline: this.create_http_post_variant(),
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
                return this.create_http_get(profile);
            case "http_post":
                return this.create_http_post(profile);
            case "http_config":
                return this.create_http_config(profile);
            case "http_stager":
                return this.create_http_stager(profile);
            case "https_certificate":
                return this.create_https_certificate(profile);
            case "stage":
                return this.create_stage(profile);
            case "dns_beacon":
                return this.create_dns_beacon(profile);
            case "post_ex":
                return this.create_post_ex(profile);
            case "code_signer":
                return this.create_code_signer(profile);
            case "process_inject":
                return this.create_process_inject(profile);
        }
        return profile;
    }

    static create_empty_profile = (): ICSProfile => {
        var csprofile = {} as unknown as ICSProfile;
        for (const name of TopBlockNames)
            this.create_top_block(csprofile, name);
        csprofile.options = [];
        return csprofile;
    }

    static create_variant = (profile: ICSProfile, blockName: "http_get" | "http_post" | "http_stager" | "http_config" | "dns_beacon", name: string): ICSProfile => {
        switch (blockName) {
            case "http_get":
                profile.http_get?.variants.push(this.create_http_get_variant(name))
                break;
            case "http_post":
                profile.http_post?.variants.push(this.create_http_post_variant(name))
                break;
            case "http_stager":
                profile.http_stager?.variants.push(this.create_http_stager_variant(name))
                break;
            case "dns_beacon":
                profile.dns_beacon?.variants.push(this.create_dns_beacon_variant(name))
                break;
        }
        return profile;
    }
}