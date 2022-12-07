import { Chip, Stack, Tooltip } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { SupportIconTooltip, SupportIconTooltipProps } from "./SupportIconTooltip";

interface InfoAddChipProps extends SupportIconTooltipProps {
    label?: string;
    onClick: () => void;
}

export const InfoAddChip = ({ label, link, description, onClick }: InfoAddChipProps) => {
    return (
        <Chip
            label={label}
            variant="outlined"
            onDelete={() => onClick()}
            deleteIcon={<Stack alignItems="center"><AddCircleIcon fontSize="small" color="success" /></Stack>}
            icon={(description || link) ? <Stack alignItems="center"><SupportIconTooltip link={link} description={description} /></Stack> : undefined}
        />
    )
}