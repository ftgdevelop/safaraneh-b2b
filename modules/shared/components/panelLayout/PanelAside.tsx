import Link from "next/link";
import { Headset, Settings } from "../ui/icons";
import Image from "next/image";
import PanelAsideLinks from "./PanelAsideLinks";

type Props = {
    className?: string;
}
const PanelAside: React.FC<Props> = props => {
    return (
        <div className={props.className || ""}>
            <aside className="bg-white sticky top-0 flex flex-col min-h-screen justify-between border-l border-slate-300" >
                
                <PanelAsideLinks />

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