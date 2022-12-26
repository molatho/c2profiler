import { Autocomplete, Checkbox, Stack, Switch, TableCell, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { unique } from "../../../../Misc/Utilities";
import { IMetaOptionDefinition } from "../../../../Plugins/CobaltStrike/CSMetadataTypes";
import { CodeTextField } from "../../../CodeTextField";
import { ListInput } from "../../../Misc/ListInput";
import { SupportIconTooltip } from "../../../SupportIconTooltip";
import GppMaybeIcon from '@mui/icons-material/GppMaybe';

interface Props {
    enabled: boolean;
    value?: string;
    meta: IMetaOptionDefinition;
    onEnabledChanged: (name: string, value: string, enabled: boolean) => void;
    onValueChanged: (name: string, value: string) => void;
}


export const CSOption = ({ enabled, value, meta, onEnabledChanged, onValueChanged }: Props) => {
    const _value = value !== undefined ? value : meta.defaultValue;
    const _delimiter = meta.listDelimiter ? meta.listDelimiter : ",";

    const getTypeView = () => {
        switch (meta.type) {
            case "number":
                return <CodeTextField
                    type="number"
                    value={parseInt(value ? value : "0") | 0}
                    onChange={(ev) => onValueChanged(meta.name, ev.target.value.toString())}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                    fullWidth
                    disabled={!enabled}
                    error={_value.length == 0}
                />;
            case "boolean":
                return <Stack direction="row" alignItems="center" spacing={2}>
                    <Switch
                        checked={value === "true"}
                        onChange={(ev) => onValueChanged(meta.name, ev.target.checked ? "true" : "false")}
                        disabled={!enabled}
                    />
                    <Typography>{value === "true" ? "True" : "False"}</Typography>
                </Stack>;
            case "option":
                return <Autocomplete
                    freeSolo
                    autoSelect
                    value={_value}
                    onChange={(_, newValue) => newValue && onValueChanged(meta.name, newValue as string)}
                    options={unique((meta.options ? meta.options : []).concat([_value]))}
                    size="small"
                    disabled={!enabled}
                    renderInput={(params) => <TextField {...params} error={_value.length == 0} />}
                />
            case "list":
                return <ListInput
                    values={_value.split(_delimiter).map(v => v.trim()).filter(v => v.length > 0)}
                    setValues={(v) => { console.log("setValues", v); onValueChanged(meta.name, v.join(_delimiter)) }}
                    delimiter={_delimiter}
                />
        }
        return <CodeTextField
            value={_value}
            onChange={(ev) => onValueChanged(meta.name, ev.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
            size="small"
            fullWidth
            disabled={!enabled}
            error={_value.length == 0}
        />;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onEnabledChanged(meta.name, _value, event.target.checked);
    };

    return <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell padding="checkbox">
            <Checkbox checked={enabled} onChange={handleChange} disabled={meta.required && enabled} />
        </TableCell>
        <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>{meta.name}{meta.required && <span style={{ color: "#f44336" }}>*</span>}</Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    {(meta.description || meta.link) && <SupportIconTooltip description={meta.description} link={meta.link} />}
                    {meta.opsec && <Tooltip title="OPSEC"><GppMaybeIcon fontSize="small" color="warning" /></Tooltip>}
                </Stack>
            </Stack>
        </TableCell>
        <TableCell sx={{ width: "70%" }}> {getTypeView()}</TableCell>
    </TableRow>;
}