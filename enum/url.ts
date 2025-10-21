// export const SSRHeader: HeadersInit = new Headers();
// SSRHeader.set('Content-Type', 'application/json');
// SSRHeader.set("Accept-Language", "en-US");
// SSRHeader.set("currency", "IRR");
// SSRHeader.set("apikey", process.env.PROJECT_SERVER_APIKEY!);
// SSRHeader.set("tenantid", '6');


export const Header = {
  "Content-Type": "application/json",
  "Accept-Language": "en-US",
  "apikey": process.env.PROJECT_SERVER_APIKEY
};
//to do: static header parameters!

export const ServerAddress = {
  Type: process.env.PROJECT_SERVER_TYPE,
  CMS: process.env.PROJECT_SERVER_CMS,
  Identity: process.env.PROJECT_SERVER_IDENTITY,
  Hotel_WP: process.env.PROJECT_SERVER_HOTEL_WP,
  Hotel_Data: process.env.PROJECT_SERVER_HOTEL_DATA,
  Hotel_Availability: process.env.PROJECT_SERVER_HOTEL_AVAILABILITY,
  Coordinator: process.env.PROJECT_SERVER_COORDINATOR,
  Blog: process.env.PROJECT_SERVER_BLOG,
  Payment: process.env.PROJECT_SERVER_PAYMENT,
  Flight: process.env.PROJECT_SERVER_FLIGHT,
  Crm: process.env.PROJECT_SERVER_CRM,
  Cip: process.env.PROJECT_SERVER_CIP,
  Traveler: process.env.PROJECT_SERVER_TRAVELER,
  Strapi: process.env.PROJECT_SERVER_STRAPI,
  StrapiToken : process.env.PROJECT_SERVER_STRAPI_TOKEN
};

export const Cms = {
  GetByUrl: "/api/services/app/Page/GetByUrl",
}

export const Strapi = {
  Pages: "/api/pages",
  Affiliate: "/api/affiliates"
}

export const Identity = {
  getTenantByKeyword: "/api/services/app/Tenant/GetByKeyword",
  SendOTP: "/api/services/app/OTP/SendOTP",
  RegisterOrLogin: "/api/services/app/OTP/RegisterOrLogin",
  GetCurrentUserProfileForEdit: "/api/services/app/Profile/GetCurrentUserProfileForEdit",
  UpdateCurrentUserProfile: "/api/services/app/Profile/UpdateCurrentUserProfile",
  UpdateNewsletterUserProfile: "/api/services/app/Profile/UpdateNewsletterUserProfile",
  UpdateProfileEmail: "/api/services/app/Profile/UpdateProfileEmail",
  UpdateProfilePhoneNumber: "/api/services/app/Profile/UpdateProfilePhoneNumber",
  SendVerificationSms: "/api/services/app/Profile/SendVerificationSms",
  VerifySmsCode: "/api/services/app/Profile/VerifySmsCode",
  LoginWithPassword: "/api/TokenAuth/Login",
  ForgotPasswordByPhoneNumber: "/api/services/app/Account/ForgotPasswordByPhoneNumber",
  ForgotPasswordVerification: "/api/services/app/Account/ForgotPasswordVerification",
  ResetPassword: "/api/services/app/Account/ResetPassword",
  ForgotPasswordByEmail: "/api/services/app/Account/ForgotPassword",
  Register: "/api/services/app/Account/Register",
  ChangePassword: "/api/services/app/Account/ChangePassword",
  SendEmailActivation: "/api/services/app/Account/SendEmailActivation",
  ActivateEmail: "/api/services/app/Account/ActivateEmail",
  GetPermissions: "/api/services/app/Profile/GetPermissions",
  getAllUsers: "/api/services/app/User/GetAll",
  ResetUsersPassword: "/api/services/app/User/ResetPassword",
  CreateNewUser: "/api/services/app/User/Create",
  UpdateUser: "/api/services/app/User/Update",
  GetUserById:"/api/services/app/User/Get",
  GetUserPermissionsForEdit : "/api/services/app/User/GetUserPermissionsForEdit",
  UpdateUserPermissions:"/api/services/app/User/UpdateUserPermissions"
};

export const Flight = {
  GetAirportsByCode: "/api/services/app/Airport/GetAll",
  Availability: "/api/services/app/BookingFlight/Availability",
  GetAvailability: "/api/services/app/BookingFlight/GetAvailability",
  GetValidate: "/api/services/app/BookingFlight/GetValidate",
  GetAllCountries: "/api/services/app/Country/GetAll",
  PreReserve: "/api/services/app/BookingFlight/PreReserve",
  ValidateFlight: "/api/services/app/BookingFlight/Validate",
  GetReserveById: "/api/services/app/Reserve/Get",
  searchFlights: 'flightdomestic.safaraneh.com/api/services/app/Airport/Search',
  Confirm: "/api/services/app/BookingFlight/Confirm",
  GetVoucherPdf: "/api/services/app/Reserve/GetVoucherPdf",
  AirportSearch: "/api/services/app/Airport/Search",
  GetFlightTenantAllReserves:"/api/services/app/TenantReserve/GetAll",
  GetFlightReserveById:"/api/services/app/TenantReserve/Get"
};

