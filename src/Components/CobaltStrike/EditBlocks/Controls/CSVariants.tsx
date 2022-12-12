import { Box, Tabs, Tab, Stack, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import { ICSHasVariant, ICSVariantContainer } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import CSVariantDialog from "./CSVariantDialog";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props<T extends ICSHasVariant> {
    profile: any;
    container: ICSVariantContainer<T>;
    onProfileChanged: (profile: any) => void;
    itemView: (item: T, onProfileChanged: (profile: any) => void) => JSX.Element;
    createVariant: (container: ICSVariantContainer<T>, name: string) => void;
}

interface TabPanelProps {
    children?: JSX.Element;
    index: number;
    value: number;
}


function TabPanel({ children, value, index, ...other }: TabPanelProps) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index &&
                children
            }
        </div>
    );
}

export const CSVariants = <T extends ICSHasVariant>({ profile, container, onProfileChanged, itemView, createVariant }: Props<T>) => {
    const [idx, setIdx] = useState(0);
    const [showDiag, setShowDiag] = useState(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setIdx(newValue);
    };

    const handleVariantRemove = () => {
        container.variants = container.variants.filter((_, i) => i != idx - 1);
        onProfileChanged({ ...profile });
        if (idx >= container.variants.length - 1)
            setIdx(container.variants.length - 1);
    }

    const validateVariantName = (name: string) => {
        if (name.length == 0) return "Enter a name!";
        if (container.variants.filter(v => v.variant === name.trim()).length > 0) return "Variant name already taken!"
        return "";
    }

    const addVariant = (name: string) => {
        createVariant(container, name);
        setShowDiag(false);
    }

    return <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ paddingLeft: 2, paddingRight: 2 }}>Variants:</Typography>
                <Tabs value={idx} onChange={handleChange} variant="scrollable" sx={{ width: '100%' }}>
                    <Tab label="Baseline" sx={{ textTransform: 'none' }} />
                    {container.variants.map((v, i) => <Tab sx={{ textTransform: 'none' }} key={i} label={`Variant "${v.variant}"`} />)}
                </Tabs>
                <>
                    <IconButton color="success" onClick={() => setShowDiag(true)}>
                        <AddCircleIcon />
                    </IconButton>
                    <IconButton disabled={idx == 0} color="error" onClick={handleVariantRemove}>
                        <DeleteIcon />
                    </IconButton>
                </>
            </Stack>
        </Box>
        <TabPanel value={idx} index={0}>
            {itemView(container.baseline, onProfileChanged)}
        </TabPanel>
        {container.variants.map((v, i) => <TabPanel value={idx} key={i} index={1 + i}>
            {itemView(container.variants[i], onProfileChanged)}
        </TabPanel>)}
        <TabPanel value={idx} index={container.variants.length + 1}>
            <></>
        </TabPanel>
        <CSVariantDialog show={showDiag} onValidate={validateVariantName} onCancel={() => setShowDiag(false)} onSubmit={addVariant} />
    </>;
}