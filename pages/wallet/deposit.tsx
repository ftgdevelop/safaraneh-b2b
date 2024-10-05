import ChargeWallet from "@/modules/authentication/components/wallet/ChargeWallet";
import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import Tab from "@/modules/shared/components/ui/Tab";
import {CreditCard, Plus } from "@/modules/shared/components/ui/icons";
import { TabItem } from "@/modules/shared/types/common";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const Deposit : NextPage = () => {

    const tabItems : TabItem[] = [
        {
            key:1,
            label: (<div className="flex gap-2 flex-col items-center justify-center p-2">
                <span className="block p-1 bg-slate-100 rounded-xl">
                    <Plus className="w-8 h-8" />
                </span>
                شارژ کیف پول
            </div>),
            children:(
                <div className="py-5">
                    <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-8">
                        شارژ کیف پول
                    </h3>  
                    {/* <ChargeWallet />   */}
                </div>
            )

        },{
            key:2,
            label: (<div className="flex gap-2 flex-col items-center justify-center p-2">
                <span className="block p-1 bg-slate-100 rounded-xl">
                    <CreditCard className="w-8 h-8" />
                </span>
                ثبت فیش واریزی
            </div>),
            children:(
                <div className="py-5">
                    <h3 className="text-xl md:text-2xl font-semibold mb-8 md:mb-12">
                        ثبت فیش واریزی
                    </h3>                    
                </div>
            )
        }
    ];

    return(
    <>
        <Head>
            <title> افزایش موجودی کیف پول</title>
        </Head>
        <div className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl">
            <Plus className="w-8 h-8" />
            افزایش موجودی کیف پول
        </div>
        <section className="p-4 md:p-6">

            <BreadCrumpt
                hideHome
                items={[
                    {label:"پیشخوان",link:"/panel"},
                    {label:"کیف پول",link:"/wallet"},
                    {label:"افزایش موجودی کیف پول"}
                ]}
            />

            <div className="bg-white rounded-xl border p-5">
                <div className="bg-white rounded-xl border p-4 md:w-520 md:mx-auto">

                    <Tab
                        noBorder
                        items={tabItems}
                    />

                </div>
            </div>
        </section>
    </>
    )
}

export default Deposit;

export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common','payment']),
            },

        }
    )
}