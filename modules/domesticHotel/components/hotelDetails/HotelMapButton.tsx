import { useTranslation } from "next-i18next";
import Image from "next/image";

type Props = {
    Latitude?: number;
    Longitude?: number;
    onClick: () => void;
}

const HotelMapButton: React.FC<Props> = props => {

    const theme2 = process.env.THEME === "THEME2";

    const { t: tHotel } = useTranslation('hotel');

    if (!props.Latitude || !props.Longitude) {
        return (
            <div className="lg:col-span-1" />

        )
    }

    if (theme2) {
        return (
            <div className="lg:col-span-1">
                <p className="text-md sm:text-lg mb-1 font-semibold"> موقعیت را بررسی کنید </p>

                <button type='button' className='w-full relative rounded-2xl border border-neutral-300 overflow-hidden select-none text-sm' onClick={props.onClick}>
                    <Image src={theme2?"/images/staticmapTheme2.jpg":"/images/staticmap.png"} alt="showMap" className='block w-full h-full object-cover' width={354} height={173} />

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white">
                        {tHotel('viewOnMap')}
                    </div>
                </button>
            </div>
        )
    }

    return (

        <button type='button' className='lg:col-span-1 relative' onClick={props.onClick}>
            <Image src="/images/map-cover.svg" alt="showMap" className='block w-full h-full object-cover' width={354} height={173} />
            <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-5 py-1 border-2 border-blue-600 rounded font-semibold select-none leading-5 text-sm'>
                {tHotel('viewOnMap')}
            </span>
        </button>

    )
}

export default HotelMapButton;