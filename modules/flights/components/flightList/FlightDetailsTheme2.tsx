import { dateDiplayFormat, numberWithCommas } from "@/modules/shared/helpers";
import { FlightItemType } from "../../types/flights"
import Image from "next/image";
import { FlightLanding, FlightTakeOff } from "@/modules/shared/components/ui/icons";

type Props = {
    flight: FlightItemType;
    passengers: {
        adults: number;
        children: number;
        infants: number;
    }
}

const FlightDetailsTheme2: React.FC<Props> = props => {

    const { flight, passengers } = props;

    return (
        <>

            <div className="flex gap-2 mb-5">
                <FlightTakeOff className="w-7 h-7 fill-current rtl:mirror" />
                <div className="text-sm">
                    <h4 className="font-semibold text-base mb-1">
                        {flight.departureTime ? dateDiplayFormat({ date: flight.departureTime, format: "HH:mm", locale: "fa" }) : "--"} - {flight.departureAirport?.city?.name}
                    </h4>
                    <p className="mb-1">
                        {flight.departureAirport?.name}
                    </p>
                    <p>
                        {flight.departureTime ? dateDiplayFormat({ date: flight.departureTime, format: "ddd dd mm", locale: "fa" }) : null}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mb-7">
                <FlightLanding className="w-7 h-7 fill-current rtl:mirror" />
                <div className="text-sm">
                    <h4 className="font-semibold text-base mb-1">
                        {flight.arrivalTime ? dateDiplayFormat({ date: flight.arrivalTime, format: "HH:mm", locale: "fa" }) : "--"} - {flight.arrivalAirport?.city?.name}
                    </h4>
                    <p className="mb-1">
                        {flight.arrivalAirport?.name}
                    </p>
                    <p>
                        {flight.arrivalTime ? dateDiplayFormat({ date: flight.arrivalTime, format: "ddd dd mm", locale: "fa" }) : null}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
                <Image
                    src={flight?.airline?.picture?.path || ''}
                    alt={flight?.airline?.picture?.altAttribute || ''}
                    width={50}
                    height={30}
                    className={`w-7 h-7 block ${!flight?.capacity ? 'grayscale' : ''}`}
                />
                <div className="text-sm">
                    {flight?.airline?.name || null}
                    <p className="text-xs">
                        {flight?.airCraft?.name}
                    </p>
                </div>
            </div>

            <span className="border border-neutral-300 rounded px-2 text-xs mb-3 inline-block">
                {flight?.flightType == 'System' ? 'سیستمی' : 'چارتری'}
            </span>

            <div className="text-xs mb-2">
                شماره پرواز: {flight.flightNumber}
            </div>


            <div className="text-xs mb-2">
                مقدار بار مجاز: {flight.maxAllowedBaggage} کیلوگرم
            </div>

            <div className="text-xs mb-2" >
                کلاس نرخی: {flight.cabinClass.name}
            </div>


            <h4 className="font-semibold text-sm mb-4 mt-7">
                جزییات قیمت
            </h4>

            <div className="text-xs flex justify-between mb-2">
                <label>بزرگسال ({passengers.adults})</label>
                <span>{numberWithCommas(passengers.adults * flight.adultPrice)} ریال</span>
            </div>
            <div className="text-xs flex justify-between mb-2">
                <label>کودک ({passengers.children})</label>
                <span>{numberWithCommas(passengers.children * flight.childPrice)} ریال</span>
            </div>
            <div className="text-xs flex justify-between mb-2">
                <label>نوزاد ({passengers.infants})</label>
                <span>{numberWithCommas(passengers.infants * flight.infantPrice)} ریال</span>
            </div>
            <div className="text-xs font-semibold flex justify-between mb-2">
                <label>مجموع</label>
                <span>{numberWithCommas(Math.round(passengers.adults * flight.adultPrice + passengers.children * flight.childPrice + passengers.infants * flight.infantPrice))} ریال</span>
            </div>

        </>
    )
}

export default FlightDetailsTheme2;