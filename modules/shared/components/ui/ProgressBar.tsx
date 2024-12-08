type Props = {
    className?: string;
    percentage: number;
    colorClassName?: string;
}

const ProgressBar: React.FC<Props> = props => {

    return (
        <div className={`h-2.5 rounded-lg bg bg-neutral-200 overflow-hidden ${props.className || ""}`} >
            <div
                className={`h-2.5 ${props.colorClassName || "bg-primary-800"}`}
                style={{width: props.percentage + "%"}}
            />

        </div>
    );
}

export default ProgressBar;


