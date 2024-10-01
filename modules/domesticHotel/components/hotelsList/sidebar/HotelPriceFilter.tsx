import Select from "@/modules/shared/components/ui/Select";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { numberWithCommas } from "@/modules/shared/helpers";
import { useAppSelector } from "@/modules/shared/hooks/use-store";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';

const HotelPriceFilter: React.FC = () => {

    const { t: tHotel } = useTranslation('hotel');
    const { t } = useTranslation('common');

    const router = useRouter();

    const urlPriceSegment = router.asPath.split("/").find(item => item.includes('price-'));
    let initialMinPrice : string = "";
    let initialMaxPrice : string = "";
    if (urlPriceSegment) {
        initialMinPrice = urlPriceSegment.split('price-')[1].split(",")[0];
        initialMaxPrice = urlPriceSegment.split('price-')[1].split(",")[1];
    }

    const [min, setMin] = useState<string>(initialMinPrice);
    const [max, setMax] = useState<string>(initialMaxPrice);

    const availablePriceRange = useAppSelector(state => state.domesticHotelFilter.filterOptions.priceFilterRange);


    useEffect(() => {
        const path = router.asPath;

        if (path.includes('/price-')) {

            const paramsArray = path.split("/").filter(item => !item.includes('price'));

            if (min) {
                paramsArray.push(`price-${min},${max || availablePriceRange?.max}`);
            } else if (max){
                paramsArray.push(`price-${availablePriceRange?.min},${max}`);
            }

            router.push(paramsArray.join("/"), undefined, { shallow: true });

        } else {
            if (min) {
                router.push(path + `/price-${min},${max || availablePriceRange?.max}`, undefined, { shallow: true });
            } else if (max){
                router.push(path + `/price-${availablePriceRange?.min},${max }`, undefined, { shallow: true });
            }
        }

    }, [min, max]);


    if (!availablePriceRange) return null;

    const steps = 5;
    const pace = Math.ceil((availablePriceRange.max - availablePriceRange.min) / steps);

    const options: number[] = [];

    for (let i = 0; i <= steps + 3; i++) {
        if (i) {
            const newOption = Math.floor((availablePriceRange.min + i * pace) / 5000000) * 5000000;
            if (newOption > availablePriceRange.max || newOption + pace > availablePriceRange.max) {
                options.push(availablePriceRange.max);
                break;
            } else {
                options.push(newOption);
            }
        } else {
            options.push(availablePriceRange.min);
        }
    }

    return (
        <>
            <div className="flex justify-between items-start mb-2 mt-4 border-t border-neutral-300 pt-5">
                <label className="font-semibold text-sm">
                    {tHotel('total-price-for-stay')} ({t('rial')})
                </label>
                {(!!min || !!max) && <button
                    onClick={() => { setMin(""); setMax(""); }}
                    type="button"
                    className="bg-red-500 text-white text-xs leading-5 px-2 rounded inline-block"
                >
                    {t('reset-filter')}
                </button>}
            </div>

            <div className="grid gap-3 grid-cols-3 mb-3">
                <label className="block text-xs" > حداقل </label>
                <Select
                    items={options.map(item => ({ label: numberWithCommas(item) + " " + t('rial'), value: item.toString() }))}
                    value={min?.toString() || ""}
                    placeholder="حداقل"
                    wrapperClassName="col-span-2"
                    onChange={v => { setMin(v) }}
                    className="border border-neutral-300 rounded px-3 h-8 outline-none focus:border-neutral-600 block text-xs"
                />

            </div>

            <div className="grid gap-3 grid-cols-3 mb-3">
                <label className="block text-xs" > حداکثر </label>
                <Select
                    items={options.map(item => ({ label: numberWithCommas(item) + " " + t('rial'), value: item.toString() }))}
                    value={max?.toString() || ""}
                    wrapperClassName="col-span-2"
                    onChange={v => { setMax(v) }}
                    placeholder="حداکثر"
                    className="border border-neutral-300 rounded px-3 h-8 outline-none focus:border-neutral-600 block text-xs"
                />
            </div>


        </>
    )
}

export default HotelPriceFilter;