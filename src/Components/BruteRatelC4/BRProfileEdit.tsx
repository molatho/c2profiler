import { AppBar, Stack, Typography, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { ProfileChangedCb } from "../../Misc/IC2Provider";
import { IBRProfile } from "../../Plugins/BruteRatelC4/BRProfileTypes";
import { PaperItem } from "../PaperItems/PaperItem";

interface Props {
    profile: any;
    onProfileChanged: ProfileChangedCb;
}

interface TabViewProps {
    brprofile: IBRProfile;
    onProfileChanged: ProfileChangedCb;
}

interface TabInfo {
    name: string,
    view: ({ brprofile, onProfileChanged }: TabViewProps) => JSX.Element | null
}

const TAB_DATA: TabInfo[] = [
    {
        name: "General Options",
        view: ({ brprofile, onProfileChanged }: TabViewProps) => <>{JSON.stringify(brprofile)}</>
    },
    {
        name: "Listeners",
        view: ({ brprofile, onProfileChanged }: TabViewProps) => <>{JSON.stringify(brprofile)}</>
    },
    {
        name: "Payloads",
        view: ({ brprofile, onProfileChanged }: TabViewProps) => <>{JSON.stringify(brprofile)}</>
    },
    {
        name: "Commands",
        view: ({ brprofile, onProfileChanged }: TabViewProps) => <>{JSON.stringify(brprofile)}</>
    }
]

export const BRProfileEdit = ({ profile, onProfileChanged }: Props) => {
    const [viewIdx, setViewIdx] = useState(0);
    const brprofile = profile as IBRProfile;

    const getView = () => {
        const View = TAB_DATA[viewIdx].view;
        return <View brprofile={brprofile} onProfileChanged={onProfileChanged} />
    }

    return <>
        <PaperItem small>
            <>
                <AppBar position="sticky">
                    <Tabs
                        value={viewIdx}
                        onChange={(_, newIdx) => setViewIdx(newIdx)}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        sx={{ width: '100%' }}>
                        {TAB_DATA.map((d, i) => <Tab key={i} label={d.name} sx={{ textTransform: 'none' }} />)}
                    </Tabs>
                </AppBar>
                {getView()}
            </>
        </PaperItem >
    </>
}