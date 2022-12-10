import { ICSBlockStage, ICSOption, ICSPayloadTransform } from "../../../Plugins/CobaltStrike/CSProfileTypes";
import { BaseBlock } from "../../BaseBlock";
import { CSCreateNew } from "./Controls/CSCreateNew";
import { CSOptionsList } from "./Controls/CSOptionsList";
import { CSPayloadTransform } from "./Controls/CSPayloadTransform";

interface Props {
    profile: any;
    stage: ICSBlockStage;
    onProfileChanged: (profile: any) => void;
}

export const CSStage = ({ profile, stage, onProfileChanged }: Props) => {
    const handleOptChange = (opts: ICSOption[]) => {
        stage.options = opts;
        onProfileChanged({
            ...profile
        });
    }

    const removeTransform = (name: "transform-x86" | "transform-x64") => {
        stage[name] = undefined;
        onProfileChanged({
            ...profile
        })
    }

    const createTransform = (name: "transform-x86" | "transform-x64") => {
        stage[name] = {
            type: name,
            operations: []
        }
        onProfileChanged({
            ...profile
        })
    }

    const getTransform = (transform: ICSPayloadTransform) => <CSPayloadTransform profile={profile} onProfileChanged={onProfileChanged} payload={transform} />

    return <>
        {/* Options */}
        <BaseBlock titleVariant="h6" title="Options" startExpanded>
            <CSOptionsList blockMetaName="stage" blockOptions={stage.options} onBlockOptionsChanged={handleOptChange} />
        </BaseBlock>
        {/* Transform x86 */}
        <BaseBlock titleVariant="h6" title="Transform x86" description="TODO" identifier="transform-x86" onBlockRemoved={stage["transform-x86"] ? removeTransform : undefined}>
            <CSCreateNew item={stage["transform-x86"]} onCreate={() => createTransform("transform-x86")} itemView={() => getTransform(stage["transform-x86"] as ICSPayloadTransform)} />
        </BaseBlock>
        {/* Transform x64 */}
        <BaseBlock titleVariant="h6" title="Transform x64" description="TODO" identifier="transform-x64" onBlockRemoved={stage["transform-x64"] ? removeTransform : undefined}>
            <CSCreateNew item={stage["transform-x64"]} onCreate={() => createTransform("transform-x64")} itemView={() => getTransform(stage["transform-x64"] as ICSPayloadTransform)} />
        </BaseBlock>
        {/* TODO: Commands */}
    </>
}