import { dateDiplayFormat } from "@/modules/shared/helpers";
import { DomesticHotelRoomItem } from "../../types/hotel";
import React from "react";
import { CheckTag } from "@/modules/shared/components/ui/icons";

type Props = {
    promotions: DomesticHotelRoomItem['promotions'];
}

const Promotions: React.FC<Props> = props => {

    const { promotions } = props;

    if (promotions?.length) {

        return (
            <div className="py-5 sm:min-h-72">
                {
                    promotions.map(promotion => {

                        let startDate: string = "";
                        let endDate: string = "";

                        if (promotion.endDate) {
                            endDate = dateDiplayFormat({
                                date: promotion.endDate,
                                format: 'yyyy/mm/dd',
                                locale: "fa"
                            })
                        }
                        if (promotion.startDate) {
                            startDate = dateDiplayFormat({
                                date: promotion.startDate,
                                format: 'yyyy/mm/dd',
                                locale: "fa"
                            })
                        }

                        return (
                            <div key={promotion.name} className="flex gap-2 mb-3 sm:mb-5">
                                <CheckTag className='fill-green-800 w-6 h-6 inline-block shrink-0' />
                                <div>
                                    <label className='block mb-3 text-md font-semibold'> {promotion.name} </label>
                                    <p className='text-sm mb-1'> {promotion.description} </p>

                                    {startDate && endDate ? (
                                        <p className='text-sm'>
                                            مهلت استفاده از این طرح از تاریخ {startDate} تا {endDate} می‌باشد، لازم بذکر است که حتما می بایست روز ورود از تاریخ {startDate} تا {endDate} باشد.
                                        </p>
                                    ) : null}
                                </div>

                            </div>
                        )
                    })
                }
            </div>
        )
    }

    return null;
}

export default Promotions;