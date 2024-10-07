import Button from "@/modules/shared/components/ui/Button";
import FormikField from "@/modules/shared/components/ui/FormikField";
import { Form, Formik } from "formik";
import { useState } from "react";
import Select from "@/modules/shared/components/ui/Select";
import DatePickerMobiscroll from "@/modules/shared/components/ui/DatePickerMobiscroll";
import { localeFa } from "@mobiscroll/react";
import { Return, Search } from "@/modules/shared/components/ui/icons";

type formParams = {
    CreationTimeFrom: string;
    CreationTimeTo: string;
    CurrencyType: "IRR" | "USD" | "EUR";
    PaymentType: string;
    TransferType: string;
    ReserveId: string;
}

type Props = {
    resetHandler: () => void;
    submitHandler: (params: formParams) => void;
}

const TransactionFilterForm: React.FC<Props> = props => {

    const initialValues:{
        CreationTimeFrom: string;
        CreationTimeTo: string;
        CurrencyType: "IRR" | "USD" | "EUR";
        PaymentType: string;
        TransferType: string;
        ReserveId: string;   
    } = {
        ReserveId: "",
        PaymentType: "",
        TransferType: "",
        CreationTimeFrom: "",
        CreationTimeTo: "",
        CurrencyType: "IRR"
    }

    const [locale, setLocale] = useState<any>(localeFa);

    return (
        <Formik
            validate={() => { return {} }}
            initialValues={initialValues}
            onSubmit={props.submitHandler}
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

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-11 gap-4 mb-5 items-end">

                            <FormikField
                                labelIsSimple
                                setFieldValue={setFieldValue}
                                errorText={errors.ReserveId as string}
                                id='ReserveId'
                                name='ReserveId'
                                isTouched={touched.ReserveId}
                                fieldClassName="text-sm"
                                label="شماره تراکنش"
                                onChange={(value: string) => { setFieldValue('ReserveId', value, true) }}
                                value={values.ReserveId}
                            />

                            <div>
                                <label
                                    className="select-none pointer-events-none block leading-4 mb-3 text-sm"
                                >
                                    نوع پرداخت
                                </label>
                                <Select
                                    onChange={e => { setFieldValue('PaymentType', e, true) }}
                                    value={values.PaymentType}
                                    h10
                                    buttonClassName="w-full px-3 bg-white border outline-none h-10 border-slate-300 focus:border-slate-500 rounded-md text-sm"
                                    items={[
                                        { label: "همه", value: "" },
                                        { label: "واریز", value: "Settle" },
                                        { label: "برداشت", value: "Withdraw" }
                                    ]}
                                />
                            </div>

                            <div className="xl:col-span-3">
                                <label
                                    className="select-none pointer-events-none block leading-4 mb-3 text-sm"
                                >
                                    نوع انتقال
                                </label>

                                <Select
                                    onChange={e => { setFieldValue('TransferType', e, true) }}
                                    value={values.TransferType}
                                    h10
                                    buttonClassName="w-full px-3 bg-white border outline-none h-10 border-slate-300 focus:border-slate-500 rounded-md text-sm"
                                    items={[
                                        { value: "", label: "همه" },
                                        { value: "Online", label: "آنلاین" },
                                        { value: "Account", label: "حساب" },
                                        { value: "Card", label: "کارت" },
                                        { value: "Document", label: "سند" },
                                        { value: "OnlineManualRefund", label: "استرداد دستی آنلاین" },
                                        { value: "IncreaseDepositByPaymentGateway", label: "افزایش موجودی از طریق درگاه پرداخت" },
                                        { value: "DecreaseDepositBySale", label: "کاهش موجودی با فروش" },
                                        { value: "IncreaseDepositByRefund", label: "افزایش موجودی با استرداد" },
                                        { value: "IncreaseDepositByReverse", label: "افزایش موجودی با برگشت" },
                                        { value: "DecreaseDepositByWithdraw", label: "کاهش موجودی با برداشت" },
                                        { value: "IncreaseDeposit", label: "افزایش موجودی" },
                                        { value: "DecreaseDeposit", label: "کاهش موجودی" },
                                        { value: "ManualIncreaseDeposit", label: "افزایش موجودی دستی" },
                                        { value: "ManualDecreaseDeposit", label: "کاهش موجودی دستی" },
                                        { value: "ManualIncreaseDepositByRefund", label: "افزایش موجودی دستی از طریق استرداد" }
                                    ]}
                                />

                            </div>
                            <div className="xl:col-span-2">
                                <label className="select-none pointer-events-none block leading-4 mb-3 text-sm" >
                                    از تاریخ
                                </label>
                                <DatePickerMobiscroll
                                    inputStyle='simple'
                                    onChange={e => {
                                        setFieldValue('CreationTimeFrom', e.value, true)
                                    }}
                                    rtl
                                    locale={locale}
                                    onChangeLocale={setLocale}
                                    value={values.CreationTimeFrom}
                                />
                            </div>
                            <div className="xl:col-span-2">
                                <label className="select-none pointer-events-none block leading-4 mb-3 text-sm" >
                                    تا تاریخ
                                </label>
                                <DatePickerMobiscroll
                                    inputStyle='simple'
                                    onChange={e => {
                                        setFieldValue('CreationTimeTo', e.value, true)
                                    }}
                                    rtl
                                    locale={locale}
                                    onChangeLocale={setLocale}
                                    value={values.CreationTimeTo || undefined}
                                />
                            </div>

                            <div>
                                <label
                                    className="select-none pointer-events-none block leading-4 mb-3 text-sm"
                                >
                                    نوع ارز
                                </label>
                                <Select
                                    onChange={e => { setFieldValue('CurrencyType', e, true) }}
                                    value={values.CurrencyType}
                                    h10
                                    buttonClassName="w-full px-3 bg-white border outline-none h-10 border-slate-300 focus:border-slate-500 rounded-md text-sm"
                                    items={[
                                        { label: "ریال", value: "IRR" },
                                        { label: "دلار", value: "USD" }
                                    ]}
                                />
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    title="فیلتر"
                                    type="submit"
                                    className="h-10 px-2  rounded"
                                >
                                    <Search className="fill-current w-6 h-6" />
                                </Button>
                                <Button
                                    title="بازنشانی"
                                    type="button"
                                    className="h-10 px-2  rounded"
                                    color="gray"
                                    onClick={()=>{
                                        props.resetHandler();
                                        setFieldValue('CreationTimeFrom', "", true);
                                        setFieldValue('CreationTimeTo', "", true);
                                        setFieldValue('CurrencyType', "IRR", true);
                                        setFieldValue('PaymentType', "", true);
                                        setFieldValue('TransferType', "", true);
                                        setFieldValue('ReserveId', "", true);
                                    }}
                                >
                                    <Return className="fill-current w-6 h-6" />
                                </Button>
                            </div>

                        </div>

                    </Form>
                )
            }}
        </Formik>

    )
}

export default TransactionFilterForm;