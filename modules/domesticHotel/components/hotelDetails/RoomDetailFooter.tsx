import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { DomesticHotelRateItem } from '@/modules/domesticHotel/types/hotel';
import { InfoCircle } from '@/modules/shared/components/ui/icons';
import { numberWithCommas } from '@/modules/shared/helpers';
import Tooltip from '@/modules/shared/components/ui/Tooltip';
import Quantity from '@/modules/shared/components/ui/Quantity';
import Button from '@/modules/shared/components/ui/Button';

type Props = {
    rate: DomesticHotelRateItem;
    onSelectRoom: (bookingToken: string, count: number) => void;
    selectedRoomToken?: string;
    nights?:number;
}

const RoomDetailFooter: React.FC<Props> = props => {

    const { rate, selectedRoomToken } = props;

    const { t } = useTranslation('common');
    const { t: tHotel } = useTranslation('hotel');

    const [count, setCount] = useState(1);

    if (!rate) {
        return null;
    }

    const isSafarLife = process.env.SITE_NAME === 'https://www.safarlife.com';

    const prices = {
        roomPrice: rate.pricing?.find(
            (item) => item.type === "Room" && item.ageCategoryType === "ADL"
        )?.amount,
        boardPrice: rate.pricing?.find(
            (item) => item.type === "RoomBoard" && item.ageCategoryType === "ADL"
        )?.amount,
        extraBedPrice: rate.pricing?.find(
            (item) => item.type === "ExtraBed" && item.ageCategoryType === "ADL"
        )?.amount,
        childPrice: rate.pricing?.find(
            (item) => item.type === "Room" && item.ageCategoryType === "CHD"
        )?.amount,
    };

    const calulateDiscount = (sale: number, board: number) => {
        let discountPercentage, fixedDiscountPercentage;
        discountPercentage = ((board - sale) * 100 / board);
        if (discountPercentage > 0 && discountPercentage < 1) {
            fixedDiscountPercentage = 1;
        } else {
            fixedDiscountPercentage = discountPercentage.toFixed(0);
        }
        return (fixedDiscountPercentage);
    }

    let price: React.ReactNode;
    let bookBtn: React.ReactNode;

    if (rate.availablityType === "Completion") {
        price = "";
    } else if (prices?.roomPrice && prices.roomPrice > 1000) {
        price = <>
            {(prices.boardPrice && (prices.boardPrice !== prices.roomPrice)) && <div>
                <span className="bg-green-700 text-white px-2 py-1 leading-4 rounded-xl text-xs inline-block">{calulateDiscount(prices.roomPrice, prices.boardPrice)}% {tHotel('discount')}</span>
            </div>}
            {prices.roomPrice && (
                <>
                    <Tooltip
                        className={rate.availablityType === 'Offline' ? "" : "whitespace-nowrap"}
                        position='end'
                        title={rate.availablityType === 'Offline' ? (
                            <div className='w-60'>
                                قیمت نهایی پس از پردازش و تایید از طرف رزرواسیون مشخص می شود
                            </div>
                        ):(
                            <>
                                {numberWithCommas(prices.roomPrice * count /(props.nights || 1))} {t("rial")}
                                <small className='block'> {tHotel("Avg-per-night")} </small>
                            </>
                        )}
                    >
                        <div className="text-lg my-1 leading-4 font-semibold flex flex-col items-end lg:flex-row gap-x-1.5 lg:items-center">
                            {prices.boardPrice && (prices.roomPrice < prices.boardPrice) && (
                                <div className="my-0.5 line-through font-semibold text-xs text-neutral-500">
                                    {numberWithCommas(prices.boardPrice * count)} {t("rial")}
                                </div>
                            )}
                            <div className='my-0.5'>
                                {numberWithCommas(prices.roomPrice * count)} {t("rial")}
                                <InfoCircle className='fill-amber-500 w-5 h-5 inline-block rtl:mr-0.5 ltr:ml-0.5' />
                            </div>
                        </div>
                    </Tooltip>
                </>
            )}
        </>
    } else {
        price = <div className="text-red-500 rtl:text-left ltr:text-right">قیمت نیازمند استعلام است</div>;
    }

    if (rate.availablityType === "Completion") {
        bookBtn = <div className="text-red-500"> ظرفیت تکمیل است  </div>;
    } else {
        bookBtn = (
            <Button
                onClick={() => {
                    rate.bookingToken ? props.onSelectRoom(rate.bookingToken, count) : undefined;
                }}
                loading={!!selectedRoomToken && selectedRoomToken === rate.bookingToken}
                disabled={!!selectedRoomToken && selectedRoomToken !== rate.bookingToken}
                className='block w-full lg:w-44 h-8 px-5 rounded-md text-xs'
            >
                {prices?.roomPrice && prices.roomPrice < 1000 ?
                    "درخواست رزرو"
                    : rate.availablityType === "Online" ?
                    isSafarLife ? "رزرو آنی" : tHotel("online-reserve")
                        : tHotel("room-reserve")}
            </Button>

        )
    }

    return (
        <footer className='border-t pt-5 max-sm:pb-24 max-sm:p-3 self-stretch flex justify-between items-end gap-5 xl:gap-10 sm:col-span-3'>

            {rate.availablityType === "Completion" || <div dir='ltr'>
                <label className="mb-1 block" dir="rtl" htmlFor={`counter-${rate.bookingToken}`} > تعداد </label>
                <Quantity disabled={!!selectedRoomToken} inputId={`counter-${rate.bookingToken}`} min={1} max={rate.available} onChange={setCount} />
            </div>}

            <div className='flex flex-col items-end'>

                {price}

                {bookBtn}

            </div>

        </footer>
    )
}

export default RoomDetailFooter;
