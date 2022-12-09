import { Stack, Typography, Paper, Chip } from "@mui/material";
import { styled } from '@mui/material/styles';
import { TopBlockName, IMetaTopBlockDefinition } from "../../../../Plugins/CobaltStrike/CSMetadataTypes";
import { InfoAddChip } from "../../../InfoAddChip";
import metadata from "../../../../Plugins/CobaltStrike/metadata.json"

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

interface Props {
    missingBlocks: TopBlockName[];
    onBlockAdd: (name: TopBlockName) => void;
}

export const CSAddBlockList = ({ missingBlocks, onBlockAdd }: Props) => {

    const getMetaData = (name: TopBlockName): IMetaTopBlockDefinition => metadata.blocks[name];

    return <>{missingBlocks.length > 0 ? <Stack direction="row" alignItems="center" spacing={2}>
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
            <InfoAddChip
                label={metadata.blocks[b].displayName}
                description={getMetaData(b).description}
                link={getMetaData(b).link}
                onClick={() => onBlockAdd(b)}
            />
        </ListItem>)}
        </Paper>
    </Stack> : <Stack direction="row" alignItems="center" spacing={2}>
        <Typography sx={{ fontStyle: 'italic' }}>Your profile is fully populated.</Typography>
    </Stack>}
    </>
}