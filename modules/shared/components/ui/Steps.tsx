import { Fragment } from 'react';

import { Tik } from './icons';

type Props = {
    className?: string;
    items: { label: string, status: 'active' | 'done' | 'up-comming' }[];
}

const Steps: React.FC<Props> = props => {
    return (
        <div className={`max-sm:hidden flex flex-wrap flex-col md:flex-row gap-2 md:justify-between md:items-center ${props.className}`}>
            {props.items.map((item, index) => (
                <Fragment key={item.label}>

                    {!!index && <div className='border-b-2 border-dotted border-neutral-300 grow max-md:hidden' />}

                    <div className={`flex gap-2 items-center text-sm ${item.status === 'active' ? "font-semibold text-neutral-800" : "text-neutral-400"}`}>
                        {item.status === 'done' ? (
                            <span className='flex items-center justify-center w-6 h-6 rounded-full bg-blue-700/75'> <Tik className='w-4 h-4 fill-white' /> </span>
                        ) : (
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-white leading-4 ${item.status === 'up-comming' ? "bg-neutral-400" : "bg-blue-500"}`}> {index + 1} </span>
                        )}
                        {item.label}

                    </div>
                </Fragment>
            ))}
        </div>
    )
}

export default Steps;