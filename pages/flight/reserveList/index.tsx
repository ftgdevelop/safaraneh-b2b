import {Statuse} from "@/modules/domesticHotel/types/hotel";
import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import {
  ErrorCircle,
  LeftCaret,
  List,
  RightCaret,
  Filter,
  Close,
} from "@/modules/shared/components/ui/icons";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useEffect, useState } from "react";
import Button from "@/modules/shared/components/ui/Button";
import { getTenantReservesDomesticFlight } from "@/modules/flights/actions";
import { FlightReserveItemType } from "@/modules/flights/types/flights";
import FlightReserveListItem from "@/modules/flights/components/reserveList/FlightReserveListItem";
import ReserveListSearchForm from "@/modules/flights/components/reserveList/ReserveListSearchForm";

const ReserveList: NextPage = () => {
  const [page, setPage] = useState<number>(1);

  const [filterParams, setFilterParams] = useState<{
    creationTimeFrom: string;
    creationTimeTo: string;
    DepartureTimeFrom: string;
    DepartureTimeTo: string;
    reserveId: string;
    email: string;
    lasName: string;
    phoneNumber: string;
    status: Statuse[];
  }>({
    DepartureTimeFrom: "",
    DepartureTimeTo: "",
    creationTimeFrom: "",
    creationTimeTo: "",
    email: "",
    lasName: "",
    phoneNumber: "",
    reserveId: "",
    status: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [reserves, setReserves] = useState<FlightReserveItemType[]>([]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [delayedOpen, setDelayedOpen] = useState<boolean>(false);

  const localStorageToken = localStorage.getItem("Token");
  const localStorageTenantId = localStorage.getItem("S-TenantId");

  useEffect(() => {
    const fetchReserves = async (
      params: {
        page: number;
        filter: {
          Email?: string;
          PhoneNumber?: string;
          LastName?: string;
          ReserveId?: number;
          CreationTimeFrom?: string;
          CreationTimeTo?: string;
          DepartureTimeFrom: string;
          DepartureTimeTo: string;
          Statuses?: Statuse[];
        };
      },
      tenant: number,
      token: string,
    ) => {
      setLoading(true);
      setReserves([]);

      let queryParameters: string = `MaxResultCount=10&SkipCount=${
        (params.page - 1) * 10
      }`;

      if (params.filter.ReserveId) {
        queryParameters += `&ReserveId=${params.filter.ReserveId}`;
      }
      if (params.filter.DepartureTimeFrom) {
        queryParameters += `&DepartureTimeFrom=${params.filter.DepartureTimeFrom}`;
      }
      if (params.filter.DepartureTimeTo) {
        queryParameters += `&DepartureTimeTo=${params.filter.DepartureTimeTo}`;
      }
      if (params.filter.CreationTimeTo) {
        queryParameters += `&CreationTimeTo=${params.filter.CreationTimeTo}`;
      }
      if (params.filter.CreationTimeFrom) {
        queryParameters += `&CreationTimeFrom=${params.filter.CreationTimeFrom}`;
      }
      if (params.filter.LastName) {
        queryParameters += `&LastName=${params.filter.LastName}`;
      }
      if (params.filter.Email) {
        queryParameters += `&Email=${params.filter.Email}`;
      }
      if (params.filter.Statuses?.length) {
        queryParameters += `&${params.filter.Statuses.map(
          (s) => `Statuses=${s}`,
        ).join("&")}`;
      }
      if (params.filter.PhoneNumber) {
        queryParameters += `&PhoneNumber=${params.filter.PhoneNumber}`;
      }

      const response: any = await getTenantReservesDomesticFlight(
        queryParameters,
        {
          tenant: tenant,
          token: token,
          currencyType: "IRR",
          acceptLanguage: "fa-IR",
        },
      );

      if (response) {
        setReserves(response.data?.result?.items);
        setTotal(response.data?.result?.totalCount || 0);
      }

      setLoading(false);
    };

    if (localStorageToken && localStorageTenantId) {
      fetchReserves(
        {
          page: page,
          filter: {
            ReserveId: +filterParams.reserveId,
            DepartureTimeFrom: filterParams.DepartureTimeFrom,
            DepartureTimeTo: filterParams.DepartureTimeTo,
            CreationTimeFrom: filterParams.creationTimeFrom,
            CreationTimeTo: filterParams.creationTimeTo,
            Email: filterParams.email,
            LastName: filterParams.lasName,
            PhoneNumber: filterParams.phoneNumber,
            Statuses: filterParams.status,
          },
        },
        +localStorageTenantId,
        localStorageToken,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    localStorageToken,
    localStorageTenantId,
    filterParams.DepartureTimeFrom,
    filterParams.DepartureTimeTo,
    filterParams.creationTimeFrom,
    filterParams.creationTimeTo,
    filterParams.email,
    filterParams.lasName,
    filterParams.phoneNumber,
    filterParams.status.length,
    filterParams.reserveId,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    filterParams.DepartureTimeFrom,
    filterParams.DepartureTimeTo,
    filterParams.creationTimeFrom,
    filterParams.creationTimeTo,
    filterParams.email,
    filterParams.lasName,
    filterParams.phoneNumber,
    filterParams.status.length,
    filterParams.reserveId,
  ]);

  useEffect(() => {
    if (filterOpen) {
      setDelayedOpen(true);
    }
  }, [filterOpen]);

  useEffect(() => {
    if (!delayedOpen) {
      setTimeout(() => {
        setFilterOpen(false);
      }, 300);
    }
  }, [delayedOpen]);

  useEffect(() => {
    if (filterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [filterOpen]);

  const previousPage = () => {
    setPage((prevPage) => {
      if (prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  const nextPage = () => {
    setPage((prevPage) => {
      if (prevPage < total / 10) {
        return prevPage + 1;
      }
      return prevPage;
    });
  };

  const pageBtnClassName =
    "inline-flex outline-none bg-white border align-middle items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 p-3 px-3 gap-1 ml-1.5";

  let content = reserves?.length ? (
    reserves.map((reserve) => (
      <FlightReserveListItem reserve={reserve} key={reserve.id} />
    ))
  ) : (
    <div className="p-10 text-center">
      <ErrorCircle className="block mx-auto mb-2 w-16 h-16 fill-neutral-300" />
      رزروی با مشخصات جستجو یافت نشد!
    </div>
  );

  if (loading) {
    content = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((a) => (
      <div
        key={a}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5 bg-white border rounded-xl p-5 mb-5"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((x) => (
          <Skeleton className="h-5 w-3/4" key={x} />
        ))}
      </div>
    ));
  }

  return (
    <>
      <Head>
        <title> لیست رزرو پرواز ها </title>
      </Head>
      <div className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl">
        <List className="w-8 h-8" />
        لیست رزرو پرواز ها
      </div>
      <section className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <BreadCrumpt
          wrapperClassName="lg:col-span-4 xl:col-span-5"
          hideHome
          items={[
            { label: "پیشخوان", link: "/panel" },
            { label: "لیست رزرو پرواز ها" },
          ]}
        />
        <div className="w-full col-span-1">
          <div className="w-full lg:hidden">
            <Button
              className="flex w-full justify-between items-center p-4"
              color="white"
              type="button"
              onClick={()=>{setFilterOpen(true)}}
            >
              <Filter className="w-8 h-8 fill-current" />
              <span>فیلتر</span>
            </Button>
          </div>

          <div
            className={`fixed lg:z-10 top-0 right-0 bottom-0 z-50 w-5/6 bg-white border  py-5 transition-transform duration-300
                lg:sticky lg:top-20 lg:w-auto lg:rounded-xl lg:translate-x-0
                ${
                  filterOpen
                    ? "max-lg:translate-x-0"
                    : "max-lg:translate-x-full"
                }`}
            style={{ WebkitOverflowScrolling: "touch" }}
            role="dialog"
            aria-modal={filterOpen ? "true" : "false"}
          >
            <div className="lg:hidden sticky top-0 bg-white z-50 flex w-full justify-end">
              <button
                className="p-2"
                type="button"
                aria-label="Close filters"
                onClick={()=>{setDelayedOpen(false)}}
              >
                <Close className="h-8 w-8 fill-current" />
              </button>
            </div>

            <div
              className="
              overflow-y-auto 
              max-h-[calc(100vh-4rem)] 
              lg:max-h-full 
              lg:overflow-visible  
              pb-8 
              px-5
              [direction:ltr]
              scrollbar-thin 
              scrollbar-thumb-gray-100 
              scrollbar-track-transparent 
              hover:scrollbar-thumb-gray-400
            "
            >
              <div className="[direction:rtl]">
                <ReserveListSearchForm
                  submitHandle={setFilterParams}
                  closeModal={()=>{setDelayedOpen(false)}}
                />
              </div>
            </div>
          </div>

          {filterOpen && (
            <div
              className="fixed inset-0 z-40 lg:hidden bg-black/60"
              onClick={()=>{setDelayedOpen(false)}}
              aria-hidden="true"
            />
          )}
        </div>

        <div className="lg:col-span-3 xl:col-span-4 col-span-1">
          {content}

          <div className="flex justify-between">
            <div>
              <button
                type="button"
                onClick={previousPage}
                className={pageBtnClassName}
                disabled={page === 1}
              >
                <RightCaret className="w-5 h-5 fill-current" />
                قبلی
              </button>
              <button
                type="button"
                onClick={nextPage}
                className={pageBtnClassName}
                disabled={page * 10 >= total}
              >
                بعدی
                <LeftCaret className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReserveList;

export async function getStaticProps(context: any) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common", "payment"])),
    },
  };
}
