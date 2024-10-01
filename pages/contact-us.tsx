import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ContactUs : NextPage = () => {

    return(
    <section className="py-8 md:pb-14 md:pt-20 bg-violet-950">
        <div className="max-w-container px-5 mx-auto">
            <h2 className="text-white text-2xl sm:3xl md:text-4xl text-center mb-6 md:mb-10 font-600"> تماس با ما </h2>
            <div className="rounded-xl bg-white p-5 md:p-7 lg:py-12">
                ...
            </div>
        </div>
     </section>
    )
}

export default ContactUs;
export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },

        }
    )
}