import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { useAppDispatch } from '@/modules/shared/hooks/use-store';
import { confirmFlight, flightGetReserveById } from '@/modules/flights/actions';
import { DomesticFlightGetReserveByIdType, FlightConfirmStatus } from '@/modules/flights/types/flights';

import Steps from '@/modules/shared/components/ui/Steps';
import Aside from '@/modules/flights/components/shared/Aside';
import BookingContent from '@/modules/flights/components/booking/BookingContent';
import { setAlertModal } from '@/modules/shared/store/alertSlice';

const Booking: NextPage = () => {

    const { t } = useTranslation('common');
    
    const router = useRouter();

    const dispatch = useAppDispatch();

    const pathArray = router.asPath.split("?")[1]?.split("#")[0].split("&");
    const username: string | undefined = pathArray.find(item => item.includes("username="))?.split("username=")[1];
    const reserveId: string | undefined = pathArray.find(item => item.includes("reserveId="))?.split("reserveId=")[1];

    const [confirmStatus, setConfirmStatus] = useState<FlightConfirmStatus>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(true);

    const [domesticFlightReserveInfo, setDomesticFlightReserveInfo] = useState<DomesticFlightGetReserveByIdType>();
    const [domesticFlightReserveInfoLoading, setDomesticFlightReserveInfoLoading] = useState<boolean>(true);

    useEffect(() => {

        if (username && reserveId) {

            const token = localStorage.getItem('Token') || "";

            const fetchDomesticFlightData = async (reserveId: string, userName: string) => {

                setDomesticFlightReserveInfoLoading(true);

                const respone: any = await flightGetReserveById({ reserveId: reserveId, userName: userName, token: token });

                setDomesticFlightReserveInfoLoading(false);

                if (respone?.data?.result) {
                    setDomesticFlightReserveInfo(respone.data.result);
                }
            };

            fetchDomesticFlightData(reserveId, username);


            const confirm = async () => {

                setConfirmLoading(true);

                const response: any = await confirmFlight({ reserveId: reserveId, userName: username, token: token }, 'fa-IR');
                if (response?.status === 200) {
                    if (response.data?.result?.isCompleted) {
                        setConfirmStatus(response.data?.result?.reserve?.status);

                        setConfirmLoading(false);

                    } else {
                        setTimeout(confirm, 4000);
                    }
                } else {
                    setConfirmLoading(false);

                    dispatch(setAlertModal({
                        title: t('error'),
                        message: response.data.error.message,
                        isVisible: true
                    }));

                }
            }

            confirm();

        }

    }, [username, reserveId]);


    let domesticFlightPassengers: {
        type: "ADT" | "CHD" | "INF";
        label: string;
        count: number;
        departurePrice: number;
        returnPrice?: number;
    }[] = [];
    if (domesticFlightReserveInfo) {
        if (domesticFlightReserveInfo?.adultCount) {
            domesticFlightPassengers.push({
                type: "ADT",
                label: t('adult'),
                count: domesticFlightReserveInfo.adultCount,
                departurePrice: domesticFlightReserveInfo.departureFlight.adultPrice,
                returnPrice: domesticFlightReserveInfo.returnFlight?.adultPrice
            });
        }
        if (domesticFlightReserveInfo?.childCount) {
            domesticFlightPassengers.push({
                type: "CHD",
                label: t('child'),
                count: domesticFlightReserveInfo.childCount,
                departurePrice: domesticFlightReserveInfo.departureFlight.childPrice,
                returnPrice: domesticFlightReserveInfo.returnFlight?.childPrice
            });
        }
        if (domesticFlightReserveInfo?.infantCount) {
            domesticFlightPassengers.push({
                type: "INF",
                label: t('infant'),
                count: domesticFlightReserveInfo.infantCount,
                departurePrice: domesticFlightReserveInfo.departureFlight.infantPrice,
                returnPrice: domesticFlightReserveInfo.returnFlight?.infantPrice
            });
        }
    }

    return (
        <>
            <Head>
                <title>{t('reserve-page')}</title>
            </Head>

            <div className='max-w-container mx-auto px-3 sm:px-5 py-4'>

                <Steps
                    className='py-3 mb-2 max-md:hidden'
                    items={[
                        { label: t('completing-information'), status: 'done' },
                        { label: t('confirm-pay'), status: 'done' },
                        { label: t('complete-purchase'), status: 'done' }
                    ]}
                />

                <div className='grid gap-4 md:grid-cols-3'>
                    <div className='md:col-span-2'>
                        {!!reserveId && !!username && (
                            <BookingContent
                                reserveId={reserveId}
                                username={username}
                                confirmLoading={confirmLoading}
                                reserveDataLoading={domesticFlightReserveInfoLoading}
                                reserver={{
                                    firstName: domesticFlightReserveInfo?.reserver.firstName || "",
                                    lastName: domesticFlightReserveInfo?.reserver.lastName || ""
                                }}
                                confirmStatus={confirmStatus}
                                summary={
                                    <Aside
                                        loading={domesticFlightReserveInfoLoading}
                                        departureFlight={domesticFlightReserveInfo?.departureFlight}
                                        passengers={domesticFlightPassengers}
                                        returnFlight={domesticFlightReserveInfo?.returnFlight}
                                        onWhiteBackground
                                    />
                                }
                            />
                        )}
                    </div>
                    <div className='max-sm:hidden'>

                        <Aside
                            loading={domesticFlightReserveInfoLoading}
                            departureFlight={domesticFlightReserveInfo?.departureFlight}
                            passengers={domesticFlightPassengers}
                            returnFlight={domesticFlightReserveInfo?.returnFlight}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    return ({
        props: {
            ...await (serverSideTranslations(context.locale, ['common', 'flight', 'payment']))
        },
    })
}

export default Booking;