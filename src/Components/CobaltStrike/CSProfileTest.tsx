import { AppBar, Stack, Typography, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { IC2TestProps } from "../../Misc/IC2Provider";
import { CSProfileToHttpFormatter } from "../../Plugins/CobaltStrike/CSProfileFormatter";
import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";
import { HttpView } from "../Misc/HttpView";
import { PaperItem } from "../PaperItems/PaperItem";
import { CSVariants } from "./EditBlocks/Controls/CSVariants";

interface TabViewProps {
    csprofile: ICSProfile;
}

//TODO: Fix views showing default data on empty profiles :)
const TAB_DATA = [
    {
        name: "HTTP GET",
        type: "http_get",
        view: ({ csprofile }: TabViewProps) => <>
            {
                csprofile.http_get && <CSVariants
                    profile={csprofile}
                    container={csprofile.http_get}
                    onProfileChanged={() => { }}
                    createVariant={() => { }}
                    hideButtons
                    itemView={(http_get) => <>{CSProfileToHttpFormatter.format_http_get_req(http_get).map((r, i) => <HttpView key={i} label="Request" text={r} />)}
                        <HttpView label="Response" text={CSProfileToHttpFormatter.format_http_get_res(http_get)} />
                    </>} />
            }
        </>
    },
    {
        name: "HTTP POST",
        type: "http_post",
        view: ({ csprofile }: TabViewProps) => <>
            {
                csprofile.http_post && <CSVariants
                    profile={csprofile}
                    container={csprofile.http_post}
                    onProfileChanged={() => { }}
                    createVariant={() => { }}
                    hideButtons
                    itemView={(http_post) => <>{CSProfileToHttpFormatter.format_http_post_req(http_post).map((r, i) => <HttpView key={i} label="Request" text={r} />)}
                        <HttpView label="Response" text={CSProfileToHttpFormatter.format_http_post_res(http_post)} />
                    </>} />
            }
        </>
    }
]

export const CSProfileTest = ({ profile, navigateTo }: IC2TestProps) => {
    const [viewIdx, setViewIdx] = useState(0);
    const csprofile = profile as ICSProfile;

    const getBlockView = () => {
        const BlockView: (props: TabViewProps) => JSX.Element = TAB_DATA[viewIdx].view;
        if (BlockView) return <BlockView csprofile={csprofile} />
        else return <></>
    }

    return <>
        <PaperItem small>
            <>
                <AppBar position="sticky">
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ pl: 2, pr: 2 }}>Blocks:</Typography>
                        <Tabs
                            value={viewIdx}
                            onChange={(_, newIdx) => setViewIdx(newIdx)}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            sx={{ width: '100%' }}>
                            {TAB_DATA.map((d, i) => <Tab key={i} label={d.name} sx={{ textTransform: 'none' }} />)}
                        </Tabs>
                    </Stack>
                </AppBar>
                {getBlockView()}
            </>
        </PaperItem >
    </>
}