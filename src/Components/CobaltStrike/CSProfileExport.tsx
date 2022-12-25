import CodeMirror from '@uiw/react-codemirror';
import { IC2ExportProps } from "../../Misc/IC2Provider";
import { CSProfileToCSFormatter } from '../../Plugins/CobaltStrike/CSProfileFormatter';
import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";

export const CSProfileExport = ({ profile, navigateTo }: IC2ExportProps) => {
    const text = CSProfileToCSFormatter.format_out_profile(profile as ICSProfile);

    return <CodeMirror
        value={text}
        height={"auto"}
        theme="dark"
        readOnly
    />
}