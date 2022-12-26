import { Stack, Grid, Typography, IconButton, TableContainer, Paper, Table, TableCell, TableHead, TableRow, TableBody, ButtonGroup } from "@mui/material";
import { ExecuteCommandName, ExecuteCommandNames, IMeteExecuteCommandDefinition as IMetaExecuteCommandDefinition } from "../../../../Plugins/CobaltStrike/CSMetadataTypes";
import { ICSProcessInjectExecute, ICSProcessInjectExecuteCommand } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import metadata from "../../../../Plugins/CobaltStrike/metadata.json"
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { InfoAddChip } from "../../../InfoAddChip";
import { CodeTextField } from "../../../Misc/CodeTextField";

//TODO: Create re-usable component for the pick&choose style of cases
interface ExecuteCommandProps {
    meta: IMetaExecuteCommandDefinition;
    command: ICSProcessInjectExecuteCommand;
    isFirst: boolean;
    isLast: boolean;
    onChanged: () => void;
    onRemove: () => void;
    onMove: (dir: number) => void;
    idx: number;
}


const CommandRow = ({ meta, command, isFirst, isLast, onChanged, onRemove, onMove, idx }: ExecuteCommandProps) => {
    const onOperandChanged = (value: string) => {
        command.operand = value;
        onChanged();
    }

    return <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell>{`${idx + 1}.`}</TableCell>
        <TableCell>{command.type}</TableCell>
        <TableCell component="th" scope="row">
            {meta.operand && <CodeTextField
                value={command.operand ? command.operand : ""}
                onChange={(ev) => onOperandChanged(ev.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                size="small"
                multiline
                fullWidth
                error={!command.operand ? true : false}
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
    execute: ICSProcessInjectExecute;
    onProfileChanged: (profile: any) => void;
}

export const CSProcessInjectExecuteFlow = ({ profile, execute, onProfileChanged }: Props) => {
    const addCommand = (name: ExecuteCommandName) => {
        execute.commands.push({
            "type": name
        });
        onProfileChanged({ ...profile });
    }

    const removeCommand = (idx: number) => {
        execute.commands = execute.commands.filter((_, i) => i != idx);
        onProfileChanged({ ...profile });
    }

    const handleMove = (idx: number, dir: number) => {
        const tmp = execute.commands[idx];
        execute.commands[idx] = execute.commands[idx + dir];
        execute.commands[idx + dir] = tmp;
        onProfileChanged({ ...profile });
    }

    const getCommandMetadata = (name: ExecuteCommandName): IMetaExecuteCommandDefinition => metadata.executeCommands[name] as IMetaExecuteCommandDefinition;

    //TODO: Update help
    return <>
        <Grid container spacing={2}>
            {/* Help */}
            <Grid item xs={12}>
                <Typography variant="body2"> TODO: Help</Typography>
            </Grid>
            {/* Command selection */}
            <Grid item xs={12}>
                <Typography variant="subtitle1">Available commands:</Typography>
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
                    {ExecuteCommandNames.map((n, i) => <InfoAddChip key={i} label={n} description={getCommandMetadata(n).description} onClick={() => addCommand(n)} />)}
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
                                <TableCell>Command</TableCell>
                                <TableCell align="center">Operand</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {execute.commands && execute.commands.map((t, i) => <CommandRow
                                key={i}
                                meta={getCommandMetadata(t.type)}
                                command={t}
                                onChanged={() => onProfileChanged({ ...profile })}
                                onRemove={() => removeCommand(i)}
                                isFirst={i == 0}
                                isLast={i == execute.commands.length - 1}
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