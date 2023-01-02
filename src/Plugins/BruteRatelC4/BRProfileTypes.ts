// https://bruteratel.com/tabs/ratelserver/c4profiles/
// https://bruteratel.com/tabs/commander/c4profiler/

export interface IBRProfile {
    listeners: IListener[];
    payload_config?: { [key: string]: IPayload };
    register_dll?: { [key: string]: IRegisterDll };
    register_pe?: { [key: string]: IRegisterPe };
    register_pe_inline?: { [key: string]: IRegisterPeInline };
    register_obj?: { [key: string]: IRegisterObj };
    admin_list?: { [key: string]: string };
    user_list?: { [key: string]: string };
    auto_save?: boolean;
    click_script?: { [key: string]: string[] };
    autoruns?: string[];
    c2_handler?: string;
    comm_enc_key?: string;
    credentials?: ICredential[];
    ssl_cert?: string;
    ssl_key?: string;
}

/* Listeners */
export type IListener = IHttpListener | IDohListener;

export interface IBaseCommunication {
    auth_count: number;
    auth_type: boolean;
    c2_authkeys: string[];
    c2_uri: string[];
    extra_headers: { [key: string]: string };
    host: string;
    is_random: boolean;
    os_type: string;
    port: string;
    rotational_host: string;
    ssl: boolean;
    useragent: string;
    die_offline: boolean;
    proxy: string;
}

export interface IHttpListener extends IBaseCommunication {
    append?: string;
    append_response?: string;
    prepend?: string;
    prepend_response?: string;
    request_headers?: { [key: string]: string };
    response_headers?: { [key: string]: string };
}

export interface IDohListener extends IBaseCommunication {
    dnshost: string;
    idleA: string;
    spoofTxt: string;
    checkinA: string;
}

export type PayloadType = "HTTP" | "DOH" | "SMB" | "TCP";
export const PayloadTypeNames: PayloadType[] = ["HTTP", "DOH", "SMB", "TCP"];

/* Payload Config */
export type IPayload = IHttpPayload | IDohPayload | ISmbPayload | ITcpPayload;

export interface IBasePayload {
    type: PayloadType;
}

export interface IHttpPayload extends IBasePayload, IHttpListener { }

export interface IDohPayload extends IBasePayload, IDohListener { }

export interface ISmbPayload extends IBasePayload {
    c2_auth: string;
    smb_pipe: string;
}

export interface ITcpPayload extends IBasePayload {
    c2_auth: string;
    host: string;
    port: string;
}

/* Command */
export interface IBaseCommand {
    file_path: string;
    description: string;
    artifact: string;
    mainArgs: string;
    optionalArgs: string;
    example: string;
    minimumArgCount: number;
}

export type Architecture = "x64" | "x86";
export const ArchitectureNames: Architecture[] = ["x64", "x86"];

export interface IRegisterDll extends IBaseCommand {
    arch: Architecture;
    replace_str: { [key: string]: string };
}

export interface IRegisterPe extends IBaseCommand { }

export interface IRegisterPeInline extends IBaseCommand { }

export interface IRegisterObj extends IBaseCommand {
    arch: Architecture;
}

/* Credentials */
export interface ICredential {
    creddomain: string;
    crednote: string;
    credpass: string;
    creduser: string;
}

/* PsExec */
export interface IPsExec {
    psexec_svc_desc: string;
    psexec_svc_name: string;
}

/* WebHook */
export interface IWebHook {
    badger_init: boolean;
    badger_log: boolean;
    webhook_host: string;
}