type Props = {
    className?: string;
    percentage: number;
    label: string;
}

const ProgressBarWithLabel: React.FC<Props> = props => {

    return (
        <div className={`rounded bg bg-neutral-300 overflow-hidden relative ${props.className || ""}`} >
            <div
                className='absolute h-full top-0 transition-all duration-1000 delay-200 bg-gradient-to-l from-sky-400 to-blue-700 rtl:right-0 ltr:left-0'
                style={{ width: props.percentage + "%" }}
            />
            <label className="block relative px-5 py-3 text-white drop-shadow-lg text-sm"> {props.label} </label>

        </div>
    );
}

export default ProgressBarWithLabel;


