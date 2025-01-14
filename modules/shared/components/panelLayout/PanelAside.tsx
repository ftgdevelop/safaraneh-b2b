import Link from "next/link";
import { Dashboard, Headset, Settings, Hotel, Wallet2, Cip2, Bus, Flight2, Plus, TimeUpdate, CreditCard, UsersX } from "../ui/icons";
import Accordion from "../ui/Accordion";
import Image from "next/image";

const PanelAside: React.FC = () => {
    return (
        <div>
            <aside className="bg-white sticky top-0 flex flex-col min-h-screen justify-between border-l border-slate-300" >
                <nav>
                    <Link
                        href={"/panel"}
                        className="flex items-center gap-4 py-2 px-5 border-b"
                    >
                        <span className="bg-slate-100 rounded-lg p-1.5">
                            <Dashboard className="w-8 h-8" />
                        </span>
                        <div className="text-sm">
                            پیشخوان
                            <br />
                            Dasboard
                        </div>
                    </Link>
                    <Accordion
                        WrapperClassName="border-b"
                        noBorder
                        noBgContent
                        content={<div className="text-sm leading-5 pb-4">
                            <Link href={"/panel"} className="block py-2 hover:bg-neutral-100 px-3 rounded">
                                رزرو
                            </Link>
                            <Link href={"/hotel/reserveList"} className="block py-2 hover:bg-neutral-100 px-3 rounded">
                                لیست رزرو ها
                            </Link>
                            <Link href={"/"} className="block py-2 hover:bg-neutral-100 px-3 rounded">
                                قیمت گذاری
                            </Link>
                            <Link href={"/"} className="block py-2 hover:bg-neutral-100 px-3 rounded">
                                جادهی
                            </Link>
                        </div>}
                        title={(<div className="flex items-center gap-4">
                            <span className="bg-slate-100 rounded-lg p-1.5">
                                <Hotel className="w-8 h-8" />
                            </span>
                            <div className="text-sm">
                                <div className="mb-3"> هتل </div>
                                Hotel
                            </div>
                        </div>)}
                    />

                    <div className="flex items-center text-slate-400 gap-4 py-2 px-5 border-b" >
                        <span className="bg-slate-100 rounded-lg p-1.5">
                            <Flight2 className="w-8 h-8" />
                        </span>
                        <div className="text-sm">
                            پرواز
                            <br />
                            Flight
                        </div>
                    </div>
                    <div className="flex items-center text-slate-400 gap-4 py-2 px-5 border-b" >
                        <span className="bg-slate-100 rounded-lg p-1.5">
                            <Bus className="w-8 h-8" />
                        </span>
                        <div className="text-sm">
                            اتوبوس
                            <br />
                            Bus
                        </div>
                    </div>
                    <div className="flex items-center text-slate-400 gap-4 py-2 px-5 border-b" >
                        <span className="bg-slate-100 rounded-lg p-1.5">
                            <Cip2 className="w-8 h-8" />
                        </span>
                        <div className="text-sm">
                            تشریفات
                            <br />
                            Cip
                        </div>
                    </div>

                    <Accordion
                        WrapperClassName="border-b"
                        noBorder
                        noBgContent
                        content={<div className="text-sm leading-5 pb-4">
                            <Link href="/wallet" className="py-3 hover:bg-slate-100 px-3 rounded flex gap-2 items-center">
                                <Wallet2 className="w-5 h-5" />
                                موجودی کیف پول
                            </Link>
                            <Link href="/wallet/deposit" className="py-3 hover:bg-slate-100 px-3 rounded flex gap-2 items-center">
                                <Plus className="w-5 h-5 fill-current" />
                                پرداخت و افزایش اعتبار
                            </Link>
                            <Link href="/wallet/transactions" className="py-3 hover:bg-slate-100 px-3 rounded flex gap-2 items-center">
                                <TimeUpdate className="w-5 h-5 fill-current" />
                                تراکنش های آنلاین
                            </Link>
                            <Link href="/wallet/offline-transactions" className="py-3 hover:bg-slate-100 px-3 rounded flex gap-2 items-center">
                                <CreditCard className="w-5 h-5 fill-current" />
                                تراکنش های آفلاین
                            </Link>
                        </div>}
                        title={(<div className="flex items-center gap-4">
                            <span className="bg-slate-100 rounded-lg p-1.5">
                                <Wallet2 className="w-8 h-8" />
                            </span>
                            <div className="text-sm">
                                <div className="mb-3"> کیف پول </div>
                                Wallet
                            </div>
                        </div>)}
                    />

                    <Link
                        href={"/users"}
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
                <footer>
                    <Link href="#" className="py-2 flex gap-2 items-center px-5 text-sm">
                        <Headset className="w-6 h-6" />
                        پشتیبانی
                    </Link>
                    <Link href="#" className="py-2 flex gap-2 items-center px-5 text-sm">
                        <Settings className="w-6 h-6" />
                        تنظیمات
                    </Link>

                    <Link
                        href={"/panel"}
                        className="p-4 text-center block border-t mt-2"
                    >
                        <Image
                            src="/assets/images/logo.svg"
                            alt="logo"
                            className="w-28 mx-auto"
                            width={112}
                            height={46}
                        />
                    </Link>
                </footer>
            </aside>
        </div>
    )
}

export default PanelAside;