import { Bed, Calendar, Cancel, ConfirmationNumber, CreditCard, Email, ErrorIcon, Phone, TikCircle, TimeSand, User3 } from "@/modules/shared/components/ui/icons";
import { dateDiplayFormat, numberWithCommas } from "@/modules/shared/helpers";
import Link from 'next/link';
import DownloadPdfVoucher from '@/modules/domesticHotel/components/booking/DownloadPdfVoucher';
import { HotelReserveItemType } from '@/modules/domesticHotel/types/hotel';

type Props = {
    reserve: HotelReserveItemType
}

const HotelReserveListItem: React.FC<Props> = props => {

    const { reserve } = props;

    const { id, status, username } = props.reserve;

    let statusIcon: React.ReactNode;
    let statusText: React.ReactNode;

    switch (status) {
        case "Pending":
            statusIcon = <ErrorIcon className="w-4.5 h-4.5 fill-[#1dac08] inline-block align-middle" />;
            statusText = <span className="inline-block align-middle text-[#1dac08]"> آماده پرداخت ({status})</span>;
            break;
        case "Issued":
            statusIcon = <TikCircle className="w-4.5 h-4.5 fill-[#1dac08] inline-block align-middle" />;
            statusText = <span className="inline-block align-middle text-[#1dac08]"> نهایی شده  ({status})</span>;
            break;
        case "Canceled":
            statusIcon = <Cancel className="w-4.5 h-4.5 fill-red-500 inline-block align-middle" />;
            statusText = <span className="inline-block align-middle text-red-500"> کنسل  ({status})</span>;
            break;
        case "Registered":
            statusIcon = <TimeSand className="w-4.5 h-4.5 fill-[#52c41a] inline-block align-middle" />;
            statusText = <span className="inline-block align-middle text-[#52c41a]"> در حال بررسی  ({status})</span>;
            break;
        case "Unavailable":
        case "Voided":
            statusIcon = <ErrorIcon className="w-4.5 h-4.5 fill-red-500 inline-block align-middle" />;
            statusText = <span className="inline-block align-middle text-red-500"> جا نمی دهد  ({status})</span>;
            break;
        case "ContactProvider":
            statusIcon = <ErrorIcon className="w-4.5 h-4.5 fill-red-500 inline-block align-middle" />;
            statusText = <span className="inline-block align-middle text-red-500"> تماس با پشتیبانی ({status})</span>;
            break;
        case "PaymentSuccessful":
        case "WebServiceUnsuccessful":
            statusIcon = <Cancel className="w-4.5 h-4.5 fill-red-500 inline-block align-middle" />;
            statusText = <span className="inline-block align-middle text-red-500"> خطا در صدور بلیط  ({status})</span>;
            break;
        case "InProgress":
            statusIcon = <TimeSand className="w-4.5 h-4.5 fill-[#52c41a] inline-block align-middle" />;
            statusText = <span className="inline-block align-middle text-[#52c41a]"> در حال صدور ({status})</span>;
            break;
        case "OnCredit":
            statusIcon = <CreditCard className="w-4.5 h-4.5 fill-[#52c41a] inline-block align-middle" />;
            statusText = <span className="inline-block align-middle text-[#52c41a]"> علی الحساب ({status})</span>;
            break;
        default:
            statusIcon = "";
            statusText = status;
    }

    let paymentLink = null;
    if (!['Canceled', 'Issued', 'Registered', 'Unavailable', 'PaymentSuccessful', 'WebServiceUnsuccessful', 'Voided'].includes(status)) {
        paymentLink = (
            <Link
                href={`/payment?username=${username}&reserveId=${id}`}
                className='text-xs bg-green-600 text-white hover:bg-green-700 px-3 h-8 rounded transition-all inline-flex items-center justify-center'
            >
                پرداخت کنید
            </Link>
        )
    };

    let downloadTicket = null;
    if ((status === 'Issued' || status === 'ContactProvider') && username) {
        downloadTicket = <DownloadPdfVoucher
            simple
            reserveId={id.toString()}
            username={username}
            className="rounded border text-xs border-primary-700 hover:bg-primary-700 text-neutral-600 hover:text-white px-1 transition-all h-8 disabled:bg-neutral-500 disabled:cursor-not-allowed disabled:text-white"
        />
    };

    let linkToDetail = null;
    if (id && username) {
        linkToDetail = (
            <Link
                className='border border-green-600 rounded text-xs text-green-600 hover:text-white hover:bg-green-600 transition-all px-3 h-8 inline-flex items-center justify-center'
                href={`/hotel/reserveList/reserveDetail?username=${username}&reserveId=${id}`}
            >
                اطلاعات بیشتر
            </Link>
        )
    }

    const iconClassName = "w-5 h-5 fill-neutral-400 inline-block ml-2";

    return (

        <div
            key={reserve.id}
            className="grid grid-cols-1 lg: grid-cols-3 gap-4 bg-white border rounded-xl p-4 mb-5 relative"
        >
            <div className="col-span-3 flex gap-3 items-center">
                <span className="bg-orange-100 rounded-full p-2">
                    <Bed className="w-6 h-6 fill-amber-500" />
                </span>
                <h3 className="font-semibold"> هتل {reserve.accommodation.name} {reserve.accommodation.city.name} </h3>
            </div>

            <div className="text-sm">

                <ConfirmationNumber className={iconClassName} />
                <label className="ml-2 text-neutral-400"> شماره رزرو: </label>
                {reserve.id}

                <br />

                <Calendar className={iconClassName} />
                <label className="ml-2 text-neutral-400"> تاریخ رزرو: </label>
                {dateDiplayFormat({ date: reserve.creationTime, format: "dd mm yyyy", locale: "fa" })}

                <br />

                <Calendar className={iconClassName} />
                <label className="ml-2 text-neutral-400">  تاریخ ورود: </label>
                {dateDiplayFormat({ date: reserve.checkin, format: "dd mm yyyy", locale: "fa" })}

                <br />

                <Calendar className={iconClassName} />
                <label className="ml-2 text-neutral-400"> تاریخ خروج: </label>
                {dateDiplayFormat({ date: reserve.checkout, format: "dd mm yyyy", locale: "fa" })}

                <br />

            </div>

            <div className="text-sm">

                <User3 className={iconClassName} />
                {reserve.reserver.firstName} {reserve.reserver.lastName}

                <br />

                {reserve.reserver.phoneNumber && (
                    <>
                        <Phone className={iconClassName} />
                        <span dir="ltr">
                            {reserve.reserver.phoneNumber}
                        </span>
                    </>
                )}

                <br />

                {reserve.reserver.email && (
                    <>
                        <Email className={iconClassName} />
                        {reserve.reserver.email}
                    </>
                )}

            </div>

            <div className='flex flex-col justify-end items-end gap-2'>
                <strong className='font-semibold'>
                    {numberWithCommas(reserve.totalPrice)} ریال
                </strong>

                {paymentLink || downloadTicket}

                {linkToDetail}

            </div>

            <div className={`absolute top-0 -mt-1 left-4 border shadow p-1 px-3 rounded-b-xl text-xs bg-white`}>
                {statusIcon} {statusText}
            </div>

        </div>

    )
}

export default HotelReserveListItem;