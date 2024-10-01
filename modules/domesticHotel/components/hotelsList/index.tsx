import Pagination from "@/modules/shared/components/ui/Pagination";
import { PricedHotelItem } from "../../types/hotel";
import HotelListItem from "./HotelListItem";
import { useEffect, useState } from "react";
import HotelListItemTheme2 from "./HotelListItemTheme2";
import HotelListItemTheme3 from "./HotelListItemTheme3";
import HotelListLazyLoad from "./HotelListLazyLoad";

type Props = {
    hotels: PricedHotelItem[];
    isFetching?: boolean;
}

const HotelsList: React.FC<Props> = props => {

    const { hotels } = props;

    const [currentPage, setCurrentPage] = useState<number>(1);

    const firstItemIndex = (currentPage - 1) * 10;
    const lastItem = currentPage * 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [hotels.length]);

    hotels?.sort((b: PricedHotelItem, a: PricedHotelItem) => {

        if (a.priceInfo === "loading" || b.priceInfo === 'loading') {
            return 1;  // or -1?
        } else if (a.priceInfo === "notPriced" && b.priceInfo !== "notPriced") {
            return -1;
        } else if (a.priceInfo !== "notPriced" && b.priceInfo === "notPriced") {
            return 1;
        } else if (a.priceInfo === "need-to-inquire") {
            return -1;
        } else {
            return 1
        }
    });

    const theme2 = process.env.THEME === "THEME2";
    const theme3 = process.env.THEME === "THEME3";

    if (process.env.HOTEL_LIST_LAZY_LOAD === "lazy"){
        return(
            <HotelListLazyLoad 
                hotels={hotels}
                isFetching={props.isFetching}
            />
        )
    }

    return (
        <>

            {!theme2 && <Pagination
                onChange={(page: number) => { setCurrentPage(page) }}
                itemsPerPage={10}
                totalItems={hotels?.length || 0}
                currentPage={currentPage}
                wrapperClassName="mb-4"
            />}

            <div>
                {hotels.slice(firstItemIndex, lastItem).map((hotel, index) => theme3 ? <HotelListItemTheme3 index={index} key={hotel.id} hotel={hotel} /> : theme2 ? <HotelListItemTheme2 index={index} key={hotel.id} hotel={hotel} /> : <HotelListItem index={index} key={hotel.id} hotel={hotel} />)}
            </div>

            <Pagination
                onChange={(page: number) => { setCurrentPage(page) }}
                itemsPerPage={10}
                totalItems={hotels?.length || 0}
                currentPage={currentPage}
            />

        </>
    )
}

export default HotelsList;