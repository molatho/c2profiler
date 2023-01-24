// https://bruteratel.com/tabs/ratelserver/c4profiles/
// https://bruteratel.com/tabs/commander/c4profiler/

export interface IBRProfile {
    listeners: { [key: string]: IListener };
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
export type IListener = IDohListener | IHttpListener;

export type SleepMaskType = "APC" | "Pooling-0" | "Pooling-1";
export const SleepMaskTypes: SleepMaskType[] = ["APC", "Pooling-0", "Pooling-1"];

export type OperatingSystemType = "windows";
export const OperatingSystemTypes: OperatingSystemType[] = ["windows"];

export type AuthentitcationType = "Regular keys" | "One Time Auth keys";
export const AuthentitcationTypes: AuthentitcationType[] = ["Regular keys", "One Time Auth keys"];

export interface IBaseCommunication {
    auth_count: number;
    auth_type: boolean;
    c2_authkeys: string[];
    c2_uri: string[];
    host?: string;
    is_random?: boolean;
    obfsleep: SleepMaskType;
    os_type: OperatingSystemType;
    port: string;
    rotational_host: string;
    ssl?: boolean;
    useragent: string;
    die_offline?: boolean;
    proxy?: string;
    sleep: number;
    jitter: number;
}

export interface IHttpListener extends IBaseCommunication {
    append: string;
    append_response: string;
    prepend: string;
    prepend_response: string;
    request_headers: { [key: string]: string };
    response_headers: { [key: string]: string };
    empty_response: string;
}

export interface IDohListener extends IBaseCommunication {
    dnshost: string;
    idleA: string;
    spoofTxt: string;
    checkinA: string;
    extra_headers: { [key: string]: string };
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