export interface FlightItemType {
    adultPrice: number;
    childPrice: number;
    infantPrice: number;
    hasReturn:boolean;
    country?: {
        name?: string;
    }
    airline?: {
        code?: string;
        name?: string;
        picture?: {
            path?: string;
            altAttribute?: string;
            titleAttribute?: string;
        }
    }
    airCraft: {
        name: string;
    }
    arrivalAirport?: {
        city?: {
            name?: string;
            code?: string;
        }
        country?: {
            name?: string;
        }
        name?: string;
        flightType?: string;
    }
    departureAirport?: {
        city?: {
            name?: string;
            code?: string;
        }
        country?: {
            name?: string;
        }
        name?: string;
        flightType?: string;
    }
    cabinClass: {
        name: string;
        code?: string;
    }
    id?: number;
    departureTime?: string;
    arrivalTime?: string;
    capacity: number;
    flightType: string;
    maxAllowedBaggage: number;
    flightNumber: string;
    flightKey: string;
}

export interface AirportSearchResponseItem  {
    name?: string;
    city: {
        name?: string;
        code?: string;
    };
    // country: {
    //   name: "string",
    //   code: "string"
    // },
  code: string;
  values?: {
    name: string
  }
    // latitude: "string",
    // longitude: "string",
    airportType: "Main" | "Subsidiary"| "City"
  }

  export type AvailibilityParams = {
    departureCode: string;
    returnCode: string;
    departureTime: string;
    adult: number;
    child: number;
    infant: number;
}

export type AirportType = {
    name?: string;
    code?: string;
  terminalId?: string;
    city: {
      name?: string;
      code?: string;
    };
    country: {
      name?: string;
      code?: string;
    };
    latitude?: string;
  longitude?: string;
}

type FlightDetail = {
  flightType: "System" | "Charter";
  flightNumber: string;
  departureTime: string;
  arrivalTime?: string;
  isForeign: boolean;
  adultPrice:number;
  childPrice:number;
  infantPrice:number;
  maxAllowedBaggage: number;
  capacity: number;
//   "manufacturer": "string",
//   "description": "string",
  cabinClass: {
    code?: string;
    type?: string;
    name?: string;
  };
  departureAirport:AirportType;
  arrivalAirport:AirportType;
  airCraft: {
    code?: string;
    name?: string;
    manufacturer?: string;
  };
  airline: {
    code?: string;
    name?: string;
    picture: {
      path?: string;
      altAttribute?: string;
      titleAttribute?: string;
    }
  };
//   "refundRule": {
//     "rows": [
//       {
//         "key": 0,
//         "value": "string"
//       }
//     ],
//     "items": [
//       {
//         "value": 0,
//         "fromMinutes": 0,
//         "fromTime": "string",
//         "toMinutes": 0,
//         "toTime": "string",
//         "description": "string",
//         "id": 0
//       }
//     ]
//   },
//   "pnrCode": "string",
//   "id": 0
}
export interface FlightGetValidateDataType {
    preReserveKey?: string;
    departureTime: string;
    arrivalTime?: string;
    adultCount: number;
    childCount: number;
    infantCount: number;
    "creationTime": "2024-04-10T11:45:24.052Z",
    "adultTotalPrice": 0,
    "childTotalPrice": 0,
    "infantTotalPrice": 0,
    captchaLink?: string;
    departureFlight: FlightDetail;
    returnFlight?:FlightDetail;
  }


  export interface FlightPrereserveFormValue {
    reserver: {
      gender: boolean;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      userName?:string;
  };
  passengers: {
    gender: boolean;
    firstName: string;
    lastName: string;
    persianFirstName: string;
    persianLastName: string;
    nationalId: string;
    birthDate: string;
    passportNumber: string | null;
    passportExpireDate: string | null;
    passengerType: "ADT"|"CHD"|"INF"
    nationality: string | null;
  }[];
    captchaCode: string;
    preReserveKey?:string;
  }

export interface DomesticFlightGetReserveByIdType {
    username?: string;
    tripType: "OneWay" | "Return" | "MultiCity";
    departureTime: string;
    arrivalTime?: string;
    adultCount: number;
    childCount: number;
    infantCount: number;
    creationTime: string;
    adultTotalPrice: number;
    childTotalPrice: number;
    infantTotalPrice: number;
    supplierType: "HiHoliday"|"Charter724"| "Itours";
    status: "Undefined" | "Registered" | "Pending" | "Issued" | "Canceled" | "WebServiceCancel" | "PaymentSuccessful" | "WebServiceUnsuccessful" | "PriceChange" | "Unavailable" | "Refunded" | "Voided" | "InProgress" | "PaidBack" | "RefundInProgress" | "Changed" | "OnCredit" | "ContactProvider" | "UnConfirmed";
    terminal: {
      name?: string;
      id: string;
    };
    reserver: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      email?: string;
      userName?: string;
      gender:boolean;
      userId?: number;
    };
    departureFlight: FlightDetail;
    returnFlight?: FlightDetail;
    passengers: {
        firstName?: string;
        lastName?: string;
        persianFirstName?: string;
        persianLastName?: string;
        gender: boolean;
        passengerType: "ADT"|"CHD"|"INF";
        nationalId?: string;
        birthDate?: string;
        nationality?: string;
        passportNumber?: string;
        passportExpireDate?: string;
        departureTicketNumber?: string;
        returnTicketNumber?: string;
        id: number;
      }[];
    id: number;
}

export type FlightConfirmStatus = "Undefined" | "Registered" | "Pending" | "Issued" | "Canceled" | "WebServiceCancel" | "PaymentSuccessful" | "WebServiceUnsuccessful" | "PriceChange" | "Unavailable" | "Refunded" | "Voided" | "InProgress" | "PaidBack" | "RefundInProgress" | "Changed" | "OnCredit" | "ContactProvider" | "UnConfirmed";;
export interface DomesticFlightConfirmType {
  isCompleted: boolean;
  reserve: {
    status: FlightConfirmStatus;
  };
}

export type AirportAutoCompleteType = {
  name: string;
  city: {
    name: string;
    code: string;
  };
  code: string;
  airportType: "Main" | "Subsidiary" | "City";
}

export type FlightSeachFormValue = {
  originCode: string;
  destinationCode: string;
  departureDate?: string;
  returnDate?: string;
  adult: number;
  child: number;
  infant: number;
  cabinClassCode: string;
  airTripType: "OneWay" | "RoundTrip" ;
}

export interface FlightSearchDefaultValues extends FlightSeachFormValue {
  originObject: AirportAutoCompleteType;
  destinationObject: AirportAutoCompleteType;
}

export type FlightRecentSearchItem = {
  url: string;
  origin:string;
  destination:string;
  departureDate: string;
  returnDate: string;
}


export type FlightSortFactorType =  "LowestPrice" | "HighestPrice" | "Time";