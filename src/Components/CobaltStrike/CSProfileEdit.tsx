import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";
import { PaperItem } from "../PaperItems/PaperItem";
import { CSOptionsList } from "./EditBlocks/Controls/CSOptionsList";
import { CSAddBlockList } from "./EditBlocks/Controls/CSAddBlock";
import { CSVariants } from "./EditBlocks/Controls/CSVariants";
import { CSHttpGet } from "./EditBlocks/CSHttpGet";
import { TopBlockName, TopBlockNames } from "../../Plugins/CobaltStrike/CSMetadataTypes";
import { CSProfileHelper } from "../../Plugins/CobaltStrike/CSProfileHelper";
import { CSHttpPost } from "./EditBlocks/CSHttpPost";
import { CSStage } from "./EditBlocks/CSStage";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { ExportChangedCb } from "../../Misc/IC2Provider";
import { Tabs, Tab, AppBar, Stack, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { CSHttpStager } from "./EditBlocks/CSHttpStager";

interface Props {
    profile: any;
    onProfileChanged: ExportChangedCb;
}

export type TopBlockMetaName = "global" | TopBlockName;
const TopBlockMetaNames: string[] = ["global"].concat(TopBlockNames);

//TODO: Add TopBlockMetaName and render views conditionally

interface TabViewProps {
    csprofile: ICSProfile;
    onProfileChanged: ExportChangedCb;
}

const TAB_DATA = [
    {
        name: "Global Options",
        type: "global",
        removable: false,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => <CSOptionsList blockMetaName="global" blockOptions={csprofile.options} onBlockOptionsChanged={(opts) => onProfileChanged({
            ...csprofile,
            options: [...opts]
        })} />
    },
    {
        name: "Code Signer",
        type: "code_signer",
        removable: true,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => csprofile.code_signer && <CSOptionsList blockMetaName="code_signer" blockOptions={csprofile.code_signer.options} onBlockOptionsChanged={(opts) => {
            if (csprofile.code_signer) csprofile.code_signer.options = opts;
            onProfileChanged({ ...csprofile })
        }} />
    },
    {
        name: "HTTP Get",
        type: "http_get",
        removable: true,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => csprofile.http_get && <CSVariants profile={csprofile} container={csprofile.http_get} itemView={(i, opc) => <CSHttpGet profile={csprofile} item={i} onProfileChanged={opc} />} onProfileChanged={onProfileChanged} createVariant={(c, n) => {
            c.variants.push(CSProfileHelper.create_http_get_variant(n))
            onProfileChanged({ ...csprofile })
        }} />
    },
    {
        name: "HTTP Stager",
        type: "http_stager",
        removable: true,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => csprofile.http_stager && <CSVariants profile={csprofile} container={csprofile.http_stager} itemView={(i, opc) => <CSHttpStager profile={csprofile} stager={i} onProfileChanged={opc} />} onProfileChanged={onProfileChanged} createVariant={(c, n) => {
            c.variants.push(CSProfileHelper.create_http_stager_variant(n))
            onProfileChanged({ ...csprofile })
        }} />
    },
    {
        name: "HTTP Post",
        type: "http_post",
        removable: true,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => csprofile.http_post && <CSVariants profile={csprofile} container={csprofile.http_post} itemView={(i, opc) => <CSHttpPost profile={csprofile} item={i} onProfileChanged={opc} />} onProfileChanged={onProfileChanged} createVariant={(c, n) => {
            c.variants.push(CSProfileHelper.create_http_post_variant(n))
            onProfileChanged({ ...csprofile })
        }} />
    },
    {
        name: "Stage",
        type: "stage",
        removable: true,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => csprofile.stage && <CSStage profile={csprofile} stage={csprofile.stage} onProfileChanged={onProfileChanged} />
    }
]

export const CSProfileEdit = ({ profile, onProfileChanged }: Props) => {
    const [viewIdx, setViewIdx] = useState(0);
    const csprofile = profile as ICSProfile;

    const hasMetaBlock = (blockName: TopBlockMetaName) => blockName == "global" || hasBlock(blockName as TopBlockName);
    const hasBlock = (blockName: TopBlockName) => csprofile && csprofile[blockName];
    const existingBlocks: TopBlockName[] = TopBlockNames.filter(b => hasBlock(b));
    const missingBlocks: TopBlockName[] = TopBlockNames.filter(b => !hasBlock(b));

    const handleBlockRemoval = (blockName: TopBlockName) => {
        if (viewIdx == getAvailableBlocks().length - 1) setViewIdx(viewIdx - 1);
        onProfileChanged({ ...CSProfileHelper.remove_top_block(csprofile, blockName) });
    }

    const handleBlockAdd = (blockName: TopBlockName) => {
        onProfileChanged({ ...CSProfileHelper.create_top_block(csprofile, blockName) });
    }

    const getAvailableBlocks = () => TAB_DATA.filter(d => hasMetaBlock(d.type as TopBlockMetaName)).sort((a, b) => a.name.localeCompare(b.name));
    const currentBlock = getAvailableBlocks()[viewIdx];

    const getBlockView = () => {
        const BlockView: (props: TabViewProps) => JSX.Element | null = currentBlock.view;
        if (BlockView) return <BlockView csprofile={csprofile} onProfileChanged={onProfileChanged} />
        else return <></>
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
        {/* Tabs for contents */}
        <PaperItem small>
            <>
                <AppBar position="sticky">
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ paddingLeft: 2, paddingRight: 2 }}>Blocks:</Typography>
                        <Tabs value={viewIdx} onChange={(_, newIdx) => setViewIdx(newIdx)} sx={{ width: '100%' }}>
                            {getAvailableBlocks().map((d, i) => <Tab key={i} label={d.name} sx={{ textTransform: 'none' }} />)}
                        </Tabs>
                        <IconButton disabled={!currentBlock.removable} color="error" onClick={() => handleBlockRemoval(currentBlock.type as TopBlockName)}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </AppBar>
                {getBlockView()}
            </>
        </PaperItem >
    </>
}