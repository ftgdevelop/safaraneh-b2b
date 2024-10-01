import { useState } from 'react'
import Button from "@/modules/shared/components/ui/Button";
import PhoneInput from "@/modules/shared/components/ui/PhoneInput";
import { Form, Formik } from "formik";
import FormikField from '@/modules/shared/components/ui/FormikField';
import { validateRequied } from '@/modules/shared/helpers/validation';
import { useAppDispatch } from '@/modules/shared/hooks/use-store';
import { setReduxUser,setAuthenticationDone } from '../store/authenticationSlice';
import { getTenant, loginWithPassword } from '../actions';
import { setReduxNotification } from '@/modules/shared/store/notificationSlice';
import { useRouter } from 'next/router';

const LognWithPassword: React.FC = () => {

    const dispatch = useAppDispatch();

    const router = useRouter();

    const tenantName = router.query?.tenantName as string || "";

    const [loading, setLoding] = useState<boolean>(false);

    const onSuccessLogin = (response: any) => {
        const token = response.data?.result?.accessToken
        localStorage.setItem('Token', token);

        dispatch(setReduxUser({
            isAuthenticated: true,
            user: response.data?.result?.user,
            getUserLoading: false
        }));       

    }

    const submitHandler = async (values: {
        phoneNumber: string;
        password: string;
        username?: string;
    }) => {

        if (!values.phoneNumber) return;
        
        setLoding(true);
        
        localStorage.removeItem('S-TenantId');
        const getTenantResponse: any = await getTenant(tenantName || values.username!);
        if (!(getTenantResponse?.data?.result?.id)){
            
            dispatch(setReduxNotification({
                status: 'error',
                message: "شناسه کاربری یافت نشد.",
                isVisible: true
            }));
            
            setLoding(false);

            return;
        }

        dispatch(setReduxUser({
            isAuthenticated: false,
            user: {},
            getUserLoading: true
        }));

        const tenantId = getTenantResponse.data.result.id;

        localStorage.setItem('S-TenantId', tenantId)

        const response: any = await loginWithPassword({
            password: values.password,
            emailOrPhoneNumber: (values.phoneNumber) as string,
            tenantId: tenantId
        });
        setLoding(false);

        if (response.status == 200) {

            onSuccessLogin(response);

        } else {

            dispatch(setReduxUser({
                isAuthenticated: false,
                user: {},
                getUserLoading: false
            }));
            
            if(response?.response?.data?.error?.message){
                dispatch(setReduxNotification({
                    status: 'error',
                    message: response.response.data.error.message,
                    isVisible: true
                }))
            }
        }

        dispatch(setAuthenticationDone());

    }

    return (
        <div className='p-5'>
            <h3 className="text-2xl font-semibold leading-none tracking-tight mt-3">ورود با کلمه عبور</h3>
            <Formik
                validate={() => { return {} }}
                initialValues={{ password: "", phoneNumber: "", username: "" }}
                onSubmit={submitHandler}
            >
                {({ errors, touched, setFieldValue, values }) => {
                    return (

                        <Form className='mt-10 text-sm' autoComplete='off' >

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

                            <FormikField
                                isPassword
                                className="mb-5"
                                labelIsSimple
                                showRequiredStar
                                setFieldValue={setFieldValue}
                                errorText={errors.password}
                                id='password'
                                name='password'
                                isTouched={touched.password}
                                label="کلمه عبور"
                                maxLength={10}
                                validateFunction={(value: string) => validateRequied(value, 'کلمه عبور را وارد نمایید!')}
                                value={values.password}
                            />

                            <Button
                                type="submit"
                                className="h-12 w-full"
                                loading={loading}
                            >
                                ورود
                            </Button>

                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default LognWithPassword;