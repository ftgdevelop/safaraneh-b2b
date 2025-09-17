import { getReserveFromCoordinator } from "@/modules/shared/actions";
import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import Button from "@/modules/shared/components/ui/Button";
import Loading from "@/modules/shared/components/ui/Loading";
import ModalPortal from "@/modules/shared/components/ui/ModalPortal";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import {
  CreditCard,
  Plus,
  TikCircle,
  TimeUpdate,
  Wallet2,
} from "@/modules/shared/components/ui/icons";
import { numberWithCommas, returnCurrency } from "@/modules/shared/helpers";
import {
  useAppDispatch,
  useAppSelector,
} from "@/modules/shared/hooks/use-store";
import { setAlertModal } from "@/modules/shared/store/alertSlice";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Wallet: NextPage = () => {
  const [coordinatorLoading, setCoordinatorLoading] = useState(false);
  const [coordinator, setCoordinator] = useState<{
    type: string;
    salePrice: number;
    currency: { type: string };
  }>();

  const balances = useAppSelector((state) => state.authentication.balances);
  const balanceLoading = useAppSelector(
    (state) => state.authentication.balanceLoading,
  );

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { query } = router;
  const status = query.status;

  const pathArray = router.asPath.split("?")[1]?.split("#")[0].split("&");

  const username: string | undefined = pathArray
    ?.find((item) => item.includes("bookingUserName="))
    ?.split("bookingUserName=")[1];
  const reserveId: string | undefined = pathArray
    ?.find((item) => item.includes("bookingId="))
    ?.split("bookingId=")[1];

  let chargeDepositUrl = "/wallet/deposit";
  if (username && reserveId) {
    chargeDepositUrl += `?reserveId=${reserveId}&username=${username}`;
  }

  useEffect(() => {
    if (status === "0") {
      dispatch(
        setAlertModal({
          type: "error",
          title: "افزایش اعتبار ناموفق بود",
          message:
            "در صورت برداشت وجه از حساب بانکی، مبلغ برداشت شده تا ۴۸ ساعت آینده به حساب شما برگشت داده خواهد شد.",
          isVisible: true,
          //closeAlertLink: "",
          closeButtonText: "بستن",
        }),
      );
    } else if (status === "1") {
      const localStorageTenant = localStorage?.getItem("S-TenantId");

      if (username && reserveId && localStorageTenant) {
        const fetchReservePrice = async () => {
          setCoordinatorLoading(true);
          const response: any = await getReserveFromCoordinator({
            tenant: +localStorageTenant,
            reserveId: reserveId,
            username: username,
          });
          if (response?.data?.result) {
            setCoordinator(response.data.result);
          }
          setCoordinatorLoading(false);
        };

        fetchReservePrice();
      } else {
        dispatch(
          setAlertModal({
            type: "success",
            title: "افزایش اعتبار انجام شد",
            message: "اعتبار موجودی کیف شما با موفقیت افزایش یافت.",
            isVisible: true,
            //closeAlertLink: "",
            closeButtonText: "بستن",
          }),
        );
      }
    }
  }, [status]);

  let continueBookingModalVisibility = false;
  if (status && status === "1" && reserveId && username) {
    continueBookingModalVisibility = true;
  }
  let bookingBalance = 0;
  let bookingPrice = 0;
  let bookingCurrency = "";
  if (coordinator) {
    bookingCurrency = coordinator.currency?.type;
    bookingPrice = coordinator.salePrice;
    bookingBalance =
      balances?.find((item) => item.currencyType === bookingCurrency)?.amount ||
      0;
  }

  return (
    <>
      <Head>
        <title> کیف پول</title>
      </Head>

      <ModalPortal
        show={continueBookingModalVisibility}
        selector="modal_portal"
      >
        <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-white max-sm:mx-3 rounded-xl px-5 pt-10 pb-12 w-full max-w-md">
            {coordinatorLoading || balanceLoading ? (
              <Loading />
            ) : (
              <>
                <h5 className="font-semibold text-green-600 mb-6">
                  <TikCircle className="w-7 h-7 inline-block fill-current ml-2" />
                  اعتبار موجودی کیف شما با موفقیت افزایش یافت.
                </h5>

                <div className="flex justify-between mb-3 text-sm">
                  <span>موجودی کیف پول:</span>
                  <span className="font-semibold">
                    {numberWithCommas(bookingBalance)}
                    {bookingCurrency === "IRR" ? "ریال" : bookingCurrency}
                  </span>
                </div>

                <div className="flex justify-between mb-4 text-sm">
                  <span>مبلغ مورد نیاز برای ادامه خرید:</span>
                  <span className="font-semibold">
                    {numberWithCommas(bookingPrice)}
                    {bookingCurrency === "IRR" ? "ریال" : bookingCurrency}
                  </span>
                </div>

                {bookingPrice > bookingBalance ? (
                  <>
                    <p className="text-red-500 text-sm mb-5">
                      موجودی کیف پول شما هنوز کمتر از مبلغ پرداخت است. لطفا
                      اعتبار کیف پول خود را افزایش دهید.
                    </p>

                    <Button
                      href={`/wallet/deposit?reserveId=${reserveId}&username=${username}`}
                      className="h-10 w-40 mx-auto"
                    >
                      <Plus className="w-7 h-7 fill-current inline-block" />
                      افزایش اعتبار
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-red-500 text-sm mb-5">
                      موجودی کیف پول شما بیشتر از مبلغ مورد نیاز پرداخت است.
                    </p>

                    <Button
                      href={`/payment?reserveId=${reserveId}&username=${username}`}
                      className="h-10 w-40 mx-auto"
                    >
                      ادامه خرید
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </ModalPortal>

      <div className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl">
        <Wallet2 className="w-8 h-8" />
        کیف پول
      </div>
      <section className="p-4 md:p-6">
        <BreadCrumpt
          wrapperClassName="mb-4"
          hideHome
          items={[{ label: "پیشخوان", link: "/panel" }, { label: "کیف پول" }]}
        />

        <div className="bg-white rounded-xl border p-5">
          <div className="bg-white rounded-xl border m-5 p-8 md:w-520 md:mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold mb-8 md:mb-12">
              کیف پول
            </h3>
            <div className="flex justify-between">
              <span>موجودی</span>

              {balanceLoading ? (
                <Skeleton className="mt-2 w-24" />
              ) : (
                <div>
                  {balances
                    .filter((b) => b.amount)
                    ?.map((b) => (
                      <>
                        {numberWithCommas(b.amount)}
                        {returnCurrency(b.currencyType)} <br />
                      </>
                    ))}
                </div>
              )}
            </div>

            <hr className="my-5" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link
                href={chargeDepositUrl}
                className="group hover:bg-slate-100 p-5 rounded-xl flex flex-col gap-3 items-center col-span-2 border"
              >
                <span className="block bg-slate-100 p-1.5 rounded-xl group-hover:bg-slate-200">
                  <Plus className="w-7 h-7 fill-current" />
                </span>
                پرداخت و افزایش اعتبار
              </Link>
              <Link
                href="/wallet/transactions"
                className="py-3 hover:bg-slate-100 px-3 flex flex-col gap-2 justify-center max-md:col-span-2 items-center border rounded-xl"
              >
                <TimeUpdate className="w-5 h-5 fill-current" />
                تراکنش های آنلاین
              </Link>
              <Link
                href="/wallet/offline-transactions"
                className="py-3 hover:bg-slate-100 px-3 flex flex-col gap-2 justify-center items-center max-md:col-span-2 border rounded-xl"
              >
                <CreditCard className="w-5 h-5 fill-current" />
                تراکنش های آفلاین
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Wallet;

export async function getStaticProps(context: any) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
}
