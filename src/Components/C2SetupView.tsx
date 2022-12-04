import { Grid } from "@mui/material";
import { useState } from "react";
import { CobaltStrike, IC2Provider } from "../Misc/IC2Provider";
import { C2ImporterHost } from "./C2ImporterHost";
import { C2ProviderSelector } from "./C2ProviderSelector";
import { PaperItemStep } from "./PaperItems/PaperItemStep";

interface Props {
    onSetupDone: (c2: IC2Provider, profile: any) => void;
}

const PROVIDERS: IC2Provider[] = [CobaltStrike];

export const C2SetupView = ({ onSetupDone } : Props) => {
    const [c2Provider, setC2Provider] = useState<IC2Provider | null>(null);
    const [c2Profile, setC2Profile] = useState<any | null>(null);


    return (
        <>{/* 1. C2 Selection */}
            <Grid container >
                <Grid item xs={12}>
                    <PaperItemStep
                        layout="line"
                        stepNumber={1}
                        stepTitle={"Select your C2"}
                        state="normal">
                        <C2ProviderSelector c2s={PROVIDERS} onSelect={setC2Provider} />
                    </PaperItemStep>
                </Grid>

                {/* 2. Start selection */}
                {c2Provider && <Grid item xs={12}>
                    <PaperItemStep
                        layout="stacked"
                        stepNumber={2}
                        stepTitle={"Import or create a profile"}
                        state="normal">
                        <C2ImporterHost c2={c2Provider} onImported={(profile) => onSetupDone(c2Provider, profile)} />
                    </PaperItemStep>
                </Grid>
                }
            </Grid></>
    )
}