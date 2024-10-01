import { ArrowRight } from "@/modules/shared/components/ui/icons";
import { useTranslation } from 'next-i18next';
import Link from "next/link"

type Props = {
    cityName?: string;
    url: string;
}

const BackToList: React.FC<Props> = props => {

    const theme2 = process.env.THEME === "THEME2";

    const { url, cityName} = props;

    const { t : tHotel } = useTranslation('hotel');

    return (
        <Link prefetch={false} href={url} className={`text-blue-700 text-sm flex gap-2 items-center ${theme2?"shadow-normal rounded-full hover:bg-blue-100 w-8 h-8 items-center justify-center":""}`}>
            <ArrowRight className="ltr:rotate-180 w-5 h-5 fill-current" /> {!theme2 && tHotel('seeHotelsIn', { city: cityName })}
        </Link>
    )
}

export default BackToList;