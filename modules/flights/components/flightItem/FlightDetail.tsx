import { useRouter } from "next/router"
import { FlightItemType } from "../../types/flights"
import { dateDiplayFormat, dateFormat } from "@/modules/shared/helpers"

const FlightDetailItem: React.FC<any> = ({ FlightsData }: { FlightsData: FlightItemType }) => {
    
    const arrivalTime = FlightsData?.arrivalTime?.split('T')[1].split(":").slice(0,2).join(":")
    const departureTime = FlightsData?.departureTime?.split('T')[1].split(":").slice(0, 2).join(":")
    const today =  dateDiplayFormat({date:dateFormat(new Date()), locale:'fa',format:'ddd dd mm'})
    const query = useRouter().query
    return (
        <div className="grid grid-cols-3 max-sm:grid-cols-2 justify-items-center pt-3 pb-2 max-sm:pl-2 max-sm:pr-2 gap-3 bg-gray-100">
            <div>
                <h2 className="text-lg max-sm:text-sm font-bold">{FlightsData?.departureAirport?.city?.name}</h2>
                <p className="text-lg max-sm:text-sm font-bold">{departureTime}</p>
                <p className="text-2xs max-sm:text-4xs text-gray-500">{dateDiplayFormat({date:(query.departing as string), locale:'fa',format:'ddd dd mm'})|| today}</p>
            </div>
            <div>
                <h2 className="text-lg max-sm:text-sm font-bold">{FlightsData?.arrivalAirport?.city?.name}</h2>
                <p className="text-lg max-sm:text-sm font-bold">{arrivalTime}</p>
                <p className="text-2xs max-sm:text-4xs text-gray-500">{dateDiplayFormat({date:(query.departing as string), locale:'fa',format:'ddd dd mm'})|| today}</p>
            </div>
            <div className="border-r-1 border-gray-300 pr-2 max-sm:p-0 max-sm:pt-3 max-sm:pb-2 border-dashed max-sm:col-span-2 max-sm:flex max-sm:flex-wrap
                max-sm:border-r-0 max-sm:border-t-1 gap-1 space-y-2 max-sm:space-y-0">
                <p className="text-3xs bg-white text-center whitespace-nowrap rounded shadow-sm pr-2 pl-2 text-gray-600 h-fit">
                    شماره پرواز : <span className="text-black font-semibold">{FlightsData?.flightNumber}</span>
                </p>
                <p className="text-3xs bg-white text-center whitespace-nowrap rounded shadow-sm pr-2 pl-2 text-gray-600 h-fit">
                    مقدار بار مجاز :<span className="text-black font-semibold">{FlightsData?.maxAllowedBaggage} کیلوگرم</span>
                </p>
                <p className="text-3xs bg-white text-center whitespace-nowrap rounded shadow-sm pr-2 pl-2 text-gray-600 h-fit">
                    کلاس نرخی : <span className="font-semibold text-black">{FlightsData?.cabinClass?.name}</span>
                </p>
            </div>
        </div>
    )
}

export default FlightDetailItem