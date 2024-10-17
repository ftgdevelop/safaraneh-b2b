import { AccountNumbersType } from "@/modules/payment/types";
import { CopyIcon } from "@/modules/shared/components/ui/icons";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { setReduxNotification } from "@/modules/shared/store/notificationSlice";
import Image from "next/image";

type Props = {
    bank: AccountNumbersType;
}

const BankCard: React.FC<Props> = props => {

    const { bank } = props;
    const dispatch = useAppDispatch();

    const copyAccount = () => {
        navigator.clipboard.writeText(bank.ibanNumber || "");
        dispatch(setReduxNotification({
            status: 'success',
            message: "شماره حساب کپی شد.",
            isVisible: true
        }))
    }

    return (
        <div className={`relative mb-10 inline-block min-w-96 mx-auto text-neutral-800 border rounded-xl my-5 bg-gradient-to-b ${bank.bank.keyword === "Sina" ? "from-blue-100" : bank.bank.keyword === "Mellat" ? "from-red-100" : "from-slate-100"} to-white`}>

            <Image
                src={bank.bank.picturePath || ""}
                alt={bank.bank.pictureAltAttribute || ""}
                width={45}
                height={44}
                className="absolute top-1/2 right-1/2 w-20 h-20 -mt-10 -mr-10 opacity-15"

            />


            <div className="my-5 bg-white/50 flex items-center px-5 py-2 gap-5 relative">
                <Image
                    src={bank.bank.picturePath || ""}
                    alt={bank.bank.pictureAltAttribute || ""}
                    width={45}
                    height={44}
                />
                <div className="text-sm">
                    <strong className="block font-bold text-lg">
                        بانک {bank.bank.name}
                    </strong>
                    {bank.bank.keyword} bank
                </div>

            </div>
            {!!bank.ibanNumber && <div className="flex gap-5 justify-center items-center mt-7 mb-5 px-5 relative">
                <strong className="tracking-widest text-lg">
                    {bank.ibanNumber}
                </strong>
                <button
                    type="button"
                    onClick={copyAccount}
                    aria-label="کپی"
                    title="کپی"
                >
                    <CopyIcon className="w-7 h-7 fill-neutral-500" />
                </button>
            </div>}

            <p className="text-center text-sm mb-7 px-5 relative">
                {bank.accountOwnerName}
            </p>

            <div
                className={`h-4 rounded-b-xl ${bank.bank.keyword === "Sina" ? "bg-blue-700" : bank.bank.keyword === "Mellat" ? "bg-red-600" : "bg-slate-600"}`}
            />

        </div>
    )
}

export default BankCard;