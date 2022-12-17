import { TopBlockMetaName } from "../../Components/CobaltStrike/CSProfileEdit";
import { IMetaOptionDefinition } from "./CSMetadataTypes";
import { ICSOption, ICSDataTransform, ICSHeader, ICSParameter, ICSBlockHttpGet, ICSBlockHttpPost } from "./CSProfileTypes";
import metadata from "./metadata.json"

export class CSProfileFormatter {
    static get_option_value = (options: ICSOption[], key: string, defaultVal: string = "", metaBlock?: TopBlockMetaName): string => {
        const opt = options.find((v) => v.name == key);
        if (opt) return opt.value;
        if (metaBlock) {
            const metaBlockOptions = metadata.options[metaBlock] as IMetaOptionDefinition[];
            const metaOpt = metaBlockOptions.find((v) => v.name == key);
            if (metaOpt) return metaOpt.defaultValue;
        }
        return defaultVal;
    }

    // TODO: Implement other transforms (instead of encoding them as HTML-like tags)
    static format_transforms = (transforms: ICSDataTransform[], name: string = "data") => {
        var chain = `[${name}]`;
        for (const t of transforms) {
            switch (t.type) {
                case "append":
                    chain = `${chain}${t.operand ? t.operand : ""}`;
                    break;
                case "prepend":
                    chain = `${t.operand ? t.operand : ""}${chain}`;
                    break;
                default:
                    chain = `<dtl:${t.type}>${chain}</dtl:${t.type}>`
            }
        }
        return chain;
    }

    static format_headers = (headers?: ICSHeader[]) => (headers?.map((h) => `${h.name}: ${h.value}`) || []).join("\n");

    static urienc = (text: string) => encodeURIComponent(text)
    static encparam = (name: string, value: string) => `${this.urienc(name)}=${this.urienc(value)}`

    static format_parameters = (params?: ICSParameter[]) => {
        return (params?.map((p) => this.encparam(p.name, p.value)) || []).join("&");
    }

    static format_http_req = (verb: string, uri: string, headers: ICSHeader[], parameters: ICSParameter[], body: string, uri_append: string = "", protocol: string = "HTTP/1.1") => {
        if (body.length > 0 && !headers.find(h => h.name == "Content-Length"))
            headers.push({
                name: "Content-Length",
                value: body.length.toString()
            })

        const _headers = this.format_headers(headers);
        const _parameters = this.format_parameters(parameters);
        if (_parameters.length > 0) uri = `${uri}?${_parameters}${uri_append}`
        var request = `${verb} ${uri} ${protocol}`
        if (_headers.length > 0) request += `\n${_headers}`
        request += `\n\n${body}`;
        return request;
    }

    static format_http_res = (headers: ICSHeader[], body: string = "", statusCode: number = 200, statusMessage: string = "OK", protocol: string = "HTTP/1.1") => {
        if (body.length > 0 && !headers.find(h => h.name == "Content-Length"))
            headers.push({
                name: "Content-Length",
                value: body.length.toString()
            })

        const _headers = this.format_headers(headers);
        var request = `${protocol} ${statusCode} ${statusMessage}\n${_headers}`
        request += `\n\n${body}`;
        return request;
    }

    static copy_array = <T>(items?: T[]): T[] => {
        if (items) return [...items];
        return [];
    }

    static format_http_get_req = (http_get: ICSBlockHttpGet): string[] => {
        const _verb = this.get_option_value(http_get.options, "verb", "", "http_get");
        const _uris = this.get_option_value(http_get.options, "uri", "", "http_get").split(" ");
        const _metadata = this.format_transforms(http_get.client?.metadata?.transforms || [], "session_metadata");
        var _headers = this.copy_array(http_get.client?.headers);
        if (http_get.client?.metadata?.termination.type == "header")
            _headers.push({
                name: http_get.client?.metadata?.termination.operand as string,
                value: _metadata
            })

        var _params = this.copy_array(http_get.client?.parameters);
        if (http_get.client?.metadata?.termination.type == "parameter")
            _params.push({
                name: http_get.client?.metadata?.termination.operand as string,
                value: _metadata
            })

        const _body = http_get.client?.metadata?.termination.type == "print" ? _metadata : "";
        const _uri_append = http_get.client?.metadata?.termination.type == "uri-append"

        return _uris.map((u) => this.format_http_req(_verb, u, _headers, _params, _body, _uri_append ? _body : ""));
    }

    static format_http_get_res = (http_get: ICSBlockHttpGet): string => {
        const _verb = this.get_option_value(http_get.options, "verb", "", "http_get");
        const _output = this.format_transforms(http_get.server?.output?.transforms || [], "beacon_tasks");
        var _headers = this.copy_array(http_get.server?.headers);

        const _body = http_get.server?.output?.termination.type == "print" ? _output : "";
        return this.format_http_res(_headers, _body);
    }

    static format_http_post_req = (http_post: ICSBlockHttpPost): string[] => {
        const _verb = this.get_option_value(http_post.options, "verb", "", "http_get");
        const _uris = this.get_option_value(http_post.options, "uri", "", "http_get").split(" ");
        const _output = this.format_transforms(http_post.client?.output?.transforms || [], "beacon_response");
        const _id = this.format_transforms(http_post.client?.id?.transforms || [], "session_id");

        var _headers = this.copy_array(http_post.client?.headers);
        if (http_post.client?.output?.termination.type == "header")
            _headers.push({
                name: http_post.client?.output?.termination.operand as string,
                value: _output
            })
        if (http_post.client?.id?.termination.type == "header")
            _headers.push({
                name: http_post.client?.id?.termination.operand as string,
                value: _id
            })

        var _params = this.copy_array(http_post.client?.parameters);
        if (http_post.client?.output?.termination.type == "parameter")
            _params.push({
                name: http_post.client?.output?.termination.operand as string,
                value: _output
            })
        if (http_post.client?.id?.termination.type == "parameter")
            _params.push({
                name: http_post.client?.id?.termination.operand as string,
                value: _id
            })

        const _body =
            (http_post.client?.output?.termination.type == "print" ? _output : "") +
            (http_post.client?.id?.termination.type == "print" ? _id : "");
        const _uri_append = http_post.client?.output?.termination.type == "uri-append"

        return _uris.map((u) => this.format_http_req(_verb, u, _headers, _params, _body, _uri_append ? _body : ""));
    }

    static format_http_post_res = (http_post: ICSBlockHttpPost): string => {
        const _verb = this.get_option_value(http_post.options, "verb", "", "http_get");
        const _output = this.format_transforms(http_post.server?.output?.transforms || [], "empty");
        var _headers = this.copy_array(http_post.server?.headers);

        const _body = http_post.server?.output?.termination.type == "print" ? _output : "";
        return this.format_http_res(_headers, _body);
    }
}