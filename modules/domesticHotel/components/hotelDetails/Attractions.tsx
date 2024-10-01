import { useTranslation } from 'next-i18next';

import { DomesticHotelDetailType } from '@/modules/domesticHotel/types/hotel';
import { LocationCircle } from '@/modules/shared/components/ui/icons';

type Props = {
    attractions: DomesticHotelDetailType['DistancePoints'];
    isSmall?: boolean;
}

const Attractions: React.FC<Props> = props => {

    const { attractions } = props;

    const { t: tHotel } = useTranslation('hotel');

    const distanceDurationByMode = (mode?: string) => {
        switch (mode) {
            case "Walking":
                return tHotel('walking');
            case "Driving":
                return tHotel('with-car');
            default:
                return mode || "";
        }
    }

    if (!attractions) {
        return null;
    }

    return (
        <>
            <strong className='block font-semibold text-md lg:text-lg mb-3'> فاصله هتل تا اماکن مهم </strong>
            {attractions.map(item => (
                <div key={item.AttractionName} className={`flex justify-between text-sm ${props.isSmall?"text-neutral-500":"md:text-base md:mb-2"}`}>
                    <strong className='font-semibold'><LocationCircle className='w-4 h-4 fill-current inline-block align-middle rtl:ml-1 ltr:mr-1' /> {tHotel('distance-to')} {item.AttractionName} </strong>
                    <span>
                        {item.DurationText} {distanceDurationByMode(item.Mode)}
                    </span>
                </div>
            ))}

        </>
    )
}

export default Attractions;