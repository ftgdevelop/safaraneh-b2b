import Button from '@/modules/shared/components/ui/Button';
import Loading from '@/modules/shared/components/ui/Loading';
import Skeleton from '@/modules/shared/components/ui/Skeleton';
import { Close, InfoCircle, Lock } from '@/modules/shared/components/ui/icons';
import { getDatesDiff, numberWithCommas } from '@/modules/shared/helpers';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { bankGatewayItem } from '../types';

type Props = {
    goToBankLoading?: boolean;
    onSubmit: (gatewayId: number) => void;
    expireDate?: string;
    bankGatewayList: bankGatewayItem[];
    status?: any;
    type?: "Undefined" | "HotelDomestic" | "FlightDomestic" | "Bus" | "Package" | "Flight" | "Hotel" | "PnrOutside" | "Cip" | "Activity";
    coordinatorPrice?: number;
}

const OnlinePayment: React.FC<Props> = props => {

    const theme1 = process.env.THEME === "THEME1";

    const { t } = useTranslation('common');
    const { t: tPayment } = useTranslation('payment');

    const {
        bankGatewayList,
        goToBankLoading,
        status,
        expireDate,
        type,
        coordinatorPrice
    } = props

    const [gatewayId, setGatewayId] = useState<number>();
    const [remaindSeconds, setRemaindSeconds] = useState<number>(100);

    let firstBankId: number | undefined = undefined;
    if (bankGatewayList[0]?.gateways?.length) {
        firstBankId = bankGatewayList[0]?.gateways[0]?.id;
    }

    useEffect(() => {
        if (firstBankId) {
            setGatewayId(firstBankId);
        }
    }, [firstBankId]);

    const submit = () => {
        if (!sumbitBtnIsDisabled && !props.goToBankLoading && gatewayId) {
            props.onSubmit(gatewayId)
        }
    }

    const remaindTimeElement = (second: number) => {
        const days = Math.floor(second / (24 * 60 * 60))
        const daysRemained = second % (24 * 60 * 60)
        const hours = Math.floor(daysRemained / (60 * 60))
        const hoursRemained = daysRemained % (60 * 60)
        const minutes = Math.floor(hoursRemained / 60)
        const seconds = hoursRemained % 60

        if (second > 0) {
            return (
                <div className={`bg-white p-4 border mb-4 mt-8 ${theme1 ? "border-neutral-300 rounded-md border-t-2 border-t-orange-400" : "border-green-600 rounded-xl"}`}>
                    <h6 className={`font-semibold ${theme1 ? "text-orange-400 mb-1" : "mb-2 text-green-600"}`}> درخواست رزرو تایید شد </h6>
                    <p className='text-xs'>
                        <span> خواهشمند است حداکثر ظرف مدت </span>
                        {days ? <b> <span className='font-mono'> {days} </span> روز </b> : null}
                        {hours ? <b> <span className='font-mono'> {hours} </span> ساعت </b> : null}
                        {!!(minutes && (hours || days)) && (<span> و </span>)}
                        {minutes ? <b> <span className='font-mono'> {minutes} </span> دقیقه </b> : null}
                        {!!(seconds && (minutes || hours)) && (<span> و </span>)}
                        {seconds ? <b> <span className='font-mono'> {seconds} </span> ثانیه </b> : null}
                        <span>
                            {' '}
                            نسبت به پرداخت صورتحساب اقدام فرمایید. بدیهی است پس از منقضی شدن
                            زمان مذکور درخواست شما لغو می گردد.{' '}
                        </span>
                    </p>
                </div>
            )
        }
        return null
    }

    let countDownTimer: any;

    useEffect(() => {
        if (expireDate) {


            const remainedsec = getDatesDiff(new Date(), new Date(expireDate), 'seconds');

            if (remainedsec > 1) {
                setRemaindSeconds(remainedsec)
                countDownTimer = setInterval(() => {
                    setRemaindSeconds((prevState) => {
                        if (prevState > 1) {
                            return prevState - 1
                        } else {
                            clearInterval(countDownTimer)
                            return 0
                        }
                    })
                }, 1000)
            } else {
                setRemaindSeconds(0)
            }
        }
        return () => {
            clearInterval(countDownTimer)
        }
    }, [props.expireDate])


    let sumbitBtnIsDisabled = false
    if (
        type === 'Hotel' ||
        type === 'Flight' ||
        (type === 'HotelDomestic' && remaindSeconds < 1)
    ) {
        sumbitBtnIsDisabled = true
    }
    return (
        <div className='pt-10'>

            {type === 'HotelDomestic' && remaindSeconds < 1 && (
                <div className={`border p-4 ${theme1 ? "text-xs border-neutral-300 rounded border-t-4 border-t-red-500" : "text-sm border-red-600 rounded-xl"}`}>
                    <h6 className='text-red-600 text-sm font-semibold mb-1'> اخطار! </h6>
                    <p>
                        درخواست رزرو تایید شد ولی به علت عدم پرداخت در مهلت تعیین شده لغو گردید.
                    </p>
                </div>
            )}

            {!!(status === '0' || status === 0) && (remaindSeconds > 1) && (
                <div className='text-center border border-neutral-300 rounded-md my-5 p-5' >

                    <Close className='fill-white bg-red-600 rounded-full p-1 w-12 h-12 block mx-auto mb-4' />

                    <h5 className='font-semibold text-lg mb-2'>
                        {tPayment('error-in-pay')}
                    </h5>

                    <p className='text-sm'>{tPayment('please-pay-again')}</p>

                </div>
            )}

            <p className='text-sm mt-5'>
                <InfoCircle className='w-5 h-5 full-neutral-500 inline-block align-middle rtl:ml-2 ltr:mr-2' />
                <span>{tPayment('second-password')}</span>
            </p>

            <Link href="/other/pouya-password" className='inline-block text-blue-800 hover:text-blue-600 text-sm px-7 mb-8'>
                {tPayment('second-password-desc')}
            </Link>

            {bankGatewayList.length ? (
                <>
                    <h5 className='text-xl mb-5'>
                        {tPayment('please-choose-pay-panel')}
                    </h5>

                    {bankGatewayList.filter(item => item.gateways?.length).map(item =>
                    (<div key={item.name}>

                        {item.category === "Group" ? (
                            <>
                                <div className='bg-neutral-50 p-2 sm:p-4 text-xs rounded flex items-center gap-2'>
                                    <img
                                        src={item.image.path}
                                        alt={item.image.altAttribute}
                                    />
                                    {item.description}
                                </div>

                                <div className='flex gap-4 my-4'>
                                    {item.gateways.map((bank: any, index: number) => (
                                        <button
                                            key={index}
                                            disabled={type === 'HotelDomestic' && remaindSeconds < 1}
                                            type='button'
                                            onClick={() => { setGatewayId(bank.id) }}
                                            className={`border border-3 px-4 py-3 text-sm grow text-center rounded-sm text-blue-700 select-none outline-none disabled:border-neutral-400 disabled:bg-neutral-200 disabled:grayscale ${gatewayId === bank.id ? "bg-blue-100 border-blue-500" : "bg-blue-50"}`}
                                        >
                                            <img
                                                className="block mx-auto mb-1"
                                                src={bank.image.path}
                                                alt={bank.image.altAttribute}
                                            />
                                            {bank.displayName || bank.name}
                                        </button>
                                    ))}

                                </div>
                            </>
                        ) : item.category === "Single" ? (
                            <>
                            <hr className='my-6'/>
                                <div className='flex gap-4 my-4'>
                                    <button
                                        disabled={type === 'HotelDomestic' && remaindSeconds < 1}
                                        type='button'
                                        onClick={() => { setGatewayId(item.gateways[0]?.id) }}
                                        className={`border flex gap-3 border-3 px-4 py-3 text-sm grow rounded-sm text-blue-700 select-none outline-none disabled:border-neutral-400 disabled:bg-neutral-200 disabled:grayscale ${gatewayId === item.gateways[0]?.id ? "border-blue-500 bg-blue-100" : "bg-blue-50"}`}
                                    >
                                        <img
                                            className="block"
                                            src={item.gateways[0]?.image?.path}
                                            alt={item.gateways[0]?.image?.altAttribute}
                                        />
                                        <div className='text-right'>
                                            <div className='font-semibold'>
                                                {item.gateways[0]?.displayName || item.gateways[0]?.name}
                                            </div>
                                            {item.description}
                                        </div>
                                    </button>

                                </div>
                            </>
                        ) : (
                            null
                        )}

                    </div>)
                    )}

                    {coordinatorPrice ? (
                        <div className='text-sm font-semibold py-4'>
                            {tPayment('total-price')} :  {numberWithCommas(coordinatorPrice)} {t('rial')}
                        </div>
                    ) : (
                        <Skeleton />
                    )}

                    <Button
                        className="h-12 px-5 font-semibold w-full sm:w-60"
                        onClick={submit}
                        disabled={sumbitBtnIsDisabled}
                        loading={goToBankLoading}
                    >

                        <Lock className='fill-current w-5 h-5' />  {tPayment('pay')}

                    </Button>

                    <p className='my-4 text-neutral-400 text-xs' >
                        {tPayment('accept-privacy')}
                    </p>

                </>
            ) : (
                <>
                    <div>
                        {tPayment('please-choose-pay-panel')}
                    </div>

                    <div className='flex gap-3 items-center justify-center py-6' >
                        <Loading size='small' />

                        در حال بارگذاری
                    </div>
                </>
            )}

            {type === 'HotelDomestic' && remaindTimeElement(remaindSeconds)}

            {/* {props.isAuthenticated ? <Wallet pricePayment={price} />: ''} */}
        </div>
    )
}

export default OnlinePayment;