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