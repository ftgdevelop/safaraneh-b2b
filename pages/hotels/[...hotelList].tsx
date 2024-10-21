import { useEffect, useRef, useState } from 'react';
import { AvailabilityByHotelId, SearchAccomodation, getEntityNameByLocation, getRates } from '@/modules/domesticHotel/actions';
import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { EntitySearchResultItemType, PricedHotelItem, SearchAccomodationItem, SortTypes } from '@/modules/domesticHotel/types/hotel';
import SearchForm from '@/modules/domesticHotel/components/shared/SearchForm';
import HotelsList from '@/modules/domesticHotel/components/hotelsList';
import { addSomeDays, checkDateIsAfterDate, dateDiplayFormat, dateFormat } from '@/modules/shared/helpers';
import ProgressBarWithLabel from '@/modules/shared/components/ui/ProgressBarWithLabel';
import { useTranslation } from 'next-i18next';
import Select from '@/modules/shared/components/ui/Select';
import Skeleton from '@/modules/shared/components/ui/Skeleton';
import parse from 'html-react-parser';
import Accordion from '@/modules/shared/components/ui/Accordion';
import { CalendarError, ErrorIcon, Hotel, QuestionCircle, UserX } from '@/modules/shared/components/ui/icons';
import DomesticHotelListSideBar from '@/modules/domesticHotel/components/hotelsList/sidebar';
import { setGuestPointFilterOptions, setTypeFilterOptions, setPriceFilterRange, setPromotionsFilterOptions } from '@/modules/domesticHotel/store/domesticHotelSlice';
import { useAppDispatch } from '@/modules/shared/hooks/use-store';
import { useRouter } from 'next/router';
import HotelsOnMap from '@/modules/domesticHotel/components/hotelsList/HotelsOnMap';
import Image from 'next/image';
import { getPageByUrl } from '@/modules/shared/actions';
import { GetPageByUrlDataType} from '@/modules/shared/types/common';
import ModalPortal from '@/modules/shared/components/ui/ModalPortal';
import AvailabilityTimeout from '@/modules/shared/components/AvailabilityTimeout';

