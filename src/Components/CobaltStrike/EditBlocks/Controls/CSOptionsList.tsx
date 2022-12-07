import { ICSOption } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import metadata from "../../../../Plugins/CobaltStrike/metadata.json"
import { CSOption } from './CSOption';
import { IMetaOptionDefinition } from "../../../../Plugins/CobaltStrike/CSMetadataTypes";
import { TopBlockMetaName } from "../../CSProfileEdit";
import { TableContainer, Paper, Table, TableBody } from "@mui/material";
import { useState } from "react";

interface Props {
    blockOptions: ICSOption[];
    onBlockOptionsChanged: (options: ICSOption[]) => void;
    blockMetaName: TopBlockMetaName;
}

export const CSOptionsList = ({ blockOptions, onBlockOptionsChanged, blockMetaName }: Props) => {
    const _opts = metadata.options[blockMetaName] as IMetaOptionDefinition[];
    const getOption = (name: string) => blockOptions.filter(o => o.name === name);
    const isEnabled = (name: string) => getOption(name).length > 0;


    const handleEnabledChange = (name: string, value: string, enabled: boolean) => {
        if (isEnabled(name)) blockOptions = blockOptions.filter(o => o.name !== name);
        else blockOptions.push({ "name": name, "value": value });
        onBlockOptionsChanged([...blockOptions]);
    }

    const handleValueChange = (name: string, value: string) => {
        getOption(name)[0].value = value;
        onBlockOptionsChanged([...blockOptions]);
    }

    return <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table size="small" stickyHeader>
            <TableBody>
                {_opts.map((opt, idx) => <CSOption
                    key={idx}
                    enabled={isEnabled(opt.name)}
                    name={opt.name}
                    type={opt.type}
                    value={isEnabled(opt.name) ? getOption(opt.name)[0].value : undefined}
                    description={opt.description}
                    defaultValue={opt.defaultValue}
                    onEnabledChanged={handleEnabledChange}
                    onValueChanged={handleValueChange}
                />)}
            </TableBody>
        </Table>
    </TableContainer>
}