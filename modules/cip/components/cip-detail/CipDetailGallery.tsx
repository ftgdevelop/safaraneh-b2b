import { CipGetAirportByUrlResponseType } from "../../types/cip";
import Image from "next/image";
import { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { ImageGallery } from "@/modules/shared/components/ui/icons";
import { useTranslation } from "next-i18next";


const CipDetailGallery: React.FC<{ items: CipGetAirportByUrlResponseType['galleries'] }> = ({ items }) => {

    const [open, setOpen] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const {t:tCip} = useTranslation('cip');

    const openLightBox = (index?: number) => {
        setSlideIndex(index || 0);
        setOpen(true);
    }

    const imageItems = items.filter(item => item.path);

    return (
        <>
            {imageItems.length >= 5 ? (
                <div className="md:grid md:grid-cols-4 gap-1 relative">
                    {imageItems.slice(0, 5).map((item, index) => (
                        <Image
                            key={index}
                            src={item.path!}
                            alt={item.altAttribute || "cip"}
                            title={item.titleAttribute || ""}
                            priority={!index}
                            onContextMenu={(e) => e.preventDefault()}

                            width={index ? 287 : 430}
                            height={index ? 191 : 270}

                            onClick={() => { openLightBox(index); }}
                            className={`cursor-pointer w-full h-full object-cover ${index ? "hidden md:block md:col-span-1 md:row-span-1" : "md:col-span-2 md:row-span-2"}`}

                        />
                    ))}
                    <span className='text-xs absolute bottom-3 rtl:left-3 ltr:right-3 bg-black/75 text-white px-5 py-2 rounded-lg pointer-events-none flex gap-2 items-center'>
                        <ImageGallery className='w-6 h-6 fill-current' />
                        {tCip("morePictures")}
                    </span>
                </div>
            ):(
                <div className="md:flex gap-1 relative">
                    {imageItems.map((item, index) => (
                        <div key={index}>
                            <Image
                                src={item.path!}
                                alt={item.altAttribute || "cip"}
                                title={item.titleAttribute || ""}
                                priority={!index}
                                onContextMenu={(e) => e.preventDefault()}

                                width={287}
                                height={191}

                                onClick={() => { openLightBox(index); }}
                                className={`cursor-pointer w-full h-full object-cover ${index ? "hidden md:block" : ""}`}

                            />
                        </div>
                    ))}
                    <span className='text-xs absolute bottom-3 rtl:left-3 ltr:right-3 bg-black/75 text-white px-5 py-2 rounded-lg pointer-events-none flex gap-2 items-center'>
                        <ImageGallery className='w-6 h-6 fill-current' />
                        {tCip("morePictures")}
                    </span>
                </div>
            )}


            <Lightbox
                index={slideIndex}
                open={open}
                close={() => setOpen(false)}
                slides={imageItems.map(item => (
                    {
                        src: item.path!,
                        alt: item.altAttribute,
                        //title: item.titleAttribute
                    }))}
                plugins={[Thumbnails, Captions]}
                captions={{ descriptionTextAlign: 'center' }}
                thumbnails={{ width: 80, height: 50 }}
            />
        </>
    )
}

export default CipDetailGallery;