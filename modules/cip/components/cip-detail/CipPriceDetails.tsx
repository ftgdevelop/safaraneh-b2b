import Accordion from "@/modules/shared/components/ui/Accordion"
import { numberWithCommas } from "@/modules/shared/helpers"
import { CipAvailabilityItemType, CipFormCompanionItemType, CipFormPassengerItemType, CipPassengerType, CipValidateResponseType } from "../../types/cip";

type Props = {
    discountResponse?: any;
    passengers: CipFormPassengerItemType[];
    companions: CipFormCompanionItemType[];
    passengerServicesArray: CipAvailabilityItemType['passengerTypeServices'];
    validateResponse?: CipValidateResponseType;
    selectedTransport: { count: number, salePrice: number, name?: string }[];
    selectedServicesArray?: CipValidateResponseType['optionalServices'];
    activeServices: number[];
}

const CipPriceDetails: React.FC<Props> = props => {


    const { discountResponse } = props;

    const getServiceObject = (passengerType: CipPassengerType, serviceId: string) => props.passengerServicesArray?.find(item => item.passengerType === passengerType)?.services?.find(item => item.id === +serviceId);
    const getPersonPrice = (passengerType: CipPassengerType) => props.validateResponse?.rate?.passengers?.find(item => item.passengerType === passengerType);


    //passengers
    const passengersArray = props.passengers.map(item => {

        const servicesObj = item.services?.map(serviceItemId => getServiceObject(item.type, serviceItemId));
        const servicesNames = servicesObj?.map(serviceItem => serviceItem?.name);
        const servicesPrice = servicesObj?.reduce((total, serviceItem) => total + (serviceItem?.salePrice || 0), 0) || 0;
        const typePrice = getPersonPrice(item.type)?.salePrice || 0;
        return ({
            services: servicesNames,
            passengerTotalPrice: typePrice + servicesPrice,
            passengerType: item.type
        });
    })
    const passengersTotalPrice = passengersArray.reduce((total, item) => total + item.passengerTotalPrice, 0);

    //accompanying
    const accompanyingArray = props.companions.map(item => {
        const servicesObj = item.services?.map(serviceItemId => getServiceObject("Accompanying", serviceItemId));
        const servicesNames = servicesObj?.map(serviceItem => serviceItem?.name);
        const servicesPrice = servicesObj?.reduce((total, serviceItem) => total + (serviceItem?.salePrice || 0), 0) || 0;
        const typePrice = getPersonPrice("Accompanying")?.salePrice || 0;
        return ({
            services: servicesNames,
            accompanyingTotalPrice: typePrice + servicesPrice
        });
    })
    const accompanyingsTotalPrice = accompanyingArray.reduce((total, item) => total + item.accompanyingTotalPrice, 0);


    //transports
    const transports = props.selectedTransport?.filter(item => item.count > 0);
    const transportsTotalPrice = transports.reduce((total, item) => total + (item.salePrice * item.count), 0)


    //extra services
    let extraServices = null;
    let extraServicesTotalPrice = 0;
    if (props.selectedServicesArray && props.activeServices) {
        extraServices = props.selectedServicesArray?.filter(item => props.activeServices.includes(item.id)).map(serviceItem => {
            const amount = (serviceItem.salePrice * (serviceItem.type === "Pet" ? serviceItem.count : 1))
                +
                ((serviceItem.type === "Conference" || serviceItem.type === "MeetingRoom") ? ((serviceItem.extraCount || 0) * (serviceItem.extraSalePrice || 0) + (serviceItem.hourCount || 0) * (serviceItem.hourSalePrice || 0)) : 0);

            return ({
                ...serviceItem,
                calculatedPrice: amount
            })
        });
        if (extraServices?.length) {
            extraServicesTotalPrice = extraServices.reduce((total, item) => total + item.calculatedPrice, 0);
        }
    }

    const totalPrice = passengersTotalPrice + accompanyingsTotalPrice + transportsTotalPrice + extraServicesTotalPrice;


    return (
        <div className='py-2 md:py-5'>
            <strong className="block font-semibold text-lg mb-5"> محاسبه هزینه </strong>

            <div className='bg-white inserted-content rounded-lg border border-neutral-300 p-3 sm:p-5 md:p-7 text-base leading-8 pb-2 sm:pb-5'>

                <Accordion
                    type={2}
                    updateContent={passengersArray.length.toString()}
                    initiallyOpen
                    WrapperClassName="mb-4"
                    title={(
                        <div className="flex justify-between font-semibold text-sm">
                            <span className="text-blue-800">مسافر  ({passengersArray.length} نفر)</span>
                            <b>{numberWithCommas(passengersTotalPrice)} ریال</b>
                        </div>
                    )}
                    content={(
                        <>
                            {passengersArray.map((passengerItem, index) => {
                                return (
                                    <div key={index} className="flex justify-between text-xs md:py-1 max-sm:leading-5">
                                        <div>
                                            مسافر {index + 1}
                                            {passengerItem.services.length > 0 && (
                                                <span className='rtl:mt-2 ltr:ml-2'> ({passengerItem.services.join(" , ")}) </span>
                                            )}

                                            {passengerItem.passengerType === "Child" && <span className="rtl:mt-2 ltr:ml-2"> (کودک زیر 2 سال) </span>}
                                        </div>

                                        <div>{numberWithCommas(passengerItem.passengerTotalPrice)} ریال</div>
                                    </div>
                                )
                            })}
                        </>
                    )}
                />

                {!!accompanyingArray.length && (
                    <Accordion
                        updateContent={accompanyingArray.length.toString()}
                        initiallyOpen
                        type={2}
                        WrapperClassName="mb-4"
                        title={(
                            <div className="flex justify-between font-semibold text-sm ">
                                <span className="text-blue-800">مشایعت کننده ({accompanyingArray.length} نفر)</span>
                                <b>{numberWithCommas(accompanyingsTotalPrice)} ریال</b>
                            </div>
                        )}
                        content={(
                            <>
                                {accompanyingArray.map((accompanyingItem, index) => {
                                    return (
                                        <div key={index} className="flex justify-between text-xs md:py-1 max-sm:leading-5">
                                            <div>
                                                مشایعت کننده {index + 1}

                                                {accompanyingItem.services.length > 0 && <span className='margin-start-10'> (
                                                    {accompanyingItem.services.join(" , ")}
                                                    )</span>}
                                            </div>
                                            <div>{numberWithCommas(accompanyingItem.accompanyingTotalPrice)} ریال</div>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    />
                )}

                {!!transports?.length && (
                    <Accordion
                        updateContent={transports.length.toString()}
                        initiallyOpen
                        type = {2}
                        WrapperClassName="mb-4"
                        title={(
                            <div className="flex justify-between font-semibold text-sm">
                                <span className="text-blue-800">تاکسی ویژه cip</span>
                                <b>{numberWithCommas(transportsTotalPrice)} ریال</b>
                            </div>
                        )}
                        content={(
                            <>
                                {transports.map((item, index) => <div key={index} className="flex justify-between text-xs md:py-1 max-sm:leading-5" >
                                    <div>{item.name} ({item.count})</div>
                                    <div>(x{item.count}) {numberWithCommas(item.salePrice)} ریال</div>
                                </div>)}
                            </>
                        )}
                    />
                )}

                {!!extraServices?.length && (
                    <Accordion
                        updateContent={extraServices.length.toString()}
                        initiallyOpen
                        type={2}
                        WrapperClassName="mb-4"
                        title={(
                            <div className="flex justify-between font-semibold text-sm">
                                <span className="text-blue-800">خدمات اضافه </span>
                                <b>{numberWithCommas(extraServicesTotalPrice)} ریال</b>
                            </div>
                        )}

                        content={(
                            <>
                                {extraServices.map((serviceItem, index) => <div key={index} className="flex justify-between text-xs md:py-1 max-sm:leading-5" >
                                    <div>
                                        {serviceItem.name}
                                        {!!serviceItem.extraCount && " (میان وعده برای " + serviceItem.extraCount + " نفر)"}
                                        {!!serviceItem.hourCount && " (" + serviceItem.hourCount + " ساعت اضافه)"}
                                        {serviceItem.count > 0 && " (" + serviceItem.count + ") "}
                                    </div>
                                    <div>
                                        {numberWithCommas(serviceItem.calculatedPrice)} ریال
                                    </div>
                                </div>)}
                            </>
                        )}
                    />
                )}


                {discountResponse ? <div>
                    <span>تخفیف</span>
                    <small>
                        {numberWithCommas(discountResponse.discountPrice)} ریال
                    </small>
                </div> : null}

                {discountResponse ?
                    <div>
                        <span>مبلغ نهایی</span>
                        <b>
                            {numberWithCommas(discountResponse.orderSubTotalDiscount)} ریال
                        </b>
                    </div>
                    :
                    <div className="font-semibold flex justify-between border-t border-neutral-400 pt-3">
                        <span>مبلغ نهایی</span>
                        <b>
                            {numberWithCommas(totalPrice)} ریال
                        </b>
                    </div>}


            </div>

        </div>)
}

export default CipPriceDetails;