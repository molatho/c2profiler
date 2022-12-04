import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";
import { CSProfileHelper, ICSProfile, TopBlockDisplayNames, TopBlockName, TopBlockNames } from "../../Plugins/CobaltStrike/CSProfileTypes";
import { PaperItem } from "../PaperItems/PaperItem";
import { OptionsBlock } from "./EditBlocks/Controls/CSOptionsBlock";
import AddIcon from '@mui/icons-material/Add';
import IndentedAccordeon from "../IndentedAccordeon";
import { BaseBlock } from "./EditBlocks/BaseBlock";

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

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
            <>{missingBlocks.length > 0 ? <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>Blocks:</Typography>
                <Paper
                    sx={{
                        background: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        m: 0,
                    }}
                    component="ul"
                    elevation={0}
                > {missingBlocks.map((b, idx) => <ListItem key={idx}>
                    <Chip
                        icon={<AddIcon />}
                        label={TopBlockDisplayNames.get(b)}
                        size="small"
                        variant="outlined"
                        onClick={() => handleBlockAdd(b)}
                    />
                </ListItem>)}
                </Paper>
            </Stack> : <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ fontStyle: 'italic' }}>Your profile is fully populated.</Typography>
            </Stack>}
            </>
        </PaperItem>

        {/* Global: Has only blocks */}
        <PaperItem small>
            <OptionsBlock titleOverride="Global Options" titleVariant="h6" blockMetaName="global" blockOptions={csprofile.options} onBlockOptionsChanged={(opts) => onProfileChanged({
                ...profile,
                options: [...opts]
            })} />
        </PaperItem>
        {/* Simple blocks (options/headers only) */}
        {csprofile.code_signer &&
            <PaperItem small>
                <BaseBlock title={(TopBlockDisplayNames.get("code_signer") as string)} identifier="code_signer">
                    <OptionsBlock blockMetaName="code_signer" blockOptions={csprofile.code_signer.options} onBlockOptionsChanged={(opts) => {
                        profile.code_signer.options = opts;
                        onProfileChanged({ ...profile })
                    }} />
                </BaseBlock>
            </PaperItem>}
    </>
}