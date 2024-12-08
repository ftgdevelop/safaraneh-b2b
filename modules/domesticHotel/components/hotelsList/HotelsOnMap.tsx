import dynamic from 'next/dynamic';
import { Close, Filter, List } from "@/modules/shared/components/ui/icons";
import ModalPortal from '@/modules/shared/components/ui/ModalPortal';
import { useEffect, useState } from 'react';
import SimpleHotelListItem from './SimpleHotelListItem';
import Button from '@/modules/shared/components/ui/Button';
import { SortTypes } from '../../types/hotel';
import Select from '@/modules/shared/components/ui/Select';
import { useTranslation } from 'next-i18next';
import HotelFilters from './sidebar/HotelFilters';

const LeafletNoSsr = dynamic(() => import('../../../shared/components/ui/LeafletMap'), {
    ssr: false
});

type Props = {
    sortBy: SortTypes;
    setSort: (sort: SortTypes) => void;
    fallbackLocation?: [number, number];
    hotels: {
        id?: number;
        latitude?: number;
        longitude?: number;
        name: string;
        rating?: number;
        url: string;
        imageUrl?: string;
        price: "loading" | "notPriced" | "need-to-inquire" | { boardPrice: number; salePrice: number; };
        scoreInfo?: "loading" | {averageRating: number, reviewCount: number };
    }[];
    closeMapModal: () => void;
    allHotelsLength: number;
    priceIsFetched: boolean;
}

const HotelsOnMap: React.FC<Props> = props => {

    const { t } = useTranslation('common');
    const { t: tHotel } = useTranslation('hotel');

    const [show, setShow] = useState<boolean>(false);

    const [filterMode, setFilterMode] = useState<boolean>(false);

    const [hoveredMarkerId, setHoveredMarkerId] = useState<number>();
    const [clickedMarkerId, setClickedMarkerId] = useState<number>();

    useEffect(() => {
        setTimeout(() => { setShow(true) }, 100)
        return (() => {
            () => { setShow(false) }
        });
    }, []);

    const { hotels, closeMapModal } = props;

    return (
        <ModalPortal
            show={show}
            selector='modal_portal'
        >
            <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center' >
                <div
                    className='bg-black/75 absolute top-0 left-0 w-full h-full z-10'
                    onClick={closeMapModal}
                />

                <button type='button' onClick={closeMapModal} className='absolute top-2 left-2 z-30 lg:hidden' aria-label='close map'>
                    <Close className='w-10 h-10 fill-neutral-400' />
                </button>

                <div className='bg-white p-2 pt-14 sm:p-5 sm:rounded-lg w-full h-full sm:h-5/6 sm:w-5/6 lg:w-full lg:h-full lg:rounded-none relative z-20 lg:grid grid-cols-3 xl:grid-cols-4'>
                    
                    <div className='h-full w-full lg:col-span-2 xl:col-span-3 bg-neutral-300'>
                        {!!props.fallbackLocation && <LeafletNoSsr
                            className='h-full w-full rounded-xl hotelListMap'
                            zoom={15}
                            hotels={hotels}
                            location={props.fallbackLocation}
                            clickedHotelId={clickedMarkerId}
                            hoveredHotelId={hoveredMarkerId}
                            onClickHotel={setClickedMarkerId}
                            onHoverHotel={setHoveredMarkerId}
                        />}
                    </div>

                    <div className='max-lg:hidden'>
                        <div className='mb-5'>
                            <Button color='green' type='button' onClick={closeMapModal} className='mx-auto px-5 h-10' aria-label='close map'>
                                بستن نقشه <small> (Esc) </small> <Close className='w-5 h-5 fill-current' />
                            </Button>
                        </div>

                        <div className='grid grid-cols-2 gap-4 p-4'>
                            <Select
                                items={[
                                    { value: "priority", label: tHotel("priority") },
                                    { value: "price", label: tHotel("lowest-price") },
                                    { value: "starRate", label: tHotel("highest-star-rating") },
                                    { value: "name", label: tHotel("hotel-name") },
                                    { value: "gueatRate", label: tHotel("highest-guest-rating") }
                                ]}
                                value={props.sortBy}
                                onChange={type => { props.setSort(type as SortTypes) }}
                                label={t('sortBy')}
                                wrapperClassName='max-sm:grow sm:full'

                            />

                            {filterMode ? (
                                <button
                                    type='button'
                                    className='flex justify-center items-center gap-3 border border-neutral-400 rounded'
                                    onClick={() => { setFilterMode(false) }}
                                >
                                    لیست هتل ها <List className='w-5 h-5 fill-current' />
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='flex justify-center items-center gap-3 border border-neutral-400 rounded'
                                    onClick={() => { setFilterMode(true) }}
                                >
                                    {t('filter')} <Filter className='w-5 h-5 fill-current' />
                                </button>
                            )}

                        </div>

                        {filterMode ? (
                            <div className='hotels-map-sidebar-height overflow-auto'>

                                <HotelFilters
                                    allHotels={props.allHotelsLength}
                                    filteredHotels={props.hotels.length}
                                    priceIsFetched={props.priceIsFetched}
                                />
                            </div>
                        ) : (
                            <div className='hotels-map-sidebar-height overflow-auto p-5'>
                                {hotels.map(hotel => <SimpleHotelListItem
                                    id={hotel.id!}
                                    key={hotel.url}
                                    name={hotel.name}
                                    priceInfo={hotel.price}
                                    url={hotel.url}
                                    imageUrl={hotel.imageUrl}
                                    rating={hotel.rating}
                                    scoreInfo={hotel.scoreInfo}
                                    onHoverHotel={setHoveredMarkerId}
                                />)}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </ModalPortal>

    )
}

export default HotelsOnMap;