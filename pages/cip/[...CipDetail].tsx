import { useState, useEffect } from 'react';
import { CipPreReserve, CipValidate, availabilityByIataCode, getAirportByUrl } from "@/modules/cip/actions";
import CipDetailGallery from "@/modules/cip/components/cip-detail/CipDetailGallery";
import CipName from "@/modules/cip/components/cip-detail/CipName";
import { CipAvailabilityItemType, CipFormCompanionItemType, CipFormPassengerItemType, CipGetAirportByUrlResponseType, CipPrereservePayload, CipValidateResponseType } from "@/modules/cip/types/cip";
import AnchorTabs from "@/modules/shared/components/ui/AnchorTabs";
import Button from "@/modules/shared/components/ui/Button";
import Steps from "@/modules/shared/components/ui/Steps";
import { ArrowRight, Cip2, ErrorCircle, RightCaret } from "@/modules/shared/components/ui/icons";
//import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import { Form, Formik } from "formik";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import CipReserverInformation from "@/modules/cip/components/cip-detail/CipReserverInformation";
import CipAirportInformation from "@/modules/cip/components/cip-detail/CipAirportInformation";
import { useAppDispatch, useAppSelector } from '@/modules/shared/hooks/use-store';
import CipPassengersInformation from '@/modules/cip/components/cip-detail/CipPassengersInformation';
import CipCompanionInformation from '@/modules/cip/components/cip-detail/CipCompanionInformation';
import CipExtraServices from '@/modules/cip/components/cip-detail/CipExtraServices';
import CipTransport from '@/modules/cip/components/cip-detail/CipTransport';
import Head from 'next/head';
import CipAboutAirport from '@/modules/cip/components/cip-detail/CipAboutAirport';
import CipTerms from '@/modules/cip/components/cip-detail/CipTerms';
import CipFacilities from '@/modules/cip/components/cip-detail/CipFacilities';
import { useRouter } from 'next/router';
import CipFAQ from '@/modules/cip/components/cip-detail/CipFAQ';
import CipPriceDetails from '@/modules/cip/components/cip-detail/CipPriceDetails';
import CipDiscountForm from '@/modules/cip/components/cip-detail/CipDiscountForm';
import { registerDiscountCode, validateDiscountCode } from '@/modules/payment/actions';
import CipAvailibilityItem from '@/modules/cip/components/cip-detail/CipAvailibilityItem';
import NotFound from '@/modules/shared/components/ui/NotFound';
import { setAlertModal } from '@/modules/shared/store/alertSlice';

type FormValues = {
    originName: string;
    destinationName: string;
    airline: string;
    flightNumber: string;
    flightDate: string;
    flightTime: string;
    cip_transport_address?: string;
    reserver: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
        userName: string;
        gender: boolean;
    };
    passengers: {
        firstName: string;
        lastName: string;
        gender: boolean;
        passengerType: "Adult" | "Child";
        passportNumber: string;
        nationalId: string;
        nationality: string;
        birthday: string;
        services: string[]
    }[];
    companions: {
        firstName: string;
        lastName: string;
        gender: boolean;
        services: string[]
    }[];
}

