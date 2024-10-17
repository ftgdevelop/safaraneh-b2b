export type CurrencyType = "IRR" | "USD" | "EUR";

export type AccountNumbersType = {
    accountNumber?: string;
    accountOwnerName?: string;
    ibanNumber?: string;
    isDefault: boolean;
    bank: {
        name?: string;
        keyword?: string;
        picturePath?: string;
        pictureAltAttribute?: string;
        pictureTitleAttribute?: string;
    },
    id: number;
}
export type GetTransactionParams = {
    reserveId?: number;
    CreationTimeFrom?: string;
    CreationTimeTo?: string;
    CurrencyType: CurrencyType;
    SkipCount: number;
    MaxResultCount: number;
}

export interface CreateManualReceiptParameters {
    transactionNumber?: string;
    amount: number;
    currencyType?: CurrencyType;
    bankBrand?: string;
    holderName?: string;
    type: "Cash" | "Account" | "Card" | "Credit" | "Transfer";
    accountNumber?: string;
    bankAccountId: number;
    reserveStatus?: "Undefined" | "Registered" | "Pending" | "Issued" | "Canceled" | "WebServiceCancel" | "PaymentSuccessful" | "WebServiceUnsuccessful" | "PriceChange" | "Unavailable" | "Refunded" | "Voided" | "InProgress" | "PaidBack" | "RefundInProgress" | "Changed" | "OnCredit" | "ContactProvider" | "UnConfirmed" | "ReceivedAdvance" | "ExtraReceiving";
    transferTime: string;
    reserveId?: number;
    username?: string;
    userId?: number;
    tenantId: number;
    operatorDescription?: string;
    id?: number;
}

export interface TransactionItem {
    amount: number;
    creationTime: string;
    currencyType: CurrencyType;
    description?: string;
    isConfirmed?: boolean;
    reserveId?: number;
    type: "Deposit" | "Gateway";
    transferType?: string;
    //deposits: [{id: 97024, amount: -101700000, initialAmount: 18087891780, currencyType: "IRR",…}];
    //gateways: [];
    //id: 223523;
    //initialAmount: 18087891780;
    //tenantId: 1040;
    //tenantName: "Safaraneh";
}

export interface ManualReceiptItem {
    amount: number;
    creationTime: string;
    currencyType: CurrencyType;
    "type": "Cash" | "Account" | "Card" | "Credit" | "Transfer";
    operatorDescription?: string;
    reserveId?: number;
    // "accountNumber": "string",
    // "bankAccountId": 0,
    // "transferTime": "2024-10-07T13:41:55.662Z",
    // "transactionNumber": "string",
    // "reserveStatus": "Undefined",
    // "tenantId": 0,
    // "bankBrand": "string",
    // "holderName": "string",
    // "operatorFullName": "string",
    // "userId": 0,
    // "creatorUserId": 0,
    // "status": "Register",
    // "id": 0

}

export type GetTenantTransactionParams = {
    reserveId?: number;
    CreationTimeFrom?: string;
    CreationTimeTo?: string;
    CurrencyType: CurrencyType;
    SkipCount: number;
    MaxResultCount: number;
    PaymentType?: string;
    TransferType?: string;

}