import { ICSHeader, ICSKeyValue } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import { TableContainer, Paper, Table, TableRow, TableCell, TableBody, TextField, IconButton, ButtonGroup, Typography, Stack, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircle from '@mui/icons-material/AddCircle';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from "react";

interface ItemProps {
    item: ICSKeyValue;
    onChanged: () => void;
    onRemove: () => void;
    isFirst: boolean;
    isLast: boolean;
    onMove: (dir: number) => void;
}

const CSHeader = ({ item, onChanged, onRemove, isFirst, isLast, onMove }: ItemProps) => {
    const [update, setUpdate] = useState<NodeJS.Timeout|null>(null);

    const refreshTimeout = () => {
        if (update) clearTimeout(update);
        setUpdate(setTimeout(() => {
            onChanged();
        }, 500));
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        item.name = event.currentTarget.value;
        refreshTimeout();
    }

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        item.value = event.currentTarget.value;
        refreshTimeout();
    }

    return <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>
                    Name:
                </Typography>
                <TextField
                    value={item.name}
                    onChange={handleNameChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                    fullWidth
                    error={item.name.length == 0}
                />
            </Stack>
        </TableCell>
        <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>
                    Value:
                </Typography>
                <TextField
                    value={item.value}
                    onChange={handleValueChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                    fullWidth
                    error={item.value.length == 0}
                />
            </Stack>
        </TableCell>
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
    </TableRow>
}

interface Props {
    list: ICSKeyValue[];
    onListChanged: (list: ICSKeyValue[]) => void;
}

export const CSKeyValueList = ({ list, onListChanged }: Props) => {
    const headerAdd = () => {
        onListChanged([...list, { name: "", value: "" }])
    }

    const headerRemove = (idx: number) => {
        onListChanged(list.filter((h, i) => i != idx));
    }

    const handleHeaderChange = () => {
        onListChanged([...list]);
    }

    const moveHeader = (idx: number, dir: number) => {
        const tmp = list[idx];
        list[idx] = list[idx + dir];
        list[idx + dir] = tmp;
        onListChanged([...list]);
    }

    return <><TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table size="small" stickyHeader>
            <TableBody>
                {list.map((item, idx) => <CSHeader
                    key={idx}
                    item={item}
                    onChanged={handleHeaderChange}
                    onRemove={() => headerRemove(idx)}
                    isFirst={idx == 0}
                    isLast={idx == list.length - 1}
                    onMove={(dir) => moveHeader(idx, dir)}
                />)}
            </TableBody>
        </Table>
    </TableContainer>
        <Button variant="contained" size="small" color="success" startIcon={<AddIcon />} onClick={headerAdd}>
            Add
        </Button>
    </>
}