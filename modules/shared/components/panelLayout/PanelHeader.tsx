import Link from "next/link";
import { Headset, Bell} from "../ui/icons";
import HeaderBalance from "../../../authentication/components/panel/HeaderBalance";
import HeaderProfile from "@/modules/authentication/components/panel/HeaderProfile";
import MobileNav from "./MobileNav";

const PanelHeader: React.FC = () => {

    return (
        <>
            <header className="sticky top-0 bg-white flex items-center gap-3 justify-between py-3 px-5 border-b relative z-20">

                <MobileNav />
                
                <div className="flex items-center gap-3">
                    <Link href="/contact-us" className="transition-all hover:bg-gray-100 p-2 rounded"  >
                        <Headset className="w-5 h-5" />
                    </Link>
                    <button type="button" className="transition-all hover:bg-gray-100 p-2 rounded hidden md:block" >
                        <Bell className="w-5 h-5" />
                    </button>

                    <HeaderBalance />

                    <HeaderProfile />
                </div>


            </header>

        </>
    )
}

export default PanelHeader;