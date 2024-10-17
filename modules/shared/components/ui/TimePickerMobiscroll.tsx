import { Datepicker } from "@mobiscroll/react";
import { Field } from "formik";
import { useEffect, useState } from "react";

type Props = {
    setFieldValue: any;
    label?: string;
    labelIsSimple?: boolean;
    errorText?: string;
    isTouched?: boolean;
    value?: string;
    name?: string;
    id?: string;
    showRequiredStar?: boolean;
    showRequiredStarEnd?: boolean;
    labelIsSmall?: boolean;
    wrapperClassName?: string;
    validateFunction?: (value: string) => void;
}

const TimePickerMobiscroll: React.FC<Props> = props => {

    const [val, setVal] = useState<string>("");

    const [labelUp, setLabelUp] = useState<boolean>(false);

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

    const labelClassNames = ["z-10 select-none pointer-events-none block leading-4"];

    if (props.labelIsSmall){
        labelClassNames.push ("mb-2 text-sm");
    }else if(props.labelIsSimple){        
        labelClassNames.push ("mb-3 text-sm");
    }else {
        
        labelClassNames.push(`absolute px-2 transition-all duration-300 -translate-y-1/2 rtl:right-1 ltr:left-1 bg-white`);

        if(labelUp){
        
            labelClassNames.push("top-0 text-xs");
        
        }else{
        
            labelClassNames.push("top-1/2 text-sm");
        
        }
    }
    
    return (
        <div
            className={`moboscroll-time-picker-wrapper  ${props.errorText && props.isTouched ? "hasError" : ""} ${props.wrapperClassName || ""}`}
        >
            <div className="relative">
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
                <Datepicker
                    onFocus={() => { props.labelIsSimple ? null : setLabelUp(true) }}
                    onBlur={(e: any) => { props.labelIsSimple ? null : setLabelUp(e.currentTarget.value.trim()) }}
                    controls={['time']}
                    timeFormat="HH:mm"
                    headerText="Time: {value}"
                    cssClass="mobiscroll-time-picker"
                    responsive={{
                        small: {
                            touchUi: true
                        },
                        large: {
                            touchUi: false
                        }
                    }}
                    setText="تایید"
                    cancelText="لغو"
                    showControls
                    onChange={e => {
                        if (e.valueText) {
                            props.setFieldValue(props.name, e.valueText, true);
                            setVal(e.valueText)
                        }
                    }}
                    value={val}
                />
            </div>
            <Field
                type="hidden"
                validate={props.validateFunction}
                dir='ltr'
                name={props.name}
                id={props.id}
                value={props.value}
            />

            {props.errorText && props.isTouched && <div className='text-red-500 text-xs'>{props.errorText}</div>}

        </div>
    )
}

export default TimePickerMobiscroll;