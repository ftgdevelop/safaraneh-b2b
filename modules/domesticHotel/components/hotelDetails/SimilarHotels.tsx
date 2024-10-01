import { useTranslation } from 'next-i18next';
import { useEffect, useCallback, useState, useMemo, useRef } from 'react';

import { AvailabilityByIdItem, DomesticHotelMainType } from '@/modules/domesticHotel/types/hotel';
import SimilarHotelItem from './SimilarHotelItem';
import { useRouter } from 'next/router';
import { InfoCircle } from '@/modules/shared/components/ui/icons';
import { addSomeDays, dateFormat, getDatesDiff } from '@/modules/shared/helpers';
import { AvailabilityByHotelId } from '../../actions';

type Props = {
    similarHotels?: DomesticHotelMainType[];
}

const SimilarHotels: React.FC<Props> = props => {

    const { similarHotels } = props;

    const router = useRouter();
    const { asPath } = router;

    const { t } = useTranslation('common');
    const { t: tHotel } = useTranslation('hotel');

    const [pricedResponse, setPricedResponse] = useState<AvailabilityByIdItem[] | undefined>();

    const [showAll, setShowAll] = useState<boolean>(false);

    const [isInView,setIsInView] = useState<boolean>(false);

    const today = dateFormat(new Date());
    const tomorrow = dateFormat(addSomeDays(new Date()));
    let checkin = today;
    let checkout = tomorrow;
    let searchInfo = '';

    if (asPath.includes("checkin") && asPath.includes("checkout")) {
        checkin = asPath.split('checkin-')[1].split("/")[0];
        checkout = asPath.split('checkout-')[1].split("/")[0];
        searchInfo = `/checkin-${checkin}/checkout-${checkout}`;
    }

    const nights = getDatesDiff(new Date(checkin), new Date(checkout));

    const [loading, setLoading] = useState<boolean>(true);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const checkIsInView = () => {
        const targetTop = wrapperRef.current?.getBoundingClientRect().top;
        if (targetTop && targetTop < 62) {
            
            setIsInView(true);

            document.removeEventListener('scroll', checkIsInView);
            window.removeEventListener("resize", checkIsInView);

        }
    }

    const fetchPrices = useCallback(async(ids: number[], acceptLanguage?: "fa-IR" | "en-US"|"ar-AE") => {
        setLoading(true);
        const response = await AvailabilityByHotelId({checkin:checkin, checkout:checkout, ids:ids}, acceptLanguage || "fa-IR");

        if (response?.data?.result?.hotels){
            setPricedResponse(response.data.result.hotels);
        }

        setLoading(false);

    }, [checkin, checkout]);

    const hotelsId = useMemo(() => similarHotels?.map(item => item.HotelId!)
        , [similarHotels]);

    useEffect(() => {
        if (isInView && hotelsId?.length) {
            fetchPrices(hotelsId);
        }
    }, [hotelsId, fetchPrices, isInView]);


    useEffect(() => {
        document.addEventListener('scroll', checkIsInView);
        window.addEventListener("resize", checkIsInView);

        return (() => {
            document.removeEventListener('scroll', checkIsInView);
            window.removeEventListener("resize", checkIsInView);
        });
    }, []);


    if (!similarHotels?.length) {
        return null;
    }

    interface Hotels extends DomesticHotelMainType {
        salePriceFrom: number;
        boardPriceFrom?: number;
    }

    const hotels: Hotels[] = similarHotels!.map(hotelItem => {
        const pricedHotel = pricedResponse?.find(pricedItem => pricedItem.id === hotelItem.HotelId);
        return ({
            ...hotelItem,
            salePriceFrom: pricedHotel?.salePrice,
            boardPriceFrom: pricedHotel?.boardPrice
        });

    }).filter(hotel => loading || hotel.salePriceFrom || !isInView) as Hotels[];


    let maxSimilarHotels = 6;

    if (hotels.length < 6) {
        maxSimilarHotels = hotels.length;
    }
    return (

        <div id='similarhotels_section' className="max-w-container mx-auto px-3 sm:px-5 py-7 md:py-10" ref={wrapperRef}>

            <h2 className='text-center text-lg lg:text-3xl font-semibold mb-3' > {tHotel('similar-hotels')} </h2>
            <p className='text-center text-neutral-700 mb-3 md:mb-7' > {tHotel('you-might-be-interested-this-hotels')} </p>

            {(hotels?.length) ? (
                <>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5'>
                        {hotels.slice(0, 3).map(hotel => <SimilarHotelItem searchInfo={searchInfo} nights={nights} loadingPrice={loading || !isInView} hotel={hotel} key={hotel.HotelId} />)}

                        {showAll && hotels.slice(3, maxSimilarHotels).map(hotel => <SimilarHotelItem searchInfo={searchInfo} nights={nights} loadingPrice={loading || !isInView} hotel={hotel} key={hotel.HotelId} />)}
                    </div>
                    {(hotels?.length > 3) && <button
                        type='button'
                        onClick={() => { setShowAll(prevState => !prevState) }}
                        className='h-10 px-5 text-sm border rounded-lg text-primary-700 block border-primary-700 mt-8 hover:bg-primary-100 transition-all mx-auto'
                    >
                        {showAll ? t('close') : tHotel('other-similar-hotels')}
                    </button>}
                </>
            ) : (
                <div className='bg-white p-5 rounded-xl flex gap-2 items-center'>
                    <InfoCircle className='w-5 h-5 fill-current' />
                    {tHotel('no-similar-hotels')}
                </div>
            )}
        </div>

    )
}

export default SimilarHotels;

