import Link from "next/link";
import { useState } from "react";
import { UserItemType } from "../../types/authentication";
import { EditIcon, Password2 } from "@/modules/shared/components/ui/icons";
import ModalPortal from "@/modules/shared/components/ui/ModalPortal";
import ChangeUsersPassword from "./ChangeUsersPassword";

type Props = {
    user: UserItemType;
    index: number;
}

const UserItem: React.FC<Props> = props => {

    const { user, index } = props;

    const tableCellClass = "px-4 py-3 leading-8 text-right font-normal border-neutral-200 transition-all"

    const [resetPasswordOpen, setResetPasswordOpen] = useState<boolean>(false);

    const closeModal = () => {setResetPasswordOpen(false)} ;

    return (
        <tr className="group" >
            <td className={`${tableCellClass} text-muted-foreground border-t group-hover:bg-blue-50/50`} dir={user?.userName && user.userName[0] === "+" ? "ltr" : "rtl"}> {index} </td>
            <td className={`${tableCellClass} border-t group-hover:bg-blue-50/50`}> {user.firstName || "--"} </td>
            <td className={`${tableCellClass} border-t group-hover:bg-blue-50/50`}> {user.lastName || "--"} </td>
            <td className={`${tableCellClass} border-t group-hover:bg-blue-50/50`} dir={user?.userName && user.userName[0] === "+" ? "ltr" : "rtl"}> {user.userName} </td>
            <td className={`${tableCellClass} border-t group-hover:bg-blue-50/50`}>
                <span className={`border px-2 text-xs rounded ${user.isActive ? "bg-blue-50 border-blue-400 text-blue-500" : "bg-red-50 border-red-400 text-red-600"}`}>
                    {user.isActive ? "فعال" : "غیر فعال"}
                </span>
            </td>
            <td className={`${tableCellClass} border-t group-hover:bg-blue-50/50`}>
                <Link
                    href={`/users/edit/${user.id}`}
                    title="ویرایش"
                    className="inline-block align-middle border border-slate-300 bg-slate-100 hover:bg-slate-200 outline-none rounded mx-1 p-1"
                >
                    <EditIcon className="w-5 h-5 fill-current" />
                </Link>
                {!!user.id && <button
                    type="button"
                    title="تغییر کلمه عبور"
                    className="inline-block align-middle border border-slate-300 bg-slate-100 hover:bg-slate-200 outline-none rounded mx-1 p-1"
                    onClick={() => { setResetPasswordOpen(true) }}
                >
                    <Password2 className="w-5 h-5 fill-current" />
                </button>}

                <ModalPortal
                    show={resetPasswordOpen}
                    selector='modal_portal_2'
                >
                    <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen z-50 flex justify-center items-center">
                        <div
                            className="absolute bg-black/50 backdrop-blur-sm top-0 left-0 right-0 bottom-0 h-screen w-screen"
                            onClick={closeModal}
                        />
                        <div className="bg-white rounded-xl px-5 pt-10 pb-12 w-full max-w-md text-sm relative">
                            <ChangeUsersPassword 
                                userId={user.id}
                                closeModal={closeModal}
                                userFullName={user.displayName || (user.firstName + " " + user.lastName) || user.userName || ""}
                            />
                        </div>
                    </div>

                </ModalPortal>

            </td>
        </tr>
    )
}

export default UserItem;