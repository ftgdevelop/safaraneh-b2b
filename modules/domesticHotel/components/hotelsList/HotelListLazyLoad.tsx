import { Fragment, useEffect, useRef, useState } from "react";
import { PricedHotelItem } from "../../types/hotel";
import HotelListItemTheme3 from "./HotelListItemTheme3";
import HotelListItemTheme2 from "./HotelListItemTheme2";
import HotelListItem from "./HotelListItem";
import Button from "@/modules/shared/components/ui/Button";
import PromotionHotels from "./PromotionHotels";
import Skeleton from "@/modules/shared/components/ui/Skeleton";
// import Image from "next/image";
// import Link from "next/link";

type Props = {
    hotels: PricedHotelItem[];
    isFetching?: boolean;
}

const HotelListLazyLoad: React.FC<Props> = props => {

    const { hotels } = props;
    const [quantity, setQuantity] = useState<number>(10);

    const theme2 = process.env.THEME === "THEME2";
    const theme3 = process.env.THEME === "THEME3";

    const loadMoreWrapper = useRef<HTMLDivElement>(null);

    const addItems = (items: number, max: number, isScrollAdd: boolean) => {
        setQuantity(prevQuantity => {
            if (isScrollAdd && prevQuantity > 30) {

                document.removeEventListener('scroll', checkIsInView);
                window.removeEventListener("resize", checkIsInView);

                return (prevQuantity);

            } if ((prevQuantity + items) > max) {

                document.removeEventListener('scroll', checkIsInView);
                window.removeEventListener("resize", checkIsInView);

                return (max);
            } else {
                return (prevQuantity + items)
            }
        });
    }

    const checkIsInView = () => {
        const targetTop = loadMoreWrapper.current?.getBoundingClientRect().top;
        const screenHeight = screen.height;
        if (targetTop && targetTop < (3 * screenHeight / 5)) {
            if (quantity < 40) {
                addItems(10, hotels.length, true);
            }
        }
    }

    useEffect(() => {
        document.addEventListener('scroll', checkIsInView);
        window.addEventListener("resize", checkIsInView);

        return (() => {
            document.removeEventListener('scroll', checkIsInView);
            window.removeEventListener("resize", checkIsInView);
        });
    }, []);

    return (
        <div>
            {hotels.slice(0, quantity).map((hotel, index) => {
                if (theme3) {
                    return (
                        <Fragment key={hotel.id}>
                            <HotelListItemTheme3 index={index} hotel={hotel} />
                        </Fragment>
                    )
                }
                if (theme2) {
                    return (
                        <Fragment key={hotel.id}>
                            <HotelListItemTheme2 index={index} hotel={hotel} />
                        </Fragment>
                    )
                }
                return (
                    <Fragment key={hotel.id}>
                        
                        <HotelListItem index={index} hotel={hotel} />

                        {!!([3, 23].includes(index)) && <PromotionHotels promotionHotels={hotels.filter(h => h.isPromotion)} />}

                        {!!([2, 0].includes(index) && props.isFetching) && (
                            <div className="grid md:grid-cols-12 mb-4 border border-neutral-200 bg-white rounded-lg relative" >
                                <Skeleton
                                    type="image"
                                    className="min-h-36 md:col-span-12 lg:col-span-4 bg-travel-pattern lg:rtl:rounded-r-lg lg:ltr:rounded-l-lg"
                                />
                                <div className="md:col-span-7 lg:col-span-5 p-3 max-md:pb-0">
                                    <Skeleton className="mb-4 w-1/2" />
                                    <Skeleton className="mb-4 w-14" />
                                    <Skeleton className="mb-4 w-2/3" />
                                </div>
                                <div className="md:col-span-5 lg:col-span-3 p-3 max-md:pt-0 flex flex-col justify-between sm:items-end">
                                    <Skeleton className="mb-3 w-1/2" />
                                    <Skeleton className="mb-3 w-14" />
                                    <br />
                                    <Skeleton className="w-full h-10 rounded-lg" type="button" />
                                </div>
                            </div>
                        )}

                        {/* {!!(index === 1) && (
                            <Link
                                href="/fa/hotel/هتل-پارک-وی-تهران"
                                className="mb-4 block"
                                target="_blank"
                                prefetch={false}
                            >
                                <Image 
                                    src = "/images/del/park-way.jpg"
                                    alt="هتل پارک وی"
                                    width={866}
                                    height={194}
                                    className="w-full h-auto rounded-lg"
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </Link>
                        )}

                        {!!(index === 6) && (
                            <Link
                                href="/fa/hotel/هتل-پارسیان-آزادی-تهران"
                                className="mb-4 block"
                                target="_blank"
                                prefetch={false}
                            >
                                <Image 
                                    src = "/images/del/parsian.jpg"
                                    alt="هتل پارسیان آزادی"
                                    width={866}
                                    height={194}
                                    className="w-full h-auto rounded-lg"
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </Link>
                        )} */}

                    </Fragment>
                )
            })}

            <div ref={loadMoreWrapper}>
                <Button
                    type="button"
                    className="px-5 h-10 mx-auto"
                    onClick={() => { addItems(10, hotels.length, false); }}
                    disabled={quantity >= hotels.length}
                >
                    مشاهده بیشتر
                </Button>
            </div>
        </div>
    )
}

export default HotelListLazyLoad;