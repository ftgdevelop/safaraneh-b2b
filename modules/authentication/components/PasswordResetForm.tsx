import { useState } from 'react';
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from 'next/router';

import FormikField from '@/modules/shared/components/ui/FormikField';
import Button from '@/modules/shared/components/ui/Button';
import { RightCaretBold } from "@/modules/shared/components/ui/icons";

import { useAppDispatch } from '@/modules/shared/hooks/use-store';
import { resetPassword } from '../actions';
import { setReduxNotification } from '@/modules/shared/store/notificationSlice';

const PasswordResetForm: React.FC = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const submitHandler = async (values: {
        repeatPassword: string;
        password: string;
    }) => {

        const { password, repeatPassword } = values;
        const { userId, code } = router.query;
        
        const localStorageTenant = localStorage?.getItem('S-TenantId');

        if ( localStorageTenant && password && repeatPassword && password.length >= 6 && password === repeatPassword && userId && code) {

            setSubmitLoading(true);

            const response: any = await resetPassword({
                code: code as string, password: password, userId: userId as string, tenant: +localStorageTenant
            });

            if (response.data?.success) {

                dispatch(setReduxNotification({
                    status: 'success',
                    message: "کلمه عبور جدید با موفقیت ذخیره شد",
                    isVisible: true
                }));
                router.push("/signin?type=withPassword");
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

    const validatePassword = (value: string, equalTo?: string) => {
        let error;
        if (!value) {
            error = "کلمه عبور را وارد نمایید";
        } else if (value.length < 6) {
            error = "کلمه عبور باید حداقل 6 حرف باشد";
        } else if (equalTo && value !== equalTo) {
            error = "تکرار کلمه عبور با کلمه عبور مطابقت ندارد";
        }

        return error;
    }

    return (
        <div className='border border-neutral-300 bg-white rounded-md mb-4 p-5 sm:py-10'>
            <Link href="/signin" className='text-blue-700 hover:text-blue-500 text-sm inline-block mb-5'>
                <RightCaretBold className='w-5 h-5 fill-current inline-block rtl:ml-1 ltr:mr-1 ' />
                برگشت به صفحه ورود
            </Link>

            <div className='text-lg mb-8'> بازنشانی کلمه عبور </div>

            <Formik
                validate={() => { return {} }}
                initialValues={{ password: "", repeatPassword: "" }}
                onSubmit={submitHandler}
            >
                {({ errors, touched, setFieldValue, values }) => {
                    return (

                        <Form autoComplete='off' >

                            <FormikField
                                isPassword
                                labelIsSimple
                                showRequiredStar
                                className="mb-5"
                                setFieldValue={setFieldValue}
                                errorText={errors.password as string}
                                id='password'
                                name='password'
                                isTouched={touched.password}
                                label={"کلمه عبور جدید"}
                                validateFunction={(value: string) => validatePassword(value)}
                                value={values.password!}
                            />

                            <FormikField
                                isPassword
                                labelIsSimple
                                showRequiredStar
                                className="mb-5"
                                setFieldValue={setFieldValue}
                                errorText={errors.repeatPassword as string}
                                id='repeatPassword'
                                name='repeatPassword'
                                isTouched={touched.repeatPassword}
                                label={"تکرار کلمه عبور جدید"}
                                validateFunction={(value: string) => validatePassword(value, values.password)}
                                value={values.repeatPassword!}
                            />


                            <Button
                                type="submit"
                                className="h-12 w-full mt-10 mb-5"
                                loading={submitLoading}
                            >
                                ذخیره
                            </Button>

                        </Form>
                    )
                }}
            </Formik>

        </div>
    )
}

export default PasswordResetForm;