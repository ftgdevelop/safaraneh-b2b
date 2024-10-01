import { useState, useEffect } from 'react';
import { ErrorCircle, InfoCircle, Lock, TikCircle } from "@/modules/shared/components/ui/icons";
import { Form, Formik } from "formik";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import FormikField from '@/modules/shared/components/ui/FormikField';
import { validateRequied } from '@/modules/shared/helpers/validation';
import Button from '@/modules/shared/components/ui/Button';
import { getDepositBankGateway, makeDepositToken } from '@/modules/payment/actions';
import Loading from '@/modules/shared/components/ui/Loading';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/modules/shared/hooks/use-store';
import { setReduxError } from '@/modules/shared/store/errorSlice';
import { ServerAddress } from '@/enum/url';

const ChargeWallet: React.FC = () => {

    const { t } = useTranslation('common');
    const { t: tPayment } = useTranslation('payment');

    const router = useRouter();
    const dispatch = useAppDispatch();

    const [bankList, setBankList] = useState<any>();
    const [gatewayId, setGatewayId] = useState<number>();
    const [goToBankLoading, setGoToBankLoading] = useState<boolean>(false);

    let firstBankId: number | undefined = undefined;
    if (bankList?.gateways?.length) {
        firstBankId = bankList.gateways[0].id;
    }

    useEffect(() => {
        if (firstBankId) {
            setGatewayId(firstBankId);
        }
    }, [firstBankId]);


    const fetchbankGateways = async (currency: "IRR" | "USD", token: string) => {

        const response: any = await getDepositBankGateway(currency, token);
        if (response?.data?.result[0]) {
            setBankList(response?.data?.result[0]);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('Token');
        if (!token) return;

        fetchbankGateways('IRR', token);

    }, []);


    const submitHandler = async (values: {
        amount: string;
    }) => {

        setGoToBankLoading(true);

        //const callbackUrl = window?.location.origin + (i18n?.language === "fa" ? "/fa" : "/ar") + "/myaccount/wallet";
        const callbackUrl = window?.location.origin + "/myaccount/wallet";

        const token = localStorage.getItem('Token');
        if (!token) return;

        const params = {
            gatewayId: gatewayId || bankList.gateways[0].id,
            callBackUrl: callbackUrl,
            amount: +values.amount,
            currencyType: "IRR",
            ipAddress: 1,
        };
        const response: any = await makeDepositToken(params, token);

        if (response.status == 200) {
            router.push(`https://${ServerAddress.Payment}/fa/User/Payment/PaymentRequest?tokenId=${response.data.result.tokenId}`);
        } else {
            dispatch(setReduxError({
                title: t('error'),
                message: response?.response?.data?.error?.message || "خطا در ارسال درخواست!",
                isVisible: true
            }))

            setGoToBankLoading(false);
        }

    }
    
    const theme2 = process.env.THEME === "THEME2";

    return (

        <Formik
            validate={() => { return {} }}
            initialValues={{ amount: "" }}
            onSubmit={submitHandler}
        >
            {({ errors, touched, setFieldValue, values }) => {
                return (

                    <Form autoComplete='off' className='p-5' >
                        <div className='sm:w-1/2'>
                            <label className='text-sm mb-1'>
                                مبلغ افزایش شارژ (ریال)
                            </label>
                            <div className='flex items-start'>
                                <FormikField
                                    groupStart
                                    labelIsSimple
                                    showRequiredStar
                                    className="mb-5 w-3/4"
                                    //onChange={() => { setError(false); }}
                                    setFieldValue={setFieldValue}
                                    errorText={errors.amount as string}
                                    id='amount'
                                    name='amount'
                                    isTouched={touched.amount}
                                    validateFunction={(value: string) => validateRequied(value, "لطفا مبلغ را وارد کنید")}
                                    value={values.amount}
                                />
                                <select className={`border rtl:rounded-l-md ltr:rounded-r-md border-neutral-300 w-1/4 outline-none ${theme2?"px-3 h-13 border-neutral-400 focus:border-2 focus:border-blue-500":"h-10"}`}>
                                    <option value={"IRR"}>
                                        ریال
                                    </option>
                                </select>
                            </div>
                        </div>

                        {!!bankList && bankList.gateways ? (
                            <div>
                                <h5 className='text-xl mb-5'>
                                    {tPayment('please-choose-pay-panel')}
                                </h5>
                                <div className={`p-2 rounded flex items-center ${theme2?"text-md gap-5 sm:p-6 bg-neutral-100 border border-neutral-300":"text-xs gap-2 sm:p-4 bg-neutral-50"}`}>
                                    <img
                                        src={bankList.image.path}
                                        alt={bankList.image.altAttribute}
                                    />
                                    {bankList.description}
                                </div>

                                <div className='flex gap-4 my-4'>
                                    {bankList.gateways.map((bank: any, index: number) => (
                                        <button
                                            key={index}
                                            type='button'
                                            onClick={() => { setGatewayId(bank.id) }}
                                            className={`border px-4 py-3 text-sm ${theme2?"grow-0 min-w-28 rounded-xl":"border-3 grow"} text-center rounded-sm text-blue-700 select-none outline-none border-blue-500 disabled:border-neutral-400 disabled:bg-neutral-200 disabled:grayscale ${gatewayId === bank.id ? "bg-blue-100" : "bg-blue-50"}`}
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

                                <Button
                                    className="h-12 px-5 font-semibold w-full sm:w-60"
                                    type='submit'
                                    loading={goToBankLoading}
                                    disabled={goToBankLoading || !bankList}
                                >
                                    <Lock className='fill-current w-5 h-5' />  {tPayment('pay')}
                                </Button>

                                <p className='my-4 text-neutral-400 text-xs' >
                                    {tPayment('accept-privacy')}
                                </p>
                            </div>
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

                        <p className='text-sm mt-5'>
                            <InfoCircle className='w-5 h-5 full-neutral-500 inline-block align-middle rtl:ml-2 ltr:mr-2' />
                            <span>{tPayment('second-password')}</span>
                        </p>

                        <Link href="/other/pouya-password" className='inline-block text-blue-800 hover:text-blue-600 text-sm px-7 mb-8'>
                            {tPayment('second-password-desc')}
                        </Link>

                        {!!(router.query && router.query.status === "1") && (
                            <div className="border border-neutral-300 rtl:border-r-2 rtl:border-r-blue-800 p-4 text-sm text-blue-800">
                                <TikCircle className='w-6 h-6 fill-current inline-block ' /> کیف پول شما با موفقیت شارژ شد
                            </div>
                        )}

                        {!!(router.query && router.query.status === "0") && (
                            <div className="border border-neutral-300 rtl:border-r-2 rtl:border-r-red-600 p-4 text-sm text-red-600">
                                <ErrorCircle className='w-6 h-6 fill-current inline-block ' /> شارژ کیف پول با مشکل مواجه شد
                            </div>
                        )}

                    </Form>

                )
            }}
        </Formik>

    )
}

export default ChargeWallet;