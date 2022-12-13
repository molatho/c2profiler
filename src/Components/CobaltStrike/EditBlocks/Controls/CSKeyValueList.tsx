import { ICSKeyValue } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import { TableContainer, Paper, Table, TableRow, TableCell, TableBody, IconButton, ButtonGroup, Typography, Stack, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CodeTextField } from "../../../CodeTextField";

interface ItemProps {
    item: ICSKeyValue;
    onChanged: () => void;
    onRemove: () => void;
    isFirst: boolean;
    isLast: boolean;
    onMove: (dir: number) => void;
    idx: number;
}

const CSHeader = ({ item, onChanged, onRemove, isFirst, isLast, onMove, idx }: ItemProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.id) {
            case "name":
                item.name = event.target.value;
                break;
            case "value":
                item.value = event.target.value;
                break;
            default:
                return;
        }
        onChanged();
    }

    return <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell padding="checkbox">{`${idx + 1}.`}</TableCell>
        <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>
                    Name:
                </Typography>
                <CodeTextField
                    id="name"
                    value={item.name}
                    onChange={handleChange}
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
                <CodeTextField
                    id="value"
                    value={item.value}
                    onChange={handleChange}
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

    return <>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
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