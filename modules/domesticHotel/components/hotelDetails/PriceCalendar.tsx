import { DomesticHotelRateItem } from "../../types/hotel";
import { dateFormat, numberWithCommas } from "@/modules/shared/helpers";

import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker as MobiscrollDatepicker, localeFa, MbscCalendarLabel } from '@mobiscroll/react';

type Props = {
    calendar?: DomesticHotelRateItem['calendar'];
    selectedDates: string[];
    roomName: string;
}

type CalendarArrayItemType = {
    date?: string;
    day?: number;
    month?: string;
    weekDayindex?: string;
    amount?: number;
    board?: number;
    type?: "Completion" | "Online" | "Offline" | "Request" | null;
};

const PriceCalendar: React.FC<Props> = props => {

    const { calendar } = props;

    let calendarArray: CalendarArrayItemType[] = [];

    if (calendar) {
        calendarArray = Object.keys(calendar).map((key) => ({
            date: key,
            ...calendar[key]
        }));
    }

    let value : (string|undefined)[] = [undefined , undefined];

    if(props.selectedDates){
        value = [props.selectedDates[0], props.selectedDates[props.selectedDates.length - 1]]
    }

    let labels : MbscCalendarLabel[] = [];

    if (calendarArray){
        labels = calendarArray.map(item => {
            
            let title = "قیمت نامشخص";
            let textColor = "#bbbbbb";

            if(item.amount){
                title = numberWithCommas(item.amount)?.toString();
                textColor = "#555"; 
            }

            if(item.type === "Completion"){
                title = "ظرفیت تکمیل";
                textColor = "red";
            }

            return ({
                title: title,
                textColor: textColor,
                date: item.date
            })
        })
    }else{
        debugger;
    }

    return(
        <MobiscrollDatepicker 
            cssClass="price-calendar"
            display="inline"
            touchUi={false}
            locale={localeFa}
            labels={labels}
            select="range"
            value={value}
            showRangeLabels={false}
            min = {dateFormat(new Date())}
        /> 
    );
}

export default PriceCalendar;