const HotelList: NextPage = () => {

  const [pageData, setPageData] = useState<GetPageByUrlDataType | undefined>(undefined);
  const [accomodations, setAccomodations] = useState<SearchAccomodationItem[]>([]);
  const [listLoading, setListLoading] = useState<boolean>(false);

  const isSafaraneh = process.env.PROJECT === "SAFARANEH";

  const searchFormWrapperRef = useRef<HTMLDivElement>(null);

  type RatesResponseItem = {
    HotelId: number;
    Satisfaction: number;
    PositiveRowCount: number;
    TotalRowCount: number;
  }

  type PricesResponseItem = {
    id: number;
    salePrice: number;
    boardPrice: number;
    promotions?: {
      name?: string;
      description?: string;
    }[];
  }

  const dispatch = useAppDispatch();

  const router = useRouter();

  const { t } = useTranslation('common');
  const { t: tHotel } = useTranslation('hotel');

  const [fetchPercentage, setFetchPercentage] = useState<number>(0);

  const [ratesData, setRatesData] = useState<RatesResponseItem[] | undefined>();
  const [ratesLoading, setRatesLoading] = useState<boolean>(false);

  const [pricesData, setPricesData] = useState<PricesResponseItem[] | undefined>();
  const [pricesLoading, setPricesLoading] = useState<boolean>(false);

  const [sortFactor, setSortFactor] = useState<SortTypes>("priority");

  const [entity, setEntity] = useState<{ EntityName: string; EntityType: "City" | "Province" | "Hotel"; slug?: string; }>();

  const [showMap, setShowMap] = useState<boolean>(false);

  const [showChangeDateModal, setShowChangeDateModal] = useState<boolean>(false);
  const [showOnlyForm, setShowOnlyForm] = useState<boolean>(false);

  const today = dateFormat(new Date());
  const tomorrow = dateFormat(addSomeDays(new Date()));
  let checkin = today;
  let checkout = tomorrow;

  const locale = router.locale;
  const acceptLanguage = locale === "en" ? "en-US" : locale === "ar" ? "ar-AE" : "fa-IR";

  const pathSegments = router.asPath?.split("/");

  const checkinSegment = pathSegments.find(item => item.includes("checkin"))?.split("?")[0]?.split("#")[0];
  const checkoutSegment = pathSegments.find(item => item.includes("checkout"))?.split("?")[0]?.split("#")[0];

  let searchInfo = "";
  if (checkinSegment) {
    checkin = checkinSegment.split("checkin-")[1];
    checkout = checkoutSegment ? checkoutSegment.split("checkout-")[1] : dateFormat(addSomeDays(new Date(checkin)));

    searchInfo = `/checkin-${checkin}/checkout-${checkout}`;
  }

  const savePriceRange = (pricedItems: PricesResponseItem[]) => {

    let min = 0;
    let max = 0;

    for (let i = 0; i < pricedItems.length; i++) {
      const itemPrice = pricedItems[i].salePrice;
      if ((!min || min > itemPrice) && itemPrice > 10000) {
        min = itemPrice;
      }
      if (!max || max < itemPrice) {
        max = itemPrice;
      }
    }

    dispatch(setPriceFilterRange({ min: min, max: max }));
  }

  const saveGuestPointFilterOptions = (rates: RatesResponseItem[]) => {

    const filterOptions = {
      excellent: { label: tHotel('excellent'), count: 0, value: [90, 100] },
      veryGood: { label: tHotel('very-good'), count: 0, value: [80, 89] },
      good: { label: tHotel('good'), count: 0, value: [70, 79] },
      fair: { label: tHotel('fair'), count: 0, value: [50, 69] },
      bad: { label: tHotel('bad'), count: 0, value: [0, 49] },
    }

    for (let i = 0; i < rates.length; i++) {
      const itemSatisfaction = rates[i].Satisfaction;

      if (itemSatisfaction >= 90) {
        filterOptions.excellent.count = filterOptions.excellent.count + 1;
      } else if (itemSatisfaction >= 80) {
        filterOptions.veryGood.count = filterOptions.veryGood.count + 1;
      } else if (itemSatisfaction >= 70) {
        filterOptions.good.count = filterOptions.good.count + 1;
      } else if (itemSatisfaction >= 50) {
        filterOptions.fair.count = filterOptions.fair.count + 1;
      } else {
        filterOptions.bad.count = filterOptions.bad.count + 1;
      }
    }

    const optionsArray = Object.values(filterOptions)

    dispatch(setGuestPointFilterOptions(optionsArray));

  }
  // const saveFacilityOptions = (hotelItems: SearchHotelItem[]) => {

  //   const options: { keyword: string, label: string, count: number }[] = [];

  //   for (let i = 0; i < hotelItems.length; i++) {
  //     const hotelItemFacilities = hotelItems[i].Facilities;

  //     if (!hotelItemFacilities?.length) continue;

  //     for (let j = 0; j < hotelItemFacilities.length; j++) {
  //       const facilityItem = hotelItemFacilities[j];

  //       const updatingOptionItem = options.find(item => item.keyword === facilityItem.Keyword);

  //       if (!facilityItem.Keyword) continue;

  //       if (updatingOptionItem) {
  //         updatingOptionItem.count = updatingOptionItem.count + 1;
  //       } else {
  //         options.push({ keyword: facilityItem.Keyword, label: facilityItem.Title || "", count: 1 })
  //       }

  //     }
  //   }

  //   dispatch(setFacilityFilterOptions(options));

  // }

  const saveHotelType = (hotelItems: SearchAccomodationItem[]) => {

    const options: { id: string, label: string, count: number }[] = [];

    for (let i = 0; i < hotelItems.length; i++) {

      const hotelItem = hotelItems[i];

      if (!hotelItem.type) {
        continue;
      }

      const updatingOptionItem = options.find(item => item.id === hotelItem.type);

      if (updatingOptionItem) {
        updatingOptionItem.count = updatingOptionItem.count + 1
      } else {
        options.push({ id: hotelItem.type, label: hotelItem.typeStr || "", count: 1 })
      }
    }

    dispatch(setTypeFilterOptions(options));

  }



  const saveOffersOptions = (hotelItems: PricedHotelItem[]) => {

    const options: { keyword: string, label: string, count: number }[] = [];

    for (let i = 0; i < hotelItems.length; i++) {

      const hotelItemPromotions = hotelItems[i].promotions;

      if (!hotelItemPromotions?.length) continue;

      for (let j = 0; j < hotelItemPromotions.length; j++) {
        const promotionItem = hotelItemPromotions[j];

        const updatingOptionItem = options.find(item => item.keyword === promotionItem.name);

        if (!promotionItem.name) continue;

        if (updatingOptionItem) {
          updatingOptionItem.count = updatingOptionItem.count + 1;
        } else {
          options.push({ keyword: promotionItem.name, label: promotionItem.name || "", count: 1 })
        }

      }
    }

    dispatch(setPromotionsFilterOptions(options));

  }

  const localStorageToken = localStorage.getItem('Token');
  const localStorageTenant = localStorage?.getItem('S-TenantId');

  useEffect(()=>{
    if (fetchPercentage > 90){
      setTimeout(()=>{setFetchPercentage(100)},1000);
    } else if (fetchPercentage > 80){
      setTimeout(()=>{setFetchPercentage(99.9)},1000);
    }
  },[fetchPercentage])

  useEffect(() => {

    const fetchAccomodations = async (tenant: number) => {
      
      const { query } = router;

      setListLoading(true);
      setAccomodations([]);
      setFetchPercentage(0);

      let url = `/${locale}/hotels/${query.hotelList![0]}`;

      // if (process.env.LocaleInUrl === "off"){
      //   url = `/hotels/${query.hotelList![0]}`;
      // }

      const searchParameters: { url: string; EntityId?: string; } = {
        url: url
      }

      const acceptLanguage = locale === "en" ? "en-US" : locale === "ar" ? "ar-AE" : "fa-IR";

      const pageResponse: any = await getPageByUrl(url, tenant, acceptLanguage);
      setPageData(pageResponse?.result);

      if (pageResponse?.data?.result?.entityId) {
        searchParameters.EntityId = pageResponse.data.result.entityId;
      }
      setFetchPercentage(20);

      const searchAccomodationResponse: any = await SearchAccomodation(searchParameters, acceptLanguage);

      setAccomodations(searchAccomodationResponse?.data?.result);

      setFetchPercentage(45);

      setListLoading(false);

      if(searchAccomodationResponse?.data?.result?.length){

        const hotelIds: number [] = searchAccomodationResponse?.data?.result?.map((hotel:SearchAccomodationItem) => hotel.id) || []

        const fetchPrices = async () => {
        
          setPricesData(undefined);
          if (!hotelIds?.length) return;
        
          setPricesLoading(true);
    
          const pricesResponse = await AvailabilityByHotelId({ checkin: checkin, checkout: checkout, ids: hotelIds as number[], tenant: tenant }, acceptLanguage);
    
          if (pricesResponse.data?.result?.hotels) {
    
            setPricesData(pricesResponse.data.result.hotels);
    
            savePriceRange(pricesResponse.data.result.hotels);
    
            saveOffersOptions(pricesResponse.data.result.hotels);
    
          }
          setFetchPercentage(previous => previous+20);
    
          setPricesLoading(false);
        }

        fetchPrices();

        const fetchRates = async () => {      
          setRatesLoading(true);
          setRatesData(undefined);
    
          const ratesResponse: { data?: RatesResponseItem[] } = await getRates(hotelIds as number[], acceptLanguage);
    
          if (ratesResponse?.data) {
    
            setRatesData(ratesResponse.data);
    
            saveGuestPointFilterOptions(ratesResponse.data);
    
          }
          setRatesLoading(false);      
          setFetchPercentage(previous => previous+20);
        }

        fetchRates();
    
      }

    }

    if (localStorageTenant && localStorageToken) {
      fetchAccomodations(+localStorageTenant);
    }


  }, [localStorageToken, localStorageTenant, router.asPath]);

  useEffect(() => {
    if (accomodations) {

      saveHotelType(accomodations);

    }
  }, [accomodations]);

  
  const locationId = pageData?.entityId || accomodations?.[0]?.city?.id;
  
  useEffect(() => {

    const fetchEntityDetail = async (id: number) => {
      const entityResponse: any = await getEntityNameByLocation(id, acceptLanguage);
      if (entityResponse?.data?.result) {
        setEntity({ EntityName: entityResponse.data.result.name, EntityType: entityResponse.data.result.type, slug: entityResponse.data.result.slug });
      }
    }

    if(locationId){
      fetchEntityDetail(locationId);
    }

  }, [locationId]);


  useEffect(() => {
    setShowOnlyForm(false);
    const validDates = checkDateIsAfterDate(new Date(checkin), new Date(today)) && checkDateIsAfterDate(new Date(checkout), new Date(tomorrow));
    if (!validDates) {
      setShowChangeDateModal(true);
    }
  }, [checkin, checkout]);

  const hotels: PricedHotelItem[] = accomodations?.map(hotel => {

    const HotelRateData = ratesData?.find(item => item.HotelId === hotel.id);
    const ratesInfo = !isSafaraneh ? undefined : HotelRateData ? { Satisfaction: HotelRateData.Satisfaction, TotalRowCount: HotelRateData.TotalRowCount } : (ratesLoading || !ratesData) ? "loading" : undefined;


    const hotelPriceData = pricesData?.find(item => item.id === hotel.id);

    let priceInfo: "loading" | "notPriced" | "need-to-inquire" | { boardPrice: number, salePrice: number };

    if (!pricesData || pricesLoading) {
      priceInfo = "loading";
    } else if (!hotelPriceData) {
      priceInfo = "notPriced";
    } else if (hotelPriceData.salePrice < 10000) {
      priceInfo = "need-to-inquire";
    } else {
      priceInfo = { boardPrice: hotelPriceData.boardPrice, salePrice: hotelPriceData.salePrice }
    }

    return ({
      ...hotel,
      ratesInfo: ratesInfo,
      priceInfo: priceInfo,
      promotions: hotelPriceData?.promotions
    })
  }) || [];

  let progressBarLabel = tHotel('getting-the-best-prices-and-availability');
  
  if(accomodations.length && pricesData){    
    if (ratesData){
      progressBarLabel = tHotel('looking-for-cheaper-rates');
    } else {
      progressBarLabel = tHotel('getting-guest-ratings');
    }
  }

  if (hotels.length > 1) {
    hotels.sort((b: PricedHotelItem, a: PricedHotelItem) => {

      switch (sortFactor) {

        case "priority":

          if (!a.displayOrder || !b.displayOrder) return 1;
          return (b.displayOrder - a.displayOrder);

        case "name":

          if (!a.displayName || !b.displayName) return 1;

          const farsiAlphabet = ["آ", "ا", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "و", "ه", "ی",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

          const x = a.displayName.toLowerCase().trim();
          const y = b.displayName.toLowerCase().trim();

          for (let i = 0; i < y.length; i++) {
            if (farsiAlphabet.indexOf(y[i]) < farsiAlphabet.indexOf(x[i])) {
              return -1;
            }
            if (farsiAlphabet.indexOf(y[i]) > farsiAlphabet.indexOf(x[i])) {
              return 1;
            }
          }

        case "starRate":

          if (!a.rating || !b.rating) return 1;
          return (a.rating - b.rating);

        case "price":

          if (b.priceInfo !== 'loading' && b.priceInfo !== 'need-to-inquire' && b.priceInfo !== 'notPriced' && a.priceInfo !== 'loading' && a.priceInfo !== 'need-to-inquire' && a.priceInfo !== 'notPriced') {
            return b.priceInfo.salePrice - a.priceInfo.salePrice
          } else if (b.priceInfo !== 'loading' && b.priceInfo !== 'need-to-inquire' && b.priceInfo !== 'notPriced') {
            return -1
          }
          return 1

        case "gueatRate":

          if (a.ratesInfo === "loading" || b.ratesInfo === 'loading') return 1;
          if (a.ratesInfo && b.ratesInfo) {
            return a.ratesInfo.Satisfaction - b.ratesInfo.Satisfaction
          } else if (b.ratesInfo?.Satisfaction) {
            return -1
          }
          return 1;

        default:
          return 1
      }
    });
  }

  const cityName = hotels && hotels[0]?.city?.name || "";

  const domesticHotelDefaultDates: [string, string] = [checkin, checkout];

  const defaultDestination: EntitySearchResultItemType | undefined  = entity ? {
    name: entity?.EntityName,
    displayName: entity?.EntityName,
    type: entity?.EntityType || 'City',
    slug: entity?.slug || undefined
  } : undefined;

  const urlSegments = router.asPath.split("/");
  const defaultDestinationIdSegment = urlSegments.find(item => item.includes('location'));
  if (defaultDestinationIdSegment && defaultDestination ) {
    const defaultDestinationId = defaultDestinationIdSegment.split("-")[1];
    defaultDestination.id = +defaultDestinationId;
  }

  const filteredAvailability = urlSegments.find(item => item.includes('available'));
  const filteredName = urlSegments.find(item => item.includes('name-'))?.split("name-")[1];
  const filteredRating = urlSegments.find(item => item.includes('rating'))?.split("rating-")[1]?.split(",") || [];
  const filteredGuestPoints = urlSegments.find(item => item.includes('guestrate'))?.split("guestrate-")[1]?.split(",") || [];
  const filteredHotelType = urlSegments.find(item => item.includes('type'))?.split("type-")[1]?.split(",") || [];
  const filteredFacility = urlSegments.find(item => item.includes('amenities'))?.split("amenities-")[1]?.split(",") || [];
  const filteredPromotion = urlSegments.find(item => item.includes('promotions'))?.split("promotions-")[1]?.split(",") || [];
  const filteredPrice = urlSegments.find(item => item.includes('price'))?.split("price-")[1]?.split(",") || [];

  const filteredHotels = hotels.filter(hotelItem => {

    if (filteredAvailability && hotelItem.priceInfo === "notPriced") {
      return false;
    }

    if (filteredName && (!hotelItem.displayName || !hotelItem.displayName.includes(decodeURI(filteredName)))) {
      return false;
    }

    if (filteredRating.length && !filteredRating.some(item => +item === hotelItem.rating)) {
      return false;
    }

    if (filteredHotelType.length && !filteredHotelType.some(item => item === hotelItem.type)) {
      return false;
    }

    if (filteredGuestPoints.length && (!hotelItem.priceInfo || !filteredGuestPoints.some(item => {
      const min = Number(item.split("-")[0]);
      const max = Number(item.split("-")[1]);
      const hotelSatisfaction = hotelItem.ratesInfo && hotelItem.ratesInfo !== "loading" ? Number(hotelItem.ratesInfo!.Satisfaction) : 0;
      return (hotelSatisfaction >= min && hotelSatisfaction <= max)
    }))) {
      return false;
    }

    if (filteredFacility.length && !filteredFacility.some(item => {
      const hotelsFacilities = hotelItem.facilities?.map(facilityItem => facilityItem.keyword);
      const decodedItem = decodeURI(item);
      return (hotelsFacilities?.includes(decodedItem));
    })) {
      return false;
    }

    if (filteredPromotion.length && !filteredPromotion.some(item => {
      const hotelsPromotion = hotelItem.promotions?.map(promotionItem => promotionItem.name);
      const decodedItem = decodeURI(item);
      return (hotelsPromotion?.includes(decodedItem));
    })) {
      return false;
    }


    if (
      filteredPrice.length &&
      hotelItem.priceInfo !== 'loading' &&
      (
        hotelItem.priceInfo === 'notPriced'
        ||
        hotelItem.priceInfo === 'need-to-inquire'
        ||
        hotelItem.priceInfo.salePrice < +filteredPrice[0]
        ||
        hotelItem.priceInfo.salePrice > +filteredPrice[1]
      )
    ) {
      return false;
    }

    return true

  })

  let fallbackLocation: [number, number] | undefined;
  const firstHotelWithLocation = hotels.find(hotel => (hotel.coordinates?.latitude && hotel.coordinates.longitude));
  if (firstHotelWithLocation) {
    fallbackLocation = [firstHotelWithLocation.coordinates?.latitude!, firstHotelWithLocation.coordinates?.longitude!];
  }


  let envSiteName = process.env.SITE_NAME;

  if (process.env.SITE_NAME?.includes("iranhotel")) {
    envSiteName = "https://www.iranhotel.app";
  }

  let pageUrl = pageData?.url;

  if (pageUrl && process.env.LocaleInUrl === "off") {
    pageUrl = pageUrl.replace("fa/", "");
  }

  const faqItems = pageData?.widget?.faqs || [];
  return (

    <>

      {!!pricesData && <AvailabilityTimeout
        minutes={20}
        onRefresh={() => { window.location.reload() }}
        type='hotel'
        description={t("GetTheLatestPriceAndAvailabilityForYourSearchTo", { destination: cityName, dates: `${dateDiplayFormat({ date: checkin, locale: locale, format: "dd mm" })} - ${dateDiplayFormat({ date: checkout, locale: locale, format: "dd mm" })}` })}
      />}

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
                setShowOnlyForm(true);
                searchFormWrapperRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      <div
        className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl"
      >
        <Hotel className="w-8 h-8" />

        {entity?.EntityName ? (
          `جستجوی هتل های ${entity.EntityName}`
        ) : (
          "جستجوی هتل"
        )}
      </div>

      <div className="px-4 md:px-6 py-3" ref={searchFormWrapperRef}>

        <div>

          <SearchForm wrapperClassName="relative z-[2] mb-4" defaultDates={domesticHotelDefaultDates} defaultDestination={defaultDestination} />

          {(fetchPercentage === 100 || (accomodations?.length === 0 && !listLoading)) || <ProgressBarWithLabel
            className="mt-4 mb-4"
            label={progressBarLabel}
            percentage={fetchPercentage}
          />}

          {!!showOnlyForm && (
            <div
              className='fixed bg-black/75 backdrop-blur-sm top-0 bottom-0 right-0 left-0 z-[1]'
              onClick={() => { setShowOnlyForm(false) }}
            />
          )}

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">

            <div>

              <button type='button' className='relative block w-full lg:mb-5' onClick={() => { setShowMap(true) }}>
                <Image src="/images/map-cover.svg" alt="showMap" className='block border w-full h-24 rounded-xl object-cover' width={354} height={100} />
                <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 border-1 border-blue-600 rounded font-semibold select-none leading-5 text-xs whitespace-nowrap'>
                  {tHotel('viewHotelsOnMap', { cityName: entity?.EntityName || cityName })}
                </span>
              </button>

              <DomesticHotelListSideBar
                allHotels={hotels.length}
                filteredHotels={filteredHotels.length}
                priceIsFetched={!!pricesData}
                scoreIsFetched={!ratesLoading}
              />

            </div>

            <div className="lg:col-span-3" >
              {listLoading ? (
                <div>
                  <Skeleton className='w-52 max-sm:hidden mb-4' />
                  <Skeleton className='w-52 max-sm:hidden mb-6' />

                  {[1, 2, 3, 4, 5].map(item => (
                    <div className="grid md:grid-cols-12 mb-4 border border-neutral-200 bg-white rounded-lg relative" key={item} >
                      <Skeleton
                        type="image"
                        className="min-h-36 md:col-span-12 lg:col-span-4 bg-travel-pattern lg:rtl:rounded-r-lg lg:ltr:rounded-l-lg"
                      />
                      <div className="md:col-span-7 lg:col-span-5 p-3 max-md:pb-0">
                        <Skeleton className="mb-4 w-1/2" />
                        <Skeleton className="mb-4 w-14" />
                        <Skeleton className="mb-4 w-2/3" />
                      </div>
                      <div className="md:col-span-5 lg:col-span-3 p-3 max-md:pt-0 flex flex-col justify-between sm:items-end">
                        <Skeleton className="mb-3 w-1/2" />
                        <Skeleton className="mb-3 w-14" />
                        <br />
                        <Skeleton className="w-full h-10 rounded-lg" type="button" />
                      </div>
                    </div>
                  ))}


                </div>
              ) : accomodations?.length ? (
                <>
                  <div className='flex justify-between mb-4 items-center'>

                    {hotels.length > 0 && pricesData && cityName ? (
                      <div className='text-sm max-sm:hidden'>
                        <b> {hotels.length} </b> هتل در <b> {entity?.EntityName || cityName} </b> پیدا کردیم
                      </div>
                    ) : (
                      <Skeleton className='w-52 max-sm:hidden' />
                    )}

                    <Select
                      items={[
                        { value: "priority", label: tHotel("priority") },
                        { value: "price", label: tHotel("lowest-price") },
                        { value: "starRate", label: tHotel("highest-star-rating") },
                        { value: "name", label: tHotel("hotel-name") },
                        { value: "gueatRate", label: tHotel("highest-guest-rating") }
                      ]}
                      value={sortFactor}
                      onChange={type => { setSortFactor(type as SortTypes) }}
                      label={t('sortBy')}
                      wrapperClassName='max-sm:grow sm:w-52'

                    />
                  </div>

                  {!!accomodations && <HotelsList
                    hotels={filteredHotels}
                    isFetching={pricesLoading}
                  />}
                </>
              ) : pageData ? (
                <div className='flex flex-col items-center justify-center text-red-500 font-semibold'>
                  <ErrorIcon className='block w-14 h-14 mx-auto mb-2 fill-current' />
                  متاسفانه برای این مقصد هتلی یافت نشد!
                </div>
              ) : null}


              {pageData?.widget?.content?.description ? (
                <div className='py-10 text-justify inserted-content'>
                  {parse(pageData.widget.content.description)}
                </div>
              ) : null}


              {faqItems.length > 0 && (
                <div className="mt-10 bg-white p-5 rounded-lg">
                  <h5 className='font-semibold text-lg'>{t('faq')}</h5>
                  {faqItems.filter(faq => (faq.answer && faq.question)).map(faq => (
                    <Accordion
                      key={faq.question}
                      title={(<>
                        <QuestionCircle className='w-5 h-5 mt-.5 rtl:ml-2 ltr:mr-2 fill-current inline-block' />
                        {faq.question}
                      </>)}
                      content={parse(faq.answer!)}
                      WrapperClassName='mt-5'
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {!!showMap && <HotelsOnMap
        fallbackLocation={fallbackLocation}
        priceIsFetched={!!pricesData}
        scoreIsFetched={!!ratesData}
        allHotelsLength={hotels.length}
        setSort={setSortFactor}
        sortBy={sortFactor}
        closeMapModal={() => { setShowMap(false) }}
        hotels={filteredHotels.map(hotel => ({
          id: hotel.id,
          latitude: hotel.coordinates?.latitude,
          longitude: hotel.coordinates?.longitude,
          name: hotel.displayName || hotel.name || "",
          rating: hotel.rating,
          url: hotel.url + searchInfo,
          price: hotel.priceInfo,
          guestRate: hotel.ratesInfo,
          imageUrl: hotel.picture?.path
        }))}
      />}

    </>

  )
}


export const getServerSideProps: GetServerSideProps = async (context: any) => {
  return ({
    props: {
      ...await (serverSideTranslations(context.locale, ['common', 'hotel', 'home']))
    },
  })
}

export default HotelList;