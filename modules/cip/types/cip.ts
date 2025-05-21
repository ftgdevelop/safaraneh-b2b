export interface AirportDetailType {
  address: string;
  city: {
    name: string;
    code: string;
  }
  country: {
    name: string;
    code: string;
  }
  name: string;
  nameLong: string;
  url: string;
  picture: {
    path: string;
    altAttribute: string;
    titleAttribute: string;
  }
  id: number;
  description: string;
  Price: number,
  displayPrice: number;
}

export interface CipGetAirportByUrlResponseType {
  galleries: {
    path?: string;
    altAttribute?: string;
    titleAttribute?: string;
    id: number;
  }[];
  address?: string;
  name?: string;
  description?: string;
  facilities: {
    id: number;
    picture: {
      path?: string;
      altAttribute?: string;
      titleAttribute?: string;
    },
    description?: string;
    keyword?: string;
    name?: string;
  }[];
  latitude?: string;
  longitude?: string;
  code: string;
  // "url": "string",
  // "nameLong": "string",
  // "city": {
  //     "name": "string",
  //     "code": "string"
  // },
  // "country": {
  //     "name": "string",
  //     "code": "string"
  // },
  // "picture": {
  //     "path": "string",
  //     "altAttribute": "string",
  //     "titleAttribute": "string"
  // },
  // "id": 0
}

export interface CipFormPassengerItemType {
  id: string;
  gender: boolean;
  type: "Adult" | "Child";
  services: any[]
}

export interface CipFormCompanionItemType {
  id: string;
  services: any[]
}

export type CipPassengerType = "Adult" | "Child" | "Infant" | "Accompanying";

export interface CipAvailabilityItemType {
  id: number;
  name: string;
  passengerTypeServices: {
    passengerType: CipPassengerType,
    services: {
      name: string;
      id: number;
      boardPrice: number;
      salePrice: number;

      // "description": "string",
      // "hourDescription": "string",
      // "extraDescription": "string",
      // "title": "string",
      // "type": "Pet",
      // "priceType": "PerPassenger",
      // "netPrice": 0,
      // "currencyType": "USD",
      // "passengerType": "Adult",
      // "extraSalePrice": 0,
      // "extraNetPrice": 0,
      // "extraBoardPrice": 0,
      // "rateId": 0,
      // "hourSalePrice": 0,
      // "hourNetPrice": 0,
      // "hourBoardPrice": 0,
      // "picture": {
      //   "path": "string",
      //   "altAttribute": "string",
      //   "titleAttribute": "string"
      // },
      // "count": 0,
      // "extraCount": 0,
      // "hourCount": 0,
    }[]
  }[];

  services: {
    id: number;
    name: string;
    passengerType: "Adult" | "Child" | "Infant" | "Accompanying";
    description?: string;
    // "hourDescription": "string",
    // "extraDescription": "string",
    // "title": "string",
    // "type": "Pet",
    // "priceType": "PerPassenger",
    // "boardPrice": 0,
    // "netPrice": 0,
    salePrice: number;
    // "currencyType": "USD",
    // "extraSalePrice": 0,
    // "extraNetPrice": 0,
    // "extraBoardPrice": 0,
    // "rateId": 0,
    // "hourSalePrice": 0,
    // "hourNetPrice": 0,
    // "hourBoardPrice": 0,
    // "picture": {
    //   "path": "string",
    //   "altAttribute": "string",
    //   "titleAttribute": "string"
    // },
    // "count": 0,
    // "extraCount": 0,
    // "hourCount": 0,

  }[];
  // "adults": 0,
  // "children": 0,
  // "accompanying": 0,
  remark?: string;
  // "description": "string",
  // "netPrice": 0,
  boardPrice: number;
  salePrice: number;
  passengers: {
    passengerType: "Adult" | "Child" | "Infant" | "Accompanying";
    boardPrice: number;
    netPrice: number;
    salePrice: number;
    currencyType: "USD" | "IRR";
    id: number;
  }[];
  transport:
  {
    name?: string;
    salePrice: number;
    id: number;
    picture: {
      path?: string;
      altAttribute?: string;
      titleAttribute?: string;
    };
    description: string;
    // "boardPrice": 0,
    // "netPrice": 0,
    // "currencyType": "USD",
  }[];
}

