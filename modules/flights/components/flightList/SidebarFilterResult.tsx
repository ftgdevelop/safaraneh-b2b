import { Plus } from "@/modules/shared/components/ui/icons";
import { RootState } from "@/modules/shared/store"
import { useDispatch, useSelector } from "react-redux"
import { setAirlineFilter, setCabinClassFilter, setFlightTimeFilter, setPriceRangeFilter, setTicketTypeFilter } from "../../store/flightsSlice";

const SidebarFilterResult: React.FC = () => {
    const SidebarFilter: any = useSelector((state: RootState) => state.flightFilters.filterOption)
    const dispatch = useDispatch()
    
    const filterOptionItem = (filterOption: string, setFilterOption:any) => {
        return (
            SidebarFilter[filterOption].map((item:any, index:number)=> 
            <div className="text-2xs flex gap-1 pl-2 pr-2 mt-2 text-blue-700 shadow-md rounded-full justify-center
               shadow-blue-600/75 bg-blue-100/15 cursor-pointer" key={index}
                onClick={() => dispatch(setFilterOption(SidebarFilter[filterOption].filter((i:string) => i !== item)))}>
                <Plus className="w-4 rotate-45 fill-blue-700"/>
                {item.filterName || item}
            </div>
            )
        )
    }
    return (
        <div className="block">
            {
                Object.values(SidebarFilter).map((item:any) => item.length).find((itemLength: any) => itemLength > 0) &&
                <p className="text-sm max-sm:text-xs font-semibold">فیلتر های پیشنهادی:</p>
            }
            <div className="flex gap-2 flex-wrap">
                {filterOptionItem('airlineOption', setAirlineFilter)}
                {filterOptionItem('flightTimeOption', setFlightTimeFilter)}
                {filterOptionItem('cabinClassOption', setCabinClassFilter)}
                {filterOptionItem('ticketTypeOption', setTicketTypeFilter)}
                {
                    SidebarFilter.priceRangeOption?.min ?
                    <div className="text-2xs flex gap-1 pl-2 pr-2 mt-2 text-blue-700 shadow-md rounded-full justify-center
                    shadow-blue-600/75 bg-blue-100/15 cursor-pointer"
                        onClick={() => dispatch(setPriceRangeFilter({max: SidebarFilter.priceRangeOption.max}))}>
                        <Plus className="w-4 rotate-45 fill-blue-700"/>
                        {`حداقل قیمت ${SidebarFilter.priceRangeOption.min}`}
                    </div>
                    :<p></p>    
                }
                {
                    SidebarFilter.priceRangeOption?.max ?
                    <div className="text-2xs flex gap-1 pl-2 pr-2 mt-2 text-blue-700 shadow-md rounded-full justify-center
                    shadow-blue-600/75 bg-blue-100/15 cursor-pointer"
                        onClick={() => dispatch(setPriceRangeFilter({min: SidebarFilter.priceRangeOption.min}))}>
                        <Plus className="w-4 rotate-45 fill-blue-700"/>
                        {`حداکثر قیمت ${SidebarFilter.priceRangeOption.max}`}
                    </div>
                    :<p></p>
                }
            </div>
        </div>
    )
}

export default SidebarFilterResult