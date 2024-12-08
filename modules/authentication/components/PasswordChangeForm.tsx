import { useState } from 'react';
import { Form, Formik } from "formik";
import FormikField from '@/modules/shared/components/ui/FormikField';
import Button from '@/modules/shared/components/ui/Button';
import { useAppDispatch } from '@/modules/shared/hooks/use-store';
import { changePassword } from '../actions';
import { setReduxNotification } from '@/modules/shared/store/notificationSlice';
import { setAlertModal } from '@/modules/shared/store/alertSlice';

const PasswordChangeForm: React.FC = () => {

    const dispatch = useAppDispatch();

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const submitHandler = async (values: {
        currentPassword: string;
        newPassword: string;
        repeatPassword: string;
    }) => {

        const { currentPassword, newPassword, repeatPassword } = values;

        if (newPassword && repeatPassword && newPassword.length >= 6 && newPassword === repeatPassword) {

            const token = localStorage.getItem('Token');
            const localStorageTenant = localStorage?.getItem('S-TenantId');
            if (!token || !localStorageTenant) return;

            setSubmitLoading(true);

            const response: any = await changePassword({
                currentPassword: currentPassword,
                newPassword: newPassword,
                token: token,
                tenant: +localStorageTenant
            });

            if (response.data?.success) {

                dispatch(setReduxNotification({
                    status: 'success',
                    message: "کلمه عبور جدید با موفقیت ذخیره شد",
                    isVisible: true
                }));

            } else {

                let message = "ارسال اطلاعات ناموفق";

                if (response?.response?.data?.error?.message) {

                    message = response.response.data.error.message;
                }
                dispatch(setAlertModal({
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
        <Formik
            validate={() => { return {} }}
            initialValues={{ currentPassword: "", newPassword: "", repeatPassword: "" }}
            onSubmit={submitHandler}
        >
            {({ errors, touched, setFieldValue, values }) => {
                return (

                    <Form autoComplete='off' className="sm:w-520" >

                        <FormikField
                            isPassword
                            labelIsSimple
                            showRequiredStar
                            className="mb-5"
                            setFieldValue={setFieldValue}
                            errorText={errors.currentPassword as string}
                            id='currentPassword'
                            name='currentPassword'
                            isTouched={touched.currentPassword}
                            label={"کلمه عبور فعلی"}
                            validateFunction={(value: string) => validatePassword(value)}
                            value={values.currentPassword!}
                        />

                        <FormikField
                            isPassword
                            labelIsSimple
                            showRequiredStar
                            className="mb-5"
                            setFieldValue={setFieldValue}
                            errorText={errors.newPassword as string}
                            id='newPassword'
                            name='newPassword'
                            isTouched={touched.newPassword}
                            label={"کلمه عبور جدید"}
                            validateFunction={(value: string) => validatePassword(value)}
                            value={values.newPassword!}
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
                            validateFunction={(value: string) => validatePassword(value, values.newPassword)}
                            value={values.repeatPassword!}
                        />

                        <Button
                            type="submit"
                            className="h-10 px-8 rounded"
                            loading={submitLoading}
                        >
                            تغییر کلمه عبور
                        </Button>

                    </Form>
                )
            }}
        </Formik>
    )
}

export default PasswordChangeForm;