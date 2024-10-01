import { Field } from 'formik';
import { ChangeEvent, useState, useEffect } from 'react';
import { Eye, Eye2 } from './icons';

type Props = {
    groupStart?:boolean;
    errorText?: string;
    isTouched?: boolean;
    label?: string;
    maxLength?: number;
    id?: string;
    name?: string;
    className?: string;
    fieldClassName?: string;
    validateFunction?: (value: string) => void;
    setFieldValue: any;
    onChange?: (value: string) => void;
    value: string;
    labelIsSimple?: boolean;
    labelIsSmall?:boolean;
    showRequiredStar?: boolean;
    showRequiredStarEnd?: boolean;
    isPassword?: boolean;
    showNotConfirmedBadge?: boolean;
    disabled?:boolean;
    heightClassName?: string;
}

const FormikField: React.FC<Props> = props => {

    const theme1 = process.env.THEME === "THEME1";
    const theme2 = process.env.THEME === "THEME2";

    const [labelUp, setLabelUp] = useState<boolean>(false);
    const [isPassword, setIsPassword] = useState<boolean>(props.isPassword || false);

    useEffect(() => {
        if (props.labelIsSimple) {
            return;
        }
        if (props.value) {
            setLabelUp(true);
        } else {
            setLabelUp(false);
        }

    }, [props.value]);

    let passwordToggleBtn = null;

    if (props.isPassword) {
        passwordToggleBtn = <button
            type='button'
            className='absolute top-1/2 left-3 -translate-y-1/2 outline-none'
            tabIndex={-1}
            onClick={() => { setIsPassword(prevState => !prevState) }}
        >
            {isPassword ? (
                <Eye2 className='w-5 h-5 fill-neutral-500' />
            ) : (
                <Eye className='w-5 h-5 fill-neutral-500' />
            )}
        </button>
    }

    const labelClassNames = ["z-10 select-none pointer-events-none block leading-4"];

    if (props.labelIsSmall){
        labelClassNames.push ("mb-2 text-sm");
    }else if(props.labelIsSimple){        
        labelClassNames.push ("mb-3 text-sm");
    }else {
        
        labelClassNames.push(`absolute px-2 transition-all duration-300 -translate-y-1/2 rtl:right-1 ltr:left-1 ${theme1?"bg-white":theme2?"":""}`);

        if(labelUp){
        
            labelClassNames.push(`${theme2?"top-3.5 text-2xs":"top-0 text-xs"}`);
        
        }else{
        
            labelClassNames.push("top-1/2 text-sm");
        
        }
    }

    const inputClassNames : string[] = ["w-full px-3 bg-white border outline-none"];
    
    if(props.heightClassName){
        inputClassNames.push(props.heightClassName);
    } else if(theme2){
        inputClassNames.push(`h-13`);
    }else{
        inputClassNames.push("h-10");
    }
    
    if(!props.labelIsSimple){
        inputClassNames.push(`leading-4 ${theme2?"pt-4":"pt-0"}`);
    }

    if(props.errorText && props.isTouched){
        inputClassNames.push(`border-red-500 ${theme2?"border-2":""}`);
    }else{
        inputClassNames.push(`${theme2?"border-neutral-400 focus:border-2":"border-neutral-300"} focus:border-blue-500`);
    }

    if (props.groupStart){
        inputClassNames.push("rtl:rounded-r-md ltr:rounded-l-md");
    }else{
        inputClassNames.push("rounded-md")
    }

    if(props.fieldClassName){
        inputClassNames.push(props.fieldClassName);
    }

    return (
        <div className={`${props.errorText ? "has-validation-error" : ""} ${props.className || ""}`}>
            <div className='relative'>
                <div className='flex justify-between items-start'>
                    {!!props.label && (
                        <label
                            htmlFor={props.id}
                            className={labelClassNames.join(" ")}
                        >
                            {!!(props.labelIsSimple && props.showRequiredStar && !props.showRequiredStarEnd) && <span className='text-red-600'>* </span>}
                            {props.label}
                            {!!(props.labelIsSimple && props.showRequiredStar && props.showRequiredStarEnd) && <span className='text-red-600'>* </span>}

                        </label>
                    )}
                    {props.showNotConfirmedBadge && (
                        <div className='bg-amber-100 text-xs text-neutral-500 leading-6 px-3 rounded-lg before:inline-block before:w-2 before:h-2 before:bg-amber-400 before:rounded-full before:align-middle before:ltr:mr-1 before:rtl:ml-1'>
                            تایید نشده
                        </div>
                    )}
                </div>

                <div className='relative'>
                    <Field
                        disabled = {props.disabled}
                        maxLength={props.maxLength || undefined}
                        validate={props.validateFunction}
                        onFocus={() => { props.labelIsSimple ? null : setLabelUp(true) }}
                        onBlur={(e: any) => { props.labelIsSimple ? null : setLabelUp(e.currentTarget.value.trim()) }}
                        id={props.id}
                        name={props.name}
                        autoComplete="off"
                        className={inputClassNames.join(" ")}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            props.setFieldValue(props.name, e.target.value, true);
                            if (props.onChange) {
                                props.onChange(e.target.value);
                            }
                        }}
                        value={props.value}
                        type={isPassword ? "password" : "text"}

                    />

                    {passwordToggleBtn}
                </div>
            </div>

            {props.errorText && props.isTouched && <div className='text-red-500 text-xs'>{props.errorText}</div>}

        </div>
    )
}

export default FormikField;