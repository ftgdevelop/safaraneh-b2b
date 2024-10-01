type Props = {
    wrapperClassName?: string;
    reviewCount: number;
    rating: number;
    large?:boolean;
    style?:"almosafer"
}

const GuestRating : React.FC<Props> = props => {

    let tag = "معمولی";

    if (props.rating > 70) {
        tag = "خوب";
    }
    if (props.rating > 80) {
        tag = "خیلی خوب";
    }
    if (props.rating > 90) {
        tag = "عالی";
    }

    const almosaferStyle = props.style==="almosafer";
    const caretCss = `relative -top-1 after:absolute after:top-full after:block after:border-5 after:rtl:right-2 after:ltr:left-2 after:border-l-transparent after:border-b-transparent ${props.rating > 70 ? "after:border-green-700" : "after:border-natural-300"}`

    return(
        <div
            className={`${props.wrapperClassName || ""} flex items-center gap-2 ${ almosaferStyle? "flex-row-reverse" : "" }`}
        >
            <span className={`${almosaferStyle? caretCss : ""} block flex items-center justify-center w-10 h-8 rounded text-md font-bold ${props.rating > 70 ? "bg-green-700 text-white" : "bg-neutral-300"}`}>
                {props.rating}
            </span>
            <div className={`leading-5 ${props.large?"text-sm":"text-2xs"} ${almosaferStyle?"rtl:text-left ltr:text-right":""}`}>
                <div className={`${props.large?"text-xl":"text-sm"} font-semibold`}> {tag} </div>
                ({props.reviewCount} نظر)
            </div>

        </div>
    )
}

export default GuestRating;