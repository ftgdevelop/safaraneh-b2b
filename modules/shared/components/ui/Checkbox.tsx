import { useState, useEffect } from 'react';

type Props = {
    label: React.ReactNode;
    value: string;
    onChange: (values: any) => void;
    name?: string;
    block?: boolean;
    className?: string;
    checked?: boolean;
}

const Checkbox: React.FC<Props> = props => {

    const [checked, setChecked] = useState<boolean>(props.checked || false)

    useEffect(() => {
        props.onChange(checked);
    }, [checked]);

    useEffect(() => {
        setChecked(props.checked || false);
    }, [props.checked]);

    const theme2 = process.env.THEME === "THEME2";

    return (
        <div className={`relative flex gap-2 items-center py-1 ${props.className || ""}`}>
            <input
                type="checkbox"
                onChange={e => { setChecked(e.target.checked) }}
                className="peer absolute opacity-0 w-full h-full cursor-pointer"
                checked={checked}
            />
            <span className={`pointer-events-none block relative bg-white transition-all text-xs  before:block before:transition-all before:w-0.5 before:h-0.5 peer-checked:before:w-1.5 peer-checked:before:h-2.5 before:opacity:0 peer-checked:before:opacity-100 before:rotate-45 before:border-b-2 before:border-r-2 before:border-white before:absolute before:top-2px before:right-5px ${theme2?"peer-checked:bg-blue-700 peer-checked:border-blue-700 peer-hover:border-blue-700 border-2 border-stone-400 rounded-md w-5 h-5":"w-4.5 h-4.5 rounded-sm peer-checked:bg-blue-500 border border-neutral-300"}`} />
            <label
                className={`grow text-sm select-none flex justify-between items-center`}
            >
                {props.label}
            </label>
        </div>
    )
}

export default Checkbox;