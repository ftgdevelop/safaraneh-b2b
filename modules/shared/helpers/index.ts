export const toPersianDigits = (x: string) => {
    if (x) {
        const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

        for (var i = 0; i < 10; i++) {
            x = x.replaceAll(i.toString(), persianNumbers[i]);
        }
    }

    return x;
};

export const numberWithCommas = (x: number) => {
    if (x) {
        const y = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return toPersianDigits(y);
    } else {
        return "0";
    }
}

export const returnCurrency = (currency: string) => {
    switch (currency) {
        case "IRR":
            return "ریال";
        default:
            return currency;
    }
}

const number3digitsToLeters = (number: number) => {
    debugger;
    const a = Math.floor(number / 100);
    const remained = number % 100;
    const b = Math.floor(remained / 10);
    const c = Math.floor(number % 10);

    let A: string = "";

    switch (a) {
        case 1:
            A = "صد";
            break;
        case 2:
            A = "دویست";
            break;
        case 3:
            A = "سیصد";
            break;
        case 4:
            A = "چهارصد";
            break;
        case 5:
            A = "پانصد";
            break;
        case 6:
            A = "ششصد";
            break;
        case 7:
            A = "هفتصد";
            break;
        case 8:
            A = "هشتصد";
            break;
        case 9:
            A = "نهصد";
            break;
        default:
            A = "";
    }

    let B: string = "";

    switch (b) {
        case 1:
            switch (c) {
                case 1:
                    B = "یازده";
                    break;
                case 2:
                    B = "دوازده";
                    break;
                case 3:
                    B = "سیزده";
                    break;
                case 4:
                    B = "چهارده";
                    break;
                case 5:
                    B = "پانزده";
                    break;
                case 6:
                    B = "شانزده";
                    break;
                case 7:
                    B = "هفده";
                    break;
                case 8:
                    B = "هجده";
                    break;
                case 9:
                    B = "نوزده";
                    break;
                case 0:
                    B = "ده";
                    break;
                default:
                    B = "ده";
            }
            break;
        case 2:
            B = "بیست";
            break;
        case 3:
            B = "سی";
            break;
        case 4:
            B = "چهل";
            break;
        case 5:
            B = "پنجاه";
            break;
        case 6:
            B = "شصت";
            break;
        case 7:
            B = "هفتاد";
            break;
        case 8:
            B = "هشتاد";
            break;
        case 9:
            B = "نود";
            break;
        default:
            B = "";
    }

    let C: string = "";

    if (b !== 1) {
        switch (c) {
            case 1:
                C = "یک";
                break;
            case 2:
                C = "دو";
                break;
            case 3:
                C = "سه";
                break;
            case 4:
                C = "چهار";
                break;
            case 5:
                C = "پنج";
                break;
            case 6:
                C = "شش";
                break;
            case 7:
                C = "هفت";
                break;
            case 8:
                C = "هشت";
                break;
            case 9:
                C = "نه";
                break;
            default:
                C = "";
        }
    }

    const resultArray = [];

    if (A) {
        resultArray.push(A);
    }
    if (B) {
        resultArray.push(B);
    }
    if (C) {
        resultArray.push(C);
    }

    const result = resultArray.join(" و ");

    return result;

}

export const rialsToLettersToman = (number: number) => {
    const n = number / 10;
    if (n < 1) {
        return 0;
    }
    if (n >= 1000000000) {
        return numberWithCommas(n) + " تومان";
    }

    const milions = Math.floor(n / 1000000);
    const milionRemained = n % 1000000;
    const thousands = Math.floor(milionRemained / 1000);
    const thousandRemained = milionRemained % 1000;

    const Milions = milions ? number3digitsToLeters(milions) + " میلیون " : "";
    const Thousands = thousands ? number3digitsToLeters(thousands) + " هزار " : "";
    const ThousandRemained = thousandRemained ? number3digitsToLeters(thousandRemained) : "";

    const resultArray = [];

    if (Milions) {
        resultArray.push(Milions);
    }
    if (Thousands) {
        resultArray.push(Thousands);
    }
    if (ThousandRemained) {
        resultArray.push(ThousandRemained);
    }
    const result = resultArray.join(" و ");

    return (result + " تومان");
}


