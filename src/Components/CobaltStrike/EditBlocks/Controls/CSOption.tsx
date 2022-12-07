import { Checkbox, Stack, Switch, TableCell, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { SupportIconTooltip } from "../../../SupportIconTooltip";

interface Props {
    enabled: boolean;
    name: string;
    value?: string;
    defaultValue: string;
    description?: string;
    type: "string" | "number" | "boolean";
    onEnabledChanged: (name: string, value: string, enabled: boolean) => void;
    onValueChanged: (name: string, value: string) => void;
}

export const CSOption = ({ enabled, name, value, defaultValue, description, type, onEnabledChanged, onValueChanged }: Props) => {
    const getTypeView = () => {
        switch (type) {
            case "number":
                return <TextField
                    type="number"
                    value={parseInt(value ? value : "0") | 0}
                    onChange={(ev) => onValueChanged(name, ev.target.value.toString())}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                    fullWidth
                    disabled={!enabled}
                />;
            case "boolean":
                return <Stack direction="row" alignItems="center" spacing={2}>
                    <Switch
                        checked={value == "true"}
                        onChange={(ev) => onValueChanged(name, ev.target.checked ? "true" : "false")}
                        disabled={!enabled}
                    />
                    <Typography>{value == "true" ? "True" : "False"}</Typography>
                </Stack>;
        }
        return <TextField
            value={value ? value : defaultValue}
            onChange={(ev) => onValueChanged(name, ev.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
            size="small"
            fullWidth
            disabled={!enabled}
        />;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onEnabledChanged(name, value ? value : defaultValue, event.target.checked);
    };

    return <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell padding="checkbox"> <Checkbox checked={enabled} onChange={handleChange} /></TableCell>
        <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>{name}</Typography>
                {description && <SupportIconTooltip description={description} />}
            </Stack>
        </TableCell>
        <TableCell> {getTypeView()}</TableCell>
    </TableRow>;
}