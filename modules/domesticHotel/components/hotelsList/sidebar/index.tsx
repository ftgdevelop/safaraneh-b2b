import { useTranslation } from "next-i18next";
import { useState, useEffect } from 'react';

import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { setBodyScrollable, setHeaderUnderMain } from "@/modules/shared/store/stylesSlice";
import HotelFilters from "./HotelFilters";

type Props = {
    allHotels: number;
    filteredHotels: number;
    priceIsFetched?: boolean;
    scoreIsFetched?: boolean;
}
const DomesticHotelListSideBar: React.FC<Props> = props => {

    const { t } = useTranslation("common");
    const { t: tHotel } = useTranslation("hotel");

    const dispatch = useAppDispatch();

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(setHeaderUnderMain(open));
        dispatch(setBodyScrollable(!open));
    }, [open]);

    useEffect(() => {
        return () => {
            dispatch(setHeaderUnderMain(false));
            dispatch(setBodyScrollable(true));
        }
    }, []);


    return (
        <>
            {!open && <button type="button" className="fixed shadow bg-blue-600 z-10 text-white rounded px-5 h-10 bottom-5 left-1/2 -translate-x-1/2 lg:hidden" onClick={() => { setOpen(true) }}>
                {t('filter')}
            </button>}
            {!!open && <div className="bg-black/75 backdrop-blur fixed top-0 left-0 right-0 bottom-0 z-20 lg:hidden" onClick={() => { setOpen(false) }} />}
            <div
                className={`bg-white rounded-xl border max-lg:fixed max-lg:max-w-full max-lg:w-72 z-20 max-lg:overflow-auto top-0 max-lg:h-screen rtl:right-0 transition-all
                ${open ? "max-lg:translate-x-0" : "max-lg:translate-x-full"}`}
            >

                <HotelFilters
                    allHotels={props.allHotels}
                    filteredHotels={props.filteredHotels}
                    priceIsFetched={props.priceIsFetched}
                    scoreIsFetched={props.scoreIsFetched}
                />

            </div>
        </>
    )
}

export default DomesticHotelListSideBar;