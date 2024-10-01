import { useEffect, useState } from "react";
import { LeftCaret } from "./icons";
import { useTranslation } from "next-i18next";
import { toPersianDigits } from "../../helpers";

type Props = {
    totalItems: number;
    currentPage?: number;
    itemsPerPage?: number;
    onChange: (activePage: number) => void;
    wrapperClassName?: string;
}

const Pagination: React.FC<Props> = props => {

    const { t } = useTranslation("common");

    const [activePage, setActivePage] = useState<number>(1);

    const itemsPerPage = props.itemsPerPage || 10;

    const totalPages = Math.floor(props.totalItems / itemsPerPage) + (props.totalItems % itemsPerPage > 0 ? 1 : 0);

    const pagesArray: number[] = [];
    for (let i = 0; i < totalPages; i++) {
        pagesArray.push(i);
    }

    useEffect(() => {
        props.onChange(activePage);
    }, [activePage]);


    useEffect(() => {
        if (props.currentPage) {
            setActivePage(props.currentPage);
        }
    }, [props.currentPage]);

    const previousPage = () => {
        setActivePage(prevP => {
            if (prevP > 1) {
                return (prevP - 1);
            } else {
                return prevP;
            }
        })
    }
    const nextPage = () => {
        setActivePage(prevP => {
            if (prevP < totalPages) {
                return (prevP + 1);
            } else {
                return prevP;
            }
        })
    }
    if (!pagesArray?.length){
        return null
    }

    return (
        <div className={`flex flex-wrap gap-2 ${props.wrapperClassName}`}>

            <button
                onClick={previousPage}
                disabled={activePage === 1}
                type="button"
                aria-label={t('previousPage')}
                className={`outline-none border rounded h-9 w-9 text-center select-none ${activePage === 1 ? "bg-neutral-100 text-neutral-500 cursor-not-allowed" : "cursor-pointer  bg-white text-neutral-700 hover:text-blue-500 hover:border-blue-500"}`}
            >
                <LeftCaret className="w-6 h-6 inline-block fill-current rtl:rotate-180 leading-4" />
            </button>

            {pagesArray.map((_, index) => {

                if (pagesArray.length > 10 && ((index > 0 && activePage - 4 === index) || (index < pagesArray.length - 1 && activePage + 2 === index)) ) {
                    return "..."
                }

                if (pagesArray.length > 10 && ((index > 0 && activePage - 4 > index) || (index < pagesArray.length - 1 && activePage + 2 < index))) {
                    return null;
                }
                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => { setActivePage(index + 1) }}
                        className={`outline-none bg-white border rounded w-9 h-9 leading-4 text-center cursor-pointer select-none hover:text-blue-500 hover:border-blue-500 ${activePage === index + 1 ? "text-blue-500 border-blue-500" : "text-neutral-700 border-neutral-200"}`}
                    >
                        {toPersianDigits((index + 1).toString())}
                    </button>
                )
            })}

            <button
                onClick={nextPage}
                disabled={activePage === totalPages}
                type="button"
                aria-label={t('nextPage')}
                className={`outline-none border rounded h-9 w-9 text-center select-none ${activePage === totalPages ? "bg-neutral-100 text-neutral-500 cursor-not-allowed" : "cursor-pointer bg-white text-neutral-700 hover:text-blue-500 hover:border-blue-500"}`}
            >
                <LeftCaret className="w-6 h-6 inline-block fill-current ltr:rotate-180 leading-4" />
            </button>

        </div>
    )
}

export default Pagination;