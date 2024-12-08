import Button from "@/modules/shared/components/ui/Button";
import { Phone, User3 } from "@/modules/shared/components/ui/icons";

type Props = {
    title?: string;
    subtitle?: string;
    description?: string;
}
const Hero: React.FC<Props> = props => {
    return (
        <section className="bg-violet-950 text-white py-14 md:py-28 flex flex-col gap-8 md:gap-14 items-center">
            <div className="bg-white/10 rounded-full py-2 px-5 md:px-7 text-xs sm:text-sm">
                {props.subtitle || ""}
            </div>
            <div className="bg-hero text-center self-stretch mx-5">
                <h1 className="text-[52px] md:text-[72px] font-bold mb-14 md:mb-24">{props.title || ""}</h1>
                <p className="max-w-2xl mx-auto px-5 text-[12px] md:text-[14px] font-[200] leading-6 md:leading-8">
                    {props.description || ""}
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-[10px] mx-5">
                <Button href="/panel" className="px-6 h-12 whitespace-nowrap" prefetch={false}>
                    <User3 className="fill-current w-7 h-7" />
                    ورود به پنل کاربری
                </Button>
                <Button href="/contact-us" className="whitespace-nowrap px-6 h-12" color="white">
                    <Phone className="fill-current w-7 h-7" />
                    درخواست مشاوره
                </Button>

            </div>

        </section>
    )
}

export default Hero;