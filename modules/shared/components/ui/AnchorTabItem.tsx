import { useRef, useEffect, useState } from "react";

type Props = {
    target: string;
    title: string;
}

const AnchorTabItem: React.FC<Props> = props => {

    const anchorRef = useRef<HTMLButtonElement>(null);

    const [active, setActive] = useState<boolean>(false);

    const makeSticky = () => {

        const target = document.getElementById(props.target);

        if (!target) return;

        const targetTop = target.getBoundingClientRect().top;

        if (targetTop < 62) {

            const targetHeight = target.offsetHeight;

            if (Math.abs(targetTop) < (targetHeight - 62)) {
                setActive(true);
            } else {
                setActive(false);
            }

        } else {
            setActive(false);
        }
    }

    useEffect(() => {
        document.addEventListener('scroll', makeSticky);
        window.addEventListener("resize", makeSticky);

        return (() => {
            document.removeEventListener('scroll', makeSticky);
            window.removeEventListener("resize", makeSticky);
        });
    }, []);


    const scrollToTarget = (e: any) => {

        e.preventDefault();

        const target = document.getElementById(props.target);

        if (target) {
            let offset = 85;
            if (window?.innerWidth < 768){
                offset = 75;
            }
            const targetOffsetTop = target.offsetTop + offset;

            window.scrollTo({
                top: targetOffsetTop,
                behavior: "smooth"
           });

        }

    }

    return (
        <button
            ref={anchorRef}
            onClick={scrollToTarget}
            className={`font-semibold leading-5 py-4 px-1.5 md:px-2 lg:px-4 text-2xs sm:text-sm block border-b-2 ${active ? "text-blue-500 border-blue-500" : "border-transparent"}`}
        > {props.title} </button>
    )
}

export default AnchorTabItem;