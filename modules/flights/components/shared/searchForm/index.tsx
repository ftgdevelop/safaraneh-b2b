import { useCallback, useState } from 'react';
import { i18n, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { FlightSeachFormValue, AirportAutoCompleteType, FlightSearchDefaultValues, FlightRecentSearchItem } from '../../../types/flights';
import SelectPassengers from './SelectPassengers';
import { Field, Form, Formik } from 'formik';
import Button from '@/modules/shared/components/ui/Button';
import Select from '@/modules/shared/components/ui/Select';
import AutoComplete from '@/modules/shared/components/ui/AutoComplete';
import { Calendar, CalendarFill, Location, Minus, Swap, Travel } from '@/modules/shared/components/ui/icons';
import { Flight, ServerAddress } from '@/enum/url';
import { validateRequied } from '@/modules/shared/helpers/validation';
import { addSomeDays, dateFormat } from '@/modules/shared/helpers';
import { defaultAirportOptions } from './defaultList';
import DatePickerMobiscroll from '@/modules/shared/components/ui/DatePickerMobiscroll';
import { localeFa } from '@mobiscroll/react';
import AutoCompleteZoom from '@/modules/shared/components/ui/AutoCompleteZoom';

type Props = {
    defaultValues?: FlightSearchDefaultValues;
    research?: () => void;
    wrapperClassName?: string;
}

const SearchForm: React.FC<Props> = props => {

    const router = useRouter();

    const { t } = useTranslation('common');

    const { defaultValues } = props;

    const [locale, setLocale] = useState<any>(localeFa);

    const [locations, setLocations] = useState<[AirportAutoCompleteType | undefined, AirportAutoCompleteType | undefined]>([defaultValues?.originObject || undefined, defaultValues?.destinationObject || undefined]);

    const [submitPending, setSubmitPending] = useState<boolean>(false);

    const renderOption = useCallback((option: AirportAutoCompleteType, direction: "ltr" | "rtl" | undefined) => (
        <div className={`px-3 py-2 flex gap-3 hover:bg-neutral-800 hover:text-white items-center ${!direction ? "" : direction === 'rtl' ? "rtl" : "ltr"}`}>
            {option.airportType === 'City' ? (
                <Location className="w-5 h-5 fill-current" />
            ) : (
                <Travel className="w-5 h-5 fill-current" />
            )}
            <div className="leading-5">
                <div className='text-xs'>{option.city.name || option.name}</div>
                <div className='text-3xs'>{option.airportType === 'City' ? "همه فرودگاه ها" : option.name}</div>
            </div>
        </div>
    ), []);

    const submitHandle = (values: FlightSeachFormValue) => {

        if (!values.originCode || !values.destinationCode) return;

        setSubmitPending(true);

        const searchQueries: any = {}
        searchQueries.adult = values.adult;
        searchQueries.child = values.child;
        searchQueries.infant = values.infant;
        searchQueries.departing = values.departureDate;

        if (values.returnDate) searchQueries.returning = values.returnDate;

        if (values.cabinClassCode !== "All") searchQueries.flightType = values.cabinClassCode;

        const { query } = router;

        if (
            props.research &&
            query.flights === values.originCode + "-" + values.destinationCode &&
            +(query.adult || 0) === values.adult &&
            +(query.child || 0) === values.child &&
            +(query.infant || 0) === values.infant &&
            query.departing === values.departureDate &&
            query.returning === values.returnDate &&
            query.flightType === (values.cabinClassCode === "All" ? undefined : values.cabinClassCode)
        ) {
            props.research();
        } else {


            const localStorageRecentSearches = localStorage?.getItem("flightRecentSearches");
            const recentSearches: FlightRecentSearchItem[] = localStorageRecentSearches ? JSON.parse(localStorageRecentSearches) : [];

            const querisArray = Object.keys(searchQueries).map((key) => [key + "=" + searchQueries[key]]);

            const url = `/flights/${values.originCode}-${values.destinationCode}?` + querisArray.join("&");

            const searchObject: FlightRecentSearchItem = {
                url: url,
                origin: locations[0]?.city.name || locations[0]?.code || "",
                destination: locations[1]?.city.name || locations[1]?.code || "",
                departureDate: values.departureDate || "",
                returnDate: values.returnDate || ""
            };

            if (!(recentSearches.find(item => item.url === searchObject.url))) {
                recentSearches.unshift(searchObject);

                const slicedArray = recentSearches.slice(0, 10);

                const updatedRecentSearches = JSON.stringify(slicedArray);

                localStorage?.setItem("flightRecentSearches", updatedRecentSearches)
            }

            router.push({ pathname: `/flights/${values.originCode}-${values.destinationCode}`, query: searchQueries });
        }

    }

    const formInitialValue: FlightSeachFormValue = defaultValues || {
        originCode: "",
        destinationCode: "",
        departureDate: undefined,
        returnDate: undefined,
        adult: 1,
        child: 0,
        infant: 0,
        cabinClassCode: "All",
        airTripType: "OneWay"
    }

    const theme1 = process.env.THEME === "THEME1";
    const theme2 = process.env.THEME === "THEME2";
    const theme3 = process.env.THEME === "THEME3";

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
                            <div className=''>
                                <div className={`flex gap-3 ${(theme2 || theme3) ? "flex-row" : "flex-col md:flex-row md:justify-between"} mb-4 z-[3] relative`}>

                                    {theme2 ? (
                                        <Select
                                            h10
                                            className='inline-block w-32 rounded-full'
                                            buttonClassName='border-neutral-400'
                                            items={[
                                                { value: "OneWay", label: "یک طرفه" },
                                                { value: "RoundTrip", label: "رفت و برگشت" }
                                            ]}
                                            onChange={(value) => {
                                                setFieldValue("airTripType", value, true)
                                            }}
                                            value={values.airTripType}
                                        />
                                    ) : (
                                        <div className='flex gap-3'>
                                            <button
                                                type='button'
                                                className={`transition-all h-10 px-3 cursor-pointer outline-none rounded-lg ${values.airTripType === "OneWay" ? "bg-blue-100 text-blue-800" : "hover:text-blue-700 hover:bg-blue-50"}`}
                                                onClick={() => {
                                                    setFieldValue("returnDate", undefined, true);
                                                    setFieldValue("airTripType", "OneWay", true);
                                                }}
                                            >
                                                یک طرفه
                                            </button>
                                            <button
                                                type='button'
                                                className={`transition-all h-10 px-3 cursor-pointer outline-none rounded-lg ${values.airTripType === "RoundTrip" ? "bg-blue-100 text-blue-800" : "hover:text-blue-700 hover:bg-blue-50"}`}
                                                onClick={() => { setFieldValue("airTripType", "RoundTrip", true) }}
                                            >
                                                رفت و برگشت
                                            </button>
                                        </div>
                                    )}

                                    <div className='flex gap-3 text-neutral-800'>

                                        {!theme2 && <SelectPassengers
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            wrapperClassNames='sm:col-span-2 shrink-0'
                                        />}

                                        <Select
                                            h10
                                            className={`inline-block w-28 ${theme2 ? "rounded-full" : "rounded-lg"}`}
                                            buttonClassName={theme2 ? "border-neutral-400" : ""}
                                            items={[
                                                { value: "All", label: "همه" },
                                                { value: "Economy", label: "اکونومی" },
                                                { value: "Business", label: "بیزینس" }
                                            ]}
                                            onChange={(value) => {
                                                setFieldValue("cabinClassCode", value)
                                            }}
                                            value={values.cabinClassCode}
                                        />

                                    </div>

                                </div>

                                <div className={`text-neutral-800 grid gap-3 gap-y-4 z-[2] relative ${theme1 ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-6" : (theme2 || theme3) ? "grid-cols-1 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-14" : ""}`}>

                                    <div className={`relative ${theme1 ? "col-span-2 sm:col-span-1 lg:col-span-2" : (theme2 || theme3) ? "sm:col-span-3 lg:col-span-1 xl:col-span-3" : ""}`}>

                                        {theme2 ? (
                                            <AutoCompleteZoom
                                                defaultListLabel="محبوب ترین ها"
                                                label="مبدا"
                                                type="flight"
                                                defaultList={defaultAirportOptions}
                                                //checkTypingLanguage
                                                noResultMessage={t('NoResultsFound')}
                                                createTextFromOptionsObject={(item: AirportAutoCompleteType) => item.airportType === 'City' ? item.city.name || item.name : item.city.name + " - " + item.name}
                                                acceptLanguage="fa-IR"
                                                renderOption={renderOption}
                                                icon="location"
                                                inputClassName={`w-full bg-white rtl:pl-3 truncate block leading-4 border rounded-lg border-neutral-400 py-0.5 text-md h-12 flex flex-col justify-center`}
                                                placeholder="مبدا"
                                                min={3}
                                                url={`${ServerAddress.Type}${ServerAddress.Flight}${Flight.AirportSearch}`}
                                                onChangeHandle={

                                                    (v: AirportAutoCompleteType | undefined) => {
                                                        setLocations(prevState => ([
                                                            v,
                                                            prevState[1]
                                                        ]))
                                                        setFieldValue("originCode", v?.code || "", true);
                                                    }
                                                }

                                                value={locations[0]}
                                            />
                                        ) : (
                                            <AutoComplete
                                                sortListFunction={(b, a) => { return b.airportType === 'City' ? -1 : 1 }}
                                                defaultList={defaultAirportOptions}
                                                noResultMessage={t('NoResultsFound')}
                                                placeholder='مبدا'
                                                acceptLanguage={i18n?.language === "ar" ? "ar-AE" : i18n?.language === "en" ? "en-US" : "fa-IR"}
                                                inputClassName='w-full text-left border border-neutral-400 h-12 rounded-lg focus:border-neutral-900 outline-none'
                                                type="flight"
                                                createTextFromOptionsObject={(item: AirportAutoCompleteType) => item.airportType === 'City' ? item.city.name || item.name : item.city.name + " - " + item.name}
                                                renderOption={renderOption}
                                                min={3}
                                                url={`${ServerAddress.Type}${ServerAddress.Flight}${Flight.AirportSearch}`}
                                                onChangeHandle={
                                                    (v: AirportAutoCompleteType | undefined) => {
                                                        setLocations(prevState => ([
                                                            v,
                                                            prevState[1]
                                                        ]))
                                                        setFieldValue("originCode", v?.code || "", true);
                                                    }
                                                }

                                                value={locations[0]}
                                            />
                                        )}
                                        <Field
                                            validate={(value: string) => validateRequied(value, "مبدا را انتخاب کنید.")}
                                            type='hidden'
                                            name="originCode"
                                            value={values.originCode}
                                        />
                                        {touched.originCode && errors.originCode && <div className='text-xs text-red-500'> {errors.originCode as string}</div>}

                                    </div>

                                    <div className={`relative ${theme1 ? "col-span-2 sm:col-span-1 lg:col-span-2" : (theme2 || theme3) ? "sm:col-span-3 lg:col-span-1 xl:col-span-3" : ""}`}>
                                        {theme2 ? (
                                            <AutoCompleteZoom
                                                defaultListLabel="محبوب ترین ها"
                                                label="مقصد"
                                                type="flight"
                                                defaultList={defaultAirportOptions}
                                                //checkTypingLanguage
                                                noResultMessage={t('NoResultsFound')}
                                                createTextFromOptionsObject={(item: AirportAutoCompleteType) => item.airportType === 'City' ? item.city.name || item.name : item.city.name + " - " + item.name}
                                                acceptLanguage="fa-IR"
                                                renderOption={renderOption}
                                                icon="location"
                                                inputClassName={`w-full bg-white rtl:pl-3 truncate block leading-4 border rounded-lg border-neutral-400 py-0.5 text-md h-12 flex flex-col justify-center`}
                                                placeholder="مقصد"
                                                min={3}
                                                url={`${ServerAddress.Type}${ServerAddress.Flight}${Flight.AirportSearch}`}
                                                onChangeHandle={

                                                    (v: AirportAutoCompleteType | undefined) => {
                                                        setLocations(prevState => ([
                                                            prevState[0],
                                                            v
                                                        ]))
                                                        setFieldValue("destinationCode", v?.code || "", true);
                                                    }
                                                }

                                                value={locations[1]}
                                            />
                                        ) : (
                                            <AutoComplete
                                                sortListFunction={(b, a) => { return b.airportType === 'City' ? -1 : 1 }}
                                                defaultList={defaultAirportOptions}
                                                noResultMessage={t('NoResultsFound')}
                                                placeholder='مقصد'
                                                acceptLanguage={i18n?.language === "ar" ? "ar-AE" : i18n?.language === "en" ? "en-US" : "fa-IR"}
                                                inputClassName='w-full text-left border border-neutral-400 h-12 rounded-lg focus:border-neutral-900 outline-none'
                                                type="flight"
                                                createTextFromOptionsObject={(item: AirportAutoCompleteType) => item.airportType === 'City' ? item.city.name || item.name : item.city.name + " - " + item.name}
                                                renderOption={renderOption}
                                                min={3}
                                                url={`${ServerAddress.Type}${ServerAddress.Flight}${Flight.AirportSearch}`}
                                                onChangeHandle={

                                                    (v: AirportAutoCompleteType | undefined) => {
                                                        setLocations(prevState => ([
                                                            prevState[0],
                                                            v
                                                        ]))
                                                        setFieldValue("destinationCode", v?.code || "", true);
                                                    }
                                                }

                                                value={locations[1]}

                                            />
                                        )}

                                        <Field
                                            validate={(value: string) => validateRequied(value, "مقصد را انتخاب کنید.")}
                                            type='hidden'
                                            name="destinationCode"
                                            value={values.destinationCode}
                                        />
                                        {touched.destinationCode && errors.destinationCode && <div className='text-xs text-red-500'> {errors.destinationCode as string}</div>}


                                        <button
                                            type='button'
                                            onClick={() => {
                                                setLocations(prevLocation => {
                                                    setFieldValue("originCode", prevLocation[1]?.code || "", true);
                                                    setFieldValue("destinationCode", prevLocation[0]?.code || "", true);
                                                    return ([
                                                        prevLocation[1], prevLocation[0]
                                                    ])
                                                });
                                            }}
                                            className={`rounded-full ${theme2?"p-1.5 top-0 sm:top-2 -mt-5":"-mt-5 p-0.5 top-0 sm:top-2.5"} border border-neutral-500 bg-white absolute max-sm:rotate-90 sm:mt-0 left-2 sm:left-auto sm:-right-5 cursor-pointer outline-none`}
                                        >
                                            <Swap className={`${theme2?"w-4 h-4 fill-blue-700":"w-5 h-5 fill-current"}`} />
                                        </button>

                                    </div>

                                    {/* TODO: delete when mobiscroll is activated */}
                                    {/* <div className={`modernCalendar-dates-wrapper ${theme2?"sm:col-span-2 lg:col-span-1 xl:col-span-2":""}`}>
                                        <div className="relative modernDatePicker-checkin">
                                            <DatePickerModern
                                                wrapperClassName="block"
                                                minimumDate={dateDiplayFormat({ date: new Date().toISOString(), locale: 'en', format: "YYYY-MM-DD" })}
                                                inputPlaceholder="تاریخ رفت"
                                                inputClassName="border border-neutral-400 h-12 rounded-lg focus:border-neutral-900 outline-none pt-7 text-xs w-full pr-10"
                                                toggleLocale={() => { setLocale(prevState => prevState === 'fa' ? "en" : "fa") }}
                                                locale={locale}
                                                onChange={(v: string) => {
                                                    if (v) {
                                                        setFieldValue("departureDate", v, true);
                                                    }
                                                }}
                                                value={values.departureDate}
                                            />
                                            <Calendar className="w-5 h-5 fill-neutral-600 top-1/2 -mt-2.5 right-3 absolute select-none pointer-events-none" />
                                            <label className="absolute top-1.5 leading-5 rtl:right-10 text-4xs select-none pointer-events-none">
                                                تاریخ رفت
                                            </label>
                                        </div>
                                        <Field
                                            validate={(value: string) => validateRequied(value, values.airTripType === 'RoundTrip' ? "تاریخ رفت را انتخاب کنید." : "تاریخ پرواز را انتخاب کنید.")}
                                            type='hidden'
                                            name="departureDate"
                                            value={values.departureDate}
                                        />
                                        {touched.departureDate && errors.departureDate && <div className='text-xs text-red-500'> {errors.departureDate as string}</div>}
                                    </div> */}

                                    <div className={`${(theme2 || theme3) ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : ""}`} >
                                        <div className='relative'>
                                            <DatePickerMobiscroll
                                                minDate={ dateFormat(new Date()) }
                                                inputStyle='theme1'
                                                onChange={a => {
                                                    setFieldValue("departureDate", a.value, true)
                                                }}
                                                rtl
                                                locale={locale}
                                                onChangeLocale={setLocale}
                                                value={values.departureDate}
                                            />
                                        
                                            {theme2 ?(
                                                <CalendarFill className='w-5 h-5 fill-neutral-600 top-1/2 -translate-y-1/2 right-3 absolute select-none pointer-events-none' />
                                            ):(
                                                <Calendar className='w-5 h-5 fill-neutral-600 top-1/2 -translate-y-1/2 right-3 absolute select-none pointer-events-none' />
                                            )}

                                            <label className={`absolute leading-5 rtl:right-10 select-none pointer-events-none transition-all ${values.departureDate ? "top-1.5 text-4xs " : "top-1/2 -translate-y-1/2 text-sm "}`}>
                                                تاریخ رفت
                                            </label>
                                        </div>

                                        <Field
                                            validate={(value: string) => validateRequied(value, values.airTripType === 'RoundTrip' ? "تاریخ رفت را انتخاب کنید." : "تاریخ پرواز را انتخاب کنید.")}
                                            type='hidden'
                                            name="departureDate"
                                            value={values.departureDate}
                                        />
                                        {touched.departureDate && errors.departureDate && <div className='text-xs text-red-500'> {errors.departureDate as string}</div>}
                                    </div>

                                    {values.airTripType === 'RoundTrip' ? (
                                        // <div className={`modernCalendar-dates-wrapper ${theme2 ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : ""}`}>

                                        //     <div className="relative modernDatePicker-checkout">
                                        //         <DatePickerModern
                                        //             wrapperClassName="block"
                                        //             minimumDate={dateDiplayFormat({ date: values.departureDate ? dateFormat(addSomeDays(new Date(values.departureDate))) : dateFormat(addSomeDays(new Date())), locale: 'en', format: "YYYY-MM-DD" })}
                                        //             inputPlaceholder="تاریخ برگشت"
                                        //             inputClassName="border border-neutral-400 h-12 rounded-lg focus:border-neutral-900 outline-none pt-7 text-xs w-full pr-10"
                                        //             toggleLocale={() => { setLocale(prevState => prevState === 'fa' ? "en" : "fa") }}
                                        //             locale={locale}
                                        //             onChange={(v: string) => {
                                        //                 if (v) {
                                        //                     setFieldValue("returnDate", v, true);
                                        //                 }
                                        //             }}
                                        //             value={values.returnDate}
                                        //         />
                                        //         <Calendar className="w-5 h-5 fill-neutral-600 top-1/2 -mt-2.5 right-3 absolute select-none pointer-events-none" />
                                        //         <label className="absolute top-1.5 leading-5 rtl:right-10 text-4xs select-none pointer-events-none">
                                        //             تاریخ برگشت
                                        //         </label>

                                        //         <button
                                        //             type='button'
                                        //             className='p-1 border border-neutral-300 rounded bg-neutral-600 absolute top-1/2 -mt-3 left-3'
                                        //             onClick={() => {
                                        //                 setFieldValue("returnDate", undefined, true);
                                        //                 setFieldValue("airTripType", 'OneWay', true);
                                        //             }
                                        //             }
                                        //         >
                                        //             <Minus className='w-4 h-4 fill-white' />
                                        //         </button>

                                        //     </div>
                                        //     <Field
                                        //         validate={(value: string) => validateRequied(value, "تاریخ برگشت را انتخاب کنید.")}
                                        //         type='hidden'
                                        //         name="returnDate"
                                        //         value={values.returnDate}
                                        //     />

                                        //     {touched.returnDate && errors.returnDate && <div className='text-xs text-red-500'> {errors.returnDate as string}</div>}
                                        // </div>


                                        <div className={`${(theme2 || theme3) ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : ""}`} >
                                            <div className='relative'>
                                                <DatePickerMobiscroll
                                                    inputStyle='theme1'
                                                    onChange={a => {
                                                        setFieldValue("returnDate", a.value, true)
                                                    }}
                                                    rtl
                                                    locale={locale}
                                                    onChangeLocale={setLocale}
                                                    value={values.returnDate}
                                                    minDate={values.departureDate ? dateFormat(addSomeDays(new Date(values.departureDate))) : dateFormat(addSomeDays(new Date()))}
                                                />

                                                {theme2 ?(
                                                    <CalendarFill className='w-5 h-5 fill-neutral-600 top-1/2 -translate-y-1/2 right-3 absolute select-none pointer-events-none' />
                                                ):(
                                                    <Calendar className='w-5 h-5 fill-neutral-600 top-1/2 -translate-y-1/2 right-3 absolute select-none pointer-events-none' />
                                                )}

                                                <label className={`absolute leading-5 rtl:right-10 select-none pointer-events-none transition-all ${values.returnDate ? "top-1.5 text-4xs " : "top-1/2 -translate-y-1/2 text-sm "}`}>
                                                    تاریخ برگشت
                                                </label>
                                                <button
                                                    type='button'
                                                    className='p-1 border border-neutral-300 rounded bg-neutral-600 absolute top-1/2 -mt-3 left-3'
                                                    onClick={() => {
                                                        setFieldValue("returnDate", undefined, true);
                                                        setFieldValue("airTripType", 'OneWay', true);
                                                    }
                                                    }
                                                >
                                                    <Minus className='w-4 h-4 fill-white' />
                                                </button>
                                            </div>

                                            <Field
                                                validate={(value: string) => validateRequied(value, "تاریخ برگشت را انتخاب کنید.")}
                                                type='hidden'
                                                name="returnDate"
                                                value={values.returnDate}
                                            />
                                            {touched.returnDate && errors.returnDate && <div className='text-xs text-red-500'> {errors.returnDate as string}</div>}
                                        </div>

                                    ) : (
                                        <div
                                            className={`relative flex justify-center items-center border border-neutral-400 h-12 rounded-lg text-xs w-full cursor-pointer bg-white hover:bg-neutral-100 ${theme2 ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : ""}`}
                                            onClick={() => { setFieldValue("airTripType", 'RoundTrip', true); }}
                                        >
                                            {theme2 ?(
                                                <CalendarFill className='w-7 h-7 fill-neutral-600 top-1/2 -mt-3.5 right-3 absolute select-none pointer-events-none' />
                                            ):(
                                                <Calendar className='w-7 h-7 fill-neutral-600 top-1/2 -mt-3.5 right-3 absolute select-none pointer-events-none' />
                                            )}

                                            تاریخ برگشت
                                        </div>
                                    )}

                                    {!!(theme2 || theme3) && <SelectPassengers
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        wrapperClassNames='sm:col-span-2 lg:col-span-1 xl:col-span-2 shrink-0'
                                    />}

                                    <div className={`relative ${theme1 ? "col-span-2 md:col-span-4 lg:col-span-6" : (theme2 || theme3) ? "sm:col-span-6 lg:col-span-5 xl:col-span-2" : ""}`} >
                                        <Button
                                            color='blue'
                                            type='submit'
                                            className={`h-12 w-full mx-auto ${theme1 ? "sm:w-40" : "sm:w-40 max-w-full font-semibold"}`}
                                            loading={submitPending}
                                        >
                                            {t('search')}
                                        </Button>
                                    </div>
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
