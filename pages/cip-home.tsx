import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetAirportsAvailability, GetAirportsList, GetCipAirPortListforContent } from "../modules/cip/actions/index";
import CipDescription from "@/modules/cip/components/cip-home/CipDescription";
import CipAirportsList from "@/modules/cip/components/cip-home/CipAirportsList";
import CipRules from "@/modules/cip/components/cip-home/CipRules";
import CipFaq from "@/modules/cip/components/cip-home/CipFaq";
import CipServices from "@/modules/cip/components/cip-home/CipServices";
import { AirportDetailType, CipAvailibilityItem } from "@/modules/cip/types/cip";
import CipGallery from "@/modules/cip/components/cip-home/CipGallery";
import Head from "next/head";
import NotFound from "@/modules/shared/components/ui/NotFound";
import { Cip2 } from "@/modules/shared/components/ui/icons";

const CipHome: NextPage<any> = ({ content, airports, priceData, moduleDisabled }: { content: any, airports: AirportDetailType[]; priceData: CipAvailibilityItem[], moduleDisabled?: boolean }) => {

    if (moduleDisabled) {
        return (
            <NotFound />
        )
    }

    const airportslist = airports?.map(airportItem => {

        const itemAvailibilityObject: CipAvailibilityItem | undefined = priceData.find(item => item.id === airportItem.id);

        if (itemAvailibilityObject) {

            const availabilitiesPrices = itemAvailibilityObject.availability.map(item => item.salePrice);

            return ({
                ...airportItem,
                displayPrice: Math.min(...availabilitiesPrices)
            })
        }

        return airportItem;

    })

    return (
        <>
            <Head>
                <title> تشریفات فرودگاهی cip||رزرو آنلاین هتل و بلیط هواپیما </title>
            </Head>

            <div className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl" >
                <Cip2 className="w-8 h-8" />

                تشریفات فرودگاهی

            </div>

            <CipGallery />

            <div className="px-5">
                {!!content && <CipDescription content={content} />}

                <CipAirportsList airports={airportslist} />

                <CipServices />

                <CipRules />

                <CipFaq />
            </div>

        </>
    )
}

export async function getStaticProps(context: any) {

    if (!process.env.PROJECT_MODULES?.includes("CIP")) {
        return (
            {
                props: {
                    ...await serverSideTranslations(context.locale, ['common']),
                    moduleDisabled: true
                },
            }
        )
    }

    const isSafaraneh = process.env.PROJECT === "SAFARANEH";

    const [contentData, airportsList, airportsAvailability] = await Promise.all<any>([
        isSafaraneh ? GetCipAirPortListforContent() : null,
        GetAirportsList(),
        GetAirportsAvailability([
            "IKA", "THR", "KIH", "MHD", "KSH", "AWH", "TBZ", "RAS"
        ])
    ]);

    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
                priceData: airportsAvailability?.data?.result || null,
                airports: airportsList?.data?.result?.items || null,
                content: contentData?.data?.Content || null
            },
        }
    )
}

export default CipHome;