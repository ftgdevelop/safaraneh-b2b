import ChargeWallet from "@/modules/authentication/components/wallet/ChargeWallet";
import ChargeWalletManualReceipt from "@/modules/authentication/components/wallet/ChargeWalletManualReceipt";
import { useStrapiData } from "@/modules/shared/actions/context/StrapiContext";
import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import Tab from "@/modules/shared/components/ui/Tab";
import { CreditCard, Plus } from "@/modules/shared/components/ui/icons";
import { TabItem } from "@/modules/shared/types/common";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const Deposit: NextPage = () => {

  const { strapiData } = useStrapiData();

  const tabItems: TabItem[] = [
    {
      key: 1,
      label: (
        <div className="flex gap-1 sm:gap-2 flex-col items-center justify-center p-0 sm:p-3 md:p-4 md:py-6">
          <Plus className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-current" />
          <span className="text-neutral-500 text-xs sm:text-sm md:text-base font-semibold">
            شارژ آنلاین کیف پول
          </span>
        </div>
      ),
      children: <ChargeWallet />,
    },
    {
      key: 2,
      label: (
        <div className="flex gap-1 sm:gap-2 flex-col items-center justify-center p-0 sm:p-3 md:p-4 md:py-6">
          <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-current" />
          <span className="text-neutral-500 text-xs sm:text-sm md:text-base font-semibold">
            ثبت فیش واریزی
          </span>
        </div>
      ),
      children: <ChargeWalletManualReceipt />,
    },
  ];

  return (
    <>
      <Head>
        <title>افزایش موجودی کیف پول {strapiData?.siteTitle} </title>
      </Head>
      <div className="border-b flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-white text-base sm:text-lg md:text-xl">
        <Plus className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
        افزایش موجودی کیف پول {strapiData?.siteTitle}
      </div>
      <section className="p-3 sm:p-4 md:p-6">
        <BreadCrumpt
          wrapperClassName="mb-3 sm:mb-4"
          hideHome
          items={[
            { label: "پیشخوان", link: "/panel" },
            { label: "کیف پول", link: "/wallet" },
            { label: `افزایش موجودی کیف پول ${strapiData?.siteTitle}` },
          ]}
        />

        <div className="bg-white rounded-xl border p-3 sm:p-4 md:p-6 pb-8 sm:pb-10 md:pb-12">
          <h3 className="text-base md:text-xl font-semibold">
            افزایش موجودی کیف پول {strapiData?.siteTitle}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-slate-400 mb-4 sm:mb-6 md:mb-8">
            شما در این صفحه می‌توانید به دو روش کیف پول خود را شارژ کنید.
          </p>

          <div className="bg-white rounded-xl border p-2 sm:p-4 md:p-6 w-full md:w-[620px] md:mx-auto">
            <Tab
              style="2"
              noBorder
              items={tabItems}
              itemsClassName="max-sm:gap-2"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Deposit;

export async function getStaticProps(context: any) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common", "payment"])),
    },
  };
}
