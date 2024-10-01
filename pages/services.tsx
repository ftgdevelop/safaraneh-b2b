import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";

const Services : NextPage = () => {
    const features: {
        icon: string;
        title: string;
    }[] = [
        {
            icon: "/assets/images/home/features/bed.svg",
            title: "بیش از ۶۵۰ هزار هتل داخلی و خارجی",
        },
        {
            icon: "/assets/images/home/features/flight.svg",
            title: "بیش از ۹۵۰ ایرلاین سرتاسر دنیا",
        },
        {
            icon: "/assets/images/home/features/offer.svg",
            title: "تضمین پایین ترین قیمت",
        },
        {
            icon: "/assets/images/home/features/bed.svg",
            title: "بیش از ۶۵۰ هزار هتل داخلی و خارجی",
        },
        {
            icon: "/assets/images/home/features/flight.svg",
            title: "بیش از ۹۵۰ ایرلاین سرتاسر دنیا",
        },
        { 
            icon: "/assets/images/home/features/offer.svg",
            title: "تضمین پایین ترین قیمت",
        },
    ];

    return(
    <section className="py-8 md:pb-14 md:pt-20 bg-violet-950">
        <div className="max-w-container px-5 mx-auto grid grid-cols-2 md:grid-cols-3 gap-7 items-center">
            <h2 className="text-white text-2xl sm:3xl md:text-4xl text-center mb-5 font-600 col-span-2 md:col-span-3"> سرویس های ما </h2>
            {features.map(partner => (
                <div key={partner.title} className="bg-cyan-100 text-center py-8 rounded-xl">
                    <Image 
                        src={partner.icon} 
                        width={56} 
                        height={56} 
                        alt={partner.title} 
                        title={partner.title}
                        className="w-14 h-14 inline-block mb-4"
                    />
                    <h4>
                        {partner.title}
                    </h4>
                </div>
            ))}
        </div>
     </section>
    )
}

export default Services;
export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },

        }
    )
}