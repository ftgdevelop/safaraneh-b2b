import Rating from "@/modules/shared/components/ui/Rating";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { DefaultRoom, DefaultRoomTheme2 } from "@/modules/shared/components/ui/icons";
import Image from "next/image";
import HotelScore from "../shared/HotelScore";
import Link from "next/link";
import { numberWithCommas } from "@/modules/shared/helpers";
import { useTranslation } from "next-i18next";
import Button from "@/modules/shared/components/ui/Button";

type Props = {
    onHoverHotel: (id?: number) => void;
    id: number;
    name: string;
    rating?: number;
    url: string;
    imageUrl?: string;
    ratesInfo?: "loading" | { Satisfaction: number; TotalRowCount: number; };
    priceInfo: "loading" | "notPriced" | "need-to-inquire" | { boardPrice: number; salePrice: number; };
}

const SimpleHotelListItem: React.FC<Props> = props => {

    const { t } = useTranslation('common');
    const { t: tHotel } = useTranslation('hotel');

    const { ratesInfo, name, priceInfo, url, rating, imageUrl, onHoverHotel, id } = props;

    let guestRate = null;

    if (!ratesInfo) {
        guestRate = null;
    } else if (ratesInfo === "loading") {
        guestRate = <Skeleton />
    } else {
        guestRate = <HotelScore
            reviews={ratesInfo.TotalRowCount}
            score={ratesInfo.Satisfaction}
            small
        />
    }

    let price = null;

    if (priceInfo === "loading") {
        price = <Skeleton />
    } else if (priceInfo === "need-to-inquire") {
        price = <div className="text-red-500 text-xs"> قیمت نیازمند استعلام است </div>;
    } else if (priceInfo === "notPriced") {
        price = <div className="text-red-500 text-xs"> قیمت وجود ندارد </div>;
    } else {
        price = <div className="font-bold text-sm"> {numberWithCommas(priceInfo.salePrice)} {t('rial')}</div>;
    }
    
    const theme2 = process.env.THEME === "THEME2";

    return (
        <Link
            href={url}
            className="grid grid-cols-5 mb-2 bg-white rounded-lg border border-neutral-300 hover:border-blue-500"
            onMouseOver={() => { onHoverHotel(id) }}
            onMouseLeave={() => { onHoverHotel() }}
        >
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={name}
                    width={81}
                    height={96}
                    className="h-24 object-cover w-full rtl:rounded-r-lg ltr:rounded-l-lg"
                />
            ) : (
                <div
                    className="bg-neutral-100 flex items-center justify-center h-full rtl:rounded-r-lg ltr:rounded-l-lg"
                >
                    {theme2?(
                        <DefaultRoomTheme2 className="fill-neutral-300 w-14 h-14" />
                    ):(
                        <DefaultRoom className="fill-neutral-300 w-14 h-14" />
                    )}
                </div>
            )}
            <div className="col-span-4 p-2 flex flex-col justify-between">

                <div> <h4 className="text-sm font-semibold inline-block align-middle"> {name} </h4>  {!!rating && <Rating inline number={rating} className="align-middle mb-px" />} </div>

                {guestRate}

                <div className="flex gap-2 justify-between items-center">
                    {price}

                    <Button type="button" className="text-xs px-2 h-8">
                        {tHotel('see-rooms')}
                    </Button>
                </div>

            </div>


        </Link>
    )
}

export default SimpleHotelListItem;