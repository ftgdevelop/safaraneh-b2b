import DatePicker from "@/modules/shared/components/ui/DatePicker";
import FormikField from "@/modules/shared/components/ui/FormikField"
import PhoneInput from "@/modules/shared/components/ui/PhoneInput";
import TimePicker from "@/modules/shared/components/ui/TimePicker";
import { validateEmail, validateNationalId, validateRequied, validateRequiedPersianAndEnglish } from "@/modules/shared/helpers/validation";
import { Field, FormikErrors, FormikTouched } from "formik";
import { useTranslation } from "next-i18next";

type Props = {
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{
        reserver: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
            userName: string;
            gender: boolean;
        };
        originName: string;
        destinationName: string;
        airline: string;
        flightNumber: string;
        flightDate: string;
        flightTime: string;
    }>>;
    errors: FormikErrors<{
        reserver: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
            userName: string;
            gender: boolean;
        };
        originName: string;
        destinationName: string;
        airline: string;
        flightNumber: string;
        flightDate: string;
        flightTime: string;
    }>;
    touched: FormikTouched<{
        reserver: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
            userName: string;
            gender: boolean;
        };
        originName: string;
        destinationName: string;
        airline: string;
        flightNumber: string;
        flightDate: string;
        flightTime: string;
    }>;
    values: {
        reserver: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
            userName: string;
            gender: boolean;
        };
        originName: string;
        destinationName: string;
        airline: string;
        flightNumber: string;
        flightDate: string;
        flightTime: string;
    };
    reserverIsPassenger: boolean;
}

const CipReserverInformation: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const theme2 = process.env.THEME === "THEME2";

    const { setFieldValue, errors, touched, values } = props;

    return (
        <div className='py-2 md:py-5'>
            <div className={`grid md:grid-cols-2 gap-4 lg:grid-cols-3 ${theme2?"my-5":"bg-white rounded-lg p-5 border border-neutral-300"}`}>

                <strong className={`font-semibold text-lg block sm:col-span-2 lg:col-span-3`}> {t('reserver-information')} </strong>

                <div role="group" className="md:col-span-2 lg:col-span-1 leading-4" >
                    <label className='block text-xs mb-1' > جنسیت </label>
                    <label className='inline-flex items-center gap-1 rtl:ml-4 ltr:mr-4'>
                        <Field
                            type="radio"
                            className="text-xs"
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
                    <label className='inline-flex items-center gap-1'>
                        <Field
                            type="radio"
                            className="text-xs"
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
                    value={values.reserver.firstName}
                    onChange={(value: string) => {
                        if (props.reserverIsPassenger) {
                            setFieldValue(`passengers.${0}.firstName`, value, true)
                        }
                    }}
                />

                <FormikField
                    setFieldValue={setFieldValue}
                    errorText={errors.reserver?.lastName as string}
                    id='lastName'
                    name='reserver.lastName'
                    isTouched={touched.reserver?.lastName}
                    label={t('last-name')}
                    validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, t('please-enter-last-name'), t('just-english-persian-letter-and-space'))}
                    value={values.reserver.lastName}
                    onChange={(value: string) => {
                        if (props.reserverIsPassenger) {
                            setFieldValue(`passengers.${0}.lastName`, value, true)
                        }
                    }}
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
                    label={t("phone-number")}
                    errorText={errors.reserver?.phoneNumber}
                //initialValue='+989374755674'
                />

            </div>
        </div>
    )
}

export default CipReserverInformation;