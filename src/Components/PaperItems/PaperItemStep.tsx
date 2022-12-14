import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { PaperItem } from "./PaperItem";

interface PaperItemStepProps {
    stepNumber: number;
    stepTitle: string;
    state: "normal" | "done" | "error";
    layout?: "vertical" | "horizontal";
    description?: string;
    children?: JSX.Element;
}

export const PaperItemStep: FunctionComponent<PaperItemStepProps> = ({ stepNumber, stepTitle, state, description, children, layout="vertical" }) => {
    const getStateColor = () => {
        switch (state) {
            case "done":
                return "success";
            case "error":
                return "error";
        }
        return "primary";
    }
    const getStepItems = () => <>
        <Stack direction="row" alignItems="center" spacing={1}>
            <Chip label={stepNumber} color={getStateColor()} size="small" />
            <Typography variant="h5" gutterBottom={description !== undefined}>{stepTitle}</Typography>
        </Stack>
        {description && <Typography>{description}</Typography>}
    </>;

    return (
        <PaperItem>
            {layout == "vertical"
            ? <Grid container>
                <Grid item xs={12}>
                    {getStepItems()}
                </Grid>
                <Grid item xs={12} marginTop={'10px'}>
                    {children}
                </Grid>
            </Grid>
                : <Grid container alignItems="center">
                    <Grid item xs={6}>
                        {getStepItems()}
                    </Grid>
                    <Grid item xs={6} marginTop={'10px'}>
                        {children}
                    </Grid>
                </Grid>}
        </PaperItem>
    );
}
