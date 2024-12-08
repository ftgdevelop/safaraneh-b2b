import axios from 'axios';

import { ServerAddress, Strapi } from "../../../enum/url";

const token = ServerAddress.StrapiToken;

export const getStrapiPages = async (query: string , acceptLanguage: "fa-IR"|"en-US"|"ar-AE" = "fa-IR") => {

    try {
        const response = await axios({
            method: "get",
               url: `${ServerAddress.Type}${ServerAddress.Strapi}${Strapi.Pages}?${query}`,
            headers: {
                "Accept-Language": acceptLanguage,
                Authorization: `bearer ${token}`
            }
        });
        return (response)
    } catch (error: any) {
        return error
    }
}


export const getStrapiData = async (query: string , acceptLanguage: "fa-IR"|"en-US"|"ar-AE" = "fa-IR") => {

    try {
        const response = await axios({
            method: "get",
            url: `${ServerAddress.Type}${ServerAddress.Strapi}${Strapi.Affiliate}?${query}`,
            headers: {
                "Accept-Language": acceptLanguage,
                Authorization: `bearer ${token}`
            }
        });
        return (response)
    } catch (error: any) {
        return error
    }
}
