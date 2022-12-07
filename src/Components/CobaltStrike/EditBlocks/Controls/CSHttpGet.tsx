import { ICSBlockHttpGet, ICSBlockHttpGetClient, ICSBlockTransformInformation, ICSHasVariant, ICSHeader, ICSOption } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import { BaseBlock } from "../BaseBlock";
import { CSHeadersList } from "./CSHeaderList";
import { CSOptionsList } from "./CSOptionsList";
import { CSTransformationFlow } from "./CSTransformationFlow";
import AddIcon from '@mui/icons-material/Add';
import { Button } from "@mui/material";
import { CSCreateNew } from "./CSCreateNew";

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

    const getClient = (client: ICSBlockHttpGetClient) => <>
        <BaseBlock titleVariant="h6" title="Headers" description="List of headers the beacon sends">
            <CSHeadersList onHeadersChanged={clientHeadersChanged} headers={client.headers} />
        </BaseBlock>
        <BaseBlock titleVariant="h6" title="Metadata" description="Transformation of data sent by beacons" identifier={1} onBlockRemoved={client.metadata ? removeClientMetadata : undefined}>
            <CSCreateNew item={client.metadata} onCreate={createClientMetadata} itemView={getClientMetadata} />
        </BaseBlock>
    </>;

    const createClient = () => {
        http_get.client = { headers: [] };
        onProfileChanged({ ...profile });
    }

    const removeClient = () => {
        http_get.client = undefined;
        onProfileChanged({ ...profile });
    }

    const getClientMetadata = (meta: ICSBlockTransformInformation) => <CSTransformationFlow profile={profile} onProfileChanged={onProfileChanged} flow={meta} />

    const createClientMetadata = () => {
        if (http_get.client) {
            http_get.client.metadata = {
                transforms: [],
                termination: { type: "print" }
            };
            onProfileChanged({ ...profile });
        }
    }

    const removeClientMetadata = () => {
        if (http_get.client) {
            http_get.client.metadata = undefined;
            onProfileChanged({ ...profile });
        }
    }

    return <>
        {/* Options */}
        <BaseBlock titleVariant="h6" title="Options" startExpanded>
            <CSOptionsList blockMetaName="http_get" blockOptions={http_get.options} onBlockOptionsChanged={handleOptChange} />
        </BaseBlock>
        {/* Client */}
        <BaseBlock titleVariant="h6" title="Client" description="Defines beacon behaviour" identifier={1} onBlockRemoved={http_get.client ? removeClient : undefined}>
            <CSCreateNew item={http_get.client} onCreate={createClient} itemView={getClient} />
        </BaseBlock>
    </>
}