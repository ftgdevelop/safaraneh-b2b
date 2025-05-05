import Select from "@/modules/shared/components/ui/Select";
import { FlightItemType } from "../../types/flights";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/modules/shared/store";
import { setPriceRangeFilter } from "../../store/flightsSlice";
import Skeleton from "@/modules/shared/components/ui/Skeleton";

const PriceChange: React.FC<any> = ({ FlightsData }: { FlightsData: FlightItemType[] }) => {
    const priceFilter = useSelector((state : RootState) => state.flightFilters.filterOption.priceRangeOption)
    const dispatch = useDispatch()
    
    const MaxPrice = Math.max(...FlightsData.map(item => item.adultPrice))
    const MinPrice = Math.min(...FlightsData.map(item => (item.adultPrice !== 0 ? item.adultPrice : MaxPrice)))
    const MaxMinDiffrence = Math.ceil(MaxPrice - MinPrice)
    
    const PriceItems = [
        MinPrice,
        MinPrice !== 0 ? Math.ceil(MinPrice + MaxMinDiffrence / 4) : '',
        MinPrice !== 0 ? Math.ceil(MinPrice + MaxMinDiffrence / 2) : '',
        MaxPrice !== 0 ? Math.ceil(MaxPrice - MaxMinDiffrence / 4) : '',
        MaxPrice
    ]

    if(!MinPrice || !MaxPrice || MinPrice === MaxPrice){
        return null;
    }
    
    return (
        <>
            {
                FlightsData.length ?
                <div className="text-xs pt-2 pb-2 space-y-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold mb-2">مبلغ</h2>
                        {
                            priceFilter?.min || priceFilter?.max ?
                                <button type="button" className="text-3xs bg-red-500 text-white pl-2 pr-2 rounded"
                                    onClick={() => dispatch(setPriceRangeFilter({}))}
                                >
                                    حذف
                                </button> :
                                <p></p>
                        }
                    </div>
                    <div className="grid grid-cols-2 text-xs w-full content-center">
                        <p>حداقل</p>
                        <Select
                            items={PriceItems.map(item => ({ label: `${item.toLocaleString()} ریال`, value: item.toString() }))}
                            placeholder="حداقل"
                            value={priceFilter?.min?.toString() || '0'}
                            onChange={e => dispatch(setPriceRangeFilter({ min: +e, max: priceFilter?.max }))}
                            className="col-span-2 text-xs whitespace-nowrap h-fit p-1" />
                    </div>

                    <div className="grid grid-cols-2 text-xs w-full content-center">
                        <p>حداکثر</p>
                        <Select
                            items={PriceItems.map(item => ({ label: `${item.toLocaleString()} ریال`, value: item.toString() }))}
                            placeholder="حداکثر"
                            value={priceFilter?.max?.toString() || '0'}
                            onChange={e => dispatch(setPriceRangeFilter({ min: priceFilter?.min, max: +e }))}
                            className="col-span-2 text-xs whitespace-nowrap h-fit p-1" />
                    </div>
                </div> :
                <div className="py-3 space-y-3">
                    <Skeleton className="w-1/2"/>
                    <Skeleton className="w-1/2"/>        
                </div>    
            }
        </>    
    )
}

export default PriceChange;