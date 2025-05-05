import { FlightItemType } from "../../types/flights";
import { useRouter } from "next/router";
import { numberWithCommas } from "@/modules/shared/helpers";
import Button from "@/modules/shared/components/ui/Button";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { validateFlight } from "../../actions";
import { setAlertModal } from "@/modules/shared/store/alertSlice";

type PassengersType = {
    adults:number;
    children:number;
    infants:number;
}
const PriceInfo: React.FC<any> = ({ flightData, detail, passengers }: { flightData: FlightItemType, detail: boolean, passengers: PassengersType }) => {
    
    const router = useRouter();

    const dispatch = useAppDispatch();

    const {t} = useTranslation('common');

    const urlParameters = router.query;

    const[loading, setLoading] = useState<boolean>(false);
    const[unAvailableFlight, setUnAvailableFlight] = useState<boolean>(false);

    const bookFlight = () => {

        if(unAvailableFlight || !flightData?.capacity ) return;

        if (!flightData.hasReturn && urlParameters.returning) {
            dispatch(setAlertModal({
                type:"error",
                title: t('error'),
                message: "در حال حاضر خرید این بلیط به صورت رفت و برگشت امکان پذیر نیست. اگر مایل به خرید این پرواز هستید لطفا به صورت بلیط رفت و برگشت مجزا برای خرید ان اقدام کنید",
                isVisible: true
            }));
            return;           
        }

        if(!urlParameters.returning){
            setLoading(true);
            
            const token = localStorage.getItem('Token') || "";

            const validate = async (key:string) => {
                const response : any = await validateFlight({departureKey:key, token:token});
                if (response?.data?.result?.preReserveKey){
                    router.push(
                        `/flights/checkout?key=${response.data.result.preReserveKey}`
                      );
                }else{
                    setLoading(false);
                    setUnAvailableFlight(true);

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
        <div className="text-left p-3 bg-white w-1/5 max-sm:w-2/5 grid content-around">
            <div>
            {
                flightData?.capacity ? 
                <p className="text-xl max-lg:text-lg max-sm:text-sm font-bold leading-5 max-sm:leading-4">
                <span className="text-2xs max-sm:text-3xs font-bold block">ریال</span>
                {flightData?.adultPrice.toLocaleString()}
                </p> :
                <p className="text-xs max-md:text-2xs font-semibold text-gray-400">ظرفیت تکمیل است</p>
            }
            <Button
                type="button"
                onClick={bookFlight}
                disabled={!flightData?.capacity || unAvailableFlight}
                color="blue"
                className="px-5 w-full h-8 leading-6 text-sm mt-2 text-nowrap"
                hasArrow
                loading={loading}
            >
                انتخاب پرواز
            </Button>
            {/* {
                flightData?.capacity ?
                    <button type="submit" className={`flex w-full justify-center bg-blue-800
                    duration-200 text-white p-1 font-semibold max-md:pr-2 max-md:pl-2 rounded-lg text-sm mt-2 whitespace-nowrap  hover:bg-blue-600 max-md:text-xs`}>
                        انتخاب پرواز
                    <RightCaret className="w-5 fill-white my-auto rtl:rotate-180 max-sm:hidden" />
                    </button> :
                    <button type="submit" className={`flex w-full justify-center bg-gray-400 cursor-not-allowed
                    duration-200 text-white p-1 font-semibold max-md:pr-2 max-md:pl-2 rounded-lg text-sm mt-2 whitespace-nowrap`}>
                        انتخاب پرواز
                    <RightCaret className="w-5 fill-white my-auto rtl:rotate-180 max-sm:hidden " />
                    </button>
            } */}
            {
                flightData?.capacity < 10 && flightData?.capacity !== 0 &&
                <p className="text-3xs text-red-600">{flightData.capacity} صندلی باقیمانده</p>
            }
            </div>    
            {
                detail &&
                <div className="text-3xs max-md:text-4xs text-gray-400 max-lg:text-black">
                    <div className="flex justify-between max-sm:block">
                        <p>بزرگسال ({passengers.adults})</p>
                        <p>{numberWithCommas(passengers.adults * flightData.adultPrice)} ریال</p>
                    </div>
                    <div className="flex justify-between max-sm:block">
                        <p>کودک ({passengers.children})</p>
                        <p>{numberWithCommas(passengers.children * flightData.childPrice)} ریال</p>
                    </div>
                    <div className="flex justify-between max-sm:block">
                        <p>نوزاد ({passengers.infants})</p>
                        <p>{numberWithCommas(passengers.infants * flightData.infantPrice)} ریال</p>
                    </div>
                    <div className="flex justify-between text-xs text-black font-semibold max-sm:block">
                        <p>مجموع</p>
                        <p>{numberWithCommas(Math.round(passengers.adults * flightData.adultPrice + passengers.children * flightData.childPrice + passengers.infants * flightData.infantPrice))} ریال</p>
                    </div>
                </div>
            }
        </div>
    )
}

export default PriceInfo;