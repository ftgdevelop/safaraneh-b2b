import Select from "@/modules/shared/components/ui/Select";
import { FlightSortFactorType } from "../../types/flights";

type Props = {
    setSortFactor: (factor: FlightSortFactorType) => void;
    sortFactor: FlightSortFactorType;
}

const SortFlights: React.FC<Props> = props => {

    const { setSortFactor, sortFactor } = props;

    type ItemType = {
        value: FlightSortFactorType;
        label: string;
    }

    const items : ItemType [] = [
        { value: "LowestPrice", label: "کمترین قیمت" },
        { value: "HighestPrice", label: "بیشترین قیمت" },
        { value: "Time", label: "زمان پرواز" }
    ];

    const theme2 = process.env.THEME === "THEME2";

    if (theme2) {
        return (
            <Select
                items={items}
                value={sortFactor}
                onChange={type => { setSortFactor(type as FlightSortFactorType) }}
                label="مرتب سازی بر اساس"
                wrapperClassName='max-sm:grow sm:w-52'

            />
        )
    }

    return (
        <div className="flex gap-4 mt-6 items-center">
            <h5 className="font-semibold text-sm whitespace-nowrap max-lg:hidden">مرتب سازی بر اساس:</h5>
            <div className="flex w-full gap-2">
                {items.map(item => (
                    <button 
                        key={item.value}
                        type="button" 
                        className={`border-1 text-sm text-blue-700 text-center h-fit w-full p-1 cursor-pointer max-sm:text-2xs shadow-md
                            hover:border-blue-800 duration-100 whitespace-nowrap rounded-sm ${item.value == sortFactor ? 'bg-blue-100/20 border-blue-800 shadow-blue-700/30' : 'bg-white'}`}
                        onClick={() => setSortFactor(item.value)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SortFlights;