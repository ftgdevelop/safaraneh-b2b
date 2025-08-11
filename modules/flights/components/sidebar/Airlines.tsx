import Checkbox from "@/modules/shared/components/ui/Checkbox";
import { FlightItemType } from "../../types/flights";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/modules/shared/store";
import { setAirlineFilter } from "../../store/flightsSlice";
import { SortCapacity } from "../../templates/SortFlightItem";
import Skeleton from "@/modules/shared/components/ui/Skeleton";

type uniqAirlinesType = {
    airlineName: string;
    price: number;
    capacity: number;
    Picture: string;
    PictureAlt: string;
}

const Airlines: React.FC<any> = ({ FlightsData }: { FlightsData: FlightItemType[] }) => {
    const airlinesFilter = useSelector((state: RootState) => state.flightFilters.filterOption.airlineOption)
    const dispatch = useDispatch()

    const airlines : uniqAirlinesType[] = [];
    FlightsData?.sort((a,b) => SortCapacity(a,b)).sort((a,b) => a.adultPrice && a.adultPrice - b.adultPrice).map((item: any) => {
        if (!airlines.find((i : any) => i.airlineName == item.airline?.name)) {
            airlines.push(
                {
                airlineName: item.airline?.name,
                price: item.adultPrice,
                capacity: item.capacity,
                Picture: item.airline?.picture?.path,
                PictureAlt: item.airline?.picture?.altAttribute
                }
            )
        }
        else if (airlines.find((i: any) => i.airlineName == item.airline?.name && i.price > item.adultPrice && i.capacity < item.capacity)) {
            airlines.splice(airlines.findIndex(e => e.airlineName == item.airline.name), 1)
            airlines.push(
                {
                    airlineName: item.airline?.name,
                    price: item.adultPrice,
                    capacity: item.capacity,
                    Picture: item.airline?.picture?.path,
                    PictureAlt: item.airline?.picture?.altAttribute
                }
                )
        }
    })

    const CheckboxOnchange = (cheched : boolean, airlineName : string) => {
        if (cheched) {
            dispatch(setAirlineFilter(airlinesFilter.concat(airlineName)))
        }
        else if (airlinesFilter.length && !cheched) {
            dispatch(setAirlineFilter(airlinesFilter.filter(item => item !== airlineName)))
        }
    }

    return (
            <div className="pt-2 pb-2">
                <div className="flex justify-between items-center">
                    <h5 className="text-sm font-semibold mb-2">ایرلاین ها</h5>
                    {
                        airlinesFilter.length ?
                        <button type="button" className="text-3xs bg-red-500 text-white pl-2 pr-2 rounded"
                        onClick={() => dispatch(setAirlineFilter([]))} 
                        >
                            حذف
                        </button> :
                        <p></p>
                    }
                </div>
                {
                    FlightsData.length ?
                        airlines.map(flight => 
                            <Checkbox
                            key={flight.airlineName}
                            label={
                               (<div className="flex w-full justify-between">
                                <div className="flex gap-1">
                                    <Image
                                        src={flight.Picture || ""}
                                        alt={flight.PictureAlt || ""}
                                        height={30} width={30} className={`w-6 h-6`}/>
                                        <p className="text-xs">{flight.airlineName}</p>
                                    </div>
                                    {
                                        flight.capacity ? 
                                            <p className="text-2xs text-left font-semibold">از {flight.price.toLocaleString()} ریال</p> :
                                            <p className="text-2xs text-left font-semibold text-gray-500">ظرفیت تکمیل است</p>
                                    }
                                </div>
                                )}
                                onChange={e => CheckboxOnchange(e , flight?.airlineName)}
                                value={flight.airlineName}
                                checked= {airlinesFilter.includes(flight.airlineName) ? true : false}
                            />
                        ) :
                    <div className="space-y-3">
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </div>
                    }
            </div>
    )
}

export default Airlines;