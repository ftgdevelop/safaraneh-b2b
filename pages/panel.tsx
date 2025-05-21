import HotelSearchForm from "@/modules/domesticHotel/components/shared/SearchForm";
import SearchForm from "@/modules/flights/components/shared/searchForm";
import CIP_SearchForm from "@/modules/cip/components/searchForm";
import DashboardBanners from "@/modules/panel/home/components/DashboardBanners";
import Tab from "@/modules/shared/components/ui/Tab";
import { Bus, Cip2, Dashboard, Flight2, Hotel } from "@/modules/shared/components/ui/icons";
import { addSomeDays, dateFormat } from "@/modules/shared/helpers";
import { TabItem } from "@/modules/shared/types/common";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Panel: NextPage = () => {

    const today = dateFormat(new Date());
    const tomorrow = dateFormat(addSomeDays(new Date()));
    let checkin = today;
    let checkout = tomorrow;

    const hasCIP = process.env.PROJECT_MODULES?.includes("CIP");
    const hasFlight = process.env.PROJECT_MODULES?.includes("DomesticFlight");
    const tabItems: TabItem[] = [
        {
            key: 1,
            label: (<div className="flex gap-2 items-center justify-center">
                <Hotel className="w-6 h-6" />
                هتل
            </div>),
            children: (
                <>
                    <h3 className="text-lg md:text-2xl font-semibold mt-6 mb-10"> جستجوی هتل </h3>
                    <HotelSearchForm wrapperClassName="" defaultDates={[checkin, checkout]} />
                </>
            )

        }, {
            key: 2,
            label: (<div className="flex gap-2 items-center justify-center">
                <Flight2 className="w-6 h-6" />
                پرواز داخلی
            </div>),
            children: hasFlight ? (
                <>
                    <h3 className="text-lg md:text-2xl font-semibold mt-6 mb-10"> جستجوی پرواز </h3>
                    <SearchForm />
                </>
            ) : (
                <div className="p-10">
                    در حال توسعه ...
                </div>
            )
        }, {
            key: 3,
            label: (<div className="flex gap-2 items-center justify-center">
                <Flight2 className="w-6 h-6" />
                پرواز خارجی
            </div>),
            children: (
                <div className="p-10">
                    در حال توسعه ...
                </div>
            )
        }, {
            key: 4,
            label: (<div className="flex gap-2 items-center justify-center">
                <Bus className="w-6 h-6" />
                اتوبوس
            </div>),
            children: (
                <div className="p-10">
                    در حال توسعه ...
                </div>
            )
        }, {
            key: 5,
            label: (<div className="flex gap-2 items-center justify-center">
                <Cip2 className="w-6 h-6" />
                تشریفات فرودگاهی
            </div>),
            children: hasCIP ? (
                <>
                    <h3 className="text-lg md:text-2xl font-semibold mt-6 mb-10"> جستجوی تشریفات فرودگاهی </h3>
                    <CIP_SearchForm wrapperClassName="pb-5" />
                </>
            ) : (
                <div className="p-10">
                    در حال توسعه ...
                </div>
            )
        }
    ];
    return (
        <>
            <div className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl">
                <Dashboard className="w-8 h-8" />
                پیشخوان
            </div>
            <section className="p-4 md:p-6">
                <div className="bg-white rounded-xl border p-5">
                    <Tab items={tabItems} noBorder />
                </div>
            </section>

            <DashboardBanners />
        </>
    )
}

export default Panel;

export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },

        }
    )
}