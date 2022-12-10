import { Stack, IconButton, Typography, Grid } from "@mui/material";
import IndentedAccordeon from "./IndentedAccordeon";
import DeleteIcon from '@mui/icons-material/Delete';
import { Variants } from "../Misc/Styles";
import { SupportIconTooltip, SupportIconTooltipProps } from "./SupportIconTooltip";

interface Props<I> extends SupportIconTooltipProps {
    identifier?: I;
    onBlockRemoved?: (identifier: I) => void;
    title: string;
    titleVariant?: Variants;
    children?: JSX.Element;
    startExpanded?: boolean;
}

export const BaseBlock = <I extends unknown>({ identifier, onBlockRemoved, link, description, title, titleVariant, children, startExpanded = false }: Props<I>) => {
    const titleElement = <Grid container
        direction="row"
        justifyContent="space-between"
        alignItems="center">
        <Grid item>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant={titleVariant}>{title}</Typography>
                {(description || link) && <SupportIconTooltip link={link} description={description} />}
            </Stack>


        </Grid>
        <Grid item>
            {onBlockRemoved && identifier != undefined && <IconButton color="error" size="small" onClick={() => onBlockRemoved(identifier)}>
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