import { dateDiplayFormat, numberWithCommas } from "@/modules/shared/helpers";
import { FlightItemType } from "../../types/flights"
import Image from "next/image";

type Props = {
    flight: FlightItemType;
    passengers: {
        adults: number;
        children: number;
        infants: number;
    }
    onSelectFlight: () => void;
}

const FlightItemTheme2: React.FC<Props> = props => {

    const { flight, passengers } = props;

    const totalPrice = passengers?.adults * flight.adultPrice + passengers?.children * flight.childPrice + passengers?.infants * flight.infantPrice;

    return (
        <>
            <div
                className="my-4 border border-neutral-200 bg-white rounded-2xl cursor-pointer"
                onClick={props.onSelectFlight}
            >
                <div className="py-2 px-4 gap-x-4 gap-y-1 grid grid-cols-2 lg:grid-cols-3">
                    <div className="text-sm">
                        <strong className="block font-semibold text-lg">
                            {flight.departureTime ? dateDiplayFormat({ date: flight.departureTime, format: "HH:mm", locale: "fa" }) : "--"}  - {flight.arrivalTime ? dateDiplayFormat({ date: flight.arrivalTime, format: "HH:mm", locale: "fa" }) : "--"}
                        </strong>

                        {flight.departureAirport?.city?.name} ({flight.departureAirport?.city?.code}) - {flight.arrivalAirport?.city?.name} ({flight.arrivalAirport?.city?.code})

                    </div>

                    <div className="text-xs">
                        <div>
                            شماره پرواز: {flight.flightNumber}
                        </div>
                        <span className="border border-neutral-300 rounded px-2">
                            {flight?.flightType == 'System' ? 'سیستمی' : 'چارتری'}
                        </span>
                    </div>
                    <div className="rtl:text-left ltr:text-right">
                        {totalPrice ? (
                            <>
                                <span className="font-semibold text-lg rtl:ml-1">
                                    {numberWithCommas(totalPrice)}
                                </span>
                                <span className="text-2xs font-semibold">
                                    ریال
                                </span>
                            </>
                        ) : null}

                        {flight.capacity ? (
                            <div className="text-2xs text-red-600 block"> {flight.capacity} صندلی باقیمانده</div>
                        ) : (
                            <div className="text-2xs text-neutral-400 block"> ظرفیت تکمیل است </div>
                        )}

                    </div>

                    <div className="col-span-2 lg:col-span-3 text-xs">
                        <Image
                            src={flight?.airline?.picture?.path || ''}
                            alt={flight?.airline?.picture?.altAttribute || ''}
                            width={50}
                            height={30}
                            className={`w-7 h-7 inline-block rtl:ml-1 ltr:mr-1 ${!flight?.capacity ? 'grayscale' : ''}`}
                        />
                        {flight?.airline?.name || null}
                    </div>
                </div>
                <hr />
                <div className="py-1 px-4 text-sm">
                    مقدار بار مجاز: {flight.maxAllowedBaggage} کیلوگرم
                </div>
            </div>
        </>
    )
}

export default FlightItemTheme2;