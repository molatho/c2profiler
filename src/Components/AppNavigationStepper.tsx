import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import { AppFlow, AppFlowItems, AppFlowItemDisplayNames } from '../Misc/Common';


interface Props {
    step: AppFlow;
    setStep: (step: AppFlow) => void;
    progressBlocked: boolean;
}

export const AppNavigationStepper = ({ step, setStep, progressBlocked }: Props) => {
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

    const activeStep = AppFlowItems.indexOf(step) || 0;

    const handleStep = (idx: number) => () => {
        setStep(AppFlowItems[idx]);
    };

    return (
        <Box component="div" sx={{ width: '100%' }}>
            <Stepper nonLinear activeStep={activeStep}>
                {AppFlowItems.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton color="inherit" onClick={handleStep(index)} disabled={progressBlocked}>
                            {AppFlowItemDisplayNames[label]}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}