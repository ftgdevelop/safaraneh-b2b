import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Panel : NextPage = () => {

    return(
    <section className="py-8 md:pb-14 md:pt-20 bg-violet-950">
        <div className="max-w-container px-5 mx-auto grid grid-cols-2 md:grid-cols-3 gap-7 items-center">

            <h2 className="text-white text-2xl sm:3xl md:text-4xl text-center mb-5 font-600 col-span-2 md:col-span-3"> پنل</h2>
        </div>
     </section>
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