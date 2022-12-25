import { sortStr } from "../../Misc/Utilities";
import { IMetaOptionDefinition, TopBlockMetaName } from "./CSMetadataTypes";
import { ICSOption, ICSDataTransform, ICSHeader, ICSParameter, ICSBlockHttpGet, ICSBlockHttpPost, ICSProfile, ICSHasVariant, ICSBlockHttpGetClient, ICSBlockHttpGetServer, ICSBlockHttpPostClient, ICSBlockHttpPostServer, ICSBlockTransformInformation, ICSHasOptions, ICSBlockHttpsCertificate, ICSBlockHttpConfig, ICSBlockHttpStager, ICSBlockHttpStagerClient, ICSBlockHttpStagerServer, ICSBlockStage, ICSPayloadCommand, ICSPayloadTransform, ICSBlockDnsBeacon, ICSBlockPostEx, ICSBlockProcessInject, ICSProcessInjectExecute } from "./CSProfileTypes";
import metadata from "./metadata.json"

export class CSProfileToHttpFormatter {
    static get_option_value = (options: ICSOption[], key: string, defaultVal: string = "", metaBlock?: TopBlockMetaName): string => {
        const opt = options.find((v) => v.name === key);
        if (opt) return opt.value;
        if (metaBlock) {
            const metaBlockOptions = metadata.options[metaBlock] as IMetaOptionDefinition[];
            const metaOpt = metaBlockOptions.find((v) => v.name === key);
            if (metaOpt) return metaOpt.defaultValue;
        }
        return defaultVal;
    }

    static decode_string = (input: string): string => {
        const h2s = (hex: string) => String.fromCharCode(parseInt(hex.substring(2), 16))

        input = input.replaceAll(/\\x[0-9A-Za-z]{1,2}/g, h2s)
        input = input.replaceAll(/\\n/g, "\n")
        input = input.replaceAll(/\\t/g, "\t")
        return input;
    }

