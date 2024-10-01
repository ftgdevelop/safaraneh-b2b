import Link from "next/link";
import { Headset, Bell } from "../ui/icons";
import HeaderBalance from "../../../authentication/components/panel/HeaderBalance";
import HeaderProfile from "@/modules/authentication/components/panel/HeaderProfile";

const PanelHeader : React.FC = () => {
    return (
        <header className="bg-white flex items-center gap-3 justify-end py-3 px-5">
            <Link href="/contact-us" className="transition-all hover:bg-gray-100 p-2 rounded"  >
                <Headset className="w-5 h-5" />
            </Link>
            <button type="button"  className="transition-all hover:bg-gray-100 p-2 rounded" >
                <Bell className="w-5 h-5" />
            </button>
            
            
            <HeaderBalance />

            <HeaderProfile />

        </header>
    )
}

export default PanelHeader;