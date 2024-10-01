import { useState, useEffect } from 'react';

type Props = {
    onChange?: (checked: boolean) => void;
    initialChecked?: boolean;
    className?: string;
}


const CheckboxSwitch: React.FC<Props> = props => {

    const [checked, setChecked] = useState<boolean>(props.initialChecked || false);
    const [rendered, setRendered] = useState<boolean>(false);

    useEffect(() => {
        if (props.onChange && rendered) {
            props.onChange(checked);
        }
    }, [checked]);

    useEffect(() => {
        setRendered(true);
    }, [])

    return (
        <div className={`rounded-xl w-10 p-1 relative transition-all ${checked ? "bg-blue-700 justify-start" : "bg-neutral-400 justify-end"} ${props.className}`}>
            <input
                type="checkbox"
                className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
                checked={checked}
                onChange={e => { setChecked(e.target.checked) }}
            />
            <span className={`pointer-events-none w-3.5 h-3.5 rounded-full bg-white block relative transition-all ${checked ? "right-0" : "right-4.5"}`} />
        </div>
    )
}

export default CheckboxSwitch;