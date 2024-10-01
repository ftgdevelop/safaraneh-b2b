import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { HotelScoreDataType } from "@/modules/domesticHotel/types/hotel";
import HotelScore from '../../shared/HotelScore';
import ProgressBar from '@/modules/shared/components/ui/ProgressBar';
import CommentItem from './CommentItem';

type Props = {
    hotelScoreData: HotelScoreDataType;
}

const UsersComments: React.FC<Props> = props => {

    const { hotelScoreData: data } = props;

    const { t } = useTranslation('common');
    const { t : tHotel } = useTranslation('hotel');

    const [showAll, setShowAll] = useState<boolean>(false);

    const toggleShowAll = () => {
        setShowAll(prevState => !prevState);
    }

    if (!data) {
        return null;
    }

    return (
        <div className='p-3 sm:p-5 lg:p-7 bg-white rounded-xl grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 mb-8'>

            <div>
                <h5 className='text-sm md:text-base font-semibold mb-5'>{tHotel("hotel-score")}</h5>
                <HotelScore
                    reviews={data.CommentCount}
                    score={data.Satisfaction}
                    className="text-sm lg:text-md font-semibold"
                />

                <div className="mb-1 mt-5 text-sm">
                    {tHotel('satisfaction-from-100', { satisfaction: data.Satisfaction })}
                </div>
                <ProgressBar percentage={data.Satisfaction || 0} />


                <div className="mb-1 mt-5 text-sm">
                    {tHotel("room-status-from-10", { roomservice: data.RoomService })}
                </div>
                <ProgressBar percentage={(data.RoomService || 0) * 10} />


                <div className="mb-1 mt-5 text-sm">
                    {tHotel('restaurant-quality-from-10', { resturantquality: data.ResturantQuality })}
                </div>
                <ProgressBar percentage={(data.ResturantQuality || 0) * 10} />


                <div className="mb-1 mt-5 text-sm">
                    {tHotel("employees-treatment-from-10", { dealwithpassanger: data.DealWithPassanger })}
                </div>
                <ProgressBar percentage={(data.DealWithPassanger || 0) * 10} />

            </div>

            <div className='md:col-span-2 text-justify leading-7 text-sm md:text-base md:leading-7'>

                <h5 className='text-sm md:text-base font-semibold mb-5'>{tHotel("user-suggestions")}</h5>

                {data.Comments?.slice(0, 3).map((item, index) => <CommentItem key={index} comment={item} />)}
                {showAll && data.Comments?.slice(3).map((item, index) => <CommentItem key={index} comment={item} />)}

                <button
                    type='button'
                    onClick={toggleShowAll}
                    className='h-10 px-5 text-sm border rounded-lg text-primary-700 border-primary-700 hover:bg-primary-100 transition-all'
                >
                    {tHotel("view-suggestions")}{showAll ? t('less') : t('more')}
                </button>
            </div>

        </div>
    )
}

export default UsersComments;
