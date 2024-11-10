import { getDomesticHotelAllDetailsById } from '@/modules/domesticHotel/actions';
import type { GetServerSideProps, NextPage } from 'next';
import { i18n, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DomesticAccomodationType, DomesticHotelDetailType, DomesticHotelReviewsType, EntitySearchResultItemType } from '@/modules/domesticHotel/types/hotel';
import { useRouter } from 'next/router';
import BackToList from '@/modules/domesticHotel/components/hotelDetails/BackToList';
import { CalendarError, Hotel } from '@/modules/shared/components/ui/icons';
import Gallery from '@/modules/domesticHotel/components/hotelDetails/Gallery';
import HotelName from '@/modules/domesticHotel/components/hotelDetails/HotelName';
import HotelFacilities from '@/modules/domesticHotel/components/hotelDetails/HotelFacilities';
import HotelTerms from '@/modules/domesticHotel/components/hotelDetails/HotelTerms';
import HotelAbout from '@/modules/domesticHotel/components/hotelDetails/HotelAbout';
import Attractions from '@/modules/domesticHotel/components/hotelDetails/Attractions';
import FAQ from '@/modules/domesticHotel/components/hotelDetails/FAQ';
import Rooms from '@/modules/domesticHotel/components/hotelDetails/Rooms';
import { addSomeDays, checkDateIsAfterDate, dateDiplayFormat, dateFormat } from '@/modules/shared/helpers';
import AnchorTabs from '@/modules/shared/components/ui/AnchorTabs';
import { useEffect, useRef, useState } from 'react';
import ModalPortal from '@/modules/shared/components/ui/ModalPortal';
import AvailabilityTimeout from '@/modules/shared/components/AvailabilityTimeout';
import AccommodationFacilities from '@/modules/domesticHotel/components/hotelDetails/AccommodationFacilities';
import dynamic from 'next/dynamic';
import Skeleton from '@/modules/shared/components/ui/Skeleton';
import Comments from '@/modules/domesticHotel/components/hotelDetails/comments';

const SearchForm = dynamic(() => import('@/modules/domesticHotel/components/shared/SearchForm'), {
  ssr: false
});

type AllData = {
  accommodation?: { result: DomesticAccomodationType };
  hotel?: DomesticHotelDetailType;
  reviews?: DomesticHotelReviewsType;

};

