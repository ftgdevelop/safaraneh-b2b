import React, { useEffect, useState } from 'react';
import { Minus, Plus } from './icons';

type Props = {
    min: number;
    max: number;
    onChange: (value: number) => void;
    inputId?: string;
    disabled?: boolean;
    initialValue?: number;
    style?: "B" | "BTheme2";
}

const Quantity: React.FC<Props> = props => {

    const { max, min, onChange, disabled, style } = props;

    const initialValue = props.initialValue != undefined ? props.initialValue : min != undefined ? min : 1
    const [value, setValue] = useState(initialValue);

    const decrease = () => {
        if (!disabled && value > min) {
            setValue(prevValue => prevValue - 1);
        };
    }

    const increase = () => {
        if (!disabled && value < max) {
            setValue(prevValue => prevValue + 1);
        };
    }
    useEffect(() => {
        onChange(value);
    }, [value]);

    const buttonStyle = `overflow-hidden select-none text-center outline-none inline-block cursor-pointer 
        ${style === 'B' ?
            "inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-700 text-white"
            : style === 'BTheme2' ?
                "inline-flex items-center justify-center w-7 h-7 rounded-full bg-transparent border border-neutral-500 hover:bg-blue-50"
                :
                "text-3xl w-8 h-8 rounded-md bg-neutral-200 text-neutal-600 pt-1 leading-4"
        }`;

    const buttonDisabledStyle = `overflow-hidden select-none text-center outline-none inline-block cursor-not-allowed  
    ${style === 'B' ?
            "inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-200 text-white"
            : style === 'BTheme2' ?
                "inline-flex items-center justify-center w-7 h-7 rounded-full bg-transparent border border-neutral-200 text-neutral-200"
                :
                "text-3xl  w-8 h-8 rounded-md bg-neutral-100 text-neutral-200 pt-1 leading-4"
        }`;

    return (
        <>
            <button aria-label="decrease quantity" type='button' className={`${value <= min ? buttonDisabledStyle : buttonStyle}`} onClick={decrease}>
                {style === 'B' || style === 'BTheme2' ? <Minus className='w-5 h-5 fill-current' /> : "-"}
            </button>

            <input id={props.inputId || undefined} type="text" readOnly value={value} className='inline-block font-semibold w-8 text-center text-lg pointer-events-none' />

            <button aria-label="increase quantity" type='button' className={`${value >= max ? buttonDisabledStyle : buttonStyle}`} onClick={increase}>
                {(style === 'B' || style === 'BTheme2') ? <Plus className='w-5 h-5 fill-current' /> : "+"}
            </button>
        </>
    );
};

export default Quantity;