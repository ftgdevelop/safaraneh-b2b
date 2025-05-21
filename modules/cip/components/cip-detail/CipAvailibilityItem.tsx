import Button from "@/modules/shared/components/ui/Button";
import { CipAvailabilityItemType } from "../../types/cip";
import { numberWithCommas } from "@/modules/shared/helpers";
import { DownCaret, TikCircle } from "@/modules/shared/components/ui/icons";
import { useState } from "react";
import Image from "next/image";

type Props = {
    item:CipAvailabilityItemType;
    setSelectedAvailability:(availibility : CipAvailabilityItemType ) => void;
    selectedAvailibilityId?:CipAvailabilityItemType['id'];
}

const CipAvailibilityItem : React.FC<Props> = props => {
    const {item, selectedAvailibilityId} = props;

    const [detail, setdetail] = useState<"remarks"|"transport"|"extraServices"|"price"|"">()

    if (selectedAvailibilityId && selectedAvailibilityId !== item.id){
        return null;
    }    

    const detalButtons : {title:string, value:"remarks"|"transport"|"extraServices"|"price"} [] = [];
    if (item.remark){
        detalButtons.push({title:"توضیحات",value:"remarks"});
    }
    if(item.transport && item.transport.length > 0){
        detalButtons.push({title:"تاکسی ویژه CIP",value:"transport"}); 
    }
    if (item.services && item.services.length > 0){
        detalButtons.push({title:"سرویس های مازاد",value:"extraServices"});
    }
    if (item.passengers && item.passengers.length > 0){
        detalButtons.push({title:"جزییات قیمت",value:"price"});
    }

    const passengerTypeString = (type:"Adult" | "Child" | "Infant" | "Accompanying") => {
        switch (type){
            case "Adult":
                return "بزرگسال";
            case "Child":
                return "کودک";
            case "Infant":
                return "نوزاد";
            case "Accompanying":
                return "همراه";
            default:
                return type;              
        }
    } 


    let detailElement = null;

    switch (detail){
        case "remarks":
            detailElement = <p className="text-sm bg-neutral-100 p-3 rounded"> {item.remark} </p>;
            break;
        case "transport":
            detailElement = <div className='bg-neutral-100 rounded p-2 md:px-5 text-sm'>
                <table className="w-full text-center">
                    <thead>
                        <tr>
                            <th className="p-1 md:p-2 w-20">ردیف</th>
                            <th className="p-1 md:p-2">عنوان</th>
                            <th className="p-1 md:p-2">تصویر</th>
                            <th className="p-1 md:p-2">توضیحات</th>
                            <th className="p-1 md:p-2">قیمت</th>
                        </tr>
                    </thead>
                    <tbody>
                        {item.transport.map((transportItem,transportIndex) => <tr key={transportItem.name} className="border-t border-neutral-300">
                            <td className="p-1 md:p-2"> {transportIndex+1} </td>
                            <td className="p-1 md:p-2"> {transportItem.name} </td>
                            <td className="p-1 md:p-2"> 
                                <Image 
                                    src={transportItem.picture.path || ""}
                                    alt={transportItem.picture.altAttribute || ""}
                                    title={transportItem.picture.titleAttribute} 
                                    className="w-full border border-neutral-300" 
                                /> 
                            </td>
                            <td className="p-1 md:p-2"> {transportItem.description || "--" } </td>
                            <td className="p-1 md:p-2"> {numberWithCommas(transportItem.salePrice)} ریال </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>;
            break;
        case "extraServices":
            detailElement = <div className='bg-neutral-100 rounded p-2 md:px-5 text-sm overflow-auto'>
                <div className="whitespace-nowrap">
                    <table className="w-full text-center">
                        <thead>
                            <tr>
                                <th className="p-1 md:p-2 w-20">ردیف</th>
                                <th className="p-1 md:p-2">عنوان</th>
                                <th className="p-1 md:p-2">توضیحات</th>
                                <th className="p-1 md:p-2">قیمت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.services.map((serviceItem,serviceIndex) => <tr key={serviceItem.name} className="border-t border-neutral-300">
                                <td className="p-1 md:p-2">{serviceIndex+1}</td>
                                <td className="p-1 md:p-2">{serviceItem.name}</td>
                                <td className="p-1 md:p-2">{serviceItem.description || "--" }</td>
                                <td className="p-1 md:p-2">{numberWithCommas(serviceItem.salePrice)} ریال</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>;
            break;
        case "price":
            detailElement = <div className='bg-neutral-100 rounded p-2 md:px-5 text-sm'>
                <table className="w-full text-center">
                    <thead>
                        <tr>
                            <th className="p-1 md:p-2 w-20">ردیف</th>
                            <th className="p-1 md:p-2">نوع مسافر</th>
                            <th className="p-1 md:p-2">قیمت</th>
                        </tr>
                    </thead>
                    <tbody>
                        {item.passengers.map((passengersItem,passengersIndex) => <tr key={passengersIndex} className="border-t border-neutral-300">
                            <td className="p-1 md:p-2">{passengersIndex+1}</td>
                            <td className="p-1 md:p-2">{passengerTypeString(passengersItem.passengerType)}</td>
                            <td className="p-1 md:p-2">{numberWithCommas(passengersItem.salePrice)} ریال</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>;
            break;            
        default:
            detailElement = null;

    }

    return(
        <div className='bg-white rounded-lg border border-neutral-300 p-3 md:p-5 mt-4'>
            <strong className="font-semibold text-md md:text-xl">
                {!!props.selectedAvailibilityId && "خدمات انتخاب شده: "} {item.name}
            </strong>
            <div className="grid gap-3 mt-4 grid-cols-1 md:grid-cols-2">
                <div className="md:order-1">

                    {detalButtons.map(item => (
                        <button 
                        key={item.title}
                        type='button' 
                        className={`text-sm rtl:ml-3 ltr:mr-3 outline-none ${detail === item.value?"text-blue-600":"text-neutral-400"}`} 
                        onClick={()=>{setdetail(prevValue => prevValue === item.value ? "" : item.value)}}
                    >
                        {item.title}
                        <DownCaret className={`w-6 h-6 fill-current inline-block ${detail === item.value ? "rotate-180" : ""}`} />
                    </button>
                    ))}

                </div>
                <div className="md:order-3 md:col-span-2">
                    {detailElement}
                </div>
                <div className="text-left flex flex-wrap justify-end gap-3 md:order-2">
                    
                    {props.selectedAvailibilityId ? (
                        <TikCircle className="w-11 h-11 fill-green-500" /> 
                    ):(
                        <>
                            {item.boardPrice && item.salePrice && item.boardPrice > item.salePrice && <span className='rtl:ml-2 ltr:mr-2 text-neutral-400 text-sm line-through'>{numberWithCommas(item.boardPrice)} ریال</span>}
                            <b className='rtl:ml-2 ltr:mr-2 text-sm'>{numberWithCommas(item.salePrice)} ریال</b>
                            <Button 
                                type="button"
                                className="h-10 px-5"
                                onClick={()=>{props.setSelectedAvailability(item)}}
                            >
                                رزرو آنلاین
                            </Button>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}

export default CipAvailibilityItem;