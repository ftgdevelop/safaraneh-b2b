import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { numberWithCommas } from '../../helpers';
import Leaflet from 'leaflet'
import Rating from './Rating';
import { useTranslation } from 'next-i18next';
import Skeleton from './Skeleton';
import Image from 'next/image';
import Button from './Button';
import { ErrorIcon } from './icons';

type HotelItem = {
    id?: number;
    latitude?: number;
    longitude?: number;
    name: string;
    rating?: number;
    url: string;
    imageUrl?: string;
    guestRate?: "loading" | { Satisfaction: number; TotalRowCount: number; };
    price: "loading" | "notPriced" | "need-to-inquire" | { boardPrice: number; salePrice: number; };
} 
type Props = {
    hoveredHotelId?: number;
    clickedHotelId?: number;
    onClickHotel?: (hotelId?: number) => void;
    onHoverHotel?: (hotelId?: number) => void;
    className?: string;
    location: [number, number];
    zoom?: number;
    hotels?: HotelItem[];
}


function SetView({ coords, zoom }: { coords: [number, number], zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.setView(coords, zoom);
    }, [coords[0], coords[1], zoom])

    return null;
}


const LeafletMap: React.FC<Props> = props => {

    const theme2 = process.env.THEME === "THEME2";
    
    const { t } = useTranslation('common');
    const { t: tHotel } = useTranslation('hotel');

    const { hotels } = props;

    const [isMounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    let centerPosition = props.location;
    let zoom = props.zoom || 14;

    if (hotels?.length) {
        const latitudes: number[] = hotels.filter(hotel => hotel.latitude).map(hotel => hotel.latitude!);
        const longitudes: number[] = hotels.filter(hotel => hotel.longitude).map(hotel => hotel.longitude!);

        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLong = Math.min(...longitudes);
        const maxLong = Math.max(...longitudes);

        centerPosition = [(minLat + maxLat) / 2, (minLong + maxLong) / 2];

        const latdif = maxLat - minLat;
        const longdif = maxLong - minLong;
        zoom = 15;
        if ((latdif > .03) || longdif > .08) {
            zoom = 13;
        }
        if ((latdif > .1) || longdif > .1) {
            zoom = 11;
        }
    }

    if (!isMounted || !centerPosition) {
        return "";
    }

    const customMarkerElement = (item: HotelItem) => {

        let price = null;
        let colorClass = 'bg-green-800';
        if (item.price === 'loading') {
            price = <Skeleton />;
        } else if (item.price === 'need-to-inquire') {
            price = 'قیمت نیازمند استعلام است';
            colorClass = 'bg-amber-500'
        } else if (item.price === 'notPriced') {
            colorClass = 'bg-red-600';
            price = tHotel('There-is-no-price-for-this-hotel') + "!"
        } else {
            price = numberWithCommas(item.price.salePrice) + " " + t('rial')
        }

        let rate = null;
        if (!item.guestRate || item.guestRate === 'loading') {
            rate = null;
        } else {
            const score = item.guestRate.Satisfaction;

            let title = '';

            if (score >= 90) {
                title = tHotel("excellent");
            } else if (score >= 80) {
                title = tHotel("very-good");
            } else if (score >= 70) {
                title = tHotel("good");
            } else if (score >= 50) {
                title = tHotel("fair");
            } else {
                title = tHotel("bad");
            }

            rate = (<>
                <span className="text-base font-semibold"> {score} از 100  </span> {title} ({item.guestRate.TotalRowCount} {tHotel("guest-reviews")})                 </>)
        }

        const iconHTML = ReactDOMServer.renderToString(<div>

            <div
                className={`${colorClass} text-white px-2 py-0 rounded border-2 border-white shadow w-auto text-sm ${theme2?"rtl:font-iranyekan":"rtl:font-samim"}`}
            >
                <div
                    className='font-semibold whitespace-nowrap'
                >
                    {price}

                </div>

                {item.id === props.hoveredHotelId && (
                    <div className='absolute bottom-full left-1/2 -translate-x-1/2 w-72 pb-2 before:absolute before:h-2 before:w-3 before:bg-white before:block before:bottom-0 before:left-1/2 before:-ml-1.5 before:clipCarret'>
                        <div className='shadow-md text-neutral-700 grid grid-cols-3'>

                            {!!item.imageUrl && <Image src={item.imageUrl} alt={item.name} width={96} height={64} className='w-full h-full object-cover bg-neutral-400' />}

                            <div className='bg-white col-span-2 p-2'>
                                <h5 className='font-semibold'> {item.name} </h5>
                                {!!item.rating && <Rating number={item.rating} />}
                                {rate}
                            </div>
                        </div>

                    </div>
                )}

                {item.id === props.clickedHotelId && (
                    <div className='absolute bottom-full left-1/2 -translate-x-1/2 w-72 pb-2 before:absolute before:h-2 before:w-3 before:bg-white before:block before:bottom-0 before:left-1/2 before:-ml-1.5 before:clipCarret shadow-md text-neutral-700 bg-white'>
                        {!!item.imageUrl && <Image src={item.imageUrl} alt={item.name} width={288} height={176} className='w-full h-44 object-cover bg-neutral-400' />}
                        <div className='bg-white p-2'>
                            <div className='flex gap-2 items-center mb-1'>
                                <h5 className='font-semibold text-base'> {item.name} </h5>
                                {!!item.rating && <Rating number={item.rating} />}
                            </div>

                            {rate}

                            <div className='flex justify-between items-center'>
                                {price}

                                <Button
                                    href={item.url}
                                    target='_blank'
                                    className='h-8 px-3'
                                >
                                    {tHotel('see-rooms')}
                                </Button>

                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>)
        const customMarkerIcon = new Leaflet.DivIcon({
            html: iconHTML,
        });
        return (customMarkerIcon);
    }

    if (hotels && !hotels.length) {
        return (
            <div className='flex flex-col items-center justify-center h-full w-full text-red-500 font-semibold'>
                <ErrorIcon className='block w-14 h-14 mx-auto mb-2 fill-current' />
                هتلی یافت نشد. لطفا فیلتر ها را تغییر دهید
            </div>
        )
    }


    return (

        <MapContainer

            className={props.className}
            center={centerPosition}
            zoom={zoom}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <SetView coords={centerPosition} zoom={zoom} />


            {hotels ? hotels.filter(hotel => (hotel.latitude && hotel.longitude)).map(hotel => (
                <Marker
                    eventHandlers={{
                        click: () => {
                            props.onClickHotel ? props.onClickHotel(hotel.id!) : undefined
                        },
                        mouseover: () => {
                            props.onHoverHotel ? props.onHoverHotel(hotel.id!) : undefined
                        },
                        mouseout: () => {
                            props.onHoverHotel ? props.onHoverHotel() : undefined
                        }
                    }}
                    key={hotel.id}
                    position={[hotel.latitude!, hotel.longitude!]}
                    icon={customMarkerElement(hotel)}
                />
            )) : (
                <Marker position={centerPosition} />
            )}

        </MapContainer>

    )
};

export default LeafletMap;