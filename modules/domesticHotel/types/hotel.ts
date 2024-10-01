import React from "react";

export interface EntitySearchResultItemType {
    name?: string;
    displayName?: string;
    language?: string;
    type: 'Province' | 'City' | 'Hotel';
    id?: number;
    slug?: string;
}

export interface DomesticHotelFacilitieType {
    FacilityId?: number;
    Title?: string;
    Image?: string;
    ImageUrl?: string;
    Keyword?: string;
    ImageAlt?: string;
    ImageTitle?: string;
    CssClass?: string;
    Description?: string;
    IsSpecial?: boolean;
}

export interface DomesticHotelMainType {
    HotelId?: number;
    HotelName?: string;
    CityName?: string;
    HotelTypeName?: string;
    HotelRating?: number;
    BriefDescription?: string;
    Url?: string;
    ImageUrl?: string;
    ImageTitle?: string;
    ImageAlt?: string;
    Address?: string;
    Discount?: number;
    Price?: number;
    Facilities?: DomesticHotelFacilitieType[];
}

interface DomesticHotelNearBy extends DomesticHotelMainType {
    DistanceText?: string;
    DistanceValue?: number;
}

export interface DistancePointType {
    Url?: string;
    AttractionName?: string;
    DurationText?: string;
    Mode?: string;
    DurationValue?: number;
    ImageAlt?: string;
    ImageTitle?: string;
    Image?: string;
    DistanceText?: string;
    DistanceValue?: number;
}
export interface DomesticHotelRichSnippets {
    rating?: {
        ratingValue:number;
        reviewCount:number;
        worstRating:number;
        bestRating:number;
    },
    priceRange?: string;
}

export interface DomesticHotelRichSheet {
    title?: string;
    url?: string;
    pageTitle?: string;
    metaKeyword?: string;
    metaDescription?: string;
    priority: number;
    id: number;

}

export interface DomesticHotelDetailType {
    HotelId?: number;
    HotelName?: string;
    HotelCategoryName?: string;
    HotelCategoryId?: number;
    CityName?: string;
    CityId?: number;
    HotelRating?: number;
    IsInstant?: boolean;
    Tel?: string;
    Address?: string;
    BriefDescription?: string;
    Content?: string;
    ContentTitle?: string;
    Latitude?: number;
    Longitude?: number;
    Zoom?: number;
    Priority?: number;
    Url?: string;
    Discount?: number;
    TopSelling?: number;
    Price?: number;
    IsPromotion?: boolean;
    MostViewed?: number;
    ImageAlt?: string;
    ImageTitle?: string;
    ImageUrl?: string;
    LanguageId?: number;
    IsCovid?: boolean;
    ChangeFrequency?: string;
    PagePriority?: number;
    ModifyDateTime?: string;
    MetaDescription?: string;
    MetaKeyword?: string;
    PageTitle?: string;
    VoteNumbers?: number;
    VoteResult?: number;
    RoomCount?: number;
    NeighborhoodKeywords?: {

    }[];
    Gallery?: {
        Image?: string;
        ImageThumb?: string;
        Alt?: string;
        Title?: string;
        Priority?: number;
    }[];
    Facilities?: DomesticHotelFacilitieType[];

    Policies?: {
        FacilityId: any;
        Title?: string;
        Image?: string;
        ImageUrl?: string;
        Keyword?: string;
        ImageAlt?: string;
        ImageTitle?: string;
        CssClass?: string;
        Description?: string;
        IsSpecial: boolean;
    }[];
    DistancePoints?: DistancePointType[];
    DistancePointTemporarys?: {

    }[];
    Similars?: DomesticHotelMainType[];
    NearBys?: DomesticHotelNearBy[]
}

export interface HotelScoreDataType {
    Comments: {
        CommentId?: number;
        FullName?: string;
        CityName?: string;
        Comment?: string;
        IsRecommended?: boolean;
        Satisfaction?: number;
        RoomService?: number;
        ResturantQuality?: number;
        DealWithPassanger?: number;
        CreateDate?: string;
        ModifyDate?: string;
        PageUrl?: string;
        AccommodationName?: string;
        IsStay?: boolean;
    }[];
    TotalScore?: number;
    Satisfaction?: number;
    RoomService?: number;
    ResturantQuality?: number;
    DealWithPassanger?: number;
    CommentCount?: number;
}

export interface DomesticAccomodationFacilityType{
    name?: string;
    description?: string;
    keyword: "cleaning-services" | "languages-spoken" | "safety-security" | "business-facilities" | "transport" | "outdoor-view" | "food-drink" | "common-areas" | "accessibility" | "room-amenities" | "media-technology" | "living-area" | "bedroom" | "kitchen" | "reception-services" | "miscellaneous" | "swimming-pool" | "wellness" | "shops" | "internet" | "room-features" | "bathroom";
    items: {
        isAdditionalCharge?: boolean;
        isImportant?: boolean;
        isFree?: boolean;
        name?: string;
        description?: any;
        keyword: string;
    }[]
}

