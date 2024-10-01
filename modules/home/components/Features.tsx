import Image from "next/image";

const Features: React.FC = () => {

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
    <section className="py-6 md:py-10">
        <div className="max-w-container px-5 mx-auto grid grid-cols-2 md:grid-cols-3 gap-7 items-center">
            <h2 className="text-slate-800 text-2xl sm:3xl md:text-4xl text-center mb-6 md:mb-12 font-bold col-span-2 md:col-span-3"> امکانات پنل آژانس های همکار </h2>
            {features.map(partner => (
                <div key={partner.title} className="bg-cyan-100/75 text-center py-8 rounded-xl">
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
export default Features;