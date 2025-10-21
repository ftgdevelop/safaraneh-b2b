import { useTranslation } from "next-i18next";
import { useEffect, useState } from 'react';

import { Close, ErrorIcon, Tik, User } from "@/modules/shared/components/ui/icons";
import Loading from "@/modules/shared/components/ui/Loading";
import { FlightConfirmStatus } from "../../types/flights";
import DownloadPdfVoucher from "./DownloadPdfVoucher";

type Props = {
    confirmStatus?: FlightConfirmStatus;
    summary?: React.ReactNode;
    username: string;
    reserveId: string;
    reserver: {
        firstName: string;
        lastName: string;
    }
    confirmLoading: boolean;
    reserveDataLoading: boolean;
}

const BookingContent: React.FC<Props> = props => {

    const { t } = useTranslation('common');
    const { t: tPayment } = useTranslation('payment');

    const { confirmStatus, confirmLoading, reserveDataLoading, reserveId, username, reserver,summary } = props;

    const [progress, setProgress] = useState<number>(0);

    let timer: any;

    useEffect(() => {

        if (confirmLoading) {

            timer = setInterval(() => {
                setProgress((prevState) => {
                    if (prevState < 90) {
                        return prevState + 5
                    } else {
                        clearInterval(timer)
                        return 100
                    }
                })
            }, 1000);

        } else {
            setProgress(0);
            clearInterval(timer);
        }

        return () => {
            clearInterval(timer)
        }

    }, [confirmLoading])

    return (
        <div>
            <div>
                {(reserveDataLoading || confirmLoading) ? (

                    <div className="border border-neutral-300 rounded-lg mb-4 bg-white" >
                        <div className="bg-[#f6b053] rounded-t-lg p-4 text-white relative">
                            <div
                                className="absolute bg-black/10 transition-all duration-1000 ease-linear top-0 rtl:right-0 ltr:left-0 h-full"
                                style={{ width: `${progress}%` }}
                            />
                            <span className="relative">
                                {tPayment("reserve-is-checking")}
                            </span>
                        </div>
                        <div className="px-4 py-8">
                            <div >
                                {reserver && <h4 className="font-semibold text-lg text-center mb-1"> {`${t("hello")} ${reserver.firstName} ${reserver.lastName}`} </h4>}
                                <p className="text-center mb-1">{tPayment("wait-a-second")}</p>
                                <p className="text-center text-sm">{tPayment("an-email-will-sent-flight")}</p>
                            </div>
                        </div>
                    </div>

                ) : (confirmStatus === "Issued" || confirmStatus ==="ContactProvider") ? (

                    <div className="border border-neutral-300 rounded-lg mb-4 bg-white">
                        <div className="bg-blue-400 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-t-lg p-4 gap-3 font-semibold text-sm sm:text-base" >
                            <div className="flex gap-2 items-center">
                                <Tik className="w-7 h-7 fill-current" />
                                {tPayment("congratulation-reserve-success")}
                            </div>
                            <div className="flex gap-2 items-center">
                                {t("tracking-code")}
                                {confirmLoading ? <Loading /> : <span className="text-lg"> {reserveId} </span>}
                            </div>
                        </div>
                        <div className="p-4">

                            <Tik className="w-14 h-14 bg-green-600 fill-white rounded-full block mx-auto my-4" />
                            <h4 className="font-semibold text-lg text-center mb-1"> {`${t("hello")} ${reserver.firstName} ${reserver.lastName}`} </h4>
                            <p className="text-center text-sm mb-1">{tPayment("reserve-success")}</p>
                            <p className="my-3 text-center text-sm">
                                برای راهنمایی بهتر در صورت تماس با ما لطفا از <span className="font-semibold"> کد پیگیری : {reserveId} </span>   استفاده کنید.
                            </p>

                        </div>

                    </div>

                ) : (
                    <div className="border border-red-400 rounded-lg bg-white p-4 mb-4 text-justify max-sm:text-sm max-sm:leading-6">
                        <Close className="w-14 h-14 fill-white bg-red-500 rounded-full block mx-auto my-4 p-2" />
                        <p className="text-red-500 text-center font-semibold text-lg mb-2">
                            رزرو شما به مشکل خورد
                        </p>
                        <p className="text-center mb-4">
                            درخواست رزرو شما در حال بررسی توسط تیم پشتیبانی می باشد، جهت مشاهده وضعیت سفارش خود به بخش پیگیری رزرو مراجعه کنید.
                        </p>

                        <p className="text-amber-500 text-sm mb-4 text-center">
                            <ErrorIcon className="fill-current w-5 h-5 inline-block align-middle rtl:ml-1  ltr:mr-1" />
                            لطفا قبل از مشخص شدن وضعیت سفارش خود از خرید مجدد خودداری فرمایید.
                        </p>

                        <div className="text-center mb-4 font-semibold text-lg">
                            <span > {t("tracking-code")} : </span>
                            <span> {confirmLoading ? <Loading /> : reserveId} </span>
                        </div>
                    </div>

                )}
            </div>


            {!!((confirmStatus === "Issued" || confirmStatus === "ContactProvider") && reserveId && username) && (
                <DownloadPdfVoucher
                    reserveId={reserveId}
                    username={username}
                    className="bg-primary-700 hover:bg-primary-800 text-white px-5 flex gap-2 items-center justify-center rounded-lg transition-all mb-4 w-full h-12 disabled:bg-neutral-500 disabled:cursor-not-allowed"
                />
            )}


            <div className="border border-neutral-300 rounded-lg bg-white mb-4">
                <div className="p-4 border-b border-neutral-300">
                    <User className="w-6 h-6 fill-neutral-400 inline-block rtl:ml-2 ltr:mr-2" />
                    رزرو گیرنده: <strong className="font-semibold"> {reserver.firstName} {reserver.lastName} </strong>
                </div>

                {!!summary && (
                    <div className="p-4">
                        {summary}
                    </div>
                )}

            </div>

        </div>
    )
};

export default BookingContent;
