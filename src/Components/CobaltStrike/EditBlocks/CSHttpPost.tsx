import { ICSBlockHttpPost, ICSBlockHttpPostClient, ICSBlockHttpPostServer, ICSBlockTransformInformation, ICSHasVariant, ICSHeader, ICSOption, ICSParameter } from "../../../Plugins/CobaltStrike/CSProfileTypes";
import { BaseBlock } from "../../BaseBlock";
import { CSKeyValueList } from "./Controls/CSKeyValueList";
import { CSOptionsList } from "./Controls/CSOptionsList";
import { CSTransformationFlow } from "./Controls/CSTransformationFlow";
import { CSCreateNew } from "./Controls/CSCreateNew";

interface Props {
    profile: any;
    item: ICSHasVariant;
    onProfileChanged: (profile: any) => void;
}

export const CSHttpPost = ({ item, onProfileChanged, profile }: Props) => {
    var http_post = item as ICSBlockHttpPost;

    const handleOptChange = (opts: ICSOption[]) => {
        http_post.options = opts;
        onProfileChanged({
            ...profile
        });
    }

    // client
    const clientHeadersChanged = (headers: ICSHeader[]) => {
        if (http_post.client) http_post.client.headers = headers;
        onProfileChanged({
            ...profile
        })
    }

    const clientParametersChanged = (parameters: ICSParameter[]) => {
        if (http_post.client) http_post.client.parameters = parameters;
        onProfileChanged({
            ...profile
        })
    }

    const getClient = (client: ICSBlockHttpPostClient) => <>
        <BaseBlock titleVariant="h6" title="Headers" description="List of headers the beacon sends">
            <CSKeyValueList onListChanged={clientHeadersChanged} list={client.headers} />
        </BaseBlock>
        <BaseBlock titleVariant="h6" title="Parameters" description="List of parameters the beacon appends in URLs">
            <CSKeyValueList onListChanged={clientParametersChanged} list={client.parameters} />
        </BaseBlock>
        <BaseBlock titleVariant="h6" title="Output" description="Transformation of data sent by beacons" identifier={1} onBlockRemoved={client.output ? removeClientOutput : undefined}>
            <CSCreateNew item={client.output} onCreate={createClientOutput} itemView={getClientOutput} />
        </BaseBlock>
        <BaseBlock titleVariant="h6" title="ID" description="Transformation of data sent by beacons" identifier={1} onBlockRemoved={client.id ? removeClientId : undefined}>
            <CSCreateNew item={client.id} onCreate={createClientId} itemView={getClientId} />
        </BaseBlock>
    </>;

    const createClient = () => {
        http_post.client = {
            headers: [],
            parameters: []
        };
        onProfileChanged({ ...profile });
    }

    const removeClient = () => {
        http_post.client = undefined;
        onProfileChanged({ ...profile });
    }

    // client.output
    const getClientOutput = (meta: ICSBlockTransformInformation) => <CSTransformationFlow profile={profile} onProfileChanged={onProfileChanged} flow={meta} />

    const createClientOutput = () => {
        if (http_post.client) {
            http_post.client.output = {
                transforms: [],
                termination: { type: "print" }
            };
            onProfileChanged({ ...profile });
        }
    }

    const removeClientOutput = () => {
        if (http_post.client) {
            http_post.client.output = undefined;
            onProfileChanged({ ...profile });
        }
    }

    // client.id
    const getClientId = (meta: ICSBlockTransformInformation) => <CSTransformationFlow profile={profile} onProfileChanged={onProfileChanged} flow={meta} />

    const createClientId = () => {
        if (http_post.client) {
            http_post.client.id = {
                transforms: [],
                termination: { type: "print" }
            };
            onProfileChanged({ ...profile });
        }
    }

    const removeClientId = () => {
        if (http_post.client) {
            http_post.client.id = undefined;
            onProfileChanged({ ...profile });
        }
    }

    // server
    const removeServer = () => {
        http_post.server = undefined;
        onProfileChanged({ ...profile });
    }

    const createServer = () => {
        http_post.server = {
            headers: []
        };
        onProfileChanged({ ...profile });
    }
    const serverHeadersChanged = (headers: ICSHeader[]) => {
        if (http_post.server) http_post.server.headers = headers;
        onProfileChanged({
            ...profile
        })
    }

    const getServer = (server: ICSBlockHttpPostServer) => <>
        <BaseBlock titleVariant="h6" title="Headers" description="List of headers the beacon sends">
            <CSKeyValueList onListChanged={serverHeadersChanged} list={server.headers} />
        </BaseBlock>
        <BaseBlock titleVariant="h6" title="Output" description="Transformation of data sent by the teamserver" identifier={1} onBlockRemoved={server.output ? removeServerOutput : undefined}>
            <CSCreateNew item={server.output} onCreate={createServerOutput} itemView={getServerOutput} />
        </BaseBlock>
    </>;

    // server.output
    const getServerOutput = (meta: ICSBlockTransformInformation) => <CSTransformationFlow profile={profile} onProfileChanged={onProfileChanged} flow={meta} />

    const createServerOutput = () => {
        if (http_post.server) {
            http_post.server.output = {
                transforms: [],
                termination: { type: "print" }
            };
            onProfileChanged({ ...profile });
        }
    }

    const removeServerOutput = () => {
        if (http_post.server) {
            http_post.server.output = undefined;
            onProfileChanged({ ...profile });
        }
    }

    // client.id

    // Composition
    return <>
        {/* Options */}
        <BaseBlock titleVariant="h6" title="Options" startExpanded>
            <CSOptionsList blockMetaName="http_post" blockOptions={http_post.options} onBlockOptionsChanged={handleOptChange} />
        </BaseBlock>
        {/* Client */}
        <BaseBlock titleVariant="h6" title="Client" description="Configure beacons' HTTP requests" identifier={1} onBlockRemoved={http_post.client ? removeClient : undefined}>
            <CSCreateNew item={http_post.client} onCreate={createClient} itemView={getClient} />
        </BaseBlock>
        {/* Server */}
        <BaseBlock titleVariant="h6" title="Server" description="Configure the teamserver's HTTP responses" identifier={1} onBlockRemoved={http_post.server ? removeServer : undefined}>
            <CSCreateNew item={http_post.server} onCreate={createServer} itemView={getServer} />
        </BaseBlock>
    </>
}