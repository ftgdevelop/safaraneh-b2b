import ProfileEditForm from "@/modules/authentication/components/profile/ProfileEditForm";
import UserNavigation from "@/modules/authentication/components/users/UserNavigation";
import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import { UserX } from "@/modules/shared/components/ui/icons";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const EditProfile: NextPage = () => {

    return (

        <div className="grid grid-cols-6 bg-neutral-100">

            <UserNavigation />

            <div className="relative col-span-5">

                <div
                    className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl"
                >
                    <UserX className="w-8 h-8" />
                    ویرایش پروفایل
                </div>

                <div className="p-4 md:p-6">

                    <BreadCrumpt
                        hideHome
                        items={[
                            { label: "پیشخوان", link: "/panel" },
                            { label: "ویرایش پروفایل" }
                        ]}
                    />

                    <div className="bg-white border rounded-xl p-5 md:p-8 mb-5">
                        <ProfileEditForm
                            oneBlock
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default EditProfile;

export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },
        }
    )
}