import dynamic from 'next/dynamic';
import { Close } from "@/modules/shared/components/ui/icons";
import ModalPortal from '@/modules/shared/components/ui/ModalPortal';
import { useEffect, useState } from 'react';

const LeafletNoSsr = dynamic(() => import('../../../shared/components/ui/LeafletMap'), {
    ssr: false
});

type Props = {
    latLong: [number, number];
    closeMapModal: () => void;
}

const HotelMap: React.FC<Props> = props => {

    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => { setShow(true) }, 100)
        return (() => {
            () => { setShow(false) }
        });
    }, []);

    const { latLong, closeMapModal } = props;

    return (
        <ModalPortal
            show={show}
            selector='modal_portal'
        >
            <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center' >
                <div 
                    className='bg-black/75 absolute top-0 left-0 w-full h-full z-10'
                    onClick={closeMapModal}
                />
                <button type='button' onClick={closeMapModal} className='absolute top-2 left-2 z-30'>
                    <Close className='w-10 h-10 fill-neutral-400' />
                </button>
                <div className='bg-white p-2 pt-14 sm:p-5 sm:rounded-lg w-full h-full sm:h-5/6 sm:w-5/6 relative z-20'>
                    <LeafletNoSsr
                        className='h-full w-full rounded-xl'
                        location={latLong}
                        zoom={15}
                    />
                </div>
            </div>
        </ModalPortal>

    )
}

export default HotelMap;