import { Button } from "@mui/material";
import { useState } from "react";
import { IC2ImporterProps } from "../../Misc/IC2Provider";
import { CSProfileHelper } from "../../Plugins/CobaltStrike/CSProfileHelper";
import { IHttpRequest, IHttpResponse } from "../../Plugins/HTTP/HttpTypes";
import { BaseBlock } from "../BaseBlock";
import { CSHttpImport } from "./EditBlocks/Controls/CSHttpImport";

export const CSProfileCreateFromHttp = ({ onImported }: IC2ImporterProps) => {
    const [csprofile, setCsProfile] = useState(CSProfileHelper.create_empty_profile());

    const clearHttpGet = () => {
        csprofile.http_get = null;
        setCsProfile({ ...csprofile });
    }
    const setHttpGet = (request: IHttpRequest, response: IHttpResponse) => {
        console.log(request)
        console.log(response)
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
        console.log(csprofile);
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
            headers: request.headers?.map(h => { return { name: h.key, value: h.value || "" } }) || [],
            parameters: request.path.parameters.map(p => { return { name: p.name, value: p.value || "" } }) || []
        }
        csprofile.http_post.baseline.server = {
            headers: response.headers?.map(h => { return { name: h.key, value: h.value || "" } }) || []
        }
        console.log(csprofile);
    }

    return <>
        <BaseBlock title="HTTP Get" keepChildren>
            <CSHttpImport onInvalidate={clearHttpGet} onValidate={setHttpGet} />
        </BaseBlock>
        <BaseBlock title="HTTP Post" keepChildren>
            <CSHttpImport onInvalidate={clearHttpPost} onValidate={setHttpPost} />
        </BaseBlock>
    </>
}