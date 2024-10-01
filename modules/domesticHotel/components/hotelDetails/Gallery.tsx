import { ImageGallery } from '@/modules/shared/components/ui/icons';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

type Props = {
    images?: {
        src: string;
        alt: string;
        width: number;
        height: number;
        description: string;
        thumbnail: string;
    }[];
    hotelName?:string;
}

const Gallery: React.FC<Props> = props => {

    const { t: tHotel } = useTranslation('hotel');
    const { images } = props;

    const theme2 = process.env.THEME === "THEME2";

    const [open, setOpen] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);

    if (!images) {
        return <div>
            no image message...
        </div>
    }

    const openLightBox = (index?: number) => {
        setSlideIndex(index || 0);
        setOpen(true);
    }

    if (!images.length){
        return(
            null
        )
    }

    return (
        <>
            <div id="pictures_section" className={`grid grid-cols-1 md:grid-cols-4 bg-white relative ${theme2?"":"gap-1"}`}>
                {images.slice(0, 5).map((slide, index) => (
                    <Image
                        key={slide.thumbnail}
                        priority={!index}
                        onContextMenu={(e)=> e.preventDefault()}
                        src={slide.thumbnail}
                        alt={index?slide.alt : props.hotelName || slide.alt}
                        width={index ? 287 : 384}
                        height={index ? 191 : 288}
                        sizes="(max-width: 767px) 100vw, 50vw"
                        onClick={() => { openLightBox(index); }}
                        className={`cursor-pointer w-full object-cover ${theme2?"p-px":""} ${theme2 ?index ? "h-40" :"h-80":"h-full"} ${index ? "hidden md:block md:col-span-1 md:row-span-1" : "md:col-span-2 md:row-span-2"}`}
                    />
                ))}

                <span className='text-xs absolute bottom-3 rtl:left-3 ltr:right-3 bg-black/75 text-white px-5 py-2 rounded-lg pointer-events-none flex gap-2 items-center'>
                    <ImageGallery className='w-6 h-6 fill-current' />
                    +{images.length} {!theme2 && tHotel("picture")}
                </span>

            </div>

            <Lightbox
                index={slideIndex}
                open={open}
                close={() => setOpen(false)}
                slides={images}
                plugins={theme2 ? [Captions] : [Thumbnails, Captions]}
                captions={{ descriptionTextAlign: 'center' }}
                thumbnails={{ width: 80, height: 50 }}
            />

        </>
    )
}

export default Gallery;