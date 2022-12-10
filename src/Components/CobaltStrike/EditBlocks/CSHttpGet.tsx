import { ICSBlockHttpGet, ICSBlockHttpGetClient, ICSBlockHttpGetServer, ICSBlockTransformInformation, ICSHasVariant, ICSHeader, ICSOption, ICSParameter } from "../../../Plugins/CobaltStrike/CSProfileTypes";
import { BaseBlock } from "../../BaseBlock";
import { CSKeyValueList } from "./Controls/CSKeyValueList";
import { CSOptionsList } from "./Controls/CSOptionsList";
import { CSTransformationFlow } from "./Controls/CSTransformationFlow";
import AddIcon from '@mui/icons-material/Add';
import { Button } from "@mui/material";
import { CSCreateNew } from "./Controls/CSCreateNew";
import { CSProfileHelper } from "../../../Plugins/CobaltStrike/CSProfileHelper";

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

    // client
    const clientHeadersChanged = (headers: ICSHeader[]) => {
        if (http_get.client) http_get.client.headers = headers;
        onProfileChanged({
            ...profile
        })
    }

    const clientParametersChanged = (parameters: ICSParameter[]) => {
        if (http_get.client) http_get.client.parameters = parameters;
        onProfileChanged({
            ...profile
        })
    }

    const getClient = (client: ICSBlockHttpGetClient) => <>
        <BaseBlock titleVariant="h6" title="Headers" description="List of headers the beacon sends">
            <CSKeyValueList onListChanged={clientHeadersChanged} list={client.headers} />
        </BaseBlock>
        <BaseBlock titleVariant="h6" title="Parameters" description="List of parameters the beacon appends in URLs">
            <CSKeyValueList onListChanged={clientParametersChanged} list={client.parameters} />
        </BaseBlock>
        <BaseBlock titleVariant="h6" title="Metadata" description="Transformation of data sent by beacons" identifier={1} onBlockRemoved={client.metadata ? removeClientMetadata : undefined}>
            <CSCreateNew item={client.metadata} onCreate={createClientMetadata} itemView={getClientMetadata} />
        </BaseBlock>
    </>;

    const createClient = () => {
        http_get.client = {
            headers: [],
            parameters: []
        };
        onProfileChanged({ ...profile });
    }

    const removeClient = () => {
        http_get.client = undefined;
        onProfileChanged({ ...profile });
    }

    // client.metadata
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

    // server
    const removeServer = () => {
        http_get.server = undefined;
        onProfileChanged({ ...profile });
    }

    const createServer = () => {
        http_get.server = {
            headers: []
        };
        onProfileChanged({ ...profile });
    }
    const serverHeadersChanged = (headers: ICSHeader[]) => {
        if (http_get.server) http_get.server.headers = headers;
        onProfileChanged({
            ...profile
        })
    }

    const getServer = (server: ICSBlockHttpGetServer) => <>
        <BaseBlock titleVariant="h6" title="Headers" description="List of headers the beacon sends">
            <CSKeyValueList onListChanged={serverHeadersChanged} list={server.headers} />
        </BaseBlock>
        <BaseBlock titleVariant="h6" title="Output" description="Transformation of data sent by the teamserver" identifier={1} onBlockRemoved={server.output ? removeServerOutput : undefined}>
            <CSCreateNew item={server.output} onCreate={createServerOutput} itemView={getServerOutput} />
        </BaseBlock>
    </>;

    // client.metadata
    const getServerOutput = (meta: ICSBlockTransformInformation) => <CSTransformationFlow profile={profile} onProfileChanged={onProfileChanged} flow={meta} />

    const createServerOutput = () => {
        if (http_get.server) {
            http_get.server.output = {
                transforms: [],
                termination: { type: "print" }
            };
            onProfileChanged({ ...profile });
        }
    }

    const removeServerOutput = () => {
        if (http_get.server) {
            http_get.server.output = undefined;
            onProfileChanged({ ...profile });
        }
    }

    // Composition
    return <>
        {/* Options */}
        <BaseBlock titleVariant="h6" title="Options" startExpanded>
            <CSOptionsList blockMetaName="http_get" blockOptions={http_get.options} onBlockOptionsChanged={handleOptChange} />
        </BaseBlock>
        {/* Client */}
        <BaseBlock titleVariant="h6" title="Client" description="Configure beacons' HTTP requests" identifier={1} onBlockRemoved={http_get.client ? removeClient : undefined}>
            <CSCreateNew item={http_get.client} onCreate={createClient} itemView={getClient} />
        </BaseBlock>
        {/* Server */}
        <BaseBlock titleVariant="h6" title="Server" description="Configure the teamserver's HTTP responses" identifier={1} onBlockRemoved={http_get.server ? removeServer : undefined}>
            <CSCreateNew item={http_get.server} onCreate={createServer} itemView={getServer} />
        </BaseBlock>
    </>
}