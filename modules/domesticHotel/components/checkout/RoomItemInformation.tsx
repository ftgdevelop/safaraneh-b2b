import { Bed } from "@/modules/shared/components/ui/icons";
import { DomesticHotelGetValidateResponse } from "../../types/hotel";
import { useTranslation } from "next-i18next";
import { Field, FormikErrors, FormikTouched } from "formik";
import FormikField from "@/modules/shared/components/ui/FormikField";
import { validateRequiedPersianAndEnglish } from "@/modules/shared/helpers/validation";
import { numberWithCommas, toPersianDigits } from "@/modules/shared/helpers";
import Quantity from "@/modules/shared/components/ui/Quantity";
import { TravelerItem } from "@/modules/shared/types/common";
import FormerTravelers from "@/modules/shared/components/FormerTravelers";
import RadioInputField from "@/modules/shared/components/ui/RadioInputField";

type Props = {
  roomIndex: number;
  roomItem: DomesticHotelGetValidateResponse['rooms'][0];
  errors: FormikErrors<{
    reserver: {
      gender: boolean;
      firstName: string;
      lastName: string;
      email: string;
      nationalId: string;
      phoneNumber: string;
    };
    passengers: {
      gender: boolean;
      firstName: string;
      lastName: string;
      roomNumber: number;
      extraBed: number;
    }[];
  }>;
  touched: FormikTouched<{
    reserver: {
      gender: boolean;
      firstName: string;
      lastName: string;
      email: string;
      nationalId: string;
      phoneNumber: string;
    };
    passengers: {
      gender: boolean;
      firstName: string;
      lastName: string;
      roomNumber: number;
      extraBed: number;
    }[];
  }>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{
    reserver: {
      gender: boolean;
      firstName: string;
      lastName: string;
      email: string;
      nationalId: string;
      phoneNumber: string;
    };
    passengers: {
      gender: boolean;
      firstName: string;
      lastName: string;
      roomNumber: number;
      extraBed: number;
    }[];
  }>>;
  values: {
    reserver: {
      gender: boolean;
      firstName: string;
      lastName: string;
      email: string;
      nationalId: string;
      phoneNumber: string;
    };
    passengers: {
      gender: boolean;
      firstName: string;
      lastName: string;
      roomNumber: number;
      extraBed: number;
    }[];
  }
  disableSyncedPassenger?: () => void;
  onChangeExtraBed: (value: number) => void;
  travelers?: TravelerItem[];
  fetchTravelers?: () => void;
  clearTravelers?: () => void;
  fetchingTravelersLoading?: boolean;
}

