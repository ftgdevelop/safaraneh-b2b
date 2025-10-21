import { useTranslation } from "next-i18next";
import { useEffect, useState } from 'react';
import { DomesticHotelConfirmType, DomesticHotelGetReserveByIdData } from "../../types/hotel";
import { Bed, Close, ErrorIcon, InfoCircle, Tik, User } from "@/modules/shared/components/ui/icons";
import Loading from "@/modules/shared/components/ui/Loading";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import Image from "next/image";
import DownloadPdfVoucher from "./DownloadPdfVoucher";

type Props = {
    confirmStatus?: DomesticHotelConfirmType['reserve']['status'];
    reserveId?: string;
    username?: string;
    reserveInfo?: DomesticHotelGetReserveByIdData;
    confirmLoading: boolean;
}

const BookingContent: React.FC<Props> = props => {

    const { t } = useTranslation('common');
    const { t: tPayment } = useTranslation('payment');
    const { t: tHotel } = useTranslation('hotel');

    const { reserveInfo, username, reserveId, confirmStatus, confirmLoading } = props;

    const theme2 = process.env.THEME === "THEME2";

    const createBoardText = (code: DomesticHotelGetReserveByIdData['rooms'][0]['boardCode']) => {
        switch (code) {
            case "BB":
                return theme2 ? "با صبحانه":"به همراه صبحانه";
            case "HB":
                return "صبحانه + ناهار یا شام";
            case "FB":
                return "تمام وعده های غذایی شامل می شود";
            case "RO":
                return "بدون صبحانه";
            case "Hour6":
                return "اقامت به مدت ۶ ساعت";
            case "Hour10":
                return "اقامت به مدت ۱۰ ساعت";

            default:
                return code;
        }
    }

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
            {confirmLoading ?
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
                            {reserveInfo && <h4 className="font-semibold text-lg text-center mb-1"> {`${t("hello")} ${reserveInfo && reserveInfo.reserver.firstName} ${reserveInfo && reserveInfo.reserver.lastName}`} </h4>}
                            <p className="text-center mb-1">{tPayment("wait-a-second")}</p>
                            <p className="text-center text-sm">{tPayment("an-email-will-sent")}</p>
                        </div>
                    </div>
                </div>
                :
                <>
                    {(confirmStatus === "Issued" || confirmStatus === "ContactProvider") ?
                        <div className="border border-neutral-300 rounded-lg mb-4 bg-white">
                            <div className="bg-blue-400 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-t-lg p-4 gap-3 font-semibold text-sm sm:text-base" >
                                <div className="flex gap-2 items-center">
                                    <Tik className="w-7 h-7 fill-current" />
                                    {tPayment("congratulation-reserve-success")}
                                </div>
                                <div className="flex gap-2 items-center">
                                    {t("tracking-code")}
                                    {confirmLoading ? <Loading /> : <span className="text-lg"> {reserveInfo?.id || ""} </span>}
                                </div>
                            </div>
                            <div className="p-4">

                                <Tik className="w-14 h-14 bg-green-600 fill-white rounded-full block mx-auto my-4" />
                                <h4 className="font-semibold text-lg text-center mb-1"> {`${t("hello")} ${reserveInfo && reserveInfo.reserver.firstName} ${reserveInfo && reserveInfo.reserver.lastName}`} </h4>
                                <p className="text-center text-sm mb-1">{tPayment("reserve-success")}</p>
                                <p className="mb-3 text-center">
                                    برای راهنمایی بهتر در صورت تماس با ما لطفا از <span className="font-semibold"> کد پیگیری : {reserveInfo?.id} </span>   استفاده کنید.
                                </p>

                            </div>

                        </div>
                        :
                        <div className="border border-red-400 rounded-lg bg-white p-4 mb-4 text-justify">
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
                                <span> {confirmLoading ? <Loading /> : reserveInfo?.id} </span>
                            </div>

                        </div>
                    }
                </>
            }

            {(confirmStatus === "Issued" || confirmStatus === "ContactProvider") && reserveId && username && (
                <DownloadPdfVoucher
                    reserveId={reserveId}
                    username={username}
                    className="bg-primary-700 hover:bg-primary-800 text-white px-5 flex gap-2 items-center justify-center rounded-lg transition-all mb-4 w-full h-12 disabled:bg-neutral-500 disabled:cursor-not-allowed"
                />
            )}

            <div className="border border-neutral-300 rounded-lg bg-white mb-4">

                <div className="flex justify-between items-center p-4 border-b border-neutral-300">
                    {reserveInfo ? (
                        <>
                            <strong className="font-semibold text-lg">{tHotel('room-details')}</strong>
                            <div>
                                {t('tracking-code')} <span> {reserveInfo.id} </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <Skeleton className="w-20" />
                            <Skeleton className="w-14" />
                        </>
                    )}
                </div>

                <div className="p-4">
                    {reserveInfo ? reserveInfo.rooms.map((item, index) => {
                        let cancellation = null;
                        switch (item.cancellationPolicyStatus) {
                            case "NonRefundable":
                                cancellation = <div className="margin-bottom-5 text-red">{t("non-refundable")}</div>;
                                break;
                            case "Refundable":
                                cancellation = <div className="text-green margin-bottom-5 text-green-600">
                                    <Tik className="w-6 h-6 inline-block rtl:ml-1 ltr:mr-1 fill-current" />
                                    {t("refundable")}
                                </div>;
                                break;
                            // case "CallSupport":
                            //     cancellation = <div className="text-green margin-bottom-5"><CheckOutlined className="margin-end-5" /> {t("call-support-cancellation")}</div>;
                            //     break;
                            default:
                                cancellation = <div className="margin-bottom-5">{item.cancellationPolicyStatus}</div>;
                        }
                        return (
                            <div key={index} className="border border-neutral-300 rounded-sm">

                                <div className="border-b border-neutral-300 p-2 font-semibold" >
                                    <User className="w-6 h-6 fill-gray-400 inline-block align-middle rtl:ml-1  ltr:mr-1" />
                                    {tHotel('guest')} {item.passengers[0]?.firstName} {item.passengers[0]?.lastName}
                                </div>

                                <div className="flex items-start p-3 gap-3" >

                                    {item.image && <Image src={item.image} onContextMenu={(e)=> e.preventDefault()} className="object-cover h-20 w-28" alt="" width={112} height={80} />}

                                    <div>
                                        <Bed className="w-5 h-5 fill-gray-400 inline-block align-middle rtl:ml-1  ltr:mr-1" /> {item.name}
                                        {item.description && (
                                            <div>
                                                <InfoCircle className="w-5 h-5 fill-gray-400 inline-block align-middle rtl:ml-1  ltr:mr-1" /> {item.description}
                                            </div>
                                        )}
                                        <p>
                                            {!!item.boardCode && createBoardText(item.boardCode)}
                                            {cancellation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="border border-neutral-300 rounded-sm">
                            <div className="border-b border-neutral-300 p-3">
                                <Skeleton className="my-1 w-1/3" />
                            </div>
                            <div className="p-3">
                                <Skeleton className="mb-4 w-20" />
                                <Skeleton className="w-2/3" />
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </div>
    )
};

export default BookingContent;