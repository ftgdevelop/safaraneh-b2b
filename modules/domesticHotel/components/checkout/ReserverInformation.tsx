import { UserInformation } from "@/modules/authentication/types/authentication";
import FormikField from "@/modules/shared/components/ui/FormikField";
import PhoneInput from "@/modules/shared/components/ui/PhoneInput";
import RadioInputField from "@/modules/shared/components/ui/RadioInputField";
import { validateEmail, validateNationalId, validateRequiedPersianAndEnglish } from "@/modules/shared/helpers/validation";
import { useAppSelector } from "@/modules/shared/hooks/use-store";
import { Field, FormikErrors, FormikTouched } from "formik";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";

type Props = {
    errors: FormikErrors<{
        reserver: {
            gender: boolean;
            firstName: string;
            lastName: string;
            email: string;
            nationalId: string;
            phoneNumber: string;
        };
    }>;
    touched: FormikTouched<{
        reserver: {
            gender: boolean;
            firstName: string;
            lastName: string;
            email: string;
            nationalId: string;
            phoneNumber: string;
        };
    }>;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{
        reserver: {
            gender: boolean;
            firstName: string;
            lastName: string;
            email: string;
            nationalId: string;
            phoneNumber: string;
            extraBed: number;
        };
    }>>;
    values: {
        reserver: {
            gender: boolean;
            firstName: string;
            lastName: string;
            email: string;
            nationalId: string;
            phoneNumber: string;
        };
        passengers: {
            gender: boolean;
            firstName: string;
            lastName: string;
            roomNumber: number;
            extraBed: number;
        }[];
    }
    reserverIsPassenger?: boolean;
}

const ReserverInformation: React.FC<Props> = props => {

    const theme1 = process.env.THEME === "THEME1";

    const { t } = useTranslation('common');

    const { errors, touched, setFieldValue, values } = props;

    const user: UserInformation | undefined = useAppSelector(state => state.authentication.isAuthenticated ? state.authentication.user : undefined);

    useEffect(() => {
        if (user) {
            setFieldValue(`reserver.gender`, user.gender, true);
            if (!values.reserver.firstName) {
                setFieldValue(`reserver.firstName`, user.firstName, true);
            }
            if (!values.reserver.lastName) {
                setFieldValue(`reserver.lastName`, user.lastName, true);
            }
            if(!values.reserver.nationalId){
                setFieldValue(`reserver.nationalId`, user.nationalId || "", true);
            }

            if(!values.reserver.phoneNumber){
                setFieldValue(`reserver.phoneNumber`, user.phoneNumber || "", true);
            }
            if(!values.reserver.email){
                setFieldValue(`reserver.email`, user.emailAddress || "", true);
            }
        }
    }, [user]);

    return (
        <>
            <h4 className='font-semibold mb-4 text-lg'>
                {t('reserver-information')}
            </h4>

            <div className={`grid gap-x-2 gap-y-5 ${theme1?" md:grid-cols-2 lg:grid-cols-3":"grid-cols-1"}`}>
                <div role="group" className={`leading-4 ${theme1?"md:col-span-2 lg:col-span-1":""}`} >
                    <label className='block text-xs mb-2' > جنسیت </label>
                    <label className='inline-flex items-center gap-1 rtl:ml-4 ltr:mr-4 cursor-pointer'>
                        <RadioInputField
                            onChange={(e: any) => {
                                const val = e.target.checked;
                                setFieldValue('reserver.gender', val);
                                if (props.reserverIsPassenger) {
                                    setFieldValue(`passengers.${0}.gender`, val, true)
                                }
                            }}
                            checked={values.reserver.gender}
                        />
                        مرد
                    </label>
                    <label className='inline-flex items-center gap-1 cursor-pointer'>

                        <RadioInputField
                            onChange={(e: any) => {
                                const val = !e.target.checked;
                                setFieldValue('reserver.gender', val);
                                if (props.reserverIsPassenger) {
                                    setFieldValue(`passengers.${0}.gender`, val, true)
                                }
                            }}
                            checked={!values.reserver.gender}
                        />

                        زن
                    </label>
                </div>

                <FormikField
                    setFieldValue={setFieldValue}
                    errorText={errors.reserver?.firstName as string}
                    id='firstName'
                    name='reserver.firstName'
                    isTouched={touched.reserver?.firstName}
                    label={t('first-name')}
                    validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, t('please-enter-first-name'), t('just-english-persian-letter-and-space'))}
                    onChange={(value: string) => {
                        if (props.reserverIsPassenger) {
                            setFieldValue(`passengers.${0}.firstName`, value, true)
                        }
                    }}
                    value={values.reserver.firstName}
                />

                <FormikField
                    setFieldValue={setFieldValue}
                    errorText={errors.reserver?.lastName as string}
                    id='lastName'
                    name='reserver.lastName'
                    isTouched={touched.reserver?.lastName}
                    label={t('last-name')}
                    validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, t('please-enter-last-name'), t('just-english-persian-letter-and-space'))}
                    onChange={(value: string) => {
                        if (props.reserverIsPassenger) {
                            setFieldValue(`passengers.${0}.lastName`, value, true)
                        }
                    }}
                    value={values.reserver.lastName}
                />


                <PhoneInput
                    defaultCountry={
                        {
                            countryCode: "ir",
                            dialCode: "98",
                            format: "... ... ...."
                        }
                    }
                    onChange={(v: string) => {
                        setFieldValue('reserver.phoneNumber', v)
                    }}
                    name={'reserver.phoneNumber'}
                    isTouched={touched.reserver?.phoneNumber}
                    label={t("phone-number") + " (بدون صفر)"}
                    errorText={errors.reserver?.phoneNumber}
                    initialValue={values.reserver.phoneNumber || ""}
                />

                <FormikField
                    setFieldValue={setFieldValue}
                    errorText={errors.reserver?.nationalId as string}
                    id='nationalId'
                    name='reserver.nationalId'
                    isTouched={touched.reserver?.nationalId}
                    label={t('national-code')}
                    maxLength={10}
                    validateFunction={(value: string) => validateNationalId({ value: value, invalidMessage: t('invalid-national-code'), reqiredMessage: t('please-enter-national-code') })}
                    value={values.reserver.nationalId}
                />

                <FormikField
                    setFieldValue={setFieldValue}
                    errorText={errors.reserver?.email as string}
                    id='email'
                    name='reserver.email'
                    isTouched={touched.reserver?.email}
                    label={t('email')}
                    validateFunction={(value: string) => validateEmail({ value: value, invalidMessage: t('invalid-email') })}
                    value={values.reserver.email}
                />
            </div>

        </>
    )
}

export default ReserverInformation;