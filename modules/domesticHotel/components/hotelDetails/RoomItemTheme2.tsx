import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Image from 'next/image';

import { DomesticHotelRateItem, DomesticHotelRoomItem } from '@/modules/domesticHotel/types/hotel';
import { Bed, DefaultRoomTheme2, User } from '@/modules/shared/components/ui/icons';
import RoomItemRateItemTheme2 from './RoomItemRateItemTheme2';

type Props = {
    room?: DomesticHotelRoomItem;
    onSelectRoom: (bookingToken: string, count: number) => void;
    selectedRoomToken?: string;
    roomsHasImage?: boolean;
    nights?: number;
    onOpenRoom: (rateItem: DomesticHotelRateItem) => void;
    rates:DomesticHotelRateItem[];
}

const RoomItemTheme2: React.FC<Props> = props => {

    const { rates,room } = props;

    const { t: tHotel } = useTranslation('hotel');

    if (!rates?.length || !room) {
        return null;
    }

    let image: React.ReactNode = <div
        className={`${props.roomsHasImage ? "" : "hidden"} rounded-t-2xl flex items-center justify-center bg-neutral-100 p-5`}
    >
        <DefaultRoomTheme2 className='fill-neutral-400 w-24 h-24' />
    </div>

    if (room.image) {
        image = <Image
            onContextMenu={(e) => e.preventDefault()}
            className='h-40 w-full object-cover object-center rounded-t-2xl'
            src={room.image}
            alt={room.name || "room name"}
            width="300"
            height="200"
        />
    }

    return (
        <div className='bg-white border border-neutral-300 rounded-2xl text-sm flex flex-col justify-between'>
            <div>
                {image}
                <div className='p-3'>

                    <div className='flex gap-x-3 gap-y-1 items-center flex-wrap'>
                        <h3 className='text-17 md:text-lg font-semibold'> {room.name}</h3>
                    </div>
    

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

                </div>
            </div>

            <div className='px-3'>

                {rates?.map(rate=> (
                    <RoomItemRateItemTheme2
                        onOpenRoom={()=>{props.onOpenRoom(rate)}}
                        onSelectRoom={props.onSelectRoom}
                        rate={rate}
                        key={rate.bookingToken}
                        room={room}
                        nights={props.nights}
                        roomsHasImage={props.roomsHasImage}
                        selectedRoomToken={props.selectedRoomToken}
                    />
                 ))}

            </div>

        </div>
    )
}

export default RoomItemTheme2;
