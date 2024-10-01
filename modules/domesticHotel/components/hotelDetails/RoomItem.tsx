import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Image from 'next/image';

import { DomesticHotelRateItem, DomesticHotelRoomItem } from '@/modules/domesticHotel/types/hotel';
import { Bed, Calendar, DefaultRoom, InfoCircle, Tik, User } from '@/modules/shared/components/ui/icons';
import { numberWithCommas } from '@/modules/shared/helpers';
import Tooltip from '@/modules/shared/components/ui/Tooltip';
import Quantity from '@/modules/shared/components/ui/Quantity';
import Button from '@/modules/shared/components/ui/Button';

type Props = {
    room?: DomesticHotelRoomItem;
    rate: DomesticHotelRateItem;
    onSelectRoom: (bookingToken: string, count: number) => void;
    selectedRoomToken?: string;
    roomsHasImage?: boolean;
    nights?:number;
    onOpenRoom: () => void;
}

const RoomItem: React.FC<Props> = props => {

    const { rate, room, selectedRoomToken } = props;

    const { t } = useTranslation('common');
    const { t: tHotel } = useTranslation('hotel');

    const [count, setCount] = useState(1);


    if (!rate || !room) {
        return null;
    }

    let image: React.ReactNode = props.roomsHasImage ? <div className="bg-travel-pattern md:w-1/4 shrink-0 flex items-center justify-center bg-neutral-100 p-5 rtl:rounded-r-xl"><DefaultRoom className='fill-neutral-400 w-24 h-24' /></div> : null;

    if (room.image) {
        image = props.roomsHasImage ? (
        <div className="bg-travel-pattern bg-neutral-300 w-full md:w-1/4 flex items-center justify-center max-md:rounded-t-xl md:rtl:rounded-r-xl md:ltr:rounded-l-xl">
            <Image
                onContextMenu={(e) => e.preventDefault()}
                className='h-36 w-full object-cover object-center max-md:rounded-t-xl md:rtl:rounded-r-xl md:ltr:rounded-l-xl'
                src={room.image}
                alt={room.name || "room name"}
                width="300"
                height="200"
            />
        </div>
        ): null ;
    }


    const board = (code: string) => {
        switch (code) {
            case "BB":
                return "به همراه صبحانه";
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

    let cancellation = null;
    if (rate.cancellationPolicy?.status) {
        switch (rate.cancellationPolicy.status) {
            case "NonRefundable":
                cancellation = (
                    <div className="text-red-500 text-xs">{tHotel("non-refundable")}</div>
                );
                break;
            case "Refundable":
                cancellation = (
                    <div className="text-green-600 flex text-xs items-center gap-1">
                        <Tik className='w-5 h-5 fill-current' />
                        {tHotel("refundable")}
                    </div>
                );
                break;
            default:
                <div className='text-xs'>{rate.cancellationPolicy.status}</div>;
        }
    }

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

                    {!!(rate.calendar || room.facilities?.length || room.promotions?.length) && <button 
                        type='button'
                        onClick={props.onOpenRoom}
                        className='text-xs text-blue-600 flex items-center gap-1 mb-2 cursor-pointer'
                    >
                        <Calendar className='w-4 h-4 fill-current' />
                        نمایش جزییات 
                    </button>}
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
                className='text-sm block w-full lg:w-44 h-8 px-5 rounded-md'
            >
                {prices?.roomPrice && prices.roomPrice < 1000 ?
                    "درخواست رزرو"
                    : rate.availablityType === "Online" ?
                        tHotel("online-reserve")
                        : tHotel("room-reserve")}
            </Button>

        )
    }

    return (
        <div className='bg-white border border-neutral-300 rounded-xl mt-4 md:flex'>
            {image}
            <div className='p-3.5 grid grid-cols-1 sm:grid-cols-5 leading-5 text-sm grow gap-1'>
                <div
                    className='flex gap-2 flex-wrap justify-between sm:col-span-5'
                >
                    <div className='flex gap-x-3 gap-y-1 items-center flex-wrap'>
                        <h3 className='text-lg md:text-xl font-semibold'> {room.name}</h3>
                        <span className='text-sm text-green-600'> ({board(rate.board.code)}) </span>
                        {/* <Tooltip
                            title={<> <b> {rate.board.code} </b> ({board(rate.board.code)}) </>}
                            position='start'
                            className='flex gap-2 items-center font-semibold'
                        >
                            <Restaurant className='w-5 h-5 fill-emerald-700' />
                            {board(rate.board.code)}
                        </Tooltip>                         */}
                    </div>
                    {cancellation}
                </div>

                <div className='flex flex-col gap-1 sm:col-span-2'>
                    {rate.view && (
                        <div>
                            {rate.view.name}
                        </div>
                    )}

                    {!!room.capacity.count && (
                        <div className="flex gap-2 items-center">
                            <User className='w-5 h-5 fill-neutral-400' />
                            {room.capacity.count} نفر
                        </div>
                    )}

                    {room.capacity?.extraBed ? (
                        <div className="flex gap-2 items-center">
                            <Bed className='w-5 h-5 fill-neutral-400' />
                            {tHotel('extra-bed')}
                        </div>
                    ) : (
                        <div className="line-through text-neutral-500"> {tHotel('extra-bed')} </div>
                    )}
                    {!!(room.promotions?.length) && (
                        <div>
                            {room.promotions.map(promotion => (
                                <span
                                    key={promotion.name}
                                    className='bg-white border px-1 py-1 leading-5 rtl:ml-1 ltr:mr-1 mb-1 inline-block text-xs text-neutral-500 rounded'
                                >
                                    {promotion.name} 
                                </span>
                            ))}
                        </div>
                    )}

                    {rate.description && <div className='text-amber-600 flex gap-2'>
                        <InfoCircle className='w-4 h-4 fill-current relative top-0.5' />
                        {rate.description}
                    </div>}

                </div>
                <footer className='self-stretch md:self-end flex justify-between sm:justify-end items-end gap-5 xl:gap-10 sm:col-span-3'>

                    {rate.availablityType === "Completion" || <div dir='ltr'>
                        <label className="mb-1 block" dir="rtl" htmlFor={`counter-${rate.bookingToken}`} > تعداد </label>
                        <Quantity disabled={!!selectedRoomToken} inputId={`counter-${rate.bookingToken}`} min={1} max={rate.available} onChange={setCount} />
                    </div>}

                    <div className='flex flex-col items-end'>

                        {price}

                        {bookBtn}

                    </div>

                </footer>

            </div>

        </div>
    )
}

export default RoomItem;
