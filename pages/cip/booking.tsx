import { CipConfirm, CipGetReserveById } from "@/modules/cip/actions";
import CipBookingContent from "@/modules/cip/components/booking/CipBookingContent";
import CipAside from "@/modules/cip/components/shared/CipAside";
import { CipGetReserveByIdResponse } from "@/modules/cip/types/cip";
import Steps from "@/modules/shared/components/ui/Steps";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { setAlertModal } from "@/modules/shared/store/alertSlice";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Booking: NextPage = () => {

    const { t } = useTranslation('common');


    const dispatch = useAppDispatch();

    const router = useRouter();

    const pathArray = router.asPath.split("?")[1]?.split("#")[0].split("&");
    const username = pathArray.find(item => item.includes("username="))?.split("username=")[1];
    const reserveId = pathArray.find(item => item.includes("reserveId="))?.split("reserveId=")[1];

    const [cipReserveInfo, setCipReserveInfo] = useState<CipGetReserveByIdResponse>();
    const [cipReserveInfoLoading, setCipReserveInfoLoading] = useState<boolean>(true);

    const [confirmStatus, setConfirmStatus] = useState<any>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(true);

    useEffect(() => {

        const fetchCipData = async (reserve_id: string, user_name: string) => {

            setCipReserveInfoLoading(true);

            const respone: any = await CipGetReserveById({ reserveId: reserve_id, userName: user_name });

            setCipReserveInfoLoading(false);

            if (respone?.data?.result) {
                setCipReserveInfo(respone.data.result);
            }
        };

        if (reserveId && username) {
            fetchCipData(reserveId, username);
        }


        const confirm = async (reserve_id: string, user_name: string) => {

            setConfirmLoading(true);

            const response: any = await CipConfirm({ reserveId: reserve_id, username: user_name }, 'fa-IR');
            if (response.status === 200) {

                if (response.data?.result?.isCompleted) {
                    setConfirmStatus(response.data.result.reserve?.status);
                    setConfirmLoading(false);
                } else {
                    setTimeout(() => { confirm(reserve_id, user_name) }, 4000);
                }
            } else {
                setConfirmLoading(false);

                dispatch(setAlertModal({
                    status: 'error',
                    title: t('error'),
                    message: response.data?.error?.message || "متاسفانه مشکلی پیش آمده!",
                    isVisible: true
                }));

            }
        }

        if (reserveId && username) {
            confirm(reserveId, username);
        }

    }, [reserveId, username]);

    return (
        <>
            <Head>
                <title>{t('reserve-page')}</title>
            </Head>

            <div className='max-w-container mx-auto px-5 py-4'>

                <Steps
                    className='py-3 mb-4 max-md:hidden'
                    items={[
                        { label: t('bank-gateway-page'), status: 'done' },
                        { label: t('confirm-pay'), status: 'done' },
                        { label: t('complete-purchase'), status: 'active' }
                    ]}
                />

                <div className='grid gap-4 md:grid-cols-3'>
                    <div className='md:col-span-2'>
                        <CipBookingContent
                            confirmLoading={confirmLoading}
                            confirmStatus={confirmStatus}
                            reserveInfo={cipReserveInfo}
                        />
                    </div>
                    <div>
                        <CipAside
                            loading={cipReserveInfoLoading}
                            reserveInfo={cipReserveInfo}
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
            ...await (serverSideTranslations(context.locale, ['common', 'hotel', 'payment']))
        },
    })
}

export default Booking;