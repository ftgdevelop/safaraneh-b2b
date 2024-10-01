
import { useTranslation } from "next-i18next";
import Router from "next/router";

import { useAppDispatch, useAppSelector } from "../hooks/use-store";
import { setReduxError } from '../store/errorSlice';
import { ErrorIcon } from "./ui/icons";
import ModalPortal from "./ui/ModalPortal";
import { useEffect } from "react";
import { setBodyScrollable } from "../store/stylesSlice";

const Error: React.FC = () => {

    const { t } = useTranslation("common");

    const storedError = useAppSelector(state => state.error);

    const dispatch = useAppDispatch();

    useEffect(()=>{
        if(storedError?.isVisible){
            dispatch(setBodyScrollable(false));
        }else{
            dispatch(setBodyScrollable(true));
        }
    },[storedError?.isVisible]);

    const closeHandler = () => {
        dispatch(setReduxError({
            title: "",
            message: "",
            isVisible: false,
            closeErrorLink: "",
            closeButtonText: ""
        }));
    }

    const backTo = (target: string) => {
        Router.push(target);
        closeHandler();
    }

    return (
        <ModalPortal
            show={storedError.isVisible}
            selector='error_modal_portal'
        >
            <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">

                <div className="bg-white max-sm:h-screen sm:rounded-xl px-5 pt-10 pb-12 w-full max-w-md text-center">
                    <ErrorIcon className="w-20 mx-auto fill-red-500 mb-3 md:mb-4" />

                    <h5 className="text-red-500 text-lg sm:text-2xl font-bold mb-1">
                        {storedError.title || t('error')}
                    </h5>

                    <div className="text-neutral-500 mb-4 md:mb-7 leading-7 text-center">
                        {storedError.message}
                    </div>

                    {storedError.closeErrorLink ? (
                        <button type="button" className="max-w-full w-32 cursor-pointer bg-primary-700 hover:bg-primary-600 text-white h-10 px-5 rounded-md" onClick={() => { backTo(storedError.closeErrorLink!) }}>
                            {storedError.closeButtonText || t('home')}
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

export default Error;