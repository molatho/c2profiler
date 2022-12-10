import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";
import { PaperItem } from "../PaperItems/PaperItem";
import { CSOptionsList } from "./EditBlocks/Controls/CSOptionsList";
import { BaseBlock } from "../BaseBlock";
import { CSAddBlockList } from "./EditBlocks/Controls/CSAddBlock";
import { CSVariants } from "./EditBlocks/Controls/CSVariants";
import { CSHttpGet } from "./EditBlocks/CSHttpGet";
import { TopBlockName, TopBlockNames } from "../../Plugins/CobaltStrike/CSMetadataTypes";
import { CSProfileHelper } from "../../Plugins/CobaltStrike/CSProfileHelper";
import metadata from "../../Plugins/CobaltStrike/metadata.json"
import { CSHttpPost } from "./EditBlocks/CSHttpPost";
import { CSStage } from "./EditBlocks/CSStage";

interface Props {
    profile: any;
    onProfileChanged: (profile: any) => void;
}

export type TopBlockMetaName = "global" | TopBlockName;
const TopBlockMetaNames: string[] = ["global"].concat(TopBlockNames);

export const CSProfileEdit = ({ profile, onProfileChanged }: Props) => {
    const csprofile = profile as ICSProfile;

    const hasBlock = (blockName: TopBlockName) => csprofile[blockName];
    const existingBlocks: TopBlockName[] = TopBlockNames.filter(b => hasBlock(b));
    const missingBlocks: TopBlockName[] = TopBlockNames.filter(b => !hasBlock(b));

    const handleBlockRemoval = (blockName: TopBlockName) => {
        onProfileChanged({ ...CSProfileHelper.remove_top_block(profile as ICSProfile, blockName) });
    }

    const handleBlockAdd = (blockName: TopBlockName) => {
        onProfileChanged({ ...CSProfileHelper.create_top_block(profile as ICSProfile, blockName) });
    }

    return <>
        {/* Chips: one for each block */}
        <PaperItem>
            <CSAddBlockList missingBlocks={missingBlocks} onBlockAdd={handleBlockAdd} />
        </PaperItem>

        {/* Global: Has only blocks */}
        <PaperItem small>
            <BaseBlock titleVariant="h6" title="Global Options">
                <CSOptionsList blockMetaName="global" blockOptions={csprofile.options} onBlockOptionsChanged={(opts) => onProfileChanged({
                    ...profile,
                    options: [...opts]
                })} />
            </BaseBlock>
        </PaperItem>

        {/* Simple blocks (options/headers only) */}
        {csprofile.code_signer &&
            <PaperItem small>
                <BaseBlock titleVariant="h6" title={(metadata.blocks["code_signer"].displayName)} identifier="code_signer" onBlockRemoved={handleBlockRemoval}>
                    <CSOptionsList blockMetaName="code_signer" blockOptions={csprofile.code_signer.options} onBlockOptionsChanged={(opts) => {
                        profile.code_signer.options = opts;
                        onProfileChanged({ ...profile })
                    }} />
                </BaseBlock>
            </PaperItem>}

        {/* Variants blocks (e.g. http-get) */}
        {csprofile.http_get &&
            <PaperItem small>
                <BaseBlock titleVariant="h6" title={(metadata.blocks["http_get"].displayName)} identifier="http_get" onBlockRemoved={handleBlockRemoval}>
                    <CSVariants profile={csprofile} container={csprofile.http_get} itemView={(i, opc) => <CSHttpGet profile={csprofile} item={i} onProfileChanged={opc} />} onProfileChanged={onProfileChanged} createVariant={(c, n) => {
                        c.variants.push(CSProfileHelper.create_http_get_variant(n))
                        onProfileChanged({ ...profile })
                    }} />
                </BaseBlock>
            </PaperItem>}
        {csprofile.http_post &&
            <PaperItem small>
                <BaseBlock titleVariant="h6" title={(metadata.blocks["http_post"].displayName)} identifier="http_post" onBlockRemoved={handleBlockRemoval}>
                    <CSVariants profile={csprofile} container={csprofile.http_post} itemView={(i, opc) => <CSHttpPost profile={csprofile} item={i} onProfileChanged={opc} />} onProfileChanged={onProfileChanged} createVariant={(c, n) => {
                        c.variants.push(CSProfileHelper.create_http_post_variant(n))
                        onProfileChanged({ ...profile })
                    }} />
                </BaseBlock>
            </PaperItem>}

        {/* Individual blocks (e.g. stage) */}
        {csprofile.stage &&
            <PaperItem small>
                <BaseBlock titleVariant="h6" title={(metadata.blocks["stage"].displayName)} identifier="stage" onBlockRemoved={handleBlockRemoval}>
                    <CSStage profile={csprofile} stage={csprofile.stage} onProfileChanged={onProfileChanged} />
                </BaseBlock>
            </PaperItem>}
    </>
}