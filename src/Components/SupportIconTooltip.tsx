import { IconButton, Tooltip } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export interface SupportIconTooltipProps {
    link?: string;
    description?: string;
}

export const SupportIconTooltip = ({ link, description }: SupportIconTooltipProps) => {
    return <Tooltip title={link ? `Open documentation\n${link}` : description}>
        {link
            ? <IconButton size="small" target="_blank" href={link} sx={{padding:0}}>
                <OpenInNewIcon fontSize="inherit" color="disabled" />
            </IconButton>
            : <InfoIcon fontSize="small" color="disabled" />
        }
    </Tooltip>
}