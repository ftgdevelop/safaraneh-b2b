import { useTranslation } from 'next-i18next';
import { Form, Formik } from 'formik';
import FormikField from '@/modules/shared/components/ui/FormikField';
import Button from '@/modules/shared/components/ui/Button';
import { localeFa } from '@mobiscroll/react';
import SimpleRangePicker from '@/modules/shared/components/ui/SimpleRangePicker';
import { validateEmail } from '@/modules/shared/helpers/validation';
import PhoneInput from '@/modules/shared/components/ui/PhoneInput';
import { Statuse } from '../../types/hotel';
import CheckboxGroup from '@/modules/shared/components/ui/CheckboxGroup';

type FilterFormValues = {
    creationTimeFrom: string;
    creationTimeTo: string;
    checkinTimeFrom: string;
    checkinTimeTo: string;
    checkoutTimeFrom: string;
    checkoutTimeTo: string;
    reserveId: string;
    email: string;
    lasName: string;
    phoneNumber: string;
    status: Statuse[];
}

type Props = {
    submitHandle: (values: FilterFormValues) => void;
    toggleModal?: () => void;
}

const ReserveListSearchForm: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const initialValues: FilterFormValues = {
        creationTimeFrom: "",
        creationTimeTo: "",
        checkinTimeFrom: "",
        checkinTimeTo: "",
        checkoutTimeFrom: "",
        checkoutTimeTo: "",
        reserveId: "",
        email: "",
        lasName: "",
        phoneNumber: "",
        status: [],
    }
    
    const statusOptions :{
        label: string;
        value: string
    }[] = [
        {value: "Pending" , label: "آماده پرداخت"},
        {value: "Issued" , label: "صادر شده"},
        {value: "Canceled" , label: "لغو شده"},
        {value: "PaymentSuccessful" , label: "پرداخت موفق"},
        {value: "Refunded" , label: "بازپرداخت شده"},
        {value: "Voided" , label: "باطل شده"},
        {value: "Priced" , label: "تغییر قیمت"},
        {value: "WebServiceCancel" , label: "خطا در صدور"},
        {value: "Failed" , label: "ناموفق"},
        {value: "UnConfirmed" , label: "تأیید نشده"}
    ];
    
    return (

        <Formik
            validate={() => { return {} }}
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                props.submitHandle(values);

                if (props.toggleModal) {
                    props.toggleModal();
                }

                setSubmitting(false);
            }}
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

                    <Form className='grid grid-cols-1 gap-3 mb-6' autoComplete='off' >

                        <div className='text-base font-semibold mb-4 text-neutral-400'> فیلتر رزروها </div>

                        <FormikField
                            labelIsSmall
                            labelIsSimple
                            setFieldValue={setFieldValue}
                            errorText={errors.reserveId}
                            id='reserveId'
                            name='reserveId'
                            isTouched={touched.reserveId}
                            label="شماره رزرو"
                            value={values.reserveId}
                        />

                        <SimpleRangePicker
                            name='checkin'
                            label='تاریخ ورود'
                            value={[values.checkinTimeFrom, values.checkinTimeTo]}
                            onChange={a => {
                                if (a.value[0] && a.value[1]) {
                                    setFieldValue("checkinTimeFrom", a.value[0]);
                                    setFieldValue("checkinTimeTo", a.value[1]);
                                }
                            }}
                            rtl
                            locale={localeFa}
                        />

                        <SimpleRangePicker
                            name='checkout'
                            value={[values.checkoutTimeFrom, values.checkoutTimeTo]}
                            label='تاریخ خروج'
                            onChange={a => {
                                if (a.value[0] && a.value[1]) {
                                    setFieldValue("checkoutTimeFrom", a.value[0]);
                                    setFieldValue("checkoutTimeTo", a.value[1]);
                                }
                            }}
                            rtl
                            locale={localeFa}
                        />

                        <SimpleRangePicker
                            name='creationTime'
                            value={[values.creationTimeFrom, values.creationTimeTo]}
                            label='تاریخ رزرو'
                            onChange={a => {
                                if (a.value[0] && a.value[1]) {
                                    setFieldValue("creationTimeFrom", a.value[0]);
                                    setFieldValue("creationTimeTo", a.value[1]);
                                }
                            }}
                            rtl
                            locale={localeFa}
                        />

                        <FormikField
                            labelIsSmall
                            labelIsSimple
                            setFieldValue={setFieldValue}
                            errorText={errors.email}
                            id='email'
                            name='email'
                            isTouched={touched.email}
                            label="ایمیل"
                            validateFunction={(value: string) => validateEmail({ value: value, invalidMessage: t('invalid-email') })}
                            value={values.email}
                        />

                        <FormikField
                            labelIsSmall
                            labelIsSimple
                            setFieldValue={setFieldValue}
                            errorText={errors.lasName}
                            id='lasName'
                            name='lasName'
                            isTouched={touched.lasName}
                            label="نام مهمان"
                            value={values.lasName}
                        />

                        {/* <PhoneInput
                            isOptional
                            labelIsSimple
                            defaultCountry={
                                {
                                    countryCode: "ir",
                                    dialCode: "98",
                                    format: "... ... ...."
                                }
                            }
                            onChange={(v: string) => {
                                setFieldValue('phoneNumber', v);
                            }}
                            name='phoneNumber'
                            isTouched={touched.phoneNumber}
                            label="شماره موبایل"
                            errorText={errors.phoneNumber}
                            className="mb-5"
                        /> */}

                        <label className="z-10 select-none pointer-events-none block leading-4 mb-2 mt-5 text-sm">
                            وضعیت
                        </label>
                        <CheckboxGroup
                            items={statusOptions}
                            onChange={v => { setFieldValue("status", v) }}
                            values={values.status}
                            noMultipleWrappers
                            checkboxClassName='leading-4 pt-0 pb-0'
                        />

                        <Button
                            color='gray'
                            type='button'
                            className="px-5 h-10 mt-6"
                            onClick={() => {

                                setFieldValue('creationTimeFrom', "");
                                setFieldValue('creationTimeTo', "");
                                setFieldValue('checkinTimeFrom', "");
                                setFieldValue('checkinTimeTo', "");
                                setFieldValue('checkoutTimeFrom', "");
                                setFieldValue('checkoutTimeTo', "");
                                setFieldValue('reserveId', "");
                                setFieldValue('email', "");
                                setFieldValue('lasName', "");
                                setFieldValue('phoneNumber', "");
                                setFieldValue('status', []);

                                props.submitHandle(initialValues);

                            }}
                        >
                            حذف فیلترها
                        </Button>

                        <Button
                            type='submit'
                            className={`px-5 h-10`}
                        >
                            جستجو
                        </Button>


                    </Form>
                )
            }}
        </Formik>
    )
}

export default ReserveListSearchForm;