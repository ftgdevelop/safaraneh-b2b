import { InternetError } from "@/modules/shared/components/ui/icons";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Offline: NextPage = () => {

    const {t} = useTranslation('common');
    return (
        <div className="max-w-container m-auto p-5 max-sm:p-3">
            <div className="flex flex-col text-center items-center p2-20 pb-32">
                <InternetError className="fill-red-500 w-20 h-20 mx-auto mb-8" />
                <strong className="block mb-3 text-xl">
                    {t("noInternetConnection")}
                </strong>
                <p className="text-sm">
                    {t('pleaseEnsureYourInternetConnection')}
                </p>
            </div>
        </div>
    )
}

export default Offline;

export async function  getStaticProps (context: any)  {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },

        }
    )

}