import { useTranslation } from 'next-i18next';
import { Fragment, useState } from 'react';

import { DomesticHotelReviewsType } from "@/modules/domesticHotel/types/hotel";
import HotelScore from '../../shared/HotelScore';
import ProgressBar from '@/modules/shared/components/ui/ProgressBar';
import CommentItem from './CommentItem';
import { InfoCircle } from '@/modules/shared/components/ui/icons';

type Props = {
    hotelReviewData?: DomesticHotelReviewsType;
}

const UsersComments: React.FC<Props> = props => {

    const { hotelReviewData: data } = props;

    const { t } = useTranslation('common');
    const { t: tHotel } = useTranslation('hotel');

    const [showAll, setShowAll] = useState<boolean>(false);

    const toggleShowAll = () => {
        setShowAll(prevState => !prevState);
    }

    if (!data) {
        return null;
    }

    return (
        <div className='p-3 sm:p-5 lg:p-10 bg-white rounded-xl grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 mb-8'>

            {!!data.ratings?.length && <div>
                <h5 className='text-sm md:text-base font-semibold mb-5'>{tHotel("hotel-score")}</h5>
                <HotelScore
                    reviews={data.reviews.totalCount}
                    score={data.averageRating}
                    className="text-sm lg:text-md font-semibold"
                />

                {data.ratings?.map(item => (
                    <Fragment>
                        <div className="mb-1 mt-5 text-sm flex justify-between items-end">
                            <span> {item.category.name} </span>
                            <b className={`text-md font-semibold text-neutral-500`}> {item.average} </b>
                        </div>
                        <ProgressBar
                            percentage={item.average * 10 || 0}
                        //colorClassName="bg-amber-400"    
                        />
                    </Fragment>
                ))}

            </div>}

            <div className='md:col-span-2 text-justify leading-7 text-sm md:text-base md:leading-7'>
                {data.reviews.items.length ? (
                    <>
                        <h5 className='text-sm md:text-base font-semibold mb-5'>{tHotel("user-suggestions")}</h5>

                        {data.reviews?.items?.slice(0, 3).map((item, index) => <CommentItem key={index} comment={item} />)}
                        {showAll && data.reviews?.items?.slice(3).map((item, index) => <CommentItem key={index} comment={item} />)}

                        <button
                            type='button'
                            onClick={toggleShowAll}
                            className='h-10 px-5 text-sm border rounded-lg text-primary-700 border-primary-700 hover:bg-primary-100 transition-all'
                        >
                            {tHotel("view-suggestions")}{showAll ? t('less') : t('more')}
                        </button>
                    </>
                ) : (
                    <div className='text-neutral-500 items-center text-sm flex gap-2' >
                        <InfoCircle className='w-6 h-6 fill-amber-500' />
                        برای این هتل نظری ثبت نشده است!
                    </div>
                )}
            </div>

        </div>
    )
}

export default UsersComments;
