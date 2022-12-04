import { Stack, Typography, Paper, Chip } from "@mui/material";
import { TopBlockDisplayNames, TopBlockName } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';


const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

interface Props {
    missingBlocks: TopBlockName[];
    onBlockAdd: (name: TopBlockName) => void;
}

export const CSAddBlockList = ({ missingBlocks, onBlockAdd }: Props) => {
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
            <Chip
                icon={<AddIcon />}
                label={TopBlockDisplayNames.get(b)}
                size="small"
                variant="outlined"
                onClick={() => onBlockAdd(b)}
            />
        </ListItem>)}
        </Paper>
    </Stack> : <Stack direction="row" alignItems="center" spacing={2}>
        <Typography sx={{ fontStyle: 'italic' }}>Your profile is fully populated.</Typography>
    </Stack>}
    </>
}