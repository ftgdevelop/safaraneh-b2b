"use client";

import { Password, UserX, UsersX } from "@/modules/shared/components/ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const UserNavigation: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
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

  return (
    <div className="bg-white border-l lg:min-h-screen relative">
      <nav
        className={`fixed top-0 right-0 h-full bg-white border-l min-w-[199px] z-50 transform transition-transform duration-300 lg:static lg:block lg:translate-x-0
        `}
      >
        <div className="lg:hidden flex justify-between items-center p-4 border-b">
          <span className="font-semibold">منو</span>
          <button onClick={() => setOpen(false)} className="text-xl">
            ✖
          </button>
        </div>

        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 py-3 px-5 border-b transition-colors
                ${
                  isActive
                    ? "bg-slate-100 text-blue-600 font-medium"
                    : "hover:bg-slate-50"
                }`}
              onClick={() => setOpen(false)}
            >
              <span
                className={`rounded-lg p-2 ${
                  isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100"
                }`}
              >
                {link.icon}
              </span>
              <div className="text-sm">
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
