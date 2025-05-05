import { GetAirportsByCode, GetAvailabilityKey, GetFlightList, validateFlight } from "@/modules/flights/actions";
import FlightSidebarFilters from "@/modules/flights/components/sidebar/SidebarFilters";
import { FlightItemType, FlightSearchDefaultValues, FlightSortFactorType } from "@/modules/flights/types/flights";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/modules/shared/store";
import { SidebarFilterChange } from "@/modules/flights/templates/SidebarFilterChange";
import { SortHightestPrice, SortCapacity, SortTime } from "@/modules/flights/templates/SortFlightItem";
import { addSomeDays, checkDateIsAfterDate, dateDiplayFormat, dateFormat, numberWithCommas } from "@/modules/shared/helpers";
import { useRouter } from "next/router";
import ProgressBarWithLabel from "@/modules/shared/components/ui/ProgressBarWithLabel";
import { useTranslation } from "next-i18next";
import Pagination from "@/modules/shared/components/ui/Pagination";
import Head from "next/head";
import { setCabinClassFilter } from "@/modules/flights/store/flightsSlice";

import { CalendarError, Close } from "@/modules/shared/components/ui/icons";
import SearchForm from "@/modules/flights/components/shared/searchForm";
import ModalPortal from "@/modules/shared/components/ui/ModalPortal";

import NoItemFilter from "@/modules/flights/components/flightList/NoItemFilter";
import NoItemDate from "@/modules/flights/components/flightList/NoItemDate";
import ChangeDay from "@/modules/flights/components/flightList/ChangeDay";
import FlightItem from "@/modules/flights/components/flightItem/FlightItem";
import SearchData from "@/modules/flights/components/flightList/SearchData";
import SortFlights from "@/modules/flights/components/flightList/SortFlights";
import { WebSiteDataType } from "@/modules/shared/types/common";
import NotFound from "@/modules/shared/components/ui/NotFound";
import AvailabilityTimeout from "@/modules/shared/components/AvailabilityTimeout";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import FlightItemTheme2 from "@/modules/flights/components/flightList/FlightItemTheme2";
import FlightDetailsTheme2 from "@/modules/flights/components/flightList/FlightDetailsTheme2";
import Button from "@/modules/shared/components/ui/Button";
import BannerInSearchList from "@/modules/domesticHotel/components/shared/BannerInSearchList";
import { setAlertModal } from "@/modules/shared/store/alertSlice";


type Airport = {
    name?: string;
    city: {
        name: string;
        code: string;
    };
    country: {
        name: string;
        code: string;
    };
    code?: string;
    latitude?: string;
    longitude?: string;
    airportType: "Main" | "Subsidiary" | "City";
}

