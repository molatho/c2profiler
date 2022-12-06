// Tranforms: (append [i][+]) (mask[i][+])
// Flow (append [operand][h/s][x]) => (mask [x]) =>  

import { Tooltip, Chip, Stack, Grid, Typography, TextField, Card, CardContent, Button, IconButton, TableContainer, Paper, Table, TableCell, TableHead, TableRow, TableBody, ButtonGroup } from "@mui/material";
import { IMetaTransformDefinition, TransformDisplayNames, TransformName, TransformNames } from "../../../../Plugins/CobaltStrike/CSMetadataTypes";
import { ICSBlockTransformInformation, ICSDataTransform } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import metadata from "../../../../Plugins/CobaltStrike/metadata.json"
import InfoIcon from '@mui/icons-material/Info';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './CSTransformationFlow.css';


interface InfoAddChipProps {
    label?: string;
    description: string;
    onClick: () => void;
}

const InfoAddChip = ({ label, description, onClick }: InfoAddChipProps) => {
    return (
        <Chip
            label={label}
            variant="outlined"
            onDelete={() => onClick()}
            deleteIcon={<AddCircleIcon />}
            icon={<Tooltip title={description}><InfoIcon /></Tooltip>}
        />
    )
}

interface TransformItemProps {
    meta: IMetaTransformDefinition;
    transform: ICSDataTransform;
    isFirst: boolean;
    isLast: boolean;
    onChanged: () => void;
    onRemove: () => void;
    onMove: (dir: number) => void;
    idx: number;
}


const TransformRow = ({ meta, transform, isFirst, isLast, onChanged, onRemove, onMove, idx }: TransformItemProps) => {
    const onValueChanged = (value: string) => {
        transform.operand = value;
        onChanged();
    }

    return <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell>{`${idx + 1}. ${TransformDisplayNames.get(transform.type)}`}</TableCell>
        <TableCell component="th" scope="row">
            {meta.operand ?
                <TextField
                    value={transform.operand ? transform.operand : ""}
                    onChange={(ev) => onValueChanged(ev.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                    multiline
                    fullWidth
                    error={!transform.operand ? true : false}
                    placeholder="Value required"
                /> :
                <Typography sx={{fontStyle:'italic'}}>n/a</Typography>}
        </TableCell>
        <TableCell align="right" sx={{ width: '1px', whiteSpace: 'nowrap' }}>
            <ButtonGroup variant="text">
                <IconButton color="primary" disabled={isFirst} onClick={() => onMove(-1)}>
                    <KeyboardArrowUpIcon />
                </IconButton>
                <IconButton color="primary" disabled={isLast} onClick={() => onMove(1)}>
                    <KeyboardArrowDownIcon />
                </IconButton>
                <IconButton color="error" onClick={onRemove}>
                    <DeleteIcon />
                </IconButton>
            </ButtonGroup>
        </TableCell>
    </TableRow>;
}

interface Props {
    profile: any;
    flow: ICSBlockTransformInformation;
    onProfileChanged: (profile: any) => void;
}

export const CSTransformationFlow = ({ profile, flow, onProfileChanged }: Props) => {
    const addTransform = (name: TransformName) => {
        flow.transforms.push({
            "type": name
        });
        onProfileChanged({ ...profile });
    }

    const removeTransform = (idx: number) => {
        flow.transforms = flow.transforms.filter((_, i) => i != idx);
        onProfileChanged({ ...profile });
    }

    const handleMove = (idx: number, dir: number) => {
        const tmp = flow.transforms[idx];
        flow.transforms[idx] = flow.transforms[idx + dir];
        flow.transforms[idx + dir] = tmp;
        onProfileChanged({ ...profile });
    }

    const getMetadata = (name: TransformName): IMetaTransformDefinition => metadata.transforms[name] as IMetaTransformDefinition;

    return <>
        <Grid container spacing={2}>
            {/* Transform selection */}
            <Grid item xs={12}>
                <Typography>Transformations:</Typography>
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{
                    background: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                }}>
                    {TransformNames.map((n, i) => <InfoAddChip key={i} label={TransformDisplayNames.get(n)} description={getMetadata(n).description} onClick={() => addTransform(n)} />)}
                </Stack>
            </Grid>
            {/* Flow display */}
            <Grid item xs={12}>
                <Typography>Resulting chain:</Typography>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Transform</TableCell>
                                <TableCell align="center">Operand</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {flow.transforms && flow.transforms.map((t, i) => <TransformRow
                                key={i}
                                meta={getMetadata(t.type)}
                                transform={t}
                                onChanged={() => onProfileChanged({ ...profile })}
                                onRemove={() => removeTransform(i)}
                                isFirst={i == 0}
                                isLast={i == flow.transforms.length - 1}
                                onMove={(dir) => handleMove(i, dir)}
                                idx={i}
                            />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    </>
}