import FormikField from "@/modules/shared/components/ui/FormikField"
import { validateNationalId, validateRequied, validateRequiedPersianAndEnglish } from "@/modules/shared/helpers/validation";
import { Field, FormikErrors, FormikTouched } from "formik";
import { useTranslation } from "next-i18next";
import { CipAvailabilityItemType, CipFormPassengerItemType } from "../../types/cip";
import { Close } from "@/modules/shared/components/ui/icons";
import DatePickerSelect from "@/modules/shared/components/ui/DatePickerSelect";
import { checkDateIsAfterDate, dateFormat, goBackYears } from "@/modules/shared/helpers";
import CheckboxGroup from "@/modules/shared/components/ui/CheckboxGroup";
import FormerTravelers from "@/modules/shared/components/FormerTravelers";
import { TravelerItem } from "@/modules/shared/types/common";

type Props = {
    passengerItem: CipFormPassengerItemType
    passengerIndex: number;
    decreasePassengers: () => void;
    setReserverIsNotPassenger: () => void;
    isLastItem?: boolean;
    updatePassenger: (property: any, value: any) => void;
    passengerServicesArray: CipAvailabilityItemType['passengerTypeServices'];

    travelers?: TravelerItem[];
    fetchTravelers?: () => void;
    clearTravelers?: () => void;
    fetchingTravelersLoading?: boolean;

    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{
        passengers: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
            userName: string;
            gender: boolean;
            passengerType: "Adult" | "Child";
            passportNumber: string;
            nationalId: string;
            nationality: string;
            birthday: string;
            services: any[]
        }[];
    }>>;
    errors: FormikErrors<{
        passengers: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
            userName: string;
            gender: boolean;
            passengerType: "Adult" | "Child";
            passportNumber: string;
            nationalId: string;
            nationality: string;
            birthday: string;
            services: any[]
        }[];
    }>;
    touched: FormikTouched<{
        passengers: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            email: string;
            userName: string;
            gender: boolean;
            passengerType: "Adult" | "Child";
            passportNumber: string;
            nationalId: string;
            nationality: string;
            birthday: string;
            services: any[]
        }[];
    }>;
    values: {
        passengers: {
            firstName: string;
            lastName: string;
            gender: boolean;
            passengerType: "Adult" | "Child";
            passportNumber: string;
            nationalId: string;
            nationality: string;
            birthday: string;
            services: any[]
        }[];
    };
}

const maximumBirthDate = dateFormat(new Date());
const minimumBirthDate = dateFormat(goBackYears(new Date(), 100));


