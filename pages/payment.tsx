import Steps from '@/modules/shared/components/ui/Steps';
import { useState, useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useTranslation, i18n } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { getReserveFromCoordinator } from '@/modules/shared/actions';
import { useRouter } from 'next/router';
import DomesticHotelAside from '@/modules/domesticHotel/components/shared/Aside';
import { domesticHotelGetReserveById, getDomesticHotelSummaryDetailById } from '@/modules/domesticHotel/actions';
import { AsideHotelInfoType, AsideReserveInfoType, DomesticHotelGetReserveByIdData, DomesticHotelSummaryDetail } from '@/modules/domesticHotel/types/hotel';
import { dateFormat, getDatesDiff } from '@/modules/shared/helpers';
import { TabItem } from '@/modules/shared/types/common';
import Tab from '@/modules/shared/components/ui/Tab';
import OnlinePayment from '@/modules/payment/components/OnlinePayment';
import CreditPayment from '@/modules/payment/components/CreditPayment';
import { getReserveBankGateway, makeToken } from '@/modules/payment/actions';
import { useAppDispatch } from '@/modules/shared/hooks/use-store';
import { setReduxError } from '@/modules/shared/store/errorSlice';

import { ServerAddress } from '@/enum/url';
import { emptyReduxSafarmarket, setReduxSafarmarketPixel } from '@/modules/shared/store/safarmarketSlice';


