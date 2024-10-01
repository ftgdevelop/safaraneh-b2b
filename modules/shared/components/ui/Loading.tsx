type Props = {
    className?:string;
    size?: "small" | "large" | "medium";
    bgGray?:boolean;
}

const Loading : React.FC<Props> = props => {

    let sizeClassNames: string;

    switch (props.size){
        case "small":
            sizeClassNames = "w-6 h-6 after:top-0.5 after:bottom-0.5 after:right-0.5 after:left-0.5";
            break;
        case "large":
            sizeClassNames = "w-20 h-20 after:top-2 after:bottom-2 after:right-2 after:left-2";
            break;
        default:
            sizeClassNames  = "w-10 h-10 after:top-1 after:bottom-1 after:right-1 after:left-1";
    }

    return(
        <span 
            className={`relative ${sizeClassNames} animate-spin inline-block ${props.className}  before:block before:rounded-full before:w-full before:h-full before:absolute before:gradient-circle-loading 
            after:block after:rounded-full after:absolute ${props.bgGray? "after:bg-body-background" : "after:bg-white"} 
            `} 
        />
    )
}

export default Loading;