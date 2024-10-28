import { useTranslation } from "next-i18next";
import HotelNameFilter from "./HotelNameFilter";
import HotelRatingFilter from "./HotelRatingFilter";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import HotelPriceFilter from "./HotelPriceFilter";
import HotelAvailabilityFilter from "./HotelAvailabilityFilter";
import HotelFacilityFilter from "./HotelFacilityFilter";
import HotelGuestPointFilter from "./HotelGuestPointFilter";
import HotelTypeFilter from "./HotelTypeFilter";
import HotelPromotionFilter from "./HotelPromotionFilter";
import { toPersianDigits } from "@/modules/shared/helpers";

type Props = {
    allHotels: number;
    filteredHotels: number;
    priceIsFetched?: boolean;
    scoreIsFetched?: boolean;
}

const HotelFilters: React.FC<Props> = props => {

    const { t } = useTranslation("common");
    const { t: tHotel } = useTranslation("hotel");

    const { allHotels, filteredHotels } = props;

    const theme2 = process.env.THEME === "THEME2";

    return (
        <>

            <div className="p-3 pb-0">

                <HotelNameFilter />

                <h5 className="mt-4 font-bold text-lg mb-2 border-t border-neutral-300 pt-5"> {t('filter')} </h5>

                {!!(filteredHotels && allHotels && allHotels > filteredHotels) && <p className="text-xs mb-3 font-semibold">
                    {tHotel("hotels-filtered-from-total", { total: toPersianDigits(props.allHotels?.toString()), filtered: toPersianDigits(props.filteredHotels?.toString()) })}
                </p>}

                {props.priceIsFetched ? <HotelAvailabilityFilter /> : (
                    <>
                        <label className="font-semibold text-sm mb-2 mt-4 border-t border-neutral-300 pt-5 block">
                            {theme2 ? "هتل های قابل رزرو" : tHotel('available-hotel')}
                        </label>
                        <Skeleton className="mb-4" />
                    </>
                )}

                {props.priceIsFetched ? <HotelPriceFilter /> : (
                    <>
                        <label className="font-semibold text-sm mb-2 mt-4 border-t border-neutral-300 pt-5 block">
                            {tHotel('total-price-for-stay')} ({t('rial')})
                        </label>
                        <Skeleton className="mb-4" />
                        <Skeleton className="mb-4" />
                    </>
                )}

                <HotelRatingFilter />
            </div>

            <div className="p-3 pt-0">


                <HotelFacilityFilter />

                {/* {props.scoreIsFetched ? <HotelGuestPointFilter /> : (
                    <>
                        <label className="font-semibold text-sm mb-2 mt-4 border-t border-neutral-300 pt-5 block">
                            {tHotel('guest-rating')}
                        </label>
                        <Skeleton className="mb-4" />
                        <Skeleton className="mb-4" />
                        <Skeleton className="mb-4" />
                        <Skeleton className="mb-4" />
                    </>
                )} */}

                <HotelTypeFilter />

                {props.priceIsFetched ? <HotelPromotionFilter /> : (
                    <>
                        <label className="font-semibold text-sm mb-2 mt-4 border-t border-neutral-300 pt-5 block">
                            هدایای رزرو
                        </label>
                        <Skeleton className="mb-4" />
                        <Skeleton className="mb-4" />
                        <Skeleton className="mb-4" />
                        <Skeleton className="mb-4" />
                        <Skeleton className="mb-4" />
                    </>
                )}

            </div>

        </>
    )
}

export default HotelFilters;