    // TODO: Implement other transforms (instead of encoding them as HTML-like tags)
    static format_transforms = (transforms: ICSDataTransform[], name: string = "data") => {
        var chain = `[${name}]`;
        for (const t of transforms) {
            switch (t.type) {
                case "append":
                    chain = `${chain}${t.operand ? this.decode_string(t.operand) : ""}`;
                    break;
                case "prepend":
                    chain = `${t.operand ? this.decode_string(t.operand) : ""}${chain}`;
                    break;
                case "base64":
                    chain = btoa(chain)
                    break;
                case "base64url":
                    chain = encodeURI(btoa(chain));
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
        if (body.length > 0 && !headers.find(h => h.name === "Content-Length"))
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
        if (body.length > 0 && !headers.find(h => h.name === "Content-Length"))
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
        if (http_get.client?.metadata?.termination.type === "header")
            _headers.push({
                name: http_get.client?.metadata?.termination.operand as string,
                value: _metadata
            })

        var _params = this.copy_array(http_get.client?.parameters);
        if (http_get.client?.metadata?.termination.type === "parameter")
            _params.push({
                name: http_get.client?.metadata?.termination.operand as string,
                value: _metadata
            })

        const _body = http_get.client?.metadata?.termination.type === "print" ? _metadata : "";
        const _uri_append = http_get.client?.metadata?.termination.type === "uri-append"

        return _uris.map((u) => this.format_http_req(_verb, u, _headers, _params, _body, _uri_append ? _body : ""));
    }

    static format_http_get_res = (http_get: ICSBlockHttpGet): string => {
        const _output = this.format_transforms(http_get.server?.output?.transforms || [], "beacon_tasks");
        var _headers = this.copy_array(http_get.server?.headers);

        const _body = http_get.server?.output?.termination.type === "print" ? _output : "";
        return this.format_http_res(_headers, _body);
    }

    static format_http_post_req = (http_post: ICSBlockHttpPost): string[] => {
        const _verb = this.get_option_value(http_post.options, "verb", "", "http_get");
        const _uris = this.get_option_value(http_post.options, "uri", "", "http_get").split(" ");
        const _output = this.format_transforms(http_post.client?.output?.transforms || [], "beacon_response");
        const _id = this.format_transforms(http_post.client?.id?.transforms || [], "session_id");

        var _headers = this.copy_array(http_post.client?.headers);
        if (http_post.client?.output?.termination.type === "header")
            _headers.push({
                name: http_post.client?.output?.termination.operand as string,
                value: _output
            })
        if (http_post.client?.id?.termination.type === "header")
            _headers.push({
                name: http_post.client?.id?.termination.operand as string,
                value: _id
            })

        var _params = this.copy_array(http_post.client?.parameters);
        if (http_post.client?.output?.termination.type === "parameter")
            _params.push({
                name: http_post.client?.output?.termination.operand as string,
                value: _output
            })
        if (http_post.client?.id?.termination.type === "parameter")
            _params.push({
                name: http_post.client?.id?.termination.operand as string,
                value: _id
            })

        const _body =
            (http_post.client?.output?.termination.type === "print" ? _output : "") +
            (http_post.client?.id?.termination.type === "print" ? _id : "");
        const _uri_append = http_post.client?.output?.termination.type === "uri-append"

        return _uris.map((u) => this.format_http_req(_verb, u, _headers, _params, _body, _uri_append ? _body : ""));
    }

    static format_http_post_res = (http_post: ICSBlockHttpPost): string => {
        const _output = this.format_transforms(http_post.server?.output?.transforms || [], "empty");
        var _headers = this.copy_array(http_post.server?.headers);

        const _body = http_post.server?.output?.termination.type === "print" ? _output : "";
        return this.format_http_res(_headers, _body);
    }
}

export class CSProfileToCSFormatter {
    static format_out_profile = (profile: ICSProfile): string => {
        var _header = `# Created using c2profiler, ${new Date().toLocaleString()}`;

        const options = profile.options
            ? profile.options.sort((a, b) => sortStr(a.name, b.name)).map(o => this.format_out_option("", o)).join("\n")
            : "";
        const http_get = profile.http_get
            ? [
                this.format_out_http_get(profile.http_get.baseline),
                ...profile.http_get.variants.map(v => this.format_out_http_get(v))
            ].join("\n\n")
            : "";
        const http_stager = profile.http_stager
            ? [
                this.format_out_http_stager(profile.http_stager.baseline),
                ...profile.http_stager.variants.map(v => this.format_out_http_stager(v))
            ].join("\n\n")
            : "";
        const http_post = profile.http_post
            ? [
                this.format_out_http_post(profile.http_post.baseline),
                ...profile.http_post.variants.map(v => this.format_out_http_post(v))
            ].join("\n\n")
            : "";
        const code_signer = profile.code_signer
            ? this.format_out_options_block("", "code-signer", profile.code_signer)
            : "";
        const http_config = profile.http_config
            ? this.format_out_http_config(profile.http_config)
            : "";
        const https_certificate = profile.https_certificate
            ? [
                this.format_out_https_certificate(profile.https_certificate.baseline),
                ...profile.https_certificate.variants.map(v => this.format_out_https_certificate(v))
            ].join("\n\n")
            : "";
        const stage = profile.stage
            ? this.format_out_stage(profile.stage)
            : "";
        const dns_beacon = profile.dns_beacon
            ? [
                this.format_out_dns_beacon(profile.dns_beacon.baseline),
                ...profile.dns_beacon.variants.map(v => this.format_out_dns_beacon(v))
            ].join("\n\n")
            : "";
        const post_ex = profile.post_ex
            ? this.format_out_post_ex(profile.post_ex)
            : "";
        const process_inject = profile.process_inject
            ? this.format_out_process_inject(profile.process_inject)
            : "";

        return [
            _header,
            options,
            code_signer,
            http_get,
            http_post,
            http_config,
            http_stager,
            https_certificate,
            stage,
            dns_beacon,
            post_ex,
            process_inject
        ].filter(f => f.length > 0).join("\n\n");
    }

    static format_out_empty = (prefix: string, body: string, suffix: string): string => {
        if (body.length == 0) return "";
        return [prefix, body.trimEnd(), suffix].join("\n");
    }

    static format_out_options_block = (indent: string, blockName: string, block: ICSHasOptions): string => {
        const options = block.options.sort((a, b) => sortStr(a.name, b.name)).map(o => this.format_out_option("  ", o)).join("\n");
        return this.format_out_empty(`${indent}${blockName} {`, options, `${indent}}`);
    }

    static format_out_process_inject = (process_inject: ICSBlockProcessInject): string => {
        const options = process_inject.options.sort((a, b) => sortStr(a.name, b.name)).map(o => this.format_out_option("  ", o)).join("\n");
        const execute = process_inject.execute && process_inject.execute.commands.length > 0
            ? this.format_out_process_inject_execute("  ", process_inject.execute)
            : "";
        const transformx86 = process_inject["transform-x86"] ? this.format_out_payload_transform("  ", process_inject["transform-x86"]) : "";
        const transformx64 = process_inject["transform-x64"] ? this.format_out_payload_transform("  ", process_inject["transform-x64"]) : "";

        return this.format_out_empty(
            "process-inject {",
            [options, transformx86, transformx64, execute].filter(f => f.length > 0).join("\n\n"),
            "}"
        );
    }

    static format_out_process_inject_execute = (indent: string, execute: ICSProcessInjectExecute): string => {
        const commands = execute.commands.map(o => o.operand
            ? `${indent}  ${o.type} "${o.operand}";`
            : `${indent}  ${o.type};`
        ).join("\n");

        return this.format_out_empty(
            `${indent}execute {`,
            [commands].filter(f => f.length > 0).join("\n\n"),
            `${indent}}`
        );
    }

    static format_out_post_ex = (post_ex: ICSBlockPostEx): string => {
        const options = post_ex.options.sort((a, b) => sortStr(a.name, b.name)).map(o => this.format_out_option("  ", o)).join("\n");

        return this.format_out_empty(
            "post-ex {",
            [options].filter(f => f.length > 0).join("\n\n"),
            "}"
        );
    }

    static annotate_block = (annotation: string, block: string): string => {
        return block.length > 0
            ? `# ${annotation}\n${block}`
            : block;
    }

    static format_out_stage = (stage: ICSBlockStage): string => {
        const options = stage.options.sort((a, b) => sortStr(a.name, b.name)).map(o => this.format_out_option("  ", o)).join("\n");
        const commands = stage.commands.map(c => this.format_out_command("  ", c)).join("\n");
        const transformx86 = stage["transform-x86"] ? this.format_out_payload_transform("  ", stage["transform-x86"]) : "";
        const transformx64 = stage["transform-x64"] ? this.format_out_payload_transform("  ", stage["transform-x64"]) : "";

        return this.format_out_empty(
            "stage {",
            [options, transformx86, transformx64, commands].filter(f => f.length > 0).join("\n\n"),
            "}"
        )
    }

    static format_out_http_config = (config: ICSBlockHttpConfig): string => {
        const options = config.options.sort((a, b) => sortStr(a.name, b.name)).map(o => this.format_out_option("  ", o)).join("\n");
        const headers = config.headers.map(h => this.format_out_header("  ", h)).join("\n");

        return this.format_out_empty(
            "http-config {",
            [options, headers].filter(f => f.length > 0).join("\n\n"),
            "}"
        )
    }

    static format_out_http_stager_client = (indent: string, client: ICSBlockHttpStagerClient): string => {
        const params = client.parameters.map(p => this.format_out_parameter(indent + "  ", p)).join("\n");
        const headers = client.headers.map(h => this.format_out_header(indent + "  ", h)).join("\n");

        return this.format_out_empty(
            `${indent}client {`,
            [params, headers].filter(f => f.length > 0).join("\n\n"),
            `${indent}}`
        )
    }

    static format_out_http_stager_server = (indent: string, server: ICSBlockHttpStagerServer): string => {
        const headers = server.headers.map(h => this.format_out_header(indent + "  ", h)).join("\n");
        const output = server.output
            ? this.format_out_block_transform_information(indent + "  ", "output", server.output)
            : "";

        return this.format_out_empty(
            `${indent}server {`,
            [headers, output].filter(f => f.length > 0).join("\n\n"),
            `${indent}}`
        )
    }

    static format_out_http_stager = (stager: ICSBlockHttpStager): string => {
        const options = stager.options.sort((a, b) => sortStr(a.name, b.name)).map(o => this.format_out_option("  ", o)).join("\n");
        const client = stager.client
            ? this.format_out_http_stager_client("  ", stager.client)
            : ""
        const server = stager.server
            ? this.format_out_http_stager_server("  ", stager.server)
            : ""

        return this.format_out_empty(
            `${this.format_out_variant("http-stager", stager)} {`,
            [options, client, server].filter(f => f.length > 0).join("\n\n"),
            "}"
        )
    }

    static format_out_payload_transform = (indent: string, transform: ICSPayloadTransform): string => {
        const operations = transform.operations.map(o => o.operand2
            ? `${indent}  ${o.type} "${o.operand1}" "${o.operand2}";`
            : `${indent}  ${o.type} "${o.operand1}";`);

        return this.format_out_empty(
            `${indent}${transform.type} {`,
            operations.filter(f => f.length > 0).join("\n\n"),
            `${indent}}`
        )
    }

    static format_out_command = (indent: string, command: ICSPayloadCommand): string => `${indent}${command.type} "${command.operand}";`;

    static format_out_option = (indent: string, option: ICSOption): string => `${indent}set ${option.name} "${option.value}";`;

    static format_out_header = (indent: string, header: ICSHeader): string => `${indent}header "${header.name}" "${header.value}";`;

    static format_out_parameter = (indent: string, param: ICSParameter): string => `${indent}parameter "${param.name}" "${param.value}";`;

    static format_out_variant = (name: string, variant: ICSHasVariant): string => variant.variant ? `${name} "${variant.variant}"` : name;

    static format_out_block_transform_information = (indent: string, name: string, blockTransform: ICSBlockTransformInformation): string => {
        const transforms = blockTransform.transforms
            .map(t => t.operand ? `${indent}  ${t.type} "${t.operand}";` : `${indent}  ${t.type};`)
            .join("\n");

        const termination = blockTransform.termination.operand
            ? `${indent}  ${blockTransform.termination.type} "${blockTransform.termination.operand}";`
            : `${indent}  ${blockTransform.termination.type};`

        return this.format_out_empty(
            `${indent}${name} {`,
            [transforms, termination].filter(f => f.length > 0).join("\n\n"),
            `${indent}}`
        );
    }

    static format_out_https_certificate = (https: ICSBlockHttpsCertificate): string => {
        const options = https.options.sort((a, b) => sortStr(a.name, b.name)).map(o => this.format_out_option("  ", o)).join("\n");

        return this.format_out_empty(
            `${this.format_out_variant("https-certificate", https)} {`,
            [options].filter(f => f.length > 0).join("\n\n"),
            "}"
        );
    }

    static format_out_http_get_client = (indent: string, client: ICSBlockHttpGetClient): string => {
        const params = client.parameters.map(p => this.format_out_parameter(indent + "  ", p)).join("\n");
        const headers = client.headers.map(h => this.format_out_header(indent + "  ", h)).join("\n");
        const metadata = client.metadata
            ? this.format_out_block_transform_information(indent + "  ", "metadata", client.metadata)
            : "";

        return this.format_out_empty(
            `${indent}client {`,
            [params, headers, metadata].filter(f => f.length > 0).join("\n\n"),
            `${indent}}`
        );
    }

    static format_out_http_get_server = (indent: string, server: ICSBlockHttpGetServer): string => {
        const headers = server.headers.map(h => this.format_out_header(indent + "  ", h)).join("\n");
        const output = server.output
            ? this.format_out_block_transform_information(indent + "  ", "output", server.output)
            : "";

        return this.format_out_empty(
            `${indent}server {`,
            [headers, output].filter(f => f.length > 0).join("\n\n"),
            `${indent}}`
        );
    }

    static format_out_http_get = (http_get: ICSBlockHttpGet): string => {
        const options = http_get.options.sort((a, b) => sortStr(a.name, b.name)).map(o => this.format_out_option("  ", o)).join("\n");
        const client = http_get.client
            ? this.format_out_http_get_client("  ", http_get.client)
            : ""
        const server = http_get.server
            ? this.format_out_http_get_server("  ", http_get.server)
            : ""

        return this.format_out_empty(
            `${this.format_out_variant("http-get", http_get)} {`,
            [options, client, server].filter(f => f.length > 0).join("\n\n"),
            "}"
        );
    }

    static format_out_dns_beacon = (dns_beacon: ICSBlockDnsBeacon): string => {
        const options = dns_beacon.options.sort((a, b) => sortStr(a.name, b.name)).map(o => this.format_out_option("  ", o)).join("\n");

        return this.format_out_empty(
            `${this.format_out_variant("dns-beacon", dns_beacon)} {`,
            [options].filter(f => f.length > 0).join("\n\n"),
            "}"
        );
    }

    static format_out_http_post_client = (indent: string, client: ICSBlockHttpPostClient): string => {
        const params = client.parameters.map(p => this.format_out_parameter(indent + "  ", p)).join("\n");
        const headers = client.headers.map(h => this.format_out_header(indent + "  ", h)).join("\n");
        const output = client.output
            ? this.format_out_block_transform_information(indent + "  ", "output", client.output)
            : "";
        const id = client.id
            ? this.format_out_block_transform_information(indent + "  ", "id", client.id)
            : "";

        return this.format_out_empty(
            `${indent}client {`,
            [params, headers, output, id].filter(f => f.length > 0).join("\n\n"),
            `${indent}}`
        );
    }

    static format_out_http_post_server = (indent: string, server: ICSBlockHttpPostServer): string => {
        const headers = server.headers.map(h => this.format_out_header(indent + "  ", h)).join("\n");
        const output = server.output
            ? this.format_out_block_transform_information(indent + "  ", "output", server.output)
            : "";

        return this.format_out_empty(
            `${indent}server {`,
            [headers, output].filter(f => f.length > 0).join("\n\n"),
            `${indent}}`
        );
    }

    static format_out_http_post = (http_post: ICSBlockHttpPost): string => {
        const options = http_post.options.sort((a, b) => sortStr(a.name, b.name)).map(o => this.format_out_option("  ", o)).join("\n") + "\n";
        const client = http_post.client
            ? this.format_out_http_post_client("  ", http_post.client) + "\n"
            : ""
        const server = http_post.server
            ? this.format_out_http_post_server("  ", http_post.server) + "\n"
            : ""

        return this.format_out_empty(
            `${this.format_out_variant("http-post", http_post)} {`,
            [options, client, server].filter(f => f.length > 0).join("\n\n"),
            "}"
        );
    }
}