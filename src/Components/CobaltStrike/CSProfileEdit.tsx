import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";
import IndentedAccordeon from "../IndentedAccordeon";
import { PaperItem } from "../PaperItems/PaperItem";
import { OptionsBlock } from "./EditBlocks/OptionsBlock";

interface Props {
    profile: any;
    onProfileChanged: (profile: any) => void;
}

export const CSProfileEdit = ({ profile, onProfileChanged }: Props) => {
    const _profile = profile as ICSProfile;
    return <PaperItem>
        <>
        {/* Chips: one for each block */}
        {/* Global */}
        <IndentedAccordeon title="Global">
            <OptionsBlock profile={_profile} onProfileChanged={onProfileChanged} blockName="global" />
            <div></div>
        </IndentedAccordeon>
        {/* HTTP-GET */}
        <IndentedAccordeon title="HTTP-GET">
            <OptionsBlock profile={_profile} onProfileChanged={onProfileChanged} blockName="http-get" />
            <div></div>
        </IndentedAccordeon>
        </>
    </PaperItem>
}