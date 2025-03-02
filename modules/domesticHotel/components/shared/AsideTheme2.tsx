import Button from "@/modules/shared/components/ui/Button";
import Rating from "@/modules/shared/components/ui/Rating";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { Tik, User, DefaultRoomTheme2 } from "@/modules/shared/components/ui/icons";
import { dateDiplayFormat, numberWithCommas, toPersianDigits } from "@/modules/shared/helpers";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { AsideHotelInfoType, AsideReserveInfoType } from "../../types/hotel";
import { Fragment } from "react";

type Props = {
    reserveInformation?: AsideReserveInfoType;
    hotelInformation?: AsideHotelInfoType;
    roomExtraBed?: number[];
    hasSubmit?: boolean;
    submitLoading?: boolean;
    className?: string;
    discountResponse?: {
        reserveId: number;
        promoCodeId: number;
        discountPrice: number;
        orderSubTotalDiscount: number;
        orderSubTotal: number;
        isValid: true;
    };
    discountLoading?: boolean;
    checkinTime?: string;
    checkoutTime?: string;
}
const AsideTheme2: React.FC<Props> = props => {

    const { t } = useTranslation('common');
    const { t: tHotel } = useTranslation('hotel');

    const { hotelInformation, reserveInformation, roomExtraBed, discountResponse, discountLoading } = props;

    const board = (code: string) => {
        switch (code) {
            case "BB":
                return "با صبحانه";
            case "HB":
                return "صبحانه + ناهار یا شام";
            case "FB":
                return "تمام وعده های غذایی شامل می شود";
            case "RO":
                return "بدون صبحانه";
            case "Hour6":
                return "اقامت به مدت ۶ ساعت";
            case "Hour10":
                return "اقامت به مدت ۱۰ ساعت";

            default:
                return code;
        }
    }

    const hasDiscount = reserveInformation?.salePrice && reserveInformation.boardPrice && reserveInformation.boardPrice > reserveInformation.salePrice;

    let extraBedCount = 0;
    let extraBedPrice = 0;
    if (roomExtraBed?.length) {
        extraBedCount = roomExtraBed.reduce((total: number, item: number) => total + item, 0);
        extraBedPrice = reserveInformation?.rooms.reduce((total: number, item: AsideReserveInfoType['rooms'][0], index) => {
            const itemExtraBEdPrice: number = item.pricing.find(pricingItem => (pricingItem.ageCategoryType === "ADL" && pricingItem.type === 'ExtraBed'))?.amount || 0;
            return (total + itemExtraBEdPrice * roomExtraBed[index]);
        }, 0) || 0;
    }

    let activeExtraBedPrice;
    let activeExtraBedCount;

    if (props.reserveInformation?.selectedExtraBedPrice) {
        activeExtraBedPrice = props.reserveInformation?.selectedExtraBedPrice;
        activeExtraBedCount = props.reserveInformation?.selectedExtraBedCount;
    } else {
        activeExtraBedPrice = extraBedPrice;
        activeExtraBedCount = extraBedCount;
    }

    if (!reserveInformation) {
        return (
            <>
                <div className='border border-neutral-300 bg-white rounded-xl mb-4'>
                    <Skeleton type='image' className="h-36 sm:h-60 rounded-t-xl" />

                    <div className="p-5">

                        <Skeleton className='mb-3 w-2/3' />
                        <Skeleton className='mb-3 w-1/3 my-4' />
                        <Skeleton className='w-full' />

                        <hr className="my-6" />

                        <Skeleton className='mb-3 w-1/3 my-4' />
                        <Skeleton className='mb-3 w-2/3' />
                        <Skeleton className='w-1/2' />

                        <hr className="my-6" />

                        <Skeleton className='mb-3 w-1/3 my-4' />
                        <Skeleton className='mb-3 w-2/3' />

                    </div>

                </div>

                <Skeleton className='mb-3 w-full mt-6 rounded-xl' type='button' />

            </>
        )
    }

    let promoCodePrice: number = reserveInformation.promoCodePrice || 0;
    if (discountResponse) {
        promoCodePrice = discountResponse.discountPrice;
    }

    return (
        <>
            <div className={`bg-white rounded-xl border border-neutral-300 mb-4 ${props.className}`} >

                {hotelInformation?.image.url ? (
                    <Image
                        onContextMenu={(e) => e.preventDefault()}
                        src={hotelInformation.image.url}
                        alt={hotelInformation?.image?.alt || hotelInformation.name}
                        title={hotelInformation?.image?.title}
                        width={445}
                        height={288}
                        className="w-full h-72 object-cover rounded-t-lg"
                    />
                ) : (
                    <div
                        className="bg-neutral-100 flex items-center justify-center h-full rounded-t-lg"
                    >
                        <DefaultRoomTheme2 className="fill-neutral-300 w-40 h-40 p-10" />
                    </div>
                )}

                <div className="p-5">

                    {hotelInformation ? (
                        <>
                            <h4 className="font-bold text-md md:text-2xl mb-3">{hotelInformation.name}</h4>

                            {!!hotelInformation?.rating && <Rating number={hotelInformation.rating} className="mb-3" />}

                            {!!hotelInformation?.address && (
                                <p className="text-xs">
                                    {hotelInformation?.address}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <Skeleton className='mb-3 w-2/3' />
                            <Skeleton className='mb-3 w-1/3 my-5' />
                            <Skeleton className='w-full' />
                        </>
                    )}

                    {!!reserveInformation.reserveId && (
                        <>
                            <div className='border border-2 border-blue-800 bg-neutral-100 text-blue-800 text-lg font-semibold p-2 mt-4 flex items-center justify-center gap-2'>
                                {t('tracking-code')} : {reserveInformation.reserveId}
                            </div>
                        </>
                    )}

                    {reserveInformation && (
                        <>
                            <hr className="my-5" />

                            <label className="block mb-2 font-semibold">
                                ورود
                            </label>

                            <div className="text-lg font-semibold mb-5">
                                {dateDiplayFormat({ date: reserveInformation.checkin, format: "ddd dd mm yyyy", locale: "fa" })} 
                                {props.checkinTime ? 
                                    <span className="text-neutral-500 text-sm rtl:mr-4 ltr:ml-4">
                                        از ساعت {toPersianDigits(props.checkinTime)}
                                    </span>
                                : null}
                            </div>

                            <label className="block mb-2 font-semibold">
                                خروج
                            </label>

                            <div className="text-lg font-semibold mb-5">
                                {dateDiplayFormat({ date: reserveInformation.checkout, format: "ddd dd mm yyyy", locale: "fa" })} 
                                {props.checkoutTime ? 
                                    <span className="text-neutral-500 text-sm rtl:mr-4 ltr:ml-4"> 
                                        تا ساعت {toPersianDigits(props.checkoutTime)}
                                    </span>
                                : null}
                            </div>

                        </>
                    )}

                    {reserveInformation.rooms.map((roomItem: any, roomIndex: number) => {

                        //TODO check cancelation
                        let cancellation = null;
                        switch (roomItem.cancellationPolicyStatus.toLowerCase()) {
                            case "nonrefundable":
                                cancellation = <div className="margin-bottom-5 text-red">{tHotel("non-refundable")}</div>;
                                break;
                            case "refundable":
                                cancellation = <div className="text-green-600 margin-bottom-5">
                                    <Tik className="w-5 h-5 fill-green-600 inline-block rtl:ml-1 ltr:mr-1" />
                                    {tHotel("refundable")}
                                </div>;
                                break;
                            default:
                                cancellation = <div className="margin-bottom-5">{roomItem.cancellationPolicyStatus} </div>;
                        }

                        let childPriceBlock = null;
                        let extraBedPriceBlock = null;

                        if (roomExtraBed?.length) {
                            const selectedExtraBed = roomExtraBed[roomIndex];
                            if (selectedExtraBed) {
                                let count = null;
                                switch (selectedExtraBed) {
                                    case 1:
                                        count = "یک";
                                        break;
                                    case 2:
                                        count = "دو";
                                        break;
                                    case 3:
                                        count = "سه";
                                        break;
                                    default:
                                        count = selectedExtraBed;

                                }
                                extraBedPriceBlock = <span> + {count} تخت اضافه</span>
                            }
                        }

                        return (
                            <Fragment key={roomIndex}>

                                <hr className="my-5" />

                                <div>

                                    <div className="font-semibold text-base mb-2">
                                        {toPersianDigits(roomItem.name)}
                                    </div>

                                    <div className="flex gap-2 items-center text-sm">
                                        <User className="w-4.5 h-4.5 fill-current" />
                                        {(roomItem.bed || 0) + (roomItem.extraBed || 0) } {tHotel('guest')} {extraBedPriceBlock}
                                    </div>

                                    <div className="text-green-600 text-sm">{board(roomItem.board)}</div>

                                    {cancellation}

                                </div>

                            </Fragment>
                        )
                    })}

                </div>

            </div>


            <div className="bg-white p-5 rounded-xl border border-neutral-300 mb-4 text-sm">
                <h5 className="font-semibold text-lg mb-3"> جزییات قیمت </h5>

                {reserveInformation.rooms.map((room, roomIndex) => {

                    if (room.nightly?.length && room.nightly.length > 1) {

                        return (
                            <div
                                key={roomIndex}
                                className="flex gap-3 mb-4 pb-3 overflow-x-auto styled-scrollbar select-none"
                            >
                                {room.nightly?.filter(n => (n.date && n.amount)).map(night => (
                                    <div
                                        key={roomIndex + (night.date || "")}
                                        className="border rounded-lg text-xs bg-white whitespace-nowrap"
                                    >
                                        <header className="bg-neutral-200 p-2 leading-4 rounded-t-lg">
                                            {dateDiplayFormat({
                                                date: night.date!,
                                                format: "ddd dd mm",
                                                locale: "fa"
                                            })}
                                        </header>
                                        <div className="p-2">
                                            {!!night.board && <div className="text-neutral-400 text-xs line-through">
                                                {numberWithCommas(night.board)} ریال
                                            </div>}

                                            {!!night.amount && <div className="font-semibold text-md">
                                                {numberWithCommas(night.amount)} ریال
                                            </div>}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )
                    } else {
                        return null
                    }

                })}

                {reserveInformation.salePrice && reserveInformation.salePrice > 500000 ? (
                    <>
                        {(hasDiscount || !!activeExtraBedPrice || !!reserveInformation.promoCodePrice || !!promoCodePrice) && (
                            <div className="flex items-center justify-between">
                                {t("sum")}
                                <span>{numberWithCommas(reserveInformation.boardPrice)} {t('rial')} </span>
                            </div>
                        )}

                        {!!activeExtraBedPrice && (
                            <div className="flex items-center justify-between">
                                {tHotel("extra-bed")} (x{activeExtraBedCount})
                                <span>{numberWithCommas(activeExtraBedPrice)} {t('rial')} </span>
                            </div>
                        )}

                        {!!hasDiscount && (
                            <div className="flex items-center justify-between">
                                {t("site-discount")}
                                <span>{numberWithCommas(reserveInformation.boardPrice - reserveInformation.salePrice)} {t('rial')}</span>

                            </div>
                        )}


                        {!!discountLoading && (
                            <Skeleton className="my-1" />
                        )}

                        {!!promoCodePrice && (
                            <div className="flex items-center justify-between">
                                کد تخفیف
                                <span>{numberWithCommas(promoCodePrice)} {t('rial')}</span>
                            </div>
                        )}

                        {!!reserveInformation.salePrice && (
                            <div className="flex items-center justify-between font-bold">
                                {t("price-paid")}
                                <strong className="text-lg">
                                    {!!discountResponse && discountResponse.orderSubTotalDiscount >= 10000 ?
                                        numberWithCommas(discountResponse.orderSubTotalDiscount + (activeExtraBedPrice || 0)) + " " + t('rial')
                                        :
                                        numberWithCommas(reserveInformation.salePrice + (activeExtraBedPrice || 0) - (reserveInformation.promoCodePrice || 0)) + " " + t('rial')
                                    }
                                </strong>
                            </div>
                        )}
                    </>
                ) : (
                    <span className='text-xs font-semibold text-red-500'>قیمت نیازمند استعلام است </span>
                )}

            </div>


            {props.hasSubmit && (
                <div className="mt-2 max-sm:fixed max-sm:bg-white max-sm:border-t max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:z-50 max-sm:p-4">
                    <Button type="submit" loading={props.submitLoading} className="h-12 px-2 w-full mb-2" >
                        {t('complete-reserve-and-get-confirmation')}
                    </Button>
                </div>
            )}

        </>
    )

}

export default AsideTheme2;