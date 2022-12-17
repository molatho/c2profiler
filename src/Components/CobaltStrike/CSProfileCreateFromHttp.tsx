import { Button } from "@mui/material";
import { IC2ImporterProps } from "../../Misc/IC2Provider";

export interface HttpImport {
    requests: string[];
    response: string;
}

export const CSProfileCreateFromHttp = ({ onImported }: IC2ImporterProps) => {
    return <Button variant="contained" color="success">Placeholder</Button>
}