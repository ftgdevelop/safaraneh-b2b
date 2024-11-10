import { Fragment, useState } from 'react';

import { DomesticAccomodationType, DomesticHotelDetailType } from "@/modules/domesticHotel/types/hotel";
import { Directions, Location } from "@/modules/shared/components/ui/icons";
import HotelScore from "../shared/HotelScore";
import Rating from "@/modules/shared/components/ui/Rating";
import Image from 'next/image';
import Attractions from './Attractions';
import HotelMap from './HotelMap';
import HotelMapButton from './HotelMapButton';
import AccommodationFacilityIcon from './AccommodationFacilityIcon';
import Link from 'next/link';

type Props = {
    accomodationData: DomesticAccomodationType;
    hotelData?: DomesticHotelDetailType;
    reviewData?: {
        averageRating: number;
        reviewCount: number;
    };
}

const HotelName: React.FC<Props> = props => {

    const { accomodationData } = props;

    const theme1 = process.env.THEME === "THEME1";
    const theme2 = process.env.THEME === "THEME2";

    const [showMap, setShowMap] = useState<boolean>(false);

    if (!accomodationData) {
        return null
    }

    const closeMapModal = () => { setShowMap(false) };

    return (

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-5 bg-white rounded-b-xl ${theme1?" p-3 -mt-6 pt-12 sm:p-5 xl:p-7 xl:pt-16":"pt-3 pb-5"}`}>
            <div className="lg:col-span-2 pt-3">
                <h1 className="font-semibold text-2xl lg:text-4xl mb-3 sm:mb-4 lg:mb-5"> {accomodationData.displayName || accomodationData.name} </h1>
                {!!(accomodationData.rating) && <Rating number={accomodationData.rating} className="mb-3" />}
                {!!(accomodationData.address) && (
                    <p className="text-neutral-500 text-sm mb-3 sm:mb-6"><Location className="w-4 h-4 fill-current inline-block align-middle" /> 
                        {accomodationData.address} 
                        {!!theme2 && <Link
                            target='_blank'
                            className='mx-2'
                            href={`https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${accomodationData.coordinates?.latitude},${accomodationData.coordinates?.longitude}`}
                        >
                            <Directions className='w-8 h-8 fill-blue-600 inline-block' />
                        </Link>}
                    </p>
                )}
                
                {props.reviewData ? (
                    <HotelScore
                        reviews={props.reviewData.reviewCount}
                        score={props.reviewData.averageRating}
                        className="text-md lg:text-lg font-semibold"
                    />
                )
                : (
                    null
                )}

            </div>

            <HotelMapButton 
                onClick={() => { setShowMap(true) }}
                Latitude={accomodationData.coordinates?.latitude}
                Longitude={accomodationData.coordinates?.longitude}
            />

            {
                accomodationData.facilities?.length 
                || 
                (process.env.PROJECT === "SAFARANEH" && props.hotelData?.Facilities?.length)
            ? (
                <div className='lg:col-span-2'>
                    
                    <strong className='block font-semibold text-md lg:text-lg mb-3'>امکانات محبوب هتل</strong>

                    {process.env.PROJECT === "SAFARANEH" ? (
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
                        {props.hotelData?.Facilities?.slice(0, 6).map(item => <div key={item.Keyword} className='text-sm text-neutral-500'>
                            {item.Image && <Image src={item.Image} alt={item.ImageAlt || item.Title || ""} width={20} height={20} className='h-5 w-5 inline-block rtl:ml-2 ltr:mr-2' />}
                            {item.Title}
                        </div>)}
                    </div>
                    ):props.accomodationData.facilities?.length  ? (
                        <div className='mb-5 flex flex-wrap gap-1 sm:gap-3'>
                            {props.accomodationData.facilities?.filter(item => item.items.some(s => s.isImportant)).map(facilityItem => (
                                <Fragment key={facilityItem.keyword} >
                                    {facilityItem.items.filter(i => i.isImportant).map(a => (
                                        <span key={a.name} className='text-xs sm:text-sm block border border-neutral-200 font-semibold text-neutral-500 px-1 sm:p-2 rounded whitespace-nowrap'>
                                            <AccommodationFacilityIcon keyword={a.keyword} />
                                            {a.name}
                                        </span>
                                    ))}
                                </Fragment>
                            ))}
                        </div>
                    ):
                        null
                    }
                    
                </div>
            ):(
                <div className='lg:col-span-2' />
            )}

            {!!(props.hotelData?.DistancePoints?.length && process.env.PROJECT === "SAFARANEH") && <div className='hidden lg:block lg:col-span-1'>
                <Attractions isSmall attractions={props.hotelData.DistancePoints} />
            </div>}

            {!!(showMap && accomodationData.coordinates?.latitude && accomodationData.coordinates?.longitude) && <HotelMap
                closeMapModal={closeMapModal}
                latLong={[accomodationData.coordinates.latitude, accomodationData.coordinates.longitude]}
            />}

        </div>
    )
}

export default HotelName;