import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { useAppSelector } from "@/modules/shared/hooks/use-store";
import CheckboxGroup from "@/modules/shared/components/ui/CheckboxGroup";
import { toPersianDigits } from "@/modules/shared/helpers";

const HotelGuestPointFilter: React.FC = () => {

    const router = useRouter();
    const { t: tHotel } = useTranslation('hotel');
    const { t } = useTranslation('common');

    const savedOptions = useAppSelector(state => state.domesticHotelFilter.filterOptions.guestPointFilterOptions);

    const options: { value: string, label: React.ReactNode }[] = savedOptions.filter(item => +item.value[0] >= 5).map(item => ({
        label: (<div className="flex justify-between grow"> {item.label}  <span> ({toPersianDigits(item.count?.toString())}) </span></div>),
        value: item.value[0] + "-" + item.value[1]
    }))

    let initialValues: string[] = [];

    const urlGuestPointSegment = router.asPath.split("/").find(item => item.includes('guestrate-'));
    if (urlGuestPointSegment) {
        initialValues = urlGuestPointSegment.split('guestrate-')[1].split("/")[0].split(",").map(item => decodeURI(item));
    }

    const [values, setValues] = useState<string[]>(initialValues);

    useEffect(() => {
        const path = router.asPath;
        if (path.includes('/guestrate-')) {

            const paramsArray = path.split("/").filter(item => !item.includes('guestrate'));
            if (values.length) {
                paramsArray.push("guestrate-" + values.join(","));
            }

            router.push(paramsArray.join("/"), undefined, { shallow: true });

        } else {
            if (values.length) {
                router.push(path + "/guestrate-" + values.join(","), undefined, { shallow: true });
            }
        }
    }, [values.length]);

    const resetFilter = () => {
        setValues([]);
    }

    useEffect(()=>{
        setValues(initialValues);
    },[initialValues.length]);

    if (!options.length){
        return null;
    }

    return (
        <div className="mb-2 mt-4 border-t border-neutral-300 pt-5">
            <div className="flex justify-between items-start">
                <label className="font-semibold text-sm">
                    {tHotel('guest-rating')}
                </label>
                {!!values.length && (<button
                    onClick={resetFilter}
                    type="button"
                    className="bg-red-500 text-white text-xs leading-5 px-2 rounded inline-block"
                >
                    {t('reset-filter')}
                </button>)}
            </div>

            <CheckboxGroup
                items={options}
                onChange={v => { setValues(v) }}
                values={values}
            />

        </div>
    )
}

export default HotelGuestPointFilter;