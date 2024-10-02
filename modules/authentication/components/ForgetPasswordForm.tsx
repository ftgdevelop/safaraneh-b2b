import { useState, useEffect } from 'react';
import { Close } from "@/modules/shared/components/ui/icons";
import { Form, Formik } from "formik";
import { useTranslation } from "next-i18next";
import PhoneInput from '@/modules/shared/components/ui/PhoneInput';
import FormikField from '@/modules/shared/components/ui/FormikField';
import { validateEmail } from '@/modules/shared/helpers/validation';
import Button from '@/modules/shared/components/ui/Button';
import { forgotPasswordByEmail, forgotPasswordByPhoneNumber, forgotPasswordVerification } from '../actions';
import ModalPortal from '@/modules/shared/components/ui/ModalPortal';
import Image from 'next/image';
import OtpInput from '@/modules/shared/components/ui/OtpInput';
import { setReduxNotification } from '@/modules/shared/store/notificationSlice';
import { useAppDispatch } from '@/modules/shared/hooks/use-store';
import { useRouter } from 'next/router';
import { persianNumbersToEnglish } from '@/modules/shared/helpers';

type Props = {
    portalName: string;
}

const ForgetPasswordForm: React.FC<Props> = props => {

    const { t } = useTranslation('common');
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [type, setType] = useState<"mobile" | "email">("email");
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [verificationLoading, setVerificationLoading] = useState<boolean>(false);
    const [showEmailSuccessModal, setShowEmailSuccessModal] = useState<boolean>(false);
    const [showEmailSuccessModalDelayed, setShowEmailSuccessModalDelayed] = useState<boolean>(false);
    const [savedEmail, setSavedEmail] = useState<string>("");

    const [savedPhoneNumber, setSavedPhoneNumber] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [enteredCode, setEnteredCode] = useState<string>("");

    const [showVerificationForm, setShowVerificationForm] = useState<boolean>(false);
    const [showVerificationFormDelayed, setShowVerificationFormDelayed] = useState<boolean>(false);


    useEffect(() => {
        if (!showEmailSuccessModalDelayed) {
            setTimeout(() => { setShowEmailSuccessModal(false) }, 200);
        }
    }, [showEmailSuccessModalDelayed]);


    useEffect(() => {
        if (showEmailSuccessModal) {
            setTimeout(() => { setShowEmailSuccessModalDelayed(true) }, 100);
        }
    }, [showEmailSuccessModal]);


    useEffect(() => {
        if (!showVerificationFormDelayed) {
            setTimeout(() => { setShowVerificationForm(false) }, 200);
        }
    }, [showVerificationFormDelayed]);


    useEffect(() => {
        if (showVerificationForm) {
            setTimeout(() => { setShowVerificationFormDelayed(true) }, 100);
        }
    }, [showVerificationForm]);


    const sendCodeToMobile = async (phoneNumber: string) => {

        const localStorageTenant = localStorage?.getItem('S-TenantId');
        if (!localStorageTenant) return;

        setSubmitLoading(true);
        const response: any = await forgotPasswordByPhoneNumber(phoneNumber, +localStorageTenant);

        if (response?.data?.result?.userId) {
            setUserId(response.data.result.userId);
            setShowVerificationForm(true);
        }
        setSubmitLoading(false);

    }

    const submitHandler = async (values: {
        phoneNumber?: string;
        password: string;
        email?: string;
    }) => {

        if (!values.email && !values.phoneNumber) return;

        if (type === 'mobile' && values.phoneNumber) {

            setSavedPhoneNumber(values.phoneNumber);

            sendCodeToMobile(values.phoneNumber);

        } else if (type === 'email' && values.email) {

            setSavedEmail(values.email);

            setSubmitLoading(true);

            const localStorageTenant = localStorage?.getItem('S-TenantId');
            if(!localStorageTenant) return;

            const response: any = await forgotPasswordByEmail(values.email, +localStorageTenant);

            if (response?.data?.success) {
                setShowEmailSuccessModal(true);
            } else {
                let message = "ارسال اطلاعات ناموفق";
                if (response?.response?.data?.error?.message) {
                    message = response.response.data.error.message;
                }
                dispatch(setReduxNotification({
                    status: 'error',
                    message: message,
                    isVisible: true
                }));
            }
            setSubmitLoading(false);

        }

    }

    const verifyCode = async (code: string) => {
        if (code && userId && code.length === 6) {
            setVerificationLoading(true);

            const localStorageTenant = localStorage?.getItem('S-TenantId');
            
            if(!localStorageTenant) return;

            const response: any = await forgotPasswordVerification({ code: code, tenant: +localStorageTenant,userId: userId });

            setVerificationLoading(false);

            if (response.status == 200) {
                router.push(`/reset?code=${code}&userId=${userId}`);

            } else {
                let message = "ارسال اطلاعات ناموفق";
                if (response?.response?.data?.error?.message) {
                    message = response.response.data.error.message;
                }
                dispatch(setReduxNotification({
                    status: 'error',
                    message: message,
                    isVisible: true
                }));
            }
        }
    }

    return (
        <>
            <div className='text-lg mb-1'> {t('forget-password')} </div>
            <p className='text-neutral-500 text-xs mb-4'>
                انتخاب یکی از روش های زیر:
            </p>

            <div className='grid grid-cols-2 mb-6'>
                <button
                    type='button'
                    className={`text-sm pb-2 border-b border-b-2 ${type === 'mobile' ? "border-neutral-200" : "border-red-600"}`}
                    onClick={() => { setType('email') }}
                >
                    {t('email')}
                </button>
                <button
                    type='button'
                    className={`text-sm pb-2 border-b border-b-2 ${type === 'email' ? "border-neutral-200" : "border-red-600"}`}
                    onClick={() => { setType('mobile') }}
                >
                    شماره موبایل
                </button>
            </div>

            <Formik
                validate={() => { return {} }}
                initialValues={type === "email" ? { password: "", email: "" } : { password: "", phoneNumber: "" }}
                onSubmit={submitHandler}
            >
                {({ errors, touched, setFieldValue, values }) => {
                    return (

                        <Form autoComplete='off' >

                            {(type === "mobile" &&
                                <PhoneInput
                                    labelIsSimple
                                    showRequiredStar
                                    defaultCountry={
                                        {
                                            countryCode: "ir",
                                            dialCode: "98",
                                            format: "... ... ...."
                                        }
                                    }
                                    onChange={(v: string) => {
                                        //setError(false);
                                        setFieldValue('phoneNumber', v)
                                    }}
                                    name='phoneNumber'
                                    isTouched={touched.phoneNumber}
                                    label="شماره موبایل"
                                    errorText={errors.phoneNumber}
                                    className="mb-5"
                                />
                            )}

                            {(type === "email" &&

                                <FormikField
                                    labelIsSimple
                                    showRequiredStar
                                    className="mb-5"
                                    //onChange={() => { setError(false); }}
                                    setFieldValue={setFieldValue}
                                    errorText={errors.email as string}
                                    id='email'
                                    name='email'
                                    isTouched={touched.email}
                                    label={t('email')}
                                    validateFunction={(value: string) => validateEmail({ value: value, reqiredMessage: "ایمیل خود را وارد نمایید!", invalidMessage: t('invalid-email') })}
                                    value={values.email!}
                                />
                            )}

                            <Button
                                type="submit"
                                className="h-12 w-full mt-10 mb-5"
                                loading={submitLoading}
                            >
                                ادامه
                            </Button>

                            <p className='text-2xs text-neutral-400 text-justify'>
                                اگر آدرس ایمیل یا شماره تلفن همراهی را که برای ایجاد حساب کاربری خود استفاده کرده اید به خاطر نمی آورید، لطفا با ما تماس بگیرید
                            </p>

                        </Form>
                    )
                }}
            </Formik>

            {type === 'mobile' && (
                <ModalPortal
                    show={showVerificationForm}
                    selector='modal_portal_2'
                >
                    <div className='fixed top-0 left-0 h-screen w-screen'>
                        <div className='absolute left-0 right-0 top-0 bottom-0 bg-black/75 backdrop-blur' onClick={() => { setShowVerificationFormDelayed(false) }} />

                        <div className={`absolute sm:rounded-md flex flex-col gap-4 items-center top-0 left-0 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-h-screen overflow-y-auto p-10 sm:w-520 bg-white duration-200 transition-all ${showVerificationFormDelayed ? "scale-100 opacity-100" : "scale-90 opacity-0"}`} >
                            <Image
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMMAAADDCAMAAAAIoVWYAAABhlBMVEUAAAAxYqf////////////////////1+Ps8Z6v///////////82Zaj///////9rjb45Z6ywwt+wwt42Zanc6PL////////////////////////6+/3///////+xxOL////w8/n////////5+/7////6/P3v8fj///////////+ww9////+6yuSwxeGvwt////+wwt/5+/2ww9////+wwd6vwt/l6/T////q7/Y2Zazy9fnnQSp9m8m0xeBNd7VFcbLr7/bw8/ivwd74+vxVfbnk6vTb4/CFocysv9xmisDK1unj6fN1lcbC0OW8y+NukMP9/f709/o5aK1AbLBghr36+/3t8fekutqbs9aWr9SRq9H1+PvoRC24yOKAnsrxh3nU3u396eZ5mMhagLvsZVL/9/bF0+f1qqDwgXHqUTzN2Or60ctqjcJRerf/+/q/zuT84Nz72NT0pJnubVvrWEPd5fH2s6rylYj4xr/4w7vznpLveWnrXEnpSjT+7uzP2uv3u7LxjoFGHo61AAAAN3RSTlMAGpIhF+Tbsgn5qu8UoGMEDcCFEA7QWOsrXbeLgz40JgjzfTHYdRXBr5ttaUglzEmxqZpQ6N10XWv6ZwAAB8BJREFUeNrs0l9PknEUwPEzyLanRq6GIpmBmJWV1Vrt62Hx37lEW/x7kGQwJxsXrI2rrnvr7aHyrvW74DDM3+cVnO85R1wkYwF2VtJiL/OEyMFkUJiv6UWTSCIrxrbuAs3eSA20vkwBniXFVDwFDEqq7c7lx/k6jfbSOQGei6XsGnCu2hmHzF/lrKTtOpATQ7tAT1ufMNI81fYRBHExk0xBXfUzke2V+QqIDLXYh4SYuQeNkfaigJcZmbPszh4QdrQHwVOx8hCmWqzBWtx1sGRkVdy8CWCi7RqkxUg2gKGeQbAhTvZfV39551iRA0Y6hjtiJAMU9TvExM0sYeaFOFlNwVc9hzUxsgUN1dD50tnqlbfu3zrQS0iJkXXoagnYETcfrhoeiJtNqOs3QIysQ3nWsCFuXr3/nXA/KW4eRQ3Hy9Qgq49n9kWub8Mfy9XQOgS2blmJwaRk3BCG2Otj2bA4YiTNX12bhhwwPLQ3MGyIQVcX4Ni2oaztI2NV+4YSxuq+wbWhn7fSWFhD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"
                                className='h-16 w-16 block'
                                width={64}
                                height={64}
                                alt="phone icon"
                            />
                            <p className='text-2xl mb-2'> {t("welcome-to-website", { portalName: props.portalName })}</p>

                            <p className='text-xs text-neutral-500 mb-4 text-center'>
                                لطفا برای دسترسی بیشتر به امکانات سایت موبایل خود را فعال کنید!
                            </p>

                            <p className='text-xs text-neutral-500 text-center'>
                                کد تایید به شماره زیر ارسال شد:
                                <br />
                                <b className='font-semibold text-base block mt-2' dir="ltr">
                                    {savedPhoneNumber?.replace("+98", "0")}
                                </b>
                            </p>

                            <OtpInput
                                onChange={(e: string) => {
                                    if (!enteredCode && e) {
                                        verifyCode(persianNumbersToEnglish(e));
                                    }
                                    setEnteredCode(persianNumbersToEnglish(e));
                                }}
                            />

                            <Button
                                loading={verificationLoading}
                                onClick={() => {
                                    if (!verificationLoading && enteredCode) {
                                        verifyCode(enteredCode);
                                    }
                                }}
                                className='w-full sm:w-40 px-5 py-2 my-4'
                            >
                                ادامه
                            </Button>

                            <button
                                type='button'
                                className='text-sm'
                                onClick={() => { sendCodeToMobile(savedPhoneNumber); }}
                            >
                                ارسال مجدد کد
                            </button>

                        </div>

                    </div>

                </ModalPortal>
            )}

            {type === 'email' && (
                <ModalPortal
                    show={showEmailSuccessModal}
                    selector='modal_portal_2'
                >
                    <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
                        <div className={`bg-white rounded-xl px-5 pt-10 pb-12 w-full max-w-md text-center text-sm relative ${showEmailSuccessModalDelayed ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
                            <Image
                                src="data:image/png;base64,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"
                                width={65}
                                height={65}
                                alt='email icon'
                                className='block mx-auto mb-5'
                            />

                            <h5 className='text-xl font-semibold mb-4'> فراموشی رمز عبور </h5>

                            <p className='mb-5'> یک ایمیل حاوی لینک فعالسازی برای شما ارسال کردید. </p>

                            <p className='mb-1'>
                                لینک فعالسازی برای ایمیل زیر ارسال گردید :
                            </p>
                            <p className='mb-5 font-sans'> {savedEmail} </p>

                            <p className='text-xs text-neutral-400'> اگر ایمیل مورد نظر را دریافت نکردید! لطفا پوشه spam یا junk را بررسی کنید. </p>

                            <button
                                className='cursor-pointer absolute top-5 right-5'
                                type='button'
                                onClick={() => {
                                    setShowEmailSuccessModalDelayed(false);
                                    router.push('/');
                                }}
                            >

                                <Close
                                    className='w-7 h-7 fill-neutral-400 hover:fill-neutral-600'
                                />
                            </button>
                        </div>
                    </div>

                </ModalPortal>
            )}

        </>
    )
}

export default ForgetPasswordForm;