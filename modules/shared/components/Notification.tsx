import { useState, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from "../hooks/use-store";
import { ErrorCircle, TikCircle } from "./ui/icons";
import ModalPortal from "./ui/ModalPortal";
import { setReduxNotification } from "../store/notificationSlice";

const Notification: React.FC = () => {

    const [open, setOpen] = useState<boolean>(false);

    const storedNotification = useAppSelector(state => state.notification);

    const dispatch = useAppDispatch();

    let icon: React.ReactNode = "";

    if (storedNotification.status === "error") {
        icon = <ErrorCircle className="fill-red-500 w-7 h-7" />;
    } else if (storedNotification.status === "success") {
        icon = <TikCircle className="fill-green-500 w-7 h-7" />;
    }

    useEffect(() => {
        if (storedNotification.isVisible) {
            setOpen(true)
        }
    }, [storedNotification.isVisible]);

    useEffect(() => {
        if (open) {
            setTimeout(() => { setOpen(false) }, 4000)
        } else {
            setTimeout(() => {
                dispatch(setReduxNotification({
                    status: "",
                    message: "",
                    isVisible: false
                }));
            }, 500)
        }
    }, [open]);

    return (
        <ModalPortal
            show={storedNotification.isVisible}
            selector='notification_modal_portal'
        >
            <div className={`fixed text-sm transition-all ${open ? "right-24 opacity-100" : "-right-96 opacity-0"} bottom-8 z-10 bg-black/90 text-white shadow-normal rounded w-60 p-3 sm:p-5 sm:w-96 max-w-md flex justify-between`}>
                {storedNotification.message}
                {icon}
            </div>
        </ModalPortal>
    )
}

export default Notification;