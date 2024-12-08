import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import Button from "../ui/Button";
import { User3 } from "../ui/icons";
import { StrapiData } from "../../types/common";

type Props = {
    logo?: string;
    menuItems: StrapiData['menuItems']
}

const Header: React.FC<Props> = props => {
    
    return (
        <header className="bg-white z-30 relative">

            <div className="max-w-container mx-auto relative clearfix py-5 px-3 md:px-5">

                {!!props.logo && <Link href="/" className="block md:rtl:float-right md:ltr:float-left md:rtl:ml-5 md:ltr:mr-5" >
                    <Image src={props.logo} alt="" width={115} height={48} className="h-12 mx-auto object-contain" />
                </Link>}

                <Button 
                    href={"/panel"}
                    className="md:float-left h-12 px-4"
                >

                    <User3 className="fill-white h-7 w-7 inline-block" />
                    ورود به پنل کاربری
                </Button>

                <Navigation
                    items={props.menuItems}
                />

            </div>

        </header>
    )
}

export default Header;