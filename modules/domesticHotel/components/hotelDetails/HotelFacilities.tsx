import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Image from 'next/image';

import { DomesticHotelFacilitieType } from "@/modules/domesticHotel/types/hotel";
import { DownCaret } from "@/modules/shared/components/ui/icons";


type Props = {
    facilities?: DomesticHotelFacilitieType[];
}

const HotelFacilities: React.FC<Props> = props => {

    const { facilities } = props;

    const [open, setOpen] = useState<boolean>(false);

    const { t: tHotel } = useTranslation('hotel');

    if (!facilities) {
        return null;
    }

    return (
        <div id='amenities_section' className="px-4 md:px-6 pt-3 pt-7 md:pt-10" >
            <h3 className='text-lg lg:text-3xl font-semibold mb-3 md:mb-7'> {tHotel("hotel-facilities")} </h3>
            <div className='p-5 lg:p-7 bg-white rounded-xl leading-5'>
                <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 overflow-hidden ${open ? "" : "max-h-60"}`}>
                    <div className='columns-2 md:columns-1'>
                        {facilities?.map(item => (
                            <div key={item.Keyword} className='text-sm md:text-base font-semibold text-green-800 mb-3'>
                                <Image src={item.Image!} alt={item.ImageAlt || item.Title || ""} width={17} height={17} className='inline-block align-middle rtl:ml-2 ltr:mr-2' />
                                {item.Title}
                            </div>))}
                    </div>
                    <div className='hidden md:block md:col-span-2 lg:col-span-3 sm:columns-2 lg:columns-3'>
                        {facilities?.map(item => (
                            <div key={item.Keyword} className='mb-6 break-inside-avoid'>

                                <div className='text-sm md:text-base font-semibold text-neutral-600 mb-3'>
                                    <Image src={item.Image!} alt={item.ImageAlt || item.Title || ""} width={17} height={17} className='inline-block align-middle rtl:ml-2 ltr:mr-2' />
                                    {item.Title}
                                </div>

                                {item.Description?.split(",").filter(i => i.trim()).map(innerItem => (
                                    <div key={innerItem} className='text-xs text-neutral-500 rtl:pr-3 ltr:pl-3 mb-2'>
                                        &#10004; {innerItem}
                                    </div>
                                ))}

                            </div>
                        ))}
                    </div>
                </div>
                <div className={`hidden md:block relative text-center before:absolute before:left-0 before:right-0 before:bottom-full ${open ? "before-h-0" : "before:h-18"} before:bg-gradient-to-b before:from-transparent before:to-white`}>
                    <button type='button' className='text-xs inline-block mt-2' onClick={() => { setOpen(prevState => !prevState) }}>
                        {open ? " بستن " : " امکانات بیشتر "} <DownCaret className={`w-5 h-5 fill-current inline-block align-middle transition-all ${open ? "rotate-180" : ""}`} />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default HotelFacilities;