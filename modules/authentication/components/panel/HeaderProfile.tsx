import { useAppSelector } from "@/modules/shared/hooks/use-store";
import Link from "next/link";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { DownCaret, Settings, User2 } from "../../../shared/components/ui/icons";
import Logout from "../Logout";

const HeaderProfile = () => {

    const user = useAppSelector(state => state.authentication.user);
    const loading = useAppSelector(state => state.authentication.getUserLoading);

    if (!user) return null;

    return (
        <div className="group relative">
            <Link
                className="text-sm flex gap-1 items-center transition-all hover:bg-gray-100 py-1 px-2 rounded"
                href="#"
            >
                {loading ? (
                    <Skeleton className="mt-2 w-24" />
                ) : (
                    <>
                        <User2 className="w-5 h-5 ml-1" />
                        {(user?.firstName || user?.lastName) ? `${user.firstName} ${user.lastName}` : user.userName } 
                    </>
                )}

                <DownCaret className="w-5 h-5 fill-current" />
            </Link>
            <div 
                className="absolute min-w-full top-full bg-white border rounded-lg text-sm whitespace-nowrap left-0 opacity-0 delay-200 invisible transition-all origin-top-left scale-75 -mt-5 group-hover:mt-0 group-hover:scale-100 group-hover:opacity-100 group-hover:visible group-hover:delay-0"
            >
                <Link href={"/panel/profile"} className="py-2 hover:bg-neutral-100 px-3 rounded flex gap-2 items-center">
                    <User2 className="w-5 h-5"/>
                    حساب کاربری
                </Link>
                <Link href={"/"} className="py-2 hover:bg-neutral-100 px-3 rounded flex gap-2 items-center">
                    <Settings className="w-5 h-5"/>
                    تنظیمات
                </Link>

                <Logout className="block py-2 px-3 w-full text-right text-red-500 hover:bg-red-100 rounded-b-lg" />

            </div>
        </div>

    )
}
export default HeaderProfile;