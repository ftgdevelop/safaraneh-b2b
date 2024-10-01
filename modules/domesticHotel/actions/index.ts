import axios from 'axios';

import { Header, ServerAddress, Hotel } from "../../../enum/url";
import { DomesticHotelPrereserveParams } from '../types/hotel';

export const getDomesticHotelSummaryDetailById = async (id: number, acceptLanguage: string = 'fa-IR') => {
    try {
        const response = await axios({
            method: "get",
            url: `${ServerAddress.Type}${ServerAddress.Hotel_Data}${Hotel.GetHotelSummaryDetailById}?Id=${id}`,
            headers: {
                ...Header,
                "Accept-Language": acceptLanguage
            }
        });
        return (response)
    } catch (error: any) {
        return error
    }
}

export const getDomesticHotelDetailsByUrl = async (url: string, acceptLanguage: string = 'fa-IR') => {
    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Hotel_WP}${Hotel.GetDomesticHotelDetails}?url=${url}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    'Accept-Language': acceptLanguage,
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const SearchAccomodation = async (parameters: {url: string; EntityId?: string}, acceptLanguage: string = 'fa-IR') => {
    try {
        
        const paramsArray :string[] = [];
        if(parameters.EntityId){
            paramsArray.push(`EntityId=${parameters.EntityId}`);
        }

        if(parameters.url){
            paramsArray.push(`Url=${parameters.url}`);
        }

        const requestUrl = ServerAddress.Type! + ServerAddress.Hotel_Data! + Hotel.SearchAccomodations+ "?" + paramsArray.join("&") ;

        let response = await axios.get(
            requestUrl,
            {
                headers: {
                    'Content-Type': 'application/json',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    'Accept-Language': acceptLanguage,
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const AvailabilityByHotelId = async (params: {
    ids: number[];
    checkin: string;
    checkout: string;

}, acceptLanguage: string = 'fa-IR') => {
    try {
        const response = await axios({
            method: "post",
            data: {
                hotelIds: params.ids,
                checkIn: params.checkin,
                checkOut: params.checkout
            },
            url: `${ServerAddress.Type}${ServerAddress.Hotel_Availability}${Hotel.AvailabilityByHotelId}`,
            headers: {
                ...Header,
                "Accept-Language": acceptLanguage,
                Currency: "IRR",
                TenantId: process.env.PROJECT_SERVER_TENANTID,
                Apikey: process.env.PROJECT_SERVER_APIKEY
            }
        });
        return (response)
    } catch (error: any) {
        return error
    }
}


export const getRates = async (ids: number[], acceptLanguage: string = 'fa-IR') => {
    try {
        const response = await axios({
            method: "post",
            data: {
                HotelIds: ids,
            },
            url: `${ServerAddress.Type}api.safaraneh.com${Hotel.getRates}`,
            headers: {
                ...Header,
                "Accept-Language": acceptLanguage,
                Currency: "IRR",
                Apikey: process.env.PROJECT_SERVER_APIKEY
            }
        });
        return (response)
    } catch (error: any) {
        return error
    }
}


export const getEntityNameByLocation = async (cityId: number, acceptLanguage: string = 'fa-IR') => {
    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Hotel_Data}${Hotel.GetEntityNameByLocation}?id=${cityId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    'Accept-Language': acceptLanguage
                },
            },
        )
        return response
    } catch (error) {
        return error
    }

}

export const GetRooms = async (params:{id:number,checkin:string,checkout:string} , acceptLanguage: string = 'fa-IR') => {
    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Hotel_Availability}${Hotel.GetRooms}?Id=${params.id}&CheckIn=${params.checkin}&CheckOut=${params.checkout}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    'Accept-Language': acceptLanguage,
                    Currency: "IRR",                  
                    TenantId: process.env.PROJECT_SERVER_TENANTID
                }
            }
        )
        return response
    } catch (error) {
        return error
    }
}

export const insertComment = async (param: any, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}api.safaraneh.com${Hotel.InsertComment}`,
            param,
            {
                headers: {
                    ...Header,
                    "Accept-Language": acceptLanguage,
                    // apikey: "68703d73-c92c-4105-9f71-9f718aaad2cc"
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const domesticHotelValidateRoom = async (param: {
    bookingToken: string;
    checkin: string;
    checkout: string;
    count: number;
    MetaSearchName?: string | null;
    MetaSearchKey?: string | null;
}, acceptLanguage: string = 'fa-IR') => {

    // const token = localStorage.getItem('Token');

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Hotel_Availability}${Hotel.ValidateRoom}`,
            param,
            {
                headers: {
                    accept: 'text/plain',
                    'Content-Type': 'application/json',
                    TenantId: process.env.PROJECT_SERVER_TENANTID,
                    // Authorization: `Bearer ${token}`,
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    'Accept-Language': acceptLanguage,
                    Currency: 'IRR'
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const domesticHotelGetValidate = async (key: string, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Hotel_Availability}${Hotel.GetValidate}?Id=${key}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    'Accept-Language': acceptLanguage,
                    Currency: "IRR"
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const domesticHotelPreReserve = async (param: DomesticHotelPrereserveParams,token?:string | null , acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Hotel_Availability}${Hotel.PreReserve}`,
            param,
            {
                headers: {
                    accept: 'text/plain',
                    'Content-Type': 'application/json',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    'Accept-Language': acceptLanguage,
                    TenantId: process.env.PROJECT_SERVER_TENANTID,
                    Authorization: `Bearer ${token}`,
                    Currency: 'IRR'
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const domesticHotelGetReserveById = async (params: { reserveId: string, userName: string }, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Hotel_Availability}${Hotel.GetReserveById}?ReserveId=${params.reserveId}&Username=${params.userName}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    'Accept-Language': acceptLanguage,
                    Currency: "IRR"
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const DomesticHotelConfirm = async (param: { reserveId: string, username: string }, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Hotel_Availability}${Hotel.Confirm}`,
            param,
            {
                headers: {
                    ...Header,
                    'Accept-Language': acceptLanguage,
                    TenantId: process.env.PROJECT_SERVER_TENANTID,
                    Currency: 'IRR'
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}
