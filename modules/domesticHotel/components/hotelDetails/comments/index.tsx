import { useTranslation } from 'next-i18next';

import { HotelScoreDataType } from "@/modules/domesticHotel/types/hotel";
import UsersComments from './UsersComments';
//import CommentForm from './CommentForm';

type Props = {
    hotelScoreData?: HotelScoreDataType;
    pageId: number;
}

const Comments: React.FC<Props> = props => {

    const { t:tHotel } = useTranslation('hotel');

    return (
        <div id="reviews_section" className="px-4 md:px-6 pt-7 md:pt-10">
            <h4 className='text-lg lg:text-3xl font-semibold mb-3 md:mb-7'> {tHotel("suggestion")} </h4>

            {!!props.hotelScoreData && <UsersComments hotelScoreData={props.hotelScoreData} />}

            {/* <CommentForm pageId={props.pageId} /> */}

        </div>
    )
}

export default Comments;