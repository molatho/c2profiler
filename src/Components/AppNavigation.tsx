import { Stack, IconButton, Typography } from "@mui/material";
import { AppFlow, isFirstFlowStep, isLastFlowStep } from "../Misc/Common";
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
        switch (step) {
            case "edit":
                return setStep("setup");
            case "test":
                return setStep("edit");
        }
    }

    const navigateNext = () => {
        switch (step) {
            case "setup":
                return setStep("edit");
            case "edit":
                return setStep("test");
        }
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