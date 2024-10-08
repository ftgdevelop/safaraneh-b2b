import { ManualReceiptItem as ManualReceiptItemType  } from '@/modules/payment/types';
import { TrendingDown, TrendingUp } from '@/modules/shared/components/ui/icons';
import {numberWithCommas, toPersianDigits } from '@/modules/shared/helpers';

type Props = {
    data: ManualReceiptItemType;
    index: number;
}

const ManualReceiptItem: React.FC<Props> = props => {

    const { data, index} = props;

    const tableCellClass = "p-4 leading-5 text-right font-normal border-neutral-200 transition-all"

    let typelabel = "برداشت" ;
    let textColor = "text-red-500";
    let typeIcon = <TrendingDown className="w-5 h-5 fill-current" />
    if(data.amount > 0){
        textColor= "text-blue-500";
        typelabel = "واریز" ;
        typeIcon = <TrendingUp className="w-5 h-5 fill-current" />
    }

    return (

        <tr className="group text-xs" >
            <td className={`${tableCellClass} text-muted-foreground border-t group-hover:bg-blue-50/50`}> {index ? toPersianDigits(index.toString()) :""} </td>
            <td className={`${tableCellClass} border-t group-hover:bg-blue-50/50 text-md`}> {data.reserveId ? toPersianDigits(data.reserveId.toString()) : "--" } </td>
            <td className={`${tableCellClass} border-t group-hover:bg-blue-50/50 ${textColor}`}> <span className='bg-slate-100 rounded-full inline-flex leading-5 text-2xs items-center gap-2 py-1 px-2'> {typeIcon} {typelabel} </span> </td>
            <td className={`${tableCellClass} border-t group-hover:bg-blue-50/50`} > 
                <span  className={`${textColor} ml-2 text-ms tracking-wider`} dir="ltr">
                    {numberWithCommas(data.amount)} </span>
                ریال
            </td>
            <td className={`${tableCellClass} border-t group-hover:bg-blue-50/50 tracking-wider`}>  {toPersianDigits(data.creationTime)?.split(".")[0]?.replaceAll("T"," ")?.replaceAll("-","/")} </td>
            <td className={`${tableCellClass} border-t group-hover:bg-blue-50/50 text-2xs`}> {data.operatorDescription} </td>
        </tr>

    )
}

export default ManualReceiptItem;