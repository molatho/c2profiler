import { Stack, IconButton, Typography, Grid } from "@mui/material";
import { AppFlow, AppFlowItemDisplayNames, AppFlowItems, isFirstFlowStep, isLastFlowStep } from "../Misc/Common";
import { Section } from "../Misc/IC2Provider";
import { PaperItem } from "./PaperItems/PaperItem"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { AppNavigationStepper } from "./AppNavigationStepper";

interface Props {
    section: Section;
    step: AppFlow;
    setStep: (step: AppFlow) => void;
    progressBlocked: boolean;
}

export const AppNavigation = ({ section, step, setStep, progressBlocked }: Props) => {
    const canGoBack = !isFirstFlowStep(step);
    const canGoForward = !isLastFlowStep(step);

    const navigatePrev = () => {
        setStep(AppFlowItems[AppFlowItems.indexOf(step) - 1])
    }

    const navigateNext = () => {
        setStep(AppFlowItems[AppFlowItems.indexOf(step) + 1])
    }

    return <>
        <PaperItem>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                        <IconButton disabled={!canGoBack} onClick={navigatePrev}>
                            <ArrowBackIosIcon />
                        </IconButton>
                        <Stack direction="column">
                            <Typography align="center" variant="h4" gutterBottom>{section.title}</Typography>
                            <Typography align="center">{section.description}</Typography>
                        </Stack>
                        <IconButton disabled={!canGoForward || progressBlocked} onClick={navigateNext}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <AppNavigationStepper step={step} setStep={setStep} progressBlocked={progressBlocked} />
                </Grid>
            </Grid>
        </PaperItem>
    </>
}