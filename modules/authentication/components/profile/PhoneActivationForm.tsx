import Button from "@/modules/shared/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/modules/shared/hooks/use-store";
import { Form, Formik } from "formik";
import { useTranslation } from "next-i18next";
import { sendVerificationSms, updateProfilePhoneNumber, verifySmsCode } from "../../actions";
import { useState, useEffect } from "react";
import { setReduxNotification } from "@/modules/shared/store/notificationSlice";
import PhoneInput from "@/modules/shared/components/ui/PhoneInput";
import { InfoCircle, Loading } from "@/modules/shared/components/ui/icons";
import ModalPortal from "@/modules/shared/components/ui/ModalPortal";
import Image from "next/image";
import OtpInput from "@/modules/shared/components/ui/OtpInput";
import { persianNumbersToEnglish } from "@/modules/shared/helpers";


type Props = {
    portalName: string;
}
const PhoneActivationForm: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const dispatch = useAppDispatch();

    const userAuthentication = useAppSelector(state => state.authentication);
    const user = userAuthentication.user;

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [sendVerificationCodeLoading, setSendVerificationCodeLoading] = useState<boolean>(false);
    const [submitVerificationCodeLoading, setSubmitVerificationCodeLoading] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [savedPhoneNumber, setSavedPhoneNumber] = useState<string>(user?.phoneNumber || "");
    const [enteredCode, setEnteredCode] = useState<string>("");

    useEffect(() => {
        setSavedPhoneNumber(user?.phoneNumber || "");
    }, [user?.phoneNumber]);

    let initialValues = {
        phoneNumber: "",
    }

    if (userAuthentication?.isAuthenticated) {
        initialValues = {
            phoneNumber: user?.phoneNumber || ""
        }
    }

    const submitHandler = async (values: {phoneNumber:string}) => {

        const token = localStorage.getItem('Token');
        if (!token) return;

        setSavedPhoneNumber(values.phoneNumber);

        setSubmitLoading(true);

        dispatch(setReduxNotification({
            status: '',
            message: "",
            isVisible: false
        }));

        const updateResponse: any = await updateProfilePhoneNumber(values.phoneNumber, token);

        setSubmitLoading(false);

        if (updateResponse.data && updateResponse.data.success) {

            dispatch(setReduxNotification({
                status: 'success',
                message: "اطلاعات با موفقیت ارسال شد",
                isVisible: true
            }));

        } else {

            let message = "";

            if (updateResponse?.response?.data?.error?.message) {

                message = updateResponse.response.data.error.message;
            }
            dispatch(setReduxNotification({
                status: 'error',
                message: message,
                isVisible: true
            }));

        }
    }

    const sendVerificationCode = async (phoneNumber: string) => {

        const token = localStorage.getItem('Token');
        if (!token) return;

        setSendVerificationCodeLoading(true);

        dispatch(setReduxNotification({
            status: '',
            message: "",
            isVisible: false
        }));

        const response: any = await sendVerificationSms(phoneNumber, token);
        setSendVerificationCodeLoading(false);
        if (response.data && response.data.success) {

            setOpenModal(true);

        } else {
            dispatch(setReduxNotification({
                status: 'error',
                message: "ارسال اطلاعات ناموفق",
                isVisible: true
            }));

        }
    }

    const verificationSubmit = async (code: string) => {

        const token = localStorage.getItem('Token');
        if (!token) return;

        setSubmitVerificationCodeLoading(true);

        dispatch(setReduxNotification({
            status: '',
            message: "",
            isVisible: false
        }));

        const response: any = await verifySmsCode({ code: code, phoneNumber: savedPhoneNumber, token: token });

        setSubmitVerificationCodeLoading(false);

        if (response.data && response.data.success) {

            dispatch(setReduxNotification({
                status: 'success',
                message: "اطلاعات با موفقیت ارسال شد",
                isVisible: true
            }));

            setOpenModal(false);

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

        }
    }

    const showVerificationFormDelayed = true;

    const theme1 = process.env.THEME === "THEME1";

    return (

        <>

            {!!userAuthentication?.isAuthenticated && <Formik
                validate={() => { return {} }}
                initialValues={initialValues}
                onSubmit={submitHandler}
            >
                {({ errors, touched, isValid, isSubmitting, setFieldValue, values }) => {
                    if (isSubmitting && !isValid) {
                        setTimeout(() => {
                            const formFirstError = document.querySelector(".has-validation-error");
                            if (formFirstError) {
                                formFirstError.scrollIntoView({ behavior: "smooth" });
                            }
                        }, 100)
                    }
                    return (
                        <Form autoComplete='off' >

                            <div className={`grid sm:grid-cols-4 gap-3 mb-2 ${theme1?"lg:w-1/2":""} mb-5`}>
                                <PhoneInput
                                    disabled={!!user?.isPhoneNumberConfirmed}
                                    className="sm:col-span-3"
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
                                    label={t("phone-number") + " (بدون صفر)"}
                                    errorText={errors.phoneNumber}
                                    initialValue={user?.phoneNumber || ""}
                                    showNotConfirmedBadge={!!user?.phoneNumber && user.isPhoneNumberConfirmed === false}
                                />

                                <div>
                                    {!!user?.isPhoneNumberConfirmed || <Button
                                        type="submit"
                                        className="h-10 px-3 rounded w-24 sm:w-full sm:mt-7"
                                        loading={submitLoading}
                                    >
                                        ذخیره
                                    </Button>}
                                </div>

                            </div>

                        </Form>
                    )
                }}
            </Formik>}

            {!!(user?.phoneNumber && user.isPhoneNumberConfirmed === false) && (
                <>
                    <p className="bg-amber-100 text-neutral-500 px-3 text-xs rounded-lg inline-block">
                        <InfoCircle className="w-5 h-5 fill-amber-600 inline-block align-middle rtl:ml-2 ltr:mr-2" />
                        لطفا شماره موبایل خود را از طریق کدی که برای شما ارسال کردیم تایید کنید
                        <button
                            type="button"
                            className="rtl:mr-3 ltr:ml-3 text-sm text-blue-700 cursor-pointer font-semibold"
                            onClick={() => { sendVerificationCode(savedPhoneNumber) }}
                        >
                            ارسال کد {sendVerificationCodeLoading && <Loading className="w-5 h-5 animate-spin fill-blue-400 inline-block align-middle rtl:mr-1 ltr:ml-1" />}
                        </button>
                    </p>

                    <ModalPortal
                        show={openModal}
                        selector='modal_portal'
                    >

                        <div className='fixed top-0 left-0 h-screen w-screen'>
                            <div className='absolute left-0 right-0 top-0 bottom-0 bg-black/75 backdrop-blur'
                                onClick={() => { setOpenModal(false) }}
                            />

                            <div className={`absolute rounded-md flex flex-col gap-4 items-center top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-h-screen overflow-y-auto p-10 sm:w-520 bg-white duration-200 transition-all ${showVerificationFormDelayed ? "scale-100 opacity-100" : "scale-90 opacity-0"}`} >
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
                                    <b className='font-semibold text-base block mt-2' dir="ltr"> {savedPhoneNumber?.replace("+98", "0")} </b>
                                </p>

                                <OtpInput
                                    onChange={(e: string) => {
                                        if (!enteredCode && e) {
                                            verificationSubmit(persianNumbersToEnglish(e));
                                        }
                                        setEnteredCode(persianNumbersToEnglish(e));
                                    }}
                                />

                                <Button
                                    type='button'
                                    className='h-12 w-full sm:w-44 shrink-0 mt-4'
                                    loading={submitVerificationCodeLoading}
                                    onClick={() => { verificationSubmit(enteredCode) }}
                                >
                                    ثبت
                                </Button>

                                <button
                                    type='button'
                                    onClick={() => { sendVerificationCode(savedPhoneNumber) }}
                                    className='text-sm text-blue-700 hover:text-blue-600'
                                >
                                    ارسال مجدد کد {sendVerificationCodeLoading && <Loading className="w-5 h-5 animate-spin fill-blue-400 inline-block align-middle rtl:mr-1 ltr:ml-1" />}
                                </button>

                            </div>

                        </div>

                    </ModalPortal>

                </>
            )}
        </>

    )
}

export default PhoneActivationForm;