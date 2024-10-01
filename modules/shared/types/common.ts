export type TabItem = {
    key: string | number;
    label: React.ReactNode;
    children: React.ReactNode;
    href?:string;
};

export interface GetPageByUrlDataType {
    entityId?: number;
    title?: string;
    pageTitle?: string;
    metaKeyword?: string;
    metaDescription?: string;
    url?: string;
    widget?:{
      content?:{
        description?: string;
      };
      faqs?:{
        question?: string;
        answer?: string;
      }[]
    }
  };


export interface HotelPageDataType {
    Id?: number;
    PageName?: string;
    Url?: string;
    PageTitle?: string;
    MetaTags?: {
        Name: string;
        Content: string
    }[];
}

export interface WebSiteDataType {
    billing: {
        name?: string;
        email?: string;
        telNumber?: string;
        phoneNumber?: string;
        emergencyNumber?: string;
        faxNumber?: string;
        countryName?: string;
        provinceName?: string;
        cityName?: string;
        address?: string;
        zipCode?: string;
        website?: string;
        latitude?: string;
        longitude?: string;
        logo?: {
            value?: string;
        };
        favIcon?: {
            value?: string;
        };
        //   "symbol": {
        //     "value": null,
        //     "key": null
        //   },
        //   "stamp": {
        //     "value": "https://cdn2.safaraneh.com/images/setting/1040/signtue-safaraneh-png.png",
        //     "key": "802f7cbc-6e18-ef11-a414-000c290e44c9"
        //   },
        //   "tagline": null
    },
    metaTags: {
        creator?: string;
        author?: string;
        keyword?: string;
        description?: string;
        enamad?: string;
    };
    website: {
        onlineChat?: string;
        scripts?: string;
        title?: string;
        enamad?: string;
        samandehi?: string;
        // "scripts": null,
        // "title": "رزرو هتل | بیشترین %تخفیف% جدیدترین اطلاعات و تصاویر - سفرانه",
        // "enamad": "<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=447333&Code=iGUI6OSzuWaWMbs0Yr3GlkAdt7PEWsm8'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=447333&Code=iGUI6OSzuWaWMbs0Yr3GlkAdt7PEWsm8' alt='' style='cursor:pointer' Code='iGUI6OSzuWaWMbs0Yr3GlkAdt7PEWsm8'></a>",
        // "samandehi": null
    },
    social: {
        telegram?: string;
        x?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        whatsapp?: string;
    },
    legal: {
        name?:string;
        // "sellerEconomyCode": "411445816571",
        // "registeredNumber": "331036",
        // "buyerNationalId": "10103699029",
        // "accountNumber": null,
        // "iataNumber": null,
        // "taxVatNumber": null
    }
}

export interface UserReserveListItem {
    id: number;
    status: "Undefined" | "Registered" | "Pending" | "Issued" | "Canceled" | "WebServiceCancel" | "PaymentSuccessful" | "WebServiceUnsuccessful" | "PriceChange" | "Unavailable" | "Refunded" | "Voided" | "InProgress" | "PaidBack" | "RefundInProgress" | "Changed" | "OnCredit" | "ContactProvider" | "UnConfirmed" | "ReceivedAdvance" | "ExtraReceiving";
    username?: string;
    type: "Undefined" | "HotelDomestic" | "FlightDomestic" | "Bus" | "Package" | "Flight" | "Hotel" | "PnrOutside" | "Cip" | "Activity";
    creationTime: string;
    salePrice: number;

    // "phoneNumber": "string",
    // "email": "string",
    // "telNumber": "string",
    // "faxNumber": "string",
    // "firstName": "string",
    // "lastName": "string",
    // "gender": true,
    // "userId": 0,
    // "specialRequest": "string",
    // "expireDate": "2024-02-21T07:03:43.802Z",
    // "isChangeStatus": true,
    // "departureDate": "2024-02-21T07:03:43.802Z",
    // "returnDate": "2024-02-21T07:03:43.802Z",
    // "tenantId": 0,
    // "currency": {
    //   "type": "USD",
    //   "name": "string"
    // },
    // "terminal": {
    //   "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //   "name": "string"
    // },
    // "netPrice": 0,
    // "boardPrice": 0,
    // "reference": "string",
    // "promoCodeId": 0,
    // "extensionData": "string",
    // "history": [
    //   {
    //     "status": "Undefined",
    //     "userId": 0,
    //     "creationTime": "2024-02-21T07:03:43.802Z",
    //     "orderId": 0,
    //     "description": "string"
    //   }
    // ]
}

export type ReserveType = "Undefined"| "HotelDomestic"| "FlightDomestic"| "Bus"| "Package"| "Flight"| "Hotel"| "PnrOutside"| "Cip"| "Activity";

export interface TravelerItem {
    userId:number;
    firstname?:string;
    firstnamePersian?:string;
    lastname?:string;
    lastnamePersian?:string;
    gender:boolean;
    nationalId?:string;
    birthDate?:string;
    nationality?:string;
    email?:string;
    passportCountry?:string;
    passportExpirationDate?:string;
    passportNumber?:string;
    phoneNumber?:string;
    id:number;
}