import { Field } from 'formik';
import { ChangeEvent, useState, useEffect, useRef } from 'react';
import { DownCaret, Search } from './icons';

type Props = {
    errorText?: string;
    isTouched?: boolean;
    label?: string;
    id?: string;
    name?: string;
    className?: string;
    fieldClassName?: string;
    validateFunction?: (value: string) => void;
    setFieldValue: any;
    onChange?: (value: string) => void;
    value: string;
    labelIsSimple?: boolean;
    showRequiredStar?: boolean;
    disabled?: boolean;
    items: { label: string, value: string }[];
    labelIsSmall?: boolean;
}

const SelectWithSearch: React.FC<Props> = props => {

    const wrapperRef = useRef<HTMLDivElement>(null);

    const [isFocused, setIsFocused] = useState<boolean>(false);

    const [text, setText] = useState<string>(props.value);

    const [value, setValue] = useState<{ code: string, label: string }>();

    const [open, setOpen] = useState<boolean>(false);

    const handleClickOutside = (e: any) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const focusHandle = () => {
        if (props.labelIsSimple) {
            setOpen(true);
        } else {
            setOpen(true);
            setIsFocused(true);
        }
    }

    const blurHandle = (t: string) => {
        if (!props.labelIsSimple && !t) {
            setTimeout(() => { setIsFocused(false) }, 150)
        }
    }

    let labelIsUp = false;
    if (text || value || isFocused) {
        labelIsUp = true;
    }

    const labelClassNames = ["z-10 select-none pointer-events-none block leading-4"];

    if (props.labelIsSmall) {
        labelClassNames.push("mb-2 text-sm");
    } else if (props.labelIsSimple) {
        labelClassNames.push("mb-3 text-sm");
    } else {

        labelClassNames.push(`absolute px-2 transition-all duration-300 -translate-y-1/2 rtl:right-1 ltr:left-1 bg-white`);

        if (labelIsUp) {

            labelClassNames.push("top-0 text-xs");

        } else {

            labelClassNames.push("top-1/2 text-sm");

        }
    }

    useEffect(() => {
        props.setFieldValue(props.name, value?.code || "")
    }, [value?.code])

    return (
        <div className={`${props.errorText ? "has-validation-error" : ""} ${props.className || ""}`}>
            <div className='relative'>
                <div className='flex justify-between items-start'>
                    {!!props.label && (
                        <label
                            htmlFor={props.id}
                            className={labelClassNames.join(" ")}
                        >
                            {!!(props.labelIsSimple && props.showRequiredStar) && <span className='text-red-600'>* </span>}
                            {props.label}
                        </label>
                    )}

                </div>

                <div className='relative' ref={wrapperRef}>
                    <input
                        disabled={props.disabled}
                        onFocus={focusHandle}
                        id={props.id}
                        onBlur={(e: any) => { blurHandle(e.currentTarget.value.trim()) }}
                        autoComplete="off"
                        className={`${props.fieldClassName || ""} h-10 px-3 bg-white border ${props.errorText && props.isTouched ? "border-red-500" : "border-neutral-300 focus:border-blue-500"} outline-none rounded-md w-full`}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (!e.target.value) {
                                setValue(undefined);
                            }
                            setText(e.target.value);
                        }}
                        value={text}
                        type="text"
                    />

                    {open ? (
                        <Search className='w-4.5 h-4.5 fill-neutral-300 absolute top-1/2 -translate-y-1/2 left-2' />
                    ) : (
                        <DownCaret className='w-5 h-5 fill-neutral-300 absolute top-1/2 -translate-y-1/2 left-2' />
                    )}

                    <div className={`absolute z-20 top-full rtl:right-0 ltr:left-0 bg-white min-w-full max-h-64 overflow-auto shadow transition-all ${open ? "visible opacity-100 mt-0" : "invisible opacity-0 mt-1"}`}>
                        {props.items.filter(item => !text || item.label.includes(text) || item.value.toLocaleLowerCase().includes(text.toLocaleLowerCase())).map(item => (
                            <div
                                key={item.value}
                                onClick={() => { setValue({ code: item.value, label: item.label }); setText(item.label); setOpen(false); }}
                                className={`px-3 py-1 transition-all cursor-pointer select-none text-sm ${item.value === value?.code ? "bg-blue-50" : "bg-white hover:bg-neutral-100"}`}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <Field
                hidden
                name={props.name}
                type='text'
                readOnly
                value={value}
                validate={props.validateFunction}
            />

            {props.errorText && props.isTouched && <div className='text-red-500 text-xs'>{props.errorText}</div>}

        </div>
    )
}

export default SelectWithSearch;