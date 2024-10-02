import Button from "@/modules/shared/components/ui/Button";
import FormikField from "@/modules/shared/components/ui/FormikField";
import { validateEmail } from "@/modules/shared/helpers/validation";
import { useAppDispatch, useAppSelector } from "@/modules/shared/hooks/use-store";
import { Form, Formik } from "formik";
import { useTranslation } from "next-i18next";
import { sendEmailActivation, updateProfileEmail } from "../../actions";
import { useState } from "react";
import { setReduxNotification } from "@/modules/shared/store/notificationSlice";
import { InfoCircle, Loading, Tik } from "@/modules/shared/components/ui/icons";

const EmailActivationForm = () => {

    const { t } = useTranslation('common');

    const dispatch = useAppDispatch();

    const userAuthentication = useAppSelector(state => state.authentication);
    const user = userAuthentication.user;

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [verificationCodeLoading, setVerificationCodeLoading] = useState<boolean>(false);

    const [savedEmailAddress, setSavedEmailAddress] = useState<string>(user?.emailAddress || '');

    let initialValues = {
        emailAddress: "",
    }

    if (userAuthentication?.isAuthenticated) {
        initialValues = {
            emailAddress: user?.emailAddress || ""
        }
    }

    const submitHandler = async (values: { emailAddress: string }) => {

        const token = localStorage.getItem('Token');
        const localStorageTenant = localStorage?.getItem('S-TenantId');
        if (!token || !localStorageTenant) return;

        setSubmitLoading(true);

        dispatch(setReduxNotification({
            status: '',
            message: "",
            isVisible: false
        }));

        const updateResponse: any = await updateProfileEmail(values.emailAddress, token, +localStorageTenant);

        setSubmitLoading(false);

        if (updateResponse.data && updateResponse.data.success) {

            setSavedEmailAddress(values.emailAddress);

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

    const emailVerificationLink = async (emailAddress: string) => {

        const token = localStorage.getItem('Token');
        const localStorageTenant = localStorage?.getItem('S-TenantId');
        if (!token || !localStorageTenant) return;

        setVerificationCodeLoading(true);

        dispatch(setReduxNotification({
            status: '',
            message: "",
            isVisible: false
        }));

        const response: any = await sendEmailActivation(emailAddress, token, +localStorageTenant);
        setVerificationCodeLoading(false);

        if (response.data && response.data.success) {

            dispatch(setReduxNotification({
                status: 'success',
                message: "ایمیل تایید برای شما ارسال شد",
                isVisible: true
            }))

        } else {
            dispatch(setReduxNotification({
                status: 'error',
                message: "ارسال اطلاعات ناموفق",
                isVisible: true
            }));

        }
    }

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
                        <Form autoComplete='off' className=" mb-5">


                            <div className={`grid sm:grid-cols-4 gap-3 mb-2 ${theme1?"lg:w-1/2":""}`}>
                                <FormikField
                                    disabled={!!user?.isEmailConfirmed}
                                    labelIsSimple
                                    showRequiredStar
                                    className="font-sans sm:col-span-3"
                                    setFieldValue={setFieldValue}
                                    errorText={errors.emailAddress as string}
                                    id='emailAddress'
                                    name='emailAddress'
                                    isTouched={touched.emailAddress}
                                    label={t('email')}
                                    validateFunction={(value: string) => validateEmail({ value: value, reqiredMessage: "ایمیل خود را وارد نمایید!", invalidMessage: t('invalid-email') })}
                                    value={values.emailAddress!}
                                    showNotConfirmedBadge={!!user?.emailAddress && !user.isEmailConfirmed}
                                />

                                <div>
                                    {user?.isEmailConfirmed ? (
                                        <span className="text-green-700 text-xs inline-flex items-center sm:mt-8">
                                            <Tik className="fill-current w-4 h-4 rtl:ml-1 ltr:mr-1" />
                                             تایید شده
                                        </span>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="h-10 px-3 rounded w-24 sm:w-full sm:mt-7"
                                            loading={submitLoading}
                                        >
                                            ذخیره
                                        </Button>
                                    )
                                    }
                                </div>

                            </div>


                            {!!(user?.emailAddress && !user.isEmailConfirmed) && <p className="bg-amber-100 text-neutral-500 px-3 text-xs rounded-lg inline-block">
                                <InfoCircle className="w-5 h-5 fill-amber-600 inline-block align-middle rtl:ml-2 ltr:mr-2" />
                                {t('confirm-email')}
                                <button
                                    type="button"
                                    className="rtl:mr-3 ltr:ml-3 text-sm text-blue-700 cursor-pointer font-semibold outline-none"
                                    onClick={() => { emailVerificationLink(savedEmailAddress) }}
                                >
                                    ارسال مجدد کد {verificationCodeLoading && <Loading className="w-5 h-5 animate-spin fill-blue-400 inline-block align-middle rtl:mr-1 ltr:ml-1" />}
                                </button>
                            </p>}

                        </Form>
                    )
                }}
            </Formik>}

        </>

    )
}

export default EmailActivationForm;