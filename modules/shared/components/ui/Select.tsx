import { useState, useRef, useEffect } from "react";
import { DownCaretThick } from "./icons";

type Props = {
    items: { label: string, value: string }[];
    onChange: (value: string) => void;
    value: string;
    label?: string;
    className?: string;
    wrapperClassName?: string;
    placeholder?:string;
    h10?:boolean;
    buttonClassName?:string;
}

const Select: React.FC<Props> = props => {

    const [value, setValue] = useState<string>(props.value);

    const [open, setOpen] = useState<boolean>(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        props.onChange(value);
        setOpen(false);
    }, [value]);

    useEffect(()=>{
        setValue(props.value);
    },[props.value]);

    return (
        <div className={`relative ${props.wrapperClassName || ""}`} ref={wrapperRef}>

            <div
                className={`${props.buttonClassName || ""} bg-white relative rounded border px-3 ${props.h10?"h-10":"h-12"} justify-center flex flex-col leading-5 text-sm select-none cursor-pointer ${props.className || "border-neutral-400"}`}
                onClick={() => { setOpen(true) }}
            >
                {props.label ? (
                    <label className="text-2xs leading-4 pointer-events-none">
                        {props.label}
                    </label>
                ) : null}
                {props.items.find(item => item.value === value)?.label || props.placeholder || null}

                <DownCaretThick className={`pointer-events-none w-3 h-3 fill-current top-1/2 -translate-y-1/2 absolute rtl:left-3 ltr:right-3 transition-all ${open?"rotate-180":""}`} />
            </div>

            <div className={`absolute z-10 top-full rtl:right-0 ltr:left-0 bg-white min-w-full max-h-64 overflow-auto shadow transition-all ${open ? "visible opacity-100 mt-0" : "invisible opacity-0 mt-1"}`}>
                {props.items.map(item => (
                    <div
                        key={item.value}
                        onClick={() => { setValue(item.value) }}
                        className={`px-3 py-1 transition-all cursor-pointer select-none text-sm ${item.value === value ? "bg-blue-50" : "bg-white hover:bg-neutral-100"}`}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Select;