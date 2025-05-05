import Checkbox from "@/modules/shared/components/ui/Checkbox";
import { FlightItemType } from "../../types/flights";
import { useDispatch, useSelector } from "react-redux";
import { setCabinClassFilter, setTicketTypeFilter } from "../../store/flightsSlice";
import { RootState } from "@/modules/shared/store";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Skeleton from "@/modules/shared/components/ui/Skeleton";

const TicketCobinType: React.FC<any> = ({ FlightsData }: { FlightsData: FlightItemType[] }) => {
    const economyCobinCount = FlightsData.filter(item => item.cabinClass.name == "Economy").length
    const businessCobinCount = FlightsData.filter(item => item.cabinClass.name == "Business").length

    const SidebarFilter = useSelector((state: RootState) => state?.flightFilters.filterOption)
    const dispatch = useDispatch()

    const theme2 = process.env.THEME === "THEME2";

    const cobinClassHandle = (checked: any, cobinClassName: string) => {
        if (checked) {
            if (!SidebarFilter.cabinClassOption.includes(cobinClassName)) {
                dispatch(setCabinClassFilter(SidebarFilter.cabinClassOption.concat(cobinClassName)))
            }
        }
        else {
            dispatch(setCabinClassFilter(SidebarFilter.cabinClassOption.filter(item => item !== cobinClassName)))
        }
    }

    const ticketTypeHandle = (checked: any, ticketType: string) => {
        if (checked) {
            dispatch(setTicketTypeFilter(SidebarFilter.ticketTypeOption.concat(ticketType)))
        }
        else {
            dispatch(setTicketTypeFilter(SidebarFilter.ticketTypeOption.filter(item => item !== ticketType)))
        }
    }

    if (!FlightsData.length) return (
        <div className="py-4 space-y-3">
            <Skeleton className="w-1/2" />
            <Skeleton className="w-1/2" />
            <Skeleton className="w-1/2" />
        </div>
    )

    
    return (
        <div className={theme2?"":"divide-y"}>
            <div className="text-sm pt-2 pb-2">
                <div className="flex justify-between items-center">
                    <h5 className="text-sm font-semibold mb-2">نوع بلیط</h5>
                    {
                        SidebarFilter.ticketTypeOption.length ?
                            <button type="button" className="text-3xs bg-red-500 text-white pl-2 pr-2 rounded"
                                onClick={() => dispatch(setTicketTypeFilter([]))}
                            >
                                حذف
                            </button> :
                            <p></p>
                    }
                </div>
                <Checkbox
                    label={<p className="text-xs">سیستمی</p>}
                    onChange={(e) => ticketTypeHandle(e, 'System')}
                    value=""
                    checked={SidebarFilter.ticketTypeOption.includes('System') ? true : false}
                />
                <Checkbox
                    label={<p className="text-xs">چارتری</p>}
                    onChange={(e) => ticketTypeHandle(e, 'Charter')}
                    value=""
                    checked={SidebarFilter.ticketTypeOption.includes('Charter') ? true : false}
                />
            </div>

            <div className="text-sm pt-2 pb-2">
                <div className="flex justify-between items-center">
                    <h5 className="text-sm font-semibold mb-2">نوع کابین</h5>
                    {
                        SidebarFilter.cabinClassOption.length ?
                            <button type="button" className="text-3xs bg-red-500 text-white pl-2 pr-2 rounded"
                                onClick={() => dispatch(setCabinClassFilter([]))}
                            >
                                حذف
                            </button> :
                            <p></p>
                    }
                </div>
                <Checkbox
                    label={<p className="text-xs">اکونومی ({economyCobinCount})</p>}
                    onChange={(e) => cobinClassHandle(e, 'Economy')}
                    value=""
                    checked={SidebarFilter.cabinClassOption.includes('Economy') ? true : false}
                />

                <Checkbox
                    label={<p>بیزنس ({businessCobinCount})</p>}
                    onChange={(e) => cobinClassHandle(e, 'Business')}
                    value=""
                    checked={SidebarFilter.cabinClassOption.includes('Business') ? true : false}
                />
            </div>
        </div>
    )
}

export default TicketCobinType;