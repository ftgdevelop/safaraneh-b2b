const CipRules = () => {
    const theme2 = process.env.THEME === "THEME2";
    return (
        <>
        <h2 className="text-3xl mt-20 mb-5">قوانین و مقررات</h2>
        <div className={`${theme2?"":"bg-white p-6 pt-12 pb-12 rounded-md shadow-md"}`}>
            
            <p className="font-bold">بزرگسال</p>
            <ul className="text-sm max-sm:text-xs list-disc pr-10 pl-10 max-md:pr-2 max-md:pl-2">
                <li>جریمه کنسلی از لحظه صدور تا ۲۴ ساعت مانده به پرواز: ۰ درصد</li>
                <li>جریمه کنسلی از ۲۴ ساعت مانده به پرواز تا ۸ ساعت مانده به پرواز: ۳۰ درصد</li>
                <li>جریمه کنسلی از ۸ ساعت مانده به پرواز به بعد: ۱۰۰ درصد</li>
            </ul>
            <p className="font-bold mt-5">کودک</p>
            <ul className="text-sm max-sm:text-xs list-disc pr-10 pl-10 max-md:pr-2 max-md:pl-2">
                <li>جریمه کنسلی از لحظه صدور تا ۲۴ ساعت مانده به پرواز: ۰ درصد</li>
                <li>جریمه کنسلی از ۲۴ ساعت مانده به پرواز تا ۸ ساعت مانده به پرواز: ۳۰ درصد</li>
                <li>جریمه کنسلی از ۸ ساعت مانده به پرواز تا لحظه پرواز و بعد جریمه کنسلی از آن: ۱۰۰ درصد</li>
            </ul>
            <p className="font-bold mt-5">نوزاد</p>
            <ul className="text-sm max-sm:text-xs list-disc pr-10 pl-10 max-md:pr-2 max-md:pl-2">
                <li>جریمه کنسلی از لحظه صدور تا ۲۴ ساعت مانده به پرواز: ۰ درصد</li>
                <li>جریمه کنسلی از ۲۴ ساعت مانده به پرواز تا ۸ ساعت مانده به پرواز: ۰ درصد</li>
                <li>جریمه کنسلی از ۸ ساعت مانده به پرواز تا لحظه پرواز و بعد جریمه کنسلی از آن: ۰ درصد</li>
            </ul>
            </div>
        </>
    )
}

export default CipRules;