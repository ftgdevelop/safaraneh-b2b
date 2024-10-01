import { useEffect, useState } from "react";
import { TravelerItem } from "../types/common";
import ModalPortal from "./ui/ModalPortal";
import { useAppDispatch, useAppSelector } from "../hooks/use-store";
import { Close, ErrorCircle } from "./ui/icons";
import { openLoginForm } from "@/modules/authentication/store/authenticationSlice";
import Skeleton from "./ui/Skeleton";
import FormerTravelerItem from "./FormerTravelerItem";
import Button from "./ui/Button";
import { deleteTraveller } from "../actions";

type Props = {
    onSelectTraveler: (traveler: TravelerItem) => void;
    travelers?: TravelerItem[];
    fetchTravelers: () => void;
    fetchingLoading: boolean;
    isHotel?: boolean;
    clearTravelers: () => void;
}

const FormerTravelers: React.FC<Props> = props => {

    const [open, setOpen] = useState<boolean>(false);

    const [deletingItem, setDeletingItem] = useState<TravelerItem>();
    const [deletingConfirmMode, setDeletingConfirmMode] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const userIsAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

    useEffect(() => {
        if (props.fetchTravelers && open && !props.travelers && userIsAuthenticated) {
            props.fetchTravelers();
        }

        if (!userIsAuthenticated) {
            props.clearTravelers();
        }
    }, [open, userIsAuthenticated]);

    const openDeleteConfirm = (item: TravelerItem) => {
        setDeletingItem(item);
        setDeletingConfirmMode(true);
    }

    let deletingItemFullName: string = "";

    if (deletingItem?.firstname && deletingItem.lastname) {
        deletingItemFullName = deletingItem.firstname + " " + deletingItem.lastname;
    }

    if (deletingItem?.firstnamePersian && deletingItem.lastnamePersian) {
        deletingItemFullName = deletingItem.firstnamePersian + " " + deletingItem.lastnamePersian;
    }

    const deleteTravellerHandle = async () => {

        if (!deletingItem) return;

        const token = localStorage.getItem('Token') || "";

        setDeletingConfirmMode(false);
        await deleteTraveller(deletingItem?.id, token);

        props.fetchTravelers();
    }

    return (
        <>
            <button
                className="text-blue-600 border border-blue-600 px-2 text-sm py-1 leading-4 rounded"
                type="button"
                onClick={() => {
                    setOpen(true);
                    if (!userIsAuthenticated) {
                        dispatch(openLoginForm())
                    }
                }}
            >
                انتخاب مسافرین سابق
            </button>

            <ModalPortal
                show={deletingConfirmMode}
                selector='modal_portal_2'
            >
                <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center' >
                    <div
                        className='bg-black/50 absolute top-0 left-0 w-full h-full z-[1]'
                        onClick={() => { setDeletingConfirmMode(false) }}
                    />

                    <div className='bg-white w-520 p-2 sm:p-5 md:py-14 sm:rounded-lg relative z-[2]'>

                        <ErrorCircle className="w-10 h-10 fill-red-500 mb-5 mx-auto" />

                        <p className="mb-5 text-center text-sm">
                            مطمئنید که میخواهید این مسافر <b> ({deletingItemFullName}) </b>  حذف شود؟
                        </p>

                        <div className="flex justify-center gap-3">
                            <Button
                                color="red"
                                type="button"
                                className="px-3 h-8 w-24"
                                onClick={deleteTravellerHandle}
                            >
                                حذف
                            </Button>

                            <Button
                                color="gray"
                                type="button"
                                className="px-3 h-8 w-24"
                                onClick={() => { setDeletingItem(undefined); setDeletingConfirmMode(false); }}
                            >
                                لغو
                            </Button>
                        </div>
                    </div>


                </div>
            </ModalPortal>

            <ModalPortal
                show={open}
                selector='modal_portal_0'
            >
                <div className='fixed top-0 left-0 w-full h-full flex flex-col justify-center' >
                    <div
                        className='bg-black/75 absolute top-0 left-0 w-full h-full z-[1]'
                        onClick={() => { setOpen(false) }}
                    />

                    <div className="max-w-container mx-auto p-3 sm:p-5 w-full">

                        <div className='bg-white p-2 pt-14 sm:p-5 md:py-14 sm:rounded-lg relative z-[2]'>
                            <strong className="block mb-4">
                                انتخاب مسافران سابق
                            </strong>

                            <button type='button' onClick={() => { setOpen(false) }} className='absolute top-2 left-2 z-30 lg:hidden' aria-label='close map'>
                                <Close className='w-10 h-10 fill-neutral-400' />
                            </button>

                            <div>
                                <div className="overflow-auto">
                                    <table className="bordered-table text-center w-full text-xs">
                                        <thead>
                                            <tr>
                                                <th className="text-center p-1 md:p-2 bg-gray-100" > نام و نام خانوادگی</th>
                                                <th className="text-center p-1 md:p-2 bg-gray-100" > جنسیت</th>
                                                <th className="text-center p-1 md:p-2 bg-gray-100" > کد ملی / شماره پاسپورت </th>
                                                {!props.isHotel && <th className="text-center p-1 md:p-2 bg-gray-100" > تاریخ انقضای پاسپورت </th>}
                                                <th className="text-center p-1 md:p-2 bg-gray-100" > تاریخ تولد </th>
                                                <th className="text-center p-1 md:p-2 bg-gray-100 w-44" ></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {props.fetchingLoading ? (
                                                [1, 2, 3].map(loadingItem => (
                                                    <tr key={loadingItem}>
                                                        <td className="p-1 md:p-3"> <Skeleton /> </td>
                                                        <td className="p-1 md:p-3"> <Skeleton /> </td>
                                                        <td className="p-1 md:p-3"> <Skeleton /> </td>
                                                        <td className="p-1 md:p-3"> <Skeleton /> </td>
                                                        <td className="p-1 md:p-3"> <Skeleton /> </td>
                                                        {!props.isHotel && <td className="p-1 md:p-3"><Skeleton /></td>}
                                                    </tr>
                                                ))
                                            ) : props.travelers?.length ? (

                                                props.travelers?.map((traveller, travellerIndex) => (
                                                    <FormerTravelerItem
                                                        key={travellerIndex}
                                                        onSelect={() => {
                                                            setOpen(false);
                                                            props.onSelectTraveler(traveller);
                                                        }}
                                                        ondelete={openDeleteConfirm}
                                                        traveller={traveller}
                                                        isHotel={props.isHotel}
                                                    />
                                                ))
                                            ) : (
                                                <tr>
                                                    <td 
                                                        colSpan={props.isHotel ? 5 : 6}
                                                        className="py-12" 
                                                    >
                                                        متاسفانه اطلاعاتی از مسافران سابق یافت نشد.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </ModalPortal>
        </>
    )
}

export default FormerTravelers;