import Image from "next/image";

const Partners: React.FC = () => {

    const homePartners: {
        image:string;
        title: string;
    }[] = [
        {
            image: "/assets/images/home/partners/eghamat24.svg",
            title: "اقامت ۲۴",
        },
        {
            image: "/assets/images/home/partners/iranhotelonline.svg",
            title: "ایران هتل آنلاین",
        },
        {
            image: "/assets/images/home/partners/alibaba.svg",
            title: "علی بابا",
        },
        {
            image: "/assets/images/home/partners/safarmarket.svg",
            title: "سفر مارکت",
        },
        {
            image: "/assets/images/home/partners/flytoday.svg",
            title: "فلای تودی",
        },
        {
            image: "/assets/images/home/partners/snapptrip.svg",
            title: "اسنپ تریپ",
        },
    ];

    return(
    <section className="py-14 md:py-28">
        <div className="max-w-container px-5 mx-auto grid grid-cols-3 md:grid-cols-6 gap-5 items-center">
            <h2 className="text-slate-800 text-2xl sm:3xl md:text-4xl text-center mb-6 md:mb-12 font-bold col-span-3 md:col-span-6">برخی از همکاران ما</h2>
            {homePartners.map((partner) => (
                <Image 
                    key={partner.title} 
                    src={partner.image} 
                    width={160} 
                    height={36} 
                    alt={partner.title} 
                    title={partner.title}
                    className="block mx-auto"
                />
            ))}
        </div>
     </section>
    )
}
export default Partners;