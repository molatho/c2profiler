import { ICSOption } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import metadata from "../../../../Plugins/CobaltStrike/metadata.json"
import { CSOption } from './CSOption';
import { IMetaOptionDefinition, TopBlockMetaName } from "../../../../Plugins/CobaltStrike/CSMetadataTypes";
import { TableContainer, Paper, Table, TableBody } from "@mui/material";

interface Props {
    blockOptions: ICSOption[];
    onBlockOptionsChanged: (options: ICSOption[]) => void;
    blockMetaName: TopBlockMetaName;
}

export const CSOptionsList = ({ blockOptions, onBlockOptionsChanged, blockMetaName }: Props) => {
    const _opts = metadata.options[blockMetaName] as IMetaOptionDefinition[];
    const getOption = (name: string) => blockOptions.find(o => o.name === name);
    const isEnabled = (name: string) => getOption(name) !== undefined;


    const handleEnabledChange = (name: string, value: string, enabled: boolean) => {
        if (isEnabled(name)) blockOptions = blockOptions.filter(o => o.name !== name);
        else blockOptions.push({ "name": name, "value": value });
        onBlockOptionsChanged([...blockOptions]);
    }

    const handleValueChange = (name: string, value: string) => {
        var opt = getOption(name);
        if (opt) {
            opt.value = value;
            onBlockOptionsChanged([...blockOptions]);
        }
    }
    //TODO: Support custom options
    return <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table size="small" stickyHeader>
            <TableBody>
                {_opts.map((opt, idx) => <CSOption
                    key={idx}
                    meta={opt}
                    enabled={isEnabled(opt.name)}
                    value={isEnabled(opt.name) ? getOption(opt.name)?.value : undefined}
                    onEnabledChanged={handleEnabledChange}
                    onValueChanged={handleValueChange}
                />)}
            </TableBody>
        </Table>
    </TableContainer>
}