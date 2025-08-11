import { useTranslation } from "next-i18next";
import { Field, FormikErrors, FormikTouched } from "formik";
import FormikField from "@/modules/shared/components/ui/FormikField";
import { validateNationalId, validateRequied, validateRequiedEnglish, validateRequiedPersian } from "@/modules/shared/helpers/validation";
import { checkDateIsAfterDate, dateFormat, goBackYears } from "@/modules/shared/helpers";
import { useEffect, useState } from "react";
import DatePickerSelect from "@/modules/shared/components/ui/DatePickerSelect";
import SelectWithSearch from "@/modules/shared/components/ui/SelectWithSearch";
import FormerTravelers from "@/modules/shared/components/FormerTravelers";
import { TravelerItem } from "@/modules/shared/types/common";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { setReduxNotification } from "@/modules/shared/store/notificationSlice";

type Props = {
  travelers?: TravelerItem[];
  fetchTravelers?: () => void;
  clearTravelers?: () => void;
  fetchingTravelersLoading?: boolean;
  index: number;
  type: "ADT" | "CHD" | "INF";
  label: string;
  countries?: {
    code?: string;
    name?: string;
    nationality?: string;
    id: number;
  }[];
  errors: FormikErrors<{
    passengers: {
      gender: boolean;
      firstName: string;
      lastName: string;
      persianFirstName: string;
      persianLastName: string;
      nationalId: string;
      passportNumber: string;
      passportExpireDate: string;
      birthDate: string;
      passengerType: "ADT" | "CHD" | "INF";
      nationality: string;
    }[];
  }>;
  touched: FormikTouched<{
    passengers: {
      gender: boolean;
      firstName: string;
      lastName: string;
      persianFirstName: string;
      persianLastName: string;
      nationalId: string;
      passportNumber: string;
      passportExpireDate: string;
      birthDate: string;
      passengerType: "ADT" | "CHD" | "INF";
      nationality: string;
    }[];
  }>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{
    passengers: {
      gender: boolean;
      firstName: string;
      lastName: string;
      persianFirstName: string;
      persianLastName: string;
      nationalId: string;
      passportNumber: string;
      passportExpireDate: string;
      birthDate: string;
      passengerType: "ADT" | "CHD" | "INF";
      nationality: string;
    }[];
  }>>;
  values: {
    passengers: {
      gender: boolean;
      firstName: string;
      lastName: string;
      persianFirstName: string;
      persianLastName: string;
      nationalId: string;
      passportNumber: string | null;
      passportExpireDate: string | null;
      birthDate: string;
      passengerType: "ADT" | "CHD" | "INF";
      nationality: string | null;
    }[];
  }
}

