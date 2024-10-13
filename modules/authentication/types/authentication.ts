export interface UpdateUserParams {
    firstname?: string;
    lastname?: string;
    timezone?: string;
    nationalId?: string;
    gender?: boolean;
    birthDay?: string;
    nationalityId?: string;
    isNewsLetter?: boolean;
}

export interface UserInformation {
    firstName?: string;
    lastName?: string;
    userName?: string;
    id: number;
    emailAddress?: string;
    phoneNumber?: string;
    isPhoneNumberConfirmed: boolean;
    isEmailConfirmed: boolean;
    isActive: boolean;
    gender: boolean;
    birthDay?: string;
    isNewsletter: boolean;
    nationalityId?: string;
    nationalId?: string;
}

export interface UserItemType {
    userName?: string;
    emailAddress?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    isActive: boolean;
    gender: boolean;
    birthDay?: string;
    isNewsLater: boolean;
    isEmailConfirmed: boolean;
    phoneNumber?: string;
    nationalityId?: string;
    hostAccess: unknown;
    roleNames: [];
    id: number;
}


export interface NewUserParameters {
    birthDay?: string;
    emailAddress?: string;
    firstName?: string;
    gender: boolean;
    isActive: boolean;
    isEmailConfirmed: boolean;
    isNewsLater: boolean;
    lastName?: string;
    nationalityId?: string;
    phoneNumber?: string;
    roleNames: string[];
    password?: string;
}

export interface UpdateUserParameters extends NewUserParameters {
    id: number;
} 

export interface UserDataType {
    userName?: string;
    emailAddress?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    isActive: boolean;
    hostAccess?: unknown;
    gender: boolean;
    birthDay?: string;
    isNewsLater:boolean;
    isEmailConfirmed:boolean;
    nationalityId?: string;
    phoneNumber?: string;
    roleNames: string[];
    id: number;
}