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
import { CurrencyType } from '@/modules/payment/types';
import { rialsToLettersToman } from '@/modules/shared/helpers';

const ChargeWallet: React.FC = () => {

    const { t } = useTranslation('common');
    const { t: tPayment } = useTranslation('payment');

    const router = useRouter();
    const dispatch = useAppDispatch();

    const [activeCurrency, setActiveCurrency] = useState<CurrencyType>('IRR');
    const [bankList, setBankList] = useState<any>();
    const [getBankListLoading, setGetBankListLoading] = useState<boolean>(false);
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


    const fetchbankGateways = async (currency: CurrencyType, token: string, tenant: number) => {
        setGetBankListLoading(true);
        const response: any = await getDepositBankGateway(currency, tenant, token);
        if (response?.data?.result[0]) {
            setBankList(response?.data?.result[0]);
        }
        setGetBankListLoading(false);
    }

    useEffect(() => {
        const token = localStorage.getItem('Token');
        const localStorageTenant = localStorage?.getItem('S-TenantId');
        if (!token || !localStorageTenant) return;

        fetchbankGateways(activeCurrency, token, +localStorageTenant);

    }, [activeCurrency]);


    const submitHandler = async (values: {
        amount: string;
    }) => {

        setGoToBankLoading(true);

        //const callbackUrl = window?.location.origin + (i18n?.language === "fa" ? "/fa" : "/ar") + "/myaccount/wallet";
        const callbackUrl = window?.location.origin + "/wallet";

        const token = localStorage.getItem('Token');
        if (!token) return;

        const params = {
            gatewayId: gatewayId || bankList.gateways[0].id,
            callBackUrl: callbackUrl,
            amount: +values.amount,
            currencyType: activeCurrency,
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

    return (

        <Formik
            validate={() => { return {} }}
            initialValues={{ amount: "" }}
            onSubmit={submitHandler}
        >
            {({ errors, touched, setFieldValue, values }) => {
                return (

                    <Form autoComplete='off' className='my-5' >
                        <div className='mb-5'>
                            <label className='text-sm mb-1'>
                                مبلغ افزایش شارژ (ریال)
                            </label>
                            <div className='flex items-start'>
                                <FormikField
                                    groupStart
                                    labelIsSimple
                                    showRequiredStar
                                    className="w-full"
                                    //onChange={() => { setError(false); }}
                                    setFieldValue={setFieldValue}
                                    errorText={errors.amount as string}
                                    id='amount'
                                    name='amount'
                                    isTouched={touched.amount}
                                    validateFunction={(value: string) => validateRequied(value, "لطفا مبلغ را وارد کنید")}
                                    value={values.amount}
                                />
                                <select
                                    className={`border rtl:rounded-l-md ltr:rounded-r-md border-neutral-300 w-16 text-sm bg-neutral-100 px-1 shrink-0 outline-none h-10`}
                                    onChange={e => { setActiveCurrency(e.target.value as CurrencyType) }}
                                >
                                    <option value={"IRR"}>
                                        ریال
                                    </option>
                                    <option value={"USD"}>
                                        دلار
                                    </option>
                                </select>
                            </div>

                            {(activeCurrency === "IRR" && +values.amount > 9) ? (
                            <p className='text-sm'> {rialsToLettersToman(+values.amount)} </p> 
                            ): null}
                        </div>

                        {bankList?.gateways?.length ? (
                            <div>
                                <h5 className='text-xl mb-5'>
                                    درگاه پرداخت
                                </h5>
                                <div className={`p-2 rounded flex items-center text-xs gap-2 sm:p-4 bg-neutral-50`}>
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
                                            className={`border px-10 py-3 text-sm text-center rounded-xl text-blue-700 select-none outline-none disabled:border-neutral-400 disabled:bg-neutral-200 disabled:grayscale ${gatewayId === bank.id ? "border-teal-500" : "grayscale border-neutral-300"}`}
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
                                    className="h-12 px-5 mt-10 mx-auto font-semibold w-full sm:w-60"
                                    type='submit'
                                    loading={goToBankLoading}
                                    disabled={goToBankLoading || !bankList}
                                >
                                    {tPayment('pay')}
                                </Button>

                            </div>
                        ) : getBankListLoading ? (
                            <>
                                <div>
                                    درگاه پرداخت
                                </div>

                                <div className='flex gap-3 items-center justify-center py-6' >
                                    <Loading size='small' />

                                    در حال بارگذاری
                                </div>
                            </>
                        ): (
                            <div className='text-red-500 text-center p-10 text-sm'>
                                متاسفانه درگاه پرداختی یافت نشد. واحد پولی دیگری انتخاب کنید.
                            </div>
                        )}

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