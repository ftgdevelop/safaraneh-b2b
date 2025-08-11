import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import Quantity from '@/modules/shared/components/ui/Quantity';
import { FormikErrors } from 'formik';
import { DownCaretThick, User } from '@/modules/shared/components/ui/icons';
import Button from '@/modules/shared/components/ui/Button';

type Props = {
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{
        adult: number;
        child: number;
        infant: number;
    }>>;
    values: {
        adult: number;
        child: number;
        infant: number;
    }
    wrapperClassNames?: string;
}

const SelectPassengers: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const wrapperRef = useRef<HTMLDivElement>(null);

    const { setFieldValue, values, wrapperClassNames } = props;

    const [show, setShow] = useState(false);

    const handleClickOutside = (e: any) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            setShow(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const text = values.adult + values.child + values.infant + " مسافر"

    const theme2 = process.env.THEME === "THEME2";

    const buttonClassNames: string[] = ['flex rounded items-center', 'rounded-md', 'border', 'bg-white', 'px-3', `${theme2 ? "gap-1.5 w-full h-12 border-neutral-400" : "justify-between h-10 w-28"}`, 'ltr:text-left', 'rtl:text-right'];

    const boxClassNames = `bg-white absolute w-60 z-[1] top-full left-0 right-0 shadow border mt-1 rounded ${theme2 ? "p-2 scale-20" : ""} invisible opacity-0`
    const openBoxClassNames = `bg-white absolute w-60 z-[1] top-full left-0 right-0 shadow border mt-1 rounded transition-all visible opacity-100 ${theme2 ? "p-2 rtl:origin-top-right ltr:origin-top-left scale-100" : " "}`

    return (
        <div className={`relative ${wrapperClassNames || ""}`} ref={wrapperRef}>

            <button
                type="button"
                className={buttonClassNames.join(" ")}
                onClick={() => { setShow(prevState => !prevState) }}
            >
                {!!theme2 && <User className='w-6 h-6 fill-current' /> }

                
                <div className='leading-4'>
                    {!!theme2 && <label className='block text-2xs mb-0.5'> مسافران </label> }
                    {text}
                </div>
                {!theme2 && <DownCaretThick className={`w-3.5 h-3.5 fill-current transition-all ${show ? "rotate-180" : ""}`} />}
            </button>

            <div className={show ? openBoxClassNames : boxClassNames}>
                <div className="flex justify-between items-center p-2">
                    <div className={theme2 ? "text-gray-500 leading-5" : "flex gap-1"}>
                        <div className={theme2 ? "font-semibold" : ""}> {t("adult")}  </div>
                        <div className={theme2 ? "text-2xs" : ""}> (12+ سال) </div>
                    </div>
                    <div className='whitespace-nowrap flex items-center'>
                        <Quantity
                            style={theme2?"BTheme2":"B"}
                            min={1}
                            max={9 - values.child}
                            onChange={value => {
                                setFieldValue("adult", value);
                                if (values.infant > value) {
                                    setFieldValue('infant', value);
                                }
                            }}
                            initialValue={values.adult}
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center p-2">
                    <div className={theme2 ? "text-gray-500 leading-5" : "flex gap-1"}>
                        <div className={theme2 ? "font-semibold" : ""}> {t("child")}  </div>
                        <div className={theme2 ? "text-2xs" : ""}> (2 تا 11 سال) </div>
                    </div>
                    <div className='whitespace-nowrap flex items-center'>
                        <Quantity
                            style={theme2?"BTheme2":"B"}
                            min={0}
                            max={9 - values.adult}
                            onChange={value => { setFieldValue("child", value) }}
                            initialValue={values.child}
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center p-2">
                    <div className={theme2 ? "text-gray-500 leading-5" : "flex gap-1"}>
                        <div className={theme2 ? "font-semibold" : ""}> {t("infant")} </div>
                        <div className={theme2 ? "text-2xs" : ""}> (زیر دو سال) </div>
                    </div>
                    <div className='whitespace-nowrap flex items-center'>

                        <Quantity
                            style={theme2?"BTheme2":"B"}
                            min={0}
                            max={values.adult}
                            onChange={value => { setFieldValue("infant", value) }}
                            initialValue={values.infant}
                        />
                    </div>
                </div>

                {!!theme2 && <div className='p-2 flex justify-end'>
                    <Button
                        type='button'
                        className='h-10 px-5 font-semibold'
                        onClick={() => { setShow(false) }}
                    >
                        تایید
                    </Button>
                </div>}
            </div>
        </div>
    )
}

export default SelectPassengers;