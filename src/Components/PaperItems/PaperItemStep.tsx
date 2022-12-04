import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { PaperItem } from "./PaperItem";

interface PaperItemStepProps {
    layout: "line" | "stacked";
    stepNumber: number;
    stepTitle: string;
    state: "normal" | "done" | "error";
    children?: JSX.Element;
}

export const PaperItemStep: FunctionComponent<PaperItemStepProps> = ({ layout, stepNumber, stepTitle, state, children }) => {
    const getStateColor = ()=>{
        switch(state) {
            case "done":
                return "success";
            case "error":
                return "error";
        }
        return "primary";
    }
    const getStepItems = () => <Stack direction="row" alignItems="center" spacing={1}>
        <Chip label={stepNumber} color={getStateColor()} size="small" />
        <Typography>{stepTitle}</Typography>
    </Stack>;

    return (
        <PaperItem>
            <Grid container>
                {layout == "line" &&
                    <>
                        <Grid item xs={4}>
                            {getStepItems()}
                        </Grid>
                        <Grid item xs={4}>
                            {children}
                        </Grid>
                    </>
                }
                {layout == "stacked" &&
                    <>
                        <Grid item xs={12}>
                            {getStepItems()}
                        </Grid>
                        <Grid item xs={12} marginTop={'10px'}>
                            {children}
                        </Grid>
                    </>
                }
            </Grid>
        </PaperItem>
    );
}
