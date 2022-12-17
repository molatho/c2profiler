import { IC2TestProps } from "../../Misc/IC2Provider";
import { CSProfileHelper } from "../../Plugins/CobaltStrike/CSProfileHelper";
import { ICSBlockHttpGet, ICSProfile } from "../../Plugins/CobaltStrike/CSProfileTypes";
import { HttpView, HttpVisualizer } from "../Misc/HttpVisualizer";
import { CSVariants } from "./EditBlocks/Controls/CSVariants";


const TEST_REQUEST = `GET /echo HTTP/1.1
Host: reqbin.com
Accept: text/html
`

const TEST_RESPONSE = `HTTP/1.1 200 OK
Date: Tue, 24 Nov 2020 06:09:50 GMT
Content-Type: text/html; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Set-Cookie: __cfduid=da32effe87c5e0cd1ea5be221bad82fe21606198190; expires=Thu, 24-Dec-20 06:09:50 GMT; path=/; domain=.reqbin.com; HttpOnly; SameSite=Lax; Secure
CF-Cache-Status: DYNAMIC
cf-request-id: 069a787a0c000015a7ef081000000001
Expect-CT: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
Report-To: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report?s=u9lRCrhGRi8kw3z6VFIxki%2Bj9bXc2w75ya5Ve1BcZRmgh63%2BmZE80uUIc4x0yn8NiQ%2F6jGVM%2F5ZJ%2Fb%2BijXm7Pvwn6bp5iBgCWTiT"}],"group":"cf-nel","max_age":604800}
NEL: {"report_to":"cf-nel","max_age":604800}
Server: cloudflare
CF-RAY: 5f70f6a34fa315a7-EWR
Content-Encoding: gzip

<html><head><title>ReqBin Echo</title></head></html>`

export const CSProfileTest = ({ profile, navigateTo }: IC2TestProps) => {
    const csprofile = profile as ICSProfile;

    // <HttpVisualizer verb="GET" request={TEST_REQUEST} response={TEST_RESPONSE} />

    const getHttpVisualizations = (http_get: ICSBlockHttpGet) => {
        const requests = CSProfileHelper.format_http_get_req(http_get);
        return <>{requests.map((r, i) => <HttpView key={i} label="Request" text={r} />)}</>
    }

    return <>{csprofile.http_get && <CSVariants
        profile={profile}
        container={csprofile.http_get}
        onProfileChanged={() => { }}
        createVariant={() => { }}
        hideButtons
        itemView={(i) => getHttpVisualizations(i)} />}</>
}