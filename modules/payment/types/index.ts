export type GetTransactionParams = {
    reserveId?: number;
    CreationTimeFrom?: string;
    CreationTimeTo?: string;
    CurrencyType: "IRR" | "USD" | "EUR";
    SkipCount: number;
    MaxResultCount: number;
}