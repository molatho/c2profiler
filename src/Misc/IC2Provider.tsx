import { CSProfileCreate } from "../Components/CobaltStrike/CSProfileCreate";
import { CSProfileEdit } from "../Components/CobaltStrike/CSProfileEdit";
import { CSProfileImport } from "../Components/CobaltStrike/CSProfileImport";
import { AppFlow } from "./Common";

export interface Section {
    title: string;
    description: string;
}

export type ProfileChangedCb = (profile: any) => void;
export type SetStepCb = (step: AppFlow) => void;

export interface IC2BasicFlowProps extends Section {
    profile: any;
    navigateTo: SetStepCb;
}

export interface IC2EditProps extends IC2BasicFlowProps {
    onProfileChanged: ProfileChangedCb;
}

export interface EditView extends Section {
    view: (props: IC2EditProps) => JSX.Element;
}

export interface IC2TestProps extends IC2BasicFlowProps {
}

export interface TestView extends Section {
    view: (props: IC2TestProps) => JSX.Element;
}

export interface IC2ExportProps extends IC2BasicFlowProps {
}

export interface ExportView extends Section {
    view: (props: IC2ExportProps) => JSX.Element;
}

export interface IC2Provider {
    name: string;
    importers: IC2Importer[];
    editView: EditView;
    testView: EditView;
}


export interface IC2ImporterProps {
    onImported: (profile: any) => void;
}

export interface IC2Importer {
    name: string,
    view: (props: IC2ImporterProps) => JSX.Element;
}

const DummyView = ({ profile }: IC2TestProps): JSX.Element => {
    return <>{JSON.stringify(profile)}</>
};

export const CobaltStrike: IC2Provider = {
    name: "Cobalt Strike",
    importers: [
        {
            name: "Create new",
            view: CSProfileCreate
        },
        {
            name: "Import existing profile",
            view: CSProfileImport
        }
        //TODO: Upload file
    ],
    editView: {
        title: "Malleable Profile Editing",
        description: "Here you can edit your Cobalt Strike malleable profile and add, remove, and configure blocks.",
        view: CSProfileEdit
    },
    testView: {
        title: "Malleable Profile Test",
        description: "Now it's time to evaluate with your profile. In this step you can inspect HTTP requests and responses generated by your profile.",
        view: DummyView
    }
}