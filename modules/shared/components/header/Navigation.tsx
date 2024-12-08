import Link from "next/link";
import { useTranslation } from "next-i18next";
import { StrapiData } from "../../types/common";

type Props = {
    items: StrapiData['menuItems']
}
const Navigation: React.FC<Props> = props => {

    const { t } = useTranslation('common');
    const linkClassName = 'whitespace-nowrap px-1.5 lg:px-5 pb-3 md:py-3 block transition-all duration-200 text-neutral-700 hover:text-blue-700 text-sm md:text-md';

    return (
        <div className="overflow-auto">
            <nav className="max-sm:mt-2 inline-flex">

                {props.items.map(item => (
                    <Link
                        key={item.Text}
                        href={item.Url || ""}
                        className={linkClassName}
                    >
                        {item.Text}
                    </Link>
                ))}

            </nav>
        </div>
    )
}

export default Navigation;