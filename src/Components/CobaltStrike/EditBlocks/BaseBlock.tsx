import { Stack, IconButton, Typography, Grid } from "@mui/material";
import IndentedAccordeon from "../../IndentedAccordeon";
import DeleteIcon from '@mui/icons-material/Delete';
import { Variants } from "../../../Misc/Styles";

interface Props<I> {
    identifier?: I;
    onBlockRemoved?: (identifier: I) => void;
    title: string;
    titleVariant?: Variants;
    children?: JSX.Element;
    startExpanded?: boolean;
}

export const BaseBlock = <I extends unknown>({ identifier, onBlockRemoved, title, titleVariant, children, startExpanded=false }: Props<I>) => {
    const titleElement = <Grid container
        direction="row"
        justifyContent="space-between"
        alignItems="center">
        <Grid item>
            <Typography variant={titleVariant}>{title}</Typography>
        </Grid>
        <Grid item>
            {onBlockRemoved && identifier && <IconButton color="error" size="small" onClick={() => onBlockRemoved(identifier)}>
                <DeleteIcon />
            </IconButton>}
        </Grid>
    </Grid>;

    return <><IndentedAccordeon title={title} titleVariant={titleVariant} titleElement={titleElement} startExpanded={startExpanded}>
        <>
            {children}
        </>
    </IndentedAccordeon></>
}