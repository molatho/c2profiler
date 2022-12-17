import { useState } from "react";
import { IC2ImporterProps } from "../../Misc/IC2Provider";
import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";
import { parse } from "../../Plugins/CobaltStrike/csparser"
import { Button, Grid, Typography } from "@mui/material";
import CodeMirror from '@uiw/react-codemirror';
import { PeggySyntaxError } from "../../csparser";
import { EditorView } from "@codemirror/view";
import { Diagnostic, linter } from "@codemirror/lint";
import { isFirefox } from "react-device-detect";
import { DropZone } from "../DropZone";

export const CSProfileImport = ({ onImported }: IC2ImporterProps) => {
    const [profileInput, setProfileInput] = useState<string>("");
    const [inputError, setInputError] = useState<string>("Empty profile");
    const [profileData, setProfileData] = useState<ICSProfile | null>(null);

    const onDrop = (files: File[]) => {
        if (files.length == 0) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (!e.target) return;
            const text = e.target.result as string;
            setProfileInput(text);
        };
        reader.readAsText(files[0])
    }

    const parseInput = (newInput: string): void => {
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

    const handleChange = (value: string) => {
        parseInput(value);
    }

    const csLint = (view: EditorView): Diagnostic[] => {
        try {
            parse(view.state.doc.toString())
        } catch (ex) {
            if (ex instanceof Error) {
                const _ex = ex as unknown as PeggySyntaxError;
                return [
                    {
                        from: _ex.location.start.offset,
                        to: _ex.location.end.offset,
                        message: _ex.message,
                        severity: "error"
                    }
                ]
            }
        }
        return [];
    }

    const hasError = inputError.length > 0;

    const handlePaste = async () => {
        try {
            setProfileInput(await navigator.clipboard.readText());
        } catch { return false; }
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <DropZone multiple={false} onDropAccepted={onDrop} maxFiles={1} />
            </Grid>
            <Grid item xs={12}>
                <CodeMirror
                    value={profileInput}
                    height="400px"
                    theme="dark"
                    onChange={handleChange}
                    extensions={[linter(csLint)]}
                />
            </Grid>
            {hasError && <Grid item xs={12}>
                <Typography color="error">
                    {`Error: ${inputError}`}
                </Typography>
            </Grid>}
            {!isFirefox && <Grid item>
                <Button color="primary" variant="contained" onClick={handlePaste}>Paste</Button>
            </Grid>}
            <Grid item>
                <Button color="success" disabled={hasError} variant="contained" onClick={() => onImported(profileData)}>Import</Button>
            </Grid>
        </Grid>
    );
}