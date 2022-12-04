import { Stack, Button } from "@mui/material";
import IndentedAccordeon from "../../IndentedAccordeon";
import DeleteIcon from '@mui/icons-material/Delete';

interface Props<I> {
    identifier: I;
    onBlockRemoved?: (identifier: I) => void;
    title: string;
    children?: JSX.Element;
}

export const BaseBlock = <I extends unknown>({ identifier, onBlockRemoved, title, children }: Props<I>) => {
    return <><IndentedAccordeon title={title} titleVariant="h6">
        <>
            {children}
            {onBlockRemoved && <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
                <Button variant="contained" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => onBlockRemoved(identifier)}>
                    Remove
                </Button>
            </Stack>}
        </>
    </IndentedAccordeon></>
}