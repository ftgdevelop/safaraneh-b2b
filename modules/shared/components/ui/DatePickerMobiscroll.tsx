import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker as MobiscrollDatepicker, setOptions, localeFa, localeEn, Page, CalendarToday, Input, Popup, Select, Button, formatDate, options } from '@mobiscroll/react';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';

import { ArrowLeft, Calendar, CalendarToggle } from './icons';
import { dateDiplayFormat } from '../../helpers';

type Props = {
    onChange: (args: any, inst: any) => void;
    onChangeLocale? : (l:any) => void;
    rtl?: boolean;
    locale?: any;
    value?: string;
    placeholder?:string;
    minDate?: string;
    inputStyle:"simple" | "theme1" | "theme2"
}

type DatePickerValue = {
    value: string;
    valueText: string;
}

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

const DatePickerMobiscroll: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const [locale, setLocale] = useState<any>(localeFa);

    const [value, setValue] = useState<string>(props.value || "");

    const [instance, setInstance] = useState<any>(null);

    useEffect(() => {
        setLocale(props.locale);
    }, [props.locale]);

    const onChange = (args: DatePickerValue, inst: any) => {
        setValue(args.value);
        props.onChange(args, inst);
    }

    const fridays: string[] = [
        '2023-11-24',
        '2023-12-01',
        '2023-12-08',
        '2023-12-15',
        '2023-12-17',
        '2023-12-22',
        '2023-12-29',
        '2024-01-05',
        '2024-01-12',
        '2024-01-19',
        '2024-01-25',
        '2024-01-26'
    ];

    const marked = fridays.map(item => ({
        date: item,
        cellCssClass: "red"
    }));

    const goToday = () => {
        instance?.navigate(new Date(2016, 1, 1));
    }

    const theme2 = process.env.THEME === "THEME2";
    
    return (
        <div className={`mobiscroll-datepicker-wrapper ${props.inputStyle} ${locale === localeFa ? 'persian-datepicker-wrapper' : ''}`} >

            <MobiscrollDatepicker
                onInit={(_, inst) => { setInstance(inst) }}
                cssClass={`mobi-date-picker ${locale === localeFa ? 'persian-date-picker' : ''}`}
                controls={['calendar']}
                select="date"
                returnFormat="iso8601"
                rtl={locale === localeFa}
                locale={locale}
                responsive={{
                    small: {
                        pages: 1,
                        touchUi: true
                    },
                    large: {
                        pages: 1,
                        touchUi: false
                    }
                }}
                inputProps={{
                    inputStyle: 'box',
                    placeholder: props.placeholder || "",
                }}
                inputTyping={false}
                min={props.minDate ? new Date(props.minDate) : ""}
                marked={marked}
                showRangeLabels={false}
                onChange={onChange}
                value = {value}
            >

                <footer className={`direction-root ${theme2?"font-iranyekan":"font-samim"} mobi-date-picker-footer flex justify-center gap-5 md:justify-between items-center px-5 py-4 border-t border-neutral-300`}>
                    <button type='button' onClick={goToday} className='text-primary-700 text-sm'>
                        {t('goToToday')}
                    </button>


                    <button
                        type='button'
                        className='text-primary-700 text-sm flex gap-2 items-center'
                        onClick={() => { 
                            setLocale((previousLocale: any) => {
                                const updatedLocale = previousLocale === localeFa ? localeEn : localeFa;
                                if(props.onChangeLocale){
                                    props.onChangeLocale(updatedLocale);
                                }
                                return(updatedLocale)
                            });
                        }}
                    >
                        <CalendarToggle className='w-5 h-5 fill-current' /> {locale === localeFa ? t('gregorianCalendar') : t('iranianCalendar')}
                    </button>
                </footer>


            </MobiscrollDatepicker>

        </div>
    )
}

export default DatePickerMobiscroll;