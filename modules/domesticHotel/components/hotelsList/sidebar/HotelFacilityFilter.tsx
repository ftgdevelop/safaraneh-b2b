import CheckboxGroup from "@/modules/shared/components/ui/CheckboxGroup";
import { toPersianDigits } from "@/modules/shared/helpers";
import { useAppSelector } from "@/modules/shared/hooks/use-store";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const HotelFacilityFilter: React.FC = () => {

    const router = useRouter();

    const { t: tHotel } = useTranslation('hotel');
    const { t } = useTranslation('common');

    let initialValues: string[] = [];

    const urlFacilitySegment = router.asPath.split("/").find(item => item.includes('amenities-'));
    if (urlFacilitySegment) {
        initialValues = urlFacilitySegment.split('amenities-')[1].split("/")[0].split(",").map(item => decodeURI(item));
    }

    const [values, setValues] = useState<string[]>(initialValues);

    const savedOptions = useAppSelector(state => state.domesticHotelFilter.filterOptions.facilityFilterOptions);

    const options: { value: string, label: React.ReactNode }[] = savedOptions.map(item => ({
        label: (<div className="flex justify-between grow"> {item.label}  <span> ({toPersianDigits(item.count?.toString())}) </span></div>),
        value: item.keyword
    }))

    useEffect(() => {
        const path = router.asPath;
        if (path.includes('/amenities-')) {

            const paramsArray = path.split("/").filter(item => !item.includes('amenities'));
            if (values.length) {
                paramsArray.push("amenities-" + values.join(","));
            }

            router.push(paramsArray.join("/"), undefined, { shallow: true });

        } else {
            if (values.length) {
                router.push(path + "/amenities-" + values.join(","), undefined, { shallow: true });
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
        <>
            <div className="flex justify-between items-start mb-2 mt-4 border-t border-neutral-300 pt-5">
                <label className="font-semibold text-sm">
                    {tHotel('facilities')}
                </label>
                {!!values.length && <button
                    onClick={resetFilter}
                    type="button"
                    className="bg-red-500 text-white text-xs leading-5 px-2 rounded inline-block"
                >
                    {t('reset-filter')}
                </button>}
            </div>
            <div>
                <CheckboxGroup
                    items={options}
                    onChange={v => { setValues(v) }}
                    values={values}
                />
            </div>

        </>
    )
}

export default HotelFacilityFilter;