const RoomItemInformation: React.FC<Props> = props => {

  const theme1 = process.env.THEME === "THEME1";

  const { roomIndex, roomItem, errors, setFieldValue, touched, values } = props;

  const { t } = useTranslation('common');
  const { t: tHotel } = useTranslation('hotel');

  const extraBedPrice = roomItem.pricing?.find((item) => item.type === 'ExtraBed' && item.ageCategoryType === 'ADL')?.amount || 0;

  const selectTravelerHandle = (traveler: TravelerItem) => {

    setFieldValue(`passengers.${props.roomIndex}.gender`, traveler.gender);

    setFieldValue(`passengers.${props.roomIndex}.firstName`, traveler.firstnamePersian || traveler.firstname, true);
    setFieldValue(`passengers.${props.roomIndex}.lastName`, traveler.lastnamePersian || traveler.lastname, true);

  }

  return (
    <div className={`bg-white border border-neutral-300 p-5 rounded-lg grid gap-x-2 gap-y-4 mb-5 ${theme1?"md:grid-cols-3":""}`} >

      <div className={`flex justify-between text-sm items-start ${theme1?"md:col-span-3":""}`}>
        <h5 className='font-semibold text-xl mb-4'>
          <Bed className='w-5 h-5 fill-current inline-block align-middle rtl:ml-2 ltr:mr-2' /> {tHotel('room')} {toPersianDigits((roomIndex + 1).toString())} - {toPersianDigits(roomItem.name || "")}
        </h5>

        {(props.fetchTravelers && props.clearTravelers) && <FormerTravelers
          fetchTravelers={props.fetchTravelers}
          fetchingLoading={props.fetchingTravelersLoading || false}
          clearTravelers={props.clearTravelers}
          onSelectTraveler={selectTravelerHandle}
          travelers={props.travelers}
          isHotel
        />}
      </div>


      <div role="group" className="leading-4" >
        <label className='block text-xs mb-2' > جنسیت </label>
        <label className='inline-flex items-center gap-1 rtl:ml-4 ltr:mr-4 cursor-pointer'>
          <RadioInputField 
            onChange={(e: any) => {
              const val = e.target.checked;
              setFieldValue(`passengers.${roomIndex}.gender`, val);
              if (props.disableSyncedPassenger) {
                props.disableSyncedPassenger();
              }
            }}
            checked={values.passengers[roomIndex]?.gender}          
          />
          مرد
        </label>
        <label className='inline-flex items-center gap-1 cursor-pointer'>
          <RadioInputField
            onChange={(e: any) => {
              const val = !e.target.checked;
              setFieldValue(`passengers.${roomIndex}.gender`, val);
              if (props.disableSyncedPassenger) {
                props.disableSyncedPassenger();
              }
            }}
            checked={!values.passengers[roomIndex]?.gender}
          />
          زن
        </label>
      </div>

      <FormikField
        setFieldValue={setFieldValue}
        id={`passengers_${roomIndex}_firstName`}
        errorText={errors.passengers ? (errors.passengers[roomIndex] as FormikErrors<{
          gender: boolean;
          firstName: string;
          lastName: string;
          roomNumber: number;
        }>)?.firstName : undefined}
        name={`passengers.${roomIndex}.firstName`}
        isTouched={(touched.passengers && touched.passengers[roomIndex]) ? touched.passengers[roomIndex].firstName : false}
        label={t('first-name')}
        validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, t('please-enter-first-name'), t('just-english-persian-letter-and-space'))}
        value={values.passengers[roomIndex]?.firstName}
        onChange={props.disableSyncedPassenger}
      />

      <FormikField
        setFieldValue={setFieldValue}
        id={`passengers_${roomIndex}_lastName`}
        errorText={errors.passengers ? (errors.passengers[roomIndex] as FormikErrors<{
          gender: boolean;
          firstName: string;
          lastName: string;
          roomNumber: number;
        }>)?.lastName : undefined}
        name={`passengers.${roomIndex}.lastName`}
        isTouched={(touched.passengers && touched.passengers[roomIndex]) ? touched.passengers[roomIndex].lastName : false}
        label={t('last-name')}
        validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, t('please-enter-last-name'), t('just-english-persian-letter-and-space'))}
        value={values.passengers[roomIndex]?.lastName}
        onChange={props.disableSyncedPassenger}
      />

      <Field
        type='hidden'
        name={`passengers.${roomIndex}.roomNumber`}
      />

      {!!roomItem.extraBed && (
        <div className={`border-t border-neutral-300 pt-4 mt-4 flex gap-4 justify-between items-center ${theme1?"md:col-span-3":""}`}>

          <strong className="flex flex-wrap gap-1 md:gap-2 items-center font-semibold text-sm">
            تخت اضافه
            <span className="text-xs">
              ({numberWithCommas(extraBedPrice || 0)} {t('rial')} برای هر شب)
            </span>
          </strong>

          <div dir="ltr" className="whitespace-nowrap">
            <Quantity
              min={0}
              max={roomItem.extraBed}
              onChange={value => {
                props.onChangeExtraBed(value);
                setFieldValue(`passengers.${roomIndex}.extraBed`, value)
              }}
            />
          </div>

        </div>
      )}

    </div>
  )
}

export default RoomItemInformation;