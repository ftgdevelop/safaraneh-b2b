import { Flight, ServerAddress } from "@/enum/url"
import axios from "axios"
import { AvailibilityParams, FlightPrereserveFormValue } from "../types/flights";
import { CurrencyType } from "@/modules/payment/types";

export const GetAirportsByCode = async (codes: string[], acceptLanguage: string = 'fa-IR') => {
    try {
        const parameters = codes.map(code =>`Codes=${code}`).join("&");
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Flight}${Flight.GetAirportsByCode}?${parameters}&AirportTypes=Main`,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Tenantid: process.env.PROJECT_SERVER_TENANTID
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const GetAvailabilityKey = async (params: AvailibilityParams,token:string, acceptLanguage: string = 'fa-IR') => {
    try {

        let Headers;
        if (token){
            Headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json;charset=UTF-8',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID,
                Authorization: `Bearer ${token}`
            }
        }else{
            Headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json;charset=UTF-8',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                "Accept-Language": acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID,
            } 
        }

        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Flight}${Flight.Availability}`,
            params,
            {headers: Headers}
        )
        return response
    } catch (error) {
        return error
    }
}


export const GetFlightList = async (params:{key: string, currency: "IRR"|"USD", token:string},  acceptLanguage: string = 'fa-IR') => {
    try {

        let Headers;
        if (params.token){
            Headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json;charset=UTF-8',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID,
                Currency: params.currency || "IRR",
                Authorization: `Bearer ${params.token}`
            }
        }else{
            Headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json;charset=UTF-8',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID,
                Currency: params.currency || "IRR",
            } 
        }

        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Flight}${Flight.GetAvailability}?&key=${params.key}`,
            {headers: Headers}
        )
        return response
    } catch (error) {
        return error
    }
}

export const FlightGetValidate = async (params:{key: string,token?:string}, acceptLanguage: string = 'fa-IR') => {
    try {
        
        let Headers;
        if (params.token){
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID,
                Authorization: `Bearer ${params.token}`
            }
        }else{
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID
            } 
        }

        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Flight}${Flight.GetValidate}?preReserveKey=${params.key}`,
            {headers: Headers}
        )
        return response
    } catch (error) {
        return error
    }
}

export const getAllCountries = async (acceptLanguage: string = 'fa-IR') => {
    try {        
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Flight}${Flight.GetAllCountries}?MaxResultCount=300`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    'Accept-Language': acceptLanguage
                }
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const FlightPreReserve = async (values:{params: FlightPrereserveFormValue, token:string}, acceptLanguage: string = 'fa-IR') => {
    try {

        let Headers;
        if (values.token){
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID,
                Authorization: `Bearer ${values.token}`
            }
        }else{
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID
            } 
        }


        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Flight}${Flight.PreReserve}`,
            values.params,
            {
                headers: Headers,
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const validateFlight = async (params: {
    departureKey: string;
    returnKey?: string;
    token?: string;
}, acceptLanguage: string = 'fa-IR') => {
    try {

        let Headers;
        if (params.token){
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID,
                Authorization: `Bearer ${params.token}`
            }
        }else{
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID
            } 
        }

        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Flight}${Flight.ValidateFlight}`,
            {departureKey: params.departureKey,returnKey: params.returnKey},
            {headers:Headers}
        )
        return response
    } catch (error) {
        return error
    }
}


export const flightGetReserveById = async (params:{userName:string, reserveId: string, token:string},acceptLanguage: string = 'fa-IR') => {
    try {   
        
        let Headers;
        if (params.token){
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID,
                Authorization: `Bearer ${params.token}`
            }
        }else{
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID
            } 
        }

        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Flight}${Flight.GetReserveById}?reserveId=${params.reserveId}&username=${params.userName}`,
            {headers:Headers}
        )
        return response
    } catch (error) {
        return error
    }
}


export const confirmFlight = async (params:{userName:string, reserveId: string, token:string}, acceptLanguage: string = 'fa-IR') => {
    try {

        let Headers;
        if (params.token){
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID,
                Authorization: `Bearer ${params.token}`
            }
        }else{
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID
            } 
        }

        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Flight}${Flight.Confirm}`,
            {userName:params.userName, reserveId: params.reserveId},
            {headers:Headers}
        )
        return response
    } catch (error) {
        return error
    }
}

export const flightGetVoucherPdf = async (params:{userName:string, reserveId: string, token:string},acceptLanguage: string = 'fa-IR') => {
    try {   
        
        let Headers;
        if (params.token){
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID,
                Authorization: `Bearer ${params.token}`
            }
        }else{
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID
            } 
        }

        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Flight}${Flight.GetVoucherPdf}?ReserveId=${params.reserveId}&Username=${params.userName}`,
            {headers:Headers}
        )
        return response
    } catch (error) {
        return error
    }
}


export const getTenantReservesDomesticFlight = async (queryParams:string, headerParams:{token:string, tenant:number , acceptLanguage: string , currencyType : CurrencyType}) => {
    try {
      const response = await axios.get(
        `${ServerAddress.Type}${ServerAddress.Flight}${Flight.GetFlightTenantAllReserves}?${queryParams}`,
        {
          headers: {
            "Accept-Language": headerParams.acceptLanguage,
            Accept: 'application/json;charset=UTF-8',
            apikey: process.env.PROJECT_SERVER_APIKEY,
            Authorization: `Bearer ${headerParams.token}`,
            Tenantid: headerParams.tenant,
            Currency: headerParams.currencyType
          },
        },
      )
      return response
    } catch (error) {
      return error
    }
  
  }


export const flightGetTenantReserveById = async (params:{userName:string, reserveId: string, token:string},acceptLanguage: string = 'fa-IR') => {
    try {   
        
        let Headers;
        if (params.token){
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID,
                Authorization: `Bearer ${params.token}`
            }
        }else{
            Headers = {
                'Content-Type': 'application/json',
                apikey: process.env.PROJECT_SERVER_APIKEY,
                'Accept-Language': acceptLanguage,
                Tenantid: process.env.PROJECT_SERVER_TENANTID
            } 
        }

        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Flight}${Flight.GetFlightReserveById}?reserveId=${params.reserveId}&username=${params.userName}`,
            {headers:Headers}
        )
        return response
    } catch (error) {
        return error
    }
}

  