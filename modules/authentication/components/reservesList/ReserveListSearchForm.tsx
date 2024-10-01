import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Field, Form, Formik } from 'formik';
import FormikField from '@/modules/shared/components/ui/FormikField';
// import DatePickerModern from '@/modules/shared/components/ui/DatePickerModern';
import Button from '@/modules/shared/components/ui/Button';
import DatePickerMobiscroll from '@/modules/shared/components/ui/DatePickerMobiscroll';
import { localeFa } from '@mobiscroll/react';

type Props = {
    submitHandle: (values: { FromReturnTime?: string, ToReturnTime?: string, reserveId: string, type: string }) => void;
}

const ReserveListSearchForm: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const [locale, setLocale] = useState<any>(localeFa);
    
    const theme2 = process.env.THEME === "THEME2";

    const initialValues = {
        FromReturnTime: "",
        ToReturnTime: "",
        reserveId: "",
        type: ""
    }

    return (

        <Formik
            validate={() => { return {} }}
            initialValues={initialValues}
            onSubmit={props.submitHandle}
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

                    <Form className='grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mb-6' autoComplete='off' >

                        <div className='sm:col-span-2 lg:col-span-5 text-sm'> جستجوی سفارش </div>

                        <FormikField
                            labelIsSmall
                            labelIsSimple
                            setFieldValue={setFieldValue}
                            errorText={errors.reserveId}
                            id='reserveId'
                            name='reserveId'
                            isTouched={touched.reserveId}
                            label={t('شماره سفارش')}
                            value={values.reserveId}
                        />

                        <div className="relative">
                            <label className="block leading-4 mb-2 text-sm">
                                نوع سفارش
                            </label>
                            <Field
                                name="type"
                                as="select"
                                className={`block w-full focus:border-blue-500 ${theme2?"h-13 border-neutral-400":"border-neutral-300 h-10"} px-1 text-sm bg-white border outline-none rounded-lg focus:border-blue-500`}
                            >
                                <option value="">همه</option>
                                <option value="HotelDomestic"> هتل داخلی </option>
                                <option value="Cip"> تشریفات فرودگاهی </option>
                                <option value="FlightDomestic"> پرواز داخلی </option>
                            </Field>
                        </div>

                        <div className="relative modernDatePicker-checkin">
                            <label className="block leading-4 mb-2 text-sm">
                                از تاریخ
                            </label>

                            <DatePickerMobiscroll
                                placeholder='از تاریخ'
                                inputStyle='simple'
                                onChange={a => {
                                    setFieldValue("FromReturnTime", a.value, true)
                                }}
                                rtl
                                locale={locale}
                                onChangeLocale={setLocale}
                            />


                            {/* <DatePickerModern
                                wrapperClassName="block"
                                maximumDate={dateDiplayFormat({ date: new Date().toISOString(), locale: 'en', format: "YYYY-MM-DD" })}
                                inputPlaceholder="از تاریخ"
                                inputClassName="border border-neutral-300 rounded-lg h-10 focus:border-blue-500 outline-none text-base w-full"
                                inputName="FromReturnTime"
                                toggleLocale={() => { setLocale(prevState => prevState === 'fa' ? "en" : "fa") }}
                                locale={locale}
                                onChange={d => { setFieldValue("FromReturnTime", d) }}
                            /> */}
                        </div>

                        <div className="relative modernDatePicker-checkin">
                            <label className="block leading-4 mb-2 text-sm">
                                تا تاریخ
                            </label>

                            <DatePickerMobiscroll
                                placeholder='تا تاریخ'
                                inputStyle='simple'
                                onChange={a => {
                                    setFieldValue("ToReturnTime", a.value, true)
                                }}
                                rtl
                                minDate={values.FromReturnTime}
                                locale={locale}
                                onChangeLocale={setLocale}
                            />

                            {/* <DatePickerModern
                                wrapperClassName="block"
                                maximumDate={dateDiplayFormat({ date: new Date().toISOString(), locale: 'en', format: "YYYY-MM-DD" })}
                                inputPlaceholder="تا تاریخ"
                                inputClassName="border border-neutral-300 rounded-lg h-10 focus:border-blue-500 outline-none text-base w-full"
                                inputName="ToReturnTime"
                                toggleLocale={() => { setLocale(prevState => prevState === 'fa' ? "en" : "fa") }}
                                locale={locale}
                                onChange={d => { setFieldValue("ToReturnTime", d) }}
                            /> */}
                        </div>

                        <div className='flex flex-col justify-end'>
                            <Button
                                type='submit'
                                className={`px-5 ${theme2?"h-13":"h-10"}`}
                            >
                                جستجو
                            </Button>
                        </div>

                    </Form>
                )
            }}
        </Formik>
    )
}

export default ReserveListSearchForm;