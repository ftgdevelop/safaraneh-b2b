import PasswordChangeForm from "@/modules/authentication/components/PasswordChangeForm";
import UserNavigation from "@/modules/authentication/components/users/UserNavigation";
import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import { UserX } from "@/modules/shared/components/ui/icons";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ChangePassword: NextPage = () => {

    return (

        <div className="grid grid-cols-6 bg-neutral-100 min-h-screen">

            <UserNavigation />

            <div className="relative col-span-5">

                <div className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl" >
                    <UserX className="w-8 h-8" />
                    تغییر کلمه عبور
                </div>

                <div className="p-4 md:p-6">

                    <BreadCrumpt
                        wrapperClassName="mb-4"
                        hideHome
                        items={[
                            { label: "پیشخوان", link: "/panel" },
                            { label: "تغییر کلمه عبور" }
                        ]}
                    />

                    <div className="bg-white border rounded-xl p-5 md:p-8 mb-5">
                        <PasswordChangeForm />
                    </div>

                </div>

            </div>

        </div>

    )
}

export default ChangePassword;

export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },
        }
    )
}