export interface DomesticAccomodationGalleryType{
    filePath?: string;
    fileTitleAttribute?: string;
    fileAltAttribute?: string;
    sizes?:{
        displaySize:"mobile"|"desktop";
        filePath?: string;
    }[];
}

export interface DomesticAccomodationPolicyType{
    title?:string;
    keyword?: "check-in" | "check-out" | "cancellation" | "damage-policy" | "smoking" | "children-and-bed" | "pets";
    name?:string;
    value?:string;
    description?: any;
    guests: {
        title?: string;
        name?: string;
        value?: string;
        description?: React.ReactNode;
      }[];
    passengers: {
        title?: string;
        name?: string;
        value?: string;
        description?: React.ReactNode;
      }[];
  }

export interface DomesticAccomodationType {
    type: "Hotel" | "Apartments" | "Guesthouse" | "Motel" | "TraditionalHouse" | "Ecolodge" | "TourismComplex" | "BoutiqueHotel" | "Pansion";
    rating?: number;
    cityId?: number;
    name?: string;
    displayName?: string;
    address?: string;
    instruction?: string;
    briefDescription?: string;
    description?: string;
    mendatoryFee?: string;
    alertNote?: string;
    telNumber?: string;
    city: {
        title?: string;
        type?: string;
        isActive: boolean;
        parentId?: number;
        name?: string;
        searchValue?: string;
        displayName?: string;
        id: number;
        slug?: string;
    };
    coordinates: {
        latitude: number;
        longitude: number;
    };
    picture: {
        path?: string;
        altAttribute?: string;
        titleAttribute?: string;
    };
    faqs: {
        title?: string;
        isActive: boolean;
        priority: number;
        entity: {
            title?: string;
            type?: string;
            isActive: boolean;
            parentId?: number;
            name?: string;
            searchValue?: string;
            displayName?: string;
            id: number;
        };
        question?: string;
        answer?: string;
        id: number;
    }[]
    id: number;
    facilities?: DomesticAccomodationFacilityType[];
    galleries?: DomesticAccomodationGalleryType[];
    policies?: DomesticAccomodationPolicyType[]
      
}

export interface AvailabilityByIdItem {
    id: number,
    boardPrice: number,
    salePrice: number,
}

export interface DomesticHotelRoomItem {
    image?: string;
    view?: string;
    description?: string;
    facilities?: {
        title?: string;
        keyword?: string;
        name?: string;
    }[];
    name?: string;
    capacity: {
        count: number;
        extraBed: number;
    };
    id: number;
    promotions?:{        
        description?: string;
        endDate?: string;
        name?: string;
        startDate?: string;
    }[]
}
export interface DomesticHotelRateItem {
    pricing?: {
        amount: number;
        ageCategoryType: "ADL" | "CHD" | "INF";
        type: "Room" | "RoomBoard" | "ExtraBed" | "HalfCharge" | "RoomNet" | "Markup" | "Commission" | "PromoCode"
    }[];

    price: number;
    bookingToken?: string;
    supplierType: "Safaraneh" | "Snapp" | "ChannelLead" | "HotelYar" | "Eghamat24";
    available: number;
    description?: string;
    calendar?: {
        [date: string]: {
            amount: number;
            board: number;
            type?: "Completion" | "Online" | "Offline" | "Request" | null;
        };
    };
    cancellationPolicy?: {
        status: "Refundable" | "NonRefundable" | "Unknown" | "CallSupport";
        fees: {
            amount: number;
            fromDate: string;
        }[];
    };
    board: {
        name?: string;
        code: "Undefined" | "BB" | "FB" | "HB" | "RO" | "Hour6" | "Hour10";
        description?: string;
        extra?: string;
    },
    view?: {
        name?: string;
        keyword?: string;
    };
    availablityType: "Online" | "Offline" | "Request" | "Completion";
    nightly: {
        totalPrice: number;
        averagePrice: number;
        items: {
            [date: string]: {
                amount: number;
                board: number;
                type?: "Completion" | "Online" | "Offline" | "Request" | null;
            }; 
        }[];
    }
}

export interface DomesticHotelAvailability {

    rooms?: DomesticHotelRoomItem[];
    rates?: DomesticHotelRateItem[]

}[]

