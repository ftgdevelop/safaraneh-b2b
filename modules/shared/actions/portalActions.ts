import axios from 'axios';

import { Header,ServerAddress, Identity } from "../../../enum/url";

export const getPortal = async (acceptLanguage: "fa-IR"|"en-US"|"ar-AE" = "fa-IR") => {

    try {
        const response = await axios({
            method: "get",
            url: `${ServerAddress.Type}${ServerAddress.Identity}${Identity.GetSiteAllSettings}`,
            headers: {
                ...Header,
                "Accept-Language": acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID
            }
        });
        return (response)
    } catch (error: any) {
        return error
    }
}
