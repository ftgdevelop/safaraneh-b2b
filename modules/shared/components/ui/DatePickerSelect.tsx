import { useState, useEffect } from 'react';
import { dateDiplayFormat, dateFormat, persianNumbersToEnglish, shamsiToMiladi } from '../../helpers';
import { Field } from 'formik';
import styles from './DatePickerSelect.module.scss';

type Props = {
    min: string;
    max: string;
    shamsi?: boolean;
    label?: string;
    descending?: boolean;
    initialValue?: string;
    labelIsSimple?: boolean;
    onChange?: (value: string) => void;
    validateFunction?: (value: string) => void;
    value?: string;
    name?: string;
    id?: string;
    errorText?: string;
    isTouched?: boolean;
    setFieldValue?: any;
}

const DatePickerSelect: React.FC<Props> = props => {

    const { min, max, shamsi, descending } = props;

    const theme2 = process.env.THEME === "THEME2";

    const localizedInitialValue = props.initialValue ? persianNumbersToEnglish(dateDiplayFormat({ date: props.initialValue, locale: shamsi ? 'fa' : 'en', format: "YYYY-MM-DD" })) : "";
    const localalizedMin = persianNumbersToEnglish(dateDiplayFormat({ date: min, locale: shamsi ? 'fa' : 'en', format: "YYYY-MM-DD" }));
    const localalizedMax = persianNumbersToEnglish(dateDiplayFormat({ date: max, locale: shamsi ? 'fa' : 'en', format: "YYYY-MM-DD" }));

    const minYear = localalizedMin.split('-')[0];
    const maxYear = localalizedMax.split('-')[0];

    const minMonth = localalizedMin.split('-')[1];
    const maxMonth = localalizedMax.split('-')[1];

    const minDay = localalizedMin.split('-')[2];
    const maxDay = localalizedMax.split('-')[2];

    const initialYear = localizedInitialValue ? localizedInitialValue.split("-")[0] : "";
    const initialMonth = localizedInitialValue ? localizedInitialValue.split("-")[1] : "";
    const initialDay = localizedInitialValue ? localizedInitialValue.split("-")[2] : "";

    const [year, setYear] = useState<string>(initialYear);
    const [month, setMonth] = useState<string>(initialMonth);
    const [day, setDay] = useState<string>(initialDay);

    useEffect(() => {
        if (day && month && year) {
            let dateArray: string[] = [year, month.padStart(2, '0'), day.padStart(2, '0')];

            if (props.shamsi) {
                dateArray = shamsiToMiladi(+year, +month, +day);
            }

            const formatedValue = dateArray.join("-");
            const formatedPropsValue = props.value ? dateFormat(new Date(props.value)) : "";

            if (props.value && formatedValue === formatedPropsValue) {
                return
            }

            if (props.setFieldValue) {
                props.setFieldValue(props.name, dateArray.join("-"), true);
            }

            if (props.onChange) {
                props.onChange(dateArray.join("-"))
            }


        }
    }, [day, month, year]);

    useEffect(() => {
        if (props.value) {
            const localizedPropsValue = persianNumbersToEnglish(dateDiplayFormat({ date: props.value, locale: shamsi ? 'fa' : 'en', format: "YYYY-MM-DD" }));
            const formatedValueArray = localizedPropsValue.split("-");
            setYear(formatedValueArray[0]);
            setMonth(formatedValueArray[1]);
            setDay(formatedValueArray[2]);
        }else{
            setDay("");
            setMonth("");
            setYear("");
        }
    }, [props.value, props.shamsi]);

    let yearsArray = [];
    for (let i = +minYear; i <= +maxYear; i++) {
        yearsArray.push(i);
    }
    if (descending) {
        yearsArray.reverse()
    }

    const persianMonths = [
        { text: "فروردین", value: '01' },
        { text: "اردیبهشت", value: '02' },
        { text: "خرداد", value: '03' },
        { text: "تیر", value: '04' },
        { text: "مرداد", value: '05' },
        { text: "شهریور", value: '06' },
        { text: "مهر", value: '07' },
        { text: "آبان", value: '08' },
        { text: "آذر", value: '09' },
        { text: "دی", value: '10' },
        { text: "بهمن", value: '11' },
        { text: "اسفند", value: '12' }
    ];

    const miladiMonths = [
        { text: "January", value: '01' },
        { text: "February", value: '02' },
        { text: "March", value: '03' },
        { text: "April", value: '04' },
        { text: "May", value: '05' },
        { text: "June", value: '06' },
        { text: "July", value: '07' },
        { text: "August", value: '08' },
        { text: "September", value: '09' },
        { text: "October", value: '10' },
        { text: "November", value: '11' },
        { text: "December", value: '12' }
    ];

    const months = props.shamsi ? persianMonths : miladiMonths;


    let monthsArray: { text: string, value: string }[] = [...months];

    if (year === maxYear) {
        monthsArray = months.filter(item => {
            const monthNumber = item.value;
            return (+maxMonth >= +monthNumber);
        })
    }
    if (year === minYear) {
        monthsArray = months.filter(item => {
            const monthNumber = item.value;
            return (+minMonth <= +monthNumber);
        })
    }

    const days = [];
    for (let i = 1; i <= 31; i++) {
        days.push(i.toString().padStart(2, '0'));
    }

    let daysArray: string[] = [...days];

    if (props.shamsi) {
        if (+month >= 7) {
            daysArray = [...daysArray].filter(item => +item !== 31)
        }
    } else {
        if (+month === 2) {
            daysArray = [...daysArray].filter(item => +item !== 31 && +item !== 30);
        }
        if ([4, 6, 9, 11].includes(+month)) {
            daysArray = [...daysArray].filter(item => +item !== 31);
        }
    }


    if (year === maxYear && month === maxMonth) {
        daysArray = [...daysArray].filter(item => item <= maxDay);
    }

    if (year === minYear && month === minMonth) {
        daysArray = [...daysArray].filter(item => item >= minDay);
    }

    let selectClassName = `block grow focus:border-blue-500 px-0.5 text-sm bg-white border outline-none rounded-md ${theme2?"h-13":"h-10"} `;

    if (props.errorText && props.isTouched){
        selectClassName += 'border-2 border-red-500';
    }else if (theme2){
        selectClassName += 'border-neutral-400 focus:border-2 focus:border-blue-500';
    }else {
        selectClassName += 'border-neutral-300 focus:border-blue-500';
    }

    return (
        <div className={`relative ${!props.shamsi ? "font-sans" : theme2? "font-iranyekan" : "font-samim"}`}>
            {!!props.label && (
                <label
                    className={`select-none pointer-events-none block leading-4 ${props.labelIsSimple ? "mb-3 text-base" : "top-0 text-xs z-10 text-sm absolute px-2 bg-white transition-all duration-300 -translate-y-1/2 rtl:right-1 ltr:left-1"}  `}
                >
                    {props.label}
                </label>
            )}
            <div className='rtl:text-right' dir="ltr">

                <select
                    className={`${selectClassName} ${styles.year} inline-block`}
                    onChange={e => { setYear(e.target.value) }}
                    value={year}
                >
                    <option disabled value=""> سال </option>
                    {yearsArray.map(item => (
                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>
                    ))}
                </select>

                <select
                    className={`${selectClassName} ${styles.month} inline-block`}
                    onChange={e => { setMonth(e.target.value) }}
                    value={month}
                >
                    <option disabled value=""> ماه </option>
                    {monthsArray.map(item => {
                        return (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.value} ({item.text})
                            </option>
                        )
                    })}
                </select>


                <select
                    className={`${selectClassName} ${styles.day} inline-block`}
                    onChange={e => { setDay(e.target.value) }}
                    value={day}
                >
                    <option disabled value=""> روز </option>
                    {daysArray.map(item => (
                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>
                    ))}
                </select>

            </div>

            <Field
                hidden
                validate={props.validateFunction}
                dir='ltr'
                name={props.name}
                id={props.id}
                type='text'
                readOnly
                value={props.value}
            />

            {props.errorText && props.isTouched && <div className='text-red-500 text-xs'>{props.errorText}</div>}

        </div>
    )
}

export default DatePickerSelect;