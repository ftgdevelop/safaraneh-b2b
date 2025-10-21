import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Image from 'next/image';

import { domesticHotelGetReserveById, getDomesticHotelSummaryDetailById } from '@/modules/domesticHotel/actions';
import { DomesticHotelGetReserveByIdData, DomesticHotelSummaryDetail } from '@/modules/domesticHotel/types/hotel';
import { dateDiplayFormat, getDatesDiff, numberWithCommas } from '@/modules/shared/helpers';

import { Bed, Calendar, DefaultRoom, Directions, Hotel, Location, Lock, RightCaret, Tik, User } from '@/modules/shared/components/ui/icons';

import Skeleton from '@/modules/shared/components/ui/Skeleton';
import Tag from '@/modules/shared/components/ui/Tag';
import DownloadPdfVoucher from '@/modules/domesticHotel/components/booking/DownloadPdfVoucher';
import Rating from '@/modules/shared/components/ui/Rating';
import HotelMap from '@/modules/domesticHotel/components/hotelDetails/HotelMap';
import Head from 'next/head';
import { flightGetTenantReserveById } from '@/modules/flights/actions';

const DomesticHotelReserveDetail: NextPage = () => {

    const { t } = useTranslation('common');
    const { t: tHotel } = useTranslation('hotel');
    const { t: tPayment } = useTranslation('payment');

    const router = useRouter();

    const pathArray = router.asPath.split("?")[1]?.split("#")[0].split("&");
    const username: string | undefined = pathArray.find(item => item.includes("username="))?.split("username=")[1];
    const reserveId: string | undefined = pathArray.find(item => item.includes("reserveId="))?.split("reserveId=")[1];

    const [reserveNotFound, setReserveNotFound] = useState<boolean>(false);
    const [reserveData, setReserveData] = useState<DomesticHotelGetReserveByIdData>();
    const [hotelData, setHotelData] = useState<DomesticHotelSummaryDetail>();

    const [showMap, setShowMap] = useState<boolean>(false);

    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {

        if (username && reserveId) {
            
            const localStorageToken = localStorage.getItem('Token');
            
            const fetchDomesticHotelReserve = async () => {
                
                const response: any = await flightGetTenantReserveById({ userName:username, reserveId: reserveId, token:localStorageToken || "" });
                
                debugger;

                // if (response.data.result) {
                //     setReserveData(response.data.result)

                //     const hotelDataResponse: { data?: { result?: DomesticHotelSummaryDetail } } = await getDomesticHotelSummaryDetailById(response.data.result.accommodationId || response.data.result.accommodation?.id);
                //     if (hotelDataResponse.data?.result) {
                //         setHotelData(hotelDataResponse.data.result);
                //     }
                // } else {
                //     setReserveNotFound(true);
                // }
            }

            fetchDomesticHotelReserve();

        }

    }, [username, reserveId]);


    let guests: number = 0;
    let price: number = 0;

    if (reserveData?.rooms) {
        guests = reserveData.rooms.reduce((sum, room) => (sum + room.bed), 0);
        price = reserveData.rooms.reduce((sum, room) => {
            const roomPrice = room.pricing?.find(x => x.ageCategoryType === "ADL" && x.type === "Room")?.amount || 0;
            return ((sum + roomPrice))
        }, 0);
    }

    let status = null;

    let paymentLink = null;

    if (reserveData) {

        let StatusColor = null;
        switch (reserveData.status) {

            case "Pending":
            case "Registered":
            case "OnCredit":
            case "InProgress":
                StatusColor = "bg-[#52c41a] text-white";
                break;
            case "Unavailable":
            case "Voided":
                StatusColor = "bg-[#e7412a] text-white";
                break;

            case "Canceled":
            case "PaymentSuccessful":
            case "WebServiceUnsuccessful":
                StatusColor = "bg-[#ffb6ab] text-red-800";
                break;

            case "Issued":
            case 'ContactProvider':
                StatusColor = "bg-[#1dac08] text-white";
                break;

            default:
                StatusColor = "bg-[#dddddd]";

        };

        status = <Tag className={`${StatusColor} leading-8 rounded-b-xl absolute top-0 left-5 -mt-1`} > {tPayment(`${reserveData.status}`)} ({reserveData.status}) </Tag>;

        paymentLink = (
            <Link
                href={`/payment?username=${reserveData.username}&reserveId=${reserveData.id}`}
                className='bg-[#1dac08] text-white flex items-center gap-2 justify-center rounded-xl px-3 h-12'
            >
                <Lock className='w-5 h-5 fill-current' />
                <span>{tPayment("pay-rial", { number: numberWithCommas(price) })}</span>
            </Link>
        );

        if (
            reserveData.status === "Canceled"
            || reserveData.status === "Issued"
            || reserveData.status === "ContactProvider"
            || reserveData.status === "Registered"
            || reserveData.status === "Unavailable"
            || reserveData.status === "PaymentSuccessful"
            || reserveData.status === "WebServiceUnsuccessful"
            || reserveData.status === "Voided"
        ) {
            paymentLink = null;
        }

    }

    return (
        <>
            <Head>
                <title> جزییات رزرو </title>
            </Head>
            <div className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl">
                <Hotel className="w-8 h-8" />
                جزییات رزرو {reserveId && <> شماره {reserveId} </>}
            </div>
            <section className="p-4 md:p-6">
                {reserveNotFound ? (
                    <div className='p-5'>
                        <p className='text-justify mb-4 text-sm'>
                            متاسفانه دریافت اطلاعات این رزرو با خطا روبرو شد. لطفا برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.
                        </p>

                        <div className='border border-neutral-300 px-4 py-2 mb-4 flex items-center justify-between sm:w-96 mx-auto text-sm'>
                            <div>
                                کد پیگیری
                                <div className='font-semibold'>
                                    {reserveId}
                                </div>
                                <p className='text-2xs text-neutral-500'>
                                    هنگام صحبت با پشتیبانی از این کد استفاده کنید
                                </p>

                            </div>

                            <button
                                type='button'
                                className={`text-xs outline-none border-none ${copied ? "text-green-600" : "text-blue-600"}`}
                                onClick={() => {
                                    if (reserveId) {
                                        navigator.clipboard.writeText(reserveId);
                                        setCopied(true);
                                    }
                                }}
                            >
                                {copied ? (
                                    <>
                                        <Tik className='w-4 h-4 fill-current inline-block align-middle' /> کپی شد
                                    </>
                                ) : "کپی کن"}

                            </button>
                        </div>

                    </div>
                ) : (reserveData && hotelData) ? (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                        <div className='md:col-span-3'>
                            <Link
                                href="/hotel/reserveList"
                                className='text-sm outline-none'
                            >
                                <RightCaret className='w-5 h-5 fill-current inline-block' />
                                بازگشت به لیست رزروها

                            </Link>
                        </div>

                        <div>
                            <div className='border border-neutral-300 bg-white rounded-xl'>
                                {hotelData.picture?.path ? (
                                    <Image
                                        src={hotelData.picture.path}
                                        alt={hotelData.picture.altAttribute || hotelData.picture.titleAttribute || hotelData.displayName || ""}
                                        className='w-full rounded-t-xl'
                                        width={766}
                                        height={176}
                                        onContextMenu={(e) => e.preventDefault()}
                                    />
                                ) : (
                                    <div
                                        className="p-5 flex items-center justify-center rounded-t-xl border-b"
                                    >
                                        <DefaultRoom className="fill-neutral-300 w-20 h-20" />
                                    </div>
                                )}
                                <div className='p-4'>
                                    <h2 className='font-semibold text-lg mb-1 inline-block'> {hotelData.displayName} </h2>

                                    {hotelData.rating && <div className='inline-block mx-2'> <Rating number={hotelData.rating} /> </div>}

                                    <div className='flex gap-1 items-center mt-3'>
                                        <Calendar className='w-5 h-5 fill-current inline-block ml-2' />
                                        {dateDiplayFormat({ date: reserveData.checkin, format: 'dd mm yyyy', locale: "fa" })} - {dateDiplayFormat({ date: reserveData.checkout, format: 'dd mm yyyy', locale: "fa" })}
                                    </div>

                                    <p className='mb-3 text-sm mt-2'>
                                        <Location className='w-5 h-5 fill-current inline-block ml-2' />
                                        {hotelData.address}
                                    </p>

                                    <div className='flex flex-col md:flex-row gap-y-1 gap-x-10 text-xs text-blue-800 font-semibold md:items-center'>
                                        {hotelData.coordinates.latitude && hotelData.coordinates.longitude &&
                                            <div className='flex gap-2 items-center'>

                                                <Directions className='w-5 h-5 fill-current block' />

                                                <button type='button'
                                                    onClick={() => { setShowMap(true) }}
                                                >
                                                    هتل روی نقشه
                                                </button>
                                                {!!(showMap && hotelData.coordinates?.latitude && hotelData.coordinates?.longitude) && <HotelMap
                                                    closeMapModal={() => { setShowMap(false) }}
                                                    latLong={[hotelData.coordinates.latitude, hotelData.coordinates.longitude]}
                                                />}
                                            </div>
                                        }

                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className='md:col-span-2'>
                            <div className='bg-white border p-5 rounded-xl relative mb-5'>
                                <div className='flex justify-between items-start'>

                                    <div className='flex items-center gap-5 mb-1 text-lg font-semibold' >
                                        کد پیگیری
                                        <span>
                                            {reserveId}
                                        </span>
                                    </div>

                                    <div className='flex flex-col justify-end items-end gap-4 mb-4 pt-6'>
                                        {status}

                                        {paymentLink}

                                        {!!((reserveData.status === 'Issued' || reserveData.status === 'ContactProvider') && reserveId && username) && (
                                            <DownloadPdfVoucher
                                                reserveId={reserveId}
                                                username={username}
                                                className="bg-primary-700 hover:bg-primary-800 text-white px-5 flex gap-2 items-center justify-center rounded-xl transition-all h-12 disabled:bg-neutral-500 disabled:cursor-not-allowed"
                                            />
                                        )}
                                    </div>

                                </div>

                                {reserveData && <div className='mb-5'>

                                    <div className='flex gap-3 items-center mb-1 text-sm' >
                                        تعداد شب :
                                        <span>
                                            {getDatesDiff(new Date(reserveData.checkout), new Date(reserveData?.checkin))} {tHotel("night")}
                                        </span>
                                    </div>

                                    <div className='flex gap-3 items-center mb-1 text-sm' >
                                        {t("checkin-date")} :
                                        <span>
                                            {dateDiplayFormat({ date: reserveData.checkin, format: 'dd mm yyyy', locale: "fa" })}
                                        </span>
                                    </div>

                                    <div className='flex gap-3 items-center mb-1 text-sm'>
                                        {t("checkout-date")} :
                                        <span>
                                            {dateDiplayFormat({ date: reserveData.checkout, format: 'dd mm yyyy', locale: "fa" })}
                                        </span>
                                    </div>

                                    <br />

                                    <div className='mb-2 font-semibold'> اطلاعات رزرو کننده</div>

                                    <div className='flex gap-3 items-center mb-1 text-sm'>
                                        نام :
                                        <span>{reserveData.reserver?.firstName} {reserveData.reserver?.lastName}</span>
                                    </div>

                                    <div className='flex gap-3 items-center mb-1 text-sm'>
                                        تلفن :
                                        <span className='inline-block' dir="ltr" >{reserveData.reserver?.phoneNumber || "--"}</span>
                                    </div>

                                    <div className='flex gap-3 items-center mb-1 text-sm'>
                                        ایمیل :
                                        <span className='inline-block' dir="ltr">{reserveData.reserver?.email || "--"}</span>
                                    </div>

                                </div>}

                                <div className='mb-2 font-semibold'> جزییات اتاق های رزرو شده </div>
                                {reserveData?.rooms.map((roomItem, index) => (
                                    <div key={index} className='border border-neutral-300 p-5 mb-4 rounded-md sm:flex justify-between gap-5 text-sm'>

                                        <div>
                                            <div className='flex items-center gap-2'>
                                                <Bed className='w-5 h-5 fill-current' />
                                                <span>{roomItem.name}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <User className='w-5 h-5 fill-current' />
                                                <span>{roomItem.bed} {t('adult')}</span>
                                            </div>
                                        </div>

                                        <div>
                                            {roomItem.passengers?.map((passengerItem, passengerIndex) => (
                                                <div key={passengerIndex}>
                                                    {passengerItem.firstName} {passengerItem.lastName}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>


                            <div className='bg-white rounded-xl border border-neutral-300 px-4 py-2 mb-4 flex items-center justify-between text-sm'>
                                <div>
                                    کد پیگیری
                                    <div className='font-semibold'>
                                        {reserveId}
                                    </div>
                                    <p className='text-2xs text-neutral-500'>
                                        هنگام صحبت با پشتیبانی از این کد استفاده کنید
                                    </p>

                                </div>

                                <button
                                    type='button'
                                    className={`text-xs outline-none border-none ${copied ? "text-green-600" : "text-blue-600"}`}
                                    onClick={() => {
                                        if (reserveId) {
                                            navigator.clipboard.writeText(reserveId);
                                            setCopied(true);
                                        }
                                    }}
                                >
                                    {copied ? (
                                        <>
                                            <Tik className='w-4 h-4 fill-current inline-block align-middle' /> کپی شد
                                        </>
                                    ) : "کپی کن"}

                                </button>

                            </div>
                        </div>

                    </div>
                ) : (
                    <>
                        <Skeleton className='w-32 mb-4' />
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                            <div>
                                <div className='bg-white border rounded-xl'>
                                    <Skeleton
                                        type='image'
                                        className='h-44 w-full rounded-t-xl'
                                    />
                                    <div className='p-5'>
                                        <Skeleton className='w-24 mb-4' />
                                        <Skeleton className='w-1/3 mb-4' />
                                        <Skeleton className='w-24 mb-4' />
                                        <Skeleton className='w-2/3' />
                                    </div>
                                </div>
                            </div>
                            <div className='md:col-span-2'>
                                <div className='bg-white border rounded-xl p-5 mb-5'>
                                    <Skeleton className='w-24 mb-10' />

                                    <Skeleton className='w-36 mb-4' />
                                    <Skeleton className='w-1/3 mb-4' />
                                    <Skeleton className='w-2/3' />
                                    <br />
                                    <Skeleton className='w-24 mb-4' />
                                    <Skeleton className='w-1/3 mb-4' />
                                    <Skeleton className='w-2/3' />

                                    <br />

                                    <Skeleton className='w-24 mb-4' />
                                    <Skeleton className='w-1/3 mb-4' />
                                </div>

                                <div className='bg-white border rounded-xl p-5'>
                                    <Skeleton className='w-1/3 mb-4' />
                                    <Skeleton className='w-2/3' />
                                    <br />
                                    <Skeleton className='w-2/3' />
                                </div>

                            </div>
                        </div>

                    </>
                )}

            </section>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    return ({
        props: {
            ...await (serverSideTranslations(context.locale, ['common', 'hotel', 'payment']))
        },
    })
}

export default DomesticHotelReserveDetail;