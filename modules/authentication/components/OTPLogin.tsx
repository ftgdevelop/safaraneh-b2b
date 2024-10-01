import { useEffect, useState } from 'react';
import Button from "@/modules/shared/components/ui/Button";
import PhoneInput from "@/modules/shared/components/ui/PhoneInput";
import { Form, Formik } from "formik";
import { useTranslation } from "next-i18next";
import { getTenant, registerOrLogin, sendOtp } from "../actions";
import { useAppDispatch } from '@/modules/shared/hooks/use-store';
import { setReduxError } from '@/modules/shared/store/errorSlice';
import OtpInput from '@/modules/shared/components/ui/OtpInput';
import CountDown from '@/modules/shared/components/ui/CountDown';
import Skeleton from '@/modules/shared/components/ui/Skeleton';
import { setAuthenticationDone, setReduxUser } from '../store/authenticationSlice';
import { persianNumbersToEnglish } from '@/modules/shared/helpers';
import { setReduxNotification } from '@/modules/shared/store/notificationSlice';
import FormikField from '@/modules/shared/components/ui/FormikField';
import { validateRequied } from '@/modules/shared/helpers/validation';
import { useRouter } from 'next/router';

type Props = {
    onBackToLoginWithPassword: () => void;
    onCloseLogin:() => void;
}

