import { useEffect, useState } from "react";
import { IC2ImporterProps } from "../../Misc/IC2Provider";
import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";
import { parse } from "../../Plugins/CobaltStrike/csparser"
import TextField from "@mui/material/TextField";
import { Button, Grid, Typography } from "@mui/material";
import CodeMirror from '@uiw/react-codemirror';
import { PeggySyntaxError } from "../../csparser";

export const CSProfileImport = ({ onImported }: IC2ImporterProps) => {
    const [profileInput, setProfileInput] = useState<string>("");
    const [inputError, setInputError] = useState<string>("Empty profile");
    const [profileData, setProfileData] = useState<ICSProfile | null>(null);

    const parseInput = (newInput: string) => {
        setProfileInput(newInput);
        if (newInput.length > 0) {
            try {
                let result = parse(newInput);
                setProfileData(result as ICSProfile);
                setInputError("");
            } catch (ex) {
                setProfileData(null);
                if (ex instanceof Error) {
                    const _ex = ex as unknown as PeggySyntaxError;
                    setInputError(`Line ${_ex.location.start.line}, column ${_ex.location.start.column}: ${_ex.message}`);
                }
                else setInputError("Unknown error")
            }
        } else {
            setProfileData(null);
            setInputError("Empty profile");
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        parseInput(event.currentTarget.value);
    }

    const handleChange2 = (value: string) => {
        parseInput(value);
    }

    const hasError = inputError.length > 0;

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <CodeMirror
                    value={profileInput}
                    height="400px"
                    theme="dark"
                    onChange={handleChange2}
                />
            </Grid>
            {hasError && <Grid item xs={12}>
                <Typography color="error">
                    {`Error: ${inputError}`}
                </Typography>
            </Grid>}
            <Grid item>
                <Button color="success" disabled={hasError} variant="contained" onClick={() => onImported(profileData)}>Import</Button>
            </Grid>
        </Grid>
    );
}