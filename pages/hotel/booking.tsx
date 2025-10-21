import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { DomesticHotelConfirm, domesticHotelGetReserveById, getDomesticHotelSummaryDetailById } from '@/modules/domesticHotel/actions';
import { AsideHotelInfoType, AsideReserveInfoType, DomesticHotelConfirmType, DomesticHotelGetReserveByIdData, DomesticHotelSummaryDetail } from '@/modules/domesticHotel/types/hotel';
import { setAlertModal } from '@/modules/shared/store/alertSlice';
import { useAppDispatch } from '@/modules/shared/hooks/use-store';
import { getDatesDiff } from '@/modules/shared/helpers';

import Aside from '@/modules/domesticHotel/components/shared/Aside';
import Steps from '@/modules/shared/components/ui/Steps';
import BookingContent from '@/modules/domesticHotel/components/booking/BookingContent';
import { Hotel } from '@/modules/shared/components/ui/icons';

const Booking: NextPage = () => {

    const { t } = useTranslation('common');
    const { t: tHotel } = useTranslation('hotel');

    const router = useRouter();

    const dispatch = useAppDispatch();

    const pathArray = router.asPath.split("?")[1]?.split("#")[0].split("&");
    const username: string | undefined = pathArray.find(item => item.includes("username="))?.split("username=")[1];
    const reserveId: string | undefined = pathArray.find(item => item.includes("reserveId="))?.split("reserveId=")[1];

    const [domesticHotelReserveData, setDomesticHotelReserveData] = useState<DomesticHotelGetReserveByIdData>();
    const [domesticHotelData, setDomesticHotelData] = useState<DomesticHotelSummaryDetail>();

    const [confirmData, setConfirmData] = useState<DomesticHotelConfirmType>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(true);

    useEffect(() => {

        if (username && reserveId) {
            const fetchDomesticHotelReserve = async () => {
                const response: any = await domesticHotelGetReserveById({ reserveId: reserveId, userName: username });
                if (response.data.result) {
                    setDomesticHotelReserveData(response.data.result)


                    const hotelDataResponse: { data?: { result?: DomesticHotelSummaryDetail } } = await getDomesticHotelSummaryDetailById(response.data.result.accommodationId || response.data.result.accommodation?.id);
                    if (hotelDataResponse?.data?.result) {
                        setDomesticHotelData(hotelDataResponse.data.result);
                    }
                }
            }

            fetchDomesticHotelReserve();

            const confirm = async () => {

                const localStorageTenant = localStorage?.getItem('S-TenantId');

                if (!localStorageTenant) return;

                setConfirmLoading(true);

                const response: any = await DomesticHotelConfirm({ reserveId: reserveId, username: username, tenant: +localStorageTenant }, 'fa-IR');
                if (response.status === 200) {
                    if (response.data.result.isCompleted) {
                        setConfirmData(response.data.result);

                        setConfirmLoading(false);

                    } else {
                        setTimeout(confirm, 4000);
                    }
                } else {
                    setConfirmLoading(false);

                    dispatch(setAlertModal({
                        title: t('error'),
                        message: response?.data?.error?.message,
                        isVisible: true
                    }));

                }
            }

            confirm();
        }

    }, [username, reserveId]);

    let domesticHotelInformation: AsideHotelInfoType | undefined = undefined;
    let domesticHotelReserveInformation: AsideReserveInfoType | undefined = undefined;

    if (domesticHotelData) {
        domesticHotelInformation = {
            image: {
                url: domesticHotelData.picture?.path,
                alt: domesticHotelData.picture?.altAttribute || domesticHotelData.displayName || "",
                title: domesticHotelData.picture?.titleAttribute || domesticHotelData.displayName || ""
            },
            name: domesticHotelData.displayName || domesticHotelData.name || "",
            rating: domesticHotelData.rating,
            address: domesticHotelData.address,
            Url: domesticHotelData.url,
            CityId: domesticHotelData.cityId || domesticHotelData.city?.id
        }
    }
    if (domesticHotelReserveData) {
        domesticHotelReserveInformation = {
            reserveId: domesticHotelReserveData.id,
            checkin: domesticHotelReserveData.checkin,
            checkout: domesticHotelReserveData.checkout,
            duration: getDatesDiff(new Date(domesticHotelReserveData.checkout), new Date(domesticHotelReserveData.checkin)),
            rooms: domesticHotelReserveData.rooms.map(roomItem => ({
                name: roomItem.name,
                board: roomItem.boardCode,
                cancellationPolicyStatus: roomItem.cancellationPolicyStatus,
                bed: roomItem.bed,
                pricing: roomItem.pricing,

            })),
            salePrice: domesticHotelReserveData.rooms.reduce((totalPrice: number, roomItem: any) => {
                const roomItemPrice = roomItem.pricing.find(
                    (item: any) => item.type === "Room" && item.ageCategoryType === "ADL"
                )?.amount;
                if (roomItemPrice) {
                    return totalPrice + +roomItemPrice
                } else {
                    return totalPrice;
                }
            }, 0),
            selectedExtraBedCount: domesticHotelReserveData.rooms.reduce((totalSelectedExtraBeds: number, roomItem: any) => {
                const thisRoomHasExtraBed = roomItem.pricing.find((item: any) => item.type === "ExtraBed" && item.ageCategoryType === "ADL" && item.isSelected);
                if (thisRoomHasExtraBed) {
                    return totalSelectedExtraBeds + 1
                } else {
                    return totalSelectedExtraBeds;
                }
            }, 0),
            selectedExtraBedPrice: domesticHotelReserveData.rooms.reduce((totalPrice: number, roomItem: any) => {
                const roomItemPrice = roomItem.pricing.find(
                    (item: any) => item.type === "ExtraBed" && item.ageCategoryType === "ADL" && item.isSelected
                )?.amount;
                if (roomItemPrice) {
                    return totalPrice + +roomItemPrice
                } else {
                    return totalPrice;
                }
            }, 0),
            boardPrice: domesticHotelReserveData.rooms.reduce((totalPrice: number, roomItem: any) => {
                const roomItemPrice = roomItem.pricing.find(
                    (item: any) => item.type === "RoomBoard" && item.ageCategoryType === "ADL"
                )?.amount;
                if (roomItemPrice) {
                    return totalPrice + +roomItemPrice
                } else {
                    return totalPrice;
                }
            }, 0),
            promoCodePrice: domesticHotelReserveData.rooms.reduce((totalPrice: number, roomItem: any) => {
                const itemPrice = roomItem.pricing.find(
                    (item: any) => item.type === "PromoCode" && item.ageCategoryType === "ADL"
                )?.amount;
                if (itemPrice) {
                    return totalPrice - +itemPrice
                } else {
                    return totalPrice;
                }
            }, 0)
        }
    }

    return (
        <>
            <Head>
                <title> رزرو هتل </title>
            </Head>

            <div
                className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl"
            >
                <Hotel className="w-8 h-8" />
                رزرو هتل
            </div>

            <div className="px-4 md:px-6 py-3">

                <Steps
                    className='py-3 mb-2 max-md:hidden'
                    items={[
                        { label: t('completing-information'), status: 'done' },
                        { label: tHotel('checking-capacity'), status: 'done' },
                        { label: t('confirm-pay'), status: 'done' },
                        { label: t('complete-purchase'), status: 'done' }
                    ]}
                />

                <div className='grid gap-4 md:grid-cols-3'>
                    <div className='md:col-span-2'>
                        <BookingContent
                            confirmLoading={confirmLoading}
                            confirmStatus={confirmData?.reserve.status}
                            reserveId={reserveId}
                            username={username}
                            reserveInfo={domesticHotelReserveData}
                        />
                    </div>
                    <div>

                        <Aside
                            hotelInformation={domesticHotelInformation}
                            reserveInformation={domesticHotelReserveInformation}
                        />

                        {/* <div className='bg-white border border-neutral-300 rounded-md mb-4 p-4'>
                            {domesticHotelInformation ? (
                                <>
                                    <h5 className='font-semibold leading-6 mb-3 border-b text-sm'>
                                        {tPayment('need-help')}
                                    </h5>
                                    <p className='block mb-3'>{tPayment('24hours-backup')}</p>
                                </>
                            ) : (
                                <>
                                    <Skeleton className='mb-3 w-1/3' />
                                    <Skeleton className='mb- w-2/3' />
                                </>
                            )}
                        </div> */}

                        {/* <div className='bg-white p-4 border border-neutral-300 rounded-md mb-4 border-t-2 border-t-orange-400'>
                            {domesticHotelInformation ? (
                                <>
                                    <h5 className='font-semibold text-orange-400 mb-2 leading-6'>
                                        {t('price-will-increase')}
                                    </h5>
                                    <p className='text-2xs'>
                                        {t('price-will-increase-desc')}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Skeleton className='mb-3 w-1/3' />
                                    <Skeleton className='mb- w-2/3' />
                                </>
                            )}

                        </div> */}

                    </div>
                </div>
            </div>

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

export default Booking;