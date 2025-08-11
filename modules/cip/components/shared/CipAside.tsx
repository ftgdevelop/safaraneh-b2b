import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { Child, Group, User3 } from "@/modules/shared/components/ui/icons";
import { dateDiplayFormat, numberWithCommas } from "@/modules/shared/helpers";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { CipGetReserveByIdResponse } from "../../types/cip";

type Props = {
    className?: string;
    reserveInfo?: CipGetReserveByIdResponse;
    loading?: boolean;
}
const CipAside: React.FC<Props> = props => {

    const { t } = useTranslation('common');
    const {loading, reserveInfo} = props;

    return (
        <div className={`bg-white rounded-lg border border-neutral-300 mb-4 ${props.className}`} >

            <div>
                <h4 className="p-3 font-semibold text-sm border-b leading-5 border-neutral-300" >
                    {t('reserve-details')}
                </h4>

                <div className="p-2.5">
                    {loading ? (
                        <div>
                            <Skeleton type="image" className="mb-4 w-full h-40" />
                            
                            <Skeleton className="mb-4" />

                            {[1,2,3,4].map(item => (
                                <div className="flex mb-3 justify-between" key={item}>
                                    <Skeleton className="w-24" />
                                    <Skeleton className="w-20" />
                                </div>
                            ))}

                            <hr className="my-5" />

                            {[1,2,3].map(item => (
                                <div className="flex mb-3 justify-between" key={item}>
                                    <Skeleton className="w-24" />
                                    <Skeleton className="w-20" />
                                </div>
                            ))}

                            <hr className="my-5" />

                            <Skeleton className="mb-3" />
                            <Skeleton className="mb-3" />
                            <Skeleton className="mb-3" />

                        </div>
                    ): reserveInfo ? (
                        <div>
                            <Image
                                src={reserveInfo.airport.picture.path}
                                alt={reserveInfo.airport.picture.altAttribute}
                                title={reserveInfo.airport.picture.titleAttribute}
                                className="w-full mb-3"
                                width={354}
                                height={200}
                            />
                            <h4 className="font-semibold mb-3"> {reserveInfo.airport.name} {reserveInfo.airport.city.name} </h4>

                            <div className="flex items-center justify-between text-xs">
                                <div>شماره پرواز</div>
                                <div className="font-sans">
                                    {reserveInfo.flightNumber}
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div>نام ایرلاین</div>
                                <div>
                                    {reserveInfo.airline && reserveInfo.airline}
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div>تاریخ پرواز</div>
                                <div>
                                    {dateDiplayFormat({ date: reserveInfo.flightTime, locale: "fa", format: 'yyyy/mm/dd' })}
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div>ساعت پرواز</div>
                                <div className="font-sans">
                                    {reserveInfo.flightTime.split("T")[1]}
                                </div>
                            </div>

                            <hr className="my-3" />

                            {reserveInfo.passengers.length > 0 && (
                                <div>
                                    <div className="text-sm mb-3">مسافران</div>

                                    {reserveInfo.passengers.map((item, index) => <div className="flex items-center text-xs gap-1.5 mb-1" key={index}>

                                        {item.passengerType === 'Accompanying' ? (
                                            <Group className="w-5 h-5 fill-current" />
                                        ) : item.passengerType === "Adult" ? (
                                            <User3 className="w-5 h-5 fill-current" />
                                            ) : (
                                            <Child className="w-5 h-5 fill-current" />
                                        )}

                                        <span>{item.firstName} {item.lastName}</span> {item.passengerType === 'Accompanying' && <span> (مشایعت کننده) </span>}

                                        {item.service.items.map((itemService, keyService) =>
                                            <div key={keyService} className="bg-neutral-100 rounded px-2">
                                                {itemService.name}
                                            </div>
                                        )}

                                    </div>)}
                                </div>
                            )}


                            {reserveInfo.service.items.length > 0 &&
                                <div>
                                    <hr className="my-3" />

                                    <div className="text-sm mb-3"> سرویس های اضافه انتخاب شده </div>

                                    {reserveInfo.service.items.map((item, index) =>
                                        <div className="flex text-xs mb-3 gap-2" key={index}>
                                            <Image
                                                src={item.picture?.path || "https://cdn2.safaraneh.com/images/cip/services/default.jpg"}
                                                alt={item.picture?.altAttribute || ""}
                                                title={item.picture?.titleAttribute || ""}
                                                width={90}
                                                height={90}
                                                className="w-24 h-20 object-contain"
                                            />
                                            <div>
                                                <b className="font-semibold block">{item.name}</b>
                                                {item.type == "Pet" && <div>{item.count} عدد</div>}
                                                {item.type == "MeetingRoom" && <div>{item.count} عدد</div>}
                                                {item.type == "Conference" && <div>{item.count} عدد</div>}
                                                <div>
                                                    {numberWithCommas(item.salePrice * item.count)} ریال
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>}

                            {!!reserveInfo.transport.items.find(i => i.count > 0) && (
                                <div>

                                    <hr className="my-3" />

                                    <div className="text-sm mb-3">ترانسفر فرودگاهی</div>

                                    {reserveInfo.transport.items.map((item, index) =>
                                        <div className="flex text-xs mb-3 gap-2" key={index}>

                                            <Image
                                                src={item.picture?.path || "https://cdn2.safaraneh.com/images/cip/services/default.jpg"}
                                                alt={item.picture?.altAttribute || ""}
                                                title={item.picture?.titleAttribute || ""}
                                                width={90}
                                                height={90}
                                                className="w-24 h-20 object-contain"
                                            />

                                            <div>
                                                <b className="font-semibold block">{item.name}</b>
                                                <div>{item.count} عدد</div>
                                                <div>
                                                    {numberWithCommas(item.salePrice * item.count)} ریال
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-sm"> آدرس : {reserveInfo.transport.items[0]?.address}</p>
                                </div>
                            )}

                        </div>
                    ) : (
                        null
                    )}
                </div>

            </div>

        </div>
    )

}

export default CipAside;