export interface SearchAccomodationItem {  
    id: number;  
    type: "Hotel" | "Apartments" | "Guesthouse" | "Motel" | "TraditionalHouse" | "Ecolodge" | "TourismComplex" | "BoutiqueHotel" | "Pansion" ;
    typeStr?: string;
    displayOrder?: number;
    rating?: number;
    cityId?: number;
    name?: string;
    displayName?: string;
    address?: string;
    checkinTime?: string;
    checkoutTime?: string;
    instruction?: any;
    briefDescription?: string;
    description?: string;
    mendatoryFee?: string;
    alertNote?: string;
    telNumber?: string;
    isPromotion?: boolean;
    url?: string;
    pageTitle?: string;
    metaKeyword?: string;
    metaDescription?: string;
    minRoomPrice?: number;
    maxRoomPrice?: number;
    lastModificationTime?: string;
    city?: {
        title?:string;
        type?: string;
        isActive: boolean;
        parentId?: number;
        name?:string;
        searchValue?:string;
        displayName?:string;
        id: number;
    };
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    picture?: {
        path?:string;
        altAttribute?:string;
        titleAttribute?:string;
    };
    faqs?: {
        title?:	string;
        isActive: boolean;
        priority: number;
        entity?: {
            title?: string;
            type?:string;
            isActive: boolean
            parentId?: number;
            name?: string;
            searchValue?: string;
            displayName?: string;
            id: number;
        };
        question?: string;
        answer?: string;
        id: number;
    }[];
    facilities?: {
        name?:string;
        description?:string;
        keyword?: string;
        id:number;
        items?: {
            isAdditionalCharge: boolean;
            isImportant: boolean;
            isFree: boolean;
            name?: string;
            description?:	string;
            keyword?: string;
            id: number;
        }[];
    }[];
    //toDo: set types
    policies: any;
    galleries: any;
}

export interface PricedHotelItem extends SearchAccomodationItem {
    ratesInfo?: "loading" | { Satisfaction: number; TotalRowCount: number; };
    priceInfo: "loading" | "notPriced" | "need-to-inquire" | { boardPrice: number; salePrice: number; };
    promotions?:{
        name?:string;
        description?:string;
    }[];
}

export type SortTypes = "priority" | "price" | "starRate" | "name" | "gueatRate";


export interface DomesticHotelGetValidateResponse {
    preReserveKey?: string;
    accommodationId: number;
    checkin: string;
    checkout: string;
    count: number,
    supplierType: "Safaraneh" | "Snapp" | "ChannelLead" | "HotelYar" | "Eghamat24";
    rooms:
    {
        roomId?: number;
        name?: string;
        image?: string;
        bed: number;
        extraBed: number;
        providerName?: string;
        supplierRefrence?: string;
        maxInfantAge: number;
        maxChildAge: number;
        supplierType: "Safaraneh" | "Snapp" | "ChannelLead" | "HotelYar" | "Eghamat24";
        available?: number;
        description?: string;
        availablityType: "Online" | "Offline" | "Request" | "Completion";
        boardCode: "Undefined" | "BB" | "FB" | "HB" | "RO" | "Hour6" | "Hour10";
        boardExtra?: string;
        nightly: {
            date?: string;
            amount?: number;
            board?: number;
        }[],
        pricing: {
            amount: number;
            isSelected: boolean;
            isShow: boolean;
            ageCategoryType: "ADL" | "CHD" | "INF";
            type: "Room" | "RoomBoard" | "ExtraBed" | "HalfCharge" | "RoomNet" | "Markup" | "Commission" | "PromoCode";
        }[]
        ,
        cancellationPolicyStatus: "Refundable" | "NonRefundable" | "Unknown" | "CallSupport";
        cancellationPolicyFees: {
            amount: number;
            fromDate?: string;
        }[]
    }[]
}

export interface AsideHotelInfoType {
    image: {
        url?: string;
        alt?: string;
        title?: string;
    },
    name: string;
    rating?: number;
    address?: string;
    TopSelling?: number;
    Url?: string;
    CityId?: number;  
    checkinTime?: string;
    checkoutTime?: string;

}

export interface AsideReserveInfoType {
    reserveId?: number;
    checkin: string;
    checkout: string;
    duration: number;
    rooms: {
        name: string | undefined;
        board: "Undefined" | "BB" | "FB" | "HB" | "RO" | "Hour6" | "Hour10";
        cancellationPolicyStatus?: "Refundable" | "NonRefundable" | "Unknown" | "CallSupport";
        bed: number;
        pricing: {
            amount: number;
            isSelected: boolean;
            isShow: boolean;
            ageCategoryType: "ADL" | "CHD" | "INF";
            type: "Room" | "RoomBoard" | "ExtraBed" | "HalfCharge" | "RoomNet" | "Markup" | "Commission" | "PromoCode";
        }[];
        nightly?: {
            date?: string;
            amount?: number;
            board?: number;
        }[]
    }[]
    salePrice: number;
    boardPrice: number;

    selectedExtraBedPrice?: any;
    selectedExtraBedCount?: any;
    promoCodePrice?: any;
}

