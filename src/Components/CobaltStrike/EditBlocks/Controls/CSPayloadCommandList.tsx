import { ICSPayloadCommand } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import { TableContainer, Paper, Table, TableRow, TableCell, TableBody, IconButton, ButtonGroup, Typography, Stack, Grid, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import metadata from "../../../../Plugins/CobaltStrike/metadata.json"
import { CodeTextField } from "../../../Misc/CodeTextField";
import { IMetaPayloadCommandDefinition, PayloadCommandName, PayloadCommandNames } from "../../../../Plugins/CobaltStrike/CSMetadataTypes";
import { InfoAddChip } from "../../../InfoAddChip";

interface TransformItemProps {
    meta: IMetaPayloadCommandDefinition;
    command: ICSPayloadCommand;
    isFirst: boolean;
    isLast: boolean;
    onChanged: () => void;
    onRemove: () => void;
    onMove: (dir: number) => void;
    idx: number;
}


const CommandRow = ({ meta, command, isFirst, isLast, onChanged, onRemove, onMove, idx }: TransformItemProps) => {
    const onValueChanged = (value: string) => {
        command.operand = value;
        onChanged();
    }

    return <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell>{`${idx + 1}.`}</TableCell>
        <TableCell>{meta.displayName}</TableCell>
        <TableCell component="th" scope="row">
            <CodeTextField
                value={command.operand}
                onChange={(ev) => onValueChanged(ev.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                size="small"
                multiline
                fullWidth
                error={!command.operand ? true : false}
                placeholder="Value required"
            />
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
    </TableRow>; //TODO: textfield isn't moved when the list order is changed
}

interface Props {
    list: ICSPayloadCommand[];
    onListChanged: (list: ICSPayloadCommand[]) => void;
}

export const CSPayloadCommandList = ({ list, onListChanged }: Props) => {
    const addCommand = (name: PayloadCommandName) => {
        list.push({
            type: name,
            operand: ""
        });
        onListChanged([...list]);
    }

    const headerRemove = (idx: number) => {
        onListChanged(list.filter((h, i) => i != idx));
    }

    const moveHeader = (idx: number, dir: number) => {
        const tmp = list[idx];
        list[idx] = list[idx + dir];
        list[idx + dir] = tmp;
        onListChanged([...list]);
    }

    return <>
        <Grid container spacing={2}>
            {/* Help */}
            <Grid item xs={12}>
                <Typography variant="body2">TODO: Help</Typography>
            </Grid>
            {/* Command selection */}
            <Grid item xs={12}>
                <Typography variant="subtitle1">Commands:</Typography>
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
                    {PayloadCommandNames.map((n, i) => <InfoAddChip key={i} label={metadata.payloadCommands[n].displayName} description={metadata.payloadCommands[n].description} onClick={() => addCommand(n)} />)}
                </Stack>
            </Grid>
            {/* Command list */}
            <Grid item xs={12}>
                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table size="small" stickyHeader>
                        <TableBody>
                            {list && list.map((t, i) => <CommandRow
                                key={i}
                                meta={metadata.payloadCommands[t.type]}
                                command={t}
                                onChanged={() => onListChanged([...list])}
                                onRemove={() => headerRemove(i)}
                                isFirst={i == 0}
                                isLast={i == list.length - 1}
                                onMove={(dir) => moveHeader(i, dir)}
                                idx={i}
                            />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    </>
}