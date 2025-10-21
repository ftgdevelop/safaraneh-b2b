import Link from "next/link";
import {
  Bus,
  Cip2,
  CreditCard,
  Dashboard,
  Flight2,
  Hotel,
  Plus,
  TimeUpdate,
  UsersX,
  Wallet2,
} from "../ui/icons";
import Accordion from "../ui/Accordion";

interface PanelAsideLinksProps {
  toggleModal?: () => void;
}

const PanelAsideLinks = (props: PanelAsideLinksProps) => {
  const { toggleModal } = props;

  const handleClick = () => {
    if (toggleModal) {
      toggleModal();
    }
  };

  const hasCIP = process.env.PROJECT_MODULES?.includes("CIP");
  const hasFlight = process.env.PROJECT_MODULES?.includes("DomesticFlight");
  const hasHotel = process.env.PROJECT_MODULES?.includes("DomesticHotel");

  return (
    <nav>
      <Link
        href="/panel"
        onClick={handleClick}
        className="flex items-center gap-4 py-2 px-5 border-b"
      >
        <span className="bg-slate-100 rounded-lg p-1.5">
          <Dashboard className="w-8 h-8" />
        </span>
        <div className="text-sm">
          پیشخوان
          <br />
          Dasboard
        </div>
      </Link>

      <Accordion
        disabled={!hasHotel}
        WrapperClassName="border-b"
        noBorder
        noBgContent
        content={
          <div className="text-sm leading-5 pb-4">
            <Link
              href="/panel?mode=domestichotel"
              onClick={handleClick}
              className="block py-2 hover:bg-neutral-100 px-3 rounded"
            >
              رزرو
            </Link>
            <Link
              href="/hotel/reserveList"
              onClick={handleClick}
              className="block py-2 hover:bg-neutral-100 px-3 rounded"
            >
              لیست رزرو ها
            </Link>
          </div>
        }
        title={
          <div className={`flex items-center gap-4 ${hasHotel?"":"text-slate-400"}`}>
            <span className="bg-slate-100 rounded-lg p-1.5">
              <Hotel className="w-8 h-8" />
            </span>
            <div className="text-sm">
              <div className="mb-3"> هتل </div>
              Hotel
            </div>
          </div>
        }
      />

      <Accordion
        disabled={!hasFlight}
        WrapperClassName="border-b"
        noBorder
        noBgContent
        content={
          <div className="text-sm leading-5 pb-4">
            <Link
              href="/panel?mode=domesticflight"
              onClick={handleClick}
              className="block py-2 hover:bg-neutral-100 px-3 rounded"
            >
              رزرو
            </Link>
            <Link
              href="/flight/reserveList"
              onClick={handleClick}
              className="block py-2 hover:bg-neutral-100 px-3 rounded"
            >
              لیست رزرو ها
            </Link>
          </div>
        }
        title={
          <div className={`flex items-center gap-4 ${hasFlight?"":"text-slate-400"}`}>
            <span className="bg-slate-100 rounded-lg p-1.5">
              <Flight2 className="w-8 h-8" />
            </span>
            <div className="text-sm">
              <div className="mb-3"> پرواز </div>
              Flight
            </div>
          </div>
        }
      />

      <div className="flex items-center text-slate-400 gap-4 py-2 px-5 border-b">
        <span className="bg-slate-100 rounded-lg p-1.5">
          <Bus className="w-8 h-8" />
        </span>
        <div className="text-sm">
          اتوبوس
          <br />
          Bus
        </div>
      </div>

      <Accordion
        disabled={!hasCIP}
        WrapperClassName="border-b"
        noBorder
        noBgContent
        content={
          <div className="text-sm leading-5 pb-4">
            <Link
              href="/panel?mode=cip"
              onClick={handleClick}
              className="block py-2 hover:bg-neutral-100 px-3 rounded"
            >
              رزرو
            </Link>
            <Link
              href="/cip/reserveList"
              onClick={handleClick}
              className="block py-2 hover:bg-neutral-100 px-3 rounded"
            >
              لیست رزرو ها
            </Link>
          </div>
        }
        title={
          <div className={`flex items-center gap-4 ${hasCIP?"":"text-slate-400"}`}>
            <span className="bg-slate-100 rounded-lg p-1.5">
              <Cip2 className="w-8 h-8" />
            </span>
            <div className="text-sm">
              <div className="mb-3"> تشریفات </div>
              Cip
            </div>
          </div>
        }
      />

      <Accordion
        WrapperClassName="border-b"
        noBorder
        noBgContent
        content={
          <div className="text-sm leading-5 pb-4">
            <Link
              href="/wallet"
              onClick={handleClick}
              className="py-3 hover:bg-slate-100 px-3 rounded flex gap-2 items-center"
            >
              <Wallet2 className="w-5 h-5" />
              موجودی کیف پول
            </Link>
            <Link
              href="/wallet/deposit"
              onClick={handleClick}
              className="py-3 hover:bg-slate-100 px-3 rounded flex gap-2 items-center"
            >
              <Plus className="w-5 h-5 fill-current" />
              پرداخت و افزایش اعتبار
            </Link>
            <Link
              href="/wallet/transactions"
              onClick={handleClick}
              className="py-3 hover:bg-slate-100 px-3 rounded flex gap-2 items-center"
            >
              <TimeUpdate className="w-5 h-5 fill-current" />
              تراکنش های آنلاین
            </Link>
            <Link
              href="/wallet/offline-transactions"
              onClick={handleClick}
              className="py-3 hover:bg-slate-100 px-3 rounded flex gap-2 items-center"
            >
              <CreditCard className="w-5 h-5 fill-current" />
              تراکنش های آفلاین
            </Link>
          </div>
        }
        title={
          <div className="flex items-center gap-4">
            <span className="bg-slate-100 rounded-lg p-1.5">
              <Wallet2 className="w-8 h-8" />
            </span>
            <div className="text-sm">
              <div className="mb-3"> کیف پول </div>
              Wallet
            </div>
          </div>
        }
      />

      <Link
        href="/users"
        onClick={handleClick}
        className="flex items-center gap-4 py-2 px-5 border-b"
      >
        <span className="bg-slate-100 rounded-lg p-1.5">
          <UsersX className="w-8 h-8" />
        </span>
        <div className="text-sm">
          مدیریت کاربران
          <br />
          User Management
        </div>
      </Link>
    </nav>
  );
};
export default PanelAsideLinks;
