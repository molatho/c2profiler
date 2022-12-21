import { Box, Tabs, Tab, Stack, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import { ICSHasVariant, ICSVariantContainer } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import CSVariantDialogAdd from "./CSVariantDialogAdd";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { grey, red, green } from '@mui/material/colors'
import CSVariantDialogRename from "./CSVariantDialogRename";

interface Props<T extends ICSHasVariant> {
    profile: any;
    container: ICSVariantContainer<T>;
    onProfileChanged: (profile: any) => void;
    itemView: (item: T, onProfileChanged: (profile: any) => void) => JSX.Element;
    createVariant: (container: ICSVariantContainer<T>, name: string) => void;
    hideButtons?: boolean;
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

export const CSVariants = <T extends ICSHasVariant>({ profile, container, onProfileChanged, itemView, createVariant, hideButtons = false }: Props<T>) => {
    const [idx, setIdx] = useState(0);
    const [showDiagAdd, setShowDiagAdd] = useState(false);
    const [showDiagRename, setShowDiagRename] = useState(false);

    const current_variant = idx == 0 ? undefined : container.variants[idx - 1];

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setIdx(newValue);
    };

    const handleVariantRemove = (index: number = idx) => {
        container.variants = container.variants.filter((_, i) => i != index - 1);
        onProfileChanged({ ...profile });
        if (index >= container.variants.length - 1)
            setIdx(container.variants.length - 1);
    }

    const validateVariantName = (name: string) => {
        if (name.length == 0) return "Enter a name!";
        if (container.variants.filter(v => v.variant === name.trim()).length > 0) return "Variant name already taken!"
        return "";
    }

    const addVariant = (name: string) => {
        createVariant(container, name);
        setShowDiagAdd(false);
    }

    const renameVariant = (newName: string) => {
        if (!current_variant) return;
        current_variant.variant = newName;
        onProfileChanged({ ...profile });
        setShowDiagRename(false);
    }

    const getTab = (variant: ICSHasVariant, index: number, isVariant: boolean) => {
        return <Tab key={index} label={
            <Stack direction="row" alignItems="center" justifyContent="center">
                {/* Name */}
                {variant.variant || "empty"}
                {/* Edit & Delete */}
                {!hideButtons && <>
                    <IconButton
                        component="span"
                        size="small"
                        onClick={() => setShowDiagRename(true)}
                        sx={{ ml: "0.25em", mr: 0, p: 0, color: index + 1 == idx ? green[300] : grey[600] }}
                    >
                        <EditIcon fontSize="inherit" sx={{ m: 0, p: 0 }} />
                    </IconButton>
                    <IconButton
                        component="span"
                        size="small"
                        onClick={() => handleVariantRemove(idx)}
                        sx={{ ml: "0.25em", mr: 0, p: 0, color: index + 1 == idx ? red[300] : grey[600] }}
                    >
                        <HighlightOffIcon fontSize="inherit" sx={{ m: 0, p: 0 }} />
                    </IconButton>
                </>}
            </Stack>
        }
            sx={{ textTransform: 'none', height: "48px" }} />

    }

    return <>
        <Box component="div" sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ pl: 2, pr: 2 }}>Variants:</Typography>
                <Tabs
                    value={idx}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    sx={{ width: '100%' }}>
                    <Tab label="Baseline" sx={{ textTransform: 'none' }} />
                    {container.variants.map((v, i) => getTab(v, i, true))}
                </Tabs>
                {!hideButtons &&
                    <IconButton color="success" onClick={() => setShowDiagAdd(true)}>
                        <AddCircleIcon />
                    </IconButton>
                }
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
        <CSVariantDialogAdd show={showDiagAdd} onValidate={validateVariantName} onCancel={() => setShowDiagAdd(false)} onSubmit={addVariant} />
        {current_variant && <CSVariantDialogRename name={current_variant.variant || ""} show={showDiagRename} onValidate={validateVariantName} onCancel={() => setShowDiagRename(false)} onSubmit={renameVariant} />}
    </>;
}