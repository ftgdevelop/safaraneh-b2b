import { useState } from "react";
import { ErrorCircle } from "./icons";
import { CloseIcon } from "yet-another-react-lightbox";

type Props = {
    color: "red" | "green" | "yellow" | "gray" | "blue";
    icon?: React.ReactNode;
    title?: string;
    description: string;
    className?: string;
    cloasable?: boolean;
}

const Alert: React.FC<Props> = props => {

    const [closed,setClosed] = useState<boolean>(false);

    let borderColor: string = "";
    let bgColor: string = "";
    let textColor: string = "";

    switch (props.color) {
        case 'blue':
            borderColor = "border-blue-300";
            bgColor = "bg-blue-100";
            textColor = "text-blue-700";
            break;

        case 'red':
            borderColor = "border-red-300";
            bgColor = "bg-red-100";
            textColor = "text-red-700";
            break;

        case 'green':
            borderColor = "border-green-300";
            bgColor = "bg-green-100";
            textColor = "text-green-700";
            break;

        case 'gray':
            borderColor = "border-slate-300";
            bgColor = "bg-slate-100";
            textColor = "text-slate-700";
            break;

        case 'yellow':
            borderColor = "border-amber-300";
            bgColor = "bg-amber-100";
            textColor = "text-amber-700";
            break;

        default:
            borderColor = "border-slate-300";
            bgColor = "bg-white";
            textColor = "text-slate-700";
    }

    if(closed){
        return null;
    }
    return (
        <div
            className={`${props.className||""} p-5 border rounded-xl flex gap-5 items-center justify-between ${borderColor} ${textColor} ${bgColor}`}
        >
            <div className="flex gap-5 items-center">
                {props.icon || <ErrorCircle className="w-9 h-9 fill-current" />}
                <div>
                    {!!props.title && <h5 className="text-xl font-semibold">
                        {props.title}
                    </h5>}
                    <p className="text-xs">
                        {props.description}
                    </p>
                </div>
            </div>
            {!!props.cloasable && <button
                type="button"
                onClick={()=>{setClosed(true)}}
            >
                <CloseIcon className="w-6 h-6 fill-current" />
            </button>}
        </div>
    )
};

export default Alert;