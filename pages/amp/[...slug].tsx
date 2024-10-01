import NotFound from "@/modules/shared/components/ui/NotFound";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const Amp: NextPage = () => {
    return (
        <>
            <Head>
                <title> خطای	۴۱۰ </title>
            </Head>

            <NotFound code={410} />
        </>
    )
}

export default Amp;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    
    context.res.statusCode = 410;

    return ({
        props: {
            ...await (serverSideTranslations(context.locale, ['common']))
        },
    })
}