import { FlightItemType } from "../types/flights"

export const SidebarFilterChange = (FlightsData: FlightItemType[] , SidebarFilter: any , setFlightsInFilter: any) => {
    let list = FlightsData
    if (SidebarFilter.airlineOption.length) {
        list = list.filter((item: any) => SidebarFilter.airlineOption.includes(item.airline?.name))
    }
    if (SidebarFilter.flightTimeOption.length) {
        list = list.filter((item: any) => {
            let time = item.departureTime?.split('T')[1].split(':')[0]
            if (time.split('')[0] == 0) {
                time = +time.split('')[1]
            }
            else time = +time
            let itemOnFilterTime = SidebarFilter.flightTimeOption.map((i:any) => time >= i.minTime && time < i.maxTime).find((a: boolean) => a == true)
            return itemOnFilterTime
        })
    }
    if (SidebarFilter.cabinClassOption.length) {
        list = list.filter(item => SidebarFilter.cabinClassOption.includes(item.cabinClass.name))        
    }
    if (SidebarFilter.ticketTypeOption.length) {
        list = list.filter(item => SidebarFilter.ticketTypeOption.includes(item.flightType))
    }
    if (SidebarFilter.priceRangeOption?.min) {
        list = list.filter(item => item.adultPrice >= SidebarFilter.priceRangeOption.min)
    }
    if (SidebarFilter.priceRangeOption?.max) {
        list = list.filter(item => item.adultPrice <= SidebarFilter.priceRangeOption.max)
    }
    
    setFlightsInFilter(list)
}