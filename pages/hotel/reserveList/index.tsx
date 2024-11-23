
import { ServerAddress } from "@/enum/url";
import TransactionFilterForm from "@/modules/authentication/components/wallet/TransactionFilterForm";
import TransactionItem from "@/modules/authentication/components/wallet/TransactionItem";
import { getTenantReservesDomesticHotel } from "@/modules/domesticHotel/actions";
import { getTenantTransactions, tenantTransactionsToExcel } from "@/modules/payment/actions";
import { GetTenantTransactionParams, TransactionItem as TransactionItemType } from "@/modules/payment/types";
import { GetTenantReservedHotelsParams, HotelReserveItemType, Statuse } from "@/modules/domesticHotel/types/hotel";
import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import Button from "@/modules/shared/components/ui/Button";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { Bed, Calendar, ConfirmationNumber, Email, ErrorCircle, LeftCaret, List, Phone, RightCaret, User3 } from "@/modules/shared/components/ui/icons";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { setAlertModal } from "@/modules/shared/store/alertSlice";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";
import { dateDiplayFormat, numberWithCommas } from "@/modules/shared/helpers";
import HotelReserveListItem from "@/modules/authentication/components/reservesList/HotelReserveListItem";

const ReserveList: NextPage = () => {

    const dispatch = useAppDispatch();

    const [page, setPage] = useState<number>(1);

    const [filterParams, setFilterParams] = useState<{
        creationTimeFrom: string;
        creationTimeTo: string;
        checkinTimeFrom: string;
        checkinTimeTo: string;
        checkoutTimeFrom: string;
        checkoutTimeTo: string;
        reserveId: string;
        email: string;
        lasName: string;
        phoneNumber: string;
        status: Statuse[];

    }>({
        checkinTimeFrom: "",
        checkinTimeTo: "",
        checkoutTimeFrom: "",
        checkoutTimeTo: "",
        creationTimeFrom: "",
        creationTimeTo: "",
        email: "",
        lasName: "",
        phoneNumber: "",
        reserveId: "",
        status: []
    })

    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [reserves, setReserves] = useState<HotelReserveItemType[]>([]);

    const localStorageToken = localStorage.getItem('Token');
    const localStorageTenantId = localStorage.getItem('S-TenantId');



    useEffect(() => {

        const fetchReserves = async (params: {
            page: number;
            filter: {
                Email?: string;
                PhoneNumber?: string;
                LastName?: string;

                ReserveId?: number;

                CreationTimeFrom?: string;
                CreationTimeTo?: string;

                CheckInFrom?: string;
                CheckInTo?: string;

                CheckOutFrom?: string;
                CheckOutTo?: string;

                Statuses?: Statuse[];
            };
        }, tenant: number, token: string) => {

            setLoading(true);
            setReserves([]);

            const parameters: GetTenantReservedHotelsParams = {
                MaxResultCount: 10,
                SkipCount: (params.page - 1) * 10,
            }

            if (params.filter.ReserveId) {
                parameters.ReserveId = params.filter.ReserveId;
            }

            if (params.filter.CheckInFrom) {
                parameters.CheckInFrom = params.filter.CheckInFrom;
            }
            if (params.filter.CheckInTo) {
                parameters.CheckInTo = params.filter.CheckInTo;
            }
            if (params.filter.CheckOutFrom) {
                parameters.CheckInFrom = params.filter.CheckOutFrom;
            }
            if (params.filter.CheckOutTo) {
                parameters.CheckInTo = params.filter.CheckOutTo;
            }

            if (params.filter.CreationTimeTo) {
                parameters.CreationTimeTo = params.filter.CreationTimeTo;
            }
            if (params.filter.CreationTimeFrom) {
                parameters.CreationTimeFrom = params.filter.CreationTimeFrom;
            }

            if (params.filter.ReserveId) {
                parameters.ReserveId = params.filter.ReserveId;
            }

            if (params.filter.LastName) {
                parameters.LastName = params.filter.LastName;
            }

            if (params.filter.Email) {
                parameters.Email = params.filter.Email;
            }
            if (params.filter.Statuses?.length) {
                parameters.Statuses = params.filter.Statuses;
            }

            const response: any = await getTenantReservesDomesticHotel(parameters, { tenant: tenant, token: token, currencyType: "IRR", acceptLanguage: "fa-IR" });

            if (response) {
                setReserves(response.data?.result?.items);
                console.log(response.data?.result?.items);
                setTotal(response.data?.result?.totalCount || 0);
            }

            setLoading(false);
        }

        if (localStorageToken && localStorageTenantId) {
            fetchReserves({
                page: page,
                filter: {
                    ReserveId: +filterParams.reserveId,
                    CheckInFrom: filterParams.checkinTimeFrom,
                    CheckInTo: filterParams.checkinTimeTo,
                    CheckOutFrom: filterParams.checkoutTimeFrom,
                    CheckOutTo: filterParams.checkoutTimeTo,
                    CreationTimeFrom: filterParams.creationTimeFrom,
                    CreationTimeTo: filterParams.creationTimeTo,
                    Email: filterParams.email,
                    LastName: filterParams.lasName,
                    PhoneNumber: filterParams.phoneNumber,
                    Statuses: filterParams.status
                }
            }, +localStorageTenantId, localStorageToken);
        }

    }, [
        page,
        localStorageToken,
        localStorageTenantId,
        filterParams.checkinTimeFrom,
        filterParams.checkinTimeTo,
        filterParams.checkoutTimeFrom,
        filterParams.checkoutTimeTo,
        filterParams.creationTimeFrom,
        filterParams.creationTimeTo,
        filterParams.email,
        filterParams.lasName,
        filterParams.status.length,
        filterParams.reserveId
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

    const iconClassName = "w-5 h-5 fill-neutral-400 inline-block ml-2";

    const pageBtnClassName = "inline-flex outline-none bg-white border align-middle items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 p-3 px-3 gap-1 ml-1.5";

    let content = reserves?.length ? reserves.map(reserve => (
        <HotelReserveListItem reserve={reserve} key={reserve.id} />
    )
    ) : (
        <div className="p-10 text-center">
            <ErrorCircle className="block mx-auto mb-2 w-16 h-16 fill-neutral-300" />
            رزروی با مشخصات جستجو یافت نشد!
        </div>

    );

    if (loading) {
        content = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(a => (
            <div key={a} className="grid grid-cols-1 lg: grid-cols-3 gap-5 bg-white border rounded-xl p-5 mb-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(x => (
                    <Skeleton className="h-5 w-3/4" key={x} />
                ))}
            </div>
        ))
    }

    // const resetFilterParams = () => {
    //     setFilterParams({
    //         CreationTimeFrom: "",
    //         CreationTimeTo: "",
    //         CurrencyType: "IRR",
    //         PaymentType: "",
    //         TransferType: "",
    //         ReserveId: ""
    //     })
    // }

    return (
        <>
            <Head>
                <title> لیست رزرو هتل ها </title>
            </Head>
            <div className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl">
                <List className="w-8 h-8" />
                لیست رزرو هتل ها
            </div>
            <section className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                <BreadCrumpt
                    wrapperClassName="lg:colspan-4 xl:col-span-5"
                    hideHome
                    items={[
                        { label: "پیشخوان", link: "/panel" },
                        { label: "لیست رزرو هتل ها" }
                    ]}
                />
                <div className="bg-white rounded-xl border p-5">
                    
                </div>

                <div className="lg:col-span-3 xl:col-span-4">

                    {content}

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
                    </div>

                </div>
            </section>
        </>

    )
}

export default ReserveList;

export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common', 'payment']),
            },

        }
    )
}