const PassengerItemInformation: React.FC<Props> = props => {

  const { errors, setFieldValue, touched, values } = props;

  const dispatch = useAppDispatch();

  const { t } = useTranslation('common');

  const [reserveWithPassport, setReserveWithPassport] = useState<boolean>(false);

  const [selectedFormertraveler, setSelectedFormertraveler] = useState<TravelerItem>();

  useEffect(() => {

    if (!selectedFormertraveler) return;

    if (reserveWithPassport) {
      setFieldValue(`passengers.${props.index}.passportNumber`, selectedFormertraveler.passportNumber, true);
      setFieldValue(`passengers.${props.index}.passportExpireDate`, selectedFormertraveler.passportExpirationDate, true);
      setFieldValue(`passengers.${props.index}.nationality`, selectedFormertraveler.nationality, true);
    } else {
      setFieldValue(`passengers.${props.index}.persianFirstName`, selectedFormertraveler.firstnamePersian, true);
      setFieldValue(`passengers.${props.index}.persianLastName`, selectedFormertraveler.lastnamePersian, true);
      setFieldValue(`passengers.${props.index}.nationalId`, selectedFormertraveler.nationalId, true);
    }

  }, [reserveWithPassport]);

  const minBirthDate = props.type === "ADT" ? dateFormat(goBackYears(new Date(), 100)) :
    props.type === "CHD" ? dateFormat(goBackYears(new Date(), 12)) :
      dateFormat(goBackYears(new Date(), 2));

  const maxBirthDate = props.type === "ADT" ? dateFormat(goBackYears(new Date(), 12)) :
    props.type === "CHD" ? dateFormat(goBackYears(new Date(), 2)) :
      dateFormat(new Date());

  const minPassportExpDate = dateFormat(new Date());
  const maxPassportExpDate = dateFormat(goBackYears(new Date(), -15));

  const selectTravelerHandle = (traveler: TravelerItem) => {

    setSelectedFormertraveler(traveler);

    setFieldValue(`passengers.${props.index}.gender`, traveler.gender);

    setFieldValue(`passengers.${props.index}.firstName`, traveler.firstname, true);
    setFieldValue(`passengers.${props.index}.lastName`, traveler.lastname, true);

    if(!traveler.birthDate){
      //console.log("passenger birthDate is empty");
    } else if (
      traveler.birthDate
      && checkDateIsAfterDate(new Date(maxBirthDate), new Date(traveler.birthDate))
      && checkDateIsAfterDate(new Date(traveler.birthDate), new Date(minBirthDate))
    ) {
      setFieldValue(`passengers.${props.index}.birthDate`, traveler.birthDate, true);
    } else {
      setFieldValue(`passengers.${props.index}.birthDate`, "", true);
      dispatch(setReduxNotification({
        status: 'error',
        message: `سن مسافر به عنوان مسافر ${props.type === "ADT" ? t("adult") : props.type === "CHD" ? t("child") : t("infant")} معتبر نیست`,
        isVisible: true
      }))
    }

    if (reserveWithPassport) {
      setFieldValue(`passengers.${props.index}.passportNumber`, traveler.passportNumber, true);
      setFieldValue(`passengers.${props.index}.passportExpireDate`, traveler.passportExpirationDate, true);
      setFieldValue(`passengers.${props.index}.nationality`, traveler.nationality, true);
    } else {
      setFieldValue(`passengers.${props.index}.persianFirstName`, traveler.firstnamePersian, true);
      setFieldValue(`passengers.${props.index}.persianLastName`, traveler.lastnamePersian, true);
      setFieldValue(`passengers.${props.index}.nationalId`, traveler.nationalId, true);
    }

  }

  return (
    <div className='bg-white border border-neutral-300 rounded-lg mb-5' >
      <div className="flex justify-between text-sm border-b py-3 px-5 items-start">
        <h5 className='font-semibold'>
          {t('passenger')} {props.index + 1} ({props.label})
        </h5>
        {(props.fetchTravelers && props.clearTravelers) && <FormerTravelers
          fetchTravelers={props.fetchTravelers}
          fetchingLoading={props.fetchingTravelersLoading || false}
          clearTravelers={props.clearTravelers}
          onSelectTraveler={selectTravelerHandle}
          travelers={props.travelers}
        />}
      </div>
      <div className="grid md:grid-cols-3 gap-x-3 gap-y-5 py-3 px-5">
        <div className="md:col-span-3">
          <label className='inline-flex items-center gap-1 rtl:ml-4 ltr:mr-4'>
            <Field
              type="radio"
              className="text-xs"
              onChange={(e: any) => {
                const val = !e.target.checked;
                setReserveWithPassport(val);
              }}
              checked={!reserveWithPassport}
            />
            خرید با کد ملی
          </label>
          <label className='inline-flex items-center gap-1'>
            <Field
              type="radio"
              className="text-xs"
              onChange={(e: any) => {
                const val = e.target.checked;
                setReserveWithPassport(val);
              }}
              checked={reserveWithPassport}
            />
            خرید با پاسپورت
          </label>
        </div>


        <div role="group" className="leading-4" >
          <label className='block text-xs mb-1' > جنسیت </label>
          <label className='inline-flex items-center gap-1 rtl:ml-4 ltr:mr-4'>
            <Field
              type="radio"
              className="text-xs"
              onChange={(e: any) => {
                const val = e.target.checked;
                setFieldValue(`passengers.${props.index}.gender`, val);
              }}
              checked={values.passengers[props.index]?.gender}
            />
            مرد
          </label>
          <label className='inline-flex items-center gap-1'>
            <Field
              type="radio"
              className="text-xs"
              onChange={(e: any) => {
                const val = !e.target.checked;
                setFieldValue(`passengers.${props.index}.gender`, val);
              }}
              checked={!values.passengers[props.index]?.gender}
            />
            زن
          </label>
        </div>

        {!reserveWithPassport && (
          <>
            <FormikField
              setFieldValue={setFieldValue}
              id={`passengers_${props.index}_persianFirstName`}
              errorText={errors.passengers ? (errors.passengers[props.index] as FormikErrors<{
                gender: boolean;
                persianFirstName: string;
                persianLastName: string;
                roomNumber: number;
              }>)?.persianFirstName : undefined}
              name={`passengers.${props.index}.persianFirstName`}
              isTouched={(touched.passengers && touched.passengers[props.index]) ? touched.passengers[props.index].persianFirstName : false}
              label={t('first-name') + " (فارسی)"}
              validateFunction={(value: string) => validateRequiedPersian(value, t('please-enter-first-name'), t('just-persian-letter-and-space'))}
              value={values.passengers[props.index]?.persianFirstName}
            />

            <FormikField
              setFieldValue={setFieldValue}
              id={`passengers_${props.index}_lastName_En`}
              errorText={errors.passengers ? (errors.passengers[props.index] as FormikErrors<{
                gender: boolean;
                persianFirstName: string;
                persianLastName: string;
                roomNumber: number;
              }>)?.persianLastName : undefined}
              name={`passengers.${props.index}.persianLastName`}
              isTouched={(touched.passengers && touched.passengers[props.index]) ? touched.passengers[props.index].persianLastName : false}
              label={t('last-name') + " (فارسی)"}
              validateFunction={(value: string) => validateRequiedPersian(value, t('please-enter-last-name'), t('just-persian-letter-and-space'))}
              value={values.passengers[props.index]?.persianLastName}
            />
          </>
        )}


        <FormikField
          setFieldValue={setFieldValue}
          id={`passengers_${props.index}_firstName`}
          errorText={errors.passengers ? (errors.passengers[props.index] as FormikErrors<{
            gender: boolean;
            firstName: string;
            lastName: string;
            roomNumber: number;
          }>)?.firstName : undefined}
          name={`passengers.${props.index}.firstName`}
          isTouched={(touched.passengers && touched.passengers[props.index]) ? touched.passengers[props.index].firstName : false}
          label={t('first-name') + " (لاتین)"}
          validateFunction={(value: string) => validateRequiedEnglish(value, t('please-enter-first-name'), t('just-english-letter-and-space'))}
          value={values.passengers[props.index]?.firstName}
        />

        <FormikField
          setFieldValue={setFieldValue}
          id={`passengers_${props.index}_lastName`}
          errorText={errors.passengers ? (errors.passengers[props.index] as FormikErrors<{
            gender: boolean;
            firstName: string;
            lastName: string;
            roomNumber: number;
          }>)?.lastName : undefined}
          name={`passengers.${props.index}.lastName`}
          isTouched={(touched.passengers && touched.passengers[props.index]) ? touched.passengers[props.index].lastName : false}
          label={t('last-name') + " (لاتین)"}
          validateFunction={(value: string) => validateRequiedEnglish(value, t('please-enter-last-name'), t('just-english-letter-and-space'))}
          value={values.passengers[props.index]?.lastName}
        />


        {!reserveWithPassport && <FormikField
          setFieldValue={setFieldValue}
          errorText={errors.passengers ? (errors.passengers[props.index] as FormikErrors<{
            gender: boolean;
            firstName: string;
            lastName: string;
            roomNumber: number;
            nationalId: number;
          }>)?.nationalId : undefined}
          id={`passengers_${props.index}_nationalId`}
          name={`passengers.${props.index}.nationalId`}
          isTouched={(touched.passengers && touched.passengers[props.index]) ? touched.passengers[props.index].nationalId : false}
          label={t('national-code')}
          maxLength={10}
          validateFunction={(value: string) => validateNationalId({ value: value, invalidMessage: t('invalid-national-code'), reqiredMessage: t('please-enter-national-code') })}
          value={values.passengers[props.index]?.nationalId}
        />}

        {!!props.countries && !!reserveWithPassport && <SelectWithSearch
          showRequiredStar
          setFieldValue={setFieldValue}
          isTouched={(touched.passengers && touched.passengers[props.index]) ? touched.passengers[props.index].nationality : false}
          errorText={errors.passengers ? (errors.passengers[props.index] as FormikErrors<{
            nationality: string;
          }>)?.nationality : undefined}
          name={`passengers.${props.index}.nationality`}
          id={`passengers_${props.index}_nationality`}
          items={props.countries.map(item => ({ label: item.name || item.nationality || "", value: item.code || "" }))}
          validateFunction={(value: string) => validateRequied(value, "لطفا کشور محل تولد را انتخاب نمایید")}
          value=""
          label="کشور محل تولد"
        />}


        <DatePickerSelect
          setFieldValue={setFieldValue}
          max={maxBirthDate}
          min={minBirthDate}
          name={`passengers.${props.index}.birthDate`}
          id={`passengers_${props.index}_birthDate`}
          shamsi={reserveWithPassport ? false : true}
          label="تاریخ تولد"
          value={values.passengers[props.index].birthDate || ""}
          descending
          errorText={errors.passengers ? (errors.passengers[props.index] as FormikErrors<{
            birthDate: string;
          }>)?.birthDate : undefined}
          isTouched={(touched.passengers && touched.passengers[props.index]) ? touched.passengers[props.index].birthDate : false}
          validateFunction={(value: string) => validateRequied(value, "لطفا تاریخ تولد مسافر را وارد نمایید")}
        />

        {!!reserveWithPassport && (
          <>
            <FormikField
              setFieldValue={setFieldValue}
              id={`passengers_${props.index}_passportNumber`}
              errorText={errors.passengers ? (errors.passengers[props.index] as FormikErrors<{
                passportNumber: string;
              }>)?.passportNumber : undefined}
              name={`passengers.${props.index}.passportNumber`}
              isTouched={(touched.passengers && touched.passengers[props.index]) ? touched.passengers[props.index].passportNumber : false}
              label={"شماره پاسپورت"}
              validateFunction={(value: string) => validateRequied(value, "لطفا شماره پاسپورت را وارد کنید")}
              value={values.passengers[props.index]?.passportNumber || ""}
            />

            <DatePickerSelect
              setFieldValue={setFieldValue}
              max={maxPassportExpDate}
              min={minPassportExpDate}
              name={`passengers.${props.index}.passportExpireDate`}
              id={`passengers_${props.index}_passportExpireDate`}
              shamsi={false}
              label="تاریخ انقضای پاسپورت"
              value={values.passengers[props.index].passportExpireDate || ""}
              descending
              errorText={errors.passengers ? (errors.passengers[props.index] as FormikErrors<{
                passportExpireDate: string;
              }>)?.passportExpireDate : undefined}
              isTouched={(touched.passengers && touched.passengers[props.index]) ? touched.passengers[props.index].passportExpireDate : false}
              validateFunction={(value: string) => validateRequied(value, "لطفا تاریخ انقضای پاسپورت را وارد نمایید")}
            />

            {/* {!!props.countries && <SelectWithSearch
              showRequiredStar
              setFieldValue={setFieldValue}
              isTouched={(touched.passengers && touched.passengers[props.index]) ? touched.passengers[props.index].passportCountry : false}
              errorText={errors.passengers ? (errors.passengers[props.index] as FormikErrors<{
                passportCountry: string;
              }>)?.nationality : undefined}
              name={`passengers.${props.index}.passportCountry`}
              id={`passengers_${props.index}passportCountry`}
              items={props.countries.map(item => ({ label: item.name || item.nationality || "", value: item.code || "" }))}
              validateFunction={(value: string) => validateRequied(value, "لطفا کشور صادر کننده پاسپورت را انتخاب نمایید")}
              value=""
              label="کشور صادر کننده پاسپورت"
            />} */}
          </>
        )}


      </div>

    </div>
  )
}

export default PassengerItemInformation;