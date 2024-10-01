import Link from "next/link";
import { useTranslation } from "next-i18next";

const Navigation: React.FC = () => {

    const { t } = useTranslation('common');
    const linkClassName = 'whitespace-nowrap px-1.5 lg:px-5 pb-3 md:py-3 block transition-all duration-200 text-neutral-700 hover:text-blue-700 text-sm md:text-md';

    return (
        <div className="overflow-auto">
            <nav className="max-sm:mt-2 inline-flex">

                <Link
                    href='/'
                    className={linkClassName}
                >
                    صفحه اصلی
                </Link>
                <Link
                    href='/services'
                    className={linkClassName}
                >
                    خدمات ما
                </Link>
                <Link
                    href='/about-us'
                    className={linkClassName}
                >
                    درباره ما
                </Link>
                <Link
                    href='/contact-us'
                    className={linkClassName}
                >
                    تماس با ما
                </Link>

            </nav>
        </div>
    )
}

export default Navigation;