import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { DomesticHotelAvailability, DomesticHotelRateItem, DomesticHotelRoomItem } from "../../types/hotel";
import RoomItemTheme2 from "./RoomItemTheme2";

type Props = {
    availabilites?: DomesticHotelAvailability[];
    selectRoomHandle: (key: string, count: number) => void;
    selectedRoomToken?: string;
    roomsHasImage?: boolean;
    nights?: number;
    onOpenRoom: (room : {
        rate: DomesticHotelRateItem;
        room?: DomesticHotelRoomItem;
    }) => void;

}

const RoomsListTheme2: React.FC<Props> = props => {

    if (!props.availabilites ) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(item => (
                    <div key={item} className='bg-white border border-neutral-300 rounded-2xl mb-4 overflow-hidden'>
                        <Skeleton type='image' className="w-full h-40" />
                        <div className='p-4'>
                            <Skeleton className='w-full mb-3' />
                            <Skeleton className='w-1/2 mb-3' />
                            <Skeleton className='w-2/3 mb-3' />
                            <Skeleton className='w-4/5 mb-3' />
                            <br />
                            <Skeleton className='w-20 mb-3' />
                            <div className='flex justify-between mb-4'>
                                <Skeleton className='w-40' />
                                <Skeleton className='w-20' />
                            </div>
                            <div className='flex justify-between mb-4'>
                                <Skeleton className='w-24' />
                                <Skeleton className='w-48' />
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        )
    }


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {props.availabilites.map(availability => {
                return (
                    <RoomItemTheme2
                        rates={availability.rates || []}
                        key={availability.rooms?.[0]?.name}
                        room={availability.rooms![0]}
                        onSelectRoom={props.selectRoomHandle}
                        selectedRoomToken={props.selectedRoomToken}
                        roomsHasImage={props.roomsHasImage || false}
                        nights={props.nights}
                        onOpenRoom={(rateItem:any) =>{
                            props.onOpenRoom({
                                rate: rateItem,
                                room: availability.rooms?.[0]
                            })
                        }}
                    />
                )
            })}
        </div>
    )
}

export default RoomsListTheme2;