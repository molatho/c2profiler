import { TableContainer, Paper, Table, TableBody, Button, ButtonGroup, IconButton, Stack, TableCell, TableRow, Typography, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { ICSBlockProcessInject, ICSOption, ICSPayloadTransform, ICSProcessInjectExecute, ICSProcessInjectExecuteCommand } from "../../../Plugins/CobaltStrike/CSProfileTypes";
import { BaseBlock } from "../../BaseBlock";
import { CSCreateNew } from "./Controls/CSCreateNew";
import { CSOptionsList } from "./Controls/CSOptionsList";
import { CSPayloadTransform } from "./Controls/CSPayloadTransform";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CodeTextField } from "../../CodeTextField";
import metadata from "../../../Plugins/CobaltStrike/metadata.json";
import { ExecuteCommandName, ExecuteCommandNames, IMeteExecuteCommandDefinition } from "../../../Plugins/CobaltStrike/CSMetadataTypes";
import { SupportIconTooltip } from "../../SupportIconTooltip";

interface ExecuteCommandProps {
    command: ICSProcessInjectExecuteCommand;
    onChanged: () => void;
    onRemove: () => void;
    isFirst: boolean;
    isLast: boolean;
    onMove: (dir: number) => void;
    idx: number;
}

const CSExecuteCommand = ({ command, onChanged, onRemove, isFirst, isLast, onMove, idx }: ExecuteCommandProps) => {
    const getMetaData = (type: ExecuteCommandName): IMeteExecuteCommandDefinition => metadata.executeCommands[command.type];

    const handleCommandSelect = (event: SelectChangeEvent) => {
        command.type = event.target.value as ExecuteCommandName;
        onChanged();
    };

    const handleOperandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        command.operand = event.currentTarget.value;
        onChanged();
    };

    return <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell padding="checkbox">{`${idx + 1}.`}</TableCell>
        {/* Type */}
        <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>
                    Option:
                </Typography>
                <Select
                    value={command.type}
                    size="small"
                    onChange={handleCommandSelect}
                >
                    {ExecuteCommandNames.map((n, i) => <MenuItem key={i} value={n}>
                        <Stack direction="row" spacing={2}>
                            <Typography> {command.type} </Typography>
                            <SupportIconTooltip description={getMetaData(command.type).description} />
                        </Stack>
                    </MenuItem>)}
                </Select>
            </Stack>
        </TableCell>
        {/* Operand */}
        {getMetaData(command.type).operand && < TableCell >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>
                    Value:
                </Typography>
                <CodeTextField
                    id="value"
                    value={command.operand ? command.operand : ""}
                    onChange={handleOperandChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                    fullWidth
                    error={!command.operand || command.operand.length == 0}
                />
            </Stack>
        </TableCell>}
        {/* Buttons */}
        <TableCell padding="checkbox">
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
    </TableRow >
}

interface ExecuteListProps {
    profile: any;
    execute: ICSProcessInjectExecute;
    onProfileChanged: (profile: any) => void;
}

const CSExecuteList = ({ profile, execute, onProfileChanged }: ExecuteListProps) => {
    //TODO: Borken, just copy TransformationFlow's pick&list 
    const headerAdd = () => {
        execute.commands.push({
            type: "CreateThread"
        })
        onProfileChanged({ ...profile })
    }

    const headerRemove = (idx: number) => {
        execute.commands = execute.commands.filter((_, i) => i != idx);
        onProfileChanged({ ...profile })
    }

    const handleHeaderChange = () => {
        onProfileChanged({ ...profile })
    }

    const moveHeader = (idx: number, dir: number) => {
        const tmp = execute.commands[idx];
        execute.commands[idx] = execute.commands[idx + dir];
        execute.commands[idx + dir] = tmp;
        onProfileChanged({ ...profile })
    }

    return <>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table size="small" stickyHeader>
                <TableBody>
                    {execute.commands.map((item, idx) => <CSExecuteCommand
                        key={idx}
                        command={item}
                        onChanged={handleHeaderChange}
                        onRemove={() => headerRemove(idx)}
                        isFirst={idx == 0}
                        isLast={idx == execute.commands.length - 1}
                        onMove={(dir) => moveHeader(idx, dir)}
                        idx={idx}
                    />)}
                </TableBody>
            </Table>
        </TableContainer>
        <Button variant="contained" size="small" color="success" startIcon={<AddIcon />} onClick={headerAdd}>
            Add
        </Button>
    </>
}

interface Props {
    profile: any;
    pin: ICSBlockProcessInject;
    onProfileChanged: (profile: any) => void;
}

export const CSProcessInject = ({ profile, pin, onProfileChanged }: Props) => {
    const handleOptChange = (opts: ICSOption[]) => {
        pin.options = opts;
        onProfileChanged({ ...profile });
    }

    const removeTransform = (name: "transform-x86" | "transform-x64") => {
        pin[name] = undefined;
        onProfileChanged({ ...profile });
    }

    const createTransform = (name: "transform-x86" | "transform-x64") => {
        pin[name] = {
            type: name,
            operations: []
        }
        onProfileChanged({ ...profile });
    }

    const createExecute = (): ICSProcessInjectExecute => {
        return {
            commands: []
        };
    }

    const getTransform = (transform: ICSPayloadTransform) => <CSPayloadTransform profile={profile} onProfileChanged={onProfileChanged} payload={transform} />

    return <>
        {/* Options */}
        <BaseBlock titleVariant="h6" title="Options" startExpanded>
            <CSOptionsList blockMetaName="process_inject" blockOptions={pin.options} onBlockOptionsChanged={handleOptChange} />
        </BaseBlock>
        {/* Transform x86 */}
        <BaseBlock titleVariant="h6" title="Transform x86" description="TODO" identifier="transform-x86" onBlockRemoved={pin["transform-x86"] ? removeTransform : undefined}>
            <CSCreateNew item={pin["transform-x86"]} onCreate={() => createTransform("transform-x86")} itemView={() => getTransform(pin["transform-x86"] as ICSPayloadTransform)} />
        </BaseBlock>
        {/* Transform x64 */}
        <BaseBlock titleVariant="h6" title="Transform x64" description="TODO" identifier="transform-x64" onBlockRemoved={pin["transform-x64"] ? removeTransform : undefined}>
            <CSCreateNew item={pin["transform-x64"]} onCreate={() => createTransform("transform-x64")} itemView={() => getTransform(pin["transform-x64"] as ICSPayloadTransform)} />
        </BaseBlock>
        {/* Execute */}
        <BaseBlock titleVariant="h6" title="Commands" startExpanded>
            <CSCreateNew item={pin.execute} onCreate={createExecute} itemView={(i) => <CSExecuteList
                profile={profile}
                onProfileChanged={onProfileChanged}
                execute={i}
            />} />
        </BaseBlock>
    </>
}