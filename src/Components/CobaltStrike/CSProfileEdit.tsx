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
import { ProfileChangedCb } from "../../Misc/IC2Provider";
import { Tabs, Tab, AppBar, Stack, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { CSHttpStager } from "./EditBlocks/CSHttpStager";
import { CSHttpConfig } from "./EditBlocks/CSHttpConfig";
import { CSProcessInject } from "./EditBlocks/CSProcessInject";


interface Props {
    profile: any;
    onProfileChanged: ProfileChangedCb;
}

export type TopBlockMetaName = "global" | TopBlockName;
const TopBlockMetaNames: string[] = ["global"].concat(TopBlockNames);

//TODO: Add TopBlockMetaName and render views conditionally

interface TabViewProps {
    csprofile: ICSProfile;
    onProfileChanged: ProfileChangedCb;
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
        name: "HTTP Config",
        type: "http_config",
        removable: true,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => csprofile.http_config && <CSHttpConfig profile={csprofile} config={csprofile.http_config} onProfileChanged={onProfileChanged} />
    },
    {
        name: "HTTPS Certificate",
        type: "https_certificate",
        removable: true,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => csprofile.https_certificate && <CSVariants profile={csprofile} container={csprofile.https_certificate} itemView={(i, opc) => <CSOptionsList blockMetaName="https_certificate" blockOptions={i.options} onBlockOptionsChanged={(opts) => {
            i.options = opts;
            onProfileChanged({ ...csprofile })
        }} />} onProfileChanged={onProfileChanged} createVariant={(c, n) => {
            c.variants.push(CSProfileHelper.create_https_certificate_variant(n))
            onProfileChanged({ ...csprofile })
        }} />
    },
    {
        name: "DNS Beacon",
        type: "dns_beacon",
        removable: true,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => csprofile.dns_beacon && <CSVariants profile={csprofile} container={csprofile.dns_beacon} itemView={(i, opc) => <CSOptionsList blockMetaName="dns_beacon" blockOptions={i.options} onBlockOptionsChanged={(opts) => {
            i.options = opts;
            onProfileChanged({ ...csprofile })
        }} />} onProfileChanged={onProfileChanged} createVariant={(c, n) => {
            c.variants.push(CSProfileHelper.create_dns_beacon_variant(n))
            onProfileChanged({ ...csprofile })
        }} />
    },
    {
        name: "Stage",
        type: "stage",
        removable: true,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => csprofile.stage && <CSStage profile={csprofile} stage={csprofile.stage} onProfileChanged={onProfileChanged} />
    },
    {
        name: "Post-Exploitation",
        type: "post_ex",
        removable: true,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => csprofile.post_ex && <CSOptionsList blockMetaName="post_ex" blockOptions={csprofile.post_ex.options} onBlockOptionsChanged={(opts) => {
            if (csprofile.post_ex) csprofile.post_ex.options = opts;
            onProfileChanged({ ...csprofile })
        }} />
    },
    {
        name: "Process Injection",
        type: "process_inject",
        removable: true,
        view: ({ csprofile, onProfileChanged }: TabViewProps) => csprofile.process_inject && <CSProcessInject profile={csprofile} pin={csprofile.process_inject} onProfileChanged={onProfileChanged} />
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
                        <Tabs
                            value={viewIdx}
                            onChange={(_, newIdx) => setViewIdx(newIdx)}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            sx={{ width: '100%' }}>
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