export interface DomesticHotelPrereserveParams {
    reserver: {
        gender: boolean;
        firstName: string;
        lastName: string;
        email: string;
        nationalId: string;
        phoneNumber: string;
    };
    passengers: {
        gender: boolean;
        firstName: string;
        lastName: string;
        roomNumber: number;
        extraBed: number;
    }[];
    specialRequest: string;
    preReserveKey: string;
    metaSearchKey?: string;
    metaSearchName?: "safarmarket"
}

export type DomesticHotelReserveStatus = "Undefined" | "Registered" | "Pending" | "Issued" | "ContactProvider" | "Canceled" | "WebServiceCancel" | "PaymentSuccessful" | "WebServiceUnsuccessful" | "PriceChange" | "Unavailable" | "Refunded" | "Voided" | "InProgress" | "PaidBack" | "RefundInProgress" | "Changed" | "OnCredit";

export interface DomesticHotelGetReserveByIdData {
    id: number;
    checkin: string;
    checkout: string;
    count: number;
    accommodation?:{
        name?: string;
        displayName?: string;
        rating?: number;
        city?: {
          name?: string;
          id?: number
        };
    }
    accommodationId: number;
    totalPrice: number;
    totalBoardPrice: number;
    expirTime: string;
    username?: string;
    status: DomesticHotelReserveStatus;
    reserver: {
        nationalId: null,
        firstName: "تست",
        lastName: "تست",
        phoneNumber: "+989121111111",
        email: "test@tes.ts",
        userName: "+989121111111",
        gender: true
    },
    currencyType: string;
    supplierType: "Safaraneh" | "Snapp" | "ChannelLead" | "HotelYar" | "Eghamat24";
    rooms: {
        name?: string;
        boardCode: "Undefined" | "BB" | "FB" | "HB" | "RO" | "Hour6" | "Hour10";
        cancellationPolicyStatus?: "Refundable" | "NonRefundable" | "Unknown" | "CallSupport";
        bed: number;
        pricing: {
            amount: number;
            isSelected: boolean;
            isShow: boolean;
            ageCategoryType: "ADL" | "CHD" | "INF";
            type: "Room" | "RoomBoard" | "ExtraBed" | "HalfCharge" | "RoomNet" | "Markup" | "Commission" | "PromoCode";
        }[];
        nightly?:{
            date?: string;
            mount?: number;
            board?: number;
        }[];
        extraBed: number;
        maxInfantAge: number;
        maxChildAge: number;
        image?:string;
        description?: string;
        passengers: {
            gender: boolean;
            firstName: string;
            lastName: string;
            // "nationalId": null,
            // "extraBed": 1,
            // "childrenAge": [],
            // "nationality": 0
          }[];
    }[]

}

export interface DomesticHotelConfirmType {
    isCompleted: boolean;
    reserve: {
        status: "Undefined" | "Registered" | "Pending" | "Issued" | "Canceled" | "ContactProvider" | "WebServiceCancel" | "PaymentSuccessful" | "WebServiceUnsuccessful" | "PriceChange" | "Unavailable" | "Refunded" | "Voided" | "InProgress" | "PaidBack" | "RefundInProgress" | "Changed" | "OnCredit";
    }
}

export interface DomesticHotelSummaryDetail {
    coordinates: {
        latitude?: number;
        longitude?: number;
      };
      picture: {
        path?: string;
        altAttribute?: string;
        titleAttribute?: string;
      };
      displayName?: string;
      name?:string;
      cityId?: number;
      city: {
        name?: string;
        id?:number;
        // title: "string",
        // type: "string",
        // isActive: true,
        // parentId: 0,
        // searchValue: "string",
        // displayName: "string",
      };
      rating?:number;
      address?: string;
      url?: string;
      checkinTime?: string;
      checkoutTime?: string;
      
    // "type": "Hotel",
    // "name": "string",
    // "instruction": "string",
    // "briefDescription": "string",
    // "description": "string",
    // "mendatoryFee": "string",
    // "alertNote": "string",
    // "telNumber": "string",
    // "isPromotion": true,
    // "pageTitle": "string",
    // "metaKeyword": "string",
    // "metaDescription": "string",
    // "faqs": [
    //   {
    //     "title": "string",
    //     "isActive": true,
    //     "priority": 0,
    //     "entity": {
    //       "title": "string",
    //       "type": "string",
    //       "isActive": true,
    //       "parentId": 0,
    //       "name": "string",
    //       "searchValue": "string",
    //       "displayName": "string",
    //       "id": 0
    //     },
    //     "question": "string",
    //     "answer": "string",
    //     "id": 0
    //   }
    // ],
    // "id": 0
  }

export type HotelRecentSearchItem = {
    url: string;
    title: string;
    dates: string[];
}