import Button from "@/modules/shared/components/ui/Button";
import DatePickerSelect from "@/modules/shared/components/ui/DatePickerSelect";
import FormikField from "@/modules/shared/components/ui/FormikField";
import { dateFormat, goBackYears } from "@/modules/shared/helpers";
import { validateNationalId, validateRequiedPersianAndEnglish } from "@/modules/shared/helpers/validation";
import { useAppDispatch, useAppSelector } from "@/modules/shared/hooks/use-store";
import { Field, Form, Formik } from "formik";
import { useTranslation } from "next-i18next";
import { getCurrentUserProfile, updateCurrentUserProfile } from "../../actions";
import { useState } from "react";
import { setReduxNotification } from "@/modules/shared/store/notificationSlice";
import { setReduxUser } from "../../store/authenticationSlice";

type Props = {
    oneBlock?: boolean;
    afterSubmit?: () => void;
}

const ProfileEditForm: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const theme2 = process.env.THEME === "THEME2";

    const dispatch = useAppDispatch();

    const userAuthentication = useAppSelector(state => state.authentication);
    const user = userAuthentication.user;

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    let initialValues = {
        gender: true,
        firstname: "",
        lastname: "",
        timezone: "",
        nationalId: "",
        birthDay: "",
        nationalityId: "",
        isNewsLetter: false
    }

    if (userAuthentication?.isAuthenticated) {
        initialValues = {
            gender: user?.gender === false ? false : true,
            firstname: user?.firstName || "",
            lastname: user?.lastName || "",
            timezone: "",
            nationalId: user?.nationalId || "",
            birthDay: user?.birthDay ? dateFormat(new Date(user.birthDay)) : "",
            nationalityId: user?.nationalityId || "",
            isNewsLetter: user?.isNewsletter || false,
        }
    }

    const refreshUserData = async () => {
        const token = localStorage?.getItem('Token');
        const localStorageTenant = localStorage?.getItem('S-TenantId');
        if (token && localStorageTenant) {
          const getUserData = async () => {
            dispatch(setReduxUser({
              isAuthenticated: false,
              user: {},
              getUserLoading: true
            }));
    
            const response: any = await getCurrentUserProfile(token, +localStorageTenant);
    
            if (response && response.status === 200) {
              dispatch(setReduxUser({
                isAuthenticated: true,
                user: response.data?.result,
                getUserLoading: false
              }));
            } else {
              dispatch(setReduxUser({
                isAuthenticated: false,
                user: {},
                getUserLoading: false
              }));
            }
    
          }
    
          getUserData();
        }
    }

    const submitHandler = async (parameters: any) => {

        const token = localStorage.getItem('Token');
        const localStorageTenant = localStorage?.getItem('S-TenantId');
        if (!token || !localStorageTenant) return;

        const params = {
            ...parameters,
            birthDay: new Date(parameters.birthDay)
        }
        setSubmitLoading(true);

        dispatch(setReduxNotification({
            status: '',
            message: "",
            isVisible: false
        }));

        const updateResponse: any = await updateCurrentUserProfile(params, token, +localStorageTenant);
        setSubmitLoading(false);

        if (updateResponse.data && updateResponse.data.success) {

            dispatch(setReduxNotification({
                status: 'success',
                message: "اطلاعات با موفقیت ارسال شد",
                isVisible: true
            }));
            
            refreshUserData();

            if(props.afterSubmit){
                props.afterSubmit();
            }

        } else {
            dispatch(setReduxNotification({
                status: 'error',
                message: "ارسال اطلاعات ناموفق",
                isVisible: true
            }));

        }
    }

    const maximumBirthDate = dateFormat(goBackYears(new Date(), 12));
    const minimumBirthDate = dateFormat(goBackYears(new Date(), 100));

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

                            <div role="group" className="mb-4" >
                                <label className='block text-xs mb-1' > جنسیت </label>
                                <label className='inline-flex items-center gap-1 rtl:ml-4 ltr:mr-4'>
                                    <Field
                                        type="radio"
                                        className="text-xs"
                                        onChange={(e: any) => {
                                            const val = e.target.checked;
                                            setFieldValue('gender', val);
                                        }}
                                        checked={values.gender}
                                    />
                                    مرد
                                </label>
                                <label className='inline-flex items-center gap-1'>
                                    <Field
                                        type="radio"
                                        className="text-xs"
                                        onChange={(e: any) => {
                                            const val = !e.target.checked;
                                            setFieldValue('gender', val);
                                        }}
                                        checked={!values.gender}
                                    />
                                    زن
                                </label>
                            </div>

                            <div className={`grid gap-4 mb-5 ${props.oneBlock?"":"sm:grid-cols-2"}`}>

                                <FormikField
                                    labelIsSimple
                                    showRequiredStar
                                    setFieldValue={setFieldValue}
                                    errorText={errors.firstname as string}
                                    id='firstname'
                                    name='firstname'
                                    isTouched={touched.firstname}
                                    label={t('first-name')}
                                    validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, t('please-enter-first-name'), t('just-english-persian-letter-and-space'))}
                                    onChange={(value: string) => { setFieldValue('firstname', value, true) }}
                                    value={values.firstname}
                                />

                                <FormikField
                                    labelIsSimple
                                    showRequiredStar
                                    setFieldValue={setFieldValue}
                                    errorText={errors.lastname as string}
                                    id='lastname'
                                    name='lastname'
                                    isTouched={touched.lastname}
                                    label={t('last-name')}
                                    validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, t('please-enter-first-name'), t('just-english-persian-letter-and-space'))}
                                    onChange={(value: string) => { setFieldValue('lastname', value, true) }}
                                    value={values.lastname}
                                />

                                <FormikField
                                    labelIsSimple
                                    setFieldValue={setFieldValue}
                                    errorText={errors.nationalId as string}
                                    id='nationalId'
                                    name='nationalId'
                                    isTouched={touched.nationalId}
                                    label={t('national-code')}
                                    maxLength={10}
                                    validateFunction={(value: string) => validateNationalId({ value: value, invalidMessage: t('invalid-national-code') })}
                                    value={values.nationalId}
                                    onChange={(value: string) => { setFieldValue('nationalId', value, true) }}
                                />

                                <div>

                                    <DatePickerSelect
                                        labelIsSimple
                                        max={maximumBirthDate}
                                        min={minimumBirthDate}
                                        value={user?.birthDay ? dateFormat(new Date(user?.birthDay)) : ""}
                                        shamsi={true}
                                        label="تاریخ تولد"
                                        descending
                                        onChange={value => {setFieldValue('birthDay', value);}}
                                    />
                                </div>

                            </div>

                            <Button
                                type="submit"
                                className={`h-10 px-8 rounded ${theme2?"mx-auto  mt-8":""}`}
                                loading={submitLoading}
                            >
                                ذخیره
                            </Button>

                        </Form>
                    )
                }}
            </Formik>}

        </>

    )
}

export default ProfileEditForm;