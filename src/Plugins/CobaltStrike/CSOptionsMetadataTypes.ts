export interface IMetaOption {
    name: string;
    type: "string" | "number" | "boolean";
    defaultValue: string;
    description?: string;
}

export interface IMetaData {
    [key: string]: IMetaOption[];
}