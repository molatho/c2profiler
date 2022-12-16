import { Stack, IconButton, Typography } from "@mui/material";
import { AppFlow, AppFlowItems, isFirstFlowStep, isLastFlowStep } from "../Misc/Common";
import { Section } from "../Misc/IC2Provider";
import { PaperItem } from "./PaperItems/PaperItem"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

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
        </PaperItem>
    </>
}