import AnchorTabItem from './AnchorTabItem';
import { useEffect, useRef, useState } from 'react';

type Props ={
    items: {id:string, title:string}[];
}

const AnchorTabs: React.FC<Props> = props => {

    const [sticky, setSticky] = useState<boolean>(false);

    const theme2 = process.env.THEME === "THEME2";

    const wrapperRef = useRef<HTMLDivElement>(null);

    const wrapperHeight = wrapperRef.current?.offsetHeight;

    const {items} = props;

    const makeSticky = () => {
        const wrapperTop = wrapperRef.current?.getBoundingClientRect().top;
        if (!wrapperTop) return;
        if (wrapperTop > 0) {
            setSticky(false);
        } else {
            setSticky(true);
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

    return (<div ref={wrapperRef} className='relative' style={{ height: wrapperHeight + "px" }}>
        <div className={`transition-all ${sticky ? "fixed z-[1001] left-0 right-0 top-0 bg-white shadow" :""}`}>
            <div className='max-w-container mx-auto px-3 sm:px-5'>
                <div className={`bg-white ${(theme2 && !sticky) ?"border-b border-neutral-300":""}`}>
                    <nav className='flex gap-y-1 overflow-auto whitespace-nowrap'>
                        {items.map(item => <AnchorTabItem key={item.id} title={item.title} target={item.id} />)}
                    </nav>
                </div>
            </div>
        </div>
    </div>)
}

export default AnchorTabs;