import { getUsers } from "@/modules/authentication/actions";
import UserFilterForm from "@/modules/authentication/components/users/UserFilterForm";
import UserItem from "@/modules/authentication/components/users/UserItem";
import UserNavigation from "@/modules/authentication/components/users/UserNavigation";
import { UserItemType } from "@/modules/authentication/types/authentication";
import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import { InfoCircle, LeftCaret, Plus, RightCaret, UsersX } from "@/modules/shared/components/ui/icons";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useEffect, useState } from "react";

const Users: NextPage = () => {

    const [users, setUsers] = useState<UserItemType[] | undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [filterKeyword, setFilterKeyword] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<"" | "active" | "deactive">("");

    const fetchUsers = async (params: {
        MaxResultCount: number;
        SkipCount: number;
        tenant: number;
        token: string;
        Keyword: string;
        state: "" | "active" | "deactive";
    }) => {

        setLoading(true);

        let queries = `MaxResultCount=${params?.MaxResultCount}&SkipCount=${params?.SkipCount}`;

        if (params.Keyword.trim().length) {
            queries += `&Keyword=${params.Keyword}`;
        }

        if (params.state === "active") {
            queries += `&IsActive=true`;
        }
        if (params.state === "deactive") {
            queries += `&IsActive=false`;
        }

        const response: any = await getUsers({
            queries: queries,
            tenant: params.tenant,
            token: params?.token
        });

        setTotalItems(response.data?.result?.totalCount);
        setUsers(response.data?.result?.items);
        setLoading(false);

    }

    const localStorageToken = localStorage.getItem('Token');
    const localStorageTenantId = localStorage.getItem('S-TenantId');

    useEffect(() => {

        if (localStorageToken && localStorageTenantId) {

            const parameters = {
                MaxResultCount: 10,
                SkipCount: (page - 1) * 10,
                tenant: +localStorageTenantId,
                token: localStorageToken,
                Keyword: filterKeyword,
                state: filterStatus
            };

            fetchUsers(parameters);
        }

    }, [page, localStorageToken, localStorageTenantId, filterKeyword, filterStatus]);

    useEffect(() => {
        setPage(1);
    }, [filterKeyword, filterStatus]);

    const resetFilter = () => {
        setFilterStatus("");
        setFilterKeyword("");
    }

    const filterUsers = (values: {
        Status: "" | "active" | "deactive";
        Keyword: string;
    }) => {
        setFilterStatus(values.Status);
        setFilterKeyword(values.Keyword);
    }

    const tableCellClass = "p-4 text-right font-normal border-neutral-200 transition-all"

    const previousPage = () => {
        setPage(prevPage => {
            if (prevPage > 1) {
                return (prevPage - 1)
            }
            return prevPage
        })
    }
    const nextPage = () => {
        setPage(prevPage => {
            if (prevPage < totalItems / 10) {
                return (prevPage + 1)
            }
            return prevPage
        })
    }

    const pageBtnClassName = "inline-flex outline-none bg-white border align-middle items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 p-3 px-3 gap-1 ml-1.5";

    const loadingItems: number[] = [];
    for (let i = 0; i < 10; i++) {
        loadingItems.push(i)
    };

    let tableItems: React.ReactNode = users?.map((user, index) => (
        <UserItem
            key={user.id}
            user={user}
            index={index + ((page - 1) * 10) + 1}
        />
    ));
    if (loading) {
        tableItems = loadingItems.map(a => (
            <tr key={a}>
                {[1, 2, 3, 4, 5, 6].map(x => (
                    <td className={`${tableCellClass} border-t`} key={x} >
                        <Skeleton className="h-4 w-3/4 my-1" />
                    </td>
                ))}
            </tr>
        ))
    } else if (!users?.length) {
        tableItems = <tr>
            <td colSpan={6} className="py-10 border-t text-center">
                <InfoCircle className="inline-block w-6 h-6 fill-current ml-5" />
                کاربری با مشخصات جستجو یافت نشد
            </td>
        </tr>
    }


    if (!tableItems) {
        return (
            null
        )
    }

    return (

        <div className="grid grid-cols-6 bg-neutral-100">
            
            <UserNavigation />

            <div className="relative col-span-5">

                <div
                    className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl"
                >
                    <UsersX className="w-8 h-8" />
                    مدیریت کاربران
                </div>

                <div className="p-4 md:p-6">
                    <BreadCrumpt
                        hideHome
                        items={[
                            {label:"پیشخوان", link:"/panel"},
                            {label:"مدیریت کاربران"}
                        ]}
                    />

                    <div className="bg-white border rounded-xl p-5 flex justify-between gap-5 mb-5 items-end">

                        <UserFilterForm
                            submitHandler={filterUsers}
                            resetHandler={resetFilter}
                        />
                        <Link
                            href='/panel/users/create'
                            className="bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded text-sm text-white block"
                        >
                            <Plus className="inline-block fill-current w-7 h-7" /> ایجاد کاربر جدید
                        </Link>

                    </div>

                    <div className="bg-white p-5 border rounded-2xl mb-5">
                        <table className="w-full text-sm text-neutral-700">
                            <thead>

                                <tr className="text-muted-foreground">
                                    <th className={`${tableCellClass} w-10 xl:w-1/12`}> # </th>
                                    <th className={`${tableCellClass} w-12 xl:w-1/5`}> نام </th>
                                    <th className={`${tableCellClass} w-10 xl:w-1/5`}> نام خانوادگی </th>
                                    <th className={`${tableCellClass} w-14 xl:w-1/5`}> نام کاربری </th>
                                    <th className={`${tableCellClass} w-16 xl:w-1/5 `}> وضعیت </th>
                                    <th className={`${tableCellClass} w-1/3 xl:w-1/5`}> عملیات </th>
                                </tr>

                            </thead>
                            <tbody>
                                {tableItems}
                            </tbody>
                        </table>

                    </div>
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
                        disabled={page * 10 >= totalItems}
                    >
                        بعدی
                        <LeftCaret className="w-5 h-5 fill-current" />
                    </button>
                </div>

            </div>

        </div>

    )

}

export default Users;
export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },

        }
    )
}