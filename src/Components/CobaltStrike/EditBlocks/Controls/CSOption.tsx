import { Checkbox, Stack, Switch, TextField, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { ICSProfile } from "../../../../Plugins/CobaltStrike/CSProfileTypes"
import { PaperItem } from "../../../PaperItems/PaperItem";
import InfoIcon from '@mui/icons-material/Info';

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
                    disabled={!enabled}
                />;
            case "boolean":
                return <Switch
                    checked={value == "true"}
                    onChange={(ev) => onValueChanged(name, ev.target.checked ? "true" : "false")}
                    disabled={!enabled}
                />;
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

    const hasDescription = () => description != undefined && description != null && description.length > 0;

    return <>
        <PaperItem small>
            <Grid container>
                <Grid item xs={4}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Checkbox checked={enabled} onChange={handleChange} />
                        <Typography>{name}</Typography>
                        {hasDescription() &&
                            <Tooltip title={description}>
                                <InfoIcon />
                            </Tooltip>}
                    </Stack>
                </Grid>
                <Grid item xs={8}>
                    {getTypeView()}
                </Grid>
            </Grid>
        </PaperItem></>
        ;
}