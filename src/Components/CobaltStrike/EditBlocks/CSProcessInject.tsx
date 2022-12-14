import { ICSBlockProcessInject, ICSOption, ICSPayloadTransform } from "../../../Plugins/CobaltStrike/CSProfileTypes";
import { BaseBlock } from "../../BaseBlock";
import { CSCreateNew } from "./Controls/CSCreateNew";
import { CSOptionsList } from "./Controls/CSOptionsList";
import { CSPayloadTransform } from "./Controls/CSPayloadTransform";
import { CSProcessInjectExecuteFlow } from "./Controls/CSProcessInjectExecuteFlow";

interface Props {
    profile: any;
    pin: ICSBlockProcessInject;
    onProfileChanged: (profile: any) => void;
}

export const CSProcessInject = ({ profile, pin, onProfileChanged }: Props) => {
    const handleOptChange = (opts: ICSOption[]) => {
        pin.options = opts;
        onProfileChanged({ ...profile });
    }

    const removeTransform = (name: "transform-x86" | "transform-x64") => {
        pin[name] = undefined;
        onProfileChanged({ ...profile });
    }

    const createTransform = (name: "transform-x86" | "transform-x64") => {
        pin[name] = {
            type: name,
            operations: []
        };
        onProfileChanged({ ...profile });
    }

    const createExecute = () => {
        pin.execute = { commands: [] };
        onProfileChanged({ ...profile });
    }

    const getTransform = (transform: ICSPayloadTransform) => <CSPayloadTransform profile={profile} onProfileChanged={onProfileChanged} payload={transform} />

    return <>
        {/* Options */}
        <BaseBlock titleVariant="h6" title="Options" startExpanded>
            <CSOptionsList blockMetaName="process_inject" blockOptions={pin.options} onBlockOptionsChanged={handleOptChange} />
        </BaseBlock>
        {/* Transform x86 */}
        <BaseBlock titleVariant="h6" title="Transform x86" description="TODO" identifier="transform-x86" onBlockRemoved={pin["transform-x86"] ? removeTransform : undefined}>
            <CSCreateNew item={pin["transform-x86"]} onCreate={() => createTransform("transform-x86")} itemView={() => getTransform(pin["transform-x86"] as ICSPayloadTransform)} />
        </BaseBlock>
        {/* Transform x64 */}
        <BaseBlock titleVariant="h6" title="Transform x64" description="TODO" identifier="transform-x64" onBlockRemoved={pin["transform-x64"] ? removeTransform : undefined}>
            <CSCreateNew item={pin["transform-x64"]} onCreate={() => createTransform("transform-x64")} itemView={() => getTransform(pin["transform-x64"] as ICSPayloadTransform)} />
        </BaseBlock>
        {/* Execute */}
        <BaseBlock titleVariant="h6" title="Execute" startExpanded>
            <CSCreateNew item={pin.execute} onCreate={createExecute} itemView={(i) => <CSProcessInjectExecuteFlow
                profile={profile}
                onProfileChanged={onProfileChanged}
                execute={i}
            />} />
        </BaseBlock>
    </>
}