const OTPLogin: React.FC<Props> = props => {

    const [loading, setLoading] = useState<boolean>(false);
    const [registerLoading, setRegisterLoading] = useState<boolean>(false);
    const [savedPhoneNumber, setSavedPhoneNumber] = useState<string>();
    const [showVerificationForm, setShowVerificationForm] = useState<boolean>(false);
    const [sendCodeMoment, setSendCodeMoment] = useState<number>(new Date().getTime());
    const [remaindSeconds, setRemaindSeconds] = useState<number>(80);
    const [enteredCode, setEnteredCode] = useState<string>("");
    const [tenantId, setTenantId] = useState<number | undefined>();

    const router = useRouter();

    const tenantName = router.query?.tenantName as string || "";

    useEffect(() => {

        let countDownTimer: any;

        if (sendCodeMoment) {
            countDownTimer = setInterval(() => {
                setRemaindSeconds((prevState) => {
                    if (prevState > 1) {
                        return (prevState - 1);
                    } else {
                        clearInterval(countDownTimer);
                        return 0
                    }
                })
            }, 1000);
        }

        return (() => { clearInterval(countDownTimer); })

    }, [sendCodeMoment]);

    const dispatch = useAppDispatch();

    const sendOtpCode = async (phoneNumber: string, tenantId: number) => {

        setLoading(true);
        try {

            const response: any = await sendOtp({ emailOrPhoneNumber: phoneNumber, tenantId: tenantId});
            if (response.message) {
                dispatch(setReduxError({
                    title: "خطا",
                    message: response.message,
                    isVisible: true
                }));
            }
            setLoading(false);

            if (response.status == 200) {
                
                setShowVerificationForm(true);

                setRemaindSeconds(80);
                setTimeout(() => { setSendCodeMoment(new Date().getTime()) }, 200)
            }

            if (response.status == 500)

                dispatch(setReduxError({
                    title: "خطا",
                    message: response?.data?.error?.message,
                    isVisible: true
                }));

        } catch (error) {
            setLoading(false);
            dispatch(setReduxError({
                title: "خطا",
                isVisible: true
            }))
        }
    }

    const submitHandler = async (values: {
        phoneNumber: string;
        username?: string;
    }) => {

        localStorage.removeItem('S-TenantId');
        const getTenantResponse: any = await getTenant( tenantName || values.username!);
        if (!(getTenantResponse?.data?.result?.id)){
            
            dispatch(setReduxNotification({
                status: 'error',
                message: "شناسه کاربری یافت نشد.",
                isVisible: true
            }));

            return;
        }

        const tenant_Id = getTenantResponse.data.result.id;
        setTenantId(tenant_Id);

        localStorage.setItem('S-TenantId', tenant_Id);

        setSavedPhoneNumber(values.phoneNumber);
        sendOtpCode(values.phoneNumber, tenant_Id);
    }

    const onSuccessLogin = (response: any) => {
        
        if (response && response.status === 200) {

            const token = response.data?.result?.accessToken
            localStorage.setItem('Token', token);
            props.onCloseLogin();

            dispatch(setReduxUser({
                isAuthenticated: true,
                user: response.data?.result?.user,
                getUserLoading: false
            }));

            const userFirstName = response.data?.result?.user?.firstName || "کاربر";

            dispatch(setReduxNotification({
                status: 'success',
                message: userFirstName +'  عزیز،  خوش آمدید.',
                isVisible: true
            }));            

        } else {
            dispatch(setReduxUser({
                isAuthenticated: false,
                user: {},
                getUserLoading: false
            }));
        }
    }

    const registerOtp = async (code: string) => {
        if (code && savedPhoneNumber && code.length === 6) {
            setRegisterLoading(true);

            dispatch(setReduxUser({
                isAuthenticated: false,
                user: {},
                getUserLoading: true
            }));

            if (!tenantId){
                
                dispatch(setReduxNotification({
                    status: 'error',
                    message: "شناسه کاربری یافت نشد.",
                    isVisible: true
                }));

                return
            }

            const response: any = await registerOrLogin({ code: code, emailOrPhoneNumber: savedPhoneNumber, tenantid: tenantId });

            setRegisterLoading(false);
            if (response.status == 200) {
                onSuccessLogin(response);
            } else {
                let message = "";
                if (response?.response?.data?.error?.message) {    
                    message = response.response.data.error.message;
                }
                dispatch(setReduxNotification({
                    status: 'error',
                    message: message,
                    isVisible: true
                }));
                dispatch(setReduxUser({
                    isAuthenticated: false,
                    user: {},
                    getUserLoading: false
                }));

            }
            
            dispatch(setAuthenticationDone());

        }
    }

    return (
        <div className='p-5'>
            <h3 className="text-2xl font-semibold leading-none tracking-tight mt-3">ورود با  رمز یکبار مصرف</h3>
            
            {showVerificationForm ? (
                <div className='mt-4'>
                    <p className='text-xs mb-12'> رمز یکبار مصرف ارسال شده به شماره<span dir="ltr" className='mx-1'> {savedPhoneNumber} </span>  را وارد کنید. </p>

                        <OtpInput
                            onChange={(e: string) => {
                                if (!enteredCode && e) {
                                    registerOtp(persianNumbersToEnglish(e));
                                }
                                setEnteredCode(persianNumbersToEnglish(e));
                            }}
                        />

                        <Button
                            type='button'
                            className='h-12 w-full mt-12 mb-3'
                            onClick={() => { registerOtp(enteredCode) }}
                            loading={registerLoading}
                        >
                            تایید و ادامه
                        </Button>


                        {savedPhoneNumber && remaindSeconds === 0 ? (
                            <Button
                                color='gray'
                                type='button'
                                className='mb-4 text-sm w-full h-12'
                                onClick={() => { tenantId ? sendOtpCode(savedPhoneNumber, tenantId) : undefined }}
                            >
                                ارسال مجدد کد
                            </Button>
                        ) : loading ? (

                            <Skeleton className='w-24 mt-1 mb-4' />

                        ) : (
                            <div className='mb-4 text-sm'>
                                <CountDown
                                    seconds={remaindSeconds}
                                    simple
                                />
                                <span className='rtl:mr-3 ltr:ml-3'> تا درخواست مجدد کد </span>
                            </div>
                        )}


                </div>
            ):(
                <Formik
                validate={() => { return {} }}
                initialValues={{ phoneNumber: "" , username:""}}
                onSubmit={submitHandler}
            >
                {({ errors, touched, setFieldValue, values }) => {
                    return (

                        <Form className='mt-10' autoComplete='off' >

                            {!tenantName && <FormikField
                                className="mb-5"
                                labelIsSimple
                                showRequiredStar
                                setFieldValue={setFieldValue}
                                errorText={errors.username}
                                id='username'
                                name='username'
                                isTouched={touched.username}
                                label="شناسه کاربری"
                                validateFunction={(value: string) => validateRequied(value, ' شناسه کاربری را وارد نمایید!')}
                                value={values.username}                                
                            />}

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
                                    setFieldValue('phoneNumber', v)
                                }}
                                name='phoneNumber'
                                isTouched={touched.phoneNumber}
                                label={"شماره موبایل"}
                                errorText={errors.phoneNumber}
                                className="mb-5"
                            />

                            <Button
                                type="submit"
                                className="h-12 w-full"
                                loading={loading}
                            >
                                 ارسال رمز یکبار مصرف
                            </Button>

                        </Form>
                    )
                }}
                </Formik>
            )}

        </div>
    )
}

export default OTPLogin;