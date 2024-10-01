import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';

import Checkbox from "@/modules/shared/components/ui/Checkbox";

const HotelAvailabilityFilter: React.FC = () => {

    const router = useRouter();

    const { t: tHotel } = useTranslation('hotel');
    const { t } = useTranslation('common');

    const theme2 = process.env.THEME === "THEME2";

    const initialCkecked = router.asPath.includes('/available');

    const [checked, setchecked] = useState<boolean>(initialCkecked);

    useEffect(() => {
        const path = router.asPath;
        if (path.includes('/available')) {

            const paramsArray = path.split("/").filter(item => !item.includes('available'));
            if (checked) {
                paramsArray.push("available")
            }

            router.push(paramsArray.join("/"), undefined, { shallow: true });

        } else {
            if (checked) {
                router.push(path + "/available", undefined, { shallow: true });
            }
        }
    }, [checked]);

    useEffect(()=>{
        setchecked(initialCkecked);
    },[initialCkecked]);

    return (
        <>
            <div className="flex justify-between items-start mb-2 mt-4 border-t border-neutral-300 pt-5">
                <label className="font-semibold text-sm">
                    {theme2 ? "هتل های قابل رزرو" : tHotel('available-hotel')}
                </label>
                {!!checked && <button
                    onClick={() => { setchecked(false) }}
                    type="button"
                    className="bg-red-500 text-white text-xs leading-5 px-2 rounded inline-block"
                >
                    {t('reset-filter')}
                </button>}
            </div>

            <Checkbox
                block
                label={theme2 ? "فقط هتل های قابل رزرو" : tHotel('just-available-hotel')}
                onChange={c => { setchecked(c) }}
                value=""
                checked={checked}
            />
        </>
    )
}

export default HotelAvailabilityFilter;