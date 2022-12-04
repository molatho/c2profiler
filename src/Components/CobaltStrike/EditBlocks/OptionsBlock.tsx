import { ICSOption, ICSProfile } from "../../../Plugins/CobaltStrike/CSProfileTypes";
import IndentedAccordeon from "../../IndentedAccordeon";
import options from "../../../Plugins/CobaltStrike/options_metadata.json"
import { CSOption } from './Controls/CSOption';
import { IMetaOption } from "../../../Plugins/CobaltStrike/CSOptionsMetadataTypes";
import { useState } from "react";

interface Props {
    profile: ICSProfile;
    onProfileChanged: (profile: ICSProfile) => void;
    blockName: "global" | "code-signer" | "http-get" | "http-post" | "http-config" | "https_certificate" | "stage" | "dns_beacon" | "post_ex";
}

export const OptionsBlock = ({ profile, onProfileChanged, blockName }: Props) => {
    const _opts = options[blockName] as IMetaOption[];
    const getOption = (name: string) => profile.options.filter(o => o.name == name);
    const isEnabled = (name: string) => getOption(name).length > 0;

    const handleEnabledChange = (name: string, value: string, enabled: boolean) => {
        if (isEnabled(name)) profile.options = profile.options.filter(o => o.name != name);
        else profile.options.push({ "name": name, "value": value });
        onProfileChanged({
            ...profile,
            options: profile.options.filter(o => true)
        });
    }

    const getTitle = () => `Options ${_opts.filter(o => isEnabled(o.name)).length}/${_opts.length}`

    return <>
        <IndentedAccordeon title={getTitle()} startExpanded>
            {_opts.map((opt, idx) => <CSOption
                key={idx}
                enabled={isEnabled(opt.name)}
                name={opt.name}
                type={opt.type}
                value={isEnabled(opt.name) ? getOption(opt.name)[0].value : undefined}
                description={opt.description}
                defaultValue={opt.defaultValue}
                onEnabledChanged={handleEnabledChange}
                onValueChanged={console.log}
            />)}
        </IndentedAccordeon></>
}