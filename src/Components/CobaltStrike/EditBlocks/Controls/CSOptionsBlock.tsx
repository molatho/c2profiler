import { ICSOption, ICSProfile } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import IndentedAccordeon from "../../../IndentedAccordeon";
import options from "../../../../Plugins/CobaltStrike/options_metadata.json"
import { CSOption } from './CSOption';
import { IMetaOption } from "../../../../Plugins/CobaltStrike/CSOptionsMetadataTypes";
import { Button, IconButton, Stack } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { TopBlockMetaName } from "../../CSProfileEdit";
import { Variants } from "../../../../Misc/Styles";

interface Props {
    titleOverride?: string;
    titleVariant?: Variants;
    blockOptions: ICSOption[];
    onBlockOptionsChanged: (options: ICSOption[]) => void;
    blockMetaName: TopBlockMetaName;
    startExpanded?: boolean;
}

export const OptionsBlock = ({ titleOverride, titleVariant, blockOptions, onBlockOptionsChanged, blockMetaName, startExpanded = true }: Props) => {
    const _opts = options[blockMetaName] as IMetaOption[];
    const getOption = (name: string) => blockOptions.filter(o => o.name === name);
    const isEnabled = (name: string) => getOption(name).length > 0;

    const handleEnabledChange = (name: string, value: string, enabled: boolean) => {
        if (isEnabled(name)) blockOptions = blockOptions.filter(o => o.name !== name);
        else blockOptions.push({ "name": name, "value": value });
        onBlockOptionsChanged([...blockOptions]);
    }

    const getTitle = () => `${titleOverride ? titleOverride : "Options"} ${_opts.filter(o => isEnabled(o.name)).length}/${_opts.length}`

    return <>
        <IndentedAccordeon title={getTitle()} titleVariant={titleVariant} startExpanded={startExpanded}>
            <>{_opts.map((opt, idx) => <CSOption
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
            </>
        </IndentedAccordeon></>
}