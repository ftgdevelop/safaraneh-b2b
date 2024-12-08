
import { TabItem } from '@/modules/shared/types/common';
import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/router';

type Props = {
    items: TabItem[];
    noBorder?:boolean;
    noGrowTabs?:boolean;
    wrapperClassName?: string;
    style?: "2";
}

const Tab: React.FC<Props> = props => {

    const { items } = props;

    const router = useRouter();

    const [activetabKey, setActiveTabKey] = useState(items[0]?.key);

    const style2 = props.style && props.style === '2'; 

    let tabClassName = (active: boolean) => {
        if(style2){
            return `outline-none select-none text-2xs sm:text-xs px-2 sm:px-5 ${props.noGrowTabs? "" : " grow"} rounded-xl py-1.5 sm:py-2 transition-all border ${active ? "text-neutral-900 border-teal-500 text-teal-500" : "text-slate-500"}`;
        }
        return `outline-none select-none text-2xs sm:text-xs px-2 sm:px-5 ${props.noGrowTabs? "" : " grow"} rounded-xl py-1.5 sm:py-2 transition-all ${active ? "text-neutral-900 bg-white shadow-normal" : "text-slate-500"}`;
    }

    return (
        <>
            <div className={props.wrapperClassName || ""}>
                <div className={`rounded-xl flex mb-2 ${style2?"gap-6":"p-1 bg-slate-100"}`}>
                    {items.map(item => <button
                        type="button"
                        key={item.key}
                        onClick={() => {
                            if (item.href) {
                                router.push(item.href);
                            } else {
                                setActiveTabKey(item.key);
                            }
                        }}
                        className={tabClassName(activetabKey === item.key)}
                    >

                        {item.label}

                    </button>)}
                </div>
                <div className={props.noBorder?"":'border border-slate-200 rounded-xl'}>
                    {items.map(item => <Fragment key={item.key}>
                            {activetabKey === item.key ? item.children : null}
                        </Fragment>
                    )}
                </div>


            </div>
        </>
    )
}

export default Tab;