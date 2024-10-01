import { DomesticAccomodationFacilityType } from "@/modules/domesticHotel/types/hotel";
import AccommodationFacilityIcon from './AccommodationFacilityIcon';

type Props = {
    facility: DomesticAccomodationFacilityType;
}

const AccommodationFacilityItem: React.FC<Props> = props => {

    const { facility } = props;

    if (!facility) {
        return null;
    }

    return (
        <div key={facility.keyword} className='mb-5 sm:mb-10 breakInsideAvoid'>
            <strong className='block font-semibold mb-2 sm:mb-4 text-lg'>
                <AccommodationFacilityIcon keyword={facility.keyword} />
                {facility.name}
            </strong>
            {facility.items.map(facilityItem => (
                <div key={facilityItem.name} className="text-xs before-checkmark mb-2">

                    {facilityItem.name}

                    {!!facilityItem.isAdditionalCharge && <span className='bg-neutral-200 px-1 mx-1 rounded text-xs'> هزینه جداگانه </span>}

                    {!!facilityItem.isFree && <span className='bg-green-500 text-white px-1 mx-1 rounded text-xs'> رایگان </span>}

                    {!!facilityItem.description && <p className='text-xs font-normal'>
                        ({facilityItem.description})
                    </p>}

                </div>
            ))}

        </div>
    )
}

export default AccommodationFacilityItem;