const Flights: NextPage = ({ airports, routeCodes, portalData, moduleDisabled }: { airports?: Airport[], routeCodes?: string, portalData?: WebSiteDataType; moduleDisabled?: boolean; }) => {

    const dispatch = useDispatch()
    const { t } = useTranslation("common");
    const { t: tFlight } = useTranslation("flight");

    const SidebarFilter = useSelector((state: RootState) => state.flightFilters.filterOption)
    let [flightsInFilter, setFlightsInFilter] = useState<FlightItemType[]>()
    let [sortFlights, setSortFlights] = useState<FlightSortFactorType>('LowestPrice')
    let [fetchDataCompelete, setFetchDataCompelte] = useState(false)
    let [showSkeleton, setShowSkeleton] = useState(false);

    let [showSearchForm, setShowSearchForm] = useState<boolean>(false);
    const [showSearchFormTheme2, setShowSearchFormTheme2] = useState<boolean>(false);
    const [selectedFlight, setSelectedFlight] = useState<FlightItemType | undefined>(undefined);

    const [page, setPage] = useState(1)
    const firstItemIndex = (page - 1) * 10;
    const lastItem = page * 10;
    const [key, setKey] = useState<string>("");

    const [departureList, setDepartureList] = useState<any>([]);

    const [loadingPercentage, setLoadingPercentage] = useState<number>(0);

    const [prereserveLoading, setPrereserveLoading] = useState<boolean>(false);

    const [showChangeDateModal, setShowChangeDateModal] = useState<boolean>(false);

    const router = useRouter();

    const { query, locale } = router;

    const passengers = {
        adults: +(query.adult || 0),
        children: +(query.child || 0),
        infants: +(query.infant || 0)
    }
    const allPassengers = passengers.adults + passengers.children + passengers.infants;

    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [delayedOpen, setDelayedOpen] = useState<boolean>(false);

    const hasFlight = process.env.PROJECT_MODULES?.includes("DomesticFlight");

    useEffect(() => {
        if (openDetail) {
            setTimeout(() => { setDelayedOpen(true) }, 100);
        }
    }, [openDetail]);

    useEffect(() => {
        if (!delayedOpen) {
            setTimeout(() => { setOpenDetail(false); setSelectedFlight(undefined) }, 200);
        }
    }, [delayedOpen]);

    useEffect(() => {
        if (selectedFlight) {
            setOpenDetail(true);
        } else {
            setDelayedOpen(false);
        }
    }, [selectedFlight?.flightKey])


    useEffect(() => {

        let departureDate;
        let returnDate;

        if (query.departing) {
            departureDate = new Date(query.departing as string);
        }
        if (query.returning) {
            returnDate = new Date(query.returning as string);
        }

        const today = dateFormat(new Date());
        const tomorrow = dateFormat(addSomeDays(new Date()));

        if (!departureDate) {
            return;
        }

        //setShowOnlyForm(false);

        let validDates: boolean;

        if (returnDate) {
            validDates = checkDateIsAfterDate(new Date(departureDate), new Date(today)) && checkDateIsAfterDate(new Date(returnDate), new Date(tomorrow));
        } else {
            validDates = checkDateIsAfterDate(new Date(departureDate), new Date(today));
        }


        if (!validDates) {
            setShowChangeDateModal(true);
        }
    }, [query.departing, query.returning]);

    useEffect(() => {
        SidebarFilterChange(departureList, SidebarFilter, setFlightsInFilter)
    }, [SidebarFilter])

    useEffect(() => {
        setFlightsInFilter(departureList)
    }, [departureList])

    useEffect(() => {
        setPage(1)
    }, [SidebarFilter])

    const acceptLanguage = locale === "en" ? "en-US" : locale === "ar" ? "ar-AE" : "fa-IR";

    const fetchKey = async (codes?: string) => {

        if (!codes || !hasFlight) return;

        setShowSkeleton(true);
        setShowSearchForm(false);
        setKey("");

        let departureDate = dateFormat(new Date());
        let returnDate: string = "";
        if (query.departing) {
            departureDate = dateFormat(new Date(query.departing as string));
        }
        if (query.returning) {
            returnDate = dateFormat(new Date(query.returning as string));
        }

        const parameters: {
            adult: number;
            child: number;
            infant: number;
            departureCode: string;
            returnCode: string;
            departureTime: string;
            retrunTime?: string;
        } = {
            adult: query.adult ? +query.adult : 1,
            child: query.child ? +query.child : 0,
            infant: query.infant ? +query.infant : 0,
            departureCode: codes.split("-")[0],
            returnCode: codes.split("-")[1],
            departureTime: departureDate
        };

        if (returnDate) {
            parameters.retrunTime = returnDate;
        }
        const token = localStorage.getItem('Token') || "";
        const response: any = await GetAvailabilityKey(parameters, token, acceptLanguage);

        if (response?.data?.result) {
            setKey(response.data.result);

            setLoadingPercentage(40);
        }
    }

    useEffect(() => {

        setLoadingPercentage(0);

        setTimeout(() => {
            setLoadingPercentage(10);
        }, 100);

        if (routeCodes) {
            fetchKey(routeCodes);
        }
        if (query.flightType && !SidebarFilter.cabinClassOption.includes((query.flightType as string))) {
            dispatch(setCabinClassFilter(SidebarFilter.cabinClassOption.concat(query.flightType)))
        }
        setSelectedFlight(undefined);

    }, [router.asPath]);


    useEffect(() => {

        let fetchInterval: any = null;

        if (key) {

            const fetchData = async () => {

                const token = localStorage.getItem('Token') || "";

                const response: any = await GetFlightList({ key: key, currency: "IRR", token: token }, acceptLanguage);

                setShowSkeleton(false);

                if (response?.data?.result?.isCompleted) {

                    const result = response?.data?.result;
                    setFetchDataCompelte(result.isCompleted)

                    setDepartureList(result.departureFlights);

                    clearInterval(fetchInterval);

                    setLoadingPercentage(99);

                    setTimeout(() => {
                        setLoadingPercentage(100);
                    }, 1500);

                } else {
                    setLoadingPercentage(prevValue => {
                        if (prevValue < 80) {
                            return (prevValue + 20);
                        }
                        return (prevValue + 3);
                    });
                }
            }

            fetchData();

            fetchInterval = setInterval(() => {

                fetchData();

            }, 3000);
        }

        return () => {
            clearInterval(fetchInterval);
        };

    }, [key]);


    if (moduleDisabled || !hasFlight) {
        return (
            <NotFound />
        )
    }


    let origin: string = "";
    let destination: string = "";

    let defaultValues: FlightSearchDefaultValues | undefined = undefined;
    if (airports && routeCodes) {
        const originCode = routeCodes.split("-")[0];
        const destinationCode = routeCodes.split("-")[1];

        const originObject = airports.find(item => item.code === originCode);
        const destinationObject = airports.find(item => item.code === destinationCode);

        origin = originObject?.city.name || "";
        destination = destinationObject?.city.name || "";

        if (originObject && destinationObject) {

            defaultValues = {
                originCode: originCode,
                destinationCode: destinationCode,
                airTripType: query.returning ? "RoundTrip" : "OneWay",
                adult: +(query.adult || 0),
                child: +(query.child || 0),
                infant: +(query.infant || 0),
                cabinClassCode: (query.flightType as string) || "All",
                departureDate: query.departing as string || "",
                returnDate: query.returning as string || undefined,
                originObject: {
                    airportType: originObject.airportType,
                    city: {
                        code: originObject.city.code,
                        name: originObject.city.name
                    },
                    code: originObject.code || "",
                    name: originObject.name || ""
                },
                destinationObject: {
                    airportType: destinationObject.airportType,
                    city: {
                        code: destinationObject.city.code,
                        name: destinationObject.city.name
                    },
                    code: destinationObject.code || "",
                    name: destinationObject.name || ""
                }
            }
        }


    }

    const siteName = portalData?.billing.name || "";

    const research = () => {
        fetchKey(routeCodes);
    }

    const theme2 = process.env.THEME === "THEME2";

    let selectedFlightTotalPrice = 0;
    if (selectedFlight) {
        selectedFlightTotalPrice = passengers?.adults * selectedFlight.adultPrice + passengers?.children * selectedFlight.childPrice + passengers?.infants * selectedFlight.infantPrice;
    }

    const prereserveFlight = (flightData: FlightItemType) => {

        if (!flightData?.capacity) return;

        const urlParameters = router.query;

        if (!flightData.hasReturn && urlParameters.returning) {
            dispatch(setAlertModal({
                type:"error",
                title: t('error'),
                message: "در حال حاضر خرید این بلیط به صورت رفت و برگشت امکان پذیر نیست. اگر مایل به خرید این پرواز هستید لطفا به صورت بلیط رفت و برگشت مجزا برای خرید ان اقدام کنید",
                isVisible: true
            }));
            return;
        }

        if (!urlParameters.returning) {
            setPrereserveLoading(true);

            const token = localStorage.getItem('Token') || "";

            const validate = async (key: string) => {
                const response: any = await validateFlight({ departureKey: key, token: token });
                if (response?.data?.result?.preReserveKey) {
                    router.push(
                        `/flights/checkout?key=${response.data.result.preReserveKey}`
                    );
                } else {
                    setPrereserveLoading(false);
                    dispatch(setAlertModal({
                        type:"error",
                        title: t('error'),
                        message: "لطفا پرواز دیگری را انتخاب کنید",
                        isVisible: true
                    }));

                    return;
                }
            }
            validate(flightData.flightKey);
        }

    }

    return (
        <>
            <Head>
                {!!(destination && origin) && (
                    <>
                        <title>{tFlight("flight-list-title", { origin: origin, destination: destination, siteName: siteName })}</title>
                        <meta name="description" content={tFlight("flight-list-description", { origin: origin, destination: destination, siteName: siteName })} />
                    </>
                )}
            </Head>

            <ModalPortal
                show={showChangeDateModal}
                selector='modal_portal'
            >
                <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">

                    <div className="bg-white max-sm:mx-3 rounded-xl px-5 pt-10 pb-12 w-full max-w-md text-center">

                        <CalendarError className="w-6 h-6 sm:w-10 sm:h-10 fill-neutral-400 mb-3 md:mb-4 inline-block" />

                        <h5 className="text-md sm:text-xl font-semibold mb-4">
                            {t("DatesAreExpired")}
                        </h5>

                        <div className="text-neutral-500 mb-4 md:mb-7 leading-7 text-sm text-center">
                            {t("SorryTheDatesYouEnteredAreExpiredChooseDifferentDatesToViewHotelOptions")}.
                        </div>


                        <button
                            type="button"
                            className="max-w-full w-32 cursor-pointer bg-primary-700 hover:bg-primary-600 text-white h-10 px-5 rounded-md"
                            onClick={() => {
                                setShowChangeDateModal(false);
                                setShowSearchForm(true);
                            }}
                        >
                            {t('ChangeDates')}
                        </button>

                        <br />

                        <button
                            type='button'
                            className='text-blue-500 mt-3'
                            onClick={() => { setShowChangeDateModal(false) }}
                        >
                            {t("ContinueAnyway")}
                        </button>


                    </div>

                </div>

            </ModalPortal>

            <div className="p-5 max-md:p-3 gap-5 relative grid grid-cols-1 lg:grid-cols-4">

                {theme2 && (
                    <>
                        <ModalPortal
                            selector="modal_portal"
                            show={!!selectedFlight}
                        >
                            <div className={`fixed h-screen shadow-normal p-5 flex flex-col justify-between top-0 w-screen sm:w-400 pb-5 bg-white duration-200 transition-all overflow-auto rtl:left-0 ltr:right-0 ${delayedOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"}`}>
                                <div>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 mb-5"
                                        onClick={() => { setDelayedOpen(false) }}
                                    >
                                        <Close className="w-6 h-6 fill-red-600" />
                                        <span className="text-neutral-500 text-xs"> بازگشت به لیست پرواز </span>
                                    </button>

                                    {!!selectedFlight && <FlightDetailsTheme2
                                        flight={selectedFlight}
                                        passengers={passengers}
                                    />}
                                </div>

                                {!!selectedFlight && <div className="rtl:text-left ltr:text-right">

                                    {selectedFlight.capacity ? (
                                        <div className="text-2xs text-red-600 block mt-1"> {selectedFlight.capacity} صندلی باقیمانده</div>
                                    ) : (
                                        <div className="text-base text-center font-semibold border border-red-300 rounded p-3 text-red-600 block mt-1">
                                            ظرفیت  تکمیل است
                                            <div className="mt-1 text-2xs">
                                                لطفا پرواز دیگری انتخاب کنید.
                                            </div>
                                        </div>
                                    )}

                                    {selectedFlightTotalPrice ? (
                                        <div className="mt-1">
                                            <span className="font-semibold text-lg md:text-xl">
                                                {numberWithCommas(selectedFlightTotalPrice)}
                                            </span>
                                            <span className="text-2xs font-semibold">
                                                ریال
                                            </span>
                                        </div>
                                    ) : null}

                                    {!!selectedFlight.capacity && <Button
                                        onClick={() => { prereserveFlight(selectedFlight) }}
                                        type="button"
                                        className="w-full px-5 h-10 mt-2"
                                        loading={prereserveLoading}
                                    >
                                        انتخاب
                                    </Button>}
                                </div>}
                            </div>
                        </ModalPortal>

                        <div
                            className={`text-blue-600 ${showSearchFormTheme2 ? "hidden" : "lg:hidden"} text-xs border-b border-b-yellow-400 border-b-2 pb-2`}
                            onClick={() => { setShowSearchFormTheme2(true) }}
                        >
                            <h3 className="text-lg">
                                {origin} به {destination}
                            </h3>
                            {!!defaultValues?.departureDate && dateDiplayFormat({ date: defaultValues.departureDate, format: "dd mm yyyy", locale: "fa" })} . {allPassengers} مسافر
                        </div>

                        <SearchForm
                            wrapperClassName={`lg:col-span-4 ${showSearchFormTheme2 ? "" : "max-lg:hidden"}`}
                            defaultValues={defaultValues}
                            research={research}
                        />

                        <div
                            className={`text-blue-600 mx-auto ${showSearchFormTheme2 ? "lg:hidden" : "hidden"}`}
                            onClick={() => { setShowSearchFormTheme2(false) }}
                        >
                            بستن
                        </div>
                    </>
                )}

                <FlightSidebarFilters FlightsData={departureList} flightsInFilterLengths={flightsInFilter?.length} />

                <div className="lg:col-span-3">

                    {!theme2 && <SearchData
                        showSearchForm={() => { setShowSearchForm(true) }}
                        airports={airports}
                    />}

                    <div className={theme2 ? "md:flex md:justify-between" : ""}>

                        <ChangeDay />

                        {flightsInFilter?.length ? <SortFlights sortFactor={sortFlights} setSortFactor={setSortFlights} /> : null}

                    </div>


                    {!!query.returning && <p className="text-sm mt-5" > ابتدا از لیست زیر، بلیط رفت خود را انتخاب نمایید</p>}


                    {!theme2 && !!departureList.length && (
                        <Pagination
                            totalItems={flightsInFilter?.length || 0}
                            itemsPerPage={10}
                            onChange={setPage}
                            currentPage={page}
                            wrapperClassName="mt-5"
                        />
                    )}

                    {
                        !(loadingPercentage === 100) && <ProgressBarWithLabel
                            percentage={loadingPercentage}
                            label={tFlight('getting-best-suggestion')}
                            className="mt-5"
                        />
                    }

                    {!!showSkeleton && (
                        <>
                            {[1, 2, 3, 4, 5].map(skeletonItem => (
                                <div className="bg-white border my-5 grid grid-cols-4" key={skeletonItem}>
                                    <div className="col-span-3 p-5 rtl:border-l border-dotted border-neutral-300">
                                        <Skeleton className="w-1/2" />
                                        <Skeleton className="my-3 w-3/4" />
                                        <Skeleton className="w-12" />
                                    </div>

                                    <div className="rtl:ltr p-5">
                                        <Skeleton className="w-2/3" />
                                        <Skeleton className="my-3 w-full" />
                                        <Skeleton className="w-1/3" />
                                    </div>

                                </div>
                            ))}
                        </>
                    )}

                    {
                        flightsInFilter?.sort((a, b) => SortCapacity(a, b))
                            .sort((a: FlightItemType, b: FlightItemType): any => {
                                if (sortFlights == "HighestPrice") return SortHightestPrice(a, b)
                                else if (sortFlights == "Time") return SortTime(a, b)
                                else {
                                    return a.capacity && a.adultPrice - b.adultPrice
                                }
                            }).slice(firstItemIndex, lastItem).map((flight: FlightItemType, index:number) =>
                                <Fragment key={flight.flightKey} >
                                    {theme2 ? (
                                        <FlightItemTheme2
                                            flight={flight}
                                            passengers={passengers}
                                            onSelectFlight={() => { setSelectedFlight(flight) }}
                                        />
                                    ) : (
                                        <>
                                            <FlightItem passengers={passengers} flightData={flight} />
                                            {/* {index=== 3 && (
                                                <BannerInSearchList
                                                    destinationCode= {departureList[0]?.arrivalAirport?.city?.code}
                                                    itemType="list"
                                                />
                                            )} */}
                                        </>
                                    )}
                                </Fragment>
                            )
                    }

                    {
                        departureList.length ? <Pagination
                            totalItems={flightsInFilter?.length || 0}
                            itemsPerPage={10}
                            onChange={setPage}
                            currentPage={page}
                            wrapperClassName="mt-5"
                        /> : null
                    }

                    {
                        fetchDataCompelete && !departureList.length &&
                        <NoItemDate />
                    }
                    {
                        !flightsInFilter?.length && departureList.length && loadingPercentage == 100 ?
                            <NoItemFilter /> : null
                    }



                    <ModalPortal
                        selector="modal_portal"
                        show={showSearchForm}
                    >
                        <div className='fixed top-0 left-0 h-screen w-screen'>
                            <div className='absolute left-0 right-0 top-0 bottom-0 bg-black/50 backdrop-blur'
                                onClick={() => { setShowSearchForm(false) }}
                            />

                            <div className="max-w-container mx-auto relative sm:p-5 sm:pt-20">

                                <div className="sm:rounded-md p-3 max-sm:h-screen max-sm:overflow-auto sm:p-5 w-full bg-black/75 relative text-white" >
                                    <div className="font-semibold mb-3 sm:text-lg">
                                        تغییر جستجو
                                    </div>

                                    <button
                                        type='button'
                                        className='absolute top-3 left-3'
                                        onClick={() => { setShowSearchForm(false) }}
                                    >
                                        <Close className='w-8 h-8 fill-neutral-400' />
                                    </button>

                                    <SearchForm
                                        defaultValues={defaultValues}
                                        research={research}
                                    />

                                </div>
                            </div>

                        </div>
                    </ModalPortal>
                </div>
            </div>

            {!!key && (
                <AvailabilityTimeout
                    minutes={20}
                    onRefresh={() => { window.location.reload() }}
                    description={tFlight("flightTimeoutMessage")}
                />
            )}
        </>
    )
}

export default Flights;

export async function getServerSideProps(context: any) {

    if (!process.env.PROJECT_MODULES?.includes("DomesticFlight")) {
        return (
            {
                props: {
                    ...await serverSideTranslations(context.locale, ['common']),
                    moduleDisabled: true
                },
            }
        )
    }

    const { locale, query } = context;

    const acceptLanguage = locale === "en" ? "en-US" : locale === "ar" ? "ar-AE" : "fa-IR";

    const codesArray = query.flights?.split("-");

    let airports;

    if (codesArray.length) {
        const response: any = await GetAirportsByCode(codesArray, acceptLanguage);
        if (response?.data?.result?.items) {
            airports = response.data.result.items;
        }
    }

    return ({
        props: {
            ...await (serverSideTranslations(context.locale, ['common', 'flight'])),
            airports: airports || null,
            routeCodes: query.flights || null
        },
    });
}