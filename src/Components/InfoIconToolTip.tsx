import { Tooltip } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

interface Props {
    description: string;
}

export const InfoIconToolTip = ({ description }: Props) => <Tooltip title={description}>
    <InfoIcon fontSize="small" color="disabled"/>
</Tooltip>