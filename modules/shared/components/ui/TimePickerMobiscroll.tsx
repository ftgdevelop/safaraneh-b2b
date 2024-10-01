import { Datepicker } from "@mobiscroll/react";
import { Field } from "formik";
import { useState } from "react";

type Props = {
    setFieldValue: any;
    label?: string;
    labelIsSimple?: boolean;
    errorText?: string;
    isTouched?: boolean;
    value?: string;
    name?: string;
    id?: string;
    validateFunction?: (value: string) => void;
}

const TimePickerMobiscroll: React.FC<Props> = props => {

    const [val, setVal] = useState<string>("");
    
    const theme2 = process.env.THEME === "THEME2";

    const labelClassNames : string[] = ["pointer-events-none leading-4 px-2 absolute rtl:right-1 ltr:left-1 z-[1] -translate-y-1/2 bg-white"];

    if(val){
        labelClassNames.push(`${theme2?"top-3.5 text-2xs":"top-0 text-xs"}`);
    }else{
        labelClassNames.push("top-1/2 text-sm");
    }
    
    return (
        <div
            className={`moboscroll-time-picker-wrapper  ${props.errorText && props.isTouched ? "hasError" : ""}`}
        >
            <div className="relative">
                {props.label && (
                    <label
                        className={labelClassNames.join(" ")}
                    >
                        {props.label}
                    </label>
                )}
                <Datepicker
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