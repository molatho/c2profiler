import { ICSHeader } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import { TableContainer, Paper, Table, TableRow, TableCell, TableBody, TextField, IconButton, ButtonGroup, Typography, Stack, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircle from '@mui/icons-material/AddCircle';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from "react";

interface HeaderProps {
    header: ICSHeader;
    onChanged: () => void;
    onRemove: () => void;
    isFirst: boolean;
    isLast: boolean;
    onMove: (dir: number) => void;
}

const CSHeader = ({ header, onChanged, onRemove, isFirst, isLast, onMove }: HeaderProps) => {
    const [update, setUpdate] = useState<NodeJS.Timeout|null>(null);

    const refreshTimeout = () => {
        if (update) clearTimeout(update);
        setUpdate(setTimeout(() => {
            onChanged();
        }, 500));
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        header.name = event.currentTarget.value;
        refreshTimeout();
    }

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        header.value = event.currentTarget.value;
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
                    value={header.name}
                    onChange={handleNameChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                    fullWidth
                    error={header.name.length == 0}
                />
            </Stack>
        </TableCell>
        <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>
                    Value:
                </Typography>
                <TextField
                    value={header.value}
                    onChange={handleValueChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                    fullWidth
                    error={header.value.length == 0}
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
    headers: ICSHeader[];
    onHeadersChanged: (headers: ICSHeader[]) => void;
}

export const CSHeadersList = ({ headers, onHeadersChanged }: Props) => {
    const headerAdd = () => {
        onHeadersChanged([...headers, { name: "", value: "" }])
    }

    const headerRemove = (idx: number) => {
        onHeadersChanged(headers.filter((h, i) => i != idx));
    }

    const handleHeaderChange = () => {
        onHeadersChanged([...headers]);
    }

    const moveHeader = (idx: number, dir: number) => {
        const tmp = headers[idx];
        headers[idx] = headers[idx + dir];
        headers[idx + dir] = tmp;
        onHeadersChanged([...headers]);
    }

    return <><TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table size="small" stickyHeader>
            <TableBody>
                {headers.map((header, idx) => <CSHeader
                    key={idx}
                    header={header}
                    onChanged={handleHeaderChange}
                    onRemove={() => headerRemove(idx)}
                    isFirst={idx == 0}
                    isLast={idx == headers.length - 1}
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