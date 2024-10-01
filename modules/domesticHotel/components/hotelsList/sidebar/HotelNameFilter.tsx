import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

import { Search } from "@/modules/shared/components/ui/icons";

const HotelNameFilter: React.FC = () => {

    const router = useRouter();

    const { t: tHotel } = useTranslation('hotel');
    const { t } = useTranslation('common');

    const urlNameSegment = router.asPath.split("/").find(item => item.includes('name-'));
    let initialFilteredName = "";
    if (urlNameSegment) {
        initialFilteredName = decodeURI(urlNameSegment.split('name-')[1].split("/")[0]);
    }

    const [enteredName, setEnteredName] = useState<string>(initialFilteredName);
    const [submitedName, setSubmitedName] = useState<string>(initialFilteredName);

    const submitHandler = () => {

        setSubmitedName(enteredName);

        const path = router.asPath;
        if (path.includes('/name-')) {

            const paramsArray = path.split("/").filter(item => !item.includes('name'));
            if (enteredName.trim()) {
                paramsArray.push("name-" + enteredName.trim());
            }

            router.push(paramsArray.join("/"), undefined, { shallow: true });

        } else {
            if (enteredName.trim()) {
                router.push(path + "/name-" + enteredName.trim(), undefined, { shallow: true });
            }
        }
    }

    const resetFilter = () => {
        setEnteredName("");
        setSubmitedName("");

        const path = router.asPath;
        if (path.includes('/name-')) {
            const paramsArray = path.split("/").filter(item => !item.includes('name'));
            router.push(paramsArray.join("/"), undefined, { shallow: true });
        }
    }

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            submitHandler()
        }
    }

    useEffect(()=>{
        setEnteredName(initialFilteredName);
        setSubmitedName(initialFilteredName);
    },[initialFilteredName]);

    const theme2 = process.env.THEME === "THEME2";

    return (
        <>
            <div className="flex justify-between items-start">
                <label className="mb-1 font-semibold text-sm">
                    {tHotel("hotel-name")}
                </label>
                {!!submitedName && <button
                    onClick={resetFilter}
                    type="button"
                    className="bg-red-500 text-white text-xs leading-5 px-2 rounded inline-block"
                >
                    {t('reset-filter')}
                </button>}
            </div>

            <div className='relative'>

                <input
                    className="border border-neutral-300 rounded px-3 text-sm h-10 block w-full rtl:pl-14 ltr:pr-14 outline-none focus:border-neutral-600"
                    type="text"
                    placeholder={theme2? "جستجوی نام هتل" : tHotel('search-hotel-name')}
                    name="hotelName"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setEnteredName(e.target.value) }}
                    value={enteredName}
                    onKeyDown={onKeyDown}
                />

                <button
                    onClick={submitHandler}
                    type="button"
                    aria-label="filter hotel name"
                    className={`absolute rtl:left-1 ltr:right-1 top-1 bottom-1 aspect-square flex justify-center items-center ${theme2?"":"bg-blue-600 text-white rounded"}`}
                >
                    <Search className="w-7 h-7 fill-current" />
                </button>

            </div>
        </>
    )
}

export default HotelNameFilter;