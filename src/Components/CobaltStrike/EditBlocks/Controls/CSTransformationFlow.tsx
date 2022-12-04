// Flow (append [operand][h/s][x]) => (mask [x])
// Tranforms: (append [i][+]) (mask[i][+])

import { ICSBlockTransformInformation } from "../../../../Plugins/CobaltStrike/CSProfileTypes";

interface Props {
    profile: any;
    flow: ICSBlockTransformInformation;
    onProfileChanged: (profile: any) => void;
}

export const CSTransformationFlow = ({ profile, flow, onProfileChanged }: Props) => {
    return <>
        {/* Transform selection */}
        {/* Flow display */}
    </>
}