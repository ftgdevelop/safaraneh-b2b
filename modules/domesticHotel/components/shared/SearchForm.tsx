import { useTranslation, i18n } from "next-i18next";
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/router";

import { getDomesticHotelSummaryDetailById } from "@/modules/domesticHotel/actions";
import { Header, ServerAddress, Hotel } from "../../../../enum/url";
import AutoComplete from "../../../shared/components/ui/AutoComplete";
import { ApartmentOutline, Calendar, Home2, Location } from "../../../shared/components/ui/icons";
import { EntitySearchResultItemType, HotelRecentSearchItem } from "@/modules/domesticHotel/types/hotel";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { setAlertModal } from "@/modules/shared/store/alertSlice";
import RangePicker from "../../../shared/components/ui/RangePicker";
import { localeFa } from "@mobiscroll/react";
import Button from "../../../shared/components/ui/Button";
import AutoCompleteZoom from "@/modules/shared/components/ui/AutoCompleteZoom";



type Props = {
    defaultDestination?: EntitySearchResultItemType;
    defaultDates?: [string, string];
    wrapperClassName?: string;
}

const SearchForm: React.FC<Props> = props => {

    const { defaultDestination } = props;

    const { t } = useTranslation('common');
  

    const router = useRouter();
    const routerPath = router.asPath;

    const dispatch = useAppDispatch();

    const [dates, setDates] = useState<[string, string] | undefined>(props.defaultDates);

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const dateChangeHandle = (event: any) => {

        if (event.value[0] && event.value[1]) {
            setDates(event.value)
        }
    }

    const [defaultDestinations, setDefaultDestinations] = useState<EntitySearchResultItemType[] | undefined>();

    const [selectedDestination, setSelectedDestination] = useState<EntitySearchResultItemType>();

    useEffect(() => {
        if (defaultDestination) {
            setSelectedDestination(defaultDestination);
        }
    }, [defaultDestination?.name]);

    useEffect(() => {
        setSubmitLoading(false);
    }, [routerPath]);

    const autoCompleteUrl = `${ServerAddress.Type}${ServerAddress.Hotel_Data}${Hotel.GetEntity}`;

    useEffect(() => {

        if (!selectedDestination) {

            const localStorageDefaultDestinations = localStorage?.getItem('domesticHotelSearchDefaultDestinations');
            const initialDestinations = localStorageDefaultDestinations ? JSON.parse(localStorageDefaultDestinations) : undefined;

            if (initialDestinations) {

                setDefaultDestinations(initialDestinations);

            } else {
                const acceptLanguage = i18n && i18n.language === "en" ? "en-US" : "fa-IR";

                const fetchDefaultDestinations = async () => {
                    try {
                        const response = await axios({
                            method: "post",
                            url: autoCompleteUrl,
                            headers: {
                                ...Header,
                                apikey: process.env.PROJECT_PORTAL_APIKEY,
                                "Accept-Language": acceptLanguage || "fa-IR",
                            }
                        })

                        if (response?.data?.result?.length) {

                            setDefaultDestinations(response.data.result);
                            localStorage?.setItem('domesticHotelSearchDefaultDestinations', JSON.stringify(response.data.result));

                        }

                    } catch (error: any) {
                        if (error.message) {
                            dispatch(setAlertModal({
                                title: t('error'),
                                message: error.message,
                                isVisible: true
                            }))
                        }

                    }
                }
                fetchDefaultDestinations();

            }
        }

    }, [i18n?.language]);

    const renderOption = useCallback((option: EntitySearchResultItemType, direction: "ltr" | "rtl" | undefined) => (
        <div className={`px-3 py-2 flex gap-3 hover:bg-blue-50 items-center ${!direction ? "" : direction === 'rtl' ? "rtl" : "ltr"}`}>
            {option.type === "Hotel" ? <ApartmentOutline className="w-5 h-5 fill-current" /> : option.type === "Province" ? <Home2 className="w-5 h-5 fill-current" /> : <Location className="w-5 h-5 fill-current" />}
            <div className="leading-5 text-neutral-600">
                <div className='text-xs font-bold'>{option.name}</div>
                <div className='text-3xs'>{option.displayName}</div>
            </div>
        </div>
    ), [])


    const submitHandler = async () => {
        if (!dates || dates.length < 2) {
            // TODO validation message
            return;
        }

        if (!selectedDestination) {
            // TODO validation message
            return;
        }

        setSubmitLoading(true);

        let url: string = "";

        const isSafarLife = process.env.SITE_NAME === 'https://www.safarlife.com';

        switch (selectedDestination.type) {
            case "City":
                if (isSafarLife && selectedDestination.slug){
                    url = selectedDestination.slug;
                }else if (i18n && i18n.language === "fa") {
                    url = `/hotels/هتل-های-${selectedDestination.name!.replace(/ /g, "-")}`;
                } else if (i18n && i18n.language === "ar") {
                    url = `/hotels/فنادق-${selectedDestination.name!.replace(/ /g, "-")}`;
                } else {
                    url = `/hotels/${selectedDestination.name!.replace(/ /g, "-")}`;
                }

                break;

            case "Province":

                if (i18n && i18n.language === "fa") {
                    url = `/hotels/هتل-های-استان-${selectedDestination.name!.replace(/ /g, "-")}`;
                } else if (i18n && i18n.language === "ar") {
                    url = `/hotels/فنادق-محافظة-${selectedDestination.name!.replace(/ /g, "-")}`;
                } else {
                    url = `/hotels/${selectedDestination.name!.replace(/ /g, "-")}`;
                }

                break;

            case "Hotel":
                const hotelDetailsResponse = await getDomesticHotelSummaryDetailById(selectedDestination.id!, i18n?.language === "en" ? "en-US" : "fa-IR");

                if (hotelDetailsResponse.data?.result) {
                    if(hotelDetailsResponse.data.result.url){
                        url = hotelDetailsResponse.data.result.url;
                    }
                } else {
                    let message = "";
                    if (hotelDetailsResponse.response) {
                        message = hotelDetailsResponse.response.statusText || hotelDetailsResponse.response.data.error?.message || t('oopsSomethingWentWrong1');
                    } else if (!hotelDetailsResponse.request) {
                        message = hotelDetailsResponse.message;
                    } else {
                        message = t('oopsSomethingWentWrong2')
                    }
                    dispatch(setAlertModal({
                        title: t('error'),
                        message,
                        isVisible: true
                    }));
                    return;
                }

                break;

            default:
                url = "";
        }


        if(!url){
            dispatch(setAlertModal({
                title: t('error'),
                message: "متاسفانه برای این مقصد اطلاعاتی یافت نشد!",
                isVisible: true
            }))
            return;
        }

        url += `/checkin-${dates[0]}/checkout-${dates[1]}`;

        const localStorageRecentSearches = localStorage?.getItem("hotelRecentSearches");
        const recentSearches: HotelRecentSearchItem[] = localStorageRecentSearches ? JSON.parse(localStorageRecentSearches) : [];

        const searchObject: HotelRecentSearchItem = {
            url: url,
            title: selectedDestination.displayName || selectedDestination.name || "",
            dates: dates,
        };

        if (!(recentSearches.find(item => item.url === searchObject.url))) {
            recentSearches.unshift(searchObject);

            const slicedArray = recentSearches.slice(0, 10);

            const updatedRecentSearches = JSON.stringify(slicedArray);
            localStorage?.setItem("hotelRecentSearches", updatedRecentSearches)
        }

        router.push(url);

    }

    return (
        <div className={`domestic-hotel-search-form grid grid-cols-1 md:grid-cols-7 gap-2 ${props.wrapperClassName || ""}`}>


            <div className="relative z-20 col-span-1 md:col-span-3">
                <label htmlFor="destination" className="text-sm block mb-2">
                    جستجوی نام هتل / شهر مقصد
                </label>
                <AutoComplete
                    type="hotel"
                    defaultList={defaultDestinations}
                    inputId="destination"
                    noResultMessage={t('NoResultsFound')}
                    createTextFromOptionsObject={(item: EntitySearchResultItemType) => item.displayName || item.name || ""}
                    acceptLanguage="fa-IR"
                    renderOption={renderOption}
                    icon="location"
                    inputClassName={`w-full outline-none border rounded-lg border-slate-300 h-12 text-sm text-neutral-500 placeholder:text-neutral-300 focus:border-slate-400`}
                    placeholder={t('search-hotel-or-city')}
                    min={2}
                    value={selectedDestination}
                    onChangeHandle={setSelectedDestination}
                    url={autoCompleteUrl}
                />
            </div>
            


            <div className={`col-span-1 md:col-span-3 relative z-10`}>

                <RangePicker
                    value={dates}
                    onChange={dateChangeHandle}
                    rtl
                    locale={localeFa}
                />

            </div>

            <div className={`col-span-1 pt-5 md:pt-0 md:col-span-1 self-end`}>
                <Button
                    loading={submitLoading}
                    onClick={submitHandler}
                    className={`h-12 block w-full mx-auto sm:max-w-64`}
                >
                    {t('search')}
                </Button>
            </div>
        </div>
    )
}

export default SearchForm;