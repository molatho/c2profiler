import { Button, Grid } from "@mui/material";
import { useState } from "react";
import { IC2ImporterProps } from "../../Misc/IC2Provider";
import { CSProfileHelper } from "../../Plugins/CobaltStrike/CSProfileHelper";
import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";
import { IHttpRequest, IHttpResponse } from "../../Plugins/HTTP/HttpTypes";
import { BaseBlock } from "../BaseBlock";
import { CSHttpImport } from "./EditBlocks/Controls/CSHttpImport";

export const CSProfileCreateFromHttp = ({ onImported }: IC2ImporterProps) => {
    const [csprofile, setCsProfile] = useState({ options: [] } as unknown as ICSProfile);

    const clearHttpGet = () => {
        csprofile.http_get = null;
        setCsProfile({ ...csprofile });
    }
    const setHttpGet = (request: IHttpRequest, response: IHttpResponse) => {
        CSProfileHelper.create_http_get(csprofile);
        if (!csprofile.http_get) return;
        csprofile.http_get.baseline.options = [
            { name: "uri", value: request.path.uri },
            { name: "verb", value: request.verb }
        ]
        csprofile.http_get.baseline.client = {
            headers: request.headers.map(h => { return { name: h.key, value: h.value || "" } }) || [],
            parameters: request.path.parameters.map(p => { return { name: p.name, value: p.value || "" } }) || []
        }
        csprofile.http_get.baseline.server = {
            headers: response.headers.map(h => { return { name: h.key, value: h.value || "" } }) || []
        }
        setCsProfile({ ...csprofile });
    }

    const clearHttpPost = () => {
        csprofile.http_post = null;
        setCsProfile({ ...csprofile });
    }
    const setHttpPost = (request: IHttpRequest, response: IHttpResponse) => {
        CSProfileHelper.create_http_post(csprofile);
        if (!csprofile.http_post) return;
        csprofile.http_post.baseline.options = [
            { name: "uri", value: request.path.uri },
            { name: "verb", value: request.verb }
        ]
        csprofile.http_post.baseline.client = {
            headers: request.headers.map(h => { return { name: h.key, value: h.value || "" } }) || [],
            parameters: request.path.parameters.map(p => { return { name: p.name, value: p.value || "" } }) || []
        }
        csprofile.http_post.baseline.server = {
            headers: response.headers.map(h => { return { name: h.key, value: h.value || "" } }) || []
        }
        setCsProfile({ ...csprofile });
    }

    return <>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <BaseBlock title="HTTP Get" keepChildren>
                    <CSHttpImport onInvalidate={clearHttpGet} onValidate={setHttpGet} />
                </BaseBlock>
            </Grid>
            <Grid item xs={12}>
                <BaseBlock title="HTTP Post" keepChildren>
                    <CSHttpImport onInvalidate={clearHttpPost} onValidate={setHttpPost} />
                </BaseBlock>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="success" disabled={csprofile.http_get == null && csprofile.http_post == null} onClick={() => onImported(csprofile)}>Create!</Button>
            </Grid>
        </Grid>
    </>
}