export const dateDiplayFormat = ({ date, format, locale }: { date: string; format?: "weekDayNumber" | "m" | "d" | "HH:mm" | "dd mm" | "ddd dd mm" | "ddd dd mm yyyy" | "dd mm yyyy" | "yyyy/mm/dd" | "YYYY-MM-DD" | "yyyy/mm/dd h:m", locale?: string }): string => {

    if (!date) return "";

    const dateObject = new Date(date);
    const day = dateObject.toLocaleString(locale, { day: "numeric" });
    const weekDay = dateObject.toLocaleString(locale, { weekday: 'short' });
    const weekDayNumber = dateObject.getDay();
    const month = dateObject.toLocaleString(locale, { month: "long" });
    const day2digit = dateObject.toLocaleString(locale, { day: "2-digit" })
    const month2digit = dateObject.toLocaleString(locale, { month: "2-digit" });
    const year = dateObject.toLocaleString(locale, { year: "numeric" });

    let h = dateObject.getHours().toString().padStart(2, '0');
    let m = dateObject.getMinutes().toString().padStart(2, '0');

    if (format === "HH:mm") {
        const h = dateObject.toLocaleString(locale, { hour: "2-digit" }).padStart(2, '0');
        const m = dateObject.toLocaleString(locale, { minute: "2-digit" }).padStart(2, '0');
        return (h + ":" + m);
    }

    if (format === "ddd dd mm") {
        return (`${weekDay} ${day} ${month}`)
    }

    if (format === "dd mm yyyy") {
        return (`${day} ${month} ${year}`)
    }

    if (format === "yyyy/mm/dd") {
        return (`${year}/${month2digit}/${day2digit}`)
    }
    if (format === "YYYY-MM-DD") {
        return (`${year}-${month2digit}-${day2digit}`)
    }

    if (format === "yyyy/mm/dd h:m") {
        return (`${year}/${month2digit}/${day2digit} - ${h}:${m}`)
    }

    if (format === "dd mm") {
        return (`${day} ${month}`)
    }
    if (format === "d") {
        return (day2digit)
    }
    if (format === "m") {
        return (month)
    }

    if (format === "weekDayNumber") {
        return weekDayNumber.toString()
    }

    if (format === "ddd dd mm yyyy") {
        return (`${weekDay} ${day} ${month} ${year}`)
    }

    return date;
}

export const dateFormat = (date: Date) => {

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`
}

export const addSomeDays = (date: Date, increment: number = 1) => {

    const newDate = new Date(date.getTime() + increment * 24 * 60 * 60 * 1000)

    return newDate;
}

export const goBackYears = (date: Date, years: number = 1) => {

    const newDate = new Date(date.getTime() - years * 365.25 * 24 * 60 * 60 * 1000);

    return newDate;
}

export const getDatesDiff = (a: Date, b: Date, unit?: "seconds") => {

    if (unit && unit === "seconds") {
        var seconds = (b.getTime() - a.getTime()) / 1000;
        return Math.floor(seconds);
    }

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utca = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utcb = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.abs(Math.floor((utcb - utca) / _MS_PER_DAY));
}

export const checkDateIsAfterDate = (a: Date, b: Date) => {
    if (b.getTime() > a.getTime()) {
        return false;
    }
    return true;
}

export const persianNumbersToEnglish = (number: string) => {

    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

    if (typeof number === 'string') {
        for (var i = 0; i < 10; i++) {
            number = number.replace(persianNumbers[i], i.toString()).replace(arabicNumbers[i], i.toString());
        }
    }
    return number;
}

export const shamsiToMiladi = (j_y: number, j_m: number, j_d: number) => {

    const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

    var jy = j_y - 979;
    var jm = j_m - 1;
    var jd = j_d - 1;

    var j_day_no = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor((jy % 33 + 3) / 4);
    for (var i = 0; i < jm; ++i) j_day_no += j_days_in_month[i];

    j_day_no += jd;

    var g_day_no = j_day_no + 79;

    var gy = 1600 + 400 * Math.floor(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
    g_day_no = g_day_no % 146097;

    var leap = true;
    if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
        g_day_no--;
        gy += 100 * Math.floor(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
        g_day_no = g_day_no % 36524;

        if (g_day_no >= 365) g_day_no++;
        else leap = false;
    }

    gy += 4 * Math.floor(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
    g_day_no %= 1461;

    if (g_day_no >= 366) {
        leap = false;

        g_day_no--;
        gy += Math.floor(g_day_no / 365);
        g_day_no = g_day_no % 365;
    }

    for (var i = 0; g_day_no >= g_days_in_month[i] + (i == 1 && leap ? 1 : 0); i++)
        g_day_no -= g_days_in_month[i] + (i == 1 && leap ? 1 : 0);

    let gm = (i + 1).toString().padStart(2, '0');
    let gd = (g_day_no + 1).toString().padStart(2, '0');

    return [gy.toString(), gm, gd];

}


export const GTM_ID = process.env.GOOGLE_TAG_MANAGER_ID