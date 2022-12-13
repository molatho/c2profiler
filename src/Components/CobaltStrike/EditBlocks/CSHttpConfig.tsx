import { ICSBlockHttpConfig, ICSHeader, ICSOption } from "../../../Plugins/CobaltStrike/CSProfileTypes";
import { BaseBlock } from "../../BaseBlock";
import { CSKeyValueList } from "./Controls/CSKeyValueList";
import { CSOptionsList } from "./Controls/CSOptionsList";

interface Props {
    profile: any;
    config: ICSBlockHttpConfig;
    onProfileChanged: (profile: any) => void;
}

export const CSHttpConfig = ({ profile, config, onProfileChanged }: Props) => {
    const handleOptChange = (opts: ICSOption[]) => {
        config.options = opts;
        onProfileChanged({ ...profile });
    }
    const handleHeadersChanged = (headers: ICSHeader[]) => {
        config.headers = headers;
        onProfileChanged({ ...profile })
    }

    return <>
        {/* Options */}
        <BaseBlock titleVariant="h6" title="Options" startExpanded>
            <CSOptionsList blockMetaName="http_config" blockOptions={config.options} onBlockOptionsChanged={handleOptChange} />
        </BaseBlock>
        {/* Headers */}
        <BaseBlock titleVariant="h6" title="Headers">
            <CSKeyValueList onListChanged={handleHeadersChanged} list={config.headers} />
        </BaseBlock>
    </>
}