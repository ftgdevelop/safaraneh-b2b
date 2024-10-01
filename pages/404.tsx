import NotFound from "@/modules/shared/components/ui/NotFound";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const notFound: NextPage = () => {
    return (
        <>
            <Head>
                <title> خطای ۴۰۴ </title>
            </Head>

            <NotFound />
        </>
    )
}

export default notFound;

export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },

        }
    )
}