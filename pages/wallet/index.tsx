import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { CreditCard, Plus, TimeUpdate, Wallet2 } from "@/modules/shared/components/ui/icons";
import { numberWithCommas, returnCurrency } from "@/modules/shared/helpers";
import { useAppDispatch, useAppSelector } from "@/modules/shared/hooks/use-store";
import { setAlertModal } from "@/modules/shared/store/alertSlice";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Wallet: NextPage = () => {

    const balances = useAppSelector(state => state.authentication.balances);
    const balanceLoading = useAppSelector(state => state.authentication.balanceLoading);

    const dispatch = useAppDispatch()
    const router = useRouter();

    const { query } = router;
    const status = query.status;

    useEffect(() => {
        if (status === "0") {
            
            dispatch(setAlertModal({
                type: "error",
                title: "افزایش اعتبار ناموفق بود",
                message: "در صورت برداشت وجه از حساب بانکی، مبلغ برداشت شده تا ۴۸ ساعت آینده به حساب شما برگشت داده خواهد شد.",
                isVisible: true,
                //closeAlertLink: "",
                closeButtonText: "بستن"
            }));


        } else if (status === "1") {
            dispatch(setAlertModal({
                type: "success",
                title: "افزایش اعتبار انجام شد",
                message: "اعتبار موجودی کیف شما با موفقیت افزایش یافت.",
                isVisible: true,
                //closeAlertLink: "",
                closeButtonText: "بستن"
            }));
        }
    }, [status]);


    return (
        <>
            <Head>
                <title> کیف پول</title>
            </Head>
            <div className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl">
                <Wallet2 className="w-8 h-8" />
                کیف پول
            </div>
            <section className="p-4 md:p-6">

                <BreadCrumpt
                    hideHome
                    items={[
                        { label: "پیشخوان", link: "/panel" },
                        { label: "کیف پول" }
                    ]}
                />

                <div className="bg-white rounded-xl border p-5">
                    <div className="bg-white rounded-xl border m-5 p-8 md:w-520 md:mx-auto">
                        <h3 className="text-xl md:text-2xl font-semibold mb-8 md:mb-12">
                            کیف پول
                        </h3>
                        <div className="flex justify-between">
                            <span>
                                موجودی
                            </span>

                            {balanceLoading ? (
                                <Skeleton className="mt-2 w-24" />
                            ) : (
                                <div>
                                    {balances.filter(b => b.amount)?.map(b => (
                                        <> {numberWithCommas(b.amount)} {returnCurrency(b.currencyType)}  <br /> </>
                                    ))}
                                </div>
                            )}
                        </div>

                        <hr className="my-5" />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <Link href="/wallet/deposit" className="group hover:bg-slate-100 p-5 rounded-xl flex flex-col gap-3 items-center col-span-2 border">
                                <span className="block bg-slate-100 p-1.5 rounded-xl group-hover:bg-slate-200">
                                    <Plus className="w-7 h-7 fill-current" />
                                </span>
                                پرداخت و افزایش اعتبار
                            </Link>
                            <Link href="/wallet/transactions" className="py-3 hover:bg-slate-100 px-3 rounded flex gap-2 justify-center items-center border rounded-xl">
                                <TimeUpdate className="w-5 h-5 fill-current" />
                                تراکنش های آنلاین
                            </Link>
                            <Link href="/wallet/offline-transactions" className="py-3 hover:bg-slate-100 px-3 rounded flex gap-2 justify-center items-center border rounded-xl">
                                <CreditCard className="w-5 h-5 fill-current" />
                                تراکنش های آفلاین
                            </Link>

                        </div>


                    </div>
                </div>
            </section>
        </>
    )
}

export default Wallet;

export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },

        }
    )
}