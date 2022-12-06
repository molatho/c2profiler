import { ICSBlockHttpGet, ICSHasVariant, ICSHeader, ICSOption } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import { BaseBlock } from "../BaseBlock";
import { CSHeadersList } from "./CSHeaderList";
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

    const clientHeadersChanged = (headers: ICSHeader[]) => {
        if (http_get.client) http_get.client.headers = headers;
        onProfileChanged({
            ...profile
        })
    }

    return <>
        {/* Options */}
        <BaseBlock titleVariant="h6" title="Options" startExpanded>
            <CSOptionsList blockMetaName="http_get" blockOptions={http_get.options} onBlockOptionsChanged={handleOptChange} />
        </BaseBlock>
        {/* Client */}
        <BaseBlock titleVariant="h6" title="Client" description="Defines beacon behaviour">
            <>
                <BaseBlock titleVariant="h6" title="Headers" description="List of headers the beacon sends">
                    {http_get.client && <CSHeadersList onHeadersChanged={clientHeadersChanged} headers={http_get.client.headers} />}
                </BaseBlock>
                <BaseBlock titleVariant="h6" title="Metadata" description="Transformation of data sent by beacons">
                    {http_get.client && http_get.client.metadata && <CSTransformationFlow profile={profile} onProfileChanged={onProfileChanged} flow={http_get.client.metadata} />}
                </BaseBlock>
            </>
        </BaseBlock>
    </>
}