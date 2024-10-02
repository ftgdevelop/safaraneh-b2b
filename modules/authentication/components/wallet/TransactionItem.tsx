import { Plus } from '@/modules/shared/components/ui/icons';
import { dateDiplayFormat, numberWithCommas } from '@/modules/shared/helpers';
import { useEffect, useState } from 'react';

type Props = {
    data: {
        type: string;
        amount: number;
        creationTime: string;
        initialAmount: number;
        information?: string;
    }
}

const TransactionItem: React.FC<Props> = props => {

    const [open, setOpen] = useState<boolean>(false);

    const { amount, creationTime, initialAmount, type, information } = props.data;

    return (
        <>
            <tr className={`border-t leading-4 border-neutral-200 transition-all ${open?"bg-gray-100":"bg-white hover:bg-gray-100"}`}>
                <td className='p-2 md:p-3'>
                    {!!information && (
                        <button
                            type='button'
                            onClick={() => { setOpen(prevState => !prevState) }}
                            className='border border-neutral-400 mt-1.5 rounded'
                        >
                            <Plus className={`w-4.5 h-4.5 fill-current transition-all ${open ? 'rotate-45' : ""}`} />
                        </button>
                    )}
                </td>
                <td className='p-2 md:p-3 rtl:text-right ltr:text-left' dir="ltr"> {dateDiplayFormat({ date: creationTime, format: 'yyyy/mm/dd h:m', locale: "fa" })} </td>
                <td className='p-2 md:p-3 text-2xs'> {type} </td>
                <td className={`p-2 md:p-3 rtl:text-right ltr:text-left ${amount > 0 ? 'text-green-600' : "text-red-500"}`} dir="ltr" > {numberWithCommas(amount)} </td>
                <td className='p-2 md:p-3 rtl:text-right ltr:text-left font-semibold' dir="ltr"> {numberWithCommas(initialAmount)} </td>

            </tr>
            {!!open && (
                <tr className='bg-gray-100'>
                    <td colSpan={5} className='p-2 md:p-3 pt-0'>
                        <span className='mx-2'> توضیحات: </span> {information}
                    </td>
                </tr>
            )}
        </>
    )
}

export default TransactionItem;