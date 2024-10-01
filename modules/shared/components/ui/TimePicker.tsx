import { useEffect, useState } from 'react';
import { Field } from 'formik';
import Button from './Button';

type Props = {
    setFieldValue: any;
    label?: string;
    labelIsSimple?: boolean;
    errorText?: string;
    isTouched?: boolean;
    name?: string;
    id?: string;
    // fieldClassName?: string;
    validateFunction?: (value: string) => void;
}


const TimePicker: React.FC<Props> = props => {

    const [hour, setHour] = useState<number>();
    const [minute, setMinute] = useState<number>();
    const [open, setOpen] = useState<boolean>(false);



    const hours = [];
    for (let i = 1; i <= 24; i++) {
        hours.push(i);
    }
    const minutes = [];
    for (let i = 1; i <= 60; i++) {
        minutes.push(i);
    }

    let value = "";

    if (hour && minute) {
        value = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    }

    const submit = () =>{
        setOpen(false);
        props.setFieldValue(props.name, value);
    }

    useEffect(()=>{
        if (minute && hour){
            submit()
        }
    },[minute, hour])


    return (
        <div>
            <div className='relative'>
                {!!props.label && (
                    <label
                        htmlFor={props.id}
                        className={`z-10 select-none pointer-events-none block leading-4 ${props.labelIsSimple ? "mb-3" : "absolute px-2 bg-white transition-all duration-300 -translate-y-1/2 rtl:right-1 ltr:left-1"} ${props.labelIsSimple ? "text-base" : value ? "top-0 text-xs" : "top-1/2 text-sm"}`}
                    >
                        {props.label}
                    </label>
                )}
                <Field
                    validate={props.validateFunction}
                    onClick={() => { setOpen(true) }}
                    dir='ltr'
                    name={props.name}
                    id={props.id}
                    className={`font-sans h-10 px-3 bg-white border ${props.errorText && props.isTouched ? "border-red-500" : "border-neutral-300 focus:border-blue-500"} outline-none rounded-md w-full`}
                    type='text'
                    readOnly
                    value={value}
                />
                <div className={`${open ? "visible opacity-100 mt-0" : "invisible opacity-0 -mt-2"} transition-all absolute z-20 rounded top-full left-0 bg-white border border-neutral-300 grid grid-cols-2 text-sm`} dir="ltr">
                    <div className='h-44 w-20 overflow-auto font-sans'>
                        {hours.map(item => (
                            <button
                                key={item}
                                type='button'
                                onClick={() => { setHour(item) }}
                                className={`block w-full px-3 ${hour === item ? "bg-sky-100" : "bg-white hover:bg-neutral-100"} border-b border-neutral-200 cursor-pointer outline-none`}
                            >
                                {item.toString().padStart(2, "0")}
                            </button>
                        ))}
                    </div>
                    <div className='h-44 w-20 overflow-auto font-sans'>
                        {minutes.map(item => (
                            <button
                                key={item}
                                type='button'
                                onClick={() => { setMinute(item) }}
                                className={`block w-full px-3 ${minute === item ? "bg-sky-100" : "bg-white hover:bg-neutral-100"} border-b border-neutral-200 cursor-pointer outline-none`}
                            >
                                {item.toString().padStart(2, "0")}
                            </button>
                        ))}
                    </div>
                    <div className='p-2.5 col-span-2 border-t border-neutral-200'>
                        <Button
                            type='button'
                            className='h-8 block w-full'
                            disabled={!minute || !hour}
                            onClick={submit}
                        >
                            انتخاب
                        </Button>
                    </div>

                </div>
            </div>

            {props.errorText && props.isTouched && <div className='text-red-500 text-xs'>{props.errorText}</div>}

        </div>
    )
}

export default TimePicker;