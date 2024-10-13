import { getUserById } from "@/modules/authentication/actions";
import EditUserInformation from "@/modules/authentication/components/users/EditUserInformation";
import EditUserPermissions from "@/modules/authentication/components/users/EditUserPermissions";
import UserNavigation from "@/modules/authentication/components/users/UserNavigation";
import { UserDataType } from "@/modules/authentication/types/authentication";
import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
import Tab from "@/modules/shared/components/ui/Tab";
import { UsersX } from "@/modules/shared/components/ui/icons";
import { TabItem } from "@/modules/shared/types/common";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const EditUser: NextPage = () => {

    const router = useRouter();

    const [userData, setUserData] = useState<UserDataType | undefined>(undefined)

    const userId = router.query?.userId;
    const localStorageToken = localStorage.getItem('Token');
    const localStorageTenantId = localStorage.getItem('S-TenantId');

    useEffect(() => {
        const fetchUserData = async (params: {
            tenant: number;
            token: string;
            id: number;
        }) => {
            const response: any = await getUserById({
                tenant: params.tenant,
                token: params.token,
                userId: params.id
            });
            if (response.data?.result) {
                setUserData(response.data.result)
            }
        }

        if (localStorageTenantId && localStorageToken && userId) {
            fetchUserData({
                id: +userId as number,
                tenant: +localStorageTenantId,
                token: localStorageToken
            })
        }

    }, [localStorageTenantId, localStorageToken, userId]);


    const tabItems: TabItem[] = [
        {
          key: '1',
          label: ("ویرایش اطلاعات کاربر"),
          children: (userData && localStorageTenantId && localStorageToken) ?(
            <EditUserInformation tenant={+localStorageTenantId} token={localStorageToken} userData={userData} />
          ) : null,
        },
        {
          key: '2',
          label: ("ویرایش دسترسی های کاربر"),
          children: (userData && localStorageTenantId && localStorageToken) ? (
          <EditUserPermissions tenant={+localStorageTenantId} token={localStorageToken} userId={userData.id}  />
          ) : null,
        }
      ];

      
    return (

        <div className="grid grid-cols-6 bg-neutral-100">

            <UserNavigation />

            <div className="relative col-span-5">

                <div
                    className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl"
                >
                    <UsersX className="w-8 h-8" />
                    ویرایش اطلاعات کاربر
                    {(userData?.firstName || userData?.displayName) ? <span className="font-semibold text-slate-400"> "{userData?.displayName || (userData?.firstName + " " + userData?.lastName)}" </span> : null}
                </div>

                <div className="p-4 md:p-6">

                    <BreadCrumpt 
                        hideHome
                        items={[
                            {label:"پیشخوان", link:"/panel"},
                            {label:"مدیریت کاربران", link:"/panel/users"},
                            {label:"ویرایش کاربر"}
                        ]}
                    />

                    {(userData && localStorageTenantId && localStorageToken) ? (
                        <Tab
                            items={tabItems}
                            noBorder
                            noGrowTabs
                        />
                    ) : (
                        <Skeleton />
                    )}

                </div>

            </div>

        </div>

    )

}

export default EditUser;

export const getServerSideProps: GetServerSideProps = async (context: any) => {

    return ({
        props: {
            ...await (serverSideTranslations(context.locale, ['common']))

        },
    })
}