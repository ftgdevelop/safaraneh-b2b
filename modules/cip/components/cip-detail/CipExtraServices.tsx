import { useTranslation } from "next-i18next";
import Image from "next/image";

import { CipValidateResponseType } from "../../types/cip";
import { numberWithCommas } from '@/modules/shared/helpers';
import Button from '@/modules/shared/components/ui/Button';
import { Minus, Plus, Tik } from "@/modules/shared/components/ui/icons";

type Props = {
    selectedServicesArray: CipValidateResponseType['optionalServices'];
    updateSelectedServices: (id: number, property: string, change: "inc" | "dec") => void;
    activeServices: number[];
    updateActiveService: (id: number) => void;
}

const CipExtraServices: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const theme2 = process.env.THEME === "THEME2";

    const { selectedServicesArray, updateSelectedServices, activeServices, updateActiveService } = props;

    return (
        <div id="extra_services_section" className="py-2 sm:py-5">
            <div className={`${theme2?"py-5":"bg-white rounded-lg border border-neutral-300 p-5"}`}>
                <strong className="font-semibold text-lg block "> انتخاب سرویس های مازاد </strong>


                {selectedServicesArray.sort((a, b) => b.id - a.id).map(serviceItem => (
                    <div key={serviceItem.id} className="rounded-lg border border-neutral-300 p-4 mt-4 flex flex-wrap justify-between" >
                        <div>
                            {serviceItem.picture.path && (
                                <Image
                                    src={serviceItem.picture.path}
                                    alt={serviceItem.picture.altAttribute || ""}
                                    title={serviceItem.picture.titleAttribute}
                                    className="w-16 h-16 mb-1 object-contain"
                                    width={64}
                                    height={64}
                                />
                            )}

                            <h5 className='text-sm font-semibold'>{serviceItem.name}</h5>
                            <p className="text-sm">{serviceItem.description}  {serviceItem.type === "Pet" ? ` (${numberWithCommas(serviceItem.salePrice)} ریال)` : null } </p>

                            {(serviceItem.type === "Conference" || serviceItem.type === "MeetingRoom") && (
                                <>
                                    <div className="flex items-center mt-1" >
                                        <label className="text-xs rtl:ml-4 ltr:mr-4" > تعداد میان وعده </label>
                                        <button
                                            type="button"
                                            onClick={() => updateSelectedServices(serviceItem.id, 'extraCount', "inc")}
                                            disabled={(activeServices.includes(serviceItem.id))}
                                            className='bg-blue-800 hover:bg-blue-700 rounded disabled:bg-neutral-400'
                                        >
                                            <Plus className="w-6 h-6 fill-white" />
                                        </button>
                                        <input
                                            type="text"
                                            readOnly
                                            className="w-8 text-center"
                                            value={serviceItem.extraCount || 0}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateSelectedServices(serviceItem.id, 'extraCount', "dec")}
                                            disabled={(activeServices.includes(serviceItem.id))}
                                            className='bg-blue-800 hover:bg-blue-700 rounded disabled:bg-neutral-400'
                                        >
                                            <Minus className="w-6 h-6 fill-white" />
                                        </button>

                                    </div>

                                    <div className="flex items-center mt-1" >
                                        <label className="text-xs rtl:ml-4 ltr:mr-4" > تعداد ساعت اضافه </label>
                                        <button
                                            type="button"
                                            onClick={() => updateSelectedServices(serviceItem.id, 'hourCount', "inc")}
                                            disabled={(activeServices.includes(serviceItem.id))}
                                            className='bg-blue-800 hover:bg-blue-700 rounded disabled:bg-neutral-400'
                                        >
                                            <Plus className="w-6 h-6 fill-white" />
                                        </button>
                                        <input
                                            type="text"
                                            readOnly
                                            className="w-8 text-center"
                                            value={serviceItem.hourCount || 0}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateSelectedServices(serviceItem.id, 'hourCount', "dec")}
                                            disabled={(activeServices.includes(serviceItem.id))}
                                            className='bg-blue-800 hover:bg-blue-700 rounded disabled:bg-neutral-400'
                                        >
                                            <Minus className="w-6 h-6 fill-white" />
                                        </button>

                                    </div>

                                </>
                            )}

                            {serviceItem.type === "Pet" && <div className="flex items-center mt-1" >
                                <button
                                    type="button"
                                    onClick={() => updateSelectedServices(serviceItem.id, "count", "inc")}
                                    disabled={(activeServices.includes(serviceItem.id))}
                                    className='bg-blue-800 hover:bg-blue-700 rounded disabled:bg-neutral-400'
                                >
                                    <Plus className="w-6 h-6 fill-white" />
                                </button>
                                <input
                                    type="text"
                                    readOnly
                                    value={serviceItem.count || 0}
                                    className="w-8 text-center"
                                />
                                <button
                                    type="button"
                                    onClick={() => updateSelectedServices(serviceItem.id, "count", "dec")}
                                    disabled={(activeServices.includes(serviceItem.id))}
                                    className='bg-blue-800 hover:bg-blue-700 rounded disabled:bg-neutral-400'
                                >
                                    <Minus className="w-6 h-6 fill-white" />
                                </button>

                            </div>}
                        </div>

                        <div className="flex flex-col justify-end items-end gap-1" >

                            <b>
                                {numberWithCommas(
                                    (serviceItem.salePrice * (serviceItem.type === "Pet" ? serviceItem.count : 1))
                                    +
                                    ((serviceItem.type === "Conference" || serviceItem.type === "MeetingRoom") ? ((serviceItem.extraCount || 0) * (serviceItem.extraSalePrice || 0) + (serviceItem.hourCount || 0) * (serviceItem.hourSalePrice || 0)) : 0)
                                )} ریال
                            </b>

                            <Button
                                type='button'
                                className="w-32 px-1 py-1 text-xs outline-none text-center"
                                onClick={() => updateActiveService(serviceItem.id)}
                                disabled={activeServices.includes(serviceItem.id)}
                            >
                                {(activeServices.includes(serviceItem.id)) ?
                                    <>
                                        <Tik className="w-5 h-5 fill-current" />انتخاب شد
                                    </>
                                    : "انتخاب کن"
                                }
                            </Button>

                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default CipExtraServices;