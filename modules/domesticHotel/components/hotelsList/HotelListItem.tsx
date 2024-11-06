import { PricedHotelItem } from "../../types/hotel";
import Image from "next/image";
import { DefaultRoom, InfoCircle, Location, Loading, Close } from "@/modules/shared/components/ui/icons";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Rating from "@/modules/shared/components/ui/Rating";
import HotelScore from "../shared/HotelScore";
import Button from "@/modules/shared/components/ui/Button";
import { useRouter } from 'next/router';
import { addSomeDays, dateFormat, getDatesDiff, numberWithCommas } from "@/modules/shared/helpers";
import Tooltip from "@/modules/shared/components/ui/Tooltip";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import ModalPortal from "@/modules/shared/components/ui/ModalPortal";
import { useState } from "react";
import dynamic from "next/dynamic";

type Props = {
    hotel: PricedHotelItem;
    index: number;
    small?: boolean;
}

const LeafletNoSsr = dynamic(() => import('../../../shared/components/ui/LeafletMap'), {
    ssr: false
});

const HotelListItem: React.FC<Props> = props => {

    const { t } = useTranslation("common");
    const { t: tHotel } = useTranslation("hotel");
    const { hotel } = props;

    const router = useRouter();
    const { asPath } = router;

    const [openMap, setOpenMap] = useState<boolean>(false);

    const today = dateFormat(new Date());
    const tomorrow = dateFormat(addSomeDays(new Date()));
    let checkin = today;
    let checkout = tomorrow;
    let searchInfo = '';
    let nights = 1;

    if (asPath.includes("checkin") && asPath.includes("checkout")) {
        checkin = asPath.split('checkin-')[1].split("/")[0];
        checkout = asPath.split('checkout-')[1].split("/")[0];
        searchInfo = `/checkin-${checkin}/checkout-${checkout}`;
        nights = getDatesDiff(new Date(checkout), new Date(checkin));
    }

    const hotelDetailUrl =  hotel.id ? ("/hotel/hotelId-" + hotel.id + searchInfo ): "";

    let rate: React.ReactNode = null;
    if (!hotel.scoreInfo) {
        rate = null;
    } else if (hotel.scoreInfo === "loading") {
        rate = <Skeleton className="w-40 max-w-1/2" />
    } else {
        rate = <HotelScore
            reviews={hotel.scoreInfo.reviewCount}
            score={hotel.scoreInfo.averageRating}
            small
            className="text-md"
        />
    }

    let priceBlock: React.ReactNode = null;
    let priceBlockSmall: React.ReactNode = null;

    if(hotel.priceInfo === "notPriced"){
        priceBlockSmall = <div className="text-red-500 text-2xs"> بدون ظرفیت</div>
    } else if (hotel.priceInfo === 'loading') {
        priceBlockSmall =  <Skeleton className="mt-3 w-2/3" />;
    } else if (hotel.priceInfo === "need-to-inquire") {

        priceBlock = <div className="whitespace-nowrap text-red-500 text-xs"> قیمت نیازمند استعلام است </div>
        priceBlockSmall = <div className="text-red-500 text-2xs"> قیمت نیازمند استعلام است </div>

    } else {

        const { boardPrice, salePrice } = hotel.priceInfo;

        let discount: number = 0;

        const discountPercentage = ((boardPrice - salePrice) * 100 / boardPrice);

        if (discountPercentage > 0 && discountPercentage < 1) {
            discount = 1;
        } else {
            discount = +discountPercentage.toFixed(0);
        }

        priceBlock = (
            <>

                {!!discount && <div><span className="bg-green-700 text-white rounded-xl leading-7 text-2xs px-2 select-none"> {discount}% {t('discount')} </span></div>}

                {(boardPrice > salePrice) && <span className="text-xs inline-block text-neutral-500 line-through whitespace-nowrap">
                    {numberWithCommas(boardPrice)} {t('rial')}
                </span>}

                <Tooltip
                    className="inline-block text-sm rtl:mr-2 ltr:ml-2"
                    position="end"
                    title={
                        <div className="whitespace-nowrap">

                            {numberWithCommas(+(salePrice / nights).toFixed(0))} {t('rial')}

                            <br />

                            <small> {tHotel("Avg-per-night")} </small>

                        </div>
                    }
                >

                    <div className="font-semibold whitespace-nowrap">
                        {numberWithCommas(salePrice)} {t('rial')}
                    </div>

                </Tooltip>

                <div className="text-xs text-neutral-500 leading-4">
                    {tHotel("price-for-nights", { nights: nights })}
                </div>
            </>
        );

        priceBlockSmall = (
            <>

                {(boardPrice > salePrice) && <span className="leading-5 text-xs inline-block text-neutral-500 line-through whitespace-nowrap">
                    {numberWithCommas(boardPrice)} {t('rial')}
                </span>}

                {!!discount && <span className="mx-2 bg-green-700 text-white rounded-xl leading-5 text-2xs px-1 select-none"> {discount}% </span>}

                <div className="font-semibold whitespace-nowrap leading-5">
                    {numberWithCommas(salePrice)} {t('rial')}
                </div>
            </>
        );
    }

    let button: React.ReactNode = null;

    if (hotel.priceInfo === "notPriced") {
        button = null;
    } else if (hotel.priceInfo === 'loading') {
        button = (
            <div className=" rtl:text-left ltr:text-right mt-3">
                <Loading className="w-10 h-10 fill-blue-400 inline-block animate-spin" />
                <p className="text-sm">
                    {tHotel('updating-prices')}
                </p>
            </div>
        )
    } else {
        button = (
            <Button
                hasArrow
                href={hotelDetailUrl}
                target="_blank"
                className="rounded-lg h-10 px-5 text-sm w-full md:w-48 max-w-full mt-3"
            >
                {hotel.priceInfo === "need-to-inquire" ? "درخواست رزرو" : tHotel("see-rooms")}
            </Button>
        )
    }


    if (props.small) {
        return (
            <Link
                target="_blank"
                href={hotelDetailUrl}
                className="grid grid-cols-3 text-sm border border-neutral-200 bg-white rounded-lg relative rtl:rtl"
            >

                {hotel.picture?.path ? (
                    <Image
                        src={hotel.picture.path}
                        alt={hotel.picture.altAttribute || hotel.picture.titleAttribute || hotel.displayName!}
                        width={288}
                        height={200}
                        onContextMenu={(e) => e.preventDefault()}
                        className="h-full min-h-28 object-cover rounded-r-lg"
                    />
                ) : (
                    <div
                        className="bg-neutral-100 flex items-center justify-center h-full max-lg:rounded-t-lg lg:rtl:rounded-r-lg lg:ltr:rounded-l-lg"
                    >
                        <DefaultRoom className="fill-neutral-300 w-32 h-32" />
                    </div>
                )}

                <div className="col-span-2 p-2">
                    <h4 className="text-sm font-semibold">
                        {hotel.displayName || hotel.name}
                    </h4>

                    {!!hotel.rating && <Rating number={hotel.rating} />}

                    {priceBlockSmall}

                </div>
            </Link>
        )
    }


    return (
        <>
            {!!(hotel.coordinates?.latitude, hotel.coordinates?.longitude) && <ModalPortal
                show={openMap}
                selector='modal_portal'
            >
                <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center' >
                    <div
                        className='bg-black/75 absolute top-0 left-0 w-full h-full z-10'
                        onClick={() => { setOpenMap(false) }}
                    />
                    <button type='button' onClick={() => { setOpenMap(false) }} className='absolute top-2 left-2 z-30'>
                        <Close className='w-10 h-10 fill-neutral-400' />
                    </button>
                    <div className='bg-white p-2 pt-14 sm:p-5 sm:rounded-lg w-full h-full sm:h-5/6 sm:w-5/6 relative z-20'>
                        <LeafletNoSsr
                            className='h-full w-full rounded-xl'
                            location={[hotel.coordinates.latitude, hotel.coordinates.longitude]}
                            zoom={15}
                        />
                    </div>
                </div>
            </ModalPortal>}

            <div className="grid md:grid-cols-12 mb-4 border border-neutral-200 bg-white rounded-lg relative" >
                <Link target="_blank" href={hotelDetailUrl} className="relative md:col-span-12 lg:col-span-4 bg-travel-pattern lg:rtl:rounded-r-lg lg:ltr:rounded-l-lg">
                    {hotel.picture?.path ? (
                        <Image
                            src={hotel.picture.path}
                            alt={hotel.picture.altAttribute || hotel.picture.titleAttribute || hotel.displayName!}
                            width={288}
                            height={200}
                            onContextMenu={(e) => e.preventDefault()}
                            priority={!props.index}
                            className="h-48 object-cover w-full max-lg:rounded-t-lg lg:rtl:rounded-r-lg lg:ltr:rounded-l-lg"
                        />
                    ) : (
                        <div
                            className="bg-neutral-100 flex items-center justify-center h-full max-lg:rounded-t-lg lg:rtl:rounded-r-lg lg:ltr:rounded-l-lg"
                        >
                            <DefaultRoom className="fill-neutral-300 w-32 h-32" />
                        </div>
                    )}

                    {!!hotel.isPromotion && <span className="absolute bg-green-600 text-white right-3 top-3 rounded-xl leading-4 text-2xs py-1 px-2 select-none pointer-events-none"> پیشنهاد ویژه </span>}

                    {!!hotel.promotions?.length && <span className="absolute bg-red-600 text-white right-3 bottom-3 rounded-xl leading-4 text-2xs py-1 px-2 select-none pointer-events-none"> پیشنهاد ویژه </span>}

                </Link>



                <div className="md:col-span-7 lg:col-span-5 p-3 max-md:pb-0">
                    <Link target="_blank" href={hotelDetailUrl} className="font-bold text-neutral-700 rtl:ml-2 ltr:mr-2" > {hotel.displayName || hotel.name} </Link>

                    {!!hotel.rating && <Rating number={hotel.rating} inline className="align-middle rtl:ml-2 ltr:mr-2" />}

                    {!!hotel.typeStr && <span className="bg-blue-50 rounded-xl leading-6 text-2xs px-2 select-none">
                        {hotel.typeStr}
                    </span>}

                    {!!hotel.address && (
                        <p
                            className="text-xs leading-4 my-2 text-neutral-400"
                        >
                            <Location className="w-4 h-4 fill-neutral-400 inline-block" />
                            {hotel.address}
                            <button
                                type="button"
                                onClick={() => { setOpenMap(true) }}
                                className="outline-none mx-2 text-blue-700 font-bold"
                            >
                                نقشه
                            </button>
                        </p>
                    )}

                    {hotel.promotions?.map(promotion => (
                        <span
                            key={promotion.name}
                            className="bg-white border px-1 py-1 leading-5 rtl:ml-1 ltr:mr-1 mb-1 inline-block text-xs text-neutral-500 rounded"
                        >
                            {promotion.name}
                        </span>
                    ))}

                    {rate}


                    {/* {!!hotel.IsCovid && (
                    <span className="bg-blue-50 rounded-xl leading-6 text-2xs px-2 select-none">اطلاعات ایمنی کووید-۱۹</span>
                )} */}

                    {hotel.priceInfo === "notPriced" && <div className="bg-red-100 px-4 py-1 my-1">
                        <h5 className="text-red-600 text-sm font-semibold"> <InfoCircle className="w-4 h-4 fill-current inline-block" /> {tHotel("you-missed-this-deal")}</h5>
                        <p className="text-xs">{tHotel("we-dont-have-any-available-rooms-for-these-dates")}</p>
                    </div>}

                </div>

                <div className="md:col-span-5 lg:col-span-3 p-3 max-md:pt-0 flex flex-col justify-between sm:items-end">

                    <div className="rtl:text-left ltr:text-right">
                        {priceBlock}
                    </div>

                    {button}

                </div>



            </div>

        </>
    )
}

export default HotelListItem;