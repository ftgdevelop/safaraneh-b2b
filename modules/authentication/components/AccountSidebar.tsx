import { SetStateAction } from 'react';
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { CalendarBeautiful, UserBeautiful, Close, EditBeautiful, LeftCaret, WalletBeautiful, User, InfoCircle, User2, Lock2, List, CreditCard, Settings, CheckTag } from '@/modules/shared/components/ui/icons';
import { useAppSelector } from '@/modules/shared/hooks/use-store';
import Logout from './Logout';
import Loading from '@/modules/shared/components/ui/Loading';
import { numberWithCommas } from '@/modules/shared/helpers';
import Image from 'next/image';

type Props = {
    setDelayedOpen?: (value: SetStateAction<boolean>) => void;
    isInModal?: boolean;
    logoUrl?: string;
}

const AccountSidebar: React.FC<Props> = props => {

    const { setDelayedOpen } = props;

    const { t } = useTranslation('common');
    
    const theme2 = process.env.THEME === "THEME2";
    const theme1 = process.env.THEME === "THEME1";

    const balance = useAppSelector(state => state.authentication.balance);
    const balanceLoading = useAppSelector(state => state.authentication.balanceLoading);

    const user = useAppSelector(state => state.authentication.user);

    let confirmMark: React.ReactNode;

    if (user?.isEmailConfirmed || user?.isPhoneNumberConfirmed) {
        confirmMark = null;
    } else {
        confirmMark = (
            <InfoCircle className='w-5 h-5 fill-amber-500' />
        )
    }

    const welcomeBoxClassNames : string[] = [];

    if (theme1){
        welcomeBoxClassNames.push("text-center");
        if (!props.isInModal) {
            welcomeBoxClassNames.push("bg-white mb-4 rounded-md border border-neutral-300");
        }
    }

    const sidebarItems : {
        url:string;
        icon: React.ReactNode;
        title: string;
        description?: string;
    }[] = [
        {
            url:"/myaccount/profile" ,
            icon: <User className='w-7 h-7 fill-current' /> ,
            title: "پروفایل" ,
            description: t('visit-edit-account-informaion') 
        },
        // {
        //     url:"/myaccount/wallet" ,
        //     icon: <CreditCard className='w-7 h-7 fill-current' /> ,
        //     title: "کیف پول" ,
        //     description: "مشاهده و افزایش اعتبار کیف پول" 
        // },
        {
            url:"/myaccount/booking" ,
            icon: <List className='w-7 h-7 fill-current rtl:mirror' /> ,
            title: t('my-reserve') ,
            description: "مشاهده جزییات رزروهای قبلی" 
        },
        {
            url:"/myaccount/password" ,
            icon: <Settings className='w-7 h-7 fill-current' /> ,
            title: "کلمه عبور" ,
            description: "تغییر کلمه عبور" 
        }
    ];

    return (
        <>
            {!!props.isInModal && <div className='flex justify-between mb-2 border-b border-neutral-200'>
                <button
                    className='p-3'
                    type='button'
                    aria-label={t('close')}
                    onClick={() => {
                        if (setDelayedOpen) {
                            setDelayedOpen(false)
                        }
                    }}
                >
                    <Close className='w-6 h-6 fill-neutral-400' />
                </button>
                <Link
                    href="/myaccount/profile"
                    className='text-sm hover:text-blue-600 p-3 px-5'
                >
                    پروفایل
                </Link>
            </div>}

            <div className={props.isInModal ? 'p-4 sm:p-5' : ""}>

                <div className={welcomeBoxClassNames.join(" ")}>

                    {!!theme1 && <UserBeautiful className='inline-block sm:my-8' />}

                    <h5 className={`text-lg ${theme2?"font-bold sm:text-3xl mt-5 mb-1":"font-semibold mb-2 sm:mb-5"}`}>
                        {t("hello")} {user?.firstName || t('dear-user')}
                    </h5>

                    {user?.emailAddress ? <div className={`font-sans ${theme1?"mb-2":theme2?"mb-1 text-sm":""}`}>
                        {user.emailAddress}
                    </div> : user?.phoneNumber && theme2 ? (
                        <div dir="ltr" className={`rtl:text-right font-sans ${theme1?"mb-2":theme2?"mb-1 text-sm":""}`}>
                            {user.phoneNumber}
                        </div>
                    ): null}

                    {!!theme1 && <Link
                        href="/myaccount/profile"
                        className='text-xs text-red-600 inline-flex items-center gap-1 mb-2 sm:mb-10'
                    >
                        <EditBeautiful className='block fill-current' /> {t("edit-profile")}
                    </Link>}

                </div>

                    {theme2  &&(
                        <Link
                            href="/myaccount/wallet"
                            className='bg-white border border-neutral-300 p-3 pt-6 mt-6 mb-4 rounded-xl block text-xs text-center'
                         >
                            {balanceLoading ? <Loading /> :(
                                <>
                                    موجودی کیف پول
                                    <div className='text-2xl font-semibold mb-5 mt-1'>
                                        {balance ? numberWithCommas(balance) : 0} ریال
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <p>
                                            مشاهده و افزایش موجودی کیف پول
                                        </p>
                                        <LeftCaret className='w-5 h-5 fill-current' />
                                    </div>
                                </>
                            )}
                        </Link>
                    )}

                {!!(user?.emailAddress && !user.isEmailConfirmed) && (
                    <div className={`text-xs flex items-center gap-1 mb-2 ${theme1?"bg-[#f5e9ca] px-3 py-2 rounded border border-orange-300":theme2?"text-orange-400":""}`}>
                        <InfoCircle className='w-5 h-5 fill-orange-400' />
                        {t("confirm-email")}
                    </div>
                )}

                {theme2 ? (
                    <div className='mt-5'>
                        <p className='text-xs mb-4'>
                            اطلاعات کاربری و اولویت ها ترجیحات خود را مدیریت کنید.
                        </p>
                        {!!props.logoUrl&& <Image
                            src={props.logoUrl}
                            alt='logo'
                            width={80}
                            height={80}
                            className='mb-4' 
                        /> }

                        {sidebarItems.map(item => (
                            <Link
                                key={item.url}
                                href={item.url}
                                className="bg-white border border-neutral-300 flex items-center justify-between p-3 mb-4 rounded-xl"
                            >
                                <div className='flex items-center gap-3 whitespace-nowrap'>
                                    {item.icon}
            
                                    <div>
                                        {item.title}
            
                                        {!!item.description && <p className={`text-2xs ${theme1?"text-neutral-400 mt-1":""}`}>
                                            {item.description}
                                        </p>}
                                    </div>
            
                                </div>
            
                                <LeftCaret className={`w-6 h-6 ${theme2?"fill-current":"fill-blue-600"}`} />
            
                            </Link>
                        ))}
                        <div className='py-5 text-center'>
                            <Logout
                                className='text-blue-500 text-md hover:bg-blue-50 rounded-full inline-block pb-1 px-10'
                                closeModal={() => {
                                    if (setDelayedOpen) {
                                        setDelayedOpen(false)
                                    }
                                }}
                            />
                        </div>
                    </div>
                ):(
                    <>
                        <Link
                            href="/myaccount/booking"
                            className='bg-white border border-neutral-300 rounded-md flex items-center justify-between p-3 mb-4'
                        >
                            <div className='flex items-center gap-3 whitespace-nowrap'>
                                <CalendarBeautiful className='w-8 h-8' />
                                {t('my-reserve')}
                            </div>

                            <LeftCaret className='w-6 h-6 fill-blue-600' />

                        </Link>

                        <Link
                            href="/myaccount/wallet"
                            className='bg-white border border-neutral-300 rounded-md flex items-center justify-between p-3 mb-4'
                        >
                            <div className='flex items-center gap-3 whitespace-nowrap'>
                                <WalletBeautiful className='w-8 h-8' />
                                کیف پول
                            </div>

                            <LeftCaret className='w-6 h-6 fill-blue-600' />

                        </Link>

                        <div className='bg-white border border-neutral-300 rounded-md px-3'>
                            <Link
                                href="/myaccount/profile"
                                className='flex items-center justify-between py-3'
                            >
                                <div className='flex items-center gap-3 whitespace-nowrap'>
                                    <User2 className='w-8 h-8' />
                                    <div>
                                        پروفایل
                                        <p className='text-2xs text-neutral-400 mt-1'>
                                            {t('visit-edit-account-informaion')}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center'>
                                    {confirmMark}
                                    <LeftCaret className='w-6 h-6 fill-blue-600' />
                                </div>

                            </Link>

                            <hr />

                            <Link
                                href="/myaccount/password"
                                className='flex items-center justify-between py-3'
                            >
                                <div className='flex items-center gap-3 whitespace-nowrap'>
                                    <Lock2 className='w-8 h-8' />
                                    <div>
                                        کلمه عبور
                                        <p className='text-2xs text-neutral-400 mt-1'>
                                            تغییر کلمه عبور
                                        </p>
                                    </div>
                                </div>

                                <LeftCaret className='w-6 h-6 fill-blue-600' />

                            </Link>

                            <hr />

                            <div className='p-6 text-center'>
                                <Logout
                                    closeModal={() => {
                                        if (setDelayedOpen) {
                                            setDelayedOpen(false)
                                        }
                                    }}
                                />
                            </div>

                        </div>
                    </>
                )}              

            </div>
        </>
    )
}

export default AccountSidebar;