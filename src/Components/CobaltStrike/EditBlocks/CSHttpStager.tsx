import { ICSBlockHttpStager, ICSBlockTransformInformation, ICSHeader, ICSOption, ICSParameter } from "../../../Plugins/CobaltStrike/CSProfileTypes";
import { BaseBlock } from "../../BaseBlock";
import { CSCreateNew } from "./Controls/CSCreateNew";
import { CSKeyValueList } from "./Controls/CSKeyValueList";
import { CSOptionsList } from "./Controls/CSOptionsList";
import { CSTransformationFlow } from "./Controls/CSTransformationFlow";

interface Props {
    profile: any;
    stager: ICSBlockHttpStager;
    onProfileChanged: (profile: any) => void;
}

export const CSHttpStager = ({ profile, stager, onProfileChanged }: Props) => {
    const handleOptChange = (opts: ICSOption[]) => {
        stager.options = opts;
        onProfileChanged({ ...profile });
    }

    const createClient = () => {
        stager.client = {
            headers: [],
            parameters: []
        }
        onProfileChanged({ ...profile });
    }
    const removeClient = () => {
        stager.client = undefined;
        onProfileChanged({ ...profile });
    }
    const clientHeadersChanged = (headers: ICSHeader[]) => {
        if (stager.client) stager.client.headers = headers;
        onProfileChanged({ ...profile })
    }
    const clientParametersChanged = (parameters: ICSParameter[]) => {
        if (stager.client) stager.client.parameters = parameters;
        onProfileChanged({ ...profile })
    }
    const getClient = () => {
        return <>{
            stager.client && <>
                <BaseBlock titleVariant="h6" title="Headers" description="List of headers the beacon sends">
                    <CSKeyValueList onListChanged={clientHeadersChanged} list={stager.client.headers} />
                </BaseBlock>
                <BaseBlock titleVariant="h6" title="Parameters" description="List of parameters the beacon appends in URLs">
                    <CSKeyValueList onListChanged={clientParametersChanged} list={stager.client.parameters} />
                </BaseBlock>
            </>
        }</>;
    }

    const createServer = () => {
        stager.server = {
            headers: [],
            output: {
                transforms: [],
                termination: {
                    type: "print"
                }
            }
        }
        onProfileChanged({ ...profile });
    }
    const removeServer = () => {
        stager.server = undefined;
        onProfileChanged({ ...profile });
    }
    const serverHeadersChanged = (headers: ICSHeader[]) => {
        if (stager.server) stager.server.headers = headers;
        onProfileChanged({ ...profile })
    }
    const getServer = () => {
        return <>{
            stager.server && <>
                <BaseBlock titleVariant="h6" title="Headers" description="List of headers the beacon sends">
                    <CSKeyValueList onListChanged={serverHeadersChanged} list={stager.server.headers} />
                </BaseBlock>
                <BaseBlock titleVariant="h6" title="Output" description="Transformation of data sent by the teamserver" identifier={1} onBlockRemoved={stager.server.output ? removeServerOutput : undefined}>
                    <CSCreateNew item={stager.server.output} onCreate={createServerOutput} itemView={getServerOutput} />
                </BaseBlock>
            </>
        }</>
    }
    const getServerOutput = (meta: ICSBlockTransformInformation) => <CSTransformationFlow profile={profile} onProfileChanged={onProfileChanged} flow={meta} />

    const createServerOutput = () => {
        if (stager.server) {
            stager.server.output = {
                transforms: [],
                termination: { type: "print" }
            };
            onProfileChanged({ ...profile });
        }
    }

    const removeServerOutput = () => {
        if (stager.server && stager.server) {
            stager.server.output = undefined;
            onProfileChanged({ ...profile });
        }
    }

    return <>
        {/* Options */}
        <BaseBlock titleVariant="h6" title="Options" startExpanded>
            <CSOptionsList blockMetaName="http_stager" blockOptions={stager.options} onBlockOptionsChanged={handleOptChange} />
        </BaseBlock>
        {/* Client */}
        <BaseBlock titleVariant="h6" title="Client" description="Configure beacons' HTTP staging requests" identifier={1} onBlockRemoved={stager.client ? removeClient : undefined}>
            <CSCreateNew item={stager.client} onCreate={createClient} itemView={getClient} />
        </BaseBlock>
        {/* Server */}
        <BaseBlock titleVariant="h6" title="Server" description="Configure the teamserver's HTTP staging responses" identifier={1} onBlockRemoved={stager.server ? removeServer : undefined}>
            <CSCreateNew item={stager.server} onCreate={createServer} itemView={getServer} />
        </BaseBlock>
    </>
}