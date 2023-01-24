import { AuthentitcationTypes, IBaseCommunication, IBRProfile, IDohListener, IHttpListener, OperatingSystemType, OperatingSystemTypes, SleepMaskType, SleepMaskTypes } from "./BRProfileTypes";

interface FieldArgs<C> {
    container: C;
    getter: (container: C) => any;
    setter: (container: C, value: any) => void;
}

class Field<C> {
    container: C;
    getter: (container: C) => any;
    setter: (container: C, value: any) => void;

    constructor(args: FieldArgs<C>) {
        this.container = args.container;
        this.getter = args.getter;
        this.setter = args.setter;
    }

    get value() { return this.getter(this.container); }

    set value(_value: any) { this.setter(this.container, _value); }
}

interface GFieldArgs<C, T> extends FieldArgs<C> {
    displayName: string,
    defaultValue: T,
    type: "string" | "number" | "boolean" | "option" | "list" | "array" | "dict",
    description?: string,
    link?: string,
    opsec?: boolean,
    required?: boolean,
    options?: string[],
    listDelimiter?: string;
}

export class GField<C, T> extends Field<C> {
    args: GFieldArgs<C, T>;

    constructor(args: GFieldArgs<C, T>) {
        super(args)

        this.args = args;
    }

    get displayName(): string { return this.args.displayName; }
    get defaultValue(): T { return this.args.defaultValue; }
    get opsec(): boolean { return this.args.opsec || false; }
    get required(): boolean { return this.args.required || false; }
    get options(): string[] { return this.args.options || []; }
    get listDelimiter(): string { return this.args.listDelimiter || ","; }
}

export class BRProfile {
    fields: Field<BRProfile>[];
    profile: IBRProfile;

    constructor(profile: IBRProfile) {
        this.profile = profile;
        this.fields = [];
    }

    get httpListeners(): HttpListener[] {
        return Object.keys(this.profile.listeners)
            .filter(name => "append" in this.profile.listeners[name])
            .map(name => new HttpListener(this.profile.listeners[name]))
    } 

    get dohListeners(): DohListener[] {
        return Object.keys(this.profile.listeners)
            .filter(name => "dnshost" in this.profile.listeners[name])
            .map(name => new DohListener(this.profile.listeners[name]))
    } 
}

export class BaseListener<U extends IBaseCommunication> {
    _fields: Field<U>[];
    protected listener: U;

    constructor(listener: U) {
        this.listener = listener;
        this._fields = [
            new GField<U, boolean>({
                container: this.listener,
                getter: c => c.auth_type ? "One Time Auth keys" : "Regular keys",
                setter: (c, v) => c.auth_type = v === "One Time Auth keys",
                displayName: "Authentication Type",
                type: "option",
                required: true,
                defaultValue: false,
                options: AuthentitcationTypes
            }),
            new GField<U, string[]>({
                container: this.listener,
                getter: c => c.c2_authkeys,
                setter: (c, v: string[]) => {
                    c.c2_authkeys = v;
                    c.auth_count = v.length;
                },
                displayName: "C2 Authentication Keys",
                type: "array",
                required: true,
                defaultValue: []
            }),
            new GField<U, boolean>({
                container: this.listener,
                getter: c => c.is_random,
                setter: (c, v: boolean) => c.is_random = v,
                displayName: "Autogenerate authentication keys",
                type: "boolean",
                defaultValue: false
            }),
            new GField<U, string[]>({
                container: this.listener,
                getter: c => c.c2_uri,
                setter: (c, v: string[]) => c.c2_uri = v,
                displayName: "C2 URIs",
                type: "array",
                required: true,
                defaultValue: []
            }),
            new GField<U, string>({
                container: this.listener,
                getter: c => c.host,
                setter: (c, v) => c.host = v,
                displayName: "Host",
                type: "string",
                defaultValue: "127.0.0.1",
                description: "IP address the Ratel server binds to and listens on."
            }),
            new GField<U, number>({
                container: this.listener,
                getter: c => parseInt(c.port),
                setter: (c, v: number) => c.port = v.toString(),
                displayName: "Port",
                type: "number",
                defaultValue: 443,
                description: "Port the Ratel server binds to and listens on."
            }),
            new GField<U, string>({
                container: this.listener,
                getter: c => c.proxy,
                setter: (c, v) => c.proxy = v,
                displayName: "Proxy",
                type: "string",
                defaultValue: "http//my.proxy.tld:1234",
                description: "HTTP(S) proxy badgers communicate over."
            }),
            new GField<U, string>({
                container: this.listener,
                getter: c => c.rotational_host.split(","),
                setter: (c, v: string[]) => c.rotational_host = v.join(","),
                displayName: "Rotational hosts",
                type: "list",
                listDelimiter: ",",
                required: true,
                defaultValue: ""
            }),
            new GField<U, boolean>({
                container: this.listener,
                getter: c => c.die_offline,
                setter: (c, v: boolean) => c.die_offline = v,
                displayName: "Die if C2 is offline",
                type: "boolean",
                defaultValue: true,
                description: "Terminate badgers if the C2 is inaccessible (during initialization)."
            }),
            new GField<U, boolean>({
                container: this.listener,
                getter: c => c.ssl,
                setter: (c, v: boolean) => c.ssl = v,
                displayName: "Enable SSL",
                type: "boolean",
                defaultValue: true
            }),
            new GField<U, OperatingSystemType>({
                container: this.listener,
                getter: c => c.os_type,
                setter: (c, v: OperatingSystemType) => c.os_type = v,
                displayName: "Operation System",
                type: "option",
                options: OperatingSystemTypes,
                defaultValue: "windows"
            }),
            new GField<U, SleepMaskType>({
                container: this.listener,
                getter: c => c.obfsleep,
                setter: (c, v: SleepMaskType) => c.obfsleep = v,
                displayName: "Sleep mask",
                type: "option",
                options: SleepMaskTypes,
                defaultValue: "APC"
            }),
            new GField<U, string>({
                container: this.listener,
                getter: c => c.useragent,
                setter: (c, v: string) => c.useragent,
                displayName: "UserAgent",
                type: "string",
                required: true,
                defaultValue: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
            }),
            new GField<U, number>({
                container: this.listener,
                getter: c => c.sleep,
                setter: (c, v: number) => c.sleep = v,
                displayName: "Sleep",
                type: "number",
                defaultValue: 60,
                description: "Interval of inactivity between check-ins of badgers."
            }),
            new GField<U, number>({
                container: this.listener,
                getter: c => c.jitter,
                setter: (c, v: number) => c.jitter = v,
                displayName: "Jitter",
                type: "number",
                defaultValue: 40,
                description: "Random jitter (%) applied to the sleep interval."
            }),
        ]
    }

