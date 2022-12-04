import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { ICSHasVariant, ICSVariantContainer } from "../../../../Plugins/CobaltStrike/CSProfileTypes";
import CSVariantDialog from "./CSVariantDialog";

interface Props<T extends ICSHasVariant> {
    container: ICSVariantContainer<T>;
    itemView: (item: T) => JSX.Element;
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

export const CSVariants = <T extends ICSHasVariant>({ container, itemView, createVariant }: Props<T>) => {
    const [idx, setIdx] = useState(0);
    const [showDiag, setShowDiag] = useState(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue == container.variants.length + 1) {
            setShowDiag(true);
            // Add new variant to container
            setIdx(idx); // Restore former index
        } else {
            setIdx(newValue);
        }
    };

    const validateVariantName = (name: string) => {
        if (name.length == 0) return "Enter a name!";
        if (container.variants.filter(v => v.variant === name).length > 0) return "Variant name already taken!"
        return "";
    }

    const addVariant = (name: string) => {
        createVariant(container, name);
    }

    return <><Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={idx} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Baseline" />
            {container.variants.map((v, i) => <Tab key={i} label={`Variant "${v.variant}"`} />)}
            <Tab label="+" />
        </Tabs>
    </Box>
        <TabPanel value={idx} index={0}>
            {itemView(container.baseline)}
        </TabPanel>
        {container.variants.map((v, i) => <TabPanel value={idx} key={i} index={1 + i}>
            {itemView(container.variants[i])}
        </TabPanel>)}
        <TabPanel value={idx} index={container.variants.length + 1}>
            <></>
        </TabPanel>
        <CSVariantDialog show={showDiag} onValidate={validateVariantName} onCancel={() => setShowDiag(false)} onSubmit={addVariant} />
    </>;
}