const HotelDetail: NextPage = () => {

  const [allData, setAllData] = useState<AllData>();
  const [allDataLoading, setAllDataLoading] = useState<boolean>(false);

  const { t } = useTranslation('common');
  const { t: tHotel } = useTranslation('hotel');

  const router = useRouter();
  const { query } = router;

  const today = dateFormat(new Date());
  const tomorrow = dateFormat(addSomeDays(new Date()));

  let checkin = today;
  let checkout = tomorrow;

  const urlParameters = query.hotelDetail! as string[];

  const hotelIdSegment = urlParameters.find(x => x.includes("hotelId-"));
  const checkinSegment = urlParameters.find(x => x.includes("checkin-"));
  const checkoutSegment = urlParameters.find(x => x.includes("checkout-"));

  if (checkinSegment && checkoutSegment) {
    checkin = checkinSegment.split("checkin-")[1];
    checkout = checkoutSegment.split("checkout-")[1];
  }

  const hotelId: string = hotelIdSegment?.split("hotelId-")[1] || "";

  const locale = router.locale;

  const searchFormWrapperRef = useRef<HTMLDivElement>(null);
  const [showChangeDateModal, setShowChangeDateModal] = useState<boolean>(false);
  const [showOnlyForm, setShowOnlyForm] = useState<boolean>(false);

  const defaultDates: [string, string] = [checkin, checkout];

  const [formIsInView, setFormIsInView] = useState<boolean>(false);
  const checkFormIsInView = () => {
    const targetTop = searchFormWrapperRef.current?.getBoundingClientRect().top;
    const windowHeight = window.innerHeight || 0;

    if (targetTop && targetTop < windowHeight) {
      setFormIsInView(true);

      document.removeEventListener('scroll', checkFormIsInView);
      window.removeEventListener("resize", checkFormIsInView);

    }
  }

  useEffect(() => {
    document.addEventListener('scroll', checkFormIsInView);
    window.addEventListener("resize", checkFormIsInView);

    return (() => {
      document.removeEventListener('scroll', checkFormIsInView);
      window.removeEventListener("resize", checkFormIsInView);
    });
  }, []);


  useEffect(() => {
    const fetchAllData = async (params: {
      id: string;
      checkin: string;
      checkout: string;
    }) => {

      setAllDataLoading(true);
      setAllData(undefined);

      const allDataResponse: any = await getDomesticHotelAllDetailsById({
        id: params.id,
        checkin: params.checkin,
        checkout: params.checkout
      }, "fa-IR");

      if (allDataResponse?.data?.result) {
        setAllData(allDataResponse.data.result);
      }
      setAllDataLoading(false);

    }

    if (hotelId && checkin && checkout) {
      fetchAllData({
        checkin: checkin,
        checkout: checkout,
        id: hotelId
      });
    }

  }, [hotelId, checkin, checkout]);

  useEffect(() => {
    setShowOnlyForm(false);
    const validDates = checkDateIsAfterDate(new Date(checkin), new Date(today)) && checkDateIsAfterDate(new Date(checkout), new Date(tomorrow));
    if (!validDates) {
      setShowChangeDateModal(true);
    }
  }, [checkin, checkout]);

  const accommodation = allData?.accommodation;
  const hotelData = allData?.hotel;

  const accommodationData = accommodation?.result;

  let defaultDestination: EntitySearchResultItemType | undefined = undefined;

  if (accommodationData?.displayName) {
    defaultDestination = {
      name: accommodationData.name || accommodationData.displayName,
      displayName: accommodationData.displayName,
      type: 'Hotel',
      id: accommodationData.id
    }
  }

  let hotelImages: {
    src: string;
    alt: string;
    width: number;
    height: number;
    description: string;
    thumbnail: string;
  }[] = [];

  if ((process.env.PROJECT === "SAFARLIFE" || accommodationData?.galleries?.length)) {
    if (accommodationData?.galleries?.length) {
      hotelImages = accommodationData?.galleries?.map(item => {
        const thumbnail = item.sizes?.find(p => p.displaySize === 'mobile')?.filePath || item.filePath!;
        return ({
          alt: item.fileAltAttribute || item.fileTitleAttribute || "",
          description: item.fileTitleAttribute || item.fileAltAttribute || "",
          src: item.filePath!,
          width: 1000,
          height: 700,
          thumbnail: thumbnail
        })
      })
    }
  } else if (hotelData?.Gallery?.length) {
    hotelImages = hotelData.Gallery.filter(item => item.Image).map(item => ({
      src: item.Image! as string,
      alt: item.Title || "",
      width: 1000,
      height: 700,
      description: item.Alt || "",
      thumbnail: item.Image as string
    }))
  }

  const anchorTabsItems: { id: string, title: string }[] = [];

  if (hotelImages?.length) {
    anchorTabsItems.push({ id: "pictures_section", title: tHotel('pictures') });
  }

  anchorTabsItems.push(
    { id: "hotel_intro", title: tHotel('hotel-intro') },
    { id: "rooms_section", title: tHotel('choose-room') }
  );

  if (
    accommodationData?.facilities?.length
    ||
    (hotelData?.Facilities?.length)
  ) {
    anchorTabsItems.push(
      { id: "amenities_section", title: tHotel('hotel-facilities') }
    )
  }

  if (
    accommodationData?.policies?.length
    ||
    (hotelData?.Policies?.length || accommodationData?.instruction?.length || accommodationData?.mendatoryFee?.length)
  ) {
    anchorTabsItems.push(
      { id: "terms_section", title: t('terms') }
    );
  }

  if (accommodationData?.description) {
    anchorTabsItems.push(
      { id: "about_section", title: tHotel('about-hotel') }
    );
  }

  if (hotelData?.DistancePoints?.length) {
    anchorTabsItems.push(
      { id: "attractions_section", title: tHotel('attraction') }
    );
  }

  if (allData?.reviews) {
    anchorTabsItems.push(
      { id: "reviews_section", title: tHotel('suggestion') }
    );
  }

  if (hotelData?.Similars) {
    anchorTabsItems.push(
      { id: "similarhotels_section", title: tHotel('similar-hotels') }
    );
  }

  const cityId = accommodationData?.city?.id;
  let BreadCrumptListUrl = cityId ? `/hotels/locationId-${cityId}` : "";


  if (checkin && checkout && BreadCrumptListUrl) {
    BreadCrumptListUrl += `/checkin-${checkin}/checkout-${checkout}`;
  }

  if (allDataLoading) {
    return (
      <div className='px-4 md:px-6 pt-3'>

        <div className='bg-white pt-5 px-5 pb-4'>
          <Skeleton className='w-1/3' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 bg-white relative gap-1 p-1'>
          <Skeleton
            type='image'
            className={`cursor-pointer w-full object-cover h-80 md:col-span-2 md:row-span-2`}
          />
          <Skeleton
            type='image'
            className={`cursor-pointer w-full object-cover h-40 md:col-span-1 md:row-span-1`}
          />
          <Skeleton
            type='image'
            className={`cursor-pointer w-full object-cover h-40 md:col-span-1 md:row-span-1`}
          />
          <Skeleton
            type='image'
            className={`cursor-pointer w-full object-cover h-40 md:col-span-1 md:row-span-1`}
          />
          <Skeleton
            type='image'
            className={`cursor-pointer w-full object-cover h-40 md:col-span-1 md:row-span-1`}
          />
        </div>
        <div className='bg-white px-5 py-1'>
          <Skeleton className='w-1/4 my-4' />
          <Skeleton className='w-2/5 my-4' />
          <Skeleton className='w-1/3 my-4' />
          <div className='grid grid-cols-4 gap-4 pb-5'>
            <Skeleton className='w-3/4 my-2' />
            <Skeleton className='w-2/5 my-2' />
            <Skeleton className='w-1/3 my-2' />
            <Skeleton className='w-1/3 my-2' />
            <Skeleton className='w-3/5 my-2' />
            <Skeleton className='w-2/3 my-2' />
            <Skeleton className='w-2/5 my-2' />
          </div>
        </div>

        <Skeleton className='w-1/4 mt-8 mb-4' />

        <div className='grid grid-cols-8 gap-3'>
          <div className='bg-white col-span-3 px-3'>
            <Skeleton className='w-2/5 my-4' />
          </div>
          <div className='bg-white col-span-2 px-3'>
            <Skeleton className='w-1/3 my-4' />
          </div>
          <div className='bg-white col-span-2 px-3'>
            <Skeleton className='w-2/5 my-4' />
          </div>
          <div className='bg-white col-span-1 px-3'>
            <Skeleton className='w-1/3 my-4' />
          </div>
        </div>

      </div>
    )
  }

  if (!accommodationData) {
    return null;
  }

  let reviewData = undefined;
  if(allData?.reviews?.averageRating && allData.reviews.reviews?.totalCount){
    reviewData = {
      averageRating: allData.reviews.averageRating,
      reviewCount: allData.reviews.reviews.totalCount
    }
  }

  return (
    <>
      <div
        className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl"
      >
        <Hotel className="w-8 h-8" />

        {accommodationData.displayName}
      </div>

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

      <div className="px-4 md:px-6 pt-3">
        <div className="bg-white p-3">
          <BackToList url={BreadCrumptListUrl} cityName={accommodationData.city?.name || ""} />
        </div>

        {!!hotelImages?.length && <Gallery images={hotelImages} hotelName={accommodationData.displayName} />}
      </div>

      <AnchorTabs
        items={anchorTabsItems}
      />

      <div className="px-4 md:px-6 pt-3" id="hotel_intro">

        <HotelName 
          hotelData={hotelData} 
          reviewData={reviewData} 
          accomodationData={accommodationData} 
        />

        <div ref={searchFormWrapperRef} className='pt-5'>
          {!!showOnlyForm && (
            <div
              className='fixed bg-black/75 backdrop-blur-sm top-0 bottom-0 right-0 left-0 z-[1]'
              onClick={() => { setShowOnlyForm(false) }}
            />
          )}
          <h2 className='text-lg lg:text-3xl font-semibold mt-5 mb-3 md:mt-10 md:mb-7 relative z-[2]'>{t('change-search')}</h2>

          {!!formIsInView && <SearchForm
            defaultDestination={defaultDestination}
            defaultDates={defaultDates}
            wrapperClassName='relative z-[2]'
          />}
        </div>

      </div>

      {!!accommodationData.id && <Rooms hotelId={accommodationData.id} />}

      {(accommodationData?.facilities?.length) ? (
        <AccommodationFacilities facilities={accommodationData?.facilities} />
      ) : hotelData?.Facilities?.length ? (
        <HotelFacilities facilities={hotelData.Facilities} />
      ) :
        null
      }

      <HotelTerms
        instruction={accommodationData?.instruction}
        mendatoryFee={accommodationData?.mendatoryFee}
        policies={hotelData?.Policies}
      />

      <HotelAbout description={accommodationData?.description} />

      {!!(hotelData?.DistancePoints?.length) && (
        <div id="attractions_section" className="px-4 md:px-6 pt-7 md:pt-10">
          <h2 className='text-lg lg:text-3xl font-semibold mb-3 md:mb-7'>{tHotel('attraction')}</h2>
          <div className='p-5 lg:p-7 bg-white rounded-xl'>
            <Attractions attractions={hotelData.DistancePoints} />
          </div>
        </div>
      )}

      {!!allData?.reviews && <Comments hotelReviewData={allData.reviews} />}

      {!!(accommodationData?.faqs?.length) && <FAQ faqs={accommodationData.faqs} />}

      <AvailabilityTimeout
        minutes={20}
        onRefresh={() => { window.location.reload() }}
        type='hotel'
        description={t("GetTheLatestPriceAndAvailabilityForYourSearchTo", { destination: `${accommodationData.displayName}`, dates: `${dateDiplayFormat({ date: checkin || today, locale: locale, format: "dd mm" })} - ${dateDiplayFormat({ date: checkout || tomorrow, locale: locale, format: "dd mm" })}` })}
      />

    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  return ({
    props: {
      ...await (serverSideTranslations(context.locale, ['common', 'hotel'])),
    },
  })
}

export default HotelDetail;