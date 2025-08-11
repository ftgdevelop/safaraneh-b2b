import Checkbox from "@/modules/shared/components/ui/Checkbox";
import { RootState } from "@/modules/shared/store";
import { useDispatch, useSelector } from "react-redux";
import { setFlightTimeFilter } from "../../store/flightsSlice";
import { FlightItemType } from "../../types/flights";
import Skeleton from "@/modules/shared/components/ui/Skeleton";

const FlightTime: React.FC<any> = ({FlightsData} : {FlightsData: FlightItemType[]}) => {
    const FlightTimeFilter = useSelector((state: RootState) => state.flightFilters.filterOption.flightTimeOption)
    const dispatch = useDispatch()

    const CheckboxOnchange = (checked: any, time: number[], filterName: string) => {
        if (checked) {
            dispatch(setFlightTimeFilter(FlightTimeFilter.concat({minTime: time[0], maxTime: time[1], filterName})))
        }
        else {
            dispatch(setFlightTimeFilter(FlightTimeFilter.filter(item => item.filterName !== filterName)))
        }
    }

    const checkbox = (minTime: number, maxTime: number, filterName: string) => {
        return (
            <Checkbox
                label={<p className="text-xs">{filterName}</p>}
                onChange={e => CheckboxOnchange(e, [minTime,maxTime], filterName)}
                value=""
                checked={FlightTimeFilter.find(item => item.filterName == filterName) ? true : false}
                />
        )
    }

    return (
        <div className="text-xs pt-2 pb-2">
            <div className="flex justify-between items-center">
            <h5 className="text-sm font-semibold mb-2">زمان پرواز</h5>
                {
                    FlightTimeFilter.length ?
                    <button type="button" className="text-3xs bg-red-500 text-white pl-2 pr-2 rounded"
                    onClick={() => dispatch(setFlightTimeFilter([]))} 
                    >
                        حذف
                    </button> :
                    <p></p>
                } 
            </div>
            {FlightsData.length ?
                <div>
                    {checkbox(0, 6, 'قبل از 6:00 صبح')}
                    {checkbox(6, 12, '۶:۰۰ صبح تا ۱۱:۵۹ ظهر')}
                    {checkbox(12, 18, '۱۲:۰۰ ظهر تا ۱۸:۰۰ بعد از ظهر')}
                    {checkbox(18, 24, 'بعد از ۱۸:۰۰ بعد از ظهر')}
                </div> :
                <div className="space-y-3">
                    <Skeleton className="w-1/2"/>
                    <Skeleton className="w-3/4"/>
                    <Skeleton className="w-2/3"/>
                    <Skeleton className="w-1/2"/>
                </div>
            }
        </div>
    )
}

export default FlightTime;