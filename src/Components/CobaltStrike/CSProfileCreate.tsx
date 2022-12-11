import { Button } from "@mui/material";
import { IC2ImporterProps } from "../../Misc/IC2Provider";
import { CSProfileHelper } from "../../Plugins/CobaltStrike/CSProfileHelper";
import { ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";


export const CSProfileCreate = ({ onImported }: IC2ImporterProps) => {
    const createProfile = () => {
        var profile = new Object();
        CSProfileHelper.create_code_signer(profile as ICSProfile);
        CSProfileHelper.create_dns_beacon(profile as ICSProfile);
        CSProfileHelper.create_http_config(profile as ICSProfile);
        CSProfileHelper.create_http_get(profile as ICSProfile);
        CSProfileHelper.create_http_post(profile as ICSProfile);
        CSProfileHelper.create_http_stager(profile as ICSProfile);
        CSProfileHelper.create_https_certificate(profile as ICSProfile);
        CSProfileHelper.create_post_ex(profile as ICSProfile);
        CSProfileHelper.create_process_inject(profile as ICSProfile);
        CSProfileHelper.create_stage(profile as ICSProfile);
        var csprofile = profile as ICSProfile;
        csprofile.options = [];
        onImported(profile);
    }
    return <Button variant="contained" color="success" onClick={createProfile}>Create empty</Button>
}