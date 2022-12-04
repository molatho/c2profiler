import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";

export interface Props {
    readonly: boolean;
    profile: ICSProfile;
}

export const CSProfile = ({readonly, profile} : Props)=>{
    return (
        <div>
        <span>Readonly: {readonly}</span>
            <span>Profile: {JSON.stringify(profile)}</span>
        </div>
    );
}