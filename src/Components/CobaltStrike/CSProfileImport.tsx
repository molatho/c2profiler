import { useEffect, useState } from "react";
import { IC2ImporterProps } from "../../Misc/IC2Provider";
import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";
import { parse } from "../../Plugins/CobaltStrike/csparser"
import TextField from "@mui/material/TextField";
import { Button, Grid } from "@mui/material";

export const CSProfileImport = ({ onImported }: IC2ImporterProps) => {
    const [profileInput, setProfileInput] = useState<string>("");
    const [inputError, setInputError] = useState<string>("Enter profile");
    const [profileData, setProfileData] = useState<ICSProfile | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProfileInput(event.currentTarget.value);
        try {
            let result = parse(event.currentTarget.value);
            setProfileData(result as ICSProfile);
            setInputError("");
        } catch (ex) {
            setProfileData(null);
            if (ex instanceof Error) setInputError(ex.message);
            else setInputError("Unknown error")
        }
    }

    const hasError = () => inputError.length > 0;

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <TextField
                    id="outlined-multiline-static"
                    label="C2 profile"
                    multiline
                    rows={10}
                    value={profileInput}
                    error={hasError()}
                    helperText={inputError}
                    onChange={handleChange}
                    fullWidth
                />
            </Grid>
            <Grid item>
                <Button color="success" disabled={hasError()} variant="contained" onClick={() => onImported(profileData)}>Import</Button>
            </Grid>
        </Grid>
    );
}