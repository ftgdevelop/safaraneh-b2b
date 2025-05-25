import {SetStateAction, Dispatch} from 'react';
import {FormikErrors, FormikTouched } from "formik";
import { useTranslation } from "next-i18next";

import { CipAvailabilityItemType, CipFormCompanionItemType } from "../../types/cip";
import { Loading, Minus, Plus } from "@/modules/shared/components/ui/icons";
import CipCompanionItem from './CipCompanionItem';

type Props = {
    companions: CipFormCompanionItemType[];
    setCompanions: Dispatch<SetStateAction<CipFormCompanionItemType[]>>;
    passengerServicesArray: CipAvailabilityItemType['passengerTypeServices'];
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{
        companions: {
            firstName: string;
            lastName: string;
            gender: boolean;
            services: any[]
        }[];
    }>>;
    errors: FormikErrors<{
        companions: {
            firstName: string;
            lastName: string;
            gender: boolean;
            services: any[]
        }[];
    }>;
    touched: FormikTouched<{
        companions: {
            firstName: string;
            lastName: string;
            gender: boolean;
            services: any[]
        }[];
    }>;
    values: {
        companions: {
            firstName: string;
            lastName: string;
            gender: boolean;
            services: any[]
        }[];
    };
}

const CipCompanionInformation: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const { companions, setFieldValue, values, touched, errors, setCompanions } = props;

    const increaseCompanions = () => {
        if (companions.length < 10) {
            setCompanions(prevState => {
                setFieldValue(`companions.${prevState.length}.firstName`,"" );
                setFieldValue(`companions.${prevState.length}.lastName`,"" );
                setFieldValue(`companions.${prevState.length}.gender`,true );
                setFieldValue(`companions.${prevState.length}.services`,[] );
                return [
                    ...prevState,
                    {
                        id: Date.now().toString(),
                        gender: true,
                        services: []
                    }
                ]
            });
        }
    }

    const decreaseCompanions = () => {
        if (companions.length > 0) {
            setCompanions(prevState => {
                
                setFieldValue(`companions.${prevState.length -1}`,null );

                const updatedCompanions = [...prevState];
                updatedCompanions.splice(-1);
                return (updatedCompanions);

            });
        }
    }

    const updateCompanions = (id: string, property: any, value: any) => {
        setCompanions((prevState: any) => {
            const updatingCompanion = prevState.find((item: any) => item.id === id);
            const otherCompanion = prevState.filter((item: any) => item.id !== id);
            const updatedCompanion = { ...updatingCompanion, [property]: value };
            return ([...otherCompanion, updatedCompanion]);
        });
    }

    return (
        <div className='py-2 md:py-5'>
            <div className="flex justify-between items-center">
                <strong className="font-semibold text-lg block"> مشایعت کنندگان </strong>
                <div>
                    <button
                        type="button"
                        onClick={decreaseCompanions}
                        className="bg-blue-700 h-9 w-9 inline-flex items-center justify-center rounded outline-none align-middle"
                    >
                        <Minus className="w-6 h-6 fill-white" />
                    </button>
                    <span className="w-32 inline-block text-center align-middle">
                        <b> {companions ? companions.length : <Loading className="w-5 h-5 fill-current animate-spin" />}</b> مشایعت کننده
                    </span>
                    <button
                        type="button"
                        onClick={increaseCompanions}
                        className="bg-blue-700 h-9 w-9 inline-flex items-center justify-center rounded outline-none align-middle"
                    >
                        <Plus className="w-6 h-6 fill-white" />
                    </button>
                </div>
            </div>

            {companions && companions.sort((a, b) => +a.id - +b.id).map((companionItem, companionIndex) => <CipCompanionItem
                passengerServicesArray={props.passengerServicesArray}
                errors={errors}
                touched={touched}
                values={values}
                key={companionItem.id}
                companionItem={companionItem}
                companionIndex={companionIndex}
                setFieldValue={setFieldValue}
                updateCompanion={(property: any, value: any) => { updateCompanions(companionItem.id, property, value) }}
                decreaseCompanion={decreaseCompanions}
                isLastItem ={!!companionIndex && companionIndex === companions.length-1} 
            />)}
        </div>
    )
}

export default CipCompanionInformation;