import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker as MobiscrollDatepicker, setOptions, localeFa, localeEn } from '@mobiscroll/react';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';

import { ArrowLeft, CalendarToggle } from './icons';
import { dateDiplayFormat } from '../../helpers';

type Props = {
    onChange: (args: any, inst: any) => void;
    rtl?: boolean;
    locale?: any;
    value?: [string, string];
    label?: string;
    name: string;
}

type RangePickerValue = {
    value: [string | null, string | null];
    valueText: string;
}

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

const SimpleRangePicker: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const [locale, setLocale] = useState<any>(localeFa);

    const [values, setValues] = useState<[string | null, string | null]>(props.value || [null, null]);

    const datePickerRef = useRef<any>(null);

    const [instance, setInstance] = useState<any>(null);

    useEffect(() => {
        setLocale(props.locale);
    }, [props.locale]);

    useEffect(()=>{
        if(props.value){
            setValues(props.value);
        }
    },[props.value?.[0], props.value?.[1]]);


    const onChange = (args: RangePickerValue, inst: any) => {
        setValues(args.value);
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

    let start = "";
    let end = "";
    let startFormated = "";
    let endFormated = "";

    if (values && values[0]) {
        startFormated = dateDiplayFormat({ date: values[0], format: "yyyy/mm/dd", locale: locale === localeFa ? "fa" : "en" });
        start = dateDiplayFormat({ date: values[0], format: "yyyy/mm/dd", locale: locale === localeFa ? "fa" : "en" });
    }

    if (values && values[1]) {
        endFormated = dateDiplayFormat({ date: values[1], format: "yyyy/mm/dd", locale: locale === localeFa ? "fa" : "en" });
        end = dateDiplayFormat({ date: values[1], format: "yyyy/mm/dd", locale: locale === localeFa ? "fa" : "en" });
    }

    return (
        <div className={`mobiscroll-datepicker-wrapper ${locale === localeFa ? 'persian-datepicker-wrapper' : ''} relative text-xs`} >

            <label htmlFor={props.name} className="text-sm block mb-2 pointer-events-none">
                {props.label}
            </label>

            <div className="relative">
                <div className='relative'>
                    <input
                        id={props.name}
                        className={`${values[0] ? "text-neutral-500" : "text-neutral-300"} border w-full h-10 border-slate-300 px-3 rounded-lg ${locale === localeEn ? "font-sans" : ""}`}
                        value={`${start} - ${endFormated}`}
                        readOnly
                    />
                </div>
                <div className='absolute top-0 left-0 right-0 h-full opacity-0'>
                    <MobiscrollDatepicker
                        ref={datePickerRef}
                        onInit={(_, inst) => { setInstance(inst) }}
                        cssClass={`mobi-date-picker mobi-range-picker ${locale === localeFa ? 'persian-date-picker' : ''}`}
                        controls={['calendar']}
                        select="range"
                        returnFormat="iso8601"
                        rtl={locale === localeFa}
                        locale={locale}
                        responsive={{
                            small: {
                                pages: 1,
                                touchUi: true
                            },
                            large: {
                                pages: 2,
                                touchUi: false
                            }
                        }}
                        inputProps={{
                            inputStyle: 'box',
                            placeholder: 'انتخاب تاریخ'
                        }}
                        marked={marked}
                        showRangeLabels={false}
                        onChange={onChange}
                        value={values}
                    >

                        <header className={`direction-root font-samim mobi-date-picker-header px-5 py-3 border-b border-neutral-300  gap-5 text-sm hidden md:flex h-12 ${locale === localeEn ? "font-sans" : ""}`} >

                            <div className={`font-semibold text-sm border-b-2 border-transparent ${values && values[0] && !values[1] ? "border-blue-600" : ""}`}>
                                {startFormated}
                            </div>

                            <ArrowLeft className='w-6 h-6 fill-current' />

                            <div className={`font-semibold text-sm border-b-2 border-transparent ${values && values[0] && !values[1] ? "border-blue-600" : ""}`}>
                                {endFormated}
                            </div>

                        </header>

                        <footer className={`direction-root font-samim mobi-date-picker-footer flex justify-center gap-5 md:justify-between items-center px-5 py-4 border-t border-neutral-300`}>
                            <button type='button' onClick={goToday} className='text-primary-700 text-sm'>
                                {t('goToToday')}
                            </button>

                            <button
                                type='button'
                                className='text-primary-700 text-sm flex gap-2 items-center'
                                onClick={() => { setLocale((previousLocale: any) => previousLocale === localeFa ? localeEn : localeFa) }}
                            >
                                <CalendarToggle className='w-5 h-5 fill-current' /> {locale === localeFa ? t('gregorianCalendar') : t('iranianCalendar')}
                            </button>
                        </footer>

                    </MobiscrollDatepicker>
                </div>

            </div>

        </div>
    )
}

export default SimpleRangePicker;