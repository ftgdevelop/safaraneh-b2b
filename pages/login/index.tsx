import LognWithPassword from "@/modules/authentication/components/LognWithPassword";
import OTPLogin from "@/modules/authentication/components/OTPLogin";
import Button from "@/modules/shared/components/ui/Button";
//import Loading from "@/modules/shared/components/ui/Loading";
import Tab from "@/modules/shared/components/ui/Tab";
import { LeftCaret, Loading, Phone } from "@/modules/shared/components/ui/icons";
import { useAppSelector } from "@/modules/shared/hooks/use-store";
import { TabItem } from "@/modules/shared/types/common";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Login : NextPage = () => {

    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

    const router = useRouter();

    useEffect(()=>{
        if (isAuthenticated){
            router.replace("/panel");
        }
    },[isAuthenticated]);

    const tabItems: TabItem[] = [
        {
          key: '1',
          label: "ورود با کلمه عبور",
          children: (
              <LognWithPassword />
          ),
        },
        {
          key: '2',
          label: "ورود با  رمز یکبار مصرف",
          children: (
            <OTPLogin 
                onBackToLoginWithPassword={()=>{debugger}}
                onCloseLogin={()=>{debugger}}
            />
          ),
        }
      ];

      

    return(
    <section className="grid grid-cols-2 min-h-screen">
        <div className=" p-5 flex flex-col items-center justify-center relative">
            
            <Tab items={tabItems} wrapperClassName="w-96" />

            {!!isAuthenticated && (
                <div className="absolute bg-white/90 text-violet-900 top-0 right-0 w-full h-full z-10 flex flex-col justify-center items-center gap-3" >
                    <Loading className="fill-violet-950 w-12 h-12 animate-spin" />
                    <p> در حال ورود به پنل ...</p>                    
                </div>
            )}

        </div>
        <div className="bg-violet-950 text-white relative py-10 flex flex-col justify-center items-center gap-10">
            <div className="absolute top-5 left-5">
                <Link
                    href="/"
                    className="transition-all outline-none border-0 text-2xs pr-4 pl-2 py-1 rounded-full text-violet-950 bg-white hover:bg-neutral-100"
                >
                    بازگشت به سایت
                    <LeftCaret className="fill-current w-5 h-5 inline-block" />
                </Link>
            </div>

            <Image
                src="/assets/images/login/hotel.svg"
                width={144}
                height={144}
                alt="hotel"
                className="block w-36 h-36"
            />

            <p>
                بیش از ۶۵۰ هزار هتل داخلی و خارجی
            </p>

            <Button href="/contact-us" className="whitespace-nowrap px-6 h-12" color="white">
                <Phone className="fill-current w-7 h-7" />
                درخواست مشاوره
            </Button>
        </div>
     </section>
    )
}

export default Login;

export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },

        }
    )
}