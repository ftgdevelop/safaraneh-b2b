import { useState, useEffect } from "react";
// import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import { dateDiplayFormat, persianNumbersToEnglish, shamsiToMiladi } from "../../helpers";

type Props = {
    wrapperClassName?: string;
    inputPlaceholder?: string;
    inputClassName?: string;
    onChange?: (v: any) => void;
    inputName?: string;
    locale: "fa" | "en" | "ar";
    toggleLocale?: () => void;
    value?: string;
    minimumDate?: string;
    maximumDate?: string;
}

type DateObject = {
    day: number;
    month: number;
    year: number;
}
const DatePickerModern: React.FC<Props> = props => {

    {/* TODO: delete this component when mobiscroll is activated */ }

    const { wrapperClassName, inputPlaceholder, inputClassName, minimumDate, maximumDate, inputName, locale, toggleLocale } = props;

    const [value, setValue] = useState<string>();

    const stringToDateObject = (d?: string) => {
        if (!d) {
            return undefined;
        }
        if (locale === 'fa') {
            const transformedToShamsi = dateDiplayFormat({ date: d, format: "YYYY-MM-DD", locale: "fa" });
            const valueArray = persianNumbersToEnglish(transformedToShamsi).split("-");
            return ({
                year: +valueArray[0],
                month: +valueArray[1],
                day: +valueArray[2]
            })
        }

        const valueArray = d.split("-");
        return ({
            year: +valueArray[0],
            month: +valueArray[1],
            day: +valueArray[2]
        })
    }

    const displayValue = stringToDateObject(value);
    const minimum = stringToDateObject(minimumDate);
    const maximum = stringToDateObject(maximumDate);

    let minimumDateDisplay: DateObject | undefined;
    
    let maximumDateDisplay: DateObject | undefined;

    if (minimumDate) {
        const valueArray = minimumDate.split("-");
        minimumDateDisplay = {
            year: +valueArray[0],
            month: +valueArray[1],
            day: +valueArray[2]
        }
    }
    if (maximumDate){
        const valueArray = maximumDate.split("-");
        maximumDateDisplay = {
            year: +valueArray[0],
            month: +valueArray[1],
            day: +valueArray[2]
        }
    }

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    useEffect(() => {
        if (props.onChange) {
            props.onChange(value);
        }
    }, [value]);

    const changeHandler = (value: DateObject) => {
        if (locale === "fa") {
            const transformedValueToMiladi = shamsiToMiladi(+value.year, +value.month, +value.day);
            setValue(`${transformedValueToMiladi[0]}-${transformedValueToMiladi[1].toString().padStart(2, '0')}-${transformedValueToMiladi[2].toString().padStart(2, '0')}`);

        } else {
            setValue(`${value.year}-${value.month.toString().padStart(2, '0')}-${value.day.toString().padStart(2, '0')}`);
        }
    }

    return (
        
        null

        // <DatePicker
        //     inputClassName={`rtl:text-right ltr:text-left ${inputClassName}`}
        //     wrapperClassName={wrapperClassName}
        //     calendarSelectedDayClassName="datepicker-selected-date"
        //     calendarTodayClassName="datepicker-today-date"

        //     value={displayValue}
        //     onChange={(value: DateObject) => { changeHandler(value) }}
        //     inputPlaceholder={inputPlaceholder}
        //     locale={locale}
        //     minimumDate={minimum}
        //     maximumDate={maximum}
        //     inputName={inputName || ''}
        //     calendarPopperPosition="bottom"
        //     renderFooter={() => (
        //         <div className="px-6 pb-3 text-right">
        //             {!!props.toggleLocale && (
        //                 <button
        //                     type="button"
        //                     onClick={toggleLocale}
        //                     className="border-none outline-none bg-transparent cursor-pointer text-xs"
        //                 >
        //                     {locale == 'en' ? 'شمسی' : 'میلادی'}
        //                 </button>
        //             )}
        //         </div>
        //     )}
        // />

    )
}

export default DatePickerModern;