import { Button } from "@mui/material";
import { IC2ImporterProps } from "../../Misc/IC2Provider";
import { BRProfileHelper } from "../../Plugins/BruteRatelC4/BRProfileHelper";

export const BRProfileCreate = ({ onImported }: IC2ImporterProps) => {
    const createProfile = () => {
        onImported(BRProfileHelper.createEmpty());
    }
    return <Button variant="contained" color="success" onClick={createProfile}>Create empty</Button>
}