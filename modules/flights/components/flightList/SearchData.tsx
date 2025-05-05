import { useRouter } from "next/router";
import { ArrowLeft } from "../../../shared/components/ui/icons";
import { useDispatch } from "react-redux";
import { setSearchChangeOn } from "../../store/flightsSlice";
import { dateDiplayFormat, dateFormat } from "@/modules/shared/helpers";

type Props = {
    airports:any;
    showSearchForm: () => void;
}
const SearchData: React.FC<Props> = props => {

    const {airports} = props;


    const query: any = useRouter().query
    const today = dateFormat(new Date())

    const dispatch = useDispatch()
    return (
        <div className="flex flex-wrap h-fit relative gap-10 max-lg:gap-8 max-md:gap-5 max-sm:gap-4 cursor-pointer
            max-sm:justify-around max-sm:border-1 max-sm:border-gray-200 max-sm:p-3 rounded"
            onClick={() => dispatch(setSearchChangeOn(true))}>
                
            <div>
                <p className="text-sm max-md:text-2xs">{airports?.find((i: any) => i.code == query.flights.split('-')[0]).city?.code}</p>
                <p className="text-gray-500 text-sm max-lg:text-xs max-md:text-3xs">{airports.find((i: any) => i.code == query.flights.split('-')[0]).city?.name}</p>
            </div>
            <ArrowLeft className="w-5 max-sm:w-4 fill-gray-400 ltr:rotate-180" />
            <div>
                <p className="text-sm max-md:text-2xs">{airports?.find((i: any) => i.code == query.flights.split('-')[1]).city?.code}</p>
                <p className="text-gray-500 text-sm max-lg:text-xs max-md:text-3xs">{airports.find((i: any) => i.code == query.flights.split('-')[1])?.city.name}</p>
            </div>

            <span className="border-e-1 border-gray-200 h-14 max-sm:hidden"></span>
            
            <div>
                <p className="text-xs max-lg:text-4xs text-gray-400">تاریخ رفت</p>
                <p className="text-sm max-md:text-2xs">{dateDiplayFormat({ date: query.departing, locale: 'fa', format: 'ddd dd mm' }) ||
                dateDiplayFormat({ date: today, locale: 'fa', format: 'ddd dd mm' })}</p>
            </div>
            {
                query.returning && 
                    <div>
                        <p className="text-xs max-lg:text-4xs text-gray-400">تاریخ برگشت</p>
                        <p className="text-sm max-md:text-2xs">{dateDiplayFormat({ date:query.returning,locale:'fa',format:'ddd dd mm'})}</p>
                    </div>
            }
            <div>
                <p className="text-xs max-lg:text-4xs text-gray-400">مسافران</p>
                <p className="text-sm max-md:text-2xs">{+query.adult + +query.child + +query.infant || 1}</p>
            </div>
            <div>
                <p className="text-xs max-lg:text-4xs text-gray-400">کابین</p>
                <p className="text-sm max-md:text-2xs">اکونومی</p>
            </div>
                
            <button className="bg-blue-800 text-white text-sm max-md:text-xs rounded-md p-1 pl-2 pr-2 h-fit whitespace-nowrap mt-auto mb-auto
                absolute rtl:left-0 ltr:right-0 max-sm:sticky max-sm:w-full hover:bg-blue-600 duration-300"
                type="button"
                onClick={()=>{props.showSearchForm();}}
            >
                    تغییر جستجو
            </button>
        </div>
    )
}

export default SearchData;