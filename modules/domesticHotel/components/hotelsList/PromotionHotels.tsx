import Slider from "react-slick";
import { PricedHotelItem } from "../../types/hotel";
import { Close, LeftCircle, RightCircle } from "@/modules/shared/components/ui/icons";
import { useTranslation } from "next-i18next";
import HotelListItem from "./HotelListItem";
import { useState } from "react";

type Props = {
    promotionHotels: PricedHotelItem[];
}

const PromotionHotels: React.FC<Props> = props => {

    const { t } = useTranslation('home');

    const [closed, setClosed] = useState<boolean>(false);

    const { promotionHotels } = props;

    if (!promotionHotels.length) {
        return null
    }

    const settings = {
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <RightCircle />,
        prevArrow: <LeftCircle />,
        customPaging: function () {
            return (
                <a className='w-3.5 h-3.5 border-2 border-neutral-500 inline-block rounded-full' />
            );
        },
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false
                }
            }
        ]
    };

    if(closed){
        return null;
    }

    return (
        <div className="bg-white border rounded-lg p-4 mb-5">
            <h2 className='text-xl font-semibold mb-4 flex items-center justify-between'>
                {t('suggested-hotels')}
                <button
                    type="button"
                    className="outline-none"
                    onClick={()=>{setClosed(true)}}
                >
                    <Close 
                        className="w-6 h-6 fill-neutral-400"
                    />
                </button>
            </h2>

            <Slider {...settings} className='gap-slider'>
                {promotionHotels.map((hotel, index) => (
                    <HotelListItem
                        hotel={hotel}
                        key={hotel.name}
                        index={index}
                        small
                    />
                ))}
            </Slider>
        </div>
    )
}

export default PromotionHotels;