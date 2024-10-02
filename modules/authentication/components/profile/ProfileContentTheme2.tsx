import CheckboxSwitch from "@/modules/shared/components/ui/CheckboxSwitch";
import { dateDiplayFormat } from "@/modules/shared/helpers";
import { useAppDispatch, useAppSelector } from "@/modules/shared/hooks/use-store";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { setReduxNotification } from "@/modules/shared/store/notificationSlice";
import EmailActivationForm from "./EmailActivationForm";
import PhoneActivationForm from "./PhoneActivationForm";
import { Close } from "@/modules/shared/components/ui/icons";
import ModalPortal from "@/modules/shared/components/ui/ModalPortal";
import ProfileEditForm from "./ProfileEditForm";
import { updateNewsletterUserProfile } from "../../actions";

type Props = {
    portalName: string;
}

const ProfileContentTheme2: React.FC<Props> = props => {

    const { t } = useTranslation('common');

    const dispatch = useAppDispatch();

    const userAuthentication = useAppSelector(state => state.authentication);
    const user = userAuthentication.user;

    const [activeEdit, setActiveEdit] = useState<undefined | "basic"|"contact">(); 

    const subscribeNewsLetter = async (active: boolean) => {

        const token = localStorage.getItem('Token');
        const localStorageTenant = localStorage?.getItem('S-TenantId');
        if (!token || !localStorageTenant) return;

        const params = {
            isNewsLetter: active
        }

        dispatch(setReduxNotification({
            status: '',
            message: "",
            isVisible: false
        }));

        const updateResponse: any = await updateNewsletterUserProfile(params, token, +localStorageTenant);

        if (updateResponse.data && updateResponse.data.success) {

            dispatch(setReduxNotification({
                status: 'success',
                message: "اطلاعات با موفقیت ارسال شد",
                isVisible: true
            }));

        } else {
            dispatch(setReduxNotification({
                status: 'error',
                message: "ارسال اطلاعات ناموفق",
                isVisible: true
            }));

        }
    }

    let userBasicInformation : {
        label: string;
        value: string;
    }[] = [];
    
    if(user){
        userBasicInformation = [{
            label: 'جنسیت',
            value: user?.gender === undefined ? "نامشخص" :  user.gender ? "مرد" : "زن"
        },{
            label:"نام و نام خانوادگی",
            value: user?.firstName ? (user.firstName + " " + user.lastName) : "نامشخص"
        },{
            label:"تاریخ تولد",
            value: user.birthDay ? dateDiplayFormat({
                date: user.birthDay,
                format: 'dd mm yyyy',
                locale: "fa"
            }) : "نامشخص"
        },{
            label:t('national-code'),
            value:user.nationalId || "نامشخص"
        }];
    }

    return (

        <>
            <ModalPortal
                show={!!activeEdit}
                selector='modal_portal_2'
            >
                <div className='fixed top-0 left-0 h-screen w-screen bg-white overflow-auto'>
                    <button
                        type="button" 
                        className="border-0 outline-none p-1 cursor-pointer rounded-full absolute top-2 left-2 hover:bg-blue-100"
                        onClick={()=>{setActiveEdit(undefined)}}
                    >
                        <Close className="w-7 h-7 fill-blue-600" />
                    </button>
                    <div className="max-w-lg m-auto pr-5 pl-5 py-12">

                        {activeEdit === "basic" ?(
                            <>
                                <strong className="text-xl sm:text-3xl font-bold block">
                                    اطلاعات اولیه
                                </strong>
                                <p className="text-xs mb-5">
                                    مطمئن شوید اطلاعات زیر مطابق با اطلاعات ثبت شده در مدارک شناسایی شما باشد
                                </p>

                                <ProfileEditForm 
                                    oneBlock
                                    afterSubmit={()=>{setActiveEdit(undefined);}}
                                />
                            </>
                        ): activeEdit === "contact"?(
                            <>
                            <strong className="text-xl sm:text-3xl font-bold block">
                                اطلاعات تماس
                            </strong>
                            <p className="text-xs mb-5">
                                با تکمیل اطلاعات زیر اطلاعیه های مهم را دریافت کنید.
                            </p>
                            <br/>

                            <EmailActivationForm />
                            <PhoneActivationForm
                                portalName={props.portalName}
                            />

                        </>
                        ): null}

                    </div>

                </div>

            </ModalPortal>
            
            <h5 className='text-base sm:text-2xl font-semibold mt-5 mb-10'>
                {user?.firstName} {user?.lastName}
            </h5>

            <div className="flex justify-between">
                <strong className="text-xl sm:text-3xl font-bold block">
                    اطلاعات اولیه
                </strong>
                <button
                    type="button"
                    className="text-blue-600 text-sm"
                    onClick={()=>{setActiveEdit("basic")}}
                >
                    {t('edit')}
                </button>
            </div>
            <p className="text-xs mb-5">
                مطمئن شوید اطلاعات زیر مطابق با اطلاعات ثبت شده در مدارک شناسایی شما باشد
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-sm mb-8 sm:mb-12">
                {userBasicInformation.map(item => (
                    <div key={item.label} className="leading-5">
                        <strong className="font-bold block mb-1"> {item.label} </strong>
                        <div className="text-xs"> {item.value} </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                <strong className="text-xl sm:text-3xl font-bold block">
                    اطلاعات تماس
                </strong>
                <button
                    type="button"
                    className="text-blue-600 text-sm"
                    onClick={()=>{setActiveEdit("contact")}}
                >
                    {t('edit')}
                </button>
            </div>
            <p className="text-xs mb-5">
                با تکمیل اطلاعات زیر اطلاعیه های مهم را دریافت کنید.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 text-sm mb-8 sm:mb-12">
                <div className="leading-5">
                    <strong className="font-bold block mb-1"> {t('email')} </strong>
                    <div className="text-xs"> {user?.emailAddress || "نامشخص"} </div>

                    {!!(user?.emailAddress && !user.isEmailConfirmed) && <div className='bg-amber-100 text-xs inline-block text-neutral-500 leading-6 px-3'>
                        تایید نشده
                    </div>}

                </div>
                <div className="leading-5">
                    <strong className="font-bold block mb-1"> {t("phone-number")} </strong>
                    <div className="text-xs rtl:text-right" dir="ltr"> {user?.phoneNumber || "نامشخص"} </div>

                    {!!(user?.phoneNumber && !user.isPhoneNumberConfirmed) && <div className='bg-amber-100 text-xs inline-block text-neutral-500 leading-6 px-3'>
                        تایید نشده
                    </div>}

                </div>
            </div>
            
            <p className="mb-2"> در خبرنامه ما ثبت نام کنید </p>
            <CheckboxSwitch
                onChange={value => { subscribeNewsLetter(value) }}
                className="mb-5"
                initialChecked={user?.isNewsletter || false}
            />

        </>

    )
}

export default ProfileContentTheme2;