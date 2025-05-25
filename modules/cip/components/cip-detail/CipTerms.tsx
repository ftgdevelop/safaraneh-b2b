const CipTerms: React.FC = () => {

    const ruleItems = [
        {
            title: "بزرگسال",
            items: [
                "جریمه کنسلی از لحظه صدور تا ۲۴ ساعت مانده به پرواز: ۰ درصد",
                "جریمه کنسلی از ۲۴ ساعت مانده به پرواز تا ۸ ساعت مانده به پرواز: ۳۰ درصد",
                "جریمه کنسلی از ۸ ساعت مانده به پرواز به بعد: ۱۰۰ درصد"
            ]
        },
        {
            title: "کودک",
            items: [
                "جریمه کنسلی از لحظه صدور تا ۲۴ ساعت مانده به پرواز: ۰ درصد",
                "جریمه کنسلی از ۲۴ ساعت مانده به پرواز تا ۸ ساعت مانده به پرواز: ۳۰ درصد",
                "جریمه کنسلی از ۸ ساعت مانده به پرواز تا لحظه پرواز و بعد جریمه کنسلی از آن: ۱۰۰ درصد"
            ]
        },
        {
            title: "نوزاد",
            items: [
                "جریمه کنسلی از لحظه صدور تا ۲۴ ساعت مانده به پرواز: ۰ درصد",
                "جریمه کنسلی از ۲۴ ساعت مانده به پرواز تا ۸ ساعت مانده به پرواز: ۰ درصد",
                "جریمه کنسلی از ۸ ساعت مانده به پرواز تا لحظه پرواز و بعد جریمه کنسلی از آن: ۰ درصد"
            ]
        }
    ];

    const theme2 = process.env.THEME === "THEME2";

    return (
        <div className='py-2 md:py-5'>
            <strong className="block font-semibold text-lg mb-5"> قوانین و مقررات  </strong>

            <div className={`inserted-content text-sm leading-4 ${theme2?"py-5":"bg-white rounded-lg border border-neutral-300 p-5"}`}>
                {ruleItems.map(ruleItem => (
                    <div key={ruleItem.title} className="mb-8">
                        <b className="font-semibold block mb-5"> {ruleItem.title} </b>
                        <ul className="rtl:pr-7 ltr:pl-7">
                            {ruleItem.items.map((item, index) => (
                                <li key={index}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CipTerms;