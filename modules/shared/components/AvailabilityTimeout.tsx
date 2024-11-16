import Link from "next/link";
import Button from "./ui/Button";
import ModalPortal from "./ui/ModalPortal";
import { Update } from "./ui/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

type Props = {
    minutes: number;
    onRefresh: () => void;
    icon?: React.ReactNode;
    description: string;
}

const AvailabilityTimeout: React.FC<Props> = props => {

    const { t } = useTranslation("common")

    const { icon, description, minutes, onRefresh } = props;

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setOpen(true);
        }, minutes * 60 * 1000);

        return (() => {
            setOpen(false);
            clearTimeout(timeout);
        });
    }, [minutes]);

    return (
        <ModalPortal
            show={open}
            selector='modal_portal'
        >
            <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-screen bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">

                <div className="bg-white max-sm:mx-3 rounded-xl px-5 py-14 w-full max-w-md text-center">

                    {icon || <Update className="w-10 h-10 fill-current inline-block" />}

                    <p className="mb-6 mt-8 text-sm sm:text-base">
                        {description}
                    </p>

                    <Button
                        type="button"
                        className="max-w-full cursor-pointer bg-primary-700 hover:bg-primary-600 text-white h-10 px-5 rounded-md mb-3 mx-auto"
                        onClick={onRefresh}
                    >
                        {t('RefreshResults')}
                    </Button>

                    <Link
                        href="/panel"
                        className='text-blue-500 mt-3 text-sm'
                    >
                        {t('startANewSearch')}

                    </Link>

                </div>

            </div>

        </ModalPortal>
    )
}

export default AvailabilityTimeout;