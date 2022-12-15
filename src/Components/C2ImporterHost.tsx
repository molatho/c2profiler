import { Tabs, Tab, Box, Typography, AppBar } from "@mui/material";
import { useState } from "react";
import { IC2Importer, IC2Provider } from "../Misc/IC2Provider";


interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    shown: boolean;
}

function TabPanel({ children, shown }: TabPanelProps) {
    return (
        <div
            role="tabpanel"
            hidden={!shown}
        >
            {shown && (
                <Box component="div" sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}


interface Props {
    c2: IC2Provider;
    onImported: (profile: any) => void;
}
export const C2ImporterHost = ({ c2, onImported }: Props) => {
    const [selectedImporter, setSelectedImporter] = useState<IC2Importer>(c2.importers[0]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedImporter(c2.importers[newValue]);
    };

    return (
        <>
            <AppBar position="sticky">
                <Tabs value={c2.importers.indexOf(selectedImporter)} onChange={handleChange}>
                    {c2.importers.map((imp, idx) => <Tab label={imp.name} key={idx}></Tab>)}
                </Tabs>
            </AppBar>
            <Box component="main" sx={{ backgroundColor: '#242424' }}>
                {c2.importers.map((imp, idx) => <TabPanel key={idx} value={idx} shown={imp == selectedImporter}>{imp.view({ "onImported": onImported })}</TabPanel>)}
            </Box>
        </>
    );
}