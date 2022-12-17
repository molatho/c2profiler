import { TopBlockMetaName } from "../../Components/CobaltStrike/CSProfileEdit";
import { IMetaOptionDefinition, TopBlockName } from "./CSMetadataTypes";
import { ICSBlockHttpPost, ICSBlockHttpStager, ICSBlockDnsBeacon, ICSProfile, ICSBlockHttpGet, ICSBlockTransformInformation, ICSBlockHttpsCertificate, ICSOption, ICSDataTransform, ICSHeader, ICSParameter } from "./CSProfileTypes";
import metadata from "./metadata.json"

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
            options: [],
            headers: []
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
            baseline: CSProfileHelper.create_https_certificate_variant(),
            variants: []
        }
        return profile;
    }
    static create_https_certificate_variant(name?: string): ICSBlockHttpsCertificate {
        return { options: [] }
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

    static get_option_value = (options: ICSOption[], key: string, defaultVal: string = "", metaBlock?: TopBlockMetaName): string => {
        const opt = options.find((v) => v.name == key);
        if (opt) return opt.value;
        if (metaBlock) {
            const metaBlockOptions = metadata.options[metaBlock] as IMetaOptionDefinition[];
            const metaOpt = metaBlockOptions.find((v) => v.name == key);
            if (metaOpt) return metaOpt.defaultValue;
        }
        return defaultVal;
    }

    static format_transforms = (transforms: ICSDataTransform[]) => {
        const chain = transforms.map((t) => metadata.transforms[t.type].operand ? `[${t.type}:"${t.operand}"]` : `[${t.type}]`).join(" => ");
        return `<Chain>${chain}</Chain>`
        
    }

    static format_headers = (headers?: ICSHeader[]) => (headers?.map((h) => `${h.name}: ${h.value}`) || []).join("\n");

    static urienc = (text: string) => encodeURIComponent(text)
    static encparam = (name: string, value: string) => `${CSProfileHelper.urienc(name)}=${CSProfileHelper.urienc(value)}`

    static format_parameters = (params?: ICSParameter[]) => {
        return (params?.map((p) => CSProfileHelper.encparam(p.name, p.value)) || []).join("&");
    }

    static format_http_get_req = (http_get: ICSBlockHttpGet): string[] => {

        const _verb = CSProfileHelper.get_option_value(http_get.options, "verb", "", "http_get");
        const _uris = CSProfileHelper.get_option_value(http_get.options, "uri", "", "http_get").split(" ");
        const _protocol = "HTTP/1.1";

        var _headers = CSProfileHelper.format_headers(http_get.client?.headers);
        if (http_get.client?.metadata?.termination.type == "header")
            _headers = [
                _headers,
                CSProfileHelper.format_headers([{
                    name: http_get.client?.metadata?.termination.operand as string,
                    value: CSProfileHelper.format_transforms(http_get.client.metadata.transforms)
                }])
            ].join("\n");

        var _params = CSProfileHelper.format_parameters(http_get.client?.parameters);
        if (http_get.client?.metadata?.termination.type == "parameter")
            _params = [
                _params,
                CSProfileHelper.format_parameters([{
                    name: http_get.client?.metadata?.termination.operand as string,
                    value: CSProfileHelper.format_transforms(http_get.client.metadata.transforms)
                }])
            ].join("\n");

        const build_request = (uri: string) => {
            if (_params) uri = `${uri}?${_params}`;
            const _body = http_get.client?.metadata?.termination.type == "print" ? CSProfileHelper.format_transforms(http_get.client.metadata.transforms) : "";
            return `${_verb} ${uri} ${_protocol}
${_headers}

${_body}`;
        }

        return _uris.map((u) => build_request(u));
    }
}