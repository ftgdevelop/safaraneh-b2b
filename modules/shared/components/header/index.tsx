import Link from "next/link";
import { useTranslation } from "next-i18next";

import TravelServices from "./travelServices";
import Language from "./Language";
import Image from "next/image";
import TrackOrder from "./TrackOrder";
import { useAppSelector } from "../../hooks/use-store";
import Navigation from "./Navigation";
import Button from "../ui/Button";
import { User, User2, User3 } from "../ui/icons";

const Header: React.FC = () => {

    const { t } = useTranslation('common');

    const userIsAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    
    return (
        <header className="bg-white z-30 relative">


            <div className="max-w-container mx-auto relative clearfix py-5 px-3 md:px-5">

                <Link href="/" className="block md:rtl:float-right md:ltr:float-left md:rtl:ml-5 md:ltr:mr-5" >
                    <Image src="/assets/images/logo.svg" alt="" width={115} height={48} className="h-12 mx-auto object-contain" />
                </Link>

                <Button 
                    href={"/panel"}
                    className="md:float-left h-12 px-4"
                >

                    <User3 className="fill-white h-7 w-7 inline-block" />
                    ورود به پنل کاربری
                </Button>

                <Navigation />

            </div>

        </header>
    )
}

export default Header;