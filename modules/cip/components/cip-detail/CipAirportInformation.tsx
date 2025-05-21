import DatePicker from "@/modules/shared/components/ui/DatePicker";
import FormikField from "@/modules/shared/components/ui/FormikField"
import TimePickerMobiscroll from "@/modules/shared/components/ui/TimePickerMobiscroll";
import { validateRequied } from "@/modules/shared/helpers/validation";
import { FormikErrors, FormikTouched } from "formik";

type Props = {
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{
        originName: string;
        destinationName: string;
        airline: string;
        flightNumber: string;
        flightDate: string;
        flightTime: string;
    }>>;
    errors: FormikErrors<{
        originName: string;
        destinationName: string;
        airline: string;
        flightNumber: string;
        flightDate: string;
        flightTime: string;
    }>;
    touched: FormikTouched<{
        originName: string;
        destinationName: string;
        airline: string;
        flightNumber: string;
        flightDate: string;
        flightTime: string;
    }>;
    values: {
        originName: string;
        destinationName: string;
        airline: string;
        flightNumber: string;
        flightDate: string;
        flightTime: string;
    }
}

const CipAirportInformation: React.FC<Props> = props => {

    const { setFieldValue, errors, touched, values } = props;

    const theme2 = process.env.THEME === "THEME2";

    return (
        <div id="about-travel-section" className="py-2 sm:py-5">
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${theme2?"md:grid-cols-3":"md:grid-cols-4 border border-neutral-300 bg-white rounded-lg p-5"}`}>
                <strong className={`font-semibold text-lg block sm:col-span-2 ${theme2?"md:col-span-3":"md:col-span-4"}`}> اطلاعات سفر </strong>

                <FormikField
                    setFieldValue={setFieldValue}
                    errorText={errors.originName as string}
                    id='originName'
                    name='originName'
                    isTouched={!!touched.originName}
                    label="مبدا"
                    validateFunction={(value: string) => validateRequied(value, "لطفا مبدا را وارد نمایید")}
                    onChange={(value: string) => { setFieldValue('originName', value, true) }}
                    value={values.originName}
                />

                <FormikField
                    setFieldValue={setFieldValue}
                    errorText={errors.destinationName as string}
                    id='destinationName'
                    name='destinationName'
                    isTouched={touched.destinationName}
                    label="مقصد"
                    validateFunction={(value: string) => validateRequied(value, "لطفا مقصد را وارد نمایید")}
                    onChange={(value: string) => { setFieldValue('destinationName', value, true) }}
                    value={values.destinationName}
                />

                <FormikField
                    setFieldValue={setFieldValue}
                    errorText={errors.airline as string}
                    id='airline'
                    name='airline'
                    isTouched={touched.airline}
                    label="شرکت هواپیمایی"
                    validateFunction={(value: string) => validateRequied(value, "لطفا شرکت هواپیمایی را وارد نمایید")}
                    onChange={(value: string) => { setFieldValue('airline', value, true) }}
                    value={values.airline}
                />

                <FormikField
                    setFieldValue={setFieldValue}
                    errorText={errors.flightNumber as string}
                    id='flightNumber'
                    name='flightNumber'
                    isTouched={touched.flightNumber}
                    label="شماره پرواز"
                    validateFunction={(value: string) => validateRequied(value, "لطفا شماره پرواز را وارد نمایید")}
                    onChange={(value: string) => { setFieldValue('flightNumber', value, true) }}
                    value={values.flightNumber}
                />

                <DatePicker
                    min={new Date()}
                    setFieldValue={setFieldValue}
                    label="تاریخ پرواز"
                    errorText={errors.flightDate as string}
                    isTouched={touched.flightDate}
                    fieldClassName="pt-1 text-base"
                    name="flightDate"
                    id="flightDate"
                    initialvalue={values.flightDate}
                    validateFunction={(value: string) => validateRequied(value, "لطفا تاریخ پرواز را وارد نمایید")}
                />

                <TimePickerMobiscroll 
                    label="ساعت پرواز"
                    value={values.flightTime}
                    setFieldValue={setFieldValue}
                    id="flightTime"
                    name="flightTime"
                    errorText={errors.flightTime as string}
                    isTouched={touched.flightTime}
                    validateFunction={(value: string) => validateRequied(value, "لطفا ساعت پرواز را وارد نمایید")}
                />

            </div>
        </div>
    )
}

export default CipAirportInformation;