export const Blog = {
  getPosts: "//wp-json/wp/v2/posts",
  getBestCategories: '/wp-json/wp/v2/best_category',
  getCategoeyName: '/wp-json/wp/v2/categories',
  getCities: "//wp-json/wp/v2/cities/",
  getTagName: '/wp-json/wp/v2/tags/',
}

export const Hotel = {
  GetLocation: "/api/services/app/BookingHotel/GetLocation",
  GetEntity: "/api/services/app/Entity/Search",
  GetHotelById: "/v2/Hotel/GetHotelById",
  GetHotelSummaryDetailById: "/api/services/app/Accommodation/Get",
  GetDomesticHotelDetails: "/api/services/app/Accommodation/Get",
  //GetScore: "/v2/Comment/GetScore",
  //InsertComment: '/v2/Comment/InsertComment',
  AvailabilityByHotelId: "/api/services/app/Booking/AvailabilityByHotelId",
  GetRooms: "/api/services/app/Booking/GetRoom",
  ValidateRoom: "/api/services/app/Booking/Validate",
  SearchHotels: "/v2/Hotel/SearchHotels",
  //getRates: "/v2/Comment/Rates",
  GetEntityNameByLocation: "/api/services/app/Entity/Get",
  GetValidate: "/api/services/app/Booking/GetValidate",
  PreReserve: "/api/services/app/Booking/PreReserve",
  GetReserveById: "/api/services/app/Reserve/Get",
  Confirm: "/api/services/app/Booking/Confirm",
  SearchAccomodations: "/api/services/app/Accommodation/GetAll",
  GetOverview:"/api/services/app/Review/Overview",
  GetTenantAllReserves:"/api/services/app/TenantReserve/GetAll"
};

export const Wp = {
  getById:"/api/services/app/Accommodation/GetById"
}

export const Reserve = {
  GetReserveFromCoordinator: "/api/services/app/Order/Get",
  GetUserAllReserves: "/api/services/app/Order/GetAll"
};

export const Payment = {
  ValidateDiscountCode: "/api/services/app/Discount/Validate",
  RegisterDiscountCode: "/api/services/app/Discount/Register",
  GetBankGateway: "/api/services/app/ReserveBankGateway/GetAll",
  MakeToken: "/api/services/app/ReserveBankGateway/MakeToken",
  GetTenantBalances: "/api/services/app/TenantDeposit/GetBalances",
  GetTransactionDeposit: "/api/services/app/TransactionDeposit/GetAll",
  GetDepositBankGateway: "/api/services/app/TenantDepositGateway/GetGateways",
  MakeDepositToken: "/api/services/app/TenantDepositGateway/MakeToken",
  ConfirmByDeposit: "/api/services/app/DepositReserve/ConfirmByDeposit",
  GetTenantTransaction: "/api/services/app/TenantTransaction/GetAll",
  TenantTransactionsToExcel: "/api/services/app/TenantTransaction/GetAllToExcel",
  ManualReceiptGetAll: "/api/services/app/ManualReceipt/GetAll",
  CreateManualReceipt:"/api/services/app/ManualReceipt/Create",
  GetAllAccountNumbers:"/api/services/app/AccountNumbers/GetAll"
};

export const Cip = {
  SearchAirport: "/api/services/app/Airport/Search",
  GetAllAirports: "/api/services/app/Airport/GetAll",
  Availability: "/api/services/app/BookingCip/Availability",
  GetAirportByUrl: "/api/services/app/Airport/GetByUrl",
  AvailabilityByIataCode: "/api/services/app/BookingCip/AvailabilityByIataCode",
  Validate: "/api/services/app/BookingCip/Validate",
  PreReserve: "/api/services/app/BookingCip/PreReserve",
  GetReserveById: "/api/services/app/Reserve/Get",
  Confirm: "/api/services/app/BookingCip/Confirm",
  GetVoucherPdf: "/api/services/app/Reserve/GetVoucherPdf"
}

export const Traveler = {
  Create: "/api/services/app/Passenger/Create",
  GetAll: "/api/services/app/Passenger/GetAll",
  Delete: "/api/services/app/Passenger/Delete"
}

export const ServerStatus = {
  Success: 1,
  Error: 2,
  SummaryError: 3,
};