    get fields() { return this._fields }
}

export class HttpListener extends BaseListener<IHttpListener> {
    constructor(listener: IHttpListener) {
        super(listener);

        this.fields.push(...[
            new GField<IHttpListener, string>({
                container: this.listener,
                getter: c => c.append,
                setter: (c, v: string) => c.append,
                displayName: "Request body append",
                type: "string",
                defaultValue: "</content>",
                description: "Contents appended to the request body"
            }),
            new GField<IHttpListener, string>({
                container: this.listener,
                getter: c => c.prepend,
                setter: (c, v: string) => c.prepend,
                displayName: "Request body prepend",
                type: "string",
                defaultValue: "<content>",
                description: "Contents prepended to the request body"
            }),
            new GField<IHttpListener, Object>({
                container: this.listener,
                getter: c => c.request_headers,
                setter: (c, v: string) => c.request_headers,
                displayName: "Request body headers",
                type: "dict",
                defaultValue: { "Content-Type": "application/xml" },
                description: "Extra headers to add to the request"
            }),
            new GField<IHttpListener, string>({
                container: this.listener,
                getter: c => c.append_response,
                setter: (c, v: string) => c.append_response,
                displayName: "Response body append",
                type: "string",
                defaultValue: "</content>",
                description: "Contents appended to the response body"
            }),
            new GField<IHttpListener, string>({
                container: this.listener,
                getter: c => c.prepend_response,
                setter: (c, v: string) => c.prepend_response,
                displayName: "Response body prepend",
                type: "string",
                defaultValue: "<content>",
                description: "Contents prepended to the response body"
            }),
            new GField<IHttpListener, Object>({
                container: this.listener,
                getter: c => c.response_headers,
                setter: (c, v: string) => c.response_headers,
                displayName: "Response body headers",
                type: "dict",
                defaultValue: { "Content-Type": "application/xml" },
                description: "Extra headers to add to the response"
            }),
            new GField<IHttpListener, string>({
                container: this.listener,
                getter: c => c.prepend_response,
                setter: (c, v: string) => c.prepend_response,
                displayName: "Empty response body prepend",
                type: "string",
                defaultValue: "<content>Empty</content>",
                description: "Contents sent in response bodies of empty responses"
            }),
        ]);
    }
}

export class DohListener extends BaseListener<IDohListener> {
    constructor(listener: IDohListener) {
        super(listener);

        this.fields.push(...[
            new GField<IDohListener, string[]>({
                container: this.listener,
                getter: c => c.dnshost.split(","),
                setter: (c, v:string[]) => c.dnshost = v.join(","),
                displayName: "DNS hosts",
                type: "list",
                listDelimiter: ",",
                defaultValue: []
            }),
            new GField<IDohListener, string>({
                container: this.listener,
                getter: c => c.checkinA,
                setter: (c, v:string) => c.checkinA = v,
                displayName: "Check-In A Record",
                type: "string",
                defaultValue: "8.8.8.8",
                description: "Record to send as response when listener has commands queued"
            }),
            new GField<IDohListener, string>({
                container: this.listener,
                getter: c => c.idleA,
                setter: (c, v:string) => c.idleA = v,
                displayName: "Idle A Record",
                type: "string",
                defaultValue: "8.8.4.4",
                description: "Record requested by badgers if they send large amounts of data"
            }),
            new GField<IDohListener, string>({
                container: this.listener,
                getter: c => c.spoofTxt,
                setter: (c, v:string) => c.spoofTxt = v,
                displayName: "Spoofed-Txt Record",
                type: "string",
                defaultValue: "google-site-verification=wD8N7i1JTNTkezJ49swvWW48f8_9xveREV4oB-0Hf5o",
                description: "TXT record to send as response when listener is done sending data"
            }),
            new GField<IDohListener, Object>({
                container: this.listener,
                getter: c => c.extra_headers,
                setter: (c, v) => c.extra_headers = v,
                displayName: "Extra Headers",
                type: "dict",
                defaultValue: []
            })
        ]);
    }
}