import { useRouter } from "next/router"
import FlightSidebarFilterResult from "./SidebarFilterResult"
import { RightCaret } from "@/modules/shared/components/ui/icons"
import { addSomeDays, dateDiplayFormat, dateFormat } from "@/modules/shared/helpers"

const ChangeDay: React.FC = () => {

    const today = dateFormat(new Date())

    const router = useRouter();

    const queryDate: string = router.query.departing as string;

    const changeFlightDate = (type: "inc" | "dec") => {

        if (type === "inc") {
            const nextDate = dateFormat(addSomeDays(new Date(queryDate)));
            router.push({ query: { ...router.query, departing: nextDate } });
        } else {
            const previousDate = dateFormat(addSomeDays(new Date(queryDate), -1));
            router.push({ query: { ...router.query, departing: previousDate } });
        }

    }

    const disabledPreviousDateButton = dateFormat(new Date()) === queryDate;

    const theme2 = process.env.THEME === "THEME2";

    return (
        <>
            {!theme2 && <hr className="w-full mt-4 max-sm:hidden" />}

            <div className="mt-3 flex gap-2 justify-between items-center max-md:block max-md:space-y-5">

                {!theme2 && <FlightSidebarFilterResult />}

                {
                    !router.query.returning &&
                    <div
                        className={`flex gap-3 bg-white w-fit text-sm text-gray-500 rounded h-fit max-md:w-full justify-center max-md:justify-around ${theme2 ? "" : "shadow-md"}`}
                    >
                        <button
                            type="button"
                            className={`flex duration-200 p-1 pl-2 pr-2 w-full justify-center items-center whitespace-nowrap ${disabledPreviousDateButton ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-100"}`}
                            onClick={() => { changeFlightDate("dec") }}
                            disabled={disabledPreviousDateButton}
                        >
                            <RightCaret className="w-5 fill-gray-400 ltr:rotate-180" />
                            روز قبل
                        </button>

                        <p className="pr-2 pl-2 p-1 w-full whitespace-nowrap text-center">{dateDiplayFormat({ date: (router.query.departing as string), locale: 'fa', format: 'ddd dd mm' }) ||
                            dateDiplayFormat({ date: today, locale: 'fa', format: 'ddd dd mm' })}
                        </p>

                        <button
                            type="button"
                            className="flex hover:bg-gray-100 duration-200 p-1 pr-2 pl-2 w-full justify-center items-center cursor-pointer whitespace-nowrap"
                            onClick={() => { changeFlightDate("inc") }}
                        >
                            روز بعد
                            <RightCaret className="w-5 rtl:rotate-180 fill-gray-400" />
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default ChangeDay;