export interface CipValidateResponseType {
  preReserveKey: string;
  "rate": {
    "adults": 0,
    "children": 0,
    "accompanying": 0,
    "name": "string",
    "remark": "string",
    "description": "string",
    "boardPrice": 0,
    "netPrice": 0,
    "salePrice": 0,
    "passengers": [
      {
        "passengerType": "Adult",
        "boardPrice": 0,
        "netPrice": 0,
        "salePrice": 0,
        "currencyType": "USD",
        "id": 0
      }
    ],
    "id": 0
  },
  "flightNumber": "string",
  "originName": "string",
  "airline": "string",
  "flightTime": "2024-03-12T06:01:35.791Z",
  "creationTime": "2024-03-12T06:01:35.791Z",
  "airport": {
    "name": "string",
    "nameLong": "string",
    "city": {
      "name": "string",
      "code": "string"
    },
    "country": {
      "name": "string",
      "code": "string"
    },
    "code": "string",
    "latitude": "string",
    "longitude": "string",
    "picture": {
      "path": "string",
      "altAttribute": "string",
      "titleAttribute": "string"
    },
    "id": 0
  },
  "services": [
    {
      "name": "string",
      "description": "string",
      "hourDescription": "string",
      "extraDescription": "string",
      "title": "string",
      "type": "Pet",
      "priceType": "PerPassenger",
      "boardPrice": 0,
      "netPrice": 0,
      "salePrice": 0,
      "currencyType": "USD",
      "passengerType": "Adult",
      "extraSalePrice": 0,
      "extraNetPrice": 0,
      "extraBoardPrice": 0,
      "rateId": 0,
      "hourSalePrice": 0,
      "hourNetPrice": 0,
      "hourBoardPrice": 0,
      "picture": {
        "path": "string",
        "altAttribute": "string",
        "titleAttribute": "string"
      },
      "count": 0,
      "extraCount": 0,
      "hourCount": 0,
      "id": 0
    }
  ],
  "passengerTypeServices": [
    {
      "passengerType": "Adult",
      "services": [
        {
          "name": "string",
          "description": "string",
          "hourDescription": "string",
          "extraDescription": "string",
          "title": "string",
          "type": "Pet",
          "priceType": "PerPassenger",
          "boardPrice": 0,
          "netPrice": 0,
          "salePrice": 0,
          "currencyType": "USD",
          "passengerType": "Adult",
          "extraSalePrice": 0,
          "extraNetPrice": 0,
          "extraBoardPrice": 0,
          "rateId": 0,
          "hourSalePrice": 0,
          "hourNetPrice": 0,
          "hourBoardPrice": 0,
          "picture": {
            "path": "string",
            "altAttribute": "string",
            "titleAttribute": "string"
          },
          "count": 0,
          "extraCount": 0,
          "hourCount": 0,
          "id": 0
        }
      ]
    }
  ],
  optionalServices: {
    name?: string;
    description?: string;
    type: "Pet" | "Passport" | "Wheelchair" | "Suite" | "Lunch" | "FlightCard" | "SpecialService" | "Parking" | "Conference" | "VipRoom" | "Visa" | "FastTrack" | "Transport" | "Lunch_Transport" | "FlightCard_Transport" | "MeetingRoom";
    salePrice: number;
    extraSalePrice?: number;
    hourSalePrice?: number;
    picture: {
      path?: string;
      altAttribute?: string;
      titleAttribute?: string;
    },
    count: number;
    extraCount?: number;
    hourCount?: number;
    id: number;
    // "hourDescription": "string",
    // "extraDescription": "string",
    // "title": "string",
    // "priceType": "PerPassenger",
    // "boardPrice": 0,
    // "netPrice": 0,
    // "currencyType": "USD",
    // "passengerType": "Adult",
    // "extraNetPrice": 0,
    // "extraBoardPrice": 0,
    // "rateId": 0,
    // "hourNetPrice": 0,
    // "hourBoardPrice": 0,
  }[];
  transport:
  {
    name?: string;
    salePrice: number;
    id: number;
    picture: {
      path?: string;
      altAttribute?: string;
      titleAttribute?: string;
    };
    // "description": "string",
    // "boardPrice": 0,
    // "netPrice": 0,
    // "currencyType": "USD",
  }[];

}

export interface CipPrereservePayload {

  airline: string;
  flightNumber: string;
  originName: string;
  destinationName: string;
  flightTime: string;
  preReserveKey: string;

  passengers: {
    gender: boolean;
    firstName: string;
    lastName: string;
    passengerType: CipPassengerType;
    passportNumber?: string;
    nationalId?: string;
    nationality?: string;
    birthday?: string;
    services: number[]
  }[];

  reserver: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    userName: string;
    gender: boolean;
  };

  services?: {
    count: number;
    extraCount?: number;
    hourCount?: number;
    id: number;
  }[];

  transports?: {
    count: number;
    address?: string;
    id: number;
  }[];

}

export interface CipGetReserveByIdResponse {
  flightNumber: string;
  airline: string;
  flightTime: string;
  username: string;
  status:  "Undefined" | "Registered" | "Pending" | "Issued" | "Canceled" | "WebServiceCancel" | "PaymentSuccessful" | "WebServiceUnsuccessful" | "PriceChange" | "Unavailable" | "Refunded" | "Voided" | "InProgress" | "PaidBack" | "RefundInProgress" | "Changed" | "OnCredit" | "ContactProvider" | "UnConfirmed" | "ReceivedAdvance" | "ExtraReceiving" ;
  reserver: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    userName: string;
    gender: boolean;
  };
  airport: {
    name: string;
    city: {
      name: string;
      code: string;
    };
    picture: {
      path: string;
      altAttribute: string;
      titleAttribute: string;
    },
    id: number;
  };
  passengers: [
    {
      gender: boolean;
      firstName: string;
      lastName: string;
      passengerType: CipPassengerType;
      passportNumber: string;
      nationalId: string;
      nationality: string;
      birthday: string,
      service: {
        items: [
          {
            name: string;
            picture: {
              path: string;
              altAttribute: string;
              titleAttribute: string;
            };
            id: number
          }
        ]
      },
      id: number;
    }
  ],
  transport: {
    items: [
      {
        name: string;
        address: string;
        count: number;
        salePrice: number;
        picture: {
          path: string;
          altAttribute: string;
          titleAttribute: string;
        };
      }
    ]
  };
  service: {
    items: [
      {
        count: number;
        name: string;
        type: string;
        salePrice: number;
        picture: {
          path: string;
          altAttribute: string;
          titleAttribute: string;
        };
      }
    ];
  };
  id: number;
}

export interface CipAvailibilityItem {
  availability: {
    boardPrice: number;
    salePrice: number;
  }[];
  id: number;
}  


export type CipAutoCompleteType = {
  url?: string;
  name?: string;
  id?: number;
}

export type CipRecentSearchItem = {
  url: string;
  airportName:string;
  flightDate:string;
}