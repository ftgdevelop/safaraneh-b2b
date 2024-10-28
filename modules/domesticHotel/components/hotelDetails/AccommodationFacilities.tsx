import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { DomesticAccomodationFacilityType } from "@/modules/domesticHotel/types/hotel";
import { DownCaret } from "@/modules/shared/components/ui/icons";
import AccommodationFacilityItem from './AccommodationFacilitiyItem';

type Props = {
    facilities?: DomesticAccomodationFacilityType[];
}

const AccommodationFacilities: React.FC<Props> = props => {

    const { facilities } = props;

    const [open, setOpen] = useState<boolean>(false);

    const { t: tHotel } = useTranslation('hotel');

    if (!facilities || !facilities.length) {
        return null;
    }

    return (
        <div id='amenities_section' className="px-4 md:px-6 pt-7 md:pt-10" >

            <h3 className='text-lg lg:text-3xl font-semibold mb-3 md:mb-7'> {tHotel("hotel-facilities")}   </h3>

            <div className='p-5 lg:p-7 bg-white rounded-xl leading-5'>

                {/* <div className='mb-7 flex flex-wrap gap-4'>
                    {facilities.filter(item => item.items.some(s => s.isImportant)).map(facilityItem => (
                        <Fragment key={facilityItem.keyword} >
                            {facilityItem.items.filter(i => i.isImportant).map(a => (
                            <span key={a.name} className='text-sm block border border-neutral-200 font-semibold text-neutral-500 p-1 sm:p-3 rounded whitespace-nowrap'>
                                 <AccommodationFacilityIcon keyword={a.keyword} />
                                 {a.name} 
                            </span>
                            ))}
                        </Fragment>
                    ))}
                </div> */}

                <div className={`sm:columnCount2 md:columnCount3 xl:columnCount4`}>

                    {facilities.slice(0, 4).map(facility => <AccommodationFacilityItem facility={facility} key={facility.keyword} />)}

                    {!!open && facilities.slice(4).map(facility => <AccommodationFacilityItem facility={facility} key={facility.keyword} />)}

                </div>

                <div className={`relative text-center before:absolute before:left-0 before:right-0 before:bottom-full ${open ? "before-h-0" : "before:h-18"} before:bg-gradient-to-b before:from-transparent before:to-white`}>
                    <button type='button' className='text-xs inline-block mt-2' onClick={() => { setOpen(prevState => !prevState) }}>
                        {open ? " بستن " : " امکانات بیشتر "} <DownCaret className={`w-5 h-5 fill-current inline-block align-middle transition-all ${open ? "rotate-180" : ""}`} />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default AccommodationFacilities;