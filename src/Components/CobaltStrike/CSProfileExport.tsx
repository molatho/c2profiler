import { Typography } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { IC2ExportProps } from "../../Misc/IC2Provider";
import { CSProfileToCSFormatter } from '../../Plugins/CobaltStrike/CSProfileFormatter';
import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";
import { PaperItem } from '../PaperItems/PaperItem';

export const CSProfileExport = ({ profile, navigateTo }: IC2ExportProps) => {
    const text = CSProfileToCSFormatter.format_out_profile(profile as ICSProfile);

    return <PaperItem small>
        <>
            <Typography sx={{m: 2}} variant="h5">CobaltStrike Malleable Profile</Typography>
            <CodeMirror
                value={text}
                height={"auto"}
                theme="dark"
                readOnly
            />
        </>
    </PaperItem>
}