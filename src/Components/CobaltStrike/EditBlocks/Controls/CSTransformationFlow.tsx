// Tranforms: (append [i][+]) (mask[i][+])
// Flow (append [operand][h/s][x]) => (mask [x]) =>  

import CodeMirror from '@uiw/react-codemirror';
import { Stack, Grid, Typography, IconButton, TableContainer, Paper, Table, TableCell, TableHead, TableRow, TableBody, ButtonGroup, SelectChangeEvent, Select, MenuItem } from "@mui/material";
import { IMetaTerminationDefinition, IMetaTransformDefinition, TerminationName, TerminationNames, TransformName, TransformNames } from "../../../../Plugins/CobaltStrike/CSMetadataTypes";
import { ICSBlockTransformInformation, ICSDataTransform } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import metadata from "../../../../Plugins/CobaltStrike/metadata.json"
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './CSTransformationFlow.css';
import { SupportIconTooltip } from "../../../SupportIconTooltip";
import { InfoAddChip } from "../../../InfoAddChip";
import { CodeTextField } from "../../../Misc/CodeTextField";
import { CSProfileToHttpFormatter } from "../../../../Plugins/CobaltStrike/CSProfileFormatter";
import { EditorView } from '@codemirror/view';

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
        <TableCell>{`${idx + 1}.`}</TableCell>
        <TableCell>{meta.displayName}</TableCell>
        <TableCell component="th" scope="row">
            {meta.operand &&
                <CodeTextField
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
                />}
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

    const handleTerminationSelect = (event: SelectChangeEvent) => {
        flow.termination.type = event.target.value as TerminationName;
        onProfileChanged({ ...profile });
    };

    const handleTerminationOperand = (event: React.ChangeEvent<HTMLInputElement>) => {
        flow.termination.operand = event.currentTarget.value;
        onProfileChanged({ ...profile });
    };

    const getTransformMetadata = (name: TransformName): IMetaTransformDefinition => metadata.transforms[name] as IMetaTransformDefinition;
    const getTerminationMetadata = (name: TerminationName): IMetaTerminationDefinition => metadata.terminations[name] as IMetaTerminationDefinition;

    //TODO: Put help into InfoAlert
    return <>
        <Grid container spacing={2}>
            {/* Help */}
            <Grid item xs={12}>
                <Typography variant="body2">Cobalt Strike's &quot;Data Transformation Language&quot; allows you to define a sequence of transformations applied to data sent via beacons. You need to specify where the data is stored, the &quot;termination&quot;. </Typography>
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
                    {TransformNames.map((n, i) => <InfoAddChip key={i} label={metadata.transforms[n].displayName} description={getTransformMetadata(n).description} onClick={() => addTransform(n)} />)}
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
                            {flow.transforms && flow.transforms.map((t, i) => <TransformRow
                                key={i}
                                meta={getTransformMetadata(t.type)}
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
            {/* Termination */}
            <Grid item xs={12} sx={{ marginTop: 4 }}>
                <Typography variant="subtitle1">Termination:</Typography>
            </Grid>
            <Grid item xs={3}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography>Type:</Typography>
                    <Select
                        value={flow.termination.type}
                        size="small"
                        onChange={handleTerminationSelect}
                    >
                        {TerminationNames.map((n, i) => <MenuItem key={i} value={n}>
                            <Stack direction="row" spacing={2}>
                                <Typography> {metadata.terminations[n].displayName} </Typography>
                                <SupportIconTooltip description={getTerminationMetadata(n).description} />
                            </Stack>
                        </MenuItem>)}
                    </Select>
                </Stack>
            </Grid>
            <Grid item xs>
                <CodeTextField
                    value={flow.termination.operand ? flow.termination.operand : ""}
                    onChange={handleTerminationOperand}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                    fullWidth
                    error={getTerminationMetadata(flow.termination.type).operand && (flow.termination.operand === undefined || (flow.termination.operand?.length === 0))}
                    disabled={!getTerminationMetadata(flow.termination.type).operand}
                    placeholder={getTerminationMetadata(flow.termination.type).operand ? "Operand" : `Termination type "${metadata.terminations[flow.termination.type].displayName}" doesn't support operands.`}
                />
            </Grid>
            {/* Flow display */}
            <Grid item xs={12} sx={{ marginTop: 4 }}>
                <Typography variant="subtitle1">Applying transforms on input string "[data]":</Typography>
            </Grid>
            <Grid item xs>
                <CodeMirror
                    value={CSProfileToHttpFormatter.format_transforms(flow.transforms)}
                    height="auto"
                    theme="dark"
                    readOnly={true}
                    extensions={[EditorView.lineWrapping]}
                />
            </Grid>
        </Grid>
    </>
} //TODO: Hide parameter textfields when parameter not available?