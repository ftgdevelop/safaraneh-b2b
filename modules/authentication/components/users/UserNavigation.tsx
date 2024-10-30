import { Password, UserX, UsersX } from "@/modules/shared/components/ui/icons";
import Link from "next/link";

const UserNavigation: React.FC = () => {
    return (
        <div className="bg-white min-h-screen border-l relative">
            <nav className="sticky top-16 border-slate-300">

                <Link
                    href={"/panel/profile"}
                    className="flex items-center gap-4 py-2 px-5 border-b"
                >
                    <span className="bg-slate-100 rounded-lg p-1.5">
                        <UserX className="w-8 h-8" />
                    </span>
                    <div className="text-sm">
                        ویرایش پروفایل
                        <br />
                        Edit Profile
                    </div>
                </Link>

                <Link
                    href={"/panel/change-password"}
                    className="flex items-center gap-4 py-2 px-5 border-b"
                >
                    <span className="bg-slate-100 rounded-lg p-1.5">
                        <Password className="w-8 h-8" />
                    </span>
                    <div className="text-sm">
                        تغییر کلمه عبور
                        <br />
                        Change Password
                    </div>
                </Link>

                <Link
                    href={"/panel/users"}
                    className="flex items-center gap-4 py-2 px-5 border-b"
                >
                    <span className="bg-slate-100 rounded-lg p-1.5">
                        <UsersX className="w-8 h-8" />
                    </span>
                    <div className="text-sm">
                        مدیریت کاربران
                        <br />
                        User Management
                    </div>
                </Link>

            </nav>
        </div>
    )
}

export default UserNavigation;