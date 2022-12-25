import { ValidationMessage } from "../../Misc/IC2Provider";
import { IMetaOptionDefinition, TopBlockMetaName } from "./CSMetadataTypes";
import { ICSHasOptions, ICSHasVariant, ICSOption, ICSProfile, ICSVariantContainer } from "./CSProfileTypes";
import metadata from "./metadata.json"

const ValidateOptions = (block: TopBlockMetaName, metas: IMetaOptionDefinition[], container: ICSHasOptions, variant?: string): ValidationMessage[] => {
    const missing = metas
        .filter(m => m.required && !container.options.find(o => o.name === m.name));
    
    const opsec_default = metas
        .filter(m => m.opsec)
        .map(m => { return { meta: m, option: container.options.find(o => o.name === m.name) } })
        .filter(mopt => mopt.option)
        .map(mopt => { return { meta: mopt.meta, option: mopt.option as ICSOption } })
        .filter(mopt => mopt.option.value == mopt.meta.defaultValue)
        .map(mopt => mopt.meta);

    const opsec_missing = metas
        .filter(m => m.opsec)
        .map(m => { return { meta: m, option: container.options.find(o => o.name === m.name) } })
        .filter(mopt => !mopt.option)
        .map(mopt => mopt.meta);
    
    const empty = container.options
        .filter(o => o.value.length == 0)
        .map(o => metas.find(m => m.name == o.name))
        .filter(m => m)
        .map(m => m as IMetaOptionDefinition);
    
    const format_message = (message: string) => variant ? `[Variant "${variant}"] ${message}` : message;

    const empty_msg: ValidationMessage | null = empty.length > 0
        ? {
            block: block,
            level: "warning",
            message: format_message("Contains options with empty values:"),
            items: empty.map(m => m.name)
        }
        : null;

    const missing_msg: ValidationMessage | null = missing.length > 0
        ? {
            block: block,
            level: "error",
            message: format_message("Missing the required options:"),
            items: missing.map(m => m.name)
        }
        : null;

    const opsec_default_msg: ValidationMessage | null = opsec_default.length > 0
        ? {
            block: block,
            level: "warning",
            message: format_message("Contains options with opsec unsafe default values:"),
            items: opsec_default.map(m => m.name)
        }
        : null;

    const opsec_missing_msg: ValidationMessage | null = opsec_missing.length > 0
        ? {
            block: block,
            level: "warning",
            message: format_message("Contains unset opsec-relevant options:"),
            items: opsec_missing.map(m => m.name)
        }
        : null;

    return [
        empty_msg,
        missing_msg,
        opsec_default_msg,
        opsec_missing_msg
    ]
        .filter(m => m)
        .map(m => m as ValidationMessage);
}

const ValidateVariantOptions = <T extends ICSHasVariant & ICSHasOptions>(block: TopBlockMetaName, metas: IMetaOptionDefinition[], container: ICSVariantContainer<T>): ValidationMessage[] => {
    const objects = [container.baseline, ...container.variants];
    return objects.map(o => ValidateOptions(block, metas, o, o.variant)).flat(1);
}

const ValidateOpSecOps = (csprofile: ICSProfile): ValidationMessage[] => {
    const global = ValidateOptions("global", metadata.options.global as IMetaOptionDefinition[], csprofile);
    const http_get = csprofile.http_get
        ? ValidateVariantOptions("http_get", metadata.options.http_get as IMetaOptionDefinition[], csprofile.http_get)
        : [];
    const http_post = csprofile.http_post
        ? ValidateVariantOptions("http_post", metadata.options.http_post as IMetaOptionDefinition[], csprofile.http_post)
        : [];

    return global
        .concat(http_get)
        .concat(http_post);
}

export const CSValidate = (profile: any): ValidationMessage[] => {
    const csprofile = profile as ICSProfile;

    return [
        ...ValidateOpSecOps(csprofile)
    ];
}