import { Box, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Typography } from "@mui/material";
import { MessageLevel, MessageLevelDisplayName, ValidateCb, ValidationMessage } from "../Misc/IC2Provider";
import { PaperItem } from "./PaperItems/PaperItem";
import { TopBlockMetaDisplayNames } from "../Plugins/CobaltStrike/CSMetadataTypes";
import { useState } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

interface Props {
    profile: any;
    validator: ValidateCb;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export const ProfileAlertView = ({ profile, validator }: Props) => {
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<"block" | "level">("level");

    const messages = validator(profile).sort((a, b) => (a[orderBy]?.localeCompare(b[orderBy] || "") || 0) * (order == "asc" ? 1 : -1));

    const createSortHandler =
        (property: "block" | "level") => (event: React.MouseEvent<unknown>) => {
            if (orderBy != property) setOrderBy(property);
            else setOrder(order === "asc" ? "desc" : "asc");
        };

    const getLevelIcon = (level: MessageLevel) => {
        switch (level) {
            case "info":
                return <InfoIcon />;
            case "warning":
                return <WarningIcon />
            case "error":
                return <ErrorIcon />
        }
    }

    const getLevelColor = (level: MessageLevel) => {
        switch (level) {
            case "info":
                return "secondary";
            case "warning":
                return "warning";
            case "error":
                return "error";
        }
    }

    const getValidationIcon = () => {
        const _levels: MessageLevel[] = ["error", "warning", "info"];
        const highestLevel = _levels.find(l => messages.find(m => m.level == l));

        if (highestLevel) {
            const color = getLevelColor(highestLevel);
            switch (highestLevel) {
                case "info":
                    return <InfoIcon color={color} />;
                case "warning":
                    return <WarningIcon color={color} />
                case "error":
                    return <ErrorIcon color={color} />
            }
        }
        return <CheckCircleIcon color="success" />
    }

    // red ErrorIcon/green CheckCicleIcon icon prepending Validation header
    return <PaperItem small>
        <>
            <Stack direction="row" spacing={1} alignItems="center">
                {getValidationIcon()}
                <Typography variant="h5" sx={{ m: 2 }}>Validation</Typography>
            </Stack>
            {messages.length == 0
                ? <Box component="div" sx={{ m: 1 }}>
                    <Typography gutterBottom>No issues found in your profile! 🥳</Typography>
                    <Typography variant="body2">Please make sure to verify using CobaltStrike's c2lint utility anyways!</Typography>
                </Box>
                : <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sortDirection={orderBy == "level" ? order : false}>
                                <TableSortLabel
                                    active={orderBy === "level"}
                                    direction={orderBy === "level" ? order : 'asc'}
                                    onClick={createSortHandler("level")}
                                >
                                    Level
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sortDirection={orderBy == "block" ? order : false}>
                                <TableSortLabel
                                    active={orderBy === "block"}
                                    direction={orderBy === "block" ? order : 'asc'}
                                    onClick={createSortHandler("block")}
                                >
                                    Block
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                Message
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {messages.map((m, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>
                                    <Chip
                                        icon={getLevelIcon(m.level)}
                                        label={MessageLevelDisplayName[m.level]}
                                        color={getLevelColor(m.level)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {m.block ? TopBlockMetaDisplayNames[m.block] : "-"}
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Typography>{m.message}</Typography>
                                        {m.items && m.items.map((item, idx) => <Chip size="small" label={item} variant="outlined" />)}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}
        </>
    </PaperItem>
}