import { dateDiplayFormat } from "../helpers";
import { TravelerItem } from "../types/common";
import Button from "./ui/Button";

type Props = {
    traveller: TravelerItem;
    onSelect: () => void;
    ondelete: (item: TravelerItem) => void;
    isHotel?: boolean;
}

const FormerTravelerItem: React.FC<Props> = props => {

    const { traveller, onSelect, ondelete, isHotel } = props;

    let passengerName = (traveller.firstname || traveller.firstnamePersian) + " " + (traveller.lastname || traveller.lastnamePersian);

    if (isHotel && traveller.firstnamePersian && traveller.lastnamePersian) {
        passengerName = traveller.firstnamePersian + " " + traveller.lastnamePersian
    }

    return (
        <tr className="group">
            <td className="p-1 md:p-2 group-hover:bg-neutral-50"> {passengerName}</td>
            <td className="p-1 md:p-2 group-hover:bg-neutral-50"> {traveller.gender ? "مرد" : "زن"} </td>
            <td className="p-1 md:p-2 group-hover:bg-neutral-50"> {traveller.nationalId || traveller.passportNumber || "--"} </td>
            {!isHotel && <td className="p-1 md:p-2 group-hover:bg-neutral-50"> {traveller.passportExpirationDate ? dateDiplayFormat({ date: traveller.passportExpirationDate, format: "yyyy/mm/dd", locale: "en" }) : "--"} </td>}
            <td className="p-1 md:p-2 group-hover:bg-neutral-50"> {traveller.birthDate ? dateDiplayFormat({ date: traveller.birthDate, format: "yyyy/mm/dd", locale: "en" }) : "--"} </td>
            <td className="p-1 md:p-2 group-hover:bg-neutral-50">
                <div className="flex justify-center gap-3">
                    <Button
                        type="button"
                        className="px-3 h-8 grow"
                        onClick={onSelect}
                    >
                        انتخاب
                    </Button>

                    <button
                        type="button"
                        className="text-red-600 grow"
                        onClick={() => { ondelete(traveller) }}
                    >
                        حذف
                    </button>
                </div>

            </td>
        </tr>
    )
}

export default FormerTravelerItem;