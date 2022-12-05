import { ICSBlockHttpGet, ICSHasVariant, ICSOption } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import { BaseBlock } from "../BaseBlock";
import { CSOptionsList } from "./CSOptionsList";
import { CSTransformationFlow } from "./CSTransformationFlow";

interface Props {
    profile: any;
    item: ICSHasVariant;
    onProfileChanged: (profile: any) => void;
}

export const CSHttpGet = ({ item, onProfileChanged, profile }: Props) => {
    var http_get = item as ICSBlockHttpGet;

    const handleOptChange = (opts: ICSOption[]) => {
        http_get.options = opts;
        onProfileChanged({
            ...profile
        });
    }

    return <>
        {/* Options */}
        <BaseBlock titleVariant="h6" title="Options" startExpanded>
            <CSOptionsList blockMetaName="http_get" blockOptions={http_get.options} onBlockOptionsChanged={handleOptChange} />
        </BaseBlock>
        {/* Client */}
        <BaseBlock titleVariant="h6" title="Client - Metadata" startExpanded>
            {http_get.client && http_get.client.metadata && <CSTransformationFlow profile={profile} onProfileChanged={onProfileChanged} flow={http_get.client.metadata} />}
        </BaseBlock>
    </>
}