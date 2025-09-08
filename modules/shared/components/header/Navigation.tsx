import Link from "next/link";
import { useTranslation } from "next-i18next";
import { StrapiData } from "../../types/common";

type Props = {
  items: StrapiData["menuItems"];
  mobile?: boolean;
};

const Navigation: React.FC<Props> = ({ items, mobile }) => {
  const { t } = useTranslation("common");

  const linkClassName = mobile
    ? "block py-2 text-neutral-700 hover:text-blue-700 text-base"
    : "whitespace-nowrap px-1.5 lg:px-5 pb-3 md:py-3 block transition-all duration-200 text-neutral-700 hover:text-blue-700 text-sm md:text-md";

  return (
    <nav className={mobile ? "flex flex-col space-y-2" : "inline-flex"}>
      {items.map((item) => (
        <Link key={item.Text} href={item.Url || ""} className={linkClassName}>
          {item.Text}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
