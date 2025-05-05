import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { TakeOff, Airpalne2, Close, ArrowRight } from "@/modules/shared/components/ui/icons";
import { dateDiplayFormat, numberWithCommas } from "@/modules/shared/helpers";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FlightGetValidateDataType } from "../../types/flights";
import ModalPortal from "@/modules/shared/components/ui/ModalPortal";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { setBodyScrollable } from "@/modules/shared/store/stylesSlice";


type Props = {
    className?: string;
    passengers: {
        type: "CHD" | "ADT" | "INF";
        label: string;
        count: number;
        departurePrice: number;
        returnPrice?: number;
    }[];
    loading: boolean;
    departureFlight?: FlightGetValidateDataType['departureFlight'];
    returnFlight?: FlightGetValidateDataType['returnFlight'];
    onWhiteBackground?: boolean;
}
const Aside: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const dispatch = useAppDispatch();

    const { departureFlight, returnFlight } = props;


    const [open, setOpen] = useState<boolean>(false);
    const [delayedOpen, setDelayedOpen] = useState<boolean>(false);

    useEffect(() => {

        if (open) {
            dispatch(setBodyScrollable(false));
        } else {
            dispatch(setBodyScrollable(true));
        }

        return (() => {
            dispatch(setBodyScrollable(true));
        })
    }, [open]);

    useEffect(() => {
        let timeOut: any;
        if (open) {
            timeOut = setTimeout(() => { setDelayedOpen(true) }, 50);
        }

        return (() => { setDelayedOpen(false); clearTimeout(timeOut); })
    }, [open]);

    useEffect(() => {
        let timeOut: any;
        if (!delayedOpen) {
            timeOut = setTimeout(() => { setOpen(false) }, 100);
        }

        return (() => { clearTimeout(timeOut); })
    }, [delayedOpen]);


    const departureTotalPrice = props.passengers.reduce((sum, item) => sum + (item.count * item.departurePrice), 0);


    if (props.loading) {
        return (
            <div className='border border-neutral-300 bg-white rounded-md mb-4'>
                <Skeleton className='mx-4 my-3.5 w-28' />
                <div className='border-t border-neutral-300 p-4'>
                    <div className='grid gap-3 grid-cols-4'>
                        <Skeleton type='image' />
                        <div className='col-span-3'>
                            <Skeleton className='mb-3 w-2/3' />
                            <Skeleton className='mb-3 w-1/3' />
                            <Skeleton className='w-full' />
                        </div>
                    </div>

                    <div className='border-t border-neutral-300 my-5' />

                    <Skeleton className='mb-3 w-full' />
                    <Skeleton className='mb-3 w-2/3' />
                    <Skeleton className='mb-3 w-1/3' />
                    <Skeleton className='mb-3 w-2/3' />

                    <div className='border-t border-neutral-300 my-5' />

                    <Skeleton className='mb-3 w-full' />
                    <Skeleton className='mb-3 w-full' />
                    <Skeleton className='mb-3 w-full' />

                    <Skeleton className='mb-3 w-full mt-6' type='button' />

                </div>
            </div>
        )
    }

    if (!departureFlight) {
        return null;
    }


    return (
        <>
            <div className={`bg-white rounded-lg border border-neutral-300 mb-4 ${props.className}`} >

                <div>
                    <div className="p-3 px-4 flex justify-between">
                        جزئیات پرواز

                        <button
                            type="button"
                            className="text-blue-500 cursor-pointer text-xs outline-none"
                            onClick={() => { setOpen(true) }}
                        >
                            جزئیات بیشتر
                        </button>
                    </div>

                    <div className="px-4 flex gap-2 items-center text-xs mb-2">

                        <TakeOff className="w-5 h-5 fill-current rtl:mirror" />

                        {!!returnFlight && <span> پرواز رفت:  </span>}

                        {dateDiplayFormat({ date: departureFlight.departureTime, format: "ddd dd mm", locale: "fa" })}

                        <span className="text-neutal-500 font-sans" dir="ltr">
                            ({dateDiplayFormat({ date: departureFlight.departureTime, format: "dd mm", locale: "en" })})
                        </span>

                    </div>

                    <div className="px-4 gap-3 flex justify-between items-center leading-6 mb-4">

                        {departureFlight.airline?.picture?.path ? (
                            <Image
                                src={departureFlight.airline.picture.path}
                                alt={departureFlight.airline.picture.altAttribute || departureFlight.airline.name || ""}
                                title={departureFlight.airline.picture.titleAttribute || departureFlight.airline.name || ""}
                                className="w-11 h-11 object-contain"
                                width={44}
                                height={44}
                            />
                        ) : (
                            ""
                        )}

                        <div className="text-sm">
                            <b className="font-semibold block">
                                {departureFlight.departureAirport.city.name}
                            </b>
                            {dateDiplayFormat({ date: departureFlight.departureTime, format: "HH:mm", locale: 'fa' })}
                        </div>

                        <div className="grow font-sans text-xs text-center text-neutral-500">
                            <strong className="font-semibold">
                                {departureFlight.flightNumber}
                            </strong>

                            <div className="flex gap-2 items-center -my-2.5">
                                <div className="border-t border-dashed border-neutral-300 grow" />
                                <Airpalne2 className="w-5 h-5 rtl:mirror fill-neutral-300" />
                            </div>

                            <div className="text-2xs">
                                {departureFlight.cabinClass.name} {departureFlight.cabinClass.code}
                            </div>
                        </div>

                        <div className="text-sm">
                            <b className="font-semibold block">
                                {departureFlight.arrivalAirport.city.name}
                            </b>
                            {departureFlight.arrivalTime ? dateDiplayFormat({ date: departureFlight.arrivalTime, format: "HH:mm", locale: 'fa' }) : "--"}
                        </div>

                    </div>

                    {!!returnFlight && (
                        <>
                            <div className="px-4 flex gap-2 items-center text-xs mb-2 mt-4">

                                <TakeOff className="w-5 h-5 fill-current rtl:mirror" />

                                <span> پرواز برگشت:  </span>

                                {dateDiplayFormat({ date: returnFlight.departureTime, format: "ddd dd mm", locale: "fa" })}

                                <span className="text-neutal-500 font-sans" dir="ltr">
                                    ({dateDiplayFormat({ date: returnFlight.departureTime, format: "dd mm", locale: "en" })})
                                </span>

                            </div>

                            <div className="px-4 gap-3 flex justify-between items-center leading-6 mb-4">

                                {departureFlight.airline?.picture?.path ? (
                                    <Image
                                        src={departureFlight.airline.picture.path}
                                        alt={departureFlight.airline.picture.altAttribute || departureFlight.airline.name || ""}
                                        title={departureFlight.airline.picture.titleAttribute || departureFlight.airline.name || ""}
                                        className="w-11 h-11 object-contain"
                                        width={44}
                                        height={44}
                                    />
                                ) : (
                                    ""
                                )}

                                <div className="text-sm">
                                    <b className="font-semibold block">
                                        {returnFlight.departureAirport.city.name}
                                    </b>
                                    {dateDiplayFormat({ date: returnFlight.departureTime, format: "HH:mm", locale: 'fa' })}
                                </div>

                                <div className="grow font-sans text-xs text-center text-neutral-500">
                                    <strong className="font-semibold">
                                        {returnFlight.flightNumber}
                                    </strong>

                                    <div className="flex gap-2 items-center -my-2.5">
                                        <div className="border-t border-dashed border-neutral-300 grow" />
                                        <Airpalne2 className="w-5 h-5 rtl:mirror fill-neutral-300" />
                                    </div>

                                    <div className="text-2xs">
                                        {returnFlight.cabinClass.name} {returnFlight.cabinClass.code}
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <b className="font-semibold block">
                                        {returnFlight.arrivalAirport.city.name}
                                    </b>
                                    {returnFlight.arrivalTime ? dateDiplayFormat({ date: returnFlight.arrivalTime, format: "HH:mm", locale: 'fa' }) : "--"}
                                </div>

                            </div>


                        </>
                    )}

                    {props.onWhiteBackground ? (
                        <hr className="mt-6 mb-3 mx-4" />
                    ) : (
                        <div dir="ltr" className="border-t border-dashed border-neutral-300 relative before:clip-ticket-circle-right after:clip-ticket-circle-left" />
                    )}

                    <div className="p-3 px-4">
                        <h5 className="font-semibold text-sm mb-3">
                            جزئیات مبلغ
                        </h5>

                        {props.passengers.map(item => (
                            <div key={item.type} className="flex justify-between items-center text-xs">
                                <span>
                                    {item.label} ({item.count})
                                </span>
                                {item.departurePrice ? (
                                    <span>
                                        {numberWithCommas(item.departurePrice * item.count)} ریال
                                    </span>
                                ) : (
                                    0
                                )}
                            </div>
                        ))}

                        <br />
                        <hr />

                        <div className="flex justify-between items-center text-semibold py-3">
                            <span>
                                مجموع
                            </span>

                            <span>
                                {numberWithCommas(departureTotalPrice)} ریال
                            </span>

                        </div>

                    </div>
                </div>

                {/* <div className={styles.detailsAside}>
                    <div className={styles.subject}>
                        <span>{t("price-details")}</span>
                    </div>
                    <div className={styles.contentDetailsAside}>
                        {flight.persons && flight.persons.length
                            ? flight.persons.map((person, index) => (
                                <div key={index} className={styles.passengerDetails}>
                                    <span>
                                        {person.type} ({person.count})
                                    </span>
                                    <b>{numberWithCommas(person.price)}</b>
                                </div>
                            ))
                            : ""}
                        <div className={styles.pricePay}>
                            <span>{t("total")}</span>
                            <b>{numberWithCommas(flight.sumPrice)}</b>
                        </div>
                    </div>
                </div> */}

            </div>

            <ModalPortal
                selector='modal_portal'
                show={open}
                children={<div className="fixed w-screen h-screen ovelflow-auto bg-black/75 backdrop-blur top-0 left-0 flex items-center justify-center">

                    <div
                        className="absolute left-0 right-0 bottom-0 top-0"
                        onClick={() => { setDelayedOpen(false) }}
                    />

                    <div className={`bg-white sm:rounded-md relative w-full sm:w-520 md:w-850 m-3 transition-all ${delayedOpen ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
                        <div className="border-b border-neutral-300 p-2 flex items-center justify-between font-semibold">
                            <button
                                type="button"
                                className="outline-none"
                                onClick={() => { setDelayedOpen(false) }}
                            >
                                <Close className="w-7 h-7 fill-current" />
                            </button>
                        </div>

                        <div className="p-3 sm:p-5">

                            <div className="flex items-center gap-3 mb-3">
                                <TakeOff className="w-6 h-6 fill-current rtl:mirror" />
                                {!!returnFlight && <span> پرواز رفت: </span>}
                                <b className="font-semibold block">{departureFlight.departureAirport.city.name}</b>
                                <ArrowRight className="w-5 h-5 full-current rtl:mirror" />
                                <b className="font-semibold block"> {departureFlight.arrivalAirport.city.name} </b>
                            </div>

                            <div className="text-xs text-neutral-500 flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                                <span> شماره پرواز: <span className="font-sans"> {departureFlight.flightNumber} </span> </span>

                                {!!departureFlight.departureAirport?.terminalId && (
                                    <span> پرواز از ترمینال شماره: {departureFlight.departureAirport.terminalId} </span>
                                )}

                                <span> مقدار بار مجاز: {departureFlight.maxAllowedBaggage} کیلوگرم </span>

                                <span> کلاس نرخی: {departureFlight.cabinClass.name} ({departureFlight.cabinClass.code}) </span>
                            </div>

                            <div className="p-3 bg-neutral-100 flex justify-between items-center gap-4 text-xs sm:text-sm mb-6">

                                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                    {departureFlight.airline?.picture?.path ? (
                                        <Image
                                            src={departureFlight.airline.picture.path}
                                            alt={departureFlight.airline.picture.altAttribute || departureFlight.airline.name || ""}
                                            title={departureFlight.airline.picture.titleAttribute || departureFlight.airline.name || ""}
                                            className="w-11 h-11 object-contain"
                                            width={44}
                                            height={44}
                                        />
                                    ) : (
                                        ""
                                    )}

                                    <div>
                                        {!!departureFlight.airline?.name && <div> {departureFlight.airline.name} </div>}

                                        {!!departureFlight.airCraft?.manufacturer && <div className="font-sans"> {departureFlight.airCraft.manufacturer} </div>}

                                        <div> {departureFlight.flightType === "System" ? "سیستمی" : "چارتر"} </div>

                                    </div>
                                </div>

                                <div>
                                    <b className="text-base font-semibold rtl:ml-2 ltr:mr-2">
                                        {departureFlight.departureAirport.city.name}
                                    </b>
                                    <span className="text-base font-semibold">
                                        {dateDiplayFormat({ date: departureFlight.departureTime, format: "HH:mm", locale: 'fa' })}
                                    </span>

                                    <div className="text-xs sm:text-sm">
                                        {dateDiplayFormat({ date: departureFlight.departureTime, format: "ddd dd mm", locale: "fa" })}
                                    </div>
                                </div>

                                {!!departureFlight.arrivalTime && <div>
                                    <b className="text-base font-semibold rtl:ml-2 ltr:mr-2">
                                        {departureFlight.arrivalAirport.city.name}
                                    </b>
                                    <span className="text-base font-semibold">
                                        {dateDiplayFormat({ date: departureFlight.arrivalTime, format: "HH:mm", locale: 'fa' })}
                                    </span>

                                    <div className="text-xs sm:text-sm">
                                        {dateDiplayFormat({ date: departureFlight.arrivalTime, format: "ddd dd mm", locale: "fa" })}
                                    </div>
                                </div>}

                            </div>

                            {!!returnFlight && (
                                <>
                                    <div className="flex items-center gap-3 mb-3">
                                        <TakeOff className="w-6 h-6 fill-current rtl:mirror" />
                                        <span> پرواز برگشت: </span>
                                        <b className="font-semibold block">{returnFlight.departureAirport.city.name}</b>
                                        <ArrowRight className="w-5 h-5 full-current rtl:mirror" />
                                        <b className="font-semibold block"> {returnFlight.arrivalAirport.city.name} </b>
                                    </div>

                                    <div className="text-xs text-neutral-500 flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                                        <span> شماره پرواز: <span className="font-sans"> {returnFlight.flightNumber} </span> </span>

                                        {!!returnFlight.departureAirport?.terminalId && (
                                            <span> پرواز از ترمینال شماره: {returnFlight.departureAirport.terminalId} </span>
                                        )}

                                        <span> مقدار بار مجاز: {returnFlight.maxAllowedBaggage} کیلوگرم </span>

                                        <span> کلاس نرخی: {returnFlight.cabinClass.name} ({returnFlight.cabinClass.code}) </span>
                                    </div>

                                    <div className="p-3 bg-neutral-100 flex justify-between items-center gap-4 text-xs sm:text-sm">

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                            {returnFlight.airline?.picture?.path ? (
                                                <Image
                                                    src={returnFlight.airline.picture.path}
                                                    alt={returnFlight.airline.picture.altAttribute || returnFlight.airline.name || ""}
                                                    title={returnFlight.airline.picture.titleAttribute || returnFlight.airline.name || ""}
                                                    className="w-11 h-11 object-contain"
                                                    width={44}
                                                    height={44}
                                                />
                                            ) : (
                                                ""
                                            )}

                                            <div>
                                                {!!returnFlight.airline?.name && <div> {returnFlight.airline.name} </div>}

                                                {!!returnFlight.airCraft?.manufacturer && <div className="font-sans"> {returnFlight.airCraft.manufacturer} </div>}

                                                <div> {returnFlight.flightType === "System" ? "سیستمی" : "چارتر"} </div>

                                            </div>
                                        </div>

                                        <div>
                                            <b className="text-base font-semibold rtl:ml-2 ltr:mr-2">
                                                {returnFlight.departureAirport.city.name}
                                            </b>
                                            <span className="text-base font-semibold">
                                                {dateDiplayFormat({ date: returnFlight.departureTime, format: "HH:mm", locale: 'fa' })}
                                            </span>

                                            <div className="text-xs sm:text-sm">
                                                {dateDiplayFormat({ date: returnFlight.departureTime, format: "ddd dd mm", locale: "fa" })}
                                            </div>
                                        </div>

                                        {!!returnFlight.arrivalTime && <div>
                                            <b className="text-base font-semibold rtl:ml-2 ltr:mr-2">
                                                {returnFlight.arrivalAirport.city.name}
                                            </b>
                                            <span className="text-base font-semibold">
                                                {dateDiplayFormat({ date: returnFlight.arrivalTime, format: "HH:mm", locale: 'fa' })}
                                            </span>

                                            <div className="text-xs sm:text-sm">
                                                {dateDiplayFormat({ date: returnFlight.arrivalTime, format: "ddd dd mm", locale: "fa" })}
                                            </div>
                                        </div>}

                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>}
            />
        </>

    )

}

export default Aside;
