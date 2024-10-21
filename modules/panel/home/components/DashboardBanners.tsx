import Rating from "@/modules/shared/components/ui/Rating";
import { AirplaneIcon, BedIcon, Hotel, Location, PercentTagIcon } from "@/modules/shared/components/ui/icons";

const DashboardBanners: React.FC = () => {

    const items: {
        image: string;
        title: string;
        type: "hotel" | "city";
        rating?: number;
        isWide?: boolean;
    }[] = [
            {
                image: "/images/panel/home/tehran.jpg",
                title: "هتل های تهران",
                type: "city",
                isWide: true
            },
            {
                image: "/images/panel/home/parsian-hotel.jpg",
                title: "هتل پارسیان آزادی",
                type: "hotel",
                isWide: false,
                rating: 5
            },
            {
                image: "/images/panel/home/remis-hotel.jpg",
                title: "هتل‌ رمیس",
                type: "hotel",
                isWide: false,
                rating: 4
            },
            {
                image: "/images/panel/home/parkway-hotel.jpg",
                title: "هتل‌ پارک وی",
                type: "hotel",
                isWide: false,
                rating: 3
            },
            {
                image: "/images/panel/home/kish.jpg",
                title: "هتل های کیش",
                type: "city",
                isWide: true
            },
            {
                image: "/images/panel/home/espinas-hotel.jpg",
                title: "هتل‌ اسپیناس پالاس",
                type: "hotel",
                isWide: false,
                rating: 5
            },
        ];

    const badgeitems: {
        icon: React.ReactNode;
        label: string;
    }[] = [
            {
                label: "بیش از ۶۵۰ هزار هتل داخلی و خارجی",
                icon: <BedIcon className="w-12 h-12" />
            },
            {
                label: "بیش از ۹۵۰ ایرلاین سرتاسر دنیا",
                icon: <AirplaneIcon className="w-12 h-12" />
            },
            {
                label: "تضمین پایین ترین قیمت",
                icon: <PercentTagIcon className="w-12 h-12" />
            }
        ]

    return (
        <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 md:px-6 py-3">
                {items.map(item => (
                    <div
                        key={item.title}
                        className={`bg-center rounded-xl bg-cover h-60 xl:h-80 p-5 col-span-1 ${item.isWide ? "xl:col-span-2" : ""} flex flex-col justify-end items-start`}
                        style={{
                            backgroundImage: `url("${item.image}")`
                        }}
                    >
                        <div className="bg-black/75 text-white font-semibold text-md px-5 py-2 leading-4 rounded-full inline-block flex gap-2 items-center min-h-14">

                            {item.type === "city" ? <Location className="w-7 h-7 fill-current" /> : <Hotel className="w-6 h-6" />}
                            <div>
                                <span className="inline-block mb-1.5">
                                    {item.title}
                                </span>
                                {item.rating && <Rating number={item.rating} className="mb-1" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-4 md:px-6 py-3">
                <div className="grid gap-5 sm:grid-cols-3 bg-white rounded-xl p-5">
                    {badgeitems.map(item => (
                        <div className="bg-cyan-100 rounded-xl p-5 text-center" key={item.label} >
                            <div className="p-5 bg-white rounded-full inline-block mb-3">
                                {item.icon}
                            </div>
                            <label className="block">
                                {item.label}
                            </label>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default DashboardBanners;