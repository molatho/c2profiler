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
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { ExportChangedCb } from "../../Misc/IC2Provider";
import { Tabs, Tab, AppBar } from "@mui/material";

interface Props {
    profile: any;
    onProfileChanged: ExportChangedCb;
}

export type TopBlockMetaName = "global" | TopBlockName;
const TopBlockMetaNames: string[] = ["global"].concat(TopBlockNames);

//TODO: Add TopBlockMetaName and render views conditionally
const TAB_DATA = [
    {
        name: "Global Options",
        view: (csprofile: ICSProfile, onProfileChanged: ExportChangedCb) => <CSOptionsList blockMetaName="global" blockOptions={csprofile.options} onBlockOptionsChanged={(opts) => onProfileChanged({
            ...csprofile,
            options: [...opts]
        })} />
    },
    {
        name: "Code Signer",
        view: (csprofile: ICSProfile, onProfileChanged: ExportChangedCb) => csprofile.code_signer && <CSOptionsList blockMetaName="code_signer" blockOptions={csprofile.code_signer.options} onBlockOptionsChanged={(opts) => {
            if (csprofile.code_signer) csprofile.code_signer.options = opts;
            onProfileChanged({ ...csprofile })
        }} />
    },
    {
        name: "HTTP Get",
        view: (csprofile: ICSProfile, onProfileChanged: ExportChangedCb) => csprofile.http_get && <CSVariants profile={csprofile} container={csprofile.http_get} itemView={(i, opc) => <CSHttpGet profile={csprofile} item={i} onProfileChanged={opc} />} onProfileChanged={onProfileChanged} createVariant={(c, n) => {
            c.variants.push(CSProfileHelper.create_http_get_variant(n))
            onProfileChanged({ ...csprofile })
        }} />
    },
    {
        name: "HTTP Post",
        view: (csprofile: ICSProfile, onProfileChanged: ExportChangedCb) => csprofile.http_post && <CSVariants profile={csprofile} container={csprofile.http_post} itemView={(i, opc) => <CSHttpPost profile={csprofile} item={i} onProfileChanged={opc} />} onProfileChanged={onProfileChanged} createVariant={(c, n) => {
            c.variants.push(CSProfileHelper.create_http_post_variant(n))
            onProfileChanged({ ...csprofile })
        }} />
    },
    {
        name: "Stage",
        view: (csprofile: ICSProfile, onProfileChanged: ExportChangedCb) => csprofile.stage && <CSStage profile={csprofile} stage={csprofile.stage} onProfileChanged={onProfileChanged} />
    }
]

export const CSProfileEdit = ({ profile, onProfileChanged }: Props) => {
    const [viewIdx, setViewIdx] = useState(0);
    const csprofile = profile as ICSProfile;

    const hasBlock = (blockName: TopBlockName) => csprofile && csprofile[blockName];
    const existingBlocks: TopBlockName[] = TopBlockNames.filter(b => hasBlock(b));
    const missingBlocks: TopBlockName[] = TopBlockNames.filter(b => !hasBlock(b));

    const handleBlockRemoval = (blockName: TopBlockName) => {
        onProfileChanged({ ...CSProfileHelper.remove_top_block(csprofile, blockName) });
    }

    const handleBlockAdd = (blockName: TopBlockName) => {
        onProfileChanged({ ...CSProfileHelper.create_top_block(csprofile, blockName) });
    }

    return <>
        {/* CS Help */}
        <PaperItem>
            <>
                <Typography align="center" variant="h4" gutterBottom>Malleable Profile Editing</Typography>
                <Typography align="center">Here you can edit your Cobalt Strike malleable profile and add, remove, and configure blocks.</Typography>
            </>
        </PaperItem>
        {/* Chips: one for each block */}
        <PaperItem>
            <CSAddBlockList missingBlocks={missingBlocks} onBlockAdd={handleBlockAdd} />
        </PaperItem>

        {/* Global: Has only blocks */}
        <PaperItem small>
            <>
                <AppBar position="sticky">
                    <Tabs value={viewIdx} onChange={(_, newIdx) => setViewIdx(newIdx)}>
                        {TAB_DATA.filter(() => true).map((d, i) => <Tab label={d.name} />)}
                    </Tabs>
                </AppBar>
                {TAB_DATA[viewIdx].view(csprofile, onProfileChanged)}
            </>
        </PaperItem >
    </>
}