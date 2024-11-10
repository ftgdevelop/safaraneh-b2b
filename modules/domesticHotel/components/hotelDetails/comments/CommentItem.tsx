import { dateDiplayFormat } from '@/modules/shared/helpers';
import parse from 'html-react-parser';

type Props = {
    comment: {
        id?: number;
        comment?: string;
        overallRating?: number;
        creationTime?: string;
        userDisplayName?: string;
        // CityName?: string;
        // IsRecommended?: boolean;
        // RoomService?: number;
        // ResturantQuality?: number;
        // DealWithPassanger?: number;
        // PageUrl?: string;
        // IsStay?: boolean;
    }
}

const CommentItem: React.FC<Props> = props => {

    const { comment } = props;

    return (
        <div className='mb-5 pb-5 border-b border-neutral-300 text-sm'>

            {!!comment.overallRating && <div className={`font-bold text-lg ${comment.overallRating < 7 ? "text-orange-500" : "text-green-600"}`}>{(comment.overallRating || 0)} از 10</div>}

            <div className='font-semibold'> {comment.userDisplayName} </div>

            <div className='text-neutral-500 text-xs'>
                {dateDiplayFormat({date:comment.creationTime || "", format: "dd mm yyyy", locale:"fa"})}
            </div>

            {/* <div className='text-neutral-500 text-xs'> {comment.CityName} </div> */}

            {!!comment.comment && parse(comment.comment)}

        </div>
    )
}

export default CommentItem;

