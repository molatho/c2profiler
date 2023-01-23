export interface IHasDocumentation {
    description?: string;
    link?: string;
}

export interface IHasDisplayName {
    displayName: string;
}

export interface IMetaOptionDefinition extends IHasDocumentation {
    name: string;
    type: "string" | "number" | "boolean" | "option" | "list";
    defaultValue: string;
    opsec?: boolean;
    required?: boolean;
    options?: string[];
    listDelimiter?: string;
}

export interface IBRMetaProfile {
    listeners: IMetaListener[];
}

export interface IMetaListener  {
    options: IMetaOptionDefinition[];
    type: "http" | "doh";
}