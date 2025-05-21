import Image from "next/image";
import Link from "next/link";
import parse from 'html-react-parser';

import { AirportDetailType } from "../../types/cip";
import { DownCaret, Location } from "@/modules/shared/components/ui/icons";
import Button from "@/modules/shared/components/ui/Button";

const CipAirportsList: React.FC<{ airports: AirportDetailType[] }> = ({ airports }) => {

    const theme2 = process.env.THEME === "THEME2";

    return (
        <>
            <h2 className="mt-10 text-lg sm:text-3xl">رزرو تشریفات فرودگاهی CIP</h2>

            {airports?.map(airport =>
                <div className={`sm:grid w-full mt-8 overflow-hidden ${theme2?"rounded-xl border border-neutral-200 sm:grid-cols-4":"sm:grid-cols-3 rounded-md shadow-md"}`} key={airport.id}>
                    <Link href={airport.url} className="block w-full bg-[url('/images/pattern.png')]">
                        {!!airport.picture.path && <Image
                            src={airport.picture.path}
                            alt={airport.picture.altAttribute || airport.nameLong || 'cip-picture'}
                            width={386}
                            height={260}
                            className="w-full h-full object-cover"
                            onContextMenu={e => e.preventDefault()}
                        />}
                    </Link>
                    <div className={`w-full bg-white p-5 pt-3 pb-2 max-sm:p-3 ${theme2?"col-span-3":"col-span-2"}`}>
                        <Link href={airport.url} className={`${theme2?"text-lg font-bold text-neutral-700":"font-bold"}`}>{airport.name}</Link>
                        <div className="flex gap-1">
                            <Location className="w-4 fill-gray-400" />
                            <p className={theme2?"text-sm text-gray-400":"text-2xs text-gray-400"}>{airport.address}</p>
                        </div>
                        <div className={`text-xs max-sm:text-2xs mt-2 text-gray-700 overflow-hidden relative ${theme2?"h-16":"h-28"}`}>
                            {parse(airport.description || '')}

                            <span className="h-18 w-full absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-b from-transparent to-white" />
                        </div>
                        <div className="flex justify-between mt-2 max-sm:mt-5">
                            {
                                airport.displayPrice ?
                                    <div>
                                        <p className={`max-sm:text-sm ${theme2?"font-semibold":""}`}>{airport.displayPrice.toLocaleString()} ریال</p>
                                        <p className="text-2xs max-sm:text-4xs text-gray-400 relative bottom-2 leading-5">شروع قیمت</p>
                                    </div> :
                                    <p className="max-sm:text-xs text-gray-400">قیمت موجود نیست</p>
                            }
                            {theme2?(
                                <Button
                                    href={airport.url}
                                    className="whitespace-nowrap h-10 px-6 text-sm mb-2"
                                >
                                    مشاهده جزییات رزرو
                                </Button>
                            ):(
                                <Link href={airport.url}
                                    className="bg-blue-700 max-md:text-sm rounded-md flex h-fit relative
                                        text-white p-2 max-sm:p-1 pl-12 pr-12 whitespace-nowrap max-sm:pl-4 max-sm:pr-4 hover:bg-blue-600 duration-300">
                                    <p>مشاهده جزییات رزرو</p>
                                    <DownCaret className="w-5 rotate-90 ltr:rotate-45 absolute left-1 top-3 max-sm:static fill-white" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )
            }
        </>
    )
}

export default CipAirportsList;