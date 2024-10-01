import { useEffect, useRef, useState } from "react";

type Props = {
    content: React.ReactNode;
    title: React.ReactNode;
    WrapperClassName?: string;
    type2?:boolean;
    initiallyOpen?:boolean;
    updateContent?:string;
    noBgContent?: boolean;
    noBorder?: boolean;
}

const Accordion: React.FC<Props> = props => {

    const contentRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState<boolean>(props.initiallyOpen || false);

    const {content, title, WrapperClassName, type2, noBgContent, noBorder} = props;

    const toggle = () => { setOpen(prevState => !prevState) }

    useEffect(() => {
        if (open) {
            contentRef.current!.style.maxHeight = contentRef.current!.scrollHeight + "px";
        } else {
            contentRef.current!.style.maxHeight = "0";
        }
    }, [open, props.updateContent]);

    return (
        <div className={`${(type2 || noBorder) ? "":"border border-neutral-200 rounded-lg"} text-sm sm:text-base text-neutral-700 ${WrapperClassName || ""}`}>
            {type2 ? (
                <div onClick={toggle} className={`py-1 relative select-none cursor-pointer after:block after:w-2 after:h-2 after:border-b-2 after:border-l-2 after:top-1/2 after:-mt-1 after:border-neutral-400 after:self-center after:transition-all after:absolute after:rtl:right-0 after:ltr:left-0 rtl:pr-4 ltr:pl-4 ${open?"after:rotate-135":"after:-rotate-45"}`}>
                {title}
                </div>
            ):(
            <div onClick={toggle} className={`leading-4 relative select-none cursor-pointer p-3 sm:p-4 after:block after:w-2 after:h-2 after:border-b-2 after:border-l-2 after:top-1/2 after:-mt-1 after:border-neutral-400 after:self-center after:transition-all after:absolute after:rtl:left-5 after:ltr:right-5 rtl:pl-12 ltr:pr-12 ${open?"after:rotate-135":"after:-rotate-45"}`}>
                {title}
            </div>
            )}
            <div
                ref={contentRef}
                className="overflow-hidden transition-all duration-300"
            >
                <div className={`${type2?"rtl:pr-5 ltr:pl-5 ": noBgContent ? "px-5" : "bg-neutral-100 p-3 m-3 sm:p-5 sm:m-5 mt-0 sm:mt-0 text-justify"}`}>
                    {content}
                </div>
            </div>
        </div>
    )
}

export default Accordion;