import { CheckTag } from "@/modules/shared/components/ui/icons";
import { DomesticHotelRoomItem } from "../../types/hotel";

type Props = {
    facilityItems : DomesticHotelRoomItem['facilities']
};

const RoomFacilities : React.FC<Props> = props => {
    return(
        <div className="py-4 sm:pt-7 text-sm">
            {props.facilityItems?.map(facilityItem => (
                <div
                    key={facilityItem.keyword}
                    className="flex items-center gap-1 mb-2"
                >
                    <CheckTag className="w-5 h-5 fill-neutral-400" />
                    
                    {facilityItem.title}
                    
                </div>
            ))}
        </div>
    )
}

export default RoomFacilities;