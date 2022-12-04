import { Checkbox, Stack, Tooltip, Typography } from "@mui/material";
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
    const [_value, setValue] = useState(value ? value : defaultValue);

    const getTypeView = () => {
        switch (type) {
            case "number":
                return <div>Number {name}: {_value}</div>; //TODO: Number
            case "boolean":
                return <div>Boolean {name}: {_value}</div>; //TODO: Slider
        }
        return <div>String {name}: {_value}</div>; //TODO: Text
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onEnabledChanged(name, _value, event.target.checked);
    };

    const hasDescription = () => description != undefined && description != null && description.length > 0;

    return <>
        <PaperItem small>
            <Grid container>
                <Grid item xs={3}>
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