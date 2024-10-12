import { Identity, ServerAddress, Header } from "@/enum/url"
import axios from "axios"
import { NewUserParameters, UpdateUserParams } from "../types/authentication"

export const getUsers = async (params: {
    token: string;
    tenant: number;
    queries: string;
}) => {

    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.getAllUsers}?${params.queries}`,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    Authorization: `Bearer ${params.token}`,
                    Tenantid: params.tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const resetUsersPassword = async (param: { password: string, userId: number, token: string, tenantId: number }, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.ResetUsersPassword}`,
            {
                id: param.userId,
                newPassword: param.password
            },
            {
                headers: {
                    ...Header,
                    "Accept-Language": acceptLanguage,
                    Authorization: `Bearer ${param.token}`,
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    Tenantid: param.tenantId
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const createUser = async (param: { userData: NewUserParameters, token: string, tenantId: number }, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.CreateNewUser}`,
            param.userData,
            {
                headers: {
                    ...Header,
                    "Accept-Language": acceptLanguage,
                    Authorization: `Bearer ${param.token}`,
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    Tenantid: param.tenantId
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const sendOtp = async (param: { emailOrPhoneNumber: string, tenantId: number }, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.SendOTP}`,
            param,
            {
                headers: {
                    ...Header,
                    "Accept-Language": acceptLanguage,
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    Tenantid: param.tenantId
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const registerOrLogin = async (param: { emailOrPhoneNumber: string, code: string; tenantid: number }, acceptLanguage: string = 'fa-IR') => {

    try {
        const response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.RegisterOrLogin}`,
            param,
            {
                headers: {
                    ...Header,
                    "Accept-Language": acceptLanguage,
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    Tenantid: param.tenantid
                },
            },
        );

        return response
    } catch (error) {
        return error
    }
}


export const getCurrentUserProfile = async (token: string, tenant: number) => {

    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.GetCurrentUserProfileForEdit}`,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    Authorization: `Bearer ${token}`,
                    Tenantid: tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const getCurrentUserPermissions = async (token: string, tenant: number) => {

    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.GetPermissions}`,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    Authorization: `Bearer ${token}`,
                    Tenantid: tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const updateCurrentUserProfile = async (params: UpdateUserParams, token: string, tenant: number) => {

    try {
        let response = await axios.put(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.UpdateCurrentUserProfile}`,
            params,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    Authorization: `Bearer ${token}`,
                    Tenantid: tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const updateNewsletterUserProfile = async (params: UpdateUserParams, token: string, tenant: number) => {

    try {
        let response = await axios.put(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.UpdateNewsletterUserProfile}`,
            params,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    Authorization: `Bearer ${token}`,
                    Tenantid: tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const updateProfileEmail = async (emailAddress: string, token: string, tenant: number, acceptLanguage: string = "fa-IR") => {

    try {
        let response = await axios.put(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.UpdateProfileEmail}`,
            { emailAddress: emailAddress },
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Authorization: `Bearer ${token}`,
                    Tenantid: tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}



export const updateProfilePhoneNumber = async (phoneNumber: string, token: string, tenant: number, acceptLanguage: string = "fa-IR") => {

    try {
        let response = await axios.put(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.UpdateProfilePhoneNumber}`,
            { phoneNumber: phoneNumber },
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Authorization: `Bearer ${token}`,
                    Tenantid: tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const sendVerificationSms = async (phoneNumber: string, token: string, tenant: number, acceptLanguage: string = "fa-IR") => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.SendVerificationSms}`,
            { phoneNumber: phoneNumber },
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Authorization: `Bearer ${token}`,
                    Tenantid: tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const verifySmsCode = async (params: { phoneNumber: string, token: string, tenant: number, code: string }, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.VerifySmsCode}`,
            { phoneNumber: params.phoneNumber, code: params.code },
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Authorization: `Bearer ${params.token}`,
                    Tenantid: params.tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}



export const getTenant = async (keyword: string) => {

    try {
        let response = await axios.get(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.getTenantByKeyword}?name=${keyword}`,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    "Accept-Language": "fa-IR"
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const loginWithPassword = async (params: { emailOrPhoneNumber: string, password: string, tenantId: number }) => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.LoginWithPassword}`,
            params,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": "fa-IR",
                    Tenantid: params.tenantId
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}



export const forgotPasswordByPhoneNumber = async (phoneNumber: string, tenant: number, acceptLanguage: string = "fa-IR") => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.ForgotPasswordByPhoneNumber}`,
            { phoneNumber: phoneNumber },
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Tenantid: tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}



export const forgotPasswordVerification = async (params: { userId: string; code: string; tenant: number; }, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.ForgotPasswordVerification}`,
            params,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Tenantid: params.tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const resetPassword = async (params: { userId: string; code: string; password: string; tenant: number }, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.ResetPassword}`,
            params,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Tenantid: params.tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const forgotPasswordByEmail = async (emailAddress: string, tenant: number, acceptLanguage: string = "fa-IR") => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.ForgotPasswordByEmail}`,
            { emailAddress: emailAddress },
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Tenantid: tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const register = async (params: { emailOrPhoneNumber: string, password: string, tenant: number }, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.Register}`,
            params,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Tenantid: params.tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}


export const changePassword = async (params: { tenant: number, currentPassword: string; newPassword: string; token: string }, acceptLanguage: string = 'fa-IR') => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.ChangePassword}`,
            {
                currentPassword: params.currentPassword,
                newPassword: params.newPassword
            },
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Authorization: `Bearer ${params.token}`,
                    Tenantid: params.tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const sendEmailActivation = async (emailAddress: string, token: string, tenant: number, acceptLanguage: string = "fa-IR") => {

    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.SendEmailActivation}`,
            {
                emailAddress: emailAddress
            },
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Authorization: `Bearer ${token}`,
                    Tenantid: tenant
                },
            },
        )
        return response
    } catch (error) {
        return error
    }
}

export const activateEmail = async (params: { code: string, userId: string, tenant: number }, acceptLanguage: string = 'fa-IR') => {
    try {
        let response = await axios.post(
            `${ServerAddress.Type}${ServerAddress.Identity}${Identity.ActivateEmail}`,
            params,
            {
                headers: {
                    Accept: 'application/json;charset=UTF-8',
                    apikey: process.env.PROJECT_SERVER_APIKEY,
                    "Accept-Language": acceptLanguage,
                    Tenantid: params.tenant
                }
            }
        )
        return response
    } catch (error) {
        return error
    }
}
