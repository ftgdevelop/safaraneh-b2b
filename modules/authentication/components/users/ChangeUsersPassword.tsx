import Button from "@/modules/shared/components/ui/Button"
import FormikField from "@/modules/shared/components/ui/FormikField"
import { validateRequied } from "@/modules/shared/helpers/validation"
import { useAppDispatch } from "@/modules/shared/hooks/use-store"
import { setReduxError } from "@/modules/shared/store/errorSlice"
import { Form, Formik } from "formik"
import React, { useState } from "react"
import { resetUsersPassword } from "../../actions"
import { setReduxNotification } from "@/modules/shared/store/notificationSlice"

type Props = {
    userFullName: string;
    closeModal: () => void;
    userId: number;
}

const ChangeUsersPassword: React.FC<Props> = props => {

    const dispatch = useAppDispatch();

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const submitHandler = async (values:{password:string,confirm: string; }) => {
        const localStorageToken = localStorage.getItem('Token');
        const localStorageTenantId = localStorage.getItem('S-TenantId');

        if( localStorageToken && localStorageTenantId && values.password && values.password === values.confirm){
            setSubmitLoading(true);
        
            const response: any = await resetUsersPassword({
                tenantId: +localStorageTenantId,
                token: localStorageToken,
                password: values.password,
                userId: props.userId
            });

            setSubmitLoading(false);

            if(response.data?.result){
                dispatch(setReduxNotification({
                    status: 'success',
                    message: "کلمه عبور جدید با موفقیت ذخیره شد",
                    isVisible: true
                }));
                props.closeModal();
            }

        }else{
            
            dispatch(setReduxError({
                title: "خطا",
                message: "کلمه عبور و تکرار آن مطابقت ندارد",
                isVisible: true
            }))
        }
    }

    return (
        <>

            <h5 className='text-xl font-semibold mb-4'> تغییر رمز عبور </h5>

            <p className='mb-5 md:mb-8'> کلمه عبور جدید کاربر "{props.userFullName}" را وارد کنید. </p>

            <Formik
                validate={() => { return {} }}
                initialValues={{ password: "", confirm: "" }}
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
                                //onChange={() => { setError(false); }}
                                setFieldValue={setFieldValue}
                                errorText={errors.password as string}
                                id='password'
                                name='password'
                                isTouched={touched.password}
                                label={"کلمه عبور جدید"}
                                validateFunction={(value: string) => validateRequied(value, "کلمه عبور جدید کاربر را وارد نمایید!")}
                                value={values.password!}
                            />

                            <FormikField
                                isPassword
                                labelIsSimple
                                showRequiredStar
                                className="mb-5"
                                //onChange={() => { setError(false); }}
                                setFieldValue={setFieldValue}
                                errorText={errors.confirm as string}
                                id='confirm'
                                name='confirm'
                                isTouched={touched.confirm}
                                label={"کلمه عبور جدید"}
                                validateFunction={(value: string) => validateRequied(value, "کلمه عبور جدید کاربر را وارد نمایید!")}
                                value={values.confirm!}
                            />

                            <div className="flex gap-4 mt-10 mb-5">

                                <Button
                                    type="button"
                                    color="gray"
                                    className="h-12 w-full"
                                    onClick={props.closeModal}
                                >
                                    لغو
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-12 w-full"
                                    loading={submitLoading}
                                >
                                    ثبت
                                </Button>
                            </div>

                        </Form>
                    )
                }}
            </Formik>
        </>

    )
}

export default ChangeUsersPassword;