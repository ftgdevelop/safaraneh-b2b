import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import CheckboxGroup from "@/modules/shared/components/ui/CheckboxGroup";
import { useAppSelector } from "@/modules/shared/hooks/use-store";
import { toPersianDigits } from "@/modules/shared/helpers";

const HotelPromotionFilter: React.FC = () => {

    const router = useRouter();
    const { t } = useTranslation('common');

    const savedOptions = useAppSelector(state => state.domesticHotelFilter.filterOptions.promotionFilterOptions);

    const options: { value: string, label: React.ReactNode }[] = savedOptions.map(item => ({
        label: (<div className="flex justify-between grow"> {item.label}  <span> ({toPersianDigits(item.count?.toString())}) </span></div>),
        value: item.keyword
    }));

    let initialValues: string[] = [];

    const urlHotelPromotionSegment = router.asPath.split("/").find(item => item.includes('promotions-'));
    if (urlHotelPromotionSegment) {
        initialValues = urlHotelPromotionSegment.split('promotions-')[1].split("/")[0].split(",").map(item => decodeURI(item));
    }

    const [values, setValues] = useState<string[]>(initialValues);

    useEffect(() => {
        const path = router.asPath;
        if (path.includes('/promotions-')) {

            const paramsArray = path.split("/").filter(item => !item.includes('promotions'));
            if (values.length) {
                paramsArray.push("promotions-" + values.join(","));
            }

            router.push(paramsArray.join("/"), undefined, { shallow: true });

        } else {
            if (values.length) {
                router.push(path + "/promotions-" + values.join(","), undefined, { shallow: true });
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
        return null
    }

    return (
        <>
            <div className="flex justify-between items-start mb-2 mt-4 border-t border-neutral-300 pt-5">
                <label className="font-semibold text-sm">
                    هدایای رزرو
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

        </>
    )
}

export default HotelPromotionFilter;