// Tranforms: (append [i][+]) (mask[i][+])
// Flow (append [operand][h/s][x]) => (mask [x]) =>  

import { Stack, Grid, Typography, TextField, Card, CardContent, Button, IconButton, TableContainer, Paper, Table, TableCell, TableHead, TableRow, TableBody, ButtonGroup, SelectChangeEvent, Select, MenuItem, Icon } from "@mui/material";
import { IMetaPayloadTransformDefinition, IMetaTerminationDefinition, IMetaTransformDefinition, PayloadTransformName, PayloadTransformNames, TerminationName, TerminationNames, TransformName, TransformNames } from "../../../../Plugins/CobaltStrike/CSMetadataTypes";
import { ICSBlockTransformInformation, ICSDataTransform, ICSPayloadTransform, ICSPayloadTransformOperation } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import metadata from "../../../../Plugins/CobaltStrike/metadata.json"
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './CSTransformationFlow.css';
import { SupportIconTooltip } from "../../../SupportIconTooltip";
import { InfoAddChip } from "../../../InfoAddChip";
import { CodeTextField } from "../../../CodeTextField";

interface TransformItemProps {
    meta: IMetaPayloadTransformDefinition;
    transform: ICSPayloadTransformOperation;
    isFirst: boolean;
    isLast: boolean;
    onChanged: () => void;
    onRemove: () => void;
    onMove: (dir: number) => void;
    idx: number;
}


const TransformRow = ({ meta, transform, isFirst, isLast, onChanged, onRemove, onMove, idx }: TransformItemProps) => {
    const onOperand1Changed = (value: string) => {
        transform.operand1 = value;
        onChanged();
    }

    const onOperand2Changed = (value: string) => {
        transform.operand2 = value;
        onChanged();
    }

    const getSingleOperandRow = () => <CodeTextField
        value={transform.operand1 ? transform.operand1 : ""}
        onChange={(ev) => onOperand1Changed(ev.target.value)}
        InputLabelProps={{
            shrink: true,
        }}
        size="small"
        multiline
        fullWidth
        error={!transform.operand1 ? true : false}
        placeholder="Value required"
    />

    const getDoubleOperandRow = () => <Grid container>
        <Grid item xs={6}>
            <CodeTextField
                value={transform.operand1 ? transform.operand1 : ""}
                onChange={(ev) => onOperand1Changed(ev.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                size="small"
                multiline
                fullWidth
                error={!transform.operand1 ? true : false}
                placeholder="Value required"
            />
        </Grid>
        <Grid item xs={6}>
            <CodeTextField
                value={transform.operand2 ? transform.operand2 : ""}
                onChange={(ev) => onOperand2Changed(ev.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                size="small"
                multiline
                fullWidth
                error={!transform.operand2 ? true : false}
                placeholder="Value required"
            />
        </Grid>
    </Grid>

    return <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell>{`${idx + 1}.`}</TableCell>
        <TableCell>{metadata.payloadTransforms[transform.type].displayName}</TableCell>
        <TableCell component="th" scope="row">
            {meta.operand2
                ? getDoubleOperandRow()
                : getSingleOperandRow()
            }
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
    payload: ICSPayloadTransform;
    onProfileChanged: (profile: any) => void;
}

export const CSPayloadTransform = ({ profile, payload, onProfileChanged }: Props) => {
    const addTransform = (name: PayloadTransformName) => {
        payload.operations.push({
            "type": name,
            "operand1": ""
        });
        onProfileChanged({ ...profile });
    }

    const removeTransform = (idx: number) => {
        payload.operations = payload.operations.filter((_, i) => i != idx);
        onProfileChanged({ ...profile });
    }

    const handleMove = (idx: number, dir: number) => {
        const tmp = payload.operations[idx];
        payload.operations[idx] = payload.operations[idx + dir];
        payload.operations[idx + dir] = tmp;
        onProfileChanged({ ...profile });
    }

    const getTransformMetadata = (name: PayloadTransformName): IMetaPayloadTransformDefinition => metadata.payloadTransforms[name] as IMetaPayloadTransformDefinition;

    return <>
        <Grid container spacing={2}>
            {/* Help */}
            <Grid item xs={12}>
                <Typography variant="body2"> TODO: Help</Typography>
            </Grid>
            {/* Transform selection */}
            <Grid item xs={12}>
                <Typography variant="subtitle1">Transformations:</Typography>
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
                    {PayloadTransformNames.map((n, i) => <InfoAddChip key={i} label={metadata.payloadTransforms[n].displayName} description={getTransformMetadata(n).description} onClick={() => addTransform(n)} />)}
                </Stack>
            </Grid>
            {/* Flow display */}
            <Grid item xs={12} sx={{ marginTop: 4 }}>
                <Typography variant="subtitle1">Resulting chain:</Typography>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">#</TableCell>
                                <TableCell>Transform</TableCell>
                                <TableCell align="center">Operand</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payload.operations && payload.operations.map((t, i) => <TransformRow
                                key={i}
                                meta={getTransformMetadata(t.type)}
                                transform={t}
                                onChanged={() => onProfileChanged({ ...profile })}
                                onRemove={() => removeTransform(i)}
                                isFirst={i == 0}
                                isLast={i == payload.operations.length - 1}
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