const CipDetails: NextPage = ({ airportData, availabilities, moduleDisabled }: { airportData?: CipGetAirportByUrlResponseType, availabilities?: { latitude: string; longitude: string; availability: CipAvailabilityItemType[] }; moduleDisabled?: Boolean }) => {

    const dispatch = useAppDispatch();

    const { t } = useTranslation('common');
    const { t: tCip } = useTranslation('cip');

    const router = useRouter();

    const siteURL = process.env.SITE_NAME;
    const siteName = process.env.PROJECT;

    const user = useAppSelector(state => state.authentication.isAuthenticated ? state.authentication.user : undefined);

    const [passengers, setPassengers] = useState<CipFormPassengerItemType[]>([
        {
            id: '1',
            gender: user ? user.gender : true,
            type: "Adult",
            services: []
        }
    ]);


    const [companions, setCompanions] = useState<CipFormCompanionItemType[]>([]);

    const [validateResponse, setValidateResponse] = useState<CipValidateResponseType>();
    const [selectedServicesArray, setSelectedServicesArray] = useState<CipValidateResponseType['optionalServices']>();

    const [activeServices, setActiveServices] = useState<number[]>([]);

    const updateActiveService = (id: number) => {
        setActiveServices(prevArr => ([
            ...prevArr, id
        ]))
    }

    const [selectedAvailability, setSelectedAvailability] = useState<CipAvailabilityItemType | undefined>(undefined);

    const [reserverIsPassenger, setReserverIsPassenger] = useState<boolean>(true);

    const [preReserveLoading, setPreReserveLoading] = useState<boolean>(false);

    const [discountData, setDiscountData] = useState<any>();
    const [discountLoading, setDiscountLoading] = useState<boolean>(false);

    const [promoCode, setPromoCode] = useState<string>("");


    useEffect(() => {
        if (availabilities?.availability && availabilities.availability.length === 1) {
            setSelectedAvailability(availabilities.availability[0]);
        }
    }, [availabilities?.latitude]);


    useEffect(() => {
        if (selectedAvailability) {
            const validate = async (iataCode: string, rateId: number) => {

                const respone: any = await CipValidate({ iataCode: iataCode, rateId: rateId });

                if (respone) {
                    setValidateResponse(respone.data.result);
                    const updatedOptionalServices = respone.data.result.optionalServices.map((item: any) => {
                        if (item.type === "Pet") {
                            return ({ ...item, count: 1 })
                        } else {
                            return item;
                        }
                    })
                    setSelectedServicesArray(updatedOptionalServices);
                }
            }
            if (airportData?.code) {
                validate(airportData.code, selectedAvailability.id);
            }

            if (selectedAvailability.transport?.length) {
                setSelectedTransport(selectedAvailability.transport.map(item => ({ ...item, count: 0 })));
            }

        }
    }, [selectedAvailability, airportData?.code]);
    
    const updateSelectedServices = (id: number, property: string, change: "inc" | "dec") => {
        setSelectedServicesArray((prevState: any) => {
            const updatingService = { ...prevState.find((item: any) => item.id === id) };
            const otherServices = prevState.filter((item: any) => item.id !== id);
            if (updatingService[property]) {
                if (change === "inc") {
                    updatingService[property]++;
                } else {
                    updatingService[property]--;
                }
            } else {
                if (change === "inc") {
                    updatingService[property] = 1;
                }
            }
            return (
                [...otherServices, updatingService]
            );
        })
    }


    const [selectedTransport, setSelectedTransport] = useState<any[]>([]);

    const updateTransport = (id: number, fn: string) => {
        setSelectedTransport(prevState => {
            const updatingTransport = { ...prevState.find(item => item.id === id) };
            const otherTransport = prevState.filter(item => item.id !== id);

            if (fn === "inc") {
                updatingTransport.count++;
            } else {
                if (updatingTransport.count > 0) {
                    updatingTransport.count--;
                }
            }
            return (
                [...otherTransport, updatingTransport]
            );
        })
    }



    if (moduleDisabled) {
        return (
            <NotFound />
        )
    }

    let airportLocation: [number, number] | undefined = undefined;
    if (availabilities?.latitude && availabilities.longitude) {
        airportLocation = [+availabilities.latitude, +availabilities.longitude];
    }


    let passengerServicesArray: CipAvailabilityItemType['passengerTypeServices'];
    if (selectedAvailability) {
        passengerServicesArray = selectedAvailability.passengerTypeServices;
    }

    const discountSubmitHandler = async (value: string) => {

        setDiscountLoading(true);
        setDiscountData(undefined);

        const key = validateResponse?.preReserveKey;

        const localStorageTenant = localStorage?.getItem('S-TenantId');
        if (!key || !localStorageTenant) return;
        const response = await validateDiscountCode({ tenant: +localStorageTenant,prereserveKey: key, type: 'Cip', discountPromoCode: value });

        setDiscountLoading(false);

        if (response?.data?.result) {
            setDiscountData(response.data.result);
            setPromoCode(value);
        } else if (response?.data?.error) {
            setDiscountData(response.data?.error);
        }

    }

    const preReserve = async (values: FormValues) => {

        if (!validateResponse?.preReserveKey) {
            console.log("no preReserveKey!");
            return;
        }
        
        setPreReserveLoading(true);

        const companionsPassengers: CipPrereservePayload['passengers'] = values.companions.map(item => ({
            gender: item.gender,
            firstName: item.firstName,
            lastName: item.lastName,
            services: item.services.map(serviceItem => +serviceItem),
            passengerType: 'Accompanying'
        }));


        const passengers: CipPrereservePayload['passengers'] = values.passengers.map(passengerItem => (
            {
                ...passengerItem,
                nationality: "IR",
                services: passengerItem.services.map(serviceItem => +serviceItem)
            }
        ))

        const transportsArray = selectedTransport?.filter(item => item.count > 0)?.map(item => ({
            count: item.count,
            address: values.cip_transport_address,
            id: item.id
        })) || [];

        let services: CipPrereservePayload['services'] = [];
        if (selectedServicesArray?.length && activeServices?.length) {
            services = selectedServicesArray?.filter(item => activeServices.includes(item.id)).map(serviceItem => ({
                count: serviceItem.count || 1,
                extraCount: serviceItem.extraCount,
                hourCount: serviceItem.hourCount,
                id: serviceItem.id
            }));
        }

        const params: CipPrereservePayload = {
            airline: values.airline,
            originName: values.originName,
            destinationName: values.destinationName,
            flightNumber: values.flightNumber,
            flightTime: values.flightDate + "T" + values.flightTime + ":00",
            preReserveKey: validateResponse?.preReserveKey,
            passengers: [...passengers, ...companionsPassengers],
            reserver: {
                ...values.reserver
                , userName: values.reserver.phoneNumber
            },
            services: services,
            transports: transportsArray

        }

        const token = localStorage.getItem('Token');

        const response: any = await CipPreReserve(params, token || undefined, "fa-IR");

        setTimeout(() => {
            setPreReserveLoading(false)
        }, 3000);

        if (response?.data?.result) {

            const reserveId = response.data.result?.id;
            const username = response.data.result?.username;

            const localStorageTenant = localStorage?.getItem('S-TenantId');

            if (localStorageTenant && discountData?.isValid && promoCode) {
                await registerDiscountCode({ tenant: +localStorageTenant ,discountPromoCode: promoCode, reserveId: reserveId, username: username });
            }

            router.push(`/payment?reserveId=${reserveId}&username=${username}`);

        } else {
            dispatch(
                setAlertModal({
                    type:"error",
                    title: t('error'),
                    message: response.response?.data?.error?.message || "متاسفانه مشکلی پیش آمده است",
                    isVisible: true
                })
            )
        }

    }

    const urlSegments: string[] = router.query.CipDetail as string[] || [];

    const urlDateSegment = urlSegments.find(item => item.includes("flightdate-"));
    const urlAirlineSegment = urlSegments.find(item => item.includes("airlineName-"));
    const urlFlightNumberSegment = urlSegments.find(item => item.includes("flightNumber-"));

    let initialFlightDate = urlDateSegment?.split("flightdate-")[1];
    let initialAirline = urlAirlineSegment?.split("-")[1];
    let initialFlightNumber = urlFlightNumberSegment?.split("-")[1];

    const formInitialValue = {
        reserver: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            userName: "",
            gender: true
        },
        passengers: [{
            firstName: "",
            lastName: "",
            gender: true,
            passengerType: "Adult" as "Adult" | "Child",
            passportNumber: "",
            nationalId: "",
            nationality: "",
            birthday: "",
            services: []
        }],
        companions: [],
        originName: "",
        destinationName: "",
        airline: initialAirline || "",
        flightNumber: initialFlightNumber || "",
        flightDate: initialFlightDate || "",
        flightTime: "",
        cip_transport_address: ""

    }

    let unavailable: boolean = false;
    if (availabilities === null || (availabilities && availabilities.availability.length === 0)) {
        unavailable = true;
    }

    return (
        <>
            <Head>
                {router.query.CipDetail && router.query.CipDetail === "فرودگاه-بین-المللی-امام-خمینی-Cip-خدمات" ?
                    <>
                        <title>رزرو CIP فرودگاه امام خمینی | کاملا آنلاین + بهترین پشتیبانی</title>
                        <meta property="description" content="ساده‌ترین روش رزرو خدمات CIP جایگاه تشریفات فرودگاه امام خمینی تهران با بهترین قیمت و بدون جریمه کنسلی با بازگشت 100% وجه در صورت لغو؛ برای رزرو سی آی پی در کمتر از 2 دقیقه اینجا کلیک نمایید." />
                        <meta property="og:title" content="رزرو CIP فرودگاه امام خمینی | کاملا آنلاین + بهترین پشتیبانی" />
                        <meta property="og:description" content="ساده‌ترین روش رزرو خدمات CIP جایگاه تشریفات فرودگاه امام خمینی تهران با بهترین قیمت و بدون جریمه کنسلی با بازگشت 100% وجه در صورت لغو؛ برای رزرو سی آی پی در کمتر از 2 دقیقه اینجا کلیک نمایید." />
                        <meta name="twitter:card" content="summary" />
                        <meta name="twitter:site" content="@safaraneh" />
                        <meta name="twitter:title" content="رزرو CIP فرودگاه امام خمینی | کاملا آنلاین + بهترین پشتیبانی" />
                        <meta name="twitter:description" content="ساده‌ترین روش رزرو خدمات CIP جایگاه تشریفات فرودگاه امام خمینی تهران با بهترین قیمت و بدون جریمه کنسلی با بازگشت 100% وجه در صورت لغو؛ برای رزرو سی آی پی در کمتر از 2 دقیقه اینجا کلیک نمایید." />
                    </>
                    :
                    <title>تشریفات فرودگاهی cip || رزرو آنلاین هتل و بلیط هواپیما</title>
                }
            </Head>

                  <div
                    className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl"
                  >
                    <Cip2 className="w-8 h-8" />
            
                    تشریفات فرودگاهی {airportData?.name}

                  </div>

                <div className="pt-5 px-5 max-md:px-3" id="pictures_section">
                    <div className="p-3 bg-white flex justify-between items-center">
                        <Link
                            href="/cip-home"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            <RightCaret className="w-6 h-6 fill-current inline-block ltr:rotate-180" />
                            مشاهده فرودگاه های دیگر
                        </Link>
                    </div>

                    {!!airportData && !!airportData?.galleries?.length && <CipDetailGallery items={airportData?.galleries} />}
                </div>

                {availabilities && availabilities.availability.length > 1 && <AnchorTabs
                    items={[
                        { id: "pictures_section", title: tCip('pictures') },
                        { id: "about-travel-section", title: "اطلاعات سفر" },
                        { id: "reserver_passengers_section", title: "مشخصات رزروگیرنده و مسافران" },
                        { id: "extra_services_section", title: "سرویس های مازاد" },
                        { id: "about_section", title: "درباره فرودگاه" },
                        { id: "facilities_section", title: "امکانات فرودگاه" }
                    ]}
                />}
                <div className="px-5 max-md:px-3">

                    <CipName address={airportData?.address} name={airportData?.name} location={airportLocation} />

                    {!!selectedAvailability && <Steps
                        className="mt-6 md:mt-10 mb-5 max-sm:hidden"
                        items={[
                            { label: "تکمیل اطلاعات", status: "active" },
                            { label: "صفحه درگاه بانک", status: "up-comming" },
                            { label: "تایید و پرداخت", status: "up-comming" },
                            { label: "تکمیل خرید", status: "up-comming" }
                        ]}
                    />}

                    {!!unavailable && (
                        <p className='border p-5 bg-white font-semibold text-red-500 border-red-600 bg-red-50 my-6'>
                            <ErrorCircle className='w-5 h-5 fill-current inline-block' /> برای این فرودگاه در حال حاضر خدمات تشریفات فرودگاهی فعال نمی باشد.
                        </p>
                    )}

                    {availabilities && availabilities.availability.length > 1 && (
                        <>
                            {!!selectedAvailability ? (
                                <Button
                                    className='border border-neutral-400 rounded px-5 h-10 mt-8 inline-block'
                                    color='gray'
                                    onClick={() => { setSelectedAvailability(undefined) }}
                                >
                                    <ArrowRight className='w-7 h-7 fill-current' /> برگشت به نتایج
                                </Button>
                            ) : (
                                <> <br /> </>
                            )}

                            {availabilities.availability.map(item => (
                                <CipAvailibilityItem
                                    key={item.id}
                                    item={item}
                                    setSelectedAvailability={setSelectedAvailability}
                                    selectedAvailibilityId={(selectedAvailability as CipAvailabilityItemType | undefined)?.id || undefined}
                                />
                            ))}

                            <br />
                        </>
                    )}

                </div>


                {!!selectedAvailability && (
                    <div>
                        <Formik
                            validate={() => { return {} }}
                            initialValues={formInitialValue}
                            onSubmit={preReserve}
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

                                    <Form className='px-5' autoComplete='off' >

                                        <CipAirportInformation
                                            errors={errors}
                                            setFieldValue={setFieldValue}
                                            touched={touched}
                                            values={values}
                                        />

                                        <div id="reserver_passengers_section">

                                            <CipReserverInformation
                                                reserverIsPassenger={reserverIsPassenger}
                                                errors={errors}
                                                setFieldValue={setFieldValue}
                                                touched={touched}
                                                values={values}
                                            />

                                            <CipPassengersInformation
                                                passengerServicesArray={passengerServicesArray}
                                                setFieldValue={setFieldValue}
                                                values={values}
                                                errors={errors}
                                                touched={touched}
                                                setReserverIsNotPassenger={() => { setReserverIsPassenger(false) }}
                                                setPassengers={setPassengers}
                                                passengers={passengers}

                                            />
                                        </div>


                                        <CipCompanionInformation
                                            companions={companions}
                                            setCompanions={setCompanions}
                                            passengerServicesArray={passengerServicesArray}
                                            setFieldValue={setFieldValue}
                                            errors={errors}
                                            touched={touched}
                                            values={values}

                                        />

                                        {!!selectedServicesArray?.length && <CipExtraServices
                                            selectedServicesArray={selectedServicesArray}
                                            updateSelectedServices={updateSelectedServices}
                                            activeServices={activeServices}
                                            updateActiveService={updateActiveService}
                                        />}

                                        <CipTransport
                                            selectedTransport={selectedTransport}
                                            updateTransport={updateTransport}
                                            errors={errors}
                                            setFieldValue={setFieldValue}
                                            touched={touched}
                                            values={values}
                                        />

                                        <br />

                                        <CipDiscountForm
                                            onSubmit={discountSubmitHandler}
                                            data={discountData}
                                            loading={discountLoading}
                                        />

                                        <CipPriceDetails
                                            activeServices={activeServices}
                                            companions={companions}
                                            passengerServicesArray={passengerServicesArray}
                                            passengers={passengers}
                                            selectedServicesArray={selectedServicesArray}
                                            selectedTransport={selectedTransport}
                                            //discountResponse={"klkl"}
                                            validateResponse={validateResponse}
                                        />

                                        <div className='flex justify-end py-4'>
                                            <Button
                                                type="submit"
                                                className="h-12 px-5 md:w-60"
                                                loading={preReserveLoading}
                                                disabled={preReserveLoading}
                                            >
                                                ادامه فرایند خرید
                                            </Button>

                                        </div>


                                        <div id="about_section">
                                            <CipAboutAirport siteName={siteName || ""} content={airportData?.description} siteUrl={siteURL||""} />
                                            <CipTerms />
                                        </div>

                                        <div id="facilities_section">
                                            {airportData?.facilities && airportData?.facilities.length > 0 ? <CipFacilities facilities={airportData?.facilities} /> : null}
                                            <CipFAQ />
                                        </div>

                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>
                )}

        </>
    )
}

export default CipDetails;

export const getServerSideProps: GetServerSideProps = async (context: any) => {

    if (!process.env.PROJECT_MODULES?.includes("CIP")) {
        return (
            {
                props: {
                    ...await serverSideTranslations(context.locale, ['common']),
                    moduleDisabled: true
                },
            }
        )
    }

    const { locale, params } = context;

    const url = 'fa/cip/' + params?.CipDetail[0];

    const airportData: any = await getAirportByUrl(url, locale === "en" ? "en-US" : "fa-IR");

    let availibilityData: any = null;
    if (airportData?.data?.result.code) {


        const response: any = await availabilityByIataCode(airportData.data.result.code);
        if (response?.data?.result) {

            availibilityData = {
                availability: response.data.result.availability,
                latitude: response.data.result.latitude?.replace("/", "."),
                longitude: response.data.result.longitude?.replace("/", ".")
            }
        }
    }

    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common', 'cip']),
                airportData: airportData?.data?.result || null,
                availabilities: availibilityData || null
            },

        }
    )

}
