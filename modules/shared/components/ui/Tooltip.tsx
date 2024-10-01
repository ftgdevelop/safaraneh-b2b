import {PropsWithChildren} from 'react';

type Props = {
    title: React.ReactNode;
    position?: "start" | "center" | "end";
    className?: string;
}


const Tooltip:React.FC<PropsWithChildren<Props>> = props => {
    
    let wraperClass = "absolute ease-in-out bottom-full translate-y-1 pb-2 opacity-0 invisible delay-300 group-hover:delay-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all"
    let innerWrapperClass = "relative bg-black/75 text-white text-sm p-2 rounded-md w-auto before:pointer-events-none before:absolute before:border-8 before:border-transparent before:border-t-black/75 before:top-full"
    if(!props.position || props.position === "start"){
        wraperClass += " rtl:-right-1 ltr:-left-1";
        innerWrapperClass += " rtl:before:right-3 ltr:before:left-3";
    } else if (props.position === 'end'){
        wraperClass += " ltr:-right-1 rtl:-left-1";
        innerWrapperClass += " ltr:before:right-3 rtl:before:left-3";
    } else {
        wraperClass += " left-1/2 -translate-x-1/2";
        innerWrapperClass += " before:left-1/2 before:-ml-1.5";
    }

    return(
        <span className={`relative inline-block group ${props.className}`}>
            
            {props.children}

            <div className={wraperClass} >
                <div className={innerWrapperClass}>
                    {props.title}
                </div>
            </div>

        </span>
    )
}

export default Tooltip;