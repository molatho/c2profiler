import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import { CobaltStrike, IC2Provider } from "../Misc/IC2Provider";
import { C2ImporterHost } from "./C2ImporterHost";
import { C2ProviderSelector } from "./C2ProviderSelector";
import { PaperItem } from "./PaperItems/PaperItem";
import { PaperItemStep } from "./PaperItems/PaperItemStep";

interface Props {
    onSetupDone: (c2: IC2Provider, profile: any) => void;
}

const PROVIDERS: IC2Provider[] = [CobaltStrike];

export const C2SetupView = ({ onSetupDone }: Props) => {
    const [c2Provider, setC2Provider] = useState<IC2Provider | null>(null);
    const [c2Profile, setC2Profile] = useState<any | null>(null);


    return (
        <>{/* 1. C2 Selection */}
            <Grid container >
                <Grid item xs={12}>
                    <PaperItem>
                        <>
                            <Typography align="center" variant="h4" gutterBottom>Malleable Profile Setup</Typography>
                            <Typography align="center">Welcome to c2profiler! This tool allows you to import, view, edit, export, lint, and (somewhat) test your malleable profiles. In this first view, you'll import or create the profile to work on.</Typography>
                        </>
                    </PaperItem>
                </Grid>

                <Grid item xs={12}>
                    <PaperItemStep
                        stepNumber={1}
                        stepTitle={"Select your C2"}
                        state={c2Provider ? "done" : "error"}
                        description="As a first step, select the provider of your C2."
                    >
                        <C2ProviderSelector c2s={PROVIDERS} onSelect={setC2Provider} />
                    </PaperItemStep>
                </Grid>

                {/* 2. Start selection */}
                {c2Provider && <Grid item xs={12}>
                    <PaperItemStep
                        stepNumber={2}
                        stepTitle={"Import or create a profile"}
                        state={c2Profile ? "done" : "error"}
                        description="Now import or create your profile."
                    >
                        <C2ImporterHost c2={c2Provider} onImported={(profile) => onSetupDone(c2Provider, profile)} />
                    </PaperItemStep>
                </Grid>
                }
            </Grid></>
    )
}