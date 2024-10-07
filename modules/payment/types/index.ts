export type GetTransactionParams = {
    reserveId?: number;
    CreationTimeFrom?: string;
    CreationTimeTo?: string;
    CurrencyType: "IRR" | "USD" | "EUR";
    SkipCount: number;
    MaxResultCount: number;
}


export interface TransactionItem {
    amount: number;
    creationTime:string;
    currencyType: "IRR" | "USD" | "EUR";
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

export type GetTenantTransactionParams = {
    reserveId?: number;
    CreationTimeFrom?: string;
    CreationTimeTo?: string;
    CurrencyType: "IRR" | "USD" | "EUR";
    SkipCount: number;
    MaxResultCount: number;
    PaymentType?: string;
    TransferType?: string;

}