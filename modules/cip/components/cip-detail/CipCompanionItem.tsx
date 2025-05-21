import FormikField from "@/modules/shared/components/ui/FormikField"
import {validateRequied, validateRequiedPersianAndEnglish } from "@/modules/shared/helpers/validation";
import { Field, FormikErrors, FormikTouched } from "formik";
import { useTranslation } from "next-i18next";
import { CipAvailabilityItemType, CipFormCompanionItemType, CipFormPassengerItemType } from "../../types/cip";
import { Close } from "@/modules/shared/components/ui/icons";
import CheckboxGroup from "@/modules/shared/components/ui/CheckboxGroup";

type Props = {
    companionItem: CipFormCompanionItemType;
    companionIndex: number;
    decreaseCompanion: () => void;
    isLastItem?: boolean;
    updateCompanion: (property: any, value: any) => void;
    passengerServicesArray: CipAvailabilityItemType['passengerTypeServices'];

    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{
        companions: {
            firstName: string;
            lastName: string;
            gender: boolean;
            services: any[]
        }[];
    }>>;
    errors: FormikErrors<{
        companions: {
            firstName: string;
            lastName: string;
            gender: boolean;
            services: any[]
        }[];
    }>;
    touched: FormikTouched<{
        companions: {
            firstName: string;
            lastName: string;
            gender: boolean;
            services: any[]
        }[];
    }>;
    values: {
        companions: {
            firstName: string;
            lastName: string;
            gender: boolean;
            services: any[]
        }[];
    };
}



const CipCompanionItem: React.FC<Props> = props => {

    const { t } = useTranslation('common');
    const { companionItem, decreaseCompanion, companionIndex, updateCompanion, values, errors, touched, setFieldValue } = props;

    const services = props.passengerServicesArray?.find(passengerServicesItem => passengerServicesItem.passengerType === "Accompanying")?.services;

    return (
        <div className="bg-white rounded-lg border border-neutral-300 mt-5">

            <div className="border-b border-neutral-300 px-5 py-2 flex justify-between">
                <h4 className="font-semibold text-sm">مشایعت کننده {companionIndex + 1}</h4>

                {!!props.isLastItem && <button type="button" className="bg-red-100 rounded p-1.5" onClick={() => decreaseCompanion()}>
                    <Close className="w-5 h-5 fill-red-600" />
                </button>}
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">


                <div className="leading-4" >
                    <label className='block text-xs mb-1' > جنسیت </label>
                    <label className='inline-flex items-center gap-1 rtl:ml-4 ltr:mr-4'>
                        <Field
                            type="radio"
                            className="text-xs"
                            onChange={(e: any) => {
                                const val = e.target.checked;
                                setFieldValue(`companions.${companionIndex}.gender`, val);
                            }}
                            checked={values.companions[companionIndex]?.gender}
                        />
                        مرد
                    </label>
                    <label className='inline-flex items-center gap-1'>
                        <Field
                            type="radio"
                            className="text-xs"
                            onChange={(e: any) => {
                                const val = !e.target.checked;
                                setFieldValue(`companions.${companionIndex}.gender`, val);
                            }}
                            checked={!values.companions[companionIndex]?.gender}
                        />
                        زن
                    </label>
                </div>

                <FormikField
                    setFieldValue={setFieldValue}
                    id={`companions_${companionIndex}_firstName`}
                    errorText={errors.companions ? (errors.companions[companionIndex] as FormikErrors<{
                        firstName: string;
                    }>)?.firstName : undefined}
                    name={`companions.${companionIndex}.firstName`}
                    isTouched={(touched.companions && touched.companions[companionIndex]) ? touched.companions[companionIndex].firstName : false}
                    label={t('first-name')}
                    validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, t('please-enter-passenger-first-name'), t('just-english-persian-letter-and-space'))}
                    value={values.companions[companionIndex]?.firstName}
                />

                <FormikField
                    setFieldValue={setFieldValue}
                    id={`companions_${companionIndex}_lastName`}
                    errorText={errors.companions ? (errors.companions[companionIndex] as FormikErrors<{
                        lastName: string;
                    }>)?.lastName : undefined}
                    name={`companions.${companionIndex}.lastName`}
                    isTouched={(touched.companions && touched.companions[companionIndex]) ? touched.companions[companionIndex].lastName : false}
                    label={t('last-name')}
                    validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, t('please-enter-passenger-last-name'), t('just-english-persian-letter-and-space'))}
                    value={values.companions[companionIndex]?.lastName}
                />

                {!!services?.length && (
                    <div className="bg-neutral-100 rounded-lg md:col-span-2 xl:col-span-4 flex items-center gap-5 px-5 py-1.5">
                        <span className="text-sm">
                            سرویس هایی بیشتر :
                        </span>

                        <CheckboxGroup
                            items={services.map(serviceItem => ({ label: serviceItem.name, value: serviceItem.id.toString() }))}
                            onChange={value => {
                                setFieldValue(`companions.${companionIndex}.services`, value);
                                updateCompanion("services", value);
                            }}
                            values={[]}
                        />


                    </div>
                )}

            </div>

        </div>
    )
}

export default CipCompanionItem;