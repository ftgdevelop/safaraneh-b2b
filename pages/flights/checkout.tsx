import { useCallback, useEffect, useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import type { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router';
import Head from 'next/head';

import ReserverInformation from '@/modules/flights/components/checkout/ReserverInformation';
import { useAppDispatch, useAppSelector } from '@/modules/shared/hooks/use-store';
import Steps from '@/modules/shared/components/ui/Steps';
import Skeleton from '@/modules/shared/components/ui/Skeleton';
import { FlightNotAvailable } from '@/modules/shared/components/ui/icons';
import { FlightGetValidate, FlightPreReserve, getAllCountries } from '@/modules/flights/actions';
import { FlightGetValidateDataType, FlightPrereserveFormValue } from '@/modules/flights/types/flights';
import Aside from '@/modules/flights/components/shared/Aside';
import PassengerItemInformation from '@/modules/flights/components/checkout/PassengerItemInformation';
import Button from '@/modules/shared/components/ui/Button';
import FormikField from '@/modules/shared/components/ui/FormikField';
import { validateRequied } from '@/modules/shared/helpers/validation';
import { UserInformation } from '@/modules/authentication/types/authentication';
import { TravelerItem } from '@/modules/shared/types/common';
import { getTravelers } from '@/modules/shared/actions';
import { setAlertModal } from '@/modules/shared/store/alertSlice';

const Checkout: NextPage = () => {

  const { t } = useTranslation('common');

  const dispatch = useAppDispatch();

  const router = useRouter();

  const { key } = router.query;

  const user: UserInformation | undefined = useAppSelector(state => state.authentication.isAuthenticated ? state.authentication.user : undefined);

  const [flightData, setFlightData] = useState<FlightGetValidateDataType>();
  const [flightDataLoading, setFlightDataLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const [travelers, setTravelers] = useState<TravelerItem[] | undefined>(undefined);
  const [fetchingTravelersLoading, setFetchingTravelersLoading] = useState<boolean>(false);

  type CountryItem = {
    code?: string;
    name?: string;
    nationality?: string;
    id: number;
  }
  const [countries, setCountries] = useState<CountryItem[]>();

  useEffect(() => {

    const token = localStorage.getItem('Token');

    const fetchFlightData = async () => {
      setFlightDataLoading(true);
      if (!key) return;
      const response: any = await FlightGetValidate({ key: key as string, token: token || undefined }, "fa-IR");
      if (response?.data?.result) {
        setFlightData(response.data.result);
      }
      setFlightDataLoading(false);
    }

    fetchFlightData();

  }, [key]);

  useEffect(() => {
    const fetchCountriesList = async () => {
      const response: any = await getAllCountries("fa-IR");
      if (response?.data?.result?.items) {
        const sortedcountries = [...response.data.result.items].sort((b: CountryItem, a: CountryItem) => {

          if (!a.name || !b.name) return 1;

          const farsiAlphabet = ["آ", "ا", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "د", "ذ", "ر", "ز", "ژ", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "و", "ه", "ی",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

          const x = a.name.toLowerCase().trim();
          const y = b.name.toLowerCase().trim();

          for (let i = 0; i < y.length; i++) {
            if (farsiAlphabet.indexOf(y[i]) < farsiAlphabet.indexOf(x[i])) {
              return -1;
            }
            if (farsiAlphabet.indexOf(y[i]) > farsiAlphabet.indexOf(x[i])) {
              return 1;
            }
          }
          return 1;
        })
        setCountries(sortedcountries);
      }
    }
    fetchCountriesList();

  }, []);

  const createPassengersArray = useCallback((flight?: FlightGetValidateDataType) => {

    if (!flight) {
      return [];
    }

    const passengerItems: {
      type: "CHD" | "ADT" | "INF";
      label: string;
    }[] = [];

    if (flight?.adultCount) {
      for (let i = 0; i < flight.adultCount; i++) {
        passengerItems.push({
          type: "ADT",
          label: t('adult'),
        })
      }
    }
    if (flight?.childCount) {
      for (let i = 0; i < flight.childCount; i++) {
        passengerItems.push({
          type: "CHD",
          label: t('child'),
        })
      }
    }
    if (flight?.infantCount) {
      for (let i = 0; i < flight.infantCount; i++) {
        passengerItems.push({
          type: "INF",
          label: t('infant'),
        })
      }
    }

    return passengerItems;
  }, [])

  const passengers: {
    type: "CHD" | "ADT" | "INF";
    label: string;
    count: number;
    departurePrice: number;
    returnPrice?: number;
  }[] = [];

  const passengerItems: {
    type: "CHD" | "ADT" | "INF";
    label: string;
  }[] = useMemo(() => createPassengersArray(flightData), [flightData]);

  if (flightData?.adultCount) {
    passengers.push({
      type: "ADT",
      label: t('adult'),
      count: flightData.adultCount,
      departurePrice: flightData.departureFlight.adultPrice,
      returnPrice: flightData.returnFlight?.adultPrice
    });
  }
  if (flightData?.childCount) {
    passengers.push({
      type: "CHD",
      label: t('child'),
      count: flightData.childCount,
      departurePrice: flightData.departureFlight.childPrice,
      returnPrice: flightData.returnFlight?.childPrice
    });
  }
  if (flightData?.infantCount) {
    passengers.push({
      type: "INF",
      label: t('infant'),
      count: flightData.infantCount,
      departurePrice: flightData.departureFlight.infantPrice,
      returnPrice: flightData.returnFlight?.infantPrice
    });
  }

  const initialValues = {
    reserver: {
      gender: user?.gender || true,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.emailAddress || "",
      phoneNumber: user?.phoneNumber || ""
    },
    passengers: passengerItems?.map(item => ({
      gender: true,
      firstName: '',
      lastName: '',
      persianFirstName: "",
      persianLastName: "",
      nationalId: "",
      birthDate: "",
      passportNumber: "",
      passportExpireDate: "",
      passengerType: item.type,
      nationality: ""
    })),
    captchaCode: ""
  }

  const fetchTravelers = async () => {
    setFetchingTravelersLoading(true);
    const localStorageToken = localStorage.getItem('Token') || "";
    const localStorageTenant = localStorage?.getItem('S-TenantId');
    
    if (!localStorageTenant || !localStorageToken) return;


    const response: any = await getTravelers(localStorageToken, +localStorageTenant, "fa-IR");
    if (response.data?.result?.items) {
      setTravelers(response.data?.result?.items);
      setFetchingTravelersLoading(false);
    }

  }

  const preReserveFlight = async (values: FlightPrereserveFormValue) => {

    setSubmitLoading(true);

    const params: FlightPrereserveFormValue = {
      ...values,
      preReserveKey: key as string,
      passengers: values.passengers.map(item => ({
        ...item,
        nationality: item.nationality || null,
        passportNumber: item.passportNumber || null,
        passportExpireDate: item.passportExpireDate || null
      })),
      reserver: {
        ...values.reserver,
        userName: ""
      }
    }
    const token = localStorage.getItem('Token') || "";

    const response: any = await FlightPreReserve({ params: params, token }, "fa-IR");

    if (response && response.status == 200 && response.data?.result?.reserver?.userName && response.data.result.id) {
      router.push(
        `/payment?username=${response.data.result.reserver.userName}&reserveId=${response.data.result.id}`,
      )
    } else {
      setSubmitLoading(false);
      dispatch(setAlertModal({
        title: t('error'),
        message: response.response?.data?.error?.message || "ارسال اطلاعات با خطا متوقف شد!",
        isVisible: true
      }))
    }
  }

  const submitHandle = async (values: FlightPrereserveFormValue) => {
    if (!key) {
      return;
    }
    preReserveFlight(values);
  }

  return (
    <>
      <Head>
        <title>{t('passengers-information')}</title>
      </Head>

      <div className='max-w-container mx-auto px-5 py-4'>

        <Steps
          className='py-3 mb-4 max-md:hidden'
          items={[
            { label: t('completing-information'), status: 'active' },
            { label: t('confirm-pay'), status: 'up-comming' },
            { label: t('complete-purchase'), status: 'up-comming' }
          ]}
        />

        {!flightDataLoading && !flightData ? (

          <div className=' flex flex-col gap-2 items-center py-5'>
            <strong className='block font-semibold'> پرواز انتخابی شما موجود نیست </strong>
            <p className='text-sm text-neutral-600 mb-10'>
              لطفا پرواز دیگری را انتخاب کنید
            </p>
            <FlightNotAvailable className='max-w-full' />
          </div>

        ) : (
          <div className='grid md:grid-cols-3 gap-4' >
            <div className='md:col-span-2'>

              {flightDataLoading ? (
                <>
                  <div className='bg-white border border-neutral-300 p-5 rounded-lg mb-6'>
                    <Skeleton className='mb-6 w-40' />
                    <Skeleton className='mb-5' />
                    <Skeleton className='mb-5' />
                    <Skeleton className='mb-5' />
                    <Skeleton className='w-1/3' />
                  </div>
                  <h5 className='font-semibold my-6'>
                    <Skeleton className='w-52' />
                  </h5>
                  <div className='bg-white border border-neutral-300 p-5 rounded-lg mb-6'>
                    <Skeleton className='mb-6 w-40' />
                    <Skeleton className='mb-5' />
                    <Skeleton className='mb-5' />
                    <Skeleton className='mb-5' />
                    <Skeleton className='w-1/3 mb-5' />
                    <Skeleton />
                  </div>
                  <div className='bg-white border border-neutral-300 p-5 rounded-lg'>
                    <Skeleton className='mb-6 w-40' />
                    <Skeleton className='w-1/3' />
                  </div>
                </>
              ) : (
                <Formik
                  validate={() => { return {} }}
                  initialValues={initialValues}
                  onSubmit={submitHandle}
                >
                  {({ errors, touched, isValid, isSubmitting, setFieldValue, values }) => {
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
                        <ReserverInformation
                          errors={errors}
                          setFieldValue={setFieldValue}
                          touched={touched}
                          values={values}
                        />

                        <h5 className="font-semibold my-6">{t('fill-passengers-information')}</h5>

                        {passengerItems.map((passenger, index) => (
                          <PassengerItemInformation
                            index={index}
                            key={index}
                            errors={errors}
                            label={passenger.label}
                            type={passenger.type}
                            setFieldValue={setFieldValue}
                            touched={touched}
                            values={values}
                            countries={countries}
                            fetchingTravelersLoading={fetchingTravelersLoading}
                            travelers={travelers}
                            fetchTravelers={fetchTravelers}
                            clearTravelers={() => { setTravelers(undefined) }}
                          />
                        ))}

                        <div className="mb-5 flex flex-col md:items-end gap-3">
                          <label className='text-sm block'>
                            کد تصویر را وارد کنید.
                          </label>
                          <img
                            src={flightData!.captchaLink}
                            alt="captchaCode"
                            className='block h-12 auto border border-neutral-300'
                            height={48}
                            width={144}
                          />

                          <FormikField
                            setFieldValue={setFieldValue}
                            id="captchaCode"
                            errorText={errors.captchaCode}
                            name="captchaCode"
                            isTouched={touched.captchaCode}
                            //label={"شماره پاسپورت"}
                            validateFunction={(value: string) => validateRequied(value, "لطفا کد را وارد کنید")}
                            value={values.captchaCode}
                            className='w-52 ltr text-left font-sans text-xl'
                          />
                        </div>

                        <div className='md:flex md:justify-end mb-6 md:mb-10'>
                          <Button
                            type='submit'
                            hasArrow
                            color='blue'
                            className='h-12 px-5 sm:w-64 w-full'
                            loading={submitLoading}
                          >
                            ادامه فرایند خرید
                          </Button>

                        </div>

                      </Form>
                    )
                  }}
                </Formik>
              )}

            </div>
            <div>
              <Aside
                loading={flightDataLoading}
                passengers={passengers}
                departureFlight={flightData?.departureFlight}
              />
            </div>
          </div>
        )}

      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale as string, ['common', 'flight']),
  },
})

export default Checkout;
