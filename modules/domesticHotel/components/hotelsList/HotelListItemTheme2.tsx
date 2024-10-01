import { PricedHotelItem } from "../../types/hotel";
import Image from "next/image";
import {DefaultRoomTheme2, InfoCircle, Location } from "@/modules/shared/components/ui/icons";
import { useTranslation } from "next-i18next";
import Rating from "@/modules/shared/components/ui/Rating";
import { useRouter } from 'next/router';
import { addSomeDays, dateFormat, getDatesDiff, numberWithCommas, toPersianDigits } from "@/modules/shared/helpers";
import Tooltip from "@/modules/shared/components/ui/Tooltip";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import GuestRating from "@/modules/shared/components/ui/GuestRating";
import Button from "@/modules/shared/components/ui/Button";
import Link from "next/link";

type Props = {
    hotel: PricedHotelItem;
    index: number;
}

const HotelListItemTheme2: React.FC<Props> = props => {

    const { t } = useTranslation("common");
    const { t: tHotel } = useTranslation("hotel");
    const { hotel } = props;

    const router = useRouter();
    const { asPath } = router;

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

    let rate: React.ReactNode = null;
    if (!hotel.ratesInfo) {
        rate = <div />;
    } else if (hotel.ratesInfo === "loading") {
        rate = <Skeleton className="mt-1" />
    } else if (!hotel.ratesInfo?.Satisfaction) {
        rate = <div />;
    } else {
        rate = <GuestRating
            rating={hotel.ratesInfo?.Satisfaction}
            reviewCount={hotel.ratesInfo.TotalRowCount}
            wrapperClassName="mt-1"
        />
    }

    let priceBlock: React.ReactNode = null;

    if (hotel.priceInfo === "notPriced") {

        priceBlock = null;

    }else if (hotel.priceInfo === 'loading') {
        
        priceBlock = <div dir="ltr">
            <Skeleton className="w-16" />
            <Skeleton className="w-28 my-2" />
            <Skeleton className="w-20" />
        </div>

    } else if (hotel.priceInfo === "need-to-inquire") {

        priceBlock = <div className="whitespace-nowrap text-red-500 text-xs leading-4"> قیمت نیازمند استعلام است </div>

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

                {!!discount && <div><span className="bg-green-700 text-white rounded-xl leading-7 text-2xs px-2 select-none"> {toPersianDigits(discount.toString())}% {t('discount')} </span></div>}

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
                    {tHotel("price-for-nights", { nights: toPersianDigits(nights.toString()) })}
                </div>
            </>
        )
    }

    let url = hotel.url! + searchInfo;
    if (process.env.LocaleInUrl === "off"){
        url = url.replace("/fa","");
    }


    let button: React.ReactNode = null;

    if (hotel.priceInfo === "notPriced") {
        button = null;
    } else if (hotel.priceInfo === 'loading') {
        button = null;
    } else {
        button = (
            <Button
                href={hotel.url+searchInfo}
                target="_blank"
                className="rounded-full h-10 px-5 text-sm w-full md:w-48 max-w-full mt-2"
            >
                {hotel.priceInfo === "need-to-inquire" ? "درخواست رزرو" :"مشاهده و رزرو"}
            </Button>
        )
    }

    const isSafarLife = process.env.SITE_NAME === 'https://www.safarlife.com';
    
    return (
        <div
            className="grid xs:grid-cols-4 mb-4 border border-neutral-200 bg-white rounded-2xl overflow-hidden relative"
        >
            <Link 
                href={hotel.url+searchInfo}
                target="_blank"
            >
                {hotel.picture?.path ? (
                    <Image
                        src={hotel.picture.path}
                        alt={hotel.picture.altAttribute || hotel.picture.titleAttribute || hotel.displayName ||""}
                        width={288}
                        height={200}
                        onContextMenu={(e) => e.preventDefault()}
                        priority={!props.index}
                        className="object-cover h-full w-full"
                    />
                ) : (
                    <div
                        className="bg-neutral-100 flex items-center justify-center h-full max-lg:rounded-t-lg lg:rtl:rounded-r-lg lg:ltr:rounded-l-lg"
                    >
                        <DefaultRoomTheme2 className="fill-neutral-300 w-32 h-32" />
                    </div>
                )}
            </Link>

            {!!hotel.isPromotion && <span className="absolute bg-green-600 text-white right-3 top-3 rounded-xl leading-4 text-2xs py-1 px-2 select-none pointer-events-none"> پیشنهاد ویژه </span>}
            {!!hotel.promotions?.length && <span className="absolute bg-red-600 text-white right-3 bottom-3 rounded-xl leading-4 text-2xs py-1 px-2 select-none pointer-events-none"> پیشنهاد ویژه </span> }


            <div className="xs:col-span-3 p-3 max-xs:pb-0">

                <Link 
                    href={hotel.url+searchInfo}
                    target="_blank"
                    className="font-bold text-neutral-700 rtl:ml-2 ltr:mr-2 inline-block" 
                > 
                    {hotel.displayName || hotel.name} 
                </Link>

                {!!hotel.typeStr && <span className="bg-blue-50 rounded-xl leading-6 text-2xs px-2 select-none">
                    {hotel.typeStr}
                </span>}

                {!!hotel.rating && (
                    <>
                        <br />
                        <Rating number={hotel.rating} inline />
                    </>
                )}


                {!!hotel.address && <p className="text-xs leading-4 mb-2 text-neutral-400"><Location className="w-4 h-4 fill-neutral-400 inline-block" /> {hotel.address} </p>}

                {hotel.promotions?.map(promotion => (
                    <span
                        key={promotion.name}
                        className="bg-white border px-1 py-1 leading-5 rtl:ml-1 ltr:mr-1 mb-1 inline-block text-xs text-neutral-500 rounded"
                    >
                        {promotion.name}
                    </span>
                ))}

                {/* {hotel.facilities?.slice(0,3).map(facility => (<span className="text-xs rtl:ml-2">
                    {facility.Image ? (
                        <Image 
                        src={facility.Image}
                        alt={facility.ImageAlt||""}
                        title={facility.ImageTitle||""}
                        width={15}
                        height={15}
                        className="object-contain inline-block"
                    />
                    ) : (
                        <Verified className="w-5 h-5 fill-neutral-400 inline-block" />
                    )}
                    {" " + facility.Title}
                </span>))} */}

                {/* {!!hotel.IsCovid && (
                    <span className="bg-blue-50 rounded-xl leading-6 text-2xs px-2 select-none">اطلاعات ایمنی کووید-۱۹</span>
                )} */}

                {hotel.priceInfo === "notPriced" && <div className="bg-red-100 px-4 py-1 my-1">
                    <h5 className="text-red-600 text-sm font-semibold"> 
                        <InfoCircle className="w-4 h-4 fill-current inline-block rtl:ml-1 ltr:mr-1" />
                        {isSafarLife ? "امکان رزرو این هتل وجود ندارد": tHotel("you-missed-this-deal")}
                    </h5>
                    <p className="text-xs">
                        {isSafarLife ? "ممکن است با تغییر تاریخ، تعداد نفرات و یا دیگر مقادیر جستجو، هتل قابل رزرو باشد." : tHotel("we-dont-have-any-available-rooms-for-these-dates")}
                    </p>
                </div>}


                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-end">

                    {rate}

                    <div className="rtl:text-left ltr:text-right max-sm:pb-3">
                        {priceBlock}
                        {button}
                    </div>

                </div>

            </div>

        </div>
    )
}

export default HotelListItemTheme2;