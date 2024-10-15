
import { useTranslation } from "next-i18next";
import Router from "next/router";

import { useAppDispatch, useAppSelector } from "../hooks/use-store";
import { setAlertModal } from '../store/alertSlice';
import { ErrorIcon, TikCircle } from "./ui/icons";
import ModalPortal from "./ui/ModalPortal";
import { useEffect } from "react";
import { setBodyScrollable } from "../store/stylesSlice";

const AlertModal: React.FC = () => {

    const { t } = useTranslation("common");

    const storedAlert = useAppSelector(state => state.alert);

    const dispatch = useAppDispatch();

    useEffect(()=>{
        if(storedAlert?.isVisible){
            dispatch(setBodyScrollable(false));
        }else{
            dispatch(setBodyScrollable(true));
        }
    },[storedAlert?.isVisible]);

    const closeHandler = () => {
        dispatch(setAlertModal({
            type:undefined,
            title: "",
            message: "",
            isVisible: false,
            closeAlertLink: "",
            closeButtonText: ""
        }));
    }

    const backTo = (target: string) => {
        Router.push(target);
        closeHandler();
    }
    const isSuccess = storedAlert.type === "success";

    return (
        <ModalPortal
            show={storedAlert.isVisible}
            selector='error_modal_portal'
        >
            <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">

                <div className="bg-white max-sm:h-screen sm:rounded-xl px-5 pt-10 pb-12 w-full max-w-md text-center">
                    
                    <span className={`p-2 rounded-full inline-block mb-3 md:mb-4 ${isSuccess ? "bg-green-50" : "bg-red-50"}`}>
                        {isSuccess ?(
                            <TikCircle className="w-10 mx-auto fill-green-500 relative" />
                        ):(
                            <ErrorIcon className="w-10 mx-auto fill-red-500 relative -top-0.5" />
                        )}
                    </span>

                    <h5 className={`text-lg sm:text-xl font-semibold mb-3 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
                        {storedAlert.title || t('error')}
                    </h5>

                    <div className="text-neutral-500 text-sm mb-4 md:mb-7 leading-7 text-center">
                        {storedAlert.message}
                    </div>

                    {storedAlert.closeAlertLink ? (
                        <button type="button" className="max-w-full w-32 cursor-pointer bg-primary-700 hover:bg-primary-600 text-white h-10 px-5 rounded-md" onClick={() => { backTo(storedAlert.closeAlertLink!) }}>
                            {storedAlert.closeButtonText || t('home')}
                        </button>
                    ) : (
                        <button type="button" className="max-w-full w-32 cursor-pointer bg-primary-700 hover:bg-primary-600 text-white h-10 px-5 rounded-md" onClick={closeHandler}>
                            {t('close')}
                        </button>
                    )}

                </div>

            </div>
        </ModalPortal>

    )
}

export default AlertModal;