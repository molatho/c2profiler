import { Grid } from "@mui/material"
import { useState } from "react";
import { parse } from "../../../../Plugins/HTTP/httpparser";
import { IHttpRequest, IHttpResponse, ParseResult as IParseResult } from "../../../../Plugins/HTTP/HttpTypes";
import { HttpView } from "../../../Misc/HttpView"

interface Props {
    onValidate: (request: IHttpRequest, response: IHttpResponse) => void
    onInvalidate: () => void
}

export const CSHttpImport = ({ onValidate, onInvalidate }: Props) => {
    const [request, setRequest] = useState("");
    const [response, setResponse] = useState("");

    const parseRequest = (input?: string) => {
        try {
            const result = parse(input || request) as IParseResult;
            if (result.type == "request") return result.result as IHttpRequest;
        } catch (err: any) { }
    }

    const parseResponse = (input?: string) => {
        try {
            const result = parse(input || request) as IParseResult;
            if (result.type == "response") return result.result as IHttpResponse
        } catch (err: any) { }
    }

    const updateRequest = (text: string) => {
        setRequest(text);
        const [req, res] = [parseRequest(text), parseResponse()];
        if (req && res) onValidate(req, res);
        else onInvalidate();
    }

    const updateResponse = (text: string) => {
        setResponse(text);
        const [req, res] = [parseRequest(), parseResponse(text)];
        if (req && res) onValidate(req, res);
        else onInvalidate();
    }

    return <Grid container spacing={2}>
        <Grid item xs={12}>
            <HttpView label="Request" text={request} onTextChanged={updateRequest} />
        </Grid>
        <Grid item xs={12}>
            <HttpView label="Response" text={response} onTextChanged={updateResponse} />
        </Grid>
    </Grid>
}