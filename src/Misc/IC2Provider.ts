import { AnyCnameRecord } from "dns";
import { AppFooter } from "../Components/AppFooter";
import { CSProfileCreate } from "../Components/CobaltStrike/CSProfileCreate";
import { CSProfileEdit } from "../Components/CobaltStrike/CSProfileEdit";
import { CSProfileImport } from "../Components/CobaltStrike/CSProfileImport";

export interface IC2Provider {
    name: string;
    importers: IC2Importer[];
    editView: (props: IC2EditProps) => JSX.Element;
    compile: (profile: any) => string;
}

export interface IC2EditProps {
    profile: any;
    onProfileChanged: (profile: any) => void;
}

export interface IC2ImporterProps {
    onImported: (profile: any) => void;
}

export interface IC2Importer {
    name: string,
    view: (props: IC2ImporterProps) => JSX.Element;
}

export const CobaltStrike: IC2Provider = {
    name: "Cobalt Strike",
    importers: [
        {
            "name": "Create new",
            "view": CSProfileCreate
        },
        {
            "name": "Import existing profile",
            "view": CSProfileImport
        }
    ],
    editView: CSProfileEdit,
    compile: (profile) => ""
}