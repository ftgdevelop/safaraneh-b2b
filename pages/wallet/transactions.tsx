import { ServerAddress } from "@/enum/url";
import TransactionFilterForm from "@/modules/authentication/components/wallet/TransactionFilterForm";
import TransactionItem from "@/modules/authentication/components/wallet/TransactionItem";
import { getTenantTransactions, tenantTransactionsToExcel } from "@/modules/payment/actions";
import { GetTenantTransactionParams, TransactionItem as TransactionItemType } from "@/modules/payment/types";
import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import Button from "@/modules/shared/components/ui/Button";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { ErrorCircle, LeftCaret, RightCaret, TableIcon, TimeUpdate } from "@/modules/shared/components/ui/icons";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { setAlertModal } from "@/modules/shared/store/alertSlice";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";

const Transactions: NextPage = () => {

    const dispatch = useAppDispatch();

    const [downloadExcelLoading, setDownloadExcelLoading] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);

    const [filterParams, setFilterParams] = useState<{
        CreationTimeFrom: string;
        CreationTimeTo: string;
        CurrencyType: "IRR" | "USD" | "EUR";
        PaymentType: string;
        TransferType: string;
        ReserveId: string;
    }>({
        CreationTimeFrom: "",
        CreationTimeTo: "",
        CurrencyType: "IRR",
        PaymentType: "",
        TransferType: "",
        ReserveId: ""
    })

    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [transactions, setTransactions] = useState<TransactionItemType[]>([]);

    const localStorageToken = localStorage.getItem('Token');
    const localStorageTenantId = localStorage.getItem('S-TenantId');

    useEffect(() => {

        const fetchTransactions = async (params: {
            page: number;
            filter: {
                CreationTimeFrom: string;
                CreationTimeTo: string;
                CurrencyType: "IRR" | "USD" | "EUR";
                PaymentType: string;
                TransferType: string;
                ReserveId: string;
            };
        }, tenant: number, token: string) => {

            setLoading(true);
            setTransactions([]);

            const parameters: {
                MaxResultCount: number;
                SkipCount: number;
                CurrencyType: "IRR" | "USD" | "EUR";
                CreationTimeFrom?: string;
                CreationTimeTo?: string;
                PaymentType?: string;
                TransferType?: string;
                ReserveId?: string;

            } = {
                MaxResultCount: 10,
                SkipCount: (params.page - 1) * 10,
                CurrencyType: params.filter.CurrencyType
            }

            if (params.filter.ReserveId) {
                parameters.ReserveId = params.filter.ReserveId;
            }

            if (params.filter.TransferType) {
                parameters.TransferType = params.filter.TransferType;
            }
            if (params.filter.PaymentType) {
                parameters.PaymentType = params.filter.PaymentType;
            }
            if (params.filter.CreationTimeTo) {
                parameters.CreationTimeTo = params.filter.CreationTimeTo;
            }
            if (params.filter.CreationTimeFrom) {
                parameters.CreationTimeFrom = params.filter.CreationTimeFrom;
            }

            const response: any = await getTenantTransactions(parameters, tenant, token);

            if (response) {
                setTransactions(response.data?.result?.items);
                setTotal(response.data?.result?.totalCount || 0);
            }

            setLoading(false);
        }

        if (localStorageToken && localStorageTenantId) {
            fetchTransactions({
                page: page,
                filter: {
                    CreationTimeFrom: filterParams.CreationTimeFrom,
                    CreationTimeTo: filterParams.CreationTimeTo,
                    CurrencyType: filterParams.CurrencyType,
                    PaymentType: filterParams.PaymentType,
                    ReserveId: filterParams.ReserveId,
                    TransferType: filterParams.TransferType
                }
            }, +localStorageTenantId, localStorageToken);
        }

    }, [
        page,
        localStorageToken,
        localStorageTenantId,
        filterParams.CreationTimeFrom,
        filterParams.CreationTimeTo,
        filterParams.CurrencyType,
        filterParams.PaymentType,
        filterParams.ReserveId,
        filterParams.TransferType
    ]);

    const tableCellClass = "p-4 text-right font-normal border-neutral-200 transition-all whitespace-nowrap"

    const previousPage = () => {
        setPage(prevPage => {
            if (prevPage > 1) {
                return (prevPage - 1)
            }
            return prevPage
        })
    }
    const nextPage = () => {
        setPage(prevPage => {
            if (prevPage < total / 10) {
                return (prevPage + 1)
            }
            return prevPage
        })
    }

    const pageBtnClassName = "inline-flex outline-none bg-white border align-middle items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 p-3 px-3 gap-1 ml-1.5";

    const loadingItems: number[] = [];
    for (let i = 0; i < 10; i++) {
        loadingItems.push(i)
    };

    let tableItems = transactions?.length ? transactions.map((transaction, index) => (
        <TransactionItem
            key={transaction.creationTime + transaction.reserveId}
            index={index + ((page - 1) * 10) + 1}
            data={transaction}
        />
    )
    ) : (
        <tr>
            <td colSpan={6} className="border-t">
                <div className="p-10 text-center">
                    <ErrorCircle className="block mx-auto mb-2 w-16 h-16 fill-neutral-300" />
                    تراکنشی با مشخصات جستجو یافت نشد!
                </div>
            </td>
        </tr>
    );

    const createTransactionExcel = async () => {

        setDownloadExcelLoading(true);

        const queryParams: GetTenantTransactionParams = {
            MaxResultCount: 200,
            SkipCount: 0,
            CurrencyType: "IRR"
        }
        if (filterParams.CreationTimeFrom) {
            queryParams.CreationTimeFrom = filterParams.CreationTimeFrom
        };
        if (filterParams.CreationTimeTo) {
            queryParams.CreationTimeTo = filterParams.CreationTimeTo;
        }
        if (filterParams.ReserveId) {
            queryParams.reserveId = +filterParams.ReserveId;
        }
        if(filterParams.PaymentType){
            queryParams.PaymentType = filterParams.PaymentType;
        }
        if(filterParams.TransferType){
            queryParams.TransferType = filterParams.TransferType;
        }

        const token = localStorage.getItem('Token');
        const localStorageTenant = localStorage?.getItem('S-TenantId');
        if (!token || !localStorageTenant) return;

        const response: any = await tenantTransactionsToExcel(queryParams, +localStorageTenant, token, "en-US");

        if (response?.data?.result) {

            const url = `https://${ServerAddress.Payment}/en/File/DownloadTempFile?fileName=${response.data.result.fileName}&fileToken=${response.data.result.fileToken}&fileType=${response.data.result.fileType}`;
            let a = document.createElement('a');
            a.href = url;
            a.click();
        } else {
            dispatch(setAlertModal({
                title: "خطا",
                message: response?.response?.data?.error?.message || "خطا در ارسال درخواست!",
                isVisible: true
            }))
        }

        setDownloadExcelLoading(false)

    }


    if (loading) {
        tableItems = loadingItems.map(a => (
            <tr key={a}>
                {[1, 2, 3, 4, 5, 6].map(x => (
                    <td className={`${tableCellClass} border-t`} key={x} >
                        <Skeleton className="h-5 w-3/4 my-1" />
                    </td>
                ))}
            </tr>
        ))
    }

    const resetFilterParams = () => {
        setFilterParams({
            CreationTimeFrom: "",
            CreationTimeTo: "",
            CurrencyType: "IRR",
            PaymentType: "",
            TransferType: "",
            ReserveId: ""
        })
    }

    return (
        <>
            <Head>
                <title> تراکنش های آنلاین </title>
            </Head>
            <div className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl">
                <TimeUpdate className="w-8 h-8" />
                تراکنش های آنلاین
            </div>
            <section className="p-4 md:p-6">

                <BreadCrumpt
                    wrapperClassName="mb-4"
                    hideHome
                    items={[
                        { label: "پیشخوان", link: "/panel" },
                        { label: "کیف پول", link: "/wallet" },
                        { label: "تراکنش های آنلاین" }
                    ]}
                />

                <div className="bg-white p-5 border rounded-2xl mb-5">
                    <TransactionFilterForm
                        resetHandler={resetFilterParams}
                        submitHandler={params => { setFilterParams(params) }}
                    />
                </div>

                <div className="bg-white p-5 border rounded-2xl mb-5">
                    <table className="w-full text-sm text-neutral-700">
                        <thead>
                            <tr className="text-muted-foreground">
                                <th className={`${tableCellClass} w-10 xl:w-24`}> # </th>
                                <th className={`${tableCellClass} w-12 xl:w-32`}> شماره رزرو </th>
                                <th className={`${tableCellClass} w-10 xl:w-32`}> نوع تراکنش </th>
                                <th className={`${tableCellClass} w-14 xl:w-40`}> مبلغ  </th>
                                <th className={`${tableCellClass} w-16 xl:w-40 `}> تاریخ </th>
                                <th className={`${tableCellClass} w-1/3 xl:w-80`}> جزییات </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableItems}
                        </tbody>
                    </table>

                </div>

                <div className="flex justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={previousPage}
                            className={pageBtnClassName}
                            disabled={page === 1}
                        >
                            <RightCaret className="w-5 h-5 fill-current" />
                            قبلی
                        </button>
                        <button
                            type="button"
                            onClick={nextPage}
                            className={pageBtnClassName}
                            disabled={page * 10 >= total}
                        >
                            بعدی
                            <LeftCaret className="w-5 h-5 fill-current" />
                        </button>
                    </div>

                    <Button
                        type="button"
                        color="green"
                        className="h-10 px-5"
                        onClick={createTransactionExcel}
                        loading={downloadExcelLoading}
                    >
                        <TableIcon className="w-5 h-5 fill-current" />
                        خروجی اکسل

                    </Button>
                </div>


            </section>
        </>
    )
}

export default Transactions;

export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common', 'payment']),
            },

        }
    )
}