const Payment: NextPage = () => {

  const theme2 = process.env.THEME === "THEME2";
  const theme1 = process.env.THEME === "THEME1";

  const { t } = useTranslation('common');

  const router = useRouter();

  const dispatch = useAppDispatch();

  const pathArray = router.asPath.split("?")[1]?.split("#")[0].split("&");
  const username = pathArray.find(item => item.includes("username="))?.split("username=")[1];
  const reserveId = pathArray.find(item => item.includes("reserveId="))?.split("reserveId=")[1];
  const status: string | undefined = pathArray.find(item => item.includes("status="))?.split("status=")[1];

  const [type, setType] = useState<"Undefined" | "HotelDomestic" | "FlightDomestic" | "Bus" | "Package" | "Flight" | "Hotel" | "PnrOutside" | "Cip" | "Activity">();
  const [coordinatorPrice, setCoordinatorPrice] = useState<number>();
  const [domesticHotelReserveData, setDomesticHotelReserveData] = useState<DomesticHotelGetReserveByIdData>();
  const [domesticHotelData, setDomesticHotelData] = useState<DomesticHotelSummaryDetail>();
  const [bankGatewayList, setBankGatewayList] = useState([]);

  // const [cipReserveInfo, setCipReserveInfo] = useState<CipGetReserveByIdResponse>();
  // const [cipReserveInfoLoading, setCipReserveInfoLoading] = useState<boolean>(true);

  // const [domesticFlightReserveInfo, setDomesticFlightReserveInfo] = useState<DomesticFlightGetReserveByIdType>();
  // const [domesticFlightReserveInfoLoading, setDomesticFlightReserveInfoLoading] = useState<boolean>(true);



  const [goToBankLoading, setGoToBankLoading] = useState<boolean>(false);

  const [expireDate, setExpireDate] = useState();
  
  const localStorageTenant = localStorage?.getItem('S-TenantId');

  useEffect(() => {

    const fetchType = async (tenant:number) => {

      if (username && reserveId) {
        const response: any = await getReserveFromCoordinator({ tenant:tenant,reserveId: reserveId, username: username });
        if (response?.data?.result) {
          setType(response.data.result.type);
          setCoordinatorPrice(response.data.result.salePrice);
        }
      }
    }

    if(localStorageTenant){
      fetchType(+localStorageTenant);
    }


    const getBankGatewayList = async (reserveId:string, tenant: number) => {

      if (!reserveId) return;

      const response: any = await getReserveBankGateway(tenant,reserveId);
      if (response?.status == 200 && response.data.result) {
        setBankGatewayList(response.data?.result[0]);
      } else {
        dispatch(setReduxError({
          title: t('error'),
          message: response?.data?.error?.message,
          isVisible: true
        }));
      }
    };

    if(localStorageTenant && reserveId){
      getBankGatewayList(reserveId, +localStorageTenant);
    }

  }, [username, reserveId, localStorageTenant]);


  const setHotelSafarmarketPixel = ({safarmarketSiteName, smId, reserveData, statusNumber}:{safarmarketSiteName: string , smId:string, reserveData: DomesticHotelGetReserveByIdData , statusNumber: 3|4|5}) => {

    let beds = 0;
    let extraBeds = 0;

    let roomNames = [];
    for(let i = 0; i < reserveData.rooms.length ; i++){
      beds += reserveData.rooms[i].bed;
      extraBeds += reserveData.rooms[i].extraBed;
      roomNames.push(reserveData.rooms[i].name);
    }

    const pixel = {
      rooms : reserveData.rooms?.length,
      reserverName: reserveData?.reserver.firstName + " " + reserveData.reserver.lastName,
      passengerPhone: reserveData.reserver.phoneNumber.replace("+98","0"),
      passengerEmail: reserveData.reserver.email,
      checkin:dateFormat(new Date(reserveData.checkin)),
      checkout:dateFormat(new Date(reserveData.checkout)),
      reserveId:reserveData.id,
      countryId: "IR",
      cityId: reserveData.accommodation?.city?.id,
      rating:reserveData.accommodation?.rating,
      price:reserveData.totalPrice,
      roomType : roomNames,
      hotelName:reserveData.accommodation?.name,
      hotelEnglishName:reserveData.accommodation?.name, // نام انگلیسی هتل
      cityName: reserveData.accommodation?.city?.name, //نام شهر به انگلیسی
      guests : beds+ extraBeds, // تعداد مهمان
      adults: beds, // تعداد بزرگسال
      children: 0, // تعداد کودکان
      ages:[], // سن کودکان
      ref: status === "1" ? reserveData.id : 0  // شناسه یکتا برای مجزا کردن فروش که همان شماره ووچر می باشد. 
    }

    dispatch(setReduxSafarmarketPixel({
      type: "hotel",
      pixel : `https://safarmarket.com/api/hotel/v1/pixel/${safarmarketSiteName}/${statusNumber}/0/?smId=${smId}&DOM=1&PAX=${pixel.guests}&ROOM=${pixel.rooms}&ROOMTYPE=${pixel.roomType.join(",")}&ADL=${pixel.adults}&CHD=${pixel.children}&AGES=${pixel.ages.join(",")}&DSTID=${pixel.cityId}&CTY=${pixel.cityName}&CNTRYID=${pixel.countryId}&HNAME=${pixel.hotelName}&HEN=${pixel.hotelEnglishName}&STAR=${pixel.rating}&TOTPR=${pixel.price}&NAME=${pixel.reserverName}&PHON=${pixel.passengerPhone}&EMAIL=${pixel.passengerEmail}&CI=${pixel.checkin}&CO=${pixel.checkout}&OrderId=${pixel.reserveId}&REF=${pixel.ref}`
    }));
    
  }

  useEffect(()=>{
    return (() => {
      dispatch(emptyReduxSafarmarket());
    });
  },[]);

  useEffect(() => {

    const token = localStorage.getItem('Token') || "";

    if (username && reserveId && type === 'HotelDomestic') {
      const fetchDomesticHotelReserve = async () => {
        const response: any = await domesticHotelGetReserveById({ reserveId: reserveId, userName: username });
        if (response.data.result) {
          setDomesticHotelReserveData(response.data.result);
          setExpireDate(response.data.result.expirTime);         
          
          if(process.env.SAFAR_MARKET_SITE_NAME){
            
            let pixelStatus : 3|4|5 = 3;
            if (!status){
              pixelStatus = 3;
            } else if (status === "0"){
              pixelStatus = 5;
            } else if (status === "1"){
              pixelStatus = 4;
            }

            let cookieSafarmarketId;
            let cookies = decodeURIComponent(document?.cookie).split(';');
            for (const item of cookies){
              if (item.includes("safarMarketHotelSmId=")){
                cookieSafarmarketId =item.split("=")[1];
              }
            }

            if (cookieSafarmarketId){
              setHotelSafarmarketPixel({
                reserveData: response.data.result,
                safarmarketSiteName: process.env.SAFAR_MARKET_SITE_NAME,
                smId: cookieSafarmarketId,
                statusNumber:pixelStatus
              })
            }
          }

          const hotelDataResponse: { data?: { result?: DomesticHotelSummaryDetail } } = await getDomesticHotelSummaryDetailById(response.data.result.accommodationId || response.data.result.accommodation?.id);
          if (hotelDataResponse.data?.result) {
            setDomesticHotelData(hotelDataResponse.data.result);
          }
        }
      }

      fetchDomesticHotelReserve();
    }

    // if (username && reserveId && type === 'Cip') {

    //   const fetchCipData = async (reserveId: string, userName: string) => {

    //     setCipReserveInfoLoading(true);

    //     const respone: any = await CipGetReserveById({ reserveId: reserveId, userName: userName });

    //     setCipReserveInfoLoading(false);

    //     if (respone?.data?.result) {
    //       setCipReserveInfo(respone.data.result);
    //     }
    //   };

    //   fetchCipData(reserveId, username);
    // }

    // if (username && reserveId && type === 'FlightDomestic') {

    //   const fetchDomesticFlightData = async (reserveId: string, userName: string) => {

    //     setDomesticFlightReserveInfoLoading(true);

    //     const respone: any = await flightGetReserveById({ reserveId: reserveId, userName: userName, token: token });

    //     setDomesticFlightReserveInfoLoading(false);

    //     if (respone?.data?.result) {
    //       setDomesticFlightReserveInfo(respone.data.result);
    //     }
    //   };

    //   fetchDomesticFlightData(reserveId, username);

    // }

  }, [type, username, reserveId]);

  const goTobank = async (gatewayId: number) => {

    if (!reserveId) return;

    const localStorageTenant = localStorage?.getItem('S-TenantId');

    if(!localStorageTenant){
      return;
    }

    setGoToBankLoading(true);

    const callbackUrl = window?.location?.origin + (process.env.LocaleInUrl === "off"?"": i18n?.language === "fa" ? "/fa" : "/en") + "/callback";

    const params = {
      gatewayId: gatewayId,
      callBackUrl: callbackUrl,
      reserveId: reserveId,
      tenant: +localStorageTenant
    };

    const response = await makeToken(params);
    if (response.status == 200) {
      window.location.replace(
        `https://${ServerAddress.Payment}/fa/Reserves/Payment/PaymentRequest?tokenId=${response.data.result.tokenId}`
      );
    } else {
      dispatch(setReduxError({
        title: t('error'),
        message: response.data.error.message,
        isVisible: true
      }));

      setGoToBankLoading(false);
    }
  };


  const tabItems: TabItem[] = [
    {
      key: '1',
      label: ("آنلاین"),
      children: (
        <OnlinePayment
          coordinatorPrice={coordinatorPrice}
          onSubmit={(bankId) => { goTobank(bankId) }}
          bankGatewayList={bankGatewayList}
          expireDate={expireDate}
          status={status}
          goToBankLoading={goToBankLoading}
          type={type}
        />
      ),
    },
    // {
    //   key: '2',
    //   label: ("کارت به کارت"),
    //   children: (<CardToCard />),
    // },
    {
      key: '3',
      label: ("اعتباری"),
      children: (<CreditPayment price={coordinatorPrice || 0} currencyType='IRR' />),
    }
  ];



  let domesticHotelInformation: AsideHotelInfoType | undefined = undefined;
  let domesticHotelReserveInformation: AsideReserveInfoType | undefined = undefined;

  if (domesticHotelData) {
    domesticHotelInformation = {
      image: {
        url: domesticHotelData.picture?.path,
        alt: domesticHotelData.picture?.altAttribute || domesticHotelData.displayName || "",
        title: domesticHotelData.picture?.titleAttribute || domesticHotelData.displayName || ""
      },
      name: domesticHotelData.displayName || domesticHotelData.name || "",
      rating: domesticHotelData.rating,
      address: domesticHotelData.address,
      Url: domesticHotelData.url,
      CityId: domesticHotelData.cityId || domesticHotelData.city?.id,
      checkinTime: domesticHotelData.checkinTime,
      checkoutTime: domesticHotelData.checkoutTime
    }
  }
  if (domesticHotelReserveData) {

    if(domesticHotelReserveData.status !== "Pending"){
      router.push(`/hotel/capacity?reserveId=${domesticHotelReserveData.id}&username=${domesticHotelReserveData.username}`);
    }

    domesticHotelReserveInformation = {
      reserveId: domesticHotelReserveData.id,
      checkin: domesticHotelReserveData.checkin,
      checkout: domesticHotelReserveData.checkout,
      duration: getDatesDiff(new Date(domesticHotelReserveData.checkout), new Date(domesticHotelReserveData.checkin)),
      rooms: domesticHotelReserveData.rooms.map(roomItem => ({
        name: roomItem.name,
        board: roomItem.boardCode,
        cancellationPolicyStatus: roomItem.cancellationPolicyStatus,
        bed: roomItem.bed,
        pricing: roomItem.pricing,
        nightly: roomItem.nightly
      })),
      salePrice: domesticHotelReserveData.rooms.reduce((totalPrice: number, roomItem: any) => {
        const roomItemPrice = roomItem.pricing.find(
          (item: any) => item.type === "Room" && item.ageCategoryType === "ADL"
        )?.amount;
        if (roomItemPrice) {
          return totalPrice + +roomItemPrice
        } else {
          return totalPrice;
        }
      }, 0),
      selectedExtraBedCount: domesticHotelReserveData.rooms.reduce((totalSelectedExtraBeds: number, roomItem: any) => {
        const thisRoomHasExtraBed = roomItem.pricing.find((item: any) => item.type === "ExtraBed" && item.ageCategoryType === "ADL" && item.isSelected);
        if (thisRoomHasExtraBed) {
          return totalSelectedExtraBeds + 1
        } else {
          return totalSelectedExtraBeds;
        }
      }, 0),
      selectedExtraBedPrice: domesticHotelReserveData.rooms.reduce((totalPrice: number, roomItem: any) => {
        const roomItemPrice = roomItem.pricing.find(
          (item: any) => item.type === "ExtraBed" && item.ageCategoryType === "ADL" && item.isSelected
        )?.amount;
        if (roomItemPrice) {
          return totalPrice + +roomItemPrice
        } else {
          return totalPrice;
        }
      }, 0),
      boardPrice: domesticHotelReserveData.rooms.reduce((totalPrice: number, roomItem: any) => {
        const roomItemPrice = roomItem.pricing.find(
          (item: any) => item.type === "RoomBoard" && item.ageCategoryType === "ADL"
        )?.amount;
        if (roomItemPrice) {
          return totalPrice + +roomItemPrice
        } else {
          return totalPrice;
        }
      }, 0),
      promoCodePrice: domesticHotelReserveData.rooms.reduce((totalPrice: number, roomItem: any) => {
        const itemPrice = roomItem.pricing.find(
          (item: any) => item.type === "PromoCode" && item.ageCategoryType === "ADL"
        )?.amount;
        if (itemPrice) {
          return totalPrice - +itemPrice
        } else {
          return totalPrice;
        }
      }, 0)
    }
  }



  let domesticFlightPassengers: {
    type: "ADT" | "CHD" | "INF";
    label: string;
    count: number;
    departurePrice: number;
    returnPrice?: number;
  }[] = [];
  // if (domesticFlightReserveInfo) {
  //   if (domesticFlightReserveInfo?.adultCount) {
  //     domesticFlightPassengers.push({
  //       type: "ADT",
  //       label: t('adult'),
  //       count: domesticFlightReserveInfo.adultCount,
  //       departurePrice: domesticFlightReserveInfo.departureFlight.adultPrice,
  //       returnPrice: domesticFlightReserveInfo.returnFlight?.adultPrice
  //     });
  //   }
  //   if (domesticFlightReserveInfo?.childCount) {
  //     domesticFlightPassengers.push({
  //       type: "CHD",
  //       label: t('child'),
  //       count: domesticFlightReserveInfo.childCount,
  //       departurePrice: domesticFlightReserveInfo.departureFlight.childPrice,
  //       returnPrice: domesticFlightReserveInfo.returnFlight?.childPrice
  //     });
  //   }
  //   if (domesticFlightReserveInfo?.infantCount) {
  //     domesticFlightPassengers.push({
  //       type: "INF",
  //       label: t('infant'),
  //       count: domesticFlightReserveInfo.infantCount,
  //       departurePrice: domesticFlightReserveInfo.departureFlight.infantPrice,
  //       returnPrice: domesticFlightReserveInfo.returnFlight?.infantPrice
  //     });
  //   }


  // }

  return (
    <>

      <Head>
        <title>{t("bank-gateway")}</title>
      </Head>

      <div className='max-w-container mx-auto px-5 py-4'>

        {!!theme1 && <Steps
          className='py-3 mb-2'
          items={[
            { label: t('bank-gateway-page'), status: 'done' },
            { label: t('confirm-pay'), status: 'active' },
            { label: t('complete-purchase'), status: 'up-comming' }
          ]}
        />}

        <div className={`grid gap-4 ${theme2 ? "md:gap-14 md:grid-cols-12" : "md:grid-cols-3"}`}>

          <div className={`${theme2?"md:col-span-7":"md:col-span-2"}`}>
            <div className={`mb-4 ${theme1 ? "bg-white rounded-lg border border-neutral-300 p-4" : ""}`}>
              <h2 className='text-2xl mt-4 mb-8'> چگونه می خواهید پرداخت کنید؟ </h2>

              <Tab
                items={tabItems}
              />
            </div>

          </div>

          <div className={theme2 ? "md:col-span-5" : ""}>

            {type === 'HotelDomestic' ? (<>
              <DomesticHotelAside hotelInformation={domesticHotelInformation} reserveInformation={domesticHotelReserveInformation} />
            </>) : type === 'Cip' ? (
              "something"
              // <CipAside
              //   loading={cipReserveInfoLoading}
              //   reserveInfo={cipReserveInfo}
              // />
            ) : type === 'FlightDomestic' ? (
              "something"
              // <Aside
              //   loading={domesticFlightReserveInfoLoading}
              //   departureFlight={domesticFlightReserveInfo?.departureFlight}
              //   passengers={domesticFlightPassengers}
              //   returnFlight={domesticFlightReserveInfo?.returnFlight}
              // />
            ) : null}

            {!!theme1 && (
              <>
                <div className='flex gap-5 bg-white border border-neutral-300 rounded p-4 mb-1' >
    
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNiIgdmlld0JveD0iMCAwIDI0IDI2Ij4KICAgIDxwYXRoIGZpbGw9IiMxREFDMDgiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTExLjA1OC4xODhjLjM4Ni0uMjUgMS40OTgtLjI1IDEuODg0IDAgMy4zOSAyLjE5NyA2LjQ1IDMuMzM0IDkuNjc1IDMuNTMuOTUxLjA0IDEuMzY1LjQ3MSAxLjM2NSAxLjM3NCAwIC41NjkuMDQxIDYuNTUgMCA4LjcwOCAwIC43NDUtLjA4MyAxLjUzLS4yOSAyLjMxNS0uNDU1IDEuODA0LTEuNDQ3IDMuNDktMy4xIDUuMDYtMi4xMSAyLTguMzk0IDQuODI1LTguNjI0IDQuODI1LS4xNjYgMC02LjQ1LTIuODI0LTguNTYtNC44MjUtMS42NTMtMS41Ny0yLjY0NS0zLjI1Ni0zLjEtNS4wNmE5LjA4OSA5LjA4OSAwIDAgMS0uMjktMi4zMTVjLS4wNDEtMi4xNTcgMC04LjEzOSAwLTguNzA4IDAtLjkwMy40MTQtMS4zMzQgMS4zNjUtMS4zNzMgMy4yMjUtLjE5NyA2LjI4NS0xLjMzNCA5LjY3NS0zLjUzMXpNOS41MTEgMTYuOTM5Yy41NC41MjYgMS40MTQuNTI2IDEuOTU0IDBsNi4xMy01Ljk3NGMuNTQtLjUyNi41NC0xLjM3OCAwLTEuOTA0YTEuNDA3IDEuNDA3IDAgMCAwLTEuOTU0IDBsLTUuMTM5IDUuMDM2LTIuMTQzLTIuMDlhMS40MDcgMS40MDcgMCAwIDAtMS45NTQgMCAxLjMyMiAxLjMyMiAwIDAgMCAwIDEuOTA1bDMuMTA2IDMuMDI3eiIvPgo8L3N2Zz4K"
                    />
      
                  <div>
                    <strong className='text-green-600 font-semibold'>٪۱۰۰ ایمن</strong>
                    <p className='text-xs'>ما از رمزگذاری 256 بیتی SSL استفاده می کنیم</p>
                  </div>
                </div>

                <div className='flex gap-5 bg-white border border-neutral-300 rounded p-4 mb-4' >
        
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyMCAyNiI+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBpZD0iYSIgZD0iTTc2LjMzMyAxNzEuMzc1di0zLjI1YzAtNC40ODgtMy43My04LjEyNS04LjMzMy04LjEyNXMtOC4zMzMgMy42MzctOC4zMzMgOC4xMjV2My4yNWMtLjkyMiAwLTEuNjY3LjcyNi0xLjY2NyAxLjYyNXYxMS4zNzVjMCAuODk5Ljc0NSAxLjYyNSAxLjY2NyAxLjYyNWgxNi42NjZjLjkyMiAwIDEuNjY3LS43MjYgMS42NjctMS42MjVWMTczYzAtLjg5OS0uNzQ1LTEuNjI1LTEuNjY3LTEuNjI1ek02OCAxNjMuMjVjMi43NTcgMCA1IDIuMTg3IDUgNC44NzV2My4yNUg2M3YtMy4yNWMwLTIuNjg4IDIuMjQzLTQuODc1IDUtNC44NzV6bS0yLjMzMiAxOC4wOGwtMi4zNi0yLjE4M2EuOTIuOTIgMCAwIDEgMC0xLjM3M2MuNDEtLjM4IDEuMDc0LS4zOCAxLjQ4NCAwbDEuNjMgMS41MDcgMy45MDUtMy42MzNjLjQxLS4zOCAxLjA3NS0uMzggMS40ODUgMGEuOTIuOTIgMCAwIDEgMCAxLjM3M2wtNC42NTkgNC4zMWMtLjQxLjM3OS0xLjA3NS4zNzktMS40ODUgMHoiLz4KICAgIDwvZGVmcz4KICAgIDx1c2UgZmlsbD0iIzFEQUMwOCIgZmlsbC1ydWxlPSJub256ZXJvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTggLTE2MCkiIHhsaW5rOmhyZWY9IiNhIi8+Cjwvc3ZnPgo="
                    />

                  <div>
                    <strong className='text-green-600 font-semibold'>عملیات بانکی مورد اعتماد است</strong>
                    <p className='text-xs'> ما داده های کارت شما را ذخیره یا مشاهده نمی کنیم </p>
                  </div>
                </div>
              </>
            )}

            {/* 
            <div className='bg-white p-4 border border-neutral-300 rounded-md mb-4 border-t-2 border-t-orange-400'>
              {domesticHotelInformation ? (
                <>
                  <h5 className='font-semibold text-orange-400 mb-2 leading-6'>
                    {t('price-will-increase')}
                  </h5>
                  <p className='text-2xs'>
                    {t('price-will-increase-desc')}
                  </p>
                </>
              ) : (
                <>
                  <Skeleton className='mb-3 w-1/3' />
                  <Skeleton className='mb- w-2/3' />
                </>
              )}

            </div> */}

            {/* <div className='bg-white p-4 border border-neutral-300 rounded-md mb-4 border-t-2 border-t-blue-500'>
              {domesticHotelInformation ? (
                <>
                  <h5 className='font-semibold text-blue-500 mb-2 leading-6'>
                    {tHotel('recent-reserve-number')}
                  </h5>
                  <p className='text-2xs'>
                    {tHotel('theNumberOfRecentReservationsOfThisHotelIs', { number: domesticHotelInformation?.TopSelling })}
                  </p>
                </>
              ) : (
                <>
                  <Skeleton className='mb-3 w-1/3' />
                  <Skeleton className='mb- w-2/3' />
                </>
              )}
            </div> */}

          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  return ({
    props: {
      ...await (serverSideTranslations(context.locale, ['common', 'hotel', 'payment']))

    },
  })
}

export default Payment;
