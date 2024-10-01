import { Star } from "@/modules/shared/components/ui/icons";
import { toPersianDigits } from "@/modules/shared/helpers";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';

const HotelRatingFilter: React.FC = () => {

    const { t: tHotel } = useTranslation('hotel');
    const { t } = useTranslation('common');

    const router = useRouter();
    const urlRatingSegment = router.asPath.split("/").find(item => item.includes('rating-'));
    let initialValues: number[] = [];
    if (urlRatingSegment) {
        initialValues = urlRatingSegment.split('rating-')[1].split("/")[0].split(",").map(item => +item);
    }

    const [values, setValues] = useState<number[]>(initialValues);

    const toggleItem = (value: number) => {
        setValues(prevValues => {
            if (prevValues.includes(value)) {
                const updatedValues = prevValues.filter(item => item !== value);
                return updatedValues;
            }
            return [...prevValues, value]
        })
    }

    useEffect(() => {
        const path = router.asPath;
        if (path.includes('/rating-')) {

            const paramsArray = path.split("/").filter(item => !item.includes('rating'));
            if (values.length) {
                paramsArray.push("rating-" + values.join(","));
            }

            router.push(paramsArray.join("/"), undefined, { shallow: true });

        } else {
            if (values.length) {
                router.push(path + "/rating-" + values.join(","), undefined, { shallow: true });
            }
        }

    }, [values.length]);

    const options: number[] = [0, 1, 2, 3, 4, 5];

    const buttonTitle = (star: number) => {
        switch (star) {
            case 1:
                return tHotel('1-stars');

            case 2:
                return tHotel('2-stars');

            case 3:
                return tHotel('3-stars');

            case 4:
                return tHotel('4-stars');

            case 5:
                return tHotel('5-stars');

            default:
                return tHotel('unrated')
        }
    }

    const resetFilter = () => {
        setValues([]);
    }


    useEffect(()=>{
        setValues(initialValues);
    },[initialValues.length]);
    
    const theme2 = process.env.THEME === "THEME2";

    return (
        <>
            <div className="flex justify-between items-start mb-2 mt-4 border-t border-neutral-300 pt-5">
                <label className="font-semibold text-sm">
                    {tHotel('based-on-rating')}
                </label>
                {!!values.length && <button
                    onClick={resetFilter}
                    type="button"
                    className="bg-red-500 text-white text-xs leading-5 px-2 rounded inline-block"
                >
                    {t('reset-filter')}
                </button>}
            </div>

            <div dir="ltr" className="flex flex-wrap gap-0.5 mb-3">
                {options.map(item => (
                    <button
                        key={item}
                        aria-label={buttonTitle(item)}
                        title={buttonTitle(item)}
                        dir="rtl"
                        type="button"
                        onClick={() => { toggleItem(item) }}
                        className={`border ${item ? "text-xs" : "text-3xs"} ${values.includes(item) ? "bg-blue-600 text-white" : "bg-white text-neutral-500"} border-neutral-300 rounded px-1 whitespace-nowrap flex gap-0.5 leading-4 items-center h-8`}
                    >
                        {item ? <>{toPersianDigits(item.toString())} <Star className={`w-3.5 h-3.5 ${values.includes(item) ? "fill-current" :theme2? "fill-neutral-700" : "fill-amber-500"}`} /> </> : tHotel('unrated')}
                    </button>
                ))}

            </div>

        </>
    )
}

export default HotelRatingFilter;