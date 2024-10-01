import { useTranslation } from 'next-i18next';
import parse from 'html-react-parser';

import { DomesticAccomodationType } from "@/modules/domesticHotel/types/hotel";

import { Fragment } from 'react';
import { Bed3, Cancellation, Login, Logout, Pets, ReportIcon, Smoke } from '@/modules/shared/components/ui/icons';


type Props = {
    policies?: DomesticAccomodationType['policies'];
    mendatoryFee?: string;
}

const AccomodationPolicy: React.FC<Props> = props => {

    const { policies, mendatoryFee } = props;

    const { t } = useTranslation('common');


    if (!policies?.length) {
        return null;
    }

    const checkinTime = policies.find(policy => policy.keyword === 'check-in')?.value;
    const checkoutTime = policies.find(policy => policy.keyword === 'check-out')?.value;

    return (
        <div id="terms_section" className="max-w-container mx-auto px-3 sm:px-5 pt-7 md:pt-10 text-neutral-800">
            <h3 className='text-lg lg:text-3xl font-semibold mb-3 md:mb-7'> {t("terms")} </h3>

            <div className='p-3 sm:p-5 lg:p-7 bg-white rounded-xl text-sm'>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 sm:gap-y-6 mb-4 sm:mb-6'>
                    <div className='text-sm md:text-md font-semibold'>
                        <Login className='inline-block w-6 h-6 fill-neutral-500 rtl:ml-2 ltr:mr-2' />
                        ورود
                    </div>
                    <div className='sm:col-span-2 md:col-span-3 lg:col-span-4 max-sm:text-left' > {checkinTime} </div>

                    <hr className='hidden sm:block sm:col-span-3 md:col-span-4 lg:col-span-5 border-neutral-300' />

                    <div className='text-sm md:text-md font-semibold'>
                        <Logout className='inline-block w-6 h-6 fill-neutral-500 rtl:ml-2 ltr:mr-2 text-red-600 text-xs' />
                        خروج
                    </div>
                    <div className='sm:col-span-2 md:col-span-3 lg:col-span-4 max-sm:text-left' > {checkoutTime} </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 sm:gap-y-6'>

                    {policies.filter(policy => (policy.keyword && !['check-in', 'check-out'].includes(policy.keyword))).map(policy => <Fragment key={policy.keyword}>

                        <hr className='sm:col-span-3 md:col-span-4 lg:col-span-5 border-neutral-300' />

                        <div className='text-sm md:text-md font-semibold'>

                            {!!(policy.keyword === 'pets') && <Pets className='inline-block w-6 h-6 fill-neutral-500 rtl:ml-2 ltr:mr-2' />}
                            {!!(policy.keyword === 'smoking') && <Smoke className='inline-block w-6 h-6 fill-neutral-500 rtl:ml-2 ltr:mr-2' />}
                            {!!(policy.keyword === 'cancellation') && <Cancellation className='inline-block w-6 h-6 fill-neutral-500 rtl:ml-2 ltr:mr-2' />}
                            {!!(policy.keyword === 'damage-policy') && <ReportIcon className='inline-block w-6 h-6 fill-neutral-500 rtl:ml-2 ltr:mr-2' />}
                            {!!(policy.keyword === 'children-and-bed') && <Bed3 className='inline-block w-6 h-6 fill-neutral-500 rtl:ml-2 ltr:mr-2' />}

                            {policy.name}

                        </div>

                        {policy.value ? (
                            <div className='sm:col-span-2 md:col-span-3 lg:col-span-4 text-sm'>
                                {policy.value}
                            </div>
                        ) : (
                            <div className='sm:col-span-2 md:col-span-3 lg:col-span-4'>

                                {policy.description ? parse(policy.description) : ""}

                                <div className="overflow-auto mt-5">
                                    <table className="bordered-table sharp border-red-500 w-full text-sm">
                                        <thead>
                                            <tr>
                                                <th className="text-center p-1 md:p-2 bg-gray-100" > عنوان </th>
                                                <th className="text-center p-1 md:p-2 bg-gray-100" > قیمت</th>
                                                <th className="text-center p-1 md:p-2 bg-gray-100" > توضیحات </th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {policy.passengers.map((passenger, passengerIndex) => (
                                                <tr key={passengerIndex}>
                                                    <td className='p-3 whitespace-nowrap text-center font-semibold'>
                                                        {passenger.name}
                                                    </td>
                                                    <td className={`p-3 font-bold whitespace-nowrap text-center ${passenger.value === "مجانی" ? "text-green-600" : ""}`}>
                                                        {passenger.value}
                                                    </td>
                                                    <td className='p-3'>
                                                        {passenger.description}
                                                    </td>
                                                </tr>
                                            ))}
                                            {policy.guests.map((guest, guestIndex ) => (
                                                <tr key={guestIndex}>
                                                    <td className='p-3 whitespace-nowrap text-center font-semibold'>
                                                        {guest.name}
                                                    </td>
                                                    <td className='p-3 text-center'>
                                                        {guest.value}
                                                    </td>
                                                    <td className='p-3 min-w-400'>
                                                        {guest.description}
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </Fragment>)}

                    {!!mendatoryFee && (<Fragment>

                        <hr className='sm:col-span-3 md:col-span-4 lg:col-span-5 border-neutral-300' />

                        <div className='text-sm md:text-md font-semibold'>
                            <ReportIcon className='inline-block w-6 h-6 fill-neutral-500 rtl:ml-2 ltr:mr-2' />
                            قوانین کلی هتل
                        </div>

                        <div className='sm:col-span-2 md:col-span-3 lg:col-span-4 inserted-content'>
                            {parse(mendatoryFee)}
                        </div>

                    </Fragment>)}

                </div>
            </div>



        </div>
    )
}

export default AccomodationPolicy;