import axios from 'axios';

import { Header, ServerAddress, Reserve, Traveler, Cms } from "../../../enum/url";
import { ReserveType } from '../types/common';

export const getPageByUrl = async (url: string,tenant:number, acceptLanguage: string = "fa-IR") => {
    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.CMS}${Cms.GetByUrl}?Url=${url}`,
            {
                headers: {
                    ...Header,
                    "Accept-Language": acceptLanguage,
                    "Apikey": process.env.PROJECT_SERVER_APIKEY,
                    "Tenantid": tenant
                }
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const getReserveFromCoordinator = async (params: { tenant:number,reserveId: string, username: string }, acceptLanguage: string = "fa-IR") => {
    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Coordinator}${Reserve.GetReserveFromCoordinator}?Id=${params.reserveId}&Username=${params.username}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'text/plain',
                    "Accept-Language": acceptLanguage,
                    "TenantId": params.tenant
                }
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const getUserAllReserves = async (params: {
    SkipCount?: number;
    MaxResultCount?: number;
    Statue?: string;
    Types?: ReserveType;
    FromReturnTime?: string;
    ToReturnTime?: string;
    Ids?: number;
    tenant:number;
}, token: string, acceptLanguage: string = "fa-IR") => {
    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Coordinator}${Reserve.GetUserAllReserves}`,
            {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'text/plain',
                    "Accept-Language": acceptLanguage,
                    "TenantId": params.tenant,
                    Authorization: `Bearer ${token}`
                }
            },
        )
        return response
    } catch (error) {
        return error
    }
}












export const getTravelers = async (token: string,tenant:number, acceptLanguage: string = "fa-IR") => {
    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Traveler}${Traveler.GetAll}`,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Authorization: `Bearer ${token}`,
                    Tenantid: tenant
                }
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const deleteTraveller = async (id:number, token: string, tenant:number, acceptLanguage: string = "fa-IR") => {
    try {
        let response = await axios.delete(
            `${ServerAddress.Type}${ServerAddress.Traveler}${Traveler.Delete}?Id=${id}`,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Authorization: `Bearer ${token}`,
                    Tenantid: tenant
                }
            },
        )
        return response
    } catch (error) {
        return error
    }
}

// export const addTraveler = async (token: string,tenant:number, acceptLanguage: string = "fa-IR") => {
//     try {

//         const params = {
//             "tenantId": 1040,
//             "userId": 120629,
//             "firstname": "Saman",
//             "firstnamePersian": "سامان",
//             "lastname": "Rad",
//             "lastnamePersian": "راد",
//             "gender": true,
//             "nationalId": "1999993199",
//             "birthDate": "2024-01-01",
//             "nationality": "IR",
//             "email": "Ava@rez.com",
//             "passportCountry": "IR",
//             "passportExpirationDate": "2025-05-19",
//             "passportNumber": "005000011",
//             "phoneNumber": "",
//             "id": 0
//         }

//         let response = await axios({
//             method: "post",
//             url: `${ServerAddress.Type}${ServerAddress.Traveler}${Traveler.Create}`,
//             data: { ...params },
//             headers: {
//                 Accept: 'application/json;charset=UTF-8',
//                 apikey: process.env.PROJECT_SERVER_APIKEY,
//                 "Accept-Language": acceptLanguage,
//                 Authorization: `Bearer ${token}`,
//                 Tenantid: tenant
//             },
//         })
//         return response
//     } catch (error) {
//         return error
//     }
// }
