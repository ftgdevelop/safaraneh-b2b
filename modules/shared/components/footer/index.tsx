import Link from "next/link";
import Image from "next/image";
import { Email, Phone } from "../ui/icons";

const Footer: React.FC = () => {

    return (
        <footer className="bg-violet-950 border-t border-purple-700/40">
            <div className="max-w-container px-5 mx-auto text-white">
                <div className="grid grid-cols-12 gap-[24px] md:gap-[44px] py-[30px] md:py-[60px]">
                    <div className="col-span-12 md:col-span-6 xl:col-span-4">
                        <div className="text-[16px] md:text-[20px] font-[600]">
                            اطلاعات تماس
                        </div>
                        <div className="py-[30px] max-md:pb-0">
                            <div className="flex justify-between mb-[20px]">
                                <div className="flex gap-[10px]">
                                    <Phone className="fill-current w-7 h-7" />
                                    <span className="text-[14px] md:text-[16px]">تلفن پشتیبانی</span>
                                </div>
                                <div className="md:tracking-widest text-[14px] md:text-[16px] text-[600]">
                                    ۲۶۱۵۰۰۵۱ - ۰۲۱
                                </div>
                            </div>
                            <div className="flex justify-between mb-[20px]">
                                <div className="flex gap-[10px]">
                                    <Email className="fill-current w-7 h-7" />
                                    <span className="text-[14px] md:text-[16px]">ایمیل پشتیبانی</span>
                                </div>
                                <div className="md:tracking-widest text-[14px] md:text-[16px] text-[600]">
                                    info@safaraneh.com
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <div className="text-white text-[16px] md:text-[20px] font-[600]">
                            لینک های سریع
                        </div>
                        <div className="py-[20px] flex flex-col leading-9 md:leading-10">
                            <Link href="/panel" className="text-white text-sm">
                                ورود به پنل کاربری
                            </Link>
                            <Link href="/contact-us" className="text-white text-sm">
                                درخواست مشاوره
                            </Link>
                            <Link href="/services" className="text-white text-sm">
                                خدمات
                            </Link>
                            <Link href="/about-us" className="text-white text-sm">
                                درباره ما
                            </Link>
                            <Link href="/contact-us" className="text-white text-sm">
                                تماس با ما
                            </Link>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-3">
                        <div className="text-white text-[16px] md:text-[20px] font-[600]">
                            شبکه های اجتماعی
                        </div>
                        <div className="flex gap-[12px] mt-[30px]">
                            <Link href="/" className="bg-white rounded-[5px] p-[10px]">
                                <Image src="/assets/images/social/aparat.svg" alt="آپارات" title="آپارات" width={28} height={28} />
                            </Link>
                            <Link href="/" className="bg-white rounded-[5px] p-[10px]">
                                <Image src="/assets/images/social/instagram.svg" alt="اینستاگرام" title="آپارات" width={28} height={28} />
                            </Link>
                            <Link href="/" className="bg-white rounded-[5px] p-[10px]">
                                <Image src="/assets/images/social/telegram.svg" alt="تلگرام" title="آپارات" width={28} height={28} />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="text-white py-[60px] text-[10px] md:text-[12px] font-[100]">
                    © کلیه حقوق این وبسایت متعلق به سفرانه می باشد. ۱۳۸۷ - ۱۴۰۳
                </div>
            </div>
        </footer>

    )
}

export default Footer