const CipPassengerItem: React.FC<Props> = props => {

    const { t } = useTranslation('common');
    const { passengerItem, passengerIndex, setReserverIsNotPassenger, updatePassenger, values, errors, touched, setFieldValue } = props;

    const services = props.passengerServicesArray?.find(passengerServicesItem => passengerServicesItem.passengerType === passengerItem.type)?.services;


    const selectTravelerHandle = (traveler: TravelerItem) => {

        setFieldValue(`passengers.${passengerIndex}.gender`, traveler.gender);

        setFieldValue(`passengers.${passengerIndex}.firstName`, traveler.firstname||"", true);
        setFieldValue(`passengers.${passengerIndex}.lastName`, traveler.lastname||"", true);

        setFieldValue(`passengers.${passengerIndex}.birthday`, traveler.birthDate||"", true);

        setFieldValue(`passengers.${passengerIndex}.passportNumber`, traveler.passportNumber || "", true);

        setFieldValue(`passengers.${passengerIndex}.nationalId`, traveler.nationalId || "", true);

        const minBirthDate = dateFormat(goBackYears(new Date(), 2));
        if( traveler.birthDate && checkDateIsAfterDate(new Date(traveler.birthDate) ,new Date(minBirthDate) )){
            setFieldValue(`passengers.${passengerIndex}.passengerType`, "Child", true);
            updatePassenger("type", "Child");
        }else{
            setFieldValue(`passengers.${passengerIndex}.passengerType`, "Adult", true);
            updatePassenger("type", "Adult");
        }

    }


    return (
        <div className="bg-white rounded-lg border border-neutral-300 mt-5">

            <div className="border-b border-neutral-300 px-5 py-2 flex items-center justify-between">
                <h4 className="font-semibold text-sm">مسافر {passengerIndex + 1}</h4>

                <div className="flex gap-4 items-center">

                    {(props.fetchTravelers && props.clearTravelers) && <FormerTravelers
                        fetchTravelers={props.fetchTravelers}
                        fetchingLoading={props.fetchingTravelersLoading || false}
                        clearTravelers={props.clearTravelers}
                        onSelectTraveler={selectTravelerHandle}
                        travelers={props.travelers}
                    />}

                    {!!props.isLastItem && <button type="button" className="bg-red-100 rounded p-1.5" onClick={() => props.decreasePassengers()}>
                        <Close className="w-5 h-5 fill-red-600" />
                    </button>}
                </div>

            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">


                <div className="leading-4" >
                    <label className='block text-xs mb-1' > جنسیت </label>
                    <label className='inline-flex items-center gap-1 rtl:ml-4 ltr:mr-4'>
                        <Field
                            type="radio"
                            className="text-xs"
                            onChange={(e: any) => {
                                const val = e.target.checked;
                                setFieldValue(`passengers.${passengerIndex}.gender`, val);
                                if (setReserverIsNotPassenger) {
                                    setReserverIsNotPassenger();
                                }
                            }}
                            checked={values.passengers[passengerIndex]?.gender}
                        />
                        مرد
                    </label>
                    <label className='inline-flex items-center gap-1'>
                        <Field
                            type="radio"
                            className="text-xs"
                            onChange={(e: any) => {
                                const val = !e.target.checked;
                                setFieldValue(`passengers.${passengerIndex}.gender`, val);
                                if (setReserverIsNotPassenger) {
                                    setReserverIsNotPassenger();
                                }
                            }}
                            checked={!values.passengers[passengerIndex]?.gender}
                        />
                        زن
                    </label>
                </div>


                <div className="leading-4" >
                    <label className='block text-xs mb-1' > نوع مسافر </label>
                    <label className='inline-flex items-center gap-1 rtl:ml-4 ltr:mr-4 text-sm'>
                        <Field
                            type="radio"
                            className="text-xs"
                            onChange={(e: any) => {
                                const val = e.target.checked;
                                setFieldValue(`passengers.${passengerIndex}.passengerType`, val ? "Adult" : "Child");
                                updatePassenger("type", val ? "Adult" : "Child");
                            }}
                            checked={values.passengers[passengerIndex]?.passengerType === "Adult"}
                        />
                        بزرگسال
                    </label>
                    <label className='inline-flex items-center gap-1 text-sm'>
                        <Field
                            type="radio"
                            className="text-xs"
                            onChange={(e: any) => {
                                const val = e.target.checked;
                                setFieldValue(`passengers.${passengerIndex}.passengerType`, val ? "Child" : "Adult");
                                updatePassenger("type", val ? "Child" : "Adult");
                            }}
                            checked={values.passengers[passengerIndex]?.passengerType === "Child"}
                        />
                        کودک زیر ۲ سال
                    </label>
                </div>

                <FormikField
                    setFieldValue={setFieldValue}
                    id={`passengers_${passengerIndex}_firstName`}
                    errorText={errors.passengers ? (errors.passengers[passengerIndex] as FormikErrors<{
                        firstName: string;
                    }>)?.firstName : undefined}
                    name={`passengers.${passengerIndex}.firstName`}
                    isTouched={(touched.passengers && touched.passengers[passengerIndex]) ? touched.passengers[passengerIndex].firstName : false}
                    label={t('first-name')}
                    validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, t('please-enter-passenger-first-name'), t('just-english-persian-letter-and-space'))}
                    value={values.passengers[passengerIndex]?.firstName}
                    onChange={() => {
                        if (!passengerIndex && setReserverIsNotPassenger) {
                            setReserverIsNotPassenger();
                        }
                    }}
                />

                <FormikField
                    setFieldValue={setFieldValue}
                    id={`passengers_${passengerIndex}_lastName`}
                    errorText={errors.passengers ? (errors.passengers[passengerIndex] as FormikErrors<{
                        lastName: string;
                    }>)?.lastName : undefined}
                    name={`passengers.${passengerIndex}.lastName`}
                    isTouched={(touched.passengers && touched.passengers[passengerIndex]) ? touched.passengers[passengerIndex].lastName : false}
                    label={t('last-name')}
                    validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, t('please-enter-passenger-last-name'), t('just-english-persian-letter-and-space'))}
                    value={values.passengers[passengerIndex]?.lastName}
                    onChange={() => {
                        if (!passengerIndex && setReserverIsNotPassenger) {
                            setReserverIsNotPassenger();
                        }
                    }}
                />

                <FormikField
                    setFieldValue={setFieldValue}
                    id={`passengers_${passengerIndex}_nationalId`}
                    errorText={errors.passengers ? (errors.passengers[passengerIndex] as FormikErrors<{
                        nationalId: string;
                    }>)?.nationalId : undefined}
                    name={`passengers.${passengerIndex}.nationalId`}
                    isTouched={(touched.passengers && touched.passengers[passengerIndex]) ? touched.passengers[passengerIndex].nationalId : false}
                    label={t('national-code')}
                    maxLength={10}
                    validateFunction={(value: string) => validateNationalId({ value: value, invalidMessage: t('invalid-national-code'), reqiredMessage: t('please-enter-national-code') })}
                    value={values.passengers[passengerIndex]?.nationalId}
                />


                <FormikField
                    setFieldValue={setFieldValue}
                    id={`passengers_${passengerIndex}_passportNumber`}
                    errorText={errors.passengers ? (errors.passengers[passengerIndex] as FormikErrors<{
                        passportNumber: string;
                    }>)?.passportNumber : undefined}
                    name={`passengers.${passengerIndex}.passportNumber`}
                    isTouched={(touched.passengers && touched.passengers[passengerIndex]) ? touched.passengers[passengerIndex].passportNumber : false}
                    label={"شماره گذرنامه"}
                    validateFunction={(value: string) => validateRequied(value, "لطفا شماره گذرنامه را وارد کنید.")}
                    value={values.passengers[passengerIndex]?.passportNumber}
                />

                <div>
                    <DatePickerSelect
                        setFieldValue={setFieldValue}
                        max={maximumBirthDate}
                        min={minimumBirthDate}
                        name={`passengers.${passengerIndex}.birthday`}
                        id={`passengers_${passengerIndex}_birthday`}
                        //initialValue={user.birthDay ? dateFormat(new Date(user.birthDay)) : ""}
                        shamsi={true}
                        label="تاریخ تولد"
                        value={values.passengers[passengerIndex].birthday || ""}
                        descending
                        errorText={errors.passengers ? (errors.passengers[passengerIndex] as FormikErrors<{
                            birthday: string;
                        }>)?.birthday : undefined}
                        isTouched={(touched.passengers && touched.passengers[passengerIndex]) ? touched.passengers[passengerIndex].birthday : false}
                        validateFunction={(value: string) => validateRequied(value, "لطفا تاریخ تولد مسافر را وارد نمایید")}
                    />
                </div>

                {!!services?.length && (
                    <div className="bg-neutral-100 rounded-lg md:col-span-2 xl:col-span-3 flex items-center gap-5 px-5 py-1.5">
                        <span className="text-sm">
                            سرویس هایی بیشتر :
                        </span>

                        <CheckboxGroup
                            items={services.map(serviceItem => ({ label: serviceItem.name, value: serviceItem.id.toString() }))}
                            onChange={value => {
                                setFieldValue(`passengers.${passengerIndex}.services`, value);
                                props.updatePassenger("services", value);
                            }}
                            values={[]}
                        />


                    </div>
                )}

            </div>






            {/* <div className={styles.contentPassenger}>

                
                <Form.Item
                    hidden
                    name={['passengers', passengerIndex ,'nationality']}
                    initialValue={"IR"}
                >
                    <input type={"hidden"} />
                </Form.Item>
            </Row>    */}



            {/* {props.passengerServicesArray?.find(serviceItem => serviceItem.passengerType === passengerItem.type)?.services?.length > 0 && } */}

            {/*
            <Form.Item
                hidden
                name={['passengers', passengerIndex ,'services']}
                initialValue={[]}
            >
                <input type={"hidden"} />
            </Form.Item> 
        </div>*/}
        </div>
    )
}

export default CipPassengerItem;