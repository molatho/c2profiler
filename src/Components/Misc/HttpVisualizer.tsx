import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { EditorView } from "@codemirror/view";
import { http } from '@codemirror/legacy-modes/mode/http';
import { Button, ButtonGroup, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Box } from '@mui/system';

interface HttpProps {
    label: string;
    text: string;
}

export const HttpView = ({ label, text }: HttpProps) => {
    const [wrap, setWrap] = useState(true);
    const [autoSize, setAutoSize] = useState(true);

    const opts = wrap ? [StreamLanguage.define(http), EditorView.lineWrapping] : [StreamLanguage.define(http)];

    return <Grid container>
        <Grid item xs={12}>
            {/* TODO: Add buttons (e.g. toggle wrapping)*/}
            <Box component="div" sx={{ p: 2, backgroundColor: "#232323" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="h6">{label}</Typography>
                    <ButtonGroup>
                        <Button
                            variant={wrap ? "contained" : "outlined"}
                            size="small"
                            sx={{ textTransform: "none", minWidth: 0 }}
                            onClick={() => setWrap(!wrap)}
                        >Wrap</Button>
                        <Button
                            variant={autoSize ? "contained" : "outlined"}
                            size="small"
                            sx={{ textTransform: "none", minWidth: 0 }}
                            onClick={() => setAutoSize(!autoSize)}
                        >Autosize</Button>
                    </ButtonGroup>
                </Stack>
            </Box>
        </Grid>
        <Grid item xs={12}>
            <CodeMirror
                value={text}
                height={autoSize ? "auto" : "400px"}
                theme="dark"
                readOnly
                extensions={opts}
            />
        </Grid>
        <Grid item xs={12}>
            <Box component="div" sx={{ p: 1, backgroundColor: "#232323" }}>
                <Typography variant="subtitle1">Length: {text.length}</Typography>
            </Box>
        </Grid>
    </Grid>
}


interface Props {
    verb: string;
    request: string;
    response: string;
}

export const HttpVisualizer = ({ verb, request, response }: Props) => {
    return <>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <HttpView text={request} label={`${verb} Request`} />
            </Grid>
            <Grid item xs={12}>
                <HttpView text={response} label={`${verb} Response`} />
            </Grid>
        </Grid>
    </>
}