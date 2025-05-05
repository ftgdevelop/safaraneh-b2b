import { useEffect, useState } from "react";
import TicketCobinType from "./TicketCobinType";
import { FlightItemType } from "../../types/flights";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import FlightTime from "./FlightTime";
import Airlines from "./Airlines";
import PriceChange from "./PriceRange";

const SidebarFilters: React.FC<any> = ({ FlightsData, flightsInFilterLengths }: {FlightsData: FlightItemType[], flightsInFilterLengths: number}) => {
    const [OpenSidebar, setOpenSidebar] = useState<boolean>(false)
    
    useEffect(() => {
        if (OpenSidebar) {
            document.getElementById('main')?.setAttribute('style', 'z-index:50')
            document.body?.setAttribute('style', 'overflow: hidden')
        }
        else {
            document.getElementById('main')?.setAttribute('style', '')
            document.body?.setAttribute('style', '')
        }
    },[OpenSidebar])

    const theme2 = process.env.THEME === "THEME2";

    return (
        <div className="border rounded-xl p-4">
            <div className={`${theme2?"max-lg:bg-white max-lg:p-4 max-lg:pb-24 max-lg:z-20":"z-20 p-4 pt-2 divide-y bg-white border-1 border-gray-200 rounded max-lg:rounded-none max-lg:border-0 w-72 sm:w-80 lg:w-full"} 
            max-lg:h-screen h-fit max-lg:fixed max-lg:top-0 max-lg:-right-1 max-lg:overflow-y-auto space-y-2 duration-300 
            ${OpenSidebar ? 'max-lg:translate-x-0' : 'max-lg:translate-x-full'}`}
            >
                <div>
                    <h3 className="font-semibold">نتیجه جستجوی شما</h3>
                    {
                        FlightsData.length ?
                        flightsInFilterLengths ?
                            <p className="text-2xs font-semibold">{flightsInFilterLengths} پرواز پیدا شد</p> :
                            <p className="text-2xs font-semibold">پروازی پیدا نشد</p> :
                        <Skeleton className="w-20" />
                    }
                </div>
                <Airlines FlightsData={FlightsData} />
                <FlightTime FlightsData={FlightsData} />
                <PriceChange FlightsData={FlightsData} />
                <TicketCobinType FlightsData={FlightsData} />
                </div>
 
            <div className={`bg-black/75 z-10 fixed top-0 left-0 backdrop-blur contrast-100 ${!OpenSidebar ? 'hidden' : 'max-lg:w-full h-full'}`}
                onClick={e => setOpenSidebar(prevState => !prevState)}>
            </div>

            <button
                className={`bg-blue-600 p-2 pl-4 pr-4 rounded-xl z-10 hidden text-white fixed bottom-4 left-1/2 -translate-x-1/2
                ${OpenSidebar ? 'hidden' : 'max-lg:inline-block'}`}
                type="submit"
                onClick={e => setOpenSidebar(prevState => !prevState)}>
                فیلتر
            </button>
               
            </div>
    )
}

export default SidebarFilters;