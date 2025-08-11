import { useCallback, useState } from 'react';
import { i18n, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { Field, Form, Formik } from 'formik';
import Button from '@/modules/shared/components/ui/Button';
import AutoComplete from '@/modules/shared/components/ui/AutoComplete';
import { Calendar, CalendarFill, Location } from '@/modules/shared/components/ui/icons';
import { Cip, ServerAddress } from '@/enum/url';
import { validateRequied } from '@/modules/shared/helpers/validation';
import FormikField from '@/modules/shared/components/ui/FormikField';
import { cipDefaultAirportOptions } from './defaultList';
import { CipAutoCompleteType, CipRecentSearchItem } from '../../types/cip';
import AutoCompleteZoom from '@/modules/shared/components/ui/AutoCompleteZoom';
import DatePickerMobiscroll from '@/modules/shared/components/ui/DatePickerMobiscroll';
import { localeFa } from '@mobiscroll/react';
import { dateFormat } from '@/modules/shared/helpers';

type SearchFormValues = {
    airportUrl: string;
    airlineName: string;
    flightNumber: string;
    flightDate: string;
}

type Props = {
    defaultValues?: SearchFormValues;
    research?: () => void;
    wrapperClassName?: string;
}

const SearchForm: React.FC<Props> = props => {

    const router = useRouter();

    const { t } = useTranslation('common');

    const { defaultValues } = props;

    const [submitPending, setSubmitPending] = useState<boolean>(false);

    const [selectedAirportName, setSelectedAirportName] = useState<string>("");

    const renderOption = useCallback((option: CipAutoCompleteType, direction: "ltr" | "rtl" | undefined) => (
        <div className={`px-3 py-2 flex gap-3 hover:bg-neutral-800 hover:text-white items-center ${!direction ? "" : direction === 'rtl' ? "rtl" : "ltr"}`}>
            <Location className="w-5 h-5 fill-current" />
            <div className='text-xs'>{option.name}</div>
        </div>
    ), []);

    const submitHandle = (values: SearchFormValues) => {

        if (!values.airportUrl) return;

        setSubmitPending(true);

        let url = "/" + values.airportUrl;

        if (values.airlineName) {
            url += `/airlineName-${values.airlineName}`;
        }

        if (values.flightDate) {
            url += `/flightdate-${values.flightDate}`;
        }

        if (values.flightNumber) {
            url += `/flightNumber-${values.flightNumber}`;
        }

        const localStorageRecentSearches = localStorage?.getItem("cipRecentSearches");
        const recentSearches: CipRecentSearchItem[] = localStorageRecentSearches ? JSON.parse(localStorageRecentSearches) : [];

        const searchObject: CipRecentSearchItem = {
            url: url,
            airportName: selectedAirportName,
            flightDate: values.flightDate
        };

        if (!(recentSearches.find(item => item.url === searchObject.url))) {
            recentSearches.unshift(searchObject);

            const slicedArray = recentSearches.slice(0, 10);

            const updatedRecentSearches = JSON.stringify(slicedArray);
            localStorage?.setItem("cipRecentSearches", updatedRecentSearches)
        }

        router.push(url);

    }

    const formInitialValue: {
        airportUrl: string;
        airlineName: string;
        flightNumber: string;
        flightDate: string;
    } = defaultValues || {
        airlineName: "",
        flightDate: "",
        flightNumber: "",
        airportUrl: ""
    }

    const defaultList = cipDefaultAirportOptions;

    const theme2 = process.env.THEME === "THEME2";

    const theme1 = process.env.THEME === "THEME1";

    return (
        <div className={`text-sm ${props.wrapperClassName || ""}`}>

            <Formik
                validate={() => { return {} }}
                initialValues={formInitialValue}
                onSubmit={submitHandle}
            >
                {({ errors, touched, setFieldValue, values, isValid, isSubmitting }) => {

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

                            <div className={`grid grid-cols-1 md:grid-cols-4 ${theme1 ? "lg:grid-cols-5" : "lg:grid-cols-6"} gap-3 gap-y-5 z-[2] relative`}>

                                {theme2 ? (
                                    <div className="lg:col-span-2 relative z-[2]">
                                        <AutoCompleteZoom
                                            //defaultListLabel="محبوب ترین ها"
                                            label="جستجوی نام فرودگاه یا شهر"
                                            type="hotel"
                                            defaultList={defaultList}
                                            inputId="destination"
                                            //checkTypingLanguage
                                            noResultMessage={t('NoResultsFound')}
                                            createTextFromOptionsObject={(item: CipAutoCompleteType) => item.name || ""}
                                            renderOption={renderOption}
                                            acceptLanguage="fa-IR"
                                            icon="location"
                                            inputClassName={`w-full bg-white truncate leading-4 border rounded-lg border-neutral-400 py-0.5 text-md h-12 flex flex-col justify-center`}
                                            placeholder="جستجوی نام فرودگاه یا شهر"
                                            min={3}
                                            url={`${ServerAddress.Type}${ServerAddress.Cip}${Cip.SearchAirport}`}
                                            onChangeHandle={
                                                (v: CipAutoCompleteType | undefined) => {
                                                    setFieldValue("airportUrl", v?.url || "", true);
                                                    setSelectedAirportName(v?.name || "")
                                                }
                                            }
                                        />

                                        <Field
                                            validate={(value: string) => validateRequied(value, "فرودگاه را انتخاب کنید.")}
                                            type='hidden'
                                            name="airportUrl"
                                            value={values.airportUrl}
                                        />
                                        
                                        {touched.airportUrl && errors.airportUrl && <div className='text-xs text-red-500'> {errors.airportUrl as string}</div>}

                                    </div>
                                ) : (

                                    <div className='lg:col-span-2 relative'>
                                        <label htmlFor="destination" className="absolute top-1 rtl:right-10 ltr:left-10 text-4xs z-10 leading-5 pointer-events-none">
                                            جستجوی نام فرودگاه یا شهر
                                        </label>
                                        <AutoComplete
                                            defaultList={defaultList}
                                            noResultMessage={t('NoResultsFound')}
                                            placeholder='جستجوی نام فرودگاه یا شهر'
                                            acceptLanguage={i18n?.language === "ar" ? "ar-AE" : i18n?.language === "en" ? "en-US" : "fa-IR"}
                                            inputClassName={`w-full outline-none border rounded-lg border-neutral-400 pt-4 h-12 text-sm text-neutral-500 placeholder:text-neutral-500 focus:border-neutral-900`}
                                            type="cip"
                                            icon='location'
                                            createTextFromOptionsObject={(item: CipAutoCompleteType) => item.name || ""}
                                            renderOption={renderOption}
                                            min={3}
                                            url={`${ServerAddress.Type}${ServerAddress.Cip}${Cip.SearchAirport}`}
                                            onChangeHandle={
                                                (v: CipAutoCompleteType | undefined) => {
                                                    setFieldValue("airportUrl", v?.url || "", true);
                                                    setSelectedAirportName(v?.name || "")
                                                }
                                            }
                                        />
                                        <Field
                                            validate={(value: string) => validateRequied(value, "فرودگاه را انتخاب کنید.")}
                                            type='hidden'
                                            name="airportUrl"
                                            value={values.airportUrl}
                                        />
                                        {touched.airportUrl && errors.airportUrl && <div className='text-xs text-red-500'> {errors.airportUrl as string}</div>}
                                    </div>
                                )}

                                <FormikField
                                    heightClassName="h-10"
                                    name='airlineName'
                                    value={values.airlineName}
                                    setFieldValue={setFieldValue}
                                    className={theme2 ? "relative z-[1]" : ""}
                                    fieldClassName='w-full border border-neutral-400 h-12 rounded-lg focus:border-neutral-900 outline-none'
                                    label='نام ایرلاین'
                                />
                                <FormikField
                                    heightClassName="h-10"
                                    name='flightNumber'
                                    value={values.flightNumber}
                                    setFieldValue={setFieldValue}
                                    className={theme2 ? "relative z-[1]" : ""}
                                    fieldClassName='w-full ltr text-left border border-neutral-400 h-12 rounded-lg focus:border-neutral-900 outline-none'
                                    label='شماره پرواز'
                                />

                                {/* TODO: delete when mobiscroll is activated */}
                                <div className='modernCalendar-dates-wrapper'>

                                    <div className="relative modernDatePicker-checkin">


                                        {/* <DatePickerModern
                                            wrapperClassName="block"
                                            minimumDate={dateDiplayFormat({ date: new Date().toISOString(), locale: 'en', format: "YYYY-MM-DD" })}
                                            inputPlaceholder="تاریخ پرواز"
                                            inputClassName="border border-neutral-400 h-12 rounded-lg focus:border-neutral-900 outline-none pt-7 text-xs w-full pr-10"
                                            toggleLocale={() => { setLocale(prevState => prevState === 'fa' ? "en" : "fa") }}
                                            locale={locale}
                                            onChange={(v: string) => {
                                                if (v) {
                                                    setFieldValue("flightDate", v, true);
                                                }
                                            }}
                                            value={values.flightDate}
                                        /> */}

                                        <DatePickerMobiscroll
                                            minDate={dateFormat(new Date())}
                                            inputStyle='theme1'
                                            onChange={a => {
                                                setFieldValue("flightDate", a.value, true)
                                            }}
                                            rtl
                                            locale={localeFa}
                                            value={values.flightDate}
                                        />

                                        {theme2 ?(
                                            <CalendarFill className='w-5 h-5 fill-neutral-600 top-1/2 -mt-2.5 right-3 absolute select-none pointer-events-none' />
                                        ):(
                                            <Calendar className='w-5 h-5 fill-neutral-600 top-1/2 -mt-2.5 right-3 absolute select-none pointer-events-none' />
                                        )}


                                        <label className={`absolute leading-5 rtl:right-10 select-none pointer-events-none transition-all ${values.flightDate ? "top-1.5 text-4xs " : "top-1/2 -translate-y-1/2 text-sm "}`}>
                                            تاریخ پرواز
                                        </label>
                                    </div>

                                    <Field
                                        type='hidden'
                                        name="flightDate"
                                        value={values.flightDate}
                                    />

                                </div>

                                <div className={`relative md:col-span-4 ${theme1 ? "lg:col-span-5" : "lg:col-span-1"}`}>
                                    <Button
                                        color='blue'
                                        type='submit'
                                        className='h-12 w-full sm:max-w-64 mx-auto'
                                        loading={submitPending}
                                    >
                                        {t('search')}
                                    </Button>
                                </div>
                            </div>


                        </Form>
                    )
                }
                }
            </Formik>
        </div>

    )
}

export default SearchForm;