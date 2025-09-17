"use client";

import { Password, UserX, UsersX } from "@/modules/shared/components/ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  {
    href: "/profile",
    labelFa: "ویرایش پروفایل",
    labelEn: "Edit Profile",
    icon: <UserX className="w-6 h-6" />,
  },
  {
    href: "/change-password",
    labelFa: "تغییر کلمه عبور",
    labelEn: "Change Password",
    icon: <Password className="w-6 h-6" />,
  },
  {
    href: "/users",
    labelFa: "مدیریت کاربران",
    labelEn: "User Management",
    icon: <UsersX className="w-6 h-6" />,
  },
];

const UserNavigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="bg-white border-l lg:min-h-screen relative">
      <nav className="h-full bg-white border-l z-50 transition-transform duration-300">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center max-lg:justify-center w-full gap-3 py-3 px-5 border-b transition-colors ${
                isActive
                  ? "bg-slate-100 text-blue-600 font-medium"
                  : "hover:bg-slate-50"
              }`}
            >
              <span
                className={`rounded-lg p-2 ${
                  isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100"
                }`}
              >
                {link.icon}
              </span>
              <div className="text-sm hidden lg:block">
                {link.labelFa}
                <br />
                {link.labelEn}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default UserNavigation;
