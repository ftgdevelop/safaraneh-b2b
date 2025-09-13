"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import Button from "../ui/Button";
import { Close, Menu, User3 } from "../ui/icons";
import { StrapiData } from "../../types/common";

type Props = {
  logo?: string;
  menuItems: StrapiData["menuItems"];
};

const Header: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="bg-white z-30 relative shadow-sm">
      <div className="max-w-container mx-auto flex items-center justify-between py-5 px-3 md:px-5">
        <button
          className="lg:hidden p-2 rounded-md border border-neutral-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <Close className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        <div className="flex items-center space-x-10">
          {!!props.logo && (
            <Link href="/" className="block">
              <Image
                src={props.logo}
                alt="Logo"
                width={115}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>
          )}
          <div className="hidden lg:block">
            <Navigation items={props.menuItems} />
          </div>
        </div>

        <div className="lg:flex items-center space-x-6">
          <Button href={"/panel"} className="h-12 px-4">
            <User3 className="fill-white h-7 w-7 inline-block" />
            <span className="lg:block hidden">ورود به پنل کاربری</span>
          </Button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold">منو</span>
          <button onClick={() => setIsOpen(false)} aria-label="Close menu">
            <Close className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <Navigation
            items={props.menuItems}
            mobile